"use client";

import { useRef, useState } from "react";
import { AskAi, Button, PromptBar } from "@forge-ui-official/core";
import { PageHeading, Section } from "../_shared";
import { PromptBarGenerationDemo } from "./_generation-demo";

const models = [
  { id: "auto", label: "Auto" },
  { id: "reason", label: "Reasoning Pro — 超长模型名称与多语言上下文分析（128K）" },
  ...Array.from({ length: 18 }, (_, i) => ({ id: `model-${i + 1}`, label: `Forge Model ${i + 1}` })),
];

export default function PromptBarCase() {
  const [model, setModel] = useState("auto");
  const [changes, setChanges] = useState(0);
  const [full, setFull] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");
  const host = useRef<HTMLDivElement>(null);
  const change = (id: string) => { setModel(id); setChanges(n => n + 1); };
  const prompt = <PromptBar models={models} model={model} onModelChange={change} modelMenuLabel="选择模型"
    sources={[{id: "docs", label: "Documents"}]} commands={[{id: "summarize", label: "Summarize"}]} />;
  return <div className="flex flex-col gap-8">
    <PageHeading title="PromptBar" hint="发送与停止 · 草稿保留 · 模型菜单 · Ask AI 抽屉 · 全屏" />
    <Section title="发送、生成与停止" description="发送后即可停止；运行中可编辑草稿，确认停止后恢复发送。">
      <PromptBarGenerationDemo />
    </Section>
    <div className="flex flex-wrap gap-3">
      <AskAi label="打开 Ask AI 抽屉" color="blue" onSend={() => "Case reply"} composer={<div className="shrink-0 overflow-hidden p-4">{prompt}</div>} fullscreen={full} onFullscreenChange={setFull} messages={<div className="min-h-0 flex-1 overflow-y-auto p-5"><p role="status">当前模型：{model} · 回调：{changes}</p></div>} />
      <Button onClick={() => setFull(true)}>打开全屏面板</Button>
      <Button onClick={() => { setFullscreenError(""); void host.current?.requestFullscreen().catch(() => setFullscreenError("浏览器未授予原生全屏；可使用 Ask AI 全屏面板。")); }}>浏览器原生全屏</Button>
    </div>
    {fullscreenError && <p role="alert">{fullscreenError}</p>}
    <p role="status" className="text-sm text-fg-grey-700">当前模型：{model} · onModelChange 回调：{changes} 次</p>
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
