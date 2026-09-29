"use client";

import { DialogSurface } from "../../internal/dialog-surface";
import { IconButton } from "./icon-button";
import type { ModalProps } from "./modal";

export interface DrawerProps extends ModalProps { side?: "left" | "right" }

export function Drawer({ open, onOpenChange, title, children, footer, motion = "auto", side = "right", className }: DrawerProps) {
  return <DialogSurface open={open} onOpenChange={onOpenChange} label={title} motion={motion} side={side} className={className}>
    <div className="flex min-h-dvh flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">{title}</h2><IconButton variant="ghost" size="sm" motion={motion} aria-label="关闭抽屉" onClick={() => onOpenChange(false)}>×</IconButton></div>
      <div className="flex-1">{children}</div>
      {footer && <div className="flex flex-wrap justify-end gap-3">{footer}</div>}
    </div>
  </DialogSurface>;
}
