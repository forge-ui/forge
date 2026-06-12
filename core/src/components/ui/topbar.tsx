import { cn } from "../../lib/utils";

// ============================================================
// TopBar - 顶部进度条
// color: purple, blue, green
// ============================================================

const topbarColors = {
  purple: "bg-fg-violet",
  blue: "bg-fg-blue",
  green: "bg-fg-green-500",
} as const;

export type TopBarColor = keyof typeof topbarColors;

export function TopBar({
  value = 0,
  color = "purple",
  className,
}: {
  value?: number;
  color?: TopBarColor;
  className?: string;
}) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full h-1 bg-fg-grey-200", className)}>
      <div
        className={cn("h-1 transition-all", topbarColors[color])}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
