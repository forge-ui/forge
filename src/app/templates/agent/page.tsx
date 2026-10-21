"use client";

import { useTemplateMobile } from "../_shared/use-template-mobile";
import { TemplateProfile } from "../_shared/template-profile";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AppLayout,
  AskAi,
  CommandSearch,
  Button,
  ChatInputBar,
  ConfirmationDialog,
  KebabMenu,
  MenuItem,
  Modal,
  TextField,
  ToastProvider,
  useToast,
  type ChatInputBarQuickAction,
  type ChatInputBarSendContext,
  type ComposerSource,
} from "@forge-ui-official/core";
import {
  PlusLinear,
  LetterBoldDuotone,
  StarBoldDuotone,
} from "@forge-ui-official/core/icons";
import { ANSWERS, EXAMPLES, WORKSPACE_KEY, parseSessions, parseWorkspaces, workspaceSessionKey, initialWorkspaceSessions, type Workspace, type Session, type Turn } from "./_data";
import { AgentTurn } from "./_agent-turn";
import "../task-board/task-board.css";

export default function AgentTemplatePage() {
  return (
    <ToastProvider>
      <AgentWorkspace />
    </ToastProvider>
  );
}

const SOURCES: ComposerSource[] = [
  { id: "brief", kind: "tool", label: "项目简报", description: "品牌焕新示例材料", connected: true },
  { id: "design", kind: "agent", label: "设计助手", description: "帮助整理设计目标" },
];
const ACTIONS: ChatInputBarQuickAction[] = [
  { id: "plan", label: "整理计划", kind: "note", placeholder: "说说你本周想完成的事…" },
  { id: "analysis", label: "分析项目", kind: "docs", placeholder: "你想了解哪些进度和风险？" },
];

function AgentWorkspace() {
  const mobile = useTemplateMobile();
  const [sessions, setSessions] = useState<Session[]>(EXAMPLES);
  const [active, setActive] = useState("plan");
  const [loaded, setLoaded] = useState(false);
  const [workspace, setWorkspace] = useState("design");
  const [workspaces, setWorkspaces] = useState<Workspace[]>([{ id: "design", name: "设计工作室" }]);
  const [newWorkspaceOpen, setNewWorkspaceOpen] = useState(false);
  const [workspaceDraft, setWorkspaceDraft] = useState("");
  const [workspaceError, setWorkspaceError] = useState("");
  const [draft, setDraft] = useState("");
  const [model, setModel] = useState("think");
  const [permission, setPermission] = useState("review");
  const [busy, setBusy] = useState(false);
  const [stopSignal, setStopSignal] = useState(0);
  const [help, setHelp] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameDraft, setRenameDraft] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const currentWorkspace = useRef(workspace);
  useEffect(() => { currentWorkspace.current = workspace; }, [workspace]);
  const thread = sessions.find((s) => s.id === active)!;
  const { toast, dismiss } = useToast();
  const storageNotice = useRef<string | null>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const setRunning = useCallback((value: boolean) => setBusy(value), []);
  useEffect(() => {
    const timer = window.setTimeout(() => {
    let id = "design";
    try {
      const catalog = parseWorkspaces(JSON.parse(localStorage.getItem(WORKSPACE_KEY) || "null"));
      id = catalog?.active || "design";
      if (catalog) { setWorkspaces(catalog.items); setWorkspace(id); }
    } catch { /* Use the default catalog when its saved value is invalid. */ }
    let saved = initialWorkspaceSessions(id);
    try { saved = parseSessions(JSON.parse(localStorage.getItem(workspaceSessionKey(id)) || "null")) || saved; }
    catch { /* A damaged conversation must not load another workspace's examples. */ }
    setSessions(saved.sessions); setActive(saved.active);
    setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const persistWorkspace = useCallback((notifyAgain = false) => {
    try {
      localStorage.setItem(workspaceSessionKey(workspace), JSON.stringify({ sessions, active }));
      localStorage.setItem(WORKSPACE_KEY, JSON.stringify({ items: workspaces, active: workspace }));
      if (storageNotice.current) { dismiss(storageNotice.current); storageNotice.current = null; }
      return true;
    } catch {
      if (notifyAgain && storageNotice.current) { dismiss(storageNotice.current); storageNotice.current = null; }
      if (!storageNotice.current) storageNotice.current = toast({
        title: "对话尚未保存到浏览器",
        description: "本地存储不可用或空间不足。请先复制重要对话，避免刷新或离开页面后丢失。",
        status: "error",
        duration: 0,
      });
      return false;
    }
  }, [sessions, active, workspace, workspaces, toast, dismiss]);
  useEffect(() => {
    if (loaded) persistWorkspace();
  }, [loaded, persistWorkspace]);
  const switchWorkspace = (id: string) => {
    if (id === "__new__") { setWorkspaceDraft(""); setWorkspaceError(""); setNewWorkspaceOpen(true); return; }
    if (id === workspace) return;
    let next = initialWorkspaceSessions(id);
    if (!persistWorkspace(true)) return false;
    try {
      next = parseSessions(JSON.parse(localStorage.getItem(workspaceSessionKey(id)) || "null")) || next;
    } catch { /* Keep the selected workspace usable when storage is unavailable. */ }
    setWorkspace(id); setSessions(next.sessions); setActive(next.active);
    setBusy(false); setStopSignal(0); setDraft(""); setSearch(""); setSearchOpen(false);
    return true;
  };
  const saveSnapshot = useCallback((id: string, snapshot: NonNullable<Turn["snapshot"]>) => {
    setSessions(current => current.map(s => ({ ...s, turns: s.turns.map(t => t.id === id && (t.snapshot?.text !== snapshot.text || t.snapshot?.phase !== snapshot.phase) ? { ...t, snapshot } : t) })));
  }, []);
  const saveWorkflow = useCallback((id: string, workflow: NonNullable<Turn["workflow"]>) => {
    setSessions(current => current.map(s => ({ ...s, turns: s.turns.map(t => t.id === id && JSON.stringify(t.workflow) !== JSON.stringify(workflow) ? { ...t, workflow } : t) })));
  }, []);
  const selectSession = (id: string) => {
    setBusy(false);
    setStopSignal(0);
    setSessions(current => {
      const example = EXAMPLES.find(item => item.id === id);
      const available = !current.some(item => item.id === id) && example ? [...current, structuredClone(example)] : current;
      return available.map(s => ({ ...s, turns: s.turns.map(t => ({ ...t, live: false })) }));
    });
    setDraft("");
    setActive(id);
  };
  const send = (value: string, action?: ChatInputBarQuickAction, context?: ChatInputBarSendContext) => {
    const text = value.trim();
    if (!text || busy) return;
    setStopSignal(0);
    const selectedAction = ACTIONS.find((item) => item.id === action?.id);
    const selectedSources = SOURCES.filter((source) => context?.sources.some((item) => item.id === source.id)).map(({ id, label }) => ({ id, label }));
    const kind = selectedAction?.id === "analysis" ? "analysis" : selectedAction?.id === "plan" ? "plan" : /代码|函数|排序/.test(text)
      ? "code"
      : /分析|风险|进度/.test(text)
        ? "analysis"
        : "plan";
    setSessions((current) =>
      current.map((s) =>
        s.id === active
          ? {
              ...s,
              title: s.turns.length || s.title !== "新对话" ? s.title : text.slice(0, 18),
              turns: [
                ...s.turns,
                { id: crypto.randomUUID(), text, kind, live: true, request: {
                  action: selectedAction?.label, sources: selectedSources,
                  mode: model === "fast" ? "快速响应" : "深度思考",
                  permission,
                } },
              ],
            }
          : s,
      ),
    );
    setDraft("");
    setBusy(true);
  };
  const latestLive = thread.turns[thread.turns.length - 1]?.live;
  useEffect(() => {
    scroll.current?.scrollTo({
      top: latestLive ? scroll.current.scrollHeight : 0,
      behavior: "instant",
    });
  }, [active, thread.turns.length, latestLive]);
  return (
    <div className="task-board-shell agent-product">
      <AppLayout
        hideHeader={!mobile}
        showDatePicker={false}
        showKebab={false}
        showFavorite={false}
        accent="black"
        mode="light"
        logoText="Forge Agent"
        appName={workspaces.find(item => item.id === workspace)?.name || "设计工作室"}
        apps={[...workspaces.map(item => ({ ...item, active: item.id === workspace })), { id: "__new__", name: "＋ 新增工作空间" }]}
        onAppChange={app => switchWorkspace(app.id)}
        appSubtitle="你的日常工作伙伴"
        profilePosition="topbar"
        hideSidebarWidgets
        sidebarSlot={
          <div className="task-sidebar flex flex-col gap-5 px-3 py-4">
            <Button
              color="black"
              iconLeft={<PlusLinear size={18} />}
              onClick={() => {
                const id = crypto.randomUUID();
                setSessions((current) => [
                  { id, title: "新对话", turns: [] },
                  ...current,
                ]);
                selectSession(id);
              }}
            >
              新建对话
            </Button>
            <MenuItem
              label="搜索对话"
              lead={{ kind: "icon", icon: <LetterBoldDuotone size={20} /> }}
              onClick={() => setSearchOpen(true)}
            />
            <div className="flex flex-col gap-1">
              <p className="mb-2 px-3 text-xs font-semibold text-fg-grey-700">
                最近的对话
              </p>
              {sessions.map((s) => (
                <MenuItem
                  key={s.id}
                  label={s.title}
                  ariaLabel={s.title}
                  accent="black"
                  active={active === s.id}
                  className={active === s.id ? "product-nav-active" : undefined}
                  lead={{ kind: "icon", icon: <LetterBoldDuotone size={20} /> }}
                  onClick={() => selectSession(s.id)}
                />
              ))}
            </div>
            <div className="mt-6 border-t border-fg-grey-200 pt-4">
              <MenuItem label="打开任务看板" href="/templates/task-board" />
              <MenuItem label="使用说明" onClick={() => setHelp(true)} />
              <MenuItem label="返回模板库" href="/templates" />
            </div>
            <TemplateProfile template="agent" onHelp={() => setHelp(true)} />
          </div>
        }
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-fg-grey-200 pb-4">
            <div>
              <h1 className="text-lg font-semibold text-fg-black">
                {thread.title}
              </h1>
              <p className="mt-1 text-xs text-fg-grey-700">
                {workspaces.find(item => item.id === workspace)?.name || "设计工作室"} / 工作助手
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div aria-label="当前对话操作"><KebabMenu accent="black" items={[
                { label: "重命名对话", onSelect: () => { setRenameDraft(thread.title); setRenameOpen(true); } },
                { label: "删除对话", danger: true, onSelect: () => setDeleteOpen(true) },
              ]} /></div>
              <AskAi
                color="black"
                label="项目速问"
                brand={
                  <span className="text-sm font-semibold">
                    项目速问 · 本地预览
                  </span>
                }
                placeholder="询问项目背景或计划…"
                suggestions={["本周优先做什么？", "有哪些项目风险？"]}
                onSend={(message) =>
                  (/风险|进度/.test(message) ? ANSWERS.analysis : ANSWERS.plan)
                    .replace(/^### /gm, "")
                    .replace(/\*\*/g, "")
                }
              />
              <Button
                size="sm"
                color="black"
                variant="secondary"
                onClick={() => {
                  navigator.clipboard
                    .writeText(
                      thread.turns
                        .map(
                          (t) => `你：${t.text}\n\nForge：${t.snapshot?.text ?? ANSWERS[t.kind]}`,
                        )
                        .join("\n\n"),
                    )
                    .then(
                      () => toast({ title: "对话已复制" }),
                      () =>
                        toast({
                          title: "浏览器未允许复制，请使用回答上的复制按钮",
                          status: "error",
                        }),
                    );
                }}
              >
                复制对话
              </Button>
            </div>
          </header>
          <div ref={scroll} className="min-h-0 flex-1 overflow-auto">
            <div className="agent-conversation mx-auto flex w-full max-w-3xl flex-col gap-8 py-5">
              {thread.turns.length === 0 && (
                <div className="flex flex-col gap-6 py-12">
                  <StarBoldDuotone size={40} color="var(--fg-black)" />
                  <h2 className="text-3xl font-semibold text-fg-black">
                    一起，把想法往前推一步。
                  </h2>
                  <p className="text-sm leading-7 text-fg-grey-700">
                    拆解计划、整理信息、探索解决方案。从一个问题开始。
                  </p>
                  {EXAMPLES.map((s) => (
                    <Button
                      key={s.id}
                      color="black"
                      variant="secondary"
                      onClick={() => send(s.turns[0].text)}
                    >
                      {s.turns[0].text}
                    </Button>
                  ))}
                </div>
              )}
              {thread.turns.map((turn, index) => (
                <AgentTurn
                  key={`${workspace}:${loaded}:${active}:${turn.id}`}
                  turn={turn}
                  onSnapshot={saveSnapshot}
                  onWorkflow={saveWorkflow}
                  onFollowUp={send}
                  onRunning={
                    index === thread.turns.length - 1 ? setRunning : undefined
                  }
                  stopSignal={
                    index === thread.turns.length - 1 ? stopSignal : 0
                  }
                  permission={permission}
                />
              ))}
            </div>
          </div>
          <div className="mx-auto w-full max-w-3xl shrink-0">
            <ChatInputBar
              key={active}
              color="black"
              multiline
              rows={2}
              sendOnEnter
              value={draft}
              onChange={setDraft}
              onSend={send}
              status={busy ? "running" : "idle"}
              onStop={() => {
                setStopSignal((value) => value + 1);
                setBusy(false);
              }}
              sendDisabled={busy}
              showAttachment={false}
              placeholder="描述一个目标，或输入 / 选择命令…"
              models={[
                { id: "fast", label: "快速响应" },
                { id: "think", label: "深度思考" },
              ]}
              model={model}
              onModelChange={setModel}
              permissions={[
                { id: "review", label: "操作前确认" },
                { id: "readonly", label: "仅查看" },
              ]}
              permission={permission}
              onPermissionChange={setPermission}
              hasMessages={thread.turns.length > 0}
              sources={SOURCES}
              commands={[
                {
                  id: "plan",
                  label: "本周计划",
                  description: "拆解目标与下一步",
                },
                {
                  id: "risk",
                  label: "风险分析",
                  description: "分析进度和依赖",
                },
              ]}
              quickActions={ACTIONS}
            />
            <p className="py-2 text-center text-xs text-fg-grey-700">
              本地预览模式 · 内容由预设工作流生成
            </p>
          </div>
        </div>
        <Modal open={help} onOpenChange={setHelp} title="智能体模板使用说明">
          <div className="space-y-4 text-sm leading-7 text-fg-grey-700">
            <p>
              选择侧栏示例，体验计划、分析和代码三种工作流。新建对话可以试用动态操作卡、模型选择、权限选择、@
              引用与 / 命令。
            </p>
            <div className="flex flex-col gap-3">
              {[
                { id: "plan", label: "打开计划工作流", description: "查看任务检查项、建议、依赖路径，选择计划变更并完成审批。" },
                { id: "analysis", label: "打开分析工作流", description: "查看引用资料、进度趋势与风险洞察，继续追问分析结果。" },
                { id: "code", label: "打开代码工作流", description: "查看代码与修改差异，复制结果。" },
              ].map((example) => (
                <div key={example.id} className="space-y-1">
                  <Button color="black" size="sm" variant="secondary" onClick={() => {
                    selectSession(example.id);
                    setHelp(false);
                  }}>{example.label}</Button>
                  <p>{example.description}</p>
                </div>
              ))}
            </div>
            <p>
              发送后会逐段呈现 Markdown
              回答。可停止生成、重试，展开思考与工具详情，采纳建议、选择变更、提交审批。仅查看模式禁止应用计划。
            </p>
            <p>
              对话及操作结果按工作空间保存在当前浏览器，刷新后恢复；新工作空间从空白对话开始。不会请求模型、访问业务数据或执行真实外部操作。
            </p>
          </div>
        </Modal>
        <Modal open={renameOpen} onOpenChange={setRenameOpen} title="重命名对话">
          <form className="flex flex-col gap-4" onSubmit={event => { event.preventDefault(); const title = renameDraft.trim(); if (!title) return; setSessions(current => current.map(session => session.id === active ? { ...session, title } : session)); setRenameOpen(false); toast({ title: "对话已重命名" }); }}>
            <TextField color="black" label="对话名称" autoFocus value={renameDraft} onChange={setRenameDraft} />
            <div className="flex justify-end gap-2"><Button color="black" variant="secondary" onClick={() => setRenameOpen(false)}>取消</Button><Button color="black" type="submit" disabled={!renameDraft.trim()}>保存名称</Button></div>
          </form>
        </Modal>
        <ConfirmationDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="删除这段对话？" description="对话内容与操作记录将一并移除，删除后可通过通知撤销。" color="red" confirmLabel="删除对话" cancelLabel="取消" onCancel={() => setDeleteOpen(false)} onConfirm={() => {
          const removed = structuredClone(thread);
          removed.turns = removed.turns.map(turn => ({ ...turn, live: false }));
          const deletedWorkspace = workspace;
          const remaining = sessions.filter(session => session.id !== active);
          const next = remaining.length ? remaining : [{ id: crypto.randomUUID(), title: "新对话", turns: [] }];
          setBusy(false); setStopSignal(0); setDraft(""); setSessions(next); setActive(next[0].id); setDeleteOpen(false);
          toast({ title: "对话已删除", duration: 10000, action: { label: "撤销", onClick: () => {
            if (currentWorkspace.current !== deletedWorkspace) {
              try {
                const saved = parseSessions(JSON.parse(localStorage.getItem(workspaceSessionKey(deletedWorkspace)) || "null")) || initialWorkspaceSessions(deletedWorkspace);
                localStorage.setItem(workspaceSessionKey(deletedWorkspace), JSON.stringify({ sessions: saved.sessions.some(session => session.id === removed.id) ? saved.sessions : [removed, ...saved.sessions], active: removed.id }));
                toast({ title: "对话已恢复到原工作空间" });
              } catch { toast({ title: "对话恢复失败，请检查浏览器存储", status: "error" }); }
              return;
            }
            setSessions(current => current.some(session => session.id === removed.id) ? current : [removed, ...current]); setActive(removed.id);
          } } });
        }} />
        <Modal open={newWorkspaceOpen} onOpenChange={setNewWorkspaceOpen} title="新增工作空间" footer={<>
          <Button color="black" variant="secondary" onClick={() => setNewWorkspaceOpen(false)}>取消</Button>
          <Button color="black" disabled={!workspaceDraft.trim()} onClick={() => {
            const name = workspaceDraft.trim();
            if (!name) return;
            if (workspaces.some(item => item.name.toLocaleLowerCase() === name.toLocaleLowerCase())) { setWorkspaceError("已存在同名工作空间，请换一个名称。"); return; }
            const id = crypto.randomUUID();
            if (switchWorkspace(id)) {
              setWorkspaces(current => [...current, { id, name }]);
              setNewWorkspaceOpen(false);
            } else setWorkspaceError("当前工作空间的对话尚未保存，请先复制重要内容或恢复存储后重试。");
          }}>创建工作空间</Button>
        </>}>
          <TextField color="black" label="工作空间名称" autoFocus value={workspaceDraft} onChange={value => { setWorkspaceDraft(value); setWorkspaceError(""); }} />
          {workspaceError && <p role="alert" className="mt-2 text-sm text-fg-red">{workspaceError}</p>}
        </Modal>
        <Modal open={searchOpen} onOpenChange={setSearchOpen} title="搜索对话">
          <CommandSearch
            color="black"
            autoFocus
            query={search}
            onQueryChange={setSearch}
            placeholder="搜索对话或选择工作流…"
            emptyLabel="没有找到对应的对话或命令"
            items={[
              ...sessions.map((session) => ({
                id: session.id,
                label: session.title,
                group: "最近的对话",
                hint: "打开对话",
              })),
              ...EXAMPLES.map((session) => ({
                id: `command:${session.id}`,
                label: session.turns[0].text,
                group: "开始工作流",
                hint: "在当前对话中执行",
              })),
            ]}
            onSelect={(item) => {
              if (item.id.startsWith("command:")) {
                const example = EXAMPLES.find(
                  (s) => `command:${s.id}` === item.id,
                );
                if (example) send(example.turns[0].text);
              } else selectSession(item.id);
              setSearchOpen(false);
              setSearch("");
            }}
          />
        </Modal>
      </AppLayout>
    </div>
  );
}
