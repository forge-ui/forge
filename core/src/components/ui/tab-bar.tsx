"use client";

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
}

export function TabBar({
  tabs,
  color = "purple",
  surface = "inline",
  onChange,
  className,
  ariaLabel = "标签页",
}: {
  tabs: TabItem[];
  color?: TabBarColor;
  surface?: TabBarSurface;
  onChange?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
}) {
  const isPage = surface === "page";
  const activeIndex = tabs.findIndex((tab) => tab.active);
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "border-b border-fg-grey-200",
        isPage
          ? "flex w-full bg-white px-6 pt-4"
          : "inline-flex",
        className,
      )}
    >
      {tabs.map((tab, index) => (
        <button
          key={index}
          type="button"
          role="tab"
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
          {tab.active && (
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-0.5",
                tabBorderColors[color]
              )}
            />
          )}
        </button>
      ))}
    </div>
  );
}
