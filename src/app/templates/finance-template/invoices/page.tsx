"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddCircleLinear, CloudDownloadLinear } from "solar-icon-set";
import {
  Button,
  CellActions,
  CellImageText,
  CellText,
  DataTable,
  IconButton,
  StatusBadge,
  Toolbar,
  ToolbarActions,
  ToolbarDatepicker,
  ToolbarSearchInput,
  ToolbarShowSelect,
} from "@forge-ui-official/core";
import type { ColumnDef } from "@forge-ui-official/core";
import {
  ProtaskDeleteDialog,
  ProtaskFilterTrigger,
} from "../../_shared/protask-actions";
import { FinancePageHeader, FinanceTemplateShell, financeStatusColor } from "../_chrome";
import { invoices, type Invoice } from "../_data";

export default function FinanceInvoicesPage() {
  return (
    <Suspense fallback={null}>
      <FinanceInvoicesContent />
    </Suspense>
  );
}

function FinanceInvoicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const dialog = searchParams.get("dialog");
  const closeDialog = () => {
    setDeleteTarget(null);
    if (dialog) router.replace("/templates/finance-template/invoices");
  };
  const columns: ColumnDef<Invoice>[] = [
    { key: "invoiceNumber", header: "ID", width: "w-[150px]", render: (row) => <CellText>{row.invoiceNumber}</CellText> },
    {
      key: "billTo",
      header: "Bill To",
      sortable: true,
      flex: true,
      render: (row) => <CellImageText src={row.avatar} title={row.billTo} subtitle={row.email} rounded="full" />,
    },
    { key: "amount", header: "Amount", sortable: true, width: "w-[150px]", render: (row) => <CellText>{row.amount}</CellText> },
    { key: "invoiceDate", header: "Inv Date", sortable: true, width: "w-[160px]", render: (row) => <CellText>{row.invoiceDate}</CellText> },
    { key: "dueDate", header: "Due Date", sortable: true, width: "w-[160px]", render: (row) => <CellText>{row.dueDate}</CellText> },
    { key: "status", header: "Status", width: "w-[130px]", render: (row) => <StatusBadge label={row.status} color={financeStatusColor[row.status]} /> },
    {
      key: "actions",
      header: "",
      width: "w-[120px]",
      render: (row) => (
        <div className="flex h-10 items-center justify-center gap-2">
          <IconButton type="button" color="grey" variant="ghost" size="sm" shape="square" aria-label="Download invoice">
            <CloudDownloadLinear size={16} />
          </IconButton>
          <CellActions
            actions={["eye", "trash"]}
            showKebab={false}
            onAction={(action) => {
              if (action === "eye") router.push(`/templates/finance-template/invoices/${row.id}`);
              if (action === "trash") setDeleteTarget(row);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <FinanceTemplateShell>
      <div className="flex flex-col gap-6">
        <FinancePageHeader
          title="Invoice"
          current="Invoice"
          actions={<Button color="blue" iconLeft={<AddCircleLinear size={18} />} onClick={() => router.push("/templates/finance-template/invoices/new")}>Add Invoice</Button>}
        />
        <Toolbar
          className="flex-col gap-4 lg:flex-row lg:items-center"
          left={<ToolbarSearchInput placeholder="Search. . ." />}
          right={<ToolbarActions><ToolbarDatepicker label="Select Dates" /><ProtaskFilterTrigger color="blue" /><ToolbarShowSelect value="10" /></ToolbarActions>}
        />
        <DataTable<Invoice> columns={columns} rows={invoices} color="blue" showCheckbox checkboxColor="blue" showPagination currentPage={1} totalPages={5} paginationLabel="Showing 1-10 from 100" />
        <ProtaskDeleteDialog
          open={!!deleteTarget || dialog === "delete" || dialog === "invoice-delete"}
          title="Delete Invoice?"
          description="Do you want to delete this invoice? This action can't be undone"
          onClose={closeDialog}
        />
      </div>
    </FinanceTemplateShell>
  );
}
