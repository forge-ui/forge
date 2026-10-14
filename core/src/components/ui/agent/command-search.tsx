"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge implementation with Solar icons and shared component tokens.
 */

import { useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { MagniferLinear } from "../../../icons";
import { useMovingIndicator, useReducedMotion } from "../../../internal/motion";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { accentColors, type AccentColor } from "../accent-utils";
import { SurfaceCard } from "../surface-card";

export type CommandSearchItem = {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  keywords?: string[];
  /** Optional leading icon, typically from the Solar icon collection. */
  icon?: ReactNode;
  /** Display only; the consumer owns shortcut registration. */
  shortcut?: string;
};

export function CommandSearch({
  items,
  placeholder,
  emptyLabel,
  query: controlledQuery,
  onQueryChange,
  onSelect,
  groupLabel,
  locale = "zh",
  color = "blue",
  motion = "auto",
  autoFocus = false,
  className = "",
}: {
  items: CommandSearchItem[];
  placeholder?: string;
  emptyLabel?: string;
  query?: string;
  onQueryChange?: (query: string) => void;
  onSelect?: (item: CommandSearchItem) => void;
  /** Heading for items without an explicit group. */
  groupLabel?: string;
  locale?: "zh" | "en";
  color?: AccentColor;
  motion?: MotionPreference;
  autoFocus?: boolean;
  className?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [uncontrolled, setUncontrolled] = useState("");
  const query = controlledQuery ?? uncontrolled;
  const [cursor, setCursor] = useState<{ id: string; query: string } | null>(null);
  const reduced = useReducedMotion(motion);
  const accent = accentColors[color];
  const zh = locale === "zh";
  const searchLabel = placeholder ?? (zh ? "搜索命令…" : "Search commands…");
  const defaultGroup = groupLabel ?? (zh ? "命令" : "Commands");
  const matched = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      [item.label, item.hint, item.group, ...(item.keywords ?? [])]
        .some((value) => value?.toLowerCase().includes(needle)),
    );
  }, [items, query]);
  const groups = useMemo(() => {
    const result = new Map<string, CommandSearchItem[]>();
    for (const item of matched) {
      const key = item.group ?? defaultGroup;
      result.set(key, [...(result.get(key) ?? []), item]);
    }
    return [...result];
  }, [matched, defaultGroup]);
  // Keyboard order follows the rendered groups, including interleaved input items.
  const ordered = groups.flatMap(([, rows]) => rows);
  const active = (cursor?.query === query && ordered.find(item => item.id === cursor.id)) || ordered[0];
  const activeIndex = ordered.findIndex(item => item.id === active?.id);
  const indicator = useMovingIndicator(list, '[role="option"][aria-selected="true"]', `${active?.id}:${activeIndex}:${query}:${ordered.map(item => item.id).join("|")}`);

  useLayoutEffect(() => {
    const scroll = viewport.current;
    const row = list.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!scroll || !row) return;
    const top = row.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop;
    const bottom = top + row.offsetHeight;
    const target = top < scroll.scrollTop ? top : bottom > scroll.scrollTop + scroll.clientHeight ? bottom - scroll.clientHeight : null;
    if (target !== null) scroll.scrollTo?.({ top: Math.max(0, target), behavior: reduced ? "auto" : "smooth" });
  }, [active?.id, activeIndex, query, reduced]);

  useLayoutEffect(() => {
    if (reduced || !list.current?.animate) return;
    const animation = list.current.animate([{ opacity: .35, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }], {
      duration: 220, easing: "cubic-bezier(.2,.8,.2,1)",
    });
    return () => animation.cancel();
  }, [query, reduced]);

  return (
    <SurfaceCard className={className} padding="none">
      <label className="flex items-center gap-2 border-b border-fg-grey-200 px-4 py-3">
        <MagniferLinear size={16} color="var(--fg-grey-500)" aria-hidden />
        <input
          ref={input}
          role="combobox"
          aria-label={searchLabel}
          aria-autocomplete="list"
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-activedescendant={active ? `${id}-option-${activeIndex}` : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          value={query}
          onChange={(event) => {
            const next = event.target.value;
            if (controlledQuery === undefined) setUncontrolled(next);
            onQueryChange?.(next);
            setCursor(null);
          }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing || event.keyCode === 229 || !ordered.length) return;
            let next: number;
            switch (event.key) {
              case "ArrowDown": next = (activeIndex + 1) % ordered.length; break;
              case "ArrowUp": next = (activeIndex - 1 + ordered.length) % ordered.length; break;
              case "Home": next = 0; break;
              case "End": next = ordered.length - 1; break;
              case "Enter": event.preventDefault(); if (active) onSelect?.(active); return;
              default: return;
            }
            event.preventDefault();
            setCursor({ id: ordered[next].id, query });
          }}
          placeholder={searchLabel}
          className="min-w-0 w-full bg-transparent text-sm text-fg-black placeholder:text-fg-grey-500 focus:outline-none"
        />
      </label>
      <div ref={viewport} className="max-h-72 overflow-y-auto overscroll-contain p-2">
        <div ref={list} id={`${id}-list`} role="listbox" aria-label={defaultGroup} className="relative isolate" data-motion={reduced ? "none" : motion}>
          <span ref={indicator} aria-hidden className={cn("forge-moving-indicator rounded-lg", accent.bgTint)}
            style={{ transition: reduced ? "none" : "translate 300ms cubic-bezier(.2,.8,.2,1), width 200ms ease, height 200ms ease" }} />
          {groups.map(([group, rows], groupIndex) => (
            <div key={group} role="group" aria-labelledby={`${id}-group-${groupIndex}`} className="mb-2 last:mb-0">
              <p id={`${id}-group-${groupIndex}`} className="px-3 py-1.5 text-xs font-semibold text-fg-grey-500">{group}</p>
              {rows.map((item) => {
                const index = ordered.indexOf(item);
                return <button
                  key={item.id}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={active?.id === item.id}
                  tabIndex={-1}
                  type="button"
                  onPointerMove={(event) => {
                    if (event.pointerType !== "touch" && active?.id !== item.id) setCursor({ id: item.id, query });
                  }}
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => { input.current?.focus(); setCursor({ id: item.id, query }); onSelect?.(item); }}
                  className="relative flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left"
                >
                  <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-fg-black">
                    {item.icon && <span aria-hidden className={cn("flex shrink-0", active?.id === item.id ? accent.text : "text-fg-grey-500")}>{item.icon}</span>}
                    <span className="min-w-0 break-words">{item.label}</span>
                  </span>
                  {(item.hint || item.shortcut) && <span className="flex shrink-0 items-center gap-2 text-xs text-fg-grey-500">
                    {item.hint && <span>{item.hint}</span>}
                    {item.shortcut && <kbd className="rounded-md border border-fg-grey-200 bg-white px-1.5 py-0.5 font-sans text-xs font-medium">{item.shortcut}</kbd>}
                  </span>}
                </button>;
              })}
            </div>
          ))}
        </div>
        {matched.length === 0 && <p role="status" className="px-3 py-6 text-center text-sm text-fg-grey-500">{emptyLabel ?? (zh ? "没有匹配的命令" : "No matching commands")}</p>}
      </div>
    </SurfaceCard>
  );
}
