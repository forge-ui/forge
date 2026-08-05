"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddCircleLinear, CloudDownloadLinear } from "solar-icon-set";
import {
  Button,
  CellActions,
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
  ProtaskFormDialog,
  ProtaskSaveChangesDialog,
} from "../../_shared/protask-actions";
import { FieldLine, FinanceBudgetPanel, FinanceSurface, FinanceTransactionCell, VisualCard } from "../_components";
import { FinancePageHeader, FinanceTemplateShell, transactionStatusColor } from "../_chrome";
import { cards, transactions, type Transaction } from "../_data";

function transactionAccent(row: Transaction): "purple" | "green" | "blue" | "yellow" | "red" | "cyan" {
  if (row.category === "Housing" || row.category === "Transfer") return "blue";
  if (row.category === "Food" || row.category === "Shopping") return "purple";
  if (row.category === "Received") return "red";
  if (row.category === "Transportation") return "green";
  if (row.category === "Savings") return "cyan";
  return "yellow";
}

export default function FinanceCardsPage() {
  return (
    <Suspense fallback={null}>
      <FinanceCardsContent />
    </Suspense>
  );
}

function FinanceCardsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const dialog = searchParams.get("dialog");
  const view = searchParams.get("view");
  const activeCard = cards[0];
  const isCardDialog = dialog === "card-edit-card" || dialog === "edit-card";
  const closeState = () => {
    setDeleteTarget(null);
    setEditTarget(null);
    if (dialog || view) router.replace("/templates/finance-template/cards");
  };
  const openSaveConfirmation = () => {
    setEditTarget(null);
    router.push("/templates/finance-template/cards?dialog=card-edit-card-confirmation");
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
            if (action === "eye") router.push("/templates/finance-template/cards?view=card-details");
            if (action === "pen") setEditTarget(row);
            if (action === "trash") setDeleteTarget(row);
          }}
        />
      ),
    },
  ];

  return (
    <FinanceTemplateShell>
      <div className="flex flex-col gap-5">
        <FinancePageHeader
          title="Card"
          current="Card"
          actions={<Button color="grey" variant="tertiary" iconLeft={<CloudDownloadLinear size={18} />}>Download Report</Button>}
        />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-5">
            <FinanceSurface
              title="Card"
              eyebrow="All Your Cards"
              action={<CellActions actions={[]} />}
            >
              <div className="flex max-h-[620px] flex-col gap-4 overflow-hidden">
                {cards.map((card) => (
                  <VisualCard key={card.id} {...card} />
                ))}
                <Button color="grey" variant="tertiary" iconLeft={<AddCircleLinear size={16} />} onClick={() => router.push("/templates/finance-template/cards?dialog=card-add-card")}>Add New Card</Button>
              </div>
            </FinanceSurface>
            {view?.startsWith("card-details") && (
              <FinanceSurface title="Card Details" eyebrow={view === "card-details-ver-3" ? "Spending limits" : "Card information"}>
                <FieldLine label="Name" value={activeCard.name} />
                <FieldLine label="Type" value={activeCard.type} />
                <FieldLine label="Number" value={`**** **** **** ${activeCard.last4}`} />
                <FieldLine label="Balance" value={activeCard.balance} />
                <Button color="blue" className="mt-5 w-full" onClick={() => router.push("/templates/finance-template/cards?dialog=card-edit-card")}>Edit Card</Button>
              </FinanceSurface>
            )}
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
          open={!!deleteTarget || dialog === "delete" || dialog === "card-delete" || dialog === "delete-card"}
          title={dialog === "card-delete" || dialog === "delete-card" ? "Delete Card?" : "Delete Transaction?"}
          description={dialog === "card-delete" || dialog === "delete-card" ? "Do you want to delete this card? This action can't be undone" : "Do you want to delete this transaction? This action can't be undone"}
          onClose={closeState}
        />
        <ProtaskEditDialog
          open={!!editTarget || dialog === "edit" || isCardDialog}
          title={isCardDialog ? "Edit Card" : "Edit Transaction"}
          description={isCardDialog ? "Update card holder, number and billing fields." : "Adjust transaction fields before saving changes."}
          fields={[
            { label: "Name", value: isCardDialog ? activeCard.name : editTarget?.name ?? transactions[0].name },
            { label: "Business", value: isCardDialog ? activeCard.type : editTarget?.business ?? transactions[0].business },
            { label: "Amount", value: isCardDialog ? activeCard.balance : editTarget?.amount ?? transactions[0].amount },
            { label: "Status", value: editTarget?.status ?? transactions[0].status },
          ]}
          onClose={closeState}
          onConfirm={openSaveConfirmation}
        />
        <ProtaskFormDialog
          open={dialog === "card-add-card" || dialog === "card-add-card-filled"}
          title="Add Card"
          submitLabel="Add Card"
          fields={[
            { label: "Card Holder", value: dialog === "card-add-card-filled" ? "John Doe Hoegan" : "" },
            { label: "Card Number", value: dialog === "card-add-card-filled" ? "4556 5421 6542 8874" : "" },
            { label: "Valid Thru", value: dialog === "card-add-card-filled" ? "07/25" : "" },
            { label: "Card Type", value: dialog === "card-add-card-filled" ? "Mastercard" : "" },
          ]}
          onClose={closeState}
        />
        <ProtaskSaveChangesDialog
          open={dialog === "card-edit-card-confirmation" || dialog === "edit-confirmation"}
          onClose={closeState}
        />
      </div>
    </FinanceTemplateShell>
  );
}
