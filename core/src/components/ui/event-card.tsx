/* eslint-disable @next/next/no-img-element */
import { cn } from "../../lib/utils";
import { ClockCircleBoldDuotone } from "solar-icon-set";
import { type AccentColor } from "./accent-utils";
import { resolveCardWidthClass, type CardWidth } from "./card-utils";

// ============================================================
// EventCard — Figma "Event Card" (calendar.md)
// White card with title, time range, avatar group, and a colored
// bottom accent bar. Used in calendar month/week/day views.
// ============================================================

export type EventCardColor = AccentColor | "red" | "yellow" | "green" | "cyan" | "orange";

const barColors: Record<EventCardColor, string> = {
  purple: "bg-fg-violet",
  blue: "bg-fg-blue",
  black: "bg-fg-black",
  red: "bg-fg-red",
  yellow: "bg-fg-yellow",
  green: "bg-fg-green-500",
  cyan: "bg-fg-cyan-500",
  orange: "bg-fg-red",
};

const chipBg: Record<EventCardColor, string> = {
  purple: "bg-fg-violet-100 text-fg-violet",
  blue: "bg-fg-blue-50 text-fg-blue",
  black: "bg-fg-grey-200 text-fg-black",
  red: "bg-fg-red-100 text-fg-red",
  yellow: "bg-fg-yellow-100 text-fg-yellow",
  green: "bg-fg-green-50 text-fg-green-600",
  cyan: "bg-fg-cyan-50 text-fg-cyan-600",
  orange: "bg-fg-red-50 text-fg-red-600",
};

export function EventCard({
  title,
  timeRange,
  color = "purple",
  avatars = [],
  overflowCount,
  width,
  className,
}: {
  title: string;
  /** e.g. "10:00-11:00" */
  timeRange?: string;
  color?: EventCardColor;
  avatars?: string[];
  /** Number to show in "+N" overflow chip. If omitted, no chip is shown. */
  overflowCount?: number;
  /** Use full to fill calendar/list columns. Use fixed only for compact standalone showcases. */
  width?: CardWidth;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex-col overflow-hidden",
        resolveCardWidthClass(width, "w-72"),
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
