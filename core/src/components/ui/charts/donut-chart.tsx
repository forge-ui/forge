"use client";

import { ringFractions } from "../../../internal/chart-geometry";
import { useAnimatedChartValues } from "../../../internal/animated-chart-values";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { buildConicGradient, ChartCenterText, rampColors, resolveColor } from "./chart-utils";
import { type AccentColor } from "../accent-utils";

interface DonutSegment {
  value: number;
  label?: string;
  disabled?: boolean;
  /** Optional override. When omitted, derived from `accent` ramp. */
  color?: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  /** Individually focusable segments normalized to the included total. */
  interactive?: boolean;
  activeIndex?: number;
  onActiveIndexChange?: (index: number | undefined) => void;
  onSegmentToggle?: (index: number) => void;
  motion?: MotionPreference;
  ariaLabel?: string;
  /** Accent color drives segment colors when not explicitly set. Default "blue". */
  accent?: AccentColor;
  centerValue?: string;
  trend?: string;
  trendDirection?: "up" | "down";
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  /** Optional track color for unfilled remainder. Defaults to gray (fg-grey-200). */
  trackColor?: string;
}

const sizeMap = {
  sm: { outer: "max-w-40", inner: "w-3/5 h-3/5" },
  md: { outer: "max-w-60", inner: "w-3/5 h-3/5" },
  lg: { outer: "max-w-72", inner: "w-3/5 h-3/5" },
};

export function DonutChart({
  segments,
  interactive = false, activeIndex, onActiveIndexChange, onSegmentToggle, motion = "auto", ariaLabel = "分类占比",
  accent = "blue",
  centerValue,
  trend,
  trendDirection,
  subtitle,
  size = "md",
  trackColor,
}: DonutChartProps) {
  const fractions = ringFractions(segments.map(segment => segment.disabled ? 0 : segment.value));
  const animated = useAnimatedChartValues(fractions.flatMap(part => [part.start, part.fraction]), motion);
  const s = sizeMap[size];
  const rampFallback = rampColors(accent, segments.length);
  const resolved = segments.map((seg, i) => ({
    value: seg.value,
    color: seg.color ?? rampFallback[i],
  }));
  if (interactive) return <div className="flex w-full flex-col items-center"><div className={cn("relative w-full aspect-square", s.outer)}>
    <svg viewBox="0 0 216 216" className="h-full w-full overflow-visible" role="group" aria-label={ariaLabel} onPointerLeave={() => onActiveIndexChange?.(undefined)}>
      <circle cx="108" cy="108" r="80" fill="none" stroke={trackColor ? resolveColor(trackColor) : "var(--fg-grey-200)"} strokeWidth="24" />
      {segments.map((segment, i) => { const start = animated[i * 2] ?? 0, fraction = animated[i * 2 + 1] ?? 0, angle = (start + fraction / 2) * Math.PI * 2 - Math.PI / 2; return <circle key={i} data-chart-segment={i} role="button" tabIndex={segment.disabled ? -1 : 0} aria-label={`${segment.label ?? i + 1}: ${segment.value}`} aria-pressed={!segment.disabled} cx="108" cy="108" r="80" fill="none" stroke={resolveColor(segment.color ?? rampFallback[i])} strokeWidth="24" pathLength="100" strokeDasharray={`${Math.max(0, fraction * 100 - .8)} 100`} strokeDashoffset={-start * 100} transform={`translate(${activeIndex === i ? Math.cos(angle) * 6 : 0} ${activeIndex === i ? Math.sin(angle) * 6 : 0}) rotate(-90 108 108)`} style={{ cursor: "pointer", opacity: activeIndex !== undefined && activeIndex !== i ? .45 : 1 }} onPointerEnter={() => onActiveIndexChange?.(i)} onFocus={() => onActiveIndexChange?.(i)} onBlur={() => onActiveIndexChange?.(undefined)} onClick={() => onSegmentToggle?.(i)} onKeyDown={event => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); onSegmentToggle?.(i); } }} />; })}
    </svg><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><ChartCenterText centerValue={centerValue} trend={trend} trendDirection={trendDirection} /></div>
  </div>{subtitle && <div className="mt-2 text-sm text-fg-grey-700">{subtitle}</div>}</div>;
  return (
    <div className="flex w-full flex-col items-center">
      <div className={cn("relative w-full aspect-square rounded-full", s.outer)} style={{ background: buildConicGradient(resolved, { trackColor }) }}>
        <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white", s.inner)} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <ChartCenterText centerValue={centerValue} trend={trend} trendDirection={trendDirection} />
        </div>
      </div>
      {subtitle && <div className="mt-2 text-sm text-fg-grey-700">{subtitle}</div>}
    </div>
  );
}
