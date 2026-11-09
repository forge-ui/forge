"use client";

import type { ReactNode } from "react";
import { AppLayout, Breadcrumbs, Button, DataTable, PageTitleToolbar, StatCard, StatusBadge, type AppLayoutMenuSection, type ColumnDef } from "@forge-ui-official/core";
import { BagBoldDuotone, BoxBoldDuotone, ChartSquareBoldDuotone, SettingsBoldDuotone, UsersGroupRoundedBoldDuotone, WalletMoneyBoldDuotone, WidgetBoldDuotone } from "@forge-ui-official/core/icons";

interface RecentOrder {
  id: string;
  customer: string;
  amount: string;
  status: "已发货" | "待发货" | "已退款";
}

const orders: RecentOrder[] = [
  { id: "SO-20261109-018", customer: "远山设计", amount: "¥12,800", status: "待发货" },
  { id: "SO-20261109-017", customer: "星河零售", amount: "¥3,260", status: "已发货" },
  { id: "SO-20261108-042", customer: "青禾教育", amount: "¥8,940", status: "已发货" },
  { id: "SO-20261108-031", customer: "远帆物流", amount: "¥1,180", status: "已退款" },
];

const columns: ColumnDef<RecentOrder>[] = [
  { key: "id", header: "订单号", width: "w-[200px]", render: row => <span className="whitespace-nowrap font-medium text-fg-black">{row.id}</span> },
  { key: "customer", header: "客户", render: row => row.customer },
  { key: "amount", header: "金额", render: row => <span className="tabular-nums">{row.amount}</span> },
  { key: "status", header: "状态", render: row => <StatusBadge label={row.status} color={row.status === "已发货" ? "green" : row.status === "待发货" ? "yellow" : "grey"} /> },
];

export const defaultTopbarMenu: AppLayoutMenuSection[] = [
  { label: "经营", items: [
    { label: "概览", icon: <WidgetBoldDuotone size={20} />, href: "#overview" },
    { label: "订单", icon: <BagBoldDuotone size={20} />, href: "#orders" },
    { label: "商品", icon: <BoxBoldDuotone size={20} />, href: "#products" },
    { label: "客户", icon: <UsersGroupRoundedBoldDuotone size={20} />, href: "#customers" },
  ] },
  { label: "分析", items: [
    { label: "销售报表", icon: <ChartSquareBoldDuotone size={20} />, href: "#reports" },
    { label: "财务对账", icon: <WalletMoneyBoldDuotone size={20} />, href: "#finance" },
  ] },
  { label: "", items: [{ label: "系统设置", icon: <SettingsBoldDuotone size={20} />, href: "#settings" }] },
];

function SamplePage() {
  return <div className="flex flex-col gap-5">
    <PageTitleToolbar title="经营概览" breadcrumbs={<Breadcrumbs color="blue" items={[{ label: "经营", href: "#overview" }, { label: "概览" }]} />} actions={<Button color="blue">导出日报</Button>} />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 [&>*]:!w-full">
      <StatCard title="今日成交" value="¥86,420" trend="12%" trendDirection="up" subtitle="较昨日" theme="white" width="full" />
      <StatCard title="待发货" value="38" subtitle="其中 6 单超过 24 小时" theme="white" width="full" />
      <StatCard title="退款中" value="4" trend="2" trendDirection="down" subtitle="较昨日" theme="white" width="full" />
    </div>
    <DataTable columns={columns} rows={orders} getRowKey={row => row.id} tableMinWidth={560} />
  </div>;
}

export interface LayoutTopbarProfileProps {
  menuSections?: AppLayoutMenuSection[];
  children?: ReactNode;
}

/** 侧栏展开并分组；搜索在顶栏左侧，头像、通知和语言在顶栏右侧 */
export function LayoutTopbarProfile({ menuSections = defaultTopbarMenu, children = <SamplePage /> }: LayoutTopbarProfileProps) {
  return <AppLayout
    accent="blue"
    logoText="知行科技"
    appName="电商运营中心"
    appSubtitle="华东大区"
    menuSections={menuSections}
    profilePosition="topbar"
    profile={{ name: "张宁", role: "运营负责人", avatar: "/images/team/edward-allen.png" }}
    topbarLeftMode="search"
    searchPlaceholder="搜索订单、商品或客户"
    notifications={3}
    messages={2}
  >
    {children}
  </AppLayout>;
}
