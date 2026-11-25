"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AgentCodeBlock,
  AgentMessage,
  Button,
  Composer,
  ComposerAction,
  ComposerInput,
  ComposerModelMenu,
  ComposerSend,
  ComposerToolbar,
  Conversation,
  MessageActions,
  Reasoning,
  ThinkingIndicator,
  ToolCall,
  ToolCallGroup,
  cn,
  type ComposerStatus,
} from "@forge-ui-official/core";
import { CodeLinear, DocumentTextLinear, FolderLinear, LightbulbLinear, PaperclipLinear, ShareLinear, SidebarMinimalisticLinear, StarsLinear } from "@forge-ui-official/core/icons";
import { IconAction, useSidebar } from "./_shell";
import { FILE_CHANGES, MODELS, PROJECTS, REPLY, TERMINAL_LINES, THREADS, type Thread, type Turn } from "./_data";

type PanelTab = "changes" | "preview" | "terminal";

const SUGGESTIONS = [
  { icon: <CodeLinear size={18} />, title: "改一个页面", text: "把官网案例页改成三列卡片，移动端单列" },
  { icon: <DocumentTextLinear size={18} />, title: "读一份文档", text: "总结这份招标文件的技术要求和评分项" },
  { icon: <LightbulbLinear size={18} />, title: "排查一个问题", text: "样本列表滚动卡顿，帮我找出原因" },
  { icon: <StarsLinear size={18} />, title: "写一份方案", text: "给医院客户写一份数据脱敏的实施方案" },
];

export default function AiChatTemplatePage() {
  const params = useSearchParams();
  const requested = params.get("new") ? null : params.get("thread") ?? "hero";
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [threads, setThreads] = useState<Thread[]>(THREADS);
  const [created, setCreated] = useState<{ from: string | null; id: string } | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelTab, setPanelTab] = useState<PanelTab>("changes");
  const [activeFile, setActiveFile] = useState(FILE_CHANGES[0].path);
  const [model, setModel] = useState("deep");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [status, setStatus] = useState<ComposerStatus>("idle");
  const timers = useRef<number[]>([]);

  const activeId = created && created.from === requested ? created.id : requested;
  const thread = threads.find((item) => item.id === activeId);
  const project = PROJECTS.find((item) => item.id === thread?.projectId);

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const updateTurns = (threadId: string, update: (turns: Turn[]) => Turn[]) =>
    setThreads((previous) => previous.map((item) => (item.id === threadId ? { ...item, turns: update(item.turns), updated: "刚刚" } : item)));

  const reply = (threadId: string, text: string) => {
    const replyId = `reply-${Date.now()}`;
    updateTurns(threadId, (turns) => [...turns, { id: `user-${Date.now()}`, role: "user", text }, { id: replyId, role: "assistant", paragraphs: [], streaming: true }]);
    setStatus("running");
    const steps: Array<[number, (turn: Extract<Turn, { role: "assistant" }>) => Extract<Turn, { role: "assistant" }>]> = [
      [1400, (turn) => ({ ...turn, thoughtSeconds: 1, tools: REPLY.tools.slice(0, 1) })],
      [2300, (turn) => ({ ...turn, tools: REPLY.tools, paragraphs: REPLY.paragraphs.slice(0, 1) })],
      [3200, (turn) => ({ ...turn, paragraphs: REPLY.paragraphs, changes: ["app/(site)/page.tsx"], streaming: false })],
    ];
    steps.forEach(([delay, apply]) => {
      timers.current.push(
        window.setTimeout(() => {
          updateTurns(threadId, (turns) => turns.map((turn) => (turn.id === replyId && turn.role === "assistant" ? apply(turn) : turn)));
          if (delay === 3200) setStatus("idle");
        }, delay),
      );
    });
  };

  const startThread = (text: string) => {
    const id = `new-${Date.now()}`;
    setThreads((previous) => [{ id, title: text.slice(0, 18), projectId: projectId ?? undefined, updated: "刚刚", turns: [] }, ...previous]);
    setCreated({ from: requested, id });
    window.setTimeout(() => reply(id, text), 0);
  };

  const stop = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    if (thread) updateTurns(thread.id, (turns) => turns.map((turn) => (turn.role === "assistant" && turn.streaming ? { ...turn, streaming: false, paragraphs: turn.paragraphs.length ? turn.paragraphs : ["已停止。"] } : turn)));
    setStatus("idle");
  };

  const openChanges = (path: string) => {
    setActiveFile(path);
    setPanelTab("changes");
    setPanelOpen(true);
  };


  if (!thread) {
    return (
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center px-4">
          {!sidebarOpen && (
            <IconAction label="展开侧栏" onClick={() => setSidebarOpen(true)}>
              <SidebarMinimalisticLinear size={18} />
            </IconAction>
          )}
        </header>
        <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col justify-center gap-8 px-6 pb-24">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-[28px] font-semibold tracking-fg">下午好，林晓</h1>
            <p className="text-sm text-fg-grey-700">今天想先做哪件事？</p>
          </div>
          <div className="flex flex-col gap-3">
            <ChatComposer threadKey="new" placeholder="描述你要做的事，或输入 / 调用插件" onSend={startThread} status={status} onStop={stop} model={model} onModelChange={setModel} />
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-fg-grey-700">放进项目</span>
              {PROJECTS.map((item) => (
                <Button variant="unstyled"
                  key={item.id}
                  type="button"
                  onClick={() => setProjectId((current) => (current === item.id ? null : item.id))}
                  className={cn("flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors", projectId === item.id ? "border-fg-black bg-fg-black text-white" : "border-fg-grey-200 text-fg-grey-900 hover:border-fg-grey-400")}
                >
                  <FolderLinear size={14} />
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {SUGGESTIONS.map((item) => (
              <Button variant="unstyled" key={item.title} type="button" onClick={() => startThread(item.text)} className="flex items-start gap-3 rounded-2xl border border-fg-grey-200 p-4 text-left transition-colors hover:bg-fg-grey-50">
                <span className="mt-0.5 text-fg-grey-700">{item.icon}</span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-xs leading-5 text-fg-grey-700">{item.text}</span>
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 px-4">
          {!sidebarOpen && (
            <IconAction label="展开侧栏" onClick={() => setSidebarOpen(true)}>
              <SidebarMinimalisticLinear size={18} />
            </IconAction>
          )}
          <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
            {project && <span className="shrink-0 text-fg-grey-700">{project.name}</span>}
            {project && <span className="text-fg-grey-400">/</span>}
            <span className="truncate font-medium">{thread.title}</span>
          </div>
          <IconAction label={panelOpen ? "收起工作区" : "打开工作区"} active={panelOpen} onClick={() => setPanelOpen((open) => !open)}>
            <SidebarMinimalisticLinear size={18} className="-scale-x-100" />
          </IconAction>
          <Button size="sm" variant="secondary" color="grey" iconLeft={<ShareLinear size={16} />}>
            分享
          </Button>
        </header>

        <div className="min-h-0 flex-1">
          <Conversation followKey={thread.turns} className="h-full">
            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8 px-6 pb-10 pt-4">
              {thread.turns.map((turn) =>
                turn.role === "user" ? (
                  <AgentMessage key={turn.id} role="user">
                    {turn.text}
                  </AgentMessage>
                ) : (
                  <AssistantTurn key={turn.id} turn={turn} onOpenChanges={openChanges} />
                ),
              )}
            </div>
          </Conversation>
        </div>

        <div className="mx-auto w-full max-w-[720px] px-6 pb-4">
          <ChatComposer threadKey={thread.id} placeholder="描述要改的地方，或输入 / 调用插件" onSend={(text) => reply(thread.id, text)} status={status} onStop={stop} model={model} onModelChange={setModel} />
          <p className="mt-2 text-center text-xs text-fg-grey-700">改动会先放进工作区，确认后再提交</p>
        </div>
      </section>

      {panelOpen && <WorkspacePanel tab={panelTab} onTabChange={setPanelTab} activeFile={activeFile} onFileChange={setActiveFile} />}
    </>
  );
}

function ChatComposer({ threadKey, placeholder, onSend, status, onStop, model, onModelChange }: { threadKey: string; placeholder: string; onSend: (text: string) => void; status: ComposerStatus; onStop: () => void; model: string; onModelChange: (id: string) => void }) {
  return (
    <Composer key={threadKey} onSend={onSend} status={status} onStop={onStop} placeholder={placeholder} hasMessages={threadKey !== "new"}>
      <ComposerInput rows={2} />
      <ComposerToolbar>
        <ComposerAction label="添加附件" icon={<PaperclipLinear size={18} />} />
        <ComposerModelMenu models={MODELS} model={model} onModelChange={onModelChange} />
        <span className="flex-1" />
        <ComposerSend />
      </ComposerToolbar>
    </Composer>
  );
}

function AssistantTurn({ turn, onOpenChanges }: { turn: Extract<Turn, { role: "assistant" }>; onOpenChanges: (path: string) => void }) {
  const changes = useMemo(() => FILE_CHANGES.filter((file) => turn.changes?.includes(file.path)), [turn.changes]);
  const waiting = turn.streaming && !turn.tools && turn.paragraphs.length === 0;
  return (
    <AgentMessage
      role="assistant"
      actions={turn.streaming ? undefined : <MessageActions copyText={turn.paragraphs.join("\n")} onRetry={() => undefined} />}
    >
      {waiting ? (
        <ThinkingIndicator phases={["正在读取项目", "正在规划改动"]} />
      ) : (
        <>
          {turn.thoughtSeconds !== undefined && <Reasoning status="done" duration={turn.thoughtSeconds * 1000} text="先确认首页结构和现有组件，再决定改动范围。" />}
          {turn.tools && (
            <ToolCallGroup count={turn.tools.length} status={turn.streaming ? "running" : "success"} defaultOpen={false}>
              {turn.tools.map((tool) => (
                <ToolCall key={tool.id} variant="row" size="sm" name={tool.name} title={tool.title} summary={tool.summary} status="success" />
              ))}
            </ToolCallGroup>
          )}
          {turn.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          {turn.bullets && (
            <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-fg-grey-400">
              {turn.bullets.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          )}
          {changes.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-fg-grey-200">
              <div className="flex items-center justify-between bg-fg-grey-50 px-4 py-2.5 text-xs text-fg-grey-700">
                <span>{changes.length} 个文件已修改</span>
                <DiffStat added={changes.reduce((sum, file) => sum + file.added, 0)} removed={changes.reduce((sum, file) => sum + file.removed, 0)} />
              </div>
              {changes.map((file) => (
                <Button variant="unstyled"
                  key={file.path}
                  type="button"
                  onClick={() => onOpenChanges(file.path)}
                  className="flex w-full items-center justify-between gap-4 border-t border-fg-grey-200 px-4 py-2.5 text-left font-mono text-xs transition-colors hover:bg-fg-grey-50"
                >
                  <span className="truncate">{file.path}</span>
                  <DiffStat added={file.added} removed={file.removed} />
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </AgentMessage>
  );
}

function WorkspacePanel({ tab, onTabChange, activeFile, onFileChange }: { tab: PanelTab; onTabChange: (tab: PanelTab) => void; activeFile: string; onFileChange: (path: string) => void }) {
  const file = FILE_CHANGES.find((item) => item.path === activeFile) ?? FILE_CHANGES[0];
  const tabs: Array<{ id: PanelTab; label: string }> = [
    { id: "changes", label: `改动 ${FILE_CHANGES.length}` },
    { id: "preview", label: "预览" },
    { id: "terminal", label: "终端" },
  ];
  return (
    <aside className="flex w-[46%] min-w-[420px] max-w-[640px] shrink-0 flex-col border-l border-fg-grey-200">
      <div className="flex h-14 shrink-0 items-center gap-1 px-3">
        {tabs.map((item) => (
          <Button variant="unstyled"
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={cn(
              "h-8 rounded-lg px-3 text-sm transition-colors",
              tab === item.id ? "bg-fg-grey-100 font-medium text-fg-black" : "text-fg-grey-700 hover:text-fg-black",
            )}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {tab === "changes" && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-col px-3 pb-3">
            {FILE_CHANGES.map((item) => (
              <Button variant="unstyled"
                key={item.path}
                type="button"
                onClick={() => onFileChange(item.path)}
                className={cn(
                  "flex h-9 items-center justify-between gap-4 rounded-lg px-3 text-left font-mono text-xs transition-colors",
                  item.path === file.path ? "bg-fg-grey-100 text-fg-black" : "text-fg-grey-700 hover:bg-fg-grey-50",
                )}
              >
                <span className="truncate">{item.path}</span>
                <DiffStat added={item.added} removed={item.removed} />
              </Button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-auto px-3 pb-3">
            <AgentCodeBlock key={file.path} filename={file.path} diff={file.diff} view="diff" />
          </div>
        </div>
      )}

      {tab === "preview" && (
        <div className="flex min-h-0 flex-1 flex-col px-3 pb-3">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-fg-grey-200">
            <div className="flex h-9 shrink-0 items-center gap-2 border-b border-fg-grey-200 bg-fg-grey-50 px-3">
              <span className="h-2.5 w-2.5 rounded-full bg-fg-grey-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-fg-grey-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-fg-grey-300" />
              <span className="ml-2 flex-1 truncate rounded-md bg-background px-2 py-0.5 text-xs text-fg-grey-700">localhost:3000</span>
            </div>
            <div className="grid flex-1 grid-cols-2 items-center gap-6 overflow-hidden p-8">
              <div className="flex flex-col gap-3">
                <span className="text-xl font-bold leading-snug tracking-fg">让产业数据成为可调用的 AI 生产力</span>
                <span className="text-xs text-fg-grey-700">从采集、治理到交付，一个平台完成。</span>
                <div className="flex gap-2">
                  <span className="rounded-full bg-fg-blue-500 px-3 py-1.5 text-xs font-medium text-white">预约演示</span>
                  <span className="rounded-full border border-fg-grey-200 px-3 py-1.5 text-xs font-medium">查看案例</span>
                </div>
              </div>
              <div className="flex aspect-[4/3] flex-col gap-2 rounded-xl border border-fg-grey-200 bg-fg-grey-50 p-3">
                <span className="h-2 w-1/3 rounded-full bg-fg-grey-200" />
                <span className="flex-1 rounded-lg bg-background" />
                <span className="h-2 w-2/3 rounded-full bg-fg-grey-200" />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "terminal" && (
        <div className="min-h-0 flex-1 overflow-auto px-3 pb-3">
          <pre className="rounded-2xl bg-fg-grey-50 p-4 font-mono text-xs leading-6 text-fg-grey-900">{TERMINAL_LINES.join("\n")}</pre>
        </div>
      )}

      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-fg-grey-200 px-4 py-3">
        <span className="text-xs text-fg-grey-700">分支 feat/hero-two-column</span>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" color="grey">
            撤销
          </Button>
          <Button size="sm" color="blue">
            提交改动
          </Button>
        </div>
      </div>
    </aside>
  );
}

function DiffStat({ added, removed }: { added: number; removed: number }) {
  return (
    <span className="flex shrink-0 gap-2 font-mono text-xs">
      <span className="text-fg-green-500">+{added}</span>
      <span className="text-fg-red">−{removed}</span>
    </span>
  );
}
