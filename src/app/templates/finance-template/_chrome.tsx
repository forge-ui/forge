"use client";

import type { ReactNode } from "react";
import {
  CardBoldDuotone,
  CardSendBoldDuotone,
  ChartBoldDuotone,
  TransferHorizontalBoldDuotone,
  WalletBoldDuotone,
  WidgetBoldDuotone,
} from "solar-icon-set";
import { AppLayout, PageTitleToolbar } from "@forge-ui-official/core";
import type { AppLayoutMenuItem, PageTitleToolbarPresetProps } from "@forge-ui-official/core";
import { ProtaskLogoMark } from "../_shared/protask-logo";
import { mainProfile, teamMeta } from "./_data";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Overview", href: "/templates/finance-template/overview" },
  { icon: <ChartBoldDuotone size={20} />, label: "Wealth", href: "/templates/finance-template/wealth" },
  { icon: <TransferHorizontalBoldDuotone size={20} />, label: "Transactions", href: "/templates/finance-template/transactions" },
  { icon: <WalletBoldDuotone size={20} />, label: "Wallet", href: "/templates/finance-template/wallets" },
  { icon: <CardBoldDuotone size={20} />, label: "Card", href: "/templates/finance-template/cards" },
  { icon: <CardSendBoldDuotone size={20} />, label: "Invoice", href: "/templates/finance-template/invoices" },
];

export function FinanceTemplateShell({ children }: { children: ReactNode }) {
  return (
    <AppLayout
      mode="dark"
      accent="blue"
      logo={<ProtaskLogoMark tone="white" />}
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
      searchPlaceholder="Search..."
      logoText="Protask"
    >
      {children}
    </AppLayout>
  );
}

type WithoutFinanceChromeDefaults<T> = T extends unknown
  ? Omit<T, "breadcrumbItems" | "color">
  : never;

type FinancePageHeaderProps = WithoutFinanceChromeDefaults<PageTitleToolbarPresetProps> & {
  current: string;
};

export function FinancePageHeader({ current, ...props }: FinancePageHeaderProps) {
  return (
    <PageTitleToolbar
      {...props}
      color={"blue" as const}
      breadcrumbItems={[{ label: "Overview", href: "/templates/finance-template/wealth" }, { label: current }]}
    />
  );
}

export const financeStatusColor = {
  Paid: "green",
  Pending: "yellow",
  Overdue: "red",
  Draft: "grey",
} as const;

export const transactionStatusColor = {
  Success: "green",
  Pending: "yellow",
  Canceled: "red",
} as const;
