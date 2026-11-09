"use client";

import { useState, type FormEvent } from "react";
import { Breadcrumbs, Button, IconButton, PageTitleToolbar, PlusIcon, SelectOption, TextArea, TextField } from "@forge-ui-official/core";
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
  note?: string;
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
  note: "请在付款截止日前转账至招商银行上海分行 1219 0866 3510 001，备注发票编号。",
};

const customers = [{ label: "远山设计有限公司", value: "yuanshan" }, { label: "拾光好物", value: "shiguang" }, { label: "青石建筑", value: "qingshi" }, { label: "云帆科技", value: "yunfan" }];

const taxOptions = [{ label: "6%（技术服务）", value: "0.06" }, { label: "13%（货物销售）", value: "0.13" }, { label: "3%（小规模）", value: "0.03" }, { label: "免税", value: "0" }];
const money = (value: number) => `¥${value.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const cell = "h-10 w-full rounded-lg border border-transparent bg-transparent px-2 text-sm text-fg-black outline-none transition-colors hover:border-fg-grey-200 focus:border-fg-blue focus:bg-white";

export interface InvoiceFormProps {
  value?: InvoiceFormValue;
  onSave?: (value: InvoiceFormValue) => void;
  onSend?: (value: InvoiceFormValue, total: number) => void;
  onCancel?: () => void;
  className?: string;
}

export function InvoiceForm({ value = defaultInvoiceForm, onSave, onSend, onCancel, className = "" }: InvoiceFormProps) {
  const [form, setForm] = useState(value);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof InvoiceFormValue>(key: K) => (next: InvoiceFormValue[K]) => { setForm(current => ({ ...current, [key]: next })); setStatus(null); };
  const setItem = (id: string, patch: Partial<InvoiceItemDraft>) => { setForm(current => ({ ...current, items: current.items.map(item => item.id === id ? { ...item, ...patch } : item) })); setStatus(null); setError(null); };
  const amount = (item: InvoiceItemDraft) => (Number(item.rate) || 0) * (Number(item.quantity) || 0);
  const subtotal = form.items.reduce((sum, item) => sum + amount(item), 0);
  const discount = Math.min(subtotal, Number(form.discount) || 0);
  const tax = Math.round((subtotal - discount) * form.taxRate * 100) / 100;
  const total = subtotal - discount + tax;

  function send(event: FormEvent) {
    event.preventDefault();
    if (!form.items.some(item => item.name.trim() && amount(item) > 0)) { setError("至少需要一项有金额的收费明细"); return; }
    if (form.dueAt < form.issuedAt) { setError("付款截止不能早于开票日期"); return; }
    onSend?.(form, total);
    setStatus(`已发送给${customers.find(customer => customer.value === form.customer)?.label}，应收 ${money(total)}`);
  }

  return <div className={`flex min-w-0 flex-col gap-5 ${className}`}>
    <PageTitleToolbar title="新建发票" subtitle="发送后客户会收到带付款链接的电子发票。" breadcrumbs={<Breadcrumbs color="blue" items={[{ label: "财务管理", href: "#overview" }, { label: "发票", href: "#invoices" }, { label: "新建发票" }]} />} />
    <form onSubmit={send} className="flex w-full flex-col gap-8 rounded-2xl border border-fg-grey-200 bg-white p-5 sm:p-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SelectOption color="blue" label="付款客户" width="100%" className="w-full" value={form.customer} onChange={set("customer")} options={customers} />
        <TextField color="blue" inputClassName="h-6" label="发票编号" value={form.invoiceId} onChange={set("invoiceId")} />
        <TextField color="blue" inputClassName="h-6" label="开票日期" type="date" value={form.issuedAt} onChange={set("issuedAt")} />
        <TextField color="blue" inputClassName="h-6" label="付款截止" type="date" value={form.dueAt} onChange={set("dueAt")} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-fg-black">收费明细</h2>
        <div className="overflow-x-auto rounded-xl border border-fg-grey-200">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-fg-grey-50 text-left text-xs text-fg-grey-600"><tr><th className="px-3 py-2.5 font-medium">项目</th><th className="w-32 px-3 py-2.5 font-medium">单价（元）</th><th className="w-24 px-3 py-2.5 font-medium">数量</th><th className="w-36 px-3 py-2.5 text-right font-medium">金额</th><th className="w-12" /></tr></thead>
            <tbody className="divide-y divide-fg-grey-100">
              {form.items.map(item => <tr key={item.id}>
                <td className="px-1 py-1"><input aria-label="项目" className={cell} value={item.name} placeholder="收费项目名称" onChange={event => setItem(item.id, { name: event.target.value })} /></td>
                <td className="px-1 py-1"><input aria-label="单价" inputMode="decimal" className={`${cell} tabular-nums`} value={item.rate} onChange={event => setItem(item.id, { rate: event.target.value })} /></td>
                <td className="px-1 py-1"><input aria-label="数量" inputMode="numeric" className={`${cell} tabular-nums`} value={item.quantity} onChange={event => setItem(item.id, { quantity: event.target.value })} /></td>
                <td className="px-3 py-1 text-right tabular-nums text-fg-black">{money(amount(item))}</td>
                <td className="px-1 py-1 text-center"><IconButton variant="ghost" size="sm" aria-label={`删除${item.name || "收费项"}`} disabled={form.items.length === 1} onClick={() => setForm(current => ({ ...current, items: current.items.filter(entry => entry.id !== item.id) }))}><TrashBinMinimalisticLinear size={16} /></IconButton></td>
              </tr>)}
            </tbody>
          </table>
        </div>
        <div><Button color="blue" variant="tertiary" size="sm" iconLeft={<PlusIcon size={14} />} onClick={() => setForm(current => ({ ...current, items: [...current.items, { id: `i${current.items.length + 1}-${subtotal}`, name: "", rate: "", quantity: "1" }] }))}>添加收费项</Button></div>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
        <TextArea color="blue" label="付款说明" value={form.note ?? ""} onChange={set("note")} rows={5} />
        <dl className="flex w-full flex-col gap-2 text-sm">
          <div className="flex items-center justify-between"><dt className="text-fg-grey-600">小计</dt><dd className="tabular-nums text-fg-black">{money(subtotal)}</dd></div>
          <div className="flex items-center justify-between gap-4"><dt className="text-fg-grey-600">优惠</dt><dd className="w-36"><TextField color="blue" inputClassName="h-6 text-right" aria-label="优惠金额" inputMode="decimal" value={form.discount} onChange={set("discount")} suffix={<span className="text-xs text-fg-grey-500">元</span>} /></dd></div>
          <div className="flex items-center justify-between gap-4"><dt className="text-fg-grey-600">税率</dt><dd className="w-44"><SelectOption color="blue" width="100%" className="w-full" value={String(form.taxRate)} onChange={next => set("taxRate")(Number(next))} options={taxOptions} /></dd></div>
          <div className="flex items-center justify-between"><dt className="text-fg-grey-600">税额</dt><dd className="tabular-nums text-fg-black">{money(tax)}</dd></div>
          <div className="mt-1 flex items-center justify-between border-t border-fg-grey-200 pt-3"><dt className="font-medium text-fg-black">应收合计</dt><dd className="text-xl font-semibold tabular-nums text-fg-black">{money(total)}</dd></div>
        </dl>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-fg-grey-100 pt-5">
        <span className={`text-sm ${error ? "text-fg-red" : "text-fg-grey-600"}`}>{error ?? status ?? "发送前可以先保存草稿"}</span>
        <div className="flex gap-2">
          <Button color="grey" variant="tertiary" type="button" onClick={onCancel}>取消</Button>
          <Button color="blue" variant="secondary" type="button" onClick={() => { onSave?.(form); setStatus("草稿已保存"); setError(null); }}>保存草稿</Button>
          <Button color="blue" type="submit">发送发票</Button>
        </div>
      </div>
    </form>
  </div>;
}
