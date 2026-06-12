import { StarBold } from "solar-icon-set";

// ============================================================
// RatingStars — 评分星级展示（value/total + N 颗 solar StarBold）
// Figma: "4.0/5 ★★★★☆" 一行，数字 + 16×16 stars, gap-1
// ============================================================

export type RatingStarsSize = "sm" | "md" | "lg";

const sizeMap: Record<RatingStarsSize, { icon: number; text: string }> = {
  sm: { icon: 12, text: "text-xs leading-4" },
  md: { icon: 16, text: "text-sm leading-5" },
  lg: { icon: 20, text: "text-base leading-6" },
};

export function RatingStars({
  value,
  total = 5,
  showValue = true,
  size = "md",
  className = "",
}: {
  value: number;
  total?: number;
  showValue?: boolean;
  size?: RatingStarsSize;
  className?: string;
}) {
  const s = sizeMap[size];
  const filled = Math.round(value);

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {showValue && (
        <span className={`${s.text} font-medium text-fg-grey-700 tracking-fg`}>
          {value.toFixed(1)}/{total}
        </span>
      )}
      {Array.from({ length: total }).map((_, i) => (
        <StarBold
          key={i}
          size={s.icon}
          color={i < filled ? "var(--fg-yellow)" : "var(--fg-grey-200)"}
        />
      ))}
    </div>
  );
}
