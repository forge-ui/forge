#!/usr/bin/env node
/**
 * Validate promoted golden app summaries against their markdown notes.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginRoot = dirname(__dirname)
const goldenRoot = join(pluginRoot, 'golden-apps')
const issues = []

for (const name of readdirSync(goldenRoot)) {
  if (!name.endsWith('.md') || name === 'README.md') continue
  const mdPath = join(goldenRoot, name)
  const markdown = readFileSync(mdPath, 'utf8')
  const id = name.replace(/\.md$/, '')
  const summaryRef = markdown.match(/summary:\s*`?([^`\s]+\.summary\.json)`?/i)?.[1]
  const hasAcceptance = /## Acceptance Evidence/i.test(markdown)
  if (!summaryRef && !hasAcceptance) continue

  const summaryPath = join(goldenRoot, summaryRef ?? `${id}.summary.json`)
  if (!existsSync(summaryPath)) {
    issues.push(`${name}: missing summary ${summaryRef ?? `${id}.summary.json`}`)
    continue
  }

  let summary
  try {
    summary = JSON.parse(readFileSync(summaryPath, 'utf8'))
  } catch (error) {
    issues.push(`${name}: invalid summary JSON (${error.message})`)
    continue
  }

  assertContains(markdown, summary.scores?.quality?.critical, `${name}: quality critical`)
  assertContains(markdown, summary.scores?.quality?.warn, `${name}: quality warn`)
  assertContains(markdown, summary.scores?.browser?.passed, `${name}: browser passed`)
  assertContains(markdown, summary.scores?.browser?.total, `${name}: browser total`)
  assertContains(markdown, summary.scores?.product?.score, `${name}: product score`)
  assertContains(markdown, summary.scores?.visual?.score, `${name}: visual score`)

  if (!summary.briefSpecs || summary.briefSpecs < 1) {
    issues.push(`${name}: briefSpecs must be > 0`)
  }
  if (!Array.isArray(summary.briefRoutes) || summary.briefRoutes.length === 0) {
    issues.push(`${name}: briefRoutes must be covered`)
  }
  if (Array.isArray(summary.blockingIssues) && summary.blockingIssues.length > 0) {
    issues.push(`${name}: summary has blocking issues`)
  }
}

if (issues.length > 0) {
  process.stdout.write(`Golden summary validation: ${issues.length} issues\n`)
  for (const issue of issues) process.stdout.write(`- ${issue}\n`)
  process.exit(1)
}

process.stdout.write('Golden summary validation: 0 issues\n')

function assertContains(markdown, value, label) {
  if (value == null) return
  if (!markdown.includes(String(value))) issues.push(`${label} value ${value} not found in note`)
}
