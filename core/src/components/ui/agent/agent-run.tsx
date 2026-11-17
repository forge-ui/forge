"use client";

import { AnimatePresence, motion as animated } from "motion/react";
import { useState, type ReactNode } from "react";
import {
  AltArrowDownLinear,
  AltArrowUpLinear,
  CheckCircleBold,
  DangerTriangleBold,
  PlusLinear,
  RefreshLinear,
  TrashBinMinimalisticLinear,
} from "../../../icons";
import { AgentCard, CardActions, SoftBadge, Spinner, accentButton, iconAction } from "../../../internal/agent-kit";
import { useReducedMotion } from "../../../internal/motion";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { formatDuration, pick, useElapsed, type AgentLocale } from "./agent-utils";
import { ToolChips, type ToolChipItem } from "./tool-chips";

export type AgentStepStatus = "pending" | "running" | "waiting" | "done" | "failed" | "skipped";

function StepMarker({ status, index }: { status: AgentStepStatus; index?: number }) {
  if (status === "done") return <CheckCircleBold size={20} color="var(--fg-green-500)" className="shrink-0" />;
  if (status === "failed") return <DangerTriangleBold size={20} color="var(--fg-red)" className="shrink-0" />;
  if (status === "running") return <span className="flex size-5 shrink-0 items-center justify-center"><Spinner size={16} /></span>;
  return (
    <span aria-hidden="true" className={cn("flex size-5 shrink-0 items-center justify-center rounded-full text-2xs font-semibold tabular-nums outline outline-1 outline-offset-[-1px]",
      status === "waiting" ? "bg-fg-yellow-50 text-fg-yellow-700 outline-fg-yellow-200" : status === "skipped" ? "text-fg-grey-500 outline-fg-grey-200" : "bg-background text-fg-grey-700 outline-fg-grey-300")}>
      {index ?? ""}
    </span>
  );
}

function LiveTime({ startedAt, duration, running, locale }: { startedAt?: number | Date; duration?: number; running: boolean; locale: AgentLocale }) {
  const elapsed = useElapsed(startedAt, running);
  const time = duration ?? (running ? elapsed : undefined);
  return time === undefined ? null : <span className="shrink-0 tabular-nums text-xs text-fg-grey-500">{formatDuration(time, locale)}</span>;
}

function Progress({ done, total }: { done: number; total: number }) {
  return (
    <div aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-fg-grey-100">
      <div className="h-full rounded-full bg-accent transition-[width] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
    </div>
  );
}

/* ───────────────────────── AgentPlan ───────────────────────── */

export type PlanStep = {
  id: string;
  title: string;
  detail?: string;
  status?: AgentStepStatus;
  startedAt?: number | Date;
  duration?: number;
};

export type AgentPlanProps = {
  title?: ReactNode;
  description?: ReactNode;
  steps: PlanStep[];
  /** review: the user can edit before it runs; running/done: progress only. */
  mode?: "review" | "running" | "done";
  /** Edits in review mode: rename, reorder, remove and add steps. Without it the plan is read-only. */
  onChange?: (steps: PlanStep[]) => void;
  onApprove?: () => void;
  onCancel?: () => void;
  /** Re-run from a failed step. */
  onRetryFrom?: (stepId: string) => void;
  approveLabel?: string;
  locale?: AgentLocale;
  motion?: MotionPreference;
  size?: "md" | "sm";
  className?: string;
};

let stepSequence = 0;

/**
 * An agent's plan to check before it runs: rename, reorder, remove or add steps, then start it and
 * watch each step tick through with live timers and a retry from the step that failed.
 */
export function AgentPlan({ title, description, steps, mode = "review", onChange, onApprove, onCancel, onRetryFrom, approveLabel, locale = "zh", motion = "auto", size = "md", className }: AgentPlanProps) {
  const reduced = useReducedMotion(motion);
  const editable = mode === "review" && Boolean(onChange);
  const [adding, setAdding] = useState("");
  const done = steps.filter(step => step.status === "done").length;
  const failed = steps.some(step => step.status === "failed");
  const update = (next: PlanStep[]) => onChange?.(next);
  const move = (index: number, direction: -1 | 1) => {
    const next = [...steps];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    update(next);
  };
  const badge = mode === "review"
    ? <SoftBadge tone="blue">{pick(locale, "待确认", "Review")}</SoftBadge>
    : failed ? <SoftBadge tone="red">{pick(locale, "有失败", "Failed")}</SoftBadge>
      : mode === "done" || done === steps.length ? <SoftBadge tone="green">{pick(locale, "已完成", "Done")}</SoftBadge>
        : <SoftBadge tone="blue">{done}/{steps.length}</SoftBadge>;

  return (
    <AgentCard
      size={size}
      className={className}
      title={title ?? pick(locale, "执行计划", "Plan")}
      subtitle={description}
      action={badge}
      footer={mode === "review" && (onApprove || onCancel) && (
        <CardActions aside={editable ? pick(locale, `${steps.length} 步 · 可以先改再执行`, `${steps.length} steps · edit before running`) : undefined}>
          {onCancel && <Button size="sm" variant="tertiary" color="grey" onClick={onCancel}>{pick(locale, "取消", "Cancel")}</Button>}
          {onApprove && <button type="button" className={accentButton} disabled={!steps.length} onClick={onApprove}>{approveLabel ?? pick(locale, "按计划执行", "Run plan")}</button>}
        </CardActions>
      )}
    >
      <div className="flex flex-col gap-3">
        {mode !== "review" && <Progress done={done} total={steps.length} />}
        <ol className="flex flex-col">
          <AnimatePresence initial={false}>
            {steps.map((step, index) => {
              const status = step.status ?? "pending";
              return (
                <animated.li
                  key={step.id}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                  className="group relative flex gap-3 pb-3 last:pb-0"
                >
                  {index < steps.length - 1 && <span aria-hidden="true" className={cn("absolute left-[9.5px] top-6 bottom-1 w-px", status === "done" ? "bg-fg-green-200" : "bg-fg-grey-200")} />}
                  <StepMarker status={status} index={index + 1} />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex min-h-5 min-w-0 items-center gap-2">
                      {editable ? (
                        <input
                          value={step.title}
                          onChange={event => update(steps.map(item => (item.id === step.id ? { ...item, title: event.target.value } : item)))}
                          aria-label={pick(locale, `第 ${index + 1} 步`, `Step ${index + 1}`)}
                          className="-my-1 -ml-1.5 min-w-0 flex-1 rounded-lg bg-transparent px-1.5 py-1 text-sm text-fg-black outline outline-1 outline-offset-[-1px] outline-transparent transition-all hover:bg-fg-grey-50 focus:bg-background focus:outline-accent"
                        />
                      ) : (
                        <span className={cn("min-w-0 flex-1 text-sm", status === "skipped" ? "text-fg-grey-500 line-through" : status === "pending" ? "text-fg-grey-700" : "text-fg-black", status === "running" && "font-semibold")}>{step.title}</span>
                      )}
                      <LiveTime startedAt={step.startedAt} duration={step.duration} running={status === "running"} locale={locale} />
                      {editable && (
                        <span className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                          <button type="button" aria-label={pick(locale, "上移", "Move up")} disabled={index === 0} onClick={() => move(index, -1)} className={iconAction}><AltArrowUpLinear size={14} /></button>
                          <button type="button" aria-label={pick(locale, "下移", "Move down")} disabled={index === steps.length - 1} onClick={() => move(index, 1)} className={iconAction}><AltArrowDownLinear size={14} /></button>
                          <button type="button" aria-label={pick(locale, "删除这一步", "Remove step")} onClick={() => update(steps.filter(item => item.id !== step.id))} className={cn(iconAction, "hover:text-fg-red")}><TrashBinMinimalisticLinear size={14} /></button>
                        </span>
                      )}
                    </div>
                    {step.detail && <p className="text-xs leading-5 text-fg-grey-500">{step.detail}</p>}
                    {status === "failed" && onRetryFrom && (
                      <Button size="sm" variant="tertiary" color="grey" iconLeft={<RefreshLinear size={14} />} onClick={() => onRetryFrom(step.id)} className="mt-1.5 self-start">{pick(locale, "从这一步重试", "Retry from here")}</Button>
                    )}
                  </div>
                </animated.li>
              );
            })}
          </AnimatePresence>
        </ol>
        {editable && (
          <form
            className="flex items-center gap-3"
            onSubmit={event => {
              event.preventDefault();
              if (!adding.trim()) return;
              stepSequence += 1;
              update([...steps, { id: `step-${Date.now()}-${stepSequence}`, title: adding.trim() }]);
              setAdding("");
            }}
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full outline-dashed outline-1 outline-offset-[-1px] outline-fg-grey-300"><PlusLinear size={12} color="var(--fg-grey-500)" /></span>
            <input value={adding} onChange={event => setAdding(event.target.value)} placeholder={pick(locale, "加一步，回车确认", "Add a step, press Enter")} aria-label={pick(locale, "加一步", "Add a step")} className="min-w-0 flex-1 bg-transparent py-1 text-sm text-fg-black outline-none placeholder:text-fg-grey-500" />
          </form>
        )}
      </div>
    </AgentCard>
  );
}

/* ───────────────────────── AgentTrail ───────────────────────── */

export type TrailSubstep = { id: string; title: string; status: AgentStepStatus; duration?: number };

export type TrailStep = {
  id: string;
  title: string;
  status: AgentStepStatus;
  /** What it is doing right now, shown under a running step. */
  activity?: string;
  startedAt?: number | Date;
  duration?: number;
  substeps?: TrailSubstep[];
  /** Content for a waiting step, usually an Approval or Question. */
  waiting?: ReactNode;
  error?: string;
};

export type AgentTrailProps = {
  title: ReactNode;
  steps: TrailStep[];
  /** Folds finished steps into one line when there are more than this. */
  collapseAfter?: number;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};

const SUB_DOT: Record<AgentStepStatus, string> = {
  done: "bg-fg-green-500",
  running: "bg-accent forge-pulse-dot",
  failed: "bg-fg-red",
  waiting: "bg-fg-yellow-500",
  pending: "bg-fg-grey-300",
  skipped: "bg-fg-grey-200",
};

/**
 * The steps an agent works through as one trail: "3/5" with a progress bar, finished steps with a
 * check and their time, the current one with its activity, sub-steps and live timer, and a waiting
 * step holding its approval in place.
 */
export function AgentTrail({ title, steps, collapseAfter = 4, locale = "zh", size = "md", className }: AgentTrailProps) {
  const [expanded, setExpanded] = useState(false);
  const done = steps.filter(step => step.status === "done" || step.status === "skipped").length;
  const firstOpen = steps.findIndex(step => step.status !== "done" && step.status !== "skipped");
  const foldable = !expanded && done > collapseAfter && firstOpen > 1;
  const hidden = foldable ? firstOpen - 1 : 0;
  const waiting = steps.some(step => step.status === "waiting");
  const failed = steps.some(step => step.status === "failed");

  return (
    <AgentCard
      size={size}
      className={className}
      title={title}
      action={failed ? <SoftBadge tone="red">{pick(locale, "有失败", "Failed")}</SoftBadge>
        : waiting ? <SoftBadge tone="yellow">{pick(locale, "等你确认", "Needs you")}</SoftBadge>
          : done === steps.length ? <SoftBadge tone="green">{pick(locale, "已完成", "Done")}</SoftBadge>
            : <SoftBadge tone="blue">{done}/{steps.length}</SoftBadge>}
    >
      <div className="flex flex-col gap-3">
        <Progress done={done} total={steps.length} />
        <ol className="flex flex-col gap-3">
          {hidden > 0 && (
            <li>
              <button type="button" onClick={() => setExpanded(true)} className="-ml-1.5 flex items-center gap-3 rounded-lg px-1.5 py-1 text-sm text-fg-grey-700 hover:bg-fg-grey-100">
                <CheckCircleBold size={20} color="var(--fg-green-500)" />
                {pick(locale, `已完成 ${hidden} 步，展开查看`, `${hidden} steps done · show`)}
              </button>
            </li>
          )}
          {steps.slice(hidden).map((step, offset) => {
            const index = hidden + offset;
            const running = step.status === "running";
            return (
              <li key={step.id} data-status={step.status} className="forge-fade-up flex gap-3">
                <StepMarker status={step.status} index={index + 1} />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex min-h-5 min-w-0 items-center gap-2 text-sm">
                    <span className={cn("min-w-0 flex-1", step.status === "pending" ? "text-fg-grey-700" : "text-fg-black", running && "font-semibold")}>{step.title}</span>
                    <LiveTime startedAt={step.startedAt} duration={step.duration} running={running} locale={locale} />
                  </div>
                  {running && step.activity && <span key={step.activity} className="forge-fade-up forge-text-shimmer text-xs text-fg-grey-700">{step.activity}</span>}
                  {step.error && <span className="text-xs text-fg-red">{step.error}</span>}
                  {step.substeps && step.substeps.length > 0 && step.status !== "pending" && (
                    <ul className="flex flex-col gap-1 rounded-xl bg-fg-grey-50 px-3 py-2">
                      {step.substeps.map(sub => (
                        <li key={sub.id} className="flex items-center gap-2 text-xs">
                          <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", SUB_DOT[sub.status])} />
                          <span className={cn("min-w-0 flex-1 truncate", sub.status === "pending" ? "text-fg-grey-500" : "text-fg-grey-900")}>{sub.title}</span>
                          {sub.duration !== undefined && <span className="shrink-0 tabular-nums text-fg-grey-500">{formatDuration(sub.duration, locale)}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                  {step.status === "waiting" && step.waiting}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </AgentCard>
  );
}

/* ───────────────── RunProgress (Forge Agent / Ask AI harness) ───────────────── */

export type ProgressStep = { id: string; title: string; status: "running" | "waiting-user" | "waiting-external" | "completed" | "cancelled" | "failed"; meta?: string };

const PROGRESS_STATUS: Record<ProgressStep["status"], NonNullable<ToolChipItem["status"]>> = {
  running: "running", "waiting-user": "pending", "waiting-external": "pending", completed: "complete", cancelled: "cancelled", failed: "error",
};

/** The steps of a harness run as one folding list; open while something is running or waiting. */
export function RunProgress({ steps, locale = "zh" }: { steps: ProgressStep[]; locale?: AgentLocale }) {
  if (!steps.length) return null;
  const items: ToolChipItem[] = steps.map(step => ({ id: step.id, kind: "run", label: step.title, chip: step.meta ?? "", status: PROGRESS_STATUS[step.status] }));
  const active = steps.some(step => step.status === "running" || step.status.startsWith("waiting"));
  // A step that failed and was retried does not fail the run; only an unfinished end does.
  const failed = steps.at(-1)?.status === "failed";
  return <ToolChips items={items} size="sm" locale={locale} defaultOpen={active || failed} summary={pick(locale, `${steps.length} 个步骤`, `${steps.length} steps`)} state={active ? "running" : failed ? "error" : "success"} />;
}
