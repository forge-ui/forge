"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircleLinear, CloseCircleLinear, CopyLinear } from "../../icons";
import { cn } from "../../lib/utils";

// Read-only building blocks for detail pages and tables: key–value lists,
// timelines, tags, keyboard hints, separators and copy buttons.

// ── Descriptions ────────────────────────────────────────────

export interface DescriptionsItem {
  label: ReactNode;
  value: ReactNode;
  /** Columns this item spans (desktop). */
  span?: number;
}

export interface DescriptionsProps {
  items: DescriptionsItem[];
  title?: ReactNode;
  /** Actions on the right of the title, e.g. an "编辑" button. */
  extra?: ReactNode;
  /** Columns on wide screens; collapses to one column on phones. */
  columns?: 1 | 2 | 3 | 4;
  /** `bordered` draws a table-like grid with shaded labels. */
  variant?: "plain" | "bordered";
  /** `horizontal` puts the label beside the value. */
  layout?: "vertical" | "horizontal";
  className?: string;
}

const columnClass: Record<NonNullable<DescriptionsProps["columns"]>, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/** Key–value details of one record, e.g. an order or a member profile. */
export function Descriptions({ items, title, extra, columns = 3, variant = "plain", layout = "vertical", className }: DescriptionsProps) {
  const bordered = variant === "bordered";
  return (
    <section className={cn("flex w-full flex-col gap-4 tracking-fg", className)}>
      {(title || extra) && (
        <div className="flex items-center justify-between gap-4">
          {title && <h3 className="text-base font-semibold leading-6 text-fg-black">{title}</h3>}
          {extra && <div className="flex shrink-0 items-center gap-2">{extra}</div>}
        </div>
      )}
      <dl className={cn("grid grid-cols-1", columnClass[columns], bordered ? "overflow-hidden rounded-2xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200" : "gap-x-8 gap-y-5")}>
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex min-w-0",
              layout === "horizontal" ? "flex-row gap-4" : "flex-col gap-1",
              bordered && "border-b border-r border-fg-grey-200 -mb-px -mr-px",
            )}
            style={item.span ? { gridColumn: `span ${Math.min(item.span, columns)} / span ${Math.min(item.span, columns)}` } : undefined}
          >
            <dt className={cn("shrink-0 text-sm leading-5 text-fg-grey-700", layout === "horizontal" && "w-28", bordered && "bg-fg-grey-50 px-4 py-3", bordered && layout === "vertical" && "pb-1")}>{item.label}</dt>
            <dd className={cn("m-0 min-w-0 break-words text-sm font-medium leading-5 text-fg-black", bordered && "px-4 py-3", bordered && layout === "vertical" && "pt-1")}>{item.value ?? "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// ── Timeline ────────────────────────────────────────────────

export type TimelineTone = "default" | "accent" | "success" | "warning" | "error";

export interface TimelineItem {
  title: ReactNode;
  description?: ReactNode;
  /** Time or date label. */
  time?: ReactNode;
  tone?: TimelineTone;
  /** Replaces the dot, e.g. an icon or avatar. */
  icon?: ReactNode;
}

const timelineDot: Record<TimelineTone, string> = {
  default: "bg-fg-grey-300",
  accent: "bg-accent",
  success: "bg-fg-green-500",
  warning: "bg-fg-yellow",
  error: "bg-fg-red",
};

/** Events in order: approval history, order status, audit logs. */
export function Timeline({ items, pending, className }: { items: TimelineItem[]; /** A last, still-open step such as "等待审批". */ pending?: ReactNode; className?: string }) {
  const rows: (TimelineItem & { pending?: boolean })[] = pending ? [...items, { title: pending, pending: true }] : items;
  return (
    <ol className={cn("flex w-full flex-col tracking-fg", className)}>
      {rows.map((item, index) => {
        const last = index === rows.length - 1;
        const isPending = Boolean(item.pending);
        return (
          <li key={index} className="relative flex gap-3 pb-6 last:pb-0">
            {!last && <span aria-hidden className="absolute left-[11px] top-6 bottom-0 w-px bg-fg-grey-200" />}
            <span aria-hidden className="relative flex size-6 shrink-0 items-center justify-center">
              {item.icon ?? (
                <span className={cn("size-2.5 rounded-full ring-4 ring-background", isPending ? "border-2 border-fg-grey-300 bg-background" : timelineDot[item.tone ?? "default"])} />
              )}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <span className={cn("text-sm font-medium leading-5", isPending ? "text-fg-grey-700" : "text-fg-black")}>{item.title}</span>
                {item.time && <span className="text-xs leading-4 text-fg-grey-500 tabular-nums">{item.time}</span>}
              </div>
              {item.description && <div className="text-sm leading-5 text-fg-grey-700">{item.description}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// ── Tag ─────────────────────────────────────────────────────

export type TagColor = "grey" | "blue" | "green" | "yellow" | "red" | "violet";

const tagColors: Record<TagColor, string> = {
  grey: "bg-fg-grey-100 text-fg-grey-900",
  blue: "bg-fg-blue-50 text-fg-blue-600",
  green: "bg-fg-green-50 text-fg-green-700",
  yellow: "bg-fg-yellow-50 text-fg-yellow-700",
  red: "bg-fg-red-50 text-fg-red-600",
  violet: "bg-fg-violet-50 text-fg-violet",
};

export interface TagProps {
  children: ReactNode;
  color?: TagColor;
  icon?: ReactNode;
  /** Shows a remove button, e.g. for active filters or selected values. */
  onRemove?: () => void;
  removeLabel?: string;
  size?: "sm" | "md";
  className?: string;
}

/** Compact label for categories, keywords and active filters. Use StatusBadge for record status. */
export function Tag({ children, color = "grey", icon, onRemove, removeLabel, size = "md", className }: TagProps) {
  return (
    <span className={cn("inline-flex max-w-full items-center gap-1 rounded-lg font-medium tracking-fg", size === "sm" ? "h-6 px-2 text-xs" : "h-7 px-2.5 text-xs", tagColors[color], className)}>
      {icon && <span aria-hidden className="flex shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel ?? `移除 ${typeof children === "string" ? children : ""}`.trim()}
          onClick={onRemove}
          className="-mr-1 flex shrink-0 rounded-full opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-fg-blue cursor-pointer"
        >
          <CloseCircleLinear size={14} />
        </button>
      )}
    </span>
  );
}

// ── Kbd ─────────────────────────────────────────────────────

/** Keyboard key or shortcut, e.g. `<Kbd keys={["⌘", "K"]} />`. */
export function Kbd({ keys, children, className }: { keys?: string[]; children?: ReactNode; className?: string }) {
  const parts = keys ?? [children];
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {parts.map((part, index) => (
        <kbd key={index} className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-b-2 border-fg-grey-200 bg-background px-1.5 font-sans text-xs font-medium text-fg-grey-700">
          {part}
        </kbd>
      ))}
    </span>
  );
}

// ── Separator ───────────────────────────────────────────────

/** Divides content. With `label` it becomes a centered section break ("或", "更早"). */
export function Separator({ orientation = "horizontal", label, className }: { orientation?: "horizontal" | "vertical"; label?: ReactNode; className?: string }) {
  if (orientation === "vertical") {
    return <SeparatorPrimitive orientation="vertical" className={cn("mx-1 w-px self-stretch bg-fg-grey-200", className)} />;
  }
  if (!label) return <SeparatorPrimitive className={cn("h-px w-full bg-fg-grey-200", className)} />;
  return (
    <div className={cn("flex w-full items-center gap-3", className)}>
      <SeparatorPrimitive className="h-px flex-1 bg-fg-grey-200" />
      <span className="shrink-0 text-xs font-medium tracking-fg text-fg-grey-500">{label}</span>
      <SeparatorPrimitive className="h-px flex-1 bg-fg-grey-200" />
    </div>
  );
}

// ── CopyButton ──────────────────────────────────────────────

export interface CopyButtonProps {
  value: string;
  /** Visible text; without it the button is icon-only. */
  label?: string;
  copiedLabel?: string;
  /** Accessible name for the icon-only button. */
  ariaLabel?: string;
  onCopy?: (value: string) => void;
  className?: string;
}

/** Copies an ID, key or link and confirms for a moment. */
export function CopyButton({ value, label, copiedLabel = "已复制", ariaLabel = "复制", onCopy, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); fall back to a hidden selection.
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copiedByFallback = typeof document.execCommand === "function" && document.execCommand("copy");
      field.remove();
      if (!copiedByFallback) return;
    }
    setCopied(true);
    onCopy?.(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label ? undefined : copied ? copiedLabel : ariaLabel}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg text-sm font-medium tracking-fg transition-colors focus-visible:outline-2 focus-visible:outline-fg-blue cursor-pointer",
        label ? "h-8 px-2.5" : "size-8 justify-center",
        copied ? "text-fg-green-500" : "text-fg-grey-700 hover:bg-fg-grey-100 hover:text-fg-black",
        className,
      )}
    >
      <span aria-hidden className="flex">{copied ? <CheckCircleLinear size={16} /> : <CopyLinear size={16} />}</span>
      {label && <span>{copied ? copiedLabel : label}</span>}
      <span role="status" className="sr-only">{copied ? copiedLabel : ""}</span>
    </button>
  );
}
