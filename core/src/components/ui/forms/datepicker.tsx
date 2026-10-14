"use client";

import { useState, useRef, useEffect, useId, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { cn } from "../../../lib/utils";
import {
  CalendarLinear,
  AltArrowLeftLinear,
  AltArrowRightLinear,
  AltArrowDownLinear,
  CheckCircleLinear,
} from "../../../icons";
import { formAccents, type FormAccentColor } from "./form-utils";

const rangeStyles: Record<FormAccentColor, { bg: string; text: string }> = {
  purple: { bg: "bg-fg-violet-100", text: "text-fg-violet" },
  blue: { bg: "bg-fg-blue-100", text: "text-fg-blue" },
  black: { bg: "bg-fg-grey-200", text: "text-fg-black" },
};

export type DatepickerState = "idle" | "focus" | "filled" | "disabled" | "error";
export type DatepickerShape = "rounded" | "pill";
export type DatepickerColor = FormAccentColor;
export type DatepickerMode = "single" | "range";

const DAYS = ["日", "一", "二", "三", "四", "五", "六"];
const MONTHS = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

function toDateNum(d: Date) {
  return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
}

function formatDate(d: Date, locale: "zh" | "en" = "zh") {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", { year: "numeric", month: "short", day: "numeric" }).format(d);
}

export function Datepicker({
  value,
  rangeStart,
  rangeEnd,
  locale = "zh",
  placeholder = locale === "zh" ? "选择日期" : "Select date",
  confirmSelection = false,
  rangeLabels,
  inline = false,
  minDate,
  maxDate,
  state = "idle",
  shape = "rounded",
  color = "purple",
  mode = "single",
  label,
  onChange,
  onRangeChange,
  className,
}: {
  value?: Date;
  locale?: "zh" | "en";
  /** Keep the range in a draft until the user applies it. */
  confirmSelection?: boolean;
  /** Optional separate start/end triggers. */
  rangeLabels?: [string, string];
  inline?: boolean;
  minDate?: Date;
  maxDate?: Date;
  rangeStart?: Date;
  rangeEnd?: Date;
  placeholder?: string;
  state?: DatepickerState;
  shape?: DatepickerShape;
  color?: DatepickerColor;
  mode?: DatepickerMode;
  label?: string;
  onChange?: (date: Date) => void;
  onRangeChange?: (start: Date, end: Date | null) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"calendar" | "months" | "years">("calendar");
  const initDate = value ?? rangeStart ?? new Date();
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());
  const [pickingEnd, setPickingEnd] = useState(false);
  const [draft, setDraft] = useState<{ start?: Date; end?: Date }>({ start: rangeStart, end: rangeEnd });
  const externalKey = `${value?.getTime() ?? ""}/${rangeStart?.getTime() ?? ""}/${rangeEnd?.getTime() ?? ""}`;
  const [syncedKey, setSyncedKey] = useState(externalKey);
  const [hoverDate, setHoverDate] = useState<Date | undefined>();
  const [focusedDate, setFocusedDate] = useState(initDate);
  const focusRequested = useRef(false);
  if (syncedKey !== externalKey) {
    setSyncedKey(externalKey);
    setDraft({ start: rangeStart, end: rangeEnd });
    setPickingEnd(false);
    setHoverDate(undefined);
    const next = value ?? rangeStart;
    if (next) { setViewYear(next.getFullYear()); setViewMonth(next.getMonth()); setFocusedDate(next); }
  }
  const pickedStart = confirmSelection ? draft.start : rangeStart;
  const pickedEnd = confirmSelection ? draft.end : rangeEnd;
  const visible = inline || open;
  const days = locale === "en" ? ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] : DAYS;
  const months = locale === "en" ? Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(2026, i, 1))) : MONTHS;
  const blocked = (date: Date) => Boolean(minDate && toDateNum(date) < toDateNum(minDate) || maxDate && toDateNum(date) > toDateNum(maxDate));
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerId = useId();
  const dialogId = useId();
  const accent = formAccents[color];
  const range = rangeStyles[color];

  const isError = state === "error";
  const isDisabled = state === "disabled";
  const isFocus = state === "focus" || open;
  const hasValue = mode === "single" ? !!value : !!(rangeStart && rangeEnd);
  const isFilled = state === "filled" || (hasValue && !open);
  const shapeClass = shape === "pill" ? "rounded-full" : "rounded-xl";

  useEffect(() => {
    if (!visible || inline) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setPickingEnd(false);
        setView("calendar");
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
      setPickingEnd(false);
      setView("calendar");
      triggerRef.current?.focus();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [visible, inline]);

  useEffect(() => {
    if (!focusRequested.current) return;
    focusRequested.current = false;
    ref.current?.querySelector<HTMLButtonElement>(`[data-date="${toDateNum(focusedDate)}"]`)?.focus();
  }, [focusedDate, viewMonth, viewYear]);
  function toggleOpen() {
    if (!open) { setDraft({ start: rangeStart, end: rangeEnd }); setPickingEnd(false); setHoverDate(undefined); }
    setOpen(!open);
  }
  function dayKey(event: ReactKeyboardEvent<HTMLButtonElement>, date: Date) {
    const offset = ({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 } as Record<string, number>)[event.key];
    if (offset === undefined && !["Home", "End", "PageUp", "PageDown"].includes(event.key)) return;
    event.preventDefault();
    const next = new Date(date);
    if (offset !== undefined) next.setDate(next.getDate() + offset);
    else if (event.key === "Home") next.setDate(1);
    else if (event.key === "End") next.setDate(getDaysInMonth(next.getFullYear(), next.getMonth()));
    else { const day = next.getDate(); next.setDate(1); next.setMonth(next.getMonth() + (event.key === "PageDown" ? 1 : -1)); next.setDate(Math.min(day, getDaysInMonth(next.getFullYear(), next.getMonth()))); }
    if (blocked(next)) return;
    setViewYear(next.getFullYear()); setViewMonth(next.getMonth()); setFocusedDate(next); focusRequested.current = true;
    if (pickingEnd) setHoverDate(next);
  }

  const wrapperClass = cn(
    "flex items-center gap-1 px-4 py-3 outline outline-1 outline-offset-[-1px] transition-all cursor-pointer",
    shapeClass,
    isError && "bg-fg-red-100 outline-fg-red",
    isDisabled && "bg-fg-grey-200 outline-fg-grey-200 cursor-not-allowed",
    isFocus && !isError && !isDisabled && `bg-transparent ${accent.outline}`,
    isFilled && !isFocus && !isError && !isDisabled && "bg-white outline-fg-grey-200",
    !isError && !isDisabled && !isFocus && !isFilled && "bg-white outline-fg-grey-200",
    className,
  );

  const today = new Date();
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const focusInMonth = focusedDate.getMonth() === viewMonth && focusedDate.getFullYear() === viewYear && !blocked(focusedDate);
  const tabDay = focusInMonth ? focusedDate.getDate() : Array.from({ length: daysInMonth }, (_, index) => index + 1).find(day => !blocked(new Date(viewYear, viewMonth, day)));
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  function handleDayClick(date: Date) {
    if (blocked(date)) return;
    setFocusedDate(date); setHoverDate(undefined);
    if (mode === "single") { onChange?.(date); if (!inline) { setOpen(false); triggerRef.current?.focus(); } return; }
    if (!pickingEnd || !pickedStart) {
      if (confirmSelection) setDraft({ start: date }); else onRangeChange?.(date, null);
      setPickingEnd(true);
    } else {
      const [start, end] = toDateNum(date) >= toDateNum(pickedStart) ? [pickedStart, date] : [date, pickedStart];
      if (confirmSelection) setDraft({ start, end }); else onRangeChange?.(start, end);
      setPickingEnd(false);
      if (!confirmSelection && !inline) { setOpen(false); triggerRef.current?.focus(); }
    }
  }

  // Display text
  let displayText = placeholder;
  if (mode === "single" && value) {
    displayText = formatDate(value, locale);
  } else if (mode === "range" && rangeStart) {
    displayText = rangeEnd
      ? `${formatDate(rangeStart, locale)} — ${formatDate(rangeEnd, locale)}`
      : `${formatDate(rangeStart, locale)} — ...`;
  }

  // Build column-based calendar
  const totalSlots = firstDay + daysInMonth;
  const rows = Math.ceil(totalSlots / 7);
  const columns: (number | null)[][] = Array.from({ length: 7 }, () => []);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < 7; col++) {
      const index = row * 7 + col;
      const day = index - firstDay + 1;
      columns[col].push(day >= 1 && day <= daysInMonth ? day : null);
    }
  }

  function getDayState(day: number) {
    const date = new Date(viewYear, viewMonth, day);
    const num = toDateNum(date);

    const isSelectedSingle = mode === "single" && value && isSameDay(date, value);
    const previewEnd = pickedEnd ?? (pickingEnd ? hoverDate : undefined);
    const low = pickedStart && previewEnd ? Math.min(toDateNum(pickedStart), toDateNum(previewEnd)) : undefined;
    const high = pickedStart && previewEnd ? Math.max(toDateNum(pickedStart), toDateNum(previewEnd)) : undefined;
    const isRangeStart = mode === "range" && pickedStart && isSameDay(date, pickedStart);
    const isRangeEnd = mode === "range" && previewEnd && isSameDay(date, previewEnd);
    const isInRange = mode === "range" && low !== undefined && high !== undefined && num > low && num < high;
    const isToday = isSameDay(date, today) && !isSelectedSingle && !isRangeStart && !isRangeEnd;

    return { isSelectedSingle, isRangeStart, isRangeEnd, isInRange, isToday };
  }

  return (
    <div className="flex flex-col" ref={ref}>
      {label && (
        <label htmlFor={triggerId} className="text-sm font-medium text-fg-black mb-1">{label}</label>
      )}
      <div className="relative">
        {mode === "range" && rangeLabels ? <div className="grid grid-cols-2 gap-2">{rangeLabels.map((text, i) => <button key={text} ref={i === 0 ? triggerRef : undefined} id={i === 0 ? triggerId : undefined} type="button" disabled={isDisabled} aria-expanded={visible} aria-controls={dialogId} onClick={() => { if (!inline && !open) { setDraft({ start: rangeStart, end: rangeEnd }); setOpen(true); } setPickingEnd(i === 1 && Boolean(pickedStart)); }} className={cn(wrapperClass, "flex-col items-start")}><span className="text-xs text-fg-grey-700">{text}</span><span className="text-sm">{(i === 0 ? pickedStart : pickedEnd) ? formatDate((i === 0 ? pickedStart : pickedEnd)!, locale) : placeholder}</span></button>)}</div> : <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          disabled={isDisabled}
          aria-haspopup="dialog"
          aria-expanded={open && !isDisabled}
          aria-controls={dialogId}
          className={cn(wrapperClass, "text-left")}
          onClick={toggleOpen}
        >
          <span
            className={cn(
              "flex-1 text-sm font-normal leading-5",
              isError && "text-fg-red",
              isDisabled && "text-fg-grey-700",
              !hasValue && !isError && "text-fg-grey-700",
              hasValue && !isError && !isDisabled && "text-fg-black",
            )}
          >
            {displayText}
          </span>
          <span className="text-fg-grey-700"><CalendarLinear size={20} /></span>
        </button>}

        {visible && !isDisabled && (
          <div id={dialogId} role="dialog" aria-label={label ?? placeholder} className={cn("mt-2 w-96 max-w-full bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-fg-grey-200 z-50", !inline && "absolute top-full left-0 max-w-[calc(100vw-2rem)] shadow-sm")}>
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-fg-grey-200 p-4">
              <button type="button" aria-label={locale === "zh" ? "上个月" : "Previous month"} onClick={prevMonth} className="p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 cursor-pointer hover:bg-fg-grey-100 transition-colors">
                <AltArrowLeftLinear size={16} />
              </button>

              <button
                type="button"
                onClick={() => setView(view === "months" ? "calendar" : "months")}
                className={cn(
                  "flex-1 h-10 px-3 py-2.5 bg-white rounded-lg flex items-center gap-2 cursor-pointer",
                  view === "months" && `outline outline-1 outline-offset-[-1px] ${accent.outline}`,
                )}
              >
                <span className="flex-1 text-sm font-medium text-fg-black leading-5 tracking-fg">{months[viewMonth]}</span>
                <span className="text-fg-grey-700"><AltArrowDownLinear size={16} /></span>
              </button>

              <button
                type="button"
                onClick={() => setView(view === "years" ? "calendar" : "years")}
                className={cn(
                  "w-24 h-10 px-3 py-2.5 bg-white rounded-lg flex items-center gap-2 cursor-pointer",
                  view === "years" && `outline outline-1 outline-offset-[-1px] ${accent.outline}`,
                )}
              >
                <span className="flex-1 text-sm font-medium text-fg-black leading-5 tracking-fg">{viewYear}</span>
                <span className="text-fg-grey-700"><AltArrowDownLinear size={16} /></span>
              </button>

              <button type="button" aria-label={locale === "zh" ? "下个月" : "Next month"} onClick={nextMonth} className="p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 cursor-pointer hover:bg-fg-grey-100 transition-colors">
                <AltArrowRightLinear size={16} />
              </button>
            </div>

            {/* Months list view */}
            {view === "months" && (
              <div className="self-stretch flex-1 flex flex-col overflow-y-auto max-h-64">
                {months.map((m, i) => {
                  const isSelected = i === viewMonth;
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => { setViewMonth(i); setView("calendar"); }}
                      className="h-11 px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-fg-grey-100"
                    >
                      <span className={cn(
                        "text-sm leading-5 tracking-fg",
                        isSelected ? `font-bold ${accent.text}` : "font-semibold text-fg-grey-700",
                      )}>
                        {m}
                      </span>
                      {isSelected && <CheckCircleLinear size={16} className={accent.text} />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Years list view */}
            {view === "years" && (
              <div className="self-stretch flex-1 flex flex-col overflow-y-auto max-h-64">
                {Array.from({ length: 12 }, (_, i) => viewYear - 5 + i).map((y) => {
                  const isSelected = y === viewYear;
                  return (
                    <button
                      type="button"
                      key={y}
                      onClick={() => { setViewYear(y); setView("calendar"); }}
                      className="h-11 px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-fg-grey-100"
                    >
                      <span className={cn(
                        "text-sm leading-5 tracking-fg",
                        isSelected ? `font-bold ${accent.text}` : "font-semibold text-fg-grey-700",
                      )}>
                        {y}
                      </span>
                      {isSelected && <CheckCircleLinear size={16} className={accent.text} />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Calendar body */}
            {view === "calendar" && (
              <>
                <div className="p-4 flex justify-between" onPointerLeave={() => setHoverDate(undefined)}>
                  {columns.map((col, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-4">
                      <div className="w-8 h-8 p-0.5 rounded-lg flex flex-col justify-center items-center">
                        <span className="text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">{days[colIndex]}</span>
                      </div>

                      {col.map((day, rowIndex) => {
                        if (day === null) {
                          return <div key={`empty-${rowIndex}`} className="w-8 h-8 p-0.5 opacity-0"><span className="text-sm">&nbsp;</span></div>;
                        }

                        const { isSelectedSingle, isRangeStart, isRangeEnd, isInRange, isToday } = getDayState(day);
                        const isEndpoint = isSelectedSingle || isRangeStart || isRangeEnd;

                        return (
                          <button
                            key={day}
                            type="button"
                            aria-label={formatDate(new Date(viewYear, viewMonth, day), locale)}
                            data-date={toDateNum(new Date(viewYear, viewMonth, day))}
                            tabIndex={day === tabDay ? 0 : -1}
                            disabled={blocked(new Date(viewYear, viewMonth, day))}
                            onKeyDown={event => dayKey(event, new Date(viewYear, viewMonth, day))}
                            onPointerEnter={() => pickingEnd && setHoverDate(new Date(viewYear, viewMonth, day))}
                            aria-pressed={!!isEndpoint}
                            onClick={() => handleDayClick(new Date(viewYear, viewMonth, day))}
                            className={cn(
                              "w-8 h-8 p-0.5 flex flex-col justify-center items-center cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
                              isEndpoint && `${accent.bg} rounded-full`,
                              isInRange && `${range.bg} rounded-full`,
                              isToday && `rounded-lg outline outline-1 ${accent.outline}`,
                              !isEndpoint && !isInRange && !isToday && "rounded-lg hover:bg-fg-grey-100",
                            )}
                          >
                            <span
                              className={cn(
                                "text-sm font-medium leading-5 tracking-fg",
                                isEndpoint && "text-white",
                                isInRange && range.text,
                                isToday && !isInRange && accent.text,
                                !isEndpoint && !isInRange && !isToday && "text-fg-grey-700",
                              )}
                            >
                              {day}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {mode === "range" && confirmSelection && <div className="flex items-center justify-between gap-3 border-t border-fg-grey-200 px-4 py-3">
                  <span className="text-xs text-fg-grey-700" aria-live="polite">{draft.start && draft.end ? `${Math.round((Date.UTC(draft.end.getFullYear(), draft.end.getMonth(), draft.end.getDate()) - Date.UTC(draft.start.getFullYear(), draft.start.getMonth(), draft.start.getDate())) / 86400000)} ${locale === "zh" ? "晚" : "nights"}` : locale === "zh" ? "请选择日期区间" : "Choose a date range"}</span>
                  <button type="button" disabled={!draft.start || !draft.end} onClick={() => { if (draft.start && draft.end) { onRangeChange?.(draft.start, draft.end); if (!inline) { setOpen(false); triggerRef.current?.focus(); } } }} className={cn("rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-40", accent.bg)}>{locale === "zh" ? "应用" : "Apply"}</button>
                </div>}
                {/* Range hint */}
                {mode === "range" && pickingEnd && (
                  <div className="px-4 pb-3 text-center">
                    <span className={cn("text-xs font-medium tracking-fg", range.text)}>
                      {locale === "zh" ? "选择结束日期" : "Choose an end date"}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
