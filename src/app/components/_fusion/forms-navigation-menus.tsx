"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { AppSwitcherDropdown, Button, ButtonGroup, CommandSearch, Drawer, DropdownPanel, IconButton, IconTrigger, MenuItem, NotificationItem, SelectOption, SmoothLineChart, Stepper, SurfaceCard, TabBar, TabsContent, TextField } from "@forge-ui-official/core";
import { AddCircleLinear, AltArrowDownLinear, BellLinear, BookmarkLinear, CheckCircleLinear, DocumentTextLinear, FolderOpenLinear, HamburgerMenuLinear, HomeLinear, LinkRoundAngleLinear, MagniferLinear, PenLinear, UserLinear, WidgetLinear } from "@forge-ui-official/core/icons";
import type { FusionExampleProps } from "./types";
import { useActionTimers } from "./actions-shared";
type Props = FusionExampleProps;
const t = (p: Props, zh: string, en: string) => p.locale === "zh" ? zh : en;

export function NavigationExamples(p: Props) {
  switch (p.id) {
    case "010": return <SplitAction {...p} />;
    case "011": return <RadialActions {...p} />;
    case "027": return <ExpandingSearch {...p} />;
    case "037": return <WorkspaceSwitcher {...p} />;
    case "041": return <BottomTabs {...p} />;
    case "042": return <Wizard {...p} />;
    case "045": return <RevealingMenu {...p} />;
    case "047": return <PeriodControl {...p} />;
    case "048": return <SwipeTabs {...p} />;
    case "074": return <Notifications {...p} />;
    default: return null;
  }
}

function menuKeys(event: KeyboardEvent<HTMLElement>) {
  const choices = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"],[role="menuitem"],button[data-menu-item]')];
  const current = choices.indexOf(document.activeElement as HTMLButtonElement);
  const next = event.key === "ArrowDown" || event.key === "ArrowRight" ? (current + 1) % choices.length : event.key === "ArrowUp" || event.key === "ArrowLeft" ? (current - 1 + choices.length) % choices.length : event.key === "Home" ? 0 : event.key === "End" ? choices.length - 1 : -1;
  if (next >= 0) { event.preventDefault(); choices[next]?.focus(); }
}

function SplitAction(p: Props) {
  const [selected, setSelected] = useState(0), [chosen, setChosen] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const { clear, later } = useActionTimers();
  const run = () => { clear(); setChosen(selected); setState("loading"); later(() => setState("success"), 1400); };
  const names = p.locale === "zh" ? ["立即部署", "定时部署", "创建预览"] : ["Deploy now", "Schedule deployment", "Create preview"];
  const hints = p.locale === "zh" ? ["部署到生产环境", "在低峰期安排发布", "生成团队预览链接"] : ["Deploy to production", "Schedule during quiet hours", "Create a team preview link"];
  return <div className="flex flex-col items-center gap-4 py-10"><div className="flex items-center gap-1 rounded-full border border-fg-grey-200 p-1"><Button color={p.color} motion={p.motion} locale={p.locale} loading={state === "loading"} result={state === "success" ? "success" : "idle"} resultLabel={t(p, "执行完成", "Completed")} onClick={run}>{names[selected]}</Button><IconTrigger icon={<AltArrowDownLinear size={18} />} accent={p.color} ariaLabel={t(p, "选择部署方式", "Choose deployment action")} initialFocus="selected" panelAlign="end" motion={p.motion} panel={close => <DropdownPanel width="w-64" motion={p.motion}><div role="menu" aria-label={t(p, "部署方式", "Deployment actions")} onKeyDown={menuKeys} className="w-full">{names.map((name, i) => <button key={name} type="button" role="menuitemradio" aria-checked={i === selected} className="forge-fn-menu-choice flex w-full items-center gap-3 rounded-xl p-3 text-left" onClick={() => { clear(); setState("idle"); setSelected(i); setChosen(null); close(); }}><div className="flex-1"><p className="text-sm font-semibold">{name}</p><p className="mt-1 text-xs text-fg-grey-700">{hints[i]}</p></div>{i === selected && <CheckCircleLinear size={18} color="var(--fusion-accent)" />}</button>)}</div></DropdownPanel>} /></div><p className="text-xs text-fg-grey-700" role="status">{chosen === null ? t(p, "选择动作后执行", "Choose an action, then run it") : `${state === "loading" ? t(p, "正在执行", "Running") : t(p, "已完成", "Completed")}: ${names[chosen]}`}</p></div>;
}

function RadialActions(p: Props) {
  const [open, setOpen] = useState(false), [chosen, setChosen] = useState<number | null>(null), [cursor, setCursor] = useState(0);
  const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLDivElement>(null), list = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const icons = [<FolderOpenLinear key="folder" size={20} />, <DocumentTextLinear key="doc" size={20} />, <LinkRoundAngleLinear key="link" size={20} />, <PenLinear key="note" size={20} />];
  const labels = p.locale === "zh" ? ["添加图片", "新建文档", "添加链接", "写笔记"] : ["Add image", "Create document", "Add link", "Write a note"];
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  const focusTrigger = () => trigger.current?.querySelector("button")?.focus();
  function move(index: number) { const next = (index + labels.length) % labels.length; setCursor(next); list.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus(); }
  return <div ref={root} className="forge-fn-radial" data-open={open} onKeyDown={event => { if (event.key === "Escape" && open) { event.preventDefault(); setOpen(false); focusTrigger(); } }}>
    <div ref={list} id={menuId} role={open ? "menu" : undefined} aria-label={t(p, "快捷操作", "Quick actions")} aria-hidden={!open || undefined} inert={!open || undefined} className="forge-fn-radial-items" onKeyDown={event => { const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0; if (delta || event.key === "Home" || event.key === "End") { event.preventDefault(); move(event.key === "Home" ? 0 : event.key === "End" ? labels.length - 1 : cursor + delta); } }}>
      {labels.map((label, i) => <div key={label} className="forge-fn-radial-item" style={{ "--radial-x": `${[-112, -45, 45, 112][i]}px`, "--radial-y": `${[-32, -106, -106, -32][i]}px`, "--radial-delay": `${i * 35}ms` } as CSSProperties}><IconButton role="menuitem" tabIndex={open && cursor === i ? 0 : -1} color={p.color} variant="secondary" aria-label={label} motion={p.motion} onFocus={() => setCursor(i)} onClick={() => { setChosen(i); setOpen(false); focusTrigger(); }}>{icons[i]}</IconButton><span aria-hidden>{label}</span></div>)}
    </div>
    <div ref={trigger} className="forge-fn-radial-trigger"><IconButton color={p.color} size="lg" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} aria-label={open ? t(p, "关闭快捷操作", "Close quick actions") : t(p, "新建", "Create new")} motion={p.motion} onClick={() => { setOpen(!open); setChosen(null); }} onKeyDown={event => { if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); setOpen(true); requestAnimationFrame(() => move(0)); } }}><span className="forge-fn-radial-plus"><AddCircleLinear size={24} /></span></IconButton></div>
    <p className="forge-fn-radial-note" role="status">{chosen === null ? open ? t(p, "选择一个快捷操作", "Choose a quick action") : t(p, "点击加号展开", "Open with the plus button") : `${t(p, "已选择", "Selected")}: ${labels[chosen]}`}</p>
  </div>;
}

function ExpandingSearch(p: Props) {
  const [open, setOpen] = useState(false), [query, setQuery] = useState(""), [selected, setSelected] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLDivElement>(null);
  const names = p.locale === "zh" ? ["工作台", "动效规范", "深色主题", "项目文件"] : ["Dashboard", "Motion guidelines", "Dark theme", "Project files"];
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside); return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return <div ref={root} className="relative min-h-80" onKeyDown={event => { if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.querySelector("button")?.focus(); } }}><div className="flex items-center justify-between gap-4 rounded-2xl border border-fg-grey-200 p-3"><strong>Forge</strong><div ref={trigger}><IconButton color={p.color} variant="ghost" aria-label={t(p, "展开搜索", "Expand search")} aria-expanded={open} onClick={() => setOpen(!open)}><MagniferLinear size={20} /></IconButton></div></div><div className="forge-fn-search" data-open={open} inert={!open || undefined} aria-hidden={!open || undefined}>{open && <CommandSearch autoFocus query={query} onQueryChange={setQuery} color={p.color} locale={p.locale} motion={p.motion} items={names.map((label, i) => ({ id: String(i), label, icon: <DocumentTextLinear size={18} />, group: t(p, "最近使用", "Recent") }))} onSelect={item => { setSelected(item.id); setOpen(false); trigger.current?.querySelector("button")?.focus(); }} />}</div>{selected !== null && <p className="mt-4 text-sm" role="status">{t(p, "已选择", "Selected")}: {names[Number(selected)]}</p>}</div>;
}

function WorkspaceSwitcher(p: Props) {
  const [active, setActive] = useState("design"), [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null), button = useRef<HTMLDivElement>(null);
  const apps = [{ id: "design", name: t(p, "设计工作区", "Design workspace"), avatar: "/images/protask/crm/team-avatar.png" }, { id: "studio", name: t(p, "产品工作室", "Product studio"), avatar: "/images/protask/crm/john-hoegan-avatar.png" }];
  const current = apps.find(app => app.id === active)!;
  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside); return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return <div ref={root} className="relative min-h-80 flex flex-col items-center gap-3" onKeyDown={event => { if (event.key === "Escape") { setOpen(false); button.current?.querySelector("button")?.focus(); } }}><div ref={button}><Button color={p.color} variant="tertiary" motion={p.motion} aria-expanded={open} aria-haspopup="menu" iconRight={<AltArrowDownLinear size={18} />} onClick={() => setOpen(!open)}>{current.name}</Button></div>{open && <div className="forge-fn-feedback"><AppSwitcherDropdown locale={p.locale} appName={current.name} appIcon={current.avatar} appSubtitle={t(p, "当前工作区", "Current workspace")} apps={apps.map(app => ({ ...app, active: active === app.id }))} onAppChange={app => { setActive(app.id); setOpen(false); button.current?.querySelector("button")?.focus(); }} /></div>}<p className="text-xs text-fg-grey-700" role="status">{t(p, "当前工作区", "Current workspace")}: {current.name}</p></div>;
}

function BottomTabs(p: Props) {
  const [index, setIndex] = useState(0);
  const labels = p.locale === "zh" ? ["首页", "探索", "收藏", "通知", "我的"] : ["Home", "Explore", "Saved", "Alerts", "Me"];
  const icons = [<HomeLinear key="home" size={20} />, <WidgetLinear key="widgets" size={20} />, <BookmarkLinear key="saved" size={20} />, <BellLinear key="bell" size={20} />, <UserLinear key="user" size={20} />];
  const id = useId();
  return <div className="flex min-h-72 flex-col justify-between gap-6"><TabsContent activeKey={index} motion={p.motion} transition="slide" id={`${id}-panel`} labelledBy={`${id}-tab-${index}`}><SurfaceCard title={labels[index]}><div className="flex flex-col gap-3 py-4" aria-hidden>{["80%", "65%", "90%"].map(width => <div key={width} className="h-3 rounded-full bg-fg-grey-200" style={{ width }} />)}</div></SurfaceCard></TabsContent><TabBar appearance="dock" tabs={labels.map((label, i) => ({ label, icon: icons[i], active: i === index, badge: i === 2 ? 3 : undefined, id: `${id}-tab-${i}`, controls: `${id}-panel` }))} color={p.color} onChange={setIndex} motion={p.motion} ariaLabel={t(p, "应用页面", "Application sections")} className="w-full justify-between" /></div>;
}

function Wizard(p: Props) {
  const [step, setStep] = useState(0), [name, setName] = useState(""), [workspace, setWorkspace] = useState(""), [email, setEmail] = useState(""), [role, setRole] = useState("editor");
  const headings = p.locale === "zh" ? ["设置账号", "创建工作区", "邀请成员", "准备完成"] : ["Your account", "Create workspace", "Invite members", "Ready"];
  const input = useRef<HTMLInputElement>(null);
  const focusAfterStep = useRef(false);
  useEffect(() => {
    if (focusAfterStep.current) input.current?.focus({ preventScroll: true });
    focusAfterStep.current = false;
  }, [step]);
  return <SurfaceCard title={headings[step]}><div className="flex flex-col gap-5"><Stepper total={4} current={step + 1} color={p.color} /><form onSubmit={event => { event.preventDefault(); focusAfterStep.current = true; setStep(Math.min(3, step + 1)); }} className="flex flex-col gap-4"><TabsContent activeKey={step} transition="slide" motion={p.motion} ariaLabel={headings[step]}>{step === 0 ? <TextField ref={input} label={t(p, "姓名", "Name")} color={p.color} required value={name} onChange={setName} /> : step === 1 ? <TextField ref={input} label={t(p, "工作区名称", "Workspace name")} required color={p.color} value={workspace} onChange={setWorkspace} /> : step === 2 ? <div className="flex flex-col gap-3"><TextField ref={input} type="email" label={t(p, "成员邮箱", "Member email")} value={email} onChange={setEmail} color={p.color} /><SelectOption options={[{ value: "editor", label: t(p, "编辑者", "Editor") }, { value: "viewer", label: t(p, "查看者", "Viewer") }]} value={role} onChange={value => setRole(String(value))} color={p.color} placeholder={t(p, "选择角色", "Choose a role")} /></div> : <div className="flex items-start gap-3"><CheckCircleLinear size={24} color="var(--fusion-accent)" /><div><p className="font-semibold">{workspace}</p><p className="mt-1 text-xs text-fg-grey-700">{t(p, "配置已准备好，创建和邀请由业务接口提交。", "Configuration is ready for your workspace and invitation services.")}</p></div></div>}</TabsContent><div className="flex items-center justify-between gap-3">{step > 0 && <Button variant="tertiary" color={p.color} type="button" onClick={() => { focusAfterStep.current = true; setStep(step - 1); }}>{t(p, "上一步", "Back")}</Button>}{step < 3 ? <Button type="submit" color={p.color}>{t(p, "下一步", "Next")}</Button> : <Button type="button" color={p.color} onClick={() => { focusAfterStep.current = true; setStep(0); }}>{t(p, "修改信息", "Edit details")}</Button>}</div></form></div></SurfaceCard>;
}

function RevealingMenu(p: Props) {
  const [open, setOpen] = useState(false), [origin, setOrigin] = useState<{ x: number; y: number }>(), [chosen, setChosen] = useState(0);
  const labels = p.locale === "zh" ? ["杂志", "工作空间", "人物", "订阅"] : ["Magazine", "Spaces", "People", "Subscribe"];
  return <SurfaceCard title={t(p, "安静工作的空间", "Spaces for focused work")} action={<Button variant="tertiary" color={p.color} iconLeft={<HamburgerMenuLinear size={18} />} onClick={event => { const rect = event.currentTarget.getBoundingClientRect(); setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }); setOpen(true); }}>{t(p, "菜单", "Menu")}</Button>}><div className="py-12 text-center text-base font-semibold">{labels[chosen]}</div><Drawer open={open} onOpenChange={setOpen} title="Forge" locale={p.locale} motion={p.motion} transition="reveal" revealOrigin={origin}><nav aria-label={t(p, "内容导航", "Content navigation")} className="flex flex-col gap-3">{labels.map((label, i) => <MenuItem key={label} label={label} accent={p.color} motion={p.motion} onClick={() => { setChosen(i); setOpen(false); }} />)}</nav></Drawer></SurfaceCard>;
}

function PeriodControl(p: Props) {
  const [index, setIndex] = useState(2);
  const labels = p.locale === "zh" ? ["日", "周", "月", "年"] : ["Day", "Week", "Month", "Year"];
  const data = [[12, 19, 16, 24, 22, 28, 35], [28, 19, 32, 34, 28, 47, 41], [20, 31, 26, 44, 38, 54, 62], [23, 38, 34, 49, 65, 58, 82]];
  const value = data[index].reduce((a, b) => a + b, 0) * 100;
  return <SurfaceCard title={t(p, "收入趋势", "Revenue trend")}><div className="flex flex-col gap-5"><ButtonGroup items={labels.map(label => ({ label }))} activeIndex={index} onChange={setIndex} color={p.color} motion={p.motion} ariaLabel={t(p, "统计周期", "Reporting period")} /><p key={value} className="forge-fn-number text-xl font-semibold tabular-nums">¥{value.toLocaleString(p.locale)}</p><SmoothLineChart series={[{ data: data[index], fillArea: true }]} accent={p.color} yDomain={[0, 100]} /></div></SurfaceCard>;
}

function SwipeTabs(p: Props) {
  const [active, setActive] = useState(0), [progress, setProgress] = useState(0);
  const id = useId();
  const labels = p.locale === "zh" ? ["为你推荐", "经济", "科技", "设计", "旅行", "文化"] : ["For you", "Economy", "Technology", "Design", "Travel", "Culture"];
  const titles = p.locale === "zh" ? ["慢一点，团队可以走得更远", "从日常消费理解经济", "让工具为专注服务", "留白让界面更清晰", "找一个适合散步的地方", "这个周末的小型展览"] : ["Slower teams can go further", "Understanding the everyday economy", "Tools that protect focus", "Roomier interfaces read faster", "A place for a quiet walk", "Small exhibitions this weekend"];
  return <div className="flex min-w-0 flex-col gap-4"><h3 className="text-base font-semibold">{t(p, "今日阅读", "Today’s reads")}</h3><TabBar tabs={labels.map((label, i) => ({ label, active: active === i, id: `${id}-tab-${i}`, controls: `${id}-panel-${i}` }))} color={p.color} motion={p.motion} onChange={setActive} progress={progress} className="max-w-full overflow-x-auto whitespace-nowrap" ariaLabel={t(p, "阅读分类", "Reading categories")} /><TabsContent activeKey={active} onActiveKeyChange={key => setActive(Number(key))} onProgressChange={setProgress} motion={p.motion} panels={labels.map((label, i) => ({ key: i, id: `${id}-panel-${i}`, labelledBy: `${id}-tab-${i}`, content: <article className="flex flex-col gap-4 p-1"><div className="forge-fn-reading rounded-2xl p-6"><p className="mb-8 text-xs">{label} · {t(p, "5 分钟", "5 min")}</p><h3 className="text-base font-semibold">{titles[i]}</h3></div><p className="text-sm text-fg-grey-700">{t(p, "左右滑动阅读，或拖动页面切换分类。", "Swipe or drag the page to switch categories.")}</p><p className="text-sm">{t(p, "从实践中寻找更简单的工作方式。", "Find simpler ways to work through practice.")}</p></article> }))} /></div>;
}

function Notifications(p: Props) {
  const [read, setRead] = useState<number[]>([]), [filter, setFilter] = useState(0);
  const titles = p.locale === "zh" ? ["林晓在评论中提到了你", "设计文档已更新", "王晨回复了你的建议"] : ["Lin Xiao mentioned you", "Design document updated", "Wang Chen replied to your suggestion"];
  const unread = titles.length - read.length;
  return <div className="flex min-h-96 items-start justify-end rounded-2xl border border-fg-grey-200 p-4"><span className="mr-auto text-sm font-semibold">{t(p, "工作区", "Workspace")}</span><IconTrigger icon={<BellLinear size={20} />} accent={p.color} badge={unread} ariaLabel={t(p, "通知", "Notifications")} panelAlign="end" initialFocus="first" motion={p.motion} panel={<DropdownPanel width="w-80 max-w-[calc(100vw-3rem)]" motion={p.motion}><div className="w-full"><div className="flex items-center justify-between gap-2 p-2"><ButtonGroup ariaLabel={t(p, "通知筛选", "Notification filter")} color={p.color} motion={p.motion} items={[{ label: t(p, "全部", "All") }, { label: t(p, "提及", "Mentions") }]} activeIndex={filter} onChange={setFilter} /><IconButton variant="ghost" aria-label={t(p, "全部标为已读", "Mark all read")} color={p.color} onClick={() => setRead([0, 1, 2])}><CheckCircleLinear size={18} /></IconButton></div><div className="max-h-72 overflow-auto">{titles.map((title, i) => filter === 1 && i === 1 ? null : <NotificationItem key={i} title={title} body={t(p, "查看项目中的最新动态", "See the latest project update")} time={t(p, "刚刚", "Just now")} unread={!read.includes(i)} color={p.color} onMarkRead={() => setRead(items => [...new Set([...items, i])])} actionLabel={t(p, "标为已读", "Mark as read")} />)}</div></div></DropdownPanel>} /></div>;
}
