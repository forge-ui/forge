import { cn } from "../../../lib/utils";
import { buildConicGradient, rampColors } from "./chart-utils";
import { type AccentColor } from "../accent-utils";

interface PieSegment {
  value: number;
  color?: string;
}

interface PieChartProps {
  segments: PieSegment[];
  accent?: AccentColor;
  size?: "sm" | "md" | "lg";
  /** Optional track color for unfilled remainder. Defaults to gray (fg-grey-200). */
  trackColor?: string;
}

const sizeMap = {
  sm: "w-40 h-40",
  md: "w-60 h-60",
  lg: "w-72 h-72",
};

export function PieChart({ segments, accent = "purple", size = "md", trackColor }: PieChartProps) {
  const rampFallback = rampColors(accent, segments.length);
  const resolved = segments.map((seg, i) => ({
    value: seg.value,
    color: seg.color ?? rampFallback[i],
  }));
  return (
    <div
      className={cn("rounded-full", sizeMap[size])}
      style={{ background: buildConicGradient(resolved, { trackColor }) }}
    />
  );
}
