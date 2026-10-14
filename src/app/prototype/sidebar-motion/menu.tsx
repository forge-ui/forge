import type { AppLayoutMenuSection } from "@forge-ui-official/core";
import {
  ChartSquareBoldDuotone,
  FolderBoldDuotone,
  HomeBoldDuotone,
  ListCheckLinear,
  SettingsBoldDuotone,
  ShieldCheckBold,
  UsersGroupRoundedBoldDuotone,
} from "@forge-ui-official/core/icons";

export const previewRoot = "/prototype/sidebar-motion";

export const menuSections: AppLayoutMenuSection[] = [
  {
    label: "工作区",
    items: [
      { label: "工作台", href: previewRoot, icon: <HomeBoldDuotone size={20} /> },
      {
        label: "项目管理",
        icon: <FolderBoldDuotone size={20} />,
        badge: 8,
        children: [
          { label: "进行中的项目", href: `${previewRoot}/projects/active`, badge: 8 },
          { label: "已归档项目", href: `${previewRoot}/projects/archived` },
        ],
      },
    ],
  },
  {
    label: "协作",
    items: [
      { label: "我的任务", href: `${previewRoot}/tasks`, icon: <ListCheckLinear size={20} />, badge: 12 },
      { label: "团队成员", href: `${previewRoot}/members`, icon: <UsersGroupRoundedBoldDuotone size={20} /> },
      { label: "工作报告", href: `${previewRoot}/reports`, icon: <ChartSquareBoldDuotone size={20} /> },
    ],
  },
  {
    label: "管理",
    items: [
      {
        label: "访问管理",
        icon: <ShieldCheckBold size={20} />,
        children: [
          { label: "角色权限", href: `${previewRoot}/access/roles` },
          { label: "操作记录", href: `${previewRoot}/access/activity`, badge: 3 },
        ],
      },
      { label: "应用设置", href: `${previewRoot}/settings`, icon: <SettingsBoldDuotone size={20} /> },
    ],
  },
];

export const routeLabels: Record<string, string> = {
  "": "工作台",
  "projects/active": "进行中的项目",
  "projects/archived": "已归档项目",
  tasks: "我的任务",
  members: "团队成员",
  reports: "工作报告",
  "access/roles": "角色权限",
  "access/activity": "操作记录",
  settings: "应用设置",
};
