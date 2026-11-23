"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { useId, useRef, useState } from "react";
import { CalendarLinear, CloseCircleLinear } from "../../../icons";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { Datepicker } from "./datepicker";
import { FieldFrame } from "./field-utils";
import { floatingFieldClass, floatingIconButtonClass, type FloatingFieldShape } from "./floating-field";
import { formAccents, type FormAccentColor } from "./form-utils";
import { TimeColumns, type TimeParts } from "./time-picker";

export interface DateTimePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
  withSeconds?: boolean;
  /** Minute (and second) step. */
  step?: number;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  /** Submits an ISO-like local string "YYYY-MM-DDTHH:mm(:ss)". */
  name?: string;
  color?: FormAccentColor;
  shape?: FloatingFieldShape;
  motion?: MotionPreference;
  locale?: "zh" | "en";
  width?: string;
  className?: string;
}

const pad = (number: number) => String(number).padStart(2, "0");

export function formatDateTime(date: Date, withSeconds = false) {
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}${withSeconds ? `:${pad(date.getSeconds())}` : ""}`;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${time}`;
}

/** Date and time in one field: calendar on the left, hour / minute columns on the right. */
export function DateTimePicker({ value, defaultValue = null, onChange, withSeconds = false, step = 1, minDate, maxDate, label, placeholder, clearable = true, disabled = false, errorMessage, name, color = "blue", shape = "rounded", motion = "auto", locale = "zh", width, className }: DateTimePickerProps) {
  const [inner, setInner] = useState<Date | null>(defaultValue);
  const current = value === undefined ? inner : value;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Date | null>(current);
  const fieldRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const errorId = useId();
  const accent = formAccents[color];
  const state = disabled ? "disabled" : errorMessage ? "error" : "idle";

  // Keep every draft inside minDate / maxDate, whichever control changed it.
  const clamp = (next: Date) => minDate && next < minDate ? new Date(minDate) : maxDate && next > maxDate ? new Date(maxDate) : next;
  const setDraftClamped = (next: Date) => setDraft(clamp(next));

  function commit(next: Date | null) {
    if (value === undefined) setInner(next);
    onChange?.(next);
  }
  const time: TimeParts | null = draft ? [draft.getHours(), draft.getMinutes(), draft.getSeconds()] : null;
  const withDate = (day: Date) => {
    const next = new Date(day);
    next.setHours(draft?.getHours() ?? 0, draft?.getMinutes() ?? 0, withSeconds ? draft?.getSeconds() ?? 0 : 0, 0);
    return next;
  };
  const withTime = (parts: TimeParts) => {
    const next = new Date(draft ?? new Date());
    next.setHours(parts[0], parts[1], withSeconds ? parts[2] : 0, 0);
    return next;
  };

  return (
    <FieldFrame label={label} errorMessage={errorMessage} showError={state === "error"} errorId={errorId} inputId={triggerId} className={cn("max-w-full", className)}>
      <PopoverPrimitive.Root open={open} onOpenChange={next => { if (next) setDraft(current); setOpen(next); }} modal={false}>
        <div ref={fieldRef} className={cn(floatingFieldClass({ state, shape, color }), "h-12 pr-2")} style={{ width: width ?? "100%", maxWidth: "100%" }}>
          <span aria-hidden className="flex text-fg-grey-700"><CalendarLinear size={20} /></span>
          <PopoverPrimitive.Trigger
            id={triggerId}
            disabled={disabled}
            aria-invalid={state === "error" || undefined}
            aria-describedby={state === "error" ? errorId : undefined}
            className="flex h-full min-w-0 flex-1 cursor-pointer items-center text-left outline-none disabled:cursor-not-allowed"
          >
            <span className={cn("truncate text-sm leading-5 tracking-fg tabular-nums", current ? (state === "error" ? "text-fg-red" : "text-fg-black") : "text-fg-grey-700")}>
              {current ? formatDateTime(current, withSeconds) : placeholder ?? (locale === "en" ? "Select date and time" : "选择日期时间")}
            </span>
          </PopoverPrimitive.Trigger>
          {clearable && current && !disabled && (
            <button type="button" aria-label={locale === "en" ? "Clear" : "清除"} className={floatingIconButtonClass} onClick={() => commit(null)}><CloseCircleLinear size={18} /></button>
          )}
          {name && <input type="hidden" name={name} value={current ? formatDateTime(current, withSeconds).replace(" ", "T") : ""} />}
        </div>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner anchor={fieldRef} side="bottom" align="start" sideOffset={6} collisionPadding={8} className="z-50">
            <PopoverPrimitive.Popup
              aria-label={label ?? (locale === "en" ? "Date and time" : "日期时间")}
              data-motion={motion}
              className="forge-popup flex max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-[20px] bg-background shadow-[0px_4px_30px_0px_rgba(77,84,100,0.08)] outline outline-1 outline-offset-[-1px] outline-fg-grey-100"
            >
              <div className="flex max-sm:flex-col">
                <Datepicker calendarOnly value={draft ?? undefined} onChange={day => setDraftClamped(withDate(day))} minDate={minDate} maxDate={maxDate} color={color} locale={locale} label={locale === "en" ? "Date" : "日期"} />
                <div className="flex flex-col border-fg-grey-100 sm:border-l max-sm:border-t">
                  <div className="border-b border-fg-grey-100 px-3 py-4 text-center text-sm font-semibold tabular-nums tracking-fg text-fg-black">
                    {draft ? `${pad(draft.getHours())}:${pad(draft.getMinutes())}${withSeconds ? `:${pad(draft.getSeconds())}` : ""}` : "--:--"}
                  </div>
                  <TimeColumns value={time} onChange={parts => setDraftClamped(withTime(parts))} withSeconds={withSeconds} step={step} color={color} locale={locale} className="flex-1 [&>ul]:h-auto [&>ul]:max-h-72" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-fg-grey-100 px-4 py-2.5">
                <button type="button" className={cn("text-sm font-medium cursor-pointer", accent.text)} onClick={() => { const now = new Date(); now.setSeconds(withSeconds ? now.getSeconds() : 0, 0); now.setMinutes(now.getMinutes() - (now.getMinutes() % step)); setDraftClamped(now); }}>
                  {locale === "en" ? "Now" : "此刻"}
                </button>
                <div className="flex gap-2">
                  <button type="button" className="rounded-full px-3 py-1 text-sm font-medium text-fg-grey-700 cursor-pointer hover:bg-fg-grey-100" onClick={() => setOpen(false)}>{locale === "en" ? "Cancel" : "取消"}</button>
                  <button type="button" disabled={!draft} className={cn("rounded-full px-3 py-1 text-sm font-medium text-white cursor-pointer disabled:opacity-50", accent.bg)} onClick={() => { commit(draft); setOpen(false); }}>
                    {locale === "en" ? "OK" : "确定"}
                  </button>
                </div>
              </div>
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </FieldFrame>
  );
}
