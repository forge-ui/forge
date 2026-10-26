"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import type { MotionPreference } from "../lib/motion";
import { cn } from "../lib/utils";

export function DialogSurface({ open, onOpenChange, label, children, motion = "auto", side, className }: {
  open: boolean; onOpenChange: (open: boolean) => void; label: string; children: ReactNode;
  motion?: MotionPreference; side?: "left" | "right"; className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const requestClose = (event: Event) => {
      event.preventDefault();
      if (open) onOpenChange(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      requestClose(event);
    };
    dialog.addEventListener("keydown", onEscape);
    dialog.addEventListener("cancel", requestClose);
    return () => {
      dialog.removeEventListener("keydown", onEscape);
      dialog.removeEventListener("cancel", requestClose);
    };
  }, [open, onOpenChange]);
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) { if (!dialog.open) dialog.showModal(); return; }
    if (!dialog.open) return;
    // motion="none" is instant. System reduced-motion still fades; CSS drops the shift.
    if (motion === "none") { dialog.close(); return; }
    let cancelled = false;
    const finish = () => {
      if (cancelled || !dialog.open) return;
      cancelled = true;
      dialog.close();
    };
    const onEnd = (event: TransitionEvent) => {
      if (event.target !== dialog || event.propertyName !== "opacity") return;
      finish();
    };
    dialog.addEventListener("transitionend", onEnd);
    const raw = getComputedStyle(dialog).getPropertyValue("--forge-motion-exit-duration").trim();
    const parsed = parseFloat(raw);
    const duration = Number.isFinite(parsed) ? parsed * (raw.endsWith("ms") ? 1 : 1000) : 120;
    const timer = window.setTimeout(finish, Math.max(0, duration));
    return () => {
      cancelled = true;
      dialog.removeEventListener("transitionend", onEnd);
      window.clearTimeout(timer);
    };
  }, [open, motion]);
  return <dialog ref={ref} aria-label={label} aria-modal="true" data-state={open ? "open" : "closed"} data-motion={motion} data-side={side}
    onKeyDown={(event) => {
      if (event.key !== "Tab" || !open) return;
      const elements = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')].filter(node => !node.closest('[inert]') && node.getClientRects().length > 0 && node.tabIndex >= 0);
      const first = elements[0], last = elements.at(-1);
      if (!first) { event.preventDefault(); event.currentTarget.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}
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
