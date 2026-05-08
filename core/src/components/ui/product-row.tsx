/* eslint-disable @next/next/no-img-element */
import { type ReactNode } from "react";

// ============================================================
// ProductRow — 紧凑产品/文件行（image + title + subtitle）
// Figma: inline-flex items-center gap-2
//   img w-11 h-11 rounded-lg + 文字列（Title Here / 3 Variant）
// 无外框（Figma 设计）
// ============================================================

export function ProductRow({
  image,
  imageSlot,
  title,
  subtitle,
  className = "",
}: {
  image?: string;
  imageSlot?: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {imageSlot ??
        (image && (
          <img
            src={image}
            alt=""
            className="w-11 h-11 rounded-lg object-cover shrink-0"
          />
        ))}
      <div className="inline-flex flex-col items-start gap-1">
        <span className="text-sm font-semibold leading-5 text-fg-black tracking-fg">
          {title}
        </span>
        {subtitle && (
          <span className="text-xs font-normal leading-4 text-fg-grey-700 tracking-fg">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
