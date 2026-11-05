import type { ComponentProps } from "react";
import { DonutChart, Panel, type PanelProps } from "@forge-ui-official/core";

export type CompositionCardProps = Omit<PanelProps, "children"> & {
  children?: PanelProps["children"];
  chart?: ComponentProps<typeof DonutChart>;
};

export function CompositionCard({ children, chart, ...panel }: CompositionCardProps) {
  return <Panel {...panel}>{children ?? (chart && <DonutChart {...chart} />)}</Panel>;
}
