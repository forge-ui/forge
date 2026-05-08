import { cn } from "../../../lib/utils";
import { trendArrow, trendColorClass, rampColors } from "./chart-utils";
import { type AccentColor } from "../accent-utils";

interface ChartStatFooterItem {
  label: string;
  value: string;
  color?: string;
  /** Optional trend text (e.g. "+12%"). If omitted while trendDirection is set, renders arrow only. */
  trend?: string;
  trendDirection?: "up" | "down";
}

interface ChartStatFooterProps {
  items: ChartStatFooterItem[];
  /** When item.color is omitted, derives dot color from this accent's ramp. */
  accent?: AccentColor;
}

export function ChartStatFooter({ items, accent = "purple" }: ChartStatFooterProps) {
  const rampFallback = rampColors(accent, items.length);
  return (
    <div className="self-stretch inline-flex justify-start items-center gap-3">
      {items.map((item, i) => {
        const dotColor = item.color ?? rampFallback[i];
        return (
        <div key={i} className="flex-1 inline-flex flex-col justify-start items-center gap-1">
          <div className="inline-flex justify-center items-center gap-1">
            <div className={cn("w-2.5 h-2.5 rounded-full", dotColor)} />
            <span className="text-fg-grey-700 text-xs font-medium leading-4 tracking-fg">
              {item.label}
            </span>
          </div>
          <div className="inline-flex justify-center items-center gap-1">
            <span className="text-fg-black text-2xl font-semibold leading-8 tracking-fg">
              {item.value}
            </span>
            {item.trendDirection && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-sm font-bold leading-5 tracking-fg",
                  trendColorClass(item.trendDirection),
                )}
              >
                {item.trend}
                <span>{trendArrow(item.trendDirection)}</span>
              </span>
            )}
          </div>
        </div>
        );
      })}
    </div>
  );
}
