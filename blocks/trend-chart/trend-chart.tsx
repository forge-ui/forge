"use client";

import { useState, type ComponentProps } from "react";
import { ChartHeader, ChartMetricRow, GroupedBarChart, SmoothLineChart, Panel, cn, type GroupedBarChartProps, type PanelProps } from "@forge-ui-official/core";

type TrendPeriod = { label: string; chart?: GroupedBarChartProps; countChart?: ComponentProps<typeof SmoothLineChart> };

export type TrendChartProps = Omit<PanelProps, "children" | "variant"> & {
  children?: PanelProps["children"];
  chart?: GroupedBarChartProps;
  periods?: TrendPeriod[];
  variant?: "template" | "plain";
  activePeriod?: string;
  onPeriodChange?: (period: string) => void;
  countChart?: ComponentProps<typeof SmoothLineChart>;
};

export function TrendChart({ children, chart, periods = [], activePeriod, onPeriodChange, countChart, variant = "template", ...panel }: TrendChartProps) {
  const [selected, setSelected] = useState(periods[0]?.label);
  const [hovered, setHovered] = useState<number>();
  const current = activePeriod ?? (periods.some(period => period.label === selected) ? selected : periods[0]?.label);
  const period = periods.find(period => period.label === current);
  const currentChart = period ? period.chart : chart;
  const currentLine = period ? period.countChart : countChart;
  const colors = ["bg-fg-violet", "bg-fg-yellow", "bg-fg-cyan-500"];
  const series = currentLine ? currentLine.series.map((item, index) => ({ label: item.label ?? `指标 ${index + 1}`, colorClass: colors[index % colors.length], value: String(item.data.reduce((total, value) => total + value, 0)) })) : currentChart?.series.map((item, index) => ({ ...item, value: item.value ?? String(currentChart.data.reduce((total, point) => total + (point.values[index] ?? 0), 0)) })) ?? [];
  const activeIndex = hovered ?? currentLine?.activeIndex ?? currentChart?.activeIndex ?? 0;
  const decorated = variant !== "plain";
  return <Panel {...panel}>{children ?? <>
    {decorated && <ChartHeader title="" tabs={periods.length ? periods.map(item => item.label) : ["本期"]} activeTab={current ?? "本期"} onTabChange={label => { setSelected(label); setHovered(undefined); onPeriodChange?.(label); }} />}
    {decorated && <ChartMetricRow series={series} />}
    {currentLine ? <SmoothLineChart {...currentLine} activeIndex={activeIndex} showTooltip={decorated && (currentLine.showTooltip ?? true)} tooltipItems={currentLine.tooltipItems ?? series.map((item, index) => ({ label: item.label, color: item.colorClass, value: String(currentLine.series[index].data[activeIndex] ?? 0) }))} onActiveIndexChange={index => { setHovered(index); currentLine.onActiveIndexChange?.(index); }} /> : currentChart && <div className="@container min-w-0"><GroupedBarChart {...currentChart} heightClass={cn(currentChart.heightClass ?? "h-56", "min-w-0 grid-cols-[44px_minmax(0,1fr)] @max-[480px]:grid-cols-[32px_minmax(0,1fr)] @max-[480px]:gap-2 @max-[480px]:[&>div:last-child]:gap-1 [&>div:last-child>div]:min-w-0 @max-[480px]:[&>div:last-child>div>div]:gap-1 @max-[480px]:[&>div:last-child>div>div>span]:w-2 @max-[480px]:[&>div:last-child>div>div:last-child]:text-[10px]")} tooltipItems={currentChart.tooltipItems ?? (decorated ? series.map((item, index) => ({ label: item.label, colorClass: item.colorClass, value: String(currentChart.data[activeIndex]?.values[index] ?? 0) })) : undefined)} /></div>}
  </>}</Panel>;
}
