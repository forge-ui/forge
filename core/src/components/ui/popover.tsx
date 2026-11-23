"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { useCallback, useRef, type ReactElement, type ReactNode } from "react";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { floatingSurfaceClass, useControllableOpen } from "../../internal/floating";

export type PopoverSide = "top" | "bottom" | "left" | "right";
export type PopoverAlign = "start" | "center" | "end";

export interface PopoverProps {
  /** Element that toggles the popover. It must forward `ref` and spread props onto a DOM element (Button, IconTrigger, native button). */
  trigger: ReactElement;
  /** Panel content. Pass a function to receive `close`. */
  children: ReactNode | ((close: () => void) => ReactNode);
  title?: ReactNode;
  description?: ReactNode;
  side?: PopoverSide;
  align?: PopoverAlign;
  /** Gap between trigger and panel, in pixels. */
  sideOffset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Open on hover as well as click. */
  openOnHover?: boolean;
  /** Panel width, any CSS width. Defaults to content width (max 320px). */
  width?: string;
  className?: string;
  motion?: MotionPreference;
}

export function Popover({
  trigger,
  children,
  title,
  description,
  side = "bottom",
  align = "center",
  sideOffset = 8,
  open: openProp,
  defaultOpen,
  onOpenChange,
  openOnHover = false,
  width,
  className,
  motion = "auto",
}: PopoverProps) {
  const [open, setOpen] = useControllableOpen(openProp, onOpenChange, defaultOpen);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const close = useCallback(() => setOpen(false), [setOpen]);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={next => setOpen(next)} modal={false}>
      <PopoverPrimitive.Trigger ref={triggerRef} render={trigger} openOnHover={openOnHover} />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner side={side} align={align} sideOffset={sideOffset} collisionPadding={8} className="z-50">
          <PopoverPrimitive.Popup
            data-motion={motion}
            className={cn(
              "forge-popup flex max-h-(--available-height) max-w-[min(var(--available-width),calc(100vw-16px))] flex-col gap-3 overflow-y-auto p-4 outline-none",
              !width && "w-max max-w-80",
              floatingSurfaceClass,
              className,
            )}
            style={width ? { width } : undefined}
          >
            {(title || description) && (
              <div className="flex flex-col gap-1">
                {title && <PopoverPrimitive.Title className="text-sm font-semibold leading-5 tracking-fg text-fg-black">{title}</PopoverPrimitive.Title>}
                {description && <PopoverPrimitive.Description className="text-xs leading-4 tracking-fg text-fg-grey-700">{description}</PopoverPrimitive.Description>}
              </div>
            )}
            {typeof children === "function" ? children(close) : children}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
