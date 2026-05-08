import { cn } from "../../../lib/utils";
import { ChartTooltip } from "./chart-tooltip";
import { LABEL_TEXT, LABEL_TEXT_ACTIVE, resolveColor } from "./chart-utils";
import { accentColors, type AccentColor } from "../accent-utils";

interface BarUpsideDownChartDataItem {
  upperValue: number;
  lowerValue: number;
  label?: string;
}

interface BarUpsideDownChartProps {
  data: BarUpsideDownChartDataItem[];
  accent?: AccentColor;
  activeIndex?: number;
  /** Upper bar color override. Defaults to accent.bg. */
  upperColor?: string;
  /** Lower bar color override. Defaults to accent.ramp[2] (mid-light shade). */
  lowerColor?: string;
  barWidth?: "thin" | "wide";
  showLabels?: boolean;
  showTooltip?: boolean;
  tooltipUpperValue?: string;
  tooltipLowerValue?: string;
  tooltipTrend?: "up" | "down";
  height?: string;
}

export function BarUpsideDownChart({
  data,
  accent = "purple",
  activeIndex,
  upperColor,
  lowerColor,
  barWidth = "thin",
  showLabels = false,
  showTooltip = false,
  tooltipUpperValue,
  tooltipLowerValue,
  tooltipTrend,
  height = "h-36",
}: BarUpsideDownChartProps) {
  const theme = accentColors[accent];
  const resolvedUpper = upperColor ?? theme.bg;
  const resolvedLower = lowerColor ?? theme.ramp[2];
  const maxUpper = Math.max(...data.map((d) => d.upperValue), 1);
  const maxLower = Math.max(...data.map((d) => d.lowerValue), 1);
  const maxValue = Math.max(maxUpper, maxLower);

  const barClasses =
    barWidth === "thin" ? "w-2 rounded-full" : "w-8 rounded-lg";

  return (
    <div className={cn("inline-flex w-full items-start", height)}>
      {data.map((item, i) => {
        const isActive = i === activeIndex;
        const upperPct = (item.upperValue / maxValue) * 100;
        const lowerPct = (item.lowerValue / maxValue) * 100;

        return (
          <div
            key={i}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-start",
              height,
            )}
          >
            {isActive && (
              <div className={cn(
                "pointer-events-none absolute inset-0 rounded-b-lg bg-gradient-to-b to-transparent",
                accent === "purple" ? "from-fg-violet/10" : accent === "blue" ? "from-blue-600/10" : "from-fg-black/10",
              )} />
            )}

            <div className="flex flex-1 flex-col items-center justify-center gap-1">
              <div className={cn(resolvedUpper, barClasses)} style={{ height: `${upperPct}%` }} />
              <div className={cn(resolvedLower, barClasses)} style={{ height: `${lowerPct}%` }} />
            </div>

            {showLabels && item.label && (
              <span
                className={cn("mt-2", isActive ? LABEL_TEXT_ACTIVE : LABEL_TEXT)}
                style={isActive ? { color: resolveColor(resolvedUpper) } : undefined}
              >
                {item.label}
              </span>
            )}

            {isActive && showTooltip && (tooltipUpperValue || tooltipLowerValue) && (
              <div className="absolute -bottom-14 z-10">
                <ChartTooltip
                  items={[
                    ...(tooltipUpperValue
                      ? [{ color: resolvedUpper, value: tooltipUpperValue, trend: tooltipTrend }]
                      : []),
                    ...(tooltipLowerValue
                      ? [{ color: resolvedLower, value: tooltipLowerValue }]
                      : []),
                  ]}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
