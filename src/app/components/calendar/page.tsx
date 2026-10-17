"use client";

import { useState } from "react";
import {
  CalendarCard,
  EventTag,
  CalendarDayCell,
  EventCard,
  SmallCalendar,
  FullCalendar,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample, ExampleGrid } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import {
  CalendarCard, EventTag, CalendarDayCell, EventCard,
  SmallCalendar, FullCalendar,
} from "@forge-ui-official/core";`;

const CODE_CALENDAR_USAGE = `<CalendarCard value={date} onChange={setDate} />`;

const CALENDAR_PROPS: ApiTableRow[] = [
  { attr: "size", type: "'default' | 'compact'", defaultValue: "'default'", description: "compact 使用 14px 正文、24px 大日期；保留 32px 日期点击区域和六行月份空间。" },
  { attr: "variant", type: "'card' | 'plain'", defaultValue: "'card'", description: "plain 去掉卡片表面、边框、阴影和留白，宽度随父容器。" },
  { attr: "color", type: "ButtonColor", defaultValue: "'red'", description: "选中、今天、进度和焦点使用同一套主题色。" },
  { attr: "value / defaultDate", type: "日期", defaultValue: "客户端今天", description: "value 受控；defaultDate 是非受控的初始日期。服务端渲染不猜测用户时区。" },
  { attr: "onChange", type: "(date: Date) => void", defaultValue: "—", description: "返回本地日期。可翻到 1900–2100，翻月时落到当月有效日期。" },
  { attr: "locale / labels", type: "string / Partial<CalendarCardLabels>", defaultValue: "zh-CN / 中文按钮文案", description: "日期语言和导航按钮的可访问名称。" },
  { attr: "disabled / motion / className", type: "boolean / MotionPreference / string", defaultValue: "false / auto / ''", description: "auto 跟随系统的减少动效设置。" },
];

const CODE_EVENTTAG_USAGE = `<EventTag label="项目会议" color="purple" />
<EventTag label="评审" color="green" variant="outline" />`;

const CODE_DAYCELL_USAGE = `<CalendarDayCell
  day={17}
  isToday
  events={[
    { label: "站会", color: "purple", avatar },
    { label: "1:1", color: "blue", avatar },
  ]}
/>`;

const CODE_EVENTCARD_USAGE = `<EventCard
  title="设计进度沟通"
  timeRange="10:00-11:00"
  color="blue"
  avatars={[a1, a2, a3]}
  overflowCount={6}
/>`;

const CODE_SMALL_USAGE = `<SmallCalendar
  title="日历"
  subtitle="即将开始"
  color="blue"
  events={events}
/>`;

const CODE_FULL_USAGE = `<FullCalendar view="month" color="blue" events={events} />`;

const EVENTTAG_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "—", description: "事件文案。" },
  { attr: "color", type: "'purple' | 'green' | 'red' | 'yellow' | 'blue' | 'cyan' | 'orange'", defaultValue: "'blue'", description: "7 种事件色。" },
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
  { attr: "moreAvatar", type: "string", defaultValue: "—", description: "剩余事件提示行中的头像。" },
];

const EVENTCARD_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "事件标题。" },
  { attr: "timeRange", type: "string", defaultValue: "—", description: "时间段文案（如 10:00-11:00）。" },
  { attr: "color", type: "purple | blue | black | red | yellow | green | cyan | orange", defaultValue: "'blue'", description: "底部强调条颜色（8 色）。" },
  { attr: "avatars", type: "string[]", defaultValue: "[]", description: "参与者头像 URL 数组。" },
  { attr: "overflowCount", type: "number", defaultValue: "—", description: "末尾 +N 数字。" },
];

const SMALL_PROPS: ApiTableRow[] = [
  { attr: "title / subtitle", type: "string", defaultValue: "'日历' / '本月日程'", description: "卡片顶部文案。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "today 圆点与列表条的主色。" },
  { attr: "events", type: "SmallCalendarEvent[]", defaultValue: "[]", description: "事件数组，day / title / timeRange / color / avatars / overflowCount。" },
  { attr: "onMenuClick", type: "() => void", defaultValue: "—", description: "右上 menu 按钮回调。" },
];

const FULL_PROPS: ApiTableRow[] = [
  { attr: "view", type: "'month' | 'week' | 'day'", defaultValue: "'month'", description: "初始视图。传入 onViewChange 后由外部控制；否则用户改下拉框后由组件自己记住。" },
  { attr: "onViewChange", type: "(view: 'month' | 'week' | 'day') => void", defaultValue: "—", description: "切换月、周、日时通知外部更新 view。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "今天和表头的主色。" },
  { attr: "year / month / day", type: "number", defaultValue: "今天", description: "未操作前使用这些日期。点击上一页、下一页或「今天」后，由组件记住新位置。周视图每次移动 7 天，日视图移动 1 天，月视图移动 1 个月并避开不存在的日期。" },
  { attr: "events", type: "CalendarEvent[]", defaultValue: "[]", description: "事件数组（day / label / color / avatar? / hour?）。" },
  { attr: "detailPanel", type: "ReactNode", defaultValue: "—", description: "右侧浮层详情，传了才显示。" },
  { attr: "onCloseDetail", type: "() => void", defaultValue: "—", description: "关闭浮层。不传则不显示关闭按钮。" },
  { attr: "onEdit", type: "() => void", defaultValue: "—", description: "编辑日程。不传则不显示编辑按钮。" },
  { attr: "onMore", type: "() => void", defaultValue: "—", description: "更多操作。不传则不显示该按钮。" },
];

const avatars = [
  "https://i.pravatar.cc/40?img=1",
  "https://i.pravatar.cc/40?img=2",
  "https://i.pravatar.cc/40?img=3",
];

const smallEvents = [
  { day: 4, title: "界面设计晨会", timeRange: "10:00-11:00", color: "purple" as const, avatars, overflowCount: 4 },
  { day: 11, title: "迭代评审", timeRange: "09:00-10:00", color: "blue" as const, avatars },
];

const fullEvents = [
  { day: 2, label: "会议", color: "purple" as const, avatar: "https://i.pravatar.cc/24?u=1" },
  { day: 10, label: "迭代", color: "green" as const, avatar: "https://i.pravatar.cc/24?u=2" },
  { day: 15, label: "评审", color: "red" as const, avatar: "https://i.pravatar.cc/24?u=3" },
  { day: 22, label: "1:1", color: "blue" as const, avatar: "https://i.pravatar.cc/24?u=4" },
];

export default function CalendarCasePage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="日历与日程"
        hint="先选日期。标签、单日格子、事件卡片和整月视图是不同用途，各留一个例子。"
      />

      <Section title="用法" description="CalendarCard 自己翻月并选中一天。value 受控，不传就从客户端今天开始。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <SubSection title="最小示例" stack>
          <DocExample id="calendarcard" title="CalendarCard" summary="点日期会通过 onChange 交回本地日期。" code={CODE_CALENDAR_USAGE} minHeight={420}>
            <CalendarCard value={date} onChange={setDate} />
          </DocExample>
        </SubSection>
      </Section>

      <Section title="例子" description="标签、单日、事件卡片、小月历和整月视图各做一件事。">
        <ExampleGrid>
          <DocExample id="eventtag" title="EventTag" summary="实底和描边是两种标签。颜色用来区分事件类型。" code={CODE_EVENTTAG_USAGE}>
            <EventTag label="项目会议" color="purple" />
            <EventTag label="评审" color="green" variant="outline" />
          </DocExample>
          <DocExample id="calendardaycell" title="CalendarDayCell" summary="一天一格。事件超过 maxVisible 后收成 +N。" code={CODE_DAYCELL_USAGE} minHeight={240}>
            <div className="w-40">
              <CalendarDayCell
                day={17}
                isToday
                events={[
                  { label: "站会", color: "purple", avatar: avatars[0] },
                  { label: "1:1", color: "blue", avatar: avatars[1] },
                ]}
              />
            </div>
          </DocExample>
          <DocExample id="eventcard" title="EventCard" summary="一条日程：标题、时间和参与者。多出来的人数用 +N。" code={CODE_EVENTCARD_USAGE} minHeight={200}>
            <EventCard title="设计进度沟通" timeRange="10:00-11:00" color="blue" avatars={avatars} overflowCount={6} />
          </DocExample>
          <DocExample id="smallcalendar" title="SmallCalendar" summary="紧凑月历，下面列出即将开始的事件。" code={CODE_SMALL_USAGE} minHeight={480}>
            <SmallCalendar title="日历" subtitle="即将开始" color="blue" events={smallEvents} />
          </DocExample>
        </ExampleGrid>
        <DocExample id="fullcalendar" title="FullCalendar" summary="月视图看整月事件。周视图和日视图用 view 切换。" code={CODE_FULL_USAGE} minHeight={600}>
          <div className="w-full">
            <FullCalendar view="month" color="blue" events={fullEvents} />
          </div>
        </DocExample>
      </Section>

      <Section title="API">
        <ApiBlock id="calendarcard" title="CalendarCard" rows={CALENDAR_PROPS} />
        <ApiBlock id="eventtag" title="EventTag" rows={EVENTTAG_PROPS} />
        <ApiBlock id="calendardaycell" title="CalendarDayCell" rows={DAYCELL_PROPS} />
        <ApiBlock id="eventcard" title="EventCard" rows={EVENTCARD_PROPS} />
        <ApiBlock id="smallcalendar" title="SmallCalendar" rows={SMALL_PROPS} />
        <ApiBlock id="fullcalendar" title="FullCalendar" rows={FULL_PROPS} />
      </Section>
    </div>
  );
}
