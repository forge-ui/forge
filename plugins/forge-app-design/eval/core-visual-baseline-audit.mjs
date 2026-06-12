#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginRoot = resolve(__dirname, '..')
const repoRoot = resolve(pluginRoot, '..', '..')
const coreRoot = join(repoRoot, 'core', 'src', 'components')

const reportPath = process.argv.includes('--report')
  ? process.argv[process.argv.indexOf('--report') + 1]
  : null

const issues = []
const warnings = []

const checks = [
  {
    file: 'ui/toolbar.tsx',
    fail: [
      {
        pattern: /PageTitleToolbar[\s\S]*?text-display-l/,
        message: 'PageTitleToolbar must use admin H1 scale, not text-display-l.',
      },
      {
        pattern: /PageTitleToolbar[\s\S]*?text-base font-medium leading-6/,
        message: 'PageTitleToolbar subtitle must stay at supporting text scale.',
      },
      {
        pattern: /inline-flex justify-start items-end gap-6/,
        message: 'PageTitleToolbar default horizontal rhythm should not be gap-6.',
      },
    ],
  },
  {
    file: 'layouts/app-layout.tsx',
    fail: [
      {
        pattern: /flex-1 p-6 flex flex-col gap-8 overflow-auto/,
        message: 'AppLayout content area must not default to p-6 plus gap-8.',
      },
    ],
  },
  {
    file: 'ui/list-group.tsx',
    fail: [
      {
        pattern: /text-xl font-semibold/,
        message: 'ListGroup title must stay close to sidebar/card title scale.',
      },
      {
        pattern: /px-6 py-6/,
        message: 'ListGroup body padding must not default to px-6 py-6.',
      },
    ],
  },
  {
    file: 'ui/notification-item.tsx',
    fail: [
      {
        pattern: /text-base font-semibold/,
        message: 'NotificationItem title must not default above row/card title scale.',
      },
      {
        pattern: /text-fg-grey-(800|900)/,
        message: 'NotificationItem supporting copy should not default to dark grey.',
      },
    ],
  },
  {
    file: 'ui/filter-panel.tsx',
    fail: [
      {
        pattern: /text-base font-semibold/,
        message: 'FilterPanel title must stay at compact panel title scale.',
      },
    ],
  },
  {
    file: 'ui/data-table.tsx',
    fail: [
      {
        pattern: /self-stretch p-6 bg-white flex justify-start items-center gap-[34]/,
        message: 'DataTable header/footer chrome must not default to p-6.',
      },
      {
        pattern: /text-xl font-semibold/,
        message: 'DataTable titles must not default to text-xl.',
      },
    ],
  },
  {
    file: 'ui/page-header.tsx',
    fail: [
      {
        pattern: /w-full px-6 py-5 border-b border-fg-grey-200 inline-flex justify-start items-center gap-6/,
        message: 'PageHeader title variant must not default to loose px-6/gap-6 chrome.',
      },
      {
        pattern: /flex-1 text-fg-black text-xl font-semibold leading-8 tracking-fg/,
        message: 'PageHeader title variant must stay below oversized routine page title scale.',
      },
    ],
  },
]

const generatedSurfaceFiles = [
  'ui/activity-card.tsx',
  'ui/charts/chart-card.tsx',
  'ui/data-table.tsx',
  'ui/filter-panel.tsx',
  'ui/history-grouped.tsx',
  'ui/history-item.tsx',
  'ui/list-group.tsx',
  'ui/notification-item.tsx',
  'ui/project-card.tsx',
  'ui/surface-card.tsx',
  'ui/task-card.tsx',
]

for (const check of checks) {
  const file = join(coreRoot, check.file)
  const source = read(file)
  if (!source) continue
  for (const rule of check.fail) {
    if (rule.pattern.test(source)) {
      issues.push({ file: check.file, message: rule.message })
    }
  }
}

for (const relPath of generatedSurfaceFiles) {
  const source = read(join(coreRoot, relPath))
  if (!source) continue
  const lines = source.split('\n')
  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (!isLikelyTitleLine(trimmed)) return
    if (/\btext-(lg|xl|2xl|3xl|display-l)\b/.test(trimmed)) {
      issues.push({
        file: relPath,
        line: index + 1,
        message: 'Generated admin surface title uses oversized text class.',
        text: trimmed,
      })
    }
    if (/\btext-fg-grey-(800|900)\b/.test(trimmed)) {
      warnings.push({
        file: relPath,
        line: index + 1,
        message: 'Generated admin supporting/title text uses dark grey; confirm it is intentional.',
        text: trimmed,
      })
    }
  })
}

const report = {
  checkedAt: new Date().toISOString(),
  coreRoot: pathForReport(coreRoot),
  issues,
  warnings,
  summary: {
    issues: issues.length,
    warnings: warnings.length,
    checkedFiles: new Set([...checks.map((item) => item.file), ...generatedSurfaceFiles]).size,
  },
}

if (reportPath) {
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
}

if (issues.length) {
  console.error(`Core visual baseline audit failed: ${issues.length} issue(s), ${warnings.length} warning(s)`)
  for (const issue of issues) {
    console.error(`[FAIL] ${formatIssue(issue)}`)
  }
  for (const warning of warnings) {
    console.error(`[WARN] ${formatIssue(warning)}`)
  }
  process.exit(1)
}

console.log(`Core visual baseline audit: ${issues.length} issues, ${warnings.length} warnings across ${report.summary.checkedFiles} files`)
for (const warning of warnings) {
  console.log(`[WARN] ${formatIssue(warning)}`)
}

function isLikelyTitleLine(text) {
  return (
    /\btitle\b/.test(text) ||
    /<h[1-4]\b/.test(text) ||
    /headerText/.test(text) ||
    /{item\.title}/.test(text)
  )
}

function read(file) {
  if (!existsSync(file)) {
    issues.push({ file: pathForReport(file), message: 'Missing expected core file.' })
    return null
  }
  return readFileSync(file, 'utf8')
}

function pathForReport(file) {
  return file.startsWith(repoRoot) ? file.slice(repoRoot.length + 1) : file
}

function formatIssue(issue) {
  const loc = issue.line ? `${issue.file}:${issue.line}` : issue.file
  return issue.text ? `${loc} ${issue.message} (${issue.text})` : `${loc} ${issue.message}`
}
