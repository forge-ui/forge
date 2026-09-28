"use client";

import type { ReactNode } from "react";
import type { MotionPreference } from "../../lib/motion";
import { DialogSurface } from "../../internal/dialog-surface";
import { IconButton } from "./icon-button";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  motion?: MotionPreference;
  className?: string;
}

export function Modal({ open, onOpenChange, title, children, footer, motion = "auto", className }: ModalProps) {
  return <DialogSurface open={open} onOpenChange={onOpenChange} label={title} motion={motion} className={className}>
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">{title}</h2><IconButton variant="ghost" size="sm" motion={motion} aria-label="关闭弹窗" onClick={() => onOpenChange(false)}>×</IconButton></div>
      <div>{children}</div>
      {footer && <div className="flex flex-wrap justify-end gap-3">{footer}</div>}
    </div>
  </DialogSurface>;
}
