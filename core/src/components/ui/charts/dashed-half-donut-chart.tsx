import { resolveColor, ChartCenterText, rampColors, TRACK_COLOR_HEX } from "./chart-utils";
import { type AccentColor } from "../accent-utils";

interface DashedHalfDonutSegment {
  value: number;
  color?: string;
}

interface DashedHalfDonutChartProps {
  segments: DashedHalfDonutSegment[];
  accent?: AccentColor;
  centerValue?: string;
  trend?: string;
  trendDirection?: "up" | "down";
  subtitle?: string;
  /** Optional track color. Defaults to accent's lightest ramp stop. */
  trackColor?: string;
}

const RADIUS = 110;
const STROKE_WIDTH = 16;
const CENTER = 130;
// With strokeLinecap="round", each round cap extends by STROKE_WIDTH/2.
// Gap between two adjacent dashes visually = DASH_GAP - STROKE_WIDTH.
// Keep DASH_GAP > STROKE_WIDTH to keep dashes separated.
const DASH_LENGTH = 2;
const DASH_GAP = 20;

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function DashedHalfDonutChart({
  segments,
  accent = "purple",
  centerValue,
  trend,
  trendDirection,
  subtitle,
  trackColor,
}: DashedHalfDonutChartProps) {
  const rampFallback = rampColors(accent, segments.length);
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  // When values sum to ≤100, treat as absolute percent (leave remainder as track).
  // Otherwise normalize so segments fill the half-circle.
  const useNormalized = total > 100;
  const arcs: { d: string; color: string }[] = [];

  let cumulative = 0;
  segments.forEach((segment, i) => {
    const pct = useNormalized
      ? (total > 0 ? segment.value / total : 0)
      : segment.value / 100;
    const startAngle = 180 + cumulative * 180;
    const endAngle = 180 + (cumulative + pct) * 180;
    if (endAngle > startAngle) {
      arcs.push({
        d: describeArc(CENTER, CENTER, RADIUS, startAngle, endAngle),
        color: resolveColor(segment.color ?? rampFallback[i]),
      });
    }
    cumulative += pct;
  });

  if (cumulative < 1) {
    arcs.push({
      d: describeArc(CENTER, CENTER, RADIUS, 180 + cumulative * 180, 360),
      color: trackColor ? resolveColor(trackColor) : TRACK_COLOR_HEX,
    });
  }

  return (
    <div className="flex w-full max-w-64 flex-col items-center">
      <div className="relative w-full aspect-[13/7] overflow-hidden">
        <svg
          viewBox="0 0 260 140"
          className="absolute inset-0 h-full w-full"
        >
          {arcs.map((arc, i) => (
            <path
              key={i}
              d={arc.d}
              fill="none"
              stroke={arc.color}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={`${DASH_LENGTH} ${DASH_GAP}`}
            />
          ))}
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 flex flex-col items-center text-center">
          <ChartCenterText centerValue={centerValue} trend={trend} trendDirection={trendDirection} />
        </div>
      </div>
      {subtitle && <div className="mt-2 text-sm text-fg-grey-700">{subtitle}</div>}
    </div>
  );
}
