import type { AgentCodeDiffRow } from "@aideui/core";

export type Project = { id: string; name: string; threadIds: string[] };

export type ToolStep = { id: string; name: string; title: string; summary: string };

export type FileChange = { path: string; added: number; removed: number; diff: AgentCodeDiffRow[] };

function fileChange(path: string, lines: string[]): FileChange {
  const diff = diffRows(lines);
  return { path, diff, added: diff.filter((row) => row.type === "add").length, removed: diff.filter((row) => row.type === "del").length };
}

export type Turn =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      thoughtSeconds?: number;
      tools?: ToolStep[];
      paragraphs: string[];
      bullets?: string[];
      changes?: string[];
      streaming?: boolean;
    };

export type Thread = { id: string; title: string; projectId?: string; updated: string; turns: Turn[] };

function diffRows(lines: string[]): AgentCodeDiffRow[] {
  let old = 0;
  let cur = 0;
  return lines.map((line) => {
    const mark = line[0];
    const text = line.slice(2);
    if (mark === "+") return { old: null, cur: ++cur, type: "add", pieces: [{ text }] };
    if (mark === "-") return { old: ++old, cur: null, type: "del", pieces: [{ text }] };
    return { old: ++old, cur: ++cur, type: "ctx", pieces: [{ text }] };
  });
}

export const FILE_CHANGES: FileChange[] = [
  fileChange("app/(site)/page.tsx", [
    "  export default function HomePage() {",
    "    return (",
    "-     <section className=\"mx-auto max-w-3xl py-24 text-center\">",
    "-       <h1 className=\"text-5xl font-bold\">让产业数据成为可调用的 AI 生产力</h1>",
    "-       <p className=\"mt-6 text-lg text-grey-700\">从采集、治理到交付，一个平台完成。</p>",
    "-       <Button className=\"mt-10\">预约演示</Button>",
    "-     </section>",
    "+     <section className=\"mx-auto grid max-w-6xl gap-12 py-20 lg:grid-cols-2 lg:items-center\">",
    "+       <div className=\"flex flex-col gap-6\">",
    "+         <h1 className=\"text-5xl font-bold\">让产业数据成为可调用的 AI 生产力</h1>",
    "+         <p className=\"text-lg text-fg-grey-700\">从采集、治理到交付，一个平台完成。</p>",
    "+         <div className=\"flex gap-3\">",
    "+           <Button size=\"md\">预约演示</Button>",
    "+           <Button size=\"md\" variant=\"secondary\">查看案例</Button>",
    "+         </div>",
    "+       </div>",
    "+       <ProductShot src=\"/shots/console.png\" alt=\"数据集开发平台控制台\" />",
    "+     </section>",
    "    );",
    "  }",
  ]),
  fileChange("components/product-shot.tsx", [
    "+ import Image from \"next/image\";",
    "+ ",
    "+ export function ProductShot({ src, alt }: { src: string; alt: string }) {",
    "+   return (",
    "+     <div className=\"overflow-hidden rounded-2xl border border-fg-grey-200 bg-fg-grey-50\">",
    "+       <Image src={src} alt={alt} width={1200} height={760} priority />",
    "+     </div>",
    "+   );",
    "+ }",
  ]),
];

export const TERMINAL_LINES = [
  "$ pnpm lint",
  "✔ No ESLint warnings or errors",
  "$ pnpm build",
  "▲ Next.js 16.3.5",
  "  Creating an optimized production build ...",
  "✓ Compiled successfully in 8.4s",
  "✓ Generating static pages (14/14)",
  "Route (app)                Size     First Load JS",
  "┌ ○ /                      6.2 kB         128 kB",
  "└ ○ /cases                 4.8 kB         126 kB",
];

export const PROJECTS: Project[] = [
  { id: "website", name: "官网改版", threadIds: ["hero", "seo"] },
  { id: "console", name: "数据集控制台", threadIds: ["import", "perf"] },
  { id: "contract", name: "合同审查", threadIds: ["clauses"] },
];

export const THREADS: Thread[] = [
  {
    id: "hero",
    title: "首页首屏改成左右两栏",
    projectId: "website",
    updated: "刚刚",
    turns: [
      { id: "h1", role: "user", text: "把首页首屏改成左右两栏，右侧放产品截图，移动端保持单栏。" },
      {
        id: "h2",
        role: "assistant",
        thoughtSeconds: 6,
        tools: [
          { id: "t1", name: "read_file", title: "读取 app/(site)/page.tsx", summary: "48 行" },
          { id: "t2", name: "search", title: "搜索现有截图组件", summary: "没有可复用的组件" },
          { id: "t3", name: "edit_file", title: "修改 2 个文件", summary: "+20 −5" },
          { id: "t4", name: "run", title: "运行 pnpm lint && pnpm build", summary: "通过" },
        ],
        paragraphs: ["首屏已经改成左右两栏，桌面端左文右图，小于 1024px 时自动回到单栏，文字在上、截图在下。"],
        bullets: [
          "新增 ProductShot 组件，统一截图的圆角、描边和底色，之后案例页也能用",
          "按钮从一个变成两个：预约演示和查看案例",
          "lint 和构建都通过了，首页首次加载 128 kB",
        ],
        changes: ["app/(site)/page.tsx", "components/product-shot.tsx"],
      },
      { id: "h3", role: "user", text: "截图边上的阴影去掉，描边再浅一点。" },
      {
        id: "h4",
        role: "assistant",
        thoughtSeconds: 2,
        tools: [{ id: "t5", name: "edit_file", title: "修改 components/product-shot.tsx", summary: "+1 −1" }],
        paragraphs: ["已去掉阴影，描边从 grey-300 换成 grey-200，和页面其他卡片一致。"],
        changes: ["components/product-shot.tsx"],
      },
    ],
  },
  {
    id: "seo",
    title: "补齐案例页的 meta 和结构化数据",
    projectId: "website",
    updated: "昨天",
    turns: [
      { id: "s1", role: "user", text: "案例页缺 description 和 JSON-LD，帮我补上。" },
      {
        id: "s2",
        role: "assistant",
        thoughtSeconds: 4,
        tools: [{ id: "s3", name: "edit_file", title: "修改 6 个文件", summary: "+52 −4" }],
        paragraphs: ["6 个案例页都补上了 description 和 Article 结构化数据，标题统一改成「案例名 - 比特林克」。"],
      },
    ],
  },
  {
    id: "import",
    title: "导入向导支持 Parquet",
    projectId: "console",
    updated: "周一",
    turns: [
      { id: "i1", role: "user", text: "导入向导加一个 Parquet 格式，字段类型自动识别。" },
      {
        id: "i2",
        role: "assistant",
        thoughtSeconds: 9,
        paragraphs: ["已经加上 Parquet。字段类型直接读文件里的 schema，不再抽样推断，时间戳统一转成 UTC。"],
      },
    ],
  },
  {
    id: "perf",
    title: "样本列表滚动卡顿排查",
    projectId: "console",
    updated: "11 月 20 日",
    turns: [
      { id: "p1", role: "user", text: "样本超过 5000 条时列表滚动很卡，查一下原因。" },
      {
        id: "p2",
        role: "assistant",
        thoughtSeconds: 12,
        paragraphs: ["原因是每一行都在渲染缩略图。改成虚拟滚动后，只渲染可见的 30 行，滚动帧率回到 60。"],
      },
    ],
  },
  {
    id: "clauses",
    title: "违约条款对比",
    projectId: "contract",
    updated: "11 月 18 日",
    turns: [
      { id: "c1", role: "user", text: "对比两版合同的违约条款，列出差异。" },
      {
        id: "c2",
        role: "assistant",
        thoughtSeconds: 5,
        paragraphs: ["两版共有 3 处差异，最大的是违约金上限从合同总额的 20% 提到了 30%。"],
      },
    ],
  },
  {
    id: "weekly",
    title: "周报提纲",
    updated: "11 月 17 日",
    turns: [
      { id: "w1", role: "user", text: "按本周提交记录给我列一份周报提纲。" },
      { id: "w2", role: "assistant", paragraphs: ["本周主要在三件事上：官网首屏改版、导入向导支持 Parquet、修复样本列表卡顿。"] },
    ],
  },
  {
    id: "naming",
    title: "数据集命名规范",
    updated: "11 月 14 日",
    turns: [
      { id: "n1", role: "user", text: "数据集名称应该怎么规范？" },
      { id: "n2", role: "assistant", paragraphs: ["建议用「业务域-来源-粒度-版本」四段，例如 medical-his-visit-v3。"] },
    ],
  },
];

export const REPLY = {
  paragraphs: [
    "收到，我先看一下相关文件再改。",
    "按钮尺寸从 md 改成 sm，主按钮换成主题蓝 fg-blue-500，次按钮保持描边样式。改完重新跑了一遍构建，没有报错。",
  ],
  tools: [
    { id: "r1", name: "read_file", title: "读取 app/(site)/page.tsx", summary: "52 行" },
    { id: "r2", name: "edit_file", title: "修改 app/(site)/page.tsx", summary: "+2 −2" },
  ],
};

export const MODELS = [
  { id: "deep", label: "深度思考" },
  { id: "fast", label: "快速" },
];

export type PluginSection = "热门" | "办公协作" | "开发" | "数据与设计";

export type Plugin = { id: string; name: string; description: string; section: PluginSection; image?: string; letter?: string; tint?: string; installed: boolean; author: string; tools: string[] };

export const PLUGINS: Plugin[] = [
  { id: "lark", name: "飞书", description: "读写文档、多维表格和日程", section: "热门", image: "/images/blocks/channels/lark.svg", installed: true, author: "官方", tools: ["读取文档", "写入多维表格", "创建日程", "发送消息"] },
  { id: "github", name: "GitHub", description: "处理 PR、Issue 和 CI", section: "热门", letter: "G", tint: "bg-fg-black text-white", installed: true, author: "官方", tools: ["读取仓库", "创建分支", "提交 PR", "查看 CI"] },
  { id: "dingtalk", name: "钉钉", description: "查审批、发 DING、读写文档", section: "热门", image: "/images/blocks/channels/dingtalk.svg", installed: false, author: "官方", tools: ["查询审批", "发送 DING", "读取文档"] },
  { id: "wecom", name: "企业微信", description: "收发消息，读取客户联系", section: "热门", image: "/images/blocks/channels/wecom.svg", installed: false, author: "官方", tools: ["发送消息", "读取客户联系"] },
  { id: "postgres", name: "PostgreSQL", description: "只读查询业务库，出图出表", section: "热门", letter: "P", tint: "bg-fg-blue-500 text-white", installed: true, author: "官方", tools: ["执行只读查询", "查看表结构"] },
  { id: "dataset", name: "数据集开发平台", description: "检索数据集、发起标注", section: "热门", letter: "D", tint: "bg-fg-cyan-500 text-white", installed: false, author: "比特林克", tools: ["检索数据集", "创建标注任务", "查看质检"] },
  { id: "qq", name: "QQ", description: "在群里接收和回复消息", section: "办公协作", image: "/images/blocks/channels/qq.svg", installed: false, author: "官方", tools: ["接收消息", "回复消息"] },
  { id: "wechat", name: "微信", description: "通过服务号推送通知", section: "办公协作", image: "/images/blocks/channels/wechat.svg", installed: false, author: "官方", tools: ["推送通知"] },
  { id: "mail", name: "企业邮箱", description: "读邮件、起草回复", section: "办公协作", letter: "M", tint: "bg-fg-blue-100 text-fg-blue-500", installed: false, author: "官方", tools: ["读取邮件", "起草回复", "发送邮件"] },
  { id: "calendar", name: "日历", description: "查空闲、约会议", section: "办公协作", letter: "31", tint: "bg-fg-red-50 text-fg-red", installed: false, author: "官方", tools: ["查询空闲", "创建会议"] },
  { id: "terminal", name: "终端", description: "隔离环境里运行命令和测试", section: "开发", letter: ">_", tint: "bg-fg-grey-900 text-white", installed: true, author: "官方", tools: ["运行命令", "读取输出"] },
  { id: "gitlab", name: "GitLab", description: "合并请求和流水线", section: "开发", letter: "GL", tint: "bg-fg-red-50 text-fg-red", installed: false, author: "社区", tools: ["读取仓库", "创建合并请求", "查看流水线"] },
  { id: "sentry", name: "错误监控", description: "按堆栈定位到代码行", section: "开发", letter: "S", tint: "bg-fg-violet text-white", installed: false, author: "社区", tools: ["查询报错", "关联提交"] },
  { id: "deploy", name: "部署", description: "发版、回滚和查看日志", section: "开发", letter: "↑", tint: "bg-fg-green-50 text-fg-green-500", installed: false, author: "官方", tools: ["发布版本", "回滚", "查看日志"] },
  { id: "forge", name: "Forge 设计规范", description: "按规范生成和检查后台页面", section: "数据与设计", letter: "F", tint: "bg-fg-yellow text-fg-black", installed: true, author: "官方", tools: ["生成页面", "规范检查"] },
  { id: "figma", name: "Figma", description: "读取设计稿和组件", section: "数据与设计", letter: "Fi", tint: "bg-fg-violet-100 text-fg-violet", installed: false, author: "社区", tools: ["读取设计稿", "导出切图"] },
  { id: "mysql", name: "MySQL", description: "只读查询和慢查询分析", section: "数据与设计", letter: "My", tint: "bg-fg-cyan-50 text-fg-cyan-500", installed: false, author: "官方", tools: ["执行只读查询", "分析慢查询"] },
  { id: "bi", name: "数据看板", description: "把查询结果做成看板", section: "数据与设计", letter: "B", tint: "bg-fg-blue-50 text-fg-blue-500", installed: false, author: "比特林克", tools: ["生成图表", "发布看板"] },
];

export type Automation = { id: string; name: string; prompt: string; schedule: string; next: string; lastRun: { time: string; result: "成功" | "失败" | "跳过" }; enabled: boolean; projectId?: string; channel: string };

export const AUTOMATIONS: Automation[] = [
  { id: "daily-ci", name: "每日构建巡检", prompt: "检查官网和控制台昨晚的构建结果，失败的话定位原因并开工单。", schedule: "每天 08:30", next: "明天 08:30", lastRun: { time: "今天 08:30", result: "成功" }, enabled: true, projectId: "website", channel: "飞书群 · 前端" },
  { id: "weekly-report", name: "周报草稿", prompt: "汇总本周合并的 PR 和关闭的工单，写一份周报草稿。", schedule: "每周五 17:00", next: "11 月 28 日 17:00", lastRun: { time: "11 月 21 日 17:00", result: "成功" }, enabled: true, channel: "飞书文档" },
  { id: "deps", name: "依赖安全检查", prompt: "扫描三个仓库的依赖漏洞，高危的直接提升级 PR。", schedule: "每周一 09:00", next: "12 月 1 日 09:00", lastRun: { time: "11 月 24 日 09:00", result: "失败" }, enabled: true, projectId: "console", channel: "GitHub" },
  { id: "contract", name: "合同到期提醒", prompt: "找出 30 天内到期的合同，按负责人分组提醒。", schedule: "每月 1 日 10:00", next: "12 月 1 日 10:00", lastRun: { time: "11 月 1 日 10:00", result: "跳过" }, enabled: false, projectId: "contract", channel: "钉钉" },
];

export const PROJECT_DETAILS: Record<string, { description: string; instructions: string; files: Array<{ name: string; size: string }> }> = {
  website: {
    description: "比特林克官网改版，Next.js + Forge UI，部署在 184。",
    instructions: "页面文案用简体中文、正面表述；颜色只用 Forge 主题蓝；改完先在本地截图给我确认。",
    files: [
      { name: "官网改版需求.docx", size: "320 KB" },
      { name: "首页线框.fig", size: "4.1 MB" },
      { name: "品牌规范.pdf", size: "2.8 MB" },
    ],
  },
  console: {
    description: "数据集开发平台的前端控制台，重点是导入向导和样本列表。",
    instructions: "后端接口以 openapi.yaml 为准；表格用 Forge DataTable；性能问题先量再改。",
    files: [
      { name: "openapi.yaml", size: "86 KB" },
      { name: "样本列表性能记录.md", size: "12 KB" },
    ],
  },
  contract: {
    description: "合同条款比对和风险提示。",
    instructions: "只引用合同原文，给出条款编号；风险按高、中、低分级。",
    files: [{ name: "合同范本 2026.docx", size: "210 KB" }],
  },
};
