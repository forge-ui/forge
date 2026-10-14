"use client";

import type { MotionPreference } from "../../../lib/motion";
import { useReducedMotion } from "../../../internal/motion";
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
  onActiveIndexChange?: (index: number | undefined) => void;
  onSelect?: (index: number) => void;
  pinnedIndex?: number;
  domain?: [number, number];
  referenceValue?: number;
  referenceLabel?: string;
  motion?: MotionPreference;
  ariaLabel?: string;
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
  onActiveIndexChange, onSelect, pinnedIndex, domain, referenceValue, referenceLabel, motion = "auto", ariaLabel = "柱状图",
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
  const reduced = useReducedMotion(motion);
  const interactive = Boolean(onActiveIndexChange || onSelect);
  const theme = accentColors[accent];
  const activeColor = color ?? theme.bg;
  const resolvedInactiveColor = inactiveColor ?? activeColor;
  const maxValue = domain?.[1] ?? Math.max(...data.map((d) => d.value), 1);
  const minValue = domain?.[0] ?? 0;
  const hasLabels = showLabels && data.some(item => item.label);
  const percent = (value: number) => Math.max(0, Math.min(100, (value - minValue) / (maxValue - minValue || 1) * 100));

  return (
    <div role={interactive ? "group" : "img"} aria-label={ariaLabel} className={cn("relative inline-flex w-full items-end", height)} onPointerLeave={() => onActiveIndexChange?.(undefined)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) onActiveIndexChange?.(undefined); }}>
      {referenceValue !== undefined && <div data-chart-reference-layer className="pointer-events-none absolute inset-x-0 top-0 z-10" style={{ bottom: hasLabels ? "1.5rem" : 0 }}><span data-chart-reference className="absolute inset-x-0 h-0 border-t border-dashed border-fg-grey-400" style={{ top: `${100 - percent(referenceValue)}%` }}><span className="absolute left-0 top-0 text-xs text-fg-grey-500">{referenceLabel}</span></span></div>}
      {data.map((item, i) => {
        const isActive = i === activeIndex;
        const heightPct = percent(item.value);
        const barColor = isActive ? activeColor : resolvedInactiveColor;

        return (
          <div
            key={i}
            role={interactive ? "button" : undefined} tabIndex={interactive ? (i === (activeIndex ?? data.length - 1) ? 0 : -1) : undefined} aria-label={interactive ? `${item.label ?? i + 1}: ${item.value}` : undefined} aria-pressed={onSelect ? pinnedIndex === i : undefined}
            onPointerEnter={() => onActiveIndexChange?.(i)} onFocus={() => onActiveIndexChange?.(i)} onClick={() => onSelect?.(i)}
            onKeyDown={event => { const next = event.key === "ArrowRight" ? i + 1 : event.key === "ArrowLeft" ? i - 1 : event.key === "Home" ? 0 : event.key === "End" ? data.length - 1 : undefined; if (next !== undefined) { event.preventDefault(); const index = Math.max(0, Math.min(data.length - 1, next)); onActiveIndexChange?.(index); event.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[role="button"]')[index]?.focus(); } else if (event.key === " " || event.key === "Enter") { event.preventDefault(); onSelect?.(i); } }}
            className={cn(
              "relative flex min-w-0 flex-1 flex-col items-center justify-end",
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

            <div className="flex min-h-0 w-full flex-1 items-end justify-center">
              <div
                className={cn(
                  "max-w-[80%]", barColor,
                  barWidth === "thin"
                    ? "w-2 rounded-full"
                    : "w-8 rounded-lg",
                )}
                style={{ height: `${heightPct}%`, transition: reduced ? "none" : "height 500ms cubic-bezier(.2,.8,.2,1)" }}
              />
            </div>

            {hasLabels && (
              <span
                className={cn("mt-2 h-4 w-full shrink-0 truncate text-center", isActive ? LABEL_TEXT_ACTIVE : LABEL_TEXT)}
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
