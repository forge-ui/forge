"use client";

import type { ReactNode } from "react";
import { StarsLinear } from "../../../icons";
import { cn } from "../../../lib/utils";

export type AgentWelcomeProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Anything under the greeting, e.g. recent conversations. Starter tasks belong in ChatInputBar's quickActions. */
  footer?: ReactNode;
  size?: "md" | "sm";
  className?: string;
};

/** The empty conversation: who the agent is and what it does. Pair it with ChatInputBar quick-action cards. */
export function AgentWelcome({ title, description, icon, footer, size = "md", className }: AgentWelcomeProps) {
  const small = size === "sm";
  return (
    <div className={cn("flex flex-col tracking-fg", small ? "gap-4 py-2" : "gap-6 py-4", className)}>
      <div className="flex flex-col gap-3">
        <span className={cn("flex items-center justify-center rounded-2xl bg-accent-soft text-accent", small ? "size-10" : "size-12")}>{icon ?? <StarsLinear size={small ? 20 : 24} />}</span>
        <div className="flex flex-col gap-1.5">
          <h2 className={cn("font-display font-bold text-fg-black", small ? "text-lg leading-7" : "text-2xl leading-8")}>{title}</h2>
          {description && <p className="max-w-xl text-sm leading-6 text-fg-grey-700">{description}</p>}
        </div>
      </div>
      {footer}
    </div>
  );
}
