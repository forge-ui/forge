import { cn } from "../../../lib/utils";
import { accentColors, type AccentColor } from "../accent-utils";

interface ChartLegendItemProps {
  /** Tailwind bg-* class override. When omitted, uses `accent` + `shade` index into ramp. */
  color?: string;
  accent?: AccentColor;
  /** Ramp index (0 = deepest, 4 = lightest). Default 0. */
  shade?: 0 | 1 | 2 | 3 | 4;
  label: string;
  value: string;
}

/**
 * Inline legend row: • Label ······· $value
 * Used under donut charts as a compact label/value list.
 */
export function ChartLegendItem({ color, accent = "purple", shade = 0, label, value }: ChartLegendItemProps) {
  const dotColor = color ?? accentColors[accent].ramp[shade];
  return (
    <div className="self-stretch inline-flex items-center gap-2">
      <div className={cn("w-3 h-3 rounded-full shrink-0", dotColor)} />
      <span className="flex-1 text-sm font-medium leading-5 tracking-fg text-fg-grey-700">
        {label}
      </span>
      <span className="text-base font-semibold leading-6 tracking-fg text-fg-black">
        {value}
      </span>
    </div>
  );
}
