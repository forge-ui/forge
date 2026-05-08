import { cn } from "../../lib/utils";

// ============================================================
// Breadcrumbs
// color: purple, blue, black
// ============================================================

const breadcrumbColors = {
  purple: "text-fg-violet",
  blue: "text-blue-600",
  black: "text-fg-black",
} as const;

export type BreadcrumbColor = keyof typeof breadcrumbColors;

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export function Breadcrumbs({
  items,
  color = "purple",
  className,
}: {
  items: BreadcrumbItem[];
  color?: BreadcrumbColor;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex justify-start items-center gap-2", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} className="inline-flex justify-start items-center gap-2">
            {index > 0 && (
              <span className="justify-start text-neutral-200 text-sm font-medium leading-5 tracking-fg">
                /
              </span>
            )}
            {isLast ? (
              <span className="justify-start text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
                {item.label}
              </span>
            ) : item.href || item.onClick ? (
              <a
                href={item.href}
                onClick={item.onClick}
                className={cn(
                  "justify-start text-sm font-bold leading-5 tracking-fg cursor-pointer",
                  breadcrumbColors[color],
                )}
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  "justify-start text-sm font-bold leading-5 tracking-fg",
                  breadcrumbColors[color],
                )}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
