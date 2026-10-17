"use client";

import { useState } from "react";
import Link from "next/link";
import { ChatInputBar } from "@forge-ui-official/core";
import { CompleteApiReference } from "../_complete-api-reference";
import { CodeBlock } from "../_api-table";
import { PageHeading, Section } from "../_shared";
import { demoSources } from "../../cases/chat-input-bar/_sources";

const CODE_USAGE = `import { ChatInputBar } from "@forge-ui-official/core";

<ChatInputBar
  multiline
  sendOnEnter
  sources={sources}
  onSend={message => setMessages(current => [...current, message])}
/>`;

export default function ChatInputBarPage() {
  const [messages, setMessages] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="消息输入栏"
        hint="多行输入、发送和 @ 引用。发送与停止、模型菜单、抽屉、全屏和窄屏在组件案例。"
      />

      <Section title="基本用法" description="回车发送。输入 @ 选择引用对象，选中后显示为可删除的芯片。">
        <ChatInputBar
          multiline
          sendOnEnter
          sources={demoSources}
          onSend={(message) => setMessages((current) => [...current, message])}
        />
        {messages.length > 0 && (
          <ul className="text-sm text-fg-grey-700">
            {messages.map((item) => (
              <li key={item}>已发送：{item}</li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="使用方法">
        <CodeBlock code={CODE_USAGE} />
      </Section>

      <Section title="参数说明" description="支持受控输入、生成状态、附件、提及、快捷操作、模型与权限选择，以及回复和录音状态。">
        <CompleteApiReference name="ChatInputBar" />
      </Section>

      <p className="text-sm leading-6 text-fg-grey-700">
        发送与停止、快捷卡片、模型菜单、Ask AI 抽屉、全屏和窄屏见
        <Link href="/cases/chat-input-bar" className="mx-1 font-semibold text-fg-black underline underline-offset-4">消息输入栏案例</Link>。
      </p>
    </div>
  );
}
