"use client";

import { useRef, useState } from "react";
import { AskAi, Button, ChatInputBar, type ChatInputBarQuickAction } from "@forge-ui-official/core";
import { PageHeading, Section } from "../_shared";
import { demoSources } from "./_sources";
import { ChatInputBarGenerationDemo } from "./_generation-demo";

const models = [
  { id: "auto", label: "自动" },
  { id: "reason", label: "Forge 推理模型 — 长上下文分析（128K）" },
  ...Array.from({ length: 18 }, (_, i) => ({ id: `model-${i + 1}`, label: `Forge 模型 ${i + 1}` })),
];

const quickActions: ChatInputBarQuickAction[] = [{id:"image",label:"创建图片",kind:"image",placeholder:"描述你想创建的图片…"},{id:"note",label:"写笔记",kind:"note",placeholder:"写下想记录的内容…"},{id:"event",label:"安排日程",kind:"event",placeholder:"什么活动，什么时候？"},{id:"voice",label:"语音输入",kind:"voice",placeholder:"输入要转写的内容…"},{id:"docs",label:"分析文档",kind:"docs",placeholder:"上传文档，或者提一个问题…"}];

export default function ChatInputBarCase() {
  const [session, setSession] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [model, setModel] = useState("auto");
  const [permission, setPermission] = useState("read");
  const [attached, setAttached] = useState(0);
  const [full, setFull] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");
  const host = useRef<HTMLDivElement>(null);
  const change = (id: string) => setModel(id);
  const prompt = <ChatInputBar multiline sendOnEnter onSend={message => setMessages(current => [...current, message])} onAttach={() => setAttached(n => n + 1)}
    permissions={[{id:"read",label:"只读"},{id:"write",label:"可编辑"}]} permission={permission} onPermissionChange={setPermission}
    models={models} model={model} onModelChange={change} modelMenuLabel="选择模型"
    sources={demoSources} commands={[{id: "summarize", label: "总结", description: "整理当前内容的要点"}, {id: "plan", label: "起草计划", description: "起草上线计划"}]} />;
  return <div className="flex flex-col gap-8">
    <PageHeading title="消息输入栏" hint="发送与停止 · 草稿保留 · 模型菜单 · Ask AI 抽屉 · 全屏" />
    <Section title="自然动效与快捷卡片" description="空会话默认展开卡片，发送后收起；从左侧加号手动打开。点击输入框任意空白处即可输入。">
      {messages.map((message, index) => <p key={index} className="rounded-xl bg-surface px-4 py-3 text-sm">{message}</p>)}
      {messages.length > 0 && <Button onClick={() => { setMessages([]); setSession(current => current + 1); }}>新会话</Button>}
      <ChatInputBar sources={demoSources} key={session} models={[{id:"quick",label:"Forge 快速模型"},{id:"deep",label:"Forge 推理模型"}]} model={model === "deep" ? "deep" : "quick"} onModelChange={setModel} modelMenuLabel="选择模型" onAttach={() => setAttached(n => n + 1)}
        quickActions={quickActions} hasMessages={messages.length > 0} onSend={message => setMessages(current => [...current, message])}/>
    </Section>
    <Section title="暗色与窄容器" description="320px 容器中的相同卡片与操作标签。">
      <div data-theme="dark" className="max-w-80 rounded-2xl bg-background p-4">
        <ChatInputBar sources={demoSources} multiline density="compact" quickActions={quickActions} models={[{id:"quick",label:"Forge 快速模型"}]} model="quick" modelMenuLabel="选择模型" onSend={message => setMessages(current => [...current, message])} />
      </div>
    </Section>
    {messages.length > 0 && <p role="status" className="text-sm text-fg-grey-700">最近发送：{messages.at(-1)}</p>}
    <Section title="发送、生成与停止" description="发送后即可停止；运行中可编辑草稿，确认停止后恢复发送。">
      <ChatInputBarGenerationDemo />
    </Section>
    <div className="flex flex-wrap gap-3">
      <AskAi label="打开 Ask AI 抽屉" color="blue" onSend={() => "这是本地演示回复。"} composer={<div className="shrink-0 overflow-hidden p-4">{prompt}</div>} fullscreen={full} onFullscreenChange={setFull} messages={<div className="min-h-0 flex-1 overflow-y-auto p-5">{messages.map((message, index) => <p key={index} className="mb-3 text-sm">{message}</p>)}</div>} />
      <Button onClick={() => setFull(true)}>打开全屏面板</Button>
      <Button onClick={() => { setFullscreenError(""); void host.current?.requestFullscreen().catch(() => setFullscreenError("浏览器未授予原生全屏；可使用 Ask AI 全屏面板。")); }}>浏览器原生全屏</Button>
    </div>
    {fullscreenError && <p role="alert">{fullscreenError}</p>}
    <p role="status" className="text-sm text-fg-grey-700">权限：{permission === "read" ? "只读" : "可编辑"} · 当前模型：{models.find(item => item.id === model)?.label ?? "Forge 快速模型"} · {attached ? "已打开附件操作（演示）" : "尚未添加附件"}</p>
    <Section title="模型与权限" description="选择模型和权限；输入 @ 提及智能体或技能，输入 / 选择命令。也可从加号菜单打开。">
      <div ref={host} data-accent="blue" className="overflow-hidden bg-background p-4">
        {prompt}
      </div>
    </Section>


  </div>;
}
