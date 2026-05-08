import { cn } from "../../../lib/utils";
import { rampColors } from "./chart-utils";
import { type AccentColor } from "../accent-utils";

interface Bubble {
  /** Percentage value (used for size + text inside bubble) */
  value: number;
  label?: string;
  color?: string;
}

interface BubbleChartProps {
  bubbles: Bubble[];
  accent?: AccentColor;
  /** Container height. Default 240. */
  height?: number;
}

// Hard-coded layouts per bubble count (matches figma `data="N"` positions).
// Positions are { x, y } top-left of each bubble; sizes in px.
type LayoutPreset = { sizes: number[]; positions: { x: number; y: number }[] };
const LAYOUTS: Record<number, LayoutPreset> = {
  2: {
    sizes: [208, 160],
    positions: [
      { x: 0, y: 24 },
      { x: 142, y: 46 },
    ],
  },
  3: {
    sizes: [208, 128, 64],
    positions: [
      { x: 0, y: 24 },
      { x: 178, y: 49 },
      { x: 169, y: 158 },
    ],
  },
  4: {
    sizes: [208, 128, 64, 36],
    positions: [
      { x: 0, y: 24 },
      { x: 178, y: 49 },
      { x: 169, y: 158 },
      { x: 286, y: 138 },
    ],
  },
};

export function BubbleChart({ bubbles, accent = "purple", height = 240 }: BubbleChartProps) {
  const count = bubbles.length;
  const layout = LAYOUTS[count] ?? LAYOUTS[4];

  // Sort by value desc so largest gets largest preset slot.
  const sorted = [...bubbles].sort((a, b) => b.value - a.value);
  const rampFallback = rampColors(accent, sorted.length);

  return (
    <div className="relative w-full" style={{ height }}>
      {sorted.map((bubble, i) => {
        const size = layout.sizes[i] ?? 32;
        const pos = layout.positions[i] ?? { x: 0, y: 0 };
        const color = bubble.color ?? rampFallback[i];
        return (
          <div
            key={i}
            className={cn(
              "absolute rounded-full flex items-center justify-center text-white font-semibold leading-8 tracking-fg",
              color,
            )}
            style={{
              width: size,
              height: size,
              left: pos.x,
              top: pos.y,
              fontSize: size >= 128 ? 20 : size >= 64 ? 14 : 11,
            }}
          >
            {bubble.value}%
          </div>
        );
      })}
    </div>
  );
}
