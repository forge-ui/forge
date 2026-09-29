"use client";

import { useId, useState, type ReactNode } from "react";
import { MotionCollapse } from "../../internal/motion";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";

export interface AccordionItem { value: string; title: string; content: ReactNode; disabled?: boolean }
export interface AccordionProps {
  items: AccordionItem[]; value?: string | null; defaultValue?: string | null;
  onValueChange?: (value: string | null) => void; motion?: MotionPreference; className?: string;
}
/** Single expanded section. Arrow keys, Home and End move between headers. */
export function Accordion({ items, value, defaultValue = null, onValueChange, motion = "auto", className }: AccordionProps) {
  const [internal, setInternal] = useState(defaultValue);
  const active = value === undefined ? internal : value;
  const id = useId();
  return <div className={cn("forge-accordion w-full divide-y divide-fg-grey-200", className)}>
    {items.map((item, index) => {
      const open = item.value === active;
      const trigger = `${id}-trigger-${index}`, panel = `${id}-panel-${index}`;
      return <div key={item.value}>
        <h3><button type="button" id={trigger} aria-controls={panel} aria-expanded={open} disabled={item.disabled}
          className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-fg-black disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-fg-violet"
          onClick={() => { const next = open ? null : item.value; if (value === undefined) setInternal(next); onValueChange?.(next); }}
          onKeyDown={(event) => {
            const buttons = [...event.currentTarget.closest('.forge-accordion')?.querySelectorAll<HTMLButtonElement>('h3 > button:not(:disabled)') ?? []];
            const current = buttons.indexOf(event.currentTarget);
            const next = event.key === "ArrowDown" ? (current + 1) % buttons.length : event.key === "ArrowUp" ? (current - 1 + buttons.length) % buttons.length : event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : -1;
            if (next >= 0) { event.preventDefault(); buttons[next]?.focus(); }
          }}>{item.title}<span aria-hidden className="forge-chevron" data-motion={motion} data-expanded={open}>⌄</span></button></h3>
        <MotionCollapse open={open} motion={motion}><div id={panel} role="region" aria-labelledby={trigger} className="pb-4 text-sm leading-6 text-fg-grey-700">{item.content}</div></MotionCollapse>
      </div>;
    })}
  </div>;
}
