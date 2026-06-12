import { useId } from "react";
import { cn } from "../../../lib/utils";
import { ChartTooltip, type ChartTooltipItem } from "./chart-tooltip";
import { resolveColor, rampColors } from "./chart-utils";
import { type AccentColor } from "../accent-utils";

interface LineSeries {
  data: number[];
  /** Optional override. When omitted, derived from `accent` ramp. */
  color?: string;
  fillArea?: boolean;
}

interface SmoothLineChartProps {
  series: LineSeries[];
  accent?: AccentColor;
  activeIndex?: number;
  showTooltip?: boolean;
  tooltipItems?: ChartTooltipItem[];
  showYAxis?: boolean;
  yAxisLabels?: string[];
  xAxisLabels?: string[];
  /** Optional [min, max] for y-axis. Default: auto from data. */
  yDomain?: [number, number];
  height?: string;
}

const VIEWBOX_W = 400;
const VIEWBOX_H = 120;

function computePoints(data: number[], min: number, max: number): [number, number][] {
  const n = data.length;
  if (n < 2) return [];
  const range = max - min || 1;
  return data.map((v, i) => [
    (i / (n - 1)) * VIEWBOX_W,
    VIEWBOX_H - ((v - min) / range) * VIEWBOX_H,
  ]);
}

// Catmull-Rom → Cubic Bezier. /6 = standard uniform CR (tension 0.5), matches
// Figma's smooth wave shape.
const TENSION_DIVISOR = 6;
function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / TENSION_DIVISOR;
    const cp1y = p1[1] + (p2[1] - p0[1]) / TENSION_DIVISOR;
    const cp2x = p2[0] - (p3[0] - p1[0]) / TENSION_DIVISOR;
    const cp2y = p2[1] - (p3[1] - p1[1]) / TENSION_DIVISOR;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export function SmoothLineChart({
  series,
  accent = "purple",
  activeIndex,
  showTooltip = false,
  tooltipItems,
  showYAxis = false,
  yAxisLabels,
  xAxisLabels,
  yDomain,
  height = "h-32",
}: SmoothLineChartProps) {
  const gradientId = useId();
  const allValues = series.flatMap((s) => s.data);
  const autoMax = allValues.length > 0 ? Math.max(...allValues) : 1;
  const autoMin = allValues.length > 0 ? Math.min(...allValues) : 0;
  const [min, max] = yDomain ?? [autoMin, autoMax];
  const rampFallback = rampColors(accent, series.length);

  const seriesGeometry = series.map((s, i) => {
    const points = computePoints(s.data, min, max);
    const linePath = smoothPath(points);
    const areaPath = points.length
      ? `${linePath} L ${points[points.length - 1][0]} ${VIEWBOX_H} L ${points[0][0]} ${VIEWBOX_H} Z`
      : "";
    return { points, linePath, areaPath, color: resolveColor(s.color ?? rampFallback[i]), fillArea: s.fillArea ?? true };
  });

  const primary = seriesGeometry[0];
  const markerPoint =
    activeIndex != null && primary?.points[activeIndex] ? primary.points[activeIndex] : null;

  const chartArea = (
    <div className={cn("relative w-full", height)}>
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          {seriesGeometry.map((g, i) => (
            <linearGradient key={i} id={`${gradientId}-${i}`} x1="0" y1="0" x2="0" y2="1">
              {/* Figma: bg-gradient-to-b from-{color}/5 to-{color}/0 */}
              <stop offset="0%" stopColor={g.color} stopOpacity="0.05" />
              <stop offset="100%" stopColor={g.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {seriesGeometry.map((g, i) => (
          <g key={i}>
            {g.fillArea && <path d={g.areaPath} fill={`url(#${gradientId}-${i})`} />}
            <path
              d={g.linePath}
              stroke={g.color}
              strokeWidth="2"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>

      {markerPoint && showTooltip && (
        <>
          <div
            className="pointer-events-none absolute bottom-0 top-0 w-5 -translate-x-1/2 rounded-sm bg-gradient-to-b from-transparent to-fg-violet-100/70"
            style={{ left: `${(markerPoint[0] / VIEWBOX_W) * 100}%` }}
          />
          <div
            className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
            style={{
              left: `${(markerPoint[0] / VIEWBOX_W) * 100}%`,
              top: `${(markerPoint[1] / VIEWBOX_H) * 100}%`,
              backgroundColor: primary.color,
            }}
          />
          {tooltipItems && tooltipItems.length > 0 && (
            <div
              className="absolute -translate-x-1/2 -translate-y-full pb-2"
              style={{ left: `${(markerPoint[0] / VIEWBOX_W) * 100}%`, top: `${(markerPoint[1] / VIEWBOX_H) * 100}%` }}
            >
              <ChartTooltip items={tooltipItems} />
            </div>
          )}
        </>
      )}
    </div>
  );

  if (!showYAxis && !xAxisLabels) return chartArea;

  return (
    <div className="flex w-full">
      {showYAxis && yAxisLabels && (
        <div className="mr-3 flex flex-col justify-between py-1">
          {yAxisLabels.map((label, i) => (
            <span key={i} className="text-right text-xs leading-4 tracking-fg text-fg-grey-500">
              {label}
            </span>
          ))}
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="relative">
          {showYAxis && yAxisLabels && (
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              {yAxisLabels.map((_, i) => (
                <div key={i} className="border-t border-fg-grey-200" />
              ))}
            </div>
          )}
          {chartArea}
        </div>
        {xAxisLabels && (
          <div className="mt-2 flex justify-between">
            {xAxisLabels.map((label, i) => {
              const isActive = i === activeIndex;
              return (
                <span
                  key={i}
                  className={cn(
                    "text-xs leading-4 tracking-fg",
                    isActive ? "font-bold" : "text-fg-grey-500",
                  )}
                  style={isActive && primary ? { color: primary.color } : undefined}
                >
                  {label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
