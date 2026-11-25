"use client";

import type { ReactNode } from "react";
import { AppLayout, type AppLayoutMenuSection } from "@aideui/core";
import { useRouter } from "next/navigation";
import {
  ChartBoldDuotone,
  ClipboardListBoldDuotone,
  DocumentBoldDuotone,
  SettingsBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  WalletBoldDuotone,
  WidgetBoldDuotone,
} from "@aideui/core/icons";

export const BASE = "/templates/business";

const MENU: AppLayoutMenuSection[] = [
  {
    label: "业务",
    items: [
      { icon: <WidgetBoldDuotone size={20} />, label: "概览", href: BASE },
      { icon: <UsersGroupTwoRoundedBoldDuotone size={20} />, label: "客户", href: `${BASE}/customers` },
      { icon: <DocumentBoldDuotone size={20} />, label: "合同", href: `${BASE}/contracts`, badge: 2 },
      { icon: <WalletBoldDuotone size={20} />, label: "回款", href: `${BASE}/payments` },
      { icon: <ClipboardListBoldDuotone size={20} />, label: "工单", href: `${BASE}/tickets`, badge: 2 },
    ],
  },
  {
    label: "分析与设置",
    items: [
      { icon: <ChartBoldDuotone size={20} />, label: "报表", href: `${BASE}/reports` },
      { icon: <SettingsBoldDuotone size={20} />, label: "设置", href: `${BASE}/settings` },
    ],
  },
];

type ShellAction = { label: string; onClick?: () => void };

export function BusinessShell({ title, back, primaryAction, secondaryAction, children }: { title: string; back?: string; primaryAction?: ShellAction; secondaryAction?: ShellAction; children: ReactNode }) {
  const router = useRouter();
  return (
    <AppLayout
      logoText="Forge"
      mode="light"
      accent="blue"
      profilePosition="sidebar"
      menuSections={MENU}
      profile={{ avatar: "/images/protask/crm/john-hoegan-avatar.png", name: "林晓", role: "销售运营" }}
      notifications={3}
      messages={5}
      pageTitle={title}
      pageHeaderVariant={back ? "detail" : "home"}
      onBack={back ? () => router.push(back) : undefined}
      showDatePicker={false}
      showKebab={false}
      showFavorite={false}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
    >
      {children}
    </AppLayout>
  );
}
