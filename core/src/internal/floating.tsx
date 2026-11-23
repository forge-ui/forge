"use client";

import { useCallback, useLayoutEffect, useState, type RefObject } from "react";

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
 * Popups portal to document.body, outside any `data-accent` / `data-theme` subtree.
 * Spread the result on the Portal so accent and theme tokens still resolve.
 */
export function useInheritedScope(anchor: RefObject<HTMLElement | null>, open: boolean) {
  const [scope, setScope] = useState<{ accent?: string; theme?: string }>({});
  useLayoutEffect(() => {
    const node = anchor.current;
    if (!open || !node) return;
    const accent = node.closest("[data-accent]")?.getAttribute("data-accent") ?? undefined;
    const theme = node.closest("[data-theme]")?.getAttribute("data-theme") ?? undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScope(current => current.accent === accent && current.theme === theme ? current : { accent, theme });
  }, [anchor, open]);
  return { "data-accent": scope.accent, "data-theme": scope.theme };
}
