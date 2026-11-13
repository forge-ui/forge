import { createAgentHandler, createOpenAICompatible, tool } from "@forge-ui-official/agent/server";
import { z } from "zod";
import { executeTool } from "@/lib/mcp/server.mjs";

export const runtime = "nodejs";
export const maxDuration = 60;

const config = {
  baseURL: process.env.FORGE_AGENT_BASE_URL,
  apiKey: process.env.FORGE_AGENT_API_KEY,
  model: process.env.FORGE_AGENT_MODEL ?? "qwen-plus",
};

const clip = (value: unknown, max = 6000) => {
  const json = JSON.stringify(value);
  return json.length > max ? JSON.parse(JSON.stringify(value, (key, item) => (Array.isArray(item) && item.length > 25 ? item.slice(0, 25) : item))) : value;
};
const run = (name: string) => async (args: Record<string, unknown>) => {
  try {
    return clip(executeTool(name, args));
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
};

// Read-only Forge knowledge, the same data the public MCP server exposes.
const tools = {
  search: tool({
    description: "检索 Forge 的组件、页面组件（blocks）、模板页面（screens）、使用指南和规范。支持中英文和多个关键词。",
    inputSchema: z.object({ query: z.string().min(1).max(200), type: z.enum(["all", "components", "blocks", "screens", "guides", "rules"]).default("all") }),
    execute: args => run("search")({ ...args, includeTypes: false, page: 1, pageSize: 8 }),
  }),
  recommend: tool({
    description: "输入一句页面需求，返回页面角色、最接近的模板页面、页面组件和组件。回答“做某个页面用什么”时先调用。",
    inputSchema: z.object({ need: z.string().min(1).max(300) }),
    execute: run("recommend"),
  }),
  get_component: tool({
    description: "查组件的引入方式、参数、默认值和案例地址。slug 用组件名，如 DataTable、StatusBadge。",
    inputSchema: z.object({ slug: z.string().min(1).max(160) }),
    execute: args => run("get_component")({ ...args, detail: "summary" }),
  }),
  get_block: tool({
    description: "查页面组件的安装命令、依赖和预览地址。slug 如 orders-table-section。",
    inputSchema: z.object({ slug: z.string().min(1).max(160) }),
    execute: args => run("get_block")({ ...args, detail: "summary" }),
  }),
  get_tokens: tool({
    description: "查设计 token，如主色、正文、边框、危险色；layer 可选 semantic、primitive、dark。",
    inputSchema: z.object({ query: z.string().max(60).optional(), layer: z.enum(["semantic", "primitive", "dark", "all"]).default("semantic") }),
    execute: run("get_tokens"),
  }),
  check_code: tool({
    description: "检查一段页面代码是否符合 Forge 规范，返回行号、问题和改法。",
    inputSchema: z.object({ code: z.string().min(1).max(60000), filename: z.string().max(200).default("page.tsx") }),
    execute: args => run("check_code")({ ...args, listRules: false }),
  }),
};

const instructions = `你是 Forge UI 官网（www.forgeui.org）上的助手“问 Forge”。Forge 是面向中文后台的 React 组件库：@forge-ui-official/core 组件、70 个可复制的页面组件（blocks）、后台模板，以及给编码助手用的 Skill、MCP 和页面检查。

做事方式：
- 先用工具查，再回答。组件名、参数、安装命令、页面地址都以工具结果为准，查不到就直说，不要编。
- 用户问“做某个页面用什么”时先 recommend，再用 show_cards 列出推荐的页面组件（带安装命令）和组件，最后给简短理由。
- 用户问组件用法时用 get_component，再用 show_code 给一段能直接用的示例，组件从 @forge-ui-official/core 引入。
- 站内链接用相对路径：组件文档 /components/<家族>、案例 /cases/<家族>、页面组件 /blocks/<slug>、文档 /docs/...。工具结果里的 https://www.forgeui.org 前缀可以去掉。
- 用户想看某个页面时调用 open_page；想切换深浅色时调用 set_color_mode；想试主色时调用 preview_accent_color；要复制命令时调用 copy_text。
- 用简体中文，句子短，先给结论。`;

export async function POST(request: Request) {
  if (!config.baseURL || !config.apiKey) return Response.json({ error: "助手还没有配置模型（FORGE_AGENT_BASE_URL、FORGE_AGENT_API_KEY）" }, { status: 503 });
  const provider = createOpenAICompatible({ name: "forge-agent", baseURL: config.baseURL, apiKey: config.apiKey });
  return createAgentHandler({ model: provider(config.model), instructions, tools })(request);
}
