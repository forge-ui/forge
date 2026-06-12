#!/usr/bin/env node
/**
 * Low-load browser validation for golden mini-apps.
 *
 * Policy:
 * - one app per case;
 * - one server per app case;
 * - one or more routes per case;
 * - use existing `.next` via `next start`, never `next dev`;
 * - no full-page screenshots;
 * - always stop the server before moving to the next case.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { delimiter, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { get } from 'node:http'
import { createRequire } from 'node:module'
import { parseArgs } from 'node:util'
import { resolveCaseTargets, targetExists } from './lib/resolve-case.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultConfig = join(__dirname, 'browser-cases.json')
const runtimeNodeModules = resolveRuntimeNodeModules()
const nodeBin = process.env.FORGE_NODE_BIN || process.execPath
const defaultScreenshotsDir = join(__dirname, 'browser-screenshots')

const { values } = parseArgs({
  options: {
    config: { type: 'string', default: defaultConfig },
    case: { type: 'string' },
    'report-dir': { type: 'string' },
    'screenshots-dir': { type: 'string' },
    'no-start-server': { type: 'boolean', default: false },
    json: { type: 'boolean', default: false },
  },
})

const configPath = resolve(values.config)
const reportDir = values['report-dir'] ? resolve(values['report-dir']) : __dirname
const screenshotsDir = values['screenshots-dir'] ? resolve(values['screenshots-dir']) : defaultScreenshotsDir
const config = resolveCaseTargets(JSON.parse(readFileSync(configPath, 'utf8')), configPath)
const selected = values.case
  ? config.cases.filter(item => item.id === values.case)
  : config.cases

if (selected.length === 0) {
  process.stderr.write(`No browser case matched: ${values.case}\n`)
  process.exit(2)
}

mkdirSync(reportDir, { recursive: true })
mkdirSync(screenshotsDir, { recursive: true })

const cases = []

for (const item of selected) {
  cases.push(await runCase(item))
}

const report = {
  timestamp: new Date().toISOString(),
  config: configPath,
  reportDir,
  screenshotsDir,
  summary: {
    total: cases.length,
    passed: cases.filter(item => item.pass && !item.skipped).length,
    skipped: cases.filter(item => item.skipped).length,
    failed: cases.filter(item => !item.pass).length,
  },
  cases,
}

const reportBase = values.case ? `browser-report.${slug(values.case)}` : 'browser-report'
const jsonPath = join(reportDir, `${reportBase}.json`)
const mdPath = join(reportDir, `${reportBase}.md`)
writeFileSync(jsonPath, JSON.stringify(report, null, 2))
writeFileSync(mdPath, renderMarkdown(report))

if (values.json) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n')
} else {
  process.stdout.write(`Browser validation: ${report.summary.passed}/${report.summary.total} passed`)
  if (report.summary.skipped > 0) process.stdout.write(` (${report.summary.skipped} skipped)`)
  process.stdout.write('\n')
  for (const item of report.cases) {
    const mark = item.skipped ? '[SKIP]' : item.pass ? '[OK]' : '[X]'
    if (item.routes?.length > 1) {
      const routePasses = item.routes.filter(route => route.pass).length
      process.stdout.write(`${mark} ${item.id}: ${routePasses}/${item.routes.length} routes\n`)
    } else {
      process.stdout.write(`${mark} ${item.id}: status=${item.status ?? 'n/a'}, title=${item.title ?? 'n/a'}\n`)
    }
    for (const issue of item.issues) process.stdout.write(`    - ${issue}\n`)
  }
  process.stdout.write(`Reports:\n  ${jsonPath}\n  ${mdPath}\n`)
}

process.exit(report.summary.failed > 0 ? 1 : 0)

function loadPlaywright() {
  try {
    const require = createRequire(import.meta.url)
    return require('playwright')
  } catch {
    if (!runtimeNodeModules) {
      throw new Error('playwright is not resolvable; install it locally or set FORGE_RUNTIME_NODE_MODULES to a node_modules directory')
    }
    const require = createRequire(join(runtimeNodeModules, 'playwright', 'package.json'))
    return require('playwright')
  }
}

async function runCase(item) {
  const target = item.target
  const issues = []
  const port = item.port
  const routes = normalizeRoutes(item)

  if (!targetExists(target)) {
    const issue = `target missing: ${target}`
    if (item.allowMissing) return skippedResult(item, issue)
    issues.push(issue)
  }
  if (!values['no-start-server'] && !existsSync(join(target, '.next'))) issues.push(`missing .next build: ${target}`)
  if (!existsSync(join(target, 'node_modules'))) issues.push(`missing node_modules: ${target}`)
  if (issues.length > 0) return baseResult(item, issues)

  const { chromium } = loadPlaywright()
  const server = values['no-start-server']
    ? null
    : spawn(nodeBin, ['./node_modules/next/dist/bin/next', 'start', '-p', String(port)], {
        cwd: target,
        env: {
          ...process.env,
          NEXT_TELEMETRY_DISABLED: '1',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      })

  let serverLog = ''
  server?.stdout.on('data', chunk => { serverLog += chunk.toString() })
  server?.stderr.on('data', chunk => { serverLog += chunk.toString() })

  let browser = null
  try {
    await waitForHttp(`http://127.0.0.1:${port}`, 20000)
    browser = await chromium.launch({ headless: true })
    const routeResults = []
    for (const routeConfig of routes) {
      const routeResult = await validateRoute(browser, item, routeConfig, port)
      routeResults.push(routeResult)
      for (const issue of routeResult.issues) issues.push(`${routeResult.route}: ${issue}`)
    }

    const firstRoute = routeResults[0]
    const result = {
      ...baseResult(item, issues),
      routes: routeResults,
      serverLog: serverLog.slice(-1000),
    }

    if (routeResults.length === 1 && firstRoute) {
      result.url = firstRoute.url
      result.status = firstRoute.status
      result.title = firstRoute.title
      result.textLength = firstRoute.textLength
      result.screenshot = firstRoute.screenshot
    }

    return result
  } catch (error) {
    issues.push(error.message)
    return {
      ...baseResult(item, issues),
      serverLog: serverLog.slice(-1000),
    }
  } finally {
    if (browser) await browser.close().catch(() => {})
    if (server) await stopServer(server)
  }
}

function normalizeRoutes(item) {
  if (Array.isArray(item.routes) && item.routes.length > 0) {
    return item.routes.map(route => ({
      route: route.route || '/',
      requiredText: route.requiredText ?? item.requiredText ?? [],
      requiredVisibleText: route.requiredVisibleText ?? item.requiredVisibleText ?? [],
      label: route.label,
      screenshotKey: route.screenshotKey,
    }))
  }
  return [{
    route: item.route || '/',
    requiredText: item.requiredText ?? [],
    requiredVisibleText: item.requiredVisibleText ?? [],
    label: item.label,
    screenshotKey: slug(item.route || '/'),
  }]
}

async function validateRoute(browser, item, routeConfig, port) {
  const route = routeConfig.route || '/'
  const url = `http://127.0.0.1:${port}${route}`
  const issues = []
  const page = await browser.newPage({
    viewport: { width: 1366, height: 900 },
    deviceScaleFactor: 1,
  })
  const consoleErrors = []

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', err => consoleErrors.push(err.message))

  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.locator('body').waitFor({ timeout: 10000 })
    await page.waitForTimeout(400)
    const title = await page.locator('h1').first().innerText({ timeout: 5000 }).catch(() => '')
    const text = await page.locator('body').innerText({ timeout: 10000 })
    const visibleTextChecks = []

    for (const expected of routeConfig.requiredText ?? []) {
      if (!text.includes(expected)) issues.push(`required text missing: ${expected}`)
    }
    for (const expected of routeConfig.requiredVisibleText ?? []) {
      const visible = await hasVisibleTextInViewport(page, expected)
      visibleTextChecks.push({ text: expected, pass: visible })
      if (!visible) {
        issues.push(`required visible text not in viewport: ${expected}`)
      }
    }
    if (/PLACEHOLDER|Placeholder|Awaiting LLM/.test(text)) issues.push('placeholder text visible in browser')
    if (consoleErrors.length > 0) issues.push(`browser console errors: ${consoleErrors.slice(0, 3).join(' | ')}`)

    const screenshotKey = routeConfig.screenshotKey || slug(route)
    const screenshot = join(screenshotsDir, `${item.id}-${screenshotKey}.png`)
    await page.screenshot({ path: screenshot, fullPage: false })

    return {
      route,
      url,
      status: response?.status() ?? null,
      title,
      textLength: text.length,
      screenshot,
      visibleTextChecks,
      pass: issues.length === 0,
      issues,
    }
  } catch (error) {
    issues.push(error.message)
    return {
      route,
      url,
      pass: false,
      issues,
    }
  } finally {
    await page.close().catch(() => {})
  }
}

async function hasVisibleTextInViewport(page, expected) {
  const locator = page.getByText(expected, { exact: true }).first()
  const count = await locator.count().catch(() => 0)
  if (count === 0) return false
  const box = await locator.boundingBox().catch(() => null)
  if (!box) return false
  const viewport = page.viewportSize() ?? { width: 1366, height: 900 }
  return box.x >= 0 &&
    box.y >= 0 &&
    box.x + box.width <= viewport.width &&
    box.y + box.height <= viewport.height &&
    box.width > 0 &&
    box.height > 0
}

function baseResult(item, issues) {
  return {
    id: item.id,
    label: item.label,
    target: item.target,
    rawTarget: item.rawTarget,
    route: item.route,
    pass: issues.length === 0,
    issues,
  }
}

function skippedResult(item, issue) {
  return {
    ...baseResult(item, [issue]),
    pass: true,
    skipped: true,
  }
}

function resolveRuntimeNodeModules() {
  const candidates = [
    process.env.FORGE_RUNTIME_NODE_MODULES,
    ...String(process.env.NODE_PATH ?? '').split(delimiter),
  ].filter(Boolean)

  return candidates.find(dir => existsSync(join(dir, 'playwright', 'package.json'))) ?? null
}

function waitForHttp(url, timeoutMs) {
  const started = Date.now()
  return new Promise((resolvePromise, rejectPromise) => {
    const tick = () => {
      get(url, res => {
        res.resume()
        resolvePromise()
      }).on('error', () => {
        if (Date.now() - started > timeoutMs) rejectPromise(new Error(`server did not become ready: ${url}`))
        else setTimeout(tick, 300)
      })
    }
    tick()
  })
}

function stopServer(server) {
  return new Promise(resolvePromise => {
    if (server.exitCode !== null || server.killed) return resolvePromise()
    server.once('exit', () => resolvePromise())
    server.kill('SIGTERM')
    setTimeout(() => {
      if (server.exitCode === null && !server.killed) server.kill('SIGKILL')
      resolvePromise()
    }, 1500).unref()
  })
}

function slug(value) {
  return String(value).replace(/^\/$/, 'root').replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')
}

function renderMarkdown(report) {
  const lines = []
  lines.push('# Browser Validation Report')
  lines.push('')
  lines.push(`- Generated: ${report.timestamp}`)
  lines.push(`- Summary: ${report.summary.passed}/${report.summary.total} passed, ${report.summary.skipped} skipped`)
  lines.push('- Mode: low-load, one app + one server + one or more viewport screenshots per case')
  lines.push(`- Report dir: \`${report.reportDir}\``)
  lines.push(`- Screenshots dir: \`${report.screenshotsDir}\``)
  if (values.case) {
    lines.push('- Scope: focused case run; canonical `browser-report.json` is only updated by full runs')
  }
  lines.push('')
  for (const item of report.cases) {
    lines.push(`## ${item.skipped ? '[SKIP]' : item.pass ? '[OK]' : '[FAIL]'} ${item.id}`)
    lines.push('')
    lines.push(`- Label: ${item.label}`)
    lines.push(`- Target: \`${item.target}\``)
    if (item.routes?.length > 1) {
      lines.push('- Routes:')
      for (const route of item.routes) {
        lines.push(`  - \`${route.route}\`: ${route.pass ? 'pass' : 'fail'}; status=${route.status ?? 'n/a'}; h1=${route.title || 'n/a'}`)
        if (route.screenshot) lines.push(`    - Screenshot: \`${route.screenshot}\``)
        if (route.visibleTextChecks?.length) {
          lines.push(`    - Visible text: ${route.visibleTextChecks.map(check => `${check.pass ? 'OK' : 'FAIL'} "${check.text}"`).join(', ')}`)
        }
        for (const issue of route.issues) lines.push(`    - Issue: ${issue}`)
      }
    } else {
      lines.push(`- Route: \`${item.route}\``)
      if (item.url) lines.push(`- URL: ${item.url}`)
      if (item.status) lines.push(`- HTTP status: ${item.status}`)
      if (item.title) lines.push(`- H1: ${item.title}`)
      if (item.textLength != null) lines.push(`- Body text length: ${item.textLength}`)
      if (item.screenshot) lines.push(`- Screenshot: \`${item.screenshot}\``)
      if (item.visibleTextChecks?.length) {
        lines.push(`- Visible text: ${item.visibleTextChecks.map(check => `${check.pass ? 'OK' : 'FAIL'} "${check.text}"`).join(', ')}`)
      }
    }
    if (item.issues.length > 0) {
      lines.push('- Issues:')
      for (const issue of item.issues) lines.push(`  - ${issue}`)
    }
    lines.push('')
  }
  lines.push('## Re-run')
  lines.push('')
  lines.push('```bash')
  lines.push('node $FORGE_APP_DESIGN_ROOT/eval/browser-validate.mjs')
  lines.push('node $FORGE_APP_DESIGN_ROOT/eval/browser-validate.mjs --case C8')
  lines.push('node $FORGE_APP_DESIGN_ROOT/eval/browser-validate.mjs --report-dir /private/tmp/spec-to-forge-browser-report --screenshots-dir /private/tmp/spec-to-forge-browser-shots')
  lines.push('```')
  lines.push('')
  return lines.join('\n')
}
