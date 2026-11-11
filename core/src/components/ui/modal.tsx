"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
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
  const frame = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLDivElement>(null);
  const footerElement = useRef<HTMLDivElement>(null);
  const [wholeScroll, setWholeScroll] = useState(false);
  useLayoutEffect(() => {
    if (!open || variant === "template") return;
    const measure = () => {
      if (!frame.current || !header.current) return;
      const style = getComputedStyle(frame.current);
      const padding = parseFloat(style.paddingTop || "0") + parseFloat(style.paddingBottom || "0");
      const gap = parseFloat(style.rowGap || "0") || 0;
      const fixed = header.current.offsetHeight + (footerElement.current?.offsetHeight ?? 0) + padding + gap * (footerElement.current ? 2 : 1);
      setWholeScroll(fixed + 48 > frame.current.clientHeight);
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    for (const element of [frame.current, header.current, footerElement.current]) if (element) observer?.observe(element);
    window.addEventListener("resize", measure);
    return () => { observer?.disconnect(); window.removeEventListener("resize", measure); };
  }, [open, title, footer, variant]);
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
    <div ref={frame} data-forge-modal-scroll={wholeScroll ? "whole" : "body"} className="flex min-w-0 flex-col gap-6 overflow-auto p-6" style={{ maxHeight: "inherit" }}>
      <div ref={header} className="flex shrink-0 items-start justify-between gap-4"><h2 className="min-w-0 flex-1 break-words text-xl font-semibold [overflow-wrap:anywhere]">{title}</h2><IconButton className="shrink-0" variant="ghost" size="sm" motion={motion} aria-label={closeLabel ?? (locale === "zh" ? "关闭弹窗" : "Close dialog")} onClick={() => onOpenChange(false)}><CloseCircleLinear size={20} /></IconButton></div>
      <div className="min-h-12 min-w-0 shrink overflow-auto [overflow-wrap:anywhere]" style={wholeScroll ? { overflow: "visible", flexShrink: 0 } : undefined}>{children}</div>
      {footer && <div ref={footerElement} className="flex shrink-0 flex-wrap justify-end gap-3">{footer}</div>}
    </div>
  </DialogSurface>;
}
