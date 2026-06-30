"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddCircleLinear, CloudDownloadLinear } from "solar-icon-set";
import {
  Button,
  CellActions,
  CellText,
  CellTextSubtitle,
  DataTable,
  StatusBadge,
  ToolbarActions,
  ToolbarDatepicker,
} from "@forge-ui-official/core";
import type { ColumnDef } from "@forge-ui-official/core";
import {
  ProtaskDeleteDialog,
  ProtaskEditDialog,
  ProtaskFilterTrigger,
  ProtaskSaveChangesDialog,
  ProtaskViewDialog,
} from "../../_shared/protask-actions";
import { FinanceBudgetPanel, FinanceExpenseGauge, FinanceSurface, FinanceTransactionCell } from "../_components";
import { FinancePageHeader, FinanceTemplateShell, transactionStatusColor } from "../_chrome";
import { transactions, type Transaction } from "../_data";

function transactionAccent(row: Transaction): "purple" | "green" | "blue" | "yellow" | "red" | "cyan" {
  if (row.category === "Housing" || row.category === "Transfer") return "blue";
  if (row.category === "Food" || row.category === "Shopping") return "purple";
  if (row.category === "Received") return "red";
  if (row.category === "Transportation") return "green";
  if (row.category === "Savings") return "cyan";
  return "yellow";
}

export default function FinanceTransactionsPage() {
  return (
    <Suspense fallback={null}>
      <FinanceTransactionsContent />
    </Suspense>
  );
}

function FinanceTransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewTarget, setViewTarget] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const dialog = searchParams.get("dialog");
  const queryTarget = transactions[0];
  const closeDialog = () => {
    setViewTarget(null);
    setDeleteTarget(null);
    setEditTarget(null);
    if (dialog) router.replace("/templates/finance-template/transactions");
  };
  const openSaveConfirmation = () => {
    setEditTarget(null);
    router.push("/templates/finance-template/transactions?dialog=edit-confirmation");
  };
  const columns: ColumnDef<Transaction>[] = [
    { key: "name", header: "Name/Business", sortable: true, flex: true, render: (row) => <FinanceTransactionCell title={row.name} subtitle={row.category} color={transactionAccent(row)} /> },
    { key: "amount", header: "Amount", sortable: true, width: "w-[170px]", render: (row) => <span className={row.amount.startsWith("+") ? "text-sm font-semibold leading-5 text-fg-green-500" : "text-sm font-semibold leading-5 text-fg-black"}>{row.amount}</span> },
    { key: "date", header: "Date & Time", sortable: true, width: "w-[180px]", render: (row) => <CellTextSubtitle title={row.date} subtitle={row.time} /> },
    { key: "status", header: "Status", width: "w-[140px]", render: (row) => <StatusBadge label={row.status} color={transactionStatusColor[row.status]} /> },
    {
      key: "actions",
      header: "",
      width: "w-[100px]",
      render: (row) => (
        <CellActions
          actions={["eye", "pen", "trash"]}
          onAction={(action) => {
            if (action === "eye") setViewTarget(row);
            if (action === "pen") setEditTarget(row);
            if (action === "trash") setDeleteTarget(row);
          }}
        />
      ),
    },
  ];

  return (
    <FinanceTemplateShell>
      <div className="flex flex-col gap-6">
        <FinancePageHeader
          title="Transactions"
          current="Transactions"
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button color="grey" variant="tertiary" iconLeft={<CloudDownloadLinear size={18} />}>Download Report</Button>
              <Button color="blue" iconLeft={<AddCircleLinear size={18} />}>Add Payment</Button>
            </div>
          }
        />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-5">
            <FinanceSurface title="All Expenses">
              <FinanceExpenseGauge />
            </FinanceSurface>
            <FinanceBudgetPanel />
          </aside>

          <DataTable<Transaction>
            title="Transaction"
            subtitle="All your transactions"
            headerActions={
              <ToolbarActions>
                <ToolbarDatepicker label="Select Dates" />
                <ProtaskFilterTrigger color="blue" count={3} />
              </ToolbarActions>
            }
            columns={columns}
            rows={transactions}
            color="blue"
            showPagination
            currentPage={1}
            totalPages={5}
            paginationLabel="Showing 1-5 from 100"
          />
        </div>
        <ProtaskDeleteDialog
          open={!!deleteTarget || dialog === "delete" || dialog === "transactions-delete" || dialog === "delete-transaction"}
          title="Delete Transaction?"
          description="Do you want to delete this transaction? This action can't be undone"
          onClose={closeDialog}
        />
        <ProtaskViewDialog
          open={!!viewTarget || dialog === "view-transaction" || dialog === "transaction-details"}
          title="Transaction Details"
          fields={[
            { label: "Name", value: (viewTarget ?? queryTarget).name },
            { label: "Business", value: (viewTarget ?? queryTarget).business },
            { label: "Category", value: (viewTarget ?? queryTarget).category },
            { label: "Amount", value: (viewTarget ?? queryTarget).amount },
            { label: "Date", value: (viewTarget ?? queryTarget).date },
            { label: "Status", value: (viewTarget ?? queryTarget).status },
          ]}
          onClose={closeDialog}
        />
        <ProtaskEditDialog
          open={!!editTarget || dialog === "edit" || dialog === "edit-transaction"}
          title="Edit Transaction"
          description="Adjust transaction fields before saving changes."
          fields={[
            { label: "Name", value: (editTarget ?? queryTarget).name },
            { label: "Business", value: (editTarget ?? queryTarget).business },
            { label: "Amount", value: (editTarget ?? queryTarget).amount },
            { label: "Status", value: (editTarget ?? queryTarget).status },
          ]}
          onClose={closeDialog}
          onConfirm={openSaveConfirmation}
        />
        <ProtaskSaveChangesDialog
          open={dialog === "edit-confirmation"}
          onClose={closeDialog}
        />
      </div>
    </FinanceTemplateShell>
  );
}
