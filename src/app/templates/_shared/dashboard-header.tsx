import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "@forge-ui-official/core";
import { DownloadLinear } from "@forge-ui-official/core/icons";

export interface DashboardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  dateSelection?: ReactNode;
  primaryAction?: ReactNode;
  onExport?: () => void;
}

export function DashboardHeader({ title, description, action, dateSelection, primaryAction, onExport, children, className = "flex flex-wrap items-start justify-between gap-4", ...props }: DashboardHeaderProps) {
  return <div {...props} className={className}>{children ?? <><div className="min-w-0 flex flex-col gap-1"><h1 className="text-2xl font-semibold text-fg-black">{title}</h1>{description && <p className="text-sm text-fg-grey-500">{description}</p>}</div>{(action || dateSelection || primaryAction || onExport) && <div className="flex max-w-full flex-wrap items-center gap-3">{dateSelection}{action}{primaryAction ?? (onExport && <Button size="sm" variant="tertiary" iconLeft={<DownloadLinear size={16} />} onClick={onExport}>导出</Button>)}</div>}</>}</div>;
}
