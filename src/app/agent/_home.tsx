"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@forge-ui-official/core";
import { ArrowRightLinear, ChartSquareLinear, LockKeyholeLinear, PenLinear, StarsLinear, WidgetLinear } from "@forge-ui-official/core/icons";
import { CodeBlock } from "../components/_api-table";
import { AGENT_DEMOS } from "./_kit/_agent-entries";
import { AGENT_ENTRIES, AGENT_GROUPS, type AgentEntryMeta } from "./_kit/_agent-meta";
import { AnalysisScenario } from "./scenarios/_scenarios";

const SETUP = [
  { title: "装包", code: `pnpm add @forge-ui-official/agent zod` },
  {
    title: "服务端接口",
    code: `// app/api/agent/route.ts
import { createAgentHandler, createOpenAICompatible } from "@forge-ui-official/agent/server";

const provider = createOpenAICompatible({ name: "my-agent", baseURL: process.env.AGENT_BASE_URL!, apiKey: process.env.AGENT_API_KEY! });

export const POST = createAgentHandler({ model: provider("qwen3.8-flash"), instructions: "你是「示例后台」的助手。" });`,
  },
  {
    title: "放上助手",
    code: `"use client";
import { ForgeAgent } from "@forge-ui-official/agent";

export function Assistant() {
  return <ForgeAgent endpoint="/api/agent" title="问助手" operate />;
}`,
  },
];

const FEATURES = [
  { icon: LockKeyholeLinear, title: "部署在你自己的服务器", body: "模型密钥和业务数据不出你的环境，接通义千问、DeepSeek 等任何 OpenAI 兼容接口。" },
  { icon: ChartSquareLinear, title: "用组件回答", body: "图表、表格、表单、确认卡直接画在对话里，数字只取查询结果。" },
  { icon: PenLinear, title: "能在页面上动手", body: "演示给你看，或者直接帮你点、填、选；改数据前先确认，事后可撤销。" },
  { icon: WidgetLinear, title: "整套界面组件", body: `${AGENT_ENTRIES.length} 个组件覆盖对话、思考、工具、确认、运行、治理和观测。` },
];

// Live previews mount only once they scroll into view; the gallery holds dozens of animated demos.
function LivePreview({ entry }: { entry: AgentEntryMeta }) {
  const holder = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = holder.current;
    if (!node) return;
    const observer = new IntersectionObserver(([item]) => { if (item.isIntersecting) { setVisible(true); observer.disconnect(); } }, { rootMargin: "200px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const Demo = AGENT_DEMOS[entry.slug].demo;
  return (
    <div ref={holder} aria-hidden="true" inert className="pointer-events-none relative h-48 overflow-hidden rounded-xl bg-fg-grey-50">
      {visible && (
        <div className="absolute left-1/2 top-4 w-[480px] origin-top -translate-x-1/2 scale-[0.62]">
          <div className="flex justify-center">
            <Demo />
          </div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-fg-grey-50 to-transparent" />
    </div>
  );
}

function EntryCard({ entry }: { entry: AgentEntryMeta }) {
  return (
    <Link href={`/agent/${entry.slug}`} className="group flex flex-col gap-3 rounded-2xl border border-fg-grey-200 bg-background p-3 transition hover:-translate-y-0.5 hover:border-fg-grey-300 hover:shadow-[0_8px_24px_-12px_rgba(77,84,100,0.35)]">
      <LivePreview entry={entry} />
      <div className="flex flex-col gap-1 px-1 pb-1">
        <span className="flex items-center justify-between gap-2 text-sm font-semibold tracking-fg text-fg-black">
          {entry.title.split(" · ")[0]}
          <ArrowRightLinear size={14} color="var(--fg-grey-500)" className="opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
        <span className="line-clamp-2 text-xs leading-5 text-fg-grey-700">{entry.summary}</span>
      </div>
    </Link>
  );
}

const pill = "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold tracking-fg transition";

export function AgentHome() {
  const [group, setGroup] = useState<string>(AGENT_GROUPS[0].title);
  const entries = AGENT_ENTRIES.filter(entry => entry.group === group);
  return (
    <div className="flex flex-col gap-16">
      <section className="relative -mx-4 overflow-hidden rounded-[28px] border border-fg-grey-200 bg-background px-6 py-10 md:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 size-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--fg-cyan-500)_22%,transparent),transparent_70%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/3 size-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--fg-blue-500)_16%,transparent),transparent_70%)]" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border-[1.5px] border-transparent px-3 py-1 text-xs font-semibold text-fg-black [background:linear-gradient(var(--background),var(--background))_padding-box,linear-gradient(120deg,var(--fg-blue-500),var(--fg-cyan-500),var(--fg-green-500))_border-box]">
              <StarsLinear size={14} color="var(--fg-blue-500)" />Forge Agent
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-fg text-fg-black md:text-5xl">给后台加一个<br />能干活的 AI 同事</h1>
            <p className="max-w-md text-base leading-7 text-fg-grey-700">回答问题、调用你的接口、用图表和表格作答、在页面上替用户操作。一套运行时，加上做智能体界面要用的全部组件。</p>
            <div className="flex flex-wrap gap-3">
              <a href="#setup" className={cn(pill, "bg-fg-black text-white hover:bg-fg-grey-900")}>开始接入<ArrowRightLinear size={16} /></a>
              <Link href="/agent/scenarios" className={cn(pill, "border border-fg-grey-200 bg-background text-fg-black hover:bg-fg-grey-50")}>看完整场景</Link>
            </div>
            <dl className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
              {[[`${AGENT_ENTRIES.length}`, "个组件"], ["6", "个场景"], ["12", "个 AI 页面组件"], ["1", "套运行时"]].map(([value, label]) => (
                <div key={label} className="flex items-baseline gap-1.5"><dt className="font-display text-2xl font-semibold text-fg-black">{value}</dt><dd className="text-sm text-fg-grey-700">{label}</dd></div>
              ))}
            </dl>
          </div>
          <div className="relative max-h-[560px] min-w-0 overflow-hidden rounded-3xl border border-fg-grey-200 bg-background/80 p-3 shadow-[0_24px_60px_-30px_rgba(31,64,140,0.35)] backdrop-blur">
            <AnalysisScenario />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(feature => (
          <div key={feature.title} className="flex flex-col gap-3 rounded-2xl border border-fg-grey-200 bg-background p-5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-fg-blue-50"><feature.icon size={20} color="var(--fg-blue-500)" /></span>
            <span className="text-sm font-semibold tracking-fg text-fg-black">{feature.title}</span>
            <span className="text-sm leading-6 text-fg-grey-700">{feature.body}</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl font-semibold tracking-fg text-fg-black">组件</h2>
          <p className="text-sm leading-6 text-fg-grey-700">{AGENT_GROUPS.find(item => item.title === group)?.description}</p>
        </div>
        <div role="tablist" aria-label="组件分类" className="flex flex-wrap gap-2">
          {AGENT_GROUPS.map(item => {
            const active = item.title === group;
            const count = AGENT_ENTRIES.filter(entry => entry.group === item.title).length;
            return (
              <button key={item.title} type="button" role="tab" aria-selected={active} onClick={() => setGroup(item.title)}
                className={cn("h-9 rounded-full px-4 text-sm font-semibold tracking-fg transition", active ? "bg-fg-black text-white" : "border border-fg-grey-200 bg-background text-fg-grey-900 hover:bg-fg-grey-50")}>
                {item.title}<span className={cn("ml-1.5 text-xs", active ? "text-white/70" : "text-fg-grey-500")}>{count}</span>
              </button>
            );
          })}
        </div>
        <div key={group} className="forge-fade-up grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(entry => <EntryCard key={entry.slug} entry={entry} />)}
        </div>
      </section>

      <section id="setup" className="flex scroll-mt-24 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl font-semibold tracking-fg text-fg-black">三步接入</h2>
          <p className="text-sm leading-6 text-fg-grey-700">已有页头的 <code className="rounded bg-fg-grey-100 px-1 text-[13px]">askAi</code> 入口不用改，打开的就是 Forge Agent 面板。完整说明见 agent 包的 README。</p>
        </div>
        <ol className="flex flex-col gap-4">
          {SETUP.map((step, index) => (
            <li key={step.title} className="grid gap-3 md:grid-cols-[180px_1fr]">
              <span className="flex items-center gap-3 text-sm font-semibold text-fg-black md:items-start md:pt-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-fg-black text-xs text-white">{index + 1}</span>{step.title}
              </span>
              <CodeBlock code={step.code} />
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { href: "/agent/scenarios", title: "场景", body: "经营分析、退款处理、多步任务、文档写作、后台任务、多智能体协作。" },
          { href: "/agent/motion", title: "动效", body: "逐字淡入、发送与停止、快捷卡片、思考扫光，组件里都已内置。" },
          { href: "/templates/agent", title: "智能体模板", body: "一整套可运行的智能体工作台，配合 12 个 AI 页面组件。" },
        ].map(item => (
          <Link key={item.href} href={item.href} className="group flex flex-col gap-2 rounded-2xl border border-fg-grey-200 bg-background p-5 transition hover:border-fg-grey-300 hover:bg-fg-grey-50">
            <span className="flex items-center justify-between text-sm font-semibold text-fg-black">{item.title}<ArrowRightLinear size={16} color="var(--fg-grey-500)" className="transition-transform group-hover:translate-x-0.5" /></span>
            <span className="text-sm leading-6 text-fg-grey-700">{item.body}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
