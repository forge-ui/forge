import { useId, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { cardThemes, StatCardShell, resolveCardTheme, type CardTheme, type LegacyCardTheme, type StatCardSize, type TrendDirection } from "./card-utils";

// ============================================================
// LineChartStatCard — Figma "Line Chart Statistic Card" (node 4299:4765)
// StatCardShell wrapper with a mini line-area chart in the right slot.
// ============================================================

type LineChartStatCardTheme = CardTheme | LegacyCardTheme;

export type LineChartColor =
  | "purple" | "blue" | "green" | "red" | "orange" | "yellow" | "cyan";

const chartGradient: Record<LineChartColor, string> = {
  purple: "from-fg-violet/10",
  blue: "from-blue-600/10",
  green: "from-emerald-500/10",
  red: "from-red-500/10",
  orange: "from-orange-500/10",
  yellow: "from-fg-yellow/10",
  cyan: "from-teal-400/10",
};

const chartBorder: Record<LineChartColor, string> = {
  purple: "border-fg-violet",
  blue: "border-blue-600",
  green: "border-emerald-500",
  red: "border-fg-red",
  orange: "border-orange-500",
  yellow: "border-fg-yellow",
  cyan: "border-teal-400",
};

const chartStroke: Record<LineChartColor, string> = {
  purple: "#7c3aed",
  blue: "#2563eb",
  green: "#10b981",
  red: "#ef4444",
  orange: "#f97316",
  yellow: "#fbbf24",
  cyan: "#2dd4bf",
};

function CompactLineChartSlot({
  chartColor,
  themeKey,
  direction,
}: {
  chartColor: LineChartColor;
  themeKey: CardTheme;
  direction: "up" | "down";
}) {
  const isWhite = themeKey === "white";
  const gradient = isWhite ? `${chartGradient[chartColor]} to-white/0` : "from-white/10 to-white/0";
  const border = isWhite ? chartBorder[chartColor] : "border-white";
  return (
    <div className={cn("w-16 h-10", direction === "down" && "rotate-180 origin-top-left")}>
      <div className={cn("w-full h-full rounded-sm bg-gradient-to-b border-t-2", gradient, border)} />
    </div>
  );
}

const DEFAULT_WAVE_UP = [22, 28, 24, 32, 26, 36, 30, 42, 38, 48, 44, 56];
const DEFAULT_WAVE_DOWN = [56, 44, 48, 38, 42, 30, 36, 26, 32, 24, 28, 22];

const VIEWBOX_W = 200;
const VIEWBOX_H = 60;
const TENSION_DIVISOR = 6;

function buildSmoothPath(rawData: number[]): { line: string; area: string } {
  const data = rawData.filter((v): v is number => Number.isFinite(v));
  const n = data.length;
  if (n < 2) return { line: "", area: "" };
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const points: [number, number][] = data.map((v, i) => [
    (i / (n - 1)) * VIEWBOX_W,
    range === 0
      ? VIEWBOX_H / 2
      : VIEWBOX_H - ((v - min) / range) * (VIEWBOX_H - 4) - 2,
  ]);

  let line = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / TENSION_DIVISOR;
    const cp1y = p1[1] + (p2[1] - p0[1]) / TENSION_DIVISOR;
    const cp2x = p2[0] - (p3[0] - p1[0]) / TENSION_DIVISOR;
    const cp2y = p2[1] - (p3[1] - p1[1]) / TENSION_DIVISOR;
    line += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }
  const area = `${line} L ${VIEWBOX_W} ${VIEWBOX_H} L 0 ${VIEWBOX_H} Z`;
  return { line, area };
}

function WideLineChartSlot({
  chartColor,
  themeKey,
  direction,
  series,
}: {
  chartColor: LineChartColor;
  themeKey: CardTheme;
  direction: "up" | "down";
  series?: number[];
}) {
  // useId() can contain ":" which breaks `url(#…)` references — strip it.
  const gradientId = `grad-${useId().replace(/:/g, "")}`;
  const data = series ?? (direction === "up" ? DEFAULT_WAVE_UP : DEFAULT_WAVE_DOWN);
  const { line, area } = buildSmoothPath(data);
  if (!line) return null;
  const isWhite = themeKey === "white";
  const stroke = isWhite ? chartStroke[chartColor] : "#ffffff";
  const fillStop = isWhite ? chartStroke[chartColor] : "#ffffff";

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      preserveAspectRatio="none"
      className="w-full h-12"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillStop} stopOpacity={isWhite ? 0.18 : 0.25} />
          <stop offset="100%" stopColor={fillStop} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path d={line} stroke={stroke} strokeWidth={2} fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function LineChartStatCard({
  title,
  value,
  trend,
  trendDirection = "up",
  subtitle,
  theme = "white",
  size = "sm",
  chartColor = "purple",
  chartDirection = "up",
  series,
  icon,
  className,
}: {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: TrendDirection;
  subtitle?: string;
  theme?: LineChartStatCardTheme;
  size?: StatCardSize;
  chartColor?: LineChartColor;
  chartDirection?: "up" | "down";
  /** Optional data points for the wide-mode line chart. Ignored when size !== "wide". */
  series?: number[];
  /** Icon for the top-right chip (only rendered in size="wide"). */
  icon?: ReactNode;
  className?: string;
}) {
  const themeKey = resolveCardTheme(theme);
  const chartSlot = size === "wide"
    ? <WideLineChartSlot chartColor={chartColor} themeKey={themeKey} direction={chartDirection} series={series} />
    : <CompactLineChartSlot chartColor={chartColor} themeKey={themeKey} direction={chartDirection} />;

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
      chartSlot={chartSlot}
      className={className}
    />
  );
}
