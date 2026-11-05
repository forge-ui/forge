import type { ComponentProps } from "react";
import { EventCard, FullCalendar, Panel, type PanelProps } from "@forge-ui-official/core";

export type ScheduleCardProps = Omit<PanelProps, "children"> & {
  children?: PanelProps["children"];
  calendar?: ComponentProps<typeof FullCalendar>;
};

export function ScheduleCard({ children, calendar, ...panel }: ScheduleCardProps) {
  return <Panel {...panel}>{children ?? (calendar && <FullCalendar {...calendar} />)}</Panel>;
}

export interface GanttScheduleProps {
  hours: [string, string, string, string, string, string];
  entries: { id: string; columnClassName: string; event: ComponentProps<typeof EventCard> }[];
}

export function GanttSchedule({ hours, entries }: GanttScheduleProps) {
  return <>
    <div className="grid grid-cols-6 text-xs text-fg-grey-500 border-b border-fg-grey-200 pb-2">
      {hours.map(hour => <div key={hour}>{hour}</div>)}
    </div>
    <div className="relative flex flex-col gap-2 pt-2 min-h-52">
      <div className="absolute inset-0 grid grid-cols-6 pointer-events-none">
        {Array.from({ length: 6 }).map((_, index) => <div key={index} className="border-l border-fg-grey-100" />)}
      </div>
      {entries.map(entry => <div key={entry.id} className="grid grid-cols-6 gap-1"><div className={entry.columnClassName}><EventCard {...entry.event} /></div></div>)}
    </div>
  </>;
}
