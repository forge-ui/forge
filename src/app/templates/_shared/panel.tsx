import { type ReactNode } from "react";
import { cn } from "@forge-ui/react";

// ============================================================
// Panel — examples 业务页通用容器壳
// 不在 UI Kit (Figma 没设计这个)，仅 src/app/templates/ 下业务示例使用
// outline + bg + rounded-card + p-6 + 可选 title/subtitle/action/footer
// ============================================================

export function Panel({
  title,
  subtitle,
  action,
  footer,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const hasHeader = title || subtitle || action;

  return (
    <div
      className={cn(
        "bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6 flex flex-col gap-6",
        className
      )}
    >
      {hasHeader && (
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            {title && (
              <h2 className="text-lg font-semibold text-fg-black leading-7 tracking-fg">
                {title}
              </h2>
            )}
            {subtitle && (
              <span className="text-sm font-medium text-fg-grey-700 leading-5 tracking-fg">
                {subtitle}
              </span>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
      {footer}
    </div>
  );
}
