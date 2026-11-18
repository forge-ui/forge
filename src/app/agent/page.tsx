import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "../components/_api-table";
import { PageHeading, Section, SubSection } from "../components/_shared";
import { AGENT_ENTRIES, AGENT_GROUPS } from "./_kit/_agent-meta";

export const metadata: Metadata = {
  title: { absolute: "Forge Agent · 智能体界面组件 · Forge UI" },
  description: "给 React 应用加一个能回答、能调接口、能操作页面的 AI 助手，以及做智能体界面的整套组件：对话、思考、工具调用、确认、引用、运行、治理和观测。",
  alternates: { canonical: "/agent" },
};

const INSTALL = `pnpm add @forge-ui-official/agent zod`;
const SERVER = `// app/api/agent/route.ts
import { createAgentHandler, createOpenAICompatible } from "@forge-ui-official/agent/server";

const provider = createOpenAICompatible({ name: "my-agent", baseURL: process.env.AGENT_BASE_URL!, apiKey: process.env.AGENT_API_KEY! });

export const POST = createAgentHandler({
  model: provider("qwen3.8-flash"),
  instructions: "你是「示例后台」的助手。用简体中文，先给结论。",
});`;
const CLIENT = `// app/assistant.tsx
"use client";
import { ForgeAgent } from "@forge-ui-official/agent";

export function Assistant() {
  return <ForgeAgent endpoint="/api/agent" title="问助手" suggestions={["这个页面能做什么？"]} operate />;
}`;
const HEADER = `// 已有页头的 askAi 入口不变，打开的就是 Forge Agent 面板
<PageHeader title="订单" askAi={{ suggestions: ["本周退款最多的是？"], onSend: ask }} />`;

export default function AgentHome() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Forge Agent"
        hint="给 React 应用加一个 AI 助手：回答问题、调用你的接口、用 Forge 组件作答、在页面上替用户操作；模型和数据都在你自己的服务器上。下面是它的运行时和做智能体界面用的全部组件。"
      />

      <Section title="接入" description="三步：装包、服务端接口、放上助手。完整说明见 agent 包的 README。">
        <SubSection title="1. 安装" stack><CodeBlock code={INSTALL} /></SubSection>
        <SubSection title="2. 服务端接口" stack><CodeBlock code={SERVER} /></SubSection>
        <SubSection title="3. 放上助手" stack><CodeBlock code={CLIENT} /></SubSection>
        <SubSection title="已有页头入口" stack><CodeBlock code={HEADER} /></SubSection>
      </Section>

      {AGENT_GROUPS.map(group => (
        <Section key={group.title} title={group.title} description={group.description}>
          <div className="grid gap-3 sm:grid-cols-2">
            {AGENT_ENTRIES.filter(entry => entry.group === group.title).map(entry => (
              <Link key={entry.slug} href={`/agent/${entry.slug}`} className="flex flex-col gap-1 rounded-2xl border border-fg-grey-200 bg-background p-4 transition-colors hover:border-fg-grey-300 hover:bg-fg-grey-50">
                <span className="text-sm font-semibold tracking-fg text-fg-black">{entry.title}</span>
                <span className="line-clamp-2 text-sm leading-6 text-fg-grey-700">{entry.summary}</span>
              </Link>
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}
