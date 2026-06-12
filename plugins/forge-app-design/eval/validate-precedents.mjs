#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginRoot = resolve(__dirname, '..')
const indexPath = join(pluginRoot, 'precedents', 'index.json')

const issues = []
const index = readJson(indexPath)

if (!index) {
  issues.push(`missing or invalid precedent index: ${indexPath}`)
} else {
  if (!Array.isArray(index.precedents)) issues.push('precedents must be an array')
  for (const item of index.precedents ?? []) {
    validateIndexItem(item)
  }
}

if (issues.length) {
  console.error(`Precedent validation failed: ${issues.length} issue(s)`)
  for (const issue of issues) console.error(`[FAIL] ${issue}`)
  process.exit(1)
}

console.log(`Precedent validation: ${index?.precedents?.length ?? 0} precedents, 0 issues`)

function validateIndexItem(item) {
  const label = item?.id ?? '<missing id>'
  for (const field of ['id', 'title', 'domain', 'artifact']) {
    if (!item?.[field]) issues.push(`${label}: missing ${field}`)
  }

  if (!item?.artifact) return
  const artifactPath = join(pluginRoot, item.artifact)
  const artifact = readJson(artifactPath)
  if (!artifact) {
    issues.push(`${label}: missing or invalid metadata ${item.artifact}`)
    return
  }

  if (artifact.id !== item.id) issues.push(`${label}: metadata id mismatch: ${artifact.id}`)
  if (!Array.isArray(artifact.routes)) issues.push(`${label}: routes must be an array`)
  if (!artifact.componentUsage?.used || !Array.isArray(artifact.componentUsage.used)) {
    issues.push(`${label}: componentUsage.used must be an array`)
  }
  if (!Array.isArray(artifact.reusableLessons) || artifact.reusableLessons.length === 0) {
    issues.push(`${label}: reusableLessons must be non-empty`)
  }
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}
