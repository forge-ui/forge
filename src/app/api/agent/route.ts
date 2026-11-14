import { createAgentHandler, createOpenAICompatible, tool, type CannedAnswer, type PageInstructions, type Topic } from "@forge-ui-official/agent/server";
import { z } from "zod";
import rawData from "@/lib/mcp/data.json";
import { executeTool } from "@/lib/mcp/server.mjs";

export const runtime = "nodejs";
export const maxDuration = 60;

const config = {
  baseURL: process.env.FORGE_AGENT_BASE_URL,
  apiKey: process.env.FORGE_AGENT_API_KEY,
  model: process.env.FORGE_AGENT_MODEL ?? "qwen3.8-flash",
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
- 用户想看某个页面时调用 open_page；想切换深浅色时调用 set_color_mode；要复制命令时调用 copy_text。
- 用户想换主色、圆角、字体并拿到 CSS 时，打开主题定制页 /docs/theme 在页面上操作给他看（选颜色、选圆角，最后 scroll_to 到生成的 CSS）；只想在当前页临时看看效果时才用 preview_accent_color。
- 用简体中文，句子短，先给结论。`;

const guides = (rawData as unknown as { guides: { slug: string; title: string; content: string }[] }).guides;

// Docs pages, read as the same Markdown the site serves at <page>.md. Only titles go into every prompt.
const DOCS: { slug: string; title: string; summary: string; match?: (string | RegExp)[] }[] = [
  { slug: "quick-start", title: "快速开始", summary: "安装 core、接入 Tailwind 和 Forge 样式、渲染第一个组件。", match: ["快速开始", /怎么(安装|装|接入|开始用)/, /(安装|引入|接入).{0,8}(forge|组件库|core)/i] },
  { slug: "installation", title: "详细安装", summary: "环境要求、依赖、样式接入、升级到新版本。", match: [/升级|依赖版本|环境要求/] },
  { slug: "troubleshoot", title: "故障排查", summary: "样式不生效、类名没扫到等常见安装问题。", match: [/样式(不生效|没生效|不对|丢了)|没有样式|故障/] },
  { slug: "theme", title: "主题定制", summary: "换主色、圆角、字体并生成 CSS；深色模式。", match: [/主题.{0,4}(css|定制)|深色模式|暗色/i] },
  { slug: "ui-for-agents", title: "前端设计 Skill", summary: "让 Claude Code、Codex、Cursor 按 Forge 写页面：一条命令装 Skill 和 MCP。", match: [/claude ?code|codex|cursor|skill|编码助手/i] },
  { slug: "mcp", title: "MCP 服务器", summary: "Forge MCP 的地址、工具和各客户端的配置方法。", match: [/\bmcp\b/i] },
  { slug: "check", title: "页面检查", summary: "用 check_code 或 forge-check.mjs 按审计清单检查页面代码。", match: ["页面检查", "check_code", "forge-check"] },
];

function topicsFor(origin: string): Topic[] {
  return [
    ...DOCS.map(doc => ({
      id: doc.slug,
      title: doc.title,
      summary: doc.summary,
      match: doc.match,
      content: async () => {
        const response = await fetch(new URL(`/docs/${doc.slug}.md`, origin));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      },
    })),
    ...guides.map(guide => ({ id: `guide-${guide.slug}`, title: guide.title, summary: "使用指南：这类页面用哪些组件、怎么组织。", content: guide.content })),
  ];
}

const pageInstructions: PageInstructions = {
  "/docs/theme": `主题定制页的控件：
- 主色：「主色」下的圆形按钮「Forge 蓝」「紫」「青」「绿」「橙」「玫红」。用户说的颜色接近哪个预设就点哪个；预设里没有的才在输入框「自定义色值」填 6 位色值。
- 圆角：「直角」「紧凑」「默认」「圆润」。
- 字体：「字体」下的下拉框，可选 Manrope（默认）、系统字体、Inter、思源黑体。
- 「浅色」「深色」只切换右侧预览，不改整站；整站深浅色用 set_color_mode。
- 生成的 CSS 是页面最下方的代码块「生成的 CSS」，改完用 scroll_to 滚过去；「恢复默认」会撤销全部选择。`,
};

const answers: CannedAnswer[] = [
  {
    question: "怎么让 Claude Code 按 Forge 写页面？",
    answer: `装上 Forge 的 Skill 和 MCP 就行，一条命令：

\`\`\`bash
curl -fsSL https://www.forgeui.org/setup.sh | bash
\`\`\`

脚本会识别本机的 Claude Code、Cursor 和 Codex，装好 Skill 和 Forge MCP，已装过的会跳过。只想装到当前项目并放一份 DESIGN.md，用 \`bash -s -- --scope project --design\`；装完可以用 \`bash -s -- --check\` 自检。

之后直接用中文描述页面，助手会先判断页面角色、用 MCP 查组件参数，写完调用 check_code 自查。详见[前端设计 Skill](/docs/ui-for-agents)。`,
  },
];

export async function POST(request: Request) {
  if (!config.baseURL || !config.apiKey) return Response.json({ error: "助手还没有配置模型（FORGE_AGENT_BASE_URL、FORGE_AGENT_API_KEY）" }, { status: 503 });
  const provider = createOpenAICompatible({ name: "forge-agent", baseURL: config.baseURL, apiKey: config.apiKey });
  return createAgentHandler({ model: provider(config.model), instructions, tools, topics: topicsFor(new URL(request.url).origin), pageInstructions, answers })(request);
}
