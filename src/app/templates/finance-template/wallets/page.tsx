"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddCircleLinear } from "solar-icon-set";
import {
  Button,
  CellActions,
  CellText,
  DataTable,
  Toolbar,
  ToolbarActions,
  ToolbarDatepicker,
  ToolbarSearchInput,
  ToolbarShowSelect,
} from "@forge-ui-official/core";
import type { ColumnDef } from "@forge-ui-official/core";
import {
  ProtaskDeleteDialog,
  ProtaskEditDialog,
  ProtaskFilterTrigger,
  ProtaskFormDialog,
  ProtaskSaveChangesDialog,
} from "../../_shared/protask-actions";
import { FieldLine, FinanceGoalCell, FinanceSurface, WalletProgressLine } from "../_components";
import { FinancePageHeader, FinanceTemplateShell } from "../_chrome";
import { wallets, type Wallet } from "../_data";

export default function FinanceWalletsPage() {
  return (
    <Suspense fallback={null}>
      <FinanceWalletsContent />
    </Suspense>
  );
}

function FinanceWalletsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<Wallet | null>(null);
  const [editTarget, setEditTarget] = useState<Wallet | null>(null);
  const dialog = searchParams.get("dialog");
  const view = searchParams.get("view");
  const walletId = searchParams.get("wallet");
  const queryTarget = wallets.find((wallet) => wallet.id === walletId) ?? wallets[0];
  const closeState = () => {
    setDeleteTarget(null);
    setEditTarget(null);
    if (dialog || view) router.replace("/templates/finance-template/wallets");
  };
  const openSaveConfirmation = () => {
    setEditTarget(null);
    router.push("/templates/finance-template/wallets?dialog=wallet-edit-confirmation");
  };
  const columns: ColumnDef<Wallet>[] = [
    {
      key: "name",
      header: "Goals",
      sortable: true,
      flex: true,
      render: (row) => <FinanceGoalCell title={row.name} color={row.color} />,
    },
    {
      key: "target",
      header: "Target",
      sortable: true,
      width: "w-[160px]",
      render: (row) => <CellText>{row.target}</CellText>,
    },
    {
      key: "progress",
      header: "Progress",
      width: "w-[260px]",
      render: (row) => <WalletProgressLine value={row.progress} color={row.color} />,
    },
    {
      key: "dueDate",
      header: "Due Date",
      sortable: true,
      width: "w-[160px]",
      render: (row) => <CellText>{row.dueDate}</CellText>,
    },
    {
      key: "created",
      header: "Created",
      sortable: true,
      width: "w-[160px]",
      render: (row) => <CellText>{row.created}</CellText>,
    },
    {
      key: "actions",
      header: "",
      width: "w-[120px]",
      render: (row) => (
        <CellActions
          actions={["eye", "pen", "trash"]}
          onAction={(action) => {
            if (action === "eye") router.push(`/templates/finance-template/wallets?view=details&wallet=${row.id}`);
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
          variant="collection"
          title="Wallet"
          current="Wallet"
          primaryAction={{ label: "Add Wallet", icon: <AddCircleLinear size={18} />, onClick: () => router.push("/templates/finance-template/wallets?dialog=add-wallet") }}
        />
        <Toolbar
          className="flex-col gap-4 lg:flex-row lg:items-center"
          left={<ToolbarSearchInput placeholder="Search. . ." />}
          right={<ToolbarActions><ToolbarDatepicker label="Select Dates" /><ProtaskFilterTrigger color="blue" count={3} /><ToolbarShowSelect value="10" /></ToolbarActions>}
        />
        <div className={view?.startsWith("details") ? "grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]" : ""}>
          <DataTable<Wallet>
            columns={columns}
            rows={wallets}
            color="blue"
            showCheckbox
            checkboxColor="blue"
            showPagination
            currentPage={1}
            totalPages={5}
            paginationLabel="Showing 1-10 from 100"
          />
          {view?.startsWith("details") && (
            <FinanceSurface title="Wallet Details" eyebrow={view === "details-ver-2" ? "Goal analytics" : "Goal progress"}>
              <FieldLine label="Goal" value={queryTarget.name} />
              <FieldLine label="Target" value={queryTarget.target} />
              <FieldLine label="Progress" value={`${queryTarget.progress}%`} />
              <FieldLine label="Due Date" value={queryTarget.dueDate} />
              <Button color="blue" className="mt-5 w-full" onClick={() => router.push(`/templates/finance-template/wallets?dialog=wallet-edit&wallet=${queryTarget.id}`)}>Edit Wallet</Button>
            </FinanceSurface>
          )}
        </div>
        <ProtaskDeleteDialog
          open={!!deleteTarget || dialog === "delete" || dialog === "wallet-delete"}
          title="Delete Wallet?"
          description="Do you want to delete this wallet? This action can't be undone"
          onClose={closeState}
        />
        <ProtaskEditDialog
          open={!!editTarget || dialog === "edit" || dialog === "wallet-edit"}
          title="Edit Wallet"
          description="Update wallet goal details before saving changes."
          fields={[
            { label: "Goal", value: (editTarget ?? queryTarget).name },
            { label: "Target", value: (editTarget ?? queryTarget).target },
            { label: "Due Date", value: (editTarget ?? queryTarget).dueDate },
            { label: "Progress", value: `${(editTarget ?? queryTarget).progress}%` },
          ]}
          onClose={closeState}
          onConfirm={openSaveConfirmation}
        />
        <ProtaskFormDialog
          open={dialog === "add-wallet" || dialog === "wallet-add-new" || dialog === "wallet-add-new-filled" || dialog === "wallet-add-new-select-icon"}
          title="Add New Wallet"
          submitLabel="Add Wallet"
          fields={[
            { label: "Goal Name", value: dialog?.includes("filled") ? "New Macbook" : "" },
            { label: "Target", value: dialog?.includes("filled") ? "$4,200" : "" },
            { label: "Due Date", value: dialog?.includes("filled") ? "24 Jan 2025" : "" },
            { label: "Icon", value: dialog?.includes("select-icon") ? "Travel" : "Wallet" },
          ]}
          onClose={closeState}
        />
        <ProtaskSaveChangesDialog
          open={dialog === "wallet-edit-confirmation" || dialog === "edit-confirmation"}
          onClose={closeState}
        />
      </div>
    </FinanceTemplateShell>
  );
}
