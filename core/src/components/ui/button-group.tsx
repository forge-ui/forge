"use client";

import { cn } from "../../lib/utils";

// ============================================================
// ButtonGroup - 分段控制器
// color: purple, blue, black
// shape: rounded, pill
// ============================================================

const activeItemColors = {
  purple: "bg-fg-violet-100 text-fg-violet",
  blue: "bg-fg-blue-100 text-fg-blue",
  black: "bg-fg-grey-200 text-fg-black",
} as const;

export type ButtonGroupColor = keyof typeof activeItemColors;
export type ButtonGroupShape = "rounded" | "pill";

export interface ButtonGroupItem {
  label: string;
}

export function ButtonGroup({
  items,
  activeIndex = 0,
  color = "purple",
  shape = "rounded",
  onChange,
  className,
}: {
  items: ButtonGroupItem[];
  activeIndex?: number;
  color?: ButtonGroupColor;
  shape?: ButtonGroupShape;
  onChange?: (index: number) => void;
  className?: string;
}) {
  const isPill = shape === "pill";

  return (
    <div
      className={cn(
        "p-1 bg-white outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex",
        isPill ? "rounded-full" : "rounded-xl",
        className
      )}
    >
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onChange?.(index)}
          className={cn(
            "px-4 py-2 text-sm leading-5 cursor-pointer whitespace-nowrap",
            isPill ? "rounded-full" : "rounded-lg",
            index === activeIndex
              ? `${activeItemColors[color]} font-bold`
              : "text-fg-grey-700 font-semibold"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
