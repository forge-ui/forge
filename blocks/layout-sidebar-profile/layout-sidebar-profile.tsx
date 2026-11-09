"use client";

import type { ReactNode } from "react";
import { AppLayout, ProgressBar, StatusBadge, SurfaceCard, type AppLayoutMenuSection } from "@forge-ui-official/core";
import { BookBoldDuotone, ChatDotsLinear, ClipboardListBoldDuotone, FolderWithFilesBoldDuotone, SettingsBoldDuotone, UserBoldDuotone, UsersGroupRoundedBoldDuotone, WidgetBoldDuotone } from "@forge-ui-official/core/icons";

export const defaultSidebarMenu: AppLayoutMenuSection[] = [
  { label: "工作区", items: [
    { label: "项目", icon: <FolderWithFilesBoldDuotone size={20} />, href: "#projects" },
    { label: "我的任务", icon: <ClipboardListBoldDuotone size={20} />, href: "#tasks" },
    { label: "对话", icon: <ChatDotsLinear size={20} />, href: "#chats" },
  ] },
  { label: "智能体", items: [
    { label: "应用智能体", icon: <UsersGroupRoundedBoldDuotone size={20} />, href: "#apps" },
    { label: "自主智能体", icon: <UserBoldDuotone size={20} />, href: "#autonomous" },
  ] },
  { label: "平台", items: [
    { label: "工作台", icon: <WidgetBoldDuotone size={20} />, href: "#overview" },
    { label: "知识库", icon: <BookBoldDuotone size={20} />, href: "#knowledge" },
    { label: "系统管理", icon: <SettingsBoldDuotone size={20} />, href: "#settings" },
  ] },
];

const projects = [
  { name: "官网改版上线", owner: "编程助手", done: 8, total: 12, status: "进行中" },
  { name: "第三季度经营复盘", owner: "季度经营分析", done: 2, total: 6, status: "进行中" },
  { name: "售后知识库整理", owner: "办公助理", done: 0, total: 8, status: "计划中" },
];

function SamplePage() {
  return <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    {projects.map(project => <SurfaceCard key={project.name} padding="md" contentClassName="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2"><h3 className="truncate text-base font-semibold text-fg-black">{project.name}</h3><StatusBadge label={project.status} color={project.status === "进行中" ? "blue" : "grey"} /></div>
      <ProgressBar value={project.done / project.total * 100} color="blue" size="sm" />
      <div className="flex justify-between text-xs text-fg-grey-600"><span>负责：{project.owner}</span><span>{project.done}/{project.total} 任务</span></div>
    </SurfaceCard>)}
  </div>;
}

export interface LayoutSidebarProfileProps {
  menuSections?: AppLayoutMenuSection[];
  children?: ReactNode;
}

/** 头像与语言、通知收进侧栏底部；顶部只留页头：标题、操作与日期 */
export function LayoutSidebarProfile({ menuSections = defaultSidebarMenu, children = <SamplePage /> }: LayoutSidebarProfileProps) {
  return <AppLayout
    accent="blue"
    logoText="智能体工场"
    appName="知行科技"
    appSubtitle="产品与交付团队"
    menuSections={menuSections}
    profilePosition="sidebar"
    profile={{ name: "张宁", role: "管理员", avatar: "/images/team/edward-allen.png" }}
    notifications={6}
    pageTitle="项目"
    breadcrumbs={[{ label: "工作台", href: "#overview" }, { label: "工作区", href: "#projects" }, { label: "项目" }]}
    primaryAction={{ label: "新建项目" }}
    secondaryAction={{ label: "导入" }}
  >
    {children}
  </AppLayout>;
}
