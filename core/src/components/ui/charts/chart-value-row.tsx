import { cn } from "../../../lib/utils";
import { trendArrow, trendColorClass } from "./chart-utils";

interface ChartValueRowProps {
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
  /** Optional dot color + label on the left */
  color?: string;
  label?: string;
}

/**
 * Big headline value + optional trend, left-right aligned.
 * Used as a card footer under bar / line charts.
 */
export function ChartValueRow({
  value,
  trend,
  trendDirection,
  color,
  label,
}: ChartValueRowProps) {
  return (
    <div className="self-stretch inline-flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2 min-w-0">
        {color && <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", color)} />}
        {label && (
          <span className="text-sm font-medium leading-5 tracking-fg text-fg-grey-700">
            {label}
          </span>
        )}
        <span className="text-2xl font-semibold leading-8 tracking-fg text-fg-black truncate">
          {value}
        </span>
      </div>
      {trendDirection && (
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-sm font-bold leading-5 tracking-fg shrink-0",
            trendColorClass(trendDirection),
          )}
        >
          {trend}
          <span>{trendArrow(trendDirection)}</span>
        </span>
      )}
    </div>
  );
}
