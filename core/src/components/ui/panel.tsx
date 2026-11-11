import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  variant?: "dashboard" | "template" | "custom";
  as?: "div" | "section" | "aside" | "article";
  asChild?: boolean;
  gap?: "none" | "sm" | "md";
}

export function Panel({ title, subtitle, action, footer, children, variant = "dashboard", as: Element = "div", asChild = false, gap = "md", className, ...props }: PanelProps) {
  if (asChild) {
    const child = Children.only(children);
    if (variant !== "custom" || title || subtitle || action || footer || !isValidElement<HTMLAttributes<HTMLElement>>(child)) {
      throw new Error("Panel asChild requires variant=custom, one element, and no header or footer slots.");
    }
    return cloneElement(child, { ...props, className: cn(className, child.props.className) });
  }
  const template = variant === "template";
  return (
    <Element {...props} className={cn(
      variant === "custom" ? undefined : template
        ? "bg-background rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 p-6 flex flex-col gap-6"
        : "rounded-3xl bg-background border border-fg-grey-200 p-4 flex flex-col",
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
