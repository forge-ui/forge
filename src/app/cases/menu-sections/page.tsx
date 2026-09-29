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

const menuSections: AppLayoutMenuSection[] = [
  {
    label: "工作区",
    items: [
      { icon: <HomeBoldDuotone size={20} />, label: "工作台", href: "/cases/menu-sections" },
      { icon: <FolderBoldDuotone size={20} />, label: "项目", href: "/cases/menu-sections/projects" },
    ],
  },
  {
    label: "智能体",
    items: [
      { icon: <UsersGroupRoundedBoldDuotone size={20} />, label: "智能体列表", href: "/cases/menu-sections/agents" },
      { icon: <ListCheckLinear size={20} />, label: "任务", href: "/cases/menu-sections/tasks" },
    ],
  },
  {
    label: "平台",
    items: [
      { icon: <SettingsBoldDuotone size={20} />, label: "设置", href: "/cases/menu-sections/settings" },
      {
        icon: <ShieldCheckBold size={20} />,
        label: "管理",
        children: [
          { label: "成员", href: "/cases/menu-sections/members" },
          { label: "权限", href: "/cases/menu-sections/permissions" },
        ],
      },
    ],
  },
];

export default function MenuSectionsCasePage() {
  const pathname = usePathname();
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
        <h1 className="text-2xl font-semibold text-fg-black">AppLayout · 多侧栏分组</h1>
        <p className="mt-2 text-sm text-fg-grey-600">工作区、智能体、平台三个分组共用选中高亮、子菜单展开与收窄图标模式。点击左上角按钮可切换侧栏宽度。</p>
      </div>
      <div className="h-[760px] overflow-hidden rounded-xl outline outline-1 outline-fg-grey-200">
        <AppLayout menuSections={menuSections} profilePosition="sidebar" hideSidebarWidgets hideHeader logoText="Forge 案例">
          <div className="p-8 text-sm text-fg-grey-700">当前页：{currentLabel[currentView] ?? "工作台"}。调整浏览器宽度可以查看移动端抽屉。</div>
        </AppLayout>
      </div>
    </div>
  );
}
