"use client";

import type { ReactNode } from "react";
import {
  CartLargeBoldDuotone,
  ChartBoldDuotone,
  TagBoldDuotone,
  UserBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  WidgetBoldDuotone,
} from "solar-icon-set";
import { AppLayout } from "@forge-ui-official/core";
import { Breadcrumbs, PageTitleToolbar, ToolbarActions } from "@forge-ui-official/core";
import type { AppLayoutMenuItem, StatusBadgeColor } from "@forge-ui-official/core";
import { ProtaskLogoMark } from "../_shared/protask-logo";
import { mainProfile, teamMeta, type CustomerStatus, type LeadStatus, type SaleStatus } from "./_data";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Dashboard", href: "/templates/crm-template/overview" },
  { icon: <UserBoldDuotone size={20} />, label: "Customer", href: "/templates/crm-template/customers" },
  { icon: <UsersGroupTwoRoundedBoldDuotone size={20} />, label: "Leads", href: "/templates/crm-template/leads" },
  { icon: <CartLargeBoldDuotone size={20} />, label: "Sales", href: "/templates/crm-template/sales" },
  { icon: <ChartBoldDuotone size={20} />, label: "Activity", href: "/templates/crm-template/activity" },
  { icon: <TagBoldDuotone size={20} />, label: "Campaign", href: "#" },
];

export function CrmTemplateShell({ children }: { children: ReactNode }) {
  return (
    <AppLayout
      mode="light"
      accent="purple"
      logo={<ProtaskLogoMark />}
      profilePosition="topbar"
      menuItems={menuItems}
      profile={mainProfile}
      teamName={teamMeta.teamName}
      teamAvatar={teamMeta.teamAvatar}
      teamMemberCount={teamMeta.teamMemberCount}
      teamSubtitle="24 Members"
      menuSectionLabel="MAIN MENU"
      notifications={99}
      messages={99}
      topbarLeftMode="hamburger"
      topbarAccent="black"
      logoText="Protask"
    >
      {children}
    </AppLayout>
  );
}

export function CrmPageHeader({
  title,
  current,
  parents = [],
  actions,
}: {
  title: string;
  current: string;
  parents?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
}) {
  return (
    <PageTitleToolbar
      title={title}
      breadcrumbs={
        <Breadcrumbs
          color="purple"
          items={[{ label: "Dashboard", href: "/templates/crm-template/customers" }, ...parents, { label: current }]}
        />
      }
      actions={actions ? <ToolbarActions>{actions}</ToolbarActions> : undefined}
    />
  );
}

export const customerStatusColor: Record<CustomerStatus, StatusBadgeColor> = {
  Paid: "green",
  Pending: "yellow",
  Overdue: "red",
  Idle: "grey",
};

export const leadStatusColor: Record<LeadStatus, StatusBadgeColor> = {
  New: "blue",
  Warm: "yellow",
  Lost: "red",
  Hot: "red",
  Cold: "cyan",
  Success: "green",
};

export const saleStatusColor: Record<SaleStatus, StatusBadgeColor> = {
  Pending: "yellow",
  Overdue: "red",
  Paid: "green",
};
