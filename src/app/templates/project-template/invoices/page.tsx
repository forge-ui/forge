"use client";

import { useState } from "react";
import { AddCircleLinear } from "solar-icon-set";
import { Button, CellActions, DataTable, StatusBadge, ToolbarDatepicker, ToolbarFilterButton, ToolbarShowSelect } from "@forge-ui-official/core";
import type { ColumnDef } from "@forge-ui-official/core";
import { PageTop, ProjectTemplateShell } from "../_chrome";
import { clients, projects } from "../_data";
import { TemplateDeleteDialog } from "../_modals";

type Invoice = { id: string; client: string; project: string; amount: string; due: string; status: "Paid" | "Pending" | "Overdue" };

const invoices: Invoice[] = projects.slice(0, 10).map((project, index) => ({
  id: `INV-2024-${String(index + 1).padStart(3, "0")}`,
  client: clients[index % clients.length].name,
  project: project.name,
  amount: project.budget,
  due: project.dueDate,
  status: index % 3 === 0 ? "Paid" : index % 3 === 1 ? "Pending" : "Overdue",
}));

export default function InvoicesPage() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const columns: ColumnDef<Invoice>[] = [
    { key: "id", header: "Invoice", width: "w-[180px]", render: (row) => row.id },
    { key: "client", header: "Client", flex: true, render: (row) => row.client },
    { key: "project", header: "Project", width: "w-[220px]", render: (row) => row.project },
    { key: "amount", header: "Amount", width: "w-[160px]", render: (row) => row.amount },
    { key: "due", header: "Due Date", sortable: true, width: "w-[180px]", render: (row) => row.due },
    { key: "status", header: "Status", width: "w-[140px]", render: (row) => <StatusBadge label={row.status} color={row.status === "Paid" ? "green" : row.status === "Pending" ? "yellow" : "red"} /> },
    { key: "actions", header: "", width: "w-[100px]", render: () => <CellActions actions={["eye", "pen", "trash"]} onAction={(action) => action === "trash" && setDeleteOpen(true)} /> },
  ];
  return (
    <ProjectTemplateShell>
      <div className="flex flex-col gap-8">
        <PageTop title="Invoice" current="Invoice" actions={<Button iconLeft={<AddCircleLinear size={18} />}>Create Invoice</Button>} />
        <div className="flex justify-end gap-4"><ToolbarDatepicker label="Select Dates" /><ToolbarFilterButton label="Filters" /><ToolbarShowSelect value="10" /></div>
        <DataTable<Invoice> columns={columns} rows={invoices} color="purple" showCheckbox showPagination currentPage={1} totalPages={5} paginationLabel="Showing 1-10 from 100" />
      </div>
      <TemplateDeleteDialog open={deleteOpen} title="Delete Invoice?" description="Are you sure you want to delete this invoice?" onClose={() => setDeleteOpen(false)} />
    </ProjectTemplateShell>
  );
}
