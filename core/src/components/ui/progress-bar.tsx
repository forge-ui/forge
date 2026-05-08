import { cn } from "../../lib/utils";

// ============================================================
// ProgressBar
//   color         — 8 hues, aligned to Figma fg-* primitive ramp
//   size          — sm (h-2) / md (h-3)
//   label         — optional text left of percentage
//   labelVariant  — "default" (grey medium, e.g. "Progress")
//                   "value"   (black semibold, e.g. "$400")
//   labelSize     — "xs" (text-xs) / "sm" (text-sm)
//   showPercentage
//   onDark        — render on dark surface: translucent track, white label/%
// ============================================================

const progressColors = {
  purple: "bg-fg-violet",        // Figma Purple 500
  blue:   "bg-fg-blue-500",      // Figma Blue 500
  green:  "bg-fg-green-500",     // Figma Green 500
  red:    "bg-fg-red",           // Figma Red 500
  orange: "bg-fg-red",           // alias → Figma uses orange-600 which is Red 500 hex
  yellow: "bg-fg-yellow",        // Figma Yellow 500
  cyan:   "bg-fg-cyan-500",      // Figma Cyan 500
  gray:   "bg-fg-grey-700",
} as const;

const progressTextColors = {
  purple: "text-fg-violet",
  blue:   "text-fg-blue-500",
  green:  "text-fg-green-500",
  red:    "text-fg-red",
  orange: "text-fg-red",
  yellow: "text-fg-yellow",
  cyan:   "text-fg-cyan-500",
  gray:   "text-fg-grey-700",
} as const;

const progressSizes = {
  sm: "h-2",
  md: "h-3",
} as const;

export type ProgressColor = keyof typeof progressColors;
export type ProgressSize = keyof typeof progressSizes;
export type ProgressLabelVariant = "default" | "value";
export type ProgressLabelSize = "xs" | "sm";

export function ProgressBar({
  value = 0,
  color = "purple",
  size = "sm",
  label,
  labelVariant = "default",
  labelSize = "sm",
  showPercentage = false,
  onDark = false,
}: {
  value?: number;
  color?: ProgressColor;
  size?: ProgressSize;
  label?: string;
  labelVariant?: ProgressLabelVariant;
  labelSize?: ProgressLabelSize;
  showPercentage?: boolean;
  onDark?: boolean;
}) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const labelTextSize = labelSize === "xs" ? "text-xs leading-4" : "text-sm leading-5";

  // Light mode: grey medium "Progress" / black semibold "$400".
  // Dark mode: both variants read as 75%-white with their own weight.
  const labelClass = onDark
    ? labelVariant === "value"
      ? "text-white/75 font-semibold"
      : "text-white/75 font-medium"
    : labelVariant === "value"
      ? "text-fg-black font-semibold"
      : "text-fg-grey-700 font-medium";

  // Figma keeps percentage color-matched in light mode, but switches to white on dark.
  const percentClass = onDark
    ? "text-white font-bold"
    : cn(progressTextColors[color], "font-bold");

  const trackClass = onDark ? "bg-fg-grey-200/25" : "bg-fg-grey-200";

  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      {(label || showPercentage) && (
        <div className="self-stretch inline-flex justify-start items-start gap-2">
          {label && (
            <span className={cn("flex-1 tracking-fg", labelTextSize, labelClass)}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={cn("tracking-fg", labelTextSize, percentClass)}>
              {clampedValue}%
            </span>
          )}
        </div>
      )}
      <div className={cn("self-stretch rounded-full overflow-hidden", progressSizes[size], trackClass)}>
        <div
          className={cn("rounded-full transition-all", progressSizes[size], progressColors[color])}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
