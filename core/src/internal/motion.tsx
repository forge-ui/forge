"use client";

import { forwardRef, useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore, type HTMLAttributes, type RefObject, type ReactNode } from "react";
import type { MotionPreference } from "../lib/motion";
import { cn } from "../lib/utils";

const query = "(prefers-reduced-motion: reduce)";
function subscribe(listener: () => void) {
  const media = window.matchMedia?.(query);
  media?.addEventListener("change", listener);
  return () => media?.removeEventListener("change", listener);
}
const snapshot = () => typeof window === "undefined" || !window.matchMedia || window.matchMedia(query).matches;
const serverSnapshot = () => true;

export function useReducedMotion(motion: MotionPreference = "auto") {
  const reduced = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return motion === "none" || reduced;
}

/** Keeps only the visual exit mounted. Closed content is immediately inert. */
export const MotionPresence = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  motion?: MotionPreference;
}>(({ open, motion = "auto", children, className, ...props }, forwardedRef) => {
  const element = useRef<HTMLDivElement | null>(null);
  const [retained, setRetained] = useState(open);
  const reduced = useReducedMotion(motion);
  const mounted = open || (retained && !reduced);
  const ref = useCallback((node: HTMLDivElement | null) => {
    element.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }, [forwardedRef]);

  useLayoutEffect(() => {
    if (open) {
      // Retain synchronously before a close can arrive in the next frame.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRetained(true);
      return;
    }
    if (!retained) return;
    const duration = element.current ? getComputedStyle(element.current).getPropertyValue("--forge-motion-exit-duration").trim() : "";
    const parsed = Number.parseFloat(duration);
    const milliseconds = Number.isFinite(parsed) ? parsed * (duration.endsWith("ms") ? 1 : 1000) : 120;
    const timer = window.setTimeout(() => setRetained(false), reduced ? 0 : Math.max(0, milliseconds));
    return () => window.clearTimeout(timer);
  }, [open, reduced, retained]);

  if (!mounted) return null;
  return <div {...props} ref={ref} className={cn("forge-motion-surface", className)} data-motion={motion} data-state={open ? "open" : "closed"} inert={!open || undefined} aria-hidden={!open || props["aria-hidden"]}>{children}</div>;
});
MotionPresence.displayName = "MotionPresence";

/** Shared moving layer. Measures actual variable-width items, including resize. */
export function useMovingIndicator(root: RefObject<HTMLElement | null>, selector: string, key: unknown) {
  const indicator = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const container = root.current;
    const layer = indicator.current;
    if (!container || !layer) return;
    let disposed = false;
    function measure() {
      if (disposed || !container || !layer) return;
      const item = container.querySelector<HTMLElement>(selector);
      layer.style.visibility = item ? "visible" : "hidden";
      if (!item) return;
      layer.style.setProperty("--forge-indicator-x", `${item.offsetLeft}px`);
      layer.style.setProperty("--forge-indicator-y", `${item.offsetTop}px`);
      layer.style.setProperty("--forge-indicator-width", `${item.offsetWidth}px`);
      layer.style.setProperty("--forge-indicator-height", `${item.offsetHeight}px`);
    }
    measure();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(container);
    for (const child of container.children) if (child !== layer) observer?.observe(child);
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => { disposed = true; observer?.disconnect(); window.removeEventListener("resize", measure); };
  }, [root, selector, key]);
  return indicator;
}

/** CSS grid allows variable-height submenus to reverse direction mid-transition. */
export function MotionCollapse({ open, motion = "auto", children }: { open: boolean; motion?: MotionPreference; children: ReactNode }) {
  return <div className="forge-motion-collapse" data-motion={motion} data-state={open ? "open" : "closed"} inert={!open || undefined} aria-hidden={!open || undefined}><div className="min-h-0 overflow-hidden">{children}</div></div>;
}

/** One hover/focus layer shared by rows; it moves without changing hit areas. */
export function MotionMenu({ motion = "auto", children, className }: { motion?: MotionPreference; children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLSpanElement>(null);
  const target = useRef<HTMLElement | null>(null);
  const place = useCallback((element: HTMLElement | null) => {
    const container = root.current;
    const indicator = layer.current;
    if (!container || !indicator) return;
    const item = element?.closest<HTMLElement>("button, a[href], [role='option']");
    const usable = item && container.contains(item) && !item.matches(":disabled, [aria-disabled='true']");
    target.current = usable ? item : null;
    indicator.style.visibility = usable ? "visible" : "hidden";
    if (!usable) return;
    const rect = container.getBoundingClientRect();
    const row = item.getBoundingClientRect();
    const ratio = rect.width ? container.offsetWidth / rect.width : 1;
    indicator.style.setProperty("--forge-indicator-x", `${(row.left - rect.left) * ratio + container.scrollLeft}px`);
    indicator.style.setProperty("--forge-indicator-y", `${(row.top - rect.top) * ratio + container.scrollTop}px`);
    indicator.style.setProperty("--forge-indicator-width", `${row.width * ratio}px`);
    indicator.style.setProperty("--forge-indicator-height", `${row.height * ratio}px`);
  }, []);
  useLayoutEffect(() => {
    if (!root.current || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => place(target.current));
    observer.observe(root.current);
    for (const child of root.current.children) if (child !== layer.current) observer.observe(child);
    return () => observer.disconnect();
  }, [place, children]);
  return <div ref={root} className={cn("forge-motion-menu relative isolate", className)} data-motion={motion}
    onPointerMove={(event) => { if (event.pointerType !== "touch") place(event.target as HTMLElement); }}
    onPointerLeave={() => place(document.activeElement instanceof HTMLElement ? document.activeElement : null)}
    onFocusCapture={(event) => place(event.target as HTMLElement)}
    onBlurCapture={(event) => place(event.relatedTarget instanceof HTMLElement ? event.relatedTarget : null)}>
    <span ref={layer} aria-hidden className="forge-moving-indicator forge-menu-indicator bg-fg-grey-100 rounded-lg" />
    {children}
  </div>;
}
