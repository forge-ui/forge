/**
 * IA gate — validates generated IA route maps.
 *
 * Default mode is non-breaking: if IA-ROUTE-MAP.json is absent, no checks are
 * emitted. Pass --strict-ia from quality-eval to make the file mandatory.
 */

import { existsSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const FORBIDDEN_LEAF_TERMS = ['workspace', 'center', 'hub', 'console', 'all-in-one']
const ACTION_ROUTE_SEGMENTS = new Set(['new', 'create', 'edit', 'import', 'export', 'bulk'])
const VALID_SURFACE_ROLES = new Set(['navigation', 'action', 'detail'])
const VALID_ENTRY_AFFORDANCES = new Set(['primary_cta', 'row_action', 'toolbar', 'empty_state_cta'])
const REQUIRED_PAGE_FIELDS = [
  'route',
  'primaryVerb',
  'lifecycle',
  'decisionQuestion',
  'primaryDataObject',
  'surfaceRole',
  'linksOut',
]

export function checkIaGate(targetDir, files, options = {}) {
  const strict = Boolean(options.strict)
  const mapPath = join(targetDir, 'IA-ROUTE-MAP.json')
  if (!existsSync(mapPath)) {
    if (!strict) return []
    return [
      critical('ia-route-map-present', 'IA-ROUTE-MAP.json is required in strict IA mode', []),
    ]
  }

  const results = []
  let map
  try {
    map = JSON.parse(readFileSync(mapPath, 'utf8'))
  } catch (error) {
    return [
      critical('ia-route-map-json', `IA-ROUTE-MAP.json must be valid JSON: ${error.message}`, [relative(targetDir, mapPath)]),
    ]
  }

  const pages = Array.isArray(map.pages) ? map.pages : []
  const routes = new Set(pages.map(page => page.route).filter(Boolean))
  const routeToPage = new Map(pages.map(page => [page.route, page]).filter(([route]) => Boolean(route)))
  const appRoutes = new Set(files.filter(file => /\/app\/.*\/?page\.tsx$/.test(file)).map(file => routeFromPageFile(targetDir, file)))

  results.push(checkMissingFields(targetDir, mapPath, pages))
  results.push(checkSurfaceRoles(targetDir, mapPath, pages))
  results.push(checkNavigationEligibility(targetDir, mapPath, pages, routeToPage))
  results.push(checkActionLikeRoutes(targetDir, mapPath, pages))
  results.push(checkSidebarEligibility(targetDir, mapPath, pages))
  results.push(checkForbiddenLeafRoutes(targetDir, mapPath, pages))
  results.push(checkCrossLifecycleActions(targetDir, mapPath, pages))
  results.push(checkRouteCoverage(targetDir, mapPath, routes, appRoutes))
  results.push(checkLinksOut(targetDir, mapPath, pages, routes))

  return results
}

function checkMissingFields(targetDir, mapPath, pages) {
  const hits = []
  pages.forEach((page, index) => {
    for (const field of REQUIRED_PAGE_FIELDS) {
      if (page[field] == null || page[field] === '' || (Array.isArray(page[field]) && field !== 'linksOut' && page[field].length === 0)) {
        hits.push(`${relative(targetDir, mapPath)}:pages[${index}].${field}`)
      }
    }
  })

  return {
    level: 'IA',
    name: 'ia-required-page-fields',
    description: 'Every IA page needs route, primaryVerb, lifecycle, decisionQuestion, primaryDataObject, surfaceRole, and linksOut',
    status: hits.length ? 'critical' : 'pass',
    files: hits,
    repairHint: hits.length
      ? 'Fill the missing IA fields before code generation. Do not infer them from page.tsx after the fact.'
      : undefined,
  }
}

function checkSurfaceRoles(targetDir, mapPath, pages) {
  const hits = []
  pages.forEach((page, index) => {
    if (!VALID_SURFACE_ROLES.has(page.surfaceRole)) {
      hits.push(`${relative(targetDir, mapPath)}:pages[${index}].surfaceRole:${page.surfaceRole ?? '<missing>'}`)
    }
    if (page.entryAffordance != null && !VALID_ENTRY_AFFORDANCES.has(page.entryAffordance)) {
      hits.push(`${relative(targetDir, mapPath)}:pages[${index}].entryAffordance:${page.entryAffordance}`)
    }
  })

  return {
    level: 'IA',
    name: 'ia-surface-role-valid',
    description: 'surfaceRole must be navigation, action, or detail; entryAffordance must use the known affordance enum',
    status: hits.length ? 'critical' : 'pass',
    files: hits,
    repairHint: hits.length
      ? 'Declare surfaceRole explicitly. Use navigation only for sidebar-worthy destinations; use action/detail for transient or parent-entered routes.'
      : undefined,
  }
}

function checkNavigationEligibility(targetDir, mapPath, pages, routeToPage) {
  const hits = []
  for (const page of pages) {
    if (page.surfaceRole === 'navigation') continue

    if (!page.parentRoute) {
      hits.push(`${relative(targetDir, mapPath)}:${page.route}:missing-parentRoute`)
    }
    if (!page.entryAffordance) {
      hits.push(`${relative(targetDir, mapPath)}:${page.route}:missing-entryAffordance`)
    }

    if (!page.parentRoute) continue
    const parent = routeToPage.get(page.parentRoute)
    if (!parent) {
      hits.push(`${relative(targetDir, mapPath)}:${page.route}:unknown-parentRoute:${page.parentRoute}`)
      continue
    }
    if (parent.surfaceRole !== 'navigation') {
      hits.push(`${relative(targetDir, mapPath)}:${page.route}:parent-not-navigation:${page.parentRoute}`)
    }
  }

  return {
    level: 'IA',
    name: 'ia-nonnavigation-entry-bound',
    description: 'Action/detail routes must bind to a navigation parent and describe how users enter them',
    status: hits.length ? 'critical' : 'pass',
    files: hits,
    repairHint: hits.length
      ? 'Add parentRoute pointing at a navigation page and entryAffordance such as primary_cta or row_action. Do not promote action/detail routes into sidebar.'
      : undefined,
  }
}

function checkActionLikeRoutes(targetDir, mapPath, pages) {
  const hits = []
  for (const page of pages) {
    if (page.surfaceRole !== 'navigation') continue
    const segments = String(page.route ?? '').split('/').filter(Boolean)
    const leaf = segments.at(-1)
    if (leaf && ACTION_ROUTE_SEGMENTS.has(leaf.toLowerCase())) {
      hits.push(`${relative(targetDir, mapPath)}:${page.route}`)
    }
  }

  return {
    level: 'IA',
    name: 'ia-action-like-route-not-navigation',
    description: 'Routes ending in new/create/edit/import/export/bulk are action surfaces, not sidebar navigation',
    status: hits.length ? 'critical' : 'pass',
    files: hits,
    repairHint: hits.length
      ? 'Change the route surfaceRole to action, bind it to parentRoute, and expose it via a CTA/toolbar/empty-state action on the parent page.'
      : undefined,
  }
}

function checkSidebarEligibility(targetDir, mapPath, pages) {
  const layoutPath = join(targetDir, 'app/layout.tsx')
  if (!existsSync(layoutPath)) {
    return {
      level: 'IA',
      name: 'ia-sidebar-only-navigation',
      description: 'Sidebar menu should include navigation routes only',
      status: 'pass',
      files: [],
    }
  }

  const layout = readFileSync(layoutPath, 'utf8')
  const hits = []
  for (const page of pages) {
    if (page.surfaceRole === 'navigation') continue
    if (routeInMenu(layout, page.route)) {
      hits.push(`${relative(targetDir, layoutPath)}:${page.route}`)
    }
  }

  return {
    level: 'IA',
    name: 'ia-sidebar-only-navigation',
    description: 'Sidebar menu should include navigation routes only',
    status: hits.length ? 'critical' : 'pass',
    files: hits,
    repairHint: hits.length
      ? 'Remove action/detail routes from AppLayout menu items. They should be reachable from parent page CTAs, row actions, or contextual links.'
      : undefined,
  }
}

function checkForbiddenLeafRoutes(targetDir, mapPath, pages) {
  const childPrefixes = new Set()
  for (const page of pages) {
    const route = page.route
    if (!route || route === '/') continue
    const segments = route.split('/').filter(Boolean)
    for (let i = 1; i < segments.length; i += 1) {
      childPrefixes.add(`/${segments.slice(0, i).join('/')}`)
    }
  }

  const hits = []
  for (const page of pages) {
    const route = page.route
    if (!route || route === '/' || page.routeRole === 'dashboard') continue
    const isLeaf = !childPrefixes.has(route)
    if (!isLeaf) continue
    const lower = route.toLowerCase()
    if (FORBIDDEN_LEAF_TERMS.some(term => lower.includes(term))) {
      hits.push(`${relative(targetDir, mapPath)}:${route}`)
    }
  }

  return {
    level: 'IA',
    name: 'ia-forbidden-leaf-route',
    description: 'Leaf routes must not hide business intent behind workspace/center/hub/console/all-in-one',
    status: hits.length ? 'critical' : 'pass',
    files: hits,
    repairHint: hits.length
      ? 'Rename the leaf route to a domain noun or action route, then update linksOut. Dashboard/control-tower roots are allowed.'
      : undefined,
  }
}

function checkCrossLifecycleActions(targetDir, mapPath, pages) {
  const hits = []
  for (const page of pages) {
    const ownLifecycle = page.lifecycle
    const actionLifecycles = new Set((page.actions ?? [])
      .filter(action => action.kind !== 'read')
      .map(action => action.lifecycle)
      .filter(Boolean))
    actionLifecycles.delete(ownLifecycle)
    actionLifecycles.delete('overview')
    if (actionLifecycles.size >= 2) hits.push(`${relative(targetDir, mapPath)}:${page.route}`)
  }

  return {
    level: 'IA',
    name: 'ia-cross-lifecycle-actions',
    description: 'A page may have related read links, but must not own actions across multiple unrelated lifecycle stages',
    status: hits.length ? 'critical' : 'pass',
    files: hits,
    repairHint: hits.length
      ? 'Split cross-lifecycle write/admin actions into separate routes. Keep the current page focused on one primary business decision.'
      : undefined,
  }
}

function checkRouteCoverage(targetDir, mapPath, routes, appRoutes) {
  const missingInIa = [...appRoutes].filter(route => !routes.has(route) && route !== '/api')
  const files = missingInIa.map(route => `${relative(targetDir, mapPath)}:${route}`)

  return {
    level: 'IA',
    name: 'ia-covers-app-routes',
    description: 'IA route map should cover implemented app routes',
    status: files.length ? 'critical' : 'pass',
    files,
    repairHint: files.length
      ? 'Add missing implemented routes to IA-ROUTE-MAP.json or remove unintended pages before delivery.'
      : undefined,
  }
}

function checkLinksOut(targetDir, mapPath, pages, routes) {
  const hits = []
  for (const page of pages) {
    const links = Array.isArray(page.linksOut) ? page.linksOut : []
    if (page.route !== '/' && page.routeRole !== 'audit' && links.length === 0) {
      hits.push(`${relative(targetDir, mapPath)}:${page.route}:empty-linksOut`)
      continue
    }
    for (const link of links) {
      if (!routes.has(link) && !isParameterizedLink(link, routes)) {
        hits.push(`${relative(targetDir, mapPath)}:${page.route}:linksOut:${link}`)
      }
    }
  }

  return {
    level: 'IA',
    name: 'ia-links-out-valid',
    description: 'linksOut should point to known IA routes and non-terminal pages should link onward',
    status: hits.length ? 'warn' : 'pass',
    files: hits,
    repairHint: hits.length
      ? 'Update linksOut so each non-terminal page has a clear next lifecycle route. Use parameterized routes like /issues/[id] when needed.'
      : undefined,
  }
}

function isParameterizedLink(link, routes) {
  for (const route of routes) {
    const pattern = `^${route.replace(/\[[^\]]+\]/g, '[^/]+')}$`
    if (new RegExp(pattern).test(link)) return true
  }
  return false
}

function routeFromPageFile(targetDir, file) {
  const rel = relative(targetDir, file).split('\\').join('/')
  const match = rel.match(/^app\/(.+)\/page\.tsx$/)
  if (!match) return '/'
  const segments = match[1]
    .split('/')
    .filter(Boolean)
    .filter(segment => !segment.startsWith('(') && !segment.startsWith('_'))
  return segments.length ? `/${segments.join('/')}` : '/'
}

function routeInMenu(layout, route) {
  const escapedRoute = escapeRegExp(String(route))
  return new RegExp(`href["']?\\s*[:=]\\s*["']${escapedRoute}["']`).test(layout)
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function critical(name, description, files) {
  return {
    level: 'IA',
    name,
    description,
    status: 'critical',
    files,
    repairHint: 'Create a valid IA-ROUTE-MAP.json before running product page generation.',
  }
}
