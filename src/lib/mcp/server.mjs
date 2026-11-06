import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import data from "./data.json" with { type: "json" };
const groups = { components: data.components, blocks: data.blocks, screens: data.screens, guides: data.guides, rules: data.rules };
const aliases = { icons: "icons", status: "status-presentation", layout: "layout-grid", "page-standards": "page-recommended-standard" };
export const toolNames = ["search", "list_components", "get_component", "list_blocks", "get_block", "list_screens", "get_screen", "get_rules", "list_guides", "get_guide"];
const pagination = { page: z.number().int().min(1).default(1), pageSize: z.number().int().min(1).max(50).default(20) };
const summary = item => ({ slug: item.slug, title: item.title ?? item.name, description: item.description ?? item.signature ?? "", kind: item.kind });
export function executeTool(name, args) {
  if (name === "search") {
    const results = Object.entries(groups).filter(([type]) => args.type === "all" || args.type === type).flatMap(([type, items]) => items.filter(item => JSON.stringify(item).toLocaleLowerCase().includes(args.query.toLocaleLowerCase())).map(item => ({ type, ...summary(item) })));
    return { total: results.length, page: args.page, pageSize: args.pageSize, items: results.slice((args.page - 1) * args.pageSize, args.page * args.pageSize) };
  }
  const group = name === "get_rules" ? "rules" : name.split("_")[1] + (name.startsWith("get_") ? "s" : "");
  const items = groups[group];
  if (!items) throw new Error("未知工具");
  if (name.startsWith("list_")) return { total: items.length, page: args.page, pageSize: args.pageSize, items: items.slice((args.page - 1) * args.pageSize, args.page * args.pageSize).map(summary) };
  const slug = name === "get_rules" ? aliases[args.topic] ?? args.topic : args.slug;
  const item = items.find(entry => entry.slug === slug);
  if (!item) throw new Error("未找到：" + slug + "；请先搜索或列出目录");
  return item;
}
export function createServer() {
  const server = new McpServer({ name: "forge", version: data.coreVersion });
  for (const name of toolNames) {
    const inputSchema = name === "search" ? { query: z.string().trim().min(1).max(200), type: z.enum(["all", "components", "blocks", "screens", "guides", "rules"]).default("all"), ...pagination } : name.startsWith("list_") ? pagination : name === "get_rules" ? { topic: z.string().min(1).max(160) } : { slug: z.string().min(1).max(160) };
    server.registerTool(name, { description: ({ search: "跨组件、Blocks、Screens、指南和规范检索，返回类型、slug 与分页。", get_component: "查询真实导入、Props、默认值与示例文档、案例路由、相关导出和 core 版本。", get_block: "查询 Block registry 全部源码、安装命令、依赖、Props 与示例。", get_screen: "查询 Screen 路由、预览 URL、直接使用的 Blocks/组件和源码。", get_rules: "读取唯一规范；topic 支持 tokens/icons/status/layout/page-standards/audit-checklist/blocks/screens，亦支持 reference 相对路径。" })[name] ?? (name.startsWith("list_") ? "分页列出 " : "读取完整内容：") + name, inputSchema, annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } }, async args => {
      try { const result = executeTool(name, args); return { structuredContent: { result }, content: [{ type: "text", text: JSON.stringify(result) }] }; }
      catch (error) { return { isError: true, content: [{ type: "text", text: error.message }] }; }
    });
  }
  server.registerResource("forge-rules", "forge://rules", { description: "Forge 唯一规范目录", mimeType: "application/json" }, async uri => ({ contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(data.rules.map(summary)) }] }));
  server.registerPrompt("forge-dashboard", { description: "按 Forge 规范规划运营看板", argsSchema: { goal: z.string().min(1).max(500) } }, async ({ goal }) => ({ messages: [{ role: "user", content: { type: "text", text: "目标：" + goal + "。先 get_rules 读取 page-standards、status、audit-checklist，再 list_screens 选择主模板，检索 Blocks 与组件 API。按 Screen → Blocks → Components 输出配方，缺失能力标记 FORGE-GAP 并询问。区分技术检查与浏览器验收。" } }] }));
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

