#!/usr/bin/env node
/**
 * Active goal completion check for forge-app-design v1.
 *
 * This verifies objective evidence and keeps user acceptance as an explicit
 * final gate. By default, exit 0 means "objective evidence is ready for user
 * acceptance"; use --strict to require USER-ACCEPTANCE.json as well.
 * Use --report-dir when the installed skill directory is not writable.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginRoot = join(__dirname, '..')
const target = '/Users/hesong/Desktop/output/prior-auth-ops-c12-protask'
const samplesDir = join(pluginRoot, 'samples')
const goldenDir = join(pluginRoot, 'golden-apps')

const paths = {
  forgeAudit: join(pluginRoot, 'FORGEUI-GAPS.md'),
  completionAudit: join(pluginRoot, 'HANDOFF.md'),
  regressionConfig: join(__dirname, 'regression-cases.json'),
  regressionReport: join(__dirname, 'regression-report.json'),
  browserConfig: join(__dirname, 'browser-cases.json'),
  browserReport: join(__dirname, 'browser-report.json'),
  qualityReport: join(target, 'quality-report.json'),
  productAudit: join(target, 'product-quality-report.json'),
  protaskVisualAudit: join(target, 'protask-visual-report.json'),
  acceptancePacket: join(target, 'USER-ACCEPTANCE-PACKET.md'),
  acceptanceGallery: join(target, 'USER-ACCEPTANCE-GALLERY.html'),
  acceptanceTemplate: join(target, 'USER-ACCEPTANCE.example.json'),
  acceptance: join(target, 'USER-ACCEPTANCE.json'),
}

const { values } = parseArgs({
  options: {
    acceptance: { type: 'string', default: paths.acceptance },
    'regression-report': { type: 'string' },
    'browser-report': { type: 'string' },
    'quality-report': { type: 'string' },
    'product-audit': { type: 'string' },
    'protask-visual-audit': { type: 'string' },
    'report-dir': { type: 'string' },
    strict: { type: 'boolean', default: false },
    json: { type: 'boolean', default: false },
  },
})

paths.acceptance = resolve(values.acceptance)
if (values['regression-report']) paths.regressionReport = resolve(values['regression-report'])
if (values['browser-report']) paths.browserReport = resolve(values['browser-report'])
if (values['quality-report']) paths.qualityReport = resolve(values['quality-report'])
if (values['product-audit']) paths.productAudit = resolve(values['product-audit'])
if (values['protask-visual-audit']) paths.protaskVisualAudit = resolve(values['protask-visual-audit'])
const reportDir = values['report-dir'] ? resolve(values['report-dir']) : __dirname

const report = buildReport()
mkdirSync(reportDir, { recursive: true })
const jsonPath = join(reportDir, 'goal-completion-report.json')
const mdPath = join(reportDir, 'goal-completion-report.md')
writeFileSync(jsonPath, JSON.stringify(report, null, 2))
writeFileSync(mdPath, renderMarkdown(report))

if (values.json) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n')
} else {
  process.stdout.write(`Goal completion check: evidence=${report.summary.objectiveEvidencePass ? 'pass' : 'fail'}, userAcceptance=${report.summary.userAcceptancePass ? 'pass' : 'pending'}, complete=${report.summary.complete ? 'yes' : 'no'}\n`)
  for (const check of report.checks) {
    process.stdout.write(`${label(check.status)} ${check.name}: ${check.evidence}\n`)
    for (const issue of check.issues) process.stdout.write(`    - ${issue}\n`)
  }
  process.stdout.write(`Reports:\n  ${jsonPath}\n  ${mdPath}\n`)
}

if (!report.summary.objectiveEvidencePass) process.exit(1)
if (values.strict && !report.summary.complete) process.exit(3)
process.exit(0)

function buildReport() {
  const checks = [
    checkForgeReadiness(),
    checkPatternPacks(),
    checkGoldenApps(),
    checkRegression(),
    checkBrowser(),
    checkFreshPrdProductQuality(),
    checkFreshPrdVisualDensity(),
    checkAcceptanceReviewPackage(),
    checkUserAcceptance(),
  ]
  const objectiveChecks = checks.filter(check => check.kind === 'objective')
  const userCheck = checks.find(check => check.kind === 'user')
  const objectiveEvidencePass = objectiveChecks.every(check => check.status === 'pass')
  const userAcceptancePass = userCheck?.status === 'pass'

  return {
    timestamp: new Date().toISOString(),
    objective: 'forge-app-design readdy.ai-level generation v1',
    summary: {
      objectiveEvidencePass,
      userAcceptancePass,
      complete: objectiveEvidencePass && userAcceptancePass,
      strictMode: Boolean(values.strict),
    },
    reportDir,
    reports: paths,
    checks,
  }
}

function checkForgeReadiness() {
  const issues = []
  const content = readText(paths.forgeAudit)
  if (!content) issues.push('missing FORGEUI-GAPS.md')
  for (const pattern of ['Dense app shell variants', 'Advanced table density', 'Do not add a generic `SectionCard`']) {
    if (!content.includes(pattern)) issues.push(`missing evidence text: ${pattern}`)
  }
  return check('objective', 'ForgeUI gaps ledger and primitive constraints', issues, paths.forgeAudit)
}

function checkPatternPacks() {
  const expected = [
    'kanban-status-workflow',
    'detail-triage-workflow',
    'dashboard-risk-overview',
    'settings-grouped',
    'wizard-multi-step',
    'chat-workspace',
    'protask-compound-dashboard',
    'rich-entity-list',
    'entity-detail-activity-rail',
  ]
  const actual = existsSync(samplesDir) ? new Set(readdirSync(samplesDir, { withFileTypes: true }).filter(item => item.isDirectory()).map(item => item.name)) : new Set()
  const issues = expected.filter(name => !actual.has(name)).map(name => `missing pattern pack: ${name}`)
  for (const name of expected) {
    const dir = join(samplesDir, name)
    if (!actual.has(name)) continue
    for (const requiredFile of ['README.md', 'BRIEF.md', 'page.tsx']) {
      if (!existsSync(join(dir, requiredFile))) issues.push(`${name} missing ${requiredFile}`)
    }
    const quality = readJson(join(dir, 'quality-report.json'))
    if (!quality) {
      issues.push(`${name} missing quality-report.json`)
    } else if (quality.summary?.critical !== 0 || quality.summary?.warn !== 0) {
      issues.push(`${name} source gate not clean: ${quality.summary?.critical}/${quality.summary?.warn}`)
    }
  }
  return check('objective', '9 pattern packs including Protask visual-density packs', issues, `${actual.size} directories in ${samplesDir}`)
}

function checkGoldenApps() {
  const expected = ['data-quality-control-tower.md', 'fulfillment-ops-control-tower.md', 'support-ticket-sla-center.md']
  const issues = expected.filter(name => !existsSync(join(goldenDir, name))).map(name => `missing golden app note: ${name}`)
  return check('objective', '3 golden mini-app notes', issues, goldenDir)
}

function checkRegression() {
  const report = readJson(paths.regressionReport)
  const issues = []
  if (!report) issues.push('missing or invalid regression-report.json')
  ensureFresh(paths.regressionReport, [
    paths.regressionConfig,
    join(__dirname, 'run-regression.mjs'),
    join(__dirname, 'quality-eval.mjs'),
    join(__dirname, 'checks/l1-grep.mjs'),
    join(__dirname, 'checks/l2-ast.mjs'),
    join(__dirname, 'checks/l3-build.mjs'),
    ...sourceInputs(target),
  ], issues, 'regression-report.json')
  if (report && report.skipBuild !== false) issues.push('latest regression report is not full build mode')
  if (report && (report.summary?.passed !== report.summary?.total || report.summary?.total < 3)) issues.push(`regression summary not passing: ${JSON.stringify(report.summary)}`)
  for (const id of ['c5-ticket-system', 'c6-data-quality-v4', 'c7-fulfillment-ops']) {
    const item = report?.cases?.find(entry => entry.id === id)
    if (!item?.pass) issues.push(`required regression case not passing: ${id}`)
  }
  for (const item of report?.cases ?? []) {
    const summary = item.quality?.summary
    if (summary && (summary.critical !== 0 || summary.warn !== 0)) issues.push(`${item.id} has critical/warn: ${summary.critical}/${summary.warn}`)
  }
  return check('objective', '3+ PRD full regression harness', issues, paths.regressionReport)
}

function checkBrowser() {
  const report = readJson(paths.browserReport)
  const issues = []
  if (!report) issues.push('missing or invalid browser-report.json')
  ensureFresh(paths.browserReport, [
    paths.browserConfig,
    join(__dirname, 'browser-validate.mjs'),
    ...sourceInputs(target),
  ], issues, 'browser-report.json')
  if (report && report.summary?.passed !== report.summary?.total) issues.push(`browser summary not passing: ${JSON.stringify(report.summary)}`)
  for (const id of ['C8', 'C9', 'C10']) {
    const item = report?.cases?.find(entry => entry.id === id)
    if (!item?.pass) issues.push(`required browser case not passing: ${id}`)
  }
  const c12 = report?.cases?.find(entry => entry.id === 'C12')
  if (!c12?.pass) issues.push('C12 browser case not passing')
  if ((c12?.routes?.length ?? 0) < 7) issues.push(`C12 route coverage too low: ${c12?.routes?.length ?? 0}`)
  for (const route of c12?.routes ?? []) {
    if (route.status !== 200 || !route.pass) issues.push(`C12 route not passing: ${route.route}`)
    if (!route.screenshot || !existsSync(route.screenshot)) issues.push(`missing C12 screenshot: ${route.route}`)
  }
  return check('objective', 'C8/C9/C10 browser validation plus C12 7-route smoke', issues, paths.browserReport)
}

function checkFreshPrdProductQuality() {
  const report = readJson(paths.productAudit)
  const issues = []
  if (!report) issues.push('missing or invalid C12 product-quality report')
  ensureFresh(paths.productAudit, [
    join(__dirname, 'product-quality-audit.mjs'),
    paths.qualityReport,
    paths.browserReport,
    join(target, 'DESIGN-BRIEF.md'),
    ...sourceInputs(target),
  ], issues, 'product-quality-report.json')
  if (report && !report.pass) issues.push('C12 product audit is not passing')
  if (report && report.score < 80) issues.push(`C12 product audit score below 80: ${report.score}`)
  const facts = report?.facts
  if (facts) {
    if (facts.pageFiles < 7) issues.push(`C12 page coverage too low: ${facts.pageFiles}`)
    if (facts.componentFiles < 14) issues.push(`C12 component count too low: ${facts.componentFiles}`)
    if (facts.briefSpecs < 7) issues.push(`C12 brief spec coverage too low: ${facts.briefSpecs}`)
    if (facts.browserRoutes < 7) issues.push(`C12 browser route coverage too low: ${facts.browserRoutes}`)
    if (facts.qualitySummary?.critical !== 0 || facts.qualitySummary?.warn !== 0) issues.push('C12 quality summary is not clean')
  }
  return check('objective', 'fresh medium-complex PRD production-quality evidence', issues, paths.productAudit)
}

function checkFreshPrdVisualDensity() {
  const report = readJson(paths.protaskVisualAudit)
  const issues = []
  if (!report) issues.push('missing or invalid C12 Protask visual-density report')
  ensureFresh(paths.protaskVisualAudit, [
    join(__dirname, 'protask-visual-audit.mjs'),
    paths.qualityReport,
    paths.browserReport,
    ...sourceInputs(target),
  ], issues, 'protask-visual-report.json')
  if (report && !report.pass) issues.push('C12 Protask visual-density audit is not passing')
  if (report && report.score < 80) issues.push(`C12 Protask visual-density score below 80: ${report.score}`)
  const facts = report?.facts
  if (facts) {
    if (facts.routeCount < 7) issues.push(`C12 visual route coverage too low: ${facts.routeCount}`)
    if (facts.browserCase && !facts.browserCase.pass) issues.push('C12 browser case did not pass in visual audit facts')
    if (facts.qualitySummary?.critical !== 0 || facts.qualitySummary?.warn !== 0) issues.push('C12 quality summary is not clean in visual audit facts')
  }
  return check('objective', 'fresh medium-complex PRD Protask visual-density evidence', issues, paths.protaskVisualAudit)
}

function checkAcceptanceReviewPackage() {
  const issues = []
  const requiredFiles = [
    paths.acceptancePacket,
    paths.acceptanceGallery,
    paths.acceptanceTemplate,
  ]
  for (const file of requiredFiles) {
    if (!existsSync(file)) issues.push(`missing acceptance review file: ${file}`)
  }

  const packet = readText(paths.acceptancePacket)
  const gallery = readText(paths.acceptanceGallery)
  const template = readJson(paths.acceptanceTemplate)
  const accepted = isPassingAcceptance(readJson(paths.acceptance))
  const browserReport = readJson(paths.browserReport)
  const c12Screenshots = c12ScreenshotPaths()
  const stalePatterns = [/prior-auth-ops-c11/, /C11-[a-z]/, /C11 User/i, /87\/100/]

  ensureFresh(
    paths.acceptanceGallery,
    accepted ? c12Screenshots : [paths.browserReport, ...c12Screenshots],
    issues,
    'USER-ACCEPTANCE-GALLERY.html',
  )

  for (const [label, content] of [['packet', packet], ['gallery', gallery]]) {
    if (!content) continue
    for (const pattern of stalePatterns) {
      if (pattern.test(content)) issues.push(`${label} contains stale C11/old-score reference: ${pattern}`)
    }
  }

  for (const screenshot of c12Screenshots) {
    const name = screenshot.split('/').pop()
    if (!existsSync(screenshot)) issues.push(`missing C12 acceptance screenshot: ${screenshot}`)
    if (gallery && !gallery.includes(name)) issues.push(`gallery does not reference ${name}`)
    if (packet && !packet.includes(name)) issues.push(`packet does not reference ${name}`)
  }

  for (const marker of ['65 分后本轮更新', 'Last user score', 're-review needed']) {
    if (gallery && !gallery.includes(marker)) issues.push(`gallery missing re-review marker: ${marker}`)
  }
  for (const marker of ['Updated Re-Review Candidate', 'Forge `ListItem`', 'dry-run-first sync script']) {
    if (packet && !packet.includes(marker)) issues.push(`packet missing re-review marker: ${marker}`)
  }

  if (!template) {
    issues.push('missing or invalid USER-ACCEPTANCE.example.json')
  } else {
    if (template.accepted !== false) issues.push('USER-ACCEPTANCE.example.json should remain accepted=false')
    if (Number(template.score) !== 0) issues.push('USER-ACCEPTANCE.example.json should keep score=0')
    validateAcceptanceBinding(template, issues, 'USER-ACCEPTANCE.example.json')
  }

  const c12 = browserReport?.cases?.find(entry => entry.id === 'C12')
  const casesRoute = c12?.routes?.find(route => route.route === '/cases')
  for (const label of ['Preview', 'Triage']) {
    const visible = casesRoute?.visibleTextChecks?.find(item => item.text === label)
    if (!visible?.pass) issues.push(`/cases visible text assertion missing or failing: ${label}`)
  }

  return check('objective', 'C12 user acceptance review package', issues, paths.acceptancePacket)
}

function checkUserAcceptance() {
  const acceptance = readJson(paths.acceptance)
  const issues = []
  let status = 'pending'
  let evidence = `pending: ${paths.acceptance}`

  if (acceptance) {
    const score = Number(acceptance.score)
    validateAcceptanceBinding(acceptance, issues, 'USER-ACCEPTANCE.json')
    if (!Number.isFinite(score) || score > 100) issues.push('USER-ACCEPTANCE.json score must be a number between 80 and 100')
    if (acceptance.accepted === true && score >= 80 && score <= 100 && issues.length === 0) {
      status = 'pass'
      evidence = `accepted with score ${score}`
    } else {
      if (acceptance.accepted !== true || score < 80) {
        issues.push('acceptance file exists but accepted=true and score>=80 are not both true')
      }
      evidence = paths.acceptance
    }
  }

  return {
    kind: 'user',
    name: 'final user score 80+',
    status,
    evidence,
    issues,
  }
}

function validateAcceptanceBinding(payload, issues, label) {
  const expected = {
    target,
    artifact: 'prior-auth-ops-c12-protask',
    reviewPacket: paths.acceptancePacket,
    reviewGallery: paths.acceptanceGallery,
    goal: 'forge-app-design readdy.ai-level generation v1',
  }
  for (const [key, value] of Object.entries(expected)) {
    if (payload[key] !== value) issues.push(`${label} ${key} must be ${value}`)
  }
}

function isPassingAcceptance(payload) {
  if (!payload) return false
  const score = Number(payload.score)
  return payload.accepted === true && Number.isFinite(score) && score >= 80 && score <= 100
}

function check(kind, name, issues, evidence) {
  return {
    kind,
    name,
    status: issues.length === 0 ? 'pass' : 'fail',
    evidence,
    issues,
  }
}

function readJson(path) {
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

function readText(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : ''
}

function ensureFresh(reportPath, inputPaths, issues, label) {
  if (!existsSync(reportPath)) return
  let reportMtime = 0
  try {
    reportMtime = statSync(reportPath).mtimeMs
  } catch {
    issues.push(`cannot stat ${label}: ${reportPath}`)
    return
  }

  const staleInputs = []
  for (const inputPath of inputPaths) {
    if (!inputPath || !existsSync(inputPath)) continue
    let mtime = 0
    try {
      mtime = statSync(inputPath).mtimeMs
    } catch {
      continue
    }
    if (mtime > reportMtime + 1000) staleInputs.push(inputPath)
  }

  if (staleInputs.length > 0) {
    issues.push(`${label} is older than inputs: ${staleInputs.slice(0, 5).join(', ')}${staleInputs.length > 5 ? `, ... +${staleInputs.length - 5}` : ''}`)
  }
}

function sourceInputs(rootDir) {
  return walk(rootDir).filter(file => {
    if (/\/node_modules\/|\/\.next\/|\/\.git\//.test(file)) return false
    if (/\/(quality|product-quality|protask-visual)-report\.(json|md)$/.test(file)) return false
    if (/\/USER-ACCEPTANCE/.test(file)) return false
    if (/\/PRODUCT-SCORE\.md$|\/VALIDATION\.md$|\/C12-PROTASK-VALIDATION\.md$/.test(file)) return false
    return /\.(ts|tsx|css|md|json)$/.test(file)
  })
}

function walk(dir) {
  if (!existsSync(dir)) return []
  const entries = []
  let items = []
  try {
    items = readdirSync(dir, { withFileTypes: true })
  } catch {
    return entries
  }
  for (const item of items) {
    const full = join(dir, item.name)
    if (item.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(item.name)) continue
      entries.push(...walk(full))
    } else {
      entries.push(full)
    }
  }
  return entries
}

function c12ScreenshotPaths() {
  return ['root', 'cases', 'case-detail', 'tasks', 'rules', 'intake', 'settings']
    .map(key => join(__dirname, 'browser-screenshots', `C12-${key}.png`))
}

function label(status) {
  if (status === 'pass') return '[OK]'
  if (status === 'pending') return '[PENDING]'
  return '[FAIL]'
}

function renderMarkdown(report) {
  const lines = []
  lines.push('# Goal Completion Report')
  lines.push('')
  lines.push(`- Generated: ${report.timestamp}`)
  lines.push(`- Objective: ${report.objective}`)
  lines.push(`- Objective evidence: ${report.summary.objectiveEvidencePass ? 'pass' : 'fail'}`)
  lines.push(`- User acceptance: ${report.summary.userAcceptancePass ? 'pass' : 'pending'}`)
  lines.push(`- Complete: ${report.summary.complete ? 'yes' : 'no'}`)
  lines.push('')
  lines.push('## Checks')
  lines.push('')
  for (const item of report.checks) {
    lines.push(`### ${label(item.status)} ${item.name}`)
    lines.push('')
    lines.push(`- Kind: ${item.kind}`)
    lines.push(`- Evidence: \`${item.evidence}\``)
    if (item.issues.length > 0) {
      lines.push('- Issues:')
      for (const issue of item.issues) lines.push(`  - ${issue}`)
    }
    lines.push('')
  }
  lines.push('## Acceptance File')
  lines.push('')
  lines.push('To make the final user gate machine-checkable after human review, create:')
  lines.push('')
  lines.push('```json')
  lines.push('{')
  lines.push('  "accepted": true,')
  lines.push('  "score": 80,')
  lines.push('  "note": "User reviewed C12 and accepts v1.",')
  lines.push(`  "target": "${target}",`)
  lines.push('  "artifact": "prior-auth-ops-c12-protask",')
  lines.push(`  "reviewPacket": "${paths.acceptancePacket}",`)
  lines.push(`  "reviewGallery": "${paths.acceptanceGallery}",`)
  lines.push('  "goal": "forge-app-design readdy.ai-level generation v1"')
  lines.push('}')
  lines.push('```')
  lines.push('')
  lines.push(`at \`${paths.acceptance}\`, then re-run with \`--strict\`.`)
  lines.push('')
  lines.push('```bash')
  lines.push('node $FORGE_APP_DESIGN_ROOT/eval/goal-completion-check.mjs --strict')
  lines.push('```')
  lines.push('')
  return lines.join('\n')
}
