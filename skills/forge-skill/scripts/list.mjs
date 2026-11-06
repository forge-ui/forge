#!/usr/bin/env node
// List every component, case, and template page available in the forge docs site.
// Reads a local Forge checkout first, then falls back to GitHub's REST API.
//
// Usage:
//   node scripts/list.mjs                 # list all three groups
//   node scripts/list.mjs components      # just components
//   node scripts/list.mjs cases           # just cases
//   node scripts/list.mjs templates       # just templates

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = "forge-ui/forge";
const BRANCH = "main";
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_ROOT = findLocalRoot();

const groups = {
  components: "src/app/components",
  cases: "src/app/cases",
  templates: "src/app/templates",
};

function findLocalRoot() {
  const candidates = [
    process.env.FORGE_REPO_DIR,
    path.resolve(SCRIPT_DIR, "../../.."),
    process.cwd(),
  ].filter(Boolean);

  return candidates.find((dir) => fs.existsSync(path.join(dir, "src/app"))) ?? null;
}

function isPublicDir(name) {
  return !name.startsWith("_") && !name.startsWith("(");
}

function listLocalDir(relPath) {
  if (!LOCAL_ROOT) return null;
  const dir = path.join(LOCAL_ROOT, relPath);
  if (!fs.existsSync(dir)) return null;

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((x) => x.isDirectory() && isPublicDir(x.name))
    .map((x) => x.name);
}

async function listRemoteDir(relPath) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${relPath}?ref=${BRANCH}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} for ${relPath}`);
  }
  const items = await res.json();
  return items
    .filter((x) => x.type === "dir" && isPublicDir(x.name))
    .map((x) => x.name);
}

async function listDir(relPath) {
  return listLocalDir(relPath) ?? listRemoteDir(relPath);
}

async function listTemplates() {
  if (LOCAL_ROOT) {
    const out = [];
    const root = path.join(LOCAL_ROOT, groups.templates);
    if (fs.existsSync(root)) {
      for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
        if (entry.name.startsWith("(")) {
          const children = listLocalDir(`${groups.templates}/${entry.name}`) ?? [];
          for (const c of children) out.push(`${entry.name}/${c}`);
        } else {
          out.push(entry.name);
        }
      }
      return out;
    }
  }

  // Templates have nested groups (auth, ecommerce, dashboard-builder + flat pages).
  const top = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${groups.templates}?ref=${BRANCH}`,
    { headers: { Accept: "application/vnd.github+json" } },
  ).then((r) => r.json());

  const out = [];
  for (const entry of top) {
    if (entry.type === "dir" && entry.name.startsWith("_")) continue;
    if (entry.type === "dir" && entry.name.startsWith("(")) {
      // Route group like (dashboard) — descend once.
      const children = await listDir(`${groups.templates}/${entry.name}`);
      for (const c of children) out.push(`${entry.name}/${c}`);
      continue;
    }
    if (entry.type === "dir") {
      out.push(entry.name);
    }
  }
  return out;
}

async function printGroup(label, items) {
  console.log(`\n## ${label} (${items.length})`);
  for (const it of items.sort()) console.log(`- ${it}`);
}

async function main() {
  const [onlyGroup] = process.argv.slice(2);
  const want = onlyGroup ? [onlyGroup] : Object.keys(groups);

  for (const g of want) {
    if (!(g in groups)) {
      console.error(`Unknown group: ${g}. Use one of: ${Object.keys(groups).join(", ")}`);
      process.exit(1);
    }
    try {
      const items = g === "templates" ? await listTemplates() : await listDir(groups[g]);
      await printGroup(g, items);
    } catch (err) {
      console.error(`Failed to list ${g}:`, err.message);
      process.exit(1);
    }
  }
}

main();
