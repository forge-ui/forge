import type { ComponentProps } from "react";
import { DonutChart, Panel, type PanelProps } from "@forge-ui-official/core";

export type CompositionCardProps = Omit<PanelProps, "children" | "variant"> & {
  children?: PanelProps["children"];
  chart?: ComponentProps<typeof DonutChart>;
  variant?: "template" | "plain";
};

export function CompositionCard({ children, chart = { segments: [] }, variant = "template", ...panel }: CompositionCardProps) {
  const colors = ["bg-fg-violet", "bg-fg-yellow", "bg-fg-cyan-500", "bg-fg-red"];
  const segments = chart.segments.map((segment, index) => ({ ...segment, color: segment.color ?? colors[index % colors.length] }));
  return <Panel {...panel}>{children ?? <><DonutChart accent="purple" {...chart} segments={segments} />{variant !== "plain" && <div className="grid grid-cols-2 gap-2 text-xs text-fg-grey-700">{segments.map((segment, index) => <span key={index} className="flex items-center gap-1.5"><span className={`size-2 shrink-0 rounded-full ${segment.color}`} />{segment.label ?? `分类 ${index + 1}`}<span className="ml-auto tabular-nums">{segment.value}</span></span>)}</div>}</>}</Panel>;
}
