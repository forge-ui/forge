#!/usr/bin/env node
/**
 * Record final human acceptance for the active forge-app-design v1 goal.
 *
 * This tool writes USER-ACCEPTANCE.json only when a human-provided score is
 * >=80 and --yes is present. Use --dry-run to preview the exact payload.
 */

import { existsSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const __dirname = dirname(fileURLToPath(import.meta.url))
const target = '/Users/hesong/Desktop/output/prior-auth-ops-c12-protask'
const defaultOutput = `${target}/USER-ACCEPTANCE.json`
const goalCheckPath = resolve(__dirname, 'goal-completion-check.mjs')

const { values } = parseArgs({
  options: {
    score: { type: 'string' },
    note: { type: 'string', default: 'User reviewed C12 and accepts forge-app-design v1.' },
    output: { type: 'string', default: defaultOutput },
    yes: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
    force: { type: 'boolean', default: false },
  },
})

const score = Number(values.score)
const output = resolve(values.output)

if (!Number.isFinite(score)) {
  process.stderr.write('Usage: node record-user-acceptance.mjs --score <0-100> --yes [--note "..."]\n')
  process.exit(2)
}

if (score < 80) {
  process.stderr.write(`Refusing to record acceptance: score ${score} is below required 80.\n`)
  process.exit(3)
}

if (!values.yes && !values['dry-run']) {
  process.stderr.write('Refusing to write USER-ACCEPTANCE.json without --yes. Use --dry-run to preview.\n')
  process.exit(4)
}

if (existsSync(output) && !values.force && !values['dry-run']) {
  process.stderr.write(`Refusing to overwrite existing file without --force: ${output}\n`)
  process.exit(5)
}

verifyObjectiveEvidence()

const payload = {
  accepted: true,
  score,
  note: values.note,
  target,
  artifact: 'prior-auth-ops-c12-protask',
  reviewPacket: `${target}/USER-ACCEPTANCE-PACKET.md`,
  reviewGallery: `${target}/USER-ACCEPTANCE-GALLERY.html`,
  goal: 'forge-app-design readdy.ai-level generation v1',
  acceptedAt: new Date().toISOString(),
  source: 'record-user-acceptance.mjs',
}

const serialized = JSON.stringify(payload, null, 2) + '\n'

if (values['dry-run']) {
  process.stdout.write(serialized)
  process.exit(0)
}

writeFileSync(output, serialized)
process.stdout.write(`Wrote acceptance: ${output}\n`)

function verifyObjectiveEvidence() {
  const result = spawnSync(process.execPath, [goalCheckPath, '--json'], {
    encoding: 'utf8',
    cwd: __dirname,
  })

  if (result.status !== 0) {
    process.stderr.write('Refusing to record acceptance: objective evidence check failed.\n')
    if (result.stdout) process.stderr.write(result.stdout)
    if (result.stderr) process.stderr.write(result.stderr)
    process.exit(6)
  }

  let report
  try {
    report = JSON.parse(result.stdout)
  } catch {
    process.stderr.write('Refusing to record acceptance: could not parse objective evidence report.\n')
    process.exit(7)
  }

  if (report?.summary?.objectiveEvidencePass !== true) {
    process.stderr.write('Refusing to record acceptance: objective evidence is not passing.\n')
    process.stderr.write(JSON.stringify(report?.summary ?? {}, null, 2) + '\n')
    process.exit(8)
  }
}
