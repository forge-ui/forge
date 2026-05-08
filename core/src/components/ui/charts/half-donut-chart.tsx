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
    <div className="flex w-64 flex-col items-center">
      <div className="relative h-32 w-64 overflow-hidden">
        <div
          className="absolute left-1/2 top-0 h-60 w-60 -translate-x-1/2 rounded-full"
          style={{ background: gradient }}
        />
        <div className="absolute left-1/2 top-[30px] h-[180px] w-[180px] -translate-x-1/2 rounded-full bg-white" />
        <div className="absolute left-1/2 top-[70px] -translate-x-1/2 flex flex-col items-center text-center">
          <ChartCenterText centerValue={centerValue} trend={trend} trendDirection={trendDirection} />
        </div>
      </div>
      {subtitle && <div className="mt-2 text-sm text-fg-grey-700">{subtitle}</div>}
    </div>
  );
}
