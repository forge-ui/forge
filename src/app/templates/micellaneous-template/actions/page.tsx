"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddCircleLinear } from "solar-icon-set";
import { Button, CellActions, CellText, DataTable, StatusBadge, Toolbar, ToolbarActions, ToolbarSearchInput, ToolbarShowSelect } from "@forge-ui-official/core";
import type { ColumnDef, StatusBadgeColor } from "@forge-ui-official/core";
import { ProtaskDeleteDialog, ProtaskEditDialog, ProtaskFilterTrigger, ProtaskViewDialog } from "../../_shared/protask-actions";
import { MicellaneousPageHeader, MicellaneousTemplateShell } from "../_chrome";
import { actions, type ActionRow } from "../_data";

const priorityColor: Record<ActionRow["priority"], StatusBadgeColor> = {
  High: "red",
  Medium: "yellow",
  Low: "grey",
};

const statusColor: Record<ActionRow["status"], StatusBadgeColor> = {
  Open: "blue",
  "In Review": "yellow",
  Done: "green",
  Blocked: "red",
};

export default function MicellaneousActionsPage() {
  return (
    <Suspense fallback={null}>
      <MicellaneousActionsContent />
    </Suspense>
  );
}

function MicellaneousActionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewTarget, setViewTarget] = useState<ActionRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ActionRow | null>(null);
  const [editTarget, setEditTarget] = useState<ActionRow | null>(null);
  const dialog = searchParams.get("dialog");
  const queryTarget = actions[0];
  const closeDialog = () => {
    setViewTarget(null);
    setDeleteTarget(null);
    setEditTarget(null);
    if (dialog) router.replace("/templates/micellaneous-template/actions");
  };

  const columns: ColumnDef<ActionRow>[] = [
    { key: "id", header: "ID", sortable: true, width: "w-[130px]", render: (row) => <CellText>{row.id}</CellText> },
    { key: "title", header: "Task", flex: true, render: (row) => <CellText>{row.title}</CellText> },
    { key: "owner", header: "Owner", width: "w-[180px]", render: (row) => <CellText>{row.owner}</CellText> },
    { key: "due", header: "Due Date", sortable: true, width: "w-[160px]", render: (row) => <CellText>{row.due}</CellText> },
    { key: "priority", header: "Priority", width: "w-[130px]", render: (row) => <StatusBadge label={row.priority} color={priorityColor[row.priority]} /> },
    { key: "status", header: "Status", width: "w-[140px]", render: (row) => <StatusBadge label={row.status} color={statusColor[row.status]} /> },
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
    <MicellaneousTemplateShell>
      <div className="flex flex-col gap-6">
        <MicellaneousPageHeader title="Table Action" current="Table Action" actions={<Button iconLeft={<AddCircleLinear size={18} />}>Add Action</Button>} />
        <Toolbar
          className="flex-col gap-4 lg:flex-row lg:items-center"
          left={<ToolbarSearchInput placeholder="Search actions..." />}
          right={<ToolbarActions><ProtaskFilterTrigger color="purple" /><ToolbarShowSelect value="10" /></ToolbarActions>}
        />
        <DataTable<ActionRow> title="Action Board" subtitle="Table and row action pattern" columns={columns} rows={actions} showCheckbox showPagination currentPage={1} totalPages={3} paginationLabel="Showing 1-4 from 24" />
        <ProtaskDeleteDialog
          open={Boolean(deleteTarget) || dialog === "delete" || dialog === "delete-action"}
          title="Delete Action?"
          description="Do you want to delete this action? This action can't be undone."
          onClose={closeDialog}
        />
        <ProtaskViewDialog
          open={Boolean(viewTarget) || dialog === "view" || dialog === "view-action"}
          title="Action Details"
          fields={[
            { label: "ID", value: (viewTarget ?? queryTarget).id },
            { label: "Task", value: (viewTarget ?? queryTarget).title },
            { label: "Owner", value: (viewTarget ?? queryTarget).owner },
            { label: "Due Date", value: (viewTarget ?? queryTarget).due },
            { label: "Priority", value: (viewTarget ?? queryTarget).priority },
            { label: "Status", value: (viewTarget ?? queryTarget).status },
          ]}
          onClose={closeDialog}
        />
        <ProtaskEditDialog
          open={Boolean(editTarget) || dialog === "edit" || dialog === "edit-action"}
          title="Edit Action"
          description="Update the row action fields before saving."
          fields={[
            { label: "Task", value: (editTarget ?? queryTarget).title },
            { label: "Owner", value: (editTarget ?? queryTarget).owner },
            { label: "Due Date", value: (editTarget ?? queryTarget).due },
            { label: "Status", value: (editTarget ?? queryTarget).status },
          ]}
          onClose={closeDialog}
        />
      </div>
    </MicellaneousTemplateShell>
  );
}
