"use client";

import type { ReactNode } from "react";
import { PageHeading } from "../../components/_shared";
import { ChatInputBarGenerationDemo } from "../_kit/_generation-demo";
import { AgentComposerDemo, ReasoningDemo, ThinkingIndicatorDemo } from "../_kit/_kit-demos";
import { StreamingAnswerDemo } from "../_kit/_streaming-demo";

// One bench per motion: what it is on top, the thing itself on a quiet ground below.
function Bench({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="flex flex-col overflow-hidden rounded-3xl border border-fg-grey-200 bg-background">
      <div className="flex flex-col gap-1 border-b border-fg-grey-200 px-6 py-4">
        <h2 className="text-base font-semibold tracking-fg text-fg-black">{title}</h2>
        <p className="text-sm leading-6 text-fg-grey-700">{description}</p>
      </div>
      <div className="flex min-h-36 justify-center bg-fg-grey-50 p-6">{children}</div>
    </section>
  );
}

export default function AgentMotionPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading title="动效" hint="Forge Agent 的几种标志性动效，组件里都已内置。每一块下面的操作区都能直接试。" />
      <Bench title="逐字淡入" description="StreamingAnswer：文字按网络到达的节奏缓冲，再逐字淡入（500ms 线性）。点“播放示例”看过程，中途点“停止”，已经显示的部分会留下。">
        <StreamingAnswerDemo />
      </Bench>
      <Bench title="发送、生成与停止" description="ChatInputBar：点发送后按钮变成停止；运行中还能编辑下一条草稿，点停止后恢复发送。">
        <ChatInputBarGenerationDemo />
      </Bench>
      <Bench title="快捷卡片" description="空对话时输入框上方展开卡片；选一张卡片或直接发送后自然收起，点左侧加号再打开。">
        <AgentComposerDemo />
      </Bench>
      <Bench title="思考与等待" description="第一个字出来前的扫光与计时；思考结束后折成一行，点“重新思考”再看一遍。">
        <div className="flex w-full max-w-xl flex-col gap-6">
          <ThinkingIndicatorDemo />
          <ReasoningDemo />
        </div>
      </Bench>
    </div>
  );
}
