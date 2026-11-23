"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { useRef, useState, type ReactElement, type ReactNode } from "react";
import { DangerTriangleLinear, InfoCircleLinear } from "../../icons";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { floatingSurfaceClass, useControllableOpen, useInheritedScope } from "../../internal/floating";
import { Button } from "./button";

export interface PopconfirmProps {
  /** The button that asks for confirmation. Must forward ref and props to a DOM element. */
  trigger: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `danger` for deletes and other irreversible actions. */
  tone?: "default" | "danger";
  /** May return a promise; the button shows a spinner and the bubble stays open until it settles. */
  onConfirm: () => void | Promise<unknown>;
  onCancel?: () => void;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  motion?: MotionPreference;
  className?: string;
}

/** Lightweight confirmation next to the action, for row-level deletes and toggles. Use ConfirmationDialog for page-level decisions. */
export function Popconfirm({ trigger, title, description, confirmLabel = "确定", cancelLabel = "取消", tone = "default", onConfirm, onCancel, side = "top", align = "center", open: openProp, onOpenChange, motion = "auto", className }: PopconfirmProps) {
  const [open, setOpen] = useControllableOpen(openProp, onOpenChange);
  const [pending, setPending] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const scope = useInheritedScope(triggerRef, open);
  const danger = tone === "danger";

  async function confirm() {
    try {
      setPending(true);
      await onConfirm();
      setOpen(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={next => { if (!pending) { setOpen(next); if (!next) onCancel?.(); } }} modal={false}>
      <PopoverPrimitive.Trigger ref={triggerRef} render={trigger} />
      <PopoverPrimitive.Portal {...scope}>
        <PopoverPrimitive.Positioner side={side} align={align} sideOffset={8} collisionPadding={8} className="z-50">
          <PopoverPrimitive.Popup
            ref={popupRef}
            role="alertdialog"
            // Start on the safe choice so a stray Enter does not confirm.
            initialFocus={() => popupRef.current?.querySelector<HTMLElement>("[data-popconfirm-cancel]") ?? true}
            data-motion={motion}
            className={cn("forge-popup flex w-72 max-w-[calc(100vw-16px)] flex-col gap-4 p-4 outline-none tracking-fg", floatingSurfaceClass, className)}
          >
            <div className="flex gap-3">
              <span aria-hidden className={cn("mt-0.5 flex shrink-0", danger ? "text-fg-red" : "text-fg-yellow-700")}>
                {danger ? <DangerTriangleLinear size={20} /> : <InfoCircleLinear size={20} />}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <PopoverPrimitive.Title className="text-sm font-semibold leading-5 text-fg-black">{title}</PopoverPrimitive.Title>
                {description && <PopoverPrimitive.Description className="text-sm leading-5 text-fg-grey-700">{description}</PopoverPrimitive.Description>}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button data-popconfirm-cancel size="sm" variant="secondary" color="grey" disabled={pending} motion={motion} onClick={() => { setOpen(false); onCancel?.(); }}>{cancelLabel}</Button>
              <Button size="sm" color={danger ? "red" : "blue"} loading={pending} motion={motion} onClick={confirm}>{confirmLabel}</Button>
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
