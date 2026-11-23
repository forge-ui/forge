"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { ClockCircleLinear, CloseCircleLinear } from "../../../icons";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { FieldFrame } from "./field-utils";
import { floatingFieldClass, floatingIconButtonClass, type FloatingFieldShape } from "./floating-field";
import { formAccents, type FormAccentColor } from "./form-utils";

export interface TimePickerProps {
  /** "HH:mm" or "HH:mm:ss"; empty string or undefined for no value. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  withSeconds?: boolean;
  /** Minute (and second) step, e.g. 5 or 15. */
  step?: number;
  label?: string;
  placeholder?: string;
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

const pad = (number: number) => String(number).padStart(2, "0");
const range = (count: number, step = 1) => Array.from({ length: Math.ceil(count / step) }, (_, index) => index * step);

function parse(value: string | undefined) {
  const match = value?.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)] as const;
}

/** Time of day in scrollable hour / minute (/ second) columns. */
export function TimePicker({ value, defaultValue, onChange, withSeconds = false, step = 1, label, placeholder, clearable = true, disabled = false, errorMessage, name, color = "blue", shape = "rounded", motion = "auto", locale = "zh", width, className }: TimePickerProps) {
  const [inner, setInner] = useState(defaultValue ?? "");
  const current = value ?? inner;
  const parsed = parse(current);
  const [open, setOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const errorId = useId();
  const accent = formAccents[color];
  const state = disabled ? "disabled" : errorMessage ? "error" : "idle";
  const parts = withSeconds ? 3 : 2;
  const columns = [
    { label: locale === "en" ? "Hours" : "时", values: range(24) },
    { label: locale === "en" ? "Minutes" : "分", values: range(60, step) },
    { label: locale === "en" ? "Seconds" : "秒", values: range(60, step) },
  ].slice(0, parts);

  function format(next: readonly number[]) {
    return next.slice(0, parts).map(pad).join(":");
  }
  function set(next: string) {
    if (value === undefined) setInner(next);
    onChange?.(next);
  }
  function pick(column: number, number: number) {
    const base = parsed ? [...parsed] : [0, 0, 0];
    base[column] = number;
    set(format(base));
  }

  // Keep the chosen value centred in each column when the panel opens or changes.
  useLayoutEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      panelRef.current?.querySelectorAll<HTMLElement>('[role="option"][aria-selected="true"]').forEach(option => {
        const list = option.parentElement!;
        list.scrollTop = option.offsetTop - list.clientHeight / 2 + option.offsetHeight / 2;
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, current]);

  function onColumnKeyDown(event: KeyboardEvent<HTMLUListElement>, column: number) {
    const values = columns[column].values;
    const index = Math.max(0, values.indexOf(parsed?.[column] ?? -1));
    const delta = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (delta) {
      event.preventDefault();
      pick(column, values[(index + delta + values.length) % values.length]);
    } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const lists = panelRef.current?.querySelectorAll<HTMLElement>('[role="listbox"]');
      lists?.[(column + (event.key === "ArrowRight" ? 1 : -1) + parts) % parts]?.focus();
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (!parsed) set(format([0, 0, 0]));
      setOpen(false);
    }
  }

  return (
    <FieldFrame label={label} errorMessage={errorMessage} showError={state === "error"} errorId={errorId} inputId={triggerId} className={cn("max-w-full", className)}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen} modal={false}>
        <div ref={fieldRef} className={cn(floatingFieldClass({ state, shape, color }), "h-12 pr-2")} style={{ width: width ?? "100%", maxWidth: "100%" }}>
          <span aria-hidden className="flex text-fg-grey-700"><ClockCircleLinear size={20} /></span>
          <PopoverPrimitive.Trigger
            id={triggerId}
            disabled={disabled}
            aria-invalid={state === "error" || undefined}
            aria-describedby={state === "error" ? errorId : undefined}
            className="flex h-full min-w-0 flex-1 cursor-pointer items-center text-left outline-none disabled:cursor-not-allowed"
          >
            <span className={cn("truncate text-sm leading-5 tracking-fg tabular-nums", parsed ? (state === "error" ? "text-fg-red" : "text-fg-black") : "text-fg-grey-700")}>
              {parsed ? format(parsed) : placeholder ?? (locale === "en" ? "Select time" : "选择时间")}
            </span>
          </PopoverPrimitive.Trigger>
          {clearable && parsed && !disabled && (
            <button type="button" aria-label={locale === "en" ? "Clear" : "清除"} className={floatingIconButtonClass} onClick={() => set("")}><CloseCircleLinear size={18} /></button>
          )}
          {name && <input type="hidden" name={name} value={parsed ? format(parsed) : ""} />}
        </div>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner anchor={fieldRef} side="bottom" align="start" sideOffset={6} collisionPadding={8} className="z-50">
            <PopoverPrimitive.Popup
              ref={panelRef}
              aria-label={label ?? (locale === "en" ? "Time" : "时间")}
              data-motion={motion}
              initialFocus={() => panelRef.current?.querySelector<HTMLElement>('[role="listbox"]') ?? true}
              className="forge-popup flex flex-col rounded-xl bg-background shadow-[0px_4px_30px_0px_rgba(77,84,100,0.08)] outline outline-1 outline-offset-[-1px] outline-fg-grey-100"
            >
              <div className="flex">
                {columns.map((column, index) => (
                  <ul
                    key={column.label}
                    role="listbox"
                    tabIndex={0}
                    aria-label={column.label}
                    aria-activedescendant={parsed ? `${triggerId}-${index}-${parsed[index]}` : undefined}
                    onKeyDown={event => onColumnKeyDown(event, index)}
                    className="m-0 flex h-64 w-16 list-none flex-col overflow-y-auto border-r border-fg-grey-100 p-1.5 outline-none [scrollbar-width:none] last:border-r-0 focus-visible:bg-fg-grey-50"
                  >
                    {column.values.map(number => {
                      const selected = parsed?.[index] === number;
                      return (
                        <li
                          key={number}
                          id={`${triggerId}-${index}-${number}`}
                          role="option"
                          aria-selected={selected}
                          onClick={() => pick(index, number)}
                          className={cn(
                            "flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-sm tabular-nums tracking-fg",
                            selected ? cn("font-semibold text-white", accent.bg) : "text-fg-grey-900 hover:bg-fg-grey-100",
                          )}
                        >
                          {pad(number)}
                        </li>
                      );
                    })}
                  </ul>
                ))}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-fg-grey-100 px-3 py-2">
                <button type="button" className={cn("text-sm font-medium cursor-pointer", accent.text)} onClick={() => { const now = new Date(); set(format([now.getHours(), now.getMinutes() - (now.getMinutes() % step), 0])); }}>
                  {locale === "en" ? "Now" : "此刻"}
                </button>
                <button type="button" className={cn("rounded-full px-3 py-1 text-sm font-medium text-white cursor-pointer", accent.bg)} onClick={() => { if (!parsed) set(format([0, 0, 0])); setOpen(false); }}>
                  {locale === "en" ? "OK" : "确定"}
                </button>
              </div>
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </FieldFrame>
  );
}
