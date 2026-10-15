"use client";

import {
  EventTag,
  CalendarDayCell,
  EventCard,
  SmallCalendar,
  FullCalendar,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import {
  EventTag, CalendarDayCell, EventCard,
  SmallCalendar, FullCalendar,
} from "@forge-ui-official/core";`;

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
  color="purple"
  avatars={[a1, a2, a3]}
  overflowCount={6}
/>`;

const CODE_SMALL_USAGE = `<SmallCalendar
  title="日历"
  subtitle="即将开始"
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
  { attr: "moreAvatar", type: "string", defaultValue: "—", description: "剩余事件提示行中的头像。" },
];

const EVENTCARD_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "事件标题。" },
  { attr: "timeRange", type: "string", defaultValue: "—", description: "时间段文案（如 10:00-11:00）。" },
  { attr: "color", type: "purple | blue | black | red | yellow | green | cyan | orange", defaultValue: "'purple'", description: "底部强调条颜色（8 色）。" },
  { attr: "avatars", type: "string[]", defaultValue: "[]", description: "参与者头像 URL 数组。" },
  { attr: "overflowCount", type: "number", defaultValue: "—", description: "末尾 +N 数字。" },
];

const SMALL_PROPS: ApiTableRow[] = [
  { attr: "title / subtitle", type: "string", defaultValue: "'日历' / '本月日程'", description: "卡片顶部文案。" },
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
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="日历与日程"
        hint="选择日期、浏览日程，并在月、周、日视图中查看事件。"
      />

    <Section title="CalendarCard API" description="支持日历翻页和日期选择，可用于独立卡片或紧凑日期弹层。">
      <CodeBlock code={'<CalendarCard value={date} onChange={setDate} />\n\n<DropdownPanel width="w-80" className="!items-stretch">\n  <CalendarCard size="compact" variant="plain" color="blue"\n    value={date} onChange={setDate} />\n</DropdownPanel>'} />
      <ApiTable rows={[
        { attr: "size", type: "'default' | 'compact'", defaultValue: "'default'", description: "compact 使用 14px 正文、24px 大日期；保留 32px 日期点击区域和六行月份空间。" },
        { attr: "variant", type: "'card' | 'plain'", defaultValue: "'card'", description: "plain 移除内外卡片表面、边框、阴影和留白，宽度随父容器。" },
        { attr: "color", type: "ButtonColor", defaultValue: "'red'", description: "沿用 Button 主题色类型；选中、今天、进度、装饰日历、撕页和焦点统一取色。" },
        { attr: "value / defaultDate", type: "日期", defaultValue: "客户端今天", description: "value 受控；defaultDate 非受控初始日期。SSR 不猜用户时区。" },
        { attr: "onChange", type: "(date: Date) => void", defaultValue: "—", description: "返回本地日期；导航范围 1900–2100，翻月时截到有效日期。" },
        { attr: "locale / labels", type: "string / Partial<CalendarCardLabels>", defaultValue: "zh-CN / 中文按钮文案", description: "日期语言与导航可访问名称。" },
        { attr: "disabled / motion / className", type: "boolean / MotionPreference / string", defaultValue: "false / auto / ''", description: "保留现有行为；auto 遵循系统 reduced-motion。" },
      ]} />
    </Section>
      <Section title="EventTag" description="在日历中标记事件，支持不同颜色、尺寸和样式。">
        <SubSection title="导入组件" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="使用方法" stack>
          <PreviewBlock code={CODE_EVENTTAG_USAGE}>
            <EventTag label="项目会议" color="purple" />
            <EventTag label="评审" color="green" variant="outline" />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={EVENTTAG_PROPS} />
        </SubSection>
      </Section>

      <Section title="CalendarDayCell" description="展示一天的日期和事件，区分今天、选中日期和其他月份。">
        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>events</InlineCode> 数组超过 <InlineCode>maxVisible</InlineCode> 自动折叠为 +N。
          </p>
          <PreviewBlock code={CODE_DAYCELL_USAGE} minHeight={240}>
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
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={DAYCELL_PROPS} />
        </SubSection>
      </Section>

      <Section title="EventCard" description="展示事件名称、时间和参与成员。">
        <SubSection title="使用方法" stack>
          <PreviewBlock code={CODE_EVENTCARD_USAGE} minHeight={200}>
            <EventCard
              title="设计进度沟通"
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

      <Section title="SmallCalendar" description="紧凑月日历，支持切换月份、选择日期和查看当天事件。">
        <SubSection title="使用方法" stack>
          <PreviewBlock code={CODE_SMALL_USAGE} minHeight={480}>
            <SmallCalendar
              title="日历"
              subtitle="即将开始"
              color="purple"
              events={smallEvents}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={SMALL_PROPS} />
        </SubSection>
      </Section>

      <Section title="FullCalendar" description="在月、周、日视图中浏览事件，可显示事件详情。">
        <SubSection title="使用方法" stack>
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
    </div>
  );
}
