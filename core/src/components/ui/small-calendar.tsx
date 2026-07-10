"use client";

import { useState, useSyncExternalStore } from "react";
import { cn } from "../../lib/utils";
import { AltArrowLeftLinear, AltArrowRightLinear, MenuDotsBold } from "solar-icon-set";
import { accentColors, type AccentColor } from "./accent-utils";
import { EventCard, type EventCardColor } from "./event-card";
import { MONTH_NAMES, DAY_NAMES_SHORT, getDaysInMonth, getFirstDayOfMonth } from "./calendar-utils";
import { resolveCardWidthClass, type CardWidth } from "./card-utils";

const subscribeToHydration = () => () => undefined;
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

// ============================================================
// SmallCalendar — Figma "Small Calendar" (node 6387:3079)
// Compact month calendar widget with title, month nav, day grid,
// and event list below the selected date. 3 colors.
// ============================================================

export interface SmallCalendarEvent {
  day: number;
  title: string;
  timeRange: string;
  color?: EventCardColor;
  avatars?: string[];
  overflowCount?: number;
}

export function SmallCalendar({
  title = "日历",
  subtitle = "本月日程",
  color = "purple",
  events = [],
  onMenuClick,
  width,
  className,
}: {
  title?: string;
  subtitle?: string;
  color?: AccentColor;
  events?: SmallCalendarEvent[];
  onMenuClick?: () => void;
  /** Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. */
  width?: CardWidth;
  className?: string;
}) {
  const accent = accentColors[color];
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const today = hydrated ? new Date() : null;
  const [manualView, setManualView] = useState<{ year: number; month: number } | null>(null);
  const [selectedDayOverride, setSelectedDay] = useState<number | null>(null);
  const viewYear = manualView?.year ?? today?.getFullYear() ?? 2024;
  const viewMonth = manualView?.month ?? today?.getMonth() ?? 0;
  const selectedDay = selectedDayOverride ?? today?.getDate() ?? 1;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const isToday = (day: number) =>
    today !== null
    && day === today.getDate()
    && viewMonth === today.getMonth()
    && viewYear === today.getFullYear();

  const selectedEvents = events.filter((e) => e.day === selectedDay);
  const eventDays = new Set(events.map((e) => e.day));

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

  return (
    <div
      className={cn(
        "bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex-col overflow-hidden",
        resolveCardWidthClass(width, "w-96"),
        className,
      )}
    >
      {/* Header */}
      <div className="px-6 pt-6 flex items-start gap-3">
        <div className="flex-1 flex flex-col gap-2">
          <span className="text-fg-black text-sm font-semibold leading-5 tracking-fg">{title}</span>
          <span className="text-fg-grey-700 text-xs font-medium leading-4.5 tracking-fg">{subtitle}</span>
        </div>
        {onMenuClick && (
          <button type="button" aria-label="更多操作" onClick={onMenuClick} className="w-6 h-6 flex items-center justify-center cursor-pointer text-fg-grey-700">
            <MenuDotsBold size={16} className="rotate-90" />
          </button>
        )}
      </div>

      {/* Calendar body */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        {/* Month nav */}
        <div className="flex items-center gap-2">
          <button type="button" aria-label="上个月" onClick={prevMonth} className="p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex items-center justify-center cursor-pointer hover:bg-fg-grey-100 text-fg-grey-700">
            <AltArrowLeftLinear size={20} />
          </button>
          <div className="flex-1 flex justify-center items-center gap-2">
            <span className="text-fg-black text-sm font-medium leading-5 tracking-fg">{MONTH_NAMES[viewMonth].slice(0, 9)}</span>
            <span className="text-fg-black text-sm font-medium leading-5 tracking-fg">{viewYear}</span>
          </div>
          <button type="button" aria-label="下个月" onClick={nextMonth} className="p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex items-center justify-center cursor-pointer hover:bg-fg-grey-100 text-fg-grey-700">
            <AltArrowRightLinear size={20} />
          </button>
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-y-2 justify-items-center">
          {DAY_NAMES_SHORT.map((d) => (
            <span key={d} className="w-8 h-8 flex items-center justify-center text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
              {d}
            </span>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <span key={`empty-${i}`} className="w-8 h-8" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const selected = day === selectedDay;
            const tod = isToday(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "w-8 h-8 rounded-lg flex flex-col items-center justify-center text-sm leading-5 tracking-fg cursor-pointer transition-colors relative",
                  selected && cn(accent.bg, "text-white font-semibold"),
                  !selected && tod && cn(accent.text, "font-semibold"),
                  !selected && !tod && "text-fg-grey-700 font-medium hover:bg-fg-grey-100",
                )}
              >
                {day}
                {eventDays.has(day) && !selected && (
                  <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-fg-red" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day event list */}
        {selectedDay && (
          <div className="flex flex-col gap-3 pt-2 border-t border-fg-grey-200">
            <span className="text-fg-black text-sm font-semibold leading-5 tracking-fg">
              {selectedDay} {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            {selectedEvents.length === 0 ? (
              <span className="text-fg-grey-700 text-xs">暂无事件</span>
            ) : (
              selectedEvents.map((e, i) => (
                <EventCard
                  key={`${e.title}-${i}`}
                  title={e.title}
                  timeRange={e.timeRange}
                  color={e.color ?? "purple"}
                  avatars={e.avatars ?? []}
                  overflowCount={e.overflowCount}
                  className="w-full"
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
