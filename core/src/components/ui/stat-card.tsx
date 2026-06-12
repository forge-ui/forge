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
  type CardBadgeVariant,
  type CardWidth,
  type TrendDirection,
  type StatCardSize,
} from "./card-utils";

// ============================================================
// StatCard — Figma "Regular Statistic Card" (node 657:107046)
// Variants:
//   size: sm (258×152) | lg (360×264) | wide (column-filling)
//   theme: 8 colors via card-utils
//   action: none | button | kebab (lg only — Figma "Action=Button / Kebab Menu")
//   icon (optional) — renders colored circle chip next to title (sm/lg)
//                     or in the top-right (wide)
// ============================================================

type LegacyTheme = "dark" | "orange";
type StatCardTheme = CardTheme | LegacyTheme;

export function StatCard({
  title,
  value,
  trend,
  trendDirection = "up",
  subtitle,
  theme = "white",
  size = "sm",
  icon,
  badgeVariant,
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
  theme?: StatCardTheme;
  size?: StatCardSize;
  icon?: ReactNode;
  /** Badge style for the icon chip. Defaults to the theme's iconChipBg in
   * sm/lg, and to "opacity" (themed 10% bg + colored icon) in wide. */
  badgeVariant?: CardBadgeVariant;
  /** Custom action slot (e.g. button). Takes priority over onKebabClick. */
  action?: ReactNode;
  /** If set, renders the built-in kebab-menu button. */
  onKebabClick?: () => void;
  /** Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. */
  width?: CardWidth;
  className?: string;
}) {
  const themeKey = resolveCardTheme(theme);
  const cfg = cardThemes[themeKey];
  const sz = statCardSizes[size];
  const isWide = size === "wide";
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
                variant={badgeVariant ?? "opacity"}
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
              {icon && <CardIconChip icon={icon} theme={cfg} themeKey={themeKey} variant={badgeVariant} size={iconSize} />}
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

      <CardTrend trend={trend} direction={trendDirection} subtitle={subtitle} theme={cfg} />
    </div>
  );
}
