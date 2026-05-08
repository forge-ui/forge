import { cn } from "../../../lib/utils";
import { ChartTooltip } from "./chart-tooltip";
import { LABEL_TEXT, LABEL_TEXT_ACTIVE, resolveColor } from "./chart-utils";
import { accentColors, type AccentColor } from "../accent-utils";

interface BarHorizontalChartDataItem {
  value: number;
  label?: string;
}

interface BarHorizontalChartProps {
  data: BarHorizontalChartDataItem[];
  accent?: AccentColor;
  activeIndex?: number;
  color?: string;
  inactiveColor?: string;
  barWidth?: "thin" | "wide";
  showLabels?: boolean;
  showTooltip?: boolean;
  tooltipValue?: string;
  tooltipTrend?: "up" | "down";
}

export function BarHorizontalChart({
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
}: BarHorizontalChartProps) {
  const theme = accentColors[accent];
  const activeColor = color ?? theme.bg;
  const resolvedInactiveColor = inactiveColor ?? activeColor;
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex w-full flex-col gap-2">
      {data.map((item, i) => {
        const isActive = i === activeIndex;
        const widthPct = (item.value / maxValue) * 100;
        const barColor = isActive ? activeColor : resolvedInactiveColor;

        return (
          <div key={i} className="relative flex items-center gap-2">
            {showLabels && item.label && (
              <span
                className={cn("w-10 shrink-0 text-right", isActive ? LABEL_TEXT_ACTIVE : LABEL_TEXT)}
                style={isActive ? { color: resolveColor(activeColor) } : undefined}
              >
                {item.label}
              </span>
            )}

            <div
              className={cn(
                "relative flex flex-1 items-center",
                isActive && "rounded-r-lg",
              )}
            >
              {isActive && (
                <div className={cn(
                  "pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-l from-transparent",
                  accent === "purple" ? "to-fg-violet/10" : accent === "blue" ? "to-blue-600/10" : "to-fg-black/10",
                )} />
              )}

              <div
                className={cn(
                  barColor,
                  barWidth === "thin"
                    ? "h-2 rounded-full"
                    : "h-8 rounded-lg",
                )}
                style={{ width: `${widthPct}%` }}
              />

              {isActive && showTooltip && tooltipValue && (
                <div
                  className="absolute -top-10 z-10 -translate-x-1/2"
                  style={{ left: `${widthPct}%` }}
                >
                  <ChartTooltip
                    items={[
                      { color: activeColor, value: tooltipValue, trend: tooltipTrend },
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
