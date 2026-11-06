import type { ReactNode } from "react";
import { Panel } from "@forge-ui-official/core";

export interface ProjectSectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ProjectSection({ title, action, children, className }: ProjectSectionProps) {
  return <Panel variant="custom" as="section" className={className}><div className="mb-3 flex items-center justify-between"><h3 className="text-lg font-semibold text-fg-black">{title}</h3>{action}</div><div className="flex flex-col gap-3">{children}</div></Panel>;
}
