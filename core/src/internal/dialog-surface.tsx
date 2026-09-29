"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import type { MotionPreference } from "../lib/motion";
import { useReducedMotion } from "./motion";
import { cn } from "../lib/utils";

export function DialogSurface({ open, onOpenChange, label, children, motion = "auto", side, className }: {
  open: boolean; onOpenChange: (open: boolean) => void; label: string; children: ReactNode;
  motion?: MotionPreference; side?: "left" | "right"; className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion(motion);
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) { if (!dialog.open) dialog.showModal(); return; }
    if (!dialog.open) return;
    if (reduced) { dialog.close(); return; }
    const raw = getComputedStyle(dialog).getPropertyValue("--forge-motion-exit-duration").trim();
    const parsed = parseFloat(raw);
    const duration = Number.isFinite(parsed) ? parsed * (raw.endsWith("ms") ? 1 : 1000) : 120;
    const timer = setTimeout(() => dialog.close(), Math.max(0, duration));
    return () => clearTimeout(timer);
  }, [open, reduced]);
  return <dialog ref={ref} aria-label={label} aria-modal="true" data-state={open ? "open" : "closed"} data-motion={motion} data-side={side}
    onKeyDown={(event) => {
      if (event.key !== "Tab" || !open) return;
      const elements = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')].filter(node => !node.closest('[inert]') && node.getClientRects().length > 0 && node.tabIndex >= 0);
      const first = elements[0], last = elements.at(-1);
      if (!first) { event.preventDefault(); event.currentTarget.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}
    onCancel={(event) => { event.preventDefault(); if (open) onOpenChange(false); }}
    onClose={() => { if (open) onOpenChange(false); }}
    onClick={(event) => {
      if (!open || event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onOpenChange(false);
    }}
    className={cn("forge-dialog border-0 bg-white p-0 text-fg-black shadow-xl", side ? "forge-drawer" : "forge-modal rounded-card", className)}>
    <div inert={!open || undefined} aria-hidden={!open || undefined}>{children}</div>
  </dialog>;
}
