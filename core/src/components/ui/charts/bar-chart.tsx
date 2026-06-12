import { cn } from "../../../lib/utils";
import { ChartTooltip } from "./chart-tooltip";
import { LABEL_TEXT, LABEL_TEXT_ACTIVE, resolveColor } from "./chart-utils";
import { accentColors, type AccentColor } from "../accent-utils";

interface BarChartDataItem {
  value: number;
  label?: string;
}

interface BarChartProps {
  data: BarChartDataItem[];
  accent?: AccentColor;
  activeIndex?: number;
  /** Override bar color (Tailwind bg-* class). Defaults to accent.bg. */
  color?: string;
  /** Override inactive bar color. Defaults to same as active. */
  inactiveColor?: string;
  barWidth?: "thin" | "wide";
  showLabels?: boolean;
  showTooltip?: boolean;
  tooltipValue?: string;
  tooltipTrend?: "up" | "down";
  height?: string;
}

export function BarChart({
  data,
  accent = "purple",
  activeIndex,
  color,
  inactiveColor,
  barWidth = "thin",
  showLabels = false,
  showTooltip = false,
  tooltipValue,
  tooltipTrend,
  height = "h-36",
}: BarChartProps) {
  const theme = accentColors[accent];
  const activeColor = color ?? theme.bg;
  const resolvedInactiveColor = inactiveColor ?? activeColor;
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("inline-flex w-full items-end", height)}>
      {data.map((item, i) => {
        const isActive = i === activeIndex;
        const heightPct = (item.value / maxValue) * 100;
        const barColor = isActive ? activeColor : resolvedInactiveColor;

        return (
          <div
            key={i}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-end",
              height,
            )}
          >
            {isActive && (
              <div className={cn(
                "pointer-events-none absolute inset-0 rounded-t-lg bg-gradient-to-b from-transparent",
                accent === "purple" ? "to-fg-violet/10" : accent === "blue" ? "to-fg-blue/10" : "to-fg-black/10",
              )} />
            )}

            {isActive && showTooltip && tooltipValue && (
              <div className="absolute -top-14 z-10">
                <ChartTooltip
                  items={[{ color: activeColor, value: tooltipValue, trend: tooltipTrend }]}
                />
              </div>
            )}

            <div className="flex flex-1 items-end justify-center">
              <div
                className={cn(
                  barColor,
                  barWidth === "thin"
                    ? "w-2 rounded-full"
                    : "w-8 rounded-lg",
                )}
                style={{ height: `${heightPct}%` }}
              />
            </div>

            {showLabels && item.label && (
              <span
                className={cn("mt-2", isActive ? LABEL_TEXT_ACTIVE : LABEL_TEXT)}
                style={isActive ? { color: resolveColor(activeColor) } : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
