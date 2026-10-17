"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion as animated } from "motion/react";
import { useReducedMotion } from "./motion";
import { cn } from "../lib/utils";
import type { MotionPreference } from "../lib/motion";
import type { ToolbarSelectionOptions } from "../components/ui/toolbar";
import { Button } from "../components/ui/button";

const focusable = "button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])";

function firstFocusable(root: HTMLElement | null) {
  return Array.from(root?.querySelectorAll<HTMLElement>(focusable) ?? [])
    .find(element => !element.closest("[inert], [hidden], [aria-hidden='true']"));
}

/** Selection presentation remains internal to Toolbar; the consumer owns its data and actions. */
export function ToolbarSelection({ selection, locale, motion, className, left, right }: {
  selection: ToolbarSelectionOptions;
  locale: "zh" | "en";
  motion: MotionPreference;
  className?: string;
  left?: ReactNode;
  right?: ReactNode;
}) {
  const reduced = useReducedMotion(motion);
  const count = Number.isFinite(selection.count) ? Math.max(0, Math.floor(selection.count)) : 0;
  const active = count > 0;
  const root = useRef<HTMLDivElement>(null);
  const normal = useRef<HTMLDivElement>(null);
  const selected = useRef<HTMLDivElement>(null);
  const previousActive = useRef(active);
  const normalFocus = useRef<HTMLElement | null>(null);
  const selectionFocus = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (previousActive.current === active) return;
    const focused = document.activeElement;
    if (active && normal.current?.contains(focused)) {
      (firstFocusable(selected.current) ?? root.current)?.focus();
    } else if (!active && (
      selected.current?.contains(focused) ||
      (focused === document.body && selectionFocus.current && !selectionFocus.current.isConnected)
    )) {
      const previous = normalFocus.current;
      const target = previous?.isConnected && !previous.closest("[hidden], [inert]") && !previous.matches(":disabled")
        ? previous : firstFocusable(normal.current);
      (target ?? root.current)?.focus();
    }
    if (!active) selectionFocus.current = null;
    previousActive.current = active;
  }, [active]);

  return <div ref={root} tabIndex={-1} data-forge-toolbar-selection data-motion={motion}
    className={cn("relative w-full outline-none", className)}>
    <div ref={normal} hidden={active} inert={active || undefined} aria-hidden={active || undefined}
      onFocusCapture={event => { normalFocus.current = event.target; }}
      className={cn("w-full flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-start", active ? "hidden" : "flex")}>
      {left}{right}
    </div>
    <div ref={selected} inert={!active || undefined} aria-hidden={!active || undefined}
      className={!active ? "pointer-events-none absolute inset-x-0 top-0" : undefined}
      onFocusCapture={event => { selectionFocus.current = event.target; }}
      onBlurCapture={event => { if (event.relatedTarget instanceof HTMLElement && !event.currentTarget.contains(event.relatedTarget)) selectionFocus.current = null; }}
      onKeyDown={event => {
        if (active && event.key === "Escape" && !event.defaultPrevented) {
          event.preventDefault();
          selection.onClear();
        }
      }}>
      <AnimatePresence initial={false}>
        {active && <animated.div key="selection" role="group" aria-label={locale === "zh" ? "批量操作" : "Selection actions"}
          initial={reduced ? false : { opacity: 0, y: 30, scale: .96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reduced ? 0 : 20 }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26, mass: .8 }}
          className="flex flex-wrap items-center gap-3 rounded-xl bg-fg-black p-3 text-fg-white shadow-md">
          <span role="status" aria-atomic="true" className="mr-auto text-xs font-semibold leading-4 tracking-fg text-fg-white">
            {selection.label ?? <><span className="sr-only">{locale === "zh" ? `${count} 项已选` : `${count} selected`}</span><span aria-hidden="true">
              <AnimatePresence mode="popLayout" initial={false}><animated.span key={count} className="inline-block tabular-nums"
                initial={reduced ? false : { y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}
                transition={{ duration: reduced ? 0 : .2 }}>{count}</animated.span></AnimatePresence>
              {locale === "zh" ? " 项已选" : " selected"}
            </span></>}
          </span>
          <Button size="sm" color="grey" variant="secondary" motion={motion} onClick={() => { if (active) selection.onClear(); }}>
            {selection.clearLabel ?? (locale === "zh" ? "取消选择" : "Clear selection")}
          </Button>
          <div className="flex flex-wrap items-center gap-2">{selection.actions}</div>
        </animated.div>}
      </AnimatePresence>
    </div>
  </div>;
}
