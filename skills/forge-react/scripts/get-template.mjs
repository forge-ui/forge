#!/usr/bin/env node
// Fetch a template page source from a local Forge checkout or forge-ui/forge.
// Templates at src/app/templates/<path>/page.tsx are full business screens
// (ecommerce modules, project-template modules, dashboard shells) you can copy.
//
// Usage:
//   node scripts/get-template.mjs ecommerce/products
//   node scripts/get-template.mjs ecommerce/orders/[id]
//   node scripts/get-template.mjs project-template/projects
//   node scripts/get-template.mjs dashboard-builder
//   node scripts/get-template.mjs blank
//
// The path is the route segments after /templates/. Route groups like
// (dashboard) are inserted automatically — you don't need to type them.

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

  return candidates.find((dir) => fs.existsSync(path.join(dir, "src/app/templates"))) ?? null;
}

// Ecommerce pages live under the (dashboard) route group in the repo.
const ROUTE_GROUP_MAP = [
  { prefix: "ecommerce/", group: "(dashboard)/" },
];

function mapPath(p) {
  for (const { prefix, group } of ROUTE_GROUP_MAP) {
    if (p.startsWith(prefix)) return group + p;
  }
  return p;
}

async function fetchFile(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.text();
}

async function fetchTemplate(templatePath) {
  const cleaned = templatePath.replace(/^\/+|\/+$/g, "");
  const mapped = mapPath(cleaned);
  const base = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/src/app/templates/${mapped}`;

  // Try page.tsx first; if missing, try _content.tsx (client-wrapper pattern for
  // dynamic routes like ecommerce/orders/[id]).
  for (const filename of ["page.tsx", "_content.tsx"]) {
    const rel = `src/app/templates/${mapped}/${filename}`;
    if (LOCAL_ROOT) {
      const localPath = path.join(LOCAL_ROOT, rel);
      if (fs.existsSync(localPath)) {
        return { src: fs.readFileSync(localPath, "utf8"), rel, filename };
      }
    }

    const url = `${base}/${filename}`;
    const src = await fetchFile(url);
    if (src !== null) {
      const rel = url.replace(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/`, "");
      return { src, rel, filename };
    }
  }

  throw new Error(`No page.tsx or _content.tsx at src/app/templates/${mapped}/. Try \`node scripts/list.mjs templates\`.`);
}

async function main() {
  const paths = process.argv.slice(2);
  if (paths.length === 0) {
    console.error("Usage: node scripts/get-template.mjs <path> [<path>...]");
    console.error("Examples:");
    console.error("  node scripts/get-template.mjs ecommerce/products");
    console.error("  node scripts/get-template.mjs project-template/projects");
    console.error("  node scripts/get-template.mjs dashboard-builder");
    process.exit(1);
  }

  for (const p of paths) {
    try {
      const { src, rel, filename } = await fetchTemplate(p);
      console.log(`\n# ========================================================`);
      console.log(`# Template: ${p}`);
      console.log(`# Source: ${rel} (${filename})`);
      console.log(`# Live: https://forgeui.org/templates/${p.replace(/\[/g, "").replace(/\]/g, "")}/`);
      console.log(`# ========================================================\n`);
      console.log(src);
    } catch (err) {
      console.error(`${p}: ${err.message}`);
      process.exitCode = 1;
    }
  }
}

main();
