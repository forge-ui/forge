import { ListGroup, type ListGroupProps } from "@forge-ui-official/core";

export type RankingListProps = ListGroupProps;

export function RankingList(props: RankingListProps) {
  return <ListGroup density="compact" {...props} />;
}
