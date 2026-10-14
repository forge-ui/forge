"use client";

import { useAnimatedChartValues } from "../../../internal/animated-chart-values";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { resolveColor, trendArrow, trendColorClass, rampColors, TRACK_COLOR_HEX } from "./chart-utils";
import { type AccentColor } from "../accent-utils";

interface DonutLayer {
  /** Percent; values above 100 are rendered as an additional lap in full-circle mode. */
  value: number;
  color?: string;
  trackColor?: string;
}

interface MultilayerDonutChartProps {
  layers: DonutLayer[];
  sweep?: 270 | 360;
  motion?: MotionPreference;
  activeIndex?: number;
  ariaLabel?: string;
  accent?: AccentColor;
  centerValue?: string;
  trend?: string;
  trendDirection?: "up" | "down";
  subtitle?: string;
}

// Geometry: 240×240 container, 270° sweep (C-shape opening at south-east).
const SIZE = 240;
const CENTER = SIZE / 2;
const START_ANGLE_CSS = 135; // south-east
const SWEEP = 270; // degrees
const END_ANGLE_CSS = START_ANGLE_CSS + SWEEP; // 405 = 45°
const STROKE_WIDTH = 10;
const RING_GAP = 6;
const OUTER_RADIUS = (SIZE - STROKE_WIDTH) / 2; // 115

// Convert CSS angle (0° = top, clockwise) to SVG cartesian.
function polarToCartesian(cx: number, cy: number, r: number, cssAngle: number) {
  const svgAngle = cssAngle - 90;
  const rad = (svgAngle * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startCss: number, endCss: number) {
  const start = polarToCartesian(cx, cy, r, startCss);
  const end = polarToCartesian(cx, cy, r, endCss);
  const largeArc = Math.abs(endCss - startCss) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export function MultilayerDonutChart({
  layers,
  sweep = 270, motion = "auto", activeIndex, ariaLabel = "多层环形图",
  accent = "purple",
  centerValue,
  trend,
  trendDirection,
  subtitle,
}: MultilayerDonutChartProps) {
  const animatedValues = useAnimatedChartValues(layers.map(layer => layer.value), motion);
  const rampFallback = rampColors(accent, layers.length);
  return (
    <div className="relative" style={{ width: SIZE, height: SIZE }}>
      <svg role="img" aria-label={ariaLabel} width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {layers.map((layer, i) => {
          const radius = OUTER_RADIUS - i * (STROKE_WIDTH + RING_GAP);
          if (radius <= 0) return null;
          const value = Math.max(0, animatedValues[i] ?? layer.value);
          const pct = Math.min(value, 100);
          const filledEnd = START_ANGLE_CSS + (pct / 100) * SWEEP;
          const trackColor = layer.trackColor ? resolveColor(layer.trackColor) : TRACK_COLOR_HEX;
          const fillColor = resolveColor(layer.color ?? rampFallback[i]);
          if (sweep === 360) { const overflow = value > 100 ? value % 100 || 100 : 0; const angle = (value / 100) * Math.PI * 2 - Math.PI / 2; return <g key={i} data-ring-value={layer.value} style={{ opacity: activeIndex !== undefined && activeIndex !== i ? .3 : 1 }}>
            <circle cx={CENTER} cy={CENTER} r={radius} fill="none" stroke={trackColor} strokeWidth={STROKE_WIDTH} />
            <circle data-ring-lap="first" cx={CENTER} cy={CENTER} r={radius} fill="none" stroke={fillColor} strokeWidth={STROKE_WIDTH} pathLength="100" strokeDasharray={`${pct} 100`} transform={`rotate(-90 ${CENTER} ${CENTER})`} strokeLinecap="round" />
            {overflow > 0 && <circle data-ring-lap="overflow" cx={CENTER} cy={CENTER} r={radius} fill="none" stroke={fillColor} strokeOpacity=".65" strokeWidth={STROKE_WIDTH + 3} pathLength="100" strokeDasharray={`${overflow} 100`} transform={`rotate(-90 ${CENTER} ${CENTER})`} strokeLinecap="round" />}
            {value > 0 && <circle cx={CENTER + Math.cos(angle) * radius} cy={CENTER + Math.sin(angle) * radius} r={STROKE_WIDTH / 2} fill={fillColor} stroke="var(--fg-white)" strokeWidth="1" />}
          </g>; }
          return (
            <g key={i}>
              <path
                d={describeArc(CENTER, CENTER, radius, START_ANGLE_CSS, END_ANGLE_CSS)}
                fill="none"
                stroke={trackColor}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
              />
              {pct > 0 && (
                <path
                  d={describeArc(CENTER, CENTER, radius, START_ANGLE_CSS, filledEnd)}
                  fill="none"
                  stroke={fillColor}
                  strokeWidth={STROKE_WIDTH}
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}
      </svg>
      {(centerValue || trend || subtitle) && (
        <div
          className="absolute flex flex-col items-start gap-0.5"
          style={{ left: "55%", top: "52%" }}
        >
          {centerValue && (
            <div className="text-xl font-semibold leading-7 tracking-fg text-fg-black whitespace-nowrap">
              {centerValue}
            </div>
          )}
          {trend && (
            <div
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-bold leading-4 tracking-fg",
                trendColorClass(trendDirection),
              )}
            >
              {trend}
              <span>{trendArrow(trendDirection)}</span>
            </div>
          )}
          {subtitle && (
            <div className="text-xs font-normal leading-4 tracking-fg text-fg-grey-700 whitespace-nowrap">
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
