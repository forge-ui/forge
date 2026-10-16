"use client";

import { AppLayout, type AppLayoutMenuSection } from "@forge-ui-official/core";
import {
  HomeBoldDuotone,
  FolderBoldDuotone,
  UsersGroupRoundedBoldDuotone,
  ListCheckLinear,
  SettingsBoldDuotone,
  ShieldCheckBold,
} from "@forge-ui-official/core/icons";
import { usePathname } from "next/navigation";
import { ScenarioOutlet } from "../_scenario-outlet";

function menuSections(base: string): AppLayoutMenuSection[] {
  return [
  {
    label: "工作区",
    items: [
      { icon: <HomeBoldDuotone size={20} />, label: "工作台", href: base },
      { icon: <FolderBoldDuotone size={20} />, label: "项目", href: `${base}/projects` },
    ],
  },
  {
    label: "智能体",
    items: [
      { icon: <UsersGroupRoundedBoldDuotone size={20} />, label: "智能体列表", href: `${base}/agents` },
      { icon: <ListCheckLinear size={20} />, label: "任务", href: `${base}/tasks` },
    ],
  },
  {
    label: "平台",
    items: [
      { icon: <SettingsBoldDuotone size={20} />, label: "设置", href: `${base}/settings` },
      {
        icon: <ShieldCheckBold size={20} />,
        label: "管理",
        children: [
          { label: "成员", href: `${base}/members` },
          { label: "权限", href: `${base}/permissions` },
        ],
      },
    ],
  },
];
}

export default function MenuSectionsCasePage() {
  const pathname = usePathname() ?? "";
  const base = pathname.startsWith("/cases/menu-sections") ? "/cases/menu-sections" : "/components/menu-sections";
  const currentView = pathname?.split("/").at(-1) ?? "menu-sections";
  const currentLabel: Record<string, string> = {
    "menu-sections": "工作台",
    projects: "项目",
    agents: "智能体列表",
    tasks: "任务",
    settings: "设置",
    members: "成员",
    permissions: "权限",
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg-black">应用布局</h1>
        <p className="mt-2 text-sm text-fg-grey-700">侧栏分成工作区、智能体和平台三组。选中、子菜单和收窄后的图标在各组里一致。左上角按钮切换侧栏宽度。</p>
      </div>
      <ScenarioOutlet />
      <div className="relative h-[560px] overflow-hidden rounded-xl outline outline-1 outline-fg-grey-200 [transform:translateZ(0)]">
        <AppLayout menuSections={menuSections(base)} profilePosition="sidebar" hideSidebarWidgets hideHeader logoText="Forge 案例">
          <div className="p-8 text-sm text-fg-grey-700">当前页：{currentLabel[currentView] ?? "工作台"}。调整浏览器宽度可以查看移动端抽屉。</div>
        </AppLayout>
      </div>
    </div>
  );
}
