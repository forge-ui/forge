"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CheckCircleLinear, ClockCircleLinear, CloseCircleLinear } from "../../../icons";
import { AgentCard, CardActions, FieldChanges, SoftBadge, accentButton, fieldInput, softAccentButton, type AgentTone } from "../../../internal/agent-kit";
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

const RISK: Record<ApprovalRisk, { zh: string; en: string; tone: AgentTone }> = {
  low: { zh: "低风险", en: "Low risk", tone: "green" },
  medium: { zh: "需留意", en: "Review", tone: "yellow" },
  high: { zh: "高风险", en: "High risk", tone: "red" },
};

const SCOPE_LABEL: Record<ApprovalScope, { zh: string; en: string }> = {
  once: { zh: "允许一次", en: "Allow once" },
  session: { zh: "本次对话都允许", en: "Allow for this chat" },
  always: { zh: "总是允许", en: "Always allow" },
};

/**
 * The agent asks before it acts, in a SurfaceCard: what changes, how risky it is, approve or deny,
 * optionally with standing permission and a lapse timer. Resolved, it shows the outcome.
 */
export function Approval({ title, description, requester, risk, fields = [], preview, scopes, state = "pending", result, onApprove, onDeny, askDenyReason = false, expiresIn, onExpire, approveLabel, denyLabel, locale = "zh", size = "md", className }: ApprovalProps) {
  const [countdown, setCountdown] = useState({ from: expiresIn, left: expiresIn });
  const left = countdown.from === expiresIn ? countdown.left : expiresIn;
  const [paused, setPaused] = useState(false);
  const [denying, setDenying] = useState(false);
  const [reason, setReason] = useState("");
  const pending = state === "pending";

  useEffect(() => {
    if (!pending || paused || left === undefined) return;
    if (left <= 0) { onExpire?.(); return; }
    const timer = setTimeout(() => setCountdown({ from: expiresIn, left: left - 1 }), 1000);
    return () => clearTimeout(timer);
  }, [pending, paused, left, expiresIn, onExpire]);

  if (state === "approved" || state === "denied" || state === "expired") {
    const word = state === "approved" ? pick(locale, "已允许", "Approved") : state === "denied" ? pick(locale, "已拒绝", "Denied") : pick(locale, "已过期", "Expired");
    return (
      <AgentCard size={size} className={cn("forge-fade-up", className)} data-state={state}>
        <div role="status" className="flex items-start gap-2 text-sm">
          {state === "approved" ? <CheckCircleLinear size={18} color="var(--fg-green-500)" className="shrink-0" /> : state === "denied" ? <CloseCircleLinear size={18} color="var(--fg-grey-500)" className="shrink-0" /> : <ClockCircleLinear size={18} color="var(--fg-grey-500)" className="shrink-0" />}
          <span className="flex min-w-0 flex-col gap-0.5">
            <span><span className={cn("font-medium", state === "approved" ? "text-fg-green-500" : "text-fg-grey-700")}>{word}</span><span className="text-fg-grey-500"> · </span><span className="text-fg-black">{title}</span></span>
            {result && <span className="text-xs text-fg-grey-700">{result}</span>}
          </span>
        </div>
      </AgentCard>
    );
  }

  const offered = scopes?.length ? scopes : (["once"] as ApprovalScope[]);
  const timer = left !== undefined && pending ? (paused ? pick(locale, "已暂停计时", "Timer paused") : pick(locale, `${left} 秒后过期`, `Expires in ${left}s`)) : undefined;
  return (
    <AgentCard
      size={size}
      tone={risk === "high" ? "danger" : undefined}
      className={className}
      role="group"
      aria-label={typeof title === "string" ? title : pick(locale, "需要确认", "Approval needed")}
      data-state={state}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      title={title}
      subtitle={requester ? <>{requester} {pick(locale, "请求执行", "is asking")}</> : undefined}
      action={risk && <SoftBadge tone={RISK[risk].tone}>{pick(locale, RISK[risk].zh, RISK[risk].en)}</SoftBadge>}
      footer={(onApprove || onDeny) && (denying ? (
        <form className="flex flex-col gap-2" onSubmit={event => { event.preventDefault(); onDeny?.(reason.trim() || undefined); }}>
          <input autoFocus value={reason} onChange={event => setReason(event.target.value)} placeholder={pick(locale, "告诉它为什么不行（可选）", "Tell it why (optional)")} aria-label={pick(locale, "拒绝原因", "Reason")} className={fieldInput} />
          <CardActions>
            <Button size="sm" variant="tertiary" color="grey" onClick={() => setDenying(false)}>{pick(locale, "返回", "Back")}</Button>
            <Button size="sm" color="red" type="submit">{denyLabel ?? pick(locale, "确认拒绝", "Deny")}</Button>
          </CardActions>
        </form>
      ) : (
        <CardActions aside={timer}>
          {onDeny && <Button size="sm" variant="tertiary" color="grey" disabled={state === "working"} onClick={() => (askDenyReason ? setDenying(true) : onDeny())}>{denyLabel ?? pick(locale, "拒绝", "Deny")}</Button>}
          {onApprove && [...offered].reverse().map((scope, index, list) => {
            const primary = index === list.length - 1;
            const text = primary && approveLabel ? approveLabel : offered.length === 1 ? approveLabel ?? pick(locale, "允许", "Allow") : pick(locale, SCOPE_LABEL[scope].zh, SCOPE_LABEL[scope].en);
            return primary
              ? <button key={scope} type="button" className={accentButton} disabled={state === "working"} onClick={() => onApprove(scope)}>{state === "working" ? pick(locale, "处理中…", "Working…") : text}</button>
              : <button key={scope} type="button" className={softAccentButton} disabled={state === "working"} onClick={() => onApprove(scope)}>{text}</button>;
          })}
        </CardActions>
      ))}
    >
      {(description || fields.length > 0 || preview) && (
        <div className="flex flex-col gap-3">
          {description && <div className="text-sm leading-6 text-fg-grey-700">{description}</div>}
          {fields.length > 0 && <FieldChanges fields={fields} empty={pick(locale, "空", "empty")} />}
          {preview}
        </div>
      )}
    </AgentCard>
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
    return <p data-state="cancelled" role="status" className="flex items-center gap-2 text-sm tracking-fg text-fg-grey-700"><CloseCircleLinear size={16} color="var(--fg-grey-500)" />{pick(locale, "已取消", "Cancelled")} · {title}</p>;
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

