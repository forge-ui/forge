import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import {
  cardThemes,
  statCardSizes,
  CardGlow,
  CardTrend,
  CardIconChip,
  CardKebabButton,
  resolveCardTheme,
  resolveCardWidthClass,
  type CardTheme,
  type CardWidth,
  type LegacyCardTheme,
  type TrendDirection,
  type StatCardSize,
} from "./card-utils";

// ============================================================
// ProgressStatCard — Figma "Progress Statistic Card" (node 4298:23575)
// Same layout as StatCard but with an inline progress bar between
// the value and the trend/subtitle row.
// ============================================================

type ProgressStatCardTheme = CardTheme | LegacyCardTheme;

export type ProgressFillColor =
  | "purple" | "blue" | "green" | "red" | "orange" | "yellow" | "cyan" | "gray";

const progressFillBg: Record<ProgressFillColor, string> = {
  purple: "bg-fg-violet",
  blue: "bg-fg-blue",
  green: "bg-fg-green-500",
  red: "bg-fg-red",
  orange: "bg-fg-red",
  yellow: "bg-fg-yellow",
  cyan: "bg-fg-cyan-500",
  gray: "bg-fg-grey-500",
};

export function ProgressStatCard({
  title,
  value,
  trend,
  trendDirection = "up",
  subtitle,
  theme = "white",
  size = "sm",
  progressValue = 0,
  progressColor = "purple",
  icon,
  action,
  onKebabClick,
  width,
  className,
}: {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: TrendDirection;
  subtitle?: string;
  theme?: ProgressStatCardTheme;
  size?: StatCardSize;
  /** 0-100 */
  progressValue?: number;
  progressColor?: ProgressFillColor;
  icon?: ReactNode;
  action?: ReactNode;
  onKebabClick?: () => void;
  /** Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. */
  width?: CardWidth;
  className?: string;
}) {
  const themeKey = resolveCardTheme(theme);
  const cfg = cardThemes[themeKey];
  const sz = statCardSizes[size];
  const isWhite = themeKey === "white";
  const isWide = size === "wide";
  const clampedProgress = Math.max(0, Math.min(100, progressValue));
  const iconSize = size === "lg" ? 48 : 40;

  const actionNode = action ?? (onKebabClick ? <CardKebabButton theme={cfg} onClick={onKebabClick} /> : null);

  return (
    <div
      className={cn(
        "rounded-card flex-col justify-start items-start gap-4 overflow-hidden relative",
        resolveCardWidthClass(isWide ? "full" : width, sz.fixedWidth),
        sz.wrapper,
        cfg.bg,
        className,
      )}
    >
      <CardGlow theme={cfg} />

      {isWide ? (
        <>
          <div className="self-stretch inline-flex justify-between items-center gap-2 relative z-10">
            <span className={cn("flex-1 text-base font-medium leading-6 tracking-fg truncate", cfg.titleColor)}>
              {title}
            </span>
            {icon ? (
              <CardIconChip
                icon={icon}
                theme={cfg}
                themeKey={themeKey}
                variant="solid"
                size={iconSize}
              />
            ) : actionNode ? (
              <div className="shrink-0">{actionNode}</div>
            ) : null}
          </div>
          <div className={cn("self-stretch font-semibold tracking-fg relative z-10", sz.value, cfg.valueColor)}>
            {value}
          </div>
        </>
      ) : (
        <div className="self-stretch inline-flex justify-start items-start gap-2 relative z-10">
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-4 min-w-0">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              {icon && <CardIconChip icon={icon} theme={cfg} themeKey={themeKey} size={iconSize} />}
              <span className={cn("flex-1 text-base font-medium leading-6 tracking-fg truncate", cfg.titleColor)}>
                {title}
              </span>
            </div>
            <div className={cn("self-stretch font-semibold tracking-fg", sz.value, cfg.valueColor)}>
              {value}
            </div>
          </div>
          {actionNode && <div className="shrink-0">{actionNode}</div>}
        </div>
      )}

      <div className="self-stretch relative z-10">
        <div className={cn("w-full h-2 rounded-full", isWhite ? "bg-fg-grey-200" : "bg-white/25")}>
          <div
            className={cn("h-2 rounded-full", progressFillBg[progressColor])}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      </div>

      <CardTrend trend={trend} direction={trendDirection} subtitle={subtitle} theme={cfg} />
    </div>
  );
}
