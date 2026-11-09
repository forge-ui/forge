"use client";

import { useState, type ReactNode } from "react";
import { Breadcrumbs, Button, MediaUpload, PageTitleToolbar, RadioWithLabel, SelectOption, TextArea, TextField } from "@forge-ui-official/core";

export interface ProductDraft {
  name: string;
  sku: string;
  category: string;
  brand: string;
  tags: string;
  description: string;
  price: string;
  listPrice: string;
  cost: string;
  stock: string;
  alertStock: string;
  taxRate: string;
  weight: string;
  origin: string;
  shipping: string;
  publish: "now" | "scheduled" | "draft";
  publishAt: string;
}

export const defaultProductDraft: ProductDraft = {
  name: "知行智能手表 E2",
  sku: "ZX-WATCH-E2-BLK",
  category: "wearable",
  brand: "zhixing",
  tags: "新品, 热卖",
  description: "支持来电与消息提醒、心率与睡眠监测，50 米防水，单次充电续航 14 天。",
  price: "1299",
  listPrice: "1499",
  cost: "620",
  stock: "204",
  alertStock: "30",
  taxRate: "13",
  weight: "0.32",
  origin: "shanghai",
  shipping: "free",
  publish: "now",
  publishAt: "",
};

const categoryOptions = [{ value: "wearable", label: "智能穿戴" }, { value: "audio", label: "影音耳机" }, { value: "office", label: "办公外设" }];
const brandOptions = [{ value: "zhixing", label: "知行" }, { value: "yuanshan", label: "远山" }];
const taxOptions = [{ value: "13", label: "13%（一般货物）" }, { value: "9", label: "9%" }, { value: "6", label: "6%" }, { value: "0", label: "免税" }];
const originOptions = [{ value: "shanghai", label: "上海仓" }, { value: "guangzhou", label: "广州仓" }, { value: "chengdu", label: "成都仓" }];
const shippingOptions = [{ value: "free", label: "包邮" }, { value: "weight", label: "按重量计费" }, { value: "fixed", label: "固定运费 10 元" }];

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <section className="flex flex-col gap-5 border-t border-fg-grey-100 px-5 py-6 first:border-t-0 sm:px-6">
    <div><h2 className="text-base font-semibold text-fg-black">{title}</h2><p className="mt-1 text-sm text-fg-grey-600">{description}</p></div>
    {children}
  </section>;
}

const unit = (text: string) => <span className="text-xs text-fg-grey-500">{text}</span>;

export interface ProductFormProps {
  initial?: ProductDraft;
  onSubmit?: (draft: ProductDraft, mode: "draft" | "publish") => void;
  className?: string;
}

export function ProductForm({ initial = defaultProductDraft, onSubmit, className = "" }: ProductFormProps) {
  const [draft, setDraft] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductDraft, string>>>({});
  const [saved, setSaved] = useState<string | null>(null);
  const [images, setImages] = useState([
    { id: "front", src: "/images/blocks/products/smartwatch.jpg" },
    { id: "side", src: "/images/blocks/products/watch.jpg" },
  ]);
  const set = <K extends keyof ProductDraft>(key: K) => (value: ProductDraft[K]) => { setDraft(current => ({ ...current, [key]: value })); setDirty(true); setErrors(current => ({ ...current, [key]: undefined })); };
  const margin = Number(draft.price) > 0 && Number(draft.cost) > 0 ? Math.round((1 - Number(draft.cost) / Number(draft.price)) * 100) : null;

  function submit(mode: "draft" | "publish") {
    const next: typeof errors = {};
    if (!draft.name.trim()) next.name = "请填写商品名称";
    if (mode === "publish") {
      if (!draft.sku.trim()) next.sku = "发布前需要填写商品编码";
      if (!(Number(draft.price) > 0)) next.price = "售价需大于 0";
      if (draft.listPrice && Number(draft.listPrice) < Number(draft.price)) next.listPrice = "划线价不能低于售价";
      if (!/^\d+$/.test(draft.stock)) next.stock = "库存需为整数";
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit?.(draft, mode);
    setDirty(false);
    setSaved(mode === "publish" ? "已发布，商品将在前台展示" : "草稿已保存");
  }

  return <div className={`flex min-w-0 flex-col gap-5 ${className}`}>
    <PageTitleToolbar title="编辑商品" subtitle="修改会在发布后同步到商城前台与小程序。" breadcrumbs={<Breadcrumbs color="blue" items={[{ label: "电商运营", href: "#overview" }, { label: "商品", href: "#products" }, { label: "编辑商品" }]} />} />
    <form className="overflow-hidden rounded-2xl border border-fg-grey-200 bg-white" onSubmit={event => { event.preventDefault(); submit("publish"); }}>
      <Section title="基本信息" description="名称和描述会出现在商品详情页与搜索结果里。">
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-3">
          <div className="md:col-span-2"><TextField color="blue" inputClassName="h-6" label="商品名称 *" value={draft.name} onChange={set("name")} state={errors.name ? "error" : "idle"} errorMessage={errors.name} maxLength={60} /></div>
          <TextField color="blue" inputClassName="h-6" label="商品编码 *" value={draft.sku} onChange={set("sku")} state={errors.sku ? "error" : "idle"} errorMessage={errors.sku} placeholder="如 ZX-WATCH-E2-BLK" />
          <SelectOption color="blue" label="商品分类" width="100%" className="w-full" value={draft.category} onChange={set("category")} options={categoryOptions} />
          <SelectOption color="blue" label="品牌" width="100%" className="w-full" value={draft.brand} onChange={set("brand")} options={brandOptions} />
          <TextField color="blue" inputClassName="h-6" label="标签" value={draft.tags} onChange={set("tags")} placeholder="用逗号分隔" />
          <div className="md:col-span-3"><TextArea color="blue" label="商品描述" value={draft.description} onChange={set("description")} rows={3} /></div>
        </div>
      </Section>

      <Section title="价格与库存" description={margin === null ? "填写售价和成本价后会自动计算毛利率。" : `按当前售价与成本价计算，毛利率约 ${margin}%。`}>
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-3">
          <TextField color="blue" inputClassName="h-6" label="售价 *" inputMode="decimal" value={draft.price} onChange={set("price")} suffix={unit("元")} state={errors.price ? "error" : "idle"} errorMessage={errors.price} />
          <TextField color="blue" inputClassName="h-6" label="划线价" inputMode="decimal" value={draft.listPrice} onChange={set("listPrice")} suffix={unit("元")} state={errors.listPrice ? "error" : "idle"} errorMessage={errors.listPrice} />
          <TextField color="blue" inputClassName="h-6" label="成本价" inputMode="decimal" value={draft.cost} onChange={set("cost")} suffix={unit("元")} />
          <TextField color="blue" inputClassName="h-6" label="库存数量 *" inputMode="numeric" value={draft.stock} onChange={set("stock")} suffix={unit("件")} state={errors.stock ? "error" : "idle"} errorMessage={errors.stock} />
          <TextField color="blue" inputClassName="h-6" label="库存预警" inputMode="numeric" value={draft.alertStock} onChange={set("alertStock")} suffix={unit("件")} />
          <SelectOption color="blue" label="税率" width="100%" className="w-full" value={draft.taxRate} onChange={set("taxRate")} options={taxOptions} />
        </div>
      </Section>

      <Section title="商品图片" description="第一张作为主图，建议 800×800 以上的白底图，最多 6 张。">
        <MediaUpload color="blue" items={images} buttonLabel="添加图片" message="拖拽图片到这里，或点击添加" onUpload={files => { setImages(current => [...current, ...Array.from(files).slice(0, 6 - current.length).map((file, index) => ({ id: `${file.name}-${index}`, src: URL.createObjectURL(file) }))]); setDirty(true); }} onRemove={id => { setImages(current => current.filter(image => image.id !== id)); setDirty(true); }} />
      </Section>

      <Section title="物流与上架" description="决定从哪个仓发货、运费怎么算，以及什么时候在前台上架。">
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-3">
          <TextField color="blue" inputClassName="h-6" label="包装重量" inputMode="decimal" value={draft.weight} onChange={set("weight")} suffix={unit("kg")} />
          <SelectOption color="blue" label="发货仓" width="100%" className="w-full" value={draft.origin} onChange={set("origin")} options={originOptions} />
          <SelectOption color="blue" label="运费模板" width="100%" className="w-full" value={draft.shipping} onChange={set("shipping")} options={shippingOptions} />
        </div>
        <div role="radiogroup" aria-label="上架方式" className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="text-sm font-medium text-fg-black">上架方式</span>
          <RadioWithLabel color="blue" label="发布后立即上架" checked={draft.publish === "now"} onChange={() => set("publish")("now")} />
          <RadioWithLabel color="blue" label="定时上架" checked={draft.publish === "scheduled"} onChange={() => set("publish")("scheduled")} />
          <RadioWithLabel color="blue" label="暂不上架" checked={draft.publish === "draft"} onChange={() => set("publish")("draft")} />
        </div>
        {draft.publish === "scheduled" ? <div className="max-w-xs"><TextField color="blue" inputClassName="h-6" label="上架时间" type="datetime-local" value={draft.publishAt} onChange={set("publishAt")} /></div> : null}
      </Section>

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-fg-grey-200 bg-white/95 px-5 py-3 backdrop-blur sm:px-6">
        <span className={`text-sm ${Object.keys(errors).some(key => errors[key as keyof ProductDraft]) ? "text-fg-red" : "text-fg-grey-600"}`}>
          {Object.values(errors).filter(Boolean).length ? `还有 ${Object.values(errors).filter(Boolean).length} 处需要修改` : saved ?? (dirty ? "有未保存的修改" : "上次保存于今天 10:24")}
        </span>
        <div className="flex flex-wrap gap-2">
          <Button color="grey" variant="tertiary" type="button" onClick={() => { setDraft(initial); setErrors({}); setDirty(false); setSaved(null); }}>放弃修改</Button>
          <Button color="blue" variant="secondary" type="button" onClick={() => submit("draft")}>保存草稿</Button>
          <Button color="blue" type="submit">发布商品</Button>
        </div>
      </div>
    </form>
  </div>;
}
