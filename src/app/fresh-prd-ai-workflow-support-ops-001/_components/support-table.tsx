"use client";

import Link from "next/link";
import { Avatar, Button, CellTextSubtitle, DataTable, type ColumnDef } from "@forge-ui-official/core";
import { basePath, supportTickets, type SupportTicket } from "./data";
import { StatusPill } from "./status-pill";

const columns: ColumnDef<SupportTicket>[] = [
  {
    key: "ticket",
    header: "Ticket",
    flex: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar initials={row.customer.slice(0, 2).toUpperCase()} color="purple" size="sm" />
        <CellTextSubtitle title={row.customer} subtitle={row.id} />
      </div>
    ),
  },
  { key: "priority", header: "Priority", width: "w-32", render: (row) => <span className="text-sm font-semibold tracking-fg text-fg-black">{row.priority}</span> },
  { key: "sla", header: "SLA watch", width: "w-32", render: (row) => <span className="text-sm font-semibold tracking-fg text-fg-red">{row.sla}</span> },
  { key: "stage", header: "Stage", width: "w-36", render: (row) => <StatusPill label={row.stage} /> },
  { key: "run", header: "Related run", width: "w-40", render: (row) => <Link href={`${basePath}/workflows/${row.relatedRun}`} className="text-sm font-bold tracking-fg text-fg-blue">{row.relatedRun}</Link> },
  { key: "action", header: "Action", width: "w-36", render: () => <Button color="blue" variant="tertiary" size="sm">Open ticket</Button> },
];

export function SupportTable() {
  return (
    <DataTable
      title="Support triage queue"
      subtitle="SLA watch, assigned stage, customer context, and related automation run"
      rows={supportTickets}
      columns={columns}
      color="blue"
      showCheckbox
      showPagination
      currentPage={1}
      totalPages={3}
      paginationLabel="Showing high-signal support tickets"
    />
  );
}
