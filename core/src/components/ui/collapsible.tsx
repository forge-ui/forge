"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import type { ReactNode } from "react";
import { AltArrowDownLinear } from "../../icons";
import { useReducedMotion } from "../../internal/motion";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";

export interface CollapsibleProps {
  /** Text or content of the toggle row. */
  title: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  motion?: MotionPreference;
  className?: string;
}

/** A single show/hide section, e.g. "advanced settings". Use Accordion for a list of sections. */
export function Collapsible({ title, children, open, defaultOpen, onOpenChange, disabled, motion = "auto", className }: CollapsibleProps) {
  const reduced = useReducedMotion(motion);
  const effectiveMotion = reduced ? "none" : motion;
  return (
    <CollapsiblePrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={(next) => onOpenChange?.(next)} disabled={disabled} className={cn("w-full", className)}>
      <CollapsiblePrimitive.Trigger className="group flex w-full items-center justify-between gap-4 py-3 text-left text-sm font-medium text-fg-black outline-none cursor-pointer data-disabled:cursor-not-allowed data-disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-fg-blue rounded-md">
        {title}
        <span aria-hidden className="forge-chevron flex shrink-0 items-center justify-center text-fg-grey-700 group-data-panel-open:rotate-180" data-motion={effectiveMotion}>
          <AltArrowDownLinear size={20} />
        </span>
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Panel
        keepMounted
        hiddenUntilFound
        data-motion={effectiveMotion}
        className="forge-collapsible-panel h-(--collapsible-panel-height) overflow-hidden data-starting-style:h-0 data-ending-style:h-0"
      >
        <div className="pb-3 text-sm leading-6 text-fg-grey-700">{children}</div>
      </CollapsiblePrimitive.Panel>
    </CollapsiblePrimitive.Root>
  );
}
