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
  const blocks = JSON.parse(read("blocks/registry.json"));
  if (!Array.isArray(blocks) || !blocks.length) throw new Error("Empty block registry");
  const fingerprint = createHash("sha256").update(JSON.stringify({ core: core.version, inventory, references, templates, cases, modules, blocks })).digest("hex");
  return { core, inventory, references, templates, cases, modules, blocks, fingerprint };
}

export function generateDocuments(root) {
  const source = loadSources(root);
  const { core, inventory, references, templates, cases, modules, fingerprint } = source;
  const banner = "# Forge UI Kit\n\nPackage: " + core.name + "@" + core.version + "\nSource: this repository; forge-skill + generated core exports + real page routes\nSource fingerprint: " + fingerprint + "\n\n";
  const policy = "## Adopted rules / 采用规则\n\nScreen → Blocks → Components. Start dashboards from a real Screen; " + source.blocks.length + " Blocks are implemented as copyable project source in blocks/ with public/r registry items, not core exports; install one with `npx shadcn@latest add https://forgeui.org/r/<name>.json`. Default status: soft StatusBadge; categories/roles use plain text. Default accent/focus: blue; purple/black optional. Icons: @forge-ui-official/core/icons. Missing capabilities: FORGE-GAP, ask before adding public primitives. In forge-starter use its host skills for routes, permission and data integration.\n\n";
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
  const blockRoutes = "## Block gallery and detail routes\n\n- /blocks — category-filtered gallery of " + source.blocks.length + " copyable Blocks\n" + source.blocks.map(block => "- /blocks/" + block.name + " — " + block.category + " / " + block.title + "; /r/" + block.name + ".json").join("\n") + "\n\n";
  const guides = fs.readdirSync(path.join(root, "content/guides")).filter(file => file.endsWith(".md")).sort().map(file => ({ file: "content/guides/" + file, content: fs.readFileSync(path.join(root, "content/guides", file), "utf8") }));
  const guideContent = "## 使用指南与 MCP\n\nhttps://forgeui.org/guides · https://forgeui.org/docs/mcp · https://forgeui.org/api/mcp (read-only Streamable HTTP)\n\n" + embed(guides);
  const full = banner + policy + guideContent + catalog + blockRoutes + pageList("Template routes", "templates", templates) + pageList("Case routes", "cases", cases) + embed(references);
  const outputs = new Map([
    ["llms.txt", llmsIndex(root, source)],
    ["llms-full.md", full], ["llms-full.txt", full],
    ["llms-full-cn.md", banner + "中文入口：采用正文与英文入口完全同源，保留 API 原名。\n\n" + full.slice(banner.length)],
    ["llms-full-cn.txt", banner + "中文入口：采用正文与英文入口完全同源，保留 API 原名。\n\n" + full.slice(banner.length)],
    ["llms-semantic.md", banner + policy + embed(semantic)],
    ["llms-components.md", banner + policy + catalog + embed(modules)],
  ]);
  return { outputs, fingerprint };
}

const SITE = "https://forgeui.org";
const clip = (text, length) => (text.length > length ? text.slice(0, length - 1) + "…" : text);

// llms.txt v2 (llmstxt.org): H1, summary blockquote, guidance, then H2 link lists pointing at markdown pages.
function llmsIndex(root, source) {
  const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
  const values = new Set(source.inventory.components.filter(item => item.kind === "value" && /^[A-Z]/.test(item.name)).map(item => item.name));
  const claimed = new Set();
  const families = [...read("src/app/_components/kit-nav.ts").matchAll(/slug: "([^"]+)", label: "([^"]+)"(, surfaces: \[([^\]]*)\])?/g)]
    .filter(match => !match[4] || match[4].includes("components"))
    .map(match => {
      const page = path.join(root, "src/app/components", match[1], "page.tsx");
      const text = fs.existsSync(page) ? fs.readFileSync(page, "utf8") : "";
      const primary = source.inventory.components.filter(item => item.oneShotDefault && values.has(item.name) && !claimed.has(item.name) && new RegExp("\\b" + item.name + "\\b").test(text)).sort((left, right) => (right.props?.length ?? 0) - (left.props?.length ?? 0)).map(item => item.name);
      for (const name of primary) claimed.add(name);
      const used = [...new Set([...primary, ...[...text.matchAll(/<([A-Z]\w+)/g)].map(found => found[1]).filter(name => values.has(name))])];
      return { slug: match[1], label: match[2], used };
    });
  const templates = [...read("src/app/templates/page.tsx").matchAll(/href: "([^"]+)",\s*title: "([^"]+)",[^}]*?description: "([^"]+)"/g)];
  const link = (title, url, note) => "- [" + title + "](" + url + ")" + (note ? ": " + note : "");
  return [
    "# Forge UI",
    "> Forge 是面向中文后台的 React 组件库 " + source.core.name + "@" + source.core.version + "（Next.js、React 19、Tailwind v4）。包含组件、" + source.blocks.length + " 个可复制的页面组件（blocks）、多页业务模板和 Next.js 起点仓库，以及给编码助手用的 Skill、MCP 服务器和 DESIGN.md。",
    [
      "使用要点：",
      "- 先找最接近的模板页面（Screen）或页面组件（Block），再查组件 API：Screen → Blocks → Components。",
      "- 组件从 `" + source.core.name + "` 引入，图标从 `" + source.core.name + "/icons` 引入；颜色用语义 token，不写 hex。",
      "- 默认主色是蓝色，紫色和黑色是可选主题；状态用 soft StatusBadge，分类和角色用普通文字。",
      "- 页面组件不是 core 导出，用 `npx shadcn@latest add " + SITE + "/r/<name>.json` 安装，或在 /blocks/<name> 复制源码。",
      "- 只读 MCP 服务：" + SITE + "/api/mcp，写新页面前先调用 recommend。",
      "- 每个文档、组件和页面组件页面在地址后加 .md 就是 Markdown 版本。",
    ].join("\n"),
    "## 入门\n\n" + [
      link("介绍", SITE + "/docs.md", "Forge 是什么、里面有什么"),
      link("快速开始", SITE + "/docs/quick-start.md", "安装、接入 Tailwind、渲染第一个组件"),
      link("详细安装", SITE + "/docs/installation.md", "依赖、样式接入和升级"),
      link("故障排查", SITE + "/docs/troubleshoot.md", "常见安装问题"),
      link("使用指南", SITE + "/guides.md", "列表、详情、表单、设置、看板、反馈、AI 和 Starter 模块"),
    ].join("\n"),
    "## 给编码助手\n\n" + [
      link("MCP 服务器", SITE + "/docs/mcp.md", "search、recommend、get_component、get_block、get_tokens 等只读工具"),
      link("页面检查", SITE + "/docs/check.md", "MCP check_code 或 node forge-check.mjs，按审计清单检查页面代码"),
      link("Skill", SITE + "/docs/ui-for-agents.md", "安装 forge-skill"),
      link("AGENTS.md", SITE + "/docs/agents-md.md", "放在项目根目录的使用规则"),
      link("DESIGN.md", SITE + "/DESIGN.md", "视觉规则，带 YAML token，遵循 google-labs-code/design.md"),
    ].join("\n"),
    "## 组件\n\n" + families.map(family => link(family.label, SITE + "/components/" + family.slug + ".md", family.used.slice(0, 5).join("、"))).join("\n"),
    "## 页面组件\n\n" + [link("全部页面组件", SITE + "/blocks.md", "按分类列出"), ...source.blocks.map(block => link(block.title, SITE + "/blocks/" + block.name + ".md", block.category + "，" + clip(block.description, 48)))].join("\n"),
    "## 模板\n\n" + templates.map(match => link(match[2], match[1].startsWith("http") ? match[1] : SITE + match[1], clip(match[3], 60))).join("\n"),
    "## Optional\n\n" + [
      link("完整规范与导出清单", SITE + "/llms-full.md", "约 40 万字，规范全文、页面路由和全部导出"),
      link("语义与交互规范", SITE + "/llms-semantic.md"),
      link("全部组件 API", SITE + "/llms-components.md"),
      link("页面组件 registry", SITE + "/r/index.json"),
    ].join("\n"),
  ].join("\n\n") + "\n";
}
