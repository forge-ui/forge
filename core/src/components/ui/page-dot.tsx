import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

// ============================================================
// PageDot — 分页/指示器原子单元
// Figma: w-10 h-10 p-2 圆形 pill，3 状态：
//   active   = 实心填充（color bg + 白字）
//   default  = 描边（outline + 灰字）— 默认
//   passing children "..." 时同 default 视觉，作为 ellipsis 占位
// 当传 onClick 时渲染为 <button>，否则 <span>（用于 Indicator 展示或 ellipsis）
// ============================================================

const activeColors = {
  purple: "bg-fg-violet text-white",
  blue: "bg-fg-blue text-white",
  black: "bg-fg-black text-white",
} as const;

export type PageDotColor = keyof typeof activeColors;

const baseClass =
  "w-10 h-10 p-2 rounded-full inline-flex items-center justify-center text-sm font-semibold";

const defaultClass =
  "outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-fg-grey-700";

export function PageDot({
  children,
  color = "purple",
  active = false,
  onClick,
  className,
}: {
  children: ReactNode;
  color?: PageDotColor;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const styleClass = cn(
    baseClass,
    active ? activeColors[color] : defaultClass,
    onClick && "cursor-pointer",
    className
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={styleClass}>
        {children}
      </button>
    );
  }
  return <span className={styleClass}>{children}</span>;
}
