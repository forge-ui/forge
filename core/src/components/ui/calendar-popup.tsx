"use client";

import { useState, useSyncExternalStore } from "react";
import { AltArrowLeftLinear, AltArrowRightLinear } from "solar-icon-set";
import { cn } from "../../lib/utils";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
];

const DAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

const subscribeToHydration = () => () => undefined;
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function CalendarPopup({
  accentBg = "bg-fg-violet",
  initialDate,
  value,
  onChange,
}: {
  accentBg?: string;
  /** Stable initial month for SSR, tests, and embedded popovers. */
  initialDate?: Date;
  value?: Date;
  onChange?: (date: Date) => void;
}) {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const localToday = hydrated ? new Date() : null;
  const today = initialDate ?? localToday;
  const initialViewDate = initialDate ?? value ?? localToday;
  const [manualView, setManualView] = useState<{ year: number; month: number } | null>(null);
  const viewYear = manualView?.year ?? initialViewDate?.getFullYear() ?? 2024;
  const viewMonth = manualView?.month ?? initialViewDate?.getMonth() ?? 0;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    setManualView(
      viewMonth === 0
        ? { year: viewYear - 1, month: 11 }
        : { year: viewYear, month: viewMonth - 1 },
    );
  };
  const nextMonth = () => {
    setManualView(
      viewMonth === 11
        ? { year: viewYear + 1, month: 0 }
        : { year: viewYear, month: viewMonth + 1 },
    );
  };

  const isToday = (day: number) =>
    today !== null
    && day === today.getDate()
    && viewMonth === today.getMonth()
    && viewYear === today.getFullYear();
  const isSelected = (day: number) =>
    value !== undefined &&
    day === value.getDate() && viewMonth === value.getMonth() && viewYear === value.getFullYear();

  const blanks = Array.from({ length: firstDay }, (_, i) => <div key={`b-${i}`} className="w-8 h-8" />);
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    return (
      <button
        key={d}
        type="button"
        aria-label={`${viewYear}年${viewMonth + 1}月${d}日`}
        aria-pressed={isSelected(d)}
        onClick={() => onChange?.(new Date(viewYear, viewMonth, d))}
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center text-sm leading-5 transition-colors",
          isSelected(d) || isToday(d) ? cn(accentBg, "text-white rounded-full font-bold") : "text-fg-grey-900 hover:bg-fg-grey-100"
        )}
      >
        {d}
      </button>
    );
  });

  return (
    <div
      role="dialog"
      aria-label="日历"
      className="w-full max-w-[400px] bg-white rounded-card shadow-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex flex-col"
    >
      <div className="p-4 border-b border-fg-grey-200 flex items-center gap-3">
        <button type="button" aria-label="上个月" onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-fg-grey-700 hover:bg-fg-grey-100 transition-colors">
          <AltArrowLeftLinear size={16} />
        </button>
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="text-fg-black text-sm font-semibold leading-5">{MONTH_NAMES[viewMonth]}</span>
          <span className="text-fg-black text-sm font-semibold leading-5">{viewYear}</span>
        </div>
        <button type="button" aria-label="下个月" onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-fg-grey-700 hover:bg-fg-grey-100 transition-colors">
          <AltArrowRightLinear size={16} />
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_LABELS.map((d) => (
            <div key={d} className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-fg-grey-500">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks}
          {days}
        </div>
      </div>
    </div>
  );
}
