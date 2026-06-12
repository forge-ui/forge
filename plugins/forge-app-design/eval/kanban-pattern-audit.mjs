#!/usr/bin/env node
/**
 * Static promotion gate for kanban-workflow-protask.
 *
 * This does not replace fresh browser screenshots. It protects the promoted
 * pattern contract from drifting back into a supporting/read-only route.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginRoot = dirname(__dirname)

const { values } = parseArgs({
  options: {
    'report-dir': { type: 'string' },
    json: { type: 'boolean', default: false },
  },
})

const reportDir = values['report-dir'] ? resolve(values['report-dir']) : __dirname
const report = audit()

mkdirSync(reportDir, { recursive: true })
const jsonPath = join(reportDir, 'kanban-pattern-report.json')
const mdPath = join(reportDir, 'kanban-pattern-report.md')
writeFileSync(jsonPath, JSON.stringify(report, null, 2))
writeFileSync(mdPath, renderMarkdown(report))

if (values.json) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n')
} else {
  process.stdout.write(`Kanban pattern audit: ${report.summary.passed}/${report.summary.total} passed\n`)
  for (const check of report.checks) {
    process.stdout.write(`${check.pass ? '[OK]' : '[X]'} ${check.name}\n`)
    if (check.detail) process.stdout.write(`    - ${check.detail}\n`)
  }
  process.stdout.write(`Reports:\n  ${jsonPath}\n  ${mdPath}\n`)
}

process.exit(report.pass ? 0 : 1)

function audit() {
  const checks = []
  const sampleDir = join(pluginRoot, 'samples/kanban-workflow-protask')
  const legacyDir = join(pluginRoot, 'samples/kanban-status-workflow')
  const readme = read(join(sampleDir, 'README.md'))
  const brief = read(join(sampleDir, 'BRIEF.md'))
  const pagePattern = readJson(join(pluginRoot, 'samples/page-patterns/kanban-workflow-protask.json'))
  const ia = readJson(join(pluginRoot, 'samples/ia/kanban-workflow-protask.json'))
  const browserCases = readJson(join(pluginRoot, 'eval/browser-cases.json'))
  const readonlyFixture = read(join(pluginRoot, 'eval/fixtures/bad-kanban-readonly/app/workflow-board/page.tsx'))
  const tableFixture = read(join(pluginRoot, 'eval/fixtures/bad-kanban-as-table/app/workflow-board/page.tsx'))

  checks.push(check('canonical sample folder exists', existsSync(sampleDir)))
  checks.push(check('legacy folder is alias-only', /Legacy alias/i.test(read(join(legacyDir, 'README.md'))) && existsSync(join(legacyDir, 'page.tsx'))))
  checks.push(check('README has promoted selection hard conditions', [
    /3 or more mutually exclusive states/i,
    /direct write action/i,
    /diagnostic or detail link/i,
    /10-500/i,
    /prefer `rich-entity-list-protask`/i,
  ].every(pattern => pattern.test(readme))))
  checks.push(check('BRIEF contains complete Page Intent Spec fields', [
    /user_goal:/,
    /primary_decision:/,
    /primary_action:/,
    /secondary_context:/,
    /component_plan:/,
  ].every(pattern => pattern.test(brief))))
  checks.push(check('page-pattern references canonical sample', (pagePattern.sourceReferences ?? []).includes('$FORGE_APP_DESIGN_ROOT/samples/kanban-workflow-protask')))
  checks.push(check('page-pattern has visible screenshot contract', (pagePattern.patterns?.[0]?.requiredVisibleText ?? []).length >= 3))
  checks.push(check('IA references canonical sample', (ia.source?.references ?? []).includes('$FORGE_APP_DESIGN_ROOT/samples/kanban-workflow-protask')))
  checks.push(check('IA keeps anti-patterns for readonly/table regression', ['read-only-kanban', 'board-as-table-replacement'].every(id => (ia.antiPatterns ?? []).some(item => item.id === id))))
  checks.push(check('browser C9 asserts first viewport lane/action/link', hasC9VisibleText(browserCases)))
  checks.push(check('readonly bad fixture lacks actions and links', !/Button|onClick|handle[A-Z]|StyledLink|href=/.test(readonlyFixture)))
  checks.push(check('table bad fixture is table-shaped, not kanban-shaped', /DataTable/.test(tableFixture) && !/KanbanColumn|TaskCard|StatusStrip/.test(tableFixture)))

  return {
    timestamp: new Date().toISOString(),
    summary: {
      total: checks.length,
      passed: checks.filter(item => item.pass).length,
      failed: checks.filter(item => !item.pass).length,
    },
    pass: checks.every(item => item.pass),
    checks,
  }
}

function hasC9VisibleText(config) {
  const c9 = (config.cases ?? []).find(item => item.id === 'C9')
  const visible = c9?.requiredVisibleText ?? []
  return visible.length >= 3 && /advance|run|approve|reject/i.test(visible.join(' ')) && /issue|diagnostic|detail|error/i.test(visible.join(' '))
}

function check(name, pass, detail = '') {
  return { name, pass: Boolean(pass), detail }
}

function read(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : ''
}

function readJson(path) {
  try {
    return JSON.parse(read(path))
  } catch {
    return {}
  }
}

function renderMarkdown(report) {
  const lines = []
  lines.push('# Kanban Pattern Audit')
  lines.push('')
  lines.push(`- Generated: ${report.timestamp}`)
  lines.push(`- Summary: ${report.summary.passed}/${report.summary.total} passed`)
  lines.push('')
  for (const check of report.checks) {
    lines.push(`- ${check.pass ? '[OK]' : '[FAIL]'} ${check.name}`)
    if (check.detail) lines.push(`  - ${check.detail}`)
  }
  lines.push('')
  return lines.join('\n')
}
