"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button, MediaUpload, SelectOption, TextArea, TextField, cn, type MediaItem } from "@forge-ui-official/core";
import { CheckCircleLinear, CloseCircleLinear } from "@forge-ui-official/core/icons";

export interface OrderFormValue {
  product: string;
  description: string;
  category: string;
  unitPrice: string;
  quantity: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  payment: string;
  shipping: string;
}

export const emptyOrderForm: OrderFormValue = { product: "", description: "", category: "", unitPrice: "", quantity: "1", customer: "", email: "", phone: "", address: "", payment: "", shipping: "" };

const required: (keyof OrderFormValue)[] = ["product", "unitPrice", "quantity", "customer", "phone", "address", "payment", "shipping"];
const labels: Partial<Record<keyof OrderFormValue, string>> = { product: "商品名称", unitPrice: "单价", quantity: "数量", customer: "客户姓名", phone: "手机号", address: "收货地址", payment: "支付方式", shipping: "配送方式" };

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="flex min-w-0 flex-col gap-4 rounded-card border border-fg-grey-200 bg-white p-6"><h3 className="text-lg font-semibold text-fg-black">{title}</h3>{children}</section>;
}

export interface OrderFormProps {
  value?: OrderFormValue;
  onSubmit?: (value: OrderFormValue, images: MediaItem[]) => void;
  onCancel?: () => void;
  className?: string;
}

export function OrderForm({ value = emptyOrderForm, onSubmit, onCancel, className }: OrderFormProps) {
  const [form, setForm] = useState(value);
  const [images, setImages] = useState<MediaItem[]>([]);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const missing = required.filter(key => !form[key].trim());
  const quantity = Number(form.quantity);
  const unitPrice = Number(form.unitPrice);
  const total = Number.isFinite(quantity * unitPrice) ? quantity * unitPrice : 0;
  const update = (key: keyof OrderFormValue) => (next: string) => { setForm(current => ({ ...current, [key]: next })); setSubmitted(false); };
  const error = (key: keyof OrderFormValue) => touched && missing.includes(key) ? { state: "error" as const, errorMessage: `请填写${labels[key]}` } : {};

  function submit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (missing.length) return;
    onSubmit?.(form, images);
    setSubmitted(true);
  }

  return <form className={cn("flex min-w-0 flex-col gap-4", className)} onSubmit={submit} noValidate>
    <div className="flex flex-wrap items-center justify-end gap-3">
      <p role="status" className={cn("mr-auto text-sm", submitted ? "text-fg-green-500" : "text-fg-grey-700")}>{submitted ? "订单已创建，已通知仓库备货" : touched && missing.length ? `还有 ${missing.length} 项必填未完成` : `订单金额 ¥${total.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}`}</p>
      <Button type="button" variant="tertiary" iconLeft={<CloseCircleLinear size={16} />} onClick={onCancel}>取消</Button>
      <Button type="submit" iconLeft={<CheckCircleLinear size={16} />}>创建订单</Button>
    </div>
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex min-w-0 flex-col gap-4">
        <Section title="商品信息">
          <TextField label="商品名称" shape="pill" required value={form.product} onChange={update("product")} placeholder="例如：知行智能手表 E2" {...error("product")} />
          <TextArea label="备注" rows={3} value={form.description} onChange={update("description")} placeholder="颜色、规格或定制要求" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SelectOption label="商品分类" shape="pill" placeholder="请选择分类" options={[{ label: "智能穿戴", value: "wearable" }, { label: "影音", value: "audio" }, { label: "电脑外设", value: "peripheral" }]} value={form.category} onChange={update("category")} />
            <TextField label="单价（元）" shape="pill" inputMode="decimal" value={form.unitPrice} onChange={update("unitPrice")} placeholder="0.00" {...error("unitPrice")} />
            <TextField label="数量" shape="pill" inputMode="numeric" value={form.quantity} onChange={update("quantity")} {...error("quantity")} />
          </div>
        </Section>
        <Section title="客户信息">
          <TextField label="客户姓名" shape="pill" value={form.customer} onChange={update("customer")} placeholder="请输入收货人姓名" {...error("customer")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="邮箱" type="email" shape="pill" value={form.email} onChange={update("email")} placeholder="name@company.com" />
            <TextField label="手机号" type="tel" shape="pill" value={form.phone} onChange={update("phone")} placeholder="138 0000 0000" {...error("phone")} />
          </div>
        </Section>
        <Section title="配送信息">
          <TextArea label="收货地址" rows={3} value={form.address} onChange={update("address")} placeholder="省市区 + 详细地址" {...error("address")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectOption label="支付方式" shape="pill" placeholder="请选择" options={[{ label: "对公转账", value: "transfer" }, { label: "微信支付", value: "wechat" }, { label: "支付宝", value: "alipay" }]} value={form.payment} onChange={update("payment")} {...error("payment")} />
            <SelectOption label="配送方式" shape="pill" placeholder="请选择" options={[{ label: "顺丰标快", value: "sf" }, { label: "京东物流", value: "jd" }, { label: "门店自提", value: "pickup" }]} value={form.shipping} onChange={update("shipping")} {...error("shipping")} />
          </div>
        </Section>
      </div>
      <Section title="商品图片">
        <MediaUpload items={images} buttonLabel="添加图片" message="拖放图片到这里，或点击添加" color="blue" onUpload={files => setImages(current => [...current, ...Array.from(files).map(file => ({ id: `${file.name}-${file.lastModified}`, src: URL.createObjectURL(file), state: "success" as const }))])} onRemove={id => setImages(current => current.filter(item => item.id !== id))} />
      </Section>
    </div>
  </form>;
}
