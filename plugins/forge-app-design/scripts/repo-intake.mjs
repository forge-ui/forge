#!/usr/bin/env node
/**
 * repo-intake — local-only reference project intake for forge-app-design.
 *
 * It produces draft IA/page-pattern artifacts from routes and component anatomy.
 * It intentionally does not call DeepWiki/CodeWiki/CodeGraph. Those tools may
 * help a human reviewer understand the repo, but generated artifacts must be
 * local and reviewable.
 *
 * Usage:
 *   node scripts/repo-intake.mjs --repo /path/to/reference --out /tmp/intake --name my-reference
 *
 * A-tier intake policy:
 * - run in small batches only (5-10 repos);
 * - do not install, build, test, or deeply clone dependency graphs;
 * - extract IA artifacts, page patterns, business workflows, and ForgeUI gaps;
 * - keep promoted artifacts, then delete temporary clones.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path'
import { parseArgs } from 'node:util'

const { values } = parseArgs({
  options: {
    repo: { type: 'string' },
    out: { type: 'string' },
    name: { type: 'string' },
    json: { type: 'boolean', default: false },
  },
})

if (!values.repo || !values.out) {
  process.stderr.write('Usage: node repo-intake.mjs --repo <repo-dir> --out <out-dir> [--name <id>] [--json]\n')
  process.exit(2)
}

const repoDir = resolve(values.repo)
const outDir = resolve(values.out)
const repoId = values.name || slugify(basename(repoDir))

if (!existsSync(repoDir)) {
  process.stderr.write(`repo does not exist: ${repoDir}\n`)
  process.exit(2)
}

const files = walk(repoDir)
const pages = discoverPages(repoDir, files)
const routerRoutes = discoverRouterConfigRoutes(repoDir, files)
const allRoutes = mergeRouteSignals(pages, routerRoutes)

const report = {
  version: 1,
  repo: repoDir,
  repoId,
  generatedAt: new Date().toISOString(),
  counts: {
    files: files.length,
    pageFiles: pages.length,
    routerConfigRoutes: routerRoutes.length,
    routes: allRoutes.length,
  },
  intakePolicy: {
    tier: 'A-tier small batch',
    batchSize: '5-10 repos',
    allowedExtraction: ['IA artifact', 'page pattern', 'business workflow', 'ForgeUI gap'],
    forbiddenWork: ['full corpus clone', 'package install', 'build/test run', 'line-by-line source rewrite'],
    cloneRetention: 'delete temporary clone after promoted artifacts are reviewed',
    purpose: 'increase dashboard-control-tower and split-pane triage product-design depth',
  },
  routes: allRoutes,
  humanReview: {
    required: true,
    recommendedTool: 'DeepWiki',
    notes: [
      'Confirm user intent and navigation grouping from product behavior, not file tree.',
      'Rewrite decisionQuestion and businessDensity before accepting ia-draft.json.',
      'Reject pure template/showcase repos that do not represent a real product workflow.',
      'Promote only artifact-level learnings; never copy source UI wholesale.',
    ],
  },
}

const iaDraft = buildIaDraft(report)
const patternDraft = buildPagePatternDraft(report)

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'repo-intake-report.json'), JSON.stringify(report, null, 2))
writeFileSync(join(outDir, 'ia-draft.json'), JSON.stringify(iaDraft, null, 2))
writeFileSync(join(outDir, 'page-pattern-draft.json'), JSON.stringify(patternDraft, null, 2))
writeFileSync(join(outDir, 'README.md'), renderReadme(report))

if (values.json) {
  process.stdout.write(JSON.stringify({ report, iaDraft, patternDraft }, null, 2) + '\n')
} else {
  process.stdout.write(`repo-intake: ${repoId}\n`)
  process.stdout.write(`  routes: ${allRoutes.length}\n`)
  process.stdout.write(`  page files: ${pages.length}\n`)
  process.stdout.write(`  router config routes: ${routerRoutes.length}\n`)
  process.stdout.write(`  out: ${outDir}\n`)
}

function walk(root) {
  const out = []
  const skip = new Set(['.git', '.next', 'node_modules', 'dist', 'build', 'coverage', '.turbo', '.cache', 'eslint-rules'])
  function visit(dir) {
    let entries
    try { entries = readdirSync(dir) } catch { return }
    for (const name of entries) {
      if (skip.has(name)) continue
      const full = join(dir, name)
      let st
      try { st = statSync(full) } catch { continue }
      if (st.isDirectory()) visit(full)
      else if (['.ts', '.tsx', '.js', '.jsx'].includes(extname(name))) out.push(full)
    }
  }
  visit(root)
  return out
}

function discoverPages(root, fileList) {
  const pageFiles = fileList.filter(file => {
    const rel = normalize(relative(root, file))
    if (/\/(?:components|_components|hooks|utils|lib|assets)\//.test(rel)) return false
    if (/(^|\/)(NotFound|404|_app|_document|error)\.(tsx|jsx|ts|js)$/.test(rel)) return false
    return /(^|\/)(app|src\/app)\/.*\/page\.(tsx|jsx|ts|js)$/.test(rel)
      || /(^|\/)(pages|src\/pages)\/.*\.(tsx|jsx|ts|js)$/.test(rel)
      || /(^|\/)src\/pages\/.*\/page\.(tsx|jsx|ts|js)$/.test(rel)
  })

  return pageFiles
    .map(file => {
      const rel = normalize(relative(root, file))
      const route = inferRouteFromPageFile(rel)
      const content = readFileSync(file, 'utf8')
      return {
        route,
        source: rel,
        frameworkHint: frameworkHint(rel),
        anatomy: analyzePage(content),
      }
    })
    .filter(item => item.route)
    .sort((a, b) => a.route.localeCompare(b.route))
}

function discoverRouterConfigRoutes(root, fileList) {
  const candidates = fileList.filter(file => {
    const rel = normalize(relative(root, file))
    if (!/(^|\/)(src|app|pages)\//.test(rel)) return false
    return /router|routes?|navigation|sidebar|menu/i.test(rel)
  })
  const routes = []
  for (const file of candidates) {
    const content = readFileSync(file, 'utf8')
    const rel = normalize(relative(root, file))
    const re = /\bpath\s*:\s*['"]([^'"]+)['"]|to\s*:\s*['"]([^'"]+)['"]|href\s*:\s*['"]([^'"]+)['"]/g
    let match
    while ((match = re.exec(content)) !== null) {
      const route = match[1] || match[2] || match[3]
      if (!route || !route.startsWith('/')) continue
      if (route.startsWith('/api/')) continue
      routes.push({
        route: normalizeRoute(route),
        source: rel,
        frameworkHint: 'router-config',
        anatomy: analyzePage(content),
      })
    }
  }
  return dedupeByRoute(routes)
}

function mergeRouteSignals(pageRoutes, configRoutes) {
  const byRoute = new Map()
  for (const item of [...configRoutes, ...pageRoutes]) {
    const current = byRoute.get(item.route)
    if (!current) {
      byRoute.set(item.route, enrichRoute(item))
      continue
    }
    byRoute.set(item.route, enrichRoute({
      route: item.route,
      source: current.source === item.source ? current.source : `${current.source}; ${item.source}`,
      frameworkHint: current.frameworkHint === item.frameworkHint ? current.frameworkHint : `${current.frameworkHint}+${item.frameworkHint}`,
      anatomy: mergeAnatomy(current.anatomy, item.anatomy),
    }))
  }
  return [...byRoute.values()].sort((a, b) => routeSortKey(a.route).localeCompare(routeSortKey(b.route)))
}

function enrichRoute(routeItem) {
  const role = guessRouteRole(routeItem.route)
  const primaryVerb = guessPrimaryVerb(routeItem.route, role)
  const lifecycle = guessLifecycle(primaryVerb, role)
  const surface = inferSurfaceConfig(routeItem.route, role)
  return {
    ...routeItem,
    id: routeToId(routeItem.route),
    routeRole: role,
    ...surface,
    primaryVerb,
    lifecycle,
    primaryDataObject: guessPrimaryDataObject(routeItem.route),
    layoutIntent: guessLayoutIntent(role, primaryVerb),
    decisionQuestion: `TODO: confirm what decision ${routeItem.route} helps the user make.`,
    linksOut: routeItem.anatomy.routeRefs,
    businessDensity: inferBusinessDensity(routeItem.anatomy),
    needsHumanReview: true,
  }
}

function buildIaDraft(sourceReport) {
  return {
    version: 1,
    archetype: {
      id: `${sourceReport.repoId}-draft`,
      name: `${sourceReport.repoId} draft`,
      appliesTo: ['TODO: classify domain after DeepWiki/human review'],
    },
    source: {
      kind: 'repo-intake',
      references: [sourceReport.repo],
      notes: 'Draft produced from local route/component scan. Product semantics require human review.',
    },
    lifecycleModel: ['overview', 'policy', 'event', 'artifact', 'operation'],
    pages: sourceReport.routes.map(route => ({
      id: route.id,
      route: route.route,
      title: titleFromRoute(route.route),
      primaryVerb: route.primaryVerb,
      lifecycle: route.lifecycle,
      decisionQuestion: route.decisionQuestion,
      primaryDataObject: route.primaryDataObject,
      layoutIntent: route.layoutIntent,
      routeRole: route.routeRole,
      surfaceRole: route.surfaceRole,
      ...(route.parentRoute ? { parentRoute: route.parentRoute } : {}),
      ...(route.entryAffordance ? { entryAffordance: route.entryAffordance } : {}),
      actions: [],
      linksOut: route.linksOut,
      navigationRationale: 'TODO: explain why this route belongs in navigation and where users go next.',
      businessDensity: route.businessDensity,
    })),
    antiPatterns: [
      {
        id: 'generic-leaf-workspace',
        description: 'Leaf routes named workspace, center, hub, console, or all-in-one hide the real business verb.',
        severity: 'critical',
      },
    ],
  }
}

function buildPagePatternDraft(sourceReport) {
  return {
    version: 1,
    archetypeId: `${sourceReport.repoId}-draft`,
    sourceReferences: [sourceReport.repo],
    patterns: sourceReport.routes.map(route => ({
      id: route.layoutIntent,
      routeRole: route.routeRole,
      layoutIntent: route.layoutIntent,
      decisionQuestion: route.decisionQuestion,
      primaryDataObject: route.primaryDataObject,
      kpiCards: route.anatomy.hasStatCards ? ['TODO: name real KPIs'] : [],
      tableColumns: route.anatomy.hasTables ? ['TODO: extract real columns from rendered table'] : [],
      detailSections: route.routeRole === 'detail' ? route.anatomy.componentTags.slice(0, 8) : [],
      drawerActions: [],
      workflowStates: route.anatomy.stateSignals,
      emptyStateCopy: 'TODO: write domain-specific empty state copy.',
      businessDensity: route.businessDensity.length ? route.businessDensity : ['TODO: add business-density signals'],
      linksOut: route.linksOut,
      expectedForgeComponents: route.anatomy.forgeComponents.length ? route.anatomy.forgeComponents : route.anatomy.componentTags.slice(0, 8),
      forbiddenShortcuts: ['Do not copy component names without translating them into user decisions.'],
    }))
  }
}

function analyzePage(content) {
  const localImports = collectMatches(content, /import\s+[^'"]*from\s+['"](\.\/[^'"]+)['"]/g)
  const routeRefs = collectMatches(content, /\bhref\s*=\s*["']([^"']+)["']|\bto\s*=\s*["']([^"']+)["']|router\.push\(["']([^"']+)["']\)/g)
    .map(value => Array.isArray(value) ? value.find(Boolean) : value)
    .filter(value => value && value.startsWith('/'))
    .map(normalizeRoute)
  const componentTags = unique(collectMatches(content, /<([A-Z][A-Za-z0-9_.$]*)\b/g).map(name => name.split('.')[0]))
  const forgeImport = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]@forge-ui-official\/core['"]/)
  const forgeComponents = forgeImport ? forgeImport[1].split(',').map(part => part.trim().split(/\s+as\s+/)[0]).filter(Boolean) : []
  const stateSignals = unique(collectMatches(content, /\b(loading|empty|saving|saved|error|pending|dirty|hover|selected|active)\b/gi).map(value => value.toLowerCase()))

  return {
    localImports: unique(localImports),
    routeRefs: unique(routeRefs),
    componentTags,
    forgeComponents: unique(forgeComponents),
    stateSignals,
    hasTables: /\b(DataTable|Table|columns\s*=|\bcolumns\s*:)/.test(content),
    hasStatCards: /\b(StatCard|Kpi|KPI|Metric|Summary)/.test(content),
    hasForms: /\b(form|TextField|TextArea|SelectOption|onSubmit|handleSubmit)\b/i.test(content),
    hasTimeline: /\b(Timeline|HistoryItem|Activity|Audit|Log)\b/i.test(content),
    lines: content.split('\n').length,
  }
}

function inferRouteFromPageFile(rel) {
  const normalized = normalize(rel)

  const appMatch = normalized.match(/^(?:src\/)?app\/(.+)\/page\.(tsx|jsx|ts|js)$/)
  if (appMatch) return routeFromSegments(appMatch[1].split('/').filter(Boolean))

  const appRootMatch = normalized.match(/^(?:src\/)?app\/page\.(tsx|jsx|ts|js)$/)
  if (appRootMatch) return '/'

  const srcPageMatch = normalized.match(/^src\/pages\/(.+)\/page\.(tsx|jsx|ts|js)$/)
  if (srcPageMatch) return routeFromSegments(srcPageMatch[1].split('/').filter(Boolean))

  const pagesMatch = normalized.match(/^(?:src\/)?pages\/(.+)\.(tsx|jsx|ts|js)$/)
  if (pagesMatch) return routeFromSegments(pagesMatch[1].split('/').filter(Boolean))

  return null
}

function routeFromSegments(segments) {
  const cleaned = segments
    .filter(segment => segment && !segment.startsWith('(') && !segment.startsWith('_'))
    .map(segment => {
      if (segment === 'index' || segment === 'home') return ''
      if (/^\[.+\]$/.test(segment)) return segment
      return segment
    })
    .filter(segment => segment !== '')
  return normalizeRoute(`/${cleaned.join('/')}`)
}

function frameworkHint(rel) {
  if (/(^|\/)app\//.test(rel)) return 'next-app-router'
  if (/(^|\/)pages\//.test(rel)) return 'pages-router'
  return 'unknown'
}

function collectMatches(content, re) {
  const out = []
  let match
  while ((match = re.exec(content)) !== null) {
    if (match.length > 2) out.push(match.slice(1).filter(Boolean))
    else out.push(match[1])
  }
  return out.flat()
}

function mergeAnatomy(a, b) {
  return {
    localImports: unique([...(a.localImports ?? []), ...(b.localImports ?? [])]),
    routeRefs: unique([...(a.routeRefs ?? []), ...(b.routeRefs ?? [])]),
    componentTags: unique([...(a.componentTags ?? []), ...(b.componentTags ?? [])]),
    forgeComponents: unique([...(a.forgeComponents ?? []), ...(b.forgeComponents ?? [])]),
    stateSignals: unique([...(a.stateSignals ?? []), ...(b.stateSignals ?? [])]),
    hasTables: Boolean(a.hasTables || b.hasTables),
    hasStatCards: Boolean(a.hasStatCards || b.hasStatCards),
    hasForms: Boolean(a.hasForms || b.hasForms),
    hasTimeline: Boolean(a.hasTimeline || b.hasTimeline),
    lines: Math.max(a.lines ?? 0, b.lines ?? 0),
  }
}

function inferBusinessDensity(anatomy) {
  const density = []
  if (anatomy.hasStatCards) density.push('metric summary')
  if (anatomy.hasTables) density.push('scannable rows')
  if (anatomy.hasForms) density.push('action form')
  if (anatomy.hasTimeline) density.push('history or activity')
  if (anatomy.routeRefs.length) density.push('workflow links')
  if (anatomy.stateSignals.length) density.push('state surfaces')
  return density
}

function guessRouteRole(route) {
  if (route === '/') return 'dashboard'
  if (/\/new$|\/create$/.test(route)) return 'wizard'
  if (/\/settings?$|\/config/.test(route)) return 'settings'
  if (/audit|log/.test(route)) return 'audit'
  if (/report|invoice/.test(route)) return route.includes('[') ? 'detail' : 'report'
  if (route.includes('[id]') || /\/:[a-z]/.test(route)) return 'detail'
  if (/board|kanban|tasks/.test(route)) return 'board'
  return 'list'
}

function inferSurfaceConfig(route, role) {
  if (role === 'detail') {
    return {
      surfaceRole: 'detail',
      parentRoute: parentRouteFor(route),
      entryAffordance: 'row_action',
    }
  }
  if (role === 'wizard' || isActionLikeRoute(route)) {
    return {
      surfaceRole: 'action',
      parentRoute: parentRouteFor(route),
      entryAffordance: 'primary_cta',
    }
  }
  return { surfaceRole: 'navigation' }
}

function parentRouteFor(route) {
  const parts = String(route).split('/').filter(Boolean)
  if (parts.length <= 1) return '/'
  return `/${parts.slice(0, -1).join('/')}`
}

function isActionLikeRoute(route) {
  return /\/(new|create|edit|import|export|bulk)$/.test(String(route))
}

function guessPrimaryVerb(route, role) {
  if (role === 'dashboard') return 'prioritize'
  if (role === 'wizard') return 'configure'
  if (role === 'settings') return 'configure'
  if (role === 'audit') return 'audit'
  if (/source|connect|import|intake/.test(route)) return 'connect'
  if (/template|rule|policy/.test(route)) return route.includes('[id]') ? 'inspect' : 'govern'
  if (/run|job|scan/.test(route)) return route.includes('[id]') ? 'diagnose' : 'monitor'
  if (/issue|risk|ticket|case/.test(route)) return route.includes('[id]') ? 'repair' : 'triage'
  if (/report|invoice/.test(route)) return route.includes('[id]') ? 'review' : 'publish'
  if (/approval/.test(route)) return 'decide'
  if (role === 'detail') return 'inspect'
  return 'browse'
}

function guessLifecycle(verb, role) {
  if (role === 'dashboard') return 'overview'
  if (['govern', 'configure'].includes(verb) && role !== 'wizard') return 'policy'
  if (['monitor', 'diagnose', 'audit'].includes(verb)) return 'event'
  if (['connect', 'publish', 'review'].includes(verb)) return 'artifact'
  if (['triage', 'repair', 'decide'].includes(verb) || role === 'wizard') return 'operation'
  return 'operation'
}

function guessPrimaryDataObject(route) {
  const parts = route.split('/').filter(Boolean).filter(part => !part.startsWith('[') && !part.startsWith(':'))
  const last = parts[parts.length - 1] || 'program'
  return singularize(last)
}

function guessLayoutIntent(role, verb) {
  const byRole = {
    dashboard: 'hero-overview',
    wizard: 'wizard-multi-step',
    settings: 'settings-grouped',
    audit: 'audit-stream',
    board: 'kanban-board-with-row-actions',
    report: 'report-registry',
  }
  if (byRole[role]) return byRole[role]
  if (role === 'detail' && verb === 'repair') return 'split-pane-diff-repair'
  if (role === 'detail') return 'tabbed-detail-with-related'
  return 'list-with-filters-and-bulk'
}

function routeToId(route) {
  if (route === '/') return 'dashboard'
  return route
    .replace(/^\//, '')
    .replace(/\[|\]|:/g, '')
    .replace(/\//g, '-')
    .replace(/[^a-zA-Z0-9-]+/g, '-')
}

function titleFromRoute(route) {
  if (route === '/') return 'Dashboard'
  return route
    .split('/')
    .filter(Boolean)
    .filter(part => !part.startsWith('[') && !part.startsWith(':'))
    .map(word => word.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()))
    .join(' / ')
}

function singularize(value) {
  if (value.endsWith('ies')) return `${value.slice(0, -3)}y`
  if (value.endsWith('ses')) return value.slice(0, -2)
  if (value.endsWith('s') && value.length > 3) return value.slice(0, -1)
  return value
}

function dedupeByRoute(items) {
  const seen = new Set()
  const out = []
  for (const item of items) {
    if (seen.has(item.route)) continue
    seen.add(item.route)
    out.push(item)
  }
  return out
}

function normalizeRoute(route) {
  const clean = String(route).replace(/\/+/g, '/').replace(/\/$/, '')
  return clean || '/'
}

function routeSortKey(route) {
  return route === '/' ? '' : route
}

function normalize(path) {
  return path.split(sep).join('/')
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'reference'
}

function renderReadme(sourceReport) {
  return `# Repo Intake: ${sourceReport.repoId}

Source: \`${sourceReport.repo}\`

Generated:

- \`repo-intake-report.json\`: local scan facts
- \`ia-draft.json\`: IA draft, requires product review
- \`page-pattern-draft.json\`: page-pattern draft, requires product review

## Review Checklist

1. Keep intake in an A-tier batch of 5-10 repos. Do not install packages, run
   builds, or perform line-by-line source analysis.
2. Extract only IA artifact, page pattern, business workflow, and ForgeUI gap
   learnings. The goal is product design depth, not source reuse.
3. Open the project or DeepWiki summary and confirm which routes are real
   product routes versus demo/showcase routes.
4. Rewrite every \`decisionQuestion\`.
5. Replace TODO \`businessDensity\` with concrete domain signals.
6. Delete routes that are auth-only, marketing-only, docs-only, or framework
   utility pages.
7. Only then promote drafts into \`samples/ia/\` and \`samples/page-patterns/\`.
8. Delete temporary clones after promoted artifacts are retained.
`
}
