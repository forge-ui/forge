import { cn } from "../../../lib/utils";
import { buildConicGradient, ChartCenterText, rampColors } from "./chart-utils";
import { type AccentColor } from "../accent-utils";

interface DonutSegment {
  value: number;
  /** Optional override. When omitted, derived from `accent` ramp. */
  color?: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  /** Accent color drives segment colors when not explicitly set. Default "purple". */
  accent?: AccentColor;
  centerValue?: string;
  trend?: string;
  trendDirection?: "up" | "down";
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  /** Optional track color for unfilled remainder. Defaults to gray (fg-grey-200). */
  trackColor?: string;
}

const sizeMap = {
  sm: { outer: "w-40 h-40", inner: "w-24 h-24" },
  md: { outer: "w-60 h-60", inner: "w-36 h-36" },
  lg: { outer: "w-72 h-72", inner: "w-[172px] h-[172px]" },
};

export function DonutChart({
  segments,
  accent = "purple",
  centerValue,
  trend,
  trendDirection,
  subtitle,
  size = "md",
  trackColor,
}: DonutChartProps) {
  const s = sizeMap[size];
  const rampFallback = rampColors(accent, segments.length);
  const resolved = segments.map((seg, i) => ({
    value: seg.value,
    color: seg.color ?? rampFallback[i],
  }));
  return (
    <div className="flex flex-col items-center">
      <div className={cn("relative rounded-full", s.outer)} style={{ background: buildConicGradient(resolved, { trackColor }) }}>
        <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white", s.inner)} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <ChartCenterText centerValue={centerValue} trend={trend} trendDirection={trendDirection} />
        </div>
      </div>
      {subtitle && <div className="mt-2 text-sm text-fg-grey-700">{subtitle}</div>}
    </div>
  );
}
