/* eslint-disable @next/next/no-img-element */

// ============================================================
// ImageGrid — 水平图片排列（支持 overflow +N 指示）
// Figma: flex gap-2, 每图 w-16 h-16 rounded-lg
// ============================================================

export type ImageGridSize = "sm" | "md" | "lg";

const sizeMap: Record<ImageGridSize, { box: string; text: string }> = {
  sm: { box: "w-12 h-12", text: "text-xs" },
  md: { box: "w-16 h-16", text: "text-sm" },
  lg: { box: "w-20 h-20", text: "text-base" },
};

export function ImageGrid({
  images,
  size = "md",
  overflowCount,
  overflowClassName = "bg-purple-100 text-fg-violet",
  className = "",
}: {
  images: string[];
  size?: ImageGridSize;
  overflowCount?: number;
  /** Customize the +N overflow chip background & text color. Default: purple accent. */
  overflowClassName?: string;
  className?: string;
}) {
  const s = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className={`${s.box} rounded-lg object-cover`}
        />
      ))}
      {overflowCount && overflowCount > 0 && (
        <div
          className={`${s.box} rounded-lg inline-flex items-center justify-center shrink-0 ${overflowClassName}`}
        >
          <span className={`${s.text} font-semibold tracking-fg`}>
            +{overflowCount}
          </span>
        </div>
      )}
    </div>
  );
}
