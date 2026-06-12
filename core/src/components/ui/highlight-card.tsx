/* eslint-disable @next/next/no-img-element */
import { cn } from "../../lib/utils";
import { cardThemes, resolveCardTheme, resolveCardWidthClass, type CardTheme, type CardWidth, type LegacyCardTheme } from "./card-utils";

// ============================================================
// HighlightCard — Figma "Highlight Card" (node 6498:191669)
// Tall showcase card with product hero image, annotations overlay,
// and stacked product list at the bottom.
// Uses cardThemes for bg/text colors (no glow — uses white blur blob).
// ============================================================

type HighlightCardTheme = CardTheme | LegacyCardTheme;

type Annotation = {
  label: string;
  value: string;
  position: { top?: string; left?: string; right?: string; bottom?: string };
};

type Product = {
  image: string;
  name: string;
  subtitle: string;
  value: string;
};

export function HighlightCard({
  title,
  theme = "purple",
  image,
  annotations = [],
  products = [],
  width,
  className,
}: {
  title: string;
  theme?: HighlightCardTheme;
  image: string;
  annotations?: Annotation[];
  products?: Product[];
  /** Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. */
  width?: CardWidth;
  className?: string;
}) {
  const cfg = cardThemes[resolveCardTheme(theme)];

  return (
    <div
      className={cn(
        "h-[462px] p-6 rounded-card flex-col gap-5 overflow-hidden relative",
        resolveCardWidthClass(width, "w-96"),
        cfg.bg,
        className,
      )}
    >
      <div className="w-1/2 max-w-48 aspect-square absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 rounded-full blur-3xl" />

      <h3 className={cn("text-sm font-semibold leading-5 tracking-fg relative z-10", cfg.valueColor)}>
        {title}
      </h3>

      <div className="self-stretch flex-1 relative z-10">
        <img className="w-full h-full object-contain" src={image} alt="" />
        {annotations.map((a, i) => (
          <div key={`${a.label}-${i}`} className="absolute bg-fg-black/25 rounded-xl backdrop-blur-md px-3 py-2 flex flex-col gap-0.5" style={a.position}>
            <span className="text-white/75 text-xs font-medium leading-4.5 tracking-fg">{a.label}</span>
            <span className="text-white text-sm font-semibold leading-5 tracking-fg">{a.value}</span>
          </div>
        ))}
      </div>

      {products.length > 0 && (
        <div className="self-stretch flex flex-col items-center gap-0 relative z-10">
          {products.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3"
              style={{ width: `calc(100% - ${i * 16}px)`, marginTop: i > 0 ? "-4px" : "0", zIndex: products.length - i }}
            >
              <img className="w-10 h-10 rounded-lg object-cover shrink-0" src={p.image} alt="" />
              <div className="flex-1 min-w-0">
                <div className="text-fg-black text-sm font-semibold leading-5 tracking-fg truncate">{p.name}</div>
                <div className="text-fg-grey-700 text-xs font-medium leading-4.5 tracking-fg truncate">{p.subtitle}</div>
              </div>
              <span className="text-fg-black text-sm font-semibold leading-5 tracking-fg shrink-0">{p.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
