"use client";

import Link from "next/link";
import { Avatar, Button, CellTextSubtitle, DataTable, type ColumnDef } from "@forge-ui-official/core";
import { basePath, incidents, type Incident } from "./data";
import { StatusPill } from "./status-pill";

const columns: ColumnDef<Incident>[] = [
  {
    key: "incident",
    header: "Incident",
    flex: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar initials={row.id.slice(-2)} color="blue" size="sm" />
        <CellTextSubtitle title={row.title} subtitle={row.id} />
      </div>
    ),
  },
  { key: "state", header: "State", width: "w-36", render: (row) => <StatusPill label={row.state} /> },
  { key: "impact", header: "Impact scope", flex: true, render: (row) => <CellTextSubtitle title={row.impact} subtitle={row.evidence} /> },
  { key: "owner", header: "Owner", width: "w-36", render: (row) => <span className="text-sm font-semibold tracking-fg text-fg-black">{row.owner}</span> },
  {
    key: "action",
    header: "Next action",
    width: "w-44",
    render: (row) => (
      <Link href={row.id === "INC-2407" ? `${basePath}/recovery/new` : `${basePath}/support`}>
        <Button color="blue" variant="tertiary" size="sm">{row.nextAction}</Button>
      </Link>
    ),
  },
];

export function RiskTable() {
  return (
    <DataTable
      title="Gateway risk queue"
      subtitle="Source-backed provider, workflow, ticket, and evidence closure"
      rows={incidents}
      columns={columns}
      color="blue"
      showPagination
      currentPage={1}
      totalPages={2}
      paginationLabel="Showing current incident risks"
    />
  );
}
