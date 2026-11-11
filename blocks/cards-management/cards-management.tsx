"use client";

import { useState, type ComponentProps } from "react";
import { Button, CreditCard, Panel, PlusIcon, ProgressBar, StatusBadge, cn } from "@forge-ui-official/core";
import { LockKeyholeLinear } from "@forge-ui-official/core/icons";

export interface ManagedCard {
  id: string;
  name: string;
  card: ComponentProps<typeof CreditCard>;
  limit: number;
  spent: number;
  frozen?: boolean;
  transactions: { id: string; merchant: string; amount: number; time: string }[];
}

export const defaultManagedCards: ManagedCard[] = [
  { id: "card-ops", name: "日常运营卡", card: { cardNumber: "6829", holderName: "知行科技", expiry: "12/28", theme: "blue" }, limit: 50000, spent: 18640, transactions: [
    { id: "o1", merchant: "云服务器续费", amount: 6800, time: "10-30 11:05" },
    { id: "o2", merchant: "设计软件订阅", amount: 1980, time: "10-27 08:30" },
    { id: "o3", merchant: "办公用品", amount: 1260, time: "10-24 15:12" },
  ] },
  { id: "card-travel", name: "差旅卡", card: { cardNumber: "3056", holderName: "知行科技", expiry: "08/29", theme: "dark" }, limit: 20000, spent: 15840, transactions: [
    { id: "t1", merchant: "杭州往返高铁", amount: 1320, time: "10-29 18:40" },
    { id: "t2", merchant: "酒店住宿 · 2 晚", amount: 1940, time: "10-29 21:10" },
  ] },
  { id: "card-market", name: "市场活动卡", card: { cardNumber: "1288", holderName: "知行科技", expiry: "05/27", theme: "yellow" }, limit: 30000, spent: 4200, frozen: true, transactions: [
    { id: "m1", merchant: "客户招待", amount: 860, time: "10-25 20:10" },
  ] },
];

export interface CardsManagementProps {
  cards?: ManagedCard[];
  onAddCard?: () => void;
  onFreezeChange?: (cardId: string, frozen: boolean) => void;
  className?: string;
}

export function CardsManagement({ cards = defaultManagedCards, onAddCard, onFreezeChange, className }: CardsManagementProps) {
  const [items, setItems] = useState(cards);
  const [activeId, setActiveId] = useState(cards[0]?.id ?? "");
  const active = items.find(item => item.id === activeId) ?? items[0];
  const used = active ? Math.round((active.spent / active.limit) * 100) : 0;

  function toggleFreeze() {
    if (!active) return;
    const frozen = !active.frozen;
    setItems(current => current.map(item => item.id === active.id ? { ...item, frozen } : item));
    onFreezeChange?.(active.id, frozen);
  }

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]", className)}>
    <Panel variant="template" title="企业卡" subtitle={`${items.length} 张卡片`}>
      <ul className="flex flex-col gap-3" role="listbox" aria-label="企业卡">{items.map(item => <li key={item.id}>
        <Button variant="unstyled" type="button" role="option" aria-selected={item.id === active?.id} className={cn("relative block w-full rounded-[20px] outline-offset-2 transition-opacity", item.id === active?.id ? "outline outline-2 outline-fg-blue" : "opacity-80 hover:opacity-100")} onClick={() => setActiveId(item.id)}>
          <CreditCard {...item.card} width="full" />
          {item.frozen && <span className="absolute inset-0 grid place-items-center rounded-[20px] bg-fg-black/40"><span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-fg-black">已冻结</span></span>}
        </Button>
      </li>)}</ul>
      <Button variant="tertiary" className="w-full" iconLeft={<PlusIcon size={16} />} onClick={onAddCard}>申请新卡</Button>
    </Panel>
    {active && <div className="flex min-w-0 flex-col gap-4">
      <Panel variant="template" title={active.name} subtitle={`尾号 ${active.card.cardNumber} · 有效期 ${active.card.expiry}`} action={<StatusBadge label={active.frozen ? "已冻结" : "正常使用"} color={active.frozen ? "grey" : "green"} variant="soft" />}>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-fg-grey-50 p-4"><dt className="text-xs text-fg-grey-700">本月额度</dt><dd className="mt-1 text-xl font-semibold tabular-nums text-fg-black">¥{active.limit.toLocaleString("zh-CN")}</dd></div>
          <div className="rounded-2xl bg-fg-grey-50 p-4"><dt className="text-xs text-fg-grey-700">已使用</dt><dd className="mt-1 text-xl font-semibold tabular-nums text-fg-black">¥{active.spent.toLocaleString("zh-CN")}</dd></div>
          <div className="rounded-2xl bg-fg-grey-50 p-4"><dt className="text-xs text-fg-grey-700">可用余额</dt><dd className="mt-1 text-xl font-semibold tabular-nums text-fg-black">¥{(active.limit - active.spent).toLocaleString("zh-CN")}</dd></div>
        </dl>
        <ProgressBar value={used} color={used > 75 ? "red" : "blue"} label={`额度使用 ${used}%`} />
        <div className="flex flex-wrap gap-3">
          <Button variant={active.frozen ? "primary" : "tertiary"} iconLeft={<LockKeyholeLinear size={16} />} onClick={toggleFreeze}>{active.frozen ? "解除冻结" : "临时冻结"}</Button>
        </div>
      </Panel>
      <Panel variant="template" title="最近消费" subtitle={`${active.transactions.length} 笔`}>
        <ul className="flex flex-col divide-y divide-fg-grey-200">{active.transactions.map(item => <li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"><div><p className="text-sm font-semibold text-fg-black">{item.merchant}</p><p className="text-xs text-fg-grey-700">{item.time}</p></div><span className="text-sm font-semibold tabular-nums text-fg-black">-¥{item.amount.toLocaleString("zh-CN")}</span></li>)}</ul>
      </Panel>
    </div>}
  </div>;
}
