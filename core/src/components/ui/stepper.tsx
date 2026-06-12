import { cn } from "../../lib/utils";

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

export function Stepper({
  total,
  current = 1,
  color = "purple",
  className,
}: {
  total: number;
  current?: number;
  color?: StepperColor;
  className?: string;
}) {
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
