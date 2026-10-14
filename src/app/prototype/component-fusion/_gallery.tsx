"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Button, SelectOption, StyledLink, TextField } from "@forge-ui-official/core";
import { CheckCircleLinear, DownloadLinear, MagniferLinear, RestartCircleLinear } from "@forge-ui-official/core/icons";
import { FusionExample } from "../../components/_fusion/example";
import { officialHref } from "../../components/_fusion/registry";
import { LabPreview } from "./_lab-preview";
import { reviewStore } from "./_review-store";
import catalog from "./_catalog-data.json";

type Item = (typeof catalog.items)[number];
type Settings = { locale: "zh" | "en"; color: "blue" | "purple" | "black"; motion: "auto" | "none" };
type Decision = "pending" | "accepted" | "changes";
type Review = Record<string, { decision?: Decision; note?: string }>;
type Filter = "all" | Decision | "deferred";
function parseReview(raw: string): Review {
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    return Object.fromEntries(catalog.items.flatMap(item => {
      const value = (data as Review)[item.id];
      if (!value || typeof value !== "object") return [];
      return [[item.id, {
        decision: ["pending", "accepted", "changes"].includes(value.decision ?? "") ? value.decision : undefined,
        note: typeof value.note === "string" ? value.note.slice(0, 2000) : undefined,
      }]];
    }));
  } catch { return {}; }
}
function decisionFor(item: Item, review: Review): Decision {
  return review[item.id]?.decision ?? (item.accepted ? "accepted" : "pending");
}

/** Keep core form state after its first on-screen render. */
function DeferredCore({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "500px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="min-h-72 w-full min-w-0">{visible ? children : <div className="min-h-72 rounded-xl bg-fg-grey-50" aria-hidden />}</div>;
}

function PreviewCard({ item, settings, review, onReview }: {
  item: Item; settings: Settings; review: Review[string]; onReview: (value: Review[string]) => void;
}) {
  const [wide, setWide] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const zh = settings.locale === "zh";
  const decision = review.decision ?? "pending";
  const isCore = item.mode !== "defer";
  const labels = zh ? { pending: "待看", accepted: "通过", changes: "需调整" } : { pending: "To review", accepted: "Approved", changes: "Needs changes" };
  return <article id={`item-${item.id}`} data-fusion-item={item.id} aria-labelledby={`title-${item.id}`}
    className={`flex min-w-0 scroll-mt-56 flex-col overflow-hidden rounded-2xl border border-fg-grey-200 bg-fg-white ${wide || item.kind === "sidebar" ? "xl:col-span-2" : ""}`}>
    <header className="flex flex-col gap-3 border-b border-fg-grey-100 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs leading-4 text-fg-grey-500">
        <span>{item.id} · {isCore ? (item.mode === "compose" ? (zh ? "正式组合案例" : "Composed example") : (zh ? "组件能力" : "Component enhancement")) : (zh ? "暂缓原型" : "Deferred prototype")}</span>
        <span className={`inline-flex items-center gap-1.5 ${decision === "accepted" ? "text-fg-green" : decision === "changes" ? "text-fg-red" : ""}`}>
          {decision === "accepted" && <CheckCircleLinear size={15} />}{labels[decision]}
        </span>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 id={`title-${item.id}`} className="text-lg font-semibold leading-7 tracking-fg">{zh ? item.name : item.english}</h3>
          <p className="mt-1 text-sm leading-6 text-fg-grey-700">{zh ? item.description : item.descriptionEn}</p>
        </div>
        {item.kind !== "sidebar" && <Button size="sm" variant="tertiary" color="black" aria-expanded={wide}
          aria-label={`${zh ? (wide ? "收起" : "放大") : (wide ? "Collapse" : "Expand")} ${zh ? item.name : item.english}`}
          onClick={() => setWide(!wide)}>{zh ? (wide ? "收起" : "放大") : (wide ? "Collapse" : "Expand")}</Button>}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs leading-5 text-fg-grey-500">
        <span>{zh ? "融入" : "Target"}</span><StyledLink href={isCore ? officialHref(item) : item.href} color="gray">{item.target.join(" · ") || (zh ? "待确定" : "To be determined")}</StyledLink>
        {item.caseTag && <span>{zh ? item.caseTag : "Composed example"}</span>}
      </div>
    </header>
    <div key={epoch} className={`flex min-w-0 flex-1 items-center ${isCore ? "p-5" : ""}`}>
      {isCore ? <DeferredCore><FusionExample id={item.id} {...settings} /></DeferredCore> : <LabPreview id={item.id} {...settings} />}
    </div>
    <footer className="flex flex-col gap-3 border-t border-fg-grey-100 p-5">
      <div className="flex flex-wrap items-center gap-2">
        {(["accepted", "changes", "pending"] as const).map(value => <Button key={value} size="sm" color={value === "accepted" ? settings.color : "black"}
          variant={decision === value ? "secondary" : "tertiary"} aria-pressed={decision === value}
          onClick={() => onReview({ ...review, decision: value })}>{labels[value]}</Button>)}
        <Button size="sm" variant="tertiary" color="black" iconLeft={<RestartCircleLinear size={16} />} onClick={() => setEpoch(value => value + 1)}>{zh ? "重置演示" : "Reset demo"}</Button>
      </div>
      <details>
        <summary className="w-fit cursor-pointer text-xs leading-5 text-fg-grey-500">{zh ? "备注" : "Note"}{review.note ? (zh ? " · 已填写" : " · Added") : ""}</summary>
        <label className="mt-2 block text-xs text-fg-grey-500">
          <span className="sr-only">{zh ? `${item.name}的修改意见` : `Feedback for ${item.english}`}</span>
          <textarea value={review.note ?? ""} maxLength={2000} rows={2} placeholder={zh ? "记录需要调整的地方…" : "Describe what should change…"}
            onChange={event => onReview({ ...review, note: event.target.value })}
            className="w-full resize-y rounded-lg border border-fg-grey-200 bg-fg-white p-3 text-sm leading-5 text-fg-black placeholder:text-fg-grey-500" />
        </label>
      </details>
    </footer>
  </article>;
}

export function FusionGallery() {
  const [locale, setLocale] = useState<Settings["locale"]>("zh");
  const [color, setColor] = useState<Settings["color"]>("blue");
  const [motion, setMotion] = useState<Settings["motion"]>("auto");
  const [family, setFamily] = useState("all");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const reviewState = useSyncExternalStore(reviewStore.subscribe, reviewStore.getSnapshot, reviewStore.getServerSnapshot);
  const reviews = useMemo(() => parseReview(reviewState.raw), [reviewState.raw]);
  const zh = locale === "zh";
  const settings = { locale, color, motion };
  const planned = catalog.items.filter(item => item.mode !== "defer");
  const counts = { all: planned.length, pending: 0, accepted: 0, changes: 0, deferred: catalog.items.length - planned.length };
  for (const item of planned) counts[decisionFor(item, reviews)]++;
  const needle = query.trim().toLocaleLowerCase();
  const filtered = catalog.items.filter(item => {
    if ((item.mode === "defer") !== (filter === "deferred")) return false;
    if (filter !== "all" && filter !== "deferred" && decisionFor(item, reviews) !== filter) return false;
    if (family !== "all" && item.family !== family) return false;
    return !needle || [item.id, item.name, item.english, item.description, ...item.target].some(value => value.toLocaleLowerCase().includes(needle));
  });
  const groups = [...catalog.families, { id: "deferred", name: "暂缓评估", english: "Deferred review", description: "这些项目暂未纳入融合计划，可在这里补充意见。", descriptionEn: "These items are outside the current integration plan and remain available for review." }]
    .map(group => ({ ...group, items: filtered.filter(item => item.family === group.id) })).filter(group => group.items.length > 0);

  useEffect(() => {
    const aliases: Record<string, string> = { hold: "003", toggle: "013", select: "031", tabs: "039", pagination: "043", accordion: "044", command: "046", empty: "088", numbers: "098", selection: "F03" };
    let scrollFrame = 0;
    const followHash = () => {
      const id = aliases[window.location.hash.slice(1)] ?? window.location.hash.replace(/^#item-/, "");
      const item = catalog.items.find(item => item.id === id);
      if (!item) return;
      setQuery(id);
      setFamily("all");
      setFilter(item.mode === "defer" ? "deferred" : "all");
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => document.getElementById(`item-${id}`)?.scrollIntoView({ block: "start" }));
    };
    const initialFrame = requestAnimationFrame(followHash);
    window.addEventListener("hashchange", followHash);
    return () => { cancelAnimationFrame(initialFrame); cancelAnimationFrame(scrollFrame); window.removeEventListener("hashchange", followHash); };
  }, []);

  const updateReview = (id: string, value: Review[string]) => reviewStore.write(JSON.stringify({ ...parseReview(reviewStore.getSnapshot().raw), [id]: value }));
  const exportReview = () => {
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), items: catalog.items.map(item => ({ id: item.id, name: item.name, mode: item.mode, preview: item.mode !== "defer" ? "integrated" : "prototype", decision: decisionFor(item, reviews), note: reviews[item.id]?.note ?? "" })) }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "forge-component-review.json"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const filterLabels = zh ? { all: "全部", pending: "待看", accepted: "已通过", changes: "需调整", deferred: "暂缓评估" } : { all: "All", pending: "To review", accepted: "Approved", changes: "Needs changes", deferred: "Deferred" };

  return <main className="min-h-screen bg-fg-grey-50 px-4 py-8 text-fg-black sm:px-8">
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <header className="flex flex-col gap-5">
        <StyledLink href="/components" color="blue">{zh ? "Forge 组件库" : "Forge components"}</StyledLink>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex max-w-3xl flex-col gap-3">
            <h1 className="text-3xl font-semibold leading-10 tracking-fg">{zh ? "组件交互总览" : "Component interaction gallery"}</h1>
            <p className="text-sm leading-6 text-fg-grey-700">{zh ? "99 项交互已接入实际组件与组合案例。按分类体验，也可以标记通过或留下修改意见。" : "Explore 99 component enhancements and composed examples. Browse by category and record your feedback."}</p>
            <p className="text-xs leading-5 text-fg-grey-500">{zh ? "评审标记保存在当前浏览器，也可导出备份。暂缓项目保留独立原型供查阅。" : "Review decisions are saved in this browser when available and can be exported. Deferred items remain separate prototypes."}</p>
          </div>
          <Button size="sm" variant="tertiary" color="black" iconLeft={<DownloadLinear size={16} />} onClick={exportReview}>{zh ? "导出评审" : "Export review"}</Button>
        </div>
      </header>
      <div className="sticky top-0 z-20 flex flex-col gap-4 rounded-2xl border border-fg-grey-200 bg-fg-white p-4 shadow-sm">
        {reviewState.persistenceFailed && <div className="flex flex-wrap items-center gap-3 border-b border-fg-grey-100 pb-3">
          <p role="alert" className="min-w-0 flex-1 text-sm leading-5 text-fg-red">{zh ? "本次修改仅保存在当前页面，刷新后会丢失。请导出备份。" : "These changes are only saved on this page and will be lost on reload. Please export a backup."}</p>
          <Button size="sm" variant="tertiary" color="black" onClick={exportReview}>{zh ? "导出评审" : "Export review"}</Button>
          <Button size="sm" variant="tertiary" color="black" onClick={reviewStore.retry}>{zh ? "重试保存" : "Retry saving"}</Button>
        </div>}
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-52 flex-1"><TextField color={color} aria-label={zh ? "搜索交互" : "Search interactions"} placeholder={zh ? "搜索名称、编号或组件…" : "Search by name, ID or component…"} value={query} onChange={setQuery} iconLeft={<MagniferLinear size={18} />} /></div>
          <SelectOption width="220px" color={color} placeholder={zh ? "组件分类" : "Component category"} value={family}
            options={[{ value: "all", label: zh ? "全部分类" : "All categories" }, ...(filter === "deferred" ? [] : catalog.families.map(group => ({ value: group.id, label: zh ? group.name : group.english })))]}
            onChange={value => setFamily(String(value))} />
          <Button size="sm" variant="secondary" color="black" onClick={() => setLocale(zh ? "en" : "zh")}>{zh ? "English" : "中文"}</Button>
          <div className="flex items-center gap-2" role="group" aria-label={zh ? "主题色" : "Theme color"}>
            {(["blue", "purple", "black"] as const).map((value, index) => <Button key={value} size="sm" color={value} variant={value === color ? "primary" : "tertiary"} aria-pressed={value === color} onClick={() => setColor(value)}>{(zh ? ["蓝", "紫", "黑"] : ["Blue", "Purple", "Black"])[index]}</Button>)}
          </div>
          <Button size="sm" variant="tertiary" color="black" aria-pressed={motion === "none"} onClick={() => setMotion(motion === "auto" ? "none" : "auto")}>{zh ? `动效：${motion === "auto" ? "跟随系统" : "关闭"}` : `Motion: ${motion === "auto" ? "system" : "off"}`}</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={zh ? "评审状态" : "Review status"}>
          {(["all", "pending", "accepted", "changes", "deferred"] as const).map(value => <Button key={value} size="sm" color={value === filter ? color : "black"} variant={filter === value ? "secondary" : "tertiary"} aria-pressed={filter === value} onClick={() => { setFilter(value); if (value === "deferred" || filter === "deferred") setFamily("all"); }}>{filterLabels[value]} {counts[value]}</Button>)}
          <p role="status" className="ml-auto text-xs leading-5 text-fg-grey-500">{zh ? `当前显示 ${filtered.length} 项` : `${filtered.length} items shown`}</p>
          {(query || family !== "all") && <Button size="sm" color="black" variant="tertiary" onClick={() => { setQuery(""); setFamily("all"); }}>{zh ? "清除筛选" : "Clear filters"}</Button>}
        </div>
      </div>
      <nav className="flex flex-wrap gap-x-5 gap-y-3" aria-label={zh ? "分类索引" : "Category index"}>
        {groups.map(group => <a key={group.id} href={`#family-${group.id}`} className="text-sm font-medium leading-5 text-fg-grey-700 hover:text-fg-blue">{zh ? group.name : group.english} <span className="text-fg-grey-500">{group.items.length}</span></a>)}
      </nav>
      {groups.map(group => <section key={group.id} id={`family-${group.id}`} aria-labelledby={`family-title-${group.id}`} className="flex scroll-mt-56 flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><h2 id={`family-title-${group.id}`} className="text-xl font-semibold leading-7 tracking-fg">{zh ? group.name : group.english}</h2><p className="mt-1 text-sm leading-6 text-fg-grey-500">{zh ? group.description : group.descriptionEn}</p></div>
          <span className="text-sm text-fg-grey-500">{group.items.length} {zh ? "项" : "items"}</span>
        </div>
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
          {group.items.map(item => <PreviewCard key={item.id} item={item} settings={settings} review={{ ...reviews[item.id], decision: decisionFor(item, reviews) }} onReview={value => updateReview(item.id, value)} />)}
        </div>
      </section>)}
      {!filtered.length && <div className="flex flex-col items-center gap-4 rounded-2xl border border-fg-grey-200 bg-fg-white p-12 text-center"><MagniferLinear size={28} /><h2 className="text-lg font-semibold">{zh ? "没有匹配的交互" : "No matching interactions"}</h2><Button size="sm" color={color} onClick={() => { setQuery(""); setFamily("all"); setFilter("all"); }}>{zh ? "查看全部" : "View all"}</Button></div>}
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-fg-grey-200 pt-5 text-xs leading-5 text-fg-grey-500"><span>{zh ? "Forge · 本地交互评审" : "Forge · Local interaction review"}</span><a href="#" className="text-fg-blue">{zh ? "回到顶部" : "Back to top"}</a></footer>
    </div>
  </main>;
}
