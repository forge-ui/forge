"use client";

import { useState, type ReactNode } from "react";
import { AppLayout, Breadcrumbs, Button, DataTable, PageTitleToolbar, PlusIcon, StatusBadge, Toolbar, ToolbarSearchInput, ToolbarSelectDropdown, type AppLayoutMenuItem, type ColumnDef } from "@forge-ui-official/core";
import { BagBoldDuotone, BillListBoldDuotone, BoxBoldDuotone, ChartSquareBoldDuotone, SettingsBoldDuotone, UsersGroupRoundedBoldDuotone, WidgetBoldDuotone } from "@forge-ui-official/core/icons";

export const defaultRailMenu: AppLayoutMenuItem[] = [
  { label: "概览", icon: <WidgetBoldDuotone size={20} />, href: "#overview" },
  { label: "客户", icon: <UsersGroupRoundedBoldDuotone size={20} />, href: "#customers" },
  { label: "订单", icon: <BagBoldDuotone size={20} />, href: "#orders" },
  { label: "商品", icon: <BoxBoldDuotone size={20} />, href: "#products" },
  { label: "发票", icon: <BillListBoldDuotone size={20} />, href: "#invoices" },
  { label: "报表", icon: <ChartSquareBoldDuotone size={20} />, href: "#reports" },
  { label: "设置", icon: <SettingsBoldDuotone size={20} />, href: "#settings" },
];

interface Customer { id: string; name: string; owner: string; level: "A" | "B" | "C"; revenue: string; lastContact: string }
const customers: Customer[] = [
  { id: "c1", name: "远山设计有限公司", owner: "林悦", level: "A", revenue: "¥286,000", lastContact: "今天 10:20" },
  { id: "c2", name: "星河零售集团", owner: "陈思远", level: "A", revenue: "¥512,400", lastContact: "昨天" },
  { id: "c3", name: "青禾教育科技", owner: "许知夏", level: "B", revenue: "¥96,800", lastContact: "11月6日" },
  { id: "c4", name: "远帆物流", owner: "周远", level: "C", revenue: "¥24,600", lastContact: "11月2日" },
  { id: "c5", name: "北辰医疗器械", owner: "林悦", level: "B", revenue: "¥148,300", lastContact: "10月30日" },
];

function SamplePage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const rows = customers.filter(customer => (level === "all" || customer.level === level) && customer.name.includes(query.trim()));
  const columns: ColumnDef<Customer>[] = [
    { key: "name", header: "客户", width: "w-[28%]", render: row => <span className="whitespace-nowrap font-medium text-fg-black">{row.name}</span> },
    { key: "level", header: "等级", width: "w-[12%]", render: row => <StatusBadge label={`${row.level} 类`} color={row.level === "A" ? "blue" : row.level === "B" ? "green" : "grey"} /> },
    { key: "owner", header: "负责人", width: "w-[16%]", render: row => row.owner },
    { key: "revenue", header: "累计成交", width: "w-[20%]", render: row => <span className="tabular-nums">{row.revenue}</span> },
    { key: "last", header: "最近联系", render: row => <span className="text-fg-grey-600">{row.lastContact}</span> },
  ];
  return <div className="flex flex-col gap-5">
    <PageTitleToolbar title="客户" breadcrumbs={<Breadcrumbs color="blue" items={[{ label: "客户关系", href: "#overview" }, { label: "客户" }]} />} actions={<Button color="blue" iconLeft={<PlusIcon size={16} />}>新建客户</Button>} />
    <Toolbar left={<div className="flex flex-wrap items-center gap-3"><ToolbarSearchInput ariaLabel="搜索客户" placeholder="搜索客户名称" value={query} onChange={setQuery} /><ToolbarSelectDropdown value={level} options={[{ value: "all", label: "全部等级" }, { value: "A", label: "A 类" }, { value: "B", label: "B 类" }, { value: "C", label: "C 类" }]} onChange={setLevel} /></div>} />
    <DataTable columns={columns} rows={rows} getRowKey={row => row.id} tableMinWidth={720} />
  </div>;
}

export interface LayoutIconRailProps {
  menuItems?: AppLayoutMenuItem[];
  children?: ReactNode;
}

/** 侧栏默认收起为图标条，把宽度留给表格；顶栏左侧用汉堡按钮展开菜单 */
export function LayoutIconRail({ menuItems = defaultRailMenu, children = <SamplePage /> }: LayoutIconRailProps) {
  return <AppLayout
    accent="blue"
    logoText="知行科技"
    appName="客户关系"
    appSubtitle="销售一部"
    menuItems={menuItems}
    defaultSidebarCollapsed
    topbarLeftMode="hamburger"
    profilePosition="topbar"
    profile={{ name: "林悦", role: "销售经理", avatar: "/images/blocks/people/lin-yue.jpg" }}
    notifications={2}
    messages={5}
  >
    {children}
  </AppLayout>;
}
