import { StatusBadge, type StatusBadgeColor } from "@forge-ui-official/core";

const colorByState: Record<string, StatusBadgeColor> = {
  Healthy: "green",
  Watchlisted: "yellow",
  Blocked: "red",
  Recovering: "blue",
  Failed: "red",
  Retrying: "yellow",
  Active: "green",
  Draft: "grey",
  Ready: "green",
  Lagging: "yellow",
  Assigned: "blue",
  Waiting: "yellow",
  New: "purple",
  Resolved: "green",
};

export function StatusPill({ label }: { label: string }) {
  return <StatusBadge label={label} color={colorByState[label] ?? "grey"} />;
}
