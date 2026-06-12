#!/usr/bin/env node
/**
 * Repair-loop validation for injected criticals.
 *
 * This does not try to be a general code fixer. It verifies that the known
 * quality-eval criticals used by the skill have actionable, surgical repair
 * paths and can converge to critical=0 within the Step 6 retry budget.
 */

import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { parseArgs } from 'node:util'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const qualityEval = join(__dirname, 'quality-eval.mjs')

let values

function main() {
;({ values } = parseArgs({
  options: {
    fixture: { type: 'string', default: 'clean-app' },
    'max-rounds': { type: 'string', default: '3' },
    'include-build': { type: 'boolean', default: false },
    cleanup: { type: 'boolean', default: false },
    json: { type: 'boolean', default: false },
  },
}))

const sourceFixture = join(__dirname, 'fixtures', values.fixture)
if (!existsSync(sourceFixture)) {
  process.stderr.write(`Fixture not found: ${sourceFixture}\n`)
  process.exit(2)
}

const maxRounds = Number.parseInt(values['max-rounds'], 10)
if (!Number.isInteger(maxRounds) || maxRounds < 1) {
  process.stderr.write('--max-rounds must be a positive integer\n')
  process.exit(2)
}

const target = mkdtempSync(join(tmpdir(), 'spec-to-forge-repair-loop-'))
cpSync(sourceFixture, target, {
  recursive: true,
  filter: src => !/quality-report\.(json|md)$/.test(src),
})

injectCriticals(target)

const rounds = []
let current = runQualityEval(target)
const initialCritical = current.summary.critical
const initialCriticalNames = criticalNames(current)

for (let round = 1; round <= maxRounds && current.summary.critical > 0; round += 1) {
  const before = criticalNames(current)
  const repairResult = applyRepairs(target, current)
  current = runQualityEval(target)
  rounds.push({
    round,
    before,
    repaired: repairResult.repaired,
    unsupported: repairResult.unsupported,
    after: criticalNames(current),
    afterSummary: current.summary,
  })
  if (repairResult.unsupported.length > 0) break
}

const finalReport = current
const pass = initialCritical > 0 && finalReport.summary.critical === 0 && rounds.every(item => item.unsupported.length === 0)
const report = {
  timestamp: new Date().toISOString(),
  fixture: values.fixture,
  target,
  sourceOnly: !values['include-build'],
  maxRounds,
  pass,
  initial: {
    critical: initialCritical,
    criticalNames: initialCriticalNames,
  },
  final: {
    summary: finalReport.summary,
    criticalNames: criticalNames(finalReport),
  },
  rounds,
  cleanup: Boolean(values.cleanup),
}

const jsonPath = join(__dirname, 'repair-loop-report.json')
const mdPath = join(__dirname, 'repair-loop-report.md')
writeFileSync(jsonPath, JSON.stringify(report, null, 2))
writeFileSync(mdPath, renderMarkdown(report))

if (values.cleanup) {
  rmSync(target, { recursive: true, force: true })
}

if (values.json) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n')
} else {
  process.stdout.write(`Repair loop validation: ${pass ? 'passed' : 'failed'}\n`)
  process.stdout.write(`Initial critical: ${initialCritical}\n`)
  process.stdout.write(`Final critical: ${finalReport.summary.critical}\n`)
  process.stdout.write(`Rounds: ${rounds.length}/${maxRounds}\n`)
  process.stdout.write(`Reports:\n  ${jsonPath}\n  ${mdPath}\n`)
  if (!values.cleanup) process.stdout.write(`Temp target kept for inspection:\n  ${target}\n`)
}

process.exit(pass ? 0 : 1)
}

function injectCriticals(root) {
  const appDir = join(root, 'app')
  mkdirSync(appDir, { recursive: true })
  writeFileSync(join(appDir, 'page.tsx'), `'use client'

import { PageHeader, DataTable, StatCard, StatusBadge } from '@forge-ui/table'

type Row = { id: string; name: string; status: string }

const rows: Row[] = [
  { id: '1', name: 'Acme Inc', status: 'active' },
  { id: '2', name: 'Beta Co', status: 'paused' },
]

export default function Page() {
  return (
    <main className="p-8 max-w-[1600px] mx-auto">
      <PageHeader variant="search" title="Customers" subtitle="120 total" />

      <button onClick={() => {}}>Export</button>

      <div className="grid grid-cols-3 gap-4 my-6">
        <StatCard label="Total" value={120} theme="purple" size="md" />
        <StatCard title="Active" value="98" theme="green" />
        <StatCard title="Churned" value="22" theme="red" />
      </div>

      <DataTable
        data={rows}
        columns={[
          { key: 'name', label: 'Name', render: (r: Row) => r.name },
          {
            key: 'status',
            label: 'Status',
            render: (r: Row) => <StatusBadge color="green">{r.status}</StatusBadge>,
          },
        ]}
      />
    </main>
  )
}
`)
}

function runQualityEval(root) {
  const args = [qualityEval, '--target', root, '--json']
  if (!values['include-build']) args.push('--skip-build')
  const res = spawnSync(process.execPath, args, { encoding: 'utf8' })
  try {
    return JSON.parse(res.stdout)
  } catch (error) {
    throw new Error(`quality-eval did not return JSON: ${error.message}; exit=${res.status}; stderr=${res.stderr.slice(0, 500)}`)
  }
}

function criticalNames(report) {
  return report.checks
    .filter(check => check.status === 'critical')
    .map(check => check.name)
}

function applyRepairs(root, report) {
  const repaired = []
  const unsupported = []
  for (const check of report.checks.filter(item => item.status === 'critical')) {
    const repair = REPAIRERS[check.name]
    if (!repair) {
      unsupported.push(check.name)
      continue
    }
    repair(root)
    repaired.push(check.name)
  }
  return { repaired, unsupported }
}

const REPAIRERS = {
  'wrong-forge-import': root => replaceInSources(root, content =>
    content.replace(/from\s+['"]@forge-ui\/[^'"]+['"]/g, "from '@forge-ui-official/core'")
  ),
  'empty-onclick': root => replaceInSources(root, content =>
    content.replace(/\s+onClick=\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}/g, '')
  ),
  'pageheader-search-variant': root => replaceInSources(root, content =>
    content.replace(/(<PageHeader\b[^>]*?)\svariant=["']search["']/g, '$1')
  ),
  'datatable-data-prop': root => replaceInSources(root, content =>
    content.replace(/(<DataTable\b[\s\S]*?)\bdata=/g, '$1rows=')
  ),
  'main-container-max-w': root => replaceInSources(root, content =>
    content.replace(/(<main\b[^>]*className=["'][^"']*)\smax-w-\[[^\] ]+\]\s*([^"']*["'])/g, '$1 $2')
      .replace(/(<main\b[^>]*className=["'][^"']*)\smx-auto\b\s*([^"']*["'])/g, '$1 $2')
      .replace(/className=["']([^"']*\bp-8\b[^"']*)["']/g, (_match, cls) => `className="${normalizeClassName(cls)}"`)
  ),
  'statcard-bad-size': root => replaceInSources(root, content =>
    content.replace(/(<StatCard\b[^>]*\ssize=)["'](?:xs|md|xl)["']/g, '$1"sm"')
  ),
  'statcard-label-prop': root => replaceInSources(root, content =>
    content.replace(/(<StatCard\b[^>]*\s)label=/g, '$1title=')
  ),
  'statcard-numeric-value': root => replaceInSources(root, content =>
    content.replace(/(<StatCard\b[^>]*\svalue=)\{\s*(-?\d+(?:\.\d+)?)\s*\}/g, '$1"$2"')
  ),
  'datatable-column-label': root => replaceInSources(root, content =>
    content.replace(/\blabel\s*:/g, 'header:')
  ),
  'statusbadge-uses-children': root => replaceInSources(root, content =>
    content.replace(/<StatusBadge\b([^>]*)>([^<{}]+)<\/StatusBadge>/g, (_match, attrs, label) =>
      `<StatusBadge label="${label.trim()}"${attrs} />`
    )
  ),
}

function replaceInSources(root, replacer) {
  for (const file of walk(root)) {
    const before = readFileSync(file, 'utf8')
    const after = replacer(before, file)
    if (after !== before) writeFileSync(file, after)
  }
}

function walk(root) {
  const out = []
  if (!existsSync(root)) return out
  for (const name of readdirSync(root)) {
    if (name === 'node_modules' || name === '.next' || name === '.git') continue
    const full = join(root, name)
    const stat = statSync(full)
    if (stat.isDirectory()) out.push(...walk(full))
    else if (['.ts', '.tsx'].includes(extname(name))) out.push(full)
  }
  return out
}

function normalizeClassName(value) {
  const tokens = value.split(/\s+/).filter(Boolean)
  const unique = [...new Set(tokens)]
  if (!unique.includes('w-full')) unique.push('w-full')
  return unique.join(' ')
}

function renderMarkdown(data) {
  const lines = []
  lines.push('# Repair Loop Validation Report')
  lines.push('')
  lines.push(`- Generated: ${data.timestamp}`)
  lines.push(`- Fixture: \`${data.fixture}\``)
  lines.push(`- Temp target: \`${data.target}\``)
  lines.push(`- Mode: ${data.sourceOnly ? 'source checks only (--skip-build)' : 'source checks + next build'}`)
  lines.push(`- Result: ${data.pass ? 'PASS' : 'FAIL'}`)
  lines.push(`- Initial critical: ${data.initial.critical}`)
  lines.push(`- Final critical: ${data.final.summary.critical}`)
  lines.push(`- Repair rounds: ${data.rounds.length}/${data.maxRounds}`)
  lines.push('')
  lines.push('## Initial criticals')
  lines.push('')
  for (const name of data.initial.criticalNames) lines.push(`- ${name}`)
  lines.push('')
  lines.push('## Rounds')
  lines.push('')
  for (const round of data.rounds) {
    lines.push(`### Round ${round.round}`)
    lines.push(`- Before: ${round.before.join(', ') || 'none'}`)
    lines.push(`- Repaired: ${round.repaired.join(', ') || 'none'}`)
    lines.push(`- Unsupported: ${round.unsupported.join(', ') || 'none'}`)
    lines.push(`- After critical: ${round.afterSummary.critical}`)
    if (round.after.length) lines.push(`- Remaining: ${round.after.join(', ')}`)
    lines.push('')
  }
  lines.push('## Re-run')
  lines.push('')
  lines.push('```bash')
  lines.push('node $FORGE_APP_DESIGN_ROOT/eval/repair-loop-validate.mjs')
  lines.push('```')
  lines.push('')
  return lines.join('\n')
}

main()
