import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import data from "./data.json" with { type: "json" };
import { closest, normalize, rank } from "./search.mjs";
import { checkCode, ruleList } from "../../../public/forge-check.mjs";

const groups = { components: data.components, blocks: data.blocks, screens: data.screens, guides: data.guides, rules: data.rules };
const aliases = { icons: "icons", status: "status-presentation", layout: "layout-grid", "page-standards": "page-recommended-standard" };
export const toolNames = ["search", "recommend", "list_components", "get_component", "list_blocks", "get_block", "list_screens", "get_screen", "get_tokens", "check_code", "get_rules", "list_guides", "get_guide"];
const pagination = { page: z.number().int().min(1).default(1), pageSize: z.number().int().min(1).max(50).default(20) };
const detail = { detail: z.enum(["summary", "full"]).default("summary") };
const clip = (value, length) => { const text = String(value ?? "").replace(/\s+/g, " ").trim(); return text.length > length ? text.slice(0, length - 1) + "…" : text; };
const summary = item => ({ slug: item.slug, title: item.title ?? item.name, ...(item.label ? { label: item.label } : {}), ...(item.category ? { category: item.category } : {}), description: clip(item.description ?? item.signature ?? "", 160), ...(item.kind ? { kind: item.kind } : {}) });

const index = [
  ...data.components.map(item => ({ type: "components", item, boost: (item.kind === "value" ? 10 : -30) + (item.oneShotDefault ? 25 : 0), fields: { name: normalize(item.name), title: normalize(item.name), label: normalize(item.label), family: normalize(item.family), description: normalize(item.signature?.slice(0, 200)) } })),
  ...data.blocks.map(item => ({ type: "blocks", item, boost: 15, fields: { name: normalize(item.slug), title: normalize(item.title), category: normalize(item.category), description: normalize(item.description), body: normalize(item.component) } })),
  ...data.screens.map(item => ({ type: "screens", item, boost: 5, fields: { name: normalize(item.slug), title: normalize(item.title), description: normalize([...item.blocks, ...item.components].join(" ")) } })),
  ...data.guides.map(item => ({ type: "guides", item, boost: 5, fields: { name: normalize(item.slug), title: normalize(item.title), body: normalize(item.content) } })),
  ...data.rules.map(item => ({ type: "rules", item, boost: 0, fields: { name: normalize(item.slug), title: normalize(item.title), body: normalize(item.content) } })),
];

function search({ query, type = "all", includeTypes = false, page = 1, pageSize = 20 }) {
  const exact = normalize(query);
  const results = rank(index.filter(entry => (type === "all" || entry.type === type) && (includeTypes || entry.item.kind !== "type" || entry.fields.name === exact)), query);
  return {
    coreVersion: data.coreVersion,
    total: results.length,
    page,
    pageSize,
    ...(results.length && !results.some(entry => entry.matchedAll) ? { note: "没有同时命中全部关键词的结果，以下按相关度排序。" } : {}),
    ...(!results.length ? { suggestions: closest(index.filter(entry => type === "all" || entry.type === type), query).map(entry => entry.item.slug) } : {}),
    items: results.slice((page - 1) * pageSize, page * pageSize).map(entry => ({ type: entry.type, ...summary(entry.item) })),
  };
}

function find(items, slug, type) {
  const exact = items.find(entry => entry.slug === slug);
  if (exact) return exact;
  const loose = items.filter(entry => normalize(entry.slug) === normalize(slug));
  if (loose.length === 1) return loose[0];
  const found = search({ query: slug, type, pageSize: 3 });
  const suggestions = found.items.length ? found.items.map(entry => entry.slug) : found.suggestions;
  throw new Error("未找到：" + slug + (suggestions.length ? "；可能是：" + suggestions.join("、") : "；请先 search 或 list"));
}

function componentResult(item, level) {
  if (level === "full") return item;
  const props = item.props.map(prop => ({ name: prop.name, type: clip(prop.type, 160), required: !prop.optional, ...(prop.description ? { description: clip(prop.description, 160) } : {}) }));
  const example = item.examples[0];
  return {
    name: item.name, ...(item.label ? { label: item.label } : {}), kind: item.kind, import: item.import, signature: clip(item.signature, 600), props, defaults: item.defaults,
    cases: item.cases.map(route => "https://forgeui.org" + route), related: item.related.slice(0, 12), coreVersion: item.coreVersion, source: item.source,
    omitted: { sourceCodeChars: item.sourceCode.length, exampleChars: example?.code.length ?? 0, documentationChars: item.documentation.length, hint: "需要源码、完整示例和模块文档时用 detail=\"full\"。示例来自：" + (example?.source ?? "无") },
  };
}

function blockResult(item, level) {
  if (level === "full") return item;
  const files = item.registry.files.map(file => ({ path: file.path, lines: file.content.split("\n").length, exports: [...file.content.matchAll(/export (?:function|const) (\w+)/g)].map(match => match[1]) }));
  return { slug: item.slug, title: item.title, category: item.category, description: item.description, component: item.component, install: item.install, dependencies: item.registry.dependencies, files, screens: item.registry.meta?.screens ?? [], preview: "https://forgeui.org/blocks/" + item.slug, coreVersion: data.coreVersion, omitted: { hint: "需要完整源码时用 detail=\"full\"，或直接运行 install 命令。" } };
}

function screenResult(item, level) {
  if (level === "full") return item;
  const { sourceCode, ...rest } = item;
  return { ...rest, coreVersion: data.coreVersion, omitted: { sourceCodeChars: sourceCode.length, hint: "需要页面源码时用 detail=\"full\"。" } };
}

const roles = [
  { role: "dashboard", words: ["看板", "仪表盘", "概览", "首屏", "dashboard", "overview", "指标"] },
  { role: "detail", words: ["详情", "档案", "detail", "profile"] },
  { role: "form-page", words: ["表单", "新建", "编辑", "录入", "form"] },
  { role: "settings", words: ["设置", "配置", "settings"] },
  { role: "agent", words: ["智能体", "助手", "对话", "agent", "chat"] },
  { role: "collection", words: ["列表", "表格", "清单", "管理", "table", "list"] },
];
const roleRules = { dashboard: ["page-recommended-standard", "screens", "status-presentation"], collection: ["page-recommended-standard", "status-presentation", "audit-checklist"], detail: ["page-recommended-standard", "page-patterns"], "form-page": ["page-recommended-standard", "overlay-focus"], settings: ["page-recommended-standard"], agent: ["ask-ai-host-contract", "page-recommended-standard"] };

function recommend({ need }) {
  const lower = need.toLocaleLowerCase();
  const role = roles.find(entry => entry.words.some(word => lower.includes(word)))?.role ?? "collection";
  const pick = (type, count) => search({ query: need, type, pageSize: count }).items;
  const screens = pick("screens", 3);
  const blocks = pick("blocks", 4);
  const used = new Map();
  for (const screen of screens) for (const name of data.screens.find(item => item.slug === screen.slug)?.components ?? []) used.set(name, (used.get(name) ?? 0) + 1);
  for (const block of blocks) for (const file of data.blocks.find(item => item.slug === block.slug)?.registry.files ?? []) for (const match of file.content.matchAll(/import \{([^}]+)\} from "@forge-ui-official\/core"/g)) for (const name of match[1].split(",").map(part => part.trim()).filter(part => part && !part.startsWith("type "))) used.set(name, (used.get(name) ?? 0) + 1);
  const components = [...used].sort((left, right) => right[1] - left[1]).map(([name]) => data.components.find(item => item.name === name)).filter(item => item?.kind === "value" && /^[A-Z]/.test(item.name)).slice(0, 10).map(summary);
  return {
    need, role, coreVersion: data.coreVersion,
    screens, blocks, components: components.length ? components : pick("components", 8),
    rules: roleRules[role].map(slug => ({ slug, title: data.rules.find(rule => rule.slug === slug)?.title })),
    next: ["先 get_screen 或 get_block 看最接近的现成页面，能复用就不重写。", "再用 get_component 查组件参数，组件一律从 @forge-ui-official/core 引入。", "颜色用 get_tokens 查语义 token，不写 hex。", "写完后调用 check_code 检查，再按 audit-checklist 人工核对视觉和交互。"],
  };
}

const tokenWords = { 主色: "accent", 强调: "accent", 焦点: "focus", 背景: "background", 底色: "surface", 卡片: "surface", 正文: "text-primary", 次要: "text-secondary", 辅助: "text-muted", 禁用: "disabled", 文字: "text", 边框: "border", 分割线: "divider", 危险: "danger", 删除: "danger", 警告: "warning", 遮罩: "overlay", 悬停: "hover", 蓝: "fg-blue", 紫: "fg-violet", 绿: "fg-green", 红: "fg-red", 黄: "fg-yellow", 灰: "fg-grey", 青: "fg-cyan" };
function getTokens({ query, layer = "semantic" }) {
  const term = query ? Object.entries(tokenWords).reduce((value, [word, token]) => value.replace(word, token), query.toLocaleLowerCase()).replace(/\s+/g, "") : "";
  const tokens = data.tokens.filter(token => (layer === "all" || token.layer === layer || (term && layer === "semantic" && token.layer === "primitive")) && (!term || token.name.includes(term) || token.value.toLocaleLowerCase().includes(term)));
  return { coreVersion: data.coreVersion, total: tokens.length, tokens: tokens.slice(0, 60), usage: "业务代码优先用语义 token（如 var(--accent)）；原始色阶在 Tailwind 里写作 bg-fg-blue-500、text-fg-grey-700。默认主色是蓝色。" };
}

export function executeTool(name, args) {
  if (name === "search") return search(args);
  if (name === "recommend") return recommend(args);
  if (name === "get_tokens") return getTokens(args);
  if (name === "check_code") return { ...checkCode(args.code, args.filename), rules: args.listRules ? ruleList : undefined };
  const group = name === "get_rules" ? "rules" : name.split("_")[1] + (name.startsWith("get_") ? "s" : "");
  const items = groups[group];
  if (!items) throw new Error("未知工具");
  if (name.startsWith("list_")) return { coreVersion: data.coreVersion, total: items.length, page: args.page, pageSize: args.pageSize, items: items.slice((args.page - 1) * args.pageSize, args.page * args.pageSize).map(summary) };
  const item = find(items, name === "get_rules" ? aliases[args.topic] ?? args.topic : args.slug, group);
  if (name === "get_component") return componentResult(item, args.detail);
  if (name === "get_block") return blockResult(item, args.detail);
  if (name === "get_screen") return screenResult(item, args.detail);
  return item;
}

const descriptions = {
  search: "按相关度检索组件、页面组件（blocks）、模板页面（screens）、指南和规范。支持中英文和多个关键词，例如“订单列表 筛选 批量”。默认不返回 TypeScript 类型，includeTypes=true 时返回。",
  recommend: "输入一句页面需求，返回页面角色、最接近的模板页面、页面组件、组件和要先读的规范。写新页面前先调用。",
  list_components: "分页列出 core 导出。",
  get_component: "查询组件的 import、Props、默认值、案例地址和相关导出。默认返回精简版；detail=\"full\" 返回源码、完整示例和模块文档。名称不区分大小写和连字符。",
  list_blocks: "分页列出页面组件。",
  get_block: "查询页面组件的安装命令、依赖、文件和关联模板。默认精简；detail=\"full\" 返回完整源码。",
  list_screens: "分页列出模板页面。",
  get_screen: "查询模板页面的路由、预览地址、用到的页面组件和组件。默认精简；detail=\"full\" 返回源码。",
  get_tokens: "查询设计 token。query 可用中文（主色、正文、边框、危险）或 token 名；layer 默认 semantic，可选 primitive、all。",
  check_code: "检查一段页面代码是否违反 Forge 规范：写死的 hex 颜色、裸 px、引入其他 UI 库、手写按钮/表格/表单控件/弹窗、紫色默认主题、solid 状态、灰色标题、href=\"#\"、空事件处理。返回行号、审计编号和改法。写完页面后调用，全部错误修完再交付。",
  get_rules: "读取规范全文；topic 支持 tokens、icons、status、layout、page-standards、audit-checklist、blocks、screens，也支持 reference 相对路径。",
  list_guides: "列出使用指南。",
  get_guide: "读取一篇使用指南全文。",
};

function inputSchema(name) {
  if (name === "search") return { query: z.string().trim().min(1).max(200), type: z.enum(["all", "components", "blocks", "screens", "guides", "rules"]).default("all"), includeTypes: z.boolean().default(false), ...pagination };
  if (name === "recommend") return { need: z.string().trim().min(1).max(300) };
  if (name === "check_code") return { code: z.string().min(1).max(200000), filename: z.string().max(200).default("page.tsx"), listRules: z.boolean().default(false) };
  if (name === "get_tokens") return { query: z.string().trim().max(60).optional(), layer: z.enum(["semantic", "primitive", "all"]).default("semantic") };
  if (name.startsWith("list_")) return pagination;
  if (name === "get_rules") return { topic: z.string().min(1).max(160) };
  if (["get_component", "get_block", "get_screen"].includes(name)) return { slug: z.string().min(1).max(160), ...detail };
  return { slug: z.string().min(1).max(160) };
}

export function createServer() {
  const server = new McpServer({ name: "forge", version: data.coreVersion });
  for (const name of toolNames) {
    server.registerTool(name, { description: descriptions[name], inputSchema: inputSchema(name), annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } }, async args => {
      try { const result = executeTool(name, args); return { structuredContent: { result }, content: [{ type: "text", text: JSON.stringify(result) }] }; }
      catch (error) { return { isError: true, content: [{ type: "text", text: error.message }] }; }
    });
  }
  server.registerResource("forge-rules", "forge://rules", { description: "Forge 唯一规范目录", mimeType: "application/json" }, async uri => ({ contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(data.rules.map(summary)) }] }));
  server.registerPrompt("forge-dashboard", { description: "按 Forge 规范规划运营看板", argsSchema: { goal: z.string().min(1).max(500) } }, async ({ goal }) => ({ messages: [{ role: "user", content: { type: "text", text: "目标：" + goal + "。先 get_rules 读取 page-standards、status、audit-checklist，再 list_screens 选择主模板，检索 Blocks 与组件 API。按 Screen → Blocks → Components 输出配方，缺失能力标记 FORGE-GAP 并询问。区分技术检查与浏览器验收。" } }] }));
  server.registerPrompt("forge-page", { description: "按 Forge 规范实现任意后台页面", argsSchema: { need: z.string().min(1).max(500) } }, async ({ need }) => ({ messages: [{ role: "user", content: { type: "text", text: "需求：" + need + "。先调用 recommend 拿到页面角色和最接近的模板页面、页面组件；能复用就复制，不重写。再用 get_component 查参数、get_tokens 查颜色。组件从 @forge-ui-official/core 引入，图标从 @forge-ui-official/core/icons 引入，不写 hex。写完调用 check_code 修完所有错误，再按 audit-checklist 自查。" } }] }));
  return server;
}

export async function handleRequest(request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return new Response("Origin not allowed", { status: 403 });
  if (request.method !== "POST") return new Response("Stateless endpoint only supports POST", { status: 405, headers: { Allow: "POST" } });
  const server = createServer();
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  try { return await transport.handleRequest(request); }
  finally { await server.close(); }
}
