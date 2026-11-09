"use client";

import { useState, type ReactNode } from "react";
import { Breadcrumbs, Button, PageTitleToolbar, RadioWithLabel, SelectOption, Stepper, TextArea, TextField } from "@forge-ui-official/core";
import { CheckCircleBold } from "@forge-ui-official/core/icons";

export interface OrderProduct {
  id: string;
  name: string;
  spec: string;
  price: number;
  image: string;
  stock: number;
}

export interface OrderDraft {
  quantities: Record<string, number>;
  customer: string;
  phone: string;
  email: string;
  address: string;
  delivery: "express" | "same-day" | "pickup";
  payment: string;
  note: string;
}

export const defaultOrderProducts: OrderProduct[] = [
  { id: "watch", name: "知行智能手表 E2", spec: "曜石黑 · 46mm", price: 1299, image: "/images/blocks/products/smartwatch.jpg", stock: 204 },
  { id: "headphones", name: "远山降噪耳机 Pro", spec: "月光白", price: 899, image: "/images/blocks/products/headphones.jpg", stock: 58 },
  { id: "keyboard", name: "知行机械键盘 K8", spec: "茶轴 · 87 键", price: 459, image: "/images/blocks/products/keyboard.jpg", stock: 0 },
];

const steps = [
  { id: "items", label: "选择商品", description: "数量与规格" },
  { id: "customer", label: "客户信息", description: "联系人与电话" },
  { id: "delivery", label: "配送与支付", description: "地址和方式" },
  { id: "confirm", label: "确认订单", description: "核对后提交" },
];
const deliveryFee = { express: 0, "same-day": 20, pickup: 0 };
const deliveryLabel = { express: "快递配送（包邮）", "same-day": "同城当日达（+¥20）", pickup: "门店自提" };
const paymentOptions = [{ value: "transfer", label: "对公转账" }, { value: "wechat", label: "微信支付" }, { value: "credit", label: "月结账期" }];
const money = (value: number) => `¥${value.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}`;

function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="flex justify-between gap-4 py-2 text-sm"><dt className="shrink-0 text-fg-grey-600">{label}</dt><dd className="text-right text-fg-black">{children}</dd></div>;
}

export interface OrderFormProps {
  products?: OrderProduct[];
  onSubmit?: (draft: OrderDraft) => void;
  className?: string;
}

export function OrderForm({ products = defaultOrderProducts, onSubmit, className = "" }: OrderFormProps) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [draft, setDraft] = useState<OrderDraft>({ quantities: { watch: 2, headphones: 1 }, customer: "", phone: "", email: "", address: "", delivery: "express", payment: "transfer", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof OrderDraft>(key: K) => (value: OrderDraft[K]) => { setDraft(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: "" })); };
  const lines = products.filter(product => (draft.quantities[product.id] ?? 0) > 0);
  const subtotal = lines.reduce((sum, product) => sum + product.price * draft.quantities[product.id], 0);
  const total = subtotal + deliveryFee[draft.delivery];

  function validate(current: number) {
    const next: Record<string, string> = {};
    if (current === 1 && !lines.length) next.items = "至少选择一件商品";
    if (current === 2) {
      if (!draft.customer.trim()) next.customer = "请填写客户名称";
      if (!/^1\d{10}$/.test(draft.phone.replace(/\s/g, ""))) next.phone = "请填写 11 位手机号";
      if (draft.email && !/^\S+@\S+\.\S+$/.test(draft.email)) next.email = "邮箱格式不正确";
    }
    if (current === 3 && draft.delivery !== "pickup" && !draft.address.trim()) next.address = "请填写收货地址";
    setErrors(next);
    return !Object.keys(next).length;
  }

  function next() {
    if (!validate(step)) return;
    if (step < steps.length) { setStep(step + 1); return; }
    onSubmit?.(draft);
    setDone(true);
  }

  function changeQuantity(id: string, value: number, max: number) {
    setDraft(current => ({ ...current, quantities: { ...current.quantities, [id]: Math.max(0, Math.min(max, value)) } }));
    setErrors(current => ({ ...current, items: "" }));
  }

  return <div className={`flex min-w-0 flex-col gap-5 ${className}`}>
    <PageTitleToolbar title="新建订单" subtitle="代客户录入线下成交的订单，提交后进入待发货。" breadcrumbs={<Breadcrumbs color="blue" items={[{ label: "电商运营", href: "#overview" }, { label: "订单", href: "#orders" }, { label: "新建订单" }]} />} />
    <div className="rounded-2xl border border-fg-grey-200 bg-white px-5 py-8 sm:px-10">
      {done ? <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-10 text-center">
        <span className="text-fg-green-500"><CheckCircleBold size={56} /></span>
        <h2 className="text-xl font-semibold text-fg-black">订单已提交</h2>
        <p className="text-sm text-fg-grey-600">订单号 SO-20261109-019，应收 {money(total)}。仓库会在 24 小时内安排发货，客户将收到短信通知。</p>
        <div className="mt-3 flex gap-2"><Button color="blue" variant="secondary" onClick={() => { setDone(false); setStep(1); setDraft(current => ({ ...current, customer: "", phone: "", email: "", address: "", note: "" })); }}>再录一单</Button><Button color="blue">查看订单</Button></div>
      </div> : <>
        <Stepper color="blue" items={steps} current={step} onStepChange={target => { if (target < step) setStep(target); }} className="mx-auto max-w-3xl" />
        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-5">
          {step === 1 ? <>
            <ul className="divide-y divide-fg-grey-100 rounded-xl border border-fg-grey-200">
              {products.map(product => {
                const quantity = draft.quantities[product.id] ?? 0;
                return <li key={product.id} className="flex items-center gap-4 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt="" className="size-14 shrink-0 rounded-lg bg-fg-grey-50 object-cover" />
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-fg-black">{product.name}</p><p className="mt-0.5 text-xs text-fg-grey-600">{product.spec} · {money(product.price)} · {product.stock ? `库存 ${product.stock}` : "暂时缺货"}</p></div>
                  <div className="flex items-center rounded-lg border border-fg-grey-200">
                    <button type="button" aria-label={`减少${product.name}`} disabled={!quantity} onClick={() => changeQuantity(product.id, quantity - 1, product.stock)} className="size-8 text-fg-grey-700 disabled:text-fg-grey-300">−</button>
                    <span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
                    <button type="button" aria-label={`增加${product.name}`} disabled={quantity >= product.stock} onClick={() => changeQuantity(product.id, quantity + 1, product.stock)} className="size-8 text-fg-grey-700 disabled:text-fg-grey-300">+</button>
                  </div>
                </li>;
              })}
            </ul>
            <div className="flex items-center justify-between text-sm"><span className={errors.items ? "text-fg-red" : "text-fg-grey-600"}>{errors.items || `已选 ${lines.reduce((sum, product) => sum + draft.quantities[product.id], 0)} 件商品`}</span><span className="font-semibold text-fg-black">小计 {money(subtotal)}</span></div>
          </> : step === 2 ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><TextField color="blue" inputClassName="h-6" label="客户名称 *" value={draft.customer} onChange={set("customer")} placeholder="公司或个人名称" state={errors.customer ? "error" : "idle"} errorMessage={errors.customer} /></div>
            <TextField color="blue" inputClassName="h-6" label="手机号 *" type="tel" value={draft.phone} onChange={set("phone")} placeholder="138 0000 0000" state={errors.phone ? "error" : "idle"} errorMessage={errors.phone} />
            <TextField color="blue" inputClassName="h-6" label="邮箱" type="email" value={draft.email} onChange={set("email")} placeholder="用于接收电子发票" state={errors.email ? "error" : "idle"} errorMessage={errors.email} />
          </div> : step === 3 ? <>
            <div role="radiogroup" aria-label="配送方式" className="flex flex-col gap-3">
              <span className="text-sm font-medium text-fg-black">配送方式</span>
              {(Object.keys(deliveryLabel) as OrderDraft["delivery"][]).map(key => <RadioWithLabel key={key} color="blue" label={deliveryLabel[key]} checked={draft.delivery === key} onChange={() => set("delivery")(key)} />)}
            </div>
            {draft.delivery === "pickup" ? <p className="rounded-xl bg-fg-grey-50 px-4 py-3 text-sm text-fg-grey-700">自提点：上海市徐汇区漕溪北路 88 号 1 楼服务台，工作日 9:00–18:00。</p> : <TextArea color="blue" label="收货地址 *" value={draft.address} onChange={set("address")} rows={2} placeholder="省市区 + 详细地址" state={errors.address ? "error" : "idle"} errorMessage={errors.address} />}
            <SelectOption color="blue" label="支付方式" width="100%" className="w-full" value={draft.payment} onChange={set("payment")} options={paymentOptions} />
            <TextArea color="blue" label="订单备注" value={draft.note} onChange={set("note")} rows={2} placeholder="选填，仓库和客服都能看到" />
          </> : <dl className="divide-y divide-fg-grey-100">
            <div className="pb-2">{lines.map(product => <Row key={product.id} label={`${product.name} × ${draft.quantities[product.id]}`}>{money(product.price * draft.quantities[product.id])}</Row>)}</div>
            <div className="py-2"><Row label="客户">{draft.customer} · {draft.phone}</Row><Row label="配送">{deliveryLabel[draft.delivery]}</Row>{draft.delivery !== "pickup" ? <Row label="地址">{draft.address}</Row> : null}<Row label="支付">{paymentOptions.find(option => option.value === draft.payment)?.label}</Row></div>
            <div className="pt-2"><Row label="商品小计">{money(subtotal)}</Row><Row label="运费">{money(deliveryFee[draft.delivery])}</Row><div className="flex justify-between pt-2 text-base font-semibold text-fg-black"><span>应收合计</span><span>{money(total)}</span></div></div>
          </dl>}
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-fg-grey-100 pt-5">
            <span className="text-xs text-fg-grey-500">第 {step} 步，共 {steps.length} 步</span>
            <div className="flex gap-2">{step > 1 ? <Button color="blue" variant="secondary" onClick={() => setStep(step - 1)}>上一步</Button> : null}<Button color="blue" onClick={next}>{step === steps.length ? "提交订单" : "下一步"}</Button></div>
          </div>
        </div>
      </>}
    </div>
  </div>;
}
