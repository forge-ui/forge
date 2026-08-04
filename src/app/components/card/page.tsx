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
  FileCard,
  Label,
} from "@forge-ui-official/core";
import {
  ChartSquareBoldDuotone,
  WalletBoldDuotone,
  VideocameraBoldDuotone,
  PhoneBoldDuotone,
} from "solar-icon-set";
import { PageHeading, Section, SubSection, SubSectionGrid } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const avatarSet = [
  "https://i.pravatar.cc/80?u=1",
  "https://i.pravatar.cc/80?u=2",
  "https://i.pravatar.cc/80?u=3",
];

// ────────────────────────────────────────────────────────────
// Code snippets
// ────────────────────────────────────────────────────────────

const CODE_IMPORT = `import {
  StatCard, ProgressStatCard, ImageStatCard,
  LineChartStatCard, WheelChartStatCard, BarChartStatCard,
  BalanceCard, DebitCard, CreditCard,
  ProgressCard, ProjectCard, TaskCard, UserCard,
  HighlightCard, ActivityCard, FileCard,
} from "@forge-ui-official/core";`;

// StatCard
const CODE_STATCARD_USAGE = `<StatCard
  title="Total Revenue"
  value="$14,000"
  trend="10%"
  subtitle="+$150 today"
  theme="purple"
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

const STATCARD_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "卡片标题。" },
  { attr: "value", type: "string", defaultValue: "—", description: "主数据值。" },
  { attr: "trend", type: "string", defaultValue: "—", description: "趋势百分比，会作为右上角 badge。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "底部描述文本。" },
  { attr: "theme", type: "'white' | 'dark' | 'purple' | 'blue' | 'green' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'white'", description: "8 种主题色。" },
  { attr: "size", type: "'sm' | 'lg' | 'wide'", defaultValue: "'sm'", description: "控制内部密度和字号；默认宽度填满父级。" },
  { attr: "width", type: "'full' | 'fixed'", defaultValue: "'full'", description: "默认填满 grid/flex 列；仅组件展示原始 Figma 尺寸时用 fixed。" },
  { attr: "icon", type: "ReactNode", defaultValue: "—", description: "左上角图标槽。" },
  { attr: "badgeVariant", type: "'greyBg' | 'solid' | 'opacity' | 'white'", defaultValue: "'greyBg'", description: "trend badge 外观。" },
  { attr: "onKebabClick", type: "() => void", defaultValue: "—", description: "右上角三点菜单回调。" },
];

// ProgressStatCard
const CODE_PROGRESS_STAT_USAGE = `<ProgressStatCard
  title="Active Users"
  value="1,250"
  trend="12%"
  subtitle="+150 today"
  theme="purple"
  progressValue={65}
  progressColor="yellow"
/>`;

const PROGRESS_STAT_PROPS: ApiTableRow[] = [
  { attr: "title / value / trend / subtitle / theme / size / width / icon", type: "同 StatCard", defaultValue: "—", description: "基础字段与 StatCard 一致。" },
  { attr: "progressValue", type: "number", defaultValue: "0", description: "进度条数值 0-100。" },
  { attr: "progressColor", type: "ProgressColor", defaultValue: "'purple'", description: "进度条颜色。" },
];

// Chart Stat 家族（共享 Props）
const CODE_CHART_USAGE = `<LineChartStatCard chartColor="purple" ... />
<WheelChartStatCard wheelPercent={75} wheelColor="blue" ... />
<BarChartStatCard barColor="green" ... />`;

const LINE_CHART_STAT_PROPS: ApiTableRow[] = [
  { attr: "title / value / subtitle", type: "string", defaultValue: "—", description: "基础文案。" },
  { attr: "trend", type: "string", defaultValue: "—", description: "趋势文案，如 +10%。" },
  { attr: "trendDirection", type: "'up' | 'down'", defaultValue: "'up'", description: "趋势方向。" },
  { attr: "theme", type: "'white' | 'dark' | 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'white'", description: "卡片主题色。" },
  { attr: "size", type: "'sm' | 'lg' | 'wide'", defaultValue: "'sm'", description: "控制内部密度和图表布局（无 md 档）。" },
  { attr: "width", type: "'full' | 'fixed'", defaultValue: "'full'", description: "默认填满 grid/flex 列；仅组件展示原始 Figma 尺寸时用 fixed。" },
  { attr: "chartColor", type: "'purple' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'purple'", description: "折线与渐变底色。" },
  { attr: "chartDirection", type: "'up' | 'down'", defaultValue: "'up'", description: "折线走势方向。" },
];

const WHEEL_CHART_STAT_PROPS: ApiTableRow[] = [
  { attr: "title / value / subtitle", type: "string", defaultValue: "—", description: "基础文案。" },
  { attr: "trend", type: "string", defaultValue: "—", description: "趋势文案。" },
  { attr: "trendDirection", type: "'up' | 'down'", defaultValue: "'up'", description: "趋势方向。" },
  { attr: "theme", type: "'white' | 'dark' | 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'white'", description: "卡片主题色。" },
  { attr: "size", type: "'sm' | 'lg' | 'wide'", defaultValue: "'sm'", description: "控制内部密度和图表布局（无 md 档）。" },
  { attr: "width", type: "'full' | 'fixed'", defaultValue: "'full'", description: "默认填满 grid/flex 列；仅组件展示原始 Figma 尺寸时用 fixed。" },
  { attr: "wheelColor", type: "'purple' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'purple'", description: "甜甜圈主色。" },
  { attr: "wheelPercent", type: "number", defaultValue: "70", description: "0-100 填充百分比。" },
];

const BAR_CHART_STAT_PROPS: ApiTableRow[] = [
  { attr: "title / value / subtitle", type: "string", defaultValue: "—", description: "基础文案。" },
  { attr: "trend", type: "string", defaultValue: "—", description: "趋势文案。" },
  { attr: "trendDirection", type: "'up' | 'down'", defaultValue: "'up'", description: "趋势方向。" },
  { attr: "theme", type: "'white' | 'dark' | 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'white'", description: "卡片主题色。" },
  { attr: "size", type: "'sm' | 'lg' | 'wide'", defaultValue: "'sm'", description: "控制内部密度和图表布局（无 md 档）。" },
  { attr: "width", type: "'full' | 'fixed'", defaultValue: "'full'", description: "默认填满 grid/flex 列；仅组件展示原始 Figma 尺寸时用 fixed。" },
  { attr: "barColor", type: "'purple' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'purple'", description: "柱子主色。" },
  { attr: "bars", type: "number[]", defaultValue: "[16,24,32,20,40]", description: "迷你柱状图数据数组。" },
];

// ImageStatCard
const CODE_IMAGE_STAT_USAGE = `<ImageStatCard
  title="Total Revenue"
  subtitle="2 Jul - Today"
  value="$14,000"
  trend="10%"
  trendSubtitle="+$150 today"
  theme="purple"
  avatars={[...]}
/>`;

const IMAGE_STAT_PROPS: ApiTableRow[] = [
  { attr: "title / subtitle / value / trend / theme", type: "同 StatCard", defaultValue: "—", description: "基础字段。" },
  { attr: "size", type: "'lg' | 'wide'", defaultValue: "'lg'", description: "内部布局尺寸。" },
  { attr: "width", type: "'full' | 'fixed'", defaultValue: "'full'", description: "默认填满 grid/flex 列；仅组件展示原始 Figma 尺寸时用 fixed。" },
  { attr: "trendSubtitle", type: "string", defaultValue: "—", description: "趋势下方的小字。" },
  { attr: "avatars", type: "string[]", defaultValue: "—", description: "右侧用户头像组 URL 列表。" },
  { attr: "onKebabClick", type: "() => void", defaultValue: "—", description: "kebab 回调。" },
];

// BalanceCard / DebitCard / CreditCard
const CODE_FINANCIAL_USAGE = `<BalanceCard balance="$21,500" trend="10%" theme="purple" cardNumber="9821" />
<DebitCard balance="$1,200.00" cardNumber="9090" expiry="07/25" theme="blue" variant="glow" />
<CreditCard cardNumber="9090" holderName="John Doe" expiry="07/25" theme="dark" variant="gradient" />`;

const BALANCE_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "'Total Balance'", description: "卡片标题。" },
  { attr: "balance", type: "string", defaultValue: "—", description: "余额文本。" },
  { attr: "trend / trendDirection", type: "string / 'up' | 'down'", defaultValue: "— / 'up'", description: "右上角趋势。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "副文案。" },
  { attr: "theme", type: "'white' | 'dark' | 'purple' | 'blue' | 'green' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'white'", description: "卡片主题色。" },
  { attr: "balanceHidden", type: "boolean", defaultValue: "false", description: "是否遮掩数字（用 •• 替代）。" },
  { attr: "cardNumber", type: "string", defaultValue: "—", description: "卡号末 4 位。" },
  { attr: "cardIcon", type: "string", defaultValue: "—", description: "卡号旁的品牌 icon 图片 URL（24×24 渲染）。" },
  { attr: "onTransfer / onRequest", type: "() => void", defaultValue: "—", description: "Transfer / Request 按钮回调。" },
  { attr: "width", type: "'full' | 'fixed'", defaultValue: "'full'", description: "默认填满 dashboard/grid 单元；仅组件展示原始尺寸时用 fixed。" },
];

const DEBIT_PROPS: ApiTableRow[] = [
  { attr: "balance", type: "string", defaultValue: "'$1,200.00'", description: "余额文本。" },
  { attr: "cardNumber", type: "string", defaultValue: "'9090'", description: "卡号末 4 位。" },
  { attr: "expiry", type: "string", defaultValue: "'07/25'", description: "有效期。" },
  { attr: "theme", type: "'dark' | 'purple' | 'blue' | 'green' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'dark'", description: "主题色（7 种，无 white）。" },
  { attr: "variant", type: "'glow' | 'gradient' | 'flat'", defaultValue: "'glow'", description: "背景质感：发光 / 渐变 / 纯色。" },
];

const CREDIT_PROPS: ApiTableRow[] = [
  { attr: "cardNumber", type: "string", defaultValue: "'9090'", description: "卡号末 4 位。" },
  { attr: "holderName", type: "string", defaultValue: "'John Doe'", description: "持卡人姓名。" },
  { attr: "expiry", type: "string", defaultValue: "'07/25'", description: "有效期。" },
  { attr: "theme", type: "'dark' | 'purple' | 'blue' | 'green' | 'orange' | 'yellow' | 'cyan'", defaultValue: "'dark'", description: "主题色（7 种，无 white）。" },
  { attr: "variant", type: "'glow' | 'gradient' | 'flat'", defaultValue: "'glow'", description: "背景质感：发光 / 渐变 / 纯色。" },
];

// ProjectCard / TaskCard
const CODE_PROJECT_USAGE = `<ProjectCard
  title="Website Redesign"
  description="Landing + marketing pages"
  labelText="In Progress"
  labelColor="purple"
  progress={65}
  progressColor="purple"
  avatars={avatars}
  date="21 Oct 2022"
  onMenuClick={() => {}}
/>`;

const PROJECTCARD_PROPS: ApiTableRow[] = [
  { attr: "logo", type: "string", defaultValue: "—", description: "左上方 48×48 logo 图片 URL。" },
  { attr: "title", type: "string", defaultValue: "—", description: "项目标题（必填）。" },
  { attr: "description", type: "string", defaultValue: "—", description: "项目描述（可选，最多 2 行）。" },
  { attr: "labelText", type: "string", defaultValue: "—", description: "右上 label 文案。" },
  { attr: "labelColor", type: "string", defaultValue: "'bg-fg-grey-700'", description: "label 背景色 class（Tailwind bg-*）。" },
  { attr: "progress", type: "number", defaultValue: "0", description: "进度 0-100。" },
  { attr: "progressColor", type: "'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'cyan' | 'gray'", defaultValue: "'purple'", description: "进度条主色。" },
  { attr: "avatars", type: "string[]", defaultValue: "[]", description: "参与者头像 URL 列表。" },
  { attr: "overflowCount", type: "number", defaultValue: "—", description: "尾部 +N 圆，传 > 0 时显示。" },
  { attr: "date", type: "string", defaultValue: "—", description: "右下角日期文案。" },
  { attr: "onMenuClick", type: "() => void", defaultValue: "—", description: "右上 kebab 回调，传后才显示。" },
  { attr: "width", type: "'full' | 'fixed'", defaultValue: "'full'", description: "默认填满项目 grid/看板列；仅组件展示原始尺寸时用 fixed。" },
];

const TASKCARD_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "任务标题（必填）。" },
  { attr: "description", type: "string", defaultValue: "—", description: "任务描述（可选）。" },
  { attr: "labelText", type: "string", defaultValue: "—", description: "顶部 label 文案。" },
  { attr: "labelColor", type: "string", defaultValue: "'bg-fg-red'", description: "label 背景色 class。" },
  { attr: "progress", type: "number", defaultValue: "0", description: "进度 0-100。" },
  { attr: "progressColor", type: "'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'cyan' | 'gray'", defaultValue: "'purple'", description: "进度条主色。" },
  { attr: "avatars", type: "string[]", defaultValue: "[]", description: "参与者头像 URL 列表。" },
  { attr: "overflowCount", type: "number", defaultValue: "—", description: "尾部 +N 圆。" },
  { attr: "date", type: "string", defaultValue: "—", description: "右下角日期文案。" },
  { attr: "onMenuClick", type: "() => void", defaultValue: "—", description: "右上 kebab 回调。" },
  { attr: "width", type: "'full' | 'fixed'", defaultValue: "'full'", description: "默认填满任务列；仅组件展示原始尺寸时用 fixed。" },
];

// UserCard
const CODE_USER_USAGE = `<UserCard
  avatar="https://..."
  name="Mohammad Karim"
  badge={<Label color="purple" size="sm">Pro</Label>}
  stats={[{ label: "Level", value: "12,091" }]}
  onMenuClick={() => {}}
/>`;

const USER_PROPS: ApiTableRow[] = [
  { attr: "avatar", type: "string", defaultValue: "—", description: "头像图片 URL；没有时传 initials。" },
  { attr: "initials", type: "string", defaultValue: "—", description: "无头像时显示的姓名首字母。" },
  { attr: "initialsColor", type: "AvatarInitialColor", defaultValue: "'purple'", description: "initials 背景色。" },
  { attr: "name", type: "string", defaultValue: "—", description: "用户名。" },
  { attr: "badge", type: "ReactNode", defaultValue: "—", description: "右上角标签，一般放 <Label />。" },
  { attr: "stats", type: "{ label: string; value: string }[]", defaultValue: "—", description: "下方统计信息。" },
  { attr: "onMenuClick", type: "() => void", defaultValue: "—", description: "kebab 回调。" },
];

// FileCard
const CODE_FILE_USAGE = `<FileCard file={{ id: "1", name: "Report.doc", size: "300 KB" }} />
<FileCard file={{ id: "2", name: "Upload.pdf", size: "800 KB", state: "uploading" }} />
<FileCard file={{ id: "3", name: "Failed.zip", size: "2 MB", state: "error" }} onRetry={...} onRemove={...} />`;

const FILE_PROPS: ApiTableRow[] = [
  { attr: "file", type: "{ id, name, size, state? }", defaultValue: "—", description: "文件数据，state 可为 success / uploading / error。" },
  { attr: "onRetry", type: "(id: string) => void", defaultValue: "—", description: "error 态的重试回调。" },
  { attr: "onRemove", type: "(id: string) => void", defaultValue: "—", description: "删除回调。" },
];

// HighlightCard
const HIGHLIGHT_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "卡片标题。" },
  { attr: "theme", type: "CardTheme", defaultValue: "'purple'", description: "主题色。" },
  { attr: "image", type: "string", defaultValue: "—", description: "主展示图 URL。" },
  { attr: "annotations", type: "{ label, value, position }[]", defaultValue: "—", description: "图片上的浮动注解。" },
  { attr: "products", type: "{ image, name, subtitle?, value }[]", defaultValue: "—", description: "下方的产品缩略图列表。" },
];

// ActivityCard
const ACTIVITY_PROPS: ApiTableRow[] = [
  { attr: "icon", type: "ReactNode", defaultValue: "—", description: "顶部类型图标。" },
  { attr: "headerText", type: "string", defaultValue: "—", description: "顶部描述，如「Meet schedule created by James」。" },
  { attr: "datetime", type: "string", defaultValue: "—", description: "顶部时间戳。" },
  { attr: "avatar", type: "string", defaultValue: "—", description: "创建者头像。" },
  { attr: "title / description", type: "string", defaultValue: "—", description: "正文标题与描述。" },
  { attr: "metadata", type: "{ label, value }[]", defaultValue: "—", description: "底部键值对。" },
  { attr: "onMenuClick", type: "() => void", defaultValue: "—", description: "kebab 回调。" },
];

// ProgressCard
const PROGRESS_CARD_PROPS: ApiTableRow[] = [
  { attr: "title / value / subtitle / theme", type: "同 StatCard", defaultValue: "—", description: "基础字段。" },
  { attr: "progress", type: "number", defaultValue: "0", description: "主进度条 0-100。" },
  { attr: "progressColor", type: "string", defaultValue: "'#7c3aed'", description: "主进度条颜色。" },
  { attr: "items", type: "{ label, value, color }[]", defaultValue: "—", description: "下方分项进度列表。" },
];

export default function CardCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Cards"
        hint="卡片家族：Stat 统计 · Chart Stat 图表统计 · Financial 金融 · Project / Task / User 业务 · Activity 事件 · File 文件 · Highlight 高亮。"
      />

      <Section
        title="StatCard"
        description="基础统计卡，8 主题 × 2 尺寸，支持 icon / kebab / badge 变体。"
      >
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            必填 <InlineCode>title</InlineCode> + <InlineCode>value</InlineCode>，其余可选。
          </p>
          <PreviewBlock code={CODE_STATCARD_USAGE} minHeight={220}>
            <StatCard
              title="Total Revenue"
              value="$14,000"
              trend="10%"
              subtitle="+$150 today"
              theme="purple"
              size="lg"
              icon={<ChartSquareBoldDuotone size={20} />}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="Themes" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            8 种主题色（white / dark / purple / blue / green / orange / yellow / cyan），这里示意 5 种。
          </p>
          <PreviewBlock code={CODE_STATCARD_THEMES} minHeight={260}>
            <div className="flex flex-wrap items-start gap-4">
              {(["white", "purple", "blue", "green", "dark"] as const).map((theme) => (
                <StatCard key={theme} title="Title" value="$1,000" trend="10%" subtitle="+$150 today" theme={theme} size="sm" />
              ))}
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Sizes" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>sm</InlineCode> 紧凑（dashboard 网格）/ <InlineCode>lg</InlineCode> 完整展开。
          </p>
          <PreviewBlock code={CODE_STATCARD_SIZES} minHeight={260}>
            <div className="flex flex-wrap items-start gap-4">
              <StatCard title="Title Here" value="$1,000" trend="10%" subtitle="+$150 today" theme="purple" size="sm" />
              <StatCard title="Total Revenue" value="$14,000" trend="10%" subtitle="+$150 today" theme="purple" size="lg" icon={<ChartSquareBoldDuotone size={20} />} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={STATCARD_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="ProgressStatCard"
        description="StatCard 加上一条水平进度条，用于表达配额或进度。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            继承 StatCard 所有字段，新增 <InlineCode>progressValue</InlineCode> 与 <InlineCode>progressColor</InlineCode>。
          </p>
          <PreviewBlock code={CODE_PROGRESS_STAT_USAGE} minHeight={220}>
            <ProgressStatCard
              title="Active Users"
              value="1,250"
              trend="12%"
              subtitle="+150 today"
              theme="purple"
              size="lg"
              progressValue={65}
              progressColor="yellow"
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={PROGRESS_STAT_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="Chart Stat Cards"
        description="三种带 mini chart 的统计卡：折线 / 甜甜圈 / 柱状。基础字段一致，chart 字段各不同。"
      >
        <SubSectionGrid cols={2}>
        <SubSection title="LineChartStatCard" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            底部嵌入迷你折线，<InlineCode>chartColor</InlineCode> 决定线条色。
          </p>
          <PreviewBlock code={CODE_CHART_USAGE} minHeight={220}>
            <LineChartStatCard
              title="Total Revenue"
              value="$14,000"
              trend="10%"
              subtitle="+$150 today"
              theme="purple"
              size="lg"
              chartColor="purple"
            />
          </PreviewBlock>
          <ApiTable rows={LINE_CHART_STAT_PROPS} />
        </SubSection>

        <SubSection title="WheelChartStatCard" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            甜甜圈环形进度，<InlineCode>wheelPercent</InlineCode> 控制填充比例。
          </p>
          <PreviewBlock code={CODE_CHART_USAGE} minHeight={220}>
            <WheelChartStatCard
              title="Storage Used"
              value="72%"
              trend="5%"
              subtitle="Out of 1 TB"
              theme="blue"
              size="lg"
              wheelPercent={72}
              wheelColor="blue"
            />
          </PreviewBlock>
          <ApiTable rows={WHEEL_CHART_STAT_PROPS} />
        </SubSection>

        <SubSection title="BarChartStatCard" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            迷你柱状图，<InlineCode>barColor</InlineCode> 控制柱色。
          </p>
          <PreviewBlock code={CODE_CHART_USAGE} minHeight={220}>
            <BarChartStatCard
              title="Sessions"
              value="12,480"
              trend="8%"
              subtitle="vs last week"
              theme="green"
              size="lg"
              barColor="green"
            />
          </PreviewBlock>
          <ApiTable rows={BAR_CHART_STAT_PROPS} />
        </SubSection>
        </SubSectionGrid>
      </Section>

      <Section
        title="ImageStatCard"
        description="大号统计卡，右侧挂头像组，强调团队场景。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>avatars</InlineCode> 为 URL 数组，右上角自动叠圈。
          </p>
          <PreviewBlock code={CODE_IMAGE_STAT_USAGE} minHeight={220}>
            <ImageStatCard
              title="Total Revenue"
              subtitle="2 Jul - Today"
              value="$14,000"
              trend="10%"
              trendSubtitle="+$150 today"
              theme="purple"
              avatars={avatarSet}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={IMAGE_STAT_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="Financial Cards"
        description="BalanceCard / DebitCard / CreditCard —— 三类金融展示卡，7 种主题色，Debit/Credit 再分 glow / gradient / flat 三种质感。"
      >
        <SubSectionGrid cols={2}>
        <SubSection title="BalanceCard" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            余额卡 + Transfer/Request 动作。<InlineCode>balanceHidden</InlineCode> 可隐藏数字。
          </p>
          <PreviewBlock code={CODE_FINANCIAL_USAGE} minHeight={220}>
            <BalanceCard balance="$21,500" trend="10%" subtitle="+$150 today" theme="purple" cardNumber="9821" onTransfer={() => {}} onRequest={() => {}} />
          </PreviewBlock>
          <ApiTable rows={BALANCE_PROPS} />
        </SubSection>

        <SubSection title="DebitCard" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            借记卡，展示余额 + 卡号 + 有效期。<InlineCode>variant</InlineCode> 控制质感（glow / gradient / flat）。
          </p>
          <PreviewBlock code={CODE_FINANCIAL_USAGE} minHeight={220}>
            <DebitCard balance="$1,200.00" cardNumber="9090" expiry="07/25" theme="blue" variant="glow" />
          </PreviewBlock>
          <ApiTable rows={DEBIT_PROPS} />
        </SubSection>

        <SubSection title="CreditCard" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            信用卡，无余额字段，多一个 <InlineCode>holderName</InlineCode> 持卡人姓名。
          </p>
          <PreviewBlock code={CODE_FINANCIAL_USAGE} minHeight={220}>
            <CreditCard cardNumber="9090" holderName="John Doe" expiry="07/25" theme="dark" variant="glow" />
          </PreviewBlock>
          <ApiTable rows={CREDIT_PROPS} />
        </SubSection>
        </SubSectionGrid>
      </Section>

      <Section
        title="ProgressCard"
        description="带分项进度条的汇总卡，适合任务拆解 / 执行进度总览。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            主进度 + <InlineCode>items</InlineCode> 分项，每项有独立颜色。
          </p>
          <PreviewBlock code={`<ProgressCard title="Task Progress" value="75%" progress={75} items={[...]} />`} minHeight={220}>
            <ProgressCard
              title="Task Progress"
              value="75%"
              subtitle="Updated today"
              theme="white"
              progress={75}
              progressColor="#7c3aed"
              items={[
                { label: "Design", value: "100%", color: "#10b981" },
                { label: "Dev", value: "60%", color: "#7c3aed" },
                { label: "QA", value: "20%", color: "#f59e0b" },
              ]}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={PROGRESS_CARD_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="ProjectCard / TaskCard"
        description="两个业务卡：ProjectCard 带 logo，TaskCard 无 logo。业务页面默认填满父级列，组件展示才使用 fixed 原始尺寸。"
      >
        <SubSectionGrid cols={2}>
        <SubSection title="ProjectCard" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            项目卡：左上 logo + 标题 + 描述 + 进度 + 成员。
          </p>
          <PreviewBlock code={CODE_PROJECT_USAGE} minHeight={240}>
            <ProjectCard title="Website Redesign" description="Landing + marketing pages" labelText="In Progress" labelColor="purple" progress={65} progressColor="purple" avatars={avatarSet} date="21 Oct 2022" onMenuClick={() => {}} />
          </PreviewBlock>
          <ApiTable rows={PROJECTCARD_PROPS} />
        </SubSection>

        <SubSection title="TaskCard" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            任务卡：无 logo，label 在顶部独立一行，适合填满任务板列。
          </p>
          <PreviewBlock code={CODE_PROJECT_USAGE} minHeight={240}>
            <TaskCard title="Design review" description="Ship spec by EOW" labelText="Label" labelColor="red" progress={50} progressColor="yellow" avatars={avatarSet} date="21 Oct 2022" onMenuClick={() => {}} />
          </PreviewBlock>
          <ApiTable rows={TASKCARD_PROPS} />
        </SubSection>
        </SubSectionGrid>
      </Section>

      <Section
        title="UserCard"
        description="个人卡，支持头像或首字母底色，展示姓名 + 徽章 + 自定义统计字段。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            优先使用 <InlineCode>avatar</InlineCode>，退化到 <InlineCode>initials</InlineCode>。
          </p>
          <PreviewBlock code={CODE_USER_USAGE} minHeight={280}>
            <div className="flex flex-wrap items-start gap-4">
              <UserCard avatar="https://i.pravatar.cc/160?u=u1" name="Mohammad Karim" badge={<Label color="purple" size="sm">Pro</Label>} stats={[{ label: "Level", value: "12,091" }, { label: "Exp", value: "$12,091" }]} onMenuClick={() => {}} />
              <UserCard initials="LB" initialsColor="blue" name="Linda Blair" badge={<Label color="blue" size="sm">Label</Label>} stats={[{ label: "Level", value: "12,091" }]} onMenuClick={() => {}} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={USER_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="FileCard"
        description="文件卡片，根据扩展名展示对应图标，支持 success / uploading / error 三种状态。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>file</InlineCode> 对象内带 <InlineCode>state</InlineCode> 决定视觉。
          </p>
          <PreviewBlock code={CODE_FILE_USAGE} minHeight={220}>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-md">
              <FileCard file={{ id: "1", name: "Report.doc", size: "300 KB" }} />
              <FileCard file={{ id: "2", name: "Uploading.pdf", size: "800 KB", state: "uploading" }} />
              <FileCard file={{ id: "3", name: "Failed.zip", size: "2 MB", state: "error" }} onRetry={() => {}} onRemove={() => {}} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={FILE_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="HighlightCard"
        description="高亮展示卡，主图 + 浮动注解 + 底部产品列表，常用于电商榜单。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>annotations</InlineCode> 数组项带 position，可绝对定位在主图上。
          </p>
          <PreviewBlock code={`<HighlightCard title="Top Product" theme="purple" image="..." annotations={[...]} products={[...]} />`} minHeight={340}>
            <HighlightCard
              title="Top Product"
              theme="purple"
              image="https://picsum.photos/400/300?random=highlight"
              annotations={[
                { label: "JBL Earnote Pro 2", value: "340 Sales | $26,982", position: { bottom: "12px", left: "12px" } },
              ]}
              products={[
                { image: "https://picsum.photos/80/80?random=p1", name: "Logic Wireless Mouse", subtitle: "140 Sales", value: "$17,678" },
                { image: "https://picsum.photos/80/80?random=p2", name: "PS Controller", subtitle: "105 Sales", value: "$5,500" },
              ]}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={HIGHLIGHT_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="ActivityCard"
        description="事件流卡片，顶部事件类型 + 时间，中部标题描述，底部键值对。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            按事件类型传不同 icon，<InlineCode>metadata</InlineCode> 为 label/value 对。
          </p>
          <PreviewBlock code={`<ActivityCard icon={...} title="Meet Title" metadata={[...]} ... />`} minHeight={320}>
            <div className="flex flex-wrap items-start gap-4">
              <ActivityCard
                icon={<VideocameraBoldDuotone size={20} className="text-fg-violet" />}
                headerText="Meet schedule created James William"
                datetime="14 Jan 2025, 10:00"
                avatar="https://i.pravatar.cc/40?u=a1"
                title="Meet Title"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                metadata={[
                  { label: "Date", value: "14 Feb 2025, 14:00" },
                  { label: "Purpose", value: "Follow Up" },
                ]}
                onMenuClick={() => {}}
              />
              <ActivityCard
                icon={<PhoneBoldDuotone size={20} className="text-emerald-500" />}
                headerText="Call schedule created James William"
                datetime="14 Jan 2025, 10:00"
                avatar="https://i.pravatar.cc/40?u=a2"
                title="Call Title"
                description="Lorem ipsum dolor sit amet."
                metadata={[{ label: "Date", value: "14 Feb 2025, 14:00" }]}
                onMenuClick={() => {}}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={ACTIVITY_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/card" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
