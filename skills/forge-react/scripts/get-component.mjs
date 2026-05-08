#!/usr/bin/env node
// Fetch a component spec page source from a local Forge checkout or forge-ui/forge.
// Spec pages live at src/app/components/<name>/page.tsx and contain the props
// API table, variants, usage snippets, and code examples.
//
// Usage:
//   node scripts/get-component.mjs Button
//   node scripts/get-component.mjs badge button-link
//
// Names are case-insensitive and accept kebab-case.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = "forge-ui/forge";
const BRANCH = "main";
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_ROOT = findLocalRoot();

function findLocalRoot() {
  const candidates = [
    process.env.FORGE_REPO_DIR,
    path.resolve(SCRIPT_DIR, "../../.."),
    process.cwd(),
  ].filter(Boolean);

  return candidates.find((dir) => fs.existsSync(path.join(dir, "src/app/components"))) ?? null;
}

function normalize(name) {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

async function fetchComponent(name) {
  const slug = normalize(name);
  const rel = `src/app/components/${slug}/page.tsx`;

  if (LOCAL_ROOT) {
    const localPath = path.join(LOCAL_ROOT, rel);
    if (fs.existsSync(localPath)) {
      return { src: fs.readFileSync(localPath, "utf8"), rel };
    }
  }

  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/src/app/components/${slug}/page.tsx`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} — no component page at ${rel}. Try \`node scripts/list.mjs components\` to see available names.`);
  }
  return { src: await res.text(), rel };
}

async function main() {
  const names = process.argv.slice(2);
  if (names.length === 0) {
    console.error("Usage: node scripts/get-component.mjs <Name> [<Name>...]");
    console.error("Example: node scripts/get-component.mjs Button DataTable");
    process.exit(1);
  }

  for (const name of names) {
    try {
      const { src, rel } = await fetchComponent(name);
      console.log(`\n# ========================================================`);
      console.log(`# Component spec: ${normalize(name)}`);
      console.log(`# Source: ${rel}`);
      console.log(`# ========================================================\n`);
      console.log(src);
    } catch (err) {
      console.error(`${name}: ${err.message}`);
      process.exitCode = 1;
    }
  }
}

main();
