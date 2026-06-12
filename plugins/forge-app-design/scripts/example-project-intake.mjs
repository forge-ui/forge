#!/usr/bin/env node
/**
 * Lightweight intake for already-written Forge/admin example projects.
 *
 * The goal is not to archive source code. It extracts enough precedent metadata
 * for forge-app-design to pick relevant examples before a fresh run.
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginRoot = resolve(__dirname, '..')
const defaultOutDir = join(pluginRoot, 'precedents')
const registryPath = join(pluginRoot, 'references', 'component-registry.json')

const { values } = parseArgs({
  options: {
    source: { type: 'string' },
    id: { type: 'string' },
    domain: { type: 'string' },
    title: { type: 'string' },
    screenshots: { type: 'string' },
    'copy-screenshots': { type: 'boolean', default: false },
    'out-dir': { type: 'string', default: defaultOutDir },
    json: { type: 'boolean', default: false },
  },
})

if (!values.source) {
  process.stderr.write('Usage: node scripts/example-project-intake.mjs --source <project-dir> --id <slug> [--domain <domain>] [--screenshots a.png,b.png] [--copy-screenshots]\n')
  process.exit(2)
}

const source = resolve(values.source)
if (!existsSync(source)) {
  process.stderr.write(`Example source does not exist: ${source}\n`)
  process.exit(2)
}

const id = slug(values.id || basename(source))
const outDir = resolve(values['out-dir'])
const targetDir = join(outDir, id)
mkdirSync(targetDir, { recursive: true })

const componentNames = readComponentNames()
const files = collectProjectFiles(source)
const packageJson = readJson(join(source, 'package.json'))
const pageFiles = files.filter(file => /(^|\/)(app|pages)\/.*\.(tsx|jsx|ts|js)$/.test(file) && /\/page\.(tsx|jsx|ts|js)$|pages\/.*\.(tsx|jsx|ts|js)$/.test(file))
const routes = pageFiles.map(file => routeFromFile(file)).filter(Boolean)
const componentUsage = collectComponentUsage(files, componentNames)
const screenshots = processScreenshots(values.screenshots, targetDir)

const artifact = {
  version: 1,
  id,
  title: values.title || humanize(id),
  domain: values.domain || inferDomain(id, routes),
  source: {
    path: source,
    packageName: packageJson?.name ?? null,
    dependencies: pickForgeDependencies(packageJson),
  },
  summary: {
    routeCount: routes.length,
    sourceFilesScanned: files.length,
    forgeComponentsUsed: componentUsage.used.length,
    screenshots: screenshots.length,
  },
  routes,
  componentUsage,
  screenshots,
  reusableLessons: inferLessons(routes, componentUsage),
  antiPatternsToAvoid: inferAntiPatterns(routes, componentUsage),
}

const jsonPath = join(targetDir, 'metadata.json')
const mdPath = join(targetDir, 'README.md')
writeFileSync(jsonPath, JSON.stringify(artifact, null, 2) + '\n')
writeFileSync(mdPath, renderMarkdown(artifact) + '\n')
updateIndex(outDir, artifact)

if (values.json) {
  process.stdout.write(JSON.stringify(artifact, null, 2) + '\n')
} else {
  process.stdout.write(`Example project intake: ${id}\n`)
  process.stdout.write(`- Routes: ${artifact.summary.routeCount}\n`)
  process.stdout.write(`- Forge components: ${artifact.summary.forgeComponentsUsed}\n`)
  process.stdout.write(`- Output: ${jsonPath}\n`)
}

function collectProjectFiles(root) {
  const result = []
  const skipDirs = new Set(['.git', '.next', 'node_modules', 'dist', 'build', 'coverage', '.turbo'])
  const roots = ['app', 'src', 'pages', 'components']

  for (const name of roots) {
    const dir = join(root, name)
    if (existsSync(dir)) walk(dir)
  }

  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      if (skipDirs.has(entry)) continue
      const full = join(dir, entry)
      const stat = statSync(full)
      if (stat.isDirectory()) {
        walk(full)
      } else if (/\.(tsx|jsx|ts|js|md|json)$/.test(entry)) {
        result.push(relative(root, full))
      }
    }
  }

  return result.sort()
}

function routeFromFile(file) {
  if (file.startsWith('app/')) {
    const route = file
      .replace(/^app\//, '/')
      .replace(/\/page\.(tsx|jsx|ts|js)$/, '')
      .replace(/\/\(.*?\)/g, '')
      .replace(/\/+/g, '/')
    return normalizeRoute(route)
  }
  if (file.startsWith('src/app/')) {
    const route = file
      .replace(/^src\/app\//, '/')
      .replace(/\/page\.(tsx|jsx|ts|js)$/, '')
      .replace(/\/\(.*?\)/g, '')
      .replace(/\/+/g, '/')
    return normalizeRoute(route)
  }
  if (file.startsWith('pages/')) {
    const route = file
      .replace(/^pages\//, '/')
      .replace(/\/index\.(tsx|jsx|ts|js)$/, '')
      .replace(/\.(tsx|jsx|ts|js)$/, '')
      .replace(/\/+/g, '/')
    return normalizeRoute(route)
  }
  return null
}

function normalizeRoute(route) {
  if (!route || route === '/') return {
    route: '/',
    pageRole: 'dashboard',
    evidence: ['root route'],
  }
  const normalized = route.replace(/\/$/, '') || '/'
  return {
    route: normalized,
    pageRole: inferPageRole(normalized),
    evidence: routeEvidence(normalized),
  }
}

function inferPageRole(route) {
  if (route === '/') return 'dashboard'
  if (/\[(id|slug|.+)\]/.test(route) && /(new|create|edit|import|export|bulk)/.test(route)) return 'action'
  if (/\[(id|slug|.+)\]/.test(route)) return 'detail'
  if (/(login|register|forgot-password|reset-password|auth)/.test(route)) return 'auth'
  if (/(dashboard|overview|home)/.test(route)) return 'dashboard'
  if (/(new|create|edit|import|export|bulk|setup|wizard)/.test(route)) return 'action'
  if (/(^|\/)(board|kanban|workflow|pipeline|lane)(\/|$)/.test(route)) return 'workflow'
  if (/(settings|config|preferences)/.test(route)) return 'settings'
  return 'list'
}

function routeEvidence(route) {
  const evidence = []
  if (/\[(id|slug|.+)\]/.test(route)) evidence.push('dynamic detail segment')
  if (/(login|register|forgot-password|reset-password|auth)/.test(route)) evidence.push('auth route keyword')
  if (/(dashboard|overview|home)/.test(route)) evidence.push('dashboard route keyword')
  if (/(new|create|edit|import|export|bulk|setup|wizard)/.test(route)) evidence.push('action route keyword')
  if (/(^|\/)(board|kanban|workflow|pipeline|lane)(\/|$)/.test(route)) evidence.push('workflow route keyword')
  if (evidence.length === 0) evidence.push('route naming')
  return evidence
}

function collectComponentUsage(files, componentNames) {
  const usage = new Map()
  const imports = new Map()
  for (const file of files) {
    if (!/\.(tsx|jsx|ts|js)$/.test(file)) continue
    const content = safeRead(join(source, file))
    for (const name of collectForgeImports(content)) {
      const current = imports.get(name) ?? { files: [] }
      if (current.files.length < 8) current.files.push(file)
      imports.set(name, current)
    }
    for (const name of componentNames) {
      const pattern = new RegExp(`\\b${name}\\b`)
      if (!pattern.test(content)) continue
      const current = usage.get(name) ?? { count: 0, files: [] }
      current.count += countMatches(content, name)
      if (current.files.length < 8) current.files.push(file)
      usage.set(name, current)
    }
  }

  const used = Array.from(usage.entries())
    .map(([name, detail]) => ({ name, ...detail }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  const missingFromRegistry = Array.from(imports.entries())
    .filter(([name]) => !componentNames.has(name))
    .map(([name, detail]) => ({ name, ...detail }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    usesForgePackage: Boolean(packageJsonUsesForge()),
    used,
    missingFromRegistry,
  }
}

function collectForgeImports(content) {
  const names = new Set()
  const matches = content.matchAll(/import\s+(?:type\s+)?\{([\s\S]*?)\}\s+from\s+["']@forge-ui-official\/core["']/g)
  for (const match of matches) {
    for (const raw of match[1].split(',')) {
      const name = raw
        .trim()
        .replace(/\s+as\s+.+$/, '')
        .trim()
      if (/^[A-Z][A-Za-z0-9_]*$/.test(name)) names.add(name)
    }
  }
  return names
}

function packageJsonUsesForge() {
  const deps = pickForgeDependencies(packageJson)
  return Object.keys(deps.dependencies).length > 0 || Object.keys(deps.devDependencies).length > 0
}

function pickForgeDependencies(pkg) {
  if (!pkg) return { dependencies: {}, devDependencies: {} }
  return {
    dependencies: Object.fromEntries(Object.entries(pkg.dependencies ?? {}).filter(([name]) => name.includes('forge'))),
    devDependencies: Object.fromEntries(Object.entries(pkg.devDependencies ?? {}).filter(([name]) => name.includes('forge'))),
  }
}

function processScreenshots(raw, targetDir) {
  if (!raw) return []
  const screenshotDir = join(targetDir, 'screenshots')
  const items = raw.split(',').map(item => item.trim()).filter(Boolean)
  if (items.length && values['copy-screenshots']) mkdirSync(screenshotDir, { recursive: true })

  return items.map(item => {
    const absolute = resolve(item)
    const record = {
      source: absolute,
      copiedTo: null,
      exists: existsSync(absolute),
    }
    if (record.exists && values['copy-screenshots']) {
      const dest = join(screenshotDir, basename(absolute))
      copyFileSync(absolute, dest)
      record.copiedTo = relative(pluginRoot, dest)
    }
    return record
  })
}

function readComponentNames() {
  const registry = readJson(registryPath)
  return new Set((registry?.components ?? []).map(item => item.name))
}

function updateIndex(outDir, artifact) {
  mkdirSync(outDir, { recursive: true })
  const indexPath = join(outDir, 'index.json')
  const index = readJson(indexPath) ?? { version: 1, precedents: [] }
  index.precedents = [
    ...index.precedents.filter(item => item.id !== artifact.id),
    {
      id: artifact.id,
      title: artifact.title,
      domain: artifact.domain,
      routeCount: artifact.summary.routeCount,
      forgeComponentsUsed: artifact.summary.forgeComponentsUsed,
      artifact: relative(pluginRoot, join(outDir, artifact.id, 'metadata.json')),
    },
  ].sort((a, b) => a.id.localeCompare(b.id))
  writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n')
}

function inferLessons(routes, componentUsage) {
  const roles = new Set(routes.map(route => route.pageRole))
  const lessons = []
  if (roles.has('dashboard')) lessons.push('Use dashboard as priority and navigation surface, not as the only workspace.')
  if (roles.has('list')) lessons.push('Keep list pages dense: toolbar, table header, first rows, and row actions visible in first viewport.')
  if (roles.has('detail')) lessons.push('Detail pages need evidence, status, related context, and next workflow entry.')
  if (roles.has('action')) lessons.push('Action pages should group forms and keep save/error/success feedback local.')
  if (componentUsage.used.some(item => item.name === 'AppLayout')) lessons.push('Reuse AppLayout chrome instead of rebuilding sidebar/topbar/profile per page.')
  if (componentUsage.used.some(item => item.name === 'DataTable')) lessons.push('Map field shapes to DataTable cell primitives before custom cell JSX.')
  return lessons.length ? lessons : ['Use as product/domain precedent only; component semantics need manual review.']
}

function inferAntiPatterns(routes, componentUsage) {
  const issues = []
  if (!componentUsage.usesForgePackage) issues.push('Does not declare a Forge package dependency; use only as product/layout precedent.')
  if (!componentUsage.used.some(item => item.name === 'AppLayout')) issues.push('No AppLayout usage detected; do not copy shell/chrome literally.')
  if (componentUsage.missingFromRegistry.length) issues.push('Some imported Forge components are missing from the registry; update the registry before reusing component choices literally.')
  if (routes.length <= 1) issues.push('Single-page example; do not infer full IA depth from it.')
  return issues
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

function safeRead(file) {
  try {
    return readFileSync(file, 'utf8')
  } catch {
    return ''
  }
}

function countMatches(content, name) {
  return content.match(new RegExp(`\\b${name}\\b`, 'g'))?.length ?? 0
}

function renderMarkdown(artifact) {
  const lines = []
  lines.push(`# ${artifact.title}`)
  lines.push('')
  lines.push(`- Domain: ${artifact.domain}`)
  lines.push(`- Source: \`${artifact.source.path}\``)
  lines.push(`- Routes: ${artifact.summary.routeCount}`)
  lines.push(`- Forge components used: ${artifact.summary.forgeComponentsUsed}`)
  lines.push('')
  lines.push('## Routes')
  lines.push('')
  for (const route of artifact.routes) {
    lines.push(`- \`${route.route}\`: ${route.pageRole}`)
  }
  lines.push('')
  lines.push('## Top Components')
  lines.push('')
  for (const item of artifact.componentUsage.used.slice(0, 12)) {
    lines.push(`- ${item.name}: ${item.count}`)
  }
  if (artifact.componentUsage.missingFromRegistry.length) {
    lines.push('')
    lines.push('## Missing Registry Entries')
    lines.push('')
    for (const item of artifact.componentUsage.missingFromRegistry) {
      lines.push(`- ${item.name}: ${item.files.join(', ')}`)
    }
  }
  lines.push('')
  lines.push('## Reusable Lessons')
  lines.push('')
  for (const lesson of artifact.reusableLessons) lines.push(`- ${lesson}`)
  lines.push('')
  lines.push('## Anti-Patterns To Avoid')
  lines.push('')
  for (const issue of artifact.antiPatternsToAvoid) lines.push(`- ${issue}`)
  return lines.join('\n')
}

function slug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'example-project'
}

function humanize(value) {
  return String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
}

function inferDomain(id, routes) {
  const joined = `${id} ${routes.map(route => route.route).join(' ')}`
  if (/gym|member|class|fitness/.test(joined)) return 'fitness-membership'
  if (/restaurant|menu|merchant|dining|order/.test(joined)) return 'restaurant-operations'
  if (/credit|card|risk|finance|billing/.test(joined)) return 'financial-saas'
  if (/crm|customer|sales|lead/.test(joined)) return 'crm'
  return 'admin-operations'
}
