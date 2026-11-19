"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AltArrowDownLinear, CheckCircleLinear, DangerTriangleLinear, LinkLinear, StarsLinear } from "../../../icons";
import { Collapse, Spinner } from "../../../internal/agent-kit";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { formatDuration, pick, useElapsed, type AgentLocale } from "./agent-utils";

/* ───────────────────────── ThinkingIndicator ───────────────────────── */

export type ThinkingIndicatorProps = {
  /** Fixed label; ignored when `phases` is given. */
  label?: string;
  /** Labels shown in turn while waiting, e.g. ["读取页面", "查询订单", "整理回答"]; stays on the last one. */
  phases?: string[];
  /** Milliseconds per phase. */
  phaseDuration?: number;
  /** Shows a live timer from this moment. */
  startedAt?: number | Date;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};

/** The "working on it" line before the first token arrives. Fully driven by the host. */
export function ThinkingIndicator({ label, phases, phaseDuration = 2400, startedAt, locale = "zh", size = "md", className }: ThinkingIndicatorProps) {
  const [progress, setProgress] = useState({ key: "", phase: 0 });
  const elapsed = useElapsed(startedAt, true);
  // Keyed by content, so a new array with the same labels does not restart the sequence.
  const phaseKey = phases?.join("\n") ?? "";
  const phaseCount = phases?.length ?? 0;
  const phase = progress.key === phaseKey ? progress.phase : 0;
  useEffect(() => {
    if (phaseCount < 2) return;
    const timer = setInterval(() => setProgress(current => ({ key: phaseKey, phase: Math.min((current.key === phaseKey ? current.phase : 0) + 1, phaseCount - 1) })), phaseDuration);
    return () => clearInterval(timer);
  }, [phaseKey, phaseCount, phaseDuration]);
  const text = phases?.length ? phases[Math.min(phase, phases.length - 1)] : label ?? pick(locale, "思考中…", "Thinking…");
  return (
    <div role="status" aria-live="polite" className={cn("inline-flex items-center gap-2 rounded-lg px-1.5 py-1 text-sm tracking-fg text-fg-grey-700", size === "sm" && "-ml-1.5", className)}>
      <span className="forge-pulse-dot inline-flex"><StarsLinear size={16} color="var(--accent)" /></span>
      <span key={text} className="forge-fade-up forge-text-shimmer font-medium">{text}</span>
      {elapsed !== undefined && <span className="tabular-nums text-xs text-fg-grey-500">{formatDuration(elapsed, locale)}</span>}
    </div>
  );
}

/* ───────────────────────── Reasoning ───────────────────────── */

export type ReasoningStatus = "thinking" | "done" | "stopped" | "error";

export type ReasoningSource = { title: string; href?: string; domain?: string };

export type ReasoningStep = {
  id: string;
  label: ReactNode;
  detail?: ReactNode;
  status?: "running" | "done" | "error";
  /** Pages or records this step read, shown as small chips. */
  sources?: ReasoningSource[];
};

export type ReasoningProps = {
  status: ReasoningStatus;
  /** Free reasoning text from the model (AI SDK reasoning parts). */
  text?: string;
  /** Structured steps; shown above `text` when both are given. */
  steps?: ReasoningStep[];
  /** Start of the thinking, for the live timer. */
  startedAt?: number | Date;
  /** Final duration in milliseconds, shown once done. */
  duration?: number;
  /** Header while thinking. */
  label?: ReactNode;
  /** Header once done; defaults to "思考了 4.2 秒". */
  doneLabel?: ReactNode;
  /** Controlled open state. Uncontrolled, it is open while thinking and folds when done. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  locale?: AgentLocale;
  motion?: MotionPreference;
  size?: "md" | "sm";
  className?: string;
};

function StepIcon({ status }: { status: ReasoningStep["status"] }) {
  if (status === "running") return <span className="flex size-4 shrink-0 items-center justify-center"><Spinner size={12} /></span>;
  if (status === "error") return <DangerTriangleLinear size={16} color="var(--fg-red)" className="shrink-0" />;
  return <CheckCircleLinear size={16} color="var(--fg-green-500)" className="shrink-0" />;
}

/**
 * The model's thinking as one folding block, in ThinkingTrace's style: a live "思考中 3.1 秒" header
 * while it works, then "思考了 4.2 秒 · 3 步". Open/closed follows the status unless the reader toggles it.
 */
export function Reasoning({ status, text, steps = [], startedAt, duration, label, doneLabel, open: controlledOpen, onOpenChange, locale = "zh", motion = "auto", size = "md", className }: ReasoningProps) {
  const working = status === "thinking";
  const elapsed = useElapsed(startedAt, working);
  // A toggle holds until thinking starts or ends; then the block follows the status again.
  const [toggled, setToggled] = useState<{ working: boolean; open: boolean }>();
  const open = controlledOpen ?? (toggled?.working === working ? toggled.open : working);
  const small = size === "sm";
  const shown = duration ?? (working ? elapsed : undefined);
  const header = working
    ? label ?? pick(locale, "思考中", "Thinking")
    : status === "stopped" ? pick(locale, "已停止思考", "Stopped thinking")
      : status === "error" ? pick(locale, "思考中断", "Thinking failed")
        : doneLabel ?? (shown !== undefined ? pick(locale, `思考了 ${formatDuration(shown, locale)}`, `Thought for ${formatDuration(shown, locale)}`) : pick(locale, "思考过程", "Thought process"));
  const hasBody = Boolean(text?.trim()) || steps.length > 0;
  const toggle = () => { const next = !open; setToggled({ working, open: next }); onOpenChange?.(next); };

  return (
    <div data-status={status} className={cn("flex min-w-0 flex-col gap-1.5 text-sm tracking-fg", className)}>
      <button
        type="button"
        aria-expanded={hasBody ? open : undefined}
        disabled={!hasBody}
        onClick={toggle}
        className={cn("flex w-fit items-center gap-2 rounded-lg px-1.5 py-1 text-left text-fg-grey-700 enabled:hover:bg-fg-grey-100", small && "-ml-1.5")}
      >
        {status === "error" ? <DangerTriangleLinear size={16} color="var(--fg-red)" /> : <StarsLinear size={16} color="var(--accent)" />}
        <span className={cn("font-medium", working && "forge-text-shimmer")}>{header}</span>
        {working && shown !== undefined && <span className="tabular-nums text-xs text-fg-grey-500">{formatDuration(shown, locale)}</span>}
        {!working && steps.length > 0 && <span className="text-xs text-fg-grey-500">{pick(locale, `${steps.length} 步`, `${steps.length} steps`)}</span>}
        {hasBody && <AltArrowDownLinear size={12} color="var(--fg-grey-500)" className={cn("transition-transform", open && "rotate-180")} />}
      </button>
      <Collapse open={open && hasBody} motion={motion}>
        <div className={cn("flex flex-col gap-0.5 border-l border-fg-grey-200 pl-3", small ? "ml-0.5" : "ml-2")}>
          {steps.map(step => (
            <div key={step.id} className="forge-fade-up flex min-h-7 gap-2 rounded-lg px-1.5 py-1">
              <span className="pt-0.5"><StepIcon status={step.status ?? "done"} /></span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className={cn("text-sm text-fg-black", step.status === "running" && "font-medium")}>{step.label}</span>
                {step.detail && <span className="text-xs leading-5 text-fg-grey-700">{step.detail}</span>}
                {step.sources && step.sources.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {step.sources.map(source => {
                      const chip = <><LinkLinear size={12} color="var(--fg-grey-500)" />{source.domain ?? source.title}</>;
                      const style = "inline-flex max-w-48 items-center gap-1 truncate rounded-md bg-fg-grey-100 px-1.5 py-0.5 text-xs text-fg-grey-700";
                      return source.href
                        ? <a key={source.href} href={source.href} target="_blank" rel="noreferrer" title={source.title} className={cn(style, "hover:bg-fg-grey-200 hover:text-fg-black")}>{chip}</a>
                        : <span key={source.title} title={source.title} className={style}>{chip}</span>;
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
          {text?.trim() && <p className="whitespace-pre-wrap px-1.5 py-1 text-xs leading-5 text-fg-grey-700">{text}</p>}
        </div>
      </Collapse>
    </div>
  );
}
