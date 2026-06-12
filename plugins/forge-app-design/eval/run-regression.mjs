#!/usr/bin/env node
/**
 * Regression harness for generated forge-app-design outputs.
 *
 * Runs quality-eval on representative PRD outputs, then verifies structural
 * invariants that quality-eval intentionally does not know about.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { resolveCaseTargets, targetExists } from './lib/resolve-case.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultConfig = join(__dirname, 'regression-cases.json')
const qualityEval = join(__dirname, 'quality-eval.mjs')

const { values } = parseArgs({
  options: {
    config: { type: 'string', default: defaultConfig },
    case: { type: 'string' },
    'skip-build': { type: 'boolean', default: false },
    'external-build-report': { type: 'string' },
    'report-dir': { type: 'string' },
    json: { type: 'boolean', default: false },
  },
})

const configPath = resolve(values.config)
const reportDir = values['report-dir'] ? resolve(values['report-dir']) : __dirname
const externalBuildReportPath = values['external-build-report'] ? resolve(values['external-build-report']) : null
const externalBuildReport = externalBuildReportPath ? readJson(externalBuildReportPath) : null
const config = resolveCaseTargets(JSON.parse(readFileSync(configPath, 'utf8')), configPath)
const selected = values.case
  ? config.cases.filter(item => item.id === values.case)
  : config.cases

if (selected.length === 0) {
  process.stderr.write(`No regression case matched: ${values.case}\n`)
  process.exit(2)
}

const results = selected.map(runCase)
const summary = {
  total: results.length,
  passed: results.filter(item => item.pass && !item.skipped).length,
  skipped: results.filter(item => item.skipped).length,
  failed: results.filter(item => !item.pass).length,
}

const report = {
  timestamp: new Date().toISOString(),
  config: configPath,
  reportDir,
  externalBuildReport: externalBuildReportPath,
  skipBuild: Boolean(values['skip-build']),
  summary,
  cases: results,
}

mkdirSync(reportDir, { recursive: true })

const jsonPath = join(reportDir, 'regression-report.json')
const mdPath = join(reportDir, 'regression-report.md')
writeFileSync(jsonPath, JSON.stringify(report, null, 2))
writeFileSync(mdPath, renderMarkdown(report))

if (values.json) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n')
} else {
  process.stdout.write(`Regression: ${summary.passed}/${summary.total} passed`)
  if (summary.skipped > 0) process.stdout.write(` (${summary.skipped} skipped)`)
  process.stdout.write('\n')
  for (const item of results) {
    const mark = item.skipped ? '[SKIP]' : item.pass ? '[OK]' : '[X]'
    process.stdout.write(`${mark} ${item.id}: score=${item.score ?? 'n/a'}, critical=${item.quality?.summary?.critical ?? 'n/a'}, warn=${item.quality?.summary?.warn ?? 'n/a'}\n`)
    for (const issue of item.issues) process.stdout.write(`    - ${issue}\n`)
  }
  process.stdout.write(`Reports:\n  ${jsonPath}\n  ${mdPath}\n`)
}

process.exit(summary.failed > 0 ? 1 : 0)

function runCase(item) {
  const target = item.target
  const issues = []
  let quality = null

  if (!targetExists(target)) {
    const issue = `target missing: ${target}`
    if (item.allowMissing) return skippedResult(item, issue)
    issues.push(issue)
  } else {
    quality = runQualityEval(target)
    if (!quality.ok) {
      issues.push(`quality-eval failed to run: ${quality.error}`)
    } else {
      const critical = quality.report.summary.critical
      const warn = quality.report.summary.warn
      if (critical > item.maxCritical) issues.push(`critical ${critical} > allowed ${item.maxCritical}`)
      if (warn > item.maxWarn) issues.push(`warn ${warn} > allowed ${item.maxWarn}`)
    }

    for (const file of item.requiredFiles ?? []) {
      if (!existsSync(join(target, file))) issues.push(`required file missing: ${file}`)
    }

    const pageFiles = walk(target).filter(file => /\/app\/.*\/?page\.tsx$/.test(file))
    const componentFiles = walk(join(target, 'app')).filter(file => /\/_components\/.*\.tsx$/.test(file))

    if (pageFiles.length < item.minPageFiles) {
      issues.push(`page files ${pageFiles.length} < required ${item.minPageFiles}`)
    }
    if (componentFiles.length < item.minComponentFiles) {
      issues.push(`component files ${componentFiles.length} < required ${item.minComponentFiles}`)
    }

    for (const check of item.requiredText ?? []) {
      const filePath = join(target, check.file)
      if (!existsSync(filePath)) continue
      const content = readFileSync(filePath, 'utf8')
      for (const rawPattern of check.patterns) {
        const pattern = new RegExp(rawPattern)
        if (!pattern.test(content)) issues.push(`pattern not found in ${check.file}: ${rawPattern}`)
      }
    }
  }

  const score = scoreCase(issues, quality?.report)
  return {
    id: item.id,
    label: item.label,
    target,
    rawTarget: item.rawTarget,
    pass: issues.length === 0,
    score,
    issues,
    notes: item.notes,
    quality: quality?.report
      ? {
          summary: quality.report.summary,
          failedChecks: quality.report.checks
            .filter(check => check.status !== 'pass')
            .map(check => ({
              level: check.level,
              name: check.name,
              status: check.status,
              files: check.files ?? [],
            })),
        }
      : null,
  }
}

function skippedResult(item, issue) {
  return {
    id: item.id,
    label: item.label,
    target: item.target,
    rawTarget: item.rawTarget,
    pass: true,
    skipped: true,
    score: null,
    issues: [issue],
    notes: item.notes,
    quality: null,
  }
}

function runQualityEval(target) {
  const caseReportDir = join(reportDir, 'quality', slug(target))
  const externalBuild = externalBuildFor(target)
  const args = [qualityEval, '--target', target, '--report-dir', caseReportDir, '--json']
  if (values['skip-build'] || externalBuild) args.splice(3, 0, '--skip-build')
  const res = spawnSync(process.execPath, args, { encoding: 'utf8' })
  try {
    const report = JSON.parse(res.stdout)
    if (externalBuild) attachExternalBuild(report, externalBuild)
    return { ok: true, report }
  } catch (error) {
    return {
      ok: false,
      error: `${error.message}; exit=${res.status}; stderr=${res.stderr.slice(0, 500)}`,
    }
  }
}

function externalBuildFor(target) {
  if (!externalBuildReport) return null
  return externalBuildReport.targets?.[target] ?? null
}

function attachExternalBuild(report, externalBuild) {
  const pass = externalBuild.pass === true
  report.checks.push({
    level: 'L3',
    name: 'next-build',
    description: pass
      ? `next build succeeded via external command: ${externalBuild.command ?? 'next build'}`
      : `external next build failed: ${externalBuild.command ?? 'next build'}`,
    status: pass ? 'pass' : 'critical',
    files: [],
    duration_ms: externalBuild.duration_ms,
    stderr_tail: externalBuild.stderr_tail,
    repairHint: pass ? undefined : 'Read the external build log and fix the specific compile error.',
  })
  report.summary = {
    critical: report.checks.filter(c => c.status === 'critical').length,
    warn: report.checks.filter(c => c.status === 'warn').length,
    passed: report.checks.filter(c => c.status === 'pass').length,
  }
}

function readJson(path) {
  if (!path || !existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

function slug(value) {
  return String(value).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(-80) || 'case'
}

function walk(root) {
  const out = []
  if (!existsSync(root)) return out
  for (const name of readdirSync(root)) {
    if (name === 'node_modules' || name === '.next' || name === '.git') continue
    const full = join(root, name)
    const stat = statSync(full)
    if (stat.isDirectory()) out.push(...walk(full))
    else if (['.ts', '.tsx', '.md', '.json'].includes(extname(name))) out.push(full)
  }
  return out
}

function scoreCase(issues, report) {
  if (!report) return 0
  const critical = report.summary.critical ?? 0
  const warn = report.summary.warn ?? 0
  const structuralPenalty = issues.length * 10
  return Math.max(0, 100 - critical * 30 - warn * 5 - structuralPenalty)
}

function renderMarkdown(report) {
  const lines = []
  lines.push('# Regression Report')
  lines.push('')
  lines.push(`- Generated: ${report.timestamp}`)
  lines.push(`- Config: \`${report.config}\``)
  lines.push(`- Build mode: ${report.skipBuild ? 'source checks only (--skip-build)' : 'source checks + next build'}`)
  lines.push(`- Summary: ${report.summary.passed}/${report.summary.total} passed, ${report.summary.skipped} skipped`)
  lines.push('')

  for (const item of report.cases) {
    lines.push(`## ${item.skipped ? '[SKIP]' : item.pass ? '[OK]' : '[FAIL]'} ${item.id}`)
    lines.push('')
    lines.push(`- Label: ${item.label}`)
    lines.push(`- Target: \`${item.target}\``)
    lines.push(`- Score: ${item.score}`)
    if (item.notes) lines.push(`- Notes: ${item.notes}`)
    if (item.quality) {
      lines.push(`- Quality: ${item.quality.summary.critical} critical, ${item.quality.summary.warn} warn, ${item.quality.summary.passed} passed`)
    }
    if (item.issues.length > 0) {
      lines.push('- Issues:')
      for (const issue of item.issues) lines.push(`  - ${issue}`)
    }
    if (item.quality?.failedChecks?.length) {
      lines.push('- Non-pass checks:')
      for (const check of item.quality.failedChecks) {
        const files = check.files.length ? ` (${check.files.join(', ')})` : ''
        lines.push(`  - ${check.status}: ${check.level}/${check.name}${files}`)
      }
    }
    lines.push('')
  }

  lines.push('## Re-run')
  lines.push('')
  lines.push('```bash')
  lines.push('node $FORGE_APP_DESIGN_ROOT/eval/run-regression.mjs')
  lines.push('node $FORGE_APP_DESIGN_ROOT/eval/run-regression.mjs --skip-build')
  lines.push('```')
  lines.push('')
  return lines.join('\n')
}
