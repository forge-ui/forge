import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { collectFiles, publicRoute } from "../skills/forge-skill/scripts/source-index.mjs";

export function loadSources(root) {
  const read = relative => {
    const text = fs.readFileSync(path.join(root, relative), "utf8");
    if (!text.trim()) throw new Error("Empty source: " + relative);
    return text;
  };
  const core = JSON.parse(read("core/package.json"));
  const inventory = JSON.parse(read("docs/for-agents/inventory.json"));
  if (inventory.package !== core.name || inventory.version !== core.version || inventory.dirty) throw new Error("Core inventory version or source state mismatch; regenerate component docs");
  if (!Array.isArray(inventory.components) || !inventory.components.length || inventory.componentCount !== inventory.components.length) throw new Error("Empty or incomplete export inventory");
  const references = ["SKILL.md", ...collectFiles(root, "skills/forge-skill/references").filter(file => file.endsWith(".md") && !file.includes("/component-selection/") && !file.includes("/components/")).map(file => file.slice("skills/forge-skill/".length))].sort().map(file => ({ file: "skills/forge-skill/" + file, content: read("skills/forge-skill/" + file) }));
  for (const required of ["SKILL.md", "references/audit-checklist.md", "references/screens.md", "references/blocks.md", "references/status-presentation.md"]) if (!references.some(item => item.file === "skills/forge-skill/" + required)) throw new Error("Missing required skill source: " + required);
  const routes = group => collectFiles(root, "src/app/" + group).filter(file => file.endsWith("/page.tsx")).map(file => ({ file, route: publicRoute(file, group) })).filter(item => item.route !== null).sort((left, right) => left.route.localeCompare(right.route));
  const templates = routes("templates");
  const cases = routes("cases");
  if (!templates.length || !cases.length) throw new Error("Missing template or case metadata");
  if (templates.filter(item => /^dashboards\/[^/]+$/.test(item.route)).length !== 10) throw new Error("Expected ten dashboard Screens");
  const modules = [...new Set(inventory.components.map(item => path.basename(item.source, path.extname(item.source))))].sort().map(name => ({ file: "skills/forge-skill/references/components/" + name + ".md", content: read("skills/forge-skill/references/components/" + name + ".md") }));
  for (const apiModule of modules) if (!apiModule.content.includes("core **" + core.version + "**")) throw new Error("Stale API source: " + apiModule.file);
  const fingerprint = createHash("sha256").update(JSON.stringify({ core: core.version, inventory, references, templates, cases, modules })).digest("hex");
  return { core, inventory, references, templates, cases, modules, fingerprint };
}

export function generateDocuments(root) {
  const source = loadSources(root);
  const { core, inventory, references, templates, cases, modules, fingerprint } = source;
  const banner = "# Forge UI Kit\n\nPackage: " + core.name + "@" + core.version + "\nSource: this repository; forge-skill + generated core exports + real page routes\nSource fingerprint: " + fingerprint + "\n\n";
  const policy = "## Adopted rules / 采用规则\n\nScreen → Blocks → Components. Start dashboards from a real Screen; the 12 Blocks are a plan, not implemented exports. Default status: soft StatusBadge; categories/roles use plain text. Default accent/focus: blue; purple/black optional. Icons: @forge-ui-official/core/icons. Missing capabilities: FORGE-GAP, ask before adding public primitives. In forge-starter use its host skills for routes, permission and data integration. Technical checks do not establish browser or production readiness.\n\n";
  const catalog = "## Public exports (" + inventory.components.length + ", values and types distinguished)\n\n" + inventory.components.map(item => "- " + item.name + " [" + item.kind + "] — " + item.source).join("\n") + "\n\n";
  const pageList = (title, group, items) => "## " + title + "\n\n" + items.map(item => "- /" + group + (item.route ? "/" + item.route : "") + " — " + item.file + (item.route.includes("[") ? " (route pattern; use real IDs)" : "")).join("\n") + "\n\n";
  const expandLinks = item => item.content.replace(/\]\(([^\s)]+\.md(?:#[^\s)]*)?)\)/g, (match, href) => {
    if (/^(?:https?:|\/|#)/.test(href)) return match;
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(item.file), href));
    return "](https://github.com/forge-ui/forge/blob/main/" + target + ")";
  });
  const embed = entries => entries.map(item => "---\n\nSource: " + item.file + "\n\n" + expandLinks(item).trim()).join("\n\n") + "\n";
  const semanticNames = ["SKILL.md", "audit-checklist.md", "status-presentation.md", "tokens.md", "page-recommended-standard.md", "screens.md", "blocks.md", "overlay-focus.md", "component-content-contracts.md", "motion.md"];
  const semantic = references.filter(item => semanticNames.includes(path.basename(item.file)));
  const full = banner + policy + catalog + pageList("Template routes", "templates", templates) + pageList("Case routes", "cases", cases) + embed(references);
  const outputs = new Map([
    ["llms.txt", banner + policy + "## Documents\n\n- /llms-full.md — complete portable rules and route/export catalog\n- /llms-full-cn.md — 中文入口（同一规范正文）\n- /llms-semantic.md — semantic/layout/interaction standards\n- /llms-components.md — generated API signatures and Props\n\nGenerated locally; deployment is a separate explicitly authorized action. Source paths identify repository files, not additional installed packages.\n"],
    ["llms-full.md", full], ["llms-full.txt", full],
    ["llms-full-cn.md", banner + "中文入口：采用正文与英文入口完全同源，保留 API 原名。\n\n" + full.slice(banner.length)],
    ["llms-full-cn.txt", banner + "中文入口：采用正文与英文入口完全同源，保留 API 原名。\n\n" + full.slice(banner.length)],
    ["llms-semantic.md", banner + policy + embed(semantic)],
    ["llms-components.md", banner + policy + catalog + embed(modules)],
  ]);
  return { outputs, fingerprint };
}
