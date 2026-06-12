#!/usr/bin/env node
/**
 * Validates repo-owned IA/page-pattern sample artifacts.
 *
 * This is intentionally lightweight: JSON parse, IA/page-pattern pairing, and
 * IA gate checks against a synthetic app route tree. It prevents sample drift
 * from reintroducing vague all-in-one routes or broken linksOut.
 */

import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

import { checkIaGate } from './checks/ia-gate.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const skillRoot = join(__dirname, '..')
const iaDir = join(skillRoot, 'samples/ia')
const pagePatternDir = join(skillRoot, 'samples/page-patterns')

const { values } = parseArgs({
  options: {
    json: { type: 'boolean', default: false },
  },
})

const report = validateArtifacts()

if (values.json) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n')
} else {
  process.stdout.write(`IA artifact validation: ${report.summary.artifacts} artifacts, ${report.summary.issues} issues\n`)
  for (const item of report.artifacts) {
    process.stdout.write(`${item.pass ? '[OK]' : '[X]'} ${item.id}: pages=${item.pages}, patterns=${item.patterns}\n`)
    for (const issue of item.issues) process.stdout.write(`    - ${issue}\n`)
  }
}

process.exit(report.summary.issues === 0 ? 0 : 1)

function validateArtifacts() {
  const artifacts = []
  for (const file of readdirSync(iaDir).filter(name => name.endsWith('.json')).sort()) {
    const iaPath = join(iaDir, file)
    const ia = readJson(iaPath)
    if (!ia?.archetype?.id || !Array.isArray(ia.pages)) continue

    const id = ia.archetype.id
    const issues = []
    const pagePatternPath = join(pagePatternDir, `${id}.json`)
    const pagePattern = existsSync(pagePatternPath) ? readJson(pagePatternPath) : undefined
    if (!pagePattern) {
      issues.push(`missing page-pattern artifact: ${pagePatternPath}`)
    } else {
      if (pagePattern.archetypeId !== id) issues.push(`page-pattern archetypeId mismatch: ${pagePattern.archetypeId}`)
      if (!Array.isArray(pagePattern.patterns) || pagePattern.patterns.length === 0) {
        issues.push('page-pattern artifact has no patterns')
      }
    }

    const gateIssues = runSyntheticIaGate(ia)
    issues.push(...gateIssues)

    artifacts.push({
      id,
      path: iaPath,
      pages: ia.pages.length,
      patterns: pagePattern?.patterns?.length ?? 0,
      pass: issues.length === 0,
      issues,
    })
  }

  const issueCount = artifacts.reduce((sum, item) => sum + item.issues.length, 0)
  return {
    timestamp: new Date().toISOString(),
    summary: {
      artifacts: artifacts.length,
      issues: issueCount,
      pass: issueCount === 0,
    },
    artifacts,
  }
}

function runSyntheticIaGate(ia) {
  const dir = mkdtempSync(join(tmpdir(), 'spec-to-forge-ia-artifact-'))
  try {
    mkdirSync(join(dir, 'app'), { recursive: true })
    writeFileSync(join(dir, 'IA-ROUTE-MAP.json'), JSON.stringify(ia, null, 2))
    writeSyntheticLayout(dir, ia)
    for (const page of ia.pages) {
      const routePath = page.route === '/' ? '' : page.route.replace(/^\//, '')
      const pageDir = join(dir, 'app', routePath)
      mkdirSync(pageDir, { recursive: true })
      writeFileSync(join(pageDir, 'page.tsx'), 'export default function Page(){return <main />}\n')
    }

    const files = collectFiles(dir)
    return checkIaGate(dir, files, { strict: true })
      .filter(check => check.status !== 'pass')
      .flatMap(check => check.files?.length
        ? check.files.map(file => `${check.name}: ${file}`)
        : [`${check.name}: ${check.description}`])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function writeSyntheticLayout(dir, ia) {
  const menuItems = ia.pages
    .filter(page => page.surfaceRole === 'navigation')
    .map(page => ({ label: page.title, href: page.route }))
  writeFileSync(
    join(dir, 'app', 'layout.tsx'),
    `const MENU_ITEMS = ${JSON.stringify(menuItems, null, 2)}\nexport default function Layout({ children }) { return children }\n`,
    'utf8',
  )
}

function collectFiles(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const stat = statSyncSafe(full)
    if (!stat) continue
    if (stat.isDirectory()) out.push(...collectFiles(full))
    else out.push(full)
  }
  return out
}

function statSyncSafe(file) {
  try {
    return statSync(file)
  } catch {
    return undefined
  }
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    return { parseError: error.message }
  }
}
