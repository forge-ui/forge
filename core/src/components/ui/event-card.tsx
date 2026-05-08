/* eslint-disable @next/next/no-img-element */
import { cn } from "../../lib/utils";
import { ClockCircleBoldDuotone } from "solar-icon-set";
import { type AccentColor } from "./accent-utils";

// ============================================================
// EventCard — Figma "Event Card" (calendar.md)
// White card with title, time range, avatar group, and a colored
// bottom accent bar. Used in calendar month/week/day views.
// ============================================================

export type EventCardColor = AccentColor | "red" | "yellow" | "green" | "cyan" | "orange";

const barColors: Record<EventCardColor, string> = {
  purple: "bg-fg-violet",
  blue: "bg-blue-600",
  black: "bg-fg-black",
  red: "bg-fg-red",
  yellow: "bg-fg-yellow",
  green: "bg-emerald-500",
  cyan: "bg-teal-400",
  orange: "bg-orange-500",
};

const chipBg: Record<EventCardColor, string> = {
  purple: "bg-purple-100 text-fg-violet",
  blue: "bg-indigo-50 text-blue-600",
  black: "bg-fg-grey-200 text-fg-black",
  red: "bg-rose-100 text-fg-red",
  yellow: "bg-yellow-100 text-fg-yellow",
  green: "bg-emerald-50 text-emerald-600",
  cyan: "bg-teal-50 text-teal-600",
  orange: "bg-orange-50 text-orange-600",
};

export function EventCard({
  title,
  timeRange,
  color = "purple",
  avatars = [],
  overflowCount,
  className,
}: {
  title: string;
  /** e.g. "10:00-11:00" */
  timeRange?: string;
  color?: EventCardColor;
  avatars?: string[];
  /** Number to show in "+N" overflow chip. If omitted, no chip is shown. */
  overflowCount?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-72 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col overflow-hidden",
        className,
      )}
    >
      <div className="self-stretch p-4 flex flex-col gap-1.5">
        <span className="text-fg-black text-sm font-semibold leading-5 tracking-fg truncate">
          {title}
        </span>
        <div className="self-stretch inline-flex justify-between items-end gap-2">
          {timeRange && (
            <div className="flex items-center gap-1 text-fg-grey-700">
              <ClockCircleBoldDuotone size={16} />
              <span className="text-xs font-medium leading-4 tracking-fg">
                {timeRange}
              </span>
            </div>
          )}
          {avatars.length > 0 && (
            <div className="flex -space-x-1 shrink-0">
              {avatars.slice(0, 3).map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt=""
                  className="w-6 h-6 rounded-full border border-white object-cover"
                />
              ))}
              {overflowCount && overflowCount > 0 && (
                <span
                  className={cn(
                    "w-6 h-6 rounded-full border border-white flex items-center justify-center text-[10px] font-semibold",
                    chipBg[color],
                  )}
                >
                  +{overflowCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={cn("self-stretch h-2", barColors[color])} />
    </div>
  );
}
