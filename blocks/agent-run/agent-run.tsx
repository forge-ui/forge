"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Breadcrumbs, Button, ChatInputBar, Modal, PageTitleToolbar, StatusBadge, type ChatInputBarQuickAction } from "@forge-ui-official/core";
import { DocumentTextLinear } from "@forge-ui-official/core/icons";

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
  at: string;
}

export interface SessionArtifact {
  name: string;
  content: string;
}

export interface AgentRunSession {
  id: string;
  goal: string;
  agent: string;
  approval: string;
  createdAt: string;
  updatedAt: string;
  knowledge: string[];
  summary: string;
  artifacts: SessionArtifact[];
  usage: { toolCalls: number; tokens: number };
  conversation: ConversationTurn[];
}

const brief = `# 第三季度续约与流失简报

- 续约率 86.4%，环比 +2.1 个百分点
- 流失客户 14 家，其中 9 家为年费 5 万以下的小微客户
- 主要流失原因：预算收缩（6 家）、改用自建系统（4 家）
- 建议：对年费 5–20 万的客户提前 60 天启动续约沟通
`;

export const defaultAgentRunSession: AgentRunSession = {
  id: "task-49a08224-1512-4fc0-ab98-e0c4f0cecf2b",
  goal: "整理第三季度客户续约与流失情况，起草管理层简报",
  agent: "quarterly-review@2",
  approval: "出结果前确认",
  createdAt: "2026/11/09 10:52",
  updatedAt: "2026/11/09 11:06",
  knowledge: ["客户合同台账", "经营周报归档"],
  summary: "第三季度续约率 86.4%，流失 14 家，主要集中在年费 5 万以下的小微客户；已起草管理层简报。",
  artifacts: [{ name: "第三季度续约简报", content: brief }, { name: "流失客户明细", content: "客户,年费,流失原因\n星河零售,3.6 万,预算收缩\n远帆物流,4.2 万,改用自建系统\n" }],
  usage: { toolCalls: 4, tokens: 12_480 },
  conversation: [
    { role: "user", content: "整理第三季度客户续约与流失情况，起草管理层简报。", at: "2026/11/09 10:52" },
    { role: "assistant", content: "已读取合同台账和 7–9 月经营周报。第三季度应续约 103 家，已续约 89 家，续约率 86.4%；流失 14 家。简报草稿已放在右侧「结果与产物」。", at: "2026/11/09 10:58" },
    { role: "user", content: "流失客户里，小微客户占多少？原因能再分一下类吗？", at: "2026/11/09 11:03" },
    { role: "assistant", content: "14 家流失客户中有 9 家年费在 5 万以下，占 64%。原因分布：预算收缩 6 家、改用自建系统 4 家、合并到集团采购 2 家、服务不满意 2 家。", at: "2026/11/09 11:06" },
  ],
};

const conversationActions: ChatInputBarQuickAction[] = [
  { id: "answer", label: "解答问题", kind: "docs", placeholder: "输入你希望解答的问题" },
  { id: "summary", label: "整理要点", kind: "note", placeholder: "输入要整理的内容或对话范围" },
  { id: "plan", label: "拆解目标", kind: "event", placeholder: "输入目标和约束条件" },
];

const replies = [
  "可以。建议把年费 5–20 万的 31 家客户列为重点，提前 60 天由客户成功经理发起续约沟通，并在简报里补充这部分名单。",
  "已更新简报：在「建议」一节加入续约提前量和负责人，流失原因改成按金额加权的占比。",
];

/** 智能体工场的品牌色是蓝色：把 core 默认的紫色色阶整体映射到蓝色 */
const brandBlue = Object.fromEntries(["", "-50", "-100", "-200", "-300", "-400", "-500", "-600", "-700", "-800", "-900"].flatMap(step => [[`--fg-violet${step}`, `var(--fg-blue${step})`], [`--color-fg-violet${step}`, `var(--fg-blue${step})`]])) as CSSProperties;

function now() {
  return new Date().toLocaleString("zh-CN", { hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function ConversationBubble({ turn }: { turn: ConversationTurn }) {
  const isUser = turn.role === "user";
  return <li className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
    <div className={`flex min-w-0 max-w-[min(720px,92%)] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
      <div className="px-1 text-[11px] text-fg-grey-500">{isUser ? "你" : "助手"} · {turn.at}</div>
      <div className={`w-full overflow-hidden rounded-2xl px-3.5 py-2.5 text-sm ${isUser ? "rounded-br-md bg-fg-blue-50 text-fg-grey-900" : "rounded-bl-md border border-fg-grey-100 bg-fg-grey-50 text-fg-grey-800"}`}>
        <div className="whitespace-pre-wrap break-words leading-6">{turn.content}</div>
      </div>
    </div>
  </li>;
}

export interface AgentRunProps {
  session?: AgentRunSession;
  className?: string;
}

export function AgentRun({ session = defaultAgentRunSession, className = "" }: AgentRunProps) {
  const [conversation, setConversation] = useState(session.conversation);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"waiting_input" | "running">("waiting_input");
  const [preview, setPreview] = useState<SessionArtifact | null>(null);
  const timer = useRef<number | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const replyIndex = useRef(0);

  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);
  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight }); }, [conversation]);

  function stop() {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    setStatus("waiting_input");
  }

  function send(message: string) {
    const text = message.trim();
    if (!text || status === "running") return;
    const reply = replies[replyIndex.current % replies.length];
    replyIndex.current += 1;
    setDraft("");
    setStatus("running");
    setConversation(current => [...current, { role: "user", content: text, at: now() }, { role: "assistant", content: "", at: now() }]);
    let length = 0;
    timer.current = window.setInterval(() => {
      length = Math.min(reply.length, length + 3);
      setConversation(current => current.map((turn, index) => index === current.length - 1 ? { ...turn, content: reply.slice(0, length) } : turn));
      if (length >= reply.length) stop();
    }, 40);
  }

  const visibleTurns = conversation.filter(turn => turn.content);
  const rows = [["自主智能体", session.agent], ["人工确认", session.approval], ["创建", session.createdAt], ["更新", session.updatedAt]];

  return <div style={brandBlue} className={`flex min-w-0 flex-col gap-4 ${className}`}>
    <div className="flex flex-col gap-3">
      <PageTitleToolbar
        title={session.goal}
        breadcrumbs={<Breadcrumbs color="blue" className="flex-wrap gap-y-1" items={[{ label: "工作台", href: "#overview" }, { label: "智能体", href: "#apps" }, { label: "自主智能体", href: "#autonomous" }, { label: session.goal }]} />}
        askAi={{ placeholder: "问问这个任务…", suggestions: ["简报里还缺什么？"], onSend: () => "简报已覆盖续约率、流失数量和原因。可以再补一段下季度的重点续约名单，便于管理层分配资源。" }}
        actions={<div className="flex flex-wrap gap-2">
          <Button color="blue" variant="secondary">删除</Button>
          <Button color="blue" variant="secondary">返回</Button>
        </div>}
        className="flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4 [&>div:first-child]:w-full [&>div:first-child]:min-w-0 [&>div:first-child]:sm:min-w-48 [&>div:last-child]:sm:flex-wrap"
      />
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-fg-grey-700">任务状态</span>
        <StatusBadge label={status === "running" ? "运行中" : "等待对话"} color={status === "running" ? "blue" : "yellow"} />
        <span className="text-xs text-fg-grey-500">{session.id}</span>
      </div>
    </div>

    <div className="flex min-h-0 flex-col gap-4 xl:h-[680px] xl:flex-row">
      <section className="flex min-h-[480px] min-w-0 flex-col rounded-2xl border border-fg-grey-200 bg-background xl:min-h-0 xl:flex-1">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-fg-grey-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-fg-black">对话</h2>
          <span className="text-xs text-fg-grey-500">{visibleTurns.length} 条{status === "running" ? " · 回复中…" : null}</span>
        </div>
        <div ref={list} className="min-h-0 flex-1 overflow-y-auto p-4">
          <ul className="flex flex-col gap-4">
            {visibleTurns.map((turn, index) => <ConversationBubble key={`${turn.at}-${index}`} turn={turn} />)}
          </ul>
          {status === "running" && conversation.at(-1)?.content === "" ? <div className="mt-4 flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-fg-grey-100 bg-fg-grey-50 px-3.5 py-2 text-xs text-fg-grey-500">助手正在回复…</div>
          </div> : null}
        </div>
        <div className="shrink-0 border-t border-fg-grey-100 bg-background p-3">
          <ChatInputBar className="mx-auto w-full max-w-[720px]" color="blue" multiline rows={2} density="compact" sendOnEnter clearOnSend={false}
            quickActions={conversationActions} quickActionsLabel="快捷操作" removeQuickActionLabel="移除操作" hasMessages={visibleTurns.length > 0}
            value={draft} onChange={setDraft} onSend={message => send(message)} onStop={stop} status={status === "running" ? "running" : "idle"}
            showAttachment={false} inputLabel="任务会话消息" sendLabel="发送" stopLabel="停止回复" stoppingLabel="正在停止"
            placeholder="继续补充或追问，可用 @ 选择工具，回车发送，Shift+回车换行…" />
        </div>
      </section>

      <aside className="flex min-h-0 w-full shrink-0 flex-col gap-4 xl:w-[360px]">
        <section className="shrink-0 rounded-2xl border border-fg-grey-200 bg-background p-4">
          <h2 className="mb-3 text-sm font-semibold text-fg-black">概要</h2>
          <dl className="flex flex-col gap-2 text-sm">
            {rows.map(([label, value]) => <div key={label} className="flex justify-between gap-2"><dt className="shrink-0 text-fg-grey-600">{label}</dt><dd className="break-all text-right text-fg-black">{value}</dd></div>)}
          </dl>
          <h3 className="mb-2 mt-4 text-sm font-semibold text-fg-black">知识库授权</h3>
          <ul className="flex flex-col gap-1 text-sm text-fg-grey-700">
            {session.knowledge.map(name => <li key={name}>{name}<span className="ml-1 text-xs text-fg-grey-500">只读</span></li>)}
          </ul>
        </section>
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-fg-grey-200 bg-background">
          <h2 className="shrink-0 border-b border-fg-grey-100 px-4 py-3 text-sm font-semibold text-fg-black">结果与产物</h2>
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
            <div>
              <h3 className="mb-1 text-xs font-medium text-fg-grey-600">摘要</h3>
              <p className="text-sm leading-6 text-fg-black">{session.summary}</p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-medium text-fg-grey-600">产物 · {session.artifacts.length}</h3>
              <ul className="flex flex-col divide-y divide-fg-grey-200 border-t border-fg-grey-200">
                {session.artifacts.map(artifact => <li key={artifact.name} className="flex min-w-0 items-center gap-2 py-1.5">
                  <span className="shrink-0 text-fg-grey-500" aria-hidden><DocumentTextLinear size={16} /></span>
                  <span className="min-w-0 flex-1 truncate text-sm text-fg-black">{artifact.name}</span>
                  <button type="button" className="shrink-0 text-xs font-medium text-fg-blue-600 hover:text-fg-blue-700" onClick={() => setPreview(artifact)}>预览</button>
                  <a className="shrink-0 text-xs font-medium text-fg-blue-600 hover:text-fg-blue-700" href={`data:text/plain;charset=utf-8,${encodeURIComponent(artifact.content)}`} download={`${artifact.name}.md`}>下载</a>
                </li>)}
              </ul>
            </div>
            <p className="text-xs text-fg-grey-500">用量：tool_calls={session.usage.toolCalls} · tokens={session.usage.tokens}</p>
          </div>
        </section>
      </aside>
    </div>

    <Modal open={preview !== null} onOpenChange={open => { if (!open) setPreview(null); }} title={preview?.name ?? "产物"} width="w-[min(92vw,720px)]">
      <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-fg-grey-50 p-4 font-mono text-xs leading-6 text-fg-grey-900">{preview?.content}</pre>
    </Modal>
  </div>;
}
