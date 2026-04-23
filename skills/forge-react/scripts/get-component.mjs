#!/usr/bin/env node
// Fetch a component spec page source from forge-ui/forge on main branch.
// Spec pages live at src/app/components/<name>/page.tsx and contain the props
// API table, variants, usage snippets, and code examples.
//
// Usage:
//   node scripts/get-component.mjs Button
//   node scripts/get-component.mjs badge button-link
//
// Names are case-insensitive and accept kebab-case.

const REPO = "forge-ui/forge";
const BRANCH = "main";

function normalize(name) {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

async function fetchComponent(name) {
  const slug = normalize(name);
  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/src/app/components/${slug}/page.tsx`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} — no component page at src/app/components/${slug}/. Try \`node scripts/list.mjs components\` to see available names.`);
  }
  return res.text();
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
      const src = await fetchComponent(name);
      console.log(`\n# ========================================================`);
      console.log(`# Component spec: ${normalize(name)}`);
      console.log(`# Source: src/app/components/${normalize(name)}/page.tsx`);
      console.log(`# ========================================================\n`);
      console.log(src);
    } catch (err) {
      console.error(`${name}: ${err.message}`);
      process.exitCode = 1;
    }
  }
}

main();
