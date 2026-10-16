"use client";

import Link from "next/link";
import { ChatBubble } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { ChatBubble } from "@forge-ui-official/core";`;

const CODE_BUBBLE_USAGE = `<ChatBubble type="received" avatar={avatar} senderName="林晓" content="最近进展怎么样？" />
<ChatBubble type="sent" content="进展顺利，正在完善新的设计方案。" time="10:32" />`;

const CODE_BUBBLE_VOICE = `<ChatBubble type="received" variant="voice" voiceDuration="0:15" avatar={avatar} />
<ChatBubble type="sent" variant="voice" voiceDuration="0:08" />`;

const CODE_BUBBLE_FILE = `<ChatBubble type="received" variant="file" fileName="brief.pdf" fileSize="2.4 MB" avatar={avatar} />`;

const CODE_BUBBLE_COLOR = `<ChatBubble type="sent" color="purple" content="紫色" />
<ChatBubble type="sent" color="blue" content="蓝色" />
<ChatBubble type="sent" color="black" content="黑色" />`;

const BUBBLE_PROPS: ApiTableRow[] = [
  { attr: "type", type: "'sent' | 'received'", defaultValue: "—", description: "决定左右对齐、气泡背景与圆角缺口方向。" },
  { attr: "variant", type: "'text' | 'voice' | 'file' | 'image'", defaultValue: "'text'", description: "气泡内容类型。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "主色（影响 sent 气泡背景、voice 播放按钮等）。" },
  { attr: "content", type: "string", defaultValue: "—", description: "text 变体正文。" },
  { attr: "time", type: "string", defaultValue: "—", description: "气泡下方时间文案。" },
  { attr: "avatar", type: "string", defaultValue: "—", description: "received 变体左侧头像 URL。" },
  { attr: "senderName", type: "string", defaultValue: "—", description: "received 变体上方发送人姓名。" },
  { attr: "images", type: "string[]", defaultValue: "—", description: "image 变体图片数组。" },
  { attr: "extraImageCount", type: "number", defaultValue: "—", description: "image 变体尾部 +N。" },
  { attr: "fileName / fileSize", type: "string", defaultValue: "—", description: "file 变体文件名与大小。" },
  { attr: "voiceDuration", type: "string", defaultValue: "—", description: "voice 变体播放时长文案。" },
];

const avatar = "https://i.pravatar.cc/40?img=3";

export default function ChatCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="聊天"
        hint="展示文字、语音、图片和文件消息。消息输入栏在「消息输入栏」页。"
      />

      <Section
        title="ChatBubble"
        description="展示收到或发出的文字、语音、文件和图片消息。"
      >
        <SubSection title="导入组件" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="文本消息" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>type</InlineCode> 控制方向，<InlineCode>variant=&quot;text&quot;</InlineCode> 为默认。
          </p>
          <PreviewBlock code={CODE_BUBBLE_USAGE} minHeight={200}>
            <div className="w-full max-w-md flex flex-col gap-3">
              <ChatBubble type="received" avatar={avatar} senderName="林晓" content="最近进展怎么样？" />
              <ChatBubble type="sent" content="进展顺利，正在完善新的设计方案。" time="10:32" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="语音" stack>
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

        <SubSection title="文件" stack>
          <PreviewBlock code={CODE_BUBBLE_FILE} minHeight={160}>
            <div className="w-full max-w-md">
              <ChatBubble type="received" variant="file" fileName="brief.pdf" fileSize="2.4 MB" avatar={avatar} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="颜色" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 主色，下方示意 sent 气泡（received 始终白底）。
          </p>
          <PreviewBlock code={CODE_BUBBLE_COLOR} minHeight={180}>
            <div className="w-full max-w-md flex flex-col gap-3">
              <ChatBubble type="sent" color="purple" content="紫色" />
              <ChatBubble type="sent" color="blue" content="蓝色" />
              <ChatBubble type="sent" color="black" content="黑色" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={BUBBLE_PROPS} />
        </SubSection>
      </Section>

      <p className="text-sm leading-6 text-fg-grey-700">
        输入、附件、提及和停止生成见
        <Link href="/components/chat-input-bar" className="mx-1 font-semibold text-fg-black underline underline-offset-4">消息输入栏</Link>。
      </p>
    </div>
  );
}
