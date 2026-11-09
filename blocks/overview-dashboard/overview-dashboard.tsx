"use client";

import type { ComponentProps } from "react";
import { BarChartStatCard, Button, ChartHeader, ChartMetricRow, DonutChart, GroupedBarChart, LineChartStatCard, Panel, cn, type GroupedBarChartProps } from "@forge-ui-official/core";
import { DownloadLinear } from "@forge-ui-official/core/icons";

export type OverviewMetric = Omit<ComponentProps<typeof LineChartStatCard>, "density" | "size" | "width"> & {
  id: string;
  visualization?: "line" | "bar";
  data?: number[];
};

export const defaultOverviewMetrics: OverviewMetric[] = [
  { id: "revenue", title: "营业收入", value: "¥128,600", trend: "12.8%", subtitle: "较上一周", theme: "blue", data: [14200, 16800, 15300, 20400, 18600, 21500, 21800] },
  { id: "orders", title: "成交订单", value: "248", trend: "8.3%", subtitle: "已支付订单", visualization: "line", data: [24, 32, 29, 41, 36, 42, 44] },
  { id: "customers", title: "新增客户", value: "86", trend: "16.2%", subtitle: "首次成交客户", data: [8, 10, 9, 15, 12, 16, 16] },
  { id: "average", title: "客单价", value: "¥518.55", trend: "4.2%", subtitle: "营业收入 / 成交订单", visualization: "line", data: [492, 508, 501, 512, 519, 514, 519] },
];

export const defaultOverviewTrend: GroupedBarChartProps = {
  data: [
    { label: "10/25", values: [14200, 8200] }, { label: "10/26", values: [16800, 9400] },
    { label: "10/27", values: [15300, 8800] }, { label: "10/28", values: [20400, 12000] },
    { label: "10/29", values: [18600, 11200] }, { label: "10/30", values: [21500, 12300] },
    { label: "10/31", values: [21800, 12900] },
  ],
  series: [
    { label: "收入", value: "¥128,600", colorClass: "bg-fg-blue" },
    { label: "支出", value: "¥74,800", colorClass: "bg-fg-yellow" },
  ],
  yAxisLabels: ["¥22k", "¥16.5k", "¥11k", "¥5.5k", "0"],
  heightClass: "h-56",
};

export const defaultOverviewComposition: ComponentProps<typeof DonutChart> = {
  segments: [
    { label: "企业订阅", value: 72000, color: "bg-fg-blue" },
    { label: "团队订阅", value: 32000, color: "bg-fg-violet" },
    { label: "实施服务", value: 18600, color: "bg-fg-yellow" },
    { label: "培训服务", value: 6000, color: "bg-fg-cyan-500" },
  ],
  centerValue: "¥12.9万",
  subtitle: "本周营业收入",
  size: "md",
};

export interface OverviewDashboardProps {
  title?: string;
  description?: string;
  periodLabel?: string;
  metrics?: OverviewMetric[];
  trend?: GroupedBarChartProps;
  composition?: ComponentProps<typeof DonutChart>;
  onExport?: () => void;
  className?: string;
}

export function OverviewDashboard({ title = "经营概览", description = "知行科技 · 收入、订单与客户增长", periodLabel = "2026.10.25 — 10.31", metrics = defaultOverviewMetrics, trend = defaultOverviewTrend, composition = defaultOverviewComposition, onExport, className }: OverviewDashboardProps) {
  return <section className={cn("@container flex min-w-0 flex-col gap-5", className)}>
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 className="text-2xl font-semibold text-fg-black">{title}</h2><p className="mt-1 text-sm text-fg-grey-700">{description}</p></div>
      <div className="flex flex-wrap items-center gap-3"><span className="text-sm text-fg-grey-700">{periodLabel}</span>{onExport && <Button size="sm" variant="tertiary" iconLeft={<DownloadLinear size={16} />} onClick={onExport}>导出报表</Button>}</div>
    </header>
    <div className="grid grid-cols-1 items-stretch gap-4 @min-[560px]:grid-cols-2 @min-[960px]:grid-cols-4 [&>*]:w-full">
      {metrics.map(({ id, data, visualization, ...metric }) => visualization === "line"
        ? <LineChartStatCard key={id} {...metric} series={data} chartColor="blue" density="compact" size="wide" width="full" />
        : <BarChartStatCard key={id} {...metric} value={String(metric.value ?? "")} bars={data} barColor="blue" density="compact" size="wide" width="full" />)}
    </div>
    <div className="grid min-w-0 grid-cols-1 gap-4 @min-[840px]:grid-cols-3">
      <Panel className="min-w-0 @min-[840px]:col-span-2">
        <ChartHeader title="收入与支出" subtitle="按日统计 · 人民币" />
        <ChartMetricRow series={trend.series} />
        <div className="@container min-w-0"><GroupedBarChart {...trend} heightClass={cn(trend.heightClass ?? "h-56", "min-w-0 grid-cols-[44px_minmax(0,1fr)] @max-[480px]:grid-cols-[32px_minmax(0,1fr)] @max-[480px]:gap-2 @max-[480px]:[&>div:last-child]:gap-1 [&>div:last-child>div]:min-w-0 @max-[480px]:[&>div:last-child>div>div]:gap-1 @max-[480px]:[&>div:last-child>div>div>span]:w-2 @max-[480px]:[&>div:last-child>div>div:last-child]:text-[10px]")} /></div>
      </Panel>
      <Panel title="收入构成" subtitle="按业务类型统计">
        <DonutChart {...composition} />
        <div className="flex flex-col gap-3 text-sm">{composition.segments.map(segment => <div key={segment.label} className="flex items-center gap-2"><span className={cn("size-2 shrink-0 rounded-full", segment.color)} /><span className="text-fg-grey-700">{segment.label}</span><span className="ml-auto font-semibold tabular-nums text-fg-black">¥{segment.value.toLocaleString("zh-CN")}</span></div>)}</div>
      </Panel>
    </div>
  </section>;
}
