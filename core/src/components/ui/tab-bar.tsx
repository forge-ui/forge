"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
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
  color = "blue",
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
    <TabsPrimitive.Root
      value={activeIndex === -1 ? null : activeIndex}
      onValueChange={(next) => { if (typeof next === "number") onChange?.(next); }}
      render={<div />}
      className="contents"
    >
      <TabsPrimitive.List
        ref={rootRef}
        activateOnFocus
        loopFocus
        data-motion={reduced ? "none" : motion}
        data-tab-appearance={appearance}
        aria-label={ariaLabel}
        className={cn(
          "relative isolate border-b border-fg-grey-200",
          appearance === "dock" && "forge-tab-dock rounded-2xl border border-fg-grey-200 bg-background p-2",
          isPage
            ? "flex w-full bg-background px-6 pt-4"
            : "inline-flex",
          className,
        )}
      >
        <span aria-hidden ref={indicator} className={cn("forge-moving-indicator forge-tab-indicator", tabBorderColors[color])} style={{ transition: reduced || progress !== undefined ? "none" : "translate 420ms cubic-bezier(.2,.8,.2,1), width 420ms cubic-bezier(.2,.8,.2,1)" }} />
        {tabs.map((tab, index) => (
          <TabsPrimitive.Tab
            key={index}
            value={index}
            id={tab.id}
            aria-controls={tab.controls}
            // With no active tab the first one stays reachable by Tab key.
            tabIndex={activeIndex === -1 ? (index === 0 ? 0 : -1) : undefined}
            className={cn(
              "relative px-4 py-3 text-sm cursor-pointer inline-flex items-center gap-1.5",
              tab.active
                ? `${tabActiveColors[color]} font-semibold`
                : "text-fg-grey-700 font-medium"
            )}
          >
            {tab.icon && <span aria-hidden className="forge-tab-icon flex h-5 w-5 items-center justify-center">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-xs font-medium",
                  tab.active
                    ? `${tabBorderColors[color]} text-white`
                    : "bg-fg-grey-200 text-fg-grey-700"
                )}
              >
                {tab.badge}
              </span>
            )}
          </TabsPrimitive.Tab>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
