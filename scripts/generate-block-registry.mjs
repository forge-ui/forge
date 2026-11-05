import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "blocks/registry.json"), "utf8"));
const core = JSON.parse(fs.readFileSync(path.join(root, "core/package.json"), "utf8"));
const check = process.argv.includes("--check");
const outputs = new Map();
const items = catalog.map(({ name, title, description, component }) => {
  const source = `blocks/${name}/${name}.tsx`;
  const content = fs.readFileSync(path.join(root, source), "utf8");
  if (!content.includes(`export function ${component}`)) throw new Error(`${name}: missing component`);
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name, type: "registry:block", title, description,
    dependencies: [`@forge-ui-official/core@^${core.version}`],
    files: [{ path: source, type: "registry:component", target: `@components/blocks/${name}.tsx`, content }],
  };
  outputs.set(`public/r/${name}.json`, JSON.stringify(item, null, 2) + "\n");
  return item;
});
outputs.set("public/r/index.json", JSON.stringify({
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "forge-dashboard-blocks", homepage: "https://forgeui.org/blocks", items,
}, null, 2) + "\n");
for (const [file, content] of outputs) {
  const target = path.join(root, file);
  if (check) {
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== content) throw new Error(`Stale registry: ${file}`);
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}
console.log(`${check ? "Checked" : "Generated"} ${items.length} copyable Blocks`);
