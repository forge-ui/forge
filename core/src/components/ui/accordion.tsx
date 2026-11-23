"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AltArrowDownLinear } from "../../icons";
import { useReducedMotion } from "../../internal/motion";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";

export interface AccordionItem { value: string; title: string; content: ReactNode; disabled?: boolean }
export interface AccordionProps {
  items: AccordionItem[]; value?: string | null; defaultValue?: string | null;
  onValueChange?: (value: string | null) => void; motion?: MotionPreference; className?: string;
}

const motionVars = {
  "--forge-motion-layout-duration": "500ms",
  "--forge-motion-feedback-ease": "cubic-bezier(.2,.8,.2,1)",
} as CSSProperties;

/**
 * Single expanded section. Arrow keys, Home and End move between headers.
 * Closed answers stay mounted and are revealed by the browser's find-in-page.
 */
export function Accordion({ items, value, defaultValue = null, onValueChange, motion = "auto", className }: AccordionProps) {
  const reduced = useReducedMotion(motion);
  const effectiveMotion = reduced ? "none" : motion;
  const toArray = (next: string | null | undefined) => (next == null ? [] : [next]);
  const [internal, setInternal] = useState(defaultValue);
  const active = value === undefined ? internal : value;
  const rootRef = useRef<HTMLDivElement>(null);
  const focusedAnswer = useRef<string | null>(null);

  // Closing an answer that holds focus (e.g. a controlled change) hands focus to its header,
  // but never pulls focus back from somewhere else on the page.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const owner = focusedAnswer.current;
    if (!root || owner === null || owner === active) return;
    const focused = document.activeElement;
    const item = [...root.querySelectorAll<HTMLElement>("[data-forge-accordion-item]")].find(node => node.dataset.forgeAccordionItem === owner);
    if (item && (item.contains(focused) || focused === document.body)) item.querySelector<HTMLElement>("h3 button")?.focus({ preventScroll: true });
    focusedAnswer.current = null;
  }, [active]);

  return (
    <AccordionPrimitive.Root
      ref={rootRef}
      value={toArray(active)}
      onValueChange={(next) => {
        const nextValue = (next[0] as string | undefined) ?? null;
        if (value === undefined) setInternal(nextValue);
        onValueChange?.(nextValue);
      }}
      // Base UI leaves header navigation to the app: Arrow keys, Home and End move between
      // this accordion's enabled headers (nested accordions keep their own).
      onKeyDown={(event) => {
        const root = event.currentTarget;
        const target = event.target as HTMLElement;
        if (!target.matches("h3 > button") || target.closest(".forge-accordion") !== root) return;
        const buttons = [...root.querySelectorAll<HTMLButtonElement>("h3 > button:not(:disabled):not([data-disabled])")]
          .filter((button) => button.closest(".forge-accordion") === root);
        const current = buttons.indexOf(target as HTMLButtonElement);
        const next = event.key === "ArrowDown" ? (current + 1) % buttons.length : event.key === "ArrowUp" ? (current - 1 + buttons.length) % buttons.length : event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : -1;
        if (next >= 0) { event.preventDefault(); buttons[next]?.focus(); }
      }}
      className={cn("forge-accordion w-full divide-y divide-fg-grey-200", className)}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item key={item.value} value={item.value} disabled={item.disabled} style={motionVars} data-forge-accordion-item={item.value}>
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger
              className="group flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-fg-black disabled:opacity-50 data-disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-fg-violet"
            >
              {item.title}
              <span aria-hidden className="forge-chevron flex shrink-0 items-center justify-center text-fg-grey-700 group-data-panel-open:rotate-180" data-motion={effectiveMotion}>
                <AltArrowDownLinear size={20} />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Panel
            keepMounted
            hiddenUntilFound
            data-motion={effectiveMotion}
            className="forge-accordion-panel h-(--accordion-panel-height) overflow-hidden data-starting-style:h-0 data-ending-style:h-0"
          >
            <div
              className="forge-accordion-answer pb-4 text-sm leading-6 text-fg-grey-700"
              onFocusCapture={() => { focusedAnswer.current = item.value; }}
              onBlurCapture={(event) => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) focusedAnswer.current = null; }}
            >
              {item.content}
            </div>
          </AccordionPrimitive.Panel>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
