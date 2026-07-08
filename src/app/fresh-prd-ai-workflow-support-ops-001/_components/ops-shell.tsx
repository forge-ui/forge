"use client";

import {
  BillCheckBoldDuotone,
  ChartSquareBoldDuotone,
  ClipboardListBoldDuotone,
  FolderWithFilesBoldDuotone,
  StarBoldDuotone,
  WidgetBoldDuotone,
} from "solar-icon-set";
import { AppLayout } from "@forge-ui-official/core";
import type { AppLayoutMenuItem } from "@forge-ui-official/core";
import { basePath } from "./data";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Operations", href: `${basePath}/operations` },
  { icon: <ClipboardListBoldDuotone size={20} />, label: "Workflows", href: `${basePath}/workflows` },
  { icon: <ChartSquareBoldDuotone size={20} />, label: "Support", href: `${basePath}/support` },
  { icon: <FolderWithFilesBoldDuotone size={20} />, label: "Evidence", href: `${basePath}/evidence` },
  { icon: <BillCheckBoldDuotone size={20} />, label: "Recovery", href: `${basePath}/recovery/new` },
];

const favoriteItems: AppLayoutMenuItem[] = [
  { icon: <StarBoldDuotone size={20} />, label: "RUN-8124", href: `${basePath}/workflows/RUN-8124` },
  { icon: <StarBoldDuotone size={20} />, label: "SUP-1048", href: `${basePath}/support` },
];

export function OpsShell({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout
      mode="dark"
      accent="blue"
      profilePosition="topbar"
      logoText="ForgeOps"
      menuItems={menuItems}
      favoriteItems={favoriteItems}
      profile={{
        avatar: "/logo.png",
        name: "Mina Chen",
        role: "Ops Lead",
      }}
      teamName="AI Support Ops"
      teamAvatar="/images/forge-logo.svg"
      teamMemberCount={18}
      notifications={12}
      messages={7}
      searchPlaceholder="Search run, ticket, evidence"
    >
      {children}
    </AppLayout>
  );
}
