"use client";

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import { useCallback, useRef, type ReactElement, type ReactNode } from "react";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { floatingSurfaceClass, useControllableOpen, useDialogLayerRef, useFloatingContainer } from "../../internal/floating";

export type PreviewCardSide = "top" | "bottom" | "left" | "right";
export type PreviewCardAlign = "start" | "center" | "end";

export interface PreviewCardProps {
  /** Usually a link. It must forward `ref` and spread props onto an `<a>` element. */
  trigger: ReactElement;
  /** Card content shown on hover or keyboard focus. */
  children: ReactNode;
  side?: PreviewCardSide;
  align?: PreviewCardAlign;
  /** Hover delay before opening, in milliseconds. */
  delay?: number;
  /** Delay before closing after the pointer leaves, in milliseconds. */
  closeDelay?: number;
  /** Card width, any CSS width. Defaults to 320px. */
  width?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  motion?: MotionPreference;
}

/** Hover card that previews what a link points to, e.g. a user, project or document. */
export function PreviewCard({
  trigger,
  children,
  side = "bottom",
  align = "center",
  delay = 400,
  closeDelay = 200,
  width = "320px",
  open: openProp,
  onOpenChange,
  className,
  motion = "auto",
}: PreviewCardProps) {
  const [open, setOpen] = useControllableOpen(openProp, onOpenChange);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const container = useFloatingContainer(triggerRef, open);
  const close = useCallback(() => setOpen(false), [setOpen]);
  const layerRef = useDialogLayerRef(close, triggerRef);

  return (
    <PreviewCardPrimitive.Root open={open} onOpenChange={next => setOpen(next)}>
      <PreviewCardPrimitive.Trigger ref={triggerRef} render={trigger} delay={delay} closeDelay={closeDelay} />
      <PreviewCardPrimitive.Portal container={container}>
        <PreviewCardPrimitive.Positioner side={side} align={align} sideOffset={8} collisionPadding={8} className="z-50">
          <PreviewCardPrimitive.Popup
            ref={layerRef}
            data-motion={motion}
            className={cn("forge-popup max-w-[min(var(--available-width),calc(100vw-16px))] p-4 outline-none", floatingSurfaceClass, className)}
            style={{ width }}
          >
            {children}
          </PreviewCardPrimitive.Popup>
        </PreviewCardPrimitive.Positioner>
      </PreviewCardPrimitive.Portal>
    </PreviewCardPrimitive.Root>
  );
}
