# @forge-ui-official/agent

把一个 AI 助手嵌进你的 React 应用：它能回答产品问题、调用你的接口、用 Forge 组件（卡片、表格、图表、步骤）回答，还能在页面上替用户点、填、选。模型和数据都在你自己的服务器上，可以接通义千问、DeepSeek 等任何 OpenAI 兼容接口。

线上示例：[forgeui.org](https://www.forgeui.org) 右下角的「问 Forge」。

## 快速开始

需要一个已经接好 [@forge-ui-official/core](https://www.forgeui.org/docs/quick-start)（0.8.3 及以上）的 Next.js 15+ 项目（React 19、Tailwind v4）。

### 1. 安装

```bash
pnpm add @forge-ui-official/agent zod
```

在全局样式文件里让 Tailwind 也扫描 agent 包（和 core 那行放在一起，路径同样按样式文件的位置）：

```css
@source "../node_modules/@forge-ui-official/agent/dist";
```

### 2. 服务端接口

`app/api/agent/route.ts`：

```ts
import { createAgentHandler, createOpenAICompatible } from "@forge-ui-official/agent/server";

const provider = createOpenAICompatible({
  name: "my-agent",
  baseURL: process.env.AGENT_BASE_URL!, // 如 https://dashscope.aliyuncs.com/compatible-mode/v1
  apiKey: process.env.AGENT_API_KEY!,
});

export const POST = createAgentHandler({
  model: provider("qwen3.8-flash"),
  instructions: "你是「示例后台」的助手。用简体中文，先给结论。",
});
```

在 `.env.local` 里配置模型（密钥只在服务端使用，不会进浏览器）：

```bash
AGENT_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
AGENT_API_KEY=sk-...
```

### 3. 放上助手

`app/assistant.tsx`：

```tsx
"use client";

import { ForgeAgent } from "@forge-ui-official/agent";

export function Assistant() {
  return <ForgeAgent endpoint="/api/agent" title="问助手" suggestions={["这个页面能做什么？"]} storageKey="my-agent" operate />;
}
```

在 `app/layout.tsx` 的 `<body>` 里加上 `<Assistant />`。启动后右下角出现入口，打开后面板固定在右侧，宽屏时页面会让出位置。

到这里就能对话，并且能操作页面（`operate`）。下面按需要加能力。

## 让它调用你的功能

**浏览器工具**在用户的浏览器里、用用户当前的登录态执行，适合改筛选、打开记录、调用已有的前端接口：

```tsx
import { ForgeAgent, defineTool } from "@forge-ui-official/agent";
import { z } from "zod";

const tools = [
  defineTool({
    name: "filter_orders",
    label: "筛选订单",
    description: "按状态筛选订单列表。",
    input: z.object({ status: z.enum(["待发货", "已完成"]) }),
    execute: ({ status }) => {
      setStatus(status);
      return { status };
    },
  }),
  defineTool({
    name: "cancel_order",
    label: "取消订单",
    description: "取消一个订单。",
    input: z.object({ id: z.string() }),
    needsApproval: true, // 先让用户点「允许」
    execute: ({ id }) => api.cancel(id),
  }),
];

<ForgeAgent endpoint="/api/agent" tools={tools} />;
```

**服务端工具**用服务端的凭据执行，适合查数据库、调内部服务：

```ts
import { createAgentHandler, tool } from "@forge-ui-official/agent/server";
import { z } from "zod";

export const POST = createAgentHandler({
  model,
  instructions,
  tools: {
    order_stats: tool({
      description: "查询最近 N 天的订单数和金额。",
      inputSchema: z.object({ days: z.number().int().min(1).max(90) }),
      execute: async ({ days }) => db.orderStats(days),
    }),
  },
});
```

回答里的表格、指标和图表只能使用本轮工具返回的数字，对不上的会被替换成提示，不会展示编出来的数。

## 操作页面

开启 `operate` 后，助手读取页面上的按钮、链接、输入框、下拉框（不截图），按编号操作，每一步都核对元素名称。用户在输入框右下角选择方式：

- **演示给我看**：指针慢慢移过去、圈出目标，适合教用户怎么操作。
- **直接帮我做**：同样的步骤，快速完成。

操作期间页面被锁定，用户的点击和键盘不会打断它；按 Esc 或底部的「停止」结束。名称里带提交、删除、保存、付款等字样的按钮会先请用户确认；密码和验证码不读不填。

用属性告诉助手页面的边界：

| 属性 | 作用 |
|---|---|
| `data-agent-ignore` | 这块区域助手看不到、也不能操作 |
| `data-agent-confirm` | 点这块里的元素前先请用户确认 |
| `data-agent-name="…"` | 给没有文字的控件起名字（图标按钮、色块） |
| `data-agent-description="…"` | 补一句说明，比如「会立即生效」 |

用 Next.js 时把路由跳转交给它，避免整页刷新：

```tsx
const router = useRouter();
<ForgeAgent endpoint="/api/agent" operate={{ navigate: path => router.push(path) }} />;
```

## 知识：不用向量库，也不必每次都带

三种方式都在 `createAgentHandler` 上配置，可以只用其中一种。

```ts
export const POST = createAgentHandler({
  model,
  instructions,
  // 1. 只在用户位于这些页面时附带；"/orders/*" 覆盖其下所有页面，最长的匹配优先
  pageInstructions: {
    "/orders": "状态筛选在表格上方；「导出」只导出当前筛选结果。",
    "/settings/*": "改动要点页面底部的「保存」才生效。",
  },
  // 2. 每次只带标题和一句说明，需要时模型调用 read_topic 读全文
  topics: [
    {
      id: "refund-policy",
      title: "退款规则",
      summary: "哪些订单能退、多久到账。",
      content: () => readFile("docs/refund.md", "utf8"),
      match: [/退款|退货/], // 问题命中时随请求直接带上全文，省一轮
    },
  ],
  // 3. 固定问题直接回答，不调用模型
  answers: [{ question: "怎么联系客服？", answer: "工作日 9:00–18:00 拨打 400-000-0000。" }],
});
```

`match` 宁可写窄：没命中只是多一轮读取，误命中会带偏回答。

## 重放：同样的操作不再问模型

一次页面操作顺利完成后，助手按元素名称记下步骤（存在浏览器本地）；之后在同一页面提出完全相同的请求，直接重放，不调用模型。某一步在页面上找不到唯一对应的元素时，交回模型从当前页面继续，并删掉这条记录。需要用户确认的、用了服务端工具的、不是对话第一句的请求不会被记录。

常用请求（例如推荐问题）可以直接写好步骤：

```tsx
const playbooks = [
  {
    request: "带我把主色换成绿色",
    steps: [
      { tool: "open_page", input: { path: "/settings/theme" } },
      { tool: "click", input: { name: "绿", group: "主色" } },
    ],
    reply: "主色已换成绿色，下方是预览。",
  },
];

<ForgeAgent endpoint="/api/agent" operate playbooks={playbooks} version={BUILD_ID} />;
```

`group` 是元素所在分组的标题，名称重复时用来区分。页面改版后换一个 `version`，旧记录作废；`remember={false}` 关闭自动记录。

## ForgeAgent 参数

| 参数 | 说明 |
|---|---|
| `endpoint` | 调用 `createAgentHandler` 的接口地址 |
| `title` / `greeting` / `suggestions` / `launcherLabel` | 标题、开场白、推荐问题、入口文字 |
| `context` | 每次发送时附带的页面信息，可以是函数，例如当前路由和选中的记录 |
| `tools` | 浏览器工具，用 `defineTool` 定义 |
| `toolLabels` | 服务端工具在界面上显示的名称 |
| `operate` | 操作页面；`true` 或 `{ navigate, defaultMode }` |
| `playbooks` / `remember` / `version` | 重放，见上 |
| `storageKey` | 对话存到 localStorage 的键；不传则刷新后清空 |
| `defaultOpen` | 默认展开 |

## createAgentHandler 参数

| 参数 | 说明 |
|---|---|
| `model` | AI SDK 的模型，例如 `createOpenAICompatible(...)(模型名)` |
| `instructions` | 系统提示，可以是根据页面信息返回字符串的函数 |
| `tools` | 服务端工具，用 `tool` 定义 |
| `maxSteps` | 每次请求最多几步（含工具调用），默认 8 |
| `ui` | 是否允许用组件回答，默认开 |
| `pageInstructions` / `topics` / `answers` | 知识，见上 |

返回值是标准的 `(Request) => Promise<Response>`，可以直接用在 Next.js 路由、Hono、Cloudflare Workers 等环境。

## 许可证

MIT
