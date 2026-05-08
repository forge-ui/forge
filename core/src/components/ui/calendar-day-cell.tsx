import { cn } from "../../lib/utils";
import { EventTag, type EventTagColor } from "./event-tag";

// ============================================================
// CalendarDayCell — Figma "Event > Month" grid cell
// Supports: isToday (accent circle), isSelected (light bg circle),
// isOtherMonth (diagonal stripe background), event tags with avatars,
// and "+N More..." overflow with avatar.
// ============================================================

export function CalendarDayCell({
  day,
  isToday = false,
  isSelected = false,
  isOtherMonth = false,
  events = [],
  maxVisible = 3,
  moreAvatar,
  onMoreClick,
  className,
}: {
  day: number;
  isToday?: boolean;
  isSelected?: boolean;
  isOtherMonth?: boolean;
  events?: { label: string; color: EventTagColor; avatar?: string }[];
  /** Max visible event tags before showing "+N More" (default 3) */
  maxVisible?: number;
  /** Avatar shown next to "+N More..." text */
  moreAvatar?: string;
  onMoreClick?: () => void;
  className?: string;
}) {
  const visibleEvents = events.slice(0, maxVisible);
  const overflowCount = events.length - maxVisible;

  return (
    <div
      className={cn(
        "min-h-36 p-2 border border-fg-grey-200 flex flex-col gap-1 relative overflow-hidden",
        className,
      )}
    >
      {/* Diagonal stripe background for other-month cells */}
      {isOtherMonth && (
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 6px, currentColor 6px, currentColor 7px)",
          }}
        />
      )}

      {/* Day number — centered at top */}
      <div className="flex justify-center relative z-10">
        <span
          className={cn(
            "w-8 h-8 text-sm inline-flex items-center justify-center rounded-full font-medium",
            isToday && "bg-accent text-white font-semibold",
            isSelected && !isToday && "bg-accent-soft text-accent font-semibold",
            !isToday && !isSelected && isOtherMonth && "text-fg-grey-500",
            !isToday && !isSelected && !isOtherMonth && "text-fg-black",
          )}
        >
          {day}
        </span>
      </div>

      {/* Events */}
      <div className="flex flex-col gap-1 relative z-10">
        {visibleEvents.map((event, index) => (
          <EventTag
            key={index}
            label={event.label}
            color={event.color}
            avatar={event.avatar}
            size="sm"
            variant="solid"
          />
        ))}
        {overflowCount > 0 && (
          <button
            onClick={onMoreClick}
            className="flex items-center gap-1 text-2xs text-fg-grey-700 font-medium text-left hover:underline cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {moreAvatar && <img src={moreAvatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />}
            {overflowCount} More. . .
          </button>
        )}
      </div>
    </div>
  );
}
