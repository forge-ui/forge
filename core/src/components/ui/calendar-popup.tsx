"use client";

import { useEffect, useState } from "react";
import { AltArrowLeftLinear, AltArrowRightLinear } from "solar-icon-set";
import { cn } from "../../lib/utils";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function CalendarPopup({ accentBg = "bg-fg-violet" }: { accentBg?: string }) {
  // Initialize from a stable placeholder (not `new Date()` at render) to avoid
  // server/client hydration mismatch. Real "today" is set after mount.
  const [today, setToday] = useState<Date | null>(null);
  const [viewYear, setViewYear] = useState(2024);
  const [viewMonth, setViewMonth] = useState(0);

  useEffect(() => {
    const now = new Date();
    setToday(now);
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  }, []);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const isToday = (day: number) =>
    today !== null &&
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const blanks = Array.from({ length: firstDay }, (_, i) => <div key={`b-${i}`} className="w-8 h-8" />);
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    return (
      <button
        key={d}
        type="button"
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center text-sm leading-5 transition-colors",
          isToday(d) ? cn(accentBg, "text-white rounded-full font-bold") : "text-slate-700 hover:bg-fg-grey-100"
        )}
      >
        {d}
      </button>
    );
  });

  return (
    <div className="w-[400px] bg-white rounded-card shadow-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex flex-col">
      <div className="p-4 border-b border-fg-grey-200 flex items-center gap-3">
        <button type="button" onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-fg-grey-700 hover:bg-fg-grey-100 transition-colors">
          <AltArrowLeftLinear size={16} />
        </button>
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="text-fg-black text-sm font-semibold leading-5">{MONTH_NAMES[viewMonth]}</span>
          <span className="text-fg-black text-sm font-semibold leading-5">{viewYear}</span>
        </div>
        <button type="button" onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-fg-grey-700 hover:bg-fg-grey-100 transition-colors">
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
