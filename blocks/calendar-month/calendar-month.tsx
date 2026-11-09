"use client";

import { useState } from "react";
import { Avatar, Button, FullCalendar, Modal, SurfaceCard, cn, type CalendarEvent } from "@forge-ui-official/core";
import { CalendarMinimalisticLinear, ClockCircleLinear, MapPointBoldDuotone, UsersGroupRoundedLinear } from "@forge-ui-official/core/icons";

export interface ScheduleEvent extends CalendarEvent {
  id: string;
  title: string;
  time: string;
  place: string;
  attendees: { name: string; avatar: string }[];
}

const people = {
  zhang: { name: "张宁", avatar: "/images/team/edward-allen.png" },
  lin: { name: "林悦", avatar: "/images/blocks/people/lin-yue.jpg" },
  chen: { name: "陈思远", avatar: "/images/blocks/people/chen-siyuan.jpg" },
  xu: { name: "许知夏", avatar: "/images/blocks/people/xu-zhixia.jpg" },
  zhou: { name: "周予安", avatar: "/images/blocks/people/zhou-yuan.jpg" },
};

export const defaultScheduleEvents: ScheduleEvent[] = [
  { id: "e1", day: 3, hour: 9, label: "周会", title: "交付周会", time: "09:00–10:00", place: "3 号会议室", color: "blue", avatar: people.zhang.avatar, attendees: [people.zhang, people.lin, people.chen] },
  { id: "e2", day: 4, hour: 14, label: "联调", title: "订单与客户模块联调", time: "14:00–16:00", place: "线上会议", color: "purple", avatar: people.chen.avatar, attendees: [people.chen, people.zhou] },
  { id: "e3", day: 6, hour: 10, label: "评审", title: "高保真设计评审", time: "10:00–11:30", place: "设计中心", color: "yellow", avatar: people.lin.avatar, attendees: [people.lin, people.zhang, people.xu] },
  { id: "e4", day: 11, hour: 9, label: "客户", title: "知意教育方案汇报", time: "09:30–11:00", place: "客户现场", color: "red", avatar: people.zhang.avatar, attendees: [people.zhang, people.zhou] },
  { id: "e5", day: 12, hour: 15, label: "验收", title: "全流程验收", time: "15:00–17:00", place: "3 号会议室", color: "green", avatar: people.xu.avatar, attendees: [people.xu, people.chen, people.lin] },
  { id: "e6", day: 18, hour: 10, label: "复盘", title: "第二阶段复盘", time: "10:00–11:00", place: "线上会议", color: "blue", avatar: people.zhang.avatar, attendees: [people.zhang, people.lin, people.chen, people.xu] },
  { id: "e7", day: 25, hour: 13, label: "培训", title: "客户上线培训", time: "13:30–15:00", place: "客户现场", color: "purple", avatar: people.zhou.avatar, attendees: [people.zhou, people.xu] },
];

const dotColor: Record<ScheduleEvent["color"], string> = { blue: "bg-fg-blue", purple: "bg-fg-violet", yellow: "bg-fg-yellow-500", red: "bg-fg-red", green: "bg-fg-green-500", black: "bg-fg-black", cyan: "bg-fg-cyan-500", orange: "bg-fg-red" };

export interface CalendarMonthProps {
  events?: ScheduleEvent[];
  year?: number;
  month?: number;
  day?: number;
  onCreate?: () => void;
  className?: string;
}

export function CalendarMonth({ events = defaultScheduleEvents, year = 2026, month = 10, day = 9, onCreate, className }: CalendarMonthProps) {
  const [selected, setSelected] = useState<ScheduleEvent | null>(null);
  const upcoming = [...events].sort((left, right) => left.day - right.day || (left.hour ?? 0) - (right.hour ?? 0)).filter(event => event.day >= day).slice(0, 4);

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]", className)}>
    <div className="min-w-0 fg-scrollbar-hidden overflow-x-auto"><FullCalendar view="month" color="blue" year={year} month={month} day={day} events={events} className="min-w-[640px]" /></div>
    <SurfaceCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-semibold text-fg-black">近期日程</h3><Button size="sm" onClick={onCreate}>新建日程</Button></div>
      <ul className="flex flex-col gap-3">{upcoming.map(event => <li key={event.id}><Button variant="unstyled" type="button" className="flex w-full items-start gap-3 rounded-xl border border-fg-grey-200 p-3 text-left transition-colors hover:bg-fg-grey-50" onClick={() => setSelected(event)}>
        <span className={cn("mt-1 size-2.5 shrink-0 rounded-full", dotColor[event.color])} />
        <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-fg-black">{event.title}</span><span className="mt-1 block text-xs text-fg-grey-700">{month + 1} 月 {event.day} 日 · {event.time}</span></span>
      </Button></li>)}</ul>
    </SurfaceCard>
    <Modal open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }} title={selected?.title ?? "日程详情"}>
      {selected && <dl className="flex flex-col gap-4 text-sm">
        <div className="flex items-center gap-3"><dt className="text-fg-grey-700"><CalendarMinimalisticLinear size={18} /></dt><dd className="text-fg-black">{year} 年 {month + 1} 月 {selected.day} 日</dd></div>
        <div className="flex items-center gap-3"><dt className="text-fg-grey-700"><ClockCircleLinear size={18} /></dt><dd className="text-fg-black">{selected.time}</dd></div>
        <div className="flex items-center gap-3"><dt className="text-fg-grey-700"><MapPointBoldDuotone size={18} /></dt><dd className="text-fg-black">{selected.place}</dd></div>
        <div className="flex items-start gap-3"><dt className="pt-1 text-fg-grey-700"><UsersGroupRoundedLinear size={18} /></dt><dd className="flex flex-wrap gap-3">{selected.attendees.map(person => <span key={person.name} className="flex items-center gap-2"><Avatar src={person.avatar} alt={person.name} size="sm" />{person.name}</span>)}</dd></div>
      </dl>}
    </Modal>
  </div>;
}
