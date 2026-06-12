/* eslint-disable @next/next/no-img-element */
import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { AltArrowUpLinear, AltArrowDownLinear, MenuDotsBold } from "solar-icon-set";

// ============================================================
// Card utilities — shared primitives for statistic & data cards.
// Figma source: "Regular Statistic Card" (node 657:107046) and sibling pages.
//
// 8-color theme matrix:
//   white   — neutral card with grey outline (no glow)
//   black   — dark card with accent glow
//   purple, blue, green, red, yellow, cyan — colored cards with accent glow
//
// All colored cards share the same semantic role: bg is the dominant color,
// text is white, trend/subtitle inherit a slightly transparent white.
// ============================================================

export type CardTheme = "white" | "black" | "purple" | "blue" | "green" | "red" | "yellow" | "cyan";

export interface CardThemeConfig {
  /** Outer wrapper background + outline */
  bg: string;
  /** Primary text (value/number) color */
  valueColor: string;
  /** Title / label color */
  titleColor: string;
  /** Trend text color (badge-like indicator next to subtitle) */
  trendColor: string;
  /** Secondary text color (subtitle/helper) */
  subtextColor: string;
  /** Accent background for icon chip (used in Icon variant) */
  iconChipBg: string;
  /** Accent text/stroke for icon chip */
  iconChipText: string;
  /** Avatar border color (should match card bg so stacked avatars
   * have a visual gap in the card's own color) */
  avatarBorder: string;
  /** Decorative glow gradient (bottom-right blob) */
  glowFrom?: string;
  /** Decorative glow gradient (top-left blob) */
  glowTo?: string;
}

export const cardThemes: Record<CardTheme, CardThemeConfig> = {
  white: {
    bg: "bg-white outline outline-1 outline-offset-[-1px] outline-fg-grey-200",
    valueColor: "text-fg-black",
    titleColor: "text-fg-grey-700",
    trendColor: "text-fg-green-500",
    subtextColor: "text-fg-grey-700",
    iconChipBg: "bg-fg-violet-100",
    iconChipText: "text-fg-violet",
    avatarBorder: "border-white",
  },
  black: {
    bg: "bg-fg-black",
    valueColor: "text-white",
    titleColor: "text-white/75",
    trendColor: "text-white",
    subtextColor: "text-white/75",
    iconChipBg: "bg-white/10",
    iconChipText: "text-white",
    avatarBorder: "border-fg-black",
    glowFrom: "from-fg-cyan-500/0 to-fg-cyan-500/25",
    glowTo: "from-fg-cyan-500/50 to-fg-cyan-500/0",
  },
  purple: {
    bg: "bg-fg-violet",
    valueColor: "text-white",
    titleColor: "text-white/75",
    trendColor: "text-white",
    subtextColor: "text-white/75",
    iconChipBg: "bg-white/15",
    iconChipText: "text-white",
    avatarBorder: "border-fg-violet",
    glowFrom: "from-fg-yellow/0 to-fg-yellow/50",
    glowTo: "from-fg-yellow/75 to-fg-yellow/0",
  },
  blue: {
    bg: "bg-fg-blue",
    valueColor: "text-white",
    titleColor: "text-white/75",
    trendColor: "text-white",
    subtextColor: "text-white/75",
    iconChipBg: "bg-white/15",
    iconChipText: "text-white",
    avatarBorder: "border-fg-blue",
    glowFrom: "from-fg-green-500/0 to-fg-green-500/50",
    glowTo: "from-fg-green-500/75 to-fg-green-500/0",
  },
  green: {
    bg: "bg-fg-green-500",
    valueColor: "text-white",
    titleColor: "text-white/75",
    trendColor: "text-white",
    subtextColor: "text-white/75",
    iconChipBg: "bg-white/15",
    iconChipText: "text-white",
    avatarBorder: "border-fg-green-500",
    glowFrom: "from-fg-yellow/0 to-fg-yellow/80",
    glowTo: "from-fg-yellow to-fg-yellow/0",
  },
  red: {
    bg: "bg-fg-red",
    valueColor: "text-white",
    titleColor: "text-white/75",
    trendColor: "text-white",
    subtextColor: "text-white/75",
    iconChipBg: "bg-white/15",
    iconChipText: "text-white",
    avatarBorder: "border-fg-red",
    glowFrom: "from-fg-violet/0 to-fg-violet/75",
    glowTo: "from-fg-violet to-fg-violet/0",
  },
  yellow: {
    bg: "bg-fg-yellow",
    valueColor: "text-white",
    titleColor: "text-white",
    trendColor: "text-white",
    subtextColor: "text-white",
    iconChipBg: "bg-white/20",
    iconChipText: "text-white",
    avatarBorder: "border-fg-yellow",
    glowFrom: "from-fg-red/0 to-fg-red/50",
    glowTo: "from-fg-red/75 to-fg-red/0",
  },
  cyan: {
    bg: "bg-fg-cyan-500",
    valueColor: "text-white",
    titleColor: "text-white/75",
    trendColor: "text-white",
    subtextColor: "text-white/75",
    iconChipBg: "bg-white/20",
    iconChipText: "text-white",
    avatarBorder: "border-fg-cyan-500",
    glowFrom: "from-fg-yellow/0 to-fg-yellow/75",
    glowTo: "from-fg-yellow to-fg-yellow/0",
  },
};

/** Resolve legacy theme aliases (dark→black, orange→red) to canonical CardTheme keys. */
export type LegacyCardTheme = "dark" | "orange";
export function resolveCardTheme(t: CardTheme | LegacyCardTheme): CardTheme {
  if (t === "dark") return "black";
  if (t === "orange") return "red";
  return t;
}

export const ALL_CARD_THEMES: readonly CardTheme[] = [
  "white", "black", "purple", "blue", "green", "red", "yellow", "cyan",
];

// ── Decorative corner glow (used by all colored themes) ──────

export function CardGlow({ theme }: { theme: CardThemeConfig }) {
  if (!theme.glowFrom) return null;
  return (
    <>
      <div className={cn("w-24 h-24 absolute right-[-32px] bottom-[-32px] bg-gradient-to-b rounded-full", theme.glowFrom)} />
      <div className={cn("w-24 h-24 absolute left-[-32px] top-[-32px] bg-gradient-to-b rounded-full", theme.glowTo)} />
    </>
  );
}

// ── Trend indicator (used in StatCard & variants) ────────────

export type TrendDirection = "up" | "down";

export function CardTrend({
  trend,
  direction = "up",
  subtitle,
  theme,
}: {
  trend?: string;
  direction?: TrendDirection;
  subtitle?: string;
  theme: CardThemeConfig;
}) {
  if (!trend && !subtitle) return null;
  return (
    <div className="self-stretch inline-flex justify-start items-center gap-1 relative z-10">
      {trend && (
        <div className="flex items-center gap-0.5">
          <span className={cn("text-sm font-bold leading-5 tracking-fg", theme.trendColor)}>
            {trend}
          </span>
          <span className={theme.trendColor}>
            {direction === "up" ? <AltArrowUpLinear size={16} /> : <AltArrowDownLinear size={16} />}
          </span>
        </div>
      )}
      {subtitle && (
        <span className={cn("text-sm font-medium leading-5 tracking-fg", theme.subtextColor)}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

// ── Icon chip / Badge (colored circle with icon) ──────────────
// `variant` controls the Badge style per Figma "Badge Type":
//   default  — uses theme's iconChipBg/Text (tinted bg + colored icon)
//   greyBg   — grey-100 bg + colored icon
//   solid    — solid colored bg + white icon
//   opacity  — colored/10 bg + colored icon
//   white    — white bg + colored icon (for colored-bg cards)

export type CardBadgeVariant = "default" | "greyBg" | "solid" | "opacity" | "white";

const badgeColorMap: Record<CardTheme, { solid: string; opacity: string; text: string }> = {
  white: { solid: "bg-fg-violet", opacity: "bg-fg-violet/10", text: "text-fg-violet" },
  black: { solid: "bg-fg-black", opacity: "bg-fg-black/10", text: "text-fg-black" },
  purple: { solid: "bg-fg-violet", opacity: "bg-fg-violet/10", text: "text-fg-violet" },
  blue: { solid: "bg-fg-blue", opacity: "bg-fg-blue/10", text: "text-fg-blue" },
  green: { solid: "bg-fg-green-500", opacity: "bg-fg-green-500/10", text: "text-fg-green-500" },
  red: { solid: "bg-fg-red", opacity: "bg-fg-red/10", text: "text-fg-red" },
  yellow: { solid: "bg-fg-yellow", opacity: "bg-fg-yellow/10", text: "text-fg-yellow" },
  cyan: { solid: "bg-fg-cyan-500", opacity: "bg-fg-cyan-500/10", text: "text-fg-cyan-500" },
};

export function CardIconChip({
  icon,
  theme,
  themeKey = "purple",
  variant = "default",
  size = 40,
}: {
  icon: ReactNode;
  theme: CardThemeConfig;
  /** The CardTheme key — needed to resolve badge color variants */
  themeKey?: CardTheme;
  variant?: CardBadgeVariant;
  size?: number;
}) {
  const colors = badgeColorMap[themeKey];
  let bg: string;
  let text: string;

  switch (variant) {
    case "greyBg":
      bg = "bg-fg-grey-100";
      text = colors.text;
      break;
    case "solid":
      bg = colors.solid;
      text = "text-white";
      break;
    case "opacity":
      bg = colors.opacity;
      text = colors.text;
      break;
    case "white":
      bg = "bg-white";
      text = colors.text;
      break;
    default:
      bg = theme.iconChipBg;
      text = theme.iconChipText;
  }

  return (
    <span
      className={cn("shrink-0 rounded-full flex items-center justify-center", bg, text)}
      style={{ width: size, height: size }}
    >
      {icon}
    </span>
  );
}

// ── Financial card theme (Debit / Credit physical-card look) ──
// Glow / gradient variants: two colored orb accents on the card body.
// Different from CardTheme because physical cards don't have a
// neutral "white" variant and use flashier orb combos.

export type FinancialTheme = "dark" | "purple" | "blue" | "yellow" | "cyan" | "green" | "orange" | "red";

export interface FinancialThemeConfig {
  bg: string;
  textColor: string;
  labelColor: string;
  /** Two blurred orb backgrounds — used in "glow" variant */
  glowOrbs: [string, string];
  /** Two gradient orbs — used in "gradient" variant */
  gradientOrbs: [string, string];
}

export const financialThemes: Record<FinancialTheme, FinancialThemeConfig> = {
  dark: {
    bg: "bg-fg-black",
    textColor: "text-white",
    labelColor: "text-white/75",
    glowOrbs: ["bg-fg-cyan-500/30", "bg-fg-violet/30"],
    gradientOrbs: ["from-fg-cyan-500/50 to-fg-cyan-500/0", "from-fg-violet/50 to-fg-violet/0"],
  },
  purple: {
    bg: "bg-fg-violet",
    textColor: "text-white",
    labelColor: "text-white/75",
    glowOrbs: ["bg-fg-yellow/40", "bg-fg-red-500/30"],
    gradientOrbs: ["from-fg-yellow/60 to-fg-yellow/0", "from-fg-red-500/50 to-fg-red-500/0"],
  },
  blue: {
    bg: "bg-fg-blue",
    textColor: "text-white",
    labelColor: "text-white/75",
    glowOrbs: ["bg-fg-green-500/30", "bg-fg-cyan-500/30"],
    gradientOrbs: ["from-fg-green-500/60 to-fg-green-500/0", "from-fg-cyan-500/50 to-fg-cyan-500/0"],
  },
  yellow: {
    bg: "bg-fg-yellow",
    textColor: "text-fg-black",
    labelColor: "text-fg-black/60",
    glowOrbs: ["bg-fg-red/30", "bg-fg-red/20"],
    gradientOrbs: ["from-fg-red/50 to-fg-red/0", "from-fg-red-500/40 to-fg-red-500/0"],
  },
  cyan: {
    bg: "bg-fg-cyan-500",
    textColor: "text-fg-black",
    labelColor: "text-fg-black/60",
    glowOrbs: ["bg-fg-blue/25", "bg-fg-green-500/25"],
    gradientOrbs: ["from-fg-blue/40 to-fg-blue/0", "from-fg-green-500/40 to-fg-green-500/0"],
  },
  green: {
    bg: "bg-fg-green-500",
    textColor: "text-white",
    labelColor: "text-white/75",
    glowOrbs: ["bg-fg-yellow/40", "bg-fg-cyan-500/30"],
    gradientOrbs: ["from-fg-yellow/60 to-fg-yellow/0", "from-fg-cyan-500/50 to-fg-cyan-500/0"],
  },
  orange: {
    bg: "bg-fg-red",
    textColor: "text-white",
    labelColor: "text-white/75",
    glowOrbs: ["bg-fg-yellow/40", "bg-fg-violet/30"],
    gradientOrbs: ["from-fg-yellow/60 to-fg-yellow/0", "from-fg-violet/50 to-fg-violet/0"],
  },
  red: {
    bg: "bg-fg-red",
    textColor: "text-white",
    labelColor: "text-white/75",
    glowOrbs: ["bg-fg-yellow/40", "bg-fg-red-500/30"],
    gradientOrbs: ["from-fg-yellow/60 to-fg-yellow/0", "from-fg-red-500/50 to-fg-red-500/0"],
  },
};

export type FinancialVariant = "glow" | "gradient" | "flat";

/** Decorative orbs layer for Debit / Credit cards */
export function FinancialOrbs({
  theme,
  variant,
}: {
  theme: FinancialThemeConfig;
  variant: FinancialVariant;
}) {
  if (variant === "glow") {
    return (
      <>
        <div className={cn("w-32 h-32 absolute -right-8 -top-8 rounded-full blur-2xl", theme.glowOrbs[0])} />
        <div className={cn("w-32 h-32 absolute -left-8 -bottom-8 rounded-full blur-2xl", theme.glowOrbs[1])} />
      </>
    );
  }
  if (variant === "gradient") {
    return (
      <>
        <div className={cn("w-32 h-32 absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-b rounded-full", theme.gradientOrbs[0])} />
        <div className={cn("w-32 h-32 absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-b rounded-full", theme.gradientOrbs[1])} />
      </>
    );
  }
  // flat
  return <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-black/20" />;
}

/** Mastercard-style two-circle logo (shared between Debit & Credit) */
export function MastercardLogo() {
  return (
    <div className="flex items-center">
      <div className="w-7 h-7 rounded-full bg-fg-red" />
      <div className="w-7 h-7 rounded-full bg-fg-red-400 -ml-3 opacity-80" />
    </div>
  );
}

// ── Avatar group (overlapping avatars, used in Image/Task/User cards) ──

export function CardAvatarGroup({
  avatars,
  theme,
  size = 40,
  max = 4,
}: {
  avatars: string[];
  theme: CardThemeConfig;
  size?: number;
  /** Maximum avatars to show before collapsing into a "+N" chip */
  max?: number;
}) {
  if (avatars.length === 0) return null;
  const visible = avatars.slice(0, max);
  const extra = avatars.length - visible.length;
  return (
    <div className="flex -space-x-2 shrink-0">
      {visible.map((src, i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={`${src}-${i}`}
          src={src}
          alt=""
          className={cn("rounded-full border-2 object-cover", theme.avatarBorder)}
          style={{ width: size, height: size }}
        />
      ))}
      {extra > 0 && (
        <span
          className={cn(
            "rounded-full border-2 flex items-center justify-center text-xs font-semibold",
            theme.avatarBorder,
            theme.iconChipBg,
            theme.iconChipText,
          )}
          style={{ width: size, height: size }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}

// ── StatCardShell — shared outer frame for statistic cards ──
// Used by LineChartStatCard / WheelChartStatCard / BarChartStatCard.
// (StatCard and ProgressStatCard use card-utils primitives directly
// because they need slightly different internal layout.)
// Provides: outer bg + glow, title row (with optional icon + action),
// value + trend row, and a right-aligned chart/widget slot.

export type CardWidth = "full" | "fixed";

export function resolveCardWidthClass(width: CardWidth | undefined, fixedWidth: string) {
  return width === "fixed" ? `${fixedWidth} max-w-full inline-flex` : "w-full min-w-0 flex";
}

export const statCardSizes = {
  sm: { wrapper: "p-5", fixedWidth: "w-64", value: "text-3xl leading-9" },
  lg: { wrapper: "p-6", fixedWidth: "w-90", value: "text-5xl leading-[60px]" },
  // `wide` fills the parent column (e.g. 1/3 of a dashboard row) and lets
  // the chartSlot stretch with flex-1. Icon is rendered in the top-right
  // chip position to mirror Figma's wide statistic cards.
  wide: { wrapper: "p-6", fixedWidth: "", value: "text-3xl leading-9" },
} as const;

export type StatCardSize = keyof typeof statCardSizes;

export function StatCardShell({
  title,
  value,
  trend,
  trendDirection = "up",
  subtitle,
  theme,
  themeKey,
  size = "sm",
  icon,
  iconVariant,
  action,
  /** Right-aligned visual (mini chart / wheel / bars / etc.) */
  chartSlot,
  /** Full-width content below the value row (e.g. progress bar) */
  footerSlot,
  width,
  className,
}: {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: TrendDirection;
  subtitle?: string;
  theme: CardThemeConfig;
  /** Required when icon is rendered as a colored badge (size="wide" or iconVariant !== "default"). */
  themeKey?: CardTheme;
  size?: StatCardSize;
  icon?: ReactNode;
  iconVariant?: CardBadgeVariant;
  action?: ReactNode;
  chartSlot?: ReactNode;
  footerSlot?: ReactNode;
  /** Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. */
  width?: CardWidth;
  className?: string;
}) {
  const sz = statCardSizes[size];
  const isWide = size === "wide";
  const iconSize = size === "lg" ? 48 : 40;
  const resolvedIconVariant: CardBadgeVariant = iconVariant ?? (isWide ? "solid" : "default");

  return (
    <div
      className={cn(
        "rounded-card flex-col justify-start items-start gap-4 overflow-hidden relative",
        resolveCardWidthClass(isWide ? "full" : width, sz.fixedWidth),
        sz.wrapper,
        theme.bg,
        className,
      )}
    >
      <CardGlow theme={theme} />

      {/* Title row (+ optional icon + action) */}
      <div className="self-stretch inline-flex justify-start items-start gap-2 relative z-10">
        {isWide ? (
          <>
            <span className={cn("flex-1 text-sm font-medium leading-5 tracking-fg truncate", theme.titleColor)}>
              {title}
            </span>
            {icon && (
              <CardIconChip
                icon={icon}
                theme={theme}
                themeKey={themeKey}
                variant={resolvedIconVariant}
                size={iconSize}
              />
            )}
            {!icon && action && <div className="shrink-0">{action}</div>}
          </>
        ) : (
          <>
            <div className="flex-1 inline-flex justify-start items-center gap-2 min-w-0">
              {icon && (
                <CardIconChip
                  icon={icon}
                  theme={theme}
                  themeKey={themeKey}
                  variant={resolvedIconVariant}
                  size={iconSize}
                />
              )}
              <span className={cn("flex-1 text-sm font-medium leading-5 tracking-fg truncate", theme.titleColor)}>
                {title}
              </span>
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </>
        )}
      </div>

      {/* Value + trend row with optional chart on the right */}
      <div className="self-stretch inline-flex justify-between items-end gap-4 relative z-10">
        <div className={cn("flex flex-col gap-2 min-w-0", isWide ? "shrink-0" : "flex-1")}>
          <div className={cn("font-semibold tracking-fg", sz.value, theme.valueColor)}>
            {value}
          </div>
          <CardTrend trend={trend} direction={trendDirection} subtitle={subtitle} theme={theme} />
        </div>
        {chartSlot && (
          <div className={cn(isWide ? "flex-1 min-w-0 self-end" : "shrink-0")}>
            {chartSlot}
          </div>
        )}
      </div>

      {footerSlot && <div className="self-stretch relative z-10">{footerSlot}</div>}
    </div>
  );
}

// ── Kebab menu button (three-dot action, used in Large Action variant) ──

export function CardKebabButton({
  theme,
  onClick,
}: {
  theme: CardThemeConfig;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 cursor-pointer shrink-0",
        theme.iconChipBg,
        theme.iconChipText,
      )}
    >
      <MenuDotsBold size={16} />
    </button>
  );
}
