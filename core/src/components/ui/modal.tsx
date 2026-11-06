"use client";

import type { ReactNode } from "react";
import type { MotionPreference } from "../../lib/motion";
import { DialogSurface } from "../../internal/dialog-surface";
import { CloseCircleLinear } from "../../icons";
import { IconButton } from "./icon-button";
import { Button } from "./button";
import { CloseIcon } from "./plain-icons";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  ariaLabel?: string;
  variant?: "default" | "template";
  width?: string;
  children: ReactNode;
  footer?: ReactNode;
  motion?: MotionPreference;
  locale?: "zh" | "en";
  closeLabel?: string;
  className?: string;
}

export function Modal({ open, onOpenChange, title, ariaLabel, variant = "default", width = "w-[560px]", children, footer, motion = "auto", locale = "zh", closeLabel, className }: ModalProps) {
  const label = title || ariaLabel || (locale === "zh" ? "弹窗" : "Dialog");
  if (variant === "template") {
    if (!open) return null;
    return <DialogSurface open={open} onOpenChange={onOpenChange} label={label} motion="none" appearance="template" className={`${width} ${className ?? ""}`}>
      <div className="overflow-hidden flex flex-col">
        {title && <>
          <div className="flex items-center justify-between pt-6 px-6">
            <h3 className="text-xl font-semibold text-fg-black leading-8 tracking-fg">{title}</h3>
            <Button variant="unstyled" aria-label={closeLabel ?? (locale === "zh" ? "关闭弹窗" : "Close dialog")} onClick={() => onOpenChange(false)} className="w-7 h-7 flex items-center justify-center bg-transparent cursor-pointer text-fg-black"><CloseIcon size={20} /></Button>
          </div>
          <div className="h-px w-full bg-fg-grey-200 mt-6" />
        </>}
        {children}
        {footer}
      </div>
    </DialogSurface>;
  }
  return <DialogSurface open={open} onOpenChange={onOpenChange} label={label} motion={motion} className={className}>
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">{title}</h2><IconButton variant="ghost" size="sm" motion={motion} aria-label={closeLabel ?? (locale === "zh" ? "关闭弹窗" : "Close dialog")} onClick={() => onOpenChange(false)}><CloseCircleLinear size={20} /></IconButton></div>
      <div>{children}</div>
      {footer && <div className="flex flex-wrap justify-end gap-3">{footer}</div>}
    </div>
  </DialogSurface>;
}
