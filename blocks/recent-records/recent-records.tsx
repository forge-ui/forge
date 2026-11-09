"use client";

import { DataTable, Panel, type ColumnDef, type PanelProps } from "@forge-ui-official/core";

export type RecentRecordsProps<RecordType> = Omit<PanelProps, "children"> & {
  children?: PanelProps["children"];
  columns?: ColumnDef<RecordType>[];
  data?: RecordType[];
  getRowKey?: (row: RecordType, index: number) => string;
};

export function RecentRecords<RecordType>({ columns, data, getRowKey, children, ...panel }: RecentRecordsProps<RecordType>) {
  return <Panel {...panel}>{children ?? (columns && data ? <div className="@container min-w-0">
    <div className="hidden @min-[720px]:block"><DataTable columns={columns} rows={data} getRowKey={getRowKey} /></div>
    <ul aria-label="最近记录" className="divide-y divide-fg-grey-200 rounded-2xl border border-fg-grey-200 @min-[720px]:hidden">{data.map((row, rowIndex) => <li key={getRowKey?.(row, rowIndex) ?? rowIndex} className="min-w-0 p-4"><dl className="grid min-w-0 grid-cols-1 gap-3 @min-[360px]:grid-cols-2">{columns.map(column => <div key={column.key} className="min-w-0 break-words"><dt className="text-xs text-fg-grey-500">{column.header}</dt><dd className="mt-1 text-sm text-fg-black">{column.render(row, rowIndex)}</dd></div>)}</dl></li>)}</ul>
  </div> : null)}</Panel>;
}
