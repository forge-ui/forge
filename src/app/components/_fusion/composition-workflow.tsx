"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion as m, useReducedMotion } from "motion/react";
import { AddMember, Avatar, AvatarGroup, Button, ButtonGroup, Checkbox, DataTable, EventCard, EventTag, IconButton, ProgressBar, ReviewItem, SurfaceCard, TaskCard, TextField, type ColumnDef } from "@forge-ui-official/core";
import { AltArrowLeftLinear, AltArrowRightLinear, CheckCircleLinear, CloseCircleLinear, CalendarLinear } from "@forge-ui-official/core/icons";
import type { FusionSettings } from "./types";

const portraits = ["/images/protask/crm/john-hoegan-avatar.png", "/images/protask/crm/linda-blair-avatar.png", "/images/protask/crm/team-avatar.png"];
const accent = (color: FusionSettings["color"]) => color === "purple" ? "var(--fg-violet)" : color === "blue" ? "var(--fg-blue)" : "var(--fg-black)";

export function ReviewCarouselExample({ locale, color, motion }: FusionSettings) {
  const zh = locale === "zh";
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useReducedMotion();
  const names = zh ? ["林晓", "陈凡", "周宁"] : ["Alex Lin", "Chris Chen", "Jamie Zhou"];
  const quotes = zh ? ["组件和设计稿保持一致，交付周期缩短了一半。", "动效自然克制，放进现有产品也很协调。", "键盘交互和细节都有照顾到，团队可以专注业务。"] : ["The components match our designs and cut delivery time in half.", "The motion feels natural and fits our existing product.", "Keyboard interactions and small details let our team focus on the product."];
  useEffect(() => {
    if (!auto || hover || focused || reduced || motion === "none") return;
    const timer = setTimeout(() => setIndex(value => (value + 1) % names.length), 5200);
    return () => clearTimeout(timer);
  }, [auto, hover, focused, reduced, motion, index, names.length]);
  return <div className="flex w-full flex-col gap-4" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <AnimatePresence mode="wait" initial={false}><m.div key={index} initial={{ opacity: 0, x: reduced || motion === "none" ? 0 : 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced || motion === "none" ? 0 : -16 }} transition={{ duration: reduced || motion === "none" ? 0 : .25 }}>
      <ReviewItem variant="card" width="full" avatar={portraits[index]} name={names[index]} date={zh ? "团队评价" : "Team review"} rating={5} content={quotes[index]} />
    </m.div></AnimatePresence>
    <div className="flex flex-wrap items-center gap-3">
      <IconButton motion={motion} size="sm" color={color} variant="ghost" aria-label={zh ? "上一条评价" : "Previous review"} onClick={() => setIndex((index + names.length - 1) % names.length)}><AltArrowLeftLinear size={18} /></IconButton>
      {names.map((name, i) => <button key={name} type="button" aria-label={zh ? `查看${name}的评价` : `Review by ${name}`} aria-pressed={index === i} onClick={() => setIndex(i)} className="rounded-full p-1 outline-offset-2 focus-visible:outline-2" style={{ outline: index === i ? `2px solid ${accent(color)}` : undefined }}><Avatar src={portraits[i]} alt={name} size="sm" /></button>)}
      <IconButton motion={motion} size="sm" color={color} variant="ghost" aria-label={zh ? "下一条评价" : "Next review"} onClick={() => setIndex((index + 1) % names.length)}><AltArrowRightLinear size={18} /></IconButton>
      <Button motion={motion} size="sm" color="black" variant="tertiary" aria-pressed={auto} onClick={() => setAuto(!auto)}>{auto ? (zh ? "暂停轮播" : "Pause") : (zh ? "自动轮播" : "Play")}</Button>
      <span className="text-xs text-fg-grey-500" role="status">{index + 1} / {names.length}</span>
    </div>
  </div>;
}

export function EventRegistrationExample({ locale, color, motion }: FusionSettings) {
  const zh = locale === "zh";
  const [rsvp, setRsvp] = useState(0);
  const [calendar, setCalendar] = useState(false);
  const labels = zh ? ["参加", "待定", "不参加"] : ["Going", "Maybe", "Not going"];
  return <SurfaceCard title={zh ? "动效设计交流夜" : "Motion design evening"}>
    <div className="flex flex-col gap-4">
      <EventCard width="full" title={zh ? "一起拆解一个自然的交互" : "Explore one natural interaction together"} timeRange={zh ? "10 月 24 日 · 19:30–21:00" : "24 Oct · 19:30–21:00"} color={color} avatars={portraits} overflowCount={34 + (rsvp === 0 ? 1 : 0)} />
      <p className="text-sm leading-6 text-fg-grey-700">{zh ? "带上电脑，现场交流设计和实现方法。" : "Bring a laptop and share design and implementation ideas."}</p>
      <div className="flex flex-wrap items-center gap-3"><ButtonGroup items={labels.map(label => ({ label }))} activeIndex={rsvp} onChange={setRsvp} color={color} motion={motion} ariaLabel={zh ? "参加意向" : "RSVP"} /><Button motion={motion} size="sm" color={color} variant="tertiary" aria-pressed={calendar} iconLeft={<CalendarLinear size={16} />} onClick={() => setCalendar(!calendar)}>{calendar ? (zh ? "已加入日程" : "Added to schedule") : (zh ? "加入日程" : "Add to schedule")}</Button></div>
      <p role="status" className="text-xs text-fg-grey-700">{zh ? `剩余 ${rsvp === 0 ? 12 : 13} / 50 个名额 · ${labels[rsvp]}` : `${rsvp === 0 ? 12 : 13} / 50 spots left · ${labels[rsvp]}`}</p>
    </div>
  </SurfaceCard>;
}

export function TimeZoneExample({ locale, color }: FusionSettings) {
  const zh = locale === "zh";
  const [hour, setHour] = useState(10);
  const [day, setDay] = useState("2026-10-14");
  const zones = [[zh ? "上海" : "Shanghai", "Asia/Shanghai"], [zh ? "伦敦" : "London", "Europe/London"], [zh ? "纽约" : "New York", "America/New_York"]];
  const date = new Date(`${day || "2026-10-14"}T${String(hour).padStart(2, "0")}:00:00Z`);
  const times = zones.map(([name, zone]) => {
    const localHour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", hourCycle: "h23" }).format(date));
    return { name, localHour, available: localHour >= 9 && localHour < 18, display: new Intl.DateTimeFormat(zh ? "zh-CN" : "en-GB", { timeZone: zone, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(date) };
  });
  return <SurfaceCard title={zh ? "查找共同工作时间" : "Find shared working hours"}>
    <div className="flex flex-col gap-5">
      <TextField type="date" label={zh ? "日期" : "Date"} value={day} color={color} onChange={value => { if (/^\d{4}-\d{2}-\d{2}$/.test(value)) setDay(value); }} />
      <label className="flex flex-col gap-2 text-sm text-fg-grey-700">UTC {String(hour).padStart(2, "0")}:00<input type="range" min={0} max={23} step={1} value={hour} aria-label={zh ? "UTC 小时" : "UTC hour"} onChange={event => setHour(Number(event.target.value))} style={{ accentColor: accent(color) }} /></label>
      {times.map(time => <div key={time.name} className="flex flex-col gap-2"><div className="flex flex-wrap justify-between gap-2 text-sm"><span className="font-medium text-fg-black">{time.name}</span><span className="text-fg-grey-700">{time.display} · {time.available ? (zh ? "工作时间" : "Working") : (zh ? "非工作时间" : "Off hours")}</span></div><div className="relative h-3 overflow-hidden rounded-full bg-fg-grey-100"><span className="absolute inset-y-0 left-[37.5%] w-[37.5%] bg-fg-grey-300" /><span className="absolute inset-y-0 w-1 rounded-full" style={{ left: `${time.localHour / 24 * 100}%`, background: accent(color) }} /></div></div>)}
      <p role="status" className="text-sm font-medium text-fg-grey-900">{zh ? "当前处于工作时间的城市" : "Cities in working hours"}：{times.filter(time => time.available).length} / 3</p>
    </div>
  </SurfaceCard>;
}

export function ScheduleConflictExample({ locale, color, motion }: FusionSettings) {
  const zh = locale === "zh";
  const [resolved, setResolved] = useState(false);
  const reduced = useReducedMotion();
  return <SurfaceCard title={zh ? "安排团队日程" : "Plan team meetings"}>
    <div className="flex flex-col gap-4">
      <div className="flex justify-between text-xs text-fg-grey-500"><span>14:00</span><span>15:00</span><span>16:00</span></div>
      <div className="relative h-36 rounded-xl border border-fg-grey-200 bg-fg-grey-50 p-3">
        <div className="w-1/2 pr-1"><EventTag label={zh ? "团队评审 · 14:00–15:00" : "Team review · 14:00–15:00"} color={color} block /></div>
        <m.div className="absolute top-20 w-1/2 pr-3" animate={{ left: resolved ? "50%" : "25%" }} transition={{ duration: reduced || motion === "none" ? 0 : .35 }}><EventTag label={zh ? "一对一沟通" : "1:1 meeting"} color={resolved ? color : "red"} block /></m.div>
      </div>
      <p role="status" className={resolved ? "text-sm text-fg-grey-700" : "text-sm text-fg-red"}>{resolved ? (zh ? "15:00–16:00，冲突已解决" : "15:00–16:00, conflict resolved") : (zh ? "14:30–15:30，重叠 30 分钟" : "14:30–15:30, 30 minute overlap")}</p>
      <Button motion={motion} size="sm" color={color} variant={resolved ? "tertiary" : "primary"} aria-pressed={resolved} onClick={() => setResolved(!resolved)}>{resolved ? (zh ? "撤销调整" : "Undo change") : (zh ? "移至 15:00" : "Move to 15:00")}</Button>
    </div>
  </SurfaceCard>;
}

export function ApprovalWorkflowExample({ locale, color, motion }: FusionSettings) {
  const zh = locale === "zh";
  const [stage, setStage] = useState(1);
  const reduced = useReducedMotion();
  const names = zh ? ["林晓", "陈凡", "周宁"] : ["Alex Lin", "Chris Chen", "Jamie Zhou"];
  const roles = zh ? ["起草", "复核", "批准"] : ["Draft", "Review", "Approve"];
  return <SurfaceCard title={zh ? "品牌方案审批" : "Brand draft approval"}>
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">{names.map((name, i) => <div key={name} className="flex items-center gap-3"><div className="flex flex-col items-center gap-2"><Avatar src={portraits[i]} alt={name} /><span className="text-sm font-medium">{name}</span><span className="text-xs text-fg-grey-700">{roles[i]}</span><m.span animate={{ opacity: i < stage ? 1 : .25, scale: i < stage ? 1 : .85 }} transition={{ duration: reduced || motion === "none" ? 0 : .2 }}><CheckCircleLinear size={20} color={i < stage ? accent(color) : "var(--fg-grey-400)"} /></m.span></div>{i < 2 && <AltArrowRightLinear size={18} color="var(--fg-grey-500)" />}</div>)}</div>
      <p role="status" className="text-sm text-fg-grey-700">{stage === 3 ? (zh ? "审批完成" : "Approved") : (zh ? `等待${names[stage]}${roles[stage]}` : `Waiting for ${names[stage]} to ${roles[stage].toLowerCase()}`)}</p>
      <Button motion={motion} size="sm" color={color} onClick={() => setStage(stage === 3 ? 1 : stage + 1)}>{stage === 1 ? (zh ? "通过复核" : "Approve review") : stage === 2 ? (zh ? "最终批准" : "Final approval") : (zh ? "重置流程" : "Reset workflow")}</Button>
    </div>
  </SurfaceCard>;
}

export function WorkAssignmentExample({ locale, color, motion }: FusionSettings) {
  const zh = locale === "zh";
  const [loads, setLoads] = useState([2, 1, 3]);
  const [task, setTask] = useState(0);
  const [last, setLast] = useState<number | null>(null);
  const names = zh ? ["林晓", "陈凡", "周宁"] : ["Alex Lin", "Chris Chen", "Jamie Zhou"];
  const jobs = zh ? ["首页无障碍检查", "整理品牌规范", "检查移动端菜单", "统一图标样式"] : ["Homepage accessibility", "Tidy the brand guide", "Review the mobile menu", "Align the icon set"];
  const exhausted = loads.every(load => load >= 5);
  return <div className="flex w-full flex-col gap-4">
    <TaskCard width="full" title={exhausted ? (zh ? "成员容量已满" : "All members are at capacity") : jobs[task % jobs.length]} description={zh ? "选择有剩余容量的成员" : "Choose a member with available capacity"} progress={task / 9 * 100} progressColor={color === "black" ? "gray" : color} />
    {names.map((name, i) => <SurfaceCard key={name} padding="sm"><div className="flex items-center gap-3"><Avatar src={portraits[i]} alt={name} size="sm" /><span className="min-w-0 flex-1 text-sm font-medium">{name}</span><span className="text-xs text-fg-grey-700">{loads[i]} / 5</span><Button motion={motion} size="sm" variant="secondary" color={color} disabled={loads[i] >= 5} onClick={() => { setLoads(current => current.map((load, j) => i === j ? load + 1 : load)); setTask(task + 1); setLast(i); }}>{zh ? "分派" : "Assign"}</Button></div><div className="mt-3"><ProgressBar value={loads[i] / 5 * 100} color={color} /></div></SurfaceCard>)}
    <p role="status" className="text-xs text-fg-grey-700">{last === null ? (zh ? "尚未分派新任务" : "No new assignments") : (zh ? `已分派给${names[last]}` : `Assigned to ${names[last]}`)}</p>
    <Button motion={motion} size="sm" color="black" variant="tertiary" onClick={() => { setLoads([2, 1, 3]); setTask(0); setLast(null); }}>{zh ? "重置任务" : "Reset assignments"}</Button>
  </div>;
}

type PermissionRow = { id: string; name: string; permissions: boolean[]; locked?: boolean };
export function PermissionMatrixExample({ locale, color, motion }: FusionSettings) {
  const zh = locale === "zh";
  const [permissions, setPermissions] = useState([[true, true, true], [true, false, false], [true, false, false]]);
  const names = zh ? ["所有者", "编辑者", "访客"] : ["Owner", "Editor", "Guest"];
  const actions = zh ? ["查看", "编辑", "分享"] : ["View", "Edit", "Share"];
  const rows = names.map((name, i) => ({ id: String(i), name, permissions: permissions[i], locked: i === 0 }));
  const columns: ColumnDef<PermissionRow>[] = [{ key: "role", header: zh ? "角色" : "Role", render: row => row.name }, ...actions.map((label, action) => ({ key: String(action), header: label, render: (row: PermissionRow) => <Checkbox checked={row.permissions[action]} disabled={row.locked} color={color} motion={motion} aria-label={`${row.name} · ${label}`} onChange={checked => setPermissions(current => current.map((list, index) => index === Number(row.id) ? list.map((value, i) => i === action ? checked : value) : list))} /> }))];
  return <div className="w-full min-w-0"><DataTable title={zh ? "角色权限" : "Role permissions"} subtitle={zh ? "所有者保留全部权限" : "Owners retain all permissions"} columns={columns} rows={rows} color={color} showCheckbox={false} showPagination={false} getRowKey={row => row.id} tableMinWidth={360} /></div>;
}

export function CollaborationExample({ locale, color, motion }: FusionSettings) {
  const zh = locale === "zh";
  const people = ["design", "research", "engineering"].map((id, i) => ({ id, name: (zh ? ["设计智能体", "研究智能体", "工程智能体"] : ["Design agent", "Research agent", "Engineering agent"])[i], role: (zh ? ["交互设计", "资料研究", "组件实现"] : ["Design", "Research", "Implementation"])[i], avatar: portraits[i] }));
  const [ids, setIds] = useState(["design", "research"]);
  const [active, setActive] = useState("design");
  const [picked, setPicked] = useState<string[]>([]);
  const reduced = useReducedMotion();
  function remove(id: string) { const next = ids.filter(item => item !== id); setIds(next); if (active === id) setActive(next[0] ?? ""); }
  return <div className="flex w-full flex-col gap-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm font-semibold">{zh ? "协作成员" : "Collaborators"}</span><AvatarGroup>{people.filter(person => ids.includes(person.id)).map(person => <Avatar key={person.id} src={person.avatar} alt={person.name} size="sm" />)}</AvatarGroup></div>
    <div className="flex flex-wrap gap-3"><AnimatePresence initial={false}>{people.filter(person => ids.includes(person.id)).map(person => <m.div layout key={person.id} className="relative rounded-2xl border p-3" style={{ borderColor: active === person.id ? accent(color) : "var(--fg-grey-200)" }} initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .85 }} transition={{ duration: reduced || motion === "none" ? 0 : .25 }}>
      <button type="button" className="flex min-w-24 flex-col items-center gap-2 rounded-lg px-3 pb-1 pt-4 focus-visible:outline-2 focus-visible:outline-accent" aria-pressed={active === person.id} onClick={() => setActive(person.id)}><Avatar src={person.avatar} alt={person.name} /><span className="text-sm font-medium">{person.name}</span><span className="text-xs text-fg-grey-700">{active === person.id ? (zh ? "当前负责" : "Lead") : person.role}</span></button>
      <div className="absolute right-1 top-1"><IconButton motion={motion} size="sm" variant="ghost" color="black" aria-label={`${zh ? "移除" : "Remove"} ${person.name}`} onClick={() => remove(person.id)}><CloseCircleLinear size={16} /></IconButton></div>
    </m.div>)}</AnimatePresence></div>
    <AddMember members={people.filter(person => !ids.includes(person.id))} selectedIds={picked} onSelectionChange={setPicked} onAdd={next => { setIds(current => [...current, ...next]); if (!active) setActive(next[0] ?? ""); }} motion={motion} labels={zh ? undefined : { title: "Add collaborators", search: "Search members", empty: "All members added", add: "Add to team", adding: "Adding…", added: "Added", error: "Failed. Retry", select: "Select", remove: "Remove", selected: "Selected", viewAll: "View all", previous: "Previous", next: "Next" }} />
    <p role="status" className="text-xs text-fg-grey-700">{active ? `${zh ? "当前负责人" : "Current lead"}：${people.find(person => person.id === active)?.name}` : (zh ? "添加成员后选择负责人" : "Add a member to choose a lead")}</p>
  </div>;
}
