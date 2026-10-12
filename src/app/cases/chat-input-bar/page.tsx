"use client";

import { useRef, useState } from "react";
import { AskAi, Button, ChatInputBar, type ChatInputBarQuickAction } from "@forge-ui-official/core";
import { PageHeading, Section } from "../_shared";
import { ChatInputBarGenerationDemo } from "./_generation-demo";

const models = [
  { id: "auto", label: "Auto" },
  { id: "reason", label: "Reasoning Pro — 超长模型名称与多语言上下文分析（128K）" },
  ...Array.from({ length: 18 }, (_, i) => ({ id: `model-${i + 1}`, label: `Forge Model ${i + 1}` })),
];

const quickActions: ChatInputBarQuickAction[] = [{id:"image",label:"创建图片",kind:"image",placeholder:"描述你想创建的图片…"},{id:"note",label:"写笔记",kind:"note",placeholder:"写下想记录的内容…"},{id:"event",label:"安排日程",kind:"event",placeholder:"什么活动，什么时候？"},{id:"voice",label:"语音输入",kind:"voice",placeholder:"输入要转写的内容…"},{id:"docs",label:"分析文档",kind:"docs",placeholder:"上传文档，或者提一个问题…"}];

export default function ChatInputBarCase() {
  const [session, setSession] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [model, setModel] = useState("auto");
  const [permission, setPermission] = useState("read");
  const [attached, setAttached] = useState(0);
  const [changes, setChanges] = useState(0);
  const [full, setFull] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");
  const host = useRef<HTMLDivElement>(null);
  const change = (id: string) => { setModel(id); setChanges(n => n + 1); };
  const prompt = <ChatInputBar multiline sendOnEnter onAttach={() => setAttached(n => n + 1)}
    permissions={[{id:"read",label:"只读"},{id:"write",label:"可编辑"}]} permission={permission} onPermissionChange={setPermission}
    models={models} model={model} onModelChange={change} modelMenuLabel="选择模型"
    sources={[{id: "docs", label: "Documents"}]} commands={[{id: "summarize", label: "Summarize"}]} />;
  return <div className="flex flex-col gap-8">
    <PageHeading title="统一 ChatInputBar" hint="发送与停止 · 草稿保留 · 模型菜单 · Ask AI 抽屉 · 全屏" />
    <Section title="自然动效与快捷卡片" description="空会话默认展开卡片，发送后收起；从左侧加号手动打开。点击输入框任意空白处即可输入。">
      {messages.map((message, index) => <p key={index} className="rounded-xl bg-surface px-4 py-3 text-sm">{message}</p>)}
      {messages.length > 0 && <Button onClick={() => { setMessages([]); setSession(current => current + 1); }}>新会话</Button>}
      <ChatInputBar key={session} models={[{id:"quick",label:"Quick 1.5"},{id:"deep",label:"Deep 2.0"}]} model={model === "deep" ? "deep" : "quick"} onModelChange={setModel} modelMenuLabel="选择模型" onAttach={() => setAttached(n => n + 1)}
        quickActions={quickActions} hasMessages={messages.length > 0} onSend={message => setMessages(current => [...current, message])}/>
    </Section>
    <Section title="暗色与窄容器" description="320px 容器中的相同卡片与操作标签。">
      <div data-theme="dark" className="max-w-80 rounded-2xl bg-background p-4">
        <ChatInputBar multiline density="compact" quickActions={quickActions} models={[{id:"quick",label:"Quick 1.5"}]} model="quick" />
      </div>
    </Section>
    <Section title="发送、生成与停止" description="发送后即可停止；运行中可编辑草稿，确认停止后恢复发送。">
      <ChatInputBarGenerationDemo />
    </Section>
    <div className="flex flex-wrap gap-3">
      <AskAi label="打开 Ask AI 抽屉" color="blue" onSend={() => "Case reply"} composer={<div className="shrink-0 overflow-hidden p-4">{prompt}</div>} fullscreen={full} onFullscreenChange={setFull} messages={<div className="min-h-0 flex-1 overflow-y-auto p-5"><p role="status">当前模型：{model} · 回调：{changes}</p></div>} />
      <Button onClick={() => setFull(true)}>打开全屏面板</Button>
      <Button onClick={() => { setFullscreenError(""); void host.current?.requestFullscreen().catch(() => setFullscreenError("浏览器未授予原生全屏；可使用 Ask AI 全屏面板。")); }}>浏览器原生全屏</Button>
    </div>
    {fullscreenError && <p role="alert">{fullscreenError}</p>}
    <p role="status" className="text-sm text-fg-grey-700">权限：{permission} · 附件点击：{attached} · 当前模型：{model} · onModelChange 回调：{changes} 次</p>
    <Section title="普通页面" description="外层保留 overflow-hidden；20 个模型，长名称换行。">
      <div ref={host} data-accent="blue" className="overflow-hidden bg-background px-4 pb-4 pt-80">
        {prompt}
      </div>
    </Section>
    <Section title="窄容器与暗色主题" description="320px 容器，继承 dark theme 与 blue accent。">
      <div data-theme="dark" className="w-full max-w-80 overflow-hidden bg-background px-3 pb-3 pt-80"><div data-accent="blue">{prompt}</div></div>
    </Section>

  </div>;
}
