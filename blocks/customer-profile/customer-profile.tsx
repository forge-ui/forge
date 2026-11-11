"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Button, IconButton, Panel, ReviewItem, SmoothLineChart, StatCard, StatusBadge, TabBar, cn, type StatusBadgeColor } from "@forge-ui-official/core";
import { ChatRoundLinear, CheckCircleLinear, CopyLinear, PhoneCallingLinear } from "@forge-ui-official/core/icons";

export interface CustomerProfileData {
  name: string;
  handle: string;
  tier: string;
  avatar: string;
  email: string;
  phone: string;
  address: string;
  stats: { title: string; value: string; trend: string; subtitle: string }[];
  purchases: { id: string; name: string; note: string; total: string; image: string }[];
  monthlySpend: number[];
  orders: { id: string; product: string; total: string; status: "processing" | "shipped" | "delivered" | "canceled"; date: string }[];
  reviews: { id: string; product: string; rating: number; date: string; comment: string }[];
  timeline: { id: string; title: string; description: string; time: string; status?: { label: string; color: StatusBadgeColor } }[];
}

export const defaultCustomerProfile: CustomerProfileData = {
  name: "苏晚晴",
  handle: "拾光好物 · 采购负责人",
  tier: "VIP",
  avatar: "/images/blocks/people/su-wanqing.jpg",
  email: "wanqing@shiguang.shop",
  phone: "135 8841 2290",
  address: "杭州市西湖区文三路 478 号华星科技大厦 9 楼",
  stats: [
    { title: "累计订单", value: "154", trend: "12%", subtitle: "本月 +18 单" },
    { title: "已完成", value: "139", trend: "9%", subtitle: "完成率 90.3%" },
    { title: "累计消费", value: "¥61,200", trend: "15%", subtitle: "本月 +¥8,400" },
  ],
  purchases: [
    { id: "pu-1", name: "无线静音鼠标", note: "另含 2 件商品", total: "¥1,780", image: "/images/blocks/products/mouse.jpg" },
    { id: "pu-2", name: "游戏手柄 S", note: "单件", total: "¥349", image: "/images/blocks/products/gamepad.jpg" },
    { id: "pu-3", name: "矮轴机械键盘", note: "另含 1 件商品", total: "¥1,198", image: "/images/blocks/products/keyboard.jpg" },
    { id: "pu-4", name: "降噪头戴耳机 G1 Pro", note: "单件", total: "¥899", image: "/images/blocks/products/headphones.jpg" },
    { id: "pu-5", name: "旗舰手机 X5", note: "另含 1 件商品", total: "¥6,598", image: "/images/blocks/products/phone-dark.jpg" },
  ],
  monthlySpend: [3200, 2800, 4100, 3600, 3900, 5200, 6100, 5400, 4800, 7300, 8400, 6900],
  orders: [
    { id: "ZX2026103112", product: "旗舰手机 X5 等 2 件", total: "¥6,598", status: "processing", date: "2026-10-31" },
    { id: "ZX2026102408", product: "降噪头戴耳机 G1 Pro", total: "¥899", status: "shipped", date: "2026-10-24" },
    { id: "ZX2026101203", product: "矮轴机械键盘 等 2 件", total: "¥1,198", status: "delivered", date: "2026-10-12" },
    { id: "ZX2026092101", product: "游戏手柄 S", total: "¥349", status: "canceled", date: "2026-09-21" },
  ],
  reviews: [
    { id: "rv-1", product: "矮轴机械键盘", rating: 5, date: "2026-10-15", comment: "手感很稳，团队里写代码的同事都在用，打算再采购一批。" },
    { id: "rv-2", product: "无线静音鼠标", rating: 4, date: "2026-09-02", comment: "静音效果好，续航比预期长，希望增加更多颜色。" },
  ],
  timeline: [
    { id: "tl-1", title: "订单已签收", description: "订单 ZX2026101203 已由前台代收", time: "10-14 12:45", status: { label: "已签收", color: "green" } },
    { id: "tl-2", title: "发表评价", description: "为矮轴机械键盘打出 5 星", time: "10-15 06:15" },
    { id: "tl-3", title: "新订单", description: "订单 ZX2026103112 已提交并完成支付", time: "10-31 09:00", status: { label: "处理中", color: "yellow" } },
  ],
};

const orderStatus: Record<CustomerProfileData["orders"][number]["status"], { label: string; color: StatusBadgeColor }> = {
  processing: { label: "处理中", color: "yellow" },
  shipped: { label: "已发货", color: "blue" },
  delivered: { label: "已签收", color: "green" },
  canceled: { label: "已取消", color: "red" },
};

const tabs = ["概览", "订单", "评价"];
const months = ["1月", "", "3月", "", "5月", "", "7月", "", "9月", "", "11月", ""];

export interface CustomerProfileProps {
  customer?: CustomerProfileData;
  onCall?: () => void;
  onMessage?: () => void;
  className?: string;
}

export function CustomerProfile({ customer = defaultCustomerProfile, onCall, onMessage, className }: CustomerProfileProps) {
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const total = customer.monthlySpend.reduce((sum, value) => sum + value, 0);

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  }

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]", className)}>
    <div className="flex min-w-0 flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {customer.stats.map(stat => <StatCard key={stat.title} title={stat.title} value={stat.value} trend={stat.trend} trendDirection="up" subtitle={stat.subtitle} theme="white" width="full" />)}
      </div>
      <div className="fg-scrollbar-hidden overflow-x-auto border-b border-fg-grey-200"><TabBar color="blue" tabs={tabs.map((label, index) => ({ label, active: index === tab }))} onChange={setTab} /></div>
      {tab === 0 && <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Panel variant="template" title="最近购买" subtitle="近 30 天">
          <ul className="flex flex-col gap-3">{customer.purchases.map(item => <li key={item.id} className="flex items-center gap-3">
            <img src={item.image} alt={item.name} className="size-12 shrink-0 rounded-lg bg-fg-grey-100 object-cover" />
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-fg-black">{item.name}</p><p className="text-xs text-fg-grey-700">{item.note}</p></div>
            <p className="shrink-0 text-sm font-semibold tabular-nums text-fg-black">{item.total}</p>
          </li>)}</ul>
        </Panel>
        <Panel variant="template" title="消费走势" subtitle="2026 年按月统计">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-fg-blue-50"><span className="size-3 rounded-full bg-fg-blue" /></span><div><p className="text-xs text-fg-grey-700">全年消费</p><p className="text-2xl font-semibold tabular-nums text-fg-black">¥{total.toLocaleString("zh-CN")}</p></div></div>
          <SmoothLineChart series={[{ data: customer.monthlySpend, color: "blue" }]} accent="blue" activeIndex={10} showYAxis yAxisLabels={["¥9k", "¥6k", "¥3k", "¥0"]} xAxisLabels={months} height="h-64" />
        </Panel>
      </div>}
      {tab === 1 && <Panel variant="template" title="订单记录" subtitle={`共 ${customer.orders.length} 笔`}>
        <ul className="flex flex-col divide-y divide-fg-grey-200">{customer.orders.map(order => <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
          <div className="min-w-0"><p className="text-sm font-semibold text-fg-black">{order.product}</p><p className="text-xs text-fg-grey-700">{order.id} · {order.date}</p></div>
          <div className="flex items-center gap-4"><span className="text-sm font-semibold tabular-nums text-fg-black">{order.total}</span><StatusBadge {...orderStatus[order.status]} variant="soft" /></div>
        </li>)}</ul>
      </Panel>}
      {tab === 2 && <Panel variant="template" title="商品评价" subtitle={`共 ${customer.reviews.length} 条`}>
        <div className="flex flex-col gap-4">{customer.reviews.map(review => <ReviewItem key={review.id} name={customer.name} avatar={customer.avatar} date={`${review.date} · ${review.product}`} rating={review.rating} content={review.comment} />)}</div>
      </Panel>}
    </div>
    <Panel variant="custom" as="aside" className="overflow-hidden rounded-card border border-fg-grey-200 bg-background p-6">
      <div className="-mx-6 -mt-6 h-28 bg-gradient-to-r from-fg-blue via-fg-violet-300 to-fg-yellow-100" />
      <div className="-mt-12 flex flex-col items-center gap-3">
        <img src={customer.avatar} alt={customer.name} className="size-24 rounded-full border-4 border-white object-cover" />
        <div className="text-center"><p className="flex items-center justify-center gap-2 text-xl font-semibold text-fg-black">{customer.name}<span className="rounded-md bg-fg-blue px-1.5 py-0.5 text-[10px] font-bold text-white">{customer.tier}</span></p><p className="mt-1 text-sm text-fg-grey-700">{customer.handle}</p></div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3"><Button variant="tertiary" iconLeft={<PhoneCallingLinear size={16} />} onClick={onCall}>致电</Button><Button iconLeft={<ChatRoundLinear size={16} />} onClick={onMessage}>发消息</Button></div>
      <dl className="mt-5 flex flex-col gap-4 border-t border-fg-grey-200 pt-5">
        {[{ label: "邮箱", value: customer.email, copyable: true }, { label: "手机号", value: customer.phone, copyable: true }, { label: "地址", value: customer.address, copyable: false }].map(field => <div key={field.label}>
          <dt className="flex items-center justify-between text-sm font-semibold text-fg-grey-700">{field.label}{field.copyable && <IconButton variant="ghost" color="grey" shape="square" size="sm" aria-label={copied === field.label ? "已复制" : `复制${field.label}`} onClick={() => copy(field.label, field.value)}>{copied === field.label ? <CheckCircleLinear size={14} /> : <CopyLinear size={14} />}</IconButton>}</dt>
          <dd className="mt-1 text-sm font-medium leading-relaxed text-fg-black">{field.value}</dd>
        </div>)}
      </dl>
      <ol className="mt-5 flex flex-col gap-5 border-t border-fg-grey-200 pt-5">
        {customer.timeline.map(item => <li key={item.id} className="flex gap-3">
          <img src={customer.avatar} alt="" className="size-9 shrink-0 rounded-full object-cover" />
          <div className="flex flex-col gap-1"><p className="text-sm font-semibold text-fg-black">{item.title}</p><p className="text-xs leading-relaxed text-fg-grey-700">{item.description}</p>{item.status && <div className="flex"><StatusBadge {...item.status} variant="soft" /></div>}<p className="text-xs text-fg-grey-700">{item.time}</p></div>
        </li>)}
      </ol>
    </Panel>
  </div>;
}
