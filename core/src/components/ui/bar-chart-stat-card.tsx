import { cn } from "../../lib/utils";
import { cardThemes, StatCardShell, resolveCardTheme, type CardTheme, type CardWidth, type LegacyCardTheme, type StatCardSize, type TrendDirection } from "./card-utils";

// ============================================================
// BarChartStatCard — Figma "Bar Chart Statistic Card" (node 6320:5395)
// ============================================================

type BarChartStatCardTheme = CardTheme | LegacyCardTheme;

export type BarColor = "purple" | "blue" | "green" | "red" | "orange" | "yellow" | "cyan";

const barActive: Record<BarColor, string> = {
  purple: "bg-fg-violet",
  blue: "bg-fg-blue",
  green: "bg-fg-green-500",
  red: "bg-fg-red",
  orange: "bg-fg-red",
  yellow: "bg-fg-yellow",
  cyan: "bg-fg-cyan-500",
};

const barInactive: Record<BarColor, string> = {
  purple: "bg-fg-violet-300",
  blue: "bg-fg-blue-300",
  green: "bg-fg-green-300",
  red: "bg-fg-red-300",
  orange: "bg-fg-red-300",
  yellow: "bg-fg-yellow-300",
  cyan: "bg-fg-cyan-200",
};

function BarSlot({
  bars,
  color,
  themeKey,
  size = "sm",
}: {
  bars: number[];
  color: BarColor;
  themeKey: CardTheme;
  size?: StatCardSize;
}) {
  const isColored = themeKey !== "white" && themeKey !== "black";
  const isWide = size === "wide";
  const maxBar = Math.max(...bars);
  const visible = bars.slice(0, isWide ? 7 : 5);
  // In wide mode, normalize input heights to fit within the 64px container.
  const wideMax = 60;
  return (
    <div
      className={cn(
        "flex items-end",
        isWide ? "gap-2 h-16 w-full justify-end" : "gap-1 h-10",
      )}
    >
      {visible.map((h, i) => {
        const isActive = h === maxBar;
        const bg = isColored
          ? (isActive ? "bg-white" : "bg-white/30")
          : (isActive ? barActive[color] : barInactive[color]);
        const height = isWide
          ? Math.max(8, Math.round((h / maxBar) * wideMax))
          : h;
        return (
          <div
            key={i}
            className={cn("rounded-lg", isWide ? "w-2" : "w-[5px]", bg)}
            style={{ height: `${height}px` }}
          />
        );
      })}
    </div>
  );
}

export function BarChartStatCard({
  title,
  value,
  trend,
  trendDirection = "up",
  subtitle,
  theme = "white",
  size = "sm",
  barColor = "purple",
  bars = [16, 24, 32, 20, 40],
  width,
  className,
}: {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: TrendDirection;
  subtitle?: string;
  theme?: BarChartStatCardTheme;
  size?: StatCardSize;
  barColor?: BarColor;
  bars?: number[];
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
      width={width}
      chartSlot={<BarSlot bars={bars} color={barColor} themeKey={themeKey} size={size} />}
      className={className}
    />
  );
}
