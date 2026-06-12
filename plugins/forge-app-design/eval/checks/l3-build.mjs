/**
 * L3 build — runs ./node_modules/.bin/next build at the target dir.
 *
 * Falls back to 'warn' (not 'critical') if node_modules is absent — running
 * eval before `pnpm install` shouldn't punish the project.
 */

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

const BUILD_TIMEOUT_MS = 180_000
const PREFERRED_NODE_BIN = '/Users/hesong/.nvm/versions/node/v22.20.0/bin'

function buildEnv() {
  const pathParts = [
    existsSync(join(PREFERRED_NODE_BIN, 'node')) ? PREFERRED_NODE_BIN : undefined,
    process.env.PNPM_HOME,
    '/opt/homebrew/bin',
    '/usr/local/bin',
    dirname(process.execPath),
    process.env.PATH,
  ].filter(Boolean)

  return {
    ...process.env,
    PATH: pathParts.join(':'),
  }
}

export async function checkL3Build(targetDir) {
  const nextBin = join(targetDir, 'node_modules/.bin/next')
  if (!existsSync(nextBin)) {
    return [{
      level: 'L3',
      name: 'next-build',
      description: 'next build skipped — node_modules not installed',
      status: 'warn',
      files: [],
      note: 'run `pnpm install --registry=https://registry.npmmirror.com` then re-run eval',
    }]
  }

  const start = Date.now()
  return new Promise(resolve => {
    const proc = spawn(nextBin, ['build'], {
      cwd: targetDir,
      env: buildEnv(),
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stderr = ''
    proc.stderr.on('data', d => { stderr += d.toString() })
    proc.stdout.on('data', () => {}) // drain

    const timeout = setTimeout(() => {
      try { proc.kill('SIGKILL') } catch {}
      resolve([{
        level: 'L3',
        name: 'next-build',
        description: `next build timed out (>${BUILD_TIMEOUT_MS / 1000}s)`,
        status: 'critical',
        files: [],
        duration_ms: Date.now() - start,
      }])
    }, BUILD_TIMEOUT_MS)

    proc.on('exit', code => {
      clearTimeout(timeout)
      const duration_ms = Date.now() - start
      if (code === 0) {
        resolve([{
          level: 'L3',
          name: 'next-build',
          description: 'next build succeeded',
          status: 'pass',
          files: [],
          duration_ms,
        }])
      } else {
        resolve([{
          level: 'L3',
          name: 'next-build',
          description: `next build failed (exit ${code})`,
          status: 'critical',
          files: [],
          duration_ms,
          stderr_tail: stderr.split('\n').slice(-20).join('\n'),
          repairHint: 'Read the stderr_tail above to identify the failing file and error. Common causes: missing import, hallucinated component or prop name, type error from Next 16 / React 19, missing @/mock helper. Fix the specific error only — do not rewrite the file.',
        }])
      }
    })
  })
}
