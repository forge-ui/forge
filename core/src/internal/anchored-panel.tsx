"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { useRef, type ReactElement, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { useInheritedScope } from "./floating";

/**
 * A trigger button with a non-modal panel below it (filters, calendars). The panel
 * brings its own surface; this only positions it and handles dismissal and focus.
 */
export function AnchoredPanel({ open, onOpenChange, trigger, children, label, side = "bottom", align = "end", className }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** A native `<button>` element; receives the trigger props and ref. */
  trigger: ReactElement;
  children: ReactNode;
  label?: string;
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
  className?: string;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scope = useInheritedScope(triggerRef, open);
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={next => onOpenChange(next)} modal={false}>
      <PopoverPrimitive.Trigger ref={triggerRef} render={trigger} />
      <PopoverPrimitive.Portal {...scope}>
        <PopoverPrimitive.Positioner side={side} align={align} sideOffset={8} collisionPadding={8} className="z-50">
          <PopoverPrimitive.Popup aria-label={label} data-motion="auto" className={cn("forge-popup max-h-(--available-height) overflow-y-auto outline-none", className)}>
            {children}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
