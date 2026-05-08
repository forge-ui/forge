import { cn } from "../../../lib/utils";
import { resolveColor, trendArrow, trendColorClass, rampColors, TRACK_COLOR_HEX } from "./chart-utils";
import { accentColors, type AccentColor } from "../accent-utils";

interface DonutLayer {
  /** 0-100 percent */
  value: number;
  color?: string;
  trackColor?: string;
}

interface MultilayerDonutChartProps {
  layers: DonutLayer[];
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
  accent = "purple",
  centerValue,
  trend,
  trendDirection,
  subtitle,
}: MultilayerDonutChartProps) {
  const rampFallback = rampColors(accent, layers.length);
  return (
    <div className="relative" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {layers.map((layer, i) => {
          const radius = OUTER_RADIUS - i * (STROKE_WIDTH + RING_GAP);
          if (radius <= 0) return null;
          const pct = Math.min(Math.max(layer.value, 0), 100);
          const filledEnd = START_ANGLE_CSS + (pct / 100) * SWEEP;
          const trackColor = layer.trackColor ? resolveColor(layer.trackColor) : TRACK_COLOR_HEX;
          const fillColor = resolveColor(layer.color ?? rampFallback[i]);
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
