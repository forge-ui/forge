import type { ReactNode } from "react";

export interface InfoRowProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}

export function InfoRow({
  icon,
  label,
  children,
}: InfoRowProps) {
  return (
    <div className="flex gap-2 items-start">
      <span className="shrink-0 mt-0.5 text-fg-grey-700">{icon}</span>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="text-sm font-semibold text-fg-grey-700 leading-5 tracking-fg">
          {label}
        </span>
        <div className="text-sm font-medium text-fg-black leading-5 tracking-fg">
          {children}
        </div>
      </div>
    </div>
  );
}
