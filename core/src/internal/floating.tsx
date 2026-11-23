"use client";

import { useCallback, useState } from "react";

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
