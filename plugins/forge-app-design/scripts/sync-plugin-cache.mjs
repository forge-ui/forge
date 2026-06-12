#!/usr/bin/env node
/**
 * Local development helper for syncing the repo-owned forge-app-design plugin
 * into the Codex plugin cache.
 *
 * Defaults to dry-run. Use --check in CI-style validation and --apply only when
 * intentionally refreshing the local plugin cache.
 */

import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = resolve(__dirname, "..");
const pluginManifest = readPluginManifest(pluginRoot);
const defaultCacheRoot = join(
  process.env.CODEX_HOME ? resolve(process.env.CODEX_HOME) : join(homedir(), ".codex"),
  "plugins",
  "cache",
  "plugins-cli",
  pluginManifest.name,
  pluginManifest.version,
);

const { values } = parseArgs({
  options: {
    apply: { type: "boolean", default: false },
    cache: { type: "string", default: defaultCacheRoot },
    check: { type: "boolean", default: false },
  },
});

if (values.apply && values.check) {
  fail("Choose either --apply or --check, not both.");
}

const cacheRoot = resolve(values.cache);
if (!repoPluginSourceBootstrapped(pluginRoot)) {
  fail(`Plugin source is not bootstrapped: ${pluginRoot}`);
}
if (!existsSync(cacheRoot)) {
  if (!values.apply) {
    fail(`Plugin cache target does not exist: ${cacheRoot}`);
  }
  mkdirSync(cacheRoot, { recursive: true });
}

const sourceFiles = walk(pluginRoot).filter(file => !shouldExclude(relativePath(pluginRoot, file)));
const cacheFiles = walk(cacheRoot).filter(file => !shouldExclude(relativePath(cacheRoot, file)));
const sourceRelSet = new Set(sourceFiles.map(file => relativePath(pluginRoot, file)));
const planned = [];

for (const file of sourceFiles) {
  const rel = relativePath(pluginRoot, file);
  const target = join(cacheRoot, rel);

  if (!existsSync(target)) {
    planned.push({ action: "create", rel, source: file, target });
    continue;
  }

  if (hash(file) !== hash(target)) {
    planned.push({ action: "update", rel, source: file, target });
  }
}

const stale = cacheFiles
  .map(file => relativePath(cacheRoot, file))
  .filter(rel => !sourceRelSet.has(rel));

for (const item of planned) {
  process.stdout.write(
    `${values.apply ? "sync" : values.check ? "diff" : "dry"} ${item.action} ${item.rel}\n`,
  );
}
for (const rel of stale) {
  process.stdout.write(`${values.check ? "stale" : "note stale"} ${rel}\n`);
}

if (values.apply) {
  for (const item of planned) {
    mkdirSync(dirname(item.target), { recursive: true });
    copyFileSync(item.source, item.target);
  }
}

const creates = planned.filter(item => item.action === "create").length;
const updates = planned.filter(item => item.action === "update").length;

process.stdout.write(`\nMode: ${values.apply ? "apply" : values.check ? "check" : "dry-run"}\n`);
process.stdout.write(`Planned: ${planned.length} files (${creates} create, ${updates} update)\n`);
process.stdout.write(`Stale cache-only files: ${stale.length}\n`);
process.stdout.write(`Source: ${pluginRoot}\n`);
process.stdout.write(`Target: ${cacheRoot}\n`);

if (values.check && (planned.length > 0 || stale.length > 0)) {
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

function relativePath(root, file) {
  return relative(root, file).split("\\").join("/");
}

function shouldExclude(rel) {
  const parts = rel.split("/");
  if (
    parts.some(part =>
      [
        ".git",
        ".next",
        ".serena",
        "browser-screenshots",
        "dist",
        "node_modules",
      ].includes(part),
    )
  ) {
    return true;
  }

  const base = parts.at(-1) ?? "";
  if (base === ".DS_Store") return true;
  if (
    /^(browser|goal-completion|kanban-pattern|product-quality|protask-visual|quality|regression|repair-loop)-report(?:\.[A-Za-z0-9_-]+)?\.(?:json|md)$/.test(
      base,
    )
  ) {
    return true;
  }

  return [
    "browser-report.json",
    "browser-report.md",
    "goal-completion-report.json",
    "goal-completion-report.md",
    "kanban-pattern-report.json",
    "kanban-pattern-report.md",
    "product-quality-report.json",
    "product-quality-report.md",
    "protask-visual-report.json",
    "protask-visual-report.md",
    "quality-report.json",
    "quality-report.md",
    "regression-report.json",
    "regression-report.md",
    "repair-loop-report.json",
    "repair-loop-report.md",
  ].includes(base);
}

function repoPluginSourceBootstrapped(root) {
  return [
    ".codex-plugin/plugin.json",
    "scaffold.mjs",
    "skills/index/SKILL.md",
    "skills/build-forge-app/SKILL.md",
    "eval/quality-eval.mjs",
  ].every(rel => existsSync(join(root, rel)));
}

function readPluginManifest(root) {
  const manifestPath = join(root, ".codex-plugin", "plugin.json");
  try {
    return JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (error) {
    fail(`Unable to read plugin manifest: ${manifestPath} (${error.message})`);
  }
}

function hash(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(2);
}
