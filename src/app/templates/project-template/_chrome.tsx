"use client";

import {
  BillCheckBoldDuotone,
  ChartSquareBoldDuotone,
  ClipboardListBoldDuotone,
  FolderWithFilesBoldDuotone,
  StarBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  WidgetBoldDuotone,
} from "solar-icon-set";
import { AppLayout } from "@forge-ui-official/core";
import type { AppLayoutMenuItem } from "@forge-ui-official/core";
import { mainProfile, teamMeta } from "./_data";
import { ProtaskLogo } from "./_logos";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Overview", href: "/templates/project-template/overview" },
  { icon: <ClipboardListBoldDuotone size={20} />, label: "Project", href: "/templates/project-template/projects" },
  { icon: <UsersGroupTwoRoundedBoldDuotone size={20} />, label: "Client", href: "/templates/project-template/clients" },
  { icon: <FolderWithFilesBoldDuotone size={20} />, label: "File Manager", href: "/templates/project-template/files" },
  { icon: <ChartSquareBoldDuotone size={20} />, label: "Team Member", href: "/templates/project-template/members" },
  { icon: <BillCheckBoldDuotone size={20} />, label: "Invoice", href: "/templates/project-template/invoices" },
];

const favoriteItems: AppLayoutMenuItem[] = [
  { icon: <StarBoldDuotone size={20} />, label: "Project Alpha", href: "/templates/project-template/projects/alpha" },
  { icon: <StarBoldDuotone size={20} />, label: "Black Friday", href: "/templates/project-template/projects/template" },
];

export function ProjectTemplateShell({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout
      mode="dark"
      accent="purple"
      profilePosition="topbar"
      logo={<ProtaskLogo />}
      logoText="Protask"
      menuItems={menuItems}
      favoriteItems={favoriteItems}
      profile={mainProfile}
      teamName={teamMeta.teamName}
      teamAvatar={teamMeta.teamAvatar}
      teamMemberCount={teamMeta.teamMemberCount}
      notifications={99}
      messages={99}
      searchPlaceholder="Search..."
    >
      {children}
    </AppLayout>
  );
}

export function PageTop({
  title,
  current,
  parent = "Overview",
  actions,
}: {
  title: string;
  current: string;
  parent?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold leading-9 text-fg-black">{title}</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-fg-violet">{parent}</span>
          <span className="text-fg-grey-300">/</span>
          <span className="text-fg-grey-500">{current}</span>
        </div>
      </div>
      {actions}
    </div>
  );
}
