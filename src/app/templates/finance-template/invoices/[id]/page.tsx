"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { CloudDownloadLinear, Pen2Linear } from "solar-icon-set";
import { Avatar, Button, CellText, DataTable, StatusBadge } from "@forge-ui-official/core";
import type { ColumnDef } from "@forge-ui-official/core";
import { FieldLine, FinanceSurface } from "../../_components";
import { FinancePageHeader, FinanceTemplateShell, financeStatusColor } from "../../_chrome";
import { invoices } from "../../_data";

type LineItem = {
  name: string;
  rate: string;
  quantity: string;
  total: string;
};

const lineItems: LineItem[] = [
  { name: "Protask design system setup", rate: "$600.00", quantity: "2", total: "$1,200.00" },
  { name: "Dashboard implementation", rate: "$450.00", quantity: "2", total: "$900.00" },
  { name: "QA and handoff", rate: "$220.00", quantity: "1", total: "$220.00" },
];

export default function FinanceInvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const invoice = useMemo(() => invoices.find((item) => item.id === params.id) ?? invoices[0], [params.id]);
  const columns: ColumnDef<LineItem>[] = [
    { key: "name", header: "Description", flex: true, render: (row) => <CellText>{row.name}</CellText> },
    { key: "rate", header: "Rate", width: "w-[140px]", render: (row) => <CellText>{row.rate}</CellText> },
    { key: "quantity", header: "Qty", width: "w-[110px]", render: (row) => <CellText>{row.quantity}</CellText> },
    { key: "total", header: "Total", width: "w-[150px]", render: (row) => <CellText>{row.total}</CellText> },
  ];

  return (
    <FinanceTemplateShell>
      <div className="flex flex-col gap-5">
        <FinancePageHeader
          variant="detail"
          title="Invoice Details"
          current="Invoice Details"
          secondaryAction={{ label: "Download", icon: <CloudDownloadLinear size={18} /> }}
          primaryAction={{ label: "Edit Invoice", icon: <Pen2Linear size={18} />, onClick: () => router.push("/templates/finance-template/invoices/new") }}
        />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <FinanceSurface className="min-w-0">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col justify-between gap-5 border-b border-fg-grey-200 pb-6 lg:flex-row lg:items-start">
                <div>
                  <p className="text-sm font-medium text-fg-grey-500">Invoice Number</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-fg text-fg-black">{invoice.invoiceNumber}</h2>
                </div>
                <StatusBadge label={invoice.status} color={financeStatusColor[invoice.status]} />
              </div>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-[20px] border border-fg-grey-200 p-5">
                  <p className="text-xs font-medium uppercase tracking-fg text-fg-grey-500">Bill To</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar src={invoice.avatar} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-fg-black">{invoice.billTo}</p>
                      <p className="text-xs font-medium text-fg-grey-500">{invoice.email}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[20px] border border-fg-grey-200 p-5">
                  <p className="text-xs font-medium uppercase tracking-fg text-fg-grey-500">Pay From</p>
                  <p className="mt-4 text-sm font-semibold text-fg-black">Sugab&apos;s Team</p>
                  <p className="mt-1 text-xs font-medium text-fg-grey-500">finance@protask.com</p>
                </div>
              </div>
              <DataTable<LineItem> columns={columns} rows={lineItems} color="blue" />
              <div className="ml-auto w-full max-w-[320px] rounded-[20px] bg-fg-grey-50 p-5">
                <FieldLine label="Subtotal" value="$2,320.00" />
                <FieldLine label="Tax" value="$232.00" />
                <FieldLine label="Discount" value="$0.00" />
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm font-semibold text-fg-black">Total</span>
                  <span className="text-2xl font-semibold text-fg-black">$2,552.00</span>
                </div>
              </div>
            </div>
          </FinanceSurface>
          <FinanceSurface title="Invoice Summary" eyebrow="Payment schedule">
            <FieldLine label="Invoice Date" value={invoice.invoiceDate} />
            <FieldLine label="Due Date" value={invoice.dueDate} />
            <FieldLine label="Amount" value={invoice.amount} />
            <FieldLine label="Terms" value="Net 7" />
            <div className="mt-5">
              <Button color="blue" className="w-full">Send Reminder</Button>
            </div>
          </FinanceSurface>
        </div>
      </div>
    </FinanceTemplateShell>
  );
}
