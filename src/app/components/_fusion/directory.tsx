"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, SelectOption, TextField } from "@forge-ui-official/core";
import { MagniferLinear, RestartCircleLinear } from "@forge-ui-official/core/icons";
import { fusionFamilies, fusionItems, officialHref } from "./registry";
import { VisibleExample } from "./family-examples";
import type { FusionSettings } from "./types";

export function InteractionDirectory() {
  const [locale, setLocale] = useState<FusionSettings["locale"]>("zh");
  const [color, setColor] = useState<FusionSettings["color"]>("blue");
  const [motion, setMotion] = useState<FusionSettings["motion"]>("auto");
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const [epochs, setEpochs] = useState<Record<string, number>>({});
  const zh = locale === "zh";
  const needle = query.trim().toLocaleLowerCase();
  const items = fusionItems.filter(item => (family === "all" || item.family === family) && (!needle || [item.name, item.english, item.description, item.descriptionEn, ...item.target].some(value => value.toLocaleLowerCase().includes(needle))));
  return <div className="flex min-w-0 flex-col gap-8">
    <header className="flex flex-col gap-3"><h1 className="font-display text-4xl font-semibold tracking-fg">{zh ? "交互示例" : "Interaction examples"}</h1><p className="text-base leading-7 text-fg-grey-700">{zh ? "体验按钮、表单、聊天和图表的交互细节，找到适合产品的组件与组合。" : "Explore interactions for buttons, forms, chat and charts, and find the right components for your product."}</p></header>
    <div className="flex flex-col gap-4 rounded-2xl border border-fg-grey-200 bg-fg-white p-4">
      <div className="flex flex-wrap gap-3"><div className="min-w-44 flex-1"><TextField value={query} onChange={setQuery} color={color} iconLeft={<MagniferLinear size={18} />} aria-label={zh ? "搜索交互示例" : "Search interaction examples"} placeholder={zh ? "搜索组件或交互…" : "Search components or interactions…"} /></div><SelectOption placeholder={zh ? "选择分类" : "Choose a category"} width="200px" value={family} color={color} onChange={value => setFamily(String(value))} options={[{ value: "all", label: zh ? "全部分类" : "All categories" }, ...fusionFamilies.map(group => ({ value: group.id, label: zh ? group.name : group.english }))]} /></div>
      <div className="flex flex-wrap items-center gap-2"><Button size="sm" variant="tertiary" color="black" onClick={() => setLocale(zh ? "en" : "zh")}>{zh ? "English" : "中文"}</Button>{(["blue", "purple", "black"] as const).map((value, index) => <Button key={value} size="sm" color={value} variant={color === value ? "primary" : "tertiary"} aria-pressed={color === value} onClick={() => setColor(value)}>{(zh ? ["蓝", "紫", "黑"] : ["Blue", "Purple", "Black"])[index]}</Button>)}<Button size="sm" color="black" variant="tertiary" aria-pressed={motion === "none"} onClick={() => setMotion(motion === "none" ? "auto" : "none")}>{zh ? (motion === "none" ? "动效：关闭" : "动效：跟随系统") : (motion === "none" ? "Motion: off" : "Motion: system")}</Button><span role="status" className="ml-auto text-xs text-fg-grey-500">{zh ? `${items.length} 项示例` : `${items.length} examples`}</span></div>
    </div>
    {items.map(item => <section key={item.id} id={`example-${item.id}`} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-fg-grey-200 bg-fg-white">
      <div className="flex items-start justify-between gap-3 border-b border-fg-grey-100 p-5"><div className="flex min-w-0 flex-col gap-2"><h2 className="text-lg font-semibold">{zh ? item.name : item.english}</h2><p className="text-sm leading-6 text-fg-grey-700">{zh ? item.description : item.descriptionEn}</p><Link href={officialHref(item)} className="text-xs text-fg-grey-700 underline-offset-4 hover:text-accent hover:underline">{item.target.join(" · ")}</Link></div><Button size="sm" variant="tertiary" color="black" aria-label={`${zh ? "重置" : "Reset"} ${zh ? item.name : item.english}`} onClick={() => setEpochs(current => ({ ...current, [item.id]: (current[item.id] ?? 0) + 1 }))} iconLeft={<RestartCircleLinear size={16} />}>{zh ? "重置" : "Reset"}</Button></div>
      <div className="min-w-0 p-5"><VisibleExample id={item.id} settings={{ locale, color, motion }} epoch={epochs[item.id] ?? 0} /></div>
    </section>)}
    {!items.length && <p className="py-10 text-center text-sm text-fg-grey-700">{zh ? "没有找到匹配的示例，试试其他关键词。" : "No matching examples. Try another keyword."}</p>}
  </div>;
}
