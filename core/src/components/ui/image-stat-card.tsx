import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import {
  cardThemes,
  CardGlow,
  CardTrend,
  CardKebabButton,
  CardAvatarGroup,
  resolveCardTheme,
  resolveCardWidthClass,
  type CardTheme,
  type CardWidth,
  type LegacyCardTheme,
  type TrendDirection,
} from "./card-utils";

// ============================================================
// ImageStatCard — Figma "Image Statistic Card" (node 6356:20972)
// Large card with subtitle below title, value + trend + avatars.
// `lg` controls the internal scale; width defaults to filling the parent column.
// Use `width="fixed"` for the legacy 360px Figma showcase width.
// Optional `backgroundImage` renders a subject photo absolutely on the
// right side of the card with text laid out on top.
// ============================================================

type ImageStatCardTheme = CardTheme | LegacyCardTheme;

export type ImageStatCardSize = "lg" | "wide";

export function ImageStatCard({
  title,
  subtitle,
  value,
  trend,
  trendDirection = "up",
  trendSubtitle,
  theme = "white",
  size = "lg",
  action,
  onKebabClick,
  avatars = [],
  backgroundImage,
  backgroundImageAlt = "",
  width,
  className,
}: {
  title: string;
  /** Secondary text below the title (e.g. date range "2 Jul - Today") */
  subtitle?: string;
  value: string;
  trend?: string;
  trendDirection?: TrendDirection;
  /** Secondary text next to trend (e.g. "+$150 today") */
  trendSubtitle?: string;
  theme?: ImageStatCardTheme;
  size?: ImageStatCardSize;
  /** Custom action slot (e.g. external-link button). Takes priority over onKebabClick. */
  action?: ReactNode;
  onKebabClick?: () => void;
  /** Bottom-right overlapping avatar group. Hidden when `backgroundImage` is set. */
  avatars?: string[];
  /** Subject photo source (e.g. team-of-the-month portrait). Pinned to the
   * card's bottom-right; text content stays in the left half above it. */
  backgroundImage?: string;
  backgroundImageAlt?: string;
  /** Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. */
  width?: CardWidth;
  className?: string;
}) {
  const themeKey = resolveCardTheme(theme);
  const cfg = cardThemes[themeKey];
  const isWide = size === "wide";
  const hasImage = Boolean(backgroundImage);
  // Use default tailwind tokens (not arbitrary values) so the CSS is
  // generated even when this component is consumed from node_modules.
  // min-h-80 = 320px, min-h-72 = 288px.
  const minHeight = hasImage ? (isWide ? "min-h-80" : "min-h-72") : "";

  const actionNode = action ?? (onKebabClick ? <CardKebabButton theme={cfg} onClick={onKebabClick} /> : null);

  return (
    <div
      className={cn(
        "rounded-card flex-col justify-between gap-6 overflow-hidden relative p-6",
        resolveCardWidthClass(isWide ? "full" : width, "w-90"),
        minHeight,
        cfg.bg,
        className,
      )}
    >
      <CardGlow theme={cfg} />

      {hasImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={backgroundImage}
          alt={backgroundImageAlt}
          // Inline style for height/maxWidth — arbitrary tailwind values can be
          // missed when this component is consumed from node_modules and the
          // host app doesn't re-scan the dist on every change.
          style={{ height: "70%", maxWidth: "55%", width: "auto" }}
          className="absolute right-3 bottom-0 object-contain object-bottom pointer-events-none select-none z-0"
          aria-hidden={backgroundImageAlt ? undefined : true}
        />
      )}

      {/* Top row: title + subtitle left / action right */}
      <div className="self-stretch inline-flex justify-between items-start gap-2 relative z-10">
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <span className={cn("text-sm font-semibold leading-5 tracking-fg truncate", cfg.valueColor)}>
            {title}
          </span>
          {subtitle && (
            <span className={cn("text-sm font-medium leading-5 tracking-fg", cfg.titleColor)}>
              {subtitle}
            </span>
          )}
        </div>
        {actionNode && <div className="shrink-0">{actionNode}</div>}
      </div>

      {/* Bottom row: value + trend left / avatars right */}
      <div className="self-stretch inline-flex justify-between items-end gap-3 relative z-10">
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <div className={cn("text-4xl font-semibold leading-11 tracking-fg", cfg.valueColor)}>
            {value}
          </div>
          <CardTrend
            trend={trend}
            direction={trendDirection}
            subtitle={trendSubtitle}
            theme={cfg}
          />
        </div>
        {!hasImage && <CardAvatarGroup avatars={avatars} theme={cfg} size={40} />}
      </div>
    </div>
  );
}
