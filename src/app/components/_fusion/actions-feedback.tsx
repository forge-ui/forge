"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, IconButton, ListItem, ProgressBar, Stepper, SurfaceCard, ToastProvider, Tooltip, TooltipGroup, useToast } from "@forge-ui-official/core";
import { ArrowRightLinear, BellLinear, CheckCircleLinear, CloseCircleLinear, CompassLinear, CopyLinear, DeliveryLinear, FolderLinear, LetterLinear, LinkLinear, RefreshLinear, SettingsBold } from "@forge-ui-official/core/icons";
import type { FusionExampleProps } from "./types";
import { ActionHint, ActionStage, useActionTimers } from "./actions-shared";

export function ReadingExample(settings: FusionExampleProps) {
  const en = settings.locale === "en";
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState(0);
  const article = useRef<HTMLDivElement>(null);
  const titles = en ? ["Observe", "Simplify", "Validate"] : ["观察", "精简", "验证"];
  const content = en ? ["Start with how people work. Notice the small interruptions: a label that needs decoding, a control that moves, or a result that arrives without context.", "Keep the primary action in a predictable place. Use hierarchy to separate information without making every item compete for attention.", "Watch the interface in use. A good transition explains what changed and preserves the user's place, while reduced motion retains every essential state."] : ["从真实的工作方式开始观察。留意那些细小的打断：需要猜测的标签、位置变化的控件，或没有解释就出现的结果。", "让主要操作始终出现在容易找到的位置。通过层级组织信息，而不是让所有内容同时争夺注意力。", "观察界面被使用的过程。好的过渡会说明发生了什么，并保留用户的位置；在减少动态效果时，所有重要状态仍然清晰可见。"];
  return <ActionStage settings={settings}><SurfaceCard padding="none" className="w-full"><div className="p-4 flex gap-3 items-center"><div className="flex-1"><h3 className="text-sm font-semibold">{en ? "Design for everyday work" : "为日常工作而设计"}</h3><div className="flex gap-2 mt-2">{titles.map((title, index) => <Button key={title} size="sm" color={settings.color} variant={section === index ? "secondary" : "tertiary"} aria-pressed={section === index} onClick={() => { const target = article.current?.querySelector<HTMLElement>(`[data-reading-section="${index}"]`); if (target && article.current) article.current.scrollTo({ top: target.offsetTop, behavior: "instant" }); }}>{title}</Button>)}</div></div><ProgressBar variant="ring" value={progress} color={settings.color} motion={settings.motion} label={en ? "Reading progress" : "阅读进度"} className="fusion-reading-ring">{progress === 100 ? <CheckCircleLinear size={18} /> : `${progress}%`}</ProgressBar></div><ProgressBar value={progress} color={settings.color} motion={settings.motion} label={en ? "Reading progress" : "阅读进度"} /><div className="fusion-reading-body" ref={article} tabIndex={0} aria-label={en ? "Article content" : "文章内容"} onScroll={event => { const node = event.currentTarget; const max = node.scrollHeight - node.clientHeight; setProgress(max <= 0 ? 100 : Math.round(node.scrollTop / max * 100)); const sections = Array.from(node.querySelectorAll<HTMLElement>("[data-reading-section]")); const current = sections.filter(item => item.offsetTop <= node.scrollTop + 40).length - 1; setSection(max > 0 && node.scrollTop >= max - 1 ? sections.length - 1 : Math.max(0, current)); }}>{titles.map((title, index) => <section key={title} data-reading-section={index}><h4 className="text-base font-semibold text-fg-black">{title}</h4><p>{content[index]}</p><p>{content[(index + 1) % 3]}</p></section>)}</div><p className="px-4 pb-3 text-xs text-fg-grey-700">{en ? `${Math.max(0, Math.ceil((100 - progress) / 33))} min remaining` : `预计还需 ${Math.max(0, Math.ceil((100 - progress) / 33))} 分钟`}</p></SurfaceCard></ActionStage>;
}

function ToastDemo(settings: FusionExampleProps) {
  const api = useToast();
  const { later } = useActionTimers();
  const en = settings.locale === "en";
  return <ActionStage settings={settings}><BellLinear size={36} /><p className="text-sm font-semibold">{en ? "Clear feedback, less interruption" : "清晰反馈，减少打断"}</p><div className="flex flex-wrap gap-2 justify-center"><Button color={settings.color} onClick={() => { const id = api.toast({ title: en ? "Saving your changes…" : "正在保存更改…", status: "loading", duration: 0 }); later(() => api.update(id, { title: en ? "Changes saved" : "更改已保存", description: en ? "Your workspace is up to date." : "工作区已更新。", status: "success", duration: 4000 }), 1200); }}>{en ? "Save changes" : "保存更改"}</Button><Button color={settings.color} variant="tertiary" onClick={() => api.toast({ title: en ? "Connection failed" : "连接失败", status: "error", duration: 7000, action: { label: en ? "Retry" : "重试", onClick: () => api.toast({ title: en ? "Connection restored" : "连接已恢复", status: "success" }) } })}>{en ? "Show error" : "显示错误"}</Button></div><ActionHint>{en ? "Hover to expand; swipe to dismiss" : "悬停展开，滑动关闭"}</ActionHint></ActionStage>;
}
export function StackingToastExample(settings: FusionExampleProps) { return <ToastProvider motion={settings.motion} locale={settings.locale} stacked><ToastDemo {...settings} /></ToastProvider>; }

function SwipeDemo(settings: FusionExampleProps) {
  const en = settings.locale === "en";
  const [deleted, setDeleted] = useState<number[]>([]);
  const list = useRef<HTMLDivElement>(null);
  const focusAfterUpdate = useRef<number | "empty" | null>(null);
  useLayoutEffect(() => {
    const id = focusAfterUpdate.current;
    if (id === null) return;
    focusAfterUpdate.current = null;
    const target = id === "empty" ? list.current : list.current?.querySelector<HTMLButtonElement>(`[data-mail-id="${id}"] button`);
    target?.focus();
  }, [deleted]);
  const api = useToast();
  const subjects = en ? ["Updated project plan", "Your weekly summary", "Design review invitation"] : ["项目计划已更新", "本周工作摘要", "设计评审邀请"];
  const remove = (index: number) => {
    if (list.current?.querySelector(`[data-mail-id="${index}"]`)?.contains(document.activeElement)) {
      const remaining = subjects.map((_, i) => i).filter(i => i !== index && !deleted.includes(i));
      focusAfterUpdate.current = remaining.find(i => i > index) ?? remaining.at(-1) ?? "empty";
    }
    setDeleted(value => value.includes(index) ? value : [...value, index]); api.toast({ title: en ? "Message deleted" : "邮件已删除", description: subjects[index], duration: 6000, action: { label: en ? "Undo" : "撤销", onClick: () => { focusAfterUpdate.current = index; setDeleted(value => value.filter(item => item !== index)); } } }); };
  return <ActionStage settings={settings}><SurfaceCard title={en ? "Inbox" : "收件箱"} padding="none" className="w-full"><div ref={list} tabIndex={-1} aria-label={en ? "Inbox messages" : "收件箱邮件"} className="fusion-swipe-list">{subjects.map((title, index) => !deleted.includes(index) && <div key={index} data-mail-id={index}><ListItem title={title} subtitle={en ? "Forge team · Today" : "Forge 团队 · 今天"} lead={{ kind: "icon", icon: <LetterLinear size={20} />, color: settings.color }} onSwipeAction={() => remove(index)} swipeActionLabel={en ? "Delete message" : "删除邮件"} motion={settings.motion} /></div>)}{deleted.length === subjects.length && <p className="p-5 text-sm text-fg-grey-700">{en ? "Inbox is empty" : "收件箱已清空"}</p>}</div></SurfaceCard><ActionHint>{en ? "Swipe left, or Tab to the delete action" : "向左滑动，或按 Tab 聚焦删除操作"}</ActionHint></ActionStage>;
}
export function SwipeExample(settings: FusionExampleProps) { return <ToastProvider motion={settings.motion} locale={settings.locale}><SwipeDemo {...settings} /></ToastProvider>; }

export function GlidingTooltipExample(settings: FusionExampleProps) {
  const en = settings.locale === "en";
  const [selected, setSelected] = useState("");
  const tools = [{ icon: <FolderLinear size={20} />, label: en ? "Open folder" : "打开文件夹", key: "⌘O" }, { icon: <CopyLinear size={20} />, label: en ? "Copy" : "复制", key: "⌘C" }, { icon: <LinkLinear size={20} />, label: en ? "Insert link" : "插入链接", key: "⌘K" }, { icon: <SettingsBold size={20} />, label: en ? "Settings" : "设置", key: "⌘," }];
  return <ActionStage settings={settings}><TooltipGroup delay={250} warmWindow={700}><div className="fusion-tooltip-toolbar">{tools.map(item => <Tooltip key={item.label} content={`${item.label} · ${item.key}`} motion={settings.motion} position="top"><IconButton color={settings.color} variant="ghost" aria-label={item.label} onClick={() => setSelected(item.label)}>{item.icon}</IconButton></Tooltip>)}</div></TooltipGroup><ActionHint>{selected || (en ? "Move across the tools; focus also reveals the label" : "在工具间移动，聚焦也会显示说明")}</ActionHint></ActionStage>;
}

export function SyncExample(settings: FusionExampleProps) {
  const en = settings.locale === "en";
  const [running, setRunning] = useState(true);
  const [progress, setProgress] = useState(0);
  useEffect(() => { if (!running || progress >= 100) return; const timer = setTimeout(() => setProgress(value => Math.min(100, value + 2)), 100); return () => clearTimeout(timer); }, [running, progress]);
  const labels = en ? ["Preparing files", "Syncing changes", "Checking integrity", "Everything is up to date"] : ["准备文件", "同步更改", "检查完整性", "所有内容均已更新"];
  const done = progress === 100;
  return <ActionStage settings={settings}><div className="fusion-orbit" data-running={running && !done} data-complete={done}><i /><i /><i /><span>{done ? <CheckCircleLinear size={30} /> : <RefreshLinear size={26} />}</span></div><p className="text-sm font-semibold">{running || done ? labels[Math.min(3, Math.floor(progress / 30))] : (en ? "Sync paused" : "同步已暂停")}</p><ProgressBar value={progress} color={settings.color} motion={settings.motion} showPercentage locale={settings.locale} /><Button color={settings.color} variant="secondary" onClick={() => { if (done) { setProgress(0); setRunning(true); } else setRunning(value => !value); }}>{done ? (en ? "Sync again" : "重新同步") : running ? (en ? "Pause" : "暂停") : (en ? "Resume" : "继续")}</Button></ActionStage>;
}

export function QueueExample(settings: FusionExampleProps) {
  const en = settings.locale === "en";
  const [{ phase, progress }, setJob] = useState({ phase: "queued", progress: 0 });
  useEffect(() => { if (phase === "queued") { const timer = setTimeout(() => setJob({ phase: "building", progress: 0 }), 1600); return () => clearTimeout(timer); } if (phase === "building") { const timer = setInterval(() => setJob(previous => { const next = Math.min(100, previous.progress + 4); return { phase: next === 100 ? "done" : "building", progress: next }; }), 100); return () => clearInterval(timer); } }, [phase]);
  const logs = en ? ["Queued for a build worker", "Installing dependencies", "Compiling components", "Publishing build artifacts", "Build ready"] : ["等待构建资源", "安装依赖", "编译组件", "生成构建产物", "构建完成"];
  return <ActionStage settings={settings}><SurfaceCard title={en ? "Production build" : "生产构建"} subtitle="forge/workspace · main" className="w-full"><ProgressBar value={progress} indeterminate={phase === "queued"} color={settings.color} motion={settings.motion} locale={settings.locale} label={phase === "queued" ? (en ? "Queued" : "排队中") : phase === "done" ? (en ? "Complete" : "已完成") : phase === "cancelled" ? (en ? "Cancelled" : "已取消") : (en ? "Building" : "构建中")} showPercentage={phase !== "queued"} /><ol className="fusion-build-log">{logs.slice(0, phase === "queued" ? 1 : Math.min(5, 2 + Math.floor(progress / 30))).map((log, index) => <li key={log}>{phase === "done" || index < 1 + Math.floor(progress / 30) ? <CheckCircleLinear size={16} /> : <RefreshLinear size={16} className={settings.motion === "none" ? "" : "forge-action-spinner"} />}{log}</li>)}</ol><Button color={settings.color} size="sm" variant="secondary" onClick={() => setJob(phase === "done" || phase === "cancelled" ? { phase: "queued", progress: 0 } : { phase: "cancelled", progress })}>{phase === "done" || phase === "cancelled" ? (en ? "Run again" : "重新运行") : (en ? "Cancel" : "取消")}</Button></SurfaceCard></ActionStage>;
}

export function DeliveryExample(settings: FusionExampleProps) {
  const en = settings.locale === "en";
  const [step, setStep] = useState(1);
  const labels = en ? ["Confirmed", "Packed", "In transit", "Delivered"] : ["已确认", "已打包", "配送中", "已送达"];
  return <ActionStage settings={settings}><SurfaceCard title={en ? "Order #FG-2026" : "订单 #FG-2026"} className="w-full"><Stepper indicator={step === 4 ? <CheckCircleLinear size={24} /> : <DeliveryLinear size={24} />} color={settings.color} current={step} items={labels.map((label, index) => ({ id: String(index), label }))} motion={settings.motion} locale={settings.locale} onStepChange={setStep} /><ol className="fusion-delivery-log">{labels.slice(0, step).map((label, index) => ({ label, index })).reverse().map(({ label, index }) => <li key={label}><CheckCircleLinear size={16} /><span>{label}</span><time>{String(9 + index).padStart(2, "0")}:30</time></li>)}</ol><Button color={settings.color} size="sm" motion={settings.motion} iconRight={<ArrowRightLinear size={16} />} onClick={() => setStep(value => value === 4 ? 1 : value + 1)}>{step === 4 ? (en ? "Replay delivery" : "重新演示") : (en ? "Next stage" : "下一阶段")}</Button></SurfaceCard></ActionStage>;
}

export function CorrectionExample(settings: FusionExampleProps) {
  const en = settings.locale === "en";
  const [path, setPath] = useState("/projcts");
  const [phase, setPhase] = useState<"idle" | "typing" | "found">("idle");
  const { later, clear } = useActionTimers();
  const compass = useRef<HTMLSpanElement>(null);
  const options = [{ path: "/projects", title: en ? "Projects" : "项目" }, { path: "/profile", title: en ? "Profile" : "个人资料" }, { path: "/pricing", title: en ? "Pricing" : "价格方案" }];
  const correct = (target: string) => { clear(); setPhase("typing"); const frames = Array.from({ length: path.length - 1 }, (_, i) => path.slice(0, path.length - i - 1)).concat(Array.from({ length: target.length - 1 }, (_, i) => target.slice(0, i + 2))); frames.forEach((text, index) => later(() => { setPath(text); if (index === frames.length - 1) setPhase("found"); }, settings.motion === "none" ? 0 : index * 48)); };
  return <ActionStage settings={settings}><SurfaceCard className="w-full" onPointerMove={event => { if (!compass.current || settings.motion === "none" || phase !== "idle" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return; const box = compass.current.getBoundingClientRect(); compass.current.style.rotate = `${Math.atan2(event.clientX - box.left - box.width / 2, -(event.clientY - box.top - box.height / 2)) * 180 / Math.PI}deg`; }}><code className="text-sm text-fg-grey-700">forge.app{path}</code><div className="fusion-error-number" aria-label={phase === "found" ? "200" : "404"}><span>{phase === "found" ? "2" : "4"}</span><span ref={compass} className="fusion-compass"><CompassLinear size={60} /></span><span>{phase === "found" ? "0" : "4"}</span></div><h3 className="text-base font-semibold text-center">{phase === "found" ? (en ? "Address corrected" : "地址已更正") : (en ? "This page could not be found" : "没有找到这个页面")}</h3><ActionHint>{en ? "Choose a similar address" : "试试下面的相近地址"}</ActionHint><div className="flex flex-col gap-2">{options.map(option => <Button key={option.path} color={settings.color} variant="tertiary" size="sm" disabled={phase === "typing"} iconRight={phase === "found" && option.path === path ? <CheckCircleLinear size={16} /> : <ArrowRightLinear size={16} />} onClick={() => correct(option.path)}>{option.title} · {option.path}</Button>)}</div>{phase === "found" && <Button className="mt-3" color={settings.color} variant="secondary" size="sm" onClick={() => { clear(); setPath("/projcts"); setPhase("idle"); }}>{en ? "Reset example" : "重置示例"}</Button>}</SurfaceCard></ActionStage>;
}

export function RetryExample(settings: FusionExampleProps) {
  const en = settings.locale === "en";
  const [state, setState] = useState<"wait" | "trying" | "success">("wait");
  const [countdown, setCountdown] = useState(5);
  const [attempts, setAttempts] = useState(1);
  const [details, setDetails] = useState(false);
  const retry = () => { setState("trying"); };
  useEffect(() => {
    if (state === "wait") { const timer = setTimeout(() => { if (countdown <= 1) setState("trying"); else setCountdown(value => value - 1); }, 1000); return () => clearTimeout(timer); }
    if (state === "trying") { const timer = setTimeout(() => { if (attempts < 2) { setAttempts(value => value + 1); setCountdown(8); setState("wait"); } else setState("success"); }, 1200); return () => clearTimeout(timer); }
  }, [state, countdown, attempts]);
  return <ActionStage settings={settings}><SurfaceCard title={en ? "Weekly revenue" : "本周收入"} subtitle={en ? "Demo retry flow: one failure, then recovery" : "重试流程演示：首次失败，再次恢复"} className="w-full"><div className="fusion-retry-plug" data-state={state} aria-hidden><span /><LinkLinear size={36} /><span /></div>{state === "success" ? <><p className="text-3xl font-semibold text-fg-black">¥48,200</p><div className="fusion-retry-bars" aria-label={en ? "Weekly revenue recovered" : "本周收入数据已恢复"}>{[42, 55, 38, 70, 64, 88, 76].map((value, index) => <div key={index}><i style={{ height: `${value}%`, animationDelay: `${index * 60}ms` }} /><span>{en ? ["M", "T", "W", "T", "F", "S", "S"][index] : ["一", "二", "三", "四", "五", "六", "日"][index]}</span></div>)}</div></> : <><h3 className="text-base font-semibold text-center">{state === "trying" ? (en ? "Reconnecting…" : "正在重新连接…") : (en ? "Could not load data" : "暂时无法加载数据")}</h3><ActionHint>{state === "trying" ? (en ? `Attempt ${attempts + 1}` : `第 ${attempts + 1} 次尝试`) : (en ? `Retrying automatically in ${countdown}s` : `${countdown} 秒后自动重试`)}</ActionHint><div className="flex justify-center gap-2 mb-3">{[1, 2, 3].map(value => <span key={value} className="text-fg-grey-700">{value <= attempts ? <CloseCircleLinear size={18} /> : <span className="fusion-attempt-dot" />}</span>)}</div><Button color={settings.color} variant="tertiary" size="sm" aria-expanded={details} onClick={() => setDetails(value => !value)}>{en ? "Error details" : "错误详情"}</Button>{details && <pre className="fusion-error-detail">GET /api/sales/week{"\n"}503 Service Unavailable{"\n"}{en ? "Attempt" : "尝试次数"}: {attempts}/3</pre>}</>}<div className="flex gap-3 items-center justify-center mt-4">{state === "wait" && <ProgressBar variant="ring" color={settings.color} motion={settings.motion} value={countdown / (attempts === 1 ? 5 : 8) * 100} className="fusion-reading-ring" label={en ? "Retry countdown" : "重试倒计时"}>{countdown}</ProgressBar>}<Button color={settings.color} loading={state === "trying"} locale={settings.locale} onClick={state === "success" ? () => { setState("wait"); setCountdown(5); setAttempts(1); } : retry}>{state === "success" ? (en ? "Replay error" : "重新演示") : (en ? "Retry now" : "立即重试")}</Button></div></SurfaceCard></ActionStage>;
}
