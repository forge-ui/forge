"use client";

import Link from "next/link";
import {
  EventTag,
  CalendarDayCell,
  EventCard,
  SmallCalendar,
  FullCalendar,
} from "@forge-ui/react";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import {
  EventTag, CalendarDayCell, EventCard,
  SmallCalendar, FullCalendar,
} from "@forge-ui/react";`;

const CODE_EVENTTAG_USAGE = `<EventTag label="Meeting Title" color="purple" />
<EventTag label="Review" color="green" variant="outline" />`;

const CODE_DAYCELL_USAGE = `<CalendarDayCell
  day={17}
  isToday
  events={[
    { label: "Standup", color: "purple", avatar },
    { label: "1:1", color: "blue", avatar },
  ]}
/>`;

const CODE_EVENTCARD_USAGE = `<EventCard
  title="Design Check-In"
  timeRange="10:00-11:00"
  color="purple"
  avatars={[a1, a2, a3]}
  overflowCount={6}
/>`;

const CODE_SMALL_USAGE = `<SmallCalendar
  title="Calendar"
  subtitle="Upcoming"
  color="purple"
  events={events}
/>`;

const CODE_FULL_USAGE = `<FullCalendar view="month" color="purple" events={events} />`;

const EVENTTAG_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "—", description: "事件文案。" },
  { attr: "color", type: "'purple' | 'green' | 'red' | 'yellow' | 'blue' | 'cyan' | 'orange'", defaultValue: "'purple'", description: "7 种事件色。" },
  { attr: "variant", type: "'solid' | 'outline'", defaultValue: "'solid'", description: "实底 / 描边。" },
  { attr: "size", type: "'sm' | 'md'", defaultValue: "'md'", description: "尺寸。" },
  { attr: "avatar", type: "string", defaultValue: "—", description: "文案前小头像 URL。" },
  { attr: "block", type: "boolean", defaultValue: "false", description: "块级 flex（填满父容器宽度）。" },
];

const DAYCELL_PROPS: ApiTableRow[] = [
  { attr: "day", type: "number", defaultValue: "—", description: "日期数字。" },
  { attr: "isToday / isSelected / isOtherMonth", type: "boolean", defaultValue: "false", description: "三个互斥态：今日圆点 / 选中浅底 / 非本月斜纹背景。" },
  { attr: "events", type: "{ label, color, avatar? }[]", defaultValue: "[]", description: "当日事件列表（EventTag 风格）。" },
  { attr: "maxVisible", type: "number", defaultValue: "3", description: "最多显示几个 tag 后折叠为 +N More。" },
  { attr: "moreAvatar", type: "string", defaultValue: "—", description: "+N More 行的头像。" },
];

const EVENTCARD_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "事件标题。" },
  { attr: "timeRange", type: "string", defaultValue: "—", description: "时间段文案（如 10:00-11:00）。" },
  { attr: "color", type: "purple | blue | black | red | yellow | green | cyan | orange", defaultValue: "'purple'", description: "底部强调条颜色（8 色）。" },
  { attr: "avatars", type: "string[]", defaultValue: "[]", description: "参与者头像 URL 数组。" },
  { attr: "overflowCount", type: "number", defaultValue: "—", description: "末尾 +N 数字。" },
];

const SMALL_PROPS: ApiTableRow[] = [
  { attr: "title / subtitle", type: "string", defaultValue: "'Calendar' / 'Text Here'", description: "卡片顶部文案。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "today 圆点与列表条的主色。" },
  { attr: "events", type: "SmallCalendarEvent[]", defaultValue: "[]", description: "事件数组，day / title / timeRange / color / avatars / overflowCount。" },
  { attr: "onMenuClick", type: "() => void", defaultValue: "—", description: "右上 menu 按钮回调。" },
];

const FULL_PROPS: ApiTableRow[] = [
  { attr: "view", type: "'month' | 'week' | 'day'", defaultValue: "'month'", description: "日历视图。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "today / header 主色。" },
  { attr: "year / month / day", type: "number", defaultValue: "today", description: "初始时间，后续由组件内部管理。" },
  { attr: "events", type: "CalendarEvent[]", defaultValue: "[]", description: "事件数组（day / label / color / avatar? / hour?）。" },
  { attr: "detailPanel", type: "ReactNode", defaultValue: "—", description: "右侧浮层详情，传了才显示。" },
  { attr: "onCloseDetail", type: "() => void", defaultValue: "—", description: "关闭浮层回调。" },
];

const avatars = [
  "https://i.pravatar.cc/40?img=1",
  "https://i.pravatar.cc/40?img=2",
  "https://i.pravatar.cc/40?img=3",
];

const smallEvents = [
  { day: 4, title: "UI Daily Meet", timeRange: "10:00-11:00", color: "purple" as const, avatars, overflowCount: 4 },
  { day: 11, title: "Sprint Review", timeRange: "09:00-10:00", color: "blue" as const, avatars },
];

const fullEvents = [
  { day: 2, label: "Meeting", color: "purple" as const, avatar: "https://i.pravatar.cc/24?u=1" },
  { day: 10, label: "Sprint", color: "green" as const, avatar: "https://i.pravatar.cc/24?u=2" },
  { day: 15, label: "Review", color: "red" as const, avatar: "https://i.pravatar.cc/24?u=3" },
  { day: 22, label: "1:1", color: "blue" as const, avatar: "https://i.pravatar.cc/24?u=4" },
];

export default function CalendarCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Calendar"
        hint="日历家族：EventTag / CalendarDayCell / EventCard / SmallCalendar / FullCalendar。"
      />

      <Section title="EventTag" description="日历事件标签。7 色 × 2 variant × 2 size。">
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_EVENTTAG_USAGE}>
            <EventTag label="Meeting Title" color="purple" />
            <EventTag label="Review" color="green" variant="outline" />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={EVENTTAG_PROPS} />
        </SubSection>
      </Section>

      <Section title="CalendarDayCell" description="月视图里的单元格。含今日 / 选中 / 非本月 三态 + 事件 tag 列表 + +N More。">
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>events</InlineCode> 数组超过 <InlineCode>maxVisible</InlineCode> 自动折叠为 +N。
          </p>
          <PreviewBlock code={CODE_DAYCELL_USAGE} minHeight={240}>
            <div className="w-40">
              <CalendarDayCell
                day={17}
                isToday
                events={[
                  { label: "Standup", color: "purple", avatar: avatars[0] },
                  { label: "1:1", color: "blue", avatar: avatars[1] },
                ]}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={DAYCELL_PROPS} />
        </SubSection>
      </Section>

      <Section title="EventCard" description="独立事件卡。标题 + 时间段 + 头像组 + 底部彩色强调条。8 色。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_EVENTCARD_USAGE} minHeight={200}>
            <EventCard
              title="Design Check-In"
              timeRange="10:00-11:00"
              color="purple"
              avatars={avatars}
              overflowCount={6}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={EVENTCARD_PROPS} />
        </SubSection>
      </Section>

      <Section title="SmallCalendar" description="紧凑月日历卡。月份导航 + 日期网格 + 选中日事件列表。3 主色。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_SMALL_USAGE} minHeight={480}>
            <SmallCalendar
              title="Calendar"
              subtitle="Upcoming"
              color="purple"
              events={smallEvents}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={SMALL_PROPS} />
        </SubSection>
      </Section>

      <Section title="FullCalendar" description="完整日历容器。3 view（month / week / day）× 3 色 × 可选 detail 浮层。">
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>view</InlineCode> 受控从外部驱动，下面展示 month 视图。其余见 cases。
          </p>
          <PreviewBlock code={CODE_FULL_USAGE} minHeight={600}>
            <div className="w-full">
              <FullCalendar view="month" color="purple" events={fullEvents} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={FULL_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/calendar" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
