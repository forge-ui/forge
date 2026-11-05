"use client";

import { useState, type ComponentProps } from "react";
import { ChartHeader, GroupedBarChart, SmoothLineChart, Panel, type GroupedBarChartProps, type PanelProps } from "@forge-ui-official/core";

export type TrendChartProps = Omit<PanelProps, "children"> & {
  children?: PanelProps["children"];
  chart?: GroupedBarChartProps;
  periods?: { label: string; chart: GroupedBarChartProps }[];
  activePeriod?: string;
  onPeriodChange?: (period: string) => void;
  countChart?: ComponentProps<typeof SmoothLineChart>;
};

export function TrendChart({ children, chart, periods = [], activePeriod, onPeriodChange, countChart, ...panel }: TrendChartProps) {
  const [selected, setSelected] = useState(periods[0]?.label);
  const current = activePeriod ?? selected;
  const currentChart = periods.find(period => period.label === current)?.chart ?? chart;
  return <Panel {...panel}>{children ?? <>{periods.length > 0 && <ChartHeader title="" tabs={periods.map(period => period.label)} activeTab={current} onTabChange={period => { setSelected(period); onPeriodChange?.(period); }} />}{countChart ? <SmoothLineChart {...countChart} /> : currentChart && <GroupedBarChart {...currentChart} />}</>}</Panel>;
}
