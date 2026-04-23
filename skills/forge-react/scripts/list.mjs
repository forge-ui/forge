#!/usr/bin/env node
// List every component, case, and template page available in the forge docs site.
// Pulls directory listings from GitHub's REST API — no auth required (public repo).
//
// Usage:
//   node scripts/list.mjs                 # list all three groups
//   node scripts/list.mjs components      # just components
//   node scripts/list.mjs cases           # just cases
//   node scripts/list.mjs templates       # just templates

const REPO = "forge-ui/forge";
const BRANCH = "main";

const groups = {
  components: "src/app/components",
  cases: "src/app/cases",
  templates: "src/app/templates",
};

async function listDir(path) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} for ${path}`);
  }
  const items = await res.json();
  return items
    .filter((x) => x.type === "dir" && !x.name.startsWith("_") && !x.name.startsWith("("))
    .map((x) => x.name);
}

async function listTemplates() {
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
