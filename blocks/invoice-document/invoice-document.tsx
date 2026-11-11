"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Button, HistoryItem, Label, Panel, ProgressBar, StatusBadge, cn } from "@forge-ui-official/core";
import { DownloadMinimalisticLinear, PenLinear, PlainLinear, PrinterLinear } from "@forge-ui-official/core/icons";

export interface InvoiceLine {
  id: string;
  name: string;
  image: string;
  specs: string[];
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceDocumentData {
  id: string;
  shipmentId: string;
  issuedAt: string;
  seller: { name: string; initial: string; address: string; phone: string };
  billTo: { name: string; address: string };
  shipTo: { name: string; address: string };
  lines: InvoiceLine[];
  discount: { label: string; amount: number };
  shippingFee: number;
  taxRate: number;
  note: string;
  dueAt: string;
  paid: number;
  history: { id: string; title: string; description: string; done: boolean }[];
}

export const defaultInvoiceDocument: InvoiceDocumentData = {
  id: "INV-2026-1031",
  shipmentId: "SF1092831130",
  issuedAt: "2026-10-31",
  seller: { name: "知行科技", initial: "知", address: "上海市浦东新区张江路 88 号 5 号楼", phone: "021 6088 2026" },
  billTo: { name: "远山设计有限公司", address: "上海市徐汇区漕溪北路 398 号" },
  shipTo: { name: "陈思远", address: "上海市徐汇区漕溪北路 398 号 12 楼" },
  lines: [
    { id: "l1", name: "知行智能手表 E2", image: "/images/blocks/products/smartwatch.jpg", specs: ["曜石黑", "46mm"], sku: "302012", quantity: 2, unitPrice: 1299 },
    { id: "l2", name: "降噪头戴耳机 G1 Pro", image: "/images/blocks/products/headphones.jpg", specs: ["柠檬黄"], sku: "302011", quantity: 1, unitPrice: 899 },
    { id: "l3", name: "矮轴机械键盘", image: "/images/blocks/products/keyboard.jpg", specs: ["月白", "茶轴"], sku: "301900", quantity: 1, unitPrice: 599 },
  ],
  discount: { label: "双十一满减", amount: 300 },
  shippingFee: 0,
  taxRate: 0.06,
  note: "如对本发票有疑问，请在 30 天内联系财务对接人张宁：021 6088 2026。",
  dueAt: "2026-11-30",
  paid: 2000,
  history: [
    { id: "h1", title: "开具发票", description: "张宁 · 10-31 10:30", done: true },
    { id: "h2", title: "发送给客户", description: "邮件发至陈思远 · 10-31 10:32", done: true },
    { id: "h3", title: "客户已查看", description: "陈思远 · 10-31 14:08", done: true },
    { id: "h4", title: "收到首付款 ¥2,000", description: "招商银行转账 · 11-02 09:15", done: true },
    { id: "h5", title: "尾款到期提醒", description: "将于 11-28 自动发送", done: false },
  ],
};

export interface InvoiceDocumentProps {
  invoice?: InvoiceDocumentData;
  onSend?: (invoice: InvoiceDocumentData) => void;
  onDownload?: (invoice: InvoiceDocumentData) => void;
  onEdit?: (invoice: InvoiceDocumentData) => void;
  className?: string;
}

export function InvoiceDocument({ invoice = defaultInvoiceDocument, onSend, onDownload, onEdit, className }: InvoiceDocumentProps) {
  const [sent, setSent] = useState(false);
  const [reminded, setReminded] = useState(false);
  const money = (value: number) => `¥${value.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const subtotal = invoice.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  const taxable = subtotal - invoice.discount.amount + invoice.shippingFee;
  const tax = Math.round(taxable * invoice.taxRate * 100) / 100;
  const rows = [
    { label: "商品小计", value: money(subtotal) },
    { label: invoice.discount.label, value: `-${money(invoice.discount.amount)}` },
    { label: "运费", value: invoice.shippingFee ? money(invoice.shippingFee) : "包邮" },
    { label: `税费（${Math.round(invoice.taxRate * 100)}%）`, value: money(tax) },
  ];
  const total = taxable + tax;
  const outstanding = Math.max(0, total - invoice.paid);
  const paidPercent = total ? Math.min(100, Math.round((invoice.paid / total) * 100)) : 0;

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]", className)}>
    <Panel variant="custom" as="article" className="flex min-w-0 flex-col rounded-card border border-fg-grey-200 bg-background">
      <div className="flex flex-col gap-8 p-6 sm:p-10">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-3 text-2xl font-semibold text-fg-black"><span className="flex size-8 items-center justify-center rounded-lg bg-fg-blue text-sm font-bold text-white">{invoice.seller.initial}</span>{invoice.seller.name}</p>
            <p className="max-w-64 text-sm leading-6 text-fg-grey-700">{invoice.seller.address}<br />{invoice.seller.phone}</p>
          </div>
          <p className="text-2xl font-semibold text-fg-black">发票</p>
        </header>
        <dl className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
          <div><dt className="text-fg-grey-700">付款方</dt><dd className="mt-2 font-medium text-fg-black">{invoice.billTo.name}</dd><dd className="mt-1 text-fg-black">{invoice.billTo.address}</dd></div>
          <div><dt className="text-fg-grey-700">收货方</dt><dd className="mt-2 font-medium text-fg-black">{invoice.shipTo.name}</dd><dd className="mt-1 text-fg-black">{invoice.shipTo.address}</dd></div>
        </dl>
        <dl className="flex flex-col gap-2 text-sm">
          {[["发票编号", invoice.id], ["物流单号", invoice.shipmentId], ["开票日期", invoice.issuedAt]].map(([label, value]) => <div key={label} className="flex justify-between gap-4"><dt className="text-fg-grey-700">{label}</dt><dd className="font-medium text-fg-black">{value}</dd></div>)}
        </dl>
        <section className="rounded-card border border-fg-grey-200">
          <h3 className="border-b border-fg-grey-200 px-6 py-4 text-base font-semibold text-fg-black">商品明细</h3>
          <ul className="flex flex-col divide-y divide-fg-grey-200 px-6">{invoice.lines.map(line => <li key={line.id} className="flex flex-wrap items-center gap-4 py-5">
            <img src={line.image} alt={line.name} className="size-14 shrink-0 rounded-xl bg-fg-grey-100 object-cover" />
            <div className="min-w-[140px] flex-1"><p className="text-sm font-medium text-fg-black">{line.name}</p><div className="mt-2 flex flex-wrap gap-2">{line.specs.map(spec => <Label key={spec} color="gray" variant="outline" size="sm">{spec}</Label>)}</div></div>
            <div className="w-20 text-sm"><p className="text-xs text-fg-grey-700">SKU</p><p className="mt-1 text-fg-black">#{line.sku}</p></div>
            <div className="w-28 text-sm"><p className="text-xs text-fg-grey-700">单价</p><p className="mt-1 text-fg-black">{line.quantity} × {money(line.unitPrice)}</p></div>
            <div className="w-24 text-right text-sm"><p className="text-xs text-fg-grey-700">金额</p><p className="mt-1 font-semibold text-fg-black">{money(line.quantity * line.unitPrice)}</p></div>
          </li>)}</ul>
        </section>
        <dl className="ml-auto flex w-full max-w-sm flex-col gap-3 text-sm">
          {rows.map(row => <div key={row.label} className="flex justify-between gap-4"><dt className="text-fg-grey-700">{row.label}</dt><dd className="tabular-nums text-fg-black">{row.value}</dd></div>)}
          <div className="mt-2 flex justify-between gap-4 border-t border-fg-grey-200 pt-4 text-base font-semibold"><dt className="text-fg-black">合计</dt><dd className="tabular-nums text-fg-black">{money(total)}</dd></div>
        </dl>
      </div>
      <p className="border-t border-fg-grey-200 px-6 py-5 text-sm text-fg-grey-700 sm:px-10">{invoice.note}</p>
    </Panel>
    <div className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-6">
      <Panel variant="template" title="收款状态" action={<StatusBadge label={outstanding ? "部分付款" : "已结清"} color={outstanding ? "yellow" : "green"} variant="soft" />}>
        <div><p className="text-xs text-fg-grey-700">待收金额</p><p className="mt-1 text-2xl font-semibold tabular-nums text-fg-black">{money(outstanding)}</p></div>
        <ProgressBar value={paidPercent} color="blue" label={`已收 ${money(invoice.paid)} · ${paidPercent}%`} size="sm" />
        <dl className="grid grid-cols-2 gap-3 text-sm"><div><dt className="text-xs text-fg-grey-700">发票金额</dt><dd className="mt-1 font-medium tabular-nums text-fg-black">{money(total)}</dd></div><div><dt className="text-xs text-fg-grey-700">付款截止</dt><dd className="mt-1 font-medium text-fg-black">{invoice.dueAt}</dd></div></dl>
        <Button variant="tertiary" disabled={reminded || !outstanding} onClick={() => setReminded(true)}>{reminded ? "已发送付款提醒" : "发送付款提醒"}</Button>
      </Panel>
      <Panel variant="template" title="操作">
        <div className="flex flex-col gap-3">
          <Button iconLeft={<PlainLinear size={16} />} onClick={() => { setSent(true); onSend?.(invoice); }}>{sent ? "已重新发送" : "重新发送发票"}</Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="tertiary" iconLeft={<DownloadMinimalisticLinear size={16} />} onClick={() => onDownload?.(invoice)}>下载</Button>
            <Button variant="tertiary" iconLeft={<PrinterLinear size={16} />} onClick={() => window.print()}>打印</Button>
          </div>
          <Button variant="tertiary" iconLeft={<PenLinear size={16} />} onClick={() => onEdit?.(invoice)}>编辑发票</Button>
        </div>
      </Panel>
      <Panel variant="template" title="发票记录">
        <div className="flex flex-col gap-1">{invoice.history.map((item, index) => <HistoryItem key={item.id} variant="regular" title={item.title} description={item.description} color={item.done ? "green" : "gray"} showConnector={index < invoice.history.length - 1} />)}</div>
      </Panel>
    </div>
  </div>;
}
