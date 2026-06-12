#!/usr/bin/env node
/**
 * quality-eval — entry point for forge-app-design generated projects.
 *
 * Three levels:
 *   L1 grep   — known bad patterns (placeholder, wrong import, empty handlers, etc.)
 *   L2 narrow — targeted prop/usage checks (enhanced regex, no AST dep in v0)
 *   L3 build  — ./node_modules/.bin/next build (skip with --skip-build)
 *
 * Output (both written into <target>/ by default, or --report-dir when set):
 *   quality-report.json — full machine-readable report (used by repair loop)
 *   quality-report.md   — human/LLM-readable report with repair hints
 *
 * Exit code: 0 if critical === 0, else 1.
 *
 * Usage:
 *   node quality-eval.mjs --target <dir> [--skip-build] [--report-dir <dir>] [--json]
 */

import { parseArgs } from 'node:util'
import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

import { checkL1Grep } from './checks/l1-grep.mjs'
import { checkL2Ast } from './checks/l2-ast.mjs'
import { checkIaGate } from './checks/ia-gate.mjs'
import { checkL3Build } from './checks/l3-build.mjs'

const { values } = parseArgs({
  options: {
    target: { type: 'string' },
    'skip-build': { type: 'boolean', default: false },
    'report-dir': { type: 'string' },
    'strict-ia': { type: 'boolean', default: false },
    json: { type: 'boolean', default: false },
  },
})

if (!values.target) {
  process.stderr.write('Usage: quality-eval.mjs --target <dir> [--skip-build] [--report-dir <dir>] [--json]\n')
  process.exit(2)
}

const target = resolve(values.target)
const reportDir = values['report-dir'] ? resolve(values['report-dir']) : target

function walk(dir, exts = ['.tsx', '.ts']) {
  const out = []
  let entries
  try { entries = readdirSync(dir) } catch { return out }
  for (const name of entries) {
    if (name === 'node_modules' || name === '.next' || name === '.git') continue
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) out.push(...walk(full, exts))
    else if (exts.includes(extname(name))) out.push(full)
  }
  return out
}

const files = walk(target)

const checks = []
checks.push(...checkL1Grep(target, files))
checks.push(...checkL2Ast(target, files))
checks.push(...checkIaGate(target, files, { strict: values['strict-ia'] }))
if (!values['skip-build']) {
  checks.push(...(await checkL3Build(target)))
}

const summary = {
  critical: checks.filter(c => c.status === 'critical').length,
  warn: checks.filter(c => c.status === 'warn').length,
  passed: checks.filter(c => c.status === 'pass').length,
}

const report = {
  target,
  reportDir,
  timestamp: new Date().toISOString(),
  summary,
  checks,
}

mkdirSync(reportDir, { recursive: true })

const jsonPath = join(reportDir, 'quality-report.json')
const mdPath = join(reportDir, 'quality-report.md')

writeFileSync(jsonPath, JSON.stringify(report, null, 2))
writeFileSync(mdPath, renderMarkdown(report))

if (values.json) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n')
} else {
  process.stdout.write(`\nQuality eval: ${target}\n`)
  process.stdout.write(`Summary: ${summary.critical} critical, ${summary.warn} warn, ${summary.passed} passed\n\n`)
  for (const c of checks) {
    const icon = c.status === 'critical' ? '[X]' : c.status === 'warn' ? '[!]' : '[OK]'
    process.stdout.write(`${icon} [${c.level}] ${c.name}`)
    if (c.description) process.stdout.write(` — ${c.description}`)
    if (c.files?.length) {
      for (const f of c.files.slice(0, 5)) {
        process.stdout.write(`\n     ${f}`)
      }
      if (c.files.length > 5) process.stdout.write(`\n     ... +${c.files.length - 5} more`)
    }
    process.stdout.write('\n')
  }
  process.stdout.write(`\nReports:\n  ${jsonPath}\n  ${mdPath}\n`)
}

process.exitCode = summary.critical > 0 ? 1 : 0

// ─── Markdown renderer (consumed by repair loop) ─────────────────────────────

function renderMarkdown(report) {
  const { target, timestamp, summary, checks } = report
  const critical = checks.filter(c => c.status === 'critical')
  const warns = checks.filter(c => c.status === 'warn')
  const passed = checks.filter(c => c.status === 'pass')

  const lines = []
  lines.push(`# Quality Report`)
  lines.push(``)
  lines.push(`- **Target:** \`${target}\``)
  lines.push(`- **Generated:** ${timestamp}`)
  lines.push(`- **Summary:** ${summary.critical} critical, ${summary.warn} warn, ${summary.passed} passed`)
  lines.push(``)

  if (critical.length > 0) {
    lines.push(`## Critical (must fix before delivery)`)
    lines.push(``)
    for (const c of critical) {
      lines.push(`### ${c.name} [${c.level}]`)
      lines.push(`- **Issue:** ${c.description}`)
      if (c.files?.length) {
        lines.push(`- **Locations:**`)
        for (const f of c.files) lines.push(`  - \`${f}\``)
      }
      if (c.stderr_tail) {
        lines.push(`- **Stderr tail:**`)
        lines.push('  ```')
        for (const ln of c.stderr_tail.split('\n')) lines.push(`  ${ln}`)
        lines.push('  ```')
      }
      if (c.repairHint) {
        lines.push(`- **Repair:** ${c.repairHint}`)
      }
      lines.push(``)
    }
  }

  if (warns.length > 0) {
    lines.push(`## Warnings (consider fixing)`)
    lines.push(``)
    for (const c of warns) {
      lines.push(`### ${c.name} [${c.level}]`)
      lines.push(`- **Issue:** ${c.description}`)
      if (c.files?.length) {
        lines.push(`- **Locations:**`)
        for (const f of c.files) lines.push(`  - \`${f}\``)
      }
      if (c.repairHint) {
        lines.push(`- **Repair:** ${c.repairHint}`)
      }
      lines.push(``)
    }
  }

  lines.push(`## Passed (${passed.length} checks)`)
  lines.push(``)
  const byLevel = {}
  for (const c of passed) {
    if (!byLevel[c.level]) byLevel[c.level] = []
    byLevel[c.level].push(c.name)
  }
  for (const lvl of Object.keys(byLevel).sort()) {
    lines.push(`- **${lvl}:** ${byLevel[lvl].join(', ')}`)
  }
  lines.push(``)

  lines.push(`---`)
  lines.push(``)
  lines.push(`## Next step`)
  lines.push(``)
  if (summary.critical > 0) {
    lines.push(`Critical issues remain — apply each **Repair** hint above, then re-run:`)
    lines.push(`\`\`\``)
    const reportArg = report.reportDir && report.reportDir !== target ? ` --report-dir ${report.reportDir}` : ''
    lines.push(`node $FORGE_APP_DESIGN_ROOT/eval/quality-eval.mjs --target ${target}${reportArg}`)
    lines.push(`\`\`\``)
  } else {
    lines.push(`No critical issues. Project is ready to start dev server.`)
  }
  return lines.join('\n') + '\n'
}
