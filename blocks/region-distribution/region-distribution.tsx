import type { ComponentProps } from "react";
import { MapCard } from "@forge-ui-official/core";

export type RegionDistributionProps = ComponentProps<typeof MapCard>;

export function RegionDistribution(props: RegionDistributionProps) {
  return <MapCard {...props} />;
}
