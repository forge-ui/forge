"use client";

import { useState, type ReactNode } from "react";
import { AltArrowDownLinear, CheckCircleLinear, CloseCircleLinear, CopyLinear, DangerTriangleLinear, RefreshLinear, SettingsBoldDuotone, ShieldCheckBold } from "../../../icons";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { formatDuration, pick, useElapsed, type AgentLocale } from "./agent-utils";

export type ToolCallStatus = "pending" | "running" | "awaiting-approval" | "success" | "error" | "denied";

export type ToolCallProps = {
  /** Tool name as the model calls it, shown in mono, e.g. "search_orders". */
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
  icon?: ReactNode;
  /** Shown on errors. */
  onRetry?: () => void;
  /** Why the agent wants to run this; shown while awaiting approval. */
  approvalReason?: ReactNode;
  onApprove?: () => void;
  onDeny?: () => void;
  defaultOpen?: boolean;
  /** row drops the border, for calls listed inside a ToolCallGroup. */
  variant?: "card" | "row";
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};

const isIdentifier = (name: string) => /^[\w.:/-]+$/.test(name);

const pretty = (value: unknown) => (typeof value === "string" ? (() => { try { return JSON.stringify(JSON.parse(value), null, 2); } catch { return value; } })() : JSON.stringify(value, null, 2) ?? String(value));

function Payload({ label, value, locale, tone }: { label: string; value: string; locale: AgentLocale; tone?: "error" }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-fg-grey-500">
        {label}
        <button
          type="button"
          aria-label={copied ? pick(locale, "已复制", "Copied") : pick(locale, `复制${label}`, `Copy ${label}`)}
          onClick={() => navigator.clipboard?.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }, () => undefined)}
          className="rounded p-0.5 text-fg-grey-500 hover:bg-fg-grey-200 hover:text-fg-black"
        >
          {copied ? <CheckCircleLinear size={12} /> : <CopyLinear size={12} />}
        </button>
      </div>
      <pre className={cn("max-h-56 overflow-auto rounded-lg px-2.5 py-2 font-mono text-[11px] leading-4", tone === "error" ? "bg-fg-red-50 text-fg-red-700" : "bg-fg-grey-50 text-fg-grey-900")}>{value}</pre>
    </div>
  );
}

/**
 * One tool call as one line: status, name, summary and a live timer. It opens to the arguments and
 * the result (or the error with a retry), and asks for approval inline when the call needs it.
 */
export function ToolCall({ name, title, summary, status, args, result, error, startedAt, duration, icon, onRetry, approvalReason, onApprove, onDeny, defaultOpen = false, variant = "card", locale = "zh", size = "md", className }: ToolCallProps) {
  const running = status === "running" || status === "pending";
  const elapsed = useElapsed(startedAt, running);
  const [toggled, setToggled] = useState<boolean>();
  // Errors open themselves so the message is visible, until the reader folds it.
  const open = toggled ?? (defaultOpen || status === "error");
  const asking = status === "awaiting-approval";
  const small = size === "sm";
  const time = duration ?? elapsed;
  const hasBody = args !== undefined || result !== undefined || Boolean(error);

  const statusIcon = running
    ? <span aria-hidden="true" className="size-3.5 shrink-0 animate-spin rounded-full border-[1.5px] border-fg-grey-300 border-t-accent" />
    : status === "success" ? <CheckCircleLinear size={14} color="var(--fg-green-500)" className="shrink-0" />
      : status === "error" ? <DangerTriangleLinear size={14} color="var(--fg-red)" className="shrink-0" />
        : status === "denied" ? <CloseCircleLinear size={14} color="var(--fg-grey-500)" className="shrink-0" />
          : <ShieldCheckBold size={14} color="var(--fg-yellow-700)" className="shrink-0" />;
  const trailing = status === "error" ? pick(locale, "失败", "Failed")
    : status === "denied" ? pick(locale, "已拒绝", "Denied")
      : asking ? pick(locale, "待确认", "Needs approval")
        : status === "pending" ? pick(locale, "等待中", "Queued")
          : time !== undefined ? formatDuration(time, locale) : undefined;

  return (
    <div data-status={status} className={cn("flex min-w-0 flex-col tracking-fg", variant === "card" ? cn("rounded-xl border bg-background", asking ? "border-fg-yellow-300" : "border-fg-grey-200") : "rounded-lg", className)}>
      <button
        type="button"
        aria-expanded={hasBody ? open : undefined}
        onClick={() => hasBody && setToggled(!open)}
        className={cn("flex min-w-0 items-center gap-2 text-left", variant === "row" ? (small ? "rounded-lg px-1.5 py-1 text-xs" : "rounded-lg px-2 py-1.5 text-[13px]") : (small ? "rounded-xl px-2.5 py-1.5 text-xs" : "rounded-xl px-3 py-2 text-[13px]"), hasBody && "hover:bg-fg-grey-50")}
      >
        {statusIcon}
        {(variant === "card" || icon) && <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-fg-grey-100 text-fg-grey-700">{icon ?? <SettingsBoldDuotone size={12} />}</span>}
        <span className={cn("shrink-0 text-fg-black", title || !isIdentifier(name) ? "font-medium" : "font-mono")}>{title ?? name}</span>
        {summary && <span className="min-w-0 flex-1 truncate text-fg-grey-700">{summary}</span>}
        {!summary && <span className="flex-1" />}
        {trailing && <span className={cn("shrink-0 tabular-nums text-xs", status === "error" ? "text-fg-red" : asking ? "text-fg-yellow-800" : "text-fg-grey-500")}>{trailing}</span>}
        {hasBody && <AltArrowDownLinear size={12} color="var(--fg-grey-500)" className={cn("shrink-0 transition-transform", open && "rotate-180")} />}
      </button>
      {asking && (
        <div className={cn("flex flex-col gap-2 border-t border-fg-grey-100", small ? "px-2.5 py-2" : "px-3 py-2.5")}>
          {approvalReason && <p className="text-[13px] leading-5 text-fg-grey-900">{approvalReason}</p>}
          {args !== undefined && !open && <code className="block truncate rounded-md bg-fg-grey-50 px-2 py-1 font-mono text-[11px] text-fg-grey-900">{pretty(args).replace(/\s+/g, " ")}</code>}
          {onApprove || onDeny ? (
            <div className="flex gap-2">
              {onApprove && <Button size="sm" onClick={onApprove}>{pick(locale, "允许", "Allow")}</Button>}
              {onDeny && <Button size="sm" variant="tertiary" color="grey" onClick={onDeny}>{pick(locale, "拒绝", "Deny")}</Button>}
            </div>
          ) : <p role="status" className="text-xs text-fg-grey-700">{pick(locale, "等待确认", "Waiting for approval")}</p>}
        </div>
      )}
      {open && hasBody && (
        <div className={cn("flex flex-col gap-2", variant === "card" ? cn("border-t border-fg-grey-100", small ? "px-2.5 py-2" : "px-3 py-2.5") : "pb-1.5 pl-7 pr-1.5")}>
          {args !== undefined && <Payload label={pick(locale, "参数", "Arguments")} value={pretty(args)} locale={locale} />}
          {result !== undefined && <Payload label={pick(locale, "结果", "Result")} value={pretty(result)} locale={locale} />}
          {result === undefined && running && <p className="text-xs text-fg-grey-500">{pick(locale, "等待结果…", "Waiting for result…")}</p>}
          {error && <Payload label={pick(locale, "错误", "Error")} value={error} locale={locale} tone="error" />}
          {status === "error" && onRetry && <Button size="sm" variant="tertiary" color="grey" iconLeft={<RefreshLinear size={14} />} onClick={onRetry} className="self-start">{pick(locale, "重试", "Retry")}</Button>}
        </div>
      )}
    </div>
  );
}

export type ToolCallGroupProps = {
  children: ReactNode;
  /** e.g. "调用了 3 个工具"; defaults from `count`. */
  label?: ReactNode;
  count?: number;
  status?: "running" | "success" | "error";
  /** Uncontrolled default; the group opens itself while running or after an error. */
  defaultOpen?: boolean;
  locale?: AgentLocale;
  className?: string;
};

/** Several tool calls of one turn behind one line, so the answer is not buried under cards. */
export function ToolCallGroup({ children, label, count, status = "success", defaultOpen, locale = "zh", className }: ToolCallGroupProps) {
  // A toggle holds until the status changes; then the group follows the status again.
  const [toggled, setToggled] = useState<{ status: string; open: boolean }>();
  const open = toggled?.status === status ? toggled.open : defaultOpen ?? status !== "success";
  const text = label ?? (count !== undefined
    ? status === "running" ? pick(locale, `正在调用工具 · 已 ${count} 次`, `Calling tools · ${count} so far`) : pick(locale, `调用了 ${count} 次工具`, `Called ${count} tools`)
    : pick(locale, "工具调用", "Tool calls"));
  return (
    <div data-tool-group={status} className={cn("flex min-w-0 flex-col gap-1.5 tracking-fg", className)}>
      <button type="button" aria-expanded={open} onClick={() => setToggled({ status, open: !open })} className="-ml-1.5 flex w-fit items-center gap-1.5 rounded-lg px-1.5 py-1 text-[13px] text-fg-grey-700 hover:bg-fg-grey-100 hover:text-fg-black">
        {status === "running" ? <span aria-hidden="true" className="size-3 animate-spin rounded-full border-[1.5px] border-fg-grey-300 border-t-accent" />
          : status === "error" ? <DangerTriangleLinear size={14} color="var(--fg-red)" />
            : <SettingsBoldDuotone size={14} />}
        <span className={cn("font-medium", status === "running" && "forge-text-shimmer")}>{text}</span>
        <AltArrowDownLinear size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="flex flex-col gap-0.5">{children}</div>}
    </div>
  );
}
