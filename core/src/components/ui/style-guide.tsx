import { cn } from "../../lib/utils";

// ==================================================================
// Style Guide — atomic display components for Color / Typography case
// ==================================================================

// ── ColorSwatch ─────────────────────────────────────────────────────
// Tile with label top-left + hex pill bottom-right. Pure-white swatch
// gets an outline + grey hex pill (per Figma).
//
// size:
//   - sm (default): 112×80 — compact, fits 10 swatches in ~1120px
//   - md: 144×112
//   - lg: 192×160 — matches Figma style-guide frame exactly

export type ColorSwatchSize = "sm" | "md" | "lg";

const SWATCH_SIZE: Record<ColorSwatchSize, {
  box: string;
  label: string;
  pill: string;
  inset: string;
}> = {
  sm: {
    box: "h-16 w-24",
    label: "text-[10px] font-semibold leading-3",
    pill: "px-1.5 py-0.5 text-[10px] font-semibold leading-3",
    inset: "left-1.5 top-1.5 bottom-1.5 right-1.5",
  },
  md: {
    box: "h-28 w-36",
    label: "text-sm font-semibold leading-5",
    pill: "px-3 py-1 text-xs font-semibold leading-4",
    inset: "left-3 top-3 bottom-3 right-3",
  },
  lg: {
    box: "h-40 w-48",
    label: "text-sm font-semibold leading-5",
    pill: "px-4 py-2 text-sm font-semibold leading-5",
    inset: "left-4 top-4 bottom-4 right-4",
  },
};

export function ColorSwatch({
  label,
  hex,
  tone,
  size = "sm",
}: {
  label: string;
  hex: string;
  tone: "dark" | "light";
  size?: ColorSwatchSize;
}) {
  const hexLabel = hex.replace("#", "").toUpperCase();
  const isPureWhite = hex.toUpperCase() === "#FFFFFF";
  const s = SWATCH_SIZE[size];
  // inset shortcuts pulled from SWATCH_SIZE so the label/pill padding
  // scales with the box.
  const [left, top, bottom, right] = s.inset.split(" ");
  return (
    <div
      className={cn(
        "relative",
        s.box,
        isPureWhite && "outline outline-1 -outline-offset-1 outline-fg-grey-200",
      )}
      style={{ backgroundColor: hex }}
    >
      <span
        className={cn(
          "absolute tracking-tight",
          left, top,
          s.label,
          tone === "dark" ? "text-fg-black" : "text-white",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "absolute rounded-full tracking-tight text-fg-black",
          right, bottom,
          s.pill,
          isPureWhite ? "bg-fg-grey-100" : "bg-white",
        )}
      >
        {hexLabel}
      </span>
    </div>
  );
}

// ── ColorSection (title + 10 swatches) ──────────────────────────────
export interface ColorScaleStop {
  shade: string; // "50", "100", ..., "900"
  hex: string;
}

export function ColorSection({
  title,
  scale,
  darkLabelUntil,
  swatchSize = "sm",
}: {
  title: string;
  scale: ColorScaleStop[];
  /** Shades ≤ this value get dark text; above get white text. */
  darkLabelUntil: number;
  swatchSize?: ColorSwatchSize;
}) {
  return (
    <div className="flex flex-col items-start gap-4 w-full">
      <h3 className="text-xl font-semibold tracking-tight text-fg-black">{title}</h3>
      <div className="w-full overflow-x-auto">
        <div className="inline-flex items-stretch">
          {scale.map(({ shade, hex }) => (
            <ColorSwatch
              key={shade}
              label={`${title} ${shade}`}
              hex={hex}
              tone={Number(shade) <= darkLabelUntil ? "dark" : "light"}
              size={swatchSize}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TypefaceBlock (Aa + font name) ──────────────────────────────────
export function TypefaceBlock({
  name,
  sample = "Aa",
}: {
  name: string;
  sample?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4">
      <span className="text-xl font-medium font-display leading-8 tracking-tight text-fg-grey-700">
        Typeface
      </span>
      <div className="inline-flex items-center gap-4">
        <span className="text-8xl font-semibold font-display leading-[140px] tracking-wide text-fg-black">
          {sample}
        </span>
        <span className="text-xl font-medium font-display leading-8 tracking-tight text-fg-violet">
          {name}
        </span>
      </div>
    </div>
  );
}

// ── TypographyWeightSample (single weight cell) ─────────────────────
type FontWeight = 700 | 600 | 500 | 400;

const WEIGHT_CLASS: Record<FontWeight, string> = {
  700: "font-bold",
  600: "font-semibold",
  500: "font-medium",
  400: "font-normal",
};

export function TypographyWeightSample({
  text,
  weight,
  sizeClass,
}: {
  text: string;
  weight: FontWeight;
  sizeClass: string;
}) {
  return (
    <div className="inline-flex w-40 flex-col items-start gap-2">
      <span className={cn("font-sans tracking-tight text-fg-black", sizeClass, WEIGHT_CLASS[weight])}>
        {text}
      </span>
      <span className="text-sm font-medium font-display leading-5 tracking-tight text-fg-grey-700">
        {weight}
      </span>
    </div>
  );
}

// ── TypographySizeRow (size label + 4 weights) ──────────────────────
export function TypographySizeRow({
  label,
  text,
  sizeClass,
}: {
  label: string;
  text: string;
  sizeClass: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4">
      <span className="text-base font-medium font-display leading-6 tracking-tight text-fg-grey-700">
        {label}
      </span>
      <div className="inline-flex items-start gap-12">
        {([700, 600, 500, 400] as const).map((w) => (
          <TypographyWeightSample key={w} text={text} weight={w} sizeClass={sizeClass} />
        ))}
      </div>
    </div>
  );
}
