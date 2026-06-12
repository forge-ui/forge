import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

export type SurfaceCardPadding = "none" | "sm" | "md" | "lg";

const paddingClasses: Record<SurfaceCardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function SurfaceCard({
  title,
  subtitle,
  action,
  children,
  footer,
  padding = "md",
  className,
  headerClassName,
  contentClassName,
  footerClassName,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  padding?: SurfaceCardPadding;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}) {
  const hasHeader = title || subtitle || action;

  return (
    <section
      className={cn(
        "rounded-card bg-white outline outline-1 outline-offset-[-1px] outline-fg-grey-200",
        className
      )}
    >
      {hasHeader && (
        <div
          className={cn(
            "flex items-start justify-between gap-4 border-b border-fg-grey-200 px-5 py-4",
            headerClassName
          )}
        >
          <div className="min-w-0">
            {title && (
              <h2 className="text-sm font-semibold leading-5 tracking-fg text-fg-black">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-xs font-medium leading-4.5 tracking-fg text-fg-grey-700">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={cn(paddingClasses[padding], contentClassName)}>
        {children}
      </div>

      {footer && (
        <div className={cn("border-t border-fg-grey-200 px-5 py-4", footerClassName)}>
          {footer}
        </div>
      )}
    </section>
  );
}
