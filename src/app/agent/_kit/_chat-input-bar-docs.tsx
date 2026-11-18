"use client";

import { useState } from "react";
import { ChatInputBar } from "@forge-ui-official/core";
import { CompleteApiReference } from "../../components/_complete-api-reference";
import { CodeBlock } from "../../components/_api-table";
import { Section } from "../../components/_shared";
import { demoSources } from "./_sources";

const CODE_USAGE = `import { ChatInputBar } from "@forge-ui-official/core";

<ChatInputBar
  multiline
  sendOnEnter
  sources={sources}
  onSend={message => setMessages(current => [...current, message])}
/>`;

export function ChatInputBarDocs() {
  const [messages, setMessages] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-10">

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
    </div>
  );
}
