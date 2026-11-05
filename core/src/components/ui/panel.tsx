import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  variant?: "dashboard" | "template" | "custom";
  as?: "div" | "section" | "aside" | "article";
  gap?: "none" | "sm" | "md";
}

export function Panel({ title, subtitle, action, footer, children, variant = "dashboard", as: Element = "div", gap = "md", className, ...props }: PanelProps) {
  const template = variant === "template";
  return (
    <Element {...props} className={cn(
      variant === "custom" ? undefined : template
        ? "bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6 flex flex-col gap-6"
        : "rounded-3xl bg-white border border-fg-grey-200 p-4 flex flex-col",
      variant === "dashboard" && (gap === "md" ? "gap-4" : gap === "sm" ? "gap-3" : undefined),
      className,
    )}>
      {(title || subtitle || action) && (
        <div className={template ? "flex items-start gap-3" : "flex items-start justify-between gap-4"}>
          <div className={template ? "flex-1 min-w-0 flex flex-col gap-1" : "min-w-0"}>
            {title && <h2 className={template ? "text-lg font-semibold text-fg-black leading-7 tracking-fg" : "text-sm font-semibold leading-5 text-fg-black"}>{title}</h2>}
            {subtitle && (template
              ? <span className="text-sm font-medium text-fg-grey-700 leading-5 tracking-fg">{subtitle}</span>
              : <p className="text-xs leading-4 text-fg-grey-700">{subtitle}</p>)}
          </div>
          {action}
        </div>
      )}
      {children}
      {footer}
    </Element>
  );
}
