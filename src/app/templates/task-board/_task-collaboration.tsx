"use client";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { Button, ConfirmationDialog, SelectOption, TextArea, ThinkingTrace } from "@forge-ui-official/core";
import { collaborationStates, transitionCollaboration, type TaskCollaboration } from "./_collaboration";
import { MarkdownContent } from "./_markdown";
import { useUnsavedChanges } from "./_use-unsaved-changes";
import type { DraftExitGuard } from "./_subtasks";
import type { Task } from "./_data";

export function TaskCollaborationPanel({ task, agents = ["研究助手", "设计助手", "开发助手"], instructions = {}, onChange, onExitGuardChange }: { task: Task; agents?: string[]; instructions?: Record<string,string>; onChange: (task: Task) => void; onExitGuardChange?: (guard: DraftExitGuard | null) => void }) {
  const [agent, setAgent] = useState(agents[0] ?? "研究助手");
  const [brief, setBrief] = useState("");
  const [feedback, setFeedback] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const pendingExit = useRef<(() => void) | null>(null);
  const dirty = !!brief.trim() || !!feedback.trim();
  useUnsavedChanges(dirty);
  const requestExit: DraftExitGuard = proceed => {
    if (dirty) { pendingExit.current = proceed; setDiscardOpen(true); }
    else proceed();
  };
  useEffect(() => {
    onExitGuardChange?.(requestExit);
    return () => onExitGuardChange?.(null);
  });
  const value = task.collaboration;
  const update = (next: TaskCollaboration) => onChange({ ...task, collaboration: next });
  const transition = (state: TaskCollaboration["state"], text: string, patch: Partial<TaskCollaboration> = {}) => { if (value) update(transitionCollaboration(value, state, text, patch)); };
  return <><div {...{ onClose: (event: SyntheticEvent) => event.stopPropagation(), onCancel: (event: SyntheticEvent) => event.stopPropagation() }}><ConfirmationDialog open={discardOpen} onOpenChange={setDiscardOpen} title="放弃未提交的协作内容？" description="执行要求和反馈尚未提交。" color="red" confirmLabel="放弃变更" cancelLabel="继续编辑" onCancel={() => { pendingExit.current = null; setDiscardOpen(false); }} onConfirm={() => { const proceed = pendingExit.current; pendingExit.current = null; setBrief(""); setFeedback(""); setDiscardOpen(false); proceed?.(); }} /></div><section className="task-collaboration task-detail-section" aria-label="Agent 协作">
    <div className="flex items-center justify-between gap-3"><h2>Agent 协作</h2><span className="text-xs text-fg-grey-700">本地演示 · 不会调用模型</span></div>
    {!value && !assigning && <div><Button color="grey" size="sm" variant="secondary" disabled={task.done} onClick={() => setAssigning(true)}>委派给 Agent</Button></div>}
    {!value && assigning ? <div className="flex flex-col gap-3">
      <p className="text-sm text-fg-grey-700">将明确的任务交给助手，在这里查看进展、补充信息和审核交付。</p>
      <SelectOption color="blue" label="执行助手" value={agent} options={agents.map(name => ({ label: name, value: name }))} onChange={setAgent} />
      {instructions[agent] && <details><summary className="text-xs text-fg-grey-700 cursor-pointer">查看助手工作指令</summary><p className="text-sm whitespace-pre-wrap leading-7">{instructions[agent]}</p></details>}
      <TextArea color="blue" aria-label="执行要求" placeholder="补充目标、约束和验收要求…" value={brief} onChange={setBrief} />
      <div className="flex gap-2"><Button color="grey" size="sm" variant="secondary" onClick={() => requestExit(() => setAssigning(false))}>取消委派</Button><Button color="blue" size="sm" disabled={task.done} onClick={() => { update({ agent, brief: [brief.trim() || task.description || task.title, instructions[agent] ? `### 助手工作指令\n\n${instructions[agent]}` : ""].filter(Boolean).join("\n\n"), state: "ready", attempt: 0, events: [{ id: crypto.randomUUID(), at: new Date().toISOString(), text: `已委派给${agent}` }] }); setBrief(""); setAssigning(false); }}>委派任务</Button></div>
    </div> : value ? <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3"><span className="text-sm text-fg-black">{value.agent} · {collaborationStates[value.state]}</span><span className="text-xs text-fg-grey-700">{value.attempt ? `第 ${value.attempt} 次执行` : "尚未执行"}</span></div>
      <details><summary className="text-sm text-fg-grey-700 cursor-pointer">执行要求</summary><MarkdownContent value={value.brief} /></details>
      {value.state === "running" && <ThinkingTrace settled rows={[{ primary: "读取任务与上下文" }, { primary: "整理执行计划" }, { primary: "等待选择演示结果" }]} doneLabel="演示执行过程" />}
      {value.state === "waiting" && <p className="text-sm text-fg-black">请补充本次交付的约束或确认执行方向，再继续。</p>}
      {value.result && <div><h3 className="text-sm font-semibold text-fg-black mb-2">{value.state === "ready" ? "上次交付 · 待修改" : "交付结果 · 示例"}</h3><MarkdownContent value={value.result} /></div>}
      {value.feedback && <p className="text-sm text-fg-grey-700">最近反馈：{value.feedback}</p>}
      {(value.state === "waiting" || value.state === "review") && <TextArea color="blue" aria-label="协作反馈" placeholder={value.state === "review" ? "需要修改的内容…" : "补充上下文或执行要求…"} value={feedback} onChange={setFeedback} />}
      {task.done && value.state !== "approved" && <p className="text-xs text-fg-grey-700">任务已完成，重新打开任务后可再次执行。</p>}
      <div className="task-execution-actions flex flex-wrap gap-2">
        {(["ready", "failed", "paused"] as string[]).includes(value.state) && <Button color="blue" size="sm" disabled={task.done} onClick={() => transition("running", "开始演示执行", { attempt: value.attempt + 1, result: undefined })}>{value.state === "ready" ? "开始演示" : "重新执行"}</Button>}
        {value.state === "running" && <><Button color="grey" size="sm" variant="secondary" onClick={() => transition("paused", "已暂停执行")}>暂停</Button><details className="task-simulation-controls"><summary>演示控制</summary><div className="mt-3 flex flex-wrap gap-2"><Button color="blue" size="sm" onClick={() => transition("review", "已提交示例交付，等待人工审核", { result: `## ${task.title}\n\n- 已整理任务目标与现有上下文\n- 已形成可供评审的初步方案\n- 待确认交付范围与验收标准\n\n这是模板中的示例结果，未执行真实任务。` })}>演示提交审核</Button><Button color="grey" size="sm" variant="secondary" onClick={() => transition("waiting", "请求人工补充信息")}>演示请求确认</Button><Button color="grey" size="sm" variant="secondary" onClick={() => transition("failed", "演示执行失败，可重试")}>演示失败</Button></div></details></>}
        {value.state === "waiting" && <Button color="blue" size="sm" disabled={task.done || !feedback.trim()} onClick={() => { transition("running", "已补充信息，继续执行", { feedback: feedback.trim() }); setFeedback(""); }}>回复并继续</Button>}
        {value.state === "review" && <><Button color="blue" size="sm" onClick={() => { transition("approved", "人工审核通过", feedback.trim() ? { feedback: feedback.trim() } : {}); setFeedback(""); }}>审核通过</Button><Button color="grey" size="sm" variant="secondary" disabled={!feedback.trim()} onClick={() => { transition("ready", "已退回修改", { feedback: feedback.trim() }); setFeedback(""); }}>退回修改</Button></>}
      </div>
      <details><summary className="text-sm text-fg-grey-700 cursor-pointer">协作记录 · {value.events.length}</summary><ol className="mt-3 flex flex-col gap-3">{value.events.map(event => <li key={event.id} className="text-sm text-fg-black">{event.text}<time className="ml-3 text-xs text-fg-grey-700">{new Date(event.at).toLocaleString("zh-CN")}</time>{event.detail && <details className="mt-2"><summary className="text-xs text-fg-grey-700 cursor-pointer">查看内容</summary><MarkdownContent value={event.detail} /></details>}</li>)}</ol></details>
    </div> : null}
  </section></>;
}
