"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Button, Panel, StatusBadge, TabBar, cn } from "@forge-ui-official/core";
import { PenNewSquareLinear, StarBold } from "@forge-ui-official/core/icons";

export interface ProductDetailData {
  name: string;
  status: { label: string; color: "green" | "yellow" | "red" | "grey" };
  price: number;
  sold: number;
  rating: number;
  stock: number;
  inquiries: number;
  images: { src: string; alt: string }[];
  variants: { label: string; swatch: string }[];
  description: string;
  specs: string;
  sku: string;
  createdAt: string;
  orders: { id: string; buyer: string; quantity: number; total: string; date: string }[];
  reviews: { id: string; buyer: string; rating: number; comment: string; date: string }[];
}

export const defaultProductDetail: ProductDetailData = {
  name: "知行智能手表 E2",
  status: { label: "已上架", color: "green" },
  price: 1299,
  sold: 1316,
  rating: 4.8,
  stock: 204,
  inquiries: 25,
  images: [
    { src: "/images/blocks/products/smartwatch.jpg", alt: "曜石黑表盘正面" },
    { src: "/images/blocks/products/watch.jpg", alt: "月光白表带侧面" },
    { src: "/images/blocks/products/phone.jpg", alt: "与手机同步通知" },
    { src: "/images/blocks/products/phone-dark.jpg", alt: "搭配知行手机" },
  ],
  variants: [{ label: "曜石黑", swatch: "bg-fg-black" }, { label: "月光白", swatch: "bg-fg-grey-200" }, { label: "珊瑚红", swatch: "bg-fg-red-500" }],
  description: "支持来电与消息提醒、心率与睡眠监测、50 米防水。连接手机后自动同步日程与运动数据，单次充电续航 14 天，适合通勤与运动全天佩戴。",
  specs: "46mm 表盘 · 32g · 蓝牙 5.3 · 支持 iOS 与 Android",
  sku: "302012",
  createdAt: "2026-10-29",
  orders: [
    { id: "ZX2026103106", buyer: "陈思远", quantity: 2, total: "¥2,598", date: "2026-10-31" },
    { id: "ZX2026103004", buyer: "周予安", quantity: 1, total: "¥1,299", date: "2026-10-30" },
    { id: "ZX2026102902", buyer: "沈清和", quantity: 3, total: "¥3,897", date: "2026-10-29" },
  ],
  reviews: [
    { id: "r1", buyer: "许知夏", rating: 5, comment: "续航很顶，戴着睡觉也不硌手。", date: "2026-10-30" },
    { id: "r2", buyer: "林悦", rating: 4, comment: "颜值高，表带扣稍微有点紧。", date: "2026-10-27" },
  ],
};

const tabs = ["商品详情", "订单", "评价"];

export interface ProductDetailProps {
  product?: ProductDetailData;
  onEdit?: () => void;
  className?: string;
}

export function ProductDetail({ product = defaultProductDetail, onEdit, className }: ProductDetailProps) {
  const [tab, setTab] = useState(0);
  const [image, setImage] = useState(0);
  const [variant, setVariant] = useState(0);
  const facts = [{ label: "销量", value: product.sold.toLocaleString("zh-CN") }, { label: "评分", value: `${product.rating}/5`, star: true }, { label: "库存", value: String(product.stock) }, { label: "咨询", value: String(product.inquiries) }];

  return <div className={cn("flex min-w-0 flex-col gap-4", className)}>
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-fg-grey-200">
      <div className="fg-scrollbar-hidden overflow-x-auto"><TabBar color="blue" tabs={tabs.map((label, index) => ({ label, active: index === tab }))} onChange={setTab} /></div>
      <Button className="mb-2" iconLeft={<PenNewSquareLinear size={16} />} onClick={onEdit}>编辑商品</Button>
    </div>
    {tab === 0 && <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <Panel variant="template">
        <img src={product.images[image].src} alt={product.images[image].alt} className="aspect-square w-full rounded-2xl bg-fg-grey-100 object-cover" />
        <div className="grid grid-cols-4 gap-3" role="listbox" aria-label="商品图片">
          {product.images.map((item, index) => <Button variant="unstyled" key={item.src} type="button" role="option" aria-selected={index === image} aria-label={item.alt} onClick={() => setImage(index)} className={cn("overflow-hidden rounded-xl border-2 transition-colors", index === image ? "border-fg-blue" : "border-transparent")}><img src={item.src} alt="" className="aspect-square w-full bg-fg-grey-100 object-cover" /></Button>)}
        </div>
      </Panel>
      <Panel variant="template">
        <div className="flex items-start justify-between gap-3"><h2 className="text-2xl font-semibold text-fg-black">{product.name}</h2><StatusBadge {...product.status} variant="soft" /></div>
        <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">{facts.map(fact => <div key={fact.label} className="flex items-center gap-1.5"><dt className="text-fg-grey-700">{fact.label}</dt><dd className="flex items-center gap-1 font-medium text-fg-black">{fact.star && <StarBold size={14} className="text-fg-yellow-500" />}{fact.value}</dd></div>)}</dl>
        <p className="border-b border-fg-grey-200 pb-5 text-3xl font-semibold tabular-nums text-fg-black">¥{product.price.toLocaleString("zh-CN", { minimumFractionDigits: 2 })}</p>
        <div className="flex flex-col gap-3"><p className="text-base font-medium text-fg-black">颜色</p><div className="flex flex-wrap gap-2" role="radiogroup" aria-label="颜色">{product.variants.map((item, index) => <Button variant="unstyled" key={item.label} type="button" role="radio" aria-checked={index === variant} onClick={() => setVariant(index)} className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors", index === variant ? "border-fg-blue text-fg-black" : "border-fg-grey-200 text-fg-grey-700")}><span className={cn("size-4 rounded-full", item.swatch)} />{item.label}</Button>)}</div></div>
        <div className="flex flex-col gap-2"><p className="text-base font-medium text-fg-black">商品描述</p><p className="text-sm leading-6 text-fg-grey-700">{product.description}</p></div>
        <div className="flex flex-col gap-2"><p className="text-base font-medium text-fg-black">规格参数</p><p className="text-sm text-fg-grey-700">{product.specs}</p></div>
        <div className="flex flex-wrap justify-between gap-2 border-t border-fg-grey-200 pt-4 text-sm"><span className="text-fg-grey-700">SKU：<span className="text-fg-black">#{product.sku}</span></span><span className="text-fg-grey-700">上架日期：<span className="text-fg-black">{product.createdAt}</span></span></div>
      </Panel>
    </div>}
    {tab === 1 && <Panel variant="template" title="最近订单" subtitle={`近 7 天 ${product.orders.length} 笔`}>
      <ul className="flex flex-col divide-y divide-fg-grey-200">{product.orders.map(order => <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"><div><p className="text-sm font-semibold text-fg-black">{order.buyer}</p><p className="text-xs text-fg-grey-700">{order.id} · {order.date}</p></div><p className="text-sm text-fg-grey-700">× {order.quantity}<span className="ml-4 font-semibold tabular-nums text-fg-black">{order.total}</span></p></li>)}</ul>
    </Panel>}
    {tab === 2 && <Panel variant="template" title="买家评价" subtitle={`平均 ${product.rating} 分`}>
      <ul className="flex flex-col divide-y divide-fg-grey-200">{product.reviews.map(review => <li key={review.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-fg-black">{review.buyer}</p><p className="flex items-center gap-1 text-sm text-fg-black"><StarBold size={14} className="text-fg-yellow-500" />{review.rating}</p></div><p className="text-sm text-fg-grey-700">{review.comment}</p><p className="text-xs text-fg-grey-500">{review.date}</p></li>)}</ul>
    </Panel>}
  </div>;
}
