"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button, Checkbox, ConfirmationDialog, IconButton, MediaUpload, PlusIcon, SelectOption, StatusBadge, TextArea, TextField, cn, type MediaItem } from "@forge-ui-official/core";
import { CheckCircleLinear, CloseCircleLinear, TrashBinMinimalisticLinear } from "@forge-ui-official/core/icons";

export interface ProductVariant {
  id: string;
  type: string;
  value: string;
  quantity: string;
}

export interface ProductFormValue {
  name: string;
  description: string;
  price: string;
  discountType: string;
  discount: string;
  taxClass: string;
  sku: string;
  barcode: string;
  quantity: string;
  variants: ProductVariant[];
  physical: boolean;
  weight: string;
  height: string;
  length: string;
  width: string;
  category: string;
  tags: string[];
  status: "draft" | "published" | "scheduled";
}

export const defaultProductFormValue: ProductFormValue = {
  name: "知行智能手表 E2",
  description: "支持来电与消息提醒、心率与睡眠监测、50 米防水，单次充电续航 14 天。",
  price: "1299",
  discountType: "none",
  discount: "",
  taxClass: "standard",
  sku: "302012",
  barcode: "6971234502012",
  quantity: "204",
  variants: [
    { id: "v1", type: "color", value: "曜石黑", quantity: "120" },
    { id: "v2", type: "size", value: "46mm", quantity: "84" },
  ],
  physical: true,
  weight: "0.32",
  height: "4.6",
  length: "4.6",
  width: "1.2",
  category: "wearable",
  tags: ["new", "hot"],
  status: "draft",
};

const statusMeta: Record<ProductFormValue["status"], { label: string; color: "grey" | "green" | "blue" }> = {
  draft: { label: "草稿", color: "grey" },
  published: { label: "已上架", color: "green" },
  scheduled: { label: "定时上架", color: "blue" },
};

function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <section className="flex min-w-0 flex-col gap-4 rounded-card border border-fg-grey-200 bg-white p-6">
    <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-semibold text-fg-black">{title}</h3>{action}</div>
    {children}
  </section>;
}

export interface ProductFormProps {
  value?: ProductFormValue;
  media?: MediaItem[];
  onSubmit?: (value: ProductFormValue) => void;
  onCancel?: () => void;
  className?: string;
}

export function ProductForm({ value = defaultProductFormValue, media = [], onSubmit, onCancel, className }: ProductFormProps) {
  const [form, setForm] = useState(value);
  const [photos, setPhotos] = useState(media);
  const [confirming, setConfirming] = useState(false);
  const [saved, setSaved] = useState(false);
  const update = <K extends keyof ProductFormValue>(key: K, next: ProductFormValue[K]) => { setForm(current => ({ ...current, [key]: next })); setSaved(false); };
  const updateVariant = (id: string, patch: Partial<ProductVariant>) => update("variants", form.variants.map(variant => variant.id === id ? { ...variant, ...patch } : variant));
  const nameMissing = !form.name.trim();

  function upload(files: FileList) {
    setPhotos(current => [...current, ...Array.from(files).map(file => ({ id: `${file.name}-${file.lastModified}`, src: URL.createObjectURL(file), state: "success" as const }))]);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (nameMissing) return;
    setConfirming(true);
  }

  return <form className={cn("flex min-w-0 flex-col gap-4", className)} onSubmit={submit} noValidate>
    <div className="flex flex-wrap items-center justify-end gap-3">
      {saved && <p role="status" className="mr-auto text-sm text-fg-green-500">商品已保存</p>}
      <Button type="button" variant="tertiary" iconLeft={<CloseCircleLinear size={16} />} onClick={onCancel}>取消</Button>
      <Button type="submit" iconLeft={<CheckCircleLinear size={16} />} disabled={nameMissing}>保存商品</Button>
    </div>
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex min-w-0 flex-col gap-4">
        <Section title="基本信息">
          <TextField label="商品名称" shape="pill" required value={form.name} onChange={next => update("name", next)} placeholder="请输入商品名称" state={nameMissing ? "error" : undefined} errorMessage={nameMissing ? "商品名称不能为空" : undefined} />
          <TextArea label="商品描述" rows={5} value={form.description} onChange={next => update("description", next)} placeholder="介绍商品卖点、材质与使用场景" />
        </Section>
        <Section title="商品图片">
          <MediaUpload items={photos} label="主图与详情图" buttonLabel="添加图片" message="拖放图片到这里，或点击添加，建议 800×800 以上" color="blue" onUpload={upload} onRemove={id => setPhotos(current => current.filter(item => item.id !== id))} />
        </Section>
        <Section title="价格">
          <TextField label="售价（元）" shape="pill" inputMode="decimal" value={form.price} onChange={next => update("price", next)} placeholder="0.00" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectOption label="优惠类型" shape="pill" options={[{ label: "无优惠", value: "none" }, { label: "折扣", value: "percent" }, { label: "直降", value: "amount" }]} value={form.discountType} onChange={next => update("discountType", next)} />
            <TextField label={form.discountType === "amount" ? "直降金额（元）" : "折扣比例（%）"} shape="pill" inputMode="decimal" value={form.discount} onChange={next => update("discount", next)} placeholder={form.discountType === "none" ? "未设置优惠" : "请输入"} disabled={form.discountType === "none"} />
            <SelectOption label="税率" shape="pill" options={[{ label: "标准税率 13%", value: "standard" }, { label: "低税率 9%", value: "reduced" }, { label: "免税", value: "exempt" }]} value={form.taxClass} onChange={next => update("taxClass", next)} />
          </div>
        </Section>
        <Section title="库存">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TextField label="SKU" shape="pill" value={form.sku} onChange={next => update("sku", next)} />
            <TextField label="条形码" shape="pill" value={form.barcode} onChange={next => update("barcode", next)} />
            <TextField label="库存数量" shape="pill" inputMode="numeric" value={form.quantity} onChange={next => update("quantity", next)} />
          </div>
        </Section>
        <Section title="规格" action={<Button type="button" size="sm" variant="tertiary" iconLeft={<PlusIcon size={16} />} onClick={() => update("variants", [...form.variants, { id: `v-${Date.now()}`, type: "color", value: "", quantity: "" }])}>添加规格</Button>}>
          {form.variants.map((variant, index) => <div key={variant.id} className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
            <SelectOption label={index === 0 ? "规格类型" : undefined} shape="pill" options={[{ label: "颜色", value: "color" }, { label: "尺寸", value: "size" }, { label: "材质", value: "material" }]} value={variant.type} onChange={next => updateVariant(variant.id, { type: next })} />
            <TextField label={index === 0 ? "规格值" : undefined} shape="pill" value={variant.value} onChange={next => updateVariant(variant.id, { value: next })} placeholder="例如：曜石黑" />
            <TextField label={index === 0 ? "数量" : undefined} shape="pill" inputMode="numeric" value={variant.quantity} onChange={next => updateVariant(variant.id, { quantity: next })} placeholder="0" />
            <IconButton type="button" variant="tertiary" aria-label="删除规格" onClick={() => update("variants", form.variants.filter(item => item.id !== variant.id))}><TrashBinMinimalisticLinear size={16} /></IconButton>
          </div>)}
          {!form.variants.length && <p className="text-sm text-fg-grey-700">暂无规格，商品将以单一规格售卖。</p>}
        </Section>
        <Section title="物流">
          <label className="flex items-center gap-2 text-sm text-fg-black"><Checkbox color="blue" checked={form.physical} onChange={next => update("physical", next)} />实体商品，需要发货</label>
          {form.physical && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <TextField label="重量（kg）" shape="pill" value={form.weight} onChange={next => update("weight", next)} />
            <TextField label="高（cm）" shape="pill" value={form.height} onChange={next => update("height", next)} />
            <TextField label="长（cm）" shape="pill" value={form.length} onChange={next => update("length", next)} />
            <TextField label="宽（cm）" shape="pill" value={form.width} onChange={next => update("width", next)} />
          </div>}
        </Section>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        <Section title="分类">
          <SelectOption label="商品分类" shape="pill" options={[{ label: "智能穿戴", value: "wearable" }, { label: "影音", value: "audio" }, { label: "电脑外设", value: "peripheral" }, { label: "箱包", value: "bags" }]} value={form.category} onChange={next => update("category", next)} />
          <SelectOption type="multiple" label="商品标签" shape="pill" options={[{ label: "新品", value: "new" }, { label: "热卖", value: "hot" }, { label: "限时", value: "limited" }]} value={form.tags} onChange={next => update("tags", next)} />
        </Section>
        <Section title="状态" action={<StatusBadge {...statusMeta[form.status]} variant="soft" />}>
          <SelectOption label="上架状态" shape="pill" options={Object.entries(statusMeta).map(([key, item]) => ({ value: key, label: item.label }))} value={form.status} onChange={next => update("status", next as ProductFormValue["status"])} />
        </Section>
      </div>
    </div>
    {confirming && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <ConfirmationDialog title="保存商品修改？" description={`「${form.name}」将以「${statusMeta[form.status].label}」状态保存。`} confirmLabel="保存" cancelLabel="再看看" color="green" onConfirm={() => { onSubmit?.(form); setConfirming(false); setSaved(true); }} onCancel={() => setConfirming(false)} />
    </div>}
  </form>;
}
