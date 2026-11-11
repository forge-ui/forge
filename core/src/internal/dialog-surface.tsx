"use client";

import { createContext, useContext, useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { MotionPreference } from "../lib/motion";
import { closeOwnedDialogLayers, ownsDialogLayer, dialogReturnTarget, focusIfAvailable, isTopDialog, isTopDialogLayer, isDialogInert, registerDialogLayer } from "./dialog-ownership";
import { cn } from "../lib/utils";

const DialogParentOpen = createContext(true);

export function DialogSurface({ open, onOpenChange, label, children, motion = "auto", side, className, appearance = "default" }: {
  open: boolean; onOpenChange: (open: boolean) => void; label: string; children: ReactNode;
  motion?: MotionPreference; side?: "left" | "right"; className?: string;
  appearance?: "default" | "template";
}) {
  const parentOpen = useContext(DialogParentOpen);
  const [ownerClosed, setOwnerClosed] = useState(false);
  const active = open && parentOpen && !ownerClosed;
  const ref = useRef<HTMLDialogElement>(null);
  const closeRequested = useRef(false);
  const previousFocus = useRef<HTMLElement | null>(null);
  const restoreFocus = useRef(true);
  const onChange = useRef(onOpenChange);
  useLayoutEffect(() => { onChange.current = onOpenChange; }, [onOpenChange]);
  const requestClose = useCallback((shouldRestore = true) => {
    if (closeRequested.current) return;
    closeRequested.current = true;
    restoreFocus.current = shouldRestore;
    onChange.current(false);
    // A controlled host may reject this close; a later user action must retry.
    queueMicrotask(() => {
      closeRequested.current = false;
      if (ref.current?.dataset.state === "open") restoreFocus.current = true;
    });
  }, []);
  if (!open && ownerClosed) setOwnerClosed(false);
  useLayoutEffect(() => {
    // Controlled state still belongs to the host. Suspend descendants immediately
    // while requesting the host to close them, including when it rejects the request.
    if (!parentOpen && open) requestClose();
  }, [parentOpen, open, requestClose]);
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog || !active) return;
    closeRequested.current = false;
    const unregister = registerDialogLayer(dialog, () => requestClose(), undefined, () => { requestClose(); setOwnerClosed(true); });
    const onCancel = (event: Event) => {
      if (event.target !== dialog) return;
      event.preventDefault();
      event.stopPropagation();
      if (isTopDialogLayer(dialog)) requestClose();
    };
    dialog.addEventListener("cancel", onCancel);
    return () => { unregister(); dialog.removeEventListener("cancel", onCancel); };
  }, [active, requestClose]);
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (active) {
      if (!dialog.open) {
        previousFocus.current = dialogReturnTarget(document.activeElement as HTMLElement | null);
        restoreFocus.current = true;
        dialog.showModal();
      }
      return;
    }
    const restoringFromChild = ownsDialogLayer(dialog, document.activeElement?.closest("dialog") ?? null);
    closeOwnedDialogLayers(dialog);
    if (!dialog.open) return;
    // motion="none" is instant. System reduced-motion still fades; CSS drops the shift.
    const close = () => {
      const active = document.activeElement;
      const shouldRestore = restoreFocus.current && (!active || active === document.body || (active instanceof HTMLElement && (active.closest("dialog") === dialog || restoringFromChild)));
      dialog.close();
      if (shouldRestore) {
        const target = previousFocus.current;
        if (!focusIfAvailable(target)) {
          const parent = dialog.parentElement?.closest<HTMLDialogElement>('dialog[open]');
          if (parent) focusIfAvailable(parent);
        }
      } else if (active instanceof HTMLElement) focusIfAvailable(active);
    };
    if (motion === "none" || !parentOpen || ownerClosed) { close(); return; }
    let cancelled = false;
    const finish = () => {
      if (cancelled || !dialog.open) return;
      cancelled = true;
      close();
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
  }, [active, motion, parentOpen, ownerClosed]);
  return <dialog ref={ref} aria-label={label} aria-modal="true" data-state={active ? "open" : "closed"} data-motion={motion} data-side={side} tabIndex={-1} style={{ overflow: "visible" }}
    onKeyDown={(event) => {
      if (event.key !== "Tab" || !active || !isTopDialog(event.currentTarget) || (event.target as Element).closest("dialog") !== event.currentTarget) return;
      const elements = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')].filter(node => node.closest("dialog") === event.currentTarget && !isDialogInert(node) && node.getClientRects().length > 0 && node.tabIndex >= 0);
      const first = elements[0], last = elements.at(-1);
      if (!first) { event.preventDefault(); event.currentTarget.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}
    onClose={(event) => { if (event.target === event.currentTarget && !event.currentTarget.open && active && !closeRequested.current) { requestClose(); } }}
    onClick={(event) => {
      if (!active || closeRequested.current || !isTopDialog(event.currentTarget) || event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) { requestClose(false); }
    }}
    className={cn("forge-dialog border-0 bg-background p-0 text-fg-black", appearance === "template" ? "forge-template-modal rounded-card shadow-lg" : cn("shadow-xl", side ? "forge-drawer" : "forge-modal rounded-card"), className)}>
    <div inert={!active || undefined} aria-hidden={!active || undefined} data-forge-dialog-content style={{ maxHeight: "inherit", overflow: "auto", borderRadius: "inherit", minWidth: 0 }}>
      <DialogParentOpen.Provider value={active}>{children}</DialogParentOpen.Provider>
      <span data-forge-dialog-portal />
    </div>
  </dialog>;
}
