import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Block, Code } from "../_chrome";
import { EnglishConversationDemo, EnglishPartsDemo } from "./_demo";

export const metadata = pageMetadata("/en/ai-chat-components");

const usage = `"use client";
import { useChat } from "@ai-sdk/react";
import { AgentMessage, AgentParts, ChatInputBar, Conversation } from "@forge-ui-official/core";

export function Chat() {
  const { messages, sendMessage, status } = useChat();
  return (
    <>
      <Conversation followKey={messages.length} locale="en">
        {messages.map(message => (
          <AgentMessage key={message.id} role={message.role === "user" ? "user" : "assistant"}>
            <AgentParts parts={message.parts} status={status} locale="en" />
          </AgentMessage>
        ))}
      </Conversation>
      <ChatInputBar locale="en" onSend={text => sendMessage({ text })} />
    </>
  );
}`;

const renderTool = `<AgentParts
  parts={message.parts}
  renderTool={{
    getWeather: part => <WeatherCard {...(part.output as Weather)} />,
  }}
/>`;

const components = [
  ["Conversation", "Scroll container that follows new content and shows “Jump to latest” when the user scrolls up."],
  ["AgentMessage", "User bubble or full-width assistant reply with name, avatar, time and actions."],
  ["AgentParts", "Renders AI SDK UIMessage parts: streaming markdown, collapsible reasoning, grouped tool calls with status, sources and files."],
  ["MessageActions", "Copy, regenerate and thumbs up/down."],
  ["PromptSuggestions", "Suggested prompts under a reply or in an empty state."],
  ["ArtifactCard", "Generated documents, code, tables, images and files with generating, ready and error states."],
  ["ChatInputBar", "Multi-line input with send and stop, attachments, @ mentions and a model menu."],
];

export default function AiChatComponentsPage() {
  return (
    <article className="mx-auto flex max-w-4xl flex-col gap-12">
      <header className="flex max-w-3xl flex-col gap-5">
        <h1 className="font-display text-4xl font-bold leading-tight tracking-fg text-fg-black">React AI chat components for the AI SDK</h1>
        <p className="text-lg leading-8 text-fg-grey-900">
          Conversation, message, action and artifact components for React, plus <code className="font-mono text-base">AgentParts</code>, which renders the messages from the AI SDK&apos;s <code className="font-mono text-base">useChat</code> as they stream. No dependency on the <code className="font-mono text-base">ai</code> package itself.
        </p>
      </header>

      <Block title="Try it">
        <EnglishConversationDemo />
        <p className="text-sm text-fg-grey-700">Sample replies — click a suggestion or type a question.</p>
      </Block>

      <Block title="Render AI SDK messages">
        <p>Pass <code className="font-mono text-sm">message.parts</code> straight in. Consecutive tool calls collapse into one group with live status, reasoning folds away, sources attach under the answer and files become artifact cards.</p>
        <EnglishPartsDemo />
        <Code>{usage}</Code>
      </Block>

      <Block title="Generative UI with renderTool">
        <p>Swap any tool call for your own component by tool name — the model decides which tool to call, your UI decides how it looks.</p>
        <Code>{renderTool}</Code>
      </Block>

      <Block title="Components">
        <ul className="flex flex-col divide-y divide-fg-grey-200 rounded-card border border-fg-grey-200 bg-background">
          {components.map(([name, body]) => (
            <li key={name} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:gap-6">
              <code className="w-44 shrink-0 font-mono text-sm font-semibold text-fg-black">{name}</code>
              <span className="text-sm leading-6 text-fg-grey-900">{body}</span>
            </li>
          ))}
        </ul>
        <p>
          Install with <code className="font-mono text-sm">npm install @forge-ui-official/core</code>. Labels default to Chinese; pass <code className="font-mono text-sm">locale=&quot;en&quot;</code> for English. Live examples of the full agent kit — thinking traces, approvals, task rows, diff review — are on the <Link href="/components/agent" hrefLang="zh-CN" className="text-fg-blue underline underline-offset-4">agent components page</Link> (Chinese), and a complete <Link href="/templates/agent" className="text-fg-blue underline underline-offset-4">agent workspace template</Link> shows them together.
        </p>
      </Block>

      <Block title="How it compares">
        <ul className="ml-5 list-disc space-y-2">
          <li><strong className="text-fg-black">Vercel AI Elements</strong> — shadcn-based chat building blocks from the AI SDK team. Forge covers similar ground and adds admin-oriented pieces (approvals, diff tables, task rows) that match its tables, forms and dashboards.</li>
          <li><strong className="text-fg-black">Ant Design X / TDesign Chat</strong> — AI chat kits from the Ant Design and TDesign ecosystems. Pick them if your app already uses those libraries; pick Forge if you use Tailwind and Next.js.</li>
        </ul>
      </Block>

      <p className="text-sm text-fg-grey-700">
        Next: <Link href="/en/frontend-design-skill" className="text-fg-blue underline underline-offset-4">Frontend design skill</Link> · <Link href="/en/admin-templates" className="text-fg-blue underline underline-offset-4">React admin templates</Link>
      </p>
    </article>
  );
}
