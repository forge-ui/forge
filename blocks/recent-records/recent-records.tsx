"use client";

import { DataTable, Panel, type ColumnDef, type PanelProps } from "@forge-ui-official/core";

export type RecentRecordsProps<RecordType> = Omit<PanelProps, "children"> & {
  children?: PanelProps["children"];
  columns?: ColumnDef<RecordType>[];
  data?: RecordType[];
  getRowKey?: (row: RecordType, index: number) => string;
};

export function RecentRecords<RecordType>({ columns, data, getRowKey, children, ...panel }: RecentRecordsProps<RecordType>) {
  return <Panel {...panel}>{children ?? (columns && data ? <DataTable columns={columns} rows={data} getRowKey={getRowKey} /> : null)}</Panel>;
}
