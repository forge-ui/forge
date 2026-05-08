import { cn } from "../../../lib/utils";
import { accentColors, type AccentColor } from "../accent-utils";

// ============================================================
// Shared chart utilities
// ============================================================

/**
 * Derive segment colors from an accent ramp for a given segment count.
 * Picks stops with sensible contrast — matches Figma's purple ramp choices.
 */
export function rampColors(accent: AccentColor, count: number): string[] {
  const { ramp } = accentColors[accent];
  if (count <= 0) return [];
  if (count === 1) return [ramp[0]];
  if (count === 2) return [ramp[0], ramp[2]];
  if (count === 3) return [ramp[0], ramp[2], ramp[3]];
  if (count === 4) return [ramp[0], ramp[1], ramp[2], ramp[3]];
  return [ramp[0], ramp[1], ramp[2], ramp[3], ramp[4]];
}

// Tailwind bg-* class → hex value mapping for CSS gradients & SVG fills
export const tailwindColorMap: Record<string, string> = {
  "bg-fg-violet": "#7c3aed",
  "bg-violet-500": "#8b5cf6",
  "bg-violet-400": "#a78bfa",
  "bg-purple-600": "#9333ea",
  "bg-purple-500": "#a855f7",
  "bg-purple-400": "#c084fc",
  "bg-purple-300": "#d8b4fe",
  "bg-purple-200": "#e9d5ff",
  "bg-purple-100": "#f3e8ff",
  "bg-blue-600": "#2563eb",
  "bg-blue-500": "#3b82f6",
  "bg-blue-400": "#60a5fa",
  "bg-blue-300": "#93c5fd",
  "bg-indigo-600": "#4f46e5",
  "bg-indigo-500": "#6366f1",
  "bg-green-600": "#16a34a",
  "bg-green-500": "#22c55e",
  "bg-green-400": "#4ade80",
  "bg-emerald-500": "#10b981",
  "bg-emerald-400": "#34d399",
  "bg-fg-yellow": "#eab308",
  "bg-yellow-400": "#facc15",
  "bg-orange-500": "#f97316",
  "bg-orange-400": "#fb923c",
  "bg-red-600": "#dc2626",
  "bg-fg-red": "#ef4444",
  "bg-red-400": "#f87171",
  "bg-pink-500": "#ec4899",
  "bg-pink-400": "#f472b6",
  "bg-rose-500": "#f43f5e",
  "bg-fg-black": "#111827",
  "bg-fg-grey-100": "#f3f4f6",
  "bg-fg-grey-200": "#e5e7eb",
  "bg-fg-grey-300": "#d1d5db",
  "bg-fg-grey-500": "#9ca3af",
  "bg-fg-grey-700": "#374151",
  "bg-gray-300": "#d1d5db",
  "bg-gray-500": "#6b7280",
  "bg-indigo-50": "#eef2ff",
  "bg-indigo-100": "#e0e7ff",
  "bg-indigo-200": "#c7d2fe",
};

export const TRACK_COLOR_HEX = "#e5e7eb";

export function resolveColor(color: string): string {
  return tailwindColorMap[color] || color;
}

export function trendColorClass(direction?: "up" | "down"): string {
  if (direction === "up") return "text-emerald-500";
  if (direction === "down") return "text-fg-red";
  return "text-fg-grey-900";
}

export function trendArrow(direction?: "up" | "down"): string {
  if (direction === "up") return "↑";
  if (direction === "down") return "↓";
  return "";
}

export function TrendText({
  trend,
  trendDirection,
  size = "sm",
  className,
}: {
  trend: string;
  trendDirection?: "up" | "down";
  size?: "xs" | "sm";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-bold tracking-fg",
        size === "xs" ? "text-xs leading-4" : "text-sm leading-5",
        trendColorClass(trendDirection),
        className,
      )}
    >
      {trendArrow(trendDirection)} {trend}
    </span>
  );
}

// Figma label text styles
export const LABEL_TEXT = "text-xs font-normal leading-4 tracking-fg text-fg-grey-700";
export const LABEL_TEXT_ACTIVE = "text-xs font-bold leading-4 tracking-fg";
export const CENTER_VALUE_TEXT = "text-3xl font-semibold tracking-fg";

// ============================================================
// Conic gradient builder (donut / half-donut / pie)
// ============================================================

interface ConicSegment {
  value: number;
  color: string;
}

interface BuildConicOptions {
  /** Total sweep coverage in percent (full circle = 100, half = 50). Default 100. */
  sweep?: number;
  /** `from N deg` starting angle (e.g. 180 for half-donut bottom). */
  fromAngle?: number;
  /** Track color for unfilled remainder; null disables track. */
  trackColor?: string | null;
}

export function buildConicGradient(
  segments: ConicSegment[],
  options: BuildConicOptions = {},
): string {
  const sweep = options.sweep ?? 100;
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const stops: string[] = [];
  let cumulative = 0;

  // If total > 100, normalize so segments fill the sweep proportionally.
  // If total ≤ 100, treat each value as an absolute percent of the full circle,
  // leaving 100 - total as track.
  const useNormalized = total > 100;

  for (const segment of segments) {
    const pct = useNormalized
      ? (segment.value / total) * sweep
      : (segment.value / 100) * sweep;
    stops.push(`${resolveColor(segment.color)} ${cumulative}% ${cumulative + pct}%`);
    cumulative += pct;
  }

  // Fill remaining sweep with track color (unless explicitly disabled).
  if (cumulative < sweep && options.trackColor !== null) {
    const trackHex = options.trackColor ? resolveColor(options.trackColor) : TRACK_COLOR_HEX;
    stops.push(`${trackHex} ${cumulative}% ${sweep}%`);
  }

  // Hide remainder of full circle when sweep < 100 (e.g. half-donut).
  if (sweep < 100) {
    stops.push(`transparent ${sweep}% 100%`);
  }

  const fromClause = options.fromAngle != null ? `from ${options.fromAngle}deg, ` : "";
  return `conic-gradient(${fromClause}${stops.join(", ")})`;
}

// ============================================================
// Center text block (centerValue + trend + subtitle)
// ============================================================

export function ChartCenterText({
  centerValue,
  trend,
  trendDirection,
  subtitle,
  centerSize = "3xl",
}: {
  centerValue?: string;
  trend?: string;
  trendDirection?: "up" | "down";
  subtitle?: string;
  centerSize?: "xl" | "2xl" | "3xl";
}) {
  if (!centerValue && !trend && !subtitle) return null;
  const centerClass =
    centerSize === "xl"
      ? "text-xl font-semibold leading-7 tracking-fg"
      : centerSize === "2xl"
      ? "text-2xl font-semibold leading-8 tracking-fg"
      : CENTER_VALUE_TEXT;
  return (
    <div className="flex flex-col items-center gap-1 whitespace-nowrap">
      {centerValue && <div className={centerClass}>{centerValue}</div>}
      {(trend || subtitle) && (
        <div className="inline-flex items-center gap-2">
          {trend && <TrendText trend={trend} trendDirection={trendDirection} />}
          {subtitle && (
            <span className="text-sm font-medium leading-5 tracking-fg text-fg-grey-700 whitespace-nowrap">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
