"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AddCircleLinear,
  CheckCircleBoldDuotone,
  CloudDownloadLinear,
  UserBoldDuotone,
  WalletMoneyBoldDuotone,
} from "solar-icon-set";
import {
  Avatar,
  AvatarGroup,
  Button,
  CellActions,
  CellImageText,
  CellText,
  DataTable,
  DonutChart,
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
  ProtaskFilterDialog,
  ProtaskFilterTrigger,
  ProtaskSaveChangesDialog,
} from "../../_shared/protask-actions";
import { CrmMetricCard } from "../_components";
import { CrmPageHeader, CrmTemplateShell, customerStatusColor } from "../_chrome";
import { customers, type Customer } from "../_data";

export default function CrmCustomersPage() {
  return (
    <Suspense fallback={null}>
      <CrmCustomersContent />
    </Suspense>
  );
}

function CrmCustomersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const dialog = searchParams.get("dialog");
  const queryTarget = customers[0];
  const closeDialog = () => {
    setDeleteTarget(null);
    setEditTarget(null);
    if (dialog) router.replace("/templates/crm-template/customers");
  };
  const openSaveConfirmation = () => {
    setEditTarget(null);
    router.push("/templates/crm-template/customers?dialog=edit-customer-confirmation");
  };
  const columns: ColumnDef<Customer>[] = [
    {
      key: "profile",
      header: "Profile",
      sortable: true,
      flex: true,
      render: (row) => <CellImageText src={row.avatar} title={row.name} subtitle={row.email} rounded="full" />,
    },
    { key: "phone", header: "Phone", width: "w-[150px]", render: (row) => <CellText>{row.phone}</CellText> },
    { key: "orders", header: "Orders", sortable: true, width: "w-[210px]", render: (row) => <CellImageText src={row.companyLogo} title={row.company} subtitle={row.location} /> },
    { key: "spent", header: "Spent", sortable: true, width: "w-[140px]", render: (row) => <CellText>{row.spent}</CellText> },
    { key: "status", header: "Status", sortable: true, width: "w-[130px]", render: (row) => <StatusBadge label={row.status} color={customerStatusColor[row.status]} /> },
    {
      key: "actions",
      header: "",
      width: "w-[100px]",
      render: (row) => (
        <CellActions
          actions={["eye", "pen", "trash"]}
          onAction={(action) => {
            if (action === "eye") router.push(`/templates/crm-template/customers/${row.id}`);
            if (action === "pen") setEditTarget(row);
            if (action === "trash") setDeleteTarget(row);
          }}
        />
      ),
    },
  ];

  return (
    <CrmTemplateShell>
      <div className="flex flex-col gap-6">
        <CrmPageHeader
          title="Customer"
          current="Customer"
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button color="grey" variant="tertiary" iconLeft={<CloudDownloadLinear size={18} />}>Export</Button>
              <Button iconLeft={<AddCircleLinear size={18} />} onClick={() => router.push("/templates/crm-template/customers/new")}>Add New</Button>
            </div>
          }
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <CrmMetricCard
            title="Customer"
            value="14,213"
            date="2 Jul - Today"
            trend="10%"
            note="+150 today"
            icon={<UserBoldDuotone size={20} />}
            iconClassName="bg-fg-violet-100 text-fg-violet"
            footer={
              <AvatarGroup>
                {customers.slice(0, 3).map((customer) => (
                  <Avatar key={customer.id} src={customer.avatar} alt={customer.name} size="md" />
                ))}
              </AvatarGroup>
            }
          />
          <CrmMetricCard
            title="Total Revenue"
            value="$41,235"
            date="2 Jul - Today"
            trend="2%"
            note="+$150 today"
            icon={<WalletMoneyBoldDuotone size={20} />}
            iconClassName="bg-fg-green-100 text-fg-green-500"
            footer={
              <SmoothLineChart
                series={[{ data: [72, 70, 54, 45, 58, 60, 66, 69, 63, 70, 66, 71, 76], color: "var(--fg-green-500)", fillArea: true }]}
                height="h-16"
                yDomain={[40, 82]}
              />
            }
          />
          <CrmMetricCard
            title="Succes Rate"
            value="45.6%"
            date="2 Jul - Today"
            trend="2%"
            trendDirection="down"
            note="-5% today"
            icon={<CheckCircleBoldDuotone size={20} />}
            iconClassName="bg-fg-red-100 text-fg-red"
            footer={
              <div className="w-20">
                <DonutChart
                  segments={[{ value: 36, color: "var(--fg-red)" }]}
                  trackColor="var(--fg-grey-200)"
                  size="sm"
                />
              </div>
            }
          />
        </div>
        <div className="h-px w-full bg-fg-grey-200" />
        <Toolbar
          className="flex-col gap-4 lg:flex-row lg:items-center"
          left={<ToolbarSearchInput placeholder="Search. . ." />}
          right={<ToolbarActions><ToolbarDatepicker label="Select Dates" /><ProtaskFilterTrigger color="purple" count={0} /><ToolbarShowSelect value="10" /></ToolbarActions>}
        />
        <DataTable<Customer> columns={columns} rows={customers} showCheckbox showPagination currentPage={1} totalPages={6} paginationLabel="Showing 1-10 from 100" />
        <ProtaskDeleteDialog
          open={!!deleteTarget || dialog === "delete" || dialog === "delete-customer"}
          title="Delete Customer?"
          description="Do you want to delete this customer? This action can't be undone"
          onClose={closeDialog}
        />
        <ProtaskEditDialog
          open={!!editTarget || dialog === "edit" || dialog === "edit-customer"}
          title="Edit Customer"
          description="Update customer contact and account fields."
          fields={[
            { label: "Name", value: (editTarget ?? queryTarget).name },
            { label: "Email", value: (editTarget ?? queryTarget).email },
            { label: "Phone", value: (editTarget ?? queryTarget).phone },
            { label: "Status", value: (editTarget ?? queryTarget).status },
          ]}
          onClose={closeDialog}
          onConfirm={openSaveConfirmation}
        />
        <ProtaskSaveChangesDialog
          open={dialog === "edit-confirmation" || dialog === "edit-customer-confirmation"}
          onClose={closeDialog}
        />
        <ProtaskFilterDialog
          open={dialog === "customer-filter" || dialog === "filter"}
          onClose={closeDialog}
        />
      </div>
    </CrmTemplateShell>
  );
}
