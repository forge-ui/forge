"use client";

import Link from "next/link";
import {
  ChartTooltip,
  ChartCard,
  ChartListItem,
  ChartLegendItem,
  ChartValueRow,
  ChartStatFooter,
  MeterChart,
  HalfDonutChart,
  DashedHalfDonutChart,
  DonutChart,
  PieChart,
  MultilayerDonutChart,
  BubbleChart,
  BarChart,
  BarHorizontalChart,
  BarUpsideDownChart,
  SmoothLineChart,
} from "@forge-ui/react";
import { WalletLinear } from "solar-icon-set";
import { PageHeading, Section, SubSection, SubSectionGrid } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import {
  ChartTooltip, ChartCard, ChartListItem, ChartLegendItem, ChartValueRow, ChartStatFooter,
  MeterChart, HalfDonutChart, DashedHalfDonutChart, DonutChart, PieChart,
  MultilayerDonutChart, BubbleChart, BarChart, BarHorizontalChart, BarUpsideDownChart,
  SmoothLineChart,
} from "@forge-ui/react";`;

const CODE_TOOLTIP = `<ChartTooltip
  items={[
    { color: "bg-fg-violet", label: "Revenue", value: "$4,200", trend: "up" },
    { color: "bg-blue-600", label: "Expenses", value: "$1,800", trend: "down" },
  ]}
/>`;

const CODE_CARD = `<ChartCard title="Revenue" subtitle="Monthly" size="4col">
  <DonutChart segments={[{ value: 60 }, { value: 40 }]} centerValue="$8.4k" size="sm" />
</ChartCard>`;

const CODE_LISTITEM = `<ChartListItem icon={WalletLinear} title="Revenue" subtitle="This month" value="$12,500" trend="+12.5%" trendDirection="up" />`;

const CODE_LEGEND = `<ChartLegendItem color="bg-fg-violet" label="Revenue" value="$4,200" />`;

const CODE_VALUEROW = `<ChartValueRow label="Revenue" value="$12,500" color="bg-fg-violet" />`;

const CODE_STATFOOTER = `<ChartStatFooter
  items={[
    { label: "Revenue", value: "$12.5k", color: "bg-fg-violet", trend: "+12%", trendDirection: "up" },
    { label: "Profit", value: "$9.3k", color: "bg-emerald-500", trend: "+18%", trendDirection: "up" },
  ]}
/>`;

const CODE_METER = `<MeterChart segments={[{ value: 50 }, { value: 30 }, { value: 20 }]} trend="10%" trendDirection="up" subtitle="+$181 today" />`;

const CODE_HALFDONUT = `<HalfDonutChart segments={[{ value: 75 }]} centerValue="75%" trend="10%" trendDirection="up" />`;

const CODE_DASHED = `<DashedHalfDonutChart segments={[{ value: 60 }]} centerValue="60%" />`;

const CODE_DONUT = `<DonutChart segments={[{ value: 40 }, { value: 30 }, { value: 30 }]} centerValue="$8.4k" size="sm" />`;

const CODE_PIE = `<PieChart segments={[{ value: 40 }, { value: 30 }, { value: 30 }]} size="sm" />`;

const CODE_MULTI = `<MultilayerDonutChart
  layers={[
    { value: 80 },
    { value: 60 },
    { value: 40 },
  ]}
  centerValue="80%"
/>`;

const CODE_BUBBLE = `<BubbleChart bubbles={[{ value: 40 }, { value: 25 }, { value: 15 }]} />`;

const CODE_BAR = `<BarChart data={[{ value: 20 }, { value: 45 }, { value: 30 }, { value: 60 }]} activeIndex={3} />`;

const CODE_BAR_H = `<BarHorizontalChart data={[{ label: "A", value: 80 }, { label: "B", value: 50 }]} />`;

const CODE_BAR_UD = `<BarUpsideDownChart data={[
  { upperValue: 30, lowerValue: 20 },
  { upperValue: 50, lowerValue: 35 },
  { upperValue: 20, lowerValue: 10 },
]} />`;

const CODE_LINE = `<SmoothLineChart series={[{ data: [10, 20, 15, 25, 18, 30, 22] }]} />`;

// 一个通用的 prop 说明，chart 系列 prop 集合比较多，挑有意义的
const TOOLTIP_PROPS: ApiTableRow[] = [
  { attr: "items", type: "ChartTooltipItem[]", defaultValue: "—", description: "tooltip 行数组 { color, label?, value, trend? }。" },
];

const CARD_PROPS: ApiTableRow[] = [
  { attr: "title / subtitle", type: "string", defaultValue: "—", description: "卡片头部。" },
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "主 chart 区。" },
  { attr: "footer", type: "ReactNode", defaultValue: "—", description: "底部槽（通常是 ChartStatFooter）。" },
  { attr: "size", type: "'4col' | '6col' | '8col' | 'full'", defaultValue: "'4col'", description: "宽度预设。" },
  { attr: "onMenuClick", type: "() => void", defaultValue: "—", description: "右上 menu 点击。" },
];

// Donut 系列 ───────────────────────────────────

const METER_PROPS: ApiTableRow[] = [
  { attr: "segments", type: "{ value, color? }[]", defaultValue: "—", description: "水平进度分段。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "ramp 主色。" },
  { attr: "trend", type: "string", defaultValue: "—", description: "右上角趋势文案。" },
  { attr: "trendDirection", type: "'up' | 'down'", defaultValue: "—", description: "趋势方向，决定颜色与箭头。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "底部副文案。" },
  { attr: "height", type: "string", defaultValue: "'h-24'", description: "Meter 条高度 class。" },
];

const HALFDONUT_PROPS: ApiTableRow[] = [
  { attr: "segments", type: "{ value, color? }[]", defaultValue: "—", description: "半圆各段。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "ramp 主色。" },
  { attr: "centerValue", type: "string", defaultValue: "—", description: "中心大数字。" },
  { attr: "trend / trendDirection", type: "string / 'up' | 'down'", defaultValue: "—", description: "趋势提示。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "中心副文案。" },
  { attr: "trackColor", type: "string", defaultValue: "—", description: "未填充段轨道色，默认取 accent 最浅档。" },
];

const DASHEDHALFDONUT_PROPS: ApiTableRow[] = [
  { attr: "segments", type: "{ value, color? }[]", defaultValue: "—", description: "虚线分段。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "ramp 主色。" },
  { attr: "centerValue", type: "string", defaultValue: "—", description: "中心大数字。" },
  { attr: "trend / trendDirection", type: "string / 'up' | 'down'", defaultValue: "—", description: "趋势提示。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "中心副文案。" },
  { attr: "trackColor", type: "string", defaultValue: "—", description: "轨道色。" },
];

const DONUT_PROPS: ApiTableRow[] = [
  { attr: "segments", type: "{ value, color? }[]", defaultValue: "—", description: "环形分段。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "ramp 主色。" },
  { attr: "centerValue", type: "string", defaultValue: "—", description: "中心大数字。" },
  { attr: "trend / trendDirection", type: "string / 'up' | 'down'", defaultValue: "—", description: "趋势提示。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "中心副文案。" },
  { attr: "size", type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: "外径尺寸。" },
  { attr: "trackColor", type: "string", defaultValue: "—", description: "未填充段色，默认 fg-grey-200。" },
];

const PIE_PROPS: ApiTableRow[] = [
  { attr: "segments", type: "{ value, color? }[]", defaultValue: "—", description: "饼图分段。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "ramp 主色。" },
  { attr: "size", type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: "饼图尺寸。" },
  { attr: "trackColor", type: "string", defaultValue: "—", description: "占位轨道色，默认 fg-grey-200。" },
];

const MULTILAYER_PROPS: ApiTableRow[] = [
  { attr: "layers", type: "{ value, color? }[]", defaultValue: "—", description: "多层环形数据，第 1 层最外。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "ramp 主色。" },
  { attr: "centerValue", type: "string", defaultValue: "—", description: "中心大数字。" },
  { attr: "trend / trendDirection", type: "string / 'up' | 'down'", defaultValue: "—", description: "趋势提示。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "中心副文案。" },
];

// Bar / Bubble 系列 ────────────────────────────

const BARCHART_PROPS: ApiTableRow[] = [
  { attr: "data", type: "{ value, label? }[]", defaultValue: "—", description: "柱子数据。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "柱子主色。" },
  { attr: "activeIndex", type: "number", defaultValue: "—", description: "高亮柱子下标。" },
  { attr: "color / inactiveColor", type: "string", defaultValue: "—", description: "覆盖柱子 / 非高亮柱色（Tailwind bg-* class）。" },
  { attr: "barWidth", type: "'thin' | 'wide'", defaultValue: "'thin'", description: "柱子宽度档位。" },
  { attr: "showLabels", type: "boolean", defaultValue: "false", description: "是否显示 X 轴标签。" },
  { attr: "showTooltip", type: "boolean", defaultValue: "false", description: "是否显示 active 柱上方 tooltip。" },
  { attr: "tooltipValue / tooltipTrend", type: "string / 'up' | 'down'", defaultValue: "—", description: "tooltip 数值 + 趋势方向。" },
  { attr: "height", type: "string", defaultValue: "'h-36'", description: "柱子区高度 class。" },
];

const BARHORIZ_PROPS: ApiTableRow[] = [
  { attr: "data", type: "{ value, label? }[]", defaultValue: "—", description: "横向柱数据。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "柱子主色。" },
  { attr: "activeIndex", type: "number", defaultValue: "—", description: "高亮柱子下标。" },
  { attr: "color / inactiveColor", type: "string", defaultValue: "—", description: "覆盖柱子 / 非高亮柱色。" },
  { attr: "barWidth", type: "'thin' | 'wide'", defaultValue: "'thin'", description: "柱子宽度档位。" },
  { attr: "showLabels", type: "boolean", defaultValue: "false", description: "是否显示标签。" },
  { attr: "showTooltip", type: "boolean", defaultValue: "false", description: "是否显示 tooltip。" },
  { attr: "tooltipValue / tooltipTrend", type: "string / 'up' | 'down'", defaultValue: "—", description: "tooltip 数值 + 趋势。" },
];

const BARUPSIDEDOWN_PROPS: ApiTableRow[] = [
  { attr: "data", type: "{ upperValue, lowerValue }[]", defaultValue: "—", description: "上下两段柱数据。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "柱子主色。" },
  { attr: "activeIndex", type: "number", defaultValue: "—", description: "高亮柱子下标。" },
  { attr: "upperColor / lowerColor", type: "string", defaultValue: "—", description: "上段 / 下段颜色覆盖。" },
  { attr: "barWidth", type: "'thin' | 'wide'", defaultValue: "'thin'", description: "柱子宽度档位。" },
  { attr: "showLabels", type: "boolean", defaultValue: "false", description: "是否显示 X 轴标签。" },
  { attr: "showTooltip", type: "boolean", defaultValue: "false", description: "是否显示 tooltip。" },
  { attr: "tooltipUpperValue / tooltipLowerValue / tooltipTrend", type: "string / 'up' | 'down'", defaultValue: "—", description: "tooltip 上下段数值 + 趋势。" },
  { attr: "height", type: "string", defaultValue: "'h-36'", description: "总高度 class。" },
];

const BUBBLE_PROPS: ApiTableRow[] = [
  { attr: "bubbles", type: "{ value, color? }[]", defaultValue: "—", description: "气泡数据（大小与 value 成比例）。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "气泡色 ramp。" },
  { attr: "height", type: "number", defaultValue: "240", description: "容器高度（像素）。" },
];

const LISTITEM_PROPS: ApiTableRow[] = [
  { attr: "icon", type: "ComponentType<{ size?, color? }>", defaultValue: "—", description: "传 solar-icon-set 组件本身（不实例化），accent 驱动颜色与底色。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "图标颜色 ramp。" },
  { attr: "title", type: "string", defaultValue: "—", description: "条目标题。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "副标题。" },
  { attr: "value", type: "string", defaultValue: "—", description: "右侧数值。" },
  { attr: "trend", type: "string", defaultValue: "—", description: "右侧趋势文案，如 +12.5%。" },
  { attr: "trendDirection", type: "'up' | 'down'", defaultValue: "—", description: "趋势方向，决定颜色与箭头。" },
];

const LEGEND_PROPS: ApiTableRow[] = [
  { attr: "color", type: "string", defaultValue: "—", description: "Tailwind bg-* class，覆盖 accent ramp。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "未传 color 时按 accent + shade 取色。" },
  { attr: "shade", type: "0 | 1 | 2 | 3 | 4", defaultValue: "0", description: "ramp 索引，0 最深 4 最浅。" },
  { attr: "label", type: "string", defaultValue: "—", description: "标签文案。" },
  { attr: "value", type: "string", defaultValue: "—", description: "右侧数值。" },
];

const VALUEROW_PROPS: ApiTableRow[] = [
  { attr: "value", type: "string", defaultValue: "—", description: "主数值（大字号）。" },
  { attr: "trend", type: "string", defaultValue: "—", description: "右侧趋势文案。" },
  { attr: "trendDirection", type: "'up' | 'down'", defaultValue: "—", description: "趋势方向，决定颜色与箭头。" },
  { attr: "color", type: "string", defaultValue: "—", description: "可选左侧 dot 颜色（Tailwind bg-* class）。" },
  { attr: "label", type: "string", defaultValue: "—", description: "可选左侧 label 文案。" },
];

const STATFOOTER_PROPS: ApiTableRow[] = [
  { attr: "items", type: "{ label, value, color?, trend?, trendDirection? }[]", defaultValue: "—", description: "footer 条目数组，每条 dot + 数值 + 趋势。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "items 缺省 color 时按 ramp 派生 dot 颜色。" },
];

const LINE_PROPS: ApiTableRow[] = [
  { attr: "series", type: "{ data: number[], color?, fillArea? }[]", defaultValue: "—", description: "多线数据。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "主色 ramp。" },
  { attr: "activeIndex", type: "number", defaultValue: "—", description: "高亮数据点下标。" },
  { attr: "showTooltip", type: "boolean", defaultValue: "false", description: "active 点上方显示 tooltip（需配合 tooltipItems）。" },
  { attr: "tooltipItems", type: "ChartTooltipItem[]", defaultValue: "—", description: "tooltip 内容数组，showTooltip 为 true 时必传，否则只显示 marker。" },
  { attr: "showYAxis", type: "boolean", defaultValue: "false", description: "是否显示 Y 轴。" },
  { attr: "yAxisLabels / xAxisLabels", type: "string[]", defaultValue: "—", description: "轴标签。" },
  { attr: "yDomain", type: "[min, max]", defaultValue: "auto", description: "Y 轴范围。" },
  { attr: "height", type: "string", defaultValue: "'h-32'", description: "图表高度 class。" },
];

export default function ChartCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Chart"
        hint="17 种 chart 构件：Tooltip / Card / 5 种 list 原子 + 11 种 chart 本体（Meter / HalfDonut / DashedHalfDonut / Donut / Pie / MultilayerDonut / Bubble / Bar / BarHorizontal / BarUpsideDown / SmoothLine）。"
      />

      <Section title="ChartTooltip" description="深色 tooltip，含颜色点 + 可选 label + 值 + 趋势箭头。">
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_TOOLTIP} minHeight={160}>
            <ChartTooltip
              items={[
                { color: "bg-fg-violet", label: "Revenue", value: "$4,200", trend: "up" },
                { color: "bg-blue-600", label: "Expenses", value: "$1,800", trend: "down" },
              ]}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={TOOLTIP_PROPS} />
        </SubSection>
      </Section>

      <Section title="ChartCard" description="白底卡片，装 chart 主体 + footer。4 种宽度预设。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_CARD} minHeight={360}>
            <ChartCard title="Revenue" subtitle="Monthly" size="4col">
              <DonutChart segments={[{ value: 60 }, { value: 40 }]} centerValue="$8.4k" size="sm" />
            </ChartCard>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={CARD_PROPS} />
        </SubSection>
      </Section>

      <Section title="List Atoms" description="五个 list 原子，常用在 ChartCard footer / 右侧 legend 区。">
        <SubSectionGrid cols={2}>
        <SubSection title="ChartListItem" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            带图标的 legend 行。<InlineCode>icon</InlineCode> 传 solar-icon-set 组件本身（不实例化）。
          </p>
          <PreviewBlock code={CODE_LISTITEM} minHeight={120}>
            <div className="w-72">
              <ChartListItem icon={WalletLinear} title="Revenue" subtitle="This month" value="$12,500" trend="+12.5%" trendDirection="up" />
            </div>
          </PreviewBlock>
          <ApiTable rows={LISTITEM_PROPS} />
        </SubSection>

        <SubSection title="ChartLegendItem" stack>
          <PreviewBlock code={CODE_LEGEND} minHeight={120}>
            <div className="w-72">
              <ChartLegendItem color="bg-fg-violet" label="Revenue" value="$4,200" />
            </div>
          </PreviewBlock>
          <ApiTable rows={LEGEND_PROPS} />
        </SubSection>

        <SubSection title="ChartValueRow" stack>
          <PreviewBlock code={CODE_VALUEROW} minHeight={120}>
            <div className="w-64">
              <ChartValueRow label="Revenue" value="$12,500" color="bg-fg-violet" />
            </div>
          </PreviewBlock>
          <ApiTable rows={VALUEROW_PROPS} />
        </SubSection>

        <SubSection title="ChartStatFooter" stack>
          <PreviewBlock code={CODE_STATFOOTER} minHeight={140}>
            <div className="w-96">
              <ChartStatFooter
                items={[
                  { label: "Revenue", value: "$12.5k", color: "bg-fg-violet", trend: "+12%", trendDirection: "up" },
                  { label: "Profit", value: "$9.3k", color: "bg-emerald-500", trend: "+18%", trendDirection: "up" },
                ]}
              />
            </div>
          </PreviewBlock>
          <ApiTable rows={STATFOOTER_PROPS} />
        </SubSection>
        </SubSectionGrid>
      </Section>

      <Section title="Donut 系列" description="六种环形 chart：Meter（水平进度条）/ HalfDonut / DashedHalfDonut / Donut / Pie / MultilayerDonut。每个组件 props 各不相同，分别列出。">
        <SubSectionGrid cols={2}>
        <SubSection title="MeterChart" stack>
          <PreviewBlock code={CODE_METER} minHeight={140}>
            <div className="w-96">
              <MeterChart segments={[{ value: 50 }, { value: 30 }, { value: 20 }]} trend="10%" trendDirection="up" subtitle="+$181 today" />
            </div>
          </PreviewBlock>
          <ApiTable rows={METER_PROPS} />
        </SubSection>

        <SubSection title="HalfDonutChart" stack>
          <PreviewBlock code={CODE_HALFDONUT} minHeight={240}>
            <HalfDonutChart segments={[{ value: 75 }]} centerValue="75%" trend="10%" trendDirection="up" />
          </PreviewBlock>
          <ApiTable rows={HALFDONUT_PROPS} />
        </SubSection>

        <SubSection title="DashedHalfDonutChart" stack>
          <PreviewBlock code={CODE_DASHED} minHeight={240}>
            <DashedHalfDonutChart segments={[{ value: 60 }]} centerValue="60%" />
          </PreviewBlock>
          <ApiTable rows={DASHEDHALFDONUT_PROPS} />
        </SubSection>

        <SubSection title="DonutChart" stack>
          <PreviewBlock code={CODE_DONUT} minHeight={280}>
            <DonutChart segments={[{ value: 40 }, { value: 30 }, { value: 30 }]} centerValue="$8.4k" size="sm" />
          </PreviewBlock>
          <ApiTable rows={DONUT_PROPS} />
        </SubSection>

        <SubSection title="PieChart" stack>
          <PreviewBlock code={CODE_PIE} minHeight={280}>
            <PieChart segments={[{ value: 40 }, { value: 30 }, { value: 30 }]} size="sm" />
          </PreviewBlock>
          <ApiTable rows={PIE_PROPS} />
        </SubSection>

        <SubSection title="MultilayerDonutChart" stack>
          <PreviewBlock code={CODE_MULTI} minHeight={280}>
            <MultilayerDonutChart
              layers={[
                { value: 80 },
                { value: 60 },
                { value: 40 },
              ]}
              centerValue="80%"
            />
          </PreviewBlock>
          <ApiTable rows={MULTILAYER_PROPS} />
        </SubSection>
        </SubSectionGrid>
      </Section>

      <Section title="Bar / Bubble 系列" description="柱状与气泡图。每个组件 props 不同，分别列出。">
        <SubSectionGrid cols={2}>
        <SubSection title="BarChart" stack>
          <PreviewBlock code={CODE_BAR} minHeight={200}>
            <div className="w-96">
              <BarChart data={[{ value: 20 }, { value: 45 }, { value: 30 }, { value: 60 }, { value: 35 }]} activeIndex={3} />
            </div>
          </PreviewBlock>
          <ApiTable rows={BARCHART_PROPS} />
        </SubSection>

        <SubSection title="BarHorizontalChart" stack>
          <PreviewBlock code={CODE_BAR_H} minHeight={200}>
            <div className="w-96">
              <BarHorizontalChart data={[{ label: "A", value: 80 }, { label: "B", value: 50 }, { label: "C", value: 30 }]} />
            </div>
          </PreviewBlock>
          <ApiTable rows={BARHORIZ_PROPS} />
        </SubSection>

        <SubSection title="BarUpsideDownChart" stack>
          <PreviewBlock code={CODE_BAR_UD} minHeight={200}>
            <div className="w-96">
              <BarUpsideDownChart data={[
                { upperValue: 30, lowerValue: 20 },
                { upperValue: 50, lowerValue: 35 },
                { upperValue: 20, lowerValue: 15 },
                { upperValue: 60, lowerValue: 40 },
              ]} />
            </div>
          </PreviewBlock>
          <ApiTable rows={BARUPSIDEDOWN_PROPS} />
        </SubSection>

        <SubSection title="BubbleChart" stack>
          <PreviewBlock code={CODE_BUBBLE} minHeight={240}>
            <div className="w-96">
              <BubbleChart bubbles={[{ value: 40 }, { value: 25 }, { value: 15 }, { value: 10 }]} />
            </div>
          </PreviewBlock>
          <ApiTable rows={BUBBLE_PROPS} />
        </SubSection>
        </SubSectionGrid>
      </Section>

      <Section title="SmoothLineChart" description="平滑曲线，支持多 series、填充面积、x/y 轴标签、tooltip。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_LINE} minHeight={220}>
            <div className="w-[500px]">
              <SmoothLineChart series={[{ data: [10, 20, 15, 25, 18, 30, 22], fillArea: true }]} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={LINE_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/chart" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
