"use client";

import { PageHeading, Section } from "../../components/_shared";
import { ChatInputBarGenerationDemo } from "../_kit/_generation-demo";
import { AgentComposerDemo, ReasoningDemo, ThinkingIndicatorDemo } from "../_kit/_kit-demos";
import { StreamingAnswerDemo } from "../_kit/_streaming-demo";

export default function AgentMotionPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading title="动效" hint="Forge Agent 的几种标志性动效：回答逐字淡入、发送与停止、快捷卡片展开收起、思考时的扫光和计时。组件已经内置，不用另外接。" />
      <Section title="逐字淡入" description="StreamingAnswer：文字按网络到达的节奏缓冲，再逐字淡入（500ms 线性）；停止时保留已经显示的部分。">
        <StreamingAnswerDemo />
      </Section>
      <Section title="发送、生成与停止" description="ChatInputBar：发送后按钮变成停止；运行中可以继续编辑草稿，确认停止后恢复发送。">
        <ChatInputBarGenerationDemo />
      </Section>
      <Section title="快捷卡片" description="空对话时输入框上方展开卡片，发送后自然收起，左侧加号可以再打开。">
        <AgentComposerDemo />
      </Section>
      <Section title="思考与等待" description="第一个字出来前的扫光与计时，思考结束后折成一行。">
        <div className="flex w-full max-w-xl flex-col gap-6">
          <ThinkingIndicatorDemo />
          <ReasoningDemo />
        </div>
      </Section>
    </div>
  );
}
