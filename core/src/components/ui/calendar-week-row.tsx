import { EventTag, type EventTagColor } from "./event-tag";

export function CalendarWeekRow({
  time,
  events = [],
  className = "",
}: {
  time: string;
  events?: { label: string; color: EventTagColor; span?: number }[];
  className?: string;
}) {
  return (
    <div
      className={`flex items-start border-b border-fg-grey-100 min-h-[48px] ${className}`}
    >
      {/* Time label */}
      <div className="w-16 text-xs text-fg-grey-700 text-right pr-2 pt-2 shrink-0">
        {time}
      </div>

      {/* Events area */}
      <div className="flex-1 flex items-start gap-1 p-1 border-l border-fg-grey-200">
        {events.map((event, index) => (
          <EventTag
            key={index}
            label={event.label}
            color={event.color}
            size="sm"
            variant="solid"
            className={event.span ? `col-span-${event.span}` : ""}
          />
        ))}
      </div>
    </div>
  );
}
