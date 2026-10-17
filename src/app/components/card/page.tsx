"use client";

import Link from "next/link";

import {
  StatCard,
  ProgressStatCard,
  ImageStatCard,
  LineChartStatCard,
  WheelChartStatCard,
  BarChartStatCard,
  BalanceCard,
  DebitCard,
  CreditCard,
  ProgressCard,
  ProjectCard,
  TaskCard,
  UserCard,
  HighlightCard,
  ActivityCard,
  Label,
} from "@forge-ui-official/core";
import {
  ChartSquareBoldDuotone,
  VideocameraBoldDuotone,
  PhoneBoldDuotone,
} from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample, ExampleGrid } from "../_doc-blocks";
import { PreviewBlock } from "../_preview-block";
import { CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const avatarSet = [
  "https://i.pravatar.cc/80?u=1",
  "https://i.pravatar.cc/80?u=2",
  "https://i.pravatar.cc/80?u=3",
];

const CODE_IMPORT = `import {
  StatCard, ProgressStatCard, ImageStatCard,
  LineChartStatCard, WheelChartStatCard, BarChartStatCard,
  BalanceCard, DebitCard, CreditCard,
  ProgressCard, ProjectCard, TaskCard, UserCard,
  HighlightCard, ActivityCard, FileCard,
} from "@forge-ui-official/core";`;

const CODE_STATCARD_USAGE = `<StatCard
  title="总收入"
  value="$14,000"
  trend="10%"
  subtitle="今日增加 ¥150"
  theme="blue"
  size="lg"
  icon={<ChartSquareBoldDuotone size={20} />}
/>`;

const CODE_STATCARD_THEMES = `<StatCard theme="white" ... />
<StatCard theme="dark" ... />
<StatCard theme="purple" ... />
<StatCard theme="blue" ... />
<StatCard theme="green" ... />`;

const CODE_STATCARD_SIZES = `<StatCard size="sm" ... />
<StatCard size="lg" ... />
<StatCard size="wide" ... />`;

const CODE_PROGRESS_STAT = `<ProgressStatCard
  title="活跃用户"
  value="1,250"
  trend="12%"
  subtitle="今日新增 150"
  theme="blue"
  progressValue={65}
  progressColor="yellow"
/>`;

const CODE_IMAGE_STAT = `<ImageStatCard
  title="总收入"
  subtitle="7 月 2 日至今"
  value="$14,000"
  trend="10%"
  trendSubtitle="今日增加 ¥150"
  theme="blue"
  avatars={[...]}
/>`;

const CODE_LINE = `<LineChartStatCard
  title="总收入"
  value="$14,000"
  trend="10%"
  subtitle="今日增加 ¥150"
  theme="blue"
  chartColor="blue"
/>`;

const CODE_WHEEL = `<WheelChartStatCard
  title="已用存储"
  value="72%"
  trend="5%"
  subtitle="总容量 1 TB"
  theme="blue"
  wheelPercent={72}
  wheelColor="blue"
/>`;

const CODE_BAR = `<BarChartStatCard
  title="访问次数"
  value="12,480"
  trend="8%"
  subtitle="较上周"
  theme="green"
  barColor="green"
/>`;

const CODE_BALANCE = `<BalanceCard
  balance="$21,500"
  trend="10%"
  subtitle="今日增加 ¥150"
  theme="blue"
  cardNumber="9821"
  onTransfer={() => {}}
  onRequest={() => {}}
/>`;

const CODE_DEBIT = `<DebitCard
  balance="$1,200.00"
  cardNumber="9090"
  expiry="07/25"
  theme="blue"
  variant="glow"
/>`;

const CODE_CREDIT = `<CreditCard
  cardNumber="9090"
  holderName="张明"
  expiry="07/25"
  theme="dark"
  variant="glow"
/>`;

const CODE_PROJECT = `<ProjectCard
  title="官网改版"
  description="首页与营销页面"
  labelText="进行中"
  labelColor="purple"
  progress={65}
  progressColor="blue"
  avatars={avatars}
  date="2026 年 10 月 21 日"
  onMenuClick={() => {}}
/>`;

const CODE_TASK = `<TaskCard
  title="设计评审"
  description="本周内交付设计规范"
  labelText="待开始"
  labelColor="red"
  progress={50}
  progressColor="yellow"
  avatars={avatars}
  date="2026 年 10 月 21 日"
  onMenuClick={() => {}}
/>`;

const CODE_PROGRESS = `<ProgressCard
  title="任务进度"
  value="75%"
  subtitle="今天更新"
  progress={75}
  items={[
    { label: "设计", value: "100%", color: "#10b981" },
    { label: "开发", value: "60%", color: "#7c3aed" },
    { label: "测试", value: "20%", color: "#f59e0b" },
  ]}
/>`;

const CODE_USER = `<UserCard
  avatar="https://..."
  name="陈明"
  badge={<Label color="blue" size="sm">专业版</Label>}
  stats={[{ label: "等级", value: "12,091" }]}
  onMenuClick={() => {}}
/>`;

const CODE_HIGHLIGHT = `<HighlightCard
  title="热门商品"
  theme="blue"
  image="..."
  annotations={[{ label: "无线降噪耳机", value: "340 笔销售 | ¥26,982", position: { bottom: "12px", left: "12px" } }]}
  products={[{ image: "...", name: "无线鼠标", subtitle: "售出 140 件", value: "$17,678" }]}
/>`;

const CODE_ACTIVITY = `<ActivityCard
  icon={<VideocameraBoldDuotone size={20} />}
  headerText="林晓创建了会议日程"
  datetime="2025年1月14日 10:00"
  title="项目讨论会"
  description="讨论项目进展、关键问题和下一步安排。"
  metadata={[{ label: "日期", value: "2025年2月14日 14:00" }]}
/>`;

const SHARED_STAT = "标题、数值、趋势、副文案、主题、尺寸、图标和更多操作。";

const STATCARD_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "卡片标题。" },
  { attr: "value", type: "ReactNode", defaultValue: "—", description: "主数据值，支持数字、文字和自定义内容。" },
  { attr: "animateValue", type: "boolean", defaultValue: "false", description: "数字更新时逐位过渡；文字和自定义内容保持原样。" },
  { attr: "locale / numberFormat", type: "string / Intl.NumberFormatOptions", defaultValue: "'zh-CN' / —", description: "数字的地区、货币和小数格式。" },
  { attr: "motion", type: "'auto' | 'none'", defaultValue: "'auto'", description: "数值动效跟随系统或立即显示最终值。" },
  { attr: "trend", type: "string", defaultValue: "—", description: "趋势百分比，显示在右上角。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "底部描述文本。" },
  { attr: "theme", type: "'white' | 'dark' | 'purple' | 'blue' | 'green' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'white'", description: "8 种主题色。指标家族共用。" },
  { attr: "size", type: "'sm' | 'lg' | 'wide'", defaultValue: "'sm'", description: "控制内部密度和字号；默认宽度填满父级。" },
  { attr: "density", type: "'default' | 'compact'", defaultValue: "'default'", description: "紧凑模式会收紧留白、字号和图标尺寸。" },
  { attr: "width", type: "'full' | 'fixed'", defaultValue: "'full'", description: "full 适应容器，fixed 使用固定展示宽度。" },
  { attr: "icon", type: "ReactNode", defaultValue: "—", description: "左上角图标槽。" },
  { attr: "badgeVariant", type: "'greyBg' | 'solid' | 'opacity' | 'white'", defaultValue: "'greyBg'", description: "趋势标记的外观。" },
  { attr: "onKebabClick", type: "() => void", defaultValue: "—", description: "点击右上角更多操作按钮时触发。" },
];

const PROGRESS_STAT_PROPS: ApiTableRow[] = [
  { attr: "同 StatCard", type: "—", defaultValue: "—", description: SHARED_STAT },
  { attr: "progressValue", type: "number", defaultValue: "0", description: "进度条数值 0-100。" },
  { attr: "progressColor", type: "ProgressColor", defaultValue: "'blue'", description: "进度条颜色。" },
];

const LINE_CHART_STAT_PROPS: ApiTableRow[] = [
  { attr: "同 StatCard", type: "—", defaultValue: "—", description: `${SHARED_STAT}主题可另选 red。` },
  { attr: "trendDirection", type: "'up' | 'down'", defaultValue: "'up'", description: "趋势方向。" },
  { attr: "chartColor", type: "'purple' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'blue'", description: "折线与渐变底色。" },
  { attr: "chartDirection", type: "'up' | 'down'", defaultValue: "'up'", description: "折线走势方向。" },
];

const WHEEL_CHART_STAT_PROPS: ApiTableRow[] = [
  { attr: "同 StatCard", type: "—", defaultValue: "—", description: `${SHARED_STAT}主题可另选 red。` },
  { attr: "trendDirection", type: "'up' | 'down'", defaultValue: "'up'", description: "趋势方向。" },
  { attr: "wheelColor", type: "'purple' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'blue'", description: "甜甜圈主色。" },
  { attr: "wheelPercent", type: "number", defaultValue: "70", description: "0-100 填充百分比。" },
];

const BAR_CHART_STAT_PROPS: ApiTableRow[] = [
  { attr: "同 StatCard", type: "—", defaultValue: "—", description: `${SHARED_STAT}主题可另选 red。` },
  { attr: "trendDirection", type: "'up' | 'down'", defaultValue: "'up'", description: "趋势方向。" },
  { attr: "barColor", type: "'purple' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'blue'", description: "柱子主色。" },
  { attr: "bars", type: "number[]", defaultValue: "[16,24,32,20,40]", description: "迷你柱状图数据数组。" },
];

const IMAGE_STAT_PROPS: ApiTableRow[] = [
  { attr: "同 StatCard", type: "—", defaultValue: "—", description: "标题、副文案、数值、趋势和主题。尺寸为 lg 或 wide。" },
  { attr: "trendSubtitle", type: "string", defaultValue: "—", description: "趋势下方的小字。" },
  { attr: "avatars", type: "string[]", defaultValue: "—", description: "重叠显示参与成员头像，传入图片 URL。" },
  { attr: "onKebabClick", type: "() => void", defaultValue: "—", description: "点击右上角更多操作按钮时触发。" },
];

const BALANCE_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "'Total Balance'", description: "卡片标题。" },
  { attr: "balance", type: "string", defaultValue: "—", description: "余额文本。" },
  { attr: "trend / trendDirection", type: "string / 'up' | 'down'", defaultValue: "— / 'up'", description: "右上角趋势。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "副文案。" },
  { attr: "theme", type: "'white' | 'dark' | 'purple' | 'blue' | 'green' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'white'", description: "卡片主题色。" },
  { attr: "balanceHidden", type: "boolean", defaultValue: "false", description: "是否遮掩数字（用 •• 替代）。" },
  { attr: "cardNumber", type: "string", defaultValue: "—", description: "卡号末 4 位。" },
  { attr: "cardIcon", type: "string", defaultValue: "—", description: "卡号旁的品牌图标图片 URL（24×24 渲染）。" },
  { attr: "onTransfer / onRequest", type: "() => void", defaultValue: "—", description: "转账 / 收款按钮回调。" },
  { attr: "density", type: "'default' | 'compact'", defaultValue: "'default'", description: "紧凑模式会收紧留白、余额字号和操作按钮高度。" },
  { attr: "width", type: "'full' | 'fixed'", defaultValue: "'full'", description: "full 适应容器，fixed 使用固定展示宽度。" },
];

const DEBIT_PROPS: ApiTableRow[] = [
  { attr: "balance", type: "string", defaultValue: "'$1,200.00'", description: "余额文本。" },
  { attr: "cardNumber", type: "string", defaultValue: "'9090'", description: "卡号末 4 位。" },
  { attr: "expiry", type: "string", defaultValue: "'07/25'", description: "有效期。" },
  { attr: "theme", type: "'dark' | 'purple' | 'blue' | 'green' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'dark'", description: "主题色（7 种，无 white）。" },
  { attr: "variant", type: "'glow' | 'gradient' | 'flat'", defaultValue: "'glow'", description: "卡面质感：发光 / 渐变 / 纯色。" },
];

const CREDIT_PROPS: ApiTableRow[] = [
  { attr: "cardNumber", type: "string", defaultValue: "'9090'", description: "卡号末 4 位。" },
  { attr: "holderName", type: "string", defaultValue: "'John Doe'", description: "持卡人姓名。" },
  { attr: "expiry", type: "string", defaultValue: "'07/25'", description: "有效期。" },
  { attr: "theme", type: "'dark' | 'purple' | 'blue' | 'green' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'dark'", description: "主题色（7 种，无 white）。" },
  { attr: "variant", type: "'glow' | 'gradient' | 'flat'", defaultValue: "'glow'", description: "卡面质感：发光 / 渐变 / 纯色。" },
];

const PROGRESS_CARD_PROPS: ApiTableRow[] = [
  { attr: "title / value / subtitle / theme", type: "同 StatCard", defaultValue: "—", description: "基础字段。" },
  { attr: "progress", type: "number", defaultValue: "0", description: "主进度条 0-100。" },
  { attr: "progressColor", type: "string", defaultValue: "'#7c3aed'", description: "主进度条颜色。" },
  { attr: "items", type: "{ label, value, color }[]", defaultValue: "—", description: "下方分项进度列表。" },
];

const PROJECTCARD_PROPS: ApiTableRow[] = [
  { attr: "logo", type: "string", defaultValue: "—", description: "左上方 48×48 logo 图片 URL。" },
  { attr: "title", type: "string", defaultValue: "—", description: "项目标题（必填）。" },
  { attr: "description", type: "string", defaultValue: "—", description: "项目描述（可选，最多 2 行）。" },
  { attr: "labelText", type: "string", defaultValue: "—", description: "右上角状态文字。" },
  { attr: "labelColor", type: "string", defaultValue: "'bg-fg-grey-700'", description: "状态文字的背景色 class（Tailwind bg-*）。" },
  { attr: "progress", type: "number", defaultValue: "0", description: "进度 0-100。" },
  { attr: "progressColor", type: "'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'cyan' | 'gray'", defaultValue: "'blue'", description: "进度条主色。" },
  { attr: "avatars", type: "string[]", defaultValue: "[]", description: "重叠显示参与成员头像，传入图片 URL。" },
  { attr: "overflowCount", type: "number", defaultValue: "—", description: "尾部 +N 圆，传 > 0 时显示。" },
  { attr: "date", type: "string", defaultValue: "—", description: "右下角日期文案。" },
  { attr: "onMenuClick", type: "() => void", defaultValue: "—", description: "点击右上角更多操作按钮时触发。传入后才显示按钮。" },
  { attr: "width", type: "'full' | 'fixed'", defaultValue: "'full'", description: "full 适应容器，fixed 使用固定展示宽度。" },
];

const TASKCARD_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "任务标题（必填）。" },
  { attr: "description", type: "string", defaultValue: "—", description: "任务描述（可选）。" },
  { attr: "labelText", type: "string", defaultValue: "—", description: "顶部状态文字，单独占一行。" },
  { attr: "labelColor", type: "string", defaultValue: "'bg-fg-red'", description: "状态文字的背景色 class。" },
  { attr: "progress", type: "number", defaultValue: "0", description: "进度 0-100。" },
  { attr: "progressColor", type: "'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'cyan' | 'gray'", defaultValue: "'blue'", description: "进度条主色。" },
  { attr: "avatars", type: "string[]", defaultValue: "[]", description: "重叠显示参与成员头像，传入图片 URL。" },
  { attr: "overflowCount", type: "number", defaultValue: "—", description: "尾部 +N 圆。" },
  { attr: "date", type: "string", defaultValue: "—", description: "右下角日期文案。" },
  { attr: "onMenuClick", type: "() => void", defaultValue: "—", description: "点击右上角更多操作按钮时触发。" },
  { attr: "width", type: "'full' | 'fixed'", defaultValue: "'full'", description: "full 适应容器，fixed 使用固定展示宽度。" },
];

const USER_PROPS: ApiTableRow[] = [
  { attr: "avatar", type: "string", defaultValue: "—", description: "头像图片 URL。没有图片时改传姓名缩写。" },
  { attr: "initials", type: "string", defaultValue: "—", description: "没有头像图片时显示的姓名缩写。" },
  { attr: "initialsColor", type: "AvatarInitialColor", defaultValue: "'blue'", description: "姓名缩写的背景色。" },
  { attr: "name", type: "string", defaultValue: "—", description: "用户名。" },
  { attr: "badge", type: "ReactNode", defaultValue: "—", description: "右上角标签，一般放 Label。" },
  { attr: "stats", type: "{ label: string; value: string }[]", defaultValue: "—", description: "下方统计信息。" },
  { attr: "onMenuClick", type: "() => void", defaultValue: "—", description: "点击右上角更多操作按钮时触发。" },
];

const HIGHLIGHT_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "卡片标题。" },
  { attr: "theme", type: "CardTheme", defaultValue: "'purple'", description: "主题色。" },
  { attr: "image", type: "string", defaultValue: "—", description: "主展示图 URL。" },
  { attr: "annotations", type: "{ label, value, position }[]", defaultValue: "—", description: "叠在主图上的注解，用 position 定位。" },
  { attr: "products", type: "{ image, name, subtitle?, value }[]", defaultValue: "—", description: "下方的商品列表。" },
  { attr: "density", type: "'default' | 'compact'", defaultValue: "'default'", description: "紧凑模式会收紧卡片高度和留白。" },
];

const ACTIVITY_PROPS: ApiTableRow[] = [
  { attr: "icon", type: "ReactNode", defaultValue: "—", description: "顶部事件类型图标。" },
  { attr: "headerText", type: "string", defaultValue: "—", description: "顶部说明，例如谁创建了这条日程。" },
  { attr: "datetime", type: "string", defaultValue: "—", description: "顶部时间。" },
  { attr: "avatar", type: "string", defaultValue: "—", description: "创建者头像。" },
  { attr: "title / description", type: "string", defaultValue: "—", description: "正文标题与描述。" },
  { attr: "metadata", type: "{ label, value }[]", defaultValue: "—", description: "底部的说明条目。" },
  { attr: "onMenuClick", type: "() => void", defaultValue: "—", description: "点击右上角更多操作按钮时触发。" },
];

const PICK_ROWS: { id: string; card: string; extra: string }[] = [
  { id: "statcard", card: "StatCard", extra: "基准。一个数、一条趋势、一句说明。" },
  { id: "progressstatcard", card: "ProgressStatCard", extra: "同一个数，底下加一条进度。" },
  { id: "imagestatcard", card: "ImageStatCard", extra: "同一个数，旁边重叠成员头像。" },
  { id: "linechartstatcard", card: "LineChartStatCard", extra: "同一个数，底下加迷你折线。" },
  { id: "wheelchartstatcard", card: "WheelChartStatCard", extra: "同一个数，旁边加环形进度。" },
  { id: "barchartstatcard", card: "BarChartStatCard", extra: "同一个数，底下加迷你柱图。" },
  { id: "balancecard", card: "BalanceCard", extra: "余额、卡号末四位，以及转账和收款。" },
  { id: "debitcard", card: "DebitCard", extra: "借记卡：余额、卡号、有效期和卡面质感。" },
  { id: "creditcard", card: "CreditCard", extra: "信用卡：持卡人、卡号、有效期。没有余额。" },
  { id: "projectcard", card: "ProjectCard", extra: "项目名称、状态、进度、成员和日期。" },
  { id: "taskcard", card: "TaskCard", extra: "任务板用。状态单独一行，没有 logo。" },
  { id: "progresscard", card: "ProgressCard", extra: "一条总进度，下面拆成多项。" },
  { id: "usercard", card: "UserCard", extra: "头像或姓名缩写、姓名和自定义统计。" },
  { id: "activitycard", card: "ActivityCard", extra: "事件类型、时间、说明和相关条目。" },
  { id: "highlightcard", card: "HighlightCard", extra: "主图、图上注解和下方商品。" },
  { id: "filecard", card: "FileCard", extra: "文件预览。用法和参数在文件卡片页。" },
];

export default function CardCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="卡片"
        hint="按用途选一张现成卡片，展示指标、进度、财务、项目和成员。样式都保留，差别写在每张卡多出来的那一块。"
      />

      <Section
        title="用法"
        description="从统计卡片开始。必填标题和数值，趋势、说明和图标按需要加上。"
      >
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <SubSection title="最小示例" stack>
          <PreviewBlock code={CODE_STATCARD_USAGE} minHeight={220}>
            <StatCard
              title="总收入"
              value="$14,000"
              trend="10%"
              subtitle="今日增加 ¥150"
              theme="blue"
              size="lg"
              icon={<ChartSquareBoldDuotone size={20} />}
            />
          </PreviewBlock>
        </SubSection>
      </Section>

      <Section
        title="骨架"
        description="指标卡共用标题、数值、趋势、副文案、主题和尺寸，也可以加图标和右上角更多操作。主题色和尺寸只在统计卡片上演示一次，进度、成员和三种图表统计沿用同一套。"
      >
        <SubSection title="主题" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            8 种主题色：white、dark、purple、blue、green、orange、yellow、cyan。这里示意 5 种。
          </p>
          <PreviewBlock code={CODE_STATCARD_THEMES} minHeight={260}>
            <div className="flex flex-wrap items-start gap-4">
              {(["white", "purple", "blue", "green", "dark"] as const).map((theme) => (
                <StatCard key={theme} title="标题" value="$1,000" trend="10%" subtitle="今日增加 ¥150" theme={theme} size="sm" />
              ))}
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="尺寸" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>sm</InlineCode> 放进仪表盘格子，<InlineCode>lg</InlineCode> 把内容展开，<InlineCode>wide</InlineCode> 把图表拉到横向。
          </p>
          <PreviewBlock code={CODE_STATCARD_SIZES} minHeight={260}>
            <div className="flex w-full flex-wrap items-start gap-4">
              <StatCard title="项目概览" value="$1,000" trend="10%" subtitle="今日增加 ¥150" theme="blue" size="sm" />
              <StatCard title="总收入" value="$14,000" trend="10%" subtitle="今日增加 ¥150" theme="blue" size="lg" icon={<ChartSquareBoldDuotone size={20} />} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="怎么选" stack>
          <div className="overflow-x-auto rounded-xl border border-fg-grey-200 bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-fg-grey-200 bg-fg-grey-50">
                  <th className="w-[34%] px-4 py-2.5 text-xs font-semibold uppercase tracking-fg text-fg-grey-700">卡片</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-fg text-fg-grey-700">多出来的部分</th>
                </tr>
              </thead>
              <tbody>
                {PICK_ROWS.map((row) => (
                  <tr key={row.id} className="border-b border-fg-grey-200 last:border-0">
                    <td className="px-4 py-2.5 align-top">
                      <a href={`#${row.id}`} className="font-mono text-[13px] text-fg-blue">
                        {row.card}
                      </a>
                    </td>
                    <td className="px-4 py-2.5 align-top text-fg-grey-900">{row.extra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      <Section
        title="例子"
        description="同一组里并排放。每张卡只写它和旁边那张的差别，参数表在页尾。"
      >
        <SubSection title="指标" stack>
          <ExampleGrid>
            <DocExample
              id="statcard"
              title="StatCard"
              summary="一个关键数字。图标、趋势和更多操作都是可选的。"
              code={CODE_STATCARD_USAGE}
            >
              <StatCard
                title="总收入"
                value="$14,000"
                trend="10%"
                subtitle="今日增加 ¥150"
                theme="blue"
                size="lg"
                icon={<ChartSquareBoldDuotone size={20} />}
              />
            </DocExample>
            <DocExample
              id="progressstatcard"
              title="ProgressStatCard"
              summary="在同一个数字下面加进度，用来表示配额或完成度。"
              code={CODE_PROGRESS_STAT}
            >
              <ProgressStatCard
                title="活跃用户"
                value="1,250"
                trend="12%"
                subtitle="今日新增 150"
                theme="blue"
                size="lg"
                progressValue={65}
                progressColor="yellow"
              />
            </DocExample>
            <DocExample
              id="imagestatcard"
              title="ImageStatCard"
              summary="数字旁边重叠成员头像，适合团队或贡献者。"
              code={CODE_IMAGE_STAT}
            >
              <ImageStatCard
                title="总收入"
                subtitle="7 月 2 日至今"
                value="$14,000"
                trend="10%"
                trendSubtitle="今日增加 ¥150"
                theme="blue"
                avatars={avatarSet}
              />
            </DocExample>
            <DocExample
              id="linechartstatcard"
              title="LineChartStatCard"
              summary="数字下面补一条迷你折线，颜色用 chartColor。"
              code={CODE_LINE}
            >
              <LineChartStatCard
                title="总收入"
                value="$14,000"
                trend="10%"
                subtitle="今日增加 ¥150"
                theme="blue"
                size="lg"
                chartColor="blue"
              />
            </DocExample>
            <DocExample
              id="wheelchartstatcard"
              title="WheelChartStatCard"
              summary="用环形进度表示占比，填充比例是 wheelPercent。"
              code={CODE_WHEEL}
            >
              <WheelChartStatCard
                title="已用存储"
                value="72%"
                trend="5%"
                subtitle="总容量 1 TB"
                theme="blue"
                size="lg"
                wheelPercent={72}
                wheelColor="blue"
              />
            </DocExample>
            <DocExample
              id="barchartstatcard"
              title="BarChartStatCard"
              summary="用一组小柱子表示近期起伏，柱色用 barColor。"
              code={CODE_BAR}
            >
              <BarChartStatCard
                title="访问次数"
                value="12,480"
                trend="8%"
                subtitle="较上周"
                theme="green"
                size="lg"
                barColor="green"
              />
            </DocExample>
          </ExampleGrid>
        </SubSection>

        <SubSection title="财务" stack>
          <ExampleGrid>
            <DocExample id="balancecard" title="BalanceCard" summary="展示余额和卡号末四位，并提供转账、收款。" code={CODE_BALANCE}>
              <BalanceCard balance="$21,500" trend="10%" subtitle="今日增加 ¥150" theme="blue" cardNumber="9821" onTransfer={() => {}} onRequest={() => {}} />
            </DocExample>
            <DocExample id="debitcard" title="DebitCard" summary="借记卡面：余额、卡号、有效期。variant 切换发光、渐变或纯色。" code={CODE_DEBIT}>
              <DebitCard balance="$1,200.00" cardNumber="9090" expiry="07/25" theme="blue" variant="glow" />
            </DocExample>
            <DocExample id="creditcard" title="CreditCard" summary="信用卡面没有余额，多一个持卡人姓名。" code={CODE_CREDIT}>
              <CreditCard cardNumber="9090" holderName="张明" expiry="07/25" theme="dark" variant="glow" />
            </DocExample>
          </ExampleGrid>
        </SubSection>

        <SubSection title="项目与任务" stack>
          <ExampleGrid>
            <DocExample id="projectcard" title="ProjectCard" summary="左上角可以放 logo，状态、进度、成员和日期放在同一张项目卡里。" code={CODE_PROJECT} minHeight={240}>
              <ProjectCard title="官网改版" description="首页与营销页面" labelText="进行中" labelColor="purple" progress={65} progressColor="blue" avatars={avatarSet} date="2026 年 10 月 21 日" onMenuClick={() => {}} />
            </DocExample>
            <DocExample id="taskcard" title="TaskCard" summary="给任务板列用。没有 logo，状态文字单独占顶部一行。" code={CODE_TASK} minHeight={240}>
              <TaskCard title="设计评审" description="本周内交付设计规范" labelText="待开始" labelColor="red" progress={50} progressColor="yellow" avatars={avatarSet} date="2026 年 10 月 21 日" onMenuClick={() => {}} />
            </DocExample>
            <DocExample id="progresscard" title="ProgressCard" summary="一条总进度，下面按事项拆开，每项有自己的颜色。" code={CODE_PROGRESS}>
              <ProgressCard
                title="任务进度"
                value="75%"
                subtitle="今天更新"
                theme="white"
                progress={75}
                progressColor="#7c3aed"
                items={[
                  { label: "设计", value: "100%", color: "#10b981" },
                  { label: "开发", value: "60%", color: "#7c3aed" },
                  { label: "测试", value: "20%", color: "#f59e0b" },
                ]}
              />
            </DocExample>
          </ExampleGrid>
        </SubSection>

        <SubSection title="成员与动态" stack>
          <DocExample id="usercard" title="UserCard" summary="有头像就传图片，没有就退到姓名缩写。统计条目按需要增减。" code={CODE_USER} minHeight={280}>
            <div className="flex flex-wrap items-start gap-4">
              <UserCard avatar="https://i.pravatar.cc/160?u=u1" name="陈明" badge={<Label color="blue" size="sm">专业版</Label>} stats={[{ label: "等级", value: "12,091" }, { label: "经验", value: "$12,091" }]} onMenuClick={() => {}} />
              <UserCard initials="LB" initialsColor="blue" name="林晓" badge={<Label color="blue" size="sm">Label</Label>} stats={[{ label: "等级", value: "12,091" }]} onMenuClick={() => {}} />
            </div>
          </DocExample>
          <DocExample id="activitycard" title="ActivityCard" summary="用不同图标区分会议、通话或其他事件，底部用条目补充时间、地点或目的。" code={CODE_ACTIVITY} minHeight={320}>
            <div className="flex flex-wrap items-start gap-4">
              <ActivityCard
                icon={<VideocameraBoldDuotone size={20} className="text-fg-violet" />}
                headerText="林晓创建了会议日程"
                datetime="2025年1月14日 10:00"
                avatar="https://i.pravatar.cc/40?u=a1"
                title="项目讨论会"
                description="讨论项目进展、关键问题和下一步安排。"
                metadata={[
                  { label: "日期", value: "2025年2月14日 14:00" },
                  { label: "目的", value: "后续跟进" },
                ]}
                onMenuClick={() => {}}
              />
              <ActivityCard
                icon={<PhoneBoldDuotone size={20} className="text-emerald-500" />}
                headerText="林晓创建了通话日程"
                datetime="2025年1月14日 10:00"
                avatar="https://i.pravatar.cc/40?u=a2"
                title="客户回访"
                description="确认需求与交付安排。"
                metadata={[{ label: "日期", value: "2025年2月14日 14:00" }]}
                onMenuClick={() => {}}
              />
            </div>
          </DocExample>
        </SubSection>

        <SubSection title="商品" stack>
          <DocExample id="highlightcard" title="HighlightCard" summary="主图上可以压注解，图下接商品列表。" code={CODE_HIGHLIGHT} minHeight={340}>
            <HighlightCard
              title="热门商品"
              theme="blue"
              image="https://picsum.photos/400/300?random=highlight"
              annotations={[
                { label: "无线降噪耳机", value: "340 笔销售 | ¥26,982", position: { bottom: "12px", left: "12px" } },
              ]}
              products={[
                { image: "https://picsum.photos/80/80?random=p1", name: "无线鼠标", subtitle: "售出 140 件", value: "$17,678" },
                { image: "https://picsum.photos/80/80?random=p2", name: "游戏手柄", subtitle: "售出 105 件", value: "$5,500" },
              ]}
            />
          </DocExample>
          <p id="filecard" className="scroll-mt-24 text-sm leading-6 text-fg-grey-700">
            文件卡片的展示、用法和参数见{" "}
            <Link href="/components/file-type#filecard" className="font-semibold text-fg-blue underline underline-offset-4">
              文件卡片
            </Link>
            。
          </p>
        </SubSection>
      </Section>

      <Section
        title="API"
        description="统计卡片写下指标家族的共用字段。进度、成员和图表统计只列多出来的参数。余额、项目、成员、动态和商品的字段各自独立。"
      >
        <ApiBlock id="statcard" title="StatCard" rows={STATCARD_PROPS} />
        <ApiBlock id="progressstatcard" title="ProgressStatCard" rows={PROGRESS_STAT_PROPS} />
        <ApiBlock id="imagestatcard" title="ImageStatCard" rows={IMAGE_STAT_PROPS} />
        <ApiBlock id="linechartstatcard" title="LineChartStatCard" rows={LINE_CHART_STAT_PROPS} />
        <ApiBlock id="wheelchartstatcard" title="WheelChartStatCard" rows={WHEEL_CHART_STAT_PROPS} />
        <ApiBlock id="barchartstatcard" title="BarChartStatCard" rows={BAR_CHART_STAT_PROPS} />
        <ApiBlock id="balancecard" title="BalanceCard" rows={BALANCE_PROPS} />
        <ApiBlock id="debitcard" title="DebitCard" rows={DEBIT_PROPS} />
        <ApiBlock id="creditcard" title="CreditCard" rows={CREDIT_PROPS} />
        <ApiBlock id="projectcard" title="ProjectCard" rows={PROJECTCARD_PROPS} />
        <ApiBlock id="taskcard" title="TaskCard" rows={TASKCARD_PROPS} />
        <ApiBlock id="progresscard" title="ProgressCard" rows={PROGRESS_CARD_PROPS} />
        <ApiBlock id="usercard" title="UserCard" rows={USER_PROPS} />
        <ApiBlock id="activitycard" title="ActivityCard" rows={ACTIVITY_PROPS} />
        <ApiBlock id="highlightcard" title="HighlightCard" rows={HIGHLIGHT_PROPS} />
      </Section>
    </div>
  );
}
