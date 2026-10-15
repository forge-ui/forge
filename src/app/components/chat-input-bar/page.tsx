import { CompleteApiReference } from "../_complete-api-reference";
import { ExampleCode } from "../_example-code";
import ChatInputBarExamples from "../../cases/chat-input-bar/page";
import { CodeBlock } from "../_api-table";
import { Section } from "../_shared";

export default function ChatInputBarPage() {
  return <>
    <ChatInputBarExamples />
    <ExampleCode files={["src/app/cases/chat-input-bar/page.tsx", "src/app/cases/chat-input-bar/_generation-demo.tsx", "src/app/cases/chat-input-bar/_sources.ts"]} />
    <Section title="使用方法"><CodeBlock code={'import { ChatInputBar } from "@forge-ui-official/core";\n\n<ChatInputBar multiline sendOnEnter onSend={message => setMessages(current => [...current, message])} />'} /></Section>
    <Section title="参数说明" description="支持受控输入、生成状态、附件、提及、快捷操作、模型与权限选择，以及回复和录音状态。">
      <CompleteApiReference name="ChatInputBar" />
    </Section>
  </>;
}
