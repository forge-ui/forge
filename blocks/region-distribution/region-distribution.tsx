import type { ComponentProps } from "react";
import { MapCard } from "@forge-ui-official/core";

export type RegionDistributionProps = Omit<ComponentProps<typeof MapCard>, "regions"> & {
  regions?: (Omit<NonNullable<ComponentProps<typeof MapCard>["regions"]>[number], "flag"> & { flag?: string; countryCode?: string })[];
};

export function RegionDistribution({ regions, ...props }: RegionDistributionProps) {
  return <MapCard color="purple" width="full" {...props} regions={regions?.map(region => {
    const countryCode = region.countryCode?.toUpperCase();
    const label = countryCode && /^[A-Z]{2}$/.test(countryCode)
      ? String.fromCodePoint(...Array.from(countryCode, letter => letter.charCodeAt(0) + 127397))
      : region.name.slice(0, 2).replace(/[<>&"']/g, "");
    return { ...region, flag: region.flag ?? `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><text x="22" y="30" text-anchor="middle" font-size="22">${label}</text></svg>`)}` };
  })} />;
}
