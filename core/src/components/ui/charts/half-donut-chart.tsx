import { buildConicGradient, ChartCenterText, rampColors } from "./chart-utils";
import { type AccentColor } from "../accent-utils";

interface HalfDonutSegment {
  value: number;
  color?: string;
}

interface HalfDonutChartProps {
  segments: HalfDonutSegment[];
  accent?: AccentColor;
  centerValue?: string;
  trend?: string;
  trendDirection?: "up" | "down";
  subtitle?: string;
  /** Optional track color for unfilled remainder. Defaults to accent's lightest ramp stop. */
  trackColor?: string;
}

export function HalfDonutChart({
  segments,
  accent = "purple",
  centerValue,
  trend,
  trendDirection,
  subtitle,
  trackColor,
}: HalfDonutChartProps) {
  const rampFallback = rampColors(accent, segments.length);
  const resolved = segments.map((seg, i) => ({
    value: seg.value,
    color: seg.color ?? rampFallback[i],
  }));
  const gradient = buildConicGradient(resolved, { sweep: 50, fromAngle: 270, trackColor });
  return (
    <div className="flex w-full max-w-64 flex-col items-center">
      <div className="relative w-full aspect-[2/1] overflow-hidden">
        <div
          className="absolute left-1/2 top-0 h-[187.5%] w-[93.75%] -translate-x-1/2 rounded-full"
          style={{ background: gradient }}
        />
        <div className="absolute left-1/2 top-[23.4375%] h-[140.625%] w-[70.3125%] -translate-x-1/2 rounded-full bg-white" />
        <div className="absolute left-1/2 top-[54.6875%] -translate-x-1/2 flex flex-col items-center text-center">
          <ChartCenterText centerValue={centerValue} trend={trend} trendDirection={trendDirection} />
        </div>
      </div>
      {subtitle && <div className="mt-2 text-sm text-fg-grey-700">{subtitle}</div>}
    </div>
  );
}
