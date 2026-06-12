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
  sm: "max-w-40",
  md: "max-w-60",
  lg: "max-w-72",
};

export function PieChart({ segments, accent = "purple", size = "md", trackColor }: PieChartProps) {
  const rampFallback = rampColors(accent, segments.length);
  const resolved = segments.map((seg, i) => ({
    value: seg.value,
    color: seg.color ?? rampFallback[i],
  }));
  return (
    <div
      className={cn("w-full aspect-square rounded-full", sizeMap[size])}
      style={{ background: buildConicGradient(resolved, { trackColor }) }}
    />
  );
}
