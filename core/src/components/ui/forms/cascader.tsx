"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AltArrowDownLinear, AltArrowRightLinear, CheckCircleLinear, CloseCircleLinear } from "../../../icons";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { FieldFrame } from "./field-utils";
import { floatingFieldClass, floatingIconButtonClass, type FloatingFieldShape } from "./floating-field";
import { formAccents, type FormAccentColor } from "./form-utils";

export interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
  disabled?: boolean;
}

export interface CascaderProps {
  options: CascaderOption[];
  /** Path of values from the top level to the chosen option. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (path: string[], options: CascaderOption[]) => void;
  /** Allow choosing a parent, not only a leaf (e.g. "整个省"). */
  changeOnSelect?: boolean;
  label?: string;
  placeholder?: string;
  separator?: string;
  clearable?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  name?: string;
  color?: FormAccentColor;
  shape?: FloatingFieldShape;
  motion?: MotionPreference;
  locale?: "zh" | "en";
  width?: string;
  className?: string;
}

function resolvePath(options: CascaderOption[], path: string[]) {
  const picked: CascaderOption[] = [];
  let level = options;
  for (const value of path) {
    const match = level.find(option => option.value === value);
    if (!match) break;
    picked.push(match);
    level = match.children ?? [];
  }
  return picked;
}

/** Pick from nested options column by column: region → city → district, category → subcategory. */
export function Cascader({ options, value, defaultValue = [], onChange, changeOnSelect = false, label, placeholder, separator = " / ", clearable = true, disabled = false, errorMessage, name, color = "blue", shape = "rounded", motion = "auto", locale = "zh", width, className }: CascaderProps) {
  const [inner, setInner] = useState(defaultValue);
  const path = value ?? inner;
  const selected = resolvePath(options, path);
  const [open, setOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<string[]>(path);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const errorId = useId();
  const accent = formAccents[color];
  const state = disabled ? "disabled" : errorMessage ? "error" : "idle";
  const draftOptions = resolvePath(options, draft);
  const columns: CascaderOption[][] = [options, ...draftOptions.map(option => option.children ?? []).filter(list => list.length > 0)];

  function commit(next: CascaderOption[]) {
    const nextPath = next.map(option => option.value);
    if (value === undefined) setInner(nextPath);
    onChange?.(nextPath, next);
  }

  function choose(level: number, option: CascaderOption) {
    if (option.disabled) return;
    const nextDraft = [...draft.slice(0, level), option.value];
    setDraft(nextDraft);
    const isLeaf = !option.children?.length;
    if (isLeaf || changeOnSelect) commit(resolvePath(options, nextDraft));
    if (isLeaf) setOpen(false);
    else requestAnimationFrame(() => focusOption(level + 1, 0));
  }

  function focusOption(level: number, index: number) {
    panelRef.current?.querySelectorAll<HTMLElement>(`[data-cascader-column="${level}"] [role="option"]`)[index]?.focus();
  }

  function onColumnKeyDown(event: KeyboardEvent<HTMLUListElement>, level: number) {
    const items = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="option"]')];
    const index = items.indexOf(document.activeElement as HTMLElement);
    const option = columns[level][index];
    const move = (next: number) => { event.preventDefault(); items[(next + items.length) % items.length]?.focus(); };
    switch (event.key) {
      case "ArrowDown": move(index + 1); break;
      case "ArrowUp": move(index - 1); break;
      case "Home": move(0); break;
      case "End": move(items.length - 1); break;
      case "ArrowRight":
        if (option?.children?.length && !option.disabled) { event.preventDefault(); setDraft([...draft.slice(0, level), option.value]); requestAnimationFrame(() => focusOption(level + 1, 0)); }
        break;
      case "ArrowLeft":
        if (level > 0) {
          event.preventDefault();
          const parentIndex = columns[level - 1].findIndex(item => item.value === draft[level - 1]);
          focusOption(level - 1, Math.max(0, parentIndex));
        }
        break;
      case "Enter":
      case " ":
        if (option) { event.preventDefault(); choose(level, option); }
        break;
    }
  }

  const display = selected.map(option => option.label).join(separator);
  return (
    <FieldFrame label={label} errorMessage={errorMessage} showError={state === "error"} errorId={errorId} inputId={triggerId} className={cn("max-w-full", className)}>
      <PopoverPrimitive.Root open={open} onOpenChange={next => { if (next) setDraft(path); setOpen(next); }} modal={false}>
        <div ref={fieldRef} className={cn(floatingFieldClass({ state, shape, color }), "h-12 pr-2")} style={{ width: width ?? "100%", maxWidth: "100%" }}>
          <PopoverPrimitive.Trigger
            id={triggerId}
            disabled={disabled}
            aria-invalid={state === "error" || undefined}
            aria-describedby={state === "error" ? errorId : undefined}
            className="flex h-full min-w-0 flex-1 cursor-pointer items-center text-left outline-none disabled:cursor-not-allowed"
          >
            <span className={cn("truncate text-sm leading-5 tracking-fg", display ? (state === "error" ? "text-fg-red" : "text-fg-black") : "text-fg-grey-700")}>
              {display || placeholder || (locale === "en" ? "Select" : "请选择")}
            </span>
          </PopoverPrimitive.Trigger>
          {clearable && display && !disabled ? (
            <button type="button" aria-label={locale === "en" ? "Clear" : "清除"} className={floatingIconButtonClass} onClick={() => commit([])}><CloseCircleLinear size={18} /></button>
          ) : (
            <span aria-hidden className="forge-chevron flex size-6 items-center justify-center text-fg-grey-700" data-motion={motion} data-expanded={open}><AltArrowDownLinear size={20} /></span>
          )}
          {name && <input type="hidden" name={name} value={path.join("/")} />}
        </div>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner anchor={fieldRef} side="bottom" align="start" sideOffset={6} collisionPadding={8} className="z-50">
            <PopoverPrimitive.Popup
              ref={panelRef}
              aria-label={label ?? (locale === "en" ? "Options" : "选项")}
              data-motion={motion}
              initialFocus={() => panelRef.current?.querySelector<HTMLElement>('[role="option"][aria-selected="true"], [role="option"]') ?? true}
              className="forge-popup flex max-w-[calc(100vw-16px)] overflow-x-auto rounded-xl bg-background shadow-[0px_4px_30px_0px_rgba(77,84,100,0.08)] outline outline-1 outline-offset-[-1px] outline-fg-grey-100"
            >
              {columns.map((column, level) => (
                <ul
                  key={level}
                  role="listbox"
                  data-cascader-column={level}
                  aria-label={level === 0 ? label : resolvePath(options, draft)[level - 1]?.label}
                  onKeyDown={event => onColumnKeyDown(event, level)}
                  className="m-0 flex max-h-72 w-44 shrink-0 list-none flex-col overflow-y-auto border-r border-fg-grey-100 p-1.5 last:border-r-0"
                >
                  {column.map(option => {
                    const active = draft[level] === option.value;
                    const committed = path[level] === option.value;
                    return (
                      <li
                        key={option.value}
                        role="option"
                        tabIndex={-1}
                        aria-selected={active}
                        aria-disabled={option.disabled || undefined}
                        onClick={() => choose(level, option)}
                        onMouseEnter={() => { if (option.children?.length && !option.disabled) setDraft([...draft.slice(0, level), option.value]); }}
                        className={cn(
                          "flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm leading-5 tracking-fg outline-none",
                          active ? "bg-fg-grey-100 font-medium text-fg-black" : "text-fg-grey-900 hover:bg-fg-grey-50 focus:bg-fg-grey-50",
                          option.disabled && "cursor-not-allowed opacity-50",
                        )}
                      >
                        <span className="min-w-0 flex-1 truncate">{option.label}</span>
                        {option.children?.length ? <AltArrowRightLinear size={14} className="shrink-0 text-fg-grey-500" /> : committed ? <CheckCircleLinear size={16} className={cn("shrink-0", accent.text)} /> : null}
                      </li>
                    );
                  })}
                </ul>
              ))}
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </FieldFrame>
  );
}
