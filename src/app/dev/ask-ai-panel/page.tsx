"use client";

import { useState } from "react";
import { AskAi, Button, ChatInputBar, type AskAiSessionItem } from "@forge-ui-official/core";

/** Local visual review only: no model calls or business writes. */
export default function AskAiPanelReview() {
  const [docked, setDocked] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [sessions, setSessions] = useState<AskAiSessionItem[]>([{ id: "new", title: "新对话" }]);
  const [sessionId, setSessionId] = useState("new");
  const [draft, setDraft] = useState("");
  const [questions, setQuestions] = useState<Record<string, string[]>>({});
  const [count, setCount] = useState(0);
  const thread = questions[sessionId] ?? [];
  function ask(question: string) {
    if (!question.trim()) return "";
    setQuestions(previous => ({ ...previous, [sessionId]: [...(previous[sessionId] ?? []), question] }));
    setSessions(previous => previous.map(item => item.id === sessionId ? { ...item, title: question } : item));
    setDraft("");
    return "这里是本地布局演示回复。并排时可继续操作左侧页面，全屏退出后返回原面板。";
  }
  return <main data-panel-review className="h-dvh overflow-auto bg-fg-grey-50 text-fg-black" style={{ paddingRight: docked ? 460 : 0 }}>
    <div className="flex min-h-full flex-col gap-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Ask AI 布局审阅</h1>
        <AskAi panelMode="responsive" onDockedChange={setDocked} headerLayout="session"
          landingTitle="有什么可以帮你？" landingDescription="查询当前页面的信息，或一起梳理接下来的操作。"
          fullscreen={fullscreen} onFullscreenChange={setFullscreen}
          sessions={sessions} currentSessionId={sessionId} onSelectSession={setSessionId}
          onNewSession={() => { const id = crypto.randomUUID(); setSessions(previous => [{id, title:"新对话"}, ...previous]); setSessionId(id); setDraft(""); }}
          suggestions={["查看账号列表", "查询当前筛选下的账号", "查看停用账号", "新建一个账号"]}
          hasConversation={thread.length > 0} onSend={ask}
          messages={thread.length ? <div className={fullscreen ? "flex flex-col gap-6" : "min-h-0 flex-1 overflow-auto p-5"}>{thread.map((question, index) => <div key={index} className="mb-6 flex flex-col gap-4"><p className="rounded-xl bg-fg-grey-100 p-3 text-sm">{question}</p><p className="text-sm leading-6">这里是本地布局演示回复。并排时可继续操作左侧页面，全屏退出后返回原面板。</p></div>)}</div> : undefined}
          composer={<div className={fullscreen ? "w-full min-w-0" : "w-full min-w-0 shrink-0 px-4 pb-4 pt-3"}><ChatInputBar multiline sendOnEnter showAttachment={false} value={draft} onChange={setDraft} onSend={ask} sendLabel="发送" placeholder="输入消息…" /></div>}
        />
      </div>
      <p className="text-sm leading-6 text-fg-grey-700">宽度达到 1440px 时并排显示；窄屏使用模态抽屉。此页仅供本地视觉审阅。</p>
      <section className="flex flex-col gap-4 rounded-2xl border border-fg-grey-200 bg-white p-6">
        <h2 className="text-lg font-semibold">验证主页面仍可操作</h2>
        <Button onClick={() => setCount(value => value + 1)}>已点击 {count} 次</Button>
        <label className="flex flex-col gap-2 text-sm">页面草稿<input className="rounded-lg border border-fg-grey-200 p-3" placeholder="并排时可以在这里输入" /></label>
      </section>
      {Array.from({length: 8}, (_, index) => <section key={index} className="rounded-2xl border border-fg-grey-200 bg-white p-6"><h2 className="font-semibold">内容区块 {index + 1}</h2><p className="mt-2 text-sm leading-6 text-fg-grey-700">滚动主页面不会关闭助手；助手输入栏保留自己的底部间距。</p></section>)}
    </div>
  </main>;
}
