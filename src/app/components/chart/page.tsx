"use client";

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
} from "@forge-ui-official/core";
import { WalletLinear } from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample, ExampleGrid } from "../_doc-blocks";
import { PreviewBlock } from "../_preview-block";
import { CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import {
  ChartTooltip, ChartCard, ChartListItem, ChartLegendItem, ChartValueRow, ChartStatFooter,
  MeterChart, HalfDonutChart, DashedHalfDonutChart, DonutChart, PieChart,
  MultilayerDonutChart, BubbleChart, BarChart, BarHorizontalChart, BarUpsideDownChart,
  SmoothLineChart,
} from "@forge-ui-official/core";`;

const CODE_USAGE = `<ChartCard title="收入" subtitle="每月">
  <DonutChart segments={[{ value: 60 }, { value: 40 }]} centerValue="$8.4k" size="sm" />
</ChartCard>`;

const CODE_ACCENT = `<DonutChart accent="purple" segments={[{ value: 60 }, { value: 40 }]} centerValue="60%" size="sm" />
<DonutChart accent="blue" segments={[{ value: 60 }, { value: 40 }]} centerValue="60%" size="sm" />
<DonutChart accent="black" segments={[{ value: 60 }, { value: 40 }]} centerValue="60%" size="sm" />`;

const CODE_SIZE = `<DonutChart size="sm" ... />
<DonutChart size="md" ... />
<DonutChart size="lg" ... />`;

const CODE_TOOLTIP = `<ChartTooltip
  items={[
    { color: "bg-fg-violet", label: "收入", value: "$4,200", trend: "up" },
    { color: "bg-blue-600", label: "支出", value: "$1,800", trend: "down" },
  ]}
/>`;

const CODE_LISTITEM = `<ChartListItem icon={WalletLinear} title="收入" subtitle="本月" value="$12,500" trend="+12.5%" trendDirection="up" />`;

const CODE_LEGEND = `<ChartLegendItem color="bg-fg-violet" label="收入" value="$4,200" />`;

const CODE_VALUEROW = `<ChartValueRow label="收入" value="$12,500" color="bg-fg-violet" />`;

const CODE_STATFOOTER = `<ChartStatFooter
  items={[
    { label: "收入", value: "$12.5k", color: "bg-fg-violet", trend: "+12%", trendDirection: "up" },
    { label: "利润", value: "$9.3k", color: "bg-emerald-500", trend: "+18%", trendDirection: "up" },
  ]}
/>`;

const CODE_METER = `<MeterChart segments={[{ value: 50 }, { value: 30 }, { value: 20 }]} trend="10%" trendDirection="up" subtitle="今日增加 ¥181" />`;

const CODE_HALFDONUT = `<HalfDonutChart segments={[{ value: 75 }]} centerValue="75%" trend="10%" trendDirection="up" />`;

const CODE_DASHED = `<DashedHalfDonutChart segments={[{ value: 60 }]} centerValue="60%" />`;

const CODE_DONUT = `<DonutChart segments={[{ value: 40 }, { value: 30 }, { value: 30 }]} centerValue="$8.4k" size="sm" />`;

const CODE_PIE = `<PieChart segments={[{ value: 40 }, { value: 30 }, { value: 30 }]} size="sm" />`;

const CODE_MULTI = `<MultilayerDonutChart
  layers={[{ value: 80 }, { value: 60 }, { value: 40 }]}
  centerValue="80%"
/>`;

const CODE_BAR = `<BarChart data={[{ value: 20 }, { value: 45 }, { value: 30 }, { value: 60 }, { value: 35 }]} activeIndex={3} />`;

const CODE_BAR_H = `<BarHorizontalChart data={[{ label: "A", value: 80 }, { label: "B", value: 50 }, { label: "C", value: 30 }]} />`;

const CODE_BAR_UD = `<BarUpsideDownChart data={[
  { upperValue: 30, lowerValue: 20 },
  { upperValue: 50, lowerValue: 35 },
  { upperValue: 20, lowerValue: 15 },
  { upperValue: 60, lowerValue: 40 },
]} />`;

const CODE_BUBBLE = `<BubbleChart bubbles={[{ value: 40 }, { value: 25 }, { value: 15 }, { value: 10 }]} />`;

const CODE_LINE = `<SmoothLineChart series={[{ data: [10, 20, 15, 25, 18, 30, 22], fillArea: true }]} />`;

const donutSegments = [{ value: 40 }, { value: 30 }, { value: 30 }];

const TOOLTIP_PROPS: ApiTableRow[] = [
  { attr: "items", type: "ChartTooltipItem[]", defaultValue: "—", description: "提示行。每行包含 color、label、value、trend。" },
];

const CARD_PROPS: ApiTableRow[] = [
  { attr: "title / subtitle", type: "string", defaultValue: "—", description: "卡片头部。" },
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "中间的图表。" },
  { attr: "footer", type: "ReactNode", defaultValue: "—", description: "底部槽，通常放 ChartStatFooter。" },
  { attr: "width", type: "'full' | 'fixed'", defaultValue: "'full'", description: "full 适应容器，fixed 使用固定展示宽度。" },
  { attr: "size", type: "'4col' | '6col' | '8col' | 'full'", defaultValue: "'full'", description: "已废弃的展示尺寸。只在显式 width=\"fixed\" 时生效，单独传 size 不再固定宽度。" },
  { attr: "onMenuClick", type: "() => void", defaultValue: "—", description: "点击右上角更多操作按钮时触发。" },
];

const DONUT_PROPS: ApiTableRow[] = [
  { attr: "segments", type: "{ value, color? }[]", defaultValue: "—", description: "环形分段。不传 color 时按 accent 取色。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "占比图和柱状图共用的主色。" },
  { attr: "centerValue", type: "string", defaultValue: "—", description: "中心大数字。" },
  { attr: "trend / trendDirection", type: "string / 'up' | 'down'", defaultValue: "—", description: "中心趋势。方向决定颜色和箭头。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "中心下方的副文案。" },
  { attr: "size", type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: "外径。环形图和饼图共用。" },
  { attr: "trackColor", type: "string", defaultValue: "—", description: "未填充段的颜色，默认 fg-grey-200。" },
];

const HALFDONUT_PROPS: ApiTableRow[] = [
  { attr: "同 DonutChart", type: "—", defaultValue: "—", description: "分段、主色、中心数字、趋势、副文案和轨道色。半环没有 size。" },
];

const DASHED_PROPS: ApiTableRow[] = [
  { attr: "同 HalfDonutChart", type: "—", defaultValue: "—", description: "字段与半环图相同，刻度改成虚线。" },
];

const PIE_PROPS: ApiTableRow[] = [
  { attr: "segments / accent / size / trackColor", type: "同 DonutChart", defaultValue: "—", description: "实心饼。没有中心数字、趋势和副文案。" },
];

const MULTILAYER_PROPS: ApiTableRow[] = [
  { attr: "layers", type: "{ value, color? }[]", defaultValue: "—", description: "多层数据，第 1 层在最外。用来代替 segments。" },
  { attr: "accent / centerValue / trend / subtitle", type: "同 DonutChart", defaultValue: "—", description: "主色和中心内容。" },
];

const METER_PROPS: ApiTableRow[] = [
  { attr: "segments", type: "{ value, color? }[]", defaultValue: "—", description: "横条上的分段。" },
  { attr: "accent / trend / trendDirection / subtitle", type: "同 DonutChart", defaultValue: "—", description: "主色、右上角趋势和底部副文案。" },
  { attr: "height", type: "string", defaultValue: "'h-24'", description: "横条高度 class。" },
];

const BARCHART_PROPS: ApiTableRow[] = [
  { attr: "data", type: "{ value, label? }[]", defaultValue: "—", description: "柱子数据。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "柱子主色，与环形图共用。" },
  { attr: "activeIndex", type: "number", defaultValue: "—", description: "高亮柱子的下标。" },
  { attr: "color / inactiveColor", type: "string", defaultValue: "—", description: "覆盖高亮柱和非高亮柱的颜色，使用 Tailwind bg-* class。" },
  { attr: "barWidth", type: "'thin' | 'wide'", defaultValue: "'thin'", description: "柱子宽度。" },
  { attr: "showLabels", type: "boolean", defaultValue: "false", description: "是否显示轴标签。" },
  { attr: "showTooltip", type: "boolean", defaultValue: "false", description: "是否在高亮柱旁显示提示。" },
  { attr: "tooltipValue / tooltipTrend", type: "string / 'up' | 'down'", defaultValue: "—", description: "提示里的数值和趋势方向。" },
  { attr: "height", type: "string", defaultValue: "'h-36'", description: "柱子区域高度 class。" },
];

const BARHORIZ_PROPS: ApiTableRow[] = [
  { attr: "同 BarChart", type: "—", defaultValue: "—", description: "数据、主色、高亮、柱宽、标签和提示。横向柱没有 height。" },
];

const BARUPSIDEDOWN_PROPS: ApiTableRow[] = [
  { attr: "data", type: "{ upperValue, lowerValue }[]", defaultValue: "—", description: "每一根柱分成上下两段。" },
  { attr: "upperColor / lowerColor", type: "string", defaultValue: "—", description: "上段和下段的颜色。" },
  { attr: "tooltipUpperValue / tooltipLowerValue / tooltipTrend", type: "string / 'up' | 'down'", defaultValue: "—", description: "提示里的上下段数值和趋势。" },
  { attr: "accent / activeIndex / barWidth / showLabels / showTooltip / height", type: "同 BarChart", defaultValue: "—", description: "主色、高亮、柱宽、标签、提示和高度。" },
];

const BUBBLE_PROPS: ApiTableRow[] = [
  { attr: "bubbles", type: "{ value, color? }[]", defaultValue: "—", description: "气泡数据，大小随 value 变化。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "气泡主色。" },
  { attr: "height", type: "number", defaultValue: "240", description: "容器高度，单位是像素。" },
];

const LINE_PROPS: ApiTableRow[] = [
  { attr: "series", type: "{ data: number[], color?, fillArea? }[]", defaultValue: "—", description: "一条或多条线。fillArea 为面积填充。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "主色。" },
  { attr: "activeIndex", type: "number", defaultValue: "—", description: "高亮数据点的下标。" },
  { attr: "showTooltip", type: "boolean", defaultValue: "false", description: "在高亮点上方显示提示。需要同时传 tooltipItems。" },
  { attr: "tooltipItems", type: "ChartTooltipItem[]", defaultValue: "—", description: "提示内容。showTooltip 为 true 时必传，否则只显示标记点。" },
  { attr: "showYAxis", type: "boolean", defaultValue: "false", description: "是否显示 Y 轴。" },
  { attr: "yAxisLabels / xAxisLabels", type: "string[]", defaultValue: "—", description: "轴标签。" },
  { attr: "yDomain", type: "[min, max]", defaultValue: "auto", description: "Y 轴范围。" },
  { attr: "height", type: "string", defaultValue: "'h-32'", description: "图表高度 class。" },
];

const LISTITEM_PROPS: ApiTableRow[] = [
  { attr: "icon", type: "ComponentType<{ size?, color? }>", defaultValue: "—", description: "显示图标和系列名称。传入图标组件，例如 WalletLinear，而不是 JSX 元素。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "图标颜色。" },
  { attr: "title", type: "string", defaultValue: "—", description: "系列名称。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "副标题。" },
  { attr: "value", type: "string", defaultValue: "—", description: "右侧数值。" },
  { attr: "trend", type: "string", defaultValue: "—", description: "右侧趋势，例如 +12.5%。" },
  { attr: "trendDirection", type: "'up' | 'down'", defaultValue: "—", description: "趋势方向，决定颜色和箭头。" },
];

const LEGEND_PROPS: ApiTableRow[] = [
  { attr: "color", type: "string", defaultValue: "—", description: "色点颜色，使用 Tailwind bg-* class。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "未传 color 时按主色取色。" },
  { attr: "shade", type: "0 | 1 | 2 | 3 | 4", defaultValue: "0", description: "主色深浅。0 最深，4 最浅。" },
  { attr: "label", type: "string", defaultValue: "—", description: "系列名称。" },
  { attr: "value", type: "string", defaultValue: "—", description: "右侧数值。" },
];

const VALUEROW_PROPS: ApiTableRow[] = [
  { attr: "value", type: "string", defaultValue: "—", description: "主数值。" },
  { attr: "trend", type: "string", defaultValue: "—", description: "右侧趋势。" },
  { attr: "trendDirection", type: "'up' | 'down'", defaultValue: "—", description: "趋势方向，决定颜色和箭头。" },
  { attr: "color", type: "string", defaultValue: "—", description: "左侧色点，使用 Tailwind bg-* class。" },
  { attr: "label", type: "string", defaultValue: "—", description: "左侧说明。" },
];

const STATFOOTER_PROPS: ApiTableRow[] = [
  { attr: "items", type: "{ label, value, color?, trend?, trendDirection? }[]", defaultValue: "—", description: "底部摘要。每项有色点、数值和趋势。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "某一项没传 color 时，用主色生成色点。" },
];

const PICK_ROWS: { id: string; card: string; extra: string }[] = [
  { id: "donutchart", card: "DonutChart", extra: "整环占比，中间放一个数。" },
  { id: "halfdonutchart", card: "HalfDonutChart", extra: "只画上半环，适合一个完成度。" },
  { id: "dashedhalfdonutchart", card: "DashedHalfDonutChart", extra: "半环的刻度改成虚线。" },
  { id: "piechart", card: "PieChart", extra: "实心饼，没有中心数字。" },
  { id: "multilayerdonutchart", card: "MultilayerDonutChart", extra: "多层环，一层代表一个数。" },
  { id: "meterchart", card: "MeterChart", extra: "同一组占比铺成横条。" },
  { id: "barchart", card: "BarChart", extra: "纵向比较多项数量。" },
  { id: "barhorizontalchart", card: "BarHorizontalChart", extra: "同样的柱子改成横向，适合较长的名称。" },
  { id: "barupsidedownchart", card: "BarUpsideDownChart", extra: "一根柱分成上下两段，适合收入和支出。" },
  { id: "bubblechart", card: "BubbleChart", extra: "用气泡大小表示数量。" },
  { id: "smoothlinechart", card: "SmoothLineChart", extra: "一条或多条线，看变化趋势。" },
  { id: "chartcard", card: "ChartCard", extra: "把标题、图和底部摘要包在一张卡片里。" },
  { id: "charttooltip", card: "ChartTooltip", extra: "数据点上的名称、数值和涨跌。" },
  { id: "chartlistitem", card: "ChartListItem", extra: "带图标的系列行。" },
  { id: "chartlegenditem", card: "ChartLegendItem", extra: "色点、名称和数值。" },
  { id: "chartvaluerow", card: "ChartValueRow", extra: "一行大号数值。" },
  { id: "chartstatfooter", card: "ChartStatFooter", extra: "图下面的多项摘要。" },
];

export default function ChartCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="图表"
        hint="按要比较的东西选一张图：占比、数量或趋势。主色和尺寸只定一次，图例和提示按需要加上。"
      />

      <Section
        title="用法"
        description="先把一张图放进图表卡片。标题、图表和底部说明按需要加上。"
      >
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <SubSection title="最小示例" stack>
          <PreviewBlock code={CODE_USAGE} minHeight={360}>
            <ChartCard title="收入" subtitle="每月">
              <DonutChart segments={[{ value: 60 }, { value: 40 }]} centerValue="$8.4k" size="sm" />
            </ChartCard>
          </PreviewBlock>
        </SubSection>
      </Section>

      <Section
        title="骨架"
        description="占比图、柱状图和折线图共用 purple、blue、black 三种主色。环形图和饼图再用 sm、md、lg 控制外径。不传颜色时，分段会按主色自动排开。"
      >
        <SubSection title="主色" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>accent</InlineCode> 决定整张图的颜色。这里用环形图示意，柱状图和折线图同一套。
          </p>
          <PreviewBlock code={CODE_ACCENT} minHeight={220}>
            <div className="flex flex-wrap items-start justify-center gap-8">
              {(["purple", "blue", "black"] as const).map((accent) => (
                <DonutChart key={accent} accent={accent} segments={[{ value: 60 }, { value: 40 }]} centerValue="60%" size="sm" />
              ))}
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="尺寸" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>sm</InlineCode> 放进卡片，<InlineCode>md</InlineCode> 是默认，<InlineCode>lg</InlineCode> 单独占一栏。
          </p>
          <PreviewBlock code={CODE_SIZE} minHeight={280}>
            <div className="flex w-full flex-wrap items-end justify-center gap-8">
              {(["sm", "md", "lg"] as const).map((size) => (
                <DonutChart key={size} segments={donutSegments} centerValue="$8.4k" size={size} />
              ))}
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="怎么选" stack>
          <div className="overflow-x-auto rounded-xl border border-fg-grey-200 bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-fg-grey-200 bg-fg-grey-50">
                  <th className="w-[38%] px-4 py-2.5 text-xs font-semibold uppercase tracking-fg text-fg-grey-700">图表</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-fg text-fg-grey-700">适合看什么</th>
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
        description="同一组里并排放。每张图只写它和旁边那张的差别，参数表在页尾。"
      >
        <SubSection title="占比" stack>
          <ExampleGrid>
            <DocExample id="donutchart" title="DonutChart" summary="整环分成几段，中间放总数或占比。" code={CODE_DONUT} minHeight={240}>
              <DonutChart segments={donutSegments} centerValue="$8.4k" size="sm" />
            </DocExample>
            <DocExample id="halfdonutchart" title="HalfDonutChart" summary="只保留上半环，用来表示一个完成度。" code={CODE_HALFDONUT} minHeight={220}>
              <HalfDonutChart segments={[{ value: 75 }]} centerValue="75%" trend="10%" trendDirection="up" />
            </DocExample>
            <DocExample id="dashedhalfdonutchart" title="DashedHalfDonutChart" summary="半环不变，刻度改成虚线。" code={CODE_DASHED} minHeight={220}>
              <DashedHalfDonutChart segments={[{ value: 60 }]} centerValue="60%" />
            </DocExample>
            <DocExample id="piechart" title="PieChart" summary="实心饼。没有中心数字，段数和环形图一样传。" code={CODE_PIE} minHeight={240}>
              <PieChart segments={donutSegments} size="sm" />
            </DocExample>
            <DocExample id="multilayerdonutchart" title="MultilayerDonutChart" summary="一层环代表一个数，从外到内排列。" code={CODE_MULTI} minHeight={240}>
              <MultilayerDonutChart layers={[{ value: 80 }, { value: 60 }, { value: 40 }]} centerValue="80%" />
            </DocExample>
            <DocExample id="meterchart" title="MeterChart" summary="同一组占比铺成横条，旁边可以加趋势。" code={CODE_METER} minHeight={160}>
              <div className="w-full">
                <MeterChart segments={[{ value: 50 }, { value: 30 }, { value: 20 }]} trend="10%" trendDirection="up" subtitle="今日增加 ¥181" />
              </div>
            </DocExample>
          </ExampleGrid>
        </SubSection>

        <SubSection title="比较" stack>
          <ExampleGrid>
            <DocExample id="barchart" title="BarChart" summary="纵向比较多项。activeIndex 标出当前柱。" code={CODE_BAR} minHeight={200}>
              <div className="w-full">
                <BarChart data={[{ value: 20 }, { value: 45 }, { value: 30 }, { value: 60 }, { value: 35 }]} activeIndex={3} />
              </div>
            </DocExample>
            <DocExample id="barhorizontalchart" title="BarHorizontalChart" summary="柱子改成横向，名称较长时更好读。" code={CODE_BAR_H} minHeight={200}>
              <div className="w-full">
                <BarHorizontalChart data={[{ label: "A", value: 80 }, { label: "B", value: 50 }, { label: "C", value: 30 }]} />
              </div>
            </DocExample>
            <DocExample id="barupsidedownchart" title="BarUpsideDownChart" summary="一根柱分成上下两段，用来对照收入和支出。" code={CODE_BAR_UD} minHeight={220}>
              <div className="w-full">
                <BarUpsideDownChart data={[
                  { upperValue: 30, lowerValue: 20 },
                  { upperValue: 50, lowerValue: 35 },
                  { upperValue: 20, lowerValue: 15 },
                  { upperValue: 60, lowerValue: 40 },
                ]} />
              </div>
            </DocExample>
            <DocExample id="bubblechart" title="BubbleChart" summary="数量不用柱高，而用气泡大小。" code={CODE_BUBBLE} minHeight={240}>
              <div className="w-full">
                <BubbleChart bubbles={[{ value: 40 }, { value: 25 }, { value: 15 }, { value: 10 }]} />
              </div>
            </DocExample>
          </ExampleGrid>
        </SubSection>

        <SubSection title="趋势" stack>
          <DocExample id="smoothlinechart" title="SmoothLineChart" summary="一条或多条平滑线。fillArea 给线下铺面积，也可以加坐标和提示。" code={CODE_LINE} minHeight={220}>
            <div className="w-full">
              <SmoothLineChart series={[{ data: [10, 20, 15, 25, 18, 30, 22], fillArea: true }]} />
            </div>
          </DocExample>
        </SubSection>

        <SubSection title="卡片与说明" stack>
          <ExampleGrid>
            <DocExample id="chartcard" title="ChartCard" summary="标题、图表和底部摘要放在同一张卡片里。" code={CODE_USAGE} minHeight={360}>
              <ChartCard title="收入" subtitle="每月">
                <DonutChart segments={[{ value: 60 }, { value: 40 }]} centerValue="$8.4k" size="sm" />
              </ChartCard>
            </DocExample>
            <DocExample id="charttooltip" title="ChartTooltip" summary="浮在数据点上，列出名称、数值和涨跌。" code={CODE_TOOLTIP} minHeight={160}>
              <ChartTooltip
                items={[
                  { color: "bg-fg-violet", label: "收入", value: "$4,200", trend: "up" },
                  { color: "bg-blue-600", label: "支出", value: "$1,800", trend: "down" },
                ]}
              />
            </DocExample>
            <DocExample id="chartlistitem" title="ChartListItem" summary="系列行带图标。icon 传入图标组件，例如 WalletLinear。" code={CODE_LISTITEM} minHeight={120}>
              <div className="w-full">
                <ChartListItem icon={WalletLinear} title="收入" subtitle="本月" value="$12,500" trend="+12.5%" trendDirection="up" />
              </div>
            </DocExample>
            <DocExample id="chartlegenditem" title="ChartLegendItem" summary="色点加名称和数值，用来对照图上的分段。" code={CODE_LEGEND} minHeight={120}>
              <div className="w-full">
                <ChartLegendItem color="bg-fg-violet" label="收入" value="$4,200" />
              </div>
            </DocExample>
            <DocExample id="chartvaluerow" title="ChartValueRow" summary="单独强调一个大号数值，可以带色点和趋势。" code={CODE_VALUEROW} minHeight={120}>
              <div className="w-full">
                <ChartValueRow label="收入" value="$12,500" color="bg-fg-violet" />
              </div>
            </DocExample>
            <DocExample id="chartstatfooter" title="ChartStatFooter" summary="放在图下面，一项一个色点、数值和趋势。" code={CODE_STATFOOTER} minHeight={140}>
              <div className="w-full">
                <ChartStatFooter
                  items={[
                    { label: "收入", value: "$12.5k", color: "bg-fg-violet", trend: "+12%", trendDirection: "up" },
                    { label: "利润", value: "$9.3k", color: "bg-emerald-500", trend: "+18%", trendDirection: "up" },
                  ]}
                />
              </div>
            </DocExample>
          </ExampleGrid>
        </SubSection>
      </Section>

      <Section
        title="API"
        description="环形图写下占比图的共用字段。半环、虚线半环和饼图只列差别。柱状图同理，横向柱和收支柱指向它。"
      >
        <ApiBlock id="donutchart" title="DonutChart" rows={DONUT_PROPS} />
        <ApiBlock id="halfdonutchart" title="HalfDonutChart" rows={HALFDONUT_PROPS} />
        <ApiBlock id="dashedhalfdonutchart" title="DashedHalfDonutChart" rows={DASHED_PROPS} />
        <ApiBlock id="piechart" title="PieChart" rows={PIE_PROPS} />
        <ApiBlock id="multilayerdonutchart" title="MultilayerDonutChart" rows={MULTILAYER_PROPS} />
        <ApiBlock id="meterchart" title="MeterChart" rows={METER_PROPS} />
        <ApiBlock id="barchart" title="BarChart" rows={BARCHART_PROPS} />
        <ApiBlock id="barhorizontalchart" title="BarHorizontalChart" rows={BARHORIZ_PROPS} />
        <ApiBlock id="barupsidedownchart" title="BarUpsideDownChart" rows={BARUPSIDEDOWN_PROPS} />
        <ApiBlock id="bubblechart" title="BubbleChart" rows={BUBBLE_PROPS} />
        <ApiBlock id="smoothlinechart" title="SmoothLineChart" rows={LINE_PROPS} />
        <ApiBlock id="chartcard" title="ChartCard" rows={CARD_PROPS} />
        <ApiBlock id="charttooltip" title="ChartTooltip" rows={TOOLTIP_PROPS} />
        <ApiBlock id="chartlistitem" title="ChartListItem" rows={LISTITEM_PROPS} />
        <ApiBlock id="chartlegenditem" title="ChartLegendItem" rows={LEGEND_PROPS} />
        <ApiBlock id="chartvaluerow" title="ChartValueRow" rows={VALUEROW_PROPS} />
        <ApiBlock id="chartstatfooter" title="ChartStatFooter" rows={STATFOOTER_PROPS} />
      </Section>
    </div>
  );
}
