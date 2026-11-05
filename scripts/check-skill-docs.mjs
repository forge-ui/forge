import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skill = path.join(root, "skills/forge-skill");
const errors = [];
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}
for (const file of files(skill).filter(file => file.endsWith(".md"))) {
  const text = fs.readFileSync(file, "utf8").replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]+`/g, "");
  for (const match of text.matchAll(/\]\(([^\s)]+)\)/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|#|\/)/.test(href)) continue;
    const target = path.resolve(path.dirname(file), href.split("#")[0]);
    if (!fs.existsSync(target)) errors.push(path.relative(root, file) + " -> " + href);
  }
}
const inventory = JSON.parse(fs.readFileSync(path.join(root, "docs/for-agents/inventory.json"), "utf8"));
const core = JSON.parse(fs.readFileSync(path.join(root, "core/package.json"), "utf8"));
if (inventory.version !== core.version || !inventory.components.length) errors.push("Missing or stale core inventory");
for (const name of ["Button", "DataTable", "AppLayout", "StatusBadge", "Grid", "GridItem", "Drawer", "ToastProvider", "useToast"]) {
  if (!inventory.components.some(item => item.name === name)) errors.push("Missing public export: " + name);
}
const entry = fs.readFileSync(path.join(skill, "SKILL.md"), "utf8");
for (const required of ["name: forge-skill", "Screen → Blocks → Components", "FORGE-GAP", "audit-checklist.md"]) if (!entry.includes(required)) errors.push("Missing skill contract: " + required);
const screens = fs.readFileSync(path.join(skill, "references/screens.md"), "utf8");
const sources = [...screens.matchAll(/src\/app\/templates\/\(dashboards\)\/dashboards\/[\w-]+\/page\.tsx/g)].map(match => match[0]);
if (sources.length !== 10 || new Set(sources).size !== 10) errors.push("Expected 10 distinct dashboard sources");
for (const source of sources) if (!fs.existsSync(path.join(root, source))) errors.push("Missing Screen: " + source);
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log("Skill links, contracts, exports and 10 Screen sources verified; browser acceptance not included");
