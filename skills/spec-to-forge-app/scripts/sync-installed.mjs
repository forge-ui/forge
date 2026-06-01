#!/usr/bin/env node
/**
 * Sync spec-to-forge-app between the repo-owned source and the installed
 * runtime copy.
 *
 * Defaults to dry-run. Use --apply for writes.
 *
 * Examples:
 *   node skills/spec-to-forge-app/scripts/sync-installed.mjs --from-installed
 *   node skills/spec-to-forge-app/scripts/sync-installed.mjs --from-installed --check
 *   node skills/spec-to-forge-app/scripts/sync-installed.mjs --from-installed --apply
 *   node skills/spec-to-forge-app/scripts/sync-installed.mjs --to-installed --apply
 */

import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoSkillRoot = resolve(__dirname, "..");
const defaultInstalledRoot = "/Users/hesong/.agents/skills/spec-to-forge-app";

const { values } = parseArgs({
  options: {
    "from-installed": { type: "boolean", default: false },
    "to-installed": { type: "boolean", default: false },
    apply: { type: "boolean", default: false },
    check: { type: "boolean", default: false },
    installed: { type: "string", default: defaultInstalledRoot },
  },
});

if (values["from-installed"] === values["to-installed"]) {
  fail("Choose exactly one direction: --from-installed or --to-installed.");
}
if (values.apply && values.check) {
  fail("Choose either --apply or --check, not both.");
}

const installedRoot = resolve(values.installed);
const sourceRoot = values["from-installed"] ? installedRoot : repoSkillRoot;
const targetRoot = values["from-installed"] ? repoSkillRoot : installedRoot;

if (!existsSync(sourceRoot)) fail(`Source does not exist: ${sourceRoot}`);
if (values["to-installed"] && !repoSourceBootstrapped(repoSkillRoot)) {
  fail([
    "Repo skill source is not bootstrapped yet.",
    "Run --from-installed --apply first, then use --to-installed for runtime sync.",
  ].join(" "));
}

const planned = [];
for (const file of walk(sourceRoot)) {
  const rel = relative(sourceRoot, file).split("\\").join("/");
  if (shouldExclude(rel)) continue;

  const target = join(targetRoot, rel);
  if (!existsSync(target)) {
    planned.push({ action: "create", rel, source: file, target });
    continue;
  }

  if (hash(file) !== hash(target)) {
    planned.push({ action: "update", rel, source: file, target });
  }
}

const creates = planned.filter(item => item.action === "create").length;
const updates = planned.filter(item => item.action === "update").length;

for (const item of planned) {
  process.stdout.write(`${values.apply ? "sync" : values.check ? "diff" : "dry"} ${item.action} ${item.rel}\n`);
}

if (values.apply) {
  for (const item of planned) {
    mkdirSync(dirname(item.target), { recursive: true });
    copyFileSync(item.source, item.target);
  }
}

process.stdout.write(`\nDirection: ${values["from-installed"] ? "installed -> repo" : "repo -> installed"}\n`);
process.stdout.write(`Mode: ${values.apply ? "apply" : values.check ? "check" : "dry-run"}\n`);
process.stdout.write(`Planned: ${planned.length} files (${creates} create, ${updates} update)\n`);
process.stdout.write(`Source: ${sourceRoot}\nTarget: ${targetRoot}\n`);

if (values.check && planned.length > 0) {
  process.exit(1);
}

function walk(root) {
  const out = [];
  for (const name of readdirSync(root)) {
    const full = join(root, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (st.isFile()) out.push(full);
  }
  return out;
}

function shouldExclude(rel) {
  const parts = rel.split("/");
  if (parts.some(part => [
    ".git",
    ".next",
    ".serena",
    "node_modules",
    "browser-screenshots",
    "dist",
  ].includes(part))) {
    return true;
  }

  const base = parts.at(-1) ?? "";
  return [
    "browser-report.json",
    "browser-report.md",
    "goal-completion-report.json",
    "goal-completion-report.md",
    "quality-report.json",
    "quality-report.md",
    "regression-report.json",
    "regression-report.md",
    "repair-loop-report.json",
    "repair-loop-report.md",
  ].includes(base);
}

function repoSourceBootstrapped(root) {
  return [
    "SKILL.md",
    "scaffold.mjs",
    "eval/quality-eval.mjs",
    "samples/kanban-status-workflow/page.tsx",
  ].every(rel => existsSync(join(root, rel)));
}

function hash(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(2);
}
