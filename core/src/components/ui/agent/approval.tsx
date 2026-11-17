"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CheckCircleLinear, ClockCircleLinear, CloseCircleLinear, ShieldCheckBold } from "../../../icons";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { pick, type AgentLocale } from "./agent-utils";

export type ApprovalRisk = "low" | "medium" | "high";
export type ApprovalScope = "once" | "session" | "always";
export type ApprovalState = "pending" | "working" | "approved" | "denied" | "expired";
export type ApprovalField = { label: string; before?: string; after: string };

export type ApprovalProps = {
  /** What will happen, e.g. "把张三的角色改为管理员". */
  title: ReactNode;
  /** Why the agent wants it, or what else it affects. */
  description?: ReactNode;
  /** Who asks, e.g. the agent's name. */
  requester?: ReactNode;
  risk?: ApprovalRisk;
  /** Field changes, shown as before → after. */
  fields?: ApprovalField[];
  /** Any preview: a diff, a draft, a record. */
  preview?: ReactNode;
  /**
   * Offer standing permission, e.g. ["once", "session", "always"]. Without it there is one approve
   * button and `onApprove` receives "once".
   */
  scopes?: ApprovalScope[];
  state?: ApprovalState;
  /** Shown once approved, e.g. the saved record from the receipt. */
  result?: ReactNode;
  onApprove?: (scope: ApprovalScope) => void;
  onDeny?: (reason?: string) => void;
  /** Lets the user say why when denying; the reason goes back to the agent. */
  askDenyReason?: boolean;
  /** Seconds until the request lapses; pauses while the pointer is on the card. */
  expiresIn?: number;
  onExpire?: () => void;
  approveLabel?: string;
  denyLabel?: string;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};

const RISK: Record<ApprovalRisk, { zh: string; en: string; style: string }> = {
  low: { zh: "低风险", en: "Low risk", style: "bg-fg-green-50 text-fg-green-600" },
  medium: { zh: "需留意", en: "Medium risk", style: "bg-fg-yellow-50 text-fg-yellow-800" },
  high: { zh: "高风险", en: "High risk", style: "bg-fg-red-50 text-fg-red" },
};

const SCOPE_LABEL: Record<ApprovalScope, { zh: string; en: string }> = {
  once: { zh: "允许一次", en: "Allow once" },
  session: { zh: "本次对话都允许", en: "Allow for this chat" },
  always: { zh: "总是允许", en: "Always allow" },
};

/**
 * The agent asks before it acts: what changes, how risky it is, and approve or deny, optionally
 * with standing permission and a lapse timer. Resolved, it folds into one line.
 */
export function Approval({ title, description, requester, risk, fields = [], preview, scopes, state = "pending", result, onApprove, onDeny, askDenyReason = false, expiresIn, onExpire, approveLabel, denyLabel, locale = "zh", size = "md", className }: ApprovalProps) {
  const [countdown, setCountdown] = useState({ from: expiresIn, left: expiresIn });
  const left = countdown.from === expiresIn ? countdown.left : expiresIn;
  const [paused, setPaused] = useState(false);
  const [denying, setDenying] = useState(false);
  const [reason, setReason] = useState("");
  const small = size === "sm";
  const pending = state === "pending";

  useEffect(() => {
    if (!pending || paused || left === undefined) return;
    if (left <= 0) { onExpire?.(); return; }
    const timer = setTimeout(() => setCountdown({ from: expiresIn, left: left - 1 }), 1000);
    return () => clearTimeout(timer);
  }, [pending, paused, left, expiresIn, onExpire]);

  if (state === "approved" || state === "denied" || state === "expired") {
    const Icon = state === "approved" ? CheckCircleLinear : state === "denied" ? CloseCircleLinear : ClockCircleLinear;
    const word = state === "approved" ? pick(locale, "已允许", "Approved") : state === "denied" ? pick(locale, "已拒绝", "Denied") : pick(locale, "已过期", "Expired");
    return (
      <div data-state={state} className={cn("flex items-start gap-1.5 tracking-fg text-fg-grey-700", small ? "text-xs" : "text-[13px]", className)}>
        <Icon size={14} color={state === "approved" ? "var(--fg-green-500)" : "var(--fg-grey-500)"} className="mt-0.5 shrink-0" />
        <span className="min-w-0">{word} · <span className="text-fg-black">{title}</span>{result && <span className="block text-fg-grey-700">{result}</span>}</span>
      </div>
    );
  }

  const offered = scopes?.length ? scopes : (["once"] as ApprovalScope[]);
  return (
    <div
      role="group"
      aria-label={typeof title === "string" ? title : pick(locale, "需要确认", "Approval needed")}
      data-state={state}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      className={cn("flex flex-col gap-2.5 rounded-xl border bg-background tracking-fg", risk === "high" ? "border-fg-red-200" : "border-fg-grey-200", small ? "p-3" : "p-4", className)}
    >
      <div className="flex items-start gap-2">
        <ShieldCheckBold size={small ? 16 : 18} color={risk === "high" ? "var(--fg-red)" : "var(--accent)"} className="mt-0.5 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {requester && <span className="text-xs text-fg-grey-700">{requester} {pick(locale, "请求执行", "wants to")}</span>}
          <p className={cn("font-semibold text-fg-black", small ? "text-[13px]" : "text-sm")}>{title}</p>
        </div>
        {risk && <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", RISK[risk].style)}>{pick(locale, RISK[risk].zh, RISK[risk].en)}</span>}
      </div>
      {description && <div className={cn("leading-5 text-fg-grey-700", small ? "text-xs" : "text-[13px]")}>{description}</div>}
      {fields.length > 0 && (
        <dl className={cn("grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 rounded-lg bg-fg-grey-50 px-3 py-2", small ? "text-xs" : "text-[13px]")}>
          {fields.map(field => (
            <div key={field.label} className="contents">
              <dt className="text-fg-grey-700">{field.label}</dt>
              <dd className="min-w-0 break-words text-fg-black">
                {field.before !== undefined && field.before !== field.after && <><span className="text-fg-grey-500 line-through">{field.before || pick(locale, "空", "empty")}</span>{" → "}</>}
                {field.after || pick(locale, "空", "empty")}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {preview}
      {denying ? (
        <form className="flex flex-col gap-2" onSubmit={event => { event.preventDefault(); onDeny?.(reason.trim() || undefined); }}>
          <input
            autoFocus
            value={reason}
            onChange={event => setReason(event.target.value)}
            placeholder={pick(locale, "告诉它为什么不行（可选）", "Tell it why (optional)")}
            aria-label={pick(locale, "拒绝原因", "Reason")}
            className="rounded-lg border border-fg-grey-200 bg-background px-3 py-1.5 text-[13px] text-fg-black outline-none placeholder:text-fg-grey-500 focus:border-accent"
          />
          <div className="flex gap-2">
            <Button size="sm" color="red" type="submit">{denyLabel ?? pick(locale, "拒绝", "Deny")}</Button>
            <Button size="sm" variant="tertiary" color="grey" onClick={() => setDenying(false)}>{pick(locale, "返回", "Back")}</Button>
          </div>
        </form>
      ) : (onApprove || onDeny) && (
        <div className="flex flex-wrap items-center gap-2">
          {onApprove && offered.map((scope, index) => (
            <Button key={scope} size="sm" variant={index === 0 ? "primary" : "secondary"} loading={state === "working" && index === 0} disabled={state === "working"} onClick={() => onApprove(scope)}>
              {index === 0 && approveLabel ? approveLabel : offered.length === 1 ? approveLabel ?? pick(locale, "允许", "Allow") : pick(locale, SCOPE_LABEL[scope].zh, SCOPE_LABEL[scope].en)}
            </Button>
          ))}
          {onDeny && <Button size="sm" variant="tertiary" color="grey" disabled={state === "working"} onClick={() => (askDenyReason ? setDenying(true) : onDeny())}>{denyLabel ?? pick(locale, "拒绝", "Deny")}</Button>}
          {left !== undefined && pending && <span className="ml-auto tabular-nums text-[11px] text-fg-grey-500">{paused ? pick(locale, "已暂停", "Paused") : pick(locale, `${left} 秒后过期`, `Expires in ${left}s`)}</span>}
        </div>
      )}
    </div>
  );
}

/* ───────────────── ConfirmCard (Forge Agent / Ask AI harness proposals) ───────────────── */

export type ConfirmField = ApprovalField;

export type ConfirmCardProps = {
  title: string;
  fields?: ConfirmField[];
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  state?: "pending" | "working" | "done" | "cancelled";
  /** Shown once done, e.g. the saved record from the receipt. */
  result?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  locale?: AgentLocale;
};

/** A proposed change waiting for the user's confirmation. A shorthand for `Approval`. */
export function ConfirmCard({ title, fields = [], body, confirmLabel, cancelLabel, state = "pending", result, onConfirm, onCancel, locale = "zh" }: ConfirmCardProps) {
  if (state === "cancelled") {
    return <p data-state="cancelled" className="flex items-center gap-1.5 text-xs tracking-fg text-fg-grey-700"><CloseCircleLinear size={14} color="var(--fg-grey-500)" />{pick(locale, "已取消", "Cancelled")} · {title}</p>;
  }
  return (
    <Approval
      size="sm"
      locale={locale}
      title={title}
      description={body}
      fields={fields}
      state={state === "done" ? "approved" : state}
      result={result}
      approveLabel={confirmLabel ?? pick(locale, "确认", "Confirm")}
      denyLabel={cancelLabel ?? pick(locale, "取消", "Cancel")}
      onApprove={onConfirm && (() => onConfirm())}
      onDeny={onCancel && (() => onCancel())}
    />
  );
}
