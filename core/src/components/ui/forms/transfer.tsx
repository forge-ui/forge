"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AltArrowLeftLinear, AltArrowRightLinear, MagniferLinear } from "../../../icons";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { CheckboxVisual } from "../checkbox";
import type { FormAccentColor } from "./form-utils";

export interface TransferItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface TransferProps {
  items: TransferItem[];
  /** Values in the right-hand ("chosen") list. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  titles?: [ReactNode, ReactNode];
  searchable?: boolean;
  color?: FormAccentColor;
  motion?: MotionPreference;
  locale?: "zh" | "en";
  className?: string;
}

function Pane({ title, items, checked, onToggle, onToggleAll, searchable, color, motion, locale, emptyText }: {
  title: ReactNode; items: TransferItem[]; checked: Set<string>;
  onToggle: (value: string) => void; onToggleAll: (values: string[], on: boolean) => void;
  searchable: boolean; color: FormAccentColor; motion: MotionPreference; locale: "zh" | "en"; emptyText: string;
}) {
  const [query, setQuery] = useState("");
  const visible = query ? items.filter(item => item.label.toLowerCase().includes(query.toLowerCase())) : items;
  const enabled = visible.filter(item => !item.disabled).map(item => item.value);
  const count = enabled.filter(value => checked.has(value)).length;
  const all = enabled.length > 0 && count === enabled.length;
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
      <div className="flex items-center gap-2 border-b border-fg-grey-200 bg-fg-grey-50 px-3 py-2.5">
        <button
          type="button"
          role="checkbox"
          aria-checked={all ? true : count > 0 ? "mixed" : false}
          aria-label={locale === "en" ? "Select all" : "全选"}
          disabled={!enabled.length}
          onClick={() => onToggleAll(enabled, !all)}
          className="relative size-5 shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckboxVisual checked={all} indeterminate={count > 0 && !all} color={color} motion={motion} />
        </button>
        <span className="flex-1 truncate text-sm font-medium tracking-fg text-fg-black">{title}</span>
        <span className="text-xs tabular-nums text-fg-grey-500">{count ? `${count}/` : ""}{items.length}</span>
      </div>
      {searchable && (
        <label className="m-2 flex h-9 items-center gap-1.5 rounded-xl px-3 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 focus-within:outline-fg-blue">
          <MagniferLinear size={16} className="shrink-0 text-fg-grey-500" />
          <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={locale === "en" ? "Search" : "搜索"} aria-label={`${typeof title === "string" ? title : ""} ${locale === "en" ? "search" : "搜索"}`.trim()} className="min-w-0 flex-1 bg-transparent text-sm tracking-fg text-fg-black outline-none placeholder:text-fg-grey-500" />
        </label>
      )}
      <ul role="listbox" aria-multiselectable aria-label={typeof title === "string" ? title : undefined} className="m-0 flex h-64 list-none flex-col overflow-y-auto p-1.5">
        {visible.length === 0 && <li className="flex flex-1 items-center justify-center text-sm text-fg-grey-500">{emptyText}</li>}
        {visible.map(item => {
          const on = checked.has(item.value);
          return (
            <li
              key={item.value}
              role="option"
              aria-selected={on}
              aria-disabled={item.disabled || undefined}
              tabIndex={item.disabled ? -1 : 0}
              onClick={() => { if (!item.disabled) onToggle(item.value); }}
              onKeyDown={event => { if ((event.key === " " || event.key === "Enter") && !item.disabled) { event.preventDefault(); onToggle(item.value); } }}
              className={cn("flex shrink-0 cursor-pointer items-start gap-2.5 rounded-xl px-2.5 py-2 outline-none hover:bg-fg-grey-50 focus-visible:bg-fg-grey-100", item.disabled && "cursor-not-allowed opacity-50")}
            >
              <span aria-hidden className="relative mt-0.5 size-5 shrink-0"><CheckboxVisual checked={on} color={color} motion={motion} /></span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm leading-6 tracking-fg text-fg-black">{item.label}</span>
                {item.description && <span className="truncate text-xs leading-4 tracking-fg text-fg-grey-500">{item.description}</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Move items between "available" and "chosen", e.g. assigning permissions or members. */
export function Transfer({ items, value, defaultValue = [], onChange, titles, searchable = true, color = "blue", motion = "auto", locale = "zh", className }: TransferProps) {
  const [inner, setInner] = useState(defaultValue);
  const chosen = value ?? inner;
  const chosenSet = useMemo(() => new Set(chosen), [chosen]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const left = items.filter(item => !chosenSet.has(item.value));
  const right = items.filter(item => chosenSet.has(item.value));
  const leftChecked = left.filter(item => checked.has(item.value)).map(item => item.value);
  const rightChecked = right.filter(item => checked.has(item.value)).map(item => item.value);
  const [leftTitle, rightTitle] = titles ?? (locale === "en" ? ["Available", "Selected"] : ["可选", "已选"]);
  const emptyText = locale === "en" ? "No items" : "暂无数据";

  function update(next: string[]) {
    if (value === undefined) setInner(next);
    onChange?.(next);
  }
  function toggle(itemValue: string) {
    setChecked(current => { const next = new Set(current); if (next.has(itemValue)) next.delete(itemValue); else next.add(itemValue); return next; });
  }
  function toggleAll(values: string[], on: boolean) {
    setChecked(current => { const next = new Set(current); for (const itemValue of values) { if (on) next.add(itemValue); else next.delete(itemValue); } return next; });
  }
  function move(values: string[], toRight: boolean) {
    update(toRight ? [...chosen, ...values] : chosen.filter(itemValue => !values.includes(itemValue)));
    setChecked(current => { const next = new Set(current); values.forEach(itemValue => next.delete(itemValue)); return next; });
  }

  const moveButton = "flex size-9 cursor-pointer items-center justify-center rounded-full bg-background text-fg-grey-700 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 transition-colors hover:bg-fg-grey-100 hover:text-fg-black disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className={cn("flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center", className)}>
      <Pane title={leftTitle} items={left} checked={checked} onToggle={toggle} onToggleAll={toggleAll} searchable={searchable} color={color} motion={motion} locale={locale} emptyText={emptyText} />
      <div className="flex shrink-0 justify-center gap-2 sm:flex-col">
        <button type="button" aria-label={locale === "en" ? "Move to selected" : "移到已选"} disabled={!leftChecked.length} onClick={() => move(leftChecked, true)} className={moveButton}><AltArrowRightLinear size={18} className="max-sm:rotate-90" /></button>
        <button type="button" aria-label={locale === "en" ? "Move back" : "移回可选"} disabled={!rightChecked.length} onClick={() => move(rightChecked, false)} className={moveButton}><AltArrowLeftLinear size={18} className="max-sm:rotate-90" /></button>
      </div>
      <Pane title={rightTitle} items={right} checked={checked} onToggle={toggle} onToggleAll={toggleAll} searchable={searchable} color={color} motion={motion} locale={locale} emptyText={emptyText} />
    </div>
  );
}
