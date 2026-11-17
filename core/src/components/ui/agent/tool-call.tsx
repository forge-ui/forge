"use client";

import { useState, type ReactNode } from "react";
import { AltArrowDownLinear, CheckCircleLinear, ClockCircleLinear, CloseCircleLinear, CopyLinear, DangerTriangleLinear, RefreshLinear } from "../../../icons";
import { AgentCard, CardActions, Collapse, SoftBadge, Spinner, accentButton } from "../../../internal/agent-kit";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { formatDuration, pick, useElapsed, type AgentLocale } from "./agent-utils";

export type ToolCallStatus = "pending" | "running" | "awaiting-approval" | "success" | "error" | "denied";

export type ToolCallProps = {
  /** Tool name as the model calls it, e.g. "search_orders". */
  name: string;
  /** Human label shown instead of the name, e.g. "查询订单". */
  title?: ReactNode;
  /** Short summary after the label, e.g. the main argument or "12 条结果". */
  summary?: ReactNode;
  status: ToolCallStatus;
  args?: unknown;
  result?: unknown;
  error?: string;
  /** Start time, for the live timer while running. */
  startedAt?: number | Date;
  /** Final duration in milliseconds. */
  duration?: number;
  /** Replaces the check once the call has finished, e.g. the tool's logo. */
  icon?: ReactNode;
  /** Custom body shown when the row opens, instead of the argument and result blocks. */
  details?: ReactNode;
  /** Shown on errors. */
  onRetry?: () => void;
  /** Why the agent wants to run this; shown while awaiting approval. */
  approvalReason?: ReactNode;
  onApprove?: () => void;
  onDeny?: () => void;
  defaultOpen?: boolean;
  /** Open by itself when the call fails, so the error shows. */
  openOnError?: boolean;
  /** row: one line, as listed inside a ToolCallGroup; card: on its own with an outline. */
  variant?: "card" | "row";
  locale?: AgentLocale;
  motion?: MotionPreference;
  size?: "md" | "sm";
  className?: string;
};

const isIdentifier = (name: string) => /^[\w.:/-]+$/.test(name);
const pretty = (value: unknown) => (typeof value === "string" ? (() => { try { return JSON.stringify(JSON.parse(value), null, 2); } catch { return value; } })() : JSON.stringify(value, null, 2) ?? String(value));

function Payload({ label, value, locale, tone }: { label: string; value: string; locale: AgentLocale; tone?: "error" }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div className="flex items-center justify-between text-xs font-medium text-fg-grey-500">
        {label}
        <button
          type="button"
          aria-label={copied ? pick(locale, "已复制", "Copied") : pick(locale, `复制${label}`, `Copy ${label}`)}
          onClick={() => navigator.clipboard?.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }, () => undefined)}
          className="rounded-md p-1 hover:bg-fg-grey-100"
        >
          {copied ? <CheckCircleLinear size={12} color="var(--fg-green-500)" /> : <CopyLinear size={12} color="var(--fg-grey-500)" />}
        </button>
      </div>
      <pre className={cn("max-h-56 overflow-auto rounded-lg px-3 py-2 font-mono text-xs leading-5", tone === "error" ? "bg-fg-red-50 text-fg-red" : "bg-fg-grey-50 text-fg-grey-900")}>{value}</pre>
    </div>
  );
}

function StatusIcon({ status, icon }: { status: ToolCallStatus; icon?: ReactNode }) {
  if (status === "running") return <span className="flex size-4 shrink-0 items-center justify-center"><Spinner size={13} /></span>;
  if (status === "pending" || status === "awaiting-approval") return <ClockCircleLinear size={16} color={status === "pending" ? "var(--fg-grey-500)" : "var(--fg-yellow-700)"} className="shrink-0" />;
  if (status === "error") return <DangerTriangleLinear size={16} color="var(--fg-red)" className="shrink-0" />;
  if (status === "denied") return <CloseCircleLinear size={16} color="var(--fg-grey-500)" className="shrink-0" />;
  return icon ? <span className="flex size-4 shrink-0 items-center justify-center">{icon}</span> : <CheckCircleLinear size={16} color="var(--fg-green-500)" className="shrink-0" />;
}

/**
 * One tool call as one line, in ToolChips' style: status, name, argument chip and a live timer. It
 * opens to the arguments and the result (or the error with a retry); a call that needs approval asks
 * in a card with allow and deny.
 */
export function ToolCall({ name, title, summary, status, args, result, error, startedAt, duration, icon, details, onRetry, approvalReason, onApprove, onDeny, defaultOpen = false, openOnError = true, variant = "card", locale = "zh", motion = "auto", size = "md", className }: ToolCallProps) {
  const running = status === "running" || status === "pending";
  const elapsed = useElapsed(startedAt, running);
  const [toggled, setToggled] = useState<boolean>();
  // Errors open themselves so the message is visible, until the reader folds it.
  const open = toggled ?? (defaultOpen || (openOnError && status === "error"));
  const asking = status === "awaiting-approval";
  const time = duration ?? elapsed;
  const hasBody = details !== undefined || args !== undefined || result !== undefined || Boolean(error);
  const label = title ?? name;
  const trailing = status === "error" ? pick(locale, "失败", "Failed")
    : status === "denied" ? pick(locale, "已拒绝", "Denied")
      : status === "pending" ? pick(locale, "等待", "Queued")
        : time !== undefined ? formatDuration(time, locale) : undefined;

  if (asking) {
    const named = typeof label === "string" ? label : name;
    return (
      <AgentCard
        size={size}
        tone="attention"
        data-status={status}
        className={className}
        title={pick(locale, `允许执行「${named}」吗？`, `Allow ${named}?`)}
        action={<SoftBadge tone="yellow">{pick(locale, "待确认", "Needs approval")}</SoftBadge>}
        footer={onApprove || onDeny ? (
          <CardActions aside={summary}>
            {onDeny && <Button size="sm" variant="tertiary" color="grey" onClick={onDeny}>{pick(locale, "拒绝", "Deny")}</Button>}
            {onApprove && <button type="button" className={accentButton} onClick={onApprove}>{pick(locale, "允许", "Allow")}</button>}
          </CardActions>
        ) : <p role="status" className="text-xs text-fg-grey-500">{pick(locale, "等待确认", "Waiting for approval")}</p>}
      >
        <div className="flex flex-col gap-2">
          {approvalReason && <p className="text-sm leading-6 text-fg-black">{approvalReason}</p>}
          {args !== undefined && <pre className="overflow-x-auto rounded-lg bg-fg-grey-50 px-3 py-2 font-mono text-xs leading-5 text-fg-grey-900">{pretty(args)}</pre>}
        </div>
      </AgentCard>
    );
  }

  return (
    <div data-status={status} className={cn("flex min-w-0 flex-col tracking-fg", variant === "card" && "rounded-xl bg-background p-1.5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200", className)}>
      <button
        type="button"
        aria-expanded={hasBody ? open : undefined}
        onClick={() => hasBody && setToggled(!open)}
        className={cn("flex min-h-8 w-full min-w-0 items-center gap-2 rounded-lg px-1.5 text-left text-sm", hasBody && "hover:bg-fg-grey-100", variant === "row" && size === "sm" && "-ml-1.5 min-h-7")}
      >
        <StatusIcon status={status} icon={icon} />
        <span className={cn("shrink-0 font-medium text-fg-black", !title && isIdentifier(name) && "font-mono text-xs")}>{label}</span>
        {summary && <span className="min-w-0 truncate rounded-md bg-fg-grey-100 px-1.5 py-0.5 text-xs text-fg-grey-700">{summary}</span>}
        <span className="flex-1" />
        {trailing && <span className={cn("shrink-0 tabular-nums text-xs", status === "error" ? "text-fg-red" : "text-fg-grey-500")}>{trailing}</span>}
        {hasBody && <AltArrowDownLinear size={12} color="var(--fg-grey-500)" className={cn("shrink-0 transition-transform", !open && "-rotate-90")} />}
      </button>
      <Collapse open={open && hasBody} motion={motion}>
        <div className="ml-[22px] mt-1 flex flex-col gap-2 border-l border-fg-grey-200 pb-1 pl-3">
          {details}
          {args !== undefined && <Payload label={pick(locale, "参数", "Arguments")} value={pretty(args)} locale={locale} />}
          {result !== undefined && <Payload label={pick(locale, "结果", "Result")} value={pretty(result)} locale={locale} />}
          {result === undefined && running && <p className="forge-text-shimmer text-xs text-fg-grey-500">{pick(locale, "等待结果…", "Waiting for result…")}</p>}
          {error && <Payload label={pick(locale, "错误", "Error")} value={error} locale={locale} tone="error" />}
          {status === "error" && onRetry && <Button size="sm" variant="tertiary" color="grey" iconLeft={<RefreshLinear size={14} />} onClick={onRetry} className="self-start">{pick(locale, "重试", "Retry")}</Button>}
        </div>
      </Collapse>
    </div>
  );
}

export type ToolCallGroupProps = {
  children: ReactNode;
  /** e.g. "调用了 3 次工具"; defaults from `count`. */
  label?: ReactNode;
  count?: number;
  status?: "idle" | "running" | "success" | "error" | "cancelled";
  /** Replaces the status word after the label, e.g. "执行失败". */
  statusLabel?: ReactNode;
  /** Uncontrolled default; the group opens itself unless everything succeeded. */
  defaultOpen?: boolean;
  locale?: AgentLocale;
  motion?: MotionPreference;
  className?: string;
};

/** Several tool calls of one turn behind one line, so the answer is not buried under them. */
export function ToolCallGroup({ children, label, count, status = "success", statusLabel, defaultOpen, locale = "zh", motion = "auto", className }: ToolCallGroupProps) {
  // A toggle holds until the status changes; then the group follows the status again.
  const [toggled, setToggled] = useState<{ status: string; open: boolean }>();
  const open = toggled?.status === status ? toggled.open : defaultOpen ?? status !== "success";
  const text = label ?? (count !== undefined ? pick(locale, `调用了 ${count} 次工具`, `Called ${count} tools`) : pick(locale, "工具调用", "Tool calls"));
  const state = statusLabel ?? (status === "running" ? pick(locale, "正在执行", "Running") : status === "error" ? pick(locale, "有失败", "Failed") : status === "cancelled" ? pick(locale, "已停止", "Stopped") : undefined);
  return (
    <div data-tool-group={status} className={cn("flex min-w-0 flex-col gap-1 text-sm tracking-fg", className)}>
      <button type="button" aria-expanded={open} onClick={() => setToggled({ status, open: !open })} className="-ml-1.5 flex w-fit items-center gap-1.5 rounded-lg px-1.5 py-1 text-xs text-fg-grey-700 hover:bg-fg-grey-100">
        <AltArrowDownLinear size={12} color="var(--fg-grey-500)" className={cn("transition-transform", !open && "-rotate-90")} />
        {text}
        {state && <span role="status" className={cn(status === "running" ? "forge-text-shimmer" : status === "error" ? "text-fg-red" : "text-fg-grey-500")}>{state}</span>}
      </button>
      <Collapse open={open} motion={motion}>
        <div className="flex flex-col">{children}</div>
      </Collapse>
    </div>
  );
}
