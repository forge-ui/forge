#!/usr/bin/env node
/**
 * Render a compact review packet for a generated forge-app-design prototype.
 *
 * This intentionally summarizes existing evidence instead of rerunning gates.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'

const { values } = parseArgs({
  options: {
    target: { type: 'string' },
    'report-dir': { type: 'string' },
    'emit-summary': { type: 'string' },
    'strict-no-tmp-leak': { type: 'boolean', default: false },
    json: { type: 'boolean', default: false },
  },
})

if (!values.target) {
  process.stderr.write('Usage: node render-review-packet.mjs --target <project-dir> [--report-dir <dir>] [--json]\n')
  process.exit(2)
}

const target = resolve(values.target)
const reportDir = values['report-dir'] ? resolve(values['report-dir']) : target
mkdirSync(reportDir, { recursive: true })

const report = buildReport(target)
const mdPath = join(reportDir, 'REVIEW-PACKET.md')
const markdown = renderMarkdown(report)
if (values['strict-no-tmp-leak'] && /\/tmp\/|\/Users\/[^/]+\/.*\/tmp\//.test(markdown)) {
  process.stderr.write('strict-no-tmp-leak failed: review packet contains absolute tmp paths\n')
  process.exit(1)
}
writeFileSync(mdPath, markdown)

let summaryPath = null
if (values['emit-summary']) {
  summaryPath = resolve(values['emit-summary'])
  writeFileSync(summaryPath, JSON.stringify(toGoldenSummary(report), null, 2))
}

if (values.json) process.stdout.write(JSON.stringify({ ...report, reviewPacket: mdPath, summary: summaryPath }, null, 2) + '\n')
else process.stdout.write(`Review packet written: ${mdPath}\n`)

function buildReport(targetDir) {
  const ia = readJson(join(targetDir, 'IA-ROUTE-MAP.json'))
  const quality = readJson(join(targetDir, 'quality-report.json'))
  const browser = readJson(join(targetDir, 'browser-report.json'))
  const product = readJson(join(targetDir, 'product-quality-report.json'))
  const visual = readJson(join(targetDir, 'protask-visual-report.json'))
  const briefText = readText(join(targetDir, 'DESIGN-BRIEF.md'))
  const briefSpecs = parseBriefSpecs(briefText)
  const browserCase = browser?.cases?.find(item => resolve(item.target) === targetDir) ?? browser?.cases?.[0] ?? null

  return {
    timestamp: new Date().toISOString(),
    target: targetDir,
    routeModel: visual?.facts?.routeModel ?? summarizeIaRoutes(ia),
    briefSpecs: briefSpecs.length,
    briefRoutes: briefSpecs.map(spec => spec.route).filter(Boolean),
    qualitySummary: quality?.summary ?? null,
    browserSummary: browser?.summary ?? null,
    browserRoutes: browserCase?.routes?.map(route => ({
      route: route.route,
      pass: route.pass,
      screenshot: route.screenshot,
      visibleTextChecks: route.visibleTextChecks ?? [],
    })) ?? [],
    product: product ? { score: product.score, pass: product.pass, facts: product.facts, blockingIssues: collectBlockingIssues(product) } : null,
    visual: visual ? { score: visual.score, pass: visual.pass, facts: visual.facts, blockingIssues: collectBlockingIssues(visual) } : null,
  }
}

function renderMarkdown(report) {
  const lines = []
  lines.push('# Prototype Review Packet')
  lines.push('')
  lines.push(`- Generated: ${report.timestamp}`)
  lines.push(`- Target: \`${report.target}\``)
  lines.push('')
  lines.push('## Route Model')
  lines.push('')
  lines.push(`- Dashboard: ${report.routeModel?.dashboard ?? 'n/a'}`)
  lines.push(`- List: ${report.routeModel?.list ?? 'n/a'}`)
  lines.push(`- Detail: ${report.routeModel?.detail ?? 'n/a'}`)
  lines.push(`- Workflow: ${(report.routeModel?.workflowRoutes ?? []).join(', ') || 'n/a'}`)
  lines.push('')
  lines.push('## Brief Coverage')
  lines.push('')
  lines.push(`- Page Intent Specs: ${report.briefSpecs}`)
  lines.push(`- Spec routes: ${report.briefRoutes.join(', ') || 'n/a'}`)
  lines.push('')
  lines.push('## Gates')
  lines.push('')
  if (report.qualitySummary) {
    lines.push(`- Quality: ${report.qualitySummary.critical} critical / ${report.qualitySummary.warn} warn / ${report.qualitySummary.passed} passed`)
  } else {
    lines.push('- Quality: missing')
  }
  lines.push(`- Browser: ${report.browserSummary ? `${report.browserSummary.passed}/${report.browserSummary.total} cases passed` : 'missing'}`)
  lines.push(`- Product quality: ${report.product ? `${report.product.score}/100, pass=${report.product.pass ? 'yes' : 'no'}` : 'missing'}`)
  lines.push(`- Protask visual: ${report.visual ? `${report.visual.score}/100, pass=${report.visual.pass ? 'yes' : 'no'}` : 'missing'}`)
  lines.push('')
  if (report.product?.blockingIssues?.length || report.visual?.blockingIssues?.length) {
    lines.push('## Blocking Issues')
    lines.push('')
    for (const issue of report.product?.blockingIssues ?? []) lines.push(`- Product: ${issue}`)
    for (const issue of report.visual?.blockingIssues ?? []) lines.push(`- Visual: ${issue}`)
    lines.push('')
  }
  lines.push('## Browser Evidence')
  lines.push('')
  for (const route of report.browserRoutes) {
    const visible = route.visibleTextChecks.map(check => `${check.pass ? 'OK' : 'MISS'} ${check.text}`).join('; ')
    lines.push(`- ${route.route}: ${route.pass ? 'pass' : 'fail'}${route.screenshot ? `, screenshot=${route.screenshot}` : ''}${visible ? `, visible=${visible}` : ''}`)
  }
  lines.push('')
  lines.push('## Completion Notes')
  lines.push('')
  lines.push('- Do not count tmp output as a committed fixture or golden app unless explicitly promoted.')
  lines.push('- Supporting workflow routes do not prove a promoted kanban/workflow pattern unless the canonical pattern artifact and screenshot acceptance exist.')
  lines.push('- Missing Page Intent Specs or `briefSpecs=0` block completion.')
  lines.push('')
  return lines.join('\n')
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
      route: raw.match(/^\s*route:\s+(.+)$/m)?.[1]?.trim()?.replace(/\s+#.*$/, ''),
    }
  })
}

function summarizeIaRoutes(ia) {
  const pages = Array.isArray(ia?.pages) ? ia.pages : []
  return {
    dashboard: pages.find(page => page.route === '/' || page.routeRole === 'dashboard')?.route,
    list: pages.find(page => page.routeRole === 'list' || /list|queue/i.test(`${page.layoutIntent} ${page.id}`))?.route,
    detail: pages.find(page => page.surfaceRole === 'detail')?.route,
    workflowRoutes: pages.filter(page => page.surfaceRole === 'action' || /workflow|kanban|board|wizard|new|create/i.test(`${page.layoutIntent} ${page.route}`)).map(page => page.route),
  }
}

function collectBlockingIssues(report) {
  return (report.sections ?? []).flatMap(section => section.blockingIssues ?? [])
}

function toGoldenSummary(report) {
  return {
    version: 1,
    id: slugFromTarget(report.target),
    generatedAt: report.timestamp,
    routeModel: report.routeModel,
    scores: {
      quality: report.qualitySummary
        ? {
            critical: report.qualitySummary.critical,
            warn: report.qualitySummary.warn,
            passed: report.qualitySummary.passed,
          }
        : null,
      browser: report.browserSummary
        ? {
            passed: report.browserSummary.passed,
            total: report.browserSummary.total,
            failed: report.browserSummary.failed,
          }
        : null,
      product: report.product ? { score: report.product.score, pass: report.product.pass } : null,
      visual: report.visual ? { score: report.visual.score, pass: report.visual.pass } : null,
    },
    briefSpecs: report.briefSpecs,
    briefRoutes: report.briefRoutes,
    browserRoutes: report.browserRoutes.map(route => ({
      route: route.route,
      pass: route.pass,
      visibleTextChecks: route.visibleTextChecks,
    })),
    blockingIssues: [
      ...(report.product?.blockingIssues ?? []).map(issue => ({ source: 'product', issue })),
      ...(report.visual?.blockingIssues ?? []).map(issue => ({ source: 'visual', issue })),
    ],
  }
}

function slugFromTarget(targetPath) {
  return String(targetPath).split('/').filter(Boolean).at(-1) ?? 'prototype'
}

function readJson(path) {
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

function readText(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : ''
}
