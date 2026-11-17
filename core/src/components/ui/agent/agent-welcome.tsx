"use client";

import type { ReactNode } from "react";
import { ArrowRightUpLinear, StarsLinear } from "../../../icons";
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
    <div className={cn("@container flex flex-col tracking-fg", small ? "gap-4 py-2" : "gap-6 py-4", className)}>
      <div className="flex flex-col gap-3">
        <span className={cn("flex items-center justify-center rounded-2xl bg-accent-soft text-accent", small ? "size-10" : "size-12")}>{icon ?? <StarsLinear size={small ? 20 : 24} />}</span>
        <div className="flex flex-col gap-1.5">
          <h2 className={cn("font-display font-bold text-fg-black", small ? "text-lg leading-7" : "text-2xl leading-8")}>{title}</h2>
          {description && <p className="max-w-xl text-sm leading-6 text-fg-grey-700">{description}</p>}
        </div>
      </div>
      {capabilities.length > 0 && (
        <div className={cn("grid gap-2", !small && "@lg:grid-cols-2")}>
          {capabilities.map((capability, index) => (
            <button
              key={capability.id}
              type="button"
              disabled={!onPick}
              onClick={() => onPick?.(capability.prompt)}
              style={{ animationDelay: `${index * 60}ms` }}
              className="forge-fade-up group flex min-w-0 items-start gap-3 rounded-2xl bg-background p-4 text-left outline outline-1 outline-offset-[-1px] outline-fg-grey-200 transition-all enabled:hover:bg-fg-grey-50 enabled:hover:outline-fg-grey-300"
            >
              {capability.icon && <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">{capability.icon}</span>}
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold text-fg-black">{capability.title}</span>
                {capability.description && <span className="text-xs leading-5 text-fg-grey-500">{capability.description}</span>}
              </span>
              <ArrowRightUpLinear size={16} color="var(--fg-grey-400)" className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}
      {footer}
    </div>
  );
}
