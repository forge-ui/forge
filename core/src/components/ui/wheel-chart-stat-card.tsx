import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { cardThemes, StatCardShell, resolveCardTheme, type CardTheme, type CardWidth, type LegacyCardTheme, type StatCardSize, type TrendDirection } from "./card-utils";

// ============================================================
// WheelChartStatCard — Figma "Wheel Chart Statistic Card" (node 6306:29093)
// ============================================================

type WheelChartStatCardTheme = CardTheme | LegacyCardTheme;

export type WheelColor = "purple" | "blue" | "green" | "red" | "orange" | "yellow" | "cyan";

const wheelBg: Record<WheelColor, string> = {
  purple: "bg-fg-violet",
  blue: "bg-fg-blue",
  green: "bg-fg-green-500",
  red: "bg-fg-red",
  orange: "bg-fg-red",
  yellow: "bg-fg-yellow",
  cyan: "bg-fg-cyan-500",
};

function WheelSlot({
  percent = 70,
  color,
  themeKey,
  size = "sm",
}: {
  percent?: number;
  color: WheelColor;
  themeKey: CardTheme;
  size?: StatCardSize;
}) {
  const isWhite = themeKey === "white";
  const fillClass = isWhite ? wheelBg[color] : "bg-white";
  const trackClass = isWhite ? "bg-fg-grey-200" : "bg-white/25";
  // Use conic-gradient via inline style so fill angle is data-driven.
  const clamped = Math.max(0, Math.min(100, percent));
  const angle = (clamped / 100) * 360;
  const dimensionClass =
    size === "wide" ? "w-20 h-20 ml-auto" : size === "lg" ? "w-16 h-16" : "w-12 h-12";
  return (
    <div className={cn("rounded-full relative overflow-hidden", dimensionClass)}>
      <div className={cn("absolute inset-0 rounded-full", trackClass)} />
      <div
        className={cn("absolute inset-0 rounded-full", fillClass)}
        style={{
          WebkitMask: `conic-gradient(from 0deg, var(--fg-black) 0deg ${angle}deg, transparent ${angle}deg 360deg)`,
          mask: `conic-gradient(from 0deg, var(--fg-black) 0deg ${angle}deg, transparent ${angle}deg 360deg)`,
        }}
      />
    </div>
  );
}

export function WheelChartStatCard({
  title,
  value,
  trend,
  trendDirection = "up",
  subtitle,
  theme = "white",
  size = "sm",
  wheelColor = "purple",
  wheelPercent = 70,
  icon,
  width,
  className,
}: {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: TrendDirection;
  subtitle?: string;
  theme?: WheelChartStatCardTheme;
  size?: StatCardSize;
  wheelColor?: WheelColor;
  wheelPercent?: number;
  /** Icon for the top-right chip (only rendered in size="wide"). */
  icon?: ReactNode;
  /** Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. */
  width?: CardWidth;
  className?: string;
}) {
  const themeKey = resolveCardTheme(theme);
  return (
    <StatCardShell
      title={title}
      value={value}
      trend={trend}
      trendDirection={trendDirection}
      subtitle={subtitle}
      theme={cardThemes[themeKey]}
      themeKey={themeKey}
      size={size}
      icon={icon}
      width={width}
      chartSlot={<WheelSlot percent={wheelPercent} color={wheelColor} themeKey={themeKey} size={size} />}
      className={className}
    />
  );
}
