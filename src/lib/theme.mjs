// Theme generator logic for /docs/theme. Pure functions, shared by the page and scripts/test-theme.mjs.
// A theme only overrides variables core already reads at runtime: the --fg-blue-* scale (every
// blue/accent utility resolves through it), Tailwind's --radius-* scale, and the two font variables.
import { clampChroma, converter, formatHex } from "culori";

const toOklch = converter("oklch");

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export const COLOR_PRESETS = [
  { id: "forge", label: "Forge 蓝", value: "#3553FF" },
  { id: "violet", label: "紫", value: "#7239EA" },
  { id: "teal", label: "青", value: "#0E9F9A" },
  { id: "green", label: "绿", value: "#16A34A" },
  { id: "orange", label: "橙", value: "#EA580C" },
  { id: "rose", label: "玫红", value: "#E11D48" },
];

// Tailwind v4 defaults in px; xs and card come from core tokens.css.
export const BASE_RADIUS = { xs: 4, sm: 4, md: 6, lg: 8, xl: 12, "2xl": 16, "3xl": 24, card: 20 };

export const RADIUS_PRESETS = [
  { id: "none", label: "直角", factor: 0 },
  { id: "compact", label: "紧凑", factor: 0.5 },
  { id: "default", label: "默认", factor: 1 },
  { id: "round", label: "圆润", factor: 1.5 },
];

const CJK_FALLBACK = '"PingFang SC", "Microsoft YaHei", sans-serif';

export const FONT_PRESETS = [
  { id: "default", label: "Manrope（默认）", sans: null, display: null, note: "" },
  { id: "system", label: "系统字体", sans: `system-ui, -apple-system, ${CJK_FALLBACK}`, display: `system-ui, -apple-system, ${CJK_FALLBACK}`, note: "不用加载任何字体文件。" },
  { id: "inter", label: "Inter", sans: `"Inter", ${CJK_FALLBACK}`, display: `"Inter", ${CJK_FALLBACK}`, note: "需要自己加载 Inter，例如 @fontsource-variable/inter，字体名改成 \"Inter Variable\"。" },
  { id: "noto", label: "思源黑体", sans: `"Noto Sans SC", "Source Han Sans SC", ${CJK_FALLBACK}`, display: `"Noto Sans SC", "Source Han Sans SC", ${CJK_FALLBACK}`, note: "需要自己加载 Noto Sans SC；没装时退回系统中文字体。" },
];

export const DEFAULT_THEME = { color: "#3553FF", radius: "default", font: "default" };

export function parseScale(css, name = "blue") {
  const scale = Object.fromEntries([...css.matchAll(new RegExp(`--fg-${name}-(\\d+):\\s*(#[0-9a-fA-F]{6})`, "g"))].map(match => [Number(match[1]), match[2].toUpperCase()]));
  for (const step of SCALE_STEPS) if (!scale[step]) throw new Error(`tokens.css is missing --fg-${name}-${step}`);
  return scale;
}

export function normalizeHex(value) {
  const match = String(value).trim().match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!match) return null;
  const hex = match[1].length === 3 ? [...match[1]].map(char => char + char).join("") : match[1];
  return "#" + hex.toUpperCase();
}

// Re-create the reference scale's curve around a new 500: lightness keeps its relative distance to
// white/black, chroma keeps its ratio to the anchor, hue keeps the reference drift. Out-of-gamut
// colors lose chroma rather than shifting hue.
export function generateScale(base, reference) {
  const hex = normalizeHex(base);
  if (!hex) throw new Error("Invalid color: " + base);
  const target = toOklch(hex);
  const anchor = toOklch(reference[500]);
  const targetHue = target.h ?? 0;
  const anchorChroma = Math.max(anchor.c, 1e-6);
  return Object.fromEntries(SCALE_STEPS.map(step => {
    if (step === 500) return [step, hex];
    const sample = toOklch(reference[step]);
    const l = sample.l >= anchor.l
      ? target.l + (sample.l - anchor.l) * (1 - target.l) / (1 - anchor.l)
      : target.l * (sample.l / anchor.l);
    const color = { mode: "oklch", l, c: target.c * (sample.c / anchorChroma), h: targetHue + ((sample.h ?? anchor.h) - anchor.h) };
    return [step, formatHex(clampChroma(color, "oklch")).toUpperCase()];
  }));
}

export function radiusValues(presetId) {
  const preset = RADIUS_PRESETS.find(item => item.id === presetId) ?? RADIUS_PRESETS[2];
  return Object.fromEntries(Object.entries(BASE_RADIUS).map(([key, px]) => [key, Math.round(px * preset.factor)]));
}

export function fontPreset(id) {
  return FONT_PRESETS.find(item => item.id === id) ?? FONT_PRESETS[0];
}

// Variables for a preview container. Unlike :root, a nested element must also restate the values
// tokens.css derives on :root (--fg-blue, --accent…), because those resolve where they are declared.
export function previewVariables(theme, reference) {
  const scale = generateScale(theme.color, reference);
  const radius = radiusValues(theme.radius);
  const font = fontPreset(theme.font);
  return {
    ...Object.fromEntries(SCALE_STEPS.map(step => [`--fg-blue-${step}`, scale[step]])),
    "--fg-blue": scale[500],
    "--accent": scale[500],
    "--accent-soft": scale[100],
    "--accent-soft-foreground": scale[500],
    "--focus": scale[500],
    ...Object.fromEntries(Object.entries(radius).filter(([key]) => key !== "card").map(([key, px]) => [`--radius-${key}`, `${px}px`])),
    ...(font.sans ? { "--font-manrope": font.sans, "--font-plus-jakarta-sans": font.display } : {}),
  };
}

export function themeCss(theme, reference) {
  const scale = generateScale(theme.color, reference);
  const radius = radiusValues(theme.radius);
  const font = fontPreset(theme.font);
  const colorChanged = normalizeHex(theme.color) !== reference[500];
  const radiusChanged = theme.radius !== "default";
  const summary = [
    `主色 ${normalizeHex(theme.color)}`,
    `圆角${RADIUS_PRESETS.find(item => item.id === theme.radius)?.label ?? "默认"}`,
    `字体 ${font.label}`,
  ].join(" · ");
  const declarations = [
    ...(colorChanged ? SCALE_STEPS.map(step => `  --fg-blue-${step}: ${scale[step]};`) : []),
    ...(radiusChanged ? Object.entries(radius).filter(([key]) => key !== "card").map(([key, px]) => `  --radius-${key}: ${px}px;`) : []),
    ...(font.sans ? [`  --font-manrope: ${font.sans};`, `  --font-plus-jakarta-sans: ${font.display};`] : []),
  ];
  if (!declarations.length) return `/* Forge 主题：${summary}。和默认主题相同，不需要额外 CSS。 */\n`;
  return [
    `/* Forge 主题：${summary}`,
    `   放在 @import "@forge-ui-official/core/styles.css" 之后。:root:root 用来压过 core 的 :root。 */`,
    ":root:root {",
    ...declarations,
    "}",
    // rounded-card is compiled to a literal value, so it needs its own rule.
    ...(radiusChanged ? ["", `.rounded-card { border-radius: ${radius.card}px; }`] : []),
    "",
  ].join("\n");
}
