"use client";

import type { MotionPreference } from "../../../lib/motion";
import { useReducedMotion } from "../../../internal/motion";
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
  domain?: [number, number];
  target?: number;
  targetLabel?: string;
  ranges?: { to: number; color?: string }[];
  motion?: MotionPreference;
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
  domain, target, targetLabel, ranges = [], motion = "auto",
  accent = "blue",
  activeIndex,
  color,
  inactiveColor,
  barWidth = "thin",
  showLabels = false,
  showTooltip = false,
  tooltipValue,
  tooltipTrend,
}: BarHorizontalChartProps) {
  const reduced = useReducedMotion(motion);
  const theme = accentColors[accent];
  const activeColor = color ?? theme.bg;
  const resolvedInactiveColor = inactiveColor ?? activeColor;
  const minValue = domain?.[0] ?? 0;
  const maxValue = domain?.[1] ?? Math.max(...data.map((d) => d.value), 1);
  const percent = (value: number) => Math.max(0, Math.min(100, (value - minValue) / (maxValue - minValue || 1) * 100));

  return (
    <div className="flex w-full flex-col gap-2">
      {data.map((item, i) => {
        const isActive = i === activeIndex;
        const widthPct = percent(item.value);
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
              {ranges.map((range, index) => <div key={index} aria-hidden className="absolute inset-y-0" style={{ left: `${index ? percent(ranges[index - 1].to) : 0}%`, width: `${percent(range.to) - (index ? percent(ranges[index - 1].to) : 0)}%`, background: resolveColor(range.color ?? "bg-fg-grey-200") }} />)}
              {target !== undefined && <span data-chart-target={target} role="img" aria-label={targetLabel ?? `目标 ${target}`} className="absolute -bottom-2 -top-2 z-10 w-0.5 bg-fg-red" style={{ left: `${percent(target)}%`, transition: reduced ? "none" : "left 350ms ease" }} />}
              {isActive && (
                <div className={cn(
                  "pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-l from-transparent",
                  accent === "purple" ? "to-fg-violet/10" : accent === "blue" ? "to-fg-blue/10" : "to-fg-black/10",
                )} />
              )}

              <div
                className={cn(
                  barColor,
                  barWidth === "thin"
                    ? "h-2 rounded-full"
                    : "h-8 rounded-lg",
                )}
                style={{ width: `${widthPct}%`, position: "relative", transition: reduced ? "none" : "width 450ms cubic-bezier(.2,.8,.2,1)" }}
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
