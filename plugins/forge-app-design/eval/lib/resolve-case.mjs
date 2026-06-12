import { existsSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const evalRoot = dirname(__dirname)
const pluginRoot = dirname(evalRoot)

export function resolveCaseTargets(config, configPath, options = {}) {
  return {
    ...config,
    cases: (config.cases ?? []).map(item => ({
      ...item,
      rawTarget: item.target,
      target: resolveCaseTarget(item.target, { configPath, ...options }),
    })),
  }
}

export function resolveCaseTarget(rawTarget, options = {}) {
  if (!rawTarget || typeof rawTarget !== 'string') return rawTarget

  const configDir = options.configPath ? dirname(resolve(options.configPath)) : process.cwd()
  const demoRoot = options.demoRoot ?? process.env.FORGE_DEMO_ROOT ?? join(evalRoot, 'fixtures')
  const browserDemoRoot = options.browserDemoRoot
    ?? process.env.FORGE_BROWSER_DEMO_ROOT
    ?? process.env.FORGE_DEMO_ROOT
    ?? join(evalRoot, 'fixtures')
  const expanded = expandTemplate(rawTarget, {
    FORGE_APP_DESIGN_ROOT: pluginRoot,
    FORGE_EVAL_ROOT: evalRoot,
    FORGE_DEMO_ROOT: demoRoot,
    FORGE_BROWSER_DEMO_ROOT: browserDemoRoot,
  })

  return isAbsolute(expanded) ? resolve(expanded) : resolve(configDir, expanded)
}

export function expandTemplate(value, defaults = {}) {
  return String(value).replace(/\$\{([A-Z0-9_]+)\}/g, (match, key) => {
    return process.env[key] ?? defaults[key] ?? match
  })
}

export function targetExists(target) {
  return Boolean(target) && existsSync(target)
}
