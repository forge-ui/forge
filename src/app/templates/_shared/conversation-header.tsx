import type { ReactNode } from "react";

export interface ConversationHeaderProps {
  title: string;
  subtitle: ReactNode;
  children?: ReactNode;
}

export function ConversationHeader({ title, subtitle, children }: ConversationHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-fg-grey-200 pb-4">
      <div>
        <h1 className="text-lg font-semibold text-fg-black">{title}</h1>
        <p className="mt-1 text-xs text-fg-grey-700">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </header>
  );
}
