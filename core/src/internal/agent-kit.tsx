"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";
import type { MotionPreference } from "../lib/motion";
import { useReducedMotion } from "./motion";

/** Shared pieces of the agent kit, so every card reads like SurfaceCard, StatusBadge and ApprovalCard. */

export type AgentTone = "blue" | "green" | "yellow" | "red" | "grey" | "purple";

// Same soft palette as StatusBadge, inline so it fits a row without StatusBadge's 40px wrapper.
const SOFT: Record<AgentTone, string> = {
  blue: "bg-fg-blue-50 outline-fg-blue-200 text-fg-blue-500",
  green: "bg-fg-green-50 outline-fg-green-200 text-fg-green-500",
  yellow: "bg-fg-yellow-50 outline-fg-yellow-200 text-fg-yellow-700",
  red: "bg-fg-red-50 outline-fg-red-200 text-fg-red",
  grey: "bg-fg-grey-50 outline-fg-grey-200 text-fg-grey-700",
  purple: "bg-fg-violet-50 outline-fg-violet-200 text-fg-violet",
};

export function SoftBadge({ tone = "grey", children, className }: { tone?: AgentTone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium leading-4 tracking-fg outline outline-1 outline-offset-[-1px]", SOFT[tone], className)}>
      {children}
    </span>
  );
}

/** The card every agent component sits in: SurfaceCard's radius, outline, header and footer bands. */
export function AgentCard({
  title,
  subtitle,
  action,
  footer,
  children,
  size = "md",
  tone,
  className,
  bodyClassName,
  ...rest
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  size?: "md" | "sm";
  /** Outline colour for cards that need attention. */
  tone?: "attention" | "danger";
  className?: string;
  /** Replaces the body's vertical padding. */
  bodyClassName?: string;
} & Omit<HTMLAttributes<HTMLElement>, "title">) {
  const pad = size === "sm" ? "px-4" : "px-5";
  return (
    <section
      {...rest}
      data-ask-ai-response="compact"
      className={cn(
        "forge-surface-card flex min-w-0 flex-col rounded-card bg-background tracking-fg outline outline-1 outline-offset-[-1px]",
        tone === "danger" ? "outline-fg-red-200" : tone === "attention" ? "outline-fg-yellow-300" : "outline-fg-grey-200",
        className,
      )}
    >
      {(title || subtitle || action) && (
        <div className={cn("flex items-start justify-between gap-3 border-b border-fg-grey-200", pad, size === "sm" ? "py-3" : "py-4")}>
          <div className="flex min-w-0 flex-col gap-1">
            {title && <h3 className="text-sm font-medium leading-5 text-fg-black">{title}</h3>}
            {subtitle && <p className="text-xs font-medium leading-4.5 text-fg-grey-700">{subtitle}</p>}
          </div>
          {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
        </div>
      )}
      {children !== undefined && children !== null && children !== false && <div className={cn(pad, bodyClassName ?? (size === "sm" ? "py-3" : "py-4"))}>{children}</div>}
      {footer && <div className={cn("border-t border-fg-grey-200", pad, size === "sm" ? "py-3" : "py-4")}>{footer}</div>}
    </section>
  );
}

/** Footer row: secondary info on the left, actions on the right. */
export function CardActions({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0 text-xs text-fg-grey-500">{aside}</div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

/**
 * Height-and-fade disclosure used by every folding part of the kit (Base UI Collapsible).
 * Put the toggle inside as `<DisclosureTrigger>` so it gets aria-expanded/aria-controls;
 * `Collapse` alone is a panel driven by `open`.
 */
export function Disclosure({ open, onOpenChange, disabled, className, children, ...attributes }: { open: boolean; onOpenChange?: (open: boolean) => void; disabled?: boolean; className?: string; children: ReactNode } & Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">) {
  return <CollapsiblePrimitive.Root {...attributes} open={open} onOpenChange={next => onOpenChange?.(next)} disabled={disabled} className={className}>{children}</CollapsiblePrimitive.Root>;
}

export const DisclosureTrigger = CollapsiblePrimitive.Trigger;

export function DisclosurePanel({ motion = "auto", children, className }: { motion?: MotionPreference; children: ReactNode; className?: string }) {
  const reduced = useReducedMotion(motion);
  return (
    <CollapsiblePrimitive.Panel data-motion={reduced ? "none" : "auto"} className={cn("forge-disclosure-panel h-(--collapsible-panel-height) overflow-hidden", className)}>
      {children}
    </CollapsiblePrimitive.Panel>
  );
}

export function Collapse({ open, motion = "auto", children, className }: { open: boolean; motion?: MotionPreference; children: ReactNode; className?: string }) {
  return <Disclosure open={open}><DisclosurePanel motion={motion} className={className}>{children}</DisclosurePanel></Disclosure>;
}

export function Spinner({ size = 14, className }: { size?: number; className?: string }) {
  return <span aria-hidden="true" className={cn("inline-block shrink-0 animate-spin rounded-full border-2 border-fg-blue-100 border-t-accent", className)} style={{ width: size, height: size }} />;
}

/** Radio or checkbox mark, as in ApprovalCard. */
export function ChoiceMark({ multiple, on }: { multiple?: boolean; on: boolean }) {
  return (
    <span className={cn("flex size-4 shrink-0 items-center justify-center outline outline-1 outline-offset-[-1px] transition-colors", multiple ? "rounded-md" : "rounded-full", on ? "bg-accent outline-accent" : "bg-background outline-fg-grey-300")}>
      {on && <span className={cn("size-1.5 bg-white", !multiple && "rounded-full")} />}
    </span>
  );
}

/** Small accent button used inside agent cards (same as ApprovalCard's submit). */
export const accentButton = "inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-3 py-2.5 text-xs font-medium leading-4 tracking-fg text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

/** Text input in the TextField look (getFieldClasses: rounded-xl, grey outline, accent on focus). */
export const fieldInput = "w-full min-w-0 rounded-xl bg-background px-3 py-2.5 text-sm leading-5 tracking-fg text-fg-black outline outline-1 outline-offset-[-1px] outline-fg-grey-200 transition-all placeholder:text-fg-grey-700 focus:outline-accent disabled:cursor-not-allowed disabled:bg-fg-grey-200";

/** Small square icon action, as used in tool rows and lists. */
export const iconAction = "flex size-7 shrink-0 items-center justify-center rounded-lg text-fg-grey-700 transition-colors hover:bg-fg-grey-100 hover:text-fg-black disabled:pointer-events-none disabled:opacity-40";

/** Before → after rows, shared by Approval and ChangeLedger. */
export function FieldChanges({ fields, empty, className }: { fields: { label: string; before?: string; after: string }[]; empty: string; className?: string }) {
  return (
    <dl className={cn("flex flex-col gap-1.5 rounded-xl bg-fg-grey-50 px-3 py-2.5 text-sm", className)}>
      {fields.map(field => (
        <div key={field.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
          <dt className="text-xs font-medium text-fg-grey-700">{field.label}</dt>
          <dd className="min-w-0 break-words text-right">
            {field.before !== undefined && field.before !== field.after && <><span className="text-fg-grey-500 line-through">{field.before || empty}</span><span className="px-1.5 text-fg-grey-500">→</span></>}
            <span className="font-medium text-fg-black">{field.after || empty}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Second-level action next to accentButton, following the theme accent. */
export const softAccentButton = "inline-flex items-center justify-center gap-1.5 rounded-full bg-accent-soft px-3 py-2.5 text-xs font-medium leading-4 tracking-fg text-accent transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60";

/** Compact outlined pill for row-level actions (undo, rewind, retry). */
export const rowAction = "inline-flex h-7 shrink-0 items-center gap-1 rounded-full bg-background px-2.5 text-xs font-medium tracking-fg text-fg-black outline outline-1 outline-offset-[-1px] outline-fg-grey-200 transition-colors hover:bg-fg-grey-100 disabled:opacity-50";
