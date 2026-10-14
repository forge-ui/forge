"use client";
import { cn } from "../../lib/utils";
import type { ReactNode } from "react";
import type { MotionPreference } from "../../lib/motion";
import { CheckCircleLinear } from "../../icons";

// ============================================================
// Stepper - 进度点指示器（Figma 严格还原）
// Figma: active 步 = w-5 h-2 圆角胶囊，inactive 步 = w-2 h-2 小圆点
// 无 label / 无文字，类似 onboarding 屏幕底部的 1/N 进度条
// ============================================================

const onColors = {
  purple: "bg-fg-violet",
  blue: "bg-fg-blue",
  black: "bg-fg-black",
} as const;

export type StepperColor = keyof typeof onColors;
export type StepperItem = { id: string; label: string; description?: string; icon?: ReactNode };

export function Stepper({
  total = 0,
  current = 1,
  color = "purple",
  className,
  items, onStepChange, motion = "auto", locale = "zh", indicator,
}: {
  total?: number;
  current?: number;
  color?: StepperColor;
  className?: string;
  items?: StepperItem[];
  onStepChange?: (current: number) => void;
  motion?: MotionPreference;
  locale?: "zh" | "en";
  /** A single moving marker, for example the vehicle in a delivery tracker. */
  indicator?: ReactNode;
}) {
  if (items) return <ol className={cn("forge-stepper list-none p-0 m-0", className)} data-motion={motion} data-color={color} aria-label={locale === "en" ? "Progress steps" : "进度步骤"}>
    {indicator && items.length > 0 && <li aria-hidden className="forge-stepper-indicator" style={{ left: `${(Math.min(items.length, Math.max(1, current)) - .5) / items.length * 100}%` }}>{indicator}</li>}
    {items.map((item, index) => <li key={item.id} data-state={index + 1 < current ? "complete" : index + 1 === current ? "current" : "pending"} aria-current={index + 1 === current ? "step" : undefined}>
      <button type="button" disabled={!onStepChange} onClick={() => onStepChange?.(index + 1)}><span className="forge-stepper-marker">{index + 1 < current ? <CheckCircleLinear size={20} /> : item.icon ?? index + 1}</span><span className="text-xs font-semibold">{item.label}</span>{item.description && <span className="text-xs text-fg-grey-700">{item.description}</span>}</button>
    </li>)}
  </ol>;
  const clamped = Math.min(total, Math.max(0, current));
  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      {Array.from({ length: total }).map((_, i) => {
        const isOn = i < clamped;
        return (
          <div
            key={i}
            className={cn(
              "h-2 rounded-full",
              isOn ? `w-5 ${onColors[color]}` : "w-2 bg-fg-grey-200"
            )}
          />
        );
      })}
    </div>
  );
}
