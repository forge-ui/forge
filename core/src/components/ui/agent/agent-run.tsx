"use client";

import { useState, type ReactNode } from "react";
import {
  AltArrowDownLinear,
  AltArrowUpLinear,
  CheckCircleBold,
  ClipboardListBoldDuotone,
  DangerTriangleBold,
  PlusLinear,
  RefreshLinear,
  ShieldCheckBold,
  TrashBinMinimalisticLinear,
} from "../../../icons";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { formatDuration, pick, useElapsed, type AgentLocale } from "./agent-utils";
import { ToolChips, type ToolChipItem } from "./tool-chips";

export type AgentStepStatus = "pending" | "running" | "waiting" | "done" | "failed" | "skipped";

function StepMarker({ status, index }: { status: AgentStepStatus; index?: number }) {
  if (status === "done") return <CheckCircleBold size={18} className="shrink-0 text-fg-green-500" />;
  if (status === "failed") return <DangerTriangleBold size={18} className="shrink-0 text-fg-red" />;
  if (status === "waiting") return <ShieldCheckBold size={18} className="shrink-0 text-fg-yellow-700" />;
  if (status === "running") {
    return <span aria-hidden="true" className="flex size-[18px] shrink-0 items-center justify-center"><span className="size-3.5 animate-spin rounded-full border-2 border-fg-blue-100 border-t-accent" /></span>;
  }
  return <span aria-hidden="true" className={cn("flex size-[18px] shrink-0 items-center justify-center rounded-full border text-[10px] tabular-nums", status === "skipped" ? "border-fg-grey-200 text-fg-grey-400" : "border-fg-grey-300 text-fg-grey-700")}>{index ?? ""}</span>;
}

function LiveTime({ startedAt, duration, running, locale }: { startedAt?: number | Date; duration?: number; running: boolean; locale: AgentLocale }) {
  const elapsed = useElapsed(startedAt, running);
  const time = duration ?? (running ? elapsed : undefined);
  return time === undefined ? null : <span className="shrink-0 tabular-nums text-xs text-fg-grey-500">{formatDuration(time, locale)}</span>;
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
  size?: "md" | "sm";
  className?: string;
};

let stepSequence = 0;

/**
 * An agent's plan to check before it runs: rename, reorder, remove or add steps, then start it and
 * watch each step tick through with live timers and a retry from the step that failed.
 */
export function AgentPlan({ title, description, steps, mode = "review", onChange, onApprove, onCancel, onRetryFrom, approveLabel, locale = "zh", size = "md", className }: AgentPlanProps) {
  const editable = mode === "review" && Boolean(onChange);
  const [adding, setAdding] = useState("");
  const done = steps.filter(step => step.status === "done").length;
  const small = size === "sm";
  const update = (next: PlanStep[]) => onChange?.(next);
  const move = (index: number, direction: -1 | 1) => {
    const next = [...steps];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    update(next);
  };

  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border border-fg-grey-200 bg-background tracking-fg", small ? "p-3" : "p-4", className)}>
      <div className="flex items-start gap-2">
        <ClipboardListBoldDuotone size={18} className="mt-0.5 shrink-0 text-accent" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className={cn("font-semibold text-fg-black", small ? "text-[13px]" : "text-sm")}>{title ?? pick(locale, "执行计划", "Plan")}</p>
          {description && <p className="text-xs leading-5 text-fg-grey-700">{description}</p>}
        </div>
        {mode !== "review" && <span className="shrink-0 tabular-nums text-xs text-fg-grey-700">{done}/{steps.length}</span>}
      </div>
      <ol className="flex flex-col">
        {steps.map((step, index) => {
          const status = step.status ?? "pending";
          return (
            <li key={step.id} className="group relative flex gap-2.5 pb-3 last:pb-0">
              {index < steps.length - 1 && <span aria-hidden="true" className={cn("absolute left-[8.5px] top-5 h-[calc(100%-18px)] w-px", status === "done" ? "bg-fg-green-200" : "bg-fg-grey-200")} />}
              <StepMarker status={status} index={index + 1} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex min-w-0 items-center gap-2">
                  {editable ? (
                    <input
                      value={step.title}
                      onChange={event => update(steps.map(item => (item.id === step.id ? { ...item, title: event.target.value } : item)))}
                      aria-label={pick(locale, `第 ${index + 1} 步`, `Step ${index + 1}`)}
                      className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1 py-0.5 -ml-1 text-[13px] text-fg-black outline-none hover:border-fg-grey-200 focus:border-accent"
                    />
                  ) : (
                    <span className={cn("min-w-0 flex-1 text-[13px]", status === "skipped" ? "text-fg-grey-500 line-through" : status === "pending" ? "text-fg-grey-700" : "text-fg-black", status === "running" && "font-medium")}>{step.title}</span>
                  )}
                  <LiveTime startedAt={step.startedAt} duration={step.duration} running={status === "running"} locale={locale} />
                  {editable && (
                    <span className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                      <button type="button" aria-label={pick(locale, "上移", "Move up")} disabled={index === 0} onClick={() => move(index, -1)} className="flex size-6 items-center justify-center rounded-md text-fg-grey-700 hover:bg-fg-grey-100 disabled:opacity-30"><AltArrowUpLinear size={12} /></button>
                      <button type="button" aria-label={pick(locale, "下移", "Move down")} disabled={index === steps.length - 1} onClick={() => move(index, 1)} className="flex size-6 items-center justify-center rounded-md text-fg-grey-700 hover:bg-fg-grey-100 disabled:opacity-30"><AltArrowDownLinear size={12} /></button>
                      <button type="button" aria-label={pick(locale, "删除这一步", "Remove step")} onClick={() => update(steps.filter(item => item.id !== step.id))} className="flex size-6 items-center justify-center rounded-md text-fg-grey-700 hover:bg-fg-grey-100 hover:text-fg-red"><TrashBinMinimalisticLinear size={12} /></button>
                    </span>
                  )}
                </div>
                {step.detail && <p className="text-xs leading-5 text-fg-grey-700">{step.detail}</p>}
                {status === "failed" && onRetryFrom && (
                  <Button size="sm" variant="tertiary" color="grey" iconLeft={<RefreshLinear size={14} />} onClick={() => onRetryFrom(step.id)} className="mt-1 self-start">{pick(locale, "从这一步重试", "Retry from here")}</Button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {editable && (
        <form
          className="flex items-center gap-2"
          onSubmit={event => {
            event.preventDefault();
            if (!adding.trim()) return;
            stepSequence += 1;
            update([...steps, { id: `step-${Date.now()}-${stepSequence}`, title: adding.trim() }]);
            setAdding("");
          }}
        >
          <PlusLinear size={14} className="ml-0.5 shrink-0 text-fg-grey-500" />
          <input value={adding} onChange={event => setAdding(event.target.value)} placeholder={pick(locale, "加一步", "Add a step")} aria-label={pick(locale, "加一步", "Add a step")} className="min-w-0 flex-1 bg-transparent py-0.5 text-[13px] text-fg-black outline-none placeholder:text-fg-grey-500" />
        </form>
      )}
      {mode === "review" && (onApprove || onCancel) && (
        <div className="flex items-center gap-2">
          {onApprove && <Button size="sm" disabled={!steps.length} onClick={onApprove}>{approveLabel ?? pick(locale, "按计划执行", "Run plan")}</Button>}
          {onCancel && <Button size="sm" variant="tertiary" color="grey" onClick={onCancel}>{pick(locale, "取消", "Cancel")}</Button>}
        </div>
      )}
    </div>
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
  className?: string;
};

/**
 * The steps an agent works through as one quiet trail: "3/5" in the header, finished steps with a
 * check and their time, the current one with its activity, sub-steps and live timer, and a waiting
 * step holding its approval in place.
 */
export function AgentTrail({ title, steps, collapseAfter = 4, locale = "zh", className }: AgentTrailProps) {
  const [expanded, setExpanded] = useState(false);
  const done = steps.filter(step => step.status === "done" || step.status === "skipped").length;
  const firstOpen = steps.findIndex(step => step.status !== "done" && step.status !== "skipped");
  const foldable = !expanded && done > collapseAfter && firstOpen > 1;
  const hidden = foldable ? firstOpen - 1 : 0;

  return (
    <div className={cn("flex flex-col gap-2 rounded-xl border border-fg-grey-200 bg-background p-3 tracking-fg", className)}>
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-fg-black">{title}</span>
        <span className="shrink-0 tabular-nums text-xs text-fg-grey-700">{done}/{steps.length}</span>
      </div>
      <div aria-hidden="true" className="h-1 overflow-hidden rounded-full bg-fg-grey-100"><div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${steps.length ? (done / steps.length) * 100 : 0}%` }} /></div>
      <ol className="flex flex-col gap-2 pt-1">
        {hidden > 0 && (
          <li>
            <button type="button" onClick={() => setExpanded(true)} className="flex items-center gap-2 text-xs text-fg-grey-700 hover:text-fg-black">
              <CheckCircleBold size={18} className="text-fg-green-500" />
              {pick(locale, `已完成 ${hidden} 步，展开`, `${hidden} steps done · show`)}
            </button>
          </li>
        )}
        {steps.slice(hidden).map((step, offset) => {
          const index = hidden + offset;
          const running = step.status === "running";
          return (
            <li key={step.id} data-status={step.status} className="flex gap-2">
              <StepMarker status={step.status} index={index + 1} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex min-w-0 items-center gap-2 text-[13px]">
                  <span className={cn("min-w-0 flex-1", step.status === "pending" ? "text-fg-grey-700" : "text-fg-black", running && "font-medium")}>{step.title}</span>
                  <LiveTime startedAt={step.startedAt} duration={step.duration} running={running} locale={locale} />
                </div>
                {running && step.activity && <span className="forge-text-shimmer text-xs text-fg-grey-700">{step.activity}</span>}
                {step.error && <span className="text-xs text-fg-red">{step.error}</span>}
                {step.substeps && step.substeps.length > 0 && step.status !== "pending" && (
                  <ul className="flex flex-col gap-1 border-l border-fg-grey-200 pl-2.5">
                    {step.substeps.map(sub => (
                      <li key={sub.id} className="flex items-center gap-1.5 text-xs">
                        <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", sub.status === "done" ? "bg-fg-green-500" : sub.status === "running" ? "animate-pulse bg-accent" : sub.status === "failed" ? "bg-fg-red" : "bg-fg-grey-300")} />
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
