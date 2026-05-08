import { cn } from "../../../lib/utils";
import { TrendText, rampColors } from "./chart-utils";
import { type AccentColor } from "../accent-utils";

interface MeterSegment {
  value: number;
  color?: string;
}

interface MeterChartProps {
  segments: MeterSegment[];
  accent?: AccentColor;
  trend?: string;
  trendDirection?: "up" | "down";
  subtitle?: string;
  /** Meter bar height class. Default h-24 (96px) per figma. */
  height?: string;
}

export function MeterChart({
  segments,
  accent = "purple",
  trend,
  trendDirection,
  subtitle,
  height = "h-24",
}: MeterChartProps) {
  const rampFallback = rampColors(accent, segments.length);
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  // When values sum to ≤100, treat as absolute percent (leave remainder as grey track).
  // When sum > 100, normalize so segments fill the full bar.
  const useNormalized = total > 100;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className={cn("flex w-full overflow-hidden rounded-xl", height)}>
        {segments.map((segment, i) => {
          const pct = total > 0
            ? useNormalized
              ? (segment.value / total) * 100
              : segment.value
            : 0;
          return (
            <div
              key={i}
              className={cn(
                "flex items-center justify-center overflow-hidden px-1 text-center text-sm font-bold leading-5 tracking-fg text-white line-clamp-1",
                segment.color ?? rampFallback[i],
              )}
              style={{ width: `${pct}%` }}
            >
              {pct >= 8 && `${Math.round(pct)}%`}
            </div>
          );
        })}
        {!useNormalized && total < 100 && <div className="flex-1 bg-fg-grey-200" />}
      </div>
      {(subtitle || trend) && (
        <div className="flex items-center justify-between">
          {subtitle && (
            <span className="flex-1 text-sm font-medium leading-5 tracking-fg text-fg-grey-700">
              {subtitle}
            </span>
          )}
          {trend && <TrendText trend={trend} trendDirection={trendDirection} />}
        </div>
      )}
    </div>
  );
}
