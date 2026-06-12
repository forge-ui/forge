import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { cardThemes, CardGlow, resolveCardTheme, resolveCardWidthClass, type CardTheme, type CardWidth, type LegacyCardTheme } from "./card-utils";

// ============================================================
// ProgressCard — Figma "Progress Card" (node 304:56383)
// Circular progress ring + breakdown legend.
// Uses cardThemes for bg/text/glow (8-color matrix).
// ============================================================

type ProgressCardTheme = CardTheme | LegacyCardTheme;

// Map from cardTheme bg to the "solid" bg class needed for the
// inner circle (the donut hole must match the card bg exactly).
const innerBgMap: Record<CardTheme, string> = {
  white: "bg-white",
  black: "bg-fg-black",
  purple: "bg-fg-violet",
  blue: "bg-fg-blue",
  green: "bg-fg-green-500",
  red: "bg-fg-red",
  yellow: "bg-fg-yellow",
  cyan: "bg-fg-cyan-500",
};

export function ProgressCard({
  title,
  value,
  subtitle,
  theme = "white",
  progress,
  progressColor,
  items,
  action,
  width,
  className,
}: {
  title: string;
  value: string;
  subtitle: string;
  theme?: ProgressCardTheme;
  /** 0-100 */
  progress: number;
  /** CSS color for the conic-gradient fill (e.g. "var(--fg-violet)") */
  progressColor: string;
  items: { label: string; value: string; color: string }[];
  action?: ReactNode;
  /** Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. */
  width?: CardWidth;
  className?: string;
}) {
  const themeKey = resolveCardTheme(theme);
  const cfg = cardThemes[themeKey];
  const isWhite = themeKey === "white";
  const trackColor = isWhite ? "var(--fg-grey-200)" : "rgba(255,255,255,0.2)";

  return (
    <div
      className={cn(
        "p-5 rounded-card flex-col gap-5 overflow-hidden relative",
        resolveCardWidthClass(width, "w-80"),
        cfg.bg,
        className,
      )}
    >
      <CardGlow theme={cfg} />

      <div className="flex items-center justify-between relative z-10">
        <span className={cn("text-base font-medium leading-6 tracking-fg", cfg.titleColor)}>{title}</span>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="flex items-center justify-center relative z-10">
        <div className="relative w-40 h-40">
          <div
            className="w-full h-full rounded-full"
            style={{ background: `conic-gradient(${progressColor} ${progress * 3.6}deg, ${trackColor} ${progress * 3.6}deg)` }}
          />
          <div className={cn("absolute inset-3 rounded-full flex flex-col items-center justify-center", innerBgMap[themeKey])}>
            <span className={cn("text-display-l font-semibold tracking-fg", cfg.valueColor)}>{value}</span>
            <span className={cn("text-sm leading-5", cfg.titleColor)}>{subtitle}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        {items.map((item, i) => (
          <div key={`${item.label}-${i}`} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className={cn("text-sm leading-5", cfg.titleColor)}>{item.label}</span>
            </div>
            <span className={cn("text-sm font-medium leading-5", cfg.valueColor)}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
