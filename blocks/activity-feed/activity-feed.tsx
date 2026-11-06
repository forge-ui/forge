import type { ComponentProps } from "react";
import { BellLinear } from "@forge-ui-official/core/icons";
import { ActivityCard, ListGroup, type ListGroupProps } from "@forge-ui-official/core";

export type ActivityFeedProps = Omit<ListGroupProps, "items"> & {
  items?: ListGroupProps["items"];
  events?: (Omit<ComponentProps<typeof ActivityCard>, "icon" | "avatar"> & { id: string; icon?: ComponentProps<typeof ActivityCard>["icon"]; avatar?: string })[];
};

export function ActivityFeed({ events = [], items, ...props }: ActivityFeedProps) {
  return <ListGroup density="compact" {...props} items={items ?? events.map(({ id, icon = <BellLinear size={18} />, avatar, ...event }) => <ActivityCard key={id} {...event} icon={icon} avatar={avatar ?? `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><text x="22" y="30" text-anchor="middle" font-size="22">${event.title.slice(0, 1).replace(/[<>&"']/g, "")}</text></svg>`)}`} />)} />;
}
