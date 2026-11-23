"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { useId, useRef, useState } from "react";
import { AltArrowLeftLinear, AltArrowRightLinear, CalendarLinear, CloseCircleLinear } from "../../../icons";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { FieldFrame } from "./field-utils";
import { floatingFieldClass, floatingIconButtonClass, type FloatingFieldShape } from "./floating-field";
import { formAccents, type FormAccentColor } from "./form-utils";

export type PeriodGranularity = "month" | "quarter" | "year";

/** A period is identified by its first day: 2026-10-01 is "2026年10月" or "2026年第4季度". */
export interface PeriodPickerProps {
  granularity: PeriodGranularity;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (start: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  /** Submits "YYYY-MM", "YYYY-Qn" or "YYYY". */
  name?: string;
  color?: FormAccentColor;
  shape?: FloatingFieldShape;
  motion?: MotionPreference;
  locale?: "zh" | "en";
  width?: string;
  className?: string;
}

const quarterOf = (date: Date) => Math.floor(date.getMonth() / 3) + 1;

export function formatPeriod(date: Date, granularity: PeriodGranularity, locale: "zh" | "en" = "zh") {
  const year = date.getFullYear();
  if (granularity === "year") return locale === "en" ? String(year) : `${year}年`;
  if (granularity === "quarter") return locale === "en" ? `Q${quarterOf(date)} ${year}` : `${year}年 第${quarterOf(date)}季度`;
  return locale === "en" ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" }).format(date) : `${year}年${date.getMonth() + 1}月`;
}

function periodKey(date: Date, granularity: PeriodGranularity) {
  const year = date.getFullYear();
  if (granularity === "year") return String(year);
  if (granularity === "quarter") return `${year}-Q${quarterOf(date)}`;
  return `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** Month, quarter or year: monthly reports, quarterly targets, annual budgets. */
export function PeriodPicker({ granularity, value, defaultValue = null, onChange, minDate, maxDate, label, placeholder, clearable = true, disabled = false, errorMessage, name, color = "blue", shape = "rounded", motion = "auto", locale = "zh", width, className }: PeriodPickerProps) {
  const [inner, setInner] = useState<Date | null>(defaultValue);
  const current = value === undefined ? inner : value;
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState((current ?? new Date()).getFullYear());
  const fieldRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const errorId = useId();
  const accent = formAccents[color];
  const state = disabled ? "disabled" : errorMessage ? "error" : "idle";
  const decadeStart = Math.floor(page / 10) * 10;

  const cells: { start: Date; label: string }[] =
    granularity === "year"
      ? Array.from({ length: 12 }, (_, index) => ({ start: new Date(decadeStart - 1 + index, 0, 1), label: String(decadeStart - 1 + index) }))
      : granularity === "quarter"
        ? Array.from({ length: 4 }, (_, index) => ({ start: new Date(page, index * 3, 1), label: locale === "en" ? `Q${index + 1}` : `第${index + 1}季度` }))
        : Array.from({ length: 12 }, (_, index) => ({ start: new Date(page, index, 1), label: locale === "en" ? new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(2026, index, 1)) : `${index + 1}月` }));

  const outOfRange = (start: Date) => {
    const end = granularity === "year" ? new Date(start.getFullYear() + 1, 0, 0) : granularity === "quarter" ? new Date(start.getFullYear(), start.getMonth() + 3, 0) : new Date(start.getFullYear(), start.getMonth() + 1, 0);
    return Boolean((minDate && end < minDate) || (maxDate && start > maxDate));
  };
  const commit = (next: Date | null) => { if (value === undefined) setInner(next); onChange?.(next); };
  const step = granularity === "year" ? 10 : 1;
  const heading = granularity === "year" ? `${decadeStart} – ${decadeStart + 9}` : locale === "en" ? String(page) : `${page}年`;
  const todayKey = periodKey(new Date(), granularity);

  return (
    <FieldFrame label={label} errorMessage={errorMessage} showError={state === "error"} errorId={errorId} inputId={triggerId} className={cn("max-w-full", className)}>
      <PopoverPrimitive.Root open={open} onOpenChange={next => { if (next) setPage((current ?? new Date()).getFullYear()); setOpen(next); }} modal={false}>
        <div ref={fieldRef} className={cn(floatingFieldClass({ state, shape, color }), "h-12 pr-2")} style={{ width: width ?? "100%", maxWidth: "100%" }}>
          <span aria-hidden className="flex text-fg-grey-700"><CalendarLinear size={20} /></span>
          <PopoverPrimitive.Trigger
            id={triggerId}
            disabled={disabled}
            aria-invalid={state === "error" || undefined}
            aria-describedby={state === "error" ? errorId : undefined}
            className="flex h-full min-w-0 flex-1 cursor-pointer items-center text-left outline-none disabled:cursor-not-allowed"
          >
            <span className={cn("truncate text-sm leading-5 tracking-fg", current ? (state === "error" ? "text-fg-red" : "text-fg-black") : "text-fg-grey-700")}>
              {current ? formatPeriod(current, granularity, locale) : placeholder ?? (locale === "en" ? "Select" : granularity === "year" ? "选择年份" : granularity === "quarter" ? "选择季度" : "选择月份")}
            </span>
          </PopoverPrimitive.Trigger>
          {clearable && current && !disabled && (
            <button type="button" aria-label={locale === "en" ? "Clear" : "清除"} className={floatingIconButtonClass} onClick={() => commit(null)}><CloseCircleLinear size={18} /></button>
          )}
          {name && <input type="hidden" name={name} value={current ? periodKey(current, granularity) : ""} />}
        </div>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner anchor={fieldRef} side="bottom" align="start" sideOffset={6} collisionPadding={8} className="z-50">
            <PopoverPrimitive.Popup
              ref={panelRef}
              aria-label={label ?? heading}
              data-motion={motion}
              initialFocus={() => panelRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]') ?? panelRef.current?.querySelector<HTMLElement>("[data-period-cell]:not(:disabled)") ?? true}
              className="forge-popup w-80 max-w-[calc(100vw-16px)] rounded-[20px] bg-background shadow-[0px_4px_30px_0px_rgba(77,84,100,0.08)] outline outline-1 outline-offset-[-1px] outline-fg-grey-100"
            >
              <div className="flex items-center gap-2 border-b border-fg-grey-200 p-4">
                <button type="button" aria-label={locale === "en" ? "Previous" : "上一页"} onClick={() => setPage(page - step)} className="rounded-full p-2.5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 cursor-pointer hover:bg-fg-grey-100"><AltArrowLeftLinear size={16} /></button>
                <span aria-live="polite" className="flex-1 text-center text-sm font-semibold tracking-fg text-fg-black">{heading}</span>
                <button type="button" aria-label={locale === "en" ? "Next" : "下一页"} onClick={() => setPage(page + step)} className="rounded-full p-2.5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 cursor-pointer hover:bg-fg-grey-100"><AltArrowRightLinear size={16} /></button>
              </div>
              <div className={cn("grid gap-2 p-4", granularity === "quarter" ? "grid-cols-2" : "grid-cols-3")}>
                {cells.map(cell => {
                  const key = periodKey(cell.start, granularity);
                  const selected = current ? periodKey(current, granularity) === key : false;
                  const outside = granularity === "year" && (cell.start.getFullYear() < decadeStart || cell.start.getFullYear() > decadeStart + 9);
                  return (
                    <button
                      key={key}
                      type="button"
                      data-period-cell
                      aria-pressed={selected}
                      disabled={outOfRange(cell.start)}
                      onClick={() => { commit(cell.start); setOpen(false); }}
                      className={cn(
                        "h-11 rounded-full text-sm tracking-fg transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40",
                        selected ? cn("font-semibold text-white", accent.bg) : cn("hover:bg-fg-grey-100", outside ? "text-fg-grey-500" : "text-fg-black", key === todayKey && cn("font-semibold outline outline-1 outline-offset-[-1px]", accent.outline)),
                      )}
                    >
                      {cell.label}
                    </button>
                  );
                })}
              </div>
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </FieldFrame>
  );
}
