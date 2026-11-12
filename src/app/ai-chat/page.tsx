import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "@/app/_components/site-header";
import { asset } from "@/lib/asset";
import { pageMetadata } from "@/lib/seo";
import { ConversationDemo, PartsDemo } from "../components/agent/_conversation-demo";

export const metadata = pageMetadata("/ai-chat");

const usage = `"use client";
import { useChat } from "@ai-sdk/react";
import { AgentMessage, AgentParts, ChatInputBar, Conversation } from "@forge-ui-official/core";

export function Chat() {
  const { messages, sendMessage, status } = useChat();
  return (
    <>
      <Conversation followKey={messages.length}>
        {messages.map(message => (
          <AgentMessage key={message.id} role={message.role === "user" ? "user" : "assistant"}>
            <AgentParts parts={message.parts} status={status} />
          </AgentMessage>
        ))}
      </Conversation>
      <ChatInputBar onSend={text => sendMessage({ text })} />
    </>
  );
}`;

const renderTool = `<AgentParts
  parts={message.parts}
  renderTool={{
    getInventory: part => <InventoryCard {...(part.output as Inventory)} />,
  }}
/>`;

const steps = [
  { title: "useChat", body: "AI SDK 管请求、流式和消息状态" },
  { title: "message.parts", body: "文本、思考、工具调用、来源、文件" },
  { title: "AgentParts", body: "按类型分发给对应的 Forge 组件" },
  { title: "页面", body: "流式 Markdown、折叠思考、工具分组、产物卡片" },
];

const components = [
  { name: "Conversation", body: "消息滚动容器。停在底部时自动跟随新内容，上翻后出现“回到最新”。" },
  { name: "AgentMessage", body: "用户消息是右侧气泡，助手回复整宽显示，带名称、头像、时间和操作。" },
  { name: "AgentParts", body: "渲染 AI SDK 的 parts：流式 Markdown、可折叠思考、成组的工具调用、来源和文件。" },
  { name: "ChatInputBar", body: "多行输入，发送和停止，附件、@ 提及和模型菜单。" },
  { name: "MessageActions", body: "复制、重新生成、有帮助 / 没帮助。" },
  { name: "PromptSuggestions", body: "回复下方或空状态里的推荐提问。" },
  { name: "ArtifactCard", body: "生成的文档、代码、表格、图片和文件，带生成中、完成、失败三种状态。" },
  { name: "ApprovalCard", body: "智能体要用户拍板时，把选项列出来，选定后再继续。" },
  { name: "ThinkingTrace · ToolChips · AgentTaskRows", body: "思考步骤、工具调用和任务进度，适合工作台式的智能体界面。" },
];

const alternatives = [
  { name: "Ant Design X", body: "Ant Design 生态的 AI 组件。项目已经在用 Ant Design，选它最顺。" },
  { name: "TDesign Chat", body: "腾讯 TDesign 的对话组件，React、Vue、小程序多端都有。" },
  { name: "Vercel AI Elements", body: "AI SDK 团队基于 shadcn/ui 做的对话组件，源码复制进项目。" },
  { name: "Forge", body: "Tailwind + Next.js 项目，而且对话要放进后台：审批、对比表、任务进度和表格、表单是同一套设计。" },
];

const faqs = [
  { q: "一定要用 AI SDK 吗？", a: "不用。AgentMessage 的内容可以是任何 React 节点；AgentParts 只要求消息是 AI SDK UIMessage 的 parts 结构，自己的后端按这个结构返回也能直接渲染。组件库本身不依赖 ai 这个包。" },
  { q: "支持流式输出吗？", a: "支持。把 useChat 的 status 传给 AgentParts，最后一段文本边收边逐段淡入，按 Markdown 显示标题、列表、表格和代码块；输入栏在生成中会变成“停止生成”。" },
  { q: "能做生成式界面吗？", a: "能。用 renderTool 按工具名把某个工具调用换成自己的组件，模型决定调用哪个工具，界面由你决定长什么样。" },
  { q: "英文界面和深色模式？", a: "组件默认中文文案，传 locale=\"en\" 切成英文；深色模式在 html 上加 data-theme=\"dark\" 即可。" },
];

function Section({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex max-w-2xl flex-col gap-3">
        <h2 className="font-display text-3xl font-bold tracking-fg text-fg-black">{title}</h2>
        {lead && <p className="text-base leading-[1.8] text-fg-grey-700">{lead}</p>}
      </div>
      {children}
    </section>
  );
}

function Code({ children }: { children: string }) {
  return <pre className="overflow-x-auto rounded-2xl border border-fg-grey-200 bg-fg-grey-100 px-5 py-4 font-mono text-sm leading-relaxed text-fg-black"><code>{children}</code></pre>;
}

export default function AiChatPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-28 px-6 pt-16 pb-28 lg:px-8 lg:pt-20">
        <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,36rem)]">
          <div className="flex flex-col items-start gap-6">
            <span className="rounded-full bg-fg-grey-100 px-3 py-1 text-sm font-medium text-fg-grey-900">AI SDK · React 19 · Tailwind v4</span>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-fg text-fg-black sm:text-5xl">React AI 对话组件</h1>
            <p className="max-w-xl text-lg leading-8 text-fg-grey-700">
              消息、输入栏、操作、推荐提问和产物卡片，加上一个 <code className="font-mono text-base text-fg-black">AgentParts</code>：把 AI SDK <code className="font-mono text-base text-fg-black">useChat</code> 的消息直接渲染成界面，流式回答、思考过程和工具调用都不用自己拼。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/components/agent" className="rounded-full bg-fg-black px-5 py-3 text-sm font-semibold text-white">组件文档和参数</Link>
              <Link href="/templates/agent" className="rounded-full border border-fg-grey-200 bg-background px-5 py-3 text-sm font-semibold text-fg-black">智能体工作台模板</Link>
            </div>
            <p className="text-sm text-fg-grey-700">对话框里可以直接点推荐提问或输入，回复是示例数据。</p>
          </div>
          <ConversationDemo />
        </section>

        <Section title="接入 AI SDK 只要几行" lead="AI SDK 负责请求和流式，Forge 负责把每一段消息显示对。">
          <ol className="grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="relative flex flex-col gap-2 rounded-2xl border border-fg-grey-200 bg-fg-grey-50 p-5 md:after:absolute md:after:top-1/2 md:after:-right-4 md:after:-translate-y-1/2 md:after:text-fg-grey-400 md:after:content-['→'] md:last:after:content-none">
                <span className="flex size-6 items-center justify-center rounded-full bg-fg-black text-xs font-semibold text-white">{index + 1}</span>
                <code className="font-mono text-sm font-semibold text-fg-black">{step.title}</code>
                <span className="text-sm leading-6 text-fg-grey-700">{step.body}</span>
              </li>
            ))}
          </ol>
          <Code>{usage}</Code>
        </Section>

        <Section title="一条回复里的每一段" lead="思考过程折叠起来，连续的工具调用合成一组并显示状态，来源挂在回答下面，生成的文件变成产物卡片。打开开关，看 renderTool 怎么把库存查询换成自定义卡片。">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div className="rounded-3xl border border-fg-grey-200 p-6">
              <PartsDemo />
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-fg-black">生成式界面：renderTool</h3>
              <p className="text-base leading-[1.8] text-fg-grey-700">按工具名把工具调用换成你自己的组件。模型决定调用哪个工具，界面长什么样由你决定；返回 null 时仍显示默认的工具记录。</p>
              <Code>{renderTool}</Code>
            </div>
          </div>
        </Section>

        <Section title="组件一览" lead="都从 @forge-ui-official/core 导入，和表格、表单、看板是同一套设计。">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {components.map(item => (
              <div key={item.name} className="flex flex-col gap-2 rounded-2xl border border-fg-grey-200 p-5">
                <code className="font-mono text-sm font-semibold text-fg-black">{item.name}</code>
                <p className="text-sm leading-6 text-fg-grey-700">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-fg-grey-700">完整参数和更多例子在<Link href="/components/agent" className="text-fg-black underline underline-offset-4">智能体组件文档</Link>；输入栏的附件、提及和模型菜单见<Link href="/components/chat-input-bar" className="text-fg-black underline underline-offset-4">消息输入栏</Link>。</p>
        </Section>

        <Section title="放进后台，就是一个智能体工作台" lead="智能体模板把这些组件放在一起：流式回答、停止和重试、工具调用、计划审核和交互输入。">
          <Link href="/templates/agent" className="group block overflow-hidden rounded-3xl border border-fg-grey-200 bg-fg-grey-100">
            <div className="relative aspect-[1512/828] w-full">
              <Image src={asset("/images/showcase/agent-workspace.png")} alt="Forge 智能体工作台模板截图" fill sizes="(max-width: 1200px) 100vw, 1152px" className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]" unoptimized />
            </div>
          </Link>
        </Section>

        <Section title="和其他方案怎么选">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {alternatives.map(item => (
              <div key={item.name} className={`flex flex-col gap-2 rounded-2xl border p-5 ${item.name === "Forge" ? "border-fg-black" : "border-fg-grey-200"}`}>
                <h3 className="font-semibold text-fg-black">{item.name}</h3>
                <p className="text-sm leading-6 text-fg-grey-700">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-fg-grey-700">更完整的组件库对比见<Link href="/articles/react-ui-library-2026" className="text-fg-black underline underline-offset-4">《2026 年 React 组件库怎么选》</Link>。</p>
        </Section>

        <Section title="常见问题">
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
            {faqs.map(item => (
              <div key={item.q} className="flex flex-col gap-2">
                <h3 className="font-semibold text-fg-black">{item.q}</h3>
                <p className="text-sm leading-7 text-fg-grey-700">{item.a}</p>
              </div>
            ))}
          </div>
          <Code>{"npm install @forge-ui-official/core"}</Code>
        </Section>
      </main>
    </div>
  );
}
