"use client";

import Link from "next/link";
import { ChatBubble, ChatInputBar } from "@forge-ui/react";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { ChatBubble, ChatInputBar } from "@forge-ui/react";`;

const CODE_BUBBLE_USAGE = `<ChatBubble type="received" avatar={avatar} senderName="Alex" content="Hey, how's it going?" />
<ChatBubble type="sent" content="All good, working on the new design." time="10:32" />`;

const CODE_BUBBLE_VOICE = `<ChatBubble type="received" variant="voice" voiceDuration="0:15" avatar={avatar} />
<ChatBubble type="sent" variant="voice" voiceDuration="0:08" />`;

const CODE_BUBBLE_FILE = `<ChatBubble type="received" variant="file" fileName="brief.pdf" fileSize="2.4 MB" avatar={avatar} />`;

const CODE_BUBBLE_COLOR = `<ChatBubble type="sent" color="purple" content="Purple" />
<ChatBubble type="sent" color="blue" content="Blue" />
<ChatBubble type="sent" color="black" content="Black" />`;

const CODE_INPUT_USAGE = `<ChatInputBar onSend={(msg) => console.log(msg)} />`;

const BUBBLE_PROPS: ApiTableRow[] = [
  { attr: "type", type: "'sent' | 'received'", defaultValue: "—", description: "决定左右对齐、气泡背景与圆角缺口方向。" },
  { attr: "variant", type: "'text' | 'voice' | 'file' | 'image'", defaultValue: "'text'", description: "气泡内容类型。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "主色（影响 sent 气泡背景、voice 播放按钮等）。" },
  { attr: "content", type: "string", defaultValue: "—", description: "text 变体正文。" },
  { attr: "time", type: "string", defaultValue: "—", description: "气泡下方时间文案。" },
  { attr: "avatar", type: "string", defaultValue: "—", description: "received 变体左侧头像 URL。" },
  { attr: "senderName", type: "string", defaultValue: "—", description: "received 变体上方发送人姓名。" },
  { attr: "images", type: "string[]", defaultValue: "—", description: "image 变体图片数组。" },
  { attr: "extraImageCount", type: "number", defaultValue: "—", description: "image 变体尾部 +N。" },
  { attr: "fileName / fileSize", type: "string", defaultValue: "—", description: "file 变体文件名与大小。" },
  { attr: "voiceDuration", type: "string", defaultValue: "—", description: "voice 变体播放时长文案。" },
];

const INPUT_PROPS: ApiTableRow[] = [
  { attr: "placeholder", type: "string", defaultValue: "'Type a message...'", description: "输入框占位符。" },
  { attr: "onSend", type: "(message: string) => void", defaultValue: "—", description: "发送回调，Enter 或点按钮触发。" },
  { attr: "className", type: "string", defaultValue: "''", description: "额外 className。" },
];

const avatar = "https://i.pravatar.cc/40?img=3";

export default function ChatCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Chat"
        hint="ChatBubble 支持 text / voice / file / image 四变体，ChatInputBar 是底部输入。"
      />

      <Section
        title="ChatBubble"
        description="IM 气泡，左右方向 × 4 变体 × 3 主色。received 渲染白底 + 头像，sent 渲染主色底。"
      >
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Text Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>type</InlineCode> 控制方向，<InlineCode>variant=&quot;text&quot;</InlineCode> 为默认。
          </p>
          <PreviewBlock code={CODE_BUBBLE_USAGE} minHeight={200}>
            <div className="w-full max-w-md flex flex-col gap-3">
              <ChatBubble type="received" avatar={avatar} senderName="Alex" content="Hey, how's it going?" />
              <ChatBubble type="sent" content="All good, working on the new design." time="10:32" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Voice" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>variant=&quot;voice&quot;</InlineCode> 渲染播放按钮 + 21 条波形柱 + 可选时长。
          </p>
          <PreviewBlock code={CODE_BUBBLE_VOICE} minHeight={180}>
            <div className="w-full max-w-md flex flex-col gap-3">
              <ChatBubble type="received" variant="voice" voiceDuration="0:15" avatar={avatar} />
              <ChatBubble type="sent" variant="voice" voiceDuration="0:08" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="File" stack>
          <PreviewBlock code={CODE_BUBBLE_FILE} minHeight={160}>
            <div className="w-full max-w-md">
              <ChatBubble type="received" variant="file" fileName="brief.pdf" fileSize="2.4 MB" avatar={avatar} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Colors" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 主色，下方示意 sent 气泡（received 始终白底）。
          </p>
          <PreviewBlock code={CODE_BUBBLE_COLOR} minHeight={180}>
            <div className="w-full max-w-md flex flex-col gap-3">
              <ChatBubble type="sent" color="purple" content="Purple" />
              <ChatBubble type="sent" color="blue" content="Blue" />
              <ChatBubble type="sent" color="black" content="Black" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={BUBBLE_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="ChatInputBar"
        description="底部输入栏：附件按钮 + 输入框 + 紫色发送按钮，回车即发。"
      >
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_INPUT_USAGE}>
            <div className="w-full max-w-md">
              <ChatInputBar />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={INPUT_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/chat" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
