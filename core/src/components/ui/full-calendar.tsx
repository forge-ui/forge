"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { AltArrowLeftLinear, AltArrowRightLinear, AltArrowDownLinear, PenLinear, MenuDotsBold, CloseCircleLinear } from "solar-icon-set";
import { accentColors, type AccentColor } from "./accent-utils";
import { EventTag, type EventTagColor } from "./event-tag";
import { CalendarDayCell } from "./calendar-day-cell";
import { MONTH_NAMES, DAY_NAMES_UPPER, getDaysInMonth, getFirstDayOfMonth, formatHour } from "./calendar-utils";

// ============================================================
// FullCalendar — Figma "Calendar" (node 6377:1696)
//
// 6 variants = 3 views × 2 modes:
//   view:  "month" | "week" | "day"
//   mode:  plain (no detail) | with detailPanel (floating overlay)
//
// Props-driven — `view` is controlled from outside so the showcase
// can render all 6 variants statically side-by-side.
// ============================================================

const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14];

export type CalendarView = "month" | "week" | "day";

export interface CalendarEvent {
  day: number;
  label: string;
  color: EventTagColor;
  avatar?: string;
  hour?: number;
}

const barBg: Record<EventTagColor, string> = {
  purple: "bg-fg-violet",
  blue: "bg-blue-600",
  green: "bg-emerald-500",
  red: "bg-fg-red",
  yellow: "bg-fg-yellow",
  cyan: "bg-teal-400",
  orange: "bg-orange-500",
};

export function FullCalendar({
  view = "month",
  color = "purple",
  year: yearProp,
  month: monthProp,
  day: dayProp,
  events = [],
  detailPanel,
  onCloseDetail,
  className,
}: {
  /** Controlled view */
  view?: CalendarView;
  color?: AccentColor;
  /** Initial year/month/day (defaults to today, then managed internally) */
  year?: number;
  month?: number;
  day?: number;
  events?: CalendarEvent[];
  /** Floating detail overlay. Pass ReactNode to show, omit to hide. */
  detailPanel?: ReactNode;
  onCloseDetail?: () => void;
  className?: string;
}) {
  const accent = accentColors[color];
  const today = new Date();
  const [yr, setYr] = useState(yearProp ?? today.getFullYear());
  const [mo, setMo] = useState(monthProp ?? today.getMonth());
  const [dy] = useState(dayProp ?? today.getDate());

  const daysInMonth = getDaysInMonth(yr, mo);
  const firstDay = getFirstDayOfMonth(yr, mo);
  const prevMonthDays = getDaysInMonth(yr, mo === 0 ? 11 : mo - 1);
  const isTodayCell = (d: number) => d === today.getDate() && mo === today.getMonth() && yr === today.getFullYear();

  const prev = () => { if (mo === 0) { setMo(11); setYr(yr - 1); } else setMo(mo - 1); };
  const next = () => { if (mo === 11) { setMo(0); setYr(yr + 1); } else setMo(mo + 1); };
  const goToday = () => { setYr(today.getFullYear()); setMo(today.getMonth()); };

  // Week range
  const viewDate = new Date(yr, mo, dy);
  const ws = new Date(viewDate); ws.setDate(viewDate.getDate() - viewDate.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(ws); d.setDate(ws.getDate() + i); return d; });

  // Month grid (42 cells)
  const cells: { day: number; cur: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
  while (cells.length < 42) cells.push({ day: cells.length - firstDay - daysInMonth + 1, cur: false });

  const titleText = view === "month"
    ? `${MONTH_NAMES[mo]} ${yr}`
    : view === "week"
      ? `${weekDays[0].getDate()}-${weekDays[6].getDate()} ${MONTH_NAMES[weekDays[0].getMonth()]} ${weekDays[0].getFullYear()}`
      : `${dy} ${MONTH_NAMES[mo]} ${yr}`;

  const viewLabel = view === "month" ? "Month" : view === "week" ? "Week" : "Days";

  return (
    <div className={cn("bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 overflow-hidden relative", className)}>

      {/* ── Top bar ── */}
      <div className="px-4 py-3 border-b border-fg-grey-200 flex items-center gap-3">
        <button onClick={goToday} className="px-3 py-1.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-xs font-medium text-fg-grey-700 hover:bg-fg-grey-100 cursor-pointer shrink-0">Today</button>
        <button onClick={prev} className="p-1 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 hover:bg-fg-grey-100 cursor-pointer text-fg-grey-700"><AltArrowLeftLinear size={14} /></button>
        <span className="text-fg-black text-sm font-semibold leading-5 tracking-fg min-w-36 text-center">{titleText}</span>
        <button onClick={next} className="p-1 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 hover:bg-fg-grey-100 cursor-pointer text-fg-grey-700"><AltArrowRightLinear size={14} /></button>
        <div className="flex-1" />
        <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-xs font-medium text-fg-grey-700">
          {viewLabel}
          <AltArrowDownLinear size={12} />
        </span>
      </div>

      {/* ── Month View — uses CalendarDayCell ── */}
      {view === "month" && (
        <div className="grid grid-cols-7">
          {DAY_NAMES_UPPER.map((d) => (
            <div key={d} className="px-2 py-2 border-b border-fg-grey-200 text-center">
              <span className="text-[10px] font-semibold text-fg-grey-700 uppercase tracking-fg">{d}</span>
            </div>
          ))}
          {cells.map((c, i) => {
            const evs = c.cur ? events.filter((e) => e.day === c.day).map((e) => ({ label: e.label, color: e.color, avatar: e.avatar })) : [];
            const tod = c.cur && isTodayCell(c.day);
            return (
              <CalendarDayCell
                key={i}
                day={c.day}
                isToday={tod}
                isOtherMonth={!c.cur}
                events={evs}
                maxVisible={2}
                moreAvatar={evs[0]?.avatar}
                className="min-h-20 min-w-0 rounded-none border-0 border-b border-r border-fg-grey-100"
              />
            );
          })}
        </div>
      )}

      {/* ── Week View — uses CalendarWeekRow for time rows ── */}
      {view === "week" && (
        <div className="flex flex-col">
          {/* Day column headers */}
          <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-fg-grey-200">
            <div />
            {weekDays.map((d, i) => {
              const isT = d.toDateString() === today.toDateString();
              return (
                <div key={i} className="px-1 py-2 text-center border-l border-fg-grey-100">
                  <span className={cn("text-sm font-semibold", isT ? accent.text : "text-fg-black")}>{d.getDate()}</span>
                  <br />
                  <span className={cn("text-[10px] uppercase", isT ? accent.text : "text-fg-grey-500")}>{DAY_NAMES_UPPER[i]}</span>
                </div>
              );
            })}
          </div>
          {/* Time rows — 7-column grid, events placed by day + hour */}
          {HOURS.map((h) => (
            <div key={h} className="grid grid-cols-[56px_repeat(7,1fr)] min-h-11 border-b border-fg-grey-100">
              <div className="px-1 py-1 text-right text-[10px] text-fg-grey-700 font-medium">{formatHour(h)}</div>
              {weekDays.map((d, di) => {
                const cellEvs = events.filter((e) => e.hour === h && e.day === d.getDate());
                return (
                  <div key={di} className="border-l border-fg-grey-100 px-0.5 py-0.5 flex flex-col gap-0.5">
                    {cellEvs.map((ev, j) => (
                      <EventTag key={j} label={ev.label} color={ev.color} avatar={ev.avatar} size="sm" variant="solid" />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* ── Day View ── */}
      {view === "day" && (
        <div>
          {HOURS.map((h) => {
            const hEvs = events.filter((e) => e.hour === h && e.day === dy);
            return (
              <div key={h} className="flex min-h-11 border-b border-fg-grey-100">
                <div className="w-14 px-1 py-1 text-right text-[10px] text-fg-grey-700 font-medium shrink-0">{formatHour(h)}</div>
                <div className="flex-1 border-l border-fg-grey-100 flex flex-col gap-1 py-0.5">
                  {hEvs.map((ev, j) => (
                    <div key={j} className={cn("h-7 rounded-lg flex items-center px-3 gap-2", barBg[ev.color])}>
                      {ev.avatar && <img src={ev.avatar} alt="" className="w-4 h-4 rounded-full border border-white/50 object-cover" />}
                      <span className="text-white text-xs font-semibold truncate">{ev.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Detail floating overlay ── */}
      {detailPanel && (
        <div className="absolute right-4 top-14 w-72 bg-white rounded-2xl shadow-[0px_4px_30px_0px_rgba(77,84,100,0.12)] outline outline-1 outline-offset-[-1px] outline-fg-grey-200 overflow-y-auto max-h-[calc(100%-70px)] z-30">
          <div className="flex items-center justify-end gap-1 px-4 pt-3">
            <button className="w-5 h-5 flex items-center justify-center text-fg-grey-700 hover:text-fg-black cursor-pointer"><PenLinear size={14} /></button>
            <button className="w-5 h-5 flex items-center justify-center text-fg-grey-700 hover:text-fg-black cursor-pointer"><MenuDotsBold size={14} /></button>
            <button onClick={onCloseDetail} className="w-5 h-5 flex items-center justify-center text-fg-grey-700 hover:text-fg-black cursor-pointer"><CloseCircleLinear size={14} /></button>
          </div>
          {detailPanel}
        </div>
      )}
    </div>
  );
}
