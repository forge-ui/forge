import { GroupedBarChart, Panel, type GroupedBarChartProps, type PanelProps } from "@forge-ui-official/core";

export type TrendChartProps = Omit<PanelProps, "children"> & {
  children?: PanelProps["children"];
  chart?: GroupedBarChartProps;
};

export function TrendChart({ children, chart, ...panel }: TrendChartProps) {
  return <Panel {...panel}>{children ?? (chart && <GroupedBarChart {...chart} />)}</Panel>;
}
