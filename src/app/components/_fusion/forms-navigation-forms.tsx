"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Accordion, Button, ButtonGroup, CheckboxControl, Checklist, CommentItem, Datepicker, FileUpload, IconButton, OtpInput, ProgressBar, RadioWithLabel, RatingStars, Stepper, SurfaceCard, TextArea, TextField, Toggle, type FileItem } from "@forge-ui-official/core";
import { CheckCircleLinear, EyeLinear, LockKeyholeLinear, PenLinear, SunLinear, MoonLinear } from "@forge-ui-official/core/icons";
import type { FusionExampleProps } from "./types";

import { useActionTimers } from "./actions-shared";
type Props = FusionExampleProps;
const text = (p: Props, zh: string, en: string) => p.locale === "zh" ? zh : en;
const avatar = "/images/protask/crm/linda-blair-avatar.png";
function Note({ children }: { children: ReactNode }) { return <p className="text-xs leading-5 text-fg-grey-700" role="status">{children}</p>; }
function Actions({ children }: { children: ReactNode }) { return <div className="flex flex-wrap items-center gap-3">{children}</div>; }

export function FormExamples(p: Props) {
  switch (p.id) {
    case "014": case "093": return <TodoExample {...p} />;
    case "015": case "056": return <PlanExample {...p} />;
    case "016": return <RatingExample {...p} />;
    case "019": return <InterestsExample {...p} />;
    case "021": return <ThemeExample {...p} />;
    case "023": return <NotificationSettings {...p} />;
    case "025": return <InviteForm {...p} />;
    case "026": return <OtpExample {...p} />;
    case "028": return <CommentExample {...p} />;
    case "029": return <TagExample {...p} />;
    case "030": return <DateRangeExample {...p} />;
    case "032": case "075": return <UploadExample {...p} />;
    case "033": return <InlineTitle {...p} />;
    case "036": return <PasswordExample {...p} />;
    case "062": return <LoginExample {...p} />;
    case "063": return <RegistrationExample {...p} />;
    default: return null;
  }
}

function TodoExample(p: Props) {
  const labels = p.locale === "zh" ? ["设计评审会议", "完善引导文案", "整理版本说明", "检查发布清单"] : ["Design review", "Polish onboarding copy", "Write release notes", "Review launch checklist"];
  const [done, setDone] = useState([true, false, false, false]);
  const complete = done.every(Boolean);
  return <SurfaceCard title={text(p, "今日待办", "Today’s tasks")} action={<span className="text-sm tabular-nums text-fg-grey-700">{done.filter(Boolean).length}/{done.length}</span>}>
    <div className="flex flex-col gap-5">
      <ProgressBar value={done.filter(Boolean).length / done.length * 100} color={p.color} label={text(p, "完成进度", "Completion")} />
      <Checklist tasks={labels.map((label, i) => ({ id: String(i), label, done: done[i] }))} onTasksChange={tasks => setDone([0, 1, 2, 3].map(i => Boolean(tasks.find(task => task.id === String(i))?.done)))} color={p.color} locale={p.locale} motion={p.motion} />
      {complete && <div className="forge-fn-complete relative overflow-hidden flex items-center gap-3 rounded-xl bg-fg-grey-50 p-4" role="status"><CheckCircleLinear size={24} color="var(--fusion-accent)" /><span className="font-semibold">{text(p, "今天的任务都完成了", "All done for today")}</span>{p.id === "093" && <span className="forge-fn-confetti" aria-hidden>{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ left: `${i * 8}%`, animationDelay: `${i % 4 * 45}ms`, rotate: `${i * 37}deg` }} />)}</span>}</div>}
      {p.id === "093" && <Button color={p.color} variant="tertiary" motion={p.motion} onClick={() => setDone([false, false, false, false])}>{text(p, "重新开始", "Start again")}</Button>}
    </div>
  </SurfaceCard>;
}

function PlanExample(p: Props) {
  const [plan, setPlan] = useState(1), [cycle, setCycle] = useState(0), [seats, setSeats] = useState("3"), [confirmed, setConfirmed] = useState(false);
  const names = p.locale === "zh" ? ["个人版", "专业版", "团队版"] : ["Personal", "Pro", "Team"];
  const prices = [0, 12, 29];
  const amount = prices[plan] * (cycle ? 10 : 1) * (p.id === "056" ? Math.max(1, Math.min(100, Number(seats) || 1)) : 1);
  const root = useRef<HTMLDivElement>(null);
  return <SurfaceCard title={text(p, "选择适合你的方案", "Choose your plan")}><div className="flex flex-col gap-4">
    {p.id === "056" && <ButtonGroup color={p.color} motion={p.motion} activeIndex={cycle} onChange={i => { setCycle(i); setConfirmed(false); }} items={[{ label: text(p, "按月", "Monthly") }, { label: text(p, "按年 · 省两个月", "Yearly · two months free") }]} ariaLabel={text(p, "计费周期", "Billing cycle")} />}
    <div ref={root} role="radiogroup" aria-label={text(p, "方案", "Plans")} className="flex flex-col gap-2" onKeyDown={event => { const delta = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : ["ArrowUp", "ArrowLeft"].includes(event.key) ? -1 : 0; if (!delta) return; event.preventDefault(); const next = (plan + delta + names.length) % names.length; setPlan(next); setConfirmed(false); root.current?.querySelectorAll<HTMLButtonElement>("[role=radio]")[next]?.focus(); }}>
      {names.map((name, i) => <div key={i} className="forge-fn-plan flex items-center justify-between rounded-xl border border-fg-grey-200 p-4" data-selected={i === plan}>
        <RadioWithLabel tabIndex={plan === i ? 0 : -1} checked={plan === i} onChange={() => { setPlan(i); setConfirmed(false); }} color={p.color} label={name} />
        <span className="text-sm text-fg-grey-700 tabular-nums">{prices[i] ? `¥${prices[i]} / ${text(p, "月", "mo")}` : text(p, "免费", "Free")}</span>
      </div>)}
    </div>
    {p.id === "056" && <TextField label={text(p, "协作席位", "Seats")} type="number" min={1} max={100} value={seats} color={p.color} onChange={value => { setSeats(value); setConfirmed(false); }} />}
    <div className="flex justify-between text-sm"><span>{names[plan]}</span><strong className="forge-fn-number" key={amount}>¥{amount.toLocaleString(p.locale)} / {cycle ? text(p, "年", "year") : text(p, "月", "month")}</strong></div>
    <Button color={p.color} motion={p.motion} onClick={() => setConfirmed(true)}>{text(p, "选择方案", "Select plan")}</Button>
    {confirmed && <Note>{text(p, "已选择方案，可在业务中接入订阅流程。", "Plan selected. Connect your subscription flow in your application.")}</Note>}
  </div></SurfaceCard>;
}

function RatingExample(p: Props) {
  const [value, setValue] = useState(0);
  const labels = p.locale === "zh" ? ["点击星星评分", "需要改进", "一般", "不错", "很好", "非常满意"] : ["Choose a rating", "Needs improvement", "Fair", "Good", "Great", "Excellent"];
  return <SurfaceCard title={text(p, "这次体验怎么样？", "How was your experience?")}><div className="flex flex-col items-center gap-5 py-5"><RatingStars value={value} onChange={setValue} size="lg" locale={p.locale} motion={p.motion} /><p key={value} className="forge-fn-feedback text-sm" aria-live="polite">{labels[value]}</p></div></SurfaceCard>;
}

function InterestsExample(p: Props) {
  const labels = p.locale === "zh" ? ["设计系统", "动效", "字体", "三维设计", "数据可视化", "智能体", "无障碍", "品牌", "摄影", "声音"] : ["Design systems", "Motion", "Typography", "3D", "Data visualization", "Agents", "Accessibility", "Branding", "Photography", "Sound"];
  const [selected, setSelected] = useState([0, 1, 5]), [warning, setWarning] = useState(false);
  return <SurfaceCard title={text(p, "你的兴趣", "Your interests")} subtitle={text(p, "最多选择 5 项", "Choose up to five")} action={<span className="text-sm text-fg-grey-700">{selected.length}/5</span>}><div className="flex flex-wrap gap-3">{labels.map((label, i) => <label key={i} className="forge-fn-interest flex items-center gap-2 rounded-full border border-fg-grey-200 px-3 py-2" data-selected={selected.includes(i)}><CheckboxControl color={p.color} aria-label={label} checked={selected.includes(i)} onChange={checked => { if (checked && selected.length >= 5) { setWarning(true); return; } setWarning(false); setSelected(checked ? [...selected, i] : selected.filter(item => item !== i)); }} /><span>{label}</span></label>)}</div><div className="mt-4"><Note>{warning ? text(p, "最多选择 5 项，请先取消一项。", "Choose up to five. Remove an interest first.") : text(p, "选择后可以随时调整。", "You can change these later.")}</Note></div></SurfaceCard>;
}

function ThemeExample(p: Props) {
  const [night, setNight] = useState(false);
  return <div className="forge-fn-daynight rounded-2xl border border-fg-grey-200 p-6" data-night={night}>
    <div className="flex items-center justify-between gap-6"><div className="flex items-center gap-3">{night ? <MoonLinear size={28} color="currentColor" /> : <SunLinear size={28} color="currentColor" />}<div><h3 className="text-sm font-semibold">{night ? text(p, "安静夜晚", "Quiet night") : text(p, "明亮白天", "Clear day")}</h3><p className="mt-1 text-xs opacity-70">{night ? "21:30" : "14:30"}</p></div></div><Toggle color={p.color} checked={night} onChange={setNight} motion={p.motion} ariaLabel={text(p, "切换明暗主题", "Toggle light and dark theme")} thumbIcon={night ? <MoonLinear size={10} /> : <SunLinear size={10} />} /></div>
    <div aria-hidden className="forge-fn-scenery"><i /><i /><i /></div>
  </div>;
}

function NotificationSettings(p: Props) {
  const { clear, later } = useActionTimers();
  const [closing, setClosing] = useState(false);
  const [push, setPush] = useState(true), [email, setEmail] = useState(false), [save, setSave] = useState(true), [frequency, setFrequency] = useState(1);
  return <SurfaceCard title={text(p, "通知设置", "Notifications")} action={<span className="text-xs text-fg-grey-700">{Number(push) + Number(email) + Number(save)} {text(p, "项开启", "enabled")}</span>}><div className="flex flex-col gap-5">
    <div className="flex justify-between gap-4"><div><p>{text(p, "推送通知", "Push notifications")}</p><Note>{text(p, "仅接收提及和回复", "Mentions and replies only")}</Note></div><Toggle disabled={closing} checked={push} onChange={setPush} color={p.color} motion={p.motion} ariaLabel={text(p, "推送通知", "Push notifications")} /></div>
    <div className="flex justify-between gap-4"><p>{text(p, "邮件摘要", "Email digest")}</p><Toggle disabled={closing} checked={email} onChange={setEmail} color={p.color} motion={p.motion} ariaLabel={text(p, "邮件摘要", "Email digest")} /></div>
    <div className="forge-fn-collapse" data-open={email} inert={!email || undefined} aria-hidden={!email || undefined}><div><ButtonGroup items={(p.locale === "zh" ? ["每天", "每周", "每月"] : ["Daily", "Weekly", "Monthly"]).map(label => ({ label }))} activeIndex={frequency} onChange={setFrequency} color={p.color} motion={p.motion} ariaLabel={text(p, "摘要频率", "Digest frequency")} /></div></div>
    <div className="flex justify-between gap-4"><p>{text(p, "自动保存", "Autosave")}</p><Toggle disabled={closing} checked={save} onChange={setSave} color={p.color} motion={p.motion} ariaLabel={text(p, "自动保存", "Autosave")} /></div>
    <Button variant="tertiary" color={p.color} motion={p.motion} disabled={closing} onClick={() => { clear(); setClosing(true); setPush(false); later(() => setEmail(false), p.motion === "none" ? 0 : 160); later(() => { setSave(false); setClosing(false); }, p.motion === "none" ? 0 : 320); }}>{text(p, "全部关闭", "Turn all off")}</Button>
  </div></SurfaceCard>;
}

function InviteForm(p: Props) {
  const [name, setName] = useState(""), [email, setEmail] = useState(""), [submitted, setSubmitted] = useState(false);
  const valid = name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return <SurfaceCard title={text(p, "邀请成员", "Invite a member")}><form className="flex flex-col gap-4" onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
    <TextField label={text(p, "姓名", "Name")} labelPlacement="floating" value={name} onChange={value => { setName(value); setSubmitted(false); }} color={p.color} required />
    <TextField label={text(p, "工作邮箱", "Work email")} labelPlacement="floating" value={email} onChange={value => { setEmail(value); setSubmitted(false); }} type="email" color={p.color} required />
    <Button type="submit" color={p.color} motion={p.motion} disabled={!valid}>{text(p, "确认邀请信息", "Confirm invitation details")}</Button>
    {submitted && <Note>{text(p, "信息已校验，可通过邀请接口发送。", "Details validated and ready for your invitation service.")}</Note>}
  </form></SurfaceCard>;
}

function OtpExample(p: Props) {
  const [value, setValue] = useState(""), [waiting, setWaiting] = useState(false), [remaining, setRemaining] = useState(0);
  const pending = useRef<((valid: boolean) => void) | null>(null);
  useEffect(() => () => { pending.current?.(false); }, []);
  useEffect(() => { if (!remaining) return; const id = setTimeout(() => setRemaining(value => value - 1), 1000); return () => clearTimeout(id); }, [remaining]);
  return <SurfaceCard title={text(p, "输入验证码", "Enter verification code")}><div className="flex flex-col gap-4"><OtpInput value={value} onChange={setValue} locale={p.locale} motion={p.motion} verify={() => new Promise(resolve => { pending.current = resolve; setWaiting(true); })} />
    {waiting && <Actions><Button color={p.color} size="sm" onClick={() => { pending.current?.(true); pending.current = null; setWaiting(false); }}>{text(p, "返回验证成功", "Return valid result")}</Button><Button color={p.color} variant="tertiary" size="sm" onClick={() => { pending.current?.(false); pending.current = null; setWaiting(false); }}>{text(p, "返回验证失败", "Return invalid result")}</Button></Actions>}
    <Button variant="tertiary" color={p.color} disabled={remaining > 0 || waiting} onClick={() => { setValue(""); setRemaining(30); }}>{remaining ? `${remaining}s ${text(p, "后可重发", "until resend")}` : text(p, "重新获取验证码", "Resend code")}</Button>
    <Note>{text(p, "演示由外部返回验证结果；组件不内置验证码。", "The demo supplies a verification result. The component has no built-in code.")}</Note>
  </div></SurfaceCard>;
}

function CommentExample(p: Props) {
  const [draft, setDraft] = useState(""), [comments, setComments] = useState<string[]>([]);
  const field = useRef<HTMLTextAreaElement>(null);
  return <div className="flex flex-col gap-4"><CommentItem avatar={avatar} name={text(p, "林晓", "Lin Xiao")} date={text(p, "刚刚", "Just now")} content={text(p, "第三版的过渡有点快，大家觉得呢？", "The transition in version three feels a little fast. Thoughts?")} replyLabel={text(p, "回复", "Reply")} onReply={() => field.current?.focus()} />{comments.map((content, i) => <CommentItem key={i} avatar={avatar} name={text(p, "我", "Me")} date={text(p, "刚刚", "Just now")} content={content} replyLabel={text(p, "回复", "Reply")} onReply={() => field.current?.focus()} />)}<TextArea ref={field} rows={2} autoGrow value={draft} onChange={setDraft} maxLength={500} label={text(p, "添加评论", "Add a comment")} color={p.color} /><div className="flex items-center justify-between"><Note>{draft.length}/500</Note><Button disabled={!draft.trim()} color={p.color} motion={p.motion} onClick={() => { setComments([...comments, draft.trim()]); setDraft(""); field.current?.focus(); }}>{text(p, "发布", "Post")}</Button></div></div>;
}

function TagExample(p: Props) {
  const [tags, setTags] = useState(["Forge", "UI", "React"]), [value, setValue] = useState(""), [active, setActive] = useState<string | undefined>(), [error, setError] = useState<"duplicate" | "limit" | null>(null);
  function add() { const next = value.trim().replace(/,$/, ""); if (!next) return; if (tags.some(tag => tag.toLowerCase() === next.toLowerCase())) { setError("duplicate"); return; } if (tags.length >= 6) { setError("limit"); return; } setTags([...tags, next]); setValue(""); setActive(undefined); setError(null); }
  return <SurfaceCard title={text(p, "项目标签", "Project tags")} action={<span className="text-xs text-fg-grey-700">{tags.length}/6</span>}><TextField label={text(p, "标签", "Tags")} value={value} onChange={next => { setValue(next); setActive(undefined); setError(null); }} color={p.color} locale={p.locale} tags={tags.map(tag => ({ label: tag, value: tag }))} activeTag={active} onRemoveTag={tag => { setTags(tags.filter(item => item !== tag)); setActive(undefined); }} onKeyDown={event => { if (event.nativeEvent.isComposing) return; if (event.key === "Enter" || event.key === ",") { event.preventDefault(); add(); } if (event.key === "Backspace" && !value && tags.length) { event.preventDefault(); const last = tags.at(-1)!; if (active === last) { setTags(tags.slice(0, -1)); setActive(undefined); } else setActive(last); } if (event.key === "Escape") setActive(undefined); }} /><div className="mt-3"><Note>{error === "duplicate" ? text(p, "这个标签已存在。", "This tag already exists.") : error === "limit" ? text(p, "最多添加 6 个标签。", "Add up to six tags.") : text(p, "回车添加；空输入时连按两次退格删除最后一项。", "Enter adds a tag. Press Backspace twice in an empty input to remove the last tag.")}</Note></div></SurfaceCard>;
}

function DateRangeExample(p: Props) {
  const [range, setRange] = useState<{ start?: Date; end?: Date }>({});
  return <div className="flex flex-col gap-3"><Datepicker mode="range" rangeStart={range.start} rangeEnd={range.end} onRangeChange={(start, end) => setRange({ start, end: end ?? undefined })} color={p.color} locale={p.locale} confirmSelection inline rangeLabels={p.locale === "zh" ? ["开始日期", "结束日期"] : ["Start date", "End date"]} /><Note>{range.start && range.end ? `${text(p, "已应用", "Applied")}: ${range.start.toLocaleDateString(p.locale)} — ${range.end.toLocaleDateString(p.locale)}` : text(p, "选好区间后点击应用。", "Choose a range, then apply.")}</Note></div>;
}

function UploadExample(p: Props) {
  const [files, setFiles] = useState<FileItem[]>([]), [error, setError] = useState("");
  const readers = useRef(new Map<string, FileReader>()), originals = useRef(new Map<string, File>());
  const counter = useRef(0);
  useEffect(() => { const active = readers.current; return () => { for (const reader of active.values()) { reader.onload = reader.onprogress = reader.onerror = reader.onabort = null; reader.abort(); } active.clear(); }; }, []);
  function read(id: string, file: File) {
    const reader = new FileReader(); readers.current.set(id, reader);
    setFiles(items => items.map(item => item.id === id ? { ...item, state: "uploading", progress: 0, uploadedBytes: 0 } : item));
    reader.onprogress = event => setFiles(items => items.map(item => item.id === id ? { ...item, progress: event.lengthComputable ? event.loaded / event.total * 100 : undefined, uploadedBytes: event.loaded } : item));
    reader.onload = () => { readers.current.delete(id); setFiles(items => items.map(item => item.id === id ? { ...item, state: "uploaded", progress: 100, uploadedBytes: file.size } : item)); };
    reader.onerror = () => { readers.current.delete(id); setFiles(items => items.map(item => item.id === id ? { ...item, state: "error" } : item)); };
    reader.readAsArrayBuffer(file);
  }
  function add(incoming: FileList) {
    const valid = [...incoming].filter(file => file.size <= 50 * 1024 * 1024); setError(valid.length < incoming.length ? text(p, "单个文件不能超过 50 MB。", "Each file must be 50 MB or smaller.") : "");
    const entries = valid.map(file => ({ file, id: `file-${++counter.current}` }));
    entries.forEach(({ file, id }) => originals.current.set(id, file));
    setFiles(items => [...items, ...entries.map(({ file, id }) => ({ id, name: file.name, size: `${(file.size / 1024).toFixed(1)} KB`, state: "uploading" as const, progress: 0, totalBytes: file.size }))]);
    entries.forEach(({ file, id }) => read(id, file));
  }
  const content = <FileUpload files={files} onUpload={add} onRemove={id => { const reader = readers.current.get(id); if (reader) { reader.onload = reader.onprogress = reader.onerror = null; reader.abort(); readers.current.delete(id); } originals.current.delete(id); setFiles(items => items.filter(item => item.id !== id)); }} onRetry={id => { const file = originals.current.get(id); if (file) read(id, file); }} locale={p.locale} color={p.color} className="!max-w-none" label={text(p, "拖入文件或点击选择", "Drop files or choose files")} />;
  return <SurfaceCard title={text(p, "文件队列", "File queue")}><div className="flex flex-col gap-3">{p.id === "075" ? <Accordion items={[{ value: "files", title: `${text(p, "文件", "Files")} · ${files.length}`, content }]} defaultValue="files" motion={p.motion} /> : content}<Note>{error || text(p, "演示读取本地文件，不发送到服务器。上传进度由业务接口传入。", "This demo reads local files without sending them to a server. Upload progress comes from your application.")}</Note></div></SurfaceCard>;
}

function InlineTitle(p: Props) {
  const [title, setTitle] = useState<string | null>(null), [draft, setDraft] = useState(""), [editing, setEditing] = useState(false), [invalid, setInvalid] = useState(false);
  const field = useRef<HTMLInputElement>(null), trigger = useRef<HTMLDivElement>(null);
  const current = title ?? text(p, "第四季度推广计划", "Q4 campaign plan");
  useEffect(() => { if (editing) { field.current?.focus(); field.current?.select(); } }, [editing]);
  function save() { if (!draft.trim()) { setInvalid(true); return; } setTitle(draft.trim()); setEditing(false); setInvalid(false); }
  return <SurfaceCard subtitle={text(p, "市场 / 规划", "Marketing / Planning")}><div ref={trigger} className="flex items-center gap-3">{editing ? <TextField ref={field} value={draft} onChange={value => { setDraft(value); setInvalid(false); }} color={p.color} aria-label={text(p, "标题", "Title")} state={invalid ? "error" : "focus"} errorMessage={text(p, "标题不能为空", "Title is required")} onBlur={save} onKeyDown={event => { if (event.nativeEvent.isComposing) return; if (event.key === "Enter") { event.preventDefault(); save(); } if (event.key === "Escape") { event.preventDefault(); setEditing(false); setInvalid(false); queueMicrotask(() => trigger.current?.querySelector("button")?.focus()); } }} /> : <><h3 className="text-base font-semibold">{current}</h3><IconButton variant="ghost" color={p.color} aria-label={text(p, "编辑标题", "Edit title")} onClick={() => { setDraft(current); setEditing(true); }}><PenLinear size={18} /></IconButton></>}</div></SurfaceCard>;
}

function PasswordExample(p: Props) {
  const [value, setValue] = useState(""), [visible, setVisible] = useState(false);
  const checks = [value.length >= 10, /[A-Z]/.test(value), /\d/.test(value), /[^\w\s]/.test(value)];
  const labels = p.locale === "zh" ? ["至少 10 个字符", "包含大写字母", "包含数字", "包含符号"] : ["At least 10 characters", "An uppercase letter", "A number", "A symbol"];
  return <SurfaceCard title={text(p, "设置密码", "Set a password")}><div className="flex flex-col gap-4"><TextField type={visible ? "text" : "password"} value={value} onChange={setValue} color={p.color} label={text(p, "新密码", "New password")} iconLeft={<LockKeyholeLinear size={18} />} iconRight={<button type="button" aria-label={text(p, "显示或隐藏密码", "Show or hide password")} aria-pressed={visible} onClick={() => setVisible(!visible)}><EyeLinear size={18} /></button>} /><ProgressBar value={checks.filter(Boolean).length * 25} color={p.color} label={text(p, "格式要求", "Format requirements")} /><ul className="flex flex-col gap-2">{labels.map((label, i) => <li key={label} className={`flex items-center gap-2 text-sm ${checks[i] ? "text-fg-black" : "text-fg-grey-700"}`}><CheckCircleLinear size={16} color={checks[i] ? "var(--fusion-accent)" : "currentColor"} />{label}</li>)}</ul><Note>{text(p, "格式提示不等同于密码安全性评估。", "Format guidance is not a password security assessment.")}</Note></div></SurfaceCard>;
}

function LoginExample(p: Props) {
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [caps, setCaps] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [fail, setFail] = useState(false);
  const { clear, later } = useActionTimers();
  const busy = state === "loading";
  const edit = (update: () => void) => { clear(); update(); setState("idle"); };
  return <SurfaceCard title={text(p, "欢迎回来", "Welcome back")}><form className="flex flex-col gap-4" aria-busy={busy} onSubmit={event => { event.preventDefault(); clear(); setState("loading"); later(() => setState(fail ? "error" : "success"), 1200); }}>
    <TextField label={text(p, "邮箱", "Email")} type="email" required disabled={busy} value={email} onChange={value => edit(() => setEmail(value))} color={p.color} autoComplete="email" />
    <TextField label={text(p, "密码", "Password")} type="password" required minLength={8} disabled={busy} value={password} onChange={value => edit(() => setPassword(value))} color={p.color} autoComplete="current-password" onKeyUp={event => setCaps(event.getModifierState("CapsLock"))} onBlur={() => setCaps(false)} />
    {caps && <Note>{text(p, "大写锁定已开启", "Caps Lock is on")}</Note>}
    <label className="flex items-center gap-2 text-sm"><CheckboxControl checked={fail} onChange={setFail} disabled={busy} aria-label={text(p, "模拟登录失败", "Simulate sign-in failure")} color={p.color} />{text(p, "模拟登录失败", "Simulate sign-in failure")}</label>
    <Button type="submit" locale={p.locale} color={p.color} motion={p.motion} loading={busy} loadingLabel={text(p, "正在登录…", "Signing in…")} result={state === "success" ? "success" : state === "error" ? "error" : "idle"} resultLabel={state === "error" ? text(p, "重试登录", "Try again") : text(p, "登录成功", "Signed in")}>{text(p, "登录", "Sign in")}</Button>
    {state === "error" && <p role="alert" className="text-sm text-fg-red">{text(p, "登录失败，请检查信息后重试。", "Sign-in failed. Check your details and try again.")}</p>}
    {state === "success" && <Note>{text(p, "登录成功，欢迎回来。", "Signed in. Welcome back.")}</Note>}
    <Note>{text(p, "本地交互演示，不会发送登录信息。", "Local interaction demo. No credentials are sent.")}</Note>
  </form></SurfaceCard>;
}

function RegistrationExample(p: Props) {
  const [step, setStep] = useState(0), [values, setValues] = useState(["", "", ""]);
  const labels = p.locale === "zh" ? ["怎么称呼你？", "使用哪个邮箱？", "设置密码"] : ["What should we call you?", "Which email will you use?", "Choose a password"];
  const input = useRef<HTMLInputElement>(null);
  const focusRequested = useRef(false);
  useEffect(() => { if (focusRequested.current) { input.current?.focus({ preventScroll: true }); focusRequested.current = false; } }, [step]);
  function moveTo(nextStep: number) { focusRequested.current = true; setStep(nextStep); }
  function next(event: FormEvent) { event.preventDefault(); moveTo(Math.min(3, step + 1)); }
  return <SurfaceCard title={step < 3 ? labels[step] : text(p, "信息已准备好", "Details ready")}><div className="flex flex-col gap-4"><Stepper total={3} current={Math.min(3, step + 1)} color={p.color} />{step < 3 ? <form onSubmit={next} className="flex flex-col gap-4" key={step}><TextField ref={input} value={values[step]} onChange={value => setValues(items => items.map((item, i) => i === step ? value : item))} type={step === 1 ? "email" : step === 2 ? "password" : "text"} label={labels[step]} color={p.color} required minLength={step === 2 ? 8 : 1} /><Actions>{step > 0 && <Button variant="tertiary" color={p.color} onClick={() => moveTo(step - 1)}>{text(p, "上一步", "Back")}</Button>}<Button type="submit" color={p.color}>{text(p, "下一步", "Next")}</Button></Actions></form> : <><Note>{text(p, "资料已完成校验。账号创建和邮件发送由业务接口执行。", "Details validated. Account creation and email delivery belong to your application.")}</Note><Button color={p.color} variant="tertiary" onClick={() => moveTo(0)}>{text(p, "重新填写", "Start over")}</Button></>}</div></SurfaceCard>;
}
