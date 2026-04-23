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
} from "@forge-ui/react";
import type { EventTagColor, CalendarEvent } from "@forge-ui/react";
import { PageHeading, BareSection, BarLabel, LabeledRow } from "../_shared";

// ============================================================
// /cases/calendar — Calendar component showcase
// Covers: EventTag, EventCard, CalendarDayCell, SmallCalendar,
// SmallDailyCalendar. Matches Figma "Event" + "Small Calendar"
// + "Small Daily Calendar" pages.
// ============================================================

const TAG_COLORS: EventTagColor[] = ["purple", "green", "red", "yellow", "blue", "cyan", "orange"];
const ACCENT_COLORS = ["purple", "blue", "black"] as const;

const sampleAvatars = [
  "https://i.pravatar.cc/48?u=c1",
  "https://i.pravatar.cc/48?u=c2",
  "https://i.pravatar.cc/48?u=c3",
];

const sampleCalendarEvents = [
  { day: 4, title: "UI/UX Daily Meet", timeRange: "10:00-11:00", color: "purple" as const, avatars: sampleAvatars, overflowCount: 6 },
  { day: 4, title: "Design Check-In", timeRange: "13:00-14:00", color: "blue" as const, avatars: sampleAvatars },
  { day: 11, title: "Sprint Review", timeRange: "09:00-10:00", color: "green" as const, avatars: sampleAvatars },
  { day: 17, title: "1:1 Meeting", timeRange: "15:00-15:30", color: "red" as const, avatars: sampleAvatars },
  { day: 18, title: "Team Standup", timeRange: "09:00-09:15", color: "yellow" as const },
  { day: 25, title: "Retro", timeRange: "16:00-17:00", color: "cyan" as const, avatars: sampleAvatars },
];

const sampleDailyEvents = [
  { title: "UI/UX Daily Meet", timeRange: "10:00-11:00", startHour: 10, duration: 1, color: "purple" as const, avatars: sampleAvatars, overflowCount: 6 },
  { title: "Daily Meet", timeRange: "11:00", startHour: 9, duration: 2, color: "yellow" as const, avatars: sampleAvatars, overflowCount: 6 },
  { title: "UI/UX Daily Meet", timeRange: "10:00-11:00", startHour: 12, duration: 2, color: "green" as const, avatars: sampleAvatars, overflowCount: 6 },
  { title: "UI/UX Daily Meet", timeRange: "10:00-11:00", startHour: 11, duration: 3, color: "red" as const, avatars: sampleAvatars, overflowCount: 6 },
];

const weekDayEvents: CalendarEvent[] = [
  { day: 13, label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=w1", hour: 6 },
  { day: 14, label: "Meeting Title", color: "yellow", avatar: "https://i.pravatar.cc/24?u=w2", hour: 7 },
  { day: 14, label: "Meeting Title", color: "red", avatar: "https://i.pravatar.cc/24?u=w3", hour: 8 },
  { day: 15, label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=w4", hour: 10 },
  { day: 15, label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=w5", hour: 10 },
  { day: 16, label: "Meeting Title", color: "red", avatar: "https://i.pravatar.cc/24?u=w6", hour: 12 },
  { day: 17, label: "Meeting Title", color: "yellow", avatar: "https://i.pravatar.cc/24?u=w7", hour: 14 },
];

const dayEvents: CalendarEvent[] = [
  { day: 17, label: "Meeting Title", color: "purple", avatar: "https://i.pravatar.cc/24?u=d1", hour: 6 },
  { day: 17, label: "Meeting Title", color: "orange", avatar: "https://i.pravatar.cc/24?u=d2", hour: 7 },
  { day: 17, label: "Meeting Title", color: "red", avatar: "https://i.pravatar.cc/24?u=d3", hour: 7 },
  { day: 17, label: "Meeting Title", color: "purple", avatar: "https://i.pravatar.cc/24?u=d4", hour: 8 },
  { day: 17, label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=d5", hour: 10 },
  { day: 17, label: "Meeting Title", color: "red", avatar: "https://i.pravatar.cc/24?u=d6", hour: 10 },
  { day: 17, label: "Meeting Title", color: "yellow", avatar: "https://i.pravatar.cc/24?u=d7", hour: 13 },
  { day: 17, label: "Meeting Title", color: "purple", avatar: "https://i.pravatar.cc/24?u=d8", hour: 14 },
];

const detailContent = (
  <div className="px-4 pb-4 flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-sm bg-fg-violet" />
      <span className="text-fg-black text-sm font-semibold">Weekly Meeting</span>
    </div>
    <span className="text-fg-grey-700 text-[10px]">Monday, 28 May · 08:00 - 09:00 AM</span>
    <div className="flex flex-col gap-1">
      <span className="text-fg-grey-700 text-[10px] font-semibold">About</span>
      <p className="text-fg-grey-700 text-[10px] leading-3.5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut vulputate lacus, tempor dictum augue. Donec lectus dui.</p>
    </div>
    <span className="text-fg-grey-700 text-[10px]">https://www.meeting.com/qodp-opaeje-wght</span>
    <Button color="purple" size="sm" className="self-start">Join Meeting</Button>
    <div className="flex flex-col gap-1.5">
      <span className="text-fg-grey-700 text-[10px] font-semibold">5 guest</span>
      <span className="text-fg-grey-700 text-[9px]">2 awaiting</span>
      {["Jay Hargudson", "Peg Legge", "Jack Temporari", "Rita Book", "Lucas Graham"].map((n) => (
        <div key={n} className="flex items-center gap-2">
          <Avatar src={`https://i.pravatar.cc/20?u=${n}`} size="xs" />
          <span className="text-[10px] text-fg-black">{n}</span>
        </div>
      ))}
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-fg-grey-700 text-[10px] font-semibold">Attachment</span>
      <span className="text-fg-grey-700 text-[9px]">2 Files</span>
      <div className="flex gap-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-fg-grey-50 rounded-lg">
          <span className="text-[9px] text-fg-black font-medium">File Name.doc</span>
          <span className="text-[8px] text-fg-grey-700">300 KB</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-fg-grey-50 rounded-lg">
          <span className="text-[9px] text-fg-black font-medium">File Name.doc</span>
          <span className="text-[8px] text-fg-grey-700">300 KB</span>
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="text-fg-grey-700 text-[10px] font-semibold">Username</span>
      <span className="text-[9px] text-fg-grey-700">Created by jayhargudson@mail.com</span>
    </div>
  </div>
);

const fullCalendarEvents: CalendarEvent[] = [
  { day: 2, label: "Meeting Title", color: "purple", avatar: "https://i.pravatar.cc/24?u=fc1" },
  { day: 2, label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=fc2" },
  { day: 2, label: "Meeting Title", color: "red", avatar: "https://i.pravatar.cc/24?u=fc3" },
  { day: 5, label: "Meeting Title", color: "blue", avatar: "https://i.pravatar.cc/24?u=fc4" },
  { day: 10, label: "Meeting Title", color: "yellow", avatar: "https://i.pravatar.cc/24?u=fc5" },
  { day: 10, label: "Meeting Title", color: "cyan", avatar: "https://i.pravatar.cc/24?u=fc6" },
  { day: 15, label: "Meeting Title", color: "orange", avatar: "https://i.pravatar.cc/24?u=fc7" },
  { day: 15, label: "Meeting Title", color: "purple", avatar: "https://i.pravatar.cc/24?u=fc8" },
  { day: 15, label: "Meeting Title", color: "red", avatar: "https://i.pravatar.cc/24?u=fc9" },
  { day: 20, label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=fc10" },
  { day: 22, label: "Meeting Title", color: "blue", avatar: "https://i.pravatar.cc/24?u=fc11" },
  { day: 28, label: "Meeting Title", color: "purple", avatar: "https://i.pravatar.cc/24?u=fc12" },
];

export default function CalendarCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Calendar"
        hint="EventTag · CalendarDayCell · EventCard · SmallCalendar · SmallDailyCalendar · FullCalendar"
      />

      {/* ─── EventTag ─── */}
      <BareSection title="EventTag">
        <BarLabel>Solid (7 colors)</BarLabel>
        <LabeledRow label="md" grey>
          {TAG_COLORS.map((c) => (
            <EventTag key={c} label="Meeting Title" color={c} variant="solid" size="md" />
          ))}
        </LabeledRow>
        <LabeledRow label="sm" grey>
          {TAG_COLORS.map((c) => (
            <EventTag key={c} label="Meeting Title" color={c} variant="solid" size="sm" />
          ))}
        </LabeledRow>

        <BarLabel>Solid with avatar</BarLabel>
        <LabeledRow label="md" grey>
          {TAG_COLORS.map((c, i) => (
            <EventTag key={c} label="Meeting Title" color={c} variant="solid" size="md" avatar={`https://i.pravatar.cc/24?u=t${i}`} />
          ))}
        </LabeledRow>

        <BarLabel>Outline (7 colors)</BarLabel>
        <LabeledRow label="md" grey>
          {TAG_COLORS.map((c) => (
            <EventTag key={c} label="Meeting Title" color={c} variant="outline" size="md" />
          ))}
        </LabeledRow>
      </BareSection>

      {/* ─── CalendarDayCell ─── */}
      <BareSection title="CalendarDayCell">
        <BarLabel>Month grid cells (5 rows × decreasing events)</BarLabel>
        {/* Row 1: 2 events + 3 More */}
        <LabeledRow label="overflow" grey>
          <CalendarDayCell day={31} isOtherMonth events={[
            { label: "Meeting Title", color: "purple", avatar: "https://i.pravatar.cc/24?u=e1" },
            { label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=e2" },
            { label: "Meeting Title", color: "red", avatar: "https://i.pravatar.cc/24?u=e3" },
            { label: "Meeting Title", color: "yellow", avatar: "https://i.pravatar.cc/24?u=e4" },
            { label: "Meeting Title", color: "blue", avatar: "https://i.pravatar.cc/24?u=e5" },
          ]} maxVisible={2} moreAvatar="https://i.pravatar.cc/24?u=e1" />
          <CalendarDayCell day={1} events={[
            { label: "Meeting Title", color: "blue", avatar: "https://i.pravatar.cc/24?u=e6" },
            { label: "Meeting Title", color: "blue", avatar: "https://i.pravatar.cc/24?u=e7" },
            { label: "Meeting Title", color: "blue", avatar: "https://i.pravatar.cc/24?u=e8" },
            { label: "Meeting Title", color: "blue", avatar: "https://i.pravatar.cc/24?u=e9" },
            { label: "Meeting Title", color: "blue", avatar: "https://i.pravatar.cc/24?u=e10" },
          ]} maxVisible={2} moreAvatar="https://i.pravatar.cc/24?u=e6" />
          <CalendarDayCell day={2} isToday events={[
            { label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=e11" },
            { label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=e12" },
            { label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=e13" },
            { label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=e14" },
            { label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=e15" },
          ]} maxVisible={2} moreAvatar="https://i.pravatar.cc/24?u=e11" />
        </LabeledRow>
        {/* Row 2: 3 events, no overflow */}
        <LabeledRow label="3 events" grey>
          <CalendarDayCell day={31} isOtherMonth events={[
            { label: "Meeting Title", color: "purple", avatar: "https://i.pravatar.cc/24?u=r1" },
            { label: "Meeting Title", color: "red", avatar: "https://i.pravatar.cc/24?u=r2" },
            { label: "Meeting Title", color: "orange", avatar: "https://i.pravatar.cc/24?u=r3" },
          ]} />
          <CalendarDayCell day={1} events={[
            { label: "Meeting Title", color: "blue", avatar: "https://i.pravatar.cc/24?u=r4" },
            { label: "Meeting Title", color: "blue", avatar: "https://i.pravatar.cc/24?u=r5" },
            { label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=r6" },
          ]} />
          <CalendarDayCell day={2} isToday events={[
            { label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=r7" },
            { label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=r8" },
            { label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=r9" },
          ]} />
        </LabeledRow>
        {/* Row 3: 2 events */}
        <LabeledRow label="2 events" grey>
          <CalendarDayCell day={31} isOtherMonth events={[
            { label: "Meeting Title", color: "purple", avatar: "https://i.pravatar.cc/24?u=s1" },
            { label: "Meeting Title", color: "green", avatar: "https://i.pravatar.cc/24?u=s2" },
          ]} />
          <CalendarDayCell day={1} events={[
            { label: "Meeting Title", color: "blue", avatar: "https://i.pravatar.cc/24?u=s3" },
            { label: "Meeting Title", color: "blue", avatar: "https://i.pravatar.cc/24?u=s4" },
          ]} />
          <CalendarDayCell day={2} isToday events={[
            { label: "Meeting Title", color: "cyan", avatar: "https://i.pravatar.cc/24?u=s5" },
            { label: "Meeting Title", color: "orange", avatar: "https://i.pravatar.cc/24?u=s6" },
          ]} />
        </LabeledRow>
        {/* Row 4: 1 event */}
        <LabeledRow label="1 event" grey>
          <CalendarDayCell day={31} isOtherMonth events={[
            { label: "Meeting Title", color: "purple", avatar: "https://i.pravatar.cc/24?u=t1" },
          ]} />
          <CalendarDayCell day={1} events={[
            { label: "Meeting Title", color: "blue", avatar: "https://i.pravatar.cc/24?u=t2" },
          ]} />
          <CalendarDayCell day={2} isToday events={[
            { label: "Meeting Title", color: "cyan", avatar: "https://i.pravatar.cc/24?u=t3" },
          ]} />
        </LabeledRow>
        {/* Row 5: empty */}
        <LabeledRow label="empty" grey>
          <CalendarDayCell day={31} isOtherMonth />
          <CalendarDayCell day={1} />
          <CalendarDayCell day={2} isToday />
        </LabeledRow>
      </BareSection>

      {/* ─── EventCard ─── */}
      <BareSection title="EventCard">
        <BarLabel>Bottom color bar variants</BarLabel>
        <LabeledRow label="colors" grey>
          {TAG_COLORS.map((c) => (
            <EventCard
              key={c}
              title="Design Check-In"
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
        <BarLabel>3 accent colors</BarLabel>
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
        <BarLabel>3 accent colors</BarLabel>
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
        <BarLabel>Month (plain)</BarLabel>
        <FullCalendar view="month" color="purple" events={fullCalendarEvents} />

        <BarLabel>Week (plain)</BarLabel>
        <FullCalendar view="week" color="purple" events={weekDayEvents} />

        <BarLabel>Day (plain)</BarLabel>
        <FullCalendar view="day" color="purple" day={17} events={dayEvents} />

        <BarLabel>Month (with detail)</BarLabel>
        <FullCalendar view="month" color="purple" events={fullCalendarEvents} detailPanel={detailContent} />

        <BarLabel>Week (with detail)</BarLabel>
        <FullCalendar view="week" color="purple" events={weekDayEvents} detailPanel={detailContent} />

        <BarLabel>Day (with detail)</BarLabel>
        <FullCalendar view="day" color="purple" day={17} events={dayEvents} detailPanel={detailContent} />
      </BareSection>
    </div>
  );
}
