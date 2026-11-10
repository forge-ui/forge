"use client";

import { useState } from "react";
import { DataTable, type DataTableProps } from "@forge-ui-official/core";

type PagedDataTableProps<T> = Omit<DataTableProps<T>, "showPagination" | "currentPage" | "totalPages" | "onPageChange" | "paginationLabel"> & {
  pageSize?: number;
};

// Demo tables page through the rows they actually have instead of showing fixed page numbers.
export function PagedDataTable<T>({ rows, pageSize = 5, ...props }: PagedDataTableProps<T>) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, rows.length);
  return (
    <DataTable<T>
      {...props}
      rows={rows.slice(start, end)}
      showPagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
      paginationLabel={`Showing ${rows.length ? start + 1 : 0}-${end} from ${rows.length}`}
    />
  );
}
