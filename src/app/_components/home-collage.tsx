"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  CellText,
  ChatBubble,
  DataTable,
  SidebarMenu,
  SmallCalendar,
  StatusBadge,
  type ColumnDef,
} from "@forge-ui-official/core";
import {
  CalendarBoldDuotone,
  ChartBoldDuotone,
  ChatRoundLinear,
  WidgetBoldDuotone,
} from "@forge-ui-official/core/icons";

type Order = { id: string; name: string; state: string; tone: "yellow" | "cyan" | "green" };

const orders: Order[] = [
  { id: "3021", name: "收纳包", state: "处理中", tone: "yellow" },
  { id: "3020", name: "耳机", state: "已发出", tone: "cyan" },
  { id: "3019", name: "手表", state: "已完成", tone: "green" },
];

const orderColumns: ColumnDef<Order>[] = [
  { key: "id", header: "单号", width: "w-20", render: (row) => <CellText>{row.id}</CellText> },
  { key: "name", header: "商品", render: (row) => <CellText>{row.name}</CellText> },
  {
    key: "state",
    header: "状态",
    width: "w-28",
    render: (row) => <StatusBadge label={row.state} color={row.tone} />,
  },
];

function PreviewTile({ href, title, children }: { href: string; title: string; children: ReactNode }) {
  const labelId = `home-tile-${title}`;
  return (
    <article className="relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-fg-grey-200 bg-white">
      <div aria-hidden className="pointer-events-none h-64 overflow-hidden bg-fg-grey-50 p-4">
        {children}
      </div>
      <h3 id={labelId} className="border-t border-fg-grey-200 px-4 py-3 text-sm font-semibold text-fg-black">
        {title}
      </h3>
      <Link
        href={href}
        aria-labelledby={labelId}
        className="absolute inset-0 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fg-blue"
      />
    </article>
  );
}

export function HomeCollage() {
  const today = new Date().getDate();
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
      <PreviewTile href="/components/table" title="表格">
        <DataTable columns={orderColumns} rows={orders} getRowKey={(row) => row.id} title="最近订单" />
      </PreviewTile>
      <PreviewTile href="/components/calendar" title="日历">
        <SmallCalendar
          width="full"
          color="blue"
          title="本月"
          subtitle="日程"
          events={[
            { day: today, title: "设计评审", timeRange: "10:00-11:00", color: "blue" },
            { day: today === 1 ? 2 : today - 1, title: "周会", timeRange: "09:00-09:30", color: "green" },
          ]}
        />
      </PreviewTile>
      <PreviewTile href="/components/chat" title="聊天">
        <div className="flex flex-col gap-3">
          <ChatBubble type="received" color="blue" senderName="林晓" content="下午的评审改到四点。" time="14:02" motion="auto" />
          <ChatBubble type="sent" color="blue" content="好，我改日历。" time="14:03" motion="auto" />
        </div>
      </PreviewTile>
      <PreviewTile href="/components/menu-sections" title="应用布局">
        <div className="flex h-full w-full overflow-hidden rounded-xl bg-white">
          <SidebarMenu
            logoText="Forge"
            accent="blue"
            width="100%"
            motion="auto"
            mainMenuItems={[
              { icon: <WidgetBoldDuotone size={20} />, label: "概览", active: true },
              { icon: <ChartBoldDuotone size={20} />, label: "图表" },
              { icon: <CalendarBoldDuotone size={20} />, label: "日历" },
              { icon: <ChatRoundLinear size={20} />, label: "消息", badge: 2 },
            ]}
          />
        </div>
      </PreviewTile>
    </div>
  );
}
