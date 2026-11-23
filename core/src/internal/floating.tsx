"use client";

import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { registerDialogLayer } from "./dialog-ownership";

export const floatingSurfaceClass =
  "bg-background rounded-2xl shadow-[0px_4px_30px_0px_rgba(77,84,100,0.05)] outline outline-1 outline-offset-[-1px] outline-fg-grey-200";

export function useControllableOpen(open: boolean | undefined, onOpenChange: ((open: boolean) => void) | undefined, defaultOpen = false) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const value = open ?? uncontrolled;
  const setOpen = useCallback((next: boolean) => {
    if (open === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  }, [open, onOpenChange]);
  return [value, setOpen] as const;
}

/**
 * Native modal dialogs live in the browser top layer, so floating content opened
 * from inside one must portal into that dialog instead of document.body.
 * Resolved before opening: switching containers mid-open would remount the popup.
 */
export function useFloatingContainer(anchor: RefObject<HTMLElement | null>, open: boolean) {
  const [container, setContainer] = useState<HTMLElement | undefined>(undefined);
  useLayoutEffect(() => {
    if (!anchor.current) return;
    // Checked without `[open]`: a Modal calls showModal() after its children's layout effects.
    const dialog = anchor.current.closest("dialog");
    const next = dialog
      ? [...dialog.querySelectorAll<HTMLElement>("[data-forge-dialog-portal]")].find(node => node.closest("dialog") === dialog) ?? dialog
      : anchor.current.ownerDocument.body;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContainer(current => current === next ? current : next);
  }, [open, anchor]);
  return container;
}

/**
 * Registers the popup with the shared dialog layer stack so Escape closes the
 * popup first instead of the Modal that owns it.
 */
export function useDialogLayerRef(close: () => void, focusOwner: RefObject<HTMLElement | null>) {
  const closeRef = useRef(close);
  const unregisterRef = useRef<(() => void) | undefined>(undefined);
  useLayoutEffect(() => { closeRef.current = close; }, [close]);
  const unregister = useCallback(() => {
    unregisterRef.current?.();
    unregisterRef.current = undefined;
  }, []);
  useLayoutEffect(() => unregister, [unregister]);
  // Base UI merges refs with null-on-detach semantics, so cleanup is tracked here.
  return useCallback((node: HTMLElement | null) => {
    unregister();
    if (!node) return;
    const unregisterLayer = registerDialogLayer(node, () => closeRef.current(), focusOwner.current);
    // A popup must not outlive the dialog that owns its trigger.
    const owner = focusOwner.current?.closest("dialog");
    const observer = owner ? new owner.ownerDocument.defaultView!.MutationObserver(() => {
      if (!owner.open || owner.dataset.state === "closed") closeRef.current();
    }) : null;
    observer?.observe(owner!, { attributes: true, attributeFilter: ["open", "data-state"] });
    unregisterRef.current = () => { observer?.disconnect(); unregisterLayer(); };
  }, [focusOwner, unregister]);
}
