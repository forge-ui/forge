"use client";

import { useLayoutEffect, useRef } from "react";
import { CloseCircleLinear } from "../../icons";
import { useReducedMotion } from "../../internal/motion";
import { DialogSurface } from "../../internal/dialog-surface";
import { IconButton } from "./icon-button";
import type { ModalProps } from "./modal";

export interface DrawerProps extends ModalProps { side?: "left" | "right"; transition?: "slide" | "reveal"; /** Viewport coordinates of the trigger center. */ revealOrigin?: { x: number; y: number } }

export function Drawer({ open, onOpenChange, title, children, footer, motion = "auto", side = "right", className, locale = "zh", closeLabel, transition = "slide", revealOrigin }: DrawerProps) {
  const content = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion(motion);
  useLayoutEffect(() => {
    const el = content.current; if (!el || !open || reduced || transition !== "reveal" || !el.animate) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, (revealOrigin?.x ?? rect.right) - rect.left));
    const y = Math.max(0, Math.min(rect.height, (revealOrigin?.y ?? rect.top) - rect.top));
    const animation = el.animate([{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${Math.hypot(rect.width, rect.height)}px at ${x}px ${y}px)` }], { duration: 500, easing: "cubic-bezier(.2,.8,.2,1)" });
    return () => animation.cancel();
  }, [open, reduced, transition, revealOrigin?.x, revealOrigin?.y]);
  return <DialogSurface open={open} onOpenChange={onOpenChange} label={title} motion={motion} side={side} className={className}>
    <div ref={content} className="flex min-h-dvh flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">{title}</h2><IconButton variant="ghost" size="sm" motion={motion} aria-label={closeLabel ?? (locale === "zh" ? "关闭抽屉" : "Close drawer")} onClick={() => onOpenChange(false)}><CloseCircleLinear size={20} /></IconButton></div>
      <div className="flex-1">{children}</div>
      {footer && <div className="flex flex-wrap justify-end gap-3">{footer}</div>}
    </div>
  </DialogSurface>;
}
