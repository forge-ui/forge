"use client";

/* eslint-disable @next/next/no-img-element */
import { cn } from "../../lib/utils";
import { MenuDotsBold } from "solar-icon-set";
import { type AccentColor } from "./accent-utils";
import { EventCard, type EventCardColor } from "./event-card";

// ============================================================
// SmallDailyCalendar — Figma "Small Daily Calendar" (node 6387:22579)
// Compact daily timeline with hour grid columns, event cards that
// span time slots, and a red "now" indicator line. 3 accent colors.
// ============================================================

export interface DailyEvent {
  title: string;
  timeRange: string;
  /** Start hour (0-23) */
  startHour: number;
  /** Duration in hours (can be fractional) */
  duration: number;
  /** Color for EventCard bottom bar */
  color?: EventCardColor;
  avatars?: string[];
  overflowCount?: number;
}

const HOURS = [9, 10, 11, 12, 13, 14]; // 09:00 – 14:00

export function SmallDailyCalendar({
  title = "Daily Activity",
  subtitle = "Text Here",
  color = "purple",
  events = [],
  /** Hour position of the "now" red line (e.g. 12.5 = 12:30). Set to 0 or omit to hide. */
  nowHour = 0,
  onMenuClick,
  className,
}: {
  title?: string;
  subtitle?: string;
  color?: AccentColor;
  events?: DailyEvent[];
  nowHour?: number;
  onMenuClick?: () => void;
  className?: string;
}) {
  const gridStart = HOURS[0];
  const gridEnd = HOURS[HOURS.length - 1] + 1; // one past last label
  const totalSlots = gridEnd - gridStart;

  function toPercent(hour: number) {
    return ((hour - gridStart) / totalSlots) * 100;
  }

  return (
    <div className={cn("w-[420px] bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col overflow-hidden", className)}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-start gap-3">
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-fg-black text-lg font-semibold leading-7 tracking-fg">{title}</span>
          <span className="text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">{subtitle}</span>
        </div>
        {onMenuClick && (
          <button onClick={onMenuClick} className="w-6 h-6 flex items-center justify-center cursor-pointer text-fg-grey-700">
            <MenuDotsBold size={16} className="rotate-90" />
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="px-6 pb-6">
        {/* Hour labels row */}
        <div className="flex items-center border-b border-fg-grey-200 pb-2 mb-2">
          {HOURS.map((h) => (
            <span key={h} className="flex-1 text-center text-xs text-fg-grey-700 font-medium">
              {String(h).padStart(2, "0")}:00
            </span>
          ))}
        </div>

        {/* Events area (relative container) */}
        <div className="relative" style={{ minHeight: events.length * 72 + 16 }}>
          {/* Vertical grid lines + now highlight zone */}
          <div className="absolute inset-0 flex pointer-events-none">
            {HOURS.map((h) => {
              const isNowSlot = nowHour > 0 && Math.floor(nowHour) === h;
              return (
                <div
                  key={h}
                  className={cn(
                    "flex-1 border-l border-fg-grey-100 first:border-l-0",
                    isNowSlot && "bg-rose-50",
                  )}
                />
              );
            })}
          </div>

          {/* Red "now" line within the highlight zone */}
          {nowHour > 0 && nowHour >= gridStart && nowHour <= gridEnd && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-fg-red z-20"
              style={{ left: `${toPercent(nowHour)}%` }}
            />
          )}

          {/* Event cards */}
          {events.map((event, i) => {
            const leftPct = toPercent(event.startHour);
            const widthPct = (event.duration / totalSlots) * 100;

            return (
              <div
                key={`${event.title}-${i}`}
                className="relative mb-2"
                style={{ marginLeft: `${leftPct}%`, width: `${widthPct}%` }}
              >
                <EventCard
                  title={event.title}
                  timeRange={event.timeRange}
                  color={event.color ?? "purple"}
                  avatars={event.avatars ?? []}
                  overflowCount={event.overflowCount}
                  className="w-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
