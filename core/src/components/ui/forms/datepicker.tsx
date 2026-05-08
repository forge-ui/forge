"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "../../../lib/utils";
import {
  CalendarLinear,
  AltArrowLeftLinear,
  AltArrowRightLinear,
  AltArrowDownLinear,
  CheckCircleLinear,
} from "solar-icon-set";
import { formAccents, type FormAccentColor } from "./form-utils";

const rangeStyles: Record<FormAccentColor, { bg: string; text: string }> = {
  purple: { bg: "bg-purple-100", text: "text-fg-violet" },
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  black: { bg: "bg-fg-grey-200", text: "text-fg-black" },
};

export type DatepickerState = "idle" | "focus" | "filled" | "disabled" | "error";
export type DatepickerShape = "rounded" | "pill";
export type DatepickerColor = FormAccentColor;
export type DatepickerMode = "single" | "range";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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

function formatDate(d: Date) {
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}

export function Datepicker({
  value,
  rangeStart,
  rangeEnd,
  placeholder = "Select date",
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
  const ref = useRef<HTMLDivElement>(null);
  const accent = formAccents[color];
  const range = rangeStyles[color];

  const isError = state === "error";
  const isDisabled = state === "disabled";
  const isFocus = state === "focus" || open;
  const hasValue = mode === "single" ? !!value : !!(rangeStart && rangeEnd);
  const isFilled = state === "filled" || (hasValue && !open);
  const shapeClass = shape === "pill" ? "rounded-full" : "rounded-xl";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setPickingEnd(false);
        setView("calendar");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const wrapperClass = cn(
    "flex items-center gap-1 px-4 py-3 outline outline-1 outline-offset-[-1px] transition-all cursor-pointer",
    shapeClass,
    isError && "bg-rose-100 outline-fg-red",
    isDisabled && "bg-fg-grey-200 outline-fg-grey-200 cursor-not-allowed",
    isFocus && !isError && !isDisabled && `bg-transparent ${accent.outline}`,
    isFilled && !isFocus && !isError && !isDisabled && "bg-white outline-fg-grey-200",
    !isError && !isDisabled && !isFocus && !isFilled && "bg-white outline-fg-grey-200",
    className,
  );

  const today = new Date();
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
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
    if (mode === "single") {
      onChange?.(date);
      setOpen(false);
    } else {
      if (!pickingEnd || !rangeStart) {
        onRangeChange?.(date, null);
        setPickingEnd(true);
      } else {
        const [start, end] = toDateNum(date) >= toDateNum(rangeStart)
          ? [rangeStart, date]
          : [date, rangeStart];
        onRangeChange?.(start, end);
        setPickingEnd(false);
        setOpen(false);
      }
    }
  }

  // Display text
  let displayText = placeholder;
  if (mode === "single" && value) {
    displayText = formatDate(value);
  } else if (mode === "range" && rangeStart) {
    displayText = rangeEnd
      ? `${formatDate(rangeStart)} — ${formatDate(rangeEnd)}`
      : `${formatDate(rangeStart)} — ...`;
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
    const isRangeStart = mode === "range" && rangeStart && isSameDay(date, rangeStart);
    const isRangeEnd = mode === "range" && rangeEnd && isSameDay(date, rangeEnd);
    const isInRange = mode === "range" && rangeStart && rangeEnd
      && num > toDateNum(rangeStart) && num < toDateNum(rangeEnd);
    const isToday = isSameDay(date, today) && !isSelectedSingle && !isRangeStart && !isRangeEnd;

    return { isSelectedSingle, isRangeStart, isRangeEnd, isInRange, isToday };
  }

  return (
    <div className="flex flex-col" ref={ref}>
      {label && (
        <label className="text-sm font-medium text-fg-black mb-1">{label}</label>
      )}
      <div className="relative">
        <div className={wrapperClass} onClick={() => !isDisabled && setOpen(!open)}>
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
        </div>

        {open && !isDisabled && (
          <div className="absolute top-full left-0 mt-1 w-96 bg-white rounded-[20px] shadow-[0px_4px_30px_0px_rgba(77,84,100,0.05)] outline outline-1 outline-offset-[-1px] outline-fg-grey-200 z-50">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-fg-grey-200 p-4">
              <button type="button" onClick={prevMonth} className="p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 cursor-pointer hover:bg-fg-grey-100 transition-colors">
                <AltArrowLeftLinear size={16} />
              </button>

              <div
                onClick={() => setView(view === "months" ? "calendar" : "months")}
                className={cn(
                  "flex-1 h-10 px-3 py-2.5 bg-white rounded-lg flex items-center gap-2 cursor-pointer",
                  view === "months" && `outline outline-1 outline-offset-[-1px] ${accent.outline}`,
                )}
              >
                <span className="flex-1 text-sm font-medium text-fg-black leading-5 tracking-fg">{MONTHS[viewMonth]}</span>
                <span className="text-fg-grey-700"><AltArrowDownLinear size={16} /></span>
              </div>

              <div
                onClick={() => setView(view === "years" ? "calendar" : "years")}
                className={cn(
                  "w-24 h-10 px-3 py-2.5 bg-white rounded-lg flex items-center gap-2 cursor-pointer",
                  view === "years" && `outline outline-1 outline-offset-[-1px] ${accent.outline}`,
                )}
              >
                <span className="flex-1 text-sm font-medium text-fg-black leading-5 tracking-fg">{viewYear}</span>
                <span className="text-fg-grey-700"><AltArrowDownLinear size={16} /></span>
              </div>

              <button type="button" onClick={nextMonth} className="p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 cursor-pointer hover:bg-fg-grey-100 transition-colors">
                <AltArrowRightLinear size={16} />
              </button>
            </div>

            {/* Months list view */}
            {view === "months" && (
              <div className="self-stretch flex-1 flex flex-col overflow-y-auto max-h-64">
                {MONTHS.map((m, i) => {
                  const isSelected = i === viewMonth;
                  return (
                    <div
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
                    </div>
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
                    <div
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
                    </div>
                  );
                })}
              </div>
            )}

            {/* Calendar body */}
            {view === "calendar" && (
              <>
                <div className="p-4 flex justify-between">
                  {columns.map((col, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-4">
                      <div className="w-8 h-8 p-0.5 rounded-lg flex flex-col justify-center items-center">
                        <span className="text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">{DAYS[colIndex]}</span>
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
                            onClick={() => handleDayClick(new Date(viewYear, viewMonth, day))}
                            className={cn(
                              "w-8 h-8 p-0.5 flex flex-col justify-center items-center cursor-pointer transition-colors",
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

                {/* Range hint */}
                {mode === "range" && pickingEnd && (
                  <div className="px-4 pb-3 text-center">
                    <span className={cn("text-xs font-medium tracking-fg", range.text)}>
                      Select end date
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
