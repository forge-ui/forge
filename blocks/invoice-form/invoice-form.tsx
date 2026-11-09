"use client";

import { useState, type FormEvent } from "react";
import { Button, IconButton, Panel, PlusIcon, SelectOption, TextField, cn } from "@forge-ui-official/core";
import { TrashBinMinimalisticLinear } from "@forge-ui-official/core/icons";

export interface InvoiceItemDraft {
  id: string;
  name: string;
  rate: string;
  quantity: string;
}

export interface InvoiceFormValue {
  customer: string;
  invoiceId: string;
  issuedAt: string;
  dueAt: string;
  taxRate: number;
  discount: string;
  items: InvoiceItemDraft[];
}

export const defaultInvoiceForm: InvoiceFormValue = {
  customer: "yuanshan",
  invoiceId: "INV-2026-1102",
  issuedAt: "2026-11-02",
  dueAt: "2026-11-30",
  taxRate: 0.06,
  discount: "0",
  items: [
    { id: "i1", name: "客户工作台升级 · 二期开发", rate: "18000", quantity: "1" },
    { id: "i2", name: "数据看板定制", rate: "2400", quantity: "3" },
  ],
};

const customers = [{ label: "远山设计有限公司", value: "yuanshan" }, { label: "拾光好物", value: "shiguang" }, { label: "青石建筑", value: "qingshi" }, { label: "云帆科技", value: "yunfan" }];

export interface InvoiceFormProps {
  value?: InvoiceFormValue;
  onSave?: (value: InvoiceFormValue) => void;
  onSend?: (value: InvoiceFormValue, total: number) => void;
  onCancel?: () => void;
  className?: string;
}

export function InvoiceForm({ value = defaultInvoiceForm, onSave, onSend, onCancel, className }: InvoiceFormProps) {
  const [form, setForm] = useState(value);
  const [status, setStatus] = useState("");
  const amount = (item: InvoiceItemDraft) => (Number(item.rate) || 0) * (Number(item.quantity) || 0);
  const subtotal = form.items.reduce((sum, item) => sum + amount(item), 0);
  const discount = Math.min(Number(form.discount) || 0, subtotal);
  const tax = Math.round((subtotal - discount) * form.taxRate * 100) / 100;
  const total = subtotal - discount + tax;
  const money = (number: number) => `¥${number.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const valid = Boolean(form.customer && form.invoiceId.trim() && form.items.some(item => item.name.trim() && amount(item) > 0));
  const update = <K extends keyof InvoiceFormValue>(key: K, next: InvoiceFormValue[K]) => { setForm(current => ({ ...current, [key]: next })); setStatus(""); };
  const updateItem = (id: string, patch: Partial<InvoiceItemDraft>) => update("items", form.items.map(item => item.id === id ? { ...item, ...patch } : item));

  function save(event: FormEvent) {
    event.preventDefault();
    if (!valid) return;
    onSave?.(form);
    setStatus("草稿已保存");
  }

  return <form className={cn("flex min-w-0 flex-col gap-4", className)} onSubmit={save} noValidate>
    <div className="flex flex-wrap items-center justify-end gap-3">
      {status && <p role="status" className="mr-auto text-sm text-fg-green-500">{status}</p>}
      <Button type="button" variant="tertiary" onClick={onCancel}>取消</Button>
      <Button type="submit" disabled={!valid}>保存草稿</Button>
    </div>
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Panel variant="template" title="发票信息" subtitle="付款方、日期与明细">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectOption label="付款客户" shape="pill" placeholder="请选择客户" options={customers} value={form.customer} onChange={next => update("customer", next)} />
          <TextField label="发票编号" shape="pill" value={form.invoiceId} onChange={next => update("invoiceId", next)} />
          <TextField label="开票日期" type="date" shape="pill" value={form.issuedAt} onChange={next => update("issuedAt", next)} />
          <TextField label="付款截止" type="date" shape="pill" value={form.dueAt} onChange={next => update("dueAt", next)} />
        </div>
        <section className="overflow-hidden rounded-card border border-fg-grey-200">
          <h3 className="border-b border-fg-grey-200 px-5 py-4 text-sm font-semibold text-fg-black">收费明细</h3>
          <div className="hidden grid-cols-[minmax(0,1fr)_96px_64px_104px_32px] gap-3 border-b border-fg-grey-200 px-5 py-3 text-sm text-fg-grey-700 md:grid"><span>项目</span><span>单价（元）</span><span>数量</span><span className="text-right">金额</span><span /></div>
          <ul className="flex flex-col divide-y divide-fg-grey-200">{form.items.map(item => <li key={item.id} className="grid grid-cols-2 items-center gap-3 px-5 py-3 md:grid-cols-[minmax(0,1fr)_96px_64px_104px_32px]">
            <TextField className="col-span-2 md:col-span-1" shape="pill" aria-label="项目名称" value={item.name} onChange={next => updateItem(item.id, { name: next })} placeholder="服务或商品名称" />
            <TextField shape="pill" aria-label="单价" inputMode="decimal" value={item.rate} onChange={next => updateItem(item.id, { rate: next })} />
            <TextField shape="pill" aria-label="数量" inputMode="numeric" value={item.quantity} onChange={next => updateItem(item.id, { quantity: next })} />
            <span className="text-sm font-semibold tabular-nums text-fg-black md:text-right">{money(amount(item))}</span>
            <IconButton type="button" variant="ghost" color="grey" size="sm" aria-label="删除此项" onClick={() => update("items", form.items.filter(entry => entry.id !== item.id))}><TrashBinMinimalisticLinear size={16} /></IconButton>
          </li>)}</ul>
          {!form.items.length && <p className="py-10 text-center text-sm text-fg-grey-700">还没有收费项目</p>}
        </section>
        <div><Button type="button" variant="tertiary" iconLeft={<PlusIcon size={16} />} onClick={() => update("items", [...form.items, { id: `i-${Date.now()}`, name: "", rate: "", quantity: "1" }])}>添加收费项</Button></div>
      </Panel>
      <Panel variant="template" title="金额汇总" subtitle="自动计算">
        <dl className="flex flex-col divide-y divide-fg-grey-200 text-sm">
          <div className="flex justify-between py-3 first:pt-0"><dt className="text-fg-grey-700">小计</dt><dd className="font-medium tabular-nums text-fg-black">{money(subtotal)}</dd></div>
          <div className="flex items-center justify-between gap-3 py-3"><dt className="text-fg-grey-700">优惠（元）</dt><dd className="w-28"><TextField shape="pill" aria-label="优惠金额" inputMode="decimal" value={form.discount} onChange={next => update("discount", next)} /></dd></div>
          <div className="flex items-center justify-between gap-3 py-3"><dt className="text-fg-grey-700">税率</dt><dd className="w-32"><SelectOption shape="pill" options={[{ label: "6%", value: "0.06" }, { label: "9%", value: "0.09" }, { label: "13%", value: "0.13" }]} value={String(form.taxRate)} onChange={next => update("taxRate", Number(next))} /></dd></div>
          <div className="flex justify-between py-3"><dt className="text-fg-grey-700">税额</dt><dd className="font-medium tabular-nums text-fg-black">{money(tax)}</dd></div>
        </dl>
        <div className="rounded-2xl bg-fg-blue-50 p-5"><p className="text-sm text-fg-blue">应收合计</p><p className="mt-1 text-3xl font-semibold tabular-nums text-fg-blue">{money(total)}</p></div>
        <Button type="button" className="w-full" disabled={!valid} onClick={() => { onSend?.(form, total); setStatus(`发票已发送，应收 ${money(total)}`); }}>发送发票</Button>
      </Panel>
    </div>
  </form>;
}
