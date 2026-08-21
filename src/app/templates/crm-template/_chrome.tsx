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
import { PageTitleToolbar } from "@forge-ui-official/core";
import type {
  AppLayoutMenuItem,
  PageTitleToolbarAction,
  PageTitleToolbarDateAction,
  PageTitleToolbarMenuAction,
  StatusBadgeColor,
} from "@forge-ui-official/core";
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

interface CrmPageHeaderBase {
  title: string;
  current: string;
  subtitle?: string;
  parents?: Array<{ label: string; href?: string }>;
}

type CrmPageHeaderProps =
  | (CrmPageHeaderBase & {
      variant: "overview";
      dateAction?: PageTitleToolbarDateAction;
      primaryAction?: PageTitleToolbarAction;
    })
  | (CrmPageHeaderBase & {
      variant: "collection";
      dateAction?: PageTitleToolbarDateAction;
      secondaryAction?: PageTitleToolbarAction;
      primaryAction?: PageTitleToolbarAction;
    })
  | (CrmPageHeaderBase & {
      variant: "detail";
      menuAction?: PageTitleToolbarMenuAction;
      secondaryAction?: PageTitleToolbarAction;
      primaryAction?: PageTitleToolbarAction;
    })
  | (Omit<CrmPageHeaderBase, "subtitle"> & {
      variant: "action";
      secondaryAction: PageTitleToolbarAction;
      primaryAction: PageTitleToolbarAction;
    });

export function CrmPageHeader({ current, parents = [], ...props }: CrmPageHeaderProps) {
  return (
    <PageTitleToolbar
      {...props}
      color={"purple" as const}
      breadcrumbItems={[{ label: "Dashboard", href: "/templates/crm-template/customers" }, ...parents, { label: current }]}
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
