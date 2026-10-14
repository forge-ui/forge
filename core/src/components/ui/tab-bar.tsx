"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import type { MotionPreference } from "../../lib/motion";
import { useMovingIndicator, useReducedMotion } from "../../internal/motion";

import { cn } from "../../lib/utils";

// ============================================================
// TabBar - 下划线标签栏
// color: purple, blue, black
// ============================================================

const tabActiveColors = {
  purple: "text-fg-violet",
  blue: "text-fg-blue",
  black: "text-fg-black",
} as const;

const tabBorderColors = {
  purple: "bg-fg-violet",
  blue: "bg-fg-blue",
  black: "bg-fg-black",
} as const;

export type TabBarColor = keyof typeof tabActiveColors;
// surface: inline = 纯 tab 栏（默认）；page = 整页 tab shell，白底 + 内边距 + 底部分隔线
export type TabBarSurface = "inline" | "page";

export interface TabItem {
  label: string;
  active?: boolean;
  badge?: number;
  icon?: ReactNode;
  /** Optional association with the matching TabsContent panel. */
  id?: string;
  controls?: string;
}

export function TabBar({
  tabs,
  color = "purple",
  surface = "inline",
  appearance = "underline",
  progress,
  onChange,
  className,
  motion = "auto",
  ariaLabel = "标签页",
}: {
  tabs: TabItem[];
  color?: TabBarColor;
  surface?: TabBarSurface;
  appearance?: "underline" | "dock";
  /** Fractional panel index for a scroll-linked indicator. */
  progress?: number;
  onChange?: (index: number) => void;
  className?: string;
  motion?: MotionPreference;
  ariaLabel?: string;
}) {
  const isPage = surface === "page";
  const reduced = useReducedMotion(motion);
  const activeIndex = tabs.findIndex((tab) => tab.active);
  const rootRef = useRef<HTMLDivElement>(null);
  const indicator = useMovingIndicator(rootRef, "[aria-selected='true']", activeIndex);
  useLayoutEffect(() => {
    if (progress === undefined || !rootRef.current) return;
    const layer = rootRef.current.querySelector<HTMLElement>(".forge-tab-indicator");
    if (!layer) return;
    const buttons = [...rootRef.current.querySelectorAll<HTMLElement>("[role=tab]")];
    const amount = Math.min(Math.max(0, progress), Math.max(0, buttons.length - 1));
    const first = buttons[Math.floor(amount)], last = buttons[Math.ceil(amount)];
    if (!first || !last) return;
    const t = amount % 1;
    layer.style.setProperty("--forge-indicator-x", `${first.offsetLeft + (last.offsetLeft - first.offsetLeft) * t}px`);
    layer.style.setProperty("--forge-indicator-width", `${first.offsetWidth + (last.offsetWidth - first.offsetWidth) * t}px`);
  }, [progress, indicator]);
  return (
    <div
      ref={rootRef}
      data-motion={reduced ? "none" : motion}
      data-tab-appearance={appearance}
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "relative isolate border-b border-fg-grey-200",
        appearance === "dock" && "forge-tab-dock rounded-2xl border border-fg-grey-200 bg-white p-2",
        isPage
          ? "flex w-full bg-white px-6 pt-4"
          : "inline-flex",
        className,
      )}
    >
      <span aria-hidden ref={indicator} className={cn("forge-moving-indicator forge-tab-indicator", tabBorderColors[color])} style={{ transition: reduced || progress !== undefined ? "none" : "translate 420ms cubic-bezier(.2,.8,.2,1), width 420ms cubic-bezier(.2,.8,.2,1)" }} />
      {tabs.map((tab, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          id={tab.id}
          aria-controls={tab.controls}
          aria-selected={!!tab.active}
          tabIndex={tab.active || (activeIndex === -1 && index === 0) ? 0 : -1}
          onClick={() => onChange?.(index)}
          onKeyDown={(event) => {
            const lastIndex = tabs.length - 1;
            const nextIndex = event.key === "ArrowRight"
              ? (index + 1) % tabs.length
              : event.key === "ArrowLeft"
                ? (index - 1 + tabs.length) % tabs.length
                : event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? lastIndex
                    : -1;
            if (nextIndex < 0) return;
            event.preventDefault();
            onChange?.(nextIndex);
            event.currentTarget.parentElement?.querySelectorAll<HTMLElement>("[role='tab']")[nextIndex]?.focus();
          }}
          className={cn(
            "relative px-4 py-3 text-sm cursor-pointer inline-flex items-center gap-1.5",
            tab.active
              ? `${tabActiveColors[color]} font-bold`
              : "text-fg-grey-700 font-semibold"
          )}
        >
          {tab.icon && <span aria-hidden className="forge-tab-icon flex h-5 w-5 items-center justify-center">{tab.icon}</span>}
          {tab.label}
          {tab.badge !== undefined && (
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-full text-xs font-semibold",
                tab.active
                  ? `${tabBorderColors[color]} text-white`
                  : "bg-fg-grey-200 text-fg-grey-700"
              )}
            >
              {tab.badge}
            </span>
          )}

        </button>
      ))}
    </div>
  );
}
