import type { ComponentProps } from "react";
import { ListGroup, UserCard, type ListGroupProps } from "@forge-ui-official/core";

export type MemberListProps = Omit<ListGroupProps, "items"> & {
  items?: ListGroupProps["items"];
  members?: (ComponentProps<typeof UserCard> & { id: string })[];
};

export function MemberList({ members = [], items, ...props }: MemberListProps) {
  return <ListGroup density="compact" {...props} items={items ?? members.map(({ id, ...member }) => <UserCard key={id} {...member} />)} />;
}
