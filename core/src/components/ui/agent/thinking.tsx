"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AltArrowDownLinear, CheckCircleLinear, DangerTriangleLinear, LightbulbLinear, LinkLinear } from "../../../icons";
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

/** The small "working on it" line before the first token arrives. Fully driven by the host. */
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
    <div role="status" aria-live="polite" className={cn("inline-flex items-center gap-2 tracking-fg text-fg-grey-700", size === "sm" ? "text-[13px]" : "text-sm", className)}>
      <span aria-hidden="true" className="flex gap-0.5">
        {[0, 1, 2].map(index => <span key={index} className="forge-pulse-dot size-1 rounded-full bg-accent" style={{ animationDelay: `${index * 160}ms` }} />)}
      </span>
      <span className="forge-text-shimmer font-medium">{text}</span>
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
  size?: "md" | "sm";
  className?: string;
};

function StepIcon({ status }: { status: ReasoningStep["status"] }) {
  if (status === "running") return <span className="mt-1.5 size-2 shrink-0 animate-pulse rounded-full bg-accent" />;
  if (status === "error") return <DangerTriangleLinear size={14} color="var(--fg-red)" className="mt-0.5 shrink-0" />;
  return <CheckCircleLinear size={14} color="var(--fg-grey-500)" className="mt-0.5 shrink-0" />;
}

/**
 * The model's thinking as one folding block: a live "思考中 3.1 秒" header while it works, then a
 * one-line "思考了 4.2 秒 · 3 步" summary. Open/closed follows the status unless the reader toggles it.
 */
export function Reasoning({ status, text, steps = [], startedAt, duration, label, doneLabel, open: controlledOpen, onOpenChange, locale = "zh", size = "md", className }: ReasoningProps) {
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
    <div data-status={status} className={cn("flex min-w-0 flex-col tracking-fg", small ? "text-[13px]" : "text-sm", className)}>
      <button
        type="button"
        aria-expanded={hasBody ? open : undefined}
        disabled={!hasBody}
        onClick={toggle}
        className="-ml-1.5 flex w-fit items-center gap-1.5 rounded-lg px-1.5 py-1 text-fg-grey-700 enabled:hover:bg-fg-grey-100 enabled:hover:text-fg-black"
      >
        <LightbulbLinear size={small ? 14 : 16} color={status === "error" ? "var(--fg-red)" : undefined} />
        <span className={cn("font-medium", working && "forge-text-shimmer")}>{header}</span>
        {working && shown !== undefined && <span className="tabular-nums text-xs text-fg-grey-500">{formatDuration(shown, locale)}</span>}
        {!working && steps.length > 0 && <span className="text-xs text-fg-grey-500">· {pick(locale, `${steps.length} 步`, `${steps.length} steps`)}</span>}
        {hasBody && <AltArrowDownLinear size={12} className={cn("transition-transform", open && "rotate-180")} />}
      </button>
      {open && hasBody && (
        <div className={cn("ml-2 mt-1 flex flex-col gap-2 border-l border-fg-grey-200 pl-3 text-fg-grey-700", small ? "text-xs leading-5" : "text-[13px] leading-5")}>
          {steps.length > 0 && (
            <ol className="flex flex-col gap-2">
              {steps.map(step => (
                <li key={step.id} className="flex gap-2">
                  <StepIcon status={step.status ?? "done"} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className={cn(step.status === "running" ? "text-fg-black" : "text-fg-grey-900")}>{step.label}</span>
                    {step.detail && <span className="text-fg-grey-700">{step.detail}</span>}
                    {step.sources && step.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {step.sources.map(source => {
                          const chip = <><LinkLinear size={11} />{source.domain ?? source.title}</>;
                          const style = "inline-flex max-w-48 items-center gap-1 truncate rounded-full bg-fg-grey-100 px-2 py-0.5 text-[11px] text-fg-grey-900";
                          return source.href
                            ? <a key={source.href} href={source.href} target="_blank" rel="noreferrer" title={source.title} className={cn(style, "hover:bg-fg-grey-200")}>{chip}</a>
                            : <span key={source.title} title={source.title} className={style}>{chip}</span>;
                        })}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
          {text?.trim() && <p className="whitespace-pre-wrap">{text}</p>}
        </div>
      )}
    </div>
  );
}
