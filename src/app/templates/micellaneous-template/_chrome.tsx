"use client";

import type { ReactNode } from "react";
import { ChatRoundLineLinear, DocumentTextLinear, FolderOpenLinear, ListCheckLinear } from "solar-icon-set";
import { AppLayout, PageTitleToolbar, SurfaceCard } from "@forge-ui-official/core";
import type { AppLayoutMenuItem, PageTitleToolbarPresetProps } from "@forge-ui-official/core";
import { ProtaskLogoMark } from "../_shared/protask-logo";
import { mainProfile, teamMeta } from "./_data";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <DocumentTextLinear size={20} />, label: "Calendar", href: "/templates/micellaneous-template/calendar" },
  { icon: <ChatRoundLineLinear size={20} />, label: "Chat", href: "/templates/micellaneous-template/chat" },
  { icon: <FolderOpenLinear size={20} />, label: "File Manager", href: "/templates/micellaneous-template/files" },
  { icon: <ListCheckLinear size={20} />, label: "Table Action", href: "/templates/micellaneous-template/actions" },
];

export function MicellaneousTemplateShell({ children }: { children: ReactNode }) {
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
      notifications={12}
      messages={8}
      searchPlaceholder="Search..."
      logoText="Protask"
    >
      {children}
    </AppLayout>
  );
}

type WithoutMiscChromeDefaults<T> = T extends unknown
  ? Omit<T, "breadcrumbItems" | "color">
  : never;

type MicellaneousPageHeaderProps = WithoutMiscChromeDefaults<PageTitleToolbarPresetProps> & {
  current: string;
};

export function MicellaneousPageHeader({ current, ...props }: MicellaneousPageHeaderProps) {
  return (
    <PageTitleToolbar
      {...props}
      color={"purple" as const}
      breadcrumbItems={[{ label: "Dashboard", href: "/templates/micellaneous-template/calendar" }, { label: current }]}
    />
  );
}

export function MiscSurface({ title, subtitle, action, children, className = "" }: { title?: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  const padding = className.includes("p-0") ? "none" : "sm";
  const shellClassName = className.replace(/\bp-0\b/g, "").trim();

  return (
    <SurfaceCard title={title} subtitle={subtitle} action={action} padding={padding} className={shellClassName}>
      {children}
    </SurfaceCard>
  );
}
