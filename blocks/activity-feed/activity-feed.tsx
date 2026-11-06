import type { ComponentProps } from "react";
import { ActivityCard, ListGroup, type ListGroupProps } from "@forge-ui-official/core";

export type ActivityFeedProps = Omit<ListGroupProps, "items"> & {
  items?: ListGroupProps["items"];
  events?: (ComponentProps<typeof ActivityCard> & { id: string })[];
};

export function ActivityFeed({ events = [], items, ...props }: ActivityFeedProps) {
  return <ListGroup density="compact" {...props} items={items ?? events.map(({ id, ...event }) => <ActivityCard key={id} {...event} />)} />;
}
