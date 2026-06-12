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

// Forge token bg-* class → CSS color mapping for gradients & SVG fills.
export const tailwindColorMap: Record<string, string> = {
  "bg-fg-violet": "var(--fg-violet)",
  "bg-fg-violet-600": "var(--fg-violet-600)",
  "bg-fg-violet-500": "var(--fg-violet-500)",
  "bg-fg-violet-400": "var(--fg-violet-400)",
  "bg-fg-violet-300": "var(--fg-violet-300)",
  "bg-fg-violet-200": "var(--fg-violet-200)",
  "bg-fg-violet-100": "var(--fg-violet-100)",
  "bg-fg-blue": "var(--fg-blue)",
  "bg-fg-blue-700": "var(--fg-blue-700)",
  "bg-fg-blue-600": "var(--fg-blue-600)",
  "bg-fg-blue-500": "var(--fg-blue-500)",
  "bg-fg-blue-400": "var(--fg-blue-400)",
  "bg-fg-blue-300": "var(--fg-blue-300)",
  "bg-fg-blue-200": "var(--fg-blue-200)",
  "bg-fg-blue-100": "var(--fg-blue-100)",
  "bg-fg-blue-50": "var(--fg-blue-50)",
  "bg-fg-green-600": "var(--fg-green-600)",
  "bg-fg-green-500": "var(--fg-green-500)",
  "bg-fg-green-400": "var(--fg-green-400)",
  "bg-fg-green-300": "var(--fg-green-300)",
  "bg-fg-green-200": "var(--fg-green-200)",
  "bg-fg-green-100": "var(--fg-green-100)",
  "bg-fg-green-50": "var(--fg-green-50)",
  "bg-fg-cyan-500": "var(--fg-cyan-500)",
  "bg-fg-cyan-300": "var(--fg-cyan-300)",
  "bg-fg-cyan-200": "var(--fg-cyan-200)",
  "bg-fg-cyan-100": "var(--fg-cyan-100)",
  "bg-fg-cyan-50": "var(--fg-cyan-50)",
  "bg-fg-yellow": "var(--fg-yellow)",
  "bg-fg-yellow-400": "var(--fg-yellow-400)",
  "bg-fg-yellow-300": "var(--fg-yellow-300)",
  "bg-fg-yellow-100": "var(--fg-yellow-100)",
  "bg-fg-yellow-50": "var(--fg-yellow-50)",
  "bg-fg-red": "var(--fg-red)",
  "bg-fg-red-600": "var(--fg-red-600)",
  "bg-fg-red-500": "var(--fg-red-500)",
  "bg-fg-red-400": "var(--fg-red-400)",
  "bg-fg-red-300": "var(--fg-red-300)",
  "bg-fg-red-200": "var(--fg-red-200)",
  "bg-fg-red-100": "var(--fg-red-100)",
  "bg-fg-red-50": "var(--fg-red-50)",
  "bg-fg-black": "var(--fg-black)",
  "bg-fg-grey-100": "var(--fg-grey-100)",
  "bg-fg-grey-200": "var(--fg-grey-200)",
  "bg-fg-grey-300": "var(--fg-grey-300)",
  "bg-fg-grey-500": "var(--fg-grey-500)",
  "bg-fg-grey-700": "var(--fg-grey-700)",
};

export const TRACK_COLOR_HEX = "var(--fg-grey-200)";

export function resolveColor(color: string): string {
  return tailwindColorMap[color] || color;
}

export function trendColorClass(direction?: "up" | "down"): string {
  if (direction === "up") return "text-fg-green-500";
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
