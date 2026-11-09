"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Button, HistoryItem, InfoRow, Label, Modal, Panel, SelectOption, StatusBadge, cn, type StatusBadgeColor } from "@forge-ui-official/core";
import { BoxBoldDuotone, CardBoldDuotone, DocumentBoldDuotone, EyeLinear, LetterBoldDuotone, MapPointBoldDuotone, PhoneBoldDuotone, UserBoldDuotone } from "@forge-ui-official/core/icons";

export type OrderDetailStatus = "processing" | "shipped" | "delivered" | "canceled";

export interface OrderLine {
  id: string;
  name: string;
  image: string;
  specs: string[];
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDetailData {
  id: string;
  invoiceId: string;
  placedAt: string;
  status: OrderDetailStatus;
  customer: { name: string; email: string; phone: string };
  payment: string;
  shipping: string;
  shippingAddress: string;
  billingAddress: string;
  lines: OrderLine[];
  discount: { label: string; amount: number };
  shippingFee: number;
  taxRate: number;
}

export const defaultOrderDetail: OrderDetailData = {
  id: "ZX2026103106",
  invoiceId: "INV-2026-1031",
  placedAt: "2026-10-31 10:24",
  status: "processing",
  customer: { name: "陈思远", email: "siyuan@yuanshan.design", phone: "138 1024 5521" },
  payment: "企业网银 · 招商银行尾号 6829",
  shipping: "顺丰标快 · SF1092831130",
  shippingAddress: "陈思远 · 上海市徐汇区漕溪北路 398 号 12 楼",
  billingAddress: "远山设计有限公司 · 上海市徐汇区漕溪北路 398 号",
  lines: [
    { id: "line-1", name: "知行智能手表 E2", image: "/images/blocks/products/smartwatch.jpg", specs: ["曜石黑", "46mm"], sku: "302012", quantity: 2, unitPrice: 1299 },
    { id: "line-2", name: "降噪头戴耳机 G1 Pro", image: "/images/blocks/products/headphones.jpg", specs: ["柠檬黄"], sku: "302011", quantity: 1, unitPrice: 899 },
    { id: "line-3", name: "矮轴机械键盘", image: "/images/blocks/products/keyboard.jpg", specs: ["月白", "茶轴"], sku: "301900", quantity: 1, unitPrice: 599 },
  ],
  discount: { label: "双十一满减", amount: 300 },
  shippingFee: 0,
  taxRate: 0.06,
};

const statusMeta: Record<OrderDetailStatus, { label: string; color: StatusBadgeColor }> = {
  processing: { label: "处理中", color: "yellow" },
  shipped: { label: "已发货", color: "blue" },
  delivered: { label: "已签收", color: "green" },
  canceled: { label: "已取消", color: "red" },
};

const trackingSteps = ["已下单", "支付成功", "商家已确认", "仓库拣货", "等待揽收", "运输中", "已签收"];
const reachedStep: Record<OrderDetailStatus, number> = { processing: 4, shipped: 5, delivered: 6, canceled: 1 };

export interface OrderDetailProps {
  order?: OrderDetailData;
  onStatusChange?: (status: OrderDetailStatus) => void;
  onViewInvoice?: (invoiceId: string) => void;
  className?: string;
}

export function OrderDetail({ order = defaultOrderDetail, onStatusChange, onViewInvoice, className }: OrderDetailProps) {
  const [status, setStatus] = useState(order.status);
  const [tracking, setTracking] = useState(false);
  const money = (value: number) => `¥${value.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const subtotal = order.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  const taxable = subtotal - order.discount.amount + order.shippingFee;
  const tax = Math.round(taxable * order.taxRate * 100) / 100;
  const summary = [
    { label: "商品小计", value: money(subtotal) },
    { label: order.discount.label, value: `-${money(order.discount.amount)}` },
    { label: "运费", value: order.shippingFee ? money(order.shippingFee) : "包邮" },
    { label: `税费（${Math.round(order.taxRate * 100)}%）`, value: money(tax) },
  ];
  const step = reachedStep[status];

  function changeStatus(value: string) {
    const next = value as OrderDetailStatus;
    setStatus(next);
    onStatusChange?.(next);
  }

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]", className)}>
    <div className="flex min-w-0 flex-col gap-4">
      <Panel variant="template">
        <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          <div><dt className="text-sm font-medium text-fg-grey-700">订单状态</dt><dd className="mt-2 flex items-center gap-2"><StatusBadge {...statusMeta[status]} variant="soft" /><Button variant="unstyled" type="button" aria-label="查看物流进度" className="p-1 text-fg-grey-700" onClick={() => setTracking(true)}><EyeLinear size={18} /></Button></dd></div>
          <div><dt className="text-sm font-medium text-fg-grey-700">下单时间</dt><dd className="mt-2 text-sm font-medium text-fg-black">{order.placedAt}</dd></div>
          <div><dt className="text-sm font-medium text-fg-grey-700">发票</dt><dd className="mt-2"><Button variant="unstyled" type="button" className="text-sm font-medium text-fg-blue" onClick={() => onViewInvoice?.(order.invoiceId)}>{order.invoiceId}</Button></dd></div>
          <div><dt className="text-sm font-medium text-fg-grey-700">商品</dt><dd className="mt-2 text-sm font-medium text-fg-black">{order.lines.length} 种 · {order.lines.reduce((sum, line) => sum + line.quantity, 0)} 件</dd></div>
        </dl>
      </Panel>
      <Panel variant="template" title={`订单 ${order.id}`}>
        <ul className="flex flex-col divide-y divide-fg-grey-200">
          {order.lines.map(line => <li key={line.id} className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-4 py-4 first:pt-0 last:pb-0 sm:grid-cols-[64px_minmax(0,1fr)_112px_112px]">
            <img src={line.image} alt={line.name} className="size-14 rounded-xl bg-fg-grey-100 object-cover sm:size-16" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg-black">{line.name}</p>
              <p className="mt-1 text-xs text-fg-grey-700">SKU #{line.sku}</p>
              <div className="mt-2 flex flex-wrap gap-2">{line.specs.map(spec => <Label key={spec} color="gray" variant="outline" size="sm">{spec}</Label>)}</div>
            </div>
            <div className="hidden sm:block"><p className="text-xs text-fg-grey-700">单价</p><p className="mt-1 text-sm tabular-nums text-fg-black">{line.quantity} × {money(line.unitPrice)}</p></div>
            <div className="text-right"><p className="text-xs text-fg-grey-700">小计</p><p className="mt-1 text-sm font-semibold tabular-nums text-fg-black">{money(line.quantity * line.unitPrice)}</p></div>
          </li>)}
        </ul>
      </Panel>
      <Panel variant="template" title="费用明细">
        <dl className="flex flex-col gap-3 text-sm">
          {summary.map(item => <div key={item.label} className="flex justify-between gap-4"><dt className="text-fg-grey-700">{item.label}</dt><dd className="tabular-nums text-fg-black">{item.value}</dd></div>)}
          <div className="mt-2 flex justify-between gap-4 border-t border-fg-grey-200 pt-4 text-base font-semibold"><dt className="text-fg-black">实付金额</dt><dd className="tabular-nums text-fg-black">{money(taxable + tax)}</dd></div>
        </dl>
      </Panel>
    </div>
    <div className="flex min-w-0 flex-col gap-4">
      <Panel variant="template" title="订单信息">
        <div className="flex flex-col gap-4">
          <InfoRow icon={<BoxBoldDuotone size={20} />} label="订单状态"><SelectOption shape="pill" options={Object.entries(statusMeta).map(([value, item]) => ({ value, label: item.label }))} value={status} onChange={changeStatus} /></InfoRow>
          <InfoRow icon={<UserBoldDuotone size={20} />} label="客户">{order.customer.name}</InfoRow>
          <InfoRow icon={<LetterBoldDuotone size={20} />} label="邮箱">{order.customer.email}</InfoRow>
          <InfoRow icon={<PhoneBoldDuotone size={20} />} label="手机号">{order.customer.phone}</InfoRow>
          <InfoRow icon={<CardBoldDuotone size={20} />} label="支付方式">{order.payment}</InfoRow>
          <InfoRow icon={<BoxBoldDuotone size={20} />} label="配送方式">{order.shipping}</InfoRow>
        </div>
      </Panel>
      <Panel variant="template" title="地址">
        <div className="flex flex-col gap-4">
          <InfoRow icon={<MapPointBoldDuotone size={20} />} label="收货地址">{order.shippingAddress}</InfoRow>
          <InfoRow icon={<DocumentBoldDuotone size={20} />} label="开票信息">{order.billingAddress}</InfoRow>
        </div>
      </Panel>
    </div>
    <Modal open={tracking} onOpenChange={setTracking} title="物流进度">
      <div className="flex flex-col gap-1">
        {trackingSteps.map((title, index) => <HistoryItem key={title} variant="regular" title={title} color={index < step ? "green" : index === step ? "purple" : "gray"} showConnector={index < trackingSteps.length - 1} />)}
      </div>
    </Modal>
  </div>;
}
