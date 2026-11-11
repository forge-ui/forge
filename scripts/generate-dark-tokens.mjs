// Generate the dark palette in core/src/styles/tokens.css from the light primitives.
//   node scripts/generate-dark-tokens.mjs          # rewrite the generated block
//   node scripts/generate-dark-tokens.mjs --check  # fail when the block is stale
// Dark mode redefines the primitives themselves, so the ~1000 grey/black utilities in core keep
// working unchanged: greys invert, black becomes the light ink, colored tints (50–300) become the
// 500 mixed into the dark card color, and the dark text steps (700–900) become the light 300–100.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DARK_CARD, darkColorScale } from "../src/lib/theme.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "core/src/styles/tokens.css");
const START = "/* @generated dark-palette:start — edit scripts/generate-dark-tokens.mjs, not this block */";
const END = "/* @generated dark-palette:end */";

export const DARK = {
  surface: "#0E1015",
  card: DARK_CARD,
  ink: "#F2F3F5",
  grey: { 50: "#0E1015", 100: "#1F2227", 200: "#2A2D33", 300: "#373A41", 400: "#464A51", 500: "#5C6068", 600: "#74787F", 700: "#9397A0", 800: "#B0B3BA", 900: "#CDD0D6" },
  black: { 50: "#22252B", 100: "#3A3E45", 200: "#5A5F67", 300: "#9398A0", 400: "#C4C7CC", 500: "#F2F3F5", 600: "#F5F6F7", 700: "#F8F8F9", 800: "#FAFAFB", 900: "#FCFCFD" },
};
const COLORS = ["violet", "blue", "green", "red", "yellow", "cyan"];

function lightScale(css, name) {
  const primitives = css.slice(0, css.indexOf(START));
  const scale = Object.fromEntries([...primitives.matchAll(new RegExp(`--fg-${name}-(\\d+):\\s*(#[0-9a-fA-F]{6})`, "g"))].map(match => [Number(match[1]), match[2].toUpperCase()]));
  if (Object.keys(scale).length !== 10) throw new Error(`tokens.css: --fg-${name} needs 10 steps`);
  return scale;
}

export function darkPalette(css) {
  const lines = [`  color-scheme: dark;`];
  for (const [step, value] of Object.entries(DARK.grey)) lines.push(`  --fg-grey-${step}: ${value};`);
  for (const [step, value] of Object.entries(DARK.black)) lines.push(`  --fg-black-${step}: ${value};`);
  for (const name of COLORS) {
    for (const [step, value] of Object.entries(darkColorScale(lightScale(css, name)))) lines.push(`  --fg-${name}-${step}: ${value};`);
  }
  for (const name of COLORS) lines.push(`  --fg-${name}-text: ${lightScale(css, name)[300]};`);
  // Aliases resolve where they are declared, so a nested [data-theme="dark"] must restate them.
  for (const name of ["violet", "blue", "red", "yellow", "black"]) lines.push(`  --fg-${name}: var(--fg-${name}-500);`);
  return lines;
}

// Semantic tokens for dark. They are restated here because the light block points them at
// --fg-white / --fg-black, which mean different things once the primitives flip.
const SEMANTIC = [
  `  --background: ${DARK.card};`,
  `  --foreground: ${DARK.ink};`,
  `  --surface: ${DARK.surface};`,
  `  --surface-foreground: ${DARK.ink};`,
  "  --overlay: rgba(0, 0, 0, 0.60);",
  "  --accent: var(--fg-blue);",
  "  --accent-foreground: #FFFFFF;",
  "  --accent-soft: var(--fg-blue-100);",
  "  --accent-soft-foreground: var(--fg-blue-800);",
  `  --text-primary: ${DARK.ink};`,
  "  --text-secondary: var(--fg-grey-900);",
  "  --text-muted: var(--fg-grey-700);",
  "  --text-disabled: var(--fg-grey-500);",
  "  --border: var(--fg-grey-200);",
  "  --border-muted: var(--fg-grey-100);",
  "  --divider: var(--fg-grey-200);",
  "  --danger: var(--fg-red);",
  "  --danger-foreground: #FFFFFF;",
  "  --warning: var(--fg-yellow);",
  "  --warning-foreground: #000A19;",
  "  --warning-soft: var(--fg-yellow-50);",
  "  --warning-muted: var(--fg-yellow-600);",
  "  --focus: var(--fg-blue);",
  "  --hover: rgba(255, 255, 255, 0.06);",
];

// A light island inside a dark page ([data-theme="light"] on a nested element) needs the light
// primitives back; :root alone would leave it with the inherited dark values.
function lightPalette(css) {
  const primitives = css.slice(0, css.indexOf(START));
  const declarations = [...primitives.matchAll(/^\s*(--fg-(?:grey|black|violet|blue|green|red|yellow|cyan)-\d+):\s*(#[0-9a-fA-F]{6});/gm)].map(match => `  ${match[1]}: ${match[2]};`);
  return ["  color-scheme: light;", ...declarations, ...["violet", "blue", "red", "yellow", "black"].map(name => `  --fg-${name}: var(--fg-${name}-500);`)];
}

export function renderBlock(css) {
  return [
    START,
    '[data-theme="light"] {',
    ...lightPalette(css),
    "}",
    "",
    '[data-theme="dark"] {',
    ...darkPalette(css),
    "",
    ...SEMANTIC,
    "}",
    "",
    '[data-theme="dark"][data-accent="purple"] {',
    "  --accent: var(--fg-violet);",
    "  --accent-soft: var(--fg-violet-100);",
    "  --accent-soft-foreground: var(--fg-violet-800);",
    "  --focus: var(--fg-violet);",
    "}",
    "",
    // Black as a fill (dark buttons, tooltips, black cards) stays dark so its white content keeps
    // working; black as text still flips to the light ink through --fg-black.
    '[data-theme="dark"] { --fg-black-fill: #2C3038; }',
    '[data-theme="dark"] .bg-fg-black:not([data-theme="light"] *) { background-color: var(--fg-black-fill); }',
    // Colored text needs the lighter shade on dark surfaces; fills keep the 500.
    ...COLORS.map(name => `[data-theme="dark"] :is(.text-fg-${name}, .text-fg-${name}-500):not([data-theme="light"] *) { color: var(--fg-${name}-text); }`),
    END,
  ].join("\n");
}

if (process.argv[1] && import.meta.url.endsWith("/" + path.basename(process.argv[1]))) {
  const css = fs.readFileSync(file, "utf8");
  const start = css.indexOf(START);
  const end = css.indexOf(END);
  if (start < 0 || end < 0) throw new Error("tokens.css is missing the dark-palette markers");
  const next = css.slice(0, start) + renderBlock(css) + css.slice(end + END.length);
  if (process.argv.includes("--check")) {
    if (next !== css) {
      console.error("Dark palette in tokens.css is stale; run node scripts/generate-dark-tokens.mjs");
      process.exit(1);
    }
    console.log("Dark palette matches the light primitives");
  } else {
    fs.writeFileSync(file, next);
    console.log("Dark palette written to core/src/styles/tokens.css");
  }
}
