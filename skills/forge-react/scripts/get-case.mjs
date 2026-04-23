#!/usr/bin/env node
// Fetch a case example page source from forge-ui/forge on main branch.
// Case pages at src/app/cases/<name>/page.tsx show real color × size × variant
// matrices for a given component. Copy these patterns when unsure.
//
// Usage:
//   node scripts/get-case.mjs button-link
//   node scripts/get-case.mjs table card
//
// Case names are kebab-case (e.g. button-link, page-header, pagination-stepper).

const REPO = "forge-ui/forge";
const BRANCH = "main";

async function fetchCase(name) {
  const slug = name.toLowerCase();
  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/src/app/cases/${slug}/page.tsx`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} — no case page at src/app/cases/${slug}/. Try \`node scripts/list.mjs cases\`.`);
  }
  return res.text();
}

async function main() {
  const names = process.argv.slice(2);
  if (names.length === 0) {
    console.error("Usage: node scripts/get-case.mjs <name> [<name>...]");
    console.error("Example: node scripts/get-case.mjs button-link table");
    process.exit(1);
  }

  for (const name of names) {
    try {
      const src = await fetchCase(name);
      console.log(`\n# ========================================================`);
      console.log(`# Case example: ${name.toLowerCase()}`);
      console.log(`# Source: src/app/cases/${name.toLowerCase()}/page.tsx`);
      console.log(`# Live: https://forge-ui.github.io/forge/cases/${name.toLowerCase()}/`);
      console.log(`# ========================================================\n`);
      console.log(src);
    } catch (err) {
      console.error(`${name}: ${err.message}`);
      process.exitCode = 1;
    }
  }
}

main();
