"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set. Not a replacement for ToolbarSearchInput.
 */

import { useMemo, useState } from "react";
import { MagniferLinear } from "solar-icon-set";
import { cn } from "../../../lib/utils";
import { SurfaceCard } from "../surface-card";

export type CommandSearchItem = {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  keywords?: string[];
};

export function CommandSearch({
  items,
  placeholder = "Search commands…",
  emptyLabel = "No matching commands",
  query: controlledQuery,
  onQueryChange,
  onSelect,
  className = "",
}: {
  items: CommandSearchItem[];
  placeholder?: string;
  emptyLabel?: string;
  query?: string;
  onQueryChange?: (query: string) => void;
  onSelect?: (item: CommandSearchItem) => void;
  className?: string;
}) {
  const [uncontrolled, setUncontrolled] = useState("");
  const query = controlledQuery ?? uncontrolled;
  const matched = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      [item.label, item.hint, item.group, ...(item.keywords ?? [])]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(needle)),
    );
  }, [items, query]);
  const groups = matched.reduce<Record<string, CommandSearchItem[]>>((acc, item) => {
    const key = item.group ?? "Commands";
    acc[key] = [...(acc[key] ?? []), item];
    return acc;
  }, {});

  return (
    <SurfaceCard className={className} padding="none">
      <label className="flex items-center gap-2 border-b border-fg-grey-200 px-4 py-3">
        <MagniferLinear size={16} color="var(--fg-grey-500)" />
        <input
          value={query}
          onChange={(event) => {
            const next = event.target.value;
            if (controlledQuery === undefined) setUncontrolled(next);
            onQueryChange?.(next);
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-fg-black placeholder:text-fg-grey-500 focus:outline-none"
        />
      </label>
      <div className="max-h-72 overflow-y-auto p-2">
        {matched.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-fg-grey-500">{emptyLabel}</p>
        ) : (
          Object.entries(groups).map(([group, rows]) => (
            <div key={group} className="mb-2 last:mb-0">
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-fg-grey-500">{group}</p>
              {rows.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect?.(item)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-fg-grey-50",
                  )}
                >
                  <span className="text-sm font-medium text-fg-black">{item.label}</span>
                  {item.hint && <span className="text-xs text-fg-grey-500">{item.hint}</span>}
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </SurfaceCard>
  );
}
