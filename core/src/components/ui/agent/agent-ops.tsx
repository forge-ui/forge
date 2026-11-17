"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AltArrowDownLinear, CheckCircleLinear, DangerTriangleLinear, InboxBoldDuotone, PlusLinear, ShieldCheckBold } from "../../../icons";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { formatDuration, pick, useElapsed, type AgentLocale } from "./agent-utils";

export type AgentTaskState = "running" | "needs-you" | "failed" | "done";

export type InboxTask = {
  id: string;
  title: string;
  /** Which agent works on it. */
  agent?: string;
  status: AgentTaskState;
  startedAt?: number | Date;
  duration?: number;
  /** One line on where it stands, e.g. "等你确认退款金额". */
  summary?: string;
  /** The last few things it did, shown when the row opens. */
  recent?: string[];
};

const STATE_STYLE: Record<AgentTaskState, { zh: string; en: string; tag: string }> = {
  "needs-you": { zh: "待你处理", en: "Needs you", tag: "bg-fg-yellow-50 text-fg-yellow-800" },
  running: { zh: "运行中", en: "Running", tag: "bg-fg-blue-50 text-accent" },
  failed: { zh: "失败", en: "Failed", tag: "bg-fg-red-50 text-fg-red" },
  done: { zh: "已完成", en: "Done", tag: "bg-fg-green-50 text-fg-green-600" },
};

function StateIcon({ status }: { status: AgentTaskState }) {
  if (status === "running") return <span aria-hidden="true" className="size-3.5 shrink-0 animate-spin rounded-full border-[1.5px] border-fg-grey-300 border-t-accent" />;
  if (status === "needs-you") return <ShieldCheckBold size={14} className="shrink-0 text-fg-yellow-700" />;
  if (status === "failed") return <DangerTriangleLinear size={14} className="shrink-0 text-fg-red" />;
  return <CheckCircleLinear size={14} className="shrink-0 text-fg-green-500" />;
}

function TaskClock({ task, locale }: { task: InboxTask; locale: AgentLocale }) {
  const elapsed = useElapsed(task.startedAt, task.status === "running");
  const time = task.duration ?? elapsed;
  return time === undefined ? null : <span className="shrink-0 tabular-nums text-xs text-fg-grey-500">{formatDuration(time, locale)}</span>;
}

/* ───────────────────────── AgentInbox ───────────────────────── */

export type AgentInboxProps = {
  tasks: InboxTask[];
  title?: ReactNode;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRetry?: (id: string) => void;
  onOpen?: (id: string) => void;
  locale?: AgentLocale;
  className?: string;
};

const ORDER: AgentTaskState[] = ["needs-you", "running", "failed", "done"];

/**
 * All background agent tasks in one list: filter tabs with counts, live clocks, and rows that open
 * to their last steps with approve, reject, retry or open.
 */
export function AgentInbox({ tasks, title, onApprove, onReject, onRetry, onOpen, locale = "zh", className }: AgentInboxProps) {
  const [filter, setFilter] = useState<AgentTaskState | "all">("all");
  const [open, setOpen] = useState<string>();
  const count = (state: AgentTaskState) => tasks.filter(task => task.status === state).length;
  const shown = [...(filter === "all" ? tasks : tasks.filter(task => task.status === filter))].sort((left, right) => ORDER.indexOf(left.status) - ORDER.indexOf(right.status));

  return (
    <div className={cn("flex min-w-0 flex-col rounded-xl border border-fg-grey-200 bg-background tracking-fg", className)}>
      <div className="flex items-center gap-2 px-3 pt-3">
        <InboxBoldDuotone size={18} className="text-accent" />
        <span className="text-[13px] font-semibold text-fg-black">{title ?? pick(locale, "智能体任务", "Agent tasks")}</span>
      </div>
      <div role="tablist" className="flex gap-1 overflow-x-auto px-3 pt-2">
        {(["all", ...ORDER] as const).map(state => (
          <button key={state} type="button" role="tab" aria-selected={filter === state} onClick={() => setFilter(state)} className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs text-fg-grey-700 hover:bg-fg-grey-100 aria-selected:bg-fg-grey-100 aria-selected:font-semibold aria-selected:text-fg-black">
            {state === "all" ? pick(locale, "全部", "All") : pick(locale, STATE_STYLE[state].zh, STATE_STYLE[state].en)}
            <span className="tabular-nums text-fg-grey-500">{state === "all" ? tasks.length : count(state)}</span>
          </button>
        ))}
      </div>
      <ul className="flex flex-col p-1.5">
        {shown.map(task => {
          const expanded = open === task.id;
          return (
            <li key={task.id} data-status={task.status} className={cn("flex flex-col rounded-lg", expanded && "bg-fg-grey-50")}>
              <button type="button" aria-expanded={expanded} onClick={() => setOpen(expanded ? undefined : task.id)} className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-fg-grey-50">
                <StateIcon status={task.status} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[13px] text-fg-black">{task.title}</span>
                  {(task.agent || task.summary) && <span className="truncate text-xs text-fg-grey-700">{[task.agent, task.summary].filter(Boolean).join(" · ")}</span>}
                </span>
                <span className={cn("shrink-0 rounded-full px-1.5 py-px text-[11px] font-medium", STATE_STYLE[task.status].tag)}>{pick(locale, STATE_STYLE[task.status].zh, STATE_STYLE[task.status].en)}</span>
                <TaskClock task={task} locale={locale} />
                <AltArrowDownLinear size={12} className={cn("shrink-0 text-fg-grey-500 transition-transform", expanded && "rotate-180")} />
              </button>
              {expanded && (
                <div className="flex flex-col gap-2 px-2 pb-2.5 pl-[30px]">
                  {task.recent && task.recent.length > 0 && (
                    <ol className="flex flex-col gap-0.5 text-xs text-fg-grey-700">{task.recent.map((line, index) => <li key={index} className="truncate">· {line}</li>)}</ol>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {task.status === "needs-you" && onApprove && <Button size="sm" onClick={() => onApprove(task.id)}>{pick(locale, "批准", "Approve")}</Button>}
                    {task.status === "needs-you" && onReject && <Button size="sm" variant="tertiary" color="grey" onClick={() => onReject(task.id)}>{pick(locale, "驳回", "Reject")}</Button>}
                    {task.status === "failed" && onRetry && <Button size="sm" variant="secondary" onClick={() => onRetry(task.id)}>{pick(locale, "重试", "Retry")}</Button>}
                    {onOpen && <Button size="sm" variant="tertiary" color="grey" onClick={() => onOpen(task.id)}>{pick(locale, "查看详情", "Open")}</Button>}
                  </div>
                </div>
              )}
            </li>
          );
        })}
        {!shown.length && <li className="px-2 py-6 text-center text-xs text-fg-grey-500">{pick(locale, "这里没有任务", "Nothing here")}</li>}
      </ul>
    </div>
  );
}

/* ───────────────────────── RunningNow ───────────────────────── */

export type RunningNowProps = {
  tasks: InboxTask[];
  onOpen?: (id: string) => void;
  locale?: AgentLocale;
  className?: string;
};

/** Background agent work at a glance for a header: "3 个运行中 · 2 个待你处理", opening to the list. */
export function RunningNow({ tasks, onOpen, locale = "zh", className }: RunningNowProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const running = tasks.filter(task => task.status === "running").length;
  const waiting = tasks.filter(task => task.status === "needs-you").length;
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, [open]);
  if (!running && !waiting) return null;
  const active = tasks.filter(task => task.status === "running" || task.status === "needs-you");

  return (
    <div ref={root} className={cn("relative inline-flex tracking-fg", className)}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(value => !value)} className="inline-flex items-center gap-1.5 rounded-full border border-fg-grey-200 bg-background px-3 py-1 text-xs text-fg-black hover:bg-fg-grey-50">
        {running > 0 && <><span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-accent" />{pick(locale, `${running} 个运行中`, `${running} running`)}</>}
        {running > 0 && waiting > 0 && <span className="text-fg-grey-400">·</span>}
        {waiting > 0 && <span className="font-semibold text-fg-yellow-800">{pick(locale, `${waiting} 个待你处理`, `${waiting} need you`)}</span>}
      </button>
      {open && (
        <ul role="menu" className="absolute right-0 top-full z-30 mt-1.5 flex w-72 max-w-[calc(100vw-2rem)] flex-col rounded-xl border border-fg-grey-200 bg-background p-1 shadow-[0px_4px_30px_0px_rgba(77,84,100,0.20)]">
          {active.map(task => (
            <li key={task.id} role="none">
              <button type="button" role="menuitem" onClick={() => { onOpen?.(task.id); setOpen(false); }} className="flex w-full min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-fg-grey-100">
                <StateIcon status={task.status} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[13px] text-fg-black">{task.title}</span>
                  {task.summary && <span className="truncate text-[11px] text-fg-grey-700">{task.summary}</span>}
                </span>
                <TaskClock task={task} locale={locale} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ───────────────────────── AwaySummary ───────────────────────── */

export type AwayItem = {
  id: string;
  title: string;
  kind: "needs-you" | "failed" | "done";
  detail?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export type AwaySummaryProps = {
  /** How long the user was away, in milliseconds. */
  awayFor: number;
  items: AwayItem[];
  onDismiss?: () => void;
  locale?: AgentLocale;
  className?: string;
};

/** "While you were away": how long, what needs you first, what failed, and what got done. */
export function AwaySummary({ awayFor, items, onDismiss, locale = "zh", className }: AwaySummaryProps) {
  const groups = [
    { kind: "needs-you" as const, zh: "需要你处理", en: "Needs you" },
    { kind: "failed" as const, zh: "没做成", en: "Failed" },
    { kind: "done" as const, zh: "已完成", en: "Done" },
  ].map(group => ({ ...group, items: items.filter(item => item.kind === group.kind) })).filter(group => group.items.length);

  return (
    <section aria-label={pick(locale, "离开期间", "While you were away")} className={cn("flex flex-col gap-3 rounded-xl border border-fg-grey-200 bg-fg-grey-50 p-3 tracking-fg", className)}>
      <div className="flex items-start gap-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[13px] font-semibold text-fg-black">{pick(locale, `你离开了 ${formatDuration(awayFor, locale)}`, `You were away for ${formatDuration(awayFor, locale)}`)}</span>
          <span className="text-xs text-fg-grey-700">
            {groups.map(group => pick(locale, `${group.zh} ${group.items.length} 项`, `${group.items.length} ${group.en.toLowerCase()}`)).join(pick(locale, "，", ", "))}
          </span>
        </div>
        {onDismiss && <button type="button" aria-label={pick(locale, "知道了", "Dismiss")} onClick={onDismiss} className="flex size-6 shrink-0 items-center justify-center rounded-md text-fg-grey-700 hover:bg-fg-grey-200"><PlusLinear size={14} className="rotate-45" /></button>}
      </div>
      {groups.map(group => (
        <div key={group.kind} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-fg-grey-700">{pick(locale, group.zh, group.en)}</span>
          {group.items.map(item => (
            <div key={item.id} className="flex min-w-0 items-center gap-2 rounded-lg bg-background px-2.5 py-1.5">
              <StateIcon status={item.kind} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[13px] text-fg-black">{item.title}</span>
                {item.detail && <span className="truncate text-xs text-fg-grey-700">{item.detail}</span>}
              </span>
              {item.onAction && <Button size="sm" variant={item.kind === "needs-you" ? "primary" : "tertiary"} color={item.kind === "needs-you" ? undefined : "grey"} onClick={item.onAction}>{item.actionLabel ?? pick(locale, "处理", "Open")}</Button>}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
