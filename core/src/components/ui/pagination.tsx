"use client";

import { cn } from "../../lib/utils";
import { AltArrowLeftLinear, AltArrowRightLinear } from "solar-icon-set";
import { PageDot, type PageDotColor } from "./page-dot";

// ============================================================
// Pagination - 分页器
// 复合组件：prev/next + PageDot 数字 + ellipsis
// color: purple, blue, black（继承自 PageDot）
// ============================================================

export type PaginationColor = PageDotColor;

// Figma pattern: active 起头向后展开 5 个页码窗口，左右按需 ellipsis，不强制 first/last
function getPageNumbers(totalPages: number, currentPage: number): (number | "...")[] {
  const visible = 5;
  const clamped = Math.min(totalPages, Math.max(1, currentPage));
  const end = Math.min(totalPages, clamped + visible - 1);

  const pages: (number | "...")[] = [];
  if (clamped > 1) pages.push("...");
  for (let i = clamped; i <= end; i++) pages.push(i);
  if (end < totalPages) pages.push("...");
  return pages;
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  color = "purple",
  className,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
  color?: PaginationColor;
  className?: string;
}) {
  const pages = getPageNumbers(totalPages, currentPage);

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-fg-grey-700"
      >
        <AltArrowLeftLinear size={20} />
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <PageDot key={`ellipsis-${i}`} color={color}>
            ...
          </PageDot>
        ) : (
          <PageDot
            key={page}
            color={color}
            active={page === currentPage}
            onClick={() => onPageChange?.(page)}
          >
            {page}
          </PageDot>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-fg-grey-700"
      >
        <AltArrowRightLinear size={20} />
      </button>
    </div>
  );
}
