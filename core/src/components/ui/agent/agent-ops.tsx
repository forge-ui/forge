"use client";

import { AnimatePresence, motion as animated } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AltArrowDownLinear, CheckCircleLinear, ClockCircleLinear, DangerTriangleLinear, PlusLinear } from "../../../icons";
import { AgentCard, Collapse, SoftBadge, Spinner, accentButton, iconAction, type AgentTone } from "../../../internal/agent-kit";
import { useReducedMotion } from "../../../internal/motion";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { TabBar } from "../tab-bar";
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

const STATE: Record<AgentTaskState, { zh: string; en: string; tone: AgentTone }> = {
  "needs-you": { zh: "待你处理", en: "Needs you", tone: "yellow" },
  running: { zh: "运行中", en: "Running", tone: "blue" },
  failed: { zh: "失败", en: "Failed", tone: "red" },
  done: { zh: "已完成", en: "Done", tone: "green" },
};

function StateIcon({ status }: { status: AgentTaskState }) {
  if (status === "running") return <span className="flex size-4 shrink-0 items-center justify-center"><Spinner size={13} /></span>;
  if (status === "needs-you") return <ClockCircleLinear size={16} color="var(--fg-yellow-700)" className="shrink-0" />;
  if (status === "failed") return <DangerTriangleLinear size={16} color="var(--fg-red)" className="shrink-0" />;
  return <CheckCircleLinear size={16} color="var(--fg-green-500)" className="shrink-0" />;
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
  motion?: MotionPreference;
  size?: "md" | "sm";
  className?: string;
};

const ORDER: AgentTaskState[] = ["needs-you", "running", "failed", "done"];

/**
 * All background agent tasks in one list: tabs with counts, what needs you first, live clocks, and
 * rows that open to their last steps with approve, reject, retry or open.
 */
export function AgentInbox({ tasks, title, onApprove, onReject, onRetry, onOpen, locale = "zh", motion = "auto", size = "md", className }: AgentInboxProps) {
  const reduced = useReducedMotion(motion);
  const [filter, setFilter] = useState<AgentTaskState | "all">("all");
  const [open, setOpen] = useState<string>();
  const filters = ["all", ...ORDER] as const;
  const count = (state: AgentTaskState | "all") => (state === "all" ? tasks.length : tasks.filter(task => task.status === state).length);
  const shown = [...(filter === "all" ? tasks : tasks.filter(task => task.status === filter))].sort((left, right) => ORDER.indexOf(left.status) - ORDER.indexOf(right.status));
  const waiting = count("needs-you");

  return (
    <AgentCard
      size={size}
      className={className}
      title={title ?? pick(locale, "智能体任务", "Agent tasks")}
      subtitle={waiting ? pick(locale, `${waiting} 项等你处理`, `${waiting} need you`) : pick(locale, "没有等你处理的任务", "Nothing needs you")}
      bodyClassName={size === "sm" ? "pt-1 pb-3" : "pt-1 pb-4"}
    >
      <div className="flex flex-col gap-2">
        <div className="-mx-1 overflow-x-auto px-1">
          <TabBar
            className="min-w-max"
            ariaLabel={pick(locale, "按状态筛选", "Filter by status")}
            motion={motion}
            tabs={filters.map(state => ({ label: state === "all" ? pick(locale, "全部", "All") : pick(locale, STATE[state].zh, STATE[state].en), badge: count(state) || undefined, active: filter === state }))}
            onChange={index => setFilter(filters[index])}
          />
        </div>
        <ul className="flex flex-col gap-1">
          <AnimatePresence initial={false}>
            {shown.map(task => {
              const expanded = open === task.id;
              return (
                <animated.li
                  key={task.id}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.12 } }}
                  data-status={task.status}
                  className={cn("flex flex-col rounded-xl transition-colors", expanded && "bg-fg-grey-50")}
                >
                  <button type="button" aria-expanded={expanded} onClick={() => setOpen(expanded ? undefined : task.id)} className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-fg-grey-50">
                    <StateIcon status={task.status} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-fg-black">{task.title}</span>
                      {(task.agent || task.summary) && <span className="truncate text-xs text-fg-grey-500">{[task.agent, task.summary].filter(Boolean).join(" · ")}</span>}
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-0.5">
                      <SoftBadge tone={STATE[task.status].tone}>{pick(locale, STATE[task.status].zh, STATE[task.status].en)}</SoftBadge>
                      <TaskClock task={task} locale={locale} />
                    </span>
                    <AltArrowDownLinear size={12} color="var(--fg-grey-500)" className={cn("shrink-0 transition-transform", expanded && "rotate-180")} />
                  </button>
                  <Collapse open={expanded} motion={motion}>
                    <div className="flex flex-col gap-3 px-3 pb-3 pl-10">
                      {task.recent && task.recent.length > 0 && (
                        <ol className="flex flex-col gap-1 border-l border-fg-grey-200 pl-3 text-xs text-fg-grey-700">{task.recent.map((line, index) => <li key={index}>{line}</li>)}</ol>
                      )}
                      <div className="flex flex-wrap justify-end gap-2">
                        {onOpen && <Button size="sm" variant="tertiary" color="grey" onClick={() => onOpen(task.id)}>{pick(locale, "查看详情", "Open")}</Button>}
                        {task.status === "needs-you" && onReject && <Button size="sm" variant="tertiary" color="grey" onClick={() => onReject(task.id)}>{pick(locale, "驳回", "Reject")}</Button>}
                        {task.status === "needs-you" && onApprove && <button type="button" className={accentButton} onClick={() => onApprove(task.id)}>{pick(locale, "批准", "Approve")}</button>}
                        {task.status === "failed" && onRetry && <button type="button" className={accentButton} onClick={() => onRetry(task.id)}>{pick(locale, "重试", "Retry")}</button>}
                      </div>
                    </div>
                  </Collapse>
                </animated.li>
              );
            })}
          </AnimatePresence>
          {!shown.length && <li className="flex flex-col items-center gap-1 py-8 text-center"><CheckCircleLinear size={20} color="var(--fg-grey-400)" /><span className="text-sm text-fg-grey-500">{pick(locale, "这里没有任务", "Nothing here")}</span></li>}
        </ul>
      </div>
    </AgentCard>
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
  const active = [...tasks.filter(task => task.status === "needs-you"), ...tasks.filter(task => task.status === "running")];

  return (
    <div ref={root} className={cn("relative inline-flex tracking-fg", className)}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(value => !value)} className="inline-flex h-9 items-center gap-2 rounded-full bg-background px-3.5 text-xs font-medium text-fg-black outline outline-1 outline-offset-[-1px] outline-fg-grey-200 transition-colors hover:bg-fg-grey-50">
        {running > 0 && <span className="inline-flex items-center gap-1.5"><Spinner size={12} />{pick(locale, `${running} 个运行中`, `${running} running`)}</span>}
        {running > 0 && waiting > 0 && <span className="h-3 w-px bg-fg-grey-200" />}
        {waiting > 0 && <span className="inline-flex items-center gap-1.5 text-fg-yellow-700"><span className="forge-pulse-dot size-1.5 rounded-full bg-fg-yellow-500" />{pick(locale, `${waiting} 个待你处理`, `${waiting} need you`)}</span>}
      </button>
      {open && (
        <ul role="menu" className="forge-fade-up absolute right-0 top-full z-30 mt-2 flex w-80 max-w-[calc(100vw-2rem)] flex-col rounded-2xl bg-background p-1.5 shadow-[0px_4px_30px_0px_rgba(77,84,100,0.20)] outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          {active.map(task => (
            <li key={task.id} role="none">
              <button type="button" role="menuitem" onClick={() => { onOpen?.(task.id); setOpen(false); }} className="flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-fg-grey-100">
                <StateIcon status={task.status} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-fg-black">{task.title}</span>
                  {task.summary && <span className="truncate text-xs text-fg-grey-500">{task.summary}</span>}
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
  size?: "md" | "sm";
  className?: string;
};

/** "While you were away": how long, what needs you first, what failed, and what got done. */
export function AwaySummary({ awayFor, items, onDismiss, locale = "zh", size = "md", className }: AwaySummaryProps) {
  const groups = [
    { kind: "needs-you" as const, zh: "需要你处理", en: "Needs you" },
    { kind: "failed" as const, zh: "没做成", en: "Failed" },
    { kind: "done" as const, zh: "已完成", en: "Done" },
  ].map(group => ({ ...group, items: items.filter(item => item.kind === group.kind) })).filter(group => group.items.length);

  return (
    <AgentCard
      size={size}
      className={cn("forge-fade-up", className)}
      aria-label={pick(locale, "离开期间", "While you were away")}
      title={pick(locale, `你离开了 ${formatDuration(awayFor, locale)}`, `You were away for ${formatDuration(awayFor, locale)}`)}
      subtitle={groups.map(group => pick(locale, `${group.zh} ${group.items.length} 项`, `${group.items.length} ${group.en.toLowerCase()}`)).join(pick(locale, "，", ", "))}
      action={onDismiss && <button type="button" aria-label={pick(locale, "知道了", "Dismiss")} onClick={onDismiss} className={iconAction}><PlusLinear size={16} className="rotate-45" /></button>}
    >
      <div className="flex flex-col gap-4">
        {groups.map(group => (
          <div key={group.kind} className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-fg-grey-500">{pick(locale, group.zh, group.en)}</span>
            {group.items.map(item => (
              <div key={item.id} className={cn("flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 outline outline-1 outline-offset-[-1px]", item.kind === "needs-you" ? "bg-fg-yellow-50 outline-fg-yellow-200" : "bg-background outline-fg-grey-200")}>
                <StateIcon status={item.kind} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-fg-black">{item.title}</span>
                  {item.detail && <span className="truncate text-xs text-fg-grey-500">{item.detail}</span>}
                </span>
                {item.onAction && (item.kind === "needs-you"
                  ? <button type="button" className={accentButton} onClick={item.onAction}>{item.actionLabel ?? pick(locale, "去处理", "Open")}</button>
                  : <Button size="sm" variant="tertiary" color="grey" onClick={item.onAction}>{item.actionLabel ?? pick(locale, "查看", "Open")}</Button>)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </AgentCard>
  );
}
