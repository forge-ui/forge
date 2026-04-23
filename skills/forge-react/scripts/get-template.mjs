#!/usr/bin/env node
// Fetch a template page source from forge-ui/forge on main branch.
// Templates at src/app/templates/<path>/page.tsx are full business screens
// (auth flow, ecommerce module, dashboard shells) you can copy wholesale.
//
// Usage:
//   node scripts/get-template.mjs auth/sign-in
//   node scripts/get-template.mjs ecommerce/products
//   node scripts/get-template.mjs ecommerce/orders/[id]
//   node scripts/get-template.mjs dashboard-builder
//   node scripts/get-template.mjs blank
//
// The path is the route segments after /templates/. Route groups like
// (dashboard) are inserted automatically — you don't need to type them.

const REPO = "forge-ui/forge";
const BRANCH = "main";

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

async function fetchTemplate(path) {
  const cleaned = path.replace(/^\/+|\/+$/g, "");
  const mapped = mapPath(cleaned);
  const base = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/src/app/templates/${mapped}`;

  // Try page.tsx first; if missing, try _content.tsx (client-wrapper pattern for
  // dynamic routes like ecommerce/orders/[id]).
  for (const filename of ["page.tsx", "_content.tsx"]) {
    const url = `${base}/${filename}`;
    const src = await fetchFile(url);
    if (src !== null) {
      return { url, src, filename };
    }
  }

  throw new Error(`No page.tsx or _content.tsx at src/app/templates/${mapped}/. Try \`node scripts/list.mjs templates\`.`);
}

async function main() {
  const paths = process.argv.slice(2);
  if (paths.length === 0) {
    console.error("Usage: node scripts/get-template.mjs <path> [<path>...]");
    console.error("Examples:");
    console.error("  node scripts/get-template.mjs auth/sign-in");
    console.error("  node scripts/get-template.mjs ecommerce/products");
    console.error("  node scripts/get-template.mjs dashboard-builder");
    process.exit(1);
  }

  for (const p of paths) {
    try {
      const { url, src, filename } = await fetchTemplate(p);
      const rel = url.replace(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/`, "");
      console.log(`\n# ========================================================`);
      console.log(`# Template: ${p}`);
      console.log(`# Source: ${rel} (${filename})`);
      console.log(`# Live: https://forge-ui.github.io/forge/templates/${p.replace(/\[/g, "").replace(/\]/g, "")}/`);
      console.log(`# ========================================================\n`);
      console.log(src);
    } catch (err) {
      console.error(`${p}: ${err.message}`);
      process.exitCode = 1;
    }
  }
}

main();
