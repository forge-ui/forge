"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddCircleLinear } from "solar-icon-set";
import { Button, CellActions, CellText, DataTable, SelectOption, TextField } from "@forge-ui-official/core";
import type { ColumnDef } from "@forge-ui-official/core";
import { ProtaskDeleteDialog, ProtaskSaveChangesDialog } from "../../../_shared/protask-actions";
import { FieldLine, FinanceSurface } from "../../_components";
import { FinancePageHeader, FinanceTemplateShell } from "../../_chrome";

type LineItem = {
  item: string;
  rate: string;
  quantity: string;
  total: string;
};

const lineItems: LineItem[] = [
  { item: "Protask design system setup", rate: "$600.00", quantity: "2", total: "$1,200.00" },
  { item: "Dashboard implementation", rate: "$450.00", quantity: "2", total: "$900.00" },
  { item: "QA and handoff", rate: "$220.00", quantity: "1", total: "$220.00" },
];

export default function FinanceInvoiceFormPage() {
  return (
    <Suspense fallback={null}>
      <FinanceInvoiceFormContent />
    </Suspense>
  );
}

function FinanceInvoiceFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<LineItem | null>(null);
  const mode = searchParams.get("mode") ?? searchParams.get("state") ?? "empty";
  const dialog = searchParams.get("dialog");
  const isEdit = mode === "edit" || dialog === "edit-invoice";
  const isFilled = mode === "filled" || isEdit || dialog === "add-invoice-filled";
  const visibleLineItems = isFilled ? lineItems : [];
  const closeDialog = () => {
    setDeleteTarget(null);
    if (dialog || mode !== "empty") router.replace("/templates/finance-template/invoices/new");
  };
  const columns: ColumnDef<LineItem>[] = [
    { key: "item", header: "Item", flex: true, render: (row) => <CellText>{row.item}</CellText> },
    { key: "rate", header: "Rate", width: "w-[130px]", render: (row) => <CellText>{row.rate}</CellText> },
    { key: "quantity", header: "Qty", width: "w-[100px]", render: (row) => <CellText>{row.quantity}</CellText> },
    { key: "total", header: "Total", width: "w-[130px]", render: (row) => <CellText>{row.total}</CellText> },
    {
      key: "actions",
      header: "",
      width: "w-[80px]",
      render: (row) => <CellActions actions={["trash"]} onAction={() => setDeleteTarget(row)} />,
    },
  ];

  return (
    <FinanceTemplateShell>
      <div className="flex flex-col gap-6">
        <FinancePageHeader title={isEdit ? "Edit Invoice" : "Add Invoice"} current={isEdit ? "Edit Invoice" : "Add Invoice"} actions={<Button color="blue" onClick={() => router.push("/templates/finance-template/invoices/new?dialog=edit-invoice-confirmation")}>Save Invoice</Button>} />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <FinanceSurface title="Invoice Fields" eyebrow="Bill-to, dates and line items" className="min-w-0">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <SelectOption label="Customer" value={isFilled ? "lisa" : ""} width="100%" options={[{ value: "lisa", label: "Lisa Greg" }, { value: "karim", label: "Mohammad Karim" }, { value: "john", label: "John Bushmill" }]} />
              <TextField color="blue" label="Invoice ID" value={isFilled ? "INV302022" : ""} />
              <TextField color="blue" label="Invoice Date" value={isFilled ? "24 Jan 2025" : ""} />
              <TextField color="blue" label="Due Date" value={isFilled ? "31 Jan 2025" : ""} />
            </div>
            <div className="mt-6">
              <DataTable<LineItem> title="Line Items" columns={columns} rows={visibleLineItems} color="blue" />
            </div>
            <Button color="grey" variant="tertiary" iconLeft={<AddCircleLinear size={18} />} className="mt-5">Add Line Item</Button>
          </FinanceSurface>
          <FinanceSurface title="Summary" eyebrow="Invoice total">
            <div className="space-y-4">
              <FieldLine label="Subtotal" value="$2,320.00" />
              <FieldLine label="Tax" value="$232.00" />
              <FieldLine label="Discount" value="$0.00" />
              <div className="rounded-[20px] bg-fg-blue-50 p-5">
                <p className="text-sm font-medium text-fg-blue">Total</p>
                <p className="mt-1 text-2xl font-semibold text-fg-blue">{isFilled ? "$2,552.00" : "$0.00"}</p>
              </div>
              <Button color="blue" className="w-full">Send Invoice</Button>
            </div>
          </FinanceSurface>
        </div>
        <ProtaskDeleteDialog
          open={!!deleteTarget}
          title="Delete Line Item?"
          description="Do you want to delete this invoice line item? This action can't be undone"
          onClose={closeDialog}
        />
        <ProtaskSaveChangesDialog
          open={dialog === "edit-invoice-confirmation" || mode === "confirmation"}
          onClose={closeDialog}
        />
      </div>
    </FinanceTemplateShell>
  );
}
