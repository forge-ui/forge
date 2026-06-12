// ============================================================
// Shared accent colors — used by components with 3-color theming:
// purple / blue / black
//
// Used by: MediaUpload, FileUpload, SelectOption, IconSelector,
// Datepicker, SelectionControl, PageHeader, etc.
// ============================================================

export type AccentColor = "purple" | "blue" | "black";

export interface AccentConfig {
  /** Solid background (buttons, checked state, selected pill) */
  bg: string;
  /** Text color */
  text: string;
  /** Outline / border color */
  outline: string;
  /** Light tinted background (icon badges, tag bg, light button) */
  bgTint: string;
  /** Border class (for components using border instead of outline) */
  border: string;
  /** Secondary text that reads on top of accent.bg (e.g. subtitle on a solid accent card) */
  onAccentMuted: string;
  /** CSS color value matching `bg` — for SVG fill / stroke / icon color props that don't accept className */
  hex: string;
  /** Monochromatic shade ramp (deep → light), 5 stops. For multi-segment charts. */
  ramp: readonly [string, string, string, string, string];
  /** CSS color values matching `ramp` stops — for SVG conic gradients / stroke colors */
  rampHex: readonly [string, string, string, string, string];
}

/**
 * Single source of truth for 3-color accent theming.
 *
 * 颜色全部基于 forge token 系（fg-violet / fg-blue / fg-black 色阶），不混用
 * Tailwind 默认 purple/blue/indigo 调色板——保证同一个 accent 在 AppLayout 菜单、
 * popover 文本、PageHeader、按钮上视觉色完全一致。
 */
export const accentColors: Record<AccentColor, AccentConfig> = {
  purple: {
    bg: "bg-fg-violet",
    text: "text-fg-violet",
    outline: "outline-fg-violet",
    bgTint: "bg-fg-violet-100",
    border: "border-fg-violet",
    onAccentMuted: "text-fg-violet-300",
    hex: "var(--fg-violet)",
    ramp: ["bg-fg-violet-500", "bg-fg-violet-400", "bg-fg-violet-300", "bg-fg-violet-200", "bg-fg-violet-100"],
    rampHex: ["var(--fg-violet-500)", "var(--fg-violet-400)", "var(--fg-violet-300)", "var(--fg-violet-200)", "var(--fg-violet-100)"],
  },
  blue: {
    bg: "bg-fg-blue",
    text: "text-fg-blue",
    outline: "outline-fg-blue",
    bgTint: "bg-fg-blue-100",
    border: "border-fg-blue",
    onAccentMuted: "text-fg-blue-200",
    hex: "var(--fg-blue)",
    ramp: ["bg-fg-blue-700", "bg-fg-blue-500", "bg-fg-blue-400", "bg-fg-blue-300", "bg-fg-blue-100"],
    rampHex: ["var(--fg-blue-700)", "var(--fg-blue-500)", "var(--fg-blue-400)", "var(--fg-blue-300)", "var(--fg-blue-100)"],
  },
  black: {
    bg: "bg-fg-black",
    text: "text-fg-black",
    outline: "outline-fg-black",
    bgTint: "bg-fg-grey-100",
    border: "border-fg-black",
    onAccentMuted: "text-fg-grey-400",
    hex: "var(--fg-black)",
    ramp: ["bg-fg-black", "bg-fg-grey-700", "bg-fg-grey-500", "bg-fg-grey-300", "bg-fg-grey-200"],
    rampHex: ["var(--fg-black)", "var(--fg-grey-700)", "var(--fg-grey-500)", "var(--fg-grey-300)", "var(--fg-grey-200)"],
  },
};
