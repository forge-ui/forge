"use client";

import { useState, type ReactNode } from "react";
import {
  CheckCircleLinear,
  CloseCircleLinear,
  DangerTriangleLinear,
  InboxBoldDuotone,
  InfoCircleLinear,
  ShieldKeyholeBoldDuotone,
  MagniferBoldDuotone,
  CheckCircleBoldDuotone,
  CloseCircleBoldDuotone,
  DangerCircleBoldDuotone,
  InfoCircleBoldDuotone,
} from "../../icons";
import { cn } from "../../lib/utils";

// Feedback for admin pages: inline alerts, loading (Spinner, Skeleton), empty lists and result pages.

export type AlertTone = "info" | "success" | "warning" | "error";

const alertTones: Record<AlertTone, { surface: string; icon: string; glyph: ReactNode }> = {
  info: { surface: "bg-fg-blue-50 outline-fg-blue-200", icon: "text-fg-blue", glyph: <InfoCircleLinear size={20} /> },
  success: { surface: "bg-fg-green-50 outline-fg-green-200", icon: "text-fg-green-500", glyph: <CheckCircleLinear size={20} /> },
  warning: { surface: "bg-fg-yellow-50 outline-fg-yellow-200", icon: "text-fg-yellow-700", glyph: <DangerTriangleLinear size={20} /> },
  error: { surface: "bg-fg-red-50 outline-fg-red-200", icon: "text-fg-red", glyph: <CloseCircleLinear size={20} /> },
};

export interface AlertProps {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  /** Replaces the tone icon; pass `null` to hide it. */
  icon?: ReactNode | null;
  /** Buttons or links shown on the right (or below on narrow screens). */
  action?: ReactNode;
  /** Shows a close button. The alert hides itself unless `onClose` is controlled by the host. */
  closable?: boolean;
  onClose?: () => void;
  closeLabel?: string;
  /** Full-width strip without rounding, for the top of a page or card. */
  banner?: boolean;
  className?: string;
}

/** Inline message about the page or a section: info, success, warning or error. */
export function Alert({ tone = "info", title, children, icon, action, closable = false, onClose, closeLabel = "关闭提示", banner = false, className }: AlertProps) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  const palette = alertTones[tone];
  const urgent = tone === "error" || tone === "warning";
  return (
    <div
      role={urgent ? "alert" : "status"}
      data-tone={tone}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3 outline outline-1 outline-offset-[-1px] tracking-fg",
        banner ? "rounded-none" : "rounded-2xl",
        palette.surface,
        className,
      )}
    >
      {icon !== null && <span aria-hidden className={cn("mt-0.5 flex shrink-0", palette.icon)}>{icon ?? palette.glyph}</span>}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {title && <p className="text-sm font-semibold leading-6 text-fg-black">{title}</p>}
          {children && <div className={cn("text-sm leading-6 text-fg-grey-900", !title && "mt-0")}>{children}</div>}
        </div>
        {action && <div className="flex shrink-0 flex-wrap items-center gap-2 pt-1 sm:pt-0">{action}</div>}
      </div>
      {closable && (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={() => { onClose?.(); if (!onClose) setHidden(true); }}
          className="mt-0.5 flex shrink-0 rounded-full text-fg-grey-700 transition-colors hover:text-fg-black focus-visible:outline-2 focus-visible:outline-fg-blue cursor-pointer"
        >
          <CloseCircleLinear size={20} />
        </button>
      )}
    </div>
  );
}

export type SpinnerSize = "sm" | "md" | "lg";
const spinnerSizes: Record<SpinnerSize, string> = { sm: "size-4 border-2", md: "size-6 border-[2.5px]", lg: "size-10 border-[3px]" };

/** Indeterminate loading indicator. Give it a `label` when nothing else on screen says what is loading. */
export function Spinner({ size = "md", label, className }: { size?: SpinnerSize; label?: string; className?: string }) {
  return (
    <span role={label ? "status" : undefined} className={cn("inline-flex items-center gap-2 text-sm text-fg-grey-700", className)}>
      <span aria-hidden className={cn("forge-spinner inline-block shrink-0 rounded-full border-fg-grey-200 border-t-accent", spinnerSizes[size])} />
      {label && <span>{label}</span>}
    </span>
  );
}

/** Covers a section while it reloads, keeping the previous content visible underneath. */
export function LoadingOverlay({ loading, label, children, className }: { loading: boolean; label?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)} aria-busy={loading || undefined}>
      {children}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-background/70 backdrop-blur-[1px]">
          <Spinner size="lg" label={label} />
        </div>
      )}
    </div>
  );
}

export interface SkeletonProps {
  /** `text` lines, a `circle` (avatar) or a `rect` block. */
  shape?: "text" | "circle" | "rect";
  /** Number of text lines; the last one is shorter. */
  lines?: number;
  width?: number | string;
  height?: number | string;
  className?: string;
}

/** Placeholder shapes shown while content loads. */
export function Skeleton({ shape = "text", lines = 1, width, height, className }: SkeletonProps) {
  const base = "forge-skeleton block bg-fg-grey-100";
  if (shape === "circle") {
    const size = width ?? height ?? 40;
    return <span aria-hidden className={cn(base, "shrink-0 rounded-full", className)} style={{ width: size, height: size }} />;
  }
  if (shape === "rect") return <span aria-hidden className={cn(base, "rounded-2xl", className)} style={{ width: width ?? "100%", height: height ?? 120 }} />;
  return (
    <span aria-hidden className={cn("flex w-full flex-col gap-2", className)} style={{ width }}>
      {Array.from({ length: Math.max(1, lines) }, (_, index) => (
        <span key={index} className={cn(base, "h-4 rounded-md")} style={{ width: lines > 1 && index === lines - 1 ? "60%" : "100%", height }} />
      ))}
    </span>
  );
}

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Primary next step, e.g. a "新建" button. */
  action?: ReactNode;
  /** `compact` for inside tables and cards. */
  size?: "compact" | "default";
  className?: string;
}

/** Nothing to show yet: says why and offers the next step. */
export function EmptyState({ title, description, icon, action, size = "default", className }: EmptyStateProps) {
  const compact = size === "compact";
  return (
    <div className={cn("flex w-full flex-col items-center justify-center text-center tracking-fg", compact ? "gap-2 py-8" : "gap-3 py-16", className)}>
      <span aria-hidden className={cn("flex items-center justify-center rounded-full bg-fg-grey-100 text-fg-grey-500", compact ? "size-12" : "size-16")}>
        {icon ?? <InboxBoldDuotone size={compact ? 24 : 32} />}
      </span>
      <p className={cn("font-semibold text-fg-black", compact ? "text-sm leading-5" : "text-base leading-6")}>{title}</p>
      {description && <p className="max-w-sm text-sm leading-5 text-fg-grey-700">{description}</p>}
      {action && <div className="mt-2 flex flex-wrap items-center justify-center gap-3">{action}</div>}
    </div>
  );
}

export type ResultStatus = "success" | "error" | "warning" | "info" | "403" | "404";

const resultStatus: Record<ResultStatus, { tint: string; glyph: ReactNode }> = {
  success: { tint: "bg-fg-green-50 text-fg-green-500", glyph: <CheckCircleBoldDuotone size={40} /> },
  error: { tint: "bg-fg-red-50 text-fg-red", glyph: <CloseCircleBoldDuotone size={40} /> },
  warning: { tint: "bg-fg-yellow-50 text-fg-yellow-700", glyph: <DangerCircleBoldDuotone size={40} /> },
  info: { tint: "bg-fg-blue-50 text-fg-blue", glyph: <InfoCircleBoldDuotone size={40} /> },
  "403": { tint: "bg-fg-grey-100 text-fg-grey-700", glyph: <ShieldKeyholeBoldDuotone size={40} /> },
  "404": { tint: "bg-fg-grey-100 text-fg-grey-700", glyph: <MagniferBoldDuotone size={40} /> },
};

export interface ResultProps {
  status: ResultStatus;
  title: ReactNode;
  description?: ReactNode;
  /** Buttons, e.g. "返回列表" and "查看详情". */
  actions?: ReactNode;
  /** Extra detail below the actions, such as an error list. */
  children?: ReactNode;
  className?: string;
}

/** Outcome of a flow or a whole page: submitted, failed, no permission, not found. */
export function Result({ status, title, description, actions, children, className }: ResultProps) {
  const visual = resultStatus[status];
  return (
    <section className={cn("flex w-full flex-col items-center gap-4 px-6 py-16 text-center tracking-fg", className)}>
      <span aria-hidden className={cn("flex size-20 items-center justify-center rounded-full", visual.tint)}>{visual.glyph}</span>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold leading-8 text-fg-black">{title}</h2>
        {description && <p className="max-w-md text-sm leading-6 text-fg-grey-700">{description}</p>}
      </div>
      {actions && <div className="mt-2 flex flex-wrap items-center justify-center gap-3">{actions}</div>}
      {children && <div className="mt-4 w-full max-w-xl rounded-2xl bg-fg-grey-50 p-5 text-left text-sm leading-6 text-fg-grey-900">{children}</div>}
    </section>
  );
}
