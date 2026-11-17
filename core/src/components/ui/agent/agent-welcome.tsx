"use client";

import type { ReactNode } from "react";
import { StarsLinear } from "../../../icons";
import { cn } from "../../../lib/utils";

export type WelcomeCapability = {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Sent as the first message when picked. */
  prompt: string;
};

export type AgentWelcomeProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** What it can do, as cards that start a conversation. */
  capabilities?: WelcomeCapability[];
  onPick?: (prompt: string) => void;
  /** Anything under the cards, e.g. recent conversations. */
  footer?: ReactNode;
  size?: "md" | "sm";
  className?: string;
};

/** The empty conversation: who the agent is, what it can do, and cards that start a first task. */
export function AgentWelcome({ title, description, icon, capabilities = [], onPick, footer, size = "md", className }: AgentWelcomeProps) {
  const small = size === "sm";
  return (
    <div className={cn("flex flex-col gap-4 tracking-fg", small ? "py-2" : "py-6", className)}>
      <div className="flex flex-col gap-2">
        <span className={cn("flex items-center justify-center rounded-xl bg-fg-blue-50 text-accent", small ? "size-9" : "size-11")}>{icon ?? <StarsLinear size={small ? 18 : 22} />}</span>
        <h2 className={cn("font-semibold text-fg-black", small ? "text-base" : "text-xl")}>{title}</h2>
        {description && <p className={cn("leading-6 text-fg-grey-700", small ? "text-[13px]" : "text-sm")}>{description}</p>}
      </div>
      {capabilities.length > 0 && (
        <div className={cn("grid gap-2", small ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
          {capabilities.map(capability => (
            <button key={capability.id} type="button" disabled={!onPick} onClick={() => onPick?.(capability.prompt)} className="flex min-w-0 items-start gap-2.5 rounded-xl border border-fg-grey-200 bg-background p-3 text-left transition-colors enabled:hover:border-accent enabled:hover:bg-fg-grey-50">
              {capability.icon && <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-fg-grey-100 text-fg-grey-900">{capability.icon}</span>}
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[13px] font-semibold text-fg-black">{capability.title}</span>
                {capability.description && <span className="text-xs leading-5 text-fg-grey-700">{capability.description}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
      {footer}
    </div>
  );
}
