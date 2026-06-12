#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginRoot = resolve(__dirname, '..')
const repoRoot = resolve(pluginRoot, '..', '..')

const registryPath = join(pluginRoot, 'references', 'component-registry.json')
const mirrorPath = join(pluginRoot, 'references', 'component-registry-lite.json')
const coreIndexPaths = [
  join(repoRoot, 'core', 'src', 'components', 'ui', 'index.ts'),
  join(repoRoot, 'core', 'src', 'components', 'layouts', 'index.ts'),
]

const requiredTopLevel = [
  'version',
  'purpose',
  'maintenance',
  'exportCoverage',
  'generationPriority',
  'components',
]

const requiredComponentFields = [
  'name',
  'category',
  'import',
  'responsive',
  'density',
  'recommendedFor',
  'avoidFor',
  'constraints',
  'source',
]

const allowedResponsive = new Set([
  'layout-shell',
  'fills-parent',
  'intrinsic-with-parent-wrap',
  'table-row-contained',
  'fills-form-group',
  'content-sized',
])

const issues = []
const warnings = []

const registry = readJson(registryPath)
const mirror = readJson(mirrorPath)

if (!registry) {
  fail(`missing or invalid registry: ${registryPath}`)
} else {
  validateTopLevel(registry)
  validateMirror(registry, mirror)
  validateComponents(registry)
}

const summary = {
  components: registry?.components?.length ?? 0,
  issues: issues.length,
  warnings: warnings.length,
}

if (issues.length) {
  console.error(`Component registry validation failed: ${summary.issues} issue(s), ${summary.warnings} warning(s)`)
  for (const issue of issues) console.error(`[FAIL] ${issue}`)
  for (const warning of warnings) console.error(`[WARN] ${warning}`)
  process.exit(1)
}

console.log(`Component registry validation: ${summary.components} components, ${summary.issues} issues, ${summary.warnings} warnings`)
for (const warning of warnings) console.log(`[WARN] ${warning}`)

function validateTopLevel(data) {
  for (const key of requiredTopLevel) {
    if (!(key in data)) fail(`missing top-level field: ${key}`)
  }
  if (!Array.isArray(data.components) || data.components.length === 0) {
    fail('components must be a non-empty array')
  }
  if (!data.maintenance?.sourceOfTruth?.endsWith('component-registry.json')) {
    fail('maintenance.sourceOfTruth must point to component-registry.json')
  }
  if (!Array.isArray(data.exportCoverage?.deferredExports)) {
    fail('exportCoverage.deferredExports must document core exports that are not direct-generation registry entries')
  }
}

function validateMirror(data, mirrorData) {
  if (!mirrorData) {
    fail(`missing or invalid compatibility mirror: ${mirrorPath}`)
    return
  }
  const primary = stableStringify(data)
  const mirrorText = stableStringify(mirrorData)
  if (primary !== mirrorText) {
    fail('component-registry-lite.json must remain an exact compatibility mirror of component-registry.json')
  }
}

function validateComponents(data) {
  const coreExports = readCoreExports()
  const names = new Set()
  const deferredExports = new Set()

  for (const item of data.exportCoverage?.deferredExports ?? []) {
    if (!item?.name) {
      fail('exportCoverage.deferredExports entries must include name')
      continue
    }
    if (deferredExports.has(item.name)) fail(`duplicate deferred export: ${item.name}`)
    deferredExports.add(item.name)
    if (!item.reason) fail(`${item.name}: deferred export must include reason`)
  }

  for (const component of data.components) {
    const label = component?.name ?? '<unnamed>'

    if (!component || typeof component !== 'object') {
      fail('component entry must be an object')
      continue
    }

    if (names.has(label)) fail(`duplicate component name: ${label}`)
    names.add(label)

    for (const field of requiredComponentFields) {
      if (!(field in component)) fail(`${label}: missing required field ${field}`)
    }

    if (component.id && component.id !== component.name) {
      warn(`${label}: id differs from name; keep them aligned unless there is a migration reason`)
    }

    if (!component.import || component.import.from !== '@forge-ui-official/core' || component.import.name !== component.name) {
      fail(`${label}: import must be {"from":"@forge-ui-official/core","name":"${label}"}`)
    }

    if (!coreExports.has(label)) {
      fail(`${label}: not exported from core UI/layout indexes`)
    }

    assertNonEmptyArray(component.recommendedFor, `${label}: recommendedFor`)
    if (!Array.isArray(component.avoidFor)) fail(`${label}: avoidFor must be an array`)
    assertNonEmptyArray(component.constraints, `${label}: constraints`)

    if (!allowedResponsive.has(component.responsive)) {
      fail(`${label}: responsive must be one of ${Array.from(allowedResponsive).join(', ')}`)
    }

    if (typeof component.category !== 'string' || component.category.trim() === '') {
      fail(`${label}: category must be a non-empty string`)
    }

    if (typeof component.density !== 'string' || component.density.trim() === '') {
      fail(`${label}: density must be a non-empty string`)
    }

    if (component.source && !sourceLooksOwned(component.source)) {
      warn(`${label}: source does not look like a core-owned path: ${component.source}`)
    }
  }

  for (const exportName of Array.from(coreExports).sort()) {
    if (!names.has(exportName) && !deferredExports.has(exportName)) {
      fail(`${exportName}: exported from core but missing from both components and exportCoverage.deferredExports`)
    }
  }

  for (const exportName of Array.from(deferredExports).sort()) {
    if (names.has(exportName)) fail(`${exportName}: cannot be both a registry component and a deferred export`)
    if (!coreExports.has(exportName)) fail(`${exportName}: listed as deferred export but not exported from core`)
  }

  for (const group of ['tableCell', 'listToolbar', 'dashboardCard', 'railItem', 'form']) {
    const values = data.generationPriority?.[group]
    if (!Array.isArray(values) || values.length === 0) {
      fail(`generationPriority.${group} must be a non-empty array`)
      continue
    }
    for (const name of values) {
      if (!names.has(name)) fail(`generationPriority.${group} references missing component ${name}`)
    }
  }
}

function readCoreExports() {
  const exports = new Set()
  for (const file of coreIndexPaths) {
    if (!existsSync(file)) {
      fail(`missing core export index: ${file}`)
      continue
    }
    const content = readFileSync(file, 'utf8')
    collectNamedExports(content, exports)
  }
  return exports
}

function collectNamedExports(content, exports) {
  const exportBlocks = content.matchAll(/export\s*\{([\s\S]*?)\}\s*from\s*["'][^"']+["']/g)
  for (const match of exportBlocks) {
    const names = match[1]
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
      .map(item => item.replace(/\s+as\s+.+$/, '').trim())
    for (const name of names) {
      if (name && /^[A-Z][A-Za-z0-9_]*$/.test(name)) exports.add(name)
    }
  }
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

function assertNonEmptyArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) fail(`${label} must be a non-empty array`)
}

function sourceLooksOwned(source) {
  return /^core\/src\/components\/(ui|layouts)\//.test(source)
}

function stableStringify(value) {
  return JSON.stringify(value, sortKeys, 2)
}

function sortKeys(_key, value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value
  return Object.keys(value)
    .sort()
    .reduce((acc, key) => {
      acc[key] = value[key]
      return acc
    }, {})
}

function fail(message) {
  issues.push(message)
}

function warn(message) {
  warnings.push(message)
}
