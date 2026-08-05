"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddCircleLinear, CloudDownloadLinear, DocumentTextBoldDuotone } from "solar-icon-set";
import { Button, CellActions, CellImageText, CellText, DataTable, StatusBadge, Toolbar, ToolbarActions, ToolbarDatepicker, ToolbarSearchInput, ToolbarShowSelect } from "@forge-ui-official/core";
import type { ColumnDef } from "@forge-ui-official/core";
import {
  ProtaskDeleteDialog,
  ProtaskEditDialog,
  ProtaskFilterTrigger,
  ProtaskSaveChangesDialog,
} from "../../_shared/protask-actions";
import { CrmPageHeader, CrmTemplateShell, saleStatusColor } from "../_chrome";
import { sales, type Sale } from "../_data";

export default function CrmSalesPage() {
  return (
    <Suspense fallback={null}>
      <CrmSalesContent />
    </Suspense>
  );
}

function CrmSalesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<Sale | null>(null);
  const [editTarget, setEditTarget] = useState<Sale | null>(null);
  const dialog = searchParams.get("dialog");
  const queryTarget = sales[0];
  const closeDialog = () => {
    setDeleteTarget(null);
    setEditTarget(null);
    if (dialog) router.replace("/templates/crm-template/sales");
  };
  const openSaveConfirmation = () => {
    setEditTarget(null);
    router.push("/templates/crm-template/sales?dialog=edit-sales-confirmation");
  };
  const columns: ColumnDef<Sale>[] = [
    {
      key: "transactions",
      header: "Transactions",
      sortable: true,
      width: "w-[260px]",
      render: (row) => (
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-fg-violet-100 text-fg-violet">
            <DocumentTextBoldDuotone size={18} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-5 tracking-fg text-fg-black">{row.transaction}</p>
            <p className="truncate text-xs font-normal leading-4 tracking-fg text-fg-grey-700">{row.invoiceId}</p>
          </div>
        </div>
      ),
    },
    { key: "total", header: "Total", width: "w-[140px]", render: (row) => <CellText>{row.total}</CellText> },
    { key: "client", header: "Client", width: "w-[220px]", render: (row) => <CellImageText src={row.clientAvatar} title={row.client} subtitle={row.clientCompany} rounded="full" /> },
    { key: "payment", header: "Payment", width: "w-[160px]", render: (row) => <CellText>{row.payment}</CellText> },
    { key: "status", header: "Status", width: "w-[130px]", render: (row) => <StatusBadge label={row.status} color={saleStatusColor[row.status]} /> },
    {
      key: "actions",
      header: "",
      width: "w-[100px]",
      render: (row) => (
        <CellActions
          actions={["eye", "pen", "trash"]}
          onAction={(action) => {
            if (action === "eye") router.push(`/templates/crm-template/sales/${row.id}`);
            if (action === "pen") setEditTarget(row);
            if (action === "trash") setDeleteTarget(row);
          }}
        />
      ),
    },
  ];

  return (
    <CrmTemplateShell>
      <div className="flex flex-col gap-5">
        <CrmPageHeader
          title="Sales"
          current="Sales"
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button color="grey" variant="tertiary" iconLeft={<CloudDownloadLinear size={18} />}>Export</Button>
              <Button iconLeft={<AddCircleLinear size={18} />} onClick={() => router.push("/templates/crm-template/sales/new")}>Add New</Button>
            </div>
          }
        />
        <Toolbar
          className="flex-col gap-4 lg:flex-row lg:items-center"
          left={<ToolbarSearchInput placeholder="Search. . ." />}
          right={<ToolbarActions><ToolbarDatepicker label="Select Dates" /><ProtaskFilterTrigger color="purple" count={0} /><ToolbarShowSelect value="10" /></ToolbarActions>}
        />
        <DataTable<Sale> columns={columns} rows={sales} showCheckbox showPagination currentPage={1} totalPages={6} paginationLabel="Showing 1-10 from 100" />
        <ProtaskDeleteDialog
          open={!!deleteTarget || dialog === "delete" || dialog === "delete-sales"}
          title="Delete Sales?"
          description="Do you want to delete this sales record? This action can't be undone"
          onClose={closeDialog}
        />
        <ProtaskEditDialog
          open={!!editTarget || dialog === "edit" || dialog === "edit-sales"}
          title="Edit Sales"
          description="Update deal fields before saving changes."
          fields={[
            { label: "Sales ID", value: (editTarget ?? queryTarget).id },
            { label: "Customer", value: (editTarget ?? queryTarget).customer },
            { label: "Amount", value: (editTarget ?? queryTarget).amount },
            { label: "Status", value: (editTarget ?? queryTarget).status },
          ]}
          onClose={closeDialog}
          onConfirm={openSaveConfirmation}
        />
        <ProtaskSaveChangesDialog
          open={dialog === "edit-confirmation" || dialog === "edit-sales-confirmation"}
          onClose={closeDialog}
        />
      </div>
    </CrmTemplateShell>
  );
}
