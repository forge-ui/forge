import type { HTMLAttributes, ReactNode } from "react";

export interface DashboardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function DashboardHeader({ title, description, action, children, className = "flex items-start justify-between", ...props }: DashboardHeaderProps) {
  return <div {...props} className={className}>{children ?? <><div className="flex flex-col gap-1"><h1 className="text-2xl font-semibold text-fg-black">{title}</h1>{description && <p className="text-sm text-fg-grey-500">{description}</p>}</div>{action}</>}</div>;
}
