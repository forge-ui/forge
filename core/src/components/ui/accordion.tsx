"use client";

import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AltArrowDownLinear } from "../../icons";
import { MotionCollapse, useReducedMotion } from "../../internal/motion";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";

export interface AccordionItem { value: string; title: string; content: ReactNode; disabled?: boolean }
export interface AccordionProps {
  items: AccordionItem[]; value?: string | null; defaultValue?: string | null;
  onValueChange?: (value: string | null) => void; motion?: MotionPreference; className?: string;
}

function AccordionSection({ item, open, onToggle, motion, reduced }: {
  item: AccordionItem; open: boolean; onToggle: () => void;
  motion: MotionPreference; reduced: boolean;
}) {
  const id = useId();
  const triggerId = `${id}-trigger`, panelId = `${id}-panel`;
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const focusWithin = useRef(false);

  useLayoutEffect(() => {
    if (open || !panel.current) return;
    const focused = document.activeElement;
    // Some browsers blur a descendant as soon as its ancestor becomes inert.
    if (panel.current.contains(focused) || (focusWithin.current && focused === document.body)) {
      trigger.current?.focus({ preventScroll: true });
    }
    focusWithin.current = false;
  }, [open]);

  return <div style={{
    "--forge-motion-layout-duration": "500ms",
    "--forge-motion-feedback-ease": "cubic-bezier(.2,.8,.2,1)",
  } as CSSProperties}>
    <h3><button type="button" ref={trigger} id={triggerId} aria-controls={panelId} aria-expanded={open} disabled={item.disabled}
      className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-fg-black disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-fg-violet"
      onClick={onToggle}
      onKeyDown={(event) => {
        const root = event.currentTarget.closest(".forge-accordion");
        const buttons = [...root?.querySelectorAll<HTMLButtonElement>("h3 > button:not(:disabled)") ?? []]
          .filter((button) => button.closest(".forge-accordion") === root);
        const current = buttons.indexOf(event.currentTarget);
        const next = event.key === "ArrowDown" ? (current + 1) % buttons.length : event.key === "ArrowUp" ? (current - 1 + buttons.length) % buttons.length : event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : -1;
        if (next >= 0) { event.preventDefault(); buttons[next]?.focus(); }
      }}>
      {item.title}
      <span aria-hidden className="forge-chevron flex shrink-0 items-center justify-center text-fg-grey-700" data-motion={motion} data-expanded={open}>
        <AltArrowDownLinear size={20} />
      </span>
    </button></h3>
    <MotionCollapse open={open} motion={motion}>
      <div ref={panel} id={panelId} role="region" aria-labelledby={triggerId} className="pb-4 text-sm leading-6 text-fg-grey-700"
        onFocusCapture={() => { focusWithin.current = true; }}
        onBlurCapture={(event) => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) focusWithin.current = false; }}
        style={{
          opacity: open ? 1 : 0,
          transform: open || reduced ? "none" : "translateY(-8px)",
          transition: reduced ? "none" : `opacity ${open ? 250 : 150}ms cubic-bezier(.2,.8,.2,1) ${open ? 80 : 0}ms, transform 450ms cubic-bezier(.34,1.16,.64,1) ${open ? 80 : 0}ms`,
        }}>
        {item.content}
      </div>
    </MotionCollapse>
  </div>;
}

/** Single expanded section. Arrow keys, Home and End move between headers. */
export function Accordion({ items, value, defaultValue = null, onValueChange, motion = "auto", className }: AccordionProps) {
  const [internal, setInternal] = useState(defaultValue);
  const active = value === undefined ? internal : value;
  const reduced = useReducedMotion(motion);
  return <div className={cn("forge-accordion w-full divide-y divide-fg-grey-200", className)}>
    {items.map((item) => <AccordionSection key={item.value} item={item} open={item.value === active} motion={motion} reduced={reduced}
      onToggle={() => {
        const next = item.value === active ? null : item.value;
        if (value === undefined) setInternal(next);
        onValueChange?.(next);
      }} />)}
  </div>;
}
