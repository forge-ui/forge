"use client";

import {
  Avatar,
  Button,
  EventTag,
  EventCard,
  CalendarDayCell,
  SmallCalendar,
  SmallDailyCalendar,
  FullCalendar,
} from "@forge-ui-official/core";
import type { EventTagColor, CalendarEvent } from "@forge-ui-official/core";
import { PageHeading, BareSection, BarLabel, LabeledRow } from "../_shared";

// ============================================================
// /cases/calendar — Calendar component showcase
// Covers: EventTag, EventCard, CalendarDayCell, SmallCalendar,
// SmallDailyCalendar. Matches Figma "Event" + "Small Calendar"
// + "Small Daily Calendar" pages.
// ============================================================

const TAG_COLORS: EventTagColor[] = ["purple", "blue"];
const ACCENT_COLORS = ["purple", "blue", "black"] as const;

const sampleAvatars = [
  "https://i.pravatar.cc/48?u=c1",
  "https://i.pravatar.cc/48?u=c2",
  "https://i.pravatar.cc/48?u=c3",
];

const sampleCalendarEvents = [
  { day: 4, title: "产品设计晨会", timeRange: "10:00-11:00", color: "purple" as const, avatars: sampleAvatars, overflowCount: 6 },
  { day: 4, title: "设计进度沟通", timeRange: "13:00-14:00", color: "blue" as const, avatars: sampleAvatars },
  { day: 11, title: "迭代评审", timeRange: "09:00-10:00", color: "green" as const, avatars: sampleAvatars },
  { day: 17, title: "一对一沟通", timeRange: "15:00-15:30", color: "red" as const, avatars: sampleAvatars },
  { day: 18, title: "团队站会", timeRange: "09:00-09:15", color: "yellow" as const },
  { day: 25, title: "迭代复盘", timeRange: "16:00-17:00", color: "cyan" as const, avatars: sampleAvatars },
];

const sampleDailyEvents = [
  { title: "产品设计晨会", timeRange: "10:00-11:00", startHour: 10, duration: 1, color: "purple" as const, avatars: sampleAvatars, overflowCount: 6 },
  { title: "每日例会", timeRange: "11:00", startHour: 9, duration: 2, color: "yellow" as const, avatars: sampleAvatars, overflowCount: 6 },
  { title: "产品设计晨会", timeRange: "10:00-11:00", startHour: 12, duration: 2, color: "green" as const, avatars: sampleAvatars, overflowCount: 6 },
  { title: "产品设计晨会", timeRange: "10:00-11:00", startHour: 11, duration: 3, color: "red" as const, avatars: sampleAvatars, overflowCount: 6 },
];

const weekDayEvents: CalendarEvent[] = [
  { day: 13, label: "项目会议", color: "green", avatar: "https://i.pravatar.cc/24?u=w1", hour: 6 },
  { day: 14, label: "项目会议", color: "yellow", avatar: "https://i.pravatar.cc/24?u=w2", hour: 7 },
  { day: 14, label: "项目会议", color: "red", avatar: "https://i.pravatar.cc/24?u=w3", hour: 8 },
  { day: 15, label: "项目会议", color: "green", avatar: "https://i.pravatar.cc/24?u=w4", hour: 10 },
  { day: 15, label: "项目会议", color: "green", avatar: "https://i.pravatar.cc/24?u=w5", hour: 10 },
  { day: 16, label: "项目会议", color: "red", avatar: "https://i.pravatar.cc/24?u=w6", hour: 12 },
  { day: 17, label: "项目会议", color: "yellow", avatar: "https://i.pravatar.cc/24?u=w7", hour: 14 },
];

const dayEvents: CalendarEvent[] = [
  { day: 17, label: "项目会议", color: "purple", avatar: "https://i.pravatar.cc/24?u=d1", hour: 6 },
  { day: 17, label: "项目会议", color: "orange", avatar: "https://i.pravatar.cc/24?u=d2", hour: 7 },
  { day: 17, label: "项目会议", color: "red", avatar: "https://i.pravatar.cc/24?u=d3", hour: 7 },
  { day: 17, label: "项目会议", color: "purple", avatar: "https://i.pravatar.cc/24?u=d4", hour: 8 },
  { day: 17, label: "项目会议", color: "green", avatar: "https://i.pravatar.cc/24?u=d5", hour: 10 },
  { day: 17, label: "项目会议", color: "red", avatar: "https://i.pravatar.cc/24?u=d6", hour: 10 },
  { day: 17, label: "项目会议", color: "yellow", avatar: "https://i.pravatar.cc/24?u=d7", hour: 13 },
  { day: 17, label: "项目会议", color: "purple", avatar: "https://i.pravatar.cc/24?u=d8", hour: 14 },
];

const detailContent = (
  <div className="px-4 pb-4 flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-sm bg-fg-violet" />
      <span className="text-fg-black text-sm font-semibold">每周例会</span>
    </div>
    <span className="text-fg-grey-700 text-[10px]">5 月 28 日 周一 · 08:00–09:00</span>
    <div className="flex flex-col gap-1">
      <span className="text-fg-grey-700 text-[10px] font-semibold">简介</span>
      <p className="text-fg-grey-700 text-[10px] leading-3.5">同步本周目标与项目进度，集中讨论待解决的问题，并明确下一步负责人和交付时间。</p>
    </div>
    <span className="text-fg-grey-700 text-[10px]">https://www.meeting.com/qodp-opaeje-wght</span>
    <Button color="purple" size="sm" className="self-start">加入会议</Button>
    <div className="flex flex-col gap-1.5">
      <span className="text-fg-grey-700 text-[10px] font-semibold">5 位参与者</span>
      <span className="text-fg-grey-700 text-[9px]">2 位待确认</span>
      {["周宁", "陈悦", "王晨", "李敏", "张帆"].map((n) => (
        <div key={n} className="flex items-center gap-2">
          <Avatar src={`https://i.pravatar.cc/20?u=${n}`} size="xs" />
          <span className="text-[10px] text-fg-black">{n}</span>
        </div>
      ))}
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-fg-grey-700 text-[10px] font-semibold">附件</span>
      <span className="text-fg-grey-700 text-[9px]">2 个文件</span>
      <div className="flex gap-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-fg-grey-50 rounded-lg">
          <span className="text-[9px] text-fg-black font-medium">会议纪要.doc</span>
          <span className="text-[8px] text-fg-grey-700">300 KB</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-fg-grey-50 rounded-lg">
          <span className="text-[9px] text-fg-black font-medium">会议纪要.doc</span>
          <span className="text-[8px] text-fg-grey-700">300 KB</span>
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-fg-grey-700 text-[10px] font-semibold">用户名</span>
      <span className="text-[9px] text-fg-grey-700">创建者：jayhargudson@mail.com</span>
    </div>
  </div>
);

const fullCalendarEvents: CalendarEvent[] = [
  { day: 2, label: "项目会议", color: "purple", avatar: "https://i.pravatar.cc/24?u=fc1" },
  { day: 2, label: "项目会议", color: "green", avatar: "https://i.pravatar.cc/24?u=fc2" },
  { day: 2, label: "项目会议", color: "red", avatar: "https://i.pravatar.cc/24?u=fc3" },
  { day: 5, label: "项目会议", color: "blue", avatar: "https://i.pravatar.cc/24?u=fc4" },
  { day: 10, label: "项目会议", color: "yellow", avatar: "https://i.pravatar.cc/24?u=fc5" },
  { day: 10, label: "项目会议", color: "cyan", avatar: "https://i.pravatar.cc/24?u=fc6" },
  { day: 15, label: "项目会议", color: "orange", avatar: "https://i.pravatar.cc/24?u=fc7" },
  { day: 15, label: "项目会议", color: "purple", avatar: "https://i.pravatar.cc/24?u=fc8" },
  { day: 15, label: "项目会议", color: "red", avatar: "https://i.pravatar.cc/24?u=fc9" },
  { day: 20, label: "项目会议", color: "green", avatar: "https://i.pravatar.cc/24?u=fc10" },
  { day: 22, label: "项目会议", color: "blue", avatar: "https://i.pravatar.cc/24?u=fc11" },
  { day: 28, label: "项目会议", color: "purple", avatar: "https://i.pravatar.cc/24?u=fc12" },
];

export default function CalendarCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="日历与日程"
        hint="选择日期、浏览日程，并在月、周、日视图中查看事件。"
      />

      {/* ─── EventTag ─── */}
      <BareSection title="EventTag">
        <BarLabel>实心样式（主题色）</BarLabel>
        <LabeledRow label="md" grey>
          {TAG_COLORS.map((c) => (
            <EventTag key={c} label="项目会议" color={c} variant="solid" size="md" />
          ))}
        </LabeledRow>
        <LabeledRow label="sm" grey>
          {TAG_COLORS.map((c) => (
            <EventTag key={c} label="项目会议" color={c} variant="solid" size="sm" />
          ))}
        </LabeledRow>

        <BarLabel>实心样式与头像</BarLabel>
        <LabeledRow label="md" grey>
          {TAG_COLORS.map((c, i) => (
            <EventTag key={c} label="项目会议" color={c} variant="solid" size="md" avatar={`https://i.pravatar.cc/24?u=t${i}`} />
          ))}
        </LabeledRow>

        <BarLabel>描边样式（主题色）</BarLabel>
        <LabeledRow label="md" grey>
          {TAG_COLORS.map((c) => (
            <EventTag key={c} label="项目会议" color={c} variant="outline" size="md" />
          ))}
        </LabeledRow>
      </BareSection>

      {/* ─── CalendarDayCell ─── */}
      <BareSection title="CalendarDayCell">
        <BarLabel>月历单元格（不同事件数量）</BarLabel>
        {/* Row 1: 2 events + 3 More */}
        <LabeledRow label="overflow" grey>
          <CalendarDayCell day={31} isOtherMonth events={[
            { label: "项目会议", color: "purple", avatar: "https://i.pravatar.cc/24?u=e1" },
            { label: "项目会议", color: "green", avatar: "https://i.pravatar.cc/24?u=e2" },
            { label: "项目会议", color: "red", avatar: "https://i.pravatar.cc/24?u=e3" },
            { label: "项目会议", color: "yellow", avatar: "https://i.pravatar.cc/24?u=e4" },
            { label: "项目会议", color: "blue", avatar: "https://i.pravatar.cc/24?u=e5" },
          ]} maxVisible={2} moreAvatar="https://i.pravatar.cc/24?u=e1" />
          <CalendarDayCell day={1} events={[
            { label: "项目会议", color: "blue", avatar: "https://i.pravatar.cc/24?u=e6" },
            { label: "项目会议", color: "blue", avatar: "https://i.pravatar.cc/24?u=e7" },
            { label: "项目会议", color: "blue", avatar: "https://i.pravatar.cc/24?u=e8" },
            { label: "项目会议", color: "blue", avatar: "https://i.pravatar.cc/24?u=e9" },
            { label: "项目会议", color: "blue", avatar: "https://i.pravatar.cc/24?u=e10" },
          ]} maxVisible={2} moreAvatar="https://i.pravatar.cc/24?u=e6" />
          <CalendarDayCell day={2} isToday events={[
            { label: "项目会议", color: "green", avatar: "https://i.pravatar.cc/24?u=e11" },
            { label: "项目会议", color: "green", avatar: "https://i.pravatar.cc/24?u=e12" },
            { label: "项目会议", color: "green", avatar: "https://i.pravatar.cc/24?u=e13" },
            { label: "项目会议", color: "green", avatar: "https://i.pravatar.cc/24?u=e14" },
            { label: "项目会议", color: "green", avatar: "https://i.pravatar.cc/24?u=e15" },
          ]} maxVisible={2} moreAvatar="https://i.pravatar.cc/24?u=e11" />
        </LabeledRow>
        {/* Row 2: 3 events, no overflow */}

        {/* Row 3: 2 events */}

        {/* Row 4: 1 event */}

        {/* Row 5: empty */}
        <LabeledRow label="empty" grey>
          <CalendarDayCell day={31} isOtherMonth />
          <CalendarDayCell day={1} />
          <CalendarDayCell day={2} isToday />
        </LabeledRow>
      </BareSection>

      {/* ─── EventCard ─── */}
      <BareSection title="EventCard">
        <BarLabel>底部色条样式</BarLabel>
        <LabeledRow label="colors" grey>
          {TAG_COLORS.map((c) => (
            <EventCard
              key={c}
              title="设计进度沟通"
              timeRange="10:00-11:00"
              color={c}
              avatars={sampleAvatars}
              overflowCount={6}
            />
          ))}
        </LabeledRow>
      </BareSection>

      {/* ─── SmallCalendar ─── */}
      <BareSection title="SmallCalendar">
        <BarLabel>3 种主题色</BarLabel>
        <LabeledRow label="colors" grey>
          {ACCENT_COLORS.map((c) => (
            <SmallCalendar
              key={c}
              color={c}
              events={sampleCalendarEvents}
              onMenuClick={() => {}}
            />
          ))}
        </LabeledRow>
      </BareSection>

      {/* ─── SmallDailyCalendar ─── */}
      <BareSection title="SmallDailyCalendar">
        <BarLabel>3 种主题色</BarLabel>
        <LabeledRow label="colors" grey>
          {ACCENT_COLORS.map((c) => (
            <SmallDailyCalendar
              key={c}
              color={c}
              events={sampleDailyEvents}
              nowHour={12.5}
              onMenuClick={() => {}}
            />
          ))}
        </LabeledRow>
      </BareSection>

      {/* ─── FullCalendar — 6 variants ─── */}
      <BareSection title="FullCalendar">
        <BarLabel>月视图</BarLabel>
        <FullCalendar view="month" color="purple" events={fullCalendarEvents} />

        <BarLabel>周视图</BarLabel>
        <FullCalendar view="week" color="purple" events={weekDayEvents} />

        <BarLabel>日视图</BarLabel>
        <FullCalendar view="day" color="purple" day={17} events={dayEvents} />

        <BarLabel>月视图与事件详情</BarLabel>
        <FullCalendar view="month" color="purple" events={fullCalendarEvents} detailPanel={detailContent} />

        <BarLabel>周视图与事件详情</BarLabel>
        <FullCalendar view="week" color="purple" events={weekDayEvents} detailPanel={detailContent} />

        <BarLabel>日视图与事件详情</BarLabel>
        <FullCalendar view="day" color="purple" day={17} events={dayEvents} detailPanel={detailContent} />
      </BareSection>
    </div>
  );
}
