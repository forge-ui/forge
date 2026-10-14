"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { motion as animated } from "motion/react";
import { cn } from "../../lib/utils";
import type { MotionPreference } from "../../lib/motion";
import { useMovingIndicator, useReducedMotion } from "../../internal/motion";
import { AltArrowLeftLinear, AltArrowRightLinear } from "../../icons";
import { PageDot, type PageDotColor } from "./page-dot";

// ============================================================
// Pagination - 分页器
// 复合组件：prev/next + PageDot 数字 + ellipsis
// color: purple, blue, black（继承自 PageDot）
// ============================================================

export type PaginationColor = PageDotColor;

const activeColors = { purple: "bg-fg-violet", blue: "bg-fg-blue", black: "bg-fg-black" } as const;

// Figma pattern: active 起头向后展开 5 个页码窗口，左右按需 ellipsis，不强制 first/last
function getPageNumbers(totalPages: number, currentPage: number, visible = 5): (number | "...")[] {
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
  locale = "zh",
  motion = "auto",
}: {
  totalPages: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
  color?: PaginationColor;
  className?: string;
  /** 无障碍标签的语言，默认中文。 */
  locale?: "zh" | "en";
  /** auto 跟随系统的减弱动效设置。 */
  motion?: MotionPreference;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(5);
  const reduced = useReducedMotion(motion);
  const pages = getPageNumbers(totalPages, currentPage, visible);
  const indicator = useMovingIndicator(root, "[aria-current='page']", `${totalPages}:${currentPage}:${visible}`);
  const zh = locale === "zh";
  const activeIndex = pages.indexOf(currentPage);

  useLayoutEffect(() => {
    const parent = root.current?.parentElement;
    if (!parent) return;
    function fit() {
      if (!parent) return;
      const style = window.getComputedStyle(parent);
      const available = parent.clientWidth - (Number.parseFloat(style.paddingLeft) || 0) - (Number.parseFloat(style.paddingRight) || 0);
      if (available <= 0) return;
      let count = 5;
      // Keep PageDot's 40px hit area and 8px spacing. Observe the parent so
      // changing the number of pages cannot trigger a resize feedback loop.
      while (count > 1) {
        const slots = getPageNumbers(totalPages, currentPage, count).length + 2;
        if (slots * 40 + (slots - 1) * 8 <= available) break;
        count--;
      }
      setVisible(previous => previous === count ? previous : count);
    }
    fit();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(fit);
    observer?.observe(parent);
    window.addEventListener("resize", fit);
    return () => { observer?.disconnect(); window.removeEventListener("resize", fit); };
  }, [totalPages, currentPage]);

  return (
    <div ref={root} role="navigation" aria-label={zh ? "分页" : "Pagination"} data-motion={reduced ? "none" : motion}
      className={cn("relative isolate inline-flex max-w-full items-center gap-2", className)}>
      <span ref={indicator} aria-hidden className={cn("forge-moving-indicator rounded-full", activeColors[color])}
        style={{
          // A deterministic server fallback keeps the active page visible before hydration.
          // The shared observer then measures the actual button, including custom layout.
          "--forge-indicator-x": `${(activeIndex + 1) * 48}px`,
          "--forge-indicator-y": "0px",
          "--forge-indicator-width": "40px",
          "--forge-indicator-height": "40px",
          visibility: activeIndex < 0 ? "hidden" : "visible",
          transition: reduced ? "none" : "translate 420ms cubic-bezier(.22, 1, .36, 1)",
        } as CSSProperties} />
      <animated.button
        type="button"
        aria-label={zh ? "上一页" : "Previous page"}
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        whileTap={reduced || currentPage <= 1 ? undefined : { scale: .94 }}
        className="relative shrink-0 p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-fg-grey-700"
      >
        <AltArrowLeftLinear size={20} />
      </animated.button>

      {pages.map((page, i) =>
        page === "..." ? (
          <PageDot key={`ellipsis-${i}`} color={color} className="relative shrink-0">
            ...
          </PageDot>
        ) : (
          <animated.button
            key={page}
            type="button"
            aria-current={page === currentPage ? "page" : undefined}
            aria-label={zh ? `第 ${page} 页` : `Page ${page}`}
            onClick={() => onPageChange?.(page)}
            whileTap={reduced ? undefined : { scale: .94 }}
            className={cn("relative z-[1] w-10 h-10 p-2 rounded-full shrink-0 inline-flex items-center justify-center text-sm font-semibold cursor-pointer",
              page === currentPage ? "text-white" : "outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-fg-grey-700")}
          >
            {page}
          </animated.button>
        )
      )}

      <animated.button
        type="button"
        aria-label={zh ? "下一页" : "Next page"}
        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        whileTap={reduced || currentPage >= totalPages ? undefined : { scale: .94 }}
        className="relative shrink-0 p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-fg-grey-700"
      >
        <AltArrowRightLinear size={20} />
      </animated.button>
    </div>
  );
}
