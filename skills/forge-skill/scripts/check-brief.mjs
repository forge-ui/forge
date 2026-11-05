#!/usr/bin/env node
// Validate that an admin-generation note contains the minimum contracts needed
// before implementation. This is intentionally lightweight: it checks for
// required section names and field labels without forcing a YAML parser.
//
// Usage:
//   node scripts/check-brief.mjs path/to/brief.md
//   printf "..." | node scripts/check-brief.mjs -

import fs from "node:fs";
import path from "node:path";

const file = process.argv[2];

if (!file) {
  console.error("Usage: node scripts/check-brief.mjs path/to/brief.md");
  process.exit(1);
}

const text =
  file === "-"
    ? fs.readFileSync(0, "utf8")
    : fs.readFileSync(path.resolve(process.cwd(), file), "utf8");

const checks = [
  ["System Brief", /system brief|domain\s*:|archetype\s*:/i],
  ["domain", /domain\s*:/i],
  ["archetype", /archetype\s*:/i],
  ["primary_users", /primary_users\s*:|primary users/i],
  ["nav_groups", /nav_groups\s*:|navigation/i],
  ["modules", /modules\s*:/i],
  ["workbench", /workbench\s*:/i],
  ["operational_loops", /operational_loops\s*:|operational loops/i],
  ["cross_links", /cross_links\s*:|cross links/i],
  ["governance", /governance\s*:/i],
  ["Module Contract", /module contract|primary_object\s*:|state_action_matrix\s*:/i],
  ["primary_object", /primary_object\s*:|primary object/i],
  ["states", /states\s*:/i],
  ["transitions", /transitions\s*:/i],
  ["list_contract", /list_contract\s*:|list contract/i],
  ["detail_contract", /detail_contract\s*:|detail contract/i],
  ["mutation_surfaces", /mutation_surfaces\s*:|mutation surfaces/i],
  ["Page Flow", /page flow|routes\s*:/i],
  ["Component Mapping", /component mapping|forge mapping|shell\s*:/i],
  ["Verification", /verification|quality bar|checks/i],
];

const missing = checks.filter(([, pattern]) => !pattern.test(text)).map(([name]) => name);

if (missing.length > 0) {
  console.error("Missing required admin generation fields:");
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log("Admin generation contracts look complete.");
