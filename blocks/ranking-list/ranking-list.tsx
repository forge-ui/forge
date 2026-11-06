import type { ComponentProps, ReactNode } from "react";
import { BoxBoldDuotone } from "@forge-ui-official/core/icons";
import { ChartListItem, ListGroup, cn, type ListGroupProps } from "@forge-ui-official/core";

export type RankingListProps = Omit<ListGroupProps, "items"> & {
  items?: ReactNode;
  entries?: { id: string; title: string; subtitle?: string; value: string; icon?: ComponentProps<typeof ChartListItem>["icon"]; accent?: ComponentProps<typeof ChartListItem>["accent"]; avatar?: string }[];
  variant?: "template" | "plain";
};

export function RankingList({ entries = [], items, variant = "template", className, ...props }: RankingListProps) {
  return <ListGroup density="compact" {...props} className={cn("w-full", className)} items={items ?? entries.map((entry, index) => variant === "plain"
    ? <div key={entry.id} className="flex justify-between gap-3 py-2"><span>{entry.title}</span><span>{entry.value}</span></div>
    : entry.avatar ? <div key={entry.id} className="flex items-center gap-3 py-2.5"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-fg-violet-100 text-sm font-semibold text-fg-violet">{entry.avatar}</span><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{entry.title}</div><div className="text-xs text-fg-grey-500">{entry.subtitle}</div></div><span className="text-sm font-semibold tabular-nums">{entry.value}</span></div>
      : <ChartListItem key={entry.id} title={entry.title} subtitle={entry.subtitle} value={entry.value} icon={entry.icon ?? BoxBoldDuotone} accent={entry.accent ?? (index % 2 ? "blue" : "purple")} />)} />;
}
