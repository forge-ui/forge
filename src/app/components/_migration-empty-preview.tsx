"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion as animated, useReducedMotion } from "motion/react";
import { Button, ListGroup, ListItem, ToolbarSearchInput } from "@forge-ui-official/core";
import { DangerTriangleLinear, FileTextLinear, MagniferLinear, RestartCircleLinear, TrashBinMinimalisticLinear } from "@forge-ui-official/core/icons";
import styles from "./_migration-empty-preview.module.css";

type PreviewProps = { locale: "zh" | "en"; color: "blue" | "purple" | "black"; motion: "auto" | "none" };
type Scenario = "folder" | "search" | "error";
const accentClass = { blue: "text-fg-blue", purple: "text-fg-violet", black: "text-fg-black" };

/** These are compositions of existing list controls, not another public component. */
export function EmptyExamplesPreview(props: PreviewProps) {
  const [scenario, setScenario] = useState<Scenario>("folder");
  const zh = props.locale === "zh";
  return <div className="flex w-full flex-col gap-5">
    <div role="group" aria-label={zh ? "空态场景" : "Empty state examples"} className="flex flex-wrap gap-2">
      {(["folder", "search", "error"] as const).map((item, i) => <Button key={item} size="sm" color={props.color} variant={scenario === item ? "secondary" : "tertiary"} aria-pressed={scenario === item} motion={props.motion} onClick={() => setScenario(item)}>
        {(zh ? ["空文件夹", "搜索无结果", "加载失败"] : ["Empty folder", "No search results", "Loading error"])[i]}
      </Button>)}
    </div>
    {scenario === "folder" ? <FolderExample {...props} /> : scenario === "search" ? <SearchExample {...props} /> : <ErrorExample {...props} />}
  </div>;
}

/** A pending demo operation is completed immediately if motion is turned off. */
function useDemoOperation(reduced: boolean) {
  const operation = useRef<{ timers: ReturnType<typeof setTimeout>[]; animation?: Animation; finish: () => void } | null>(null);
  function cancel() {
    const current = operation.current;
    operation.current = null;
    current?.timers.forEach(clearTimeout);
    current?.animation?.cancel();
  }
  function schedule(finish: () => void, duration: number, animation?: Animation, intermediate?: () => void) {
    cancel();
    if (reduced) { finish(); return; }
    const complete = () => { cancel(); finish(); };
    operation.current = {
      timers: [setTimeout(complete, duration), ...(intermediate ? [setTimeout(intermediate, 700)] : [])],
      animation,
      finish: complete,
    };
  }
  useEffect(() => { if (reduced) operation.current?.finish(); }, [reduced]);
  useEffect(() => () => {
    operation.current?.timers.forEach(clearTimeout);
    operation.current?.animation?.cancel();
    operation.current = null;
  }, []);
  return { schedule };
}

function FolderExample({ locale, color, motion }: PreviewProps) {
  const prefersReduced = useReducedMotion();
  const reduced = motion === "none" || !!prefersReduced;
  const { schedule } = useDemoOperation(reduced);
  const root = useRef<HTMLDivElement>(null);
  const folder = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLSpanElement>(null);
  const serial = useRef(0);
  const pendingFocus = useRef<string | null>(null);
  const creating = useRef(false);
  const [items, setItems] = useState<{ id: number; template: number }[]>([]);
  const [phase, setPhase] = useState<"idle" | "flight" | "gulp">("idle");
  const [lastAction, setLastAction] = useState<"created" | "deleted" | null>(null);
  const zh = locale === "zh";
  const titles = zh ? ["空白文档", "设计笔记", "产品路线图"] : ["Untitled document", "Design notes", "Product roadmap"];
  const busy = phase !== "idle";

  useEffect(() => {
    if (!pendingFocus.current) return;
    root.current?.querySelector<HTMLElement>(pendingFocus.current)?.focus({ preventScroll: true });
    pendingFocus.current = null;
  }, [items]);

  function create(template: number, source: HTMLButtonElement) {
    if (creating.current || items.length >= 5) return;
    creating.current = true;
    const restoreFocus = source === document.activeElement;
    const insert = () => {
      const item = { id: ++serial.current, template };
      if (restoreFocus) pendingFocus.current = `[data-project-id="${item.id}"]`;
      setItems(previous => [item, ...previous]);
      setLastAction("created");
      setPhase("idle");
      creating.current = false;
    };
    if (items.length > 0 || reduced || !root.current || !folder.current || !paper.current || !paper.current.animate) { insert(); return; }

    // Measure the actual clicked control and folder in the same local coordinate space.
    const bounds = root.current.getBoundingClientRect();
    const scaleX = root.current.offsetWidth / bounds.width;
    const scaleY = root.current.offsetHeight / bounds.height;
    const from = source.getBoundingClientRect();
    const to = folder.current.getBoundingClientRect();
    const x = (from.left + from.width / 2 - bounds.left) * scaleX;
    const y = (from.top + from.height / 2 - bounds.top) * scaleY;
    const dx = (to.left + to.width / 2 - bounds.left) * scaleX - x;
    const dy = (to.top + to.height * .3 - bounds.top) * scaleY - y;
    paper.current.style.left = `${x - 13}px`;
    paper.current.style.top = `${y - 16}px`;
    setPhase("flight");
    const animation = paper.current.animate([
      { transform: "translate(0, 0) rotate(-10deg) scale(.5)", opacity: 0 },
      { transform: `translate(${dx * .45}px, ${dy * .45 - 70}px) rotate(12deg) scale(1.1)`, opacity: 1, offset: .45 },
      { transform: `translate(${dx}px, ${dy}px) scale(.8)`, opacity: 1, offset: .82 },
      { transform: `translate(${dx}px, ${dy + 26}px) scale(.6)`, opacity: 0 },
    ], { duration: 760, easing: "cubic-bezier(.45, 0, .25, 1)", fill: "both" });
    schedule(insert, 1180, animation, () => setPhase("gulp"));
  }

  function remove(id: number) {
    const remaining = items.filter(item => item.id !== id);
    pendingFocus.current = remaining.length ? `[data-project-id="${remaining[0].id}"]` : "[data-create-template]";
    setItems(remaining);
    setLastAction("deleted");
  }

  return <div ref={root} className={`${styles.example} ${accentClass[color]} w-full max-w-[520px]`} data-reduced={reduced || undefined}>
    <ListGroup title={zh ? "我的项目" : "My projects"} color={color} className="w-full" badge={<span className="text-xs font-medium text-fg-grey-600">{items.length}</span>}
      action={<Button size="sm" color={color} motion={motion} disabled={busy || items.length >= 5} onClick={event => create(items.length % 3, event.currentTarget)}>{zh ? "新建" : "New"}</Button>}
      items={<div className="relative min-h-[306px]" aria-busy={busy}>
        <AnimatePresence initial={false} mode="popLayout">
          {items.length === 0 ? <animated.div key="empty" initial={{ opacity: 0, y: reduced ? 0 : -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }} className={styles.folderEmpty} data-phase={phase}>
            <div ref={folder} aria-hidden="true" className={styles.folder}>
              <div className={styles.float}><svg viewBox="0 0 168 128" fill="none">
                <path d="M16 26a10 10 0 0 1 10-10h34a8 8 0 0 1 6 2.6l8 8.4h68a10 10 0 0 1 10 10v66a10 10 0 0 1-10 10H26a10 10 0 0 1-10-10z" fill="currentColor" />
                <g className={styles.paperA}><rect x="30" y="26" width="92" height="72" rx="6" fill="var(--fg-white)" /><path d="M42 40h48M42 50h62M42 60h36" stroke="var(--fg-grey-200)" strokeWidth="3" strokeLinecap="round" /></g>
                <g className={styles.paperB}><rect x="50" y="32" width="90" height="68" rx="6" fill="var(--fg-white)" /><path d="M62 46h52M62 56h64M62 66h30" stroke="var(--fg-grey-100)" strokeWidth="3" strokeLinecap="round" /></g>
                <g className={styles.front}><path d="M10 50a10 10 0 0 1 10-10h128a10 10 0 0 1 10 10.8l-5 52a10 10 0 0 1-10 9.2H25a10 10 0 0 1-10-9.2z" fill="currentColor" /><path d="M22 47h124" stroke="var(--fg-white)" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" /><rect x="66" y="72" width="36" height="8" rx="4" fill="var(--fg-white)" fillOpacity=".38" /></g>
              </svg></div><span className={styles.shadow} />
            </div>
            <div className="flex flex-col gap-2"><h3 className="text-base font-semibold leading-6 tracking-fg text-fg-black">{zh ? "还没有项目" : "No projects yet"}</h3><p className="text-sm font-medium leading-5 tracking-fg text-fg-grey-600">{zh ? "选择一个模板，开始第一个项目。" : "Choose a template to start your first project."}</p></div>
            <div role="group" aria-label={zh ? "选择项目模板" : "Choose a project template"} className="flex flex-wrap justify-center gap-2">
              {titles.map((title, template) => <Button key={template} data-create-template size="sm" color={color} variant="secondary" motion={motion} disabled={busy} iconLeft={<FileTextLinear size={16} color="currentColor" />} onClick={event => create(template, event.currentTarget)}>{title}</Button>)}
            </div>
          </animated.div> : <animated.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .2, delay: reduced ? 0 : .12 }} role="list" aria-label={zh ? "项目列表" : "Project list"} className="flex flex-col gap-4 py-2">
            <AnimatePresence initial={false}>{items.map(item => <animated.div key={item.id} role="listitem" tabIndex={-1} data-project-id={item.id} layout={!reduced} initial={{ opacity: 0, y: reduced ? 0 : -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, overflow: "hidden" }} transition={{ duration: reduced ? 0 : .3 }} className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4">
              <ListItem lead={{ kind: "icon", icon: <FileTextLinear size={20} color="currentColor" />, color, variant: "light", size: "lg" }} title={titles[item.template]} subtitle={zh ? "刚刚创建" : "Just created"}
                trailing={<Button size="sm" variant="tertiary" color="black" motion={motion} aria-label={`${zh ? "删除" : "Delete"} ${titles[item.template]}`} iconLeft={<TrashBinMinimalisticLinear size={16} color="currentColor" />} onClick={() => remove(item.id)}>{zh ? "删除" : "Delete"}</Button>} />
            </animated.div>)}</AnimatePresence>
          </animated.div>}
        </AnimatePresence>
        {items.length >= 5 && <p className="mt-3 text-xs font-medium text-fg-grey-600">{zh ? "演示最多创建 5 个项目，可删除后继续体验。" : "This demo holds 5 projects. Delete one to create another."}</p>}
      </div>} />
    <span ref={paper} aria-hidden="true" className={styles.flyingPaper} />
    <span role="status" className="sr-only">{busy ? (zh ? "正在创建项目" : "Creating project") : lastAction === "created" ? (zh ? `项目已创建，共 ${items.length} 项` : `Project created. ${items.length} projects`) : lastAction === "deleted" ? (zh ? `项目已删除，剩余 ${items.length} 项` : `Project deleted. ${items.length} projects remain`) : ""}</span>
  </div>;
}

const records = [
  { zh: "产品需求文档", en: "Product requirements", typeZh: "产品", typeEn: "Product" },
  { zh: "设计规范", en: "Design guidelines", typeZh: "设计", typeEn: "Design" },
  { zh: "发布计划", en: "Release plan", typeZh: "项目", typeEn: "Project" },
];

function SearchExample({ locale, color, motion }: PreviewProps) {
  const [query, setQuery] = useState("2027");
  const root = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const reduced = motion === "none" || !!prefersReduced;
  const zh = locale === "zh";
  const matches = records.filter(item => `${item.zh} ${item.en}`.toLowerCase().includes(query.trim().toLowerCase()));
  const clear = () => { setQuery(""); root.current?.querySelector<HTMLInputElement>("input[type=search]")?.focus(); };
  return <div ref={root} className="w-full max-w-[520px]">
    <ListGroup title={zh ? "工作区文档" : "Workspace documents"} color={color} className="w-full" items={<>
      <div className="flex flex-wrap items-center gap-2"><ToolbarSearchInput value={query} onChange={setQuery} placeholder={zh ? "搜索文档" : "Search documents"} ariaLabel={zh ? "搜索文档" : "Search documents"} className="flex-1" />{query && <Button size="sm" variant="tertiary" color={color} motion={motion} onClick={clear}>{zh ? "清除搜索" : "Clear search"}</Button>}</div>
      <p role="status" className="text-xs font-medium text-fg-grey-600">{zh ? `${matches.length} 个结果` : `${matches.length} results`}</p>
      {matches.length === 0 ? <div className="flex min-h-[230px] flex-col items-center justify-center gap-4 py-6 text-center">
        <animated.div aria-hidden="true" animate={{ x: reduced ? 0 : [-5, 5, -5] }} transition={{ duration: 4, ease: "easeInOut", repeat: reduced ? 0 : Infinity }} className={accentClass[color]}><MagniferLinear size={48} color="currentColor" /></animated.div>
        <div className="flex max-w-[320px] flex-col gap-2"><h3 className="text-base font-semibold leading-6 tracking-fg text-fg-black">{zh ? "没有找到相关文档" : "No matching documents"}</h3><p className="break-words text-sm font-medium leading-5 tracking-fg text-fg-grey-600">{zh ? `没有与「${query}」匹配的文档，可以换个关键词或清除搜索。` : `No documents match “${query}”. Try another keyword or clear your search.`}</p></div>
        <Button size="sm" color={color} motion={motion} onClick={clear}>{zh ? "查看全部文档" : "Show all documents"}</Button>
      </div> : <div role="list" aria-label={zh ? "搜索结果" : "Search results"} className="flex min-h-[230px] flex-col gap-4 py-2">{matches.map(item => <animated.div key={item.en} role="listitem" initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .25 }}><ListItem title={zh ? item.zh : item.en} subtitle={zh ? item.typeZh : item.typeEn} lead={{ kind: "icon", icon: <FileTextLinear size={20} color="currentColor" />, color, variant: "light", size: "lg" }} /></animated.div>)}</div>}
    </>} />
  </div>;
}

function ErrorExample({ locale, color, motion }: PreviewProps) {
  const [status, setStatus] = useState<"error" | "loading" | "ready">("error");
  const [failAgain, setFailAgain] = useState(false);
  const [retried, setRetried] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const focusAfterRetry = useRef(false);
  const inFlight = useRef(false);
  const prefersReduced = useReducedMotion();
  const reduced = motion === "none" || !!prefersReduced;
  const { schedule } = useDemoOperation(reduced);
  const zh = locale === "zh";
  useEffect(() => {
    if (status !== "loading" && focusAfterRetry.current) {
      root.current?.querySelector<HTMLElement>(status === "ready" ? "[data-retry-result]" : "[data-retry-button]")?.focus({ preventScroll: true });
      focusAfterRetry.current = false;
    }
  }, [status, retried]);
  function retry(source: HTMLButtonElement) {
    if (inFlight.current) return;
    inFlight.current = true;
    focusAfterRetry.current = source === document.activeElement;
    setStatus("loading");
    schedule(() => { setStatus(failAgain ? "error" : "ready"); setRetried(true); inFlight.current = false; }, 900);
  }
  return <div ref={root} className="flex w-full max-w-[520px] flex-col gap-4">
    <ListGroup title={zh ? "共享文件" : "Shared files"} color={color} className="w-full" action={status === "ready" ? <Button size="sm" color="black" variant="tertiary" motion={motion} onClick={() => { focusAfterRetry.current = true; setStatus("error"); setRetried(false); }}>{zh ? "再次模拟失败" : "Simulate error again"}</Button> : undefined} items={<div aria-busy={status === "loading"} className="min-h-[266px]">
      {status === "ready" ? <div data-retry-result tabIndex={-1} className="flex flex-col gap-4 rounded-xl py-2 focus-visible:outline-2 focus-visible:outline-offset-4"><p className="text-sm font-medium text-fg-grey-600">{zh ? "连接已恢复，文件加载完成。" : "Connection restored. Files are ready."}</p>{records.map(item => <ListItem key={item.en} title={zh ? item.zh : item.en} subtitle={zh ? "刚刚同步" : "Just synced"} lead={{ kind: "icon", icon: <FileTextLinear size={20} color="currentColor" />, color, variant: "light", size: "lg" }} />)}</div> : <div className="flex min-h-[266px] flex-col items-center justify-center gap-4 py-6 text-center">
        <span aria-hidden="true" className={status === "loading" ? accentClass[color] : "text-fg-grey-700"}>{status === "loading" ? <animated.span className="inline-flex" animate={{ rotate: reduced ? 0 : 360 }} transition={{ duration: 1, ease: "linear", repeat: reduced ? 0 : Infinity }}><RestartCircleLinear size={40} color="currentColor" /></animated.span> : <DangerTriangleLinear size={40} color="currentColor" />}</span>
        <div className="flex max-w-[320px] flex-col gap-2"><h3 className="text-base font-semibold leading-6 tracking-fg text-fg-black">{status === "loading" ? (zh ? "正在重新连接" : "Reconnecting") : (zh ? "暂时无法加载文件" : "Files could not be loaded")}</h3><p className="text-sm font-medium leading-5 tracking-fg text-fg-grey-600">{status === "loading" ? (zh ? "正在获取共享文件，请稍候。" : "Fetching shared files. Please wait.") : retried ? (zh ? "本次重试仍未成功，请关闭下方失败模拟后再试。" : "Retry failed. Turn off the failure simulation below and try again.") : (zh ? "连接中断了，已有文件不会丢失。" : "The connection was interrupted. Your files are safe.")}</p></div>
        <Button data-retry-button size="sm" color={color} motion={motion} disabled={status === "loading"} onClick={event => retry(event.currentTarget)}>{status === "loading" ? (zh ? "正在重试…" : "Retrying…") : (zh ? "重新加载" : "Try again")}</Button>
      </div>}
    </div>} />
    <div className="flex flex-wrap items-center gap-3"><Button size="sm" variant="tertiary" color="black" motion={motion} aria-pressed={failAgain} disabled={status === "loading"} onClick={() => setFailAgain(value => !value)}>{zh ? `模拟重试失败：${failAgain ? "开" : "关"}` : `Retry failure simulation: ${failAgain ? "on" : "off"}`}</Button><span className="text-xs font-medium text-fg-grey-600">{zh ? "此开关仅用于体验失败后的再次重试。" : "Use this switch to try another retry after failure."}</span></div>
    <span role="status" className="sr-only">{status === "loading" ? (zh ? "正在重新加载" : "Reloading") : status === "ready" ? (zh ? "加载成功，共 3 个文件" : "Loaded 3 files") : retried ? (zh ? "重试失败，请再次尝试" : "Retry failed. Please try again") : ""}</span>
  </div>;
}
