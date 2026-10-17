"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion as m, useReducedMotion } from "motion/react";
import { Button, CheckboxWithLabel, FilterPanel, ListGroup, ListItem, SurfaceCard, TextField } from "@forge-ui-official/core";
import { CloseCircleLinear, DocumentTextLinear, MagniferLinear } from "@forge-ui-official/core/icons";
import type { FusionExampleProps, FusionSettings } from "./types";

type Result = { id: string; zh: string; en: string; red?: boolean; size?: boolean; cheap?: boolean; pdf?: boolean; recent?: boolean; team?: boolean };
const products: Result[] = [
  { id: "daily", zh: "日常跑鞋", en: "Daily Runner", red: true, size: false, cheap: true },
  { id: "cushion", zh: "缓震跑鞋", en: "Cushion Runner", red: true, size: true, cheap: false },
  { id: "lite", zh: "轻量跑鞋", en: "Lite Runner", red: false, size: true, cheap: true },
  { id: "road", zh: "公路跑鞋", en: "Road Runner", red: false, size: true, cheap: true },
  { id: "slip", zh: "轻便运动鞋", en: "Slip-on Sneakers", red: true, size: true, cheap: true },
];
const documents: Result[] = [
  { id: "guide", zh: "设计规范", en: "Design guidelines", pdf: true, recent: true, team: false },
  { id: "review", zh: "设计评审记录", en: "Design review", pdf: false, recent: true, team: true },
  { id: "archive", zh: "设计归档", en: "Design archive", pdf: true, recent: false, team: true },
  { id: "engineering", zh: "工程规范", en: "Engineering guidelines", pdf: true, recent: true, team: true },
];
const normalize = (value: string) => value.toLocaleLowerCase().replace(/\s+/g, "");

export function SearchRecoveryExample({ id, locale, color, motion }: FusionExampleProps) {
  const zh = locale === "zh";
  const isProducts = id === "092";
  const data = isProducts ? products : documents;
  const filters: Array<{ key: keyof Result; label: string }> = isProducts
    ? [{ key: "red", label: zh ? "红色" : "Red" }, { key: "size", label: zh ? "尺码 270" : "Size 270" }, { key: "cheap", label: zh ? "优惠款" : "Budget" }]
    : [{ key: "pdf", label: "PDF" }, { key: "recent", label: zh ? "最近更新" : "Recent" }, { key: "team", label: zh ? "工程团队" : "Engineering" }];
  const [query, setQuery] = useState(isProducts ? (zh ? "跑协" : "runer") : (zh ? "设记" : "desgin"));
  const [active, setActive] = useState(filters.map(filter => filter.key));
  const [draft, setDraft] = useState(active);
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();
  const search = (searchQuery: string, keys: Array<keyof Result>) => data.filter(item => normalize(zh ? item.zh : item.en).includes(normalize(searchQuery)) && keys.every(key => item[key] === true));
  const result = search(query, active);
  const corrected = isProducts ? query.replace(/runer/gi, "runner").replace(/跑协/g, "跑鞋") : query.replace(/desgin/gi, "design").replace(/设记/g, "设计");
  function remove(key: keyof Result) { setActive(current => current.filter(item => item !== key)); input.current?.focus(); }
  function reset() { setActive([]); setQuery(""); input.current?.focus(); }
  return <div className="flex w-full flex-col gap-4">
    <TextField ref={input} label={zh ? (isProducts ? "搜索商品" : "搜索文档") : (isProducts ? "Search products" : "Search documents")} value={query} onChange={setQuery} color={color} iconLeft={<MagniferLinear size={18} />} />
    <div className="flex flex-wrap gap-2">
      {filters.filter(filter => active.includes(filter.key)).map(filter => <Button motion={motion} key={filter.key} size="sm" color={color} variant="secondary" iconRight={<CloseCircleLinear size={14} />} aria-label={`${zh ? "移除" : "Remove"} ${filter.label}`} onClick={() => remove(filter.key)}>{filter.label}</Button>)}
      <Button motion={motion} size="sm" color="black" variant="tertiary" aria-expanded={open} onClick={() => { setDraft(active); setOpen(!open); }}>{zh ? "筛选条件" : "Filters"}</Button>
    </div>
    {open && <FilterPanel color={color} title={zh ? "筛选" : "Filters"} resetLabel={zh ? "重置" : "Reset"} applyLabel={zh ? "应用" : "Apply"} cancelLabel={zh ? "取消" : "Cancel"} onReset={() => setDraft([])} onCancel={() => setOpen(false)} onApply={() => { setActive(draft); setOpen(false); }}>{filters.map(filter => <CheckboxWithLabel key={filter.key} label={filter.label} checked={draft.includes(filter.key)} color={color} onChange={checked => setDraft(current => checked ? [...current, filter.key] : current.filter(item => item !== filter.key))} />)}</FilterPanel>}
    <p role="status" className="text-sm text-fg-grey-700">{result.length} {zh ? "条结果" : "results"}</p>
    {result.length ? <ListGroup title={zh ? "搜索结果" : "Search results"} color={color} className="w-full" items={<div className="flex flex-col gap-4 p-4"><AnimatePresence initial={false}>{result.map(item => <m.div layout key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced || motion === "none" ? 0 : .2 }}><ListItem title={zh ? item.zh : item.en} subtitle={isProducts ? (zh ? "匹配当前条件" : "Matches current filters") : item.pdf ? "PDF" : "Markdown"} lead={{ kind: "icon", icon: <DocumentTextLinear size={18} />, color }} /></m.div>)}</AnimatePresence></div>} /> : <SurfaceCard title={zh ? "没有找到匹配结果" : "No matching results"}>
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-fg-grey-700">{zh ? "调整搜索词或移除部分条件，找回相关内容。" : "Try a corrected query or remove a filter to recover results."}</p>
        {corrected !== query && <Button motion={motion} size="sm" color={color} variant="secondary" onClick={() => { setQuery(corrected); input.current?.focus(); }}>{zh ? `改为搜索“${corrected}”` : `Search for “${corrected}”`}</Button>}
        {active.map(key => {
          const count = search(query, active.filter(item => item !== key)).length;
          return count ? <Button motion={motion} key={key} size="sm" color={color} variant="tertiary" onClick={() => remove(key)}>{zh ? `移除“${filters.find(filter => filter.key === key)?.label}”，恢复 ${count} 条` : `Remove ${filters.find(filter => filter.key === key)?.label}: ${count} results`}</Button> : null;
        })}
        <Button motion={motion} size="sm" color="black" variant="tertiary" onClick={reset}>{zh ? "清空搜索和筛选" : "Clear search and filters"}</Button>
      </div>
    </SurfaceCard>}
  </div>;
}

export function GeneratedReviewExample({ locale, color, motion }: FusionSettings) {
  const zh = locale === "zh";
  const [decisions, setDecisions] = useState<Array<"pending" | "accept" | "keep">>(["pending", "pending"]);
  const reduced = useReducedMotion();
  const changes = zh ? [
    { name: "交互说明.md", before: "点击发送后清空所有内容。", after: "发送成功后清空草稿，失败时保留。" },
    { name: "组件规范.md", before: "智能体使用通用图标。", after: "智能体显示头像与名字。" },
  ] : [
    { name: "interaction.md", before: "Clear all content when Send is clicked.", after: "Clear the draft after sending succeeds; keep it on failure." },
    { name: "components.md", before: "Use a generic icon for agents.", after: "Display each agent's avatar and name." },
  ];
  function decide(index: number, next: "pending" | "accept" | "keep") { setDecisions(current => current.map((value, i) => i === index ? next : value)); }
  return <div className="flex w-full flex-col gap-4">
    {changes.map((change, index) => <SurfaceCard key={change.name} title={change.name} action={<span className="text-xs text-fg-grey-700">{decisions[index] === "pending" ? (zh ? "待审核" : "Pending") : decisions[index] === "accept" ? (zh ? "已接受" : "Accepted") : (zh ? "保留原文" : "Original retained")}</span>}>
      <div className="flex flex-col gap-3"><AnimatePresence initial={false}>
        {decisions[index] !== "accept" && <m.div key="before" initial={false} exit={{ opacity: 0, height: 0, x: reduced || motion === "none" ? 0 : -12 }} transition={{ duration: reduced || motion === "none" ? 0 : .2 }} className="overflow-hidden rounded-lg bg-fg-red-50 p-3 text-sm leading-6 text-fg-red"><span aria-hidden>− </span>{change.before}</m.div>}
        {decisions[index] !== "keep" && <m.div key="after" initial={false} exit={{ opacity: 0, height: 0, x: reduced || motion === "none" ? 0 : 12 }} transition={{ duration: reduced || motion === "none" ? 0 : .2 }} className="overflow-hidden rounded-lg bg-fg-green-50 p-3 text-sm leading-6 text-fg-green-700"><span aria-hidden>+ </span>{change.after}</m.div>}
      </AnimatePresence>
      <div className="flex flex-wrap gap-2">{decisions[index] === "pending" ? <><Button motion={motion} size="sm" color={color} onClick={() => decide(index, "accept")}>{zh ? "接受变更" : "Accept"}</Button><Button motion={motion} size="sm" variant="tertiary" color="black" onClick={() => decide(index, "keep")}>{zh ? "保留原文" : "Keep original"}</Button></> : <Button motion={motion} size="sm" color={color} variant="tertiary" onClick={() => decide(index, "pending")}>{zh ? "撤销决定" : "Undo decision"}</Button>}</div></div>
    </SurfaceCard>)}
    <p role="status" className="text-xs text-fg-grey-700">{decisions.filter(item => item !== "pending").length} / {changes.length} {zh ? "项已审核" : "reviewed"}</p>
  </div>;
}
