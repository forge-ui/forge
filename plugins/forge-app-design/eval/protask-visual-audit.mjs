#!/usr/bin/env node
/**
 * Protask visual-density audit for forge-app-design generated projects.
 *
 * This benchmark-aware gate catches the C11 failure mode: engineering checks
 * and product-depth checks pass, but the visible app still feels too sparse.
 * It does not replace user acceptance; it makes dashboard/list/detail/workflow
 * density measurable before asking for a final 80+ score.
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
  process.stderr.write('Usage: node protask-visual-audit.mjs --target <project-dir> [--browser-report <path>] [--quality-report <path>] [--report-dir <dir>]\n')
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

const jsonPath = join(reportDir, 'protask-visual-report.json')
const mdPath = join(reportDir, 'protask-visual-report.md')
writeFileSync(jsonPath, JSON.stringify(report, null, 2))
writeFileSync(mdPath, renderMarkdown(report))

if (values.json) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n')
} else {
  process.stdout.write(`Protask visual audit: score=${report.score}/100, pass=${report.pass ? 'yes' : 'no'}\n`)
  for (const section of report.sections) {
    process.stdout.write(`${section.pass ? '[OK]' : '[WARN]'} ${section.name}: ${section.score}/${section.max}\n`)
    for (const issue of section.issues) process.stdout.write(`    - ${issue}\n`)
  }
  process.stdout.write(`Reports:\n  ${jsonPath}\n  ${mdPath}\n`)
}

process.exit(report.pass ? 0 : 1)

function audit(targetDir, browserPath, qualityPath) {
  const allFiles = walk(targetDir)
  const appCodeFiles = allFiles.filter(file => /\.(ts|tsx)$/.test(file) && rel(targetDir, file).startsWith('app/'))
  const sourceText = appCodeFiles.map(file => readFileSync(file, 'utf8')).join('\n')
  const quality = readJson(qualityPath)
  const browserCase = findBrowserCase(browserPath, targetDir)
  const routes = browserCase?.routes ?? (browserCase ? [browserCase] : [])
  const ia = readJson(join(targetDir, 'IA-ROUTE-MAP.json'))
  const routeModel = buildRouteModel(targetDir, ia, routes)

  const context = {
    targetDir,
    sourceText,
    quality,
    browserCase,
    routes,
    ia,
    routeModel,
    dashboardText: readRouteGroup(targetDir, routeModel.dashboard),
    listText: readRouteGroup(targetDir, routeModel.list),
    listPageText: readRoutePage(targetDir, routeModel.list),
    detailText: readRouteGroup(targetDir, routeModel.detail),
    workflowText: routeModel.workflowRoutes.map(page => readRouteGroup(targetDir, page)).join('\n'),
  }

  const sections = [
    auditForgeUiFirst(context),
    auditDashboardDensity(context),
    auditListQueueDensity(context),
    auditDetailDepth(context),
    auditWorkflowStateSurfaces(context),
  ]
  const blockingIssues = sections.flatMap(section => section.blockingIssues)
  const rawScore = sections.reduce((sum, section) => sum + section.score, 0)
  const score = blockingIssues.length > 0 ? Math.min(rawScore, 79) : rawScore

  return {
    timestamp: new Date().toISOString(),
    target: targetDir,
    reportDir,
    browserReport: browserPath,
    qualityReport: qualityPath,
    benchmark: 'Protask/Forge visual baseline and product-density signals',
    score,
    pass: score >= 80 && blockingIssues.length === 0,
    note: 'Machine visual-density pre-score only; final 80+ still requires user acceptance.',
    facts: {
      routeCount: routes.length,
      forgeComponentFamilies: forgeComponentFamilies(sourceText),
      qualitySummary: quality?.summary ?? null,
      browserCase: browserCase ? { id: browserCase.id, pass: browserCase.pass } : null,
      routeModel: summarizeRouteModel(routeModel),
    },
    sections,
  }
}

function defaultBrowserReportForTarget(targetDir) {
  const targetReport = join(targetDir, 'browser-report.json')
  return existsSync(targetReport) ? targetReport : defaultBrowserReport
}

function auditForgeUiFirst(context) {
  const checks = []
  const issues = []
  const blockingIssues = []
  const failedQuality = new Set((context.quality?.checks ?? []).filter(check => check.status !== 'pass').map(check => check.name))
  const families = forgeComponentFamilies(context.sourceText)

  addCheck(checks, 'quality-eval is clean', context.quality?.summary?.critical === 0 && context.quality?.summary?.warn === 0, 4, issues, qualityDetail(context.quality))
  addCheck(checks, 'raw app button gate passes', !failedQuality.has('raw-button-in-app') && !/<button\b/.test(context.sourceText), 4, issues)
  addCheck(checks, 'handrolled visual primitive gate passes', !failedQuality.has('handrolled-visual-primitive'), 4, issues)
  addCheck(checks, 'Forge component family diversity', families.length >= 12, 4, issues, `${families.length} families: ${families.join(', ')}`)
  addCheck(checks, 'ForgeUI-first primitives are visible in source', hasAny(context.sourceText, ['DataTable', 'SurfaceCard', 'TaskCard', 'FileCard', 'HistoryItem', 'CommentItem', 'ButtonGroup', 'ChartCard', 'ProgressStatCard']), 4, issues)

  if (context.quality?.summary?.critical !== 0) blockingIssues.push('quality-eval has critical issues')
  if (failedQuality.has('raw-button-in-app')) blockingIssues.push('raw button usage remains')
  if (failedQuality.has('handrolled-visual-primitive')) blockingIssues.push('handrolled visual primitive remains')

  return section('ForgeUI-first system', 20, checks, issues, blockingIssues)
}

function auditDashboardDensity(context) {
  const checks = []
  const issues = []
  const blockingIssues = []
  const dashboardRoute = context.routeModel.dashboard?.browserRoute ?? routeFor(context, '/')
  const text = context.dashboardText
  const richListContext = hasRichEntityListIntent(context)
  const controlTowerContext = hasDashboardControlTowerIntent(context)
  const baseline = dashboardControlTowerBaseline(context)
  const visualFamilyThreshold = richListContext ? 3 : 4
  const textDensityThreshold = richListContext ? 800 : 1800
  const visualFamilies = countSignals(text, [
    [/ProgressStatCard|BarChartStatCard|StatCard/g],
    [/ChartCard|BarChart|LineChart|HalfDonutChart|DonutChart/g],
    [/ProgressBar|HalfDonutChart|ProgressStatCard/g],
    [/ActivityTimeline|HistoryItem|Live activity|Activity/g],
    [/RiskQueue|PayerBurden|WorkloadSnapshot|DataTable|CaseMiniCard|PriorityWork/g],
    [/ButtonGroup|serviceLine|selectedServiceLine/g],
  ])
  const visualAnchor = hasDashboardVisualAnchor(text)

  addCheck(checks, 'dashboard browser route passed', Boolean(dashboardRoute?.pass && dashboardRoute.status === 200), 4, issues)
  addCheck(checks, 'dashboard screenshot exists', Boolean(dashboardRoute?.screenshot && existsSync(dashboardRoute.screenshot)), 3, issues)
  addCheck(checks, `dashboard has >=${visualFamilyThreshold} visual families`, visualFamilies >= visualFamilyThreshold, 5, issues, `${visualFamilies}/6 families`)
  addCheck(checks, 'dashboard has a high-emphasis Forge visual anchor', visualAnchor, 3, issues, 'expected a Forge visual anchor: themed card, image/highlight/project card, or white risk focus with Label/ProgressBar')
  addCheck(checks, 'dashboard text density is non-trivial', (dashboardRoute?.textLength ?? 0) >= textDensityThreshold, 2, issues, `${dashboardRoute?.textLength ?? 0} chars`)
  addCheck(checks, 'dashboard is componentized', routeComponentCount(context.targetDir, routeComponentPrefixes(context.routeModel.dashboard)) >= 3, 3, issues)
  addCheck(checks, 'dashboard control tower baseline', baseline.pass, 4, issues, baseline.detail)
  if (controlTowerContext && !baseline.pass) blockingIssues.push('dashboard-control-tower-protask baseline failed')

  return section('Compound dashboard density', 20, checks, issues, blockingIssues)
}

function auditListQueueDensity(context) {
  const checks = []
  const issues = []
  const blockingIssues = []
  const listRoute = context.routeModel.list?.browserRoute ?? routeFor(context, '/cases')
  const text = context.listText
  const richListContext = hasRichEntityListIntent(context)
  const kanbanFirstContext = !context.routeModel.list && hasKanbanWorkflowIntent(context)
  const baseline = protaskListBaseline(context)
  const signals = countSignals(text, [
    [/DataTable/g],
    [/QueueFilters|QueueCommandBar|ButtonGroup|statusFilter|serviceFilter|segmentFilter/g],
    [/Avatar|ForgeAvatar|payer|owner|assignee|account/g],
    [/StatusBadge|CaseStatusBadge|PriorityBadge|Label/g],
    [/RiskMeter|ProgressBar|ForgeProgressBar|risk|SLA/g],
    [/Preview|Triage|Open full triage|Open full detail|Mark reviewed|Button/g],
    [/CaseInsightDrawer|InsightRail|FileCard|FileTile|HistoryItem|ActivityTimeline/g],
    [/showPagination|showCheckbox/g],
  ])
  const firstViewportRows = hasFirstViewportQueueRows(listRoute)

  if (kanbanFirstContext) {
    checks.push({
      name: 'rich list route not required for kanban-first PRD',
      pass: true,
      score: 20,
      max: 20,
      detail: 'kanban-workflow-protask is the promoted operational surface',
    })
    return section('Rich list and queue density', 20, checks, issues, blockingIssues)
  }

  addCheck(checks, 'list browser route passed', Boolean(listRoute?.pass && listRoute.status === 200), 4, issues)
  addCheck(checks, 'list screenshot exists', Boolean(listRoute?.screenshot && existsSync(listRoute.screenshot)), 3, issues)
  addCheck(checks, 'first viewport shows queue rows', firstViewportRows, 4, issues, firstViewportRows ? 'visible row check passed' : 'add requiredVisibleText for a real row/action in browser case')
  addCheck(checks, 'Protask list visual baseline', baseline.pass, 4, issues, baseline.detail)
  addCheck(checks, 'rich list row signals >=6', signals >= 6, 5, issues, `${signals}/8 signals`)
  addCheck(checks, 'list text density is non-trivial', (listRoute?.textLength ?? 0) >= 800, 2, issues, `${listRoute?.textLength ?? 0} chars`)
  addCheck(checks, 'list is componentized', routeComponentCount(context.targetDir, routeComponentPrefixes(context.routeModel.list)) >= 3, 3, issues)
  if (richListContext && !baseline.pass) blockingIssues.push('rich-entity-list-protask baseline failed')

  return section('Rich list and queue density', 20, checks, issues, blockingIssues)
}

function auditDetailDepth(context) {
  const checks = []
  const issues = []
  const blockingIssues = []
  const detailRoute = context.routeModel.detail?.browserRoute ?? context.routes.find(route => /\/cases\/[^/]+$/.test(route.route))
  const text = context.detailText
  const visibleAcceptance = hasVisibleTextChecks(detailRoute)
  const splitPaneContext = hasSplitPaneTriageIntent(context)
  const baseline = splitPaneTriageBaseline(context)
  const signals = countSignals(text, [
    [/CaseHero|PRIOR AUTHORIZATION CASE|PageHeader|PageTitle|hero/i],
    [/Overview|Evidence|Activity|Attachments|TabBar|tabs/i],
    [/ContextRail|Care team|General information/i],
    [/RootCausePanel|Root cause|root cause/i],
    [/Impact scope|impact scope|downstream/i],
    [/SimilarCases|similar|related/i],
    [/ActivityTimeline|HistoryItem|ChangeHistory|activity/i],
    [/CommentItem|comments/i],
    [/FileCard|FileTile|attachments|EvidencePanel|evidence/i],
    [/CaseResolutionPanel|Resolution|saveState|TextArea/i],
    [/Label|statusColor|priorityColor|SLA|risk score/i],
  ])

  addCheck(checks, 'detail browser route passed', Boolean(detailRoute?.pass && detailRoute.status === 200), 4, issues)
  addCheck(checks, 'detail screenshot exists', Boolean(detailRoute?.screenshot && existsSync(detailRoute.screenshot)), 3, issues)
  addCheck(checks, 'detail screenshot shows evidence/action acceptance', visibleAcceptance, 3, issues, visibleAcceptance ? visibleTextDetail(detailRoute) : 'add requiredVisibleText for evidence/root cause/resolution')
  addCheck(checks, 'detail depth signals >=8', signals >= 8, 6, issues, `${signals}/11 signals`)
  addCheck(checks, 'detail text density is non-trivial', (detailRoute?.textLength ?? 0) >= 900, 3, issues, `${detailRoute?.textLength ?? 0} chars`)
  addCheck(checks, 'detail is componentized', routeComponentCount(context.targetDir, routeComponentPrefixes(context.routeModel.detail)) >= 2, 2, issues)
  addCheck(checks, 'split-pane triage baseline', baseline.pass, 4, issues, baseline.detail)
  if (splitPaneContext && !baseline.pass) blockingIssues.push('split-pane-triage baseline failed')

  return section('Rich detail and collaboration depth', 20, checks, issues, blockingIssues)
}

function auditWorkflowStateSurfaces(context) {
  const checks = []
  const issues = []
  const blockingIssues = []
  const workflowRoutes = context.routeModel.workflowRoutes
    .map(page => page.browserRoute)
    .filter(Boolean)
  const text = context.workflowText
  const visibleAcceptance = workflowRoutes.length >= 1 && workflowRoutes.every(route => hasVisibleTextChecks(route))
  const kanbanContext = hasKanbanWorkflowIntent(context)
  const kanbanBaseline = kanbanWorkflowBaseline(context)
  const actionFormContext = hasActionFormProtaskIntent(context)
  const actionFormBaseline = actionFormProtaskBaseline(context)
  const signals = countSignals(text, [
    [/TaskColumn|TaskCard|ReviewTaskCard|Queued|Submitted/g],
    [/Stepper|IntakeStepper|PacketChecklist|OCR preview/g],
    [/TextArea|TextField|Checkbox|ButtonGroup/g],
    [/saveState|saving|saved|pending|dirty|Updating/g],
    [/handle[A-Z][A-Za-z]+|onAdvance|onValidate|onSave/g],
    [/href=|router\.push|Link/g],
    [/PolicyGroup|AutomationHealth|SettingsSaveBar|enabled/g],
    [/ExceptionStatusRail|StatusRail|PreflightChecklist|preflightChecks|Completion/g],
    [/Breadcrumbs|PageTitle|Cancel|Save exception|Submit/g],
    [/SelectOption|ScopeFields|PolicyFields|field group/g],
  ])

  addCheck(checks, 'workflow browser routes pass', workflowRoutes.length >= 1 && workflowRoutes.every(route => route.pass && route.status === 200), 5, issues, `${workflowRoutes.length} workflow routes`)
  addCheck(checks, 'workflow screenshots exist', workflowRoutes.length >= 1 && workflowRoutes.every(route => route.screenshot && existsSync(route.screenshot)), 3, issues)
  addCheck(checks, 'action screenshot shows form/rail acceptance', visibleAcceptance, 3, issues, visibleAcceptance ? workflowRoutes.map(visibleTextDetail).join('; ') : 'add requiredVisibleText for first field group and status rail')
  addCheck(checks, 'state/action signals >=5', signals >= 5, 6, issues, `${signals}/10 signals`)
  addCheck(checks, 'local state exists', (context.sourceText.match(/useState(?:<[^>]+>)?\(/g) ?? []).length >= 6, 3, issues)
  addCheck(checks, 'feedback labels are present', /Saving|Saved|Updating|Validated|Enabled|No pending changes|Advance/.test(context.sourceText), 3, issues)
  addCheck(checks, 'kanban workflow baseline', !kanbanContext || kanbanBaseline.pass, 4, issues, kanbanBaseline.detail)
  addCheck(checks, 'action form Protask baseline', !actionFormContext || actionFormBaseline.pass, 4, issues, actionFormBaseline.detail)
  if (kanbanContext && !kanbanBaseline.pass) blockingIssues.push('kanban-workflow-protask baseline failed')
  if (actionFormContext && !actionFormBaseline.pass) blockingIssues.push('action-form-protask baseline failed')

  return section('Workflow and state surfaces', 20, checks, issues, blockingIssues)
}

function section(name, max, checks, issues, blockingIssues) {
  const threshold = Math.ceil(max * 0.8)
  const rawScore = Math.min(max, checks.reduce((sum, check) => sum + check.score, 0))
  const pass = rawScore >= threshold && blockingIssues.length === 0
  const score = pass ? rawScore : Math.min(rawScore, threshold - 1)
  return { name, score, max, pass, issues, blockingIssues, checks }
}

function addCheck(checks, name, pass, max, issues, detail = '') {
  checks.push({ name, pass, score: pass ? max : 0, max, detail })
  if (!pass) issues.push(detail ? `${name}: ${detail}` : name)
}

function countSignals(text, patterns) {
  return patterns.reduce((count, entry) => {
    const pattern = Array.isArray(entry) ? entry[0] : entry
    return count + (pattern.test(text) ? 1 : 0)
  }, 0)
}

function countMatches(text, pattern) {
  return (text.match(pattern) ?? []).length
}

function hasAny(text, needles) {
  return needles.some(needle => text.includes(needle))
}

function hasRichEntityListIntent(context) {
  const intentText = [
    context.ia?.archetype?.id,
    context.routeModel.list?.layoutIntent,
    context.routeModel.list?.id,
  ].filter(Boolean).join(' ')
  return /rich-entity-list-protask/i.test(intentText)
}

function hasDashboardControlTowerIntent(context) {
  const intentText = [
    context.ia?.archetype?.id,
    context.routeModel.dashboard?.layoutIntent,
    context.routeModel.dashboard?.id,
  ].filter(Boolean).join(' ')
  return /dashboard-control-tower-protask|protask-compound-control-tower/i.test(intentText)
}

function hasSplitPaneTriageIntent(context) {
  const intentText = [
    context.ia?.archetype?.id,
    context.routeModel.detail?.layoutIntent,
    context.routeModel.detail?.id,
  ].filter(Boolean).join(' ')
  return /split-pane-triage|split-pane-triage-protask/i.test(intentText)
}

function hasKanbanWorkflowIntent(context) {
  const intentText = [
    context.ia?.archetype?.id,
    ...context.routeModel.workflowRoutes.map(page => `${page.layoutIntent ?? ''} ${page.id ?? ''} ${page.routeRole ?? ''} ${page.route ?? ''}`),
  ].filter(Boolean).join(' ')
  return /kanban-workflow-protask|kanban-board-with-row-actions/i.test(intentText)
}

function hasActionFormProtaskIntent(context) {
  const intentText = [
    context.ia?.archetype?.id,
    ...context.routeModel.workflowRoutes.map(page => `${page.layoutIntent ?? ''} ${page.id ?? ''} ${page.routeRole ?? ''} ${page.surfaceRole ?? ''} ${page.route ?? ''}`),
  ].filter(Boolean).join(' ')
  return /action-form-protask/i.test(intentText)
}

function dashboardControlTowerBaseline(context) {
  const text = context.dashboardText
  const typography = compactTypographyBaseline(text)
  const spacing = compactSpacingBaseline(text, 'dashboard')
  const border = subtleBorderBaseline(text)
  const chrome = nativeProfileChromeBaseline(context.sourceText)
  const sizing = adaptiveLayoutSizingBaseline(text)
  const kpiTreatment = dashboardKpiTreatmentBaseline(text)
  const kpiSizing = dashboardKpiSizingBaseline(text)
  const saturation = dashboardSaturationBaseline(text)
  const checks = [
    {
      name: 'compact KPI/stat surface',
      pass: /ProgressStatCard|BarChartStatCard|StatCard|DashboardSummaryStrip|items\.map\(|summary strip/i.test(text),
    },
    {
      name: 'trend or risk visual',
      pass: /ChartCard|BarChart|LineChart|HalfDonutChart|DonutChart|ProgressBar|risk trend/i.test(text),
    },
    {
      name: 'priority work surface',
      pass: /PriorityWork|PriorityRelease|priority work|Priority releases|DataTable|workItems|WorkItem/i.test(text),
    },
    {
      name: 'activity stream',
      pass: /HistoryItem|ActivityTimeline|Live activity|activityEvents|activity stream/i.test(text),
    },
    {
      name: 'workflow entry link',
      pass: /href=|router\.push|Link|Button/.test(text),
    },
    {
      name: 'componentized control tower',
      pass: routeComponentCount(context.targetDir, routeComponentPrefixes(context.routeModel.dashboard)) >= 3,
    },
    {
      name: 'KPI treatment is visually consistent',
      pass: kpiTreatment.pass,
      detail: kpiTreatment.detail,
    },
    {
      name: 'risk emphasis is not an alert billboard',
      pass: saturation.pass,
      detail: saturation.detail,
    },
    {
      name: 'KPI values are not undersized',
      pass: kpiSizing.pass,
      detail: kpiSizing.detail,
    },
    {
      name: 'Forge/Protask typography scale',
      pass: typography.pass,
      detail: typography.detail,
    },
    {
      name: 'compact dashboard spacing',
      pass: spacing.pass,
      detail: spacing.detail,
    },
    {
      name: 'subtle Forge card borders',
      pass: border.pass,
      detail: border.detail,
    },
    {
      name: 'native AppLayout profile chrome',
      pass: chrome.pass,
      detail: chrome.detail,
    },
    {
      name: 'adaptive layout sizing',
      pass: sizing.pass,
      detail: sizing.detail,
    },
  ]
  const misses = checks.filter(check => !check.pass).map(check => check.name)
  const passCount = checks.length - misses.length
  return {
    pass: passCount >= 12 && !misses.includes('trend or risk visual') && !misses.includes('priority work surface') && !misses.includes('activity stream') && !misses.includes('KPI treatment is visually consistent') && !misses.includes('risk emphasis is not an alert billboard') && !misses.includes('KPI values are not undersized') && !misses.includes('Forge/Protask typography scale') && !misses.includes('adaptive layout sizing'),
    detail: misses.length === 0 ? `${passCount}/${checks.length} baseline signals` : `${passCount}/${checks.length}; missing ${misses.join(', ')}`,
  }
}

function splitPaneTriageBaseline(context) {
  const text = context.detailText
  const typography = compactTypographyBaseline(text)
  const spacing = compactSpacingBaseline(text, 'detail')
  const border = subtleBorderBaseline(text)
  const profileRail = detailProfileRailBaseline(text)
  const rightRail = rightRailBaseline(text)
  const sizing = adaptiveLayoutSizingBaseline(text)
  const checks = [
    {
      name: 'evidence surface',
      pass: /Evidence|FileCard|FileTile|Attachment|attachments|evidence/i.test(text),
    },
    {
      name: 'root cause',
      pass: /RootCausePanel|Root cause|root cause/i.test(text),
    },
    {
      name: 'impact scope',
      pass: /ImpactScopePanel|Impact scope|impact scope|downstream/i.test(text),
    },
    {
      name: 'history or audit trail',
      pass: /ChangeHistory|HistoryItem|ActivityTimeline|audit trail|Audit|history/i.test(text),
    },
    {
      name: 'resolution action',
      pass: /ResolutionPanel|Resolution|Resolve|Escalate|TextArea|saveState/i.test(text),
    },
    {
      name: 'next workflow link',
      pass: /workflow|audit-log|RETURN_ROUTE|router\.push|StyledLink|Link/i.test(text),
    },
    {
      name: 'Forge/Protask typography scale',
      pass: typography.pass,
      detail: typography.detail,
    },
    {
      name: 'compact detail spacing',
      pass: spacing.pass,
      detail: spacing.detail,
    },
    {
      name: 'subtle Forge card borders',
      pass: border.pass,
      detail: border.detail,
    },
    {
      name: 'identity/profile rail exists',
      pass: profileRail.pass,
      detail: profileRail.detail,
    },
    {
      name: 'right/context rail is compact',
      pass: rightRail.pass,
      detail: rightRail.detail,
    },
    {
      name: 'adaptive layout sizing',
      pass: sizing.pass,
      detail: sizing.detail,
    },
  ]
  const misses = checks.filter(check => !check.pass).map(check => check.name)
  const passCount = checks.length - misses.length
  return {
    pass: passCount >= 10 && !misses.includes('resolution action') && !misses.includes('root cause') && !misses.includes('impact scope') && !misses.includes('identity/profile rail exists') && !misses.includes('adaptive layout sizing'),
    detail: misses.length === 0 ? `${passCount}/${checks.length} baseline signals` : `${passCount}/${checks.length}; missing ${misses.join(', ')}`,
  }
}

function kanbanWorkflowBaseline(context) {
  const boardPage = context.routeModel.workflowRoutes.find(page => /kanban|workflow|board/i.test(`${page.layoutIntent ?? ''} ${page.routeRole ?? ''} ${page.route ?? ''}`))
  const text = readRouteGroup(context.targetDir, boardPage) || context.workflowText
  const browserRoute = boardPage?.browserRoute
  const typography = compactTypographyBaseline(text)
  const spacing = compactSpacingBaseline(text, 'board')
  const border = subtleBorderBaseline(text)
  const sizing = adaptiveLayoutSizingBaseline(text)
  const checks = [
    {
      name: 'status lanes',
      pass: /KanbanColumn|STATUS_COLUMNS|lanes|status lane|StatusStrip/i.test(text),
    },
    {
      name: 'actionable workflow cards',
      pass: /TaskCard|JobCard|WorkflowCard|Button|Run now|Re-run|Advance|onTrigger|onAdvance|handleTrigger/i.test(text),
    },
    {
      name: 'lane counts and empty states',
      pass: /StatusStrip|lane count|items\.length|No items|empty lane|empty state/i.test(text),
    },
    {
      name: 'status/progress signal',
      pass: /ProgressBar|progress|Label|statusProgress|STATUS_THEME|statusColor/i.test(text),
    },
    {
      name: 'diagnostic or detail link',
      pass: /relatedHref|StyledLink|Link|href=|View errors|Open detail|diagnostic/i.test(text),
    },
    {
      name: 'first viewport board acceptance',
      pass: hasVisibleTextChecks(browserRoute),
    },
    {
      name: 'Forge/Protask typography scale',
      pass: typography.pass,
      detail: typography.detail,
    },
    {
      name: 'compact board spacing',
      pass: spacing.pass,
      detail: spacing.detail,
    },
    {
      name: 'subtle Forge card borders',
      pass: border.pass,
      detail: border.detail,
    },
    {
      name: 'adaptive layout sizing',
      pass: sizing.pass,
      detail: sizing.detail,
    },
  ]
  const misses = checks.filter(check => !check.pass).map(check => check.name)
  const passCount = checks.length - misses.length
  return {
    pass: passCount >= 8 && !misses.includes('status lanes') && !misses.includes('actionable workflow cards') && !misses.includes('diagnostic or detail link') && !misses.includes('compact board spacing') && !misses.includes('adaptive layout sizing'),
    detail: misses.length === 0 ? `${passCount}/${checks.length} baseline signals` : `${passCount}/${checks.length}; missing ${misses.join(', ')}`,
  }
}

function actionFormProtaskBaseline(context) {
  const actionPages = context.routeModel.workflowRoutes.filter(page => (
    /action-form-protask/i.test(`${page.layoutIntent ?? ''} ${page.id ?? ''}`) ||
    page.surfaceRole === 'action' ||
    page.routeRole === 'wizard'
  ))
  const text = actionPages.map(page => readRouteGroup(context.targetDir, page)).join('\n') || context.workflowText
  const typography = compactTypographyBaseline(text)
  const spacing = compactSpacingBaseline(text, 'action')
  const border = subtleBorderBaseline(text)
  const rail = actionRailBaseline(text)
  const sizing = adaptiveLayoutSizingBaseline(text)
  const checks = [
    {
      name: 'title and explicit exit actions',
      pass: /Breadcrumbs/.test(text) && /(?:<h1\b|PageTitle)/.test(text) && /Cancel/.test(text) && /Save|Submit|Create/i.test(text),
    },
    {
      name: 'grouped form fields',
      pass: /(?:ScopeFields|PolicyFields|TextField|TextArea|SelectOption|Checkbox|field group)/i.test(text) && /SurfaceCard/.test(text),
    },
    {
      name: 'status or preflight rail',
      pass: rail.pass,
      detail: rail.detail,
    },
    {
      name: 'local save feedback',
      pass: /useState(?:<[^>]+>)?\(|saveState|Saving|Saved|dirty|No pending changes/i.test(text),
    },
    {
      name: 'Forge/Protask typography scale',
      pass: typography.pass,
      detail: typography.detail,
    },
    {
      name: 'compact action spacing',
      pass: spacing.pass,
      detail: spacing.detail,
    },
    {
      name: 'subtle Forge card borders',
      pass: border.pass,
      detail: border.detail,
    },
    {
      name: 'adaptive layout sizing',
      pass: sizing.pass,
      detail: sizing.detail,
    },
  ]
  const misses = checks.filter(check => !check.pass).map(check => check.name)
  const passCount = checks.length - misses.length
  return {
    pass: passCount >= 7 && !misses.includes('title and explicit exit actions') && !misses.includes('grouped form fields') && !misses.includes('status or preflight rail') && !misses.includes('adaptive layout sizing'),
    detail: misses.length === 0 ? `${passCount}/${checks.length} baseline signals` : `${passCount}/${checks.length}; missing ${misses.join(', ')}`,
  }
}

function protaskListBaseline(context) {
  const text = context.listText
  const pageText = context.listPageText
  const routeText = `${pageText}\n${text}`
  const hasSummaryRail = /<(?:QueueWorkloadSummary|.*InsightRail)\b/.test(pageText)
  const titleScale = titleScaleBaseline(context)
  const typography = compactTypographyBaseline(text)
  const spacing = compactSpacingBaseline(pageText || text, 'list')
  const border = subtleBorderBaseline(text)
  const chrome = nativeProfileChromeBaseline(context.sourceText)
  const rowDensity = adaptiveTableDensityBaseline(text)
  const rail = rightRailBaseline(routeText)
  const sizing = adaptiveLayoutSizingBaseline(routeText)
  const tablePrimacy = listTablePrimacyBaseline(routeText)
  const actionDiscipline = rowActionDisciplineBaseline(text)
  const tableSurface = tableSurfaceCompositionBaseline(text)
  const filterChrome = listFilterChromeBaseline(text, pageText)
  const filterShell = listFilterShellBaseline(routeText)
  const selectedDetail = listSelectedDetailBaseline(pageText)
  const riskCell = riskCellCompoundBaseline(text)
  const signalPalette = tableSignalPaletteBaseline(context.sourceText)
  const checks = [
    {
      name: 'Forge grey shell and subtle card borders',
      pass: /<AppLayout\b/.test(context.sourceText) && /SurfaceCard|DataTable/.test(text) && (border.pass || /SurfaceCard/.test(text)),
    },
    {
      name: 'compact filter strip',
      pass: /QueueCommandBar|QueueFilters|ButtonGroup/.test(routeText) && filterChrome.pass && filterShell.pass,
      detail: `${filterChrome.detail}; ${filterShell.detail}`,
    },
    {
      name: 'clear title hierarchy',
      pass: /PageTitle|Breadcrumbs|<h1\b/.test(text) && titleScale.pass,
      detail: titleScale.detail,
    },
    {
      name: 'table density and row affordances',
      pass: /DataTable/.test(text) && /showCheckbox|showPagination/.test(text) && /Avatar|owner|assignee|SLA|risk|evidence/i.test(text),
    },
    {
      name: 'filter chrome stays compact',
      pass: filterChrome.pass,
      detail: filterChrome.detail,
    },
    {
      name: 'no below-table selected detail card',
      pass: selectedDetail.pass,
      detail: selectedDetail.detail,
    },
    {
      name: 'risk cell is not compound',
      pass: riskCell.pass,
      detail: riskCell.detail,
    },
    {
      name: 'table signal palette stays restrained',
      pass: signalPalette.pass,
      detail: signalPalette.detail,
    },
    {
      name: 'source order keeps table before summary rail',
      pass: hasSummaryRail
        ? hasComponentOrder(pageText, [/<(?:QueueCommandBar|QueueFilters|[A-Z][A-Za-z]*Filters?)\b|<ButtonGroup\b/, /<(?:[A-Z][A-Za-z]*)?QueueTable\b|<DataTable\b/, /<(?:QueueWorkloadSummary|.*InsightRail)\b/])
        : hasComponentOrder(pageText, [/<(?:QueueCommandBar|QueueFilters|[A-Z][A-Za-z]*Filters?)\b|<ButtonGroup\b/, /<(?:[A-Z][A-Za-z]*)?QueueTable\b|<DataTable\b/]),
    },
    {
      name: 'summary does not push table below fold',
      pass: !componentBefore(pageText, /<QueueWorkloadSummary\b/, /<(?:Exception|Entity|Case).*QueueTable\b|<DataTable\b/),
    },
    {
      name: 'Forge/Protask typography scale',
      pass: typography.pass,
      detail: typography.detail,
    },
    {
      name: 'compact list spacing',
      pass: spacing.pass,
      detail: spacing.detail,
    },
    {
      name: 'subtle Forge card borders',
      pass: border.pass,
      detail: border.detail,
    },
    {
      name: 'native AppLayout profile chrome',
      pass: chrome.pass,
      detail: chrome.detail,
    },
    {
      name: 'adaptive table density',
      pass: rowDensity.pass,
      detail: rowDensity.detail,
    },
    {
      name: 'table remains primary at desktop widths',
      pass: tablePrimacy.pass,
      detail: tablePrimacy.detail,
    },
    {
      name: 'row actions stay compact',
      pass: actionDiscipline.pass,
      detail: actionDiscipline.detail,
    },
    {
      name: 'DataTable surface is not nested in a large card shell',
      pass: tableSurface.pass,
      detail: tableSurface.detail,
    },
    {
      name: 'responsive insight rail',
      pass: !hasSummaryRail || rail.pass,
      detail: rail.detail,
    },
    {
      name: 'adaptive layout sizing',
      pass: sizing.pass,
      detail: sizing.detail,
    },
  ]
  const misses = checks.filter(check => !check.pass).map(check => check.name)
  const passCount = checks.length - misses.length
  const titleScaleDetail = misses.includes('clear title hierarchy') ? `; ${titleScale.detail}` : ''
  return {
    pass: passCount >= 18 && !misses.includes('clear title hierarchy') && !misses.includes('compact filter strip') && !misses.includes('filter chrome stays compact') && !misses.includes('no below-table selected detail card') && !misses.includes('risk cell is not compound') && !misses.includes('table signal palette stays restrained') && !misses.includes('source order keeps table before summary rail') && !misses.includes('summary does not push table below fold') && !misses.includes('compact list spacing') && !misses.includes('adaptive table density') && !misses.includes('table remains primary at desktop widths') && !misses.includes('row actions stay compact') && !misses.includes('DataTable surface is not nested in a large card shell') && !misses.includes('adaptive layout sizing'),
    detail: misses.length === 0 ? `${passCount}/${checks.length} baseline signals` : `${passCount}/${checks.length}; missing ${misses.join(', ')}${titleScaleDetail}`,
  }
}

function dashboardKpiTreatmentBaseline(text) {
  const blocks = componentBlocks(text)
  const mixedBlocks = blocks.filter(block => {
    const nonWhiteStatCard = /<StatCard\b[^>]*\btheme=["'](?!white["'])(?:purple|black|blue|green|red|yellow|cyan|orange|gray)["']/.test(block)
    const whiteKpiItems = /items\.map\(|\bbg-fg-grey-50\b/.test(block)
    return nonWhiteStatCard && whiteKpiItems
  })
  return {
    pass: mixedBlocks.length === 0,
    detail: `${mixedBlocks.length} component block(s) mix saturated StatCard with white/grey KPI items`,
  }
}

function dashboardKpiSizingBaseline(text) {
  const undersizedValueSignals = countMatches(text, /\btext-(?:xl|2xl)\b[^"'`]*\bfont-semibold\b[\s\S]{0,160}\{(?:item\.value|summary\.(?:total|open|breachRisk|missingEvidence|ready))\}/g)
  const compactStatValues = countMatches(text, /\btext-(?:3xl|4xl|5xl|display-l)\b[\s\S]{0,200}\{(?:item\.value|summary\.[A-Za-z]+)\}/g)
  return {
    pass: undersizedValueSignals === 0,
    detail: `${undersizedValueSignals} undersized KPI value signal(s), ${compactStatValues} stronger KPI value signal(s)`,
  }
}

function dashboardSaturationBaseline(text) {
  const wideRedStatCards = countMatches(text, /<StatCard\b(?=[^>]*\btheme=["']red["'])(?=[^>]*\bsize=["']wide["'])/g)
  const redStatCards = countMatches(text, /<StatCard\b[^>]*\btheme=["']red["']/g)
  const whiteRiskFocus = /SurfaceCard[\s\S]{0,240}(?:Breach|Risk|risk|breach)[\s\S]{0,240}(?:<Label\b[^>]*color=["']red["']|<ProgressBar\b[^>]*color=["']red["'])/.test(text)
  return {
    pass: wideRedStatCards === 0 && (redStatCards === 0 || whiteRiskFocus),
    detail: `${wideRedStatCards} wide red StatCard(s), ${redStatCards} red StatCard(s), whiteRiskFocus=${whiteRiskFocus}`,
  }
}

function listFilterChromeBaseline(text, pageText) {
  const buttonGroups = countMatches(text, /<ButtonGroup\b/g)
  const stackedButtonGroups = buttonGroups > 1
  const summaryBeforeTable = componentBefore(pageText, /<QueueSummaryStrip\b|<[^>]*SummaryStrip\b/, /<(?:[A-Z][A-Za-z]*)?QueueTable\b|<DataTable\b/)
  return {
    pass: !stackedButtonGroups && !summaryBeforeTable,
    detail: `ButtonGroup=${buttonGroups}, summaryBeforeTable=${summaryBeforeTable}`,
  }
}

function listFilterShellBaseline(text) {
  const redundantShells = countMatches(text, /<section\b[^>]*\brounded-card\b[^>]*(?:\bp-3\b|\bp-4\b)[^>]*\b(?:outline|bg-white)\b|<SurfaceCard\b[^>]*title=["'](?:Queue controls|Filters|Filter)["']/gi)
  return {
    pass: redundantShells === 0,
    detail: `${redundantShells} redundant filter shell(s)`,
  }
}

function listSelectedDetailBaseline(pageText) {
  const hasInsightRail = /<[^>]*InsightRail\b/.test(pageText)
  const hiddenUntilWide = /\bhidden\s+2xl:block\b|\b2xl:block\s+hidden\b/.test(pageText)
  const drawerLike = /Drawer|Sheet|Dialog|Modal|Popover/i.test(pageText)
  return {
    pass: !hasInsightRail || hiddenUntilWide || drawerLike,
    detail: `insightRail=${hasInsightRail}, hiddenUntilWide=${hiddenUntilWide}, drawerLike=${drawerLike}`,
  }
}

function tableSignalPaletteBaseline(text) {
  const riskUsesPurpleOrGreen = /function\s+riskColor\b[\s\S]{0,500}return\s+["'](?:purple|green|cyan|blue)["']/.test(text)
  const p1UsesSaturatedColor = /function\s+priorityColor\b[\s\S]{0,220}priority\s*={2,3}\s*["']P1["'][\s\S]{0,100}return\s+["'](?:purple|yellow|green|cyan|blue)["']/.test(text)
  const coloredSignalFamilies = new Set()
  for (const match of text.matchAll(/<Label\b[^>]*\bcolor=\{?(?:["']([^"'}]+)["']|(?:statusColor|priorityColor|riskColor)\()/g)) {
    coloredSignalFamilies.add(match[1] ?? 'computed')
  }
  return {
    pass: !riskUsesPurpleOrGreen && !p1UsesSaturatedColor,
    detail: `riskUsesPurpleOrGreen=${riskUsesPurpleOrGreen}, p1UsesSaturatedColor=${p1UsesSaturatedColor}, labelFamilies=${coloredSignalFamilies.size}`,
  }
}

function riskCellCompoundBaseline(text) {
  const blocks = extractColumnBlocks(text, 'risk')
  const bad = blocks.filter(block => /<ProgressBar\b/.test(block) && /\bshowPercentage\b/.test(block) && /\blabel=/.test(block))
  return {
    pass: bad.length === 0,
    detail: `${bad.length}/${blocks.length} risk column block(s) combine progress bar, label, and percentage`,
  }
}

function compactTypographyBaseline(text) {
  const compact = countMatches(text, /\btext-(?:xs|sm)\b/g)
  const oversizedHeadings = countMatches(text, /<h1\b[^>]*className=["'`][^"'`]*(?:text-display-l|text-3xl|text-4xl|text-5xl|text-6xl)[^"'`]*["'`]/g)
  const displayText = countMatches(text, /\btext-display-l\b/g)
  return {
    pass: compact >= 4 && oversizedHeadings === 0 && displayText === 0,
    detail: `${compact} compact text tokens, ${oversizedHeadings} oversized h1, ${displayText} display tokens`,
  }
}

function compactSpacingBaseline(text, role) {
  const loosePageRhythm = countMatches(text, /\b(?:space-y-6|gap-6)\b/g)
  const largePadding = countMatches(text, /\b(?:p-6|px-6|py-6)\b/g)
  const allowance = role === 'dashboard' ? 4 : 1
  return {
    pass: loosePageRhythm <= allowance && largePadding <= allowance + 2,
    detail: `${loosePageRhythm} loose rhythm tokens, ${largePadding} large padding tokens; role=${role}`,
  }
}

function subtleBorderBaseline(text) {
  const subtle = countMatches(text, /\b(?:outline|border)-fg-grey-200\b/g)
  const forgeSurfaceCards = countMatches(text, /\bSurfaceCard\b/g)
  const heavy = countMatches(text, /\bborder-(?:fg-grey-300|fg-grey-400|gray-300|neutral-300|slate-300)\b/g)
  return {
    pass: (subtle > 0 || forgeSurfaceCards > 0) && heavy <= Math.max(1, Math.floor((subtle + forgeSurfaceCards) / 4)),
    detail: `${subtle} subtle borders, ${forgeSurfaceCards} Forge surface cards, ${heavy} heavier grey borders`,
  }
}

function nativeProfileChromeBaseline(sourceText) {
  const usesAppLayout = /<AppLayout\b/.test(sourceText)
  const topbar = /profilePosition=["']topbar["']/.test(sourceText)
  const hasProfile = /\bprofile=\{|\bPROFILE\b/.test(sourceText)
  const customChrome = /\b(?:CustomTopbar|UserMenu|ProfileMenu|TopbarProfile|ProfileHeader)\b/.test(sourceText)
  return {
    pass: usesAppLayout && topbar && hasProfile && !customChrome,
    detail: `AppLayout=${usesAppLayout}, topbar=${topbar}, profile=${hasProfile}, customChrome=${customChrome}`,
  }
}

function adaptiveTableDensityBaseline(text) {
  const hasDataTable = /<DataTable\b/.test(text)
  const truncation = countMatches(text, /\b(?:truncate|line-clamp-1)\b/g)
  const looseCellPadding = countMatches(text, /\[_t[dh]\]:p(?:x|y)?-[456]\b/g)
  const rowCards = countMatches(text, /render:\s*[^,\n]*=>\s*\(?\s*<(?:SurfaceCard|TaskCard|Card)\b/gs)
  const largeRowButtons = countMatches(text, /<Button\b(?![^>]*\bsize=["']sm["'])/g)
  const adaptiveWidths = countMatches(text, /\bw-\[(?:clamp|min|max|minmax)\(/g)
  const tableFixed = countMatches(text, /\b(?:\[_table\]:table-fixed|table-fixed)\b/g)
  return {
    pass: hasDataTable && truncation >= 2 && looseCellPadding === 0 && rowCards === 0 && largeRowButtons <= 1 && adaptiveWidths >= 1 && tableFixed === 0,
    detail: `DataTable=${hasDataTable}, truncation=${truncation}, looseCellPadding=${looseCellPadding}, rowCards=${rowCards}, largeRowButtons=${largeRowButtons}, adaptiveWidths=${adaptiveWidths}, tableFixed=${tableFixed}`,
  }
}

function listTablePrimacyBaseline(text) {
  const sideRailAtLg = countMatches(text, /\blg:grid-cols-\[[^\]]*(?:minmax\(0,1fr\)|\b1fr\b)[^\]]*(?:minmax|clamp)[^\]]*\]/g)
  const crampedRails = countMatches(text, /\b(?:lg|xl|2xl):grid-cols-\[[^\]]*(?:minmax\(1[0-5]rem|clamp\(1[0-5]rem)[^\]]*\]/g)
  const tableOverflow = /overflow-x-auto/.test(text)
  return {
    pass: sideRailAtLg === 0 && crampedRails === 0 && tableOverflow,
    detail: `sideRailAtLg=${sideRailAtLg}, crampedRails=${crampedRails}, tableOverflow=${tableOverflow}`,
  }
}

function rowActionDisciplineBaseline(text) {
  const blocks = extractActionColumnBlocks(text)
  if (blocks.length === 0) {
    return { pass: false, detail: 'no action column block found' }
  }

  const failed = blocks.filter(block => {
    const stacked = /\bflex-col\b/.test(block)
    const buttonCount = countMatches(block, /<Button\b/g)
    const compactLinkCount = countMatches(block, /<(?:StyledLink|CellLink)\b/g)
    const usesActionMenu = /<(?:CellActions|CellKebabMenu|KebabMenu|IconButton)\b/.test(block)
    const textActionCount = buttonCount + compactLinkCount
    return stacked || (!usesActionMenu && textActionCount > 1) || (buttonCount > 0 && compactLinkCount > 0)
  })

  const summary = blocks.map(block => {
    const buttonCount = countMatches(block, /<Button\b/g)
    const compactLinkCount = countMatches(block, /<(?:StyledLink|CellLink)\b/g)
    const menuCount = countMatches(block, /<(?:CellActions|CellKebabMenu|KebabMenu|IconButton)\b/g)
    const stacked = /\bflex-col\b/.test(block)
    return `buttons=${buttonCount}, links=${compactLinkCount}, menus=${menuCount}, stacked=${stacked}`
  }).join('; ')

  return {
    pass: failed.length === 0,
    detail: summary,
  }
}

function tableSurfaceCompositionBaseline(text) {
  const nestedTitledShell = countMatches(text, /<SurfaceCard\b[^>]*(?:title=|subtitle=)[\s\S]{0,1200}<DataTable\b/g)
  const dataTableOwnTitle = countMatches(text, /<DataTable\b[\s\S]{0,700}\btitle=/g)
  return {
    pass: nestedTitledShell === 0,
    detail: `nestedTitledShell=${nestedTitledShell}, dataTableOwnTitle=${dataTableOwnTitle}`,
  }
}

function extractActionColumnBlocks(text) {
  return extractColumnBlocks(text, 'action')
}

function extractColumnBlocks(text, key) {
  const blocks = []
  const escapedKey = escapeRegExp(key)
  const pattern = new RegExp(`key:\\s*['"\`]${escapedKey}['"\`]`, 'g')
  for (const match of text.matchAll(pattern)) {
    const start = match.index
    const rest = text.slice(start)
    const candidates = [
      regexIndexOf(rest, /\n\s*\{\s*\n\s*key:\s*['"`][^'"`]+['"`]/, 20),
      regexIndexOf(rest, /\n\s*\]\s*(?:\n|$)/, 20),
    ].filter(index => index > 0)
    const end = candidates.length > 0 ? Math.min(...candidates) : 900
    blocks.push(text.slice(start, start + end))
  }
  return blocks
}

function componentBlocks(text) {
  return text
    .split(/\n(?=(?:export\s+)?function\s+[A-Z][A-Za-z0-9]*\b|const\s+[A-Z][A-Za-z0-9]*\s*=)/)
    .map(block => block.trim())
    .filter(Boolean)
}

function adaptiveLayoutSizingBaseline(text) {
  const fixedPixelUtilities = countMatches(text, /\b(?:min-w|max-w|basis|min-h|max-h)-\[[0-9]+px\]|\b[wh]-\[(?:1[5-9][0-9]|[2-9][0-9]{2,})px\]/g)
  const fixedGridTracks = countMatches(text, /\b(?:grid-cols|grid-rows)-\[[^\]]*\b[0-9]{3}px\b[^\]]*\]/g)
  const fixedComponentWidths = countMatches(text, /\b(?:w|basis|min-w|max-w)-(?:64|72|80|96)\b|\bwidth=["']fixed["']/g)
  const adaptiveTracks = countMatches(text, /\b(?:w|min-w|max-w|basis|h|min-h|max-h|grid-cols|grid-rows)-\[[^\]]*(?:clamp|minmax|min\(|max\(|calc\(|vw|vh|%|fr)[^\]]*\]/g)
  return {
    pass: fixedPixelUtilities === 0 && fixedGridTracks === 0 && fixedComponentWidths === 0,
    detail: `fixedPixelUtilities=${fixedPixelUtilities}, fixedGridTracks=${fixedGridTracks}, fixedComponentWidths=${fixedComponentWidths}, adaptiveTracks=${adaptiveTracks}`,
  }
}

function detailProfileRailBaseline(text) {
  const rail = /ProfileCard|IdentityRail|ContextRail|DetailProfile|profile rail|identity rail/i.test(text)
  const identitySignals = countSignals(text, [
    [/Avatar|avatar|profile/i],
    [/owner|assignee|team|contact/i],
    [/SLA|risk|severity|status/i],
    [/metadata|Client ID|Record ID|ID:/i],
  ])
  return {
    pass: rail || identitySignals >= 3,
    detail: `rail=${rail}, identitySignals=${identitySignals}/4`,
  }
}

function rightRailBaseline(text) {
  const explicitRail = /RightRail|ContextRail|InsightRail|ActivityRail|HistoryRail|right rail/i.test(text)
  const adaptiveRail = hasAdaptiveRailConstraint(text)
  const railSignals = countSignals(text, [
    [/HistoryItem|ActivityTimeline|activity/i],
    [/related|Similar|nearby/i],
    [/FileCard|evidence|attachment/i],
  ])
  return {
    pass: (explicitRail || adaptiveRail) && railSignals >= 2,
    detail: `explicitRail=${explicitRail}, adaptiveRail=${adaptiveRail}, railSignals=${railSignals}/3`,
  }
}

function actionRailBaseline(text) {
  const explicitRail = /StatusRail|Status rail|PreflightRail|PreflightChecklist|Preflight checks|ContextRail|RightRail|right rail/i.test(text)
  const adaptiveRail = hasAdaptiveRailConstraint(text)
  const railSignals = countSignals(text, [
    [/ProgressBar|completion|readiness/i],
    [/preflight|validation|checks/i],
    [/changed|summary|parent|next workflow|StyledLink|Link/i],
  ])
  return {
    pass: (explicitRail || adaptiveRail) && railSignals >= 2,
    detail: `explicitRail=${explicitRail}, adaptiveRail=${adaptiveRail}, railSignals=${railSignals}/3`,
  }
}

function hasAdaptiveRailConstraint(text) {
  return /(?:grid-cols-\[[^\]]*(?:minmax|clamp|max-content|min-content|min\(|max\(|calc\(|vw|%)[^\]]*\]|(?:max-w|basis|w)-\[[^\]]*(?:minmax|clamp|min\(|max\(|calc\(|vw|%)[^\]]*\])/.test(text)
}

function titleScaleBaseline(context) {
  const source = context.sourceText
  const h1Count = countMatches(source, /<h1\b/g)
  const oversizedH1Count = countMatches(source, /<h1\b[^>]*className=["'`][^"'`]*(?:text-display-l|text-3xl)[^"'`]*["'`]/g)
  const controlledH1Count = countMatches(source, /<h1\b[^>]*className=["'`][^"'`]*(?:text-2xl|text-xl|text-lg)[^"'`]*["'`]/g)
  const allowedOversized = Math.max(1, Math.floor(Math.max(h1Count, 1) / 4))

  return {
    pass: controlledH1Count > 0 && oversizedH1Count <= allowedOversized,
    detail: `${oversizedH1Count}/${h1Count} oversized page H1, ${controlledH1Count} controlled H1; prefer Forge admin typography tokens no larger than text-2xl for routine admin pages`,
  }
}

function hasComponentOrder(text, patterns) {
  let cursor = -1
  for (const pattern of patterns) {
    const index = regexIndexOf(text, pattern, cursor + 1)
    if (index === -1) return false
    cursor = index
  }
  return true
}

function componentBefore(text, firstPattern, secondPattern) {
  const first = regexIndexOf(text, firstPattern, 0)
  const second = regexIndexOf(text, secondPattern, 0)
  return first !== -1 && second !== -1 && first < second
}

function regexIndexOf(text, pattern, start) {
  const source = text.slice(start)
  const match = source.match(pattern)
  return match?.index == null ? -1 : start + match.index
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function hasVisibleTextChecks(route) {
  const checks = route?.visibleTextChecks
  return Array.isArray(checks) && checks.length > 0 && checks.every(check => check.pass)
}

function visibleTextDetail(route) {
  const checks = route?.visibleTextChecks
  if (!Array.isArray(checks) || checks.length === 0) return 'no visible text checks'
  return checks.map(check => `${check.pass ? 'OK' : 'MISS'} ${check.text}`).join(', ')
}

function hasDashboardVisualAnchor(text) {
  return /<(?:StatCard|ProgressStatCard|ImageStatCard|ProjectCard|HighlightCard)\b[^>]*\btheme=["'](?!white["'])(?:purple|black|blue|green|red|yellow|cyan|orange|gray)["']/.test(text) ||
    /<(?:ImageStatCard|HighlightCard|ProjectCard)\b/.test(text) ||
    /<SurfaceCard\b[\s\S]{0,260}(?:Breach|Risk|risk|breach)[\s\S]{0,360}<(?:Label|ProgressBar)\b/.test(text)
}

function forgeComponentFamilies(text) {
  const known = [
    'AppLayout', 'Avatar', 'AvatarGroup', 'BarChart', 'BarChartStatCard', 'Button', 'ButtonGroup',
    'ChartCard', 'Checkbox', 'CommentItem', 'DataTable', 'FileCard', 'HalfDonutChart', 'HistoryItem',
    'HighlightCard', 'ImageStatCard', 'Label', 'ProgressBar', 'ProgressStatCard', 'ProjectCard', 'StatCard',
    'StatusBadge', 'SurfaceCard', 'Stepper', 'TabBar', 'TaskCard', 'TextArea', 'TextField',
  ]
  return known.filter(name => new RegExp(`<(?:${name}|Forge${name})\\b|\\b${name}\\b`).test(text))
}

function routeFor(context, route) {
  return context.routes.find(item => item.route === route)
}

function buildRouteModel(targetDir, ia, browserRoutes) {
  const pages = Array.isArray(ia?.pages) ? ia.pages : []
  const withBrowser = pages.map(page => ({
    ...page,
    sourceDir: routeToSourceDir(page.route),
    browserRoute: findBrowserRoute(browserRoutes, page.route),
  }))

  const dashboard = withBrowser.find(page => page.route === '/')
    ?? withBrowser.find(page => page.routeRole === 'dashboard' || /dashboard|overview|hero-overview/i.test(`${page.layoutIntent} ${page.id}`))
    ?? { route: '/', sourceDir: 'app', browserRoute: findBrowserRoute(browserRoutes, '/') }

  const list = withBrowser.find(page => page.surfaceRole === 'navigation' && (
    page.routeRole === 'list' ||
    /list|queue|rich-entity|exceptions|tickets|cases|approvals/i.test(`${page.layoutIntent} ${page.id} ${page.title}`)
  ))

  const detail = withBrowser.find(page => page.surfaceRole === 'detail')
    ?? withBrowser.find(page => page.routeRole === 'detail' || /\[[^\]]+\]/.test(page.route))

  const workflowRoutes = withBrowser.filter(page => (
    page.surfaceRole === 'action' ||
    ['wizard', 'settings', 'board'].includes(page.routeRole) ||
    /action|wizard|settings|kanban|workflow|new|create|edit|submit|import/i.test(`${page.layoutIntent} ${page.route}`)
  ))

  return {
    dashboard,
    list,
    detail,
    workflowRoutes,
    pages: withBrowser,
  }
}

function summarizeRouteModel(routeModel) {
  return {
    dashboard: routeModel.dashboard?.route,
    list: routeModel.list?.route,
    detail: routeModel.detail?.route,
    workflowRoutes: routeModel.workflowRoutes.map(page => page.route),
  }
}

function routeToSourceDir(route) {
  if (!route || route === '/') return 'app'
  return `app/${String(route).replace(/^\//, '')}`
}

function findBrowserRoute(browserRoutes, routePattern) {
  const exact = browserRoutes.find(route => route.route === routePattern)
  if (exact) return exact
  const matches = browserRoutes.filter(route => routePatternMatches(routePattern, route.route))
  if (!/\[[^\]]+\]/.test(routePattern)) return matches[0] ?? null
  return matches.find(route => !route.route.split('/').some(part => /^(?:new|create|edit|import|export|bulk|submit)$/.test(part))) ?? matches[0] ?? null
}

function routePatternMatches(pattern, actual) {
  if (!pattern || !actual) return false
  if (pattern === actual) return true
  const patternParts = pattern.split('/').filter(Boolean)
  const actualParts = actual.split('/').filter(Boolean)
  if (patternParts.length !== actualParts.length) return false
  return patternParts.every((part, index) => /^\[[^\]]+\]$/.test(part) || part === actualParts[index])
}

function readRouteGroup(targetDir, page) {
  if (!page?.sourceDir) return ''
  return readGroup(targetDir, [`${page.sourceDir}/page.tsx`, `${page.sourceDir}/_components/`, 'app/_components/'])
}

function readRoutePage(targetDir, page) {
  if (!page?.sourceDir) return ''
  const file = join(targetDir, `${page.sourceDir}/page.tsx`)
  return existsSync(file) ? readFileSync(file, 'utf8') : ''
}

function routeComponentPrefixes(page) {
  if (!page?.sourceDir) return []
  return [`${page.sourceDir}/_components/`]
}

function hasFirstViewportQueueRows(listRoute) {
  const checks = listRoute?.visibleTextChecks
  if (!Array.isArray(checks) || checks.length === 0) return false
  const passed = checks.filter(check => check.pass)
  const hasAction = passed.some(check => /action|inspect|review|open|detail|escalate|approve|resolve|advance/i.test(check.text ?? ''))
  return passed.length >= 3 && hasAction
}

function routeComponentCount(targetDir, prefixes) {
  return walk(targetDir).filter(file => {
    const path = rel(targetDir, file)
    return file.endsWith('.tsx') && prefixes.some(prefix => path.startsWith(prefix))
  }).length
}

function readGroup(targetDir, paths) {
  const chunks = []
  for (const path of paths) {
    const full = join(targetDir, path)
    if (existsSync(full) && statSync(full).isFile()) {
      chunks.push(readFileSync(full, 'utf8'))
    } else if (existsSync(full) && statSync(full).isDirectory()) {
      for (const file of walk(full).filter(item => /\.(ts|tsx)$/.test(item))) chunks.push(readFileSync(file, 'utf8'))
    }
  }
  return chunks.join('\n')
}

function qualityDetail(quality) {
  return quality?.summary ? `${quality.summary.critical} critical / ${quality.summary.warn} warn` : 'missing quality-report.json'
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

function walk(root) {
  const out = []
  if (!existsSync(root)) return out
  for (const name of readdirSync(root)) {
    if (name === 'node_modules' || name === '.next' || name === '.git') continue
    const full = join(root, name)
    const st = statSync(full)
    if (st.isDirectory()) out.push(...walk(full))
    else if (['.ts', '.tsx', '.md', '.json'].includes(extname(name))) out.push(full)
  }
  return out
}

function rel(root, file) {
  return relative(root, file).split('\\').join('/')
}

function renderMarkdown(report) {
  const lines = []
  lines.push('# Protask Visual Audit')
  lines.push('')
  lines.push(`- Generated: ${report.timestamp}`)
  lines.push(`- Target: \`${report.target}\``)
  lines.push(`- Benchmark: ${report.benchmark}`)
  lines.push(`- Score: ${report.score}/100`)
  lines.push(`- Pass: ${report.pass ? 'yes' : 'no'}`)
  lines.push(`- Note: ${report.note}`)
  lines.push('')
  lines.push('## Facts')
  lines.push('')
  lines.push(`- Browser routes: ${report.facts.routeCount}`)
  lines.push(`- Forge component families: ${report.facts.forgeComponentFamilies.join(', ')}`)
  lines.push(`- Quality: ${report.facts.qualitySummary ? `${report.facts.qualitySummary.critical} critical / ${report.facts.qualitySummary.warn} warn` : 'missing'}`)
  if (report.facts.routeModel) {
    lines.push(`- Route model: dashboard=${report.facts.routeModel.dashboard ?? 'n/a'}, list=${report.facts.routeModel.list ?? 'n/a'}, detail=${report.facts.routeModel.detail ?? 'n/a'}, workflow=${report.facts.routeModel.workflowRoutes.join(', ') || 'n/a'}`)
  }
  lines.push('')
  for (const section of report.sections) {
    lines.push(`## ${section.pass ? '[OK]' : '[WARN]'} ${section.name}`)
    lines.push('')
    lines.push(`- Score: ${section.score}/${section.max}`)
    if (section.issues.length > 0) {
      lines.push('- Issues:')
      for (const issue of section.issues) lines.push(`  - ${issue}`)
    }
    lines.push('- Checks:')
    for (const check of section.checks) lines.push(`  - ${check.pass ? '[OK]' : '[MISS]'} ${check.name}: ${check.score}/${check.max}${check.detail ? ` - ${check.detail}` : ''}`)
    lines.push('')
  }
  lines.push('## Re-run')
  lines.push('')
  lines.push('```bash')
  lines.push(`node $FORGE_APP_DESIGN_ROOT/eval/protask-visual-audit.mjs --target "${report.target}"`)
  lines.push('```')
  lines.push('')
  return lines.join('\n')
}
