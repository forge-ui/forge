#!/usr/bin/env node
/**
 * Product-quality audit for generated forge admin apps.
 *
 * This is not a replacement for user acceptance. It turns product-depth,
 * workflow, componentization, and browser-evidence signals into a repeatable
 * pre-score so regressions are visible before asking for review.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultBrowserReport = join(__dirname, 'browser-report.json')

const { values } = parseArgs({
  options: {
    target: { type: 'string' },
    'browser-report': { type: 'string' },
    'quality-report': { type: 'string' },
    'report-dir': { type: 'string' },
    json: { type: 'boolean', default: false },
  },
})

if (!values.target) {
  process.stderr.write('Usage: node product-quality-audit.mjs --target <project-dir> [--browser-report <path>] [--quality-report <path>] [--report-dir <dir>]\n')
  process.exit(2)
}

const target = resolve(values.target)
const browserReportPath = values['browser-report']
  ? resolve(values['browser-report'])
  : resolve(defaultBrowserReportForTarget(target))
const qualityReportPath = values['quality-report'] ? resolve(values['quality-report']) : join(target, 'quality-report.json')
const reportDir = values['report-dir'] ? resolve(values['report-dir']) : target
const report = audit(target, browserReportPath, qualityReportPath)

mkdirSync(reportDir, { recursive: true })

const jsonPath = join(reportDir, 'product-quality-report.json')
const mdPath = join(reportDir, 'product-quality-report.md')
writeFileSync(jsonPath, JSON.stringify(report, null, 2))
writeFileSync(mdPath, renderMarkdown(report))

if (values.json) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n')
} else {
  process.stdout.write(`Product audit: score=${report.score}/100, pass=${report.pass ? 'yes' : 'no'}\n`)
  for (const section of report.sections) {
    process.stdout.write(`${section.pass ? '[OK]' : '[WARN]'} ${section.name}: ${section.score}/${section.max}\n`)
    for (const issue of section.issues) process.stdout.write(`    - ${issue}\n`)
  }
  process.stdout.write(`Reports:\n  ${jsonPath}\n  ${mdPath}\n`)
}

process.exit(report.pass ? 0 : 1)

function audit(targetDir, browserPath, qualityPath) {
  const allFiles = walk(targetDir)
  const appCodeFiles = allFiles.filter(file => /\.(ts|tsx)$/.test(file) && relative(targetDir, file).startsWith(`app/`))
  const appFiles = appCodeFiles.filter(file => file.endsWith('.tsx'))
  const pageFiles = appFiles.filter(file => /(^|\/)page\.tsx$/.test(relative(targetDir, file)))
  const pageRoutes = pageFiles.map(file => routeFromPageFile(targetDir, file)).filter(Boolean)
  const componentFiles = appFiles.filter(file => /\/_components\/.*\.tsx$/.test(relative(targetDir, file)))
  const sourceText = appCodeFiles.map(file => readFileSync(file, 'utf8')).join('\n')
  const briefPath = join(targetDir, 'DESIGN-BRIEF.md')
  const briefText = existsSync(briefPath) ? readFileSync(briefPath, 'utf8') : ''
  const quality = readJson(qualityPath)
  const browserCase = findBrowserCase(browserPath, targetDir)

  const context = {
    targetDir,
    allFiles,
    appFiles,
    pageFiles,
    pageRoutes,
    componentFiles,
    sourceText,
    briefText,
    briefSpecs: parseBriefSpecs(briefText),
    quality,
    browserCase,
  }

  const sections = [
    auditDesignBrief(context),
    auditComponentization(context),
    auditBusinessDepth(context),
    auditWorkflow(context),
    auditBrowserVisualEvidence(context),
  ]
  const score = sections.reduce((sum, section) => sum + section.score, 0)

  return {
    timestamp: new Date().toISOString(),
    target: targetDir,
    reportDir,
    browserReport: browserPath,
    qualityReport: qualityPath,
    score,
    pass: score >= 80 && sections.every(section => section.blockingIssues.length === 0),
    note: 'Machine pre-score only; final 80+ still requires user acceptance.',
    facts: {
      pageFiles: pageFiles.length,
      componentFiles: componentFiles.length,
      briefSpecs: context.briefSpecs.length,
      qualitySummary: quality?.summary ?? null,
      browserRoutes: browserCase?.routes?.length ?? (browserCase ? 1 : 0),
    },
    sections,
  }
}

function defaultBrowserReportForTarget(targetDir) {
  const targetReport = join(targetDir, 'browser-report.json')
  return existsSync(targetReport) ? targetReport : defaultBrowserReport
}

function auditDesignBrief(context) {
  const checks = []
  const issues = []
  const blockingIssues = []
  const specs = context.briefSpecs
  const requiredFields = ['user_goal', 'primary_decision', 'primary_action', 'secondary_context']
  const specRoutes = new Set(specs.map(spec => spec.route).filter(Boolean))
  const coveredPageRoutes = context.pageRoutes.filter(route => specRoutes.has(route))
  const intents = new Set(specs.map(spec => spec.layout_intent).filter(Boolean))
  const completeSpecs = specs.filter(spec => requiredFields.every(field => hasField(spec.raw, field)))
  const componentPlans = specs.filter(spec => hasField(spec.raw, 'component_plan'))

  addCheck(checks, 'DESIGN-BRIEF.md exists', Boolean(context.briefText), 3, issues)
  addCheck(checks, 'page intent specs cover implemented pages', specs.length >= context.pageFiles.length && coveredPageRoutes.length === context.pageRoutes.length, 4, issues, `${coveredPageRoutes.length}/${context.pageRoutes.length} routes covered, ${specs.length} specs`)
  addCheck(checks, 'required product fields present on every spec', specs.length > 0 && completeSpecs.length === specs.length, 6, issues, `${completeSpecs.length}/${specs.length} complete`)
  addCheck(checks, 'component_plan present on every spec', specs.length > 0 && componentPlans.length === specs.length, 4, issues, `${componentPlans.length}/${specs.length} with component_plan`)
  addCheck(checks, 'layout intents are diverse', specs.length > 0 && intents.size >= Math.min(5, specs.length), 3, issues, `${intents.size} distinct intents`)

  if (!context.briefText) blockingIssues.push('missing DESIGN-BRIEF.md')
  if (specs.length === 0) blockingIssues.push('missing Page Intent Specs in DESIGN-BRIEF.md')
  if (coveredPageRoutes.length !== context.pageRoutes.length) blockingIssues.push('DESIGN-BRIEF.md does not cover every implemented route')
  if (specs.length > 0 && completeSpecs.length !== specs.length) blockingIssues.push('incomplete Page Intent Spec product fields')
  if (specs.length > 0 && componentPlans.length !== specs.length) blockingIssues.push('missing component_plan on Page Intent Specs')

  return section('Product design brief', 20, checks, issues, blockingIssues)
}

function auditComponentization(context) {
  const checks = []
  const issues = []
  const lineCounts = context.pageFiles.map(file => ({
    file: relative(context.targetDir, file),
    lines: readFileSync(file, 'utf8').split('\n').length,
  }))
  const maxPageLines = Math.max(0, ...lineCounts.map(item => item.lines))
  const routeComponentDirs = new Set(context.componentFiles.map(file => dirname(relative(context.targetDir, file))))

  addCheck(checks, 'enough implemented pages for medium PRD', context.pageFiles.length >= 6, 4, issues, `${context.pageFiles.length} page files`)
  addCheck(checks, 'component files scale with page count', context.componentFiles.length >= context.pageFiles.length * 2, 5, issues, `${context.componentFiles.length} components for ${context.pageFiles.length} pages`)
  addCheck(checks, 'page.tsx files stay below 200 lines', maxPageLines <= 200, 4, issues, `max ${maxPageLines} lines`)
  addCheck(checks, 'route-local component folders are used', routeComponentDirs.size >= 4, 4, issues, `${routeComponentDirs.size} _components folders`)
  addCheck(checks, 'no oversized unsplit page', lineCounts.every(item => item.lines <= 320), 3, issues)

  return section('Componentization', 20, checks, issues, [])
}

function auditBusinessDepth(context) {
  const checks = []
  const issues = []
  const blockingIssues = []
  const combined = `${context.briefText}\n${context.sourceText}`
  const conceptChecks = [
    ['root cause / reason', /\b(root cause|Decision reason|root_cause)\b/i],
    ['impact scope / downstream', /\b(impact scope|downstream|impact_scope|impacted cases)\b/i],
    ['similar / related entities', /\b(similar|related)\b/i],
    ['SOP / next action', /\b(SOP|next action|next_action|runbook)\b/i],
    ['history / audit', /\b(history|timeline|audit|change history|recent policy change)\b/i],
    ['evidence / missing items', /\b(evidence|missing items|OCR|packet)\b/i],
  ]
  let conceptScore = 0
  for (const [label, pattern] of conceptChecks) {
    if (pattern.test(combined)) conceptScore += 2
    else issues.push(`missing product-depth signal: ${label}`)
  }
  checks.push({ name: 'business depth concepts', pass: conceptScore >= 10, score: conceptScore, max: 12 })

  const typeCount = (context.sourceText.match(/export type [A-Z][A-Za-z]+/g) ?? []).length
  addCheck(checks, 'domain model has multiple entities', typeCount >= 4, 4, issues, `${typeCount} exported types`)

  const decisionSpecs = context.briefSpecs.filter(spec => /primary_decision|primary_action/.test(spec.raw)).length
  addCheck(checks, 'decision/action framing covers pages', decisionSpecs >= context.pageFiles.length, 4, issues, `${decisionSpecs}/${context.pageFiles.length} specs`)

  const mockLoremFiles = findMockLoremFiles(context)
  addCheck(checks, 'mock business copy avoids faker.lorem', mockLoremFiles.length === 0, 0, issues, mockLoremFiles.slice(0, 6).join(', '))
  if (mockLoremFiles.length) {
    blockingIssues.push('mock business copy still uses faker.lorem; replace with domain-specific phrases or deterministic fixtures')
  }

  return section('Business depth', 20, checks, issues, blockingIssues)
}

function auditWorkflow(context) {
  const checks = []
  const issues = []
  const links = context.sourceText.match(/<Link\s+href=|router\.push\(|actionHref=|href=\{?['"`]\//g) ?? []
  const stateHooks = context.sourceText.match(/useState<|useState\(/g) ?? []
  const handlers = context.sourceText.match(/handle[A-Z][A-Za-z]+\s*=/g) ?? []
  const feedback = context.sourceText.match(/\b(saving|saved|pending|dirty|Updating|Save|Advance|Toggle|onClick)\b/g) ?? []
  const routeRefs = new Set((context.sourceText.match(/['"`]\/[a-z][^'"`)}\s]*/g) ?? []).map(value => value.replace(/^['"`]/, '')))

  addCheck(checks, 'cross-route links are present', links.length >= context.pageFiles.length, 5, issues, `${links.length} link signals`)
  addCheck(checks, 'interactive local state exists', stateHooks.length >= 4, 4, issues, `${stateHooks.length} useState signals`)
  addCheck(checks, 'named handlers are present', handlers.length >= 4, 4, issues, `${handlers.length} handlers`)
  addCheck(checks, 'save/pending/action feedback exists', feedback.length >= 8, 4, issues, `${feedback.length} feedback signals`)
  addCheck(checks, 'multiple internal routes are referenced', routeRefs.size >= 4, 3, issues, `${routeRefs.size} route refs`)

  return section('Workflow closure', 20, checks, issues, [])
}

function auditBrowserVisualEvidence(context) {
  const checks = []
  const issues = []
  const blockingIssues = []
  const qualitySummary = context.quality?.summary
  const browserCase = context.browserCase
  const browserRoutes = browserCase?.routes ?? (browserCase ? [browserCase] : [])
  const screenshots = browserRoutes.filter(route => route.screenshot && existsSync(route.screenshot))
  const sourceText = context.sourceText
  const hasBadMainMax = /<main[^>]+max-w-\[|<main[^>]+max-w-screen/.test(sourceText)
  const hasRiskySidePanel = context.pageFiles.some(file => {
    const content = readFileSync(file, 'utf8')
    return /DataTable|RuleMatrix|CaseTable/.test(content) && /(^|[\s"'])xl:grid-cols-\[(?:minmax\(0,1fr\)|1fr)_3[0-9]{2}px\]/.test(content)
  })

  addCheck(checks, 'quality-eval is clean', qualitySummary?.critical === 0 && qualitySummary?.warn === 0, 5, issues, qualitySummary ? `${qualitySummary.critical} critical / ${qualitySummary.warn} warn` : 'missing quality-report.json')
  addCheck(checks, 'browser case passed', Boolean(browserCase?.pass), 5, issues)
  addCheck(checks, 'browser routes cover implemented pages', browserRoutes.length >= Math.min(context.pageFiles.length, 7), 4, issues, `${browserRoutes.length} browser routes for ${context.pageFiles.length} pages`)
  addCheck(checks, 'screenshots exist for browser routes', screenshots.length === browserRoutes.length && screenshots.length > 0, 3, issues, `${screenshots.length}/${browserRoutes.length} screenshots`)
  addCheck(checks, 'source avoids known visual-fit traps', !hasBadMainMax && !hasRiskySidePanel, 3, issues)

  if (!qualitySummary) blockingIssues.push('missing quality-report.json')
  if (!browserCase?.pass) blockingIssues.push('missing passing browser case for target')

  return section('Browser and visual evidence', 20, checks, issues, blockingIssues)
}

function section(name, max, checks, issues, blockingIssues) {
  const score = Math.min(max, checks.reduce((sum, check) => sum + check.score, 0))
  return {
    name,
    score,
    max,
    pass: score >= Math.ceil(max * 0.8) && blockingIssues.length === 0,
    issues,
    blockingIssues,
    checks,
  }
}

function addCheck(checks, name, pass, max, issues, detail = '') {
  checks.push({ name, pass, score: pass ? max : 0, max, detail })
  if (!pass) issues.push(detail ? `${name}: ${detail}` : name)
}

function parseBriefSpecs(content) {
  if (!content) return []
  const matches = [...content.matchAll(/^-\s+id:\s+(.+)$/gm)]
  return matches.map((match, index) => {
    const start = match.index
    const end = matches[index + 1]?.index ?? content.length
    const raw = content.slice(start, end)
    return {
      id: match[1].trim(),
      route: parseBriefField(raw, 'route'),
      layout_intent: raw.match(/^\s*layout_intent:\s+(.+)$/m)?.[1]?.trim(),
      raw,
    }
  })
}

function parseBriefField(raw, field) {
  const value = raw.match(new RegExp(`^\\s*${field}:\\s+(.+)$`, 'm'))?.[1]?.trim()
  if (!value) return undefined
  return value.replace(/\s+#.*$/, '').replace(/^['"]|['"]$/g, '')
}

function hasField(raw, field) {
  return new RegExp(`^\\s*${field}:`, 'm').test(raw)
}

function routeFromPageFile(targetDir, file) {
  const path = relative(targetDir, file).replaceAll('\\', '/')
  if (!path.startsWith('app/')) return undefined
  const appPath = path.replace(/^app\//, '')
  if (appPath !== 'page.tsx' && !appPath.endsWith('/page.tsx')) return undefined
  const parts = path
    .replace(/^app\//, '')
    .replace(/^page\.tsx$/, '')
    .replace(/\/page\.tsx$/, '')
    .split('/')
    .filter(Boolean)
    .filter(part => !part.startsWith('_'))
    .filter(part => !(part.startsWith('(') && part.endsWith(')')))
  return parts.length ? `/${parts.join('/')}` : '/'
}


function findBrowserCase(reportPath, targetDir) {
  const report = readJson(reportPath)
  if (!report?.cases) return null
  return report.cases.find(item => resolve(item.target) === targetDir) ?? null
}

function readJson(path) {
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

function findMockLoremFiles(context) {
  return context.allFiles
    .filter(file => relative(context.targetDir, file).replaceAll('\\', '/').startsWith('mock/'))
    .filter(file => /faker\.lorem\./.test(readFileSync(file, 'utf8')))
    .map(file => relative(context.targetDir, file).replaceAll('\\', '/'))
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

function renderMarkdown(report) {
  const lines = []
  lines.push('# Product Quality Audit')
  lines.push('')
  lines.push(`- Generated: ${report.timestamp}`)
  lines.push(`- Target: \`${report.target}\``)
  lines.push(`- Score: ${report.score}/100`)
  lines.push(`- Pass: ${report.pass ? 'yes' : 'no'}`)
  lines.push(`- Note: ${report.note}`)
  lines.push('')
  lines.push('## Facts')
  lines.push('')
  lines.push(`- Page files: ${report.facts.pageFiles}`)
  lines.push(`- Component files: ${report.facts.componentFiles}`)
  lines.push(`- Brief specs: ${report.facts.briefSpecs}`)
  lines.push(`- Browser routes: ${report.facts.browserRoutes}`)
  if (report.facts.qualitySummary) {
    lines.push(`- Quality: ${report.facts.qualitySummary.critical} critical / ${report.facts.qualitySummary.warn} warn / ${report.facts.qualitySummary.passed} passed`)
  }
  lines.push('')

  for (const section of report.sections) {
    lines.push(`## ${section.pass ? '[OK]' : '[WARN]'} ${section.name}`)
    lines.push('')
    lines.push(`- Score: ${section.score}/${section.max}`)
    if (section.blockingIssues.length) {
      lines.push('- Blocking issues:')
      for (const issue of section.blockingIssues) lines.push(`  - ${issue}`)
    }
    if (section.issues.length) {
      lines.push('- Issues:')
      for (const issue of section.issues) lines.push(`  - ${issue}`)
    }
    lines.push('- Checks:')
    for (const check of section.checks) {
      const detail = check.detail ? ` — ${check.detail}` : ''
      lines.push(`  - ${check.pass ? '[OK]' : '[FAIL]'} ${check.name}: ${check.score}/${check.max}${detail}`)
    }
    lines.push('')
  }

  lines.push('## Re-run')
  lines.push('')
  lines.push('```bash')
  lines.push(`node $FORGE_APP_DESIGN_ROOT/eval/product-quality-audit.mjs --target "${report.target}"`)
  lines.push('```')
  lines.push('')
  return lines.join('\n')
}
