"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AddCircleLinear,
  CheckCircleBoldDuotone,
  CloseCircleBoldDuotone,
  CloudDownloadLinear,
  UsersGroupTwoRoundedBoldDuotone,
} from "solar-icon-set";
import {
  Avatar,
  AvatarGroup,
  CellActions,
  CellImageText,
  CellText,
  DataTable,
  SmoothLineChart,
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
  ProtaskEditDialog,
  ProtaskFilterTrigger,
  ProtaskSaveChangesDialog,
} from "../../_shared/protask-actions";
import { CrmMetricCard } from "../_components";
import { CrmPageHeader, CrmTemplateShell, leadStatusColor } from "../_chrome";
import { leads, logo, mainProfile, type Lead } from "../_data";

export default function CrmLeadsPage() {
  return (
    <Suspense fallback={null}>
      <CrmLeadsContent />
    </Suspense>
  );
}

function CrmLeadsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [editTarget, setEditTarget] = useState<Lead | null>(null);
  const dialog = searchParams.get("dialog");
  const queryTarget = leads[0];
  const closeDialog = () => {
    setDeleteTarget(null);
    setEditTarget(null);
    if (dialog) router.replace("/templates/crm-template/leads");
  };
  const openSaveConfirmation = () => {
    setEditTarget(null);
    router.push("/templates/crm-template/leads?dialog=edit-leads-confirmation");
  };
  const columns: ColumnDef<Lead>[] = [
    { key: "profile", header: "Profile", sortable: true, width: "w-[240px]", render: (row) => <CellImageText src={row.avatar} title={row.name} subtitle={row.email} rounded="full" /> },
    { key: "phone", header: "Phone", width: "w-[150px]", render: (row) => <CellText>{row.phone}</CellText> },
    { key: "orders", header: "Orders", sortable: true, width: "w-[190px]", render: (row) => <CellImageText src={logo(row.company.slice(0, 2), "ede9fe")} title={row.company} subtitle="Company" /> },
    { key: "status", header: "Status", width: "w-[120px]", render: (row) => <StatusBadge label={row.status} color={leadStatusColor[row.status]} /> },
    { key: "source", header: "Source", width: "w-[150px]", render: (row) => <CellText>{row.source}</CellText> },
    { key: "salesman", header: "Salesman", width: "w-[190px]", render: () => <CellImageText src={mainProfile.avatar} title="John D Hoegan" subtitle="Manager" rounded="full" /> },
    {
      key: "actions",
      header: "",
      width: "w-[90px]",
      render: (row) => (
        <CellActions
          actions={["eye", "pen", "trash"]}
          onAction={(action) => {
            if (action === "eye") router.push(`/templates/crm-template/leads/${row.id}`);
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
          variant="collection"
          title="Leads"
          current="Leads"
          secondaryAction={{ label: "Export", icon: <CloudDownloadLinear size={18} /> }}
          primaryAction={{ label: "Add New", icon: <AddCircleLinear size={18} />, onClick: () => router.push("/templates/crm-template/leads/new") }}
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <CrmMetricCard
            title="Total"
            value="14,213"
            date="2 Jul - Today"
            trend="10%"
            note="+150 today"
            icon={<UsersGroupTwoRoundedBoldDuotone size={20} />}
            iconClassName="bg-fg-grey-50 text-fg-violet"
            footer={
              <AvatarGroup>
                {leads.slice(0, 3).map((lead) => (
                  <Avatar key={lead.id} src={lead.avatar} alt={lead.name} size="md" />
                ))}
              </AvatarGroup>
            }
          />
          <CrmMetricCard
            title="Success"
            value="2,419"
            date="2 Jul - Today"
            trend="2%"
            note="+150 today"
            icon={<CheckCircleBoldDuotone size={20} />}
            iconClassName="bg-fg-grey-50 text-fg-green-500"
            footer={
              <SmoothLineChart
                series={[{ data: [62, 59, 60, 55, 53, 57, 58, 61], color: "var(--fg-green-500)", fillArea: true }]}
                height="h-16"
                yDomain={[48, 66]}
              />
            }
          />
          <CrmMetricCard
            title="Lost"
            value="12,235"
            date="2 Jul - Today"
            trend="2%"
            note="+150 today"
            icon={<CloseCircleBoldDuotone size={20} />}
            iconClassName="bg-fg-grey-50 text-fg-red"
            footer={
              <SmoothLineChart
                series={[{ data: [44, 47, 43, 41, 38, 35, 33, 31], color: "var(--fg-red)", fillArea: true }]}
                height="h-16"
                yDomain={[28, 50]}
              />
            }
          />
        </div>
        <div className="h-px w-full bg-fg-grey-200" />
        <Toolbar
          className="flex-col gap-4 lg:flex-row lg:items-center"
          left={<ToolbarSearchInput placeholder="Search. . ." />}
          right={<ToolbarActions><ToolbarDatepicker label="Select Dates" /><ProtaskFilterTrigger color="purple" count={0} /><ToolbarShowSelect value="10" /></ToolbarActions>}
        />
        <DataTable<Lead> columns={columns} rows={leads} showCheckbox showPagination currentPage={1} totalPages={6} paginationLabel="Showing 1-10 from 100" />
        <ProtaskDeleteDialog
          open={!!deleteTarget || dialog === "delete" || dialog === "delete-leads"}
          title="Delete Leads?"
          description="Do you want to delete this leads? This action can't be undone"
          onClose={closeDialog}
        />
        <ProtaskEditDialog
          open={!!editTarget || dialog === "edit" || dialog === "edit-leads"}
          title="Edit Leads"
          description="Adjust lead source, owner and stage before saving."
          fields={[
            { label: "Name", value: (editTarget ?? queryTarget).name },
            { label: "Company", value: (editTarget ?? queryTarget).company },
            { label: "Source", value: (editTarget ?? queryTarget).source },
            { label: "Status", value: (editTarget ?? queryTarget).status },
          ]}
          onClose={closeDialog}
          onConfirm={openSaveConfirmation}
        />
        <ProtaskSaveChangesDialog
          open={dialog === "edit-confirmation" || dialog === "edit-leads-confirmation"}
          onClose={closeDialog}
        />
      </div>
    </CrmTemplateShell>
  );
}
