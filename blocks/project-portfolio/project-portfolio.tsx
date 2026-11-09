"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Avatar, Breadcrumbs, Button, ButtonGroup, CardIconChip, CellMuted, CellProgressBar, CellText, CellTextSubtitle, ConfirmationDialog, DataTable, DonutChart, Grid, GridItem, IconButton, KebabMenu, PageTitleToolbar, ProgressBar, StatusBadge, SurfaceCard, Toolbar, ToolbarPillTabs, ToolbarSearchInput, ToolbarSelectDropdown, cardThemes, type ColumnDef } from "@forge-ui-official/core";
import { ArrowRightLinear, CalendarMinimalisticLinear, MagniferLinear, PenLinear, TrashBinMinimalisticLinear } from "@forge-ui-official/core/icons";

export type ProjectStatus = "planned" | "in_progress" | "paused" | "completed" | "cancelled";
export type ProjectPriority = "urgent" | "high" | "medium" | "low" | "none";

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  lead?: string;
  taskCount: number;
  closedCount: number;
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
}

export interface PortfolioTaskStats {
  pending: number;
  running: number;
  review: number;
  blocked: number;
  failed: number;
  done: number;
  nextAttention?: string;
}

export const defaultPortfolioProjects: PortfolioProject[] = [
  { id: "prj-site", title: "官网改版上线", description: "新版官网的页面、表单与埋点，月底前上线。", status: "in_progress", priority: "high", lead: "编程助手", taskCount: 12, closedCount: 8, createdAt: "2026-10-08", updatedAt: "2026-11-09" },
  { id: "prj-q3", title: "第三季度经营复盘", description: "汇总续约、流失与新签数据，输出管理层简报。", status: "in_progress", priority: "urgent", lead: "季度经营分析", taskCount: 6, closedCount: 2, createdAt: "2026-10-21", updatedAt: "2026-11-09" },
  { id: "prj-order", title: "订单中心稳定性治理", description: "排查夜间超时告警，调整对账任务与连接池。", status: "in_progress", priority: "urgent", lead: "运维分析", taskCount: 9, closedCount: 5, createdAt: "2026-10-30", updatedAt: "2026-11-08" },
  { id: "prj-kb", title: "售后知识库整理", description: "补齐退换货、发票与物流的标准答复。", status: "planned", priority: "medium", lead: "办公助理", taskCount: 8, closedCount: 0, createdAt: "2026-11-02", updatedAt: "2026-11-06" },
  { id: "prj-contract", title: "合同模板升级", description: "统一销售合同与保密协议的标准条款。", status: "paused", priority: "low", taskCount: 5, closedCount: 2, createdAt: "2026-09-18", updatedAt: "2026-10-27" },
  { id: "prj-recruit", title: "秋招简历初筛", description: "按岗位要求批量解析简历，输出面试名单。", status: "completed", priority: "medium", lead: "通用智能体", taskCount: 7, closedCount: 7, createdAt: "2026-09-02", updatedAt: "2026-10-15" },
];

export const defaultPortfolioTaskStats: PortfolioTaskStats = { pending: 9, running: 6, review: 3, blocked: 1, failed: 2, done: 24, nextAttention: "核对续约率口径与财务数据" };

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "planned", label: "计划中" },
  { value: "in_progress", label: "进行中" },
  { value: "paused", label: "已暂停" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];
const statusMeta: Record<ProjectStatus, { label: string; color: "grey" | "blue" | "yellow" | "green" | "red" }> = {
  planned: { label: "计划中", color: "grey" },
  in_progress: { label: "进行中", color: "blue" },
  paused: { label: "已暂停", color: "yellow" },
  completed: { label: "已完成", color: "green" },
  cancelled: { label: "已取消", color: "red" },
};
const priorityLabels: Record<ProjectPriority, string> = { urgent: "紧急", high: "高", medium: "中", low: "低", none: "无优先级" };
const archiveOptions = [{ value: "active", label: "未归档" }, { value: "archived", label: "已归档" }, { value: "all", label: "全部项目" }];

/** 智能体工场的品牌色是蓝色：把 core 默认的紫色色阶整体映射到蓝色 */
const brandBlue = Object.fromEntries(["", "-50", "-100", "-200", "-300", "-400", "-500", "-600", "-700", "-800", "-900"].flatMap(step => [[`--fg-violet${step}`, `var(--fg-blue${step})`], [`--color-fg-violet${step}`, `var(--fg-blue${step})`]])) as CSSProperties;

function percent(project: PortfolioProject) {
  return project.taskCount ? Math.round(project.closedCount / project.taskCount * 100) : 0;
}

function completionColor(value: number): "gray" | "blue" | "green" {
  return value >= 100 ? "green" : value >= 30 ? "blue" : "gray";
}

function monthDay(value: string) {
  const date = new Date(value);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function ChartLinearIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} aria-hidden><path d="M22 22H2" stroke="currentColor" strokeLinecap="round" /><path d="M21 22V14.5C21 13.6716 20.3284 13 19.5 13H16.5C15.6716 13 15 13.6716 15 14.5V22" stroke="currentColor" strokeLinecap="round" /><path d="M15 22V5C15 3.58579 15 2.87868 14.5607 2.43934C14.1213 2 13.4142 2 12 2C10.5858 2 9.87868 2 9.43934 2.43934C9 2.87868 9 3.58579 9 5V22" stroke="currentColor" strokeLinecap="round" /><path d="M9 22V9.5C9 8.67157 8.32843 8 7.5 8H4.5C3.67157 8 3 8.67157 3 9.5V22" stroke="currentColor" strokeLinecap="round" /></svg>;
}

function FolderWithFilesLinearIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} aria-hidden><path d="M18 10L13 10" stroke="currentColor" strokeLinecap="round" /><path d="M19.9998 6.23751C19.9989 5.94017 19.9946 5.76263 19.9743 5.60842C19.7971 4.26222 18.7378 3.2029 17.3916 3.02567C17.1966 3 16.9644 3 16.5 3H10" stroke="currentColor" strokeLinecap="round" /><path d="M2 6.94975C2 6.06722 2 5.62595 2.06935 5.25839C2.37464 3.64031 3.64031 2.37464 5.25839 2.06935C5.62595 2 6.06722 2 6.94975 2C7.33642 2 7.52976 2 7.71557 2.01738C8.51665 2.09229 9.27652 2.40704 9.89594 2.92051C10.0396 3.03961 10.1763 3.17633 10.4497 3.44975L11 4C11.8158 4.81578 12.2237 5.22367 12.7121 5.49543C12.9804 5.64471 13.2651 5.7626 13.5604 5.84678C14.0979 6 14.6747 6 15.8284 6H16.2021C17.9811 6 19.159 6 19.9998 6.23751C20.4031 6.35144 20.7288 6.52002 21.0062 6.76946C21.0849 6.84024 21.1598 6.91514 21.2305 6.99383C22 7.84935 22 9.16554 22 11.7979V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V6.94975Z" stroke="currentColor" strokeLinecap="round" /></svg>;
}

function DangerCircleLinearIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} aria-hidden><circle cx="12" cy="12" r="10" stroke="currentColor" strokeLinecap="round" /><path d="M12 7V13" stroke="currentColor" strokeLinecap="round" /><path d="M12 16H12.0001" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ArchiveLinearIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} aria-hidden><path d="M9 12C9 11.5341 9 11.3011 9.07612 11.1173C9.17761 10.8723 9.37229 10.6776 9.61732 10.5761C9.80109 10.5 10.0341 10.5 10.5 10.5H13.5C13.9659 10.5 14.1989 10.5 14.3827 10.5761C14.6277 10.6776 14.8224 10.8723 14.9239 11.1173C15 11.3011 15 11.5341 15 12C15 12.4659 15 12.6989 14.9239 12.8827C14.8224 13.1277 14.6277 13.3224 14.3827 13.4239C14.1989 13.5 13.9659 13.5 13.5 13.5H10.5C10.0341 13.5 9.80109 13.5 9.61732 13.4239C9.37229 13.3224 9.17761 13.1277 9.07612 12.8827C9 12.6989 9 12.4659 9 12Z" stroke="currentColor" strokeLinecap="round" /><path d="M20.5 7V13C20.5 16.7712 20.5 18.6569 19.3284 19.8284C18.1569 21 16.2712 21 12.5 21H11.5C7.72876 21 5.84315 21 4.67157 19.8284C3.5 18.6569 3.5 16.7712 3.5 13V7" stroke="currentColor" strokeLinecap="round" /><path d="M2 5C2 4.05719 2 3.58579 2.29289 3.29289C2.58579 3 3.05719 3 4 3H20C20.9428 3 21.4142 3 21.7071 3.29289C22 3.58579 22 4.05719 22 5C22 5.94281 22 6.41421 21.7071 6.70711C21.4142 7 20.9428 7 20 7H4C3.05719 7 2.58579 7 2.29289 6.70711C2 6.41421 2 5.94281 2 5Z" stroke="currentColor" strokeLinecap="round" /></svg>;
}


function Heading({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <div className="flex items-center gap-2.5"><CardIconChip icon={<span className="text-fg-grey-700">{icon}</span>} theme={cardThemes.white} themeKey="white" variant="greyBg" size={32} /><h2 className="text-sm font-medium text-fg-grey-700">{children}</h2></div>;
}

function InsetLink({ label, title, href }: { label: string; title: string; href?: string }) {
  const content = <><div className="min-w-0 flex-1"><p className="text-xs text-fg-grey-700">{label}</p><p className="mt-0.5 truncate text-sm font-medium text-fg-black" title={title}>{title}</p></div>{href ? <span className="shrink-0 text-fg-grey-500"><ArrowRightLinear size={16} /></span> : null}</>;
  const style = "flex min-w-0 items-center gap-2 rounded-xl bg-fg-grey-50 px-3 py-2";
  return href ? <a href={href} className={`${style} hover:bg-fg-grey-100`}>{content}</a> : <div className={style}>{content}</div>;
}

function Metric({ label, value }: { label: string; value: ReactNode }) {
  return <div className="min-w-0"><p className="text-xs text-fg-grey-700">{label}</p><p className="mt-1 text-lg font-semibold leading-6 tracking-fg text-fg-black">{value}</p></div>;
}

function Overview({ projects, stats }: { projects: PortfolioProject[]; stats: PortfolioTaskStats }) {
  const total = stats.pending + stats.running + stats.review + stats.blocked + stats.failed + stats.done;
  const completion = total ? Math.round(stats.done / total * 100) : 0;
  const recent = [...projects].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)).slice(0, 2);
  const distribution = statusOptions.map(status => ({ ...status, count: projects.filter(project => project.status === status.value).length })).filter(status => status.count);
  return <Grid columns={12} gap={16}>
    <GridItem span={{ base: 12, lg: 6, xl: 5 }}>
      <SurfaceCard padding="md" className="h-full" contentClassName="flex h-full min-h-72 flex-col gap-5">
        <Heading icon={<ChartLinearIcon size={18} />}>整体进度</Heading>
        <div className="flex items-end justify-between gap-3"><div><p className="text-3xl font-semibold leading-9 tracking-fg text-fg-black">{stats.done}<span className="ml-1.5 text-lg font-medium text-fg-grey-700">/ {total}</span></p><p className="mt-1 text-xs text-fg-grey-700">已完成任务 / 总任务</p></div><span className="rounded-full bg-fg-grey-50 px-2.5 py-1 text-sm font-medium text-fg-grey-700">{completion}% 完成</span></div>
        <div className="flex flex-1 flex-col justify-center gap-4" aria-label="任务完成进度">
          <ProgressBar value={completion} color={completionColor(completion)} size="sm" />
          <p className="text-sm text-fg-grey-700">{total ? `剩余 ${total - stats.done} 项任务尚未完成` : "当前项目暂无任务"}</p>
          <div className="flex items-center justify-between border-t border-fg-grey-100 pt-3 text-xs text-fg-grey-700"><span>受阻 {stats.blocked}</span><span>失败 {stats.failed}</span></div>
        </div>
        <div className="mt-auto flex justify-between gap-3 border-t border-fg-grey-100 pt-3"><Metric label="待开始" value={stats.pending} /><Metric label="进行中" value={stats.running} /><Metric label="待审核" value={stats.review} /></div>
      </SurfaceCard>
    </GridItem>
    <GridItem span={{ base: 12, lg: 6, xl: 4 }}>
      <SurfaceCard padding="md" className="h-full" contentClassName="flex h-full min-h-72 flex-col gap-5">
        <Heading icon={<FolderWithFilesLinearIcon size={18} />}>项目进展</Heading>
        <div><p className="text-3xl font-semibold leading-9 tracking-fg text-fg-black">{projects.filter(project => project.status === "in_progress").length}<span className="ml-1.5 text-lg font-medium text-fg-grey-700">/ {projects.length}</span></p><p className="mt-1 text-xs text-fg-grey-700">进行中项目 / 当前项目</p></div>
        <div className="flex flex-col gap-3" aria-label="项目状态分布">{distribution.length ? distribution.map(status => <div key={status.value} className="flex items-center gap-3 text-xs"><span className="w-12 shrink-0 text-fg-grey-700">{status.label}</span><div className="flex-1"><ProgressBar value={status.count / projects.length * 100} color={status.value === "completed" ? "green" : status.value === "in_progress" ? "blue" : "gray"} size="sm" /></div><span className="w-4 text-right font-medium text-fg-black">{status.count}</span></div>) : <p className="text-sm text-fg-grey-700">暂无项目</p>}</div>
        <div className="mt-auto flex flex-col gap-2 border-t border-fg-grey-100 pt-3"><p className="text-xs text-fg-grey-700">最近更新</p>{recent.map(project => <InsetLink key={project.id} label={`${statusMeta[project.status].label} · ${monthDay(project.updatedAt)}`} title={project.title} href={`#${project.id}`} />)}</div>
      </SurfaceCard>
    </GridItem>
    <GridItem span={{ base: 12, lg: 12, xl: 3 }}>
      <SurfaceCard padding="md" className="h-full" contentClassName="flex h-full min-h-72 flex-col gap-5">
        <Heading icon={<DangerCircleLinearIcon size={18} />}>需要关注</Heading>
        <div><p className="text-3xl font-semibold leading-9 tracking-fg text-fg-black">{stats.review + stats.blocked + stats.failed}</p><p className="mt-1 text-xs text-fg-grey-700">待审核、受阻与失败任务</p></div>
        <dl className="flex flex-1 flex-col justify-center divide-y divide-fg-grey-100">{[{ label: "待审核", count: stats.review }, { label: "受阻", count: stats.blocked }, { label: "失败", count: stats.failed }].map(item => <div key={item.label} className="flex items-center justify-between gap-2 py-3 first:pt-0"><dt className="text-sm font-medium text-fg-grey-700">{item.label}</dt><dd className="text-lg font-semibold text-fg-black">{item.count}</dd></div>)}</dl>
        <div className="mt-auto"><InsetLink label={stats.nextAttention ? "下一项待处理" : "待处理事项"} title={stats.nextAttention ?? "当前项目暂无待处理任务"} href={stats.nextAttention ? "#work-items" : undefined} /></div>
      </SurfaceCard>
    </GridItem>
  </Grid>;
}

function ProjectCard({ project, actions }: { project: PortfolioProject; actions: { label: string; onSelect: () => void; danger?: boolean }[] }) {
  const meta = statusMeta[project.status];
  const value = percent(project);
  return <div className="group min-w-0">
    <SurfaceCard padding="md" className="relative h-full" contentClassName="flex h-full min-h-60 flex-col gap-5">
      <div className="flex items-center justify-between gap-2">
        <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fg-grey-50 text-base font-semibold text-fg-grey-700">{Array.from(project.title)[0]}</span>
        <div className="relative shrink-0"><StatusBadge label={meta.label} color={meta.color} /><div className="absolute right-full top-1/2 z-20 mr-1 flex -translate-y-1/2 items-center opacity-100 xl:opacity-0 xl:group-hover:opacity-100 xl:group-focus-within:opacity-100"><KebabMenu accent="blue" items={actions} /></div></div>
      </div>
      <h3 className="min-w-0 text-base font-semibold text-fg-black"><a href={`#${project.id}`} title={[project.title, project.description].join("\n")} className="block truncate">{project.title}</a></h3>
      <div className="mt-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 shrink-0 [&_.absolute.rounded-full]:!h-4/5 [&_.absolute.rounded-full]:!w-4/5" aria-hidden><DonutChart size="sm" accent="blue" trackColor="var(--fg-grey-200)" segments={[{ value, color: completionColor(value) === "gray" ? "var(--fg-grey-400)" : `var(--fg-${completionColor(value)})` }]} /></div>
          <div><p className="text-base font-medium text-fg-black">{project.taskCount ? `${value}%` : "暂无任务"}</p><p className="text-xs text-fg-grey-700">已关闭</p></div>
        </div>
        <div className="text-right"><p className="text-base font-medium text-fg-black">{project.closedCount}/{project.taskCount}</p><p className="text-xs text-fg-grey-700">任务</p></div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-fg-grey-100 pt-3 text-xs text-fg-grey-600">
        <span className="inline-flex min-w-0 items-center gap-2">{project.lead ? <Avatar initials={project.lead.slice(0, 1)} size="xs" alt={project.lead} /> : null}<span className="truncate">{project.lead ?? "未分配"}</span></span>
        <span className="inline-flex items-center gap-1 whitespace-nowrap"><CalendarMinimalisticLinear size={12} />更新 {monthDay(project.updatedAt)}</span>
      </div>
    </SurfaceCard>
  </div>;
}

export interface ProjectPortfolioProps {
  projects?: PortfolioProject[];
  stats?: PortfolioTaskStats;
  className?: string;
}

export function ProjectPortfolio({ projects: initialProjects = defaultPortfolioProjects, stats = defaultPortfolioTaskStats, className = "" }: ProjectPortfolioProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [view, setView] = useState(0);
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [archive, setArchive] = useState("active");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [deleting, setDeleting] = useState<PortfolioProject | null>(null);
  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return projects.filter(project => (archive === "all" || (archive === "archived") === Boolean(project.archived))
      && (status === "all" || project.status === status)
      && (!text || `${project.title} ${project.description}`.toLowerCase().includes(text)));
  }, [projects, archive, status, query]);
  const attention = filtered.filter(project => project.priority === "urgent" && project.status !== "completed").length;
  const setArchived = (project: PortfolioProject, archived: boolean) => setProjects(current => current.map(item => item.id === project.id ? { ...item, archived } : item));
  const actions = (project: PortfolioProject) => [
    { label: "编辑项目", onSelect: () => undefined },
    { label: project.archived ? "取消归档" : "归档", onSelect: () => setArchived(project, !project.archived) },
    { label: "删除项目", danger: true, onSelect: () => setDeleting(project) },
  ];
  const columns: ColumnDef<PortfolioProject>[] = [
    { key: "title", header: "项目", width: "w-[24%]", render: row => <a href={`#${row.id}`} className="block min-w-0 max-w-full text-left"><CellTextSubtitle title={row.title} subtitle={[row.archived ? "已归档" : "", row.description].filter(Boolean).join(" · ")} /></a> },
    { key: "status", header: "状态", width: "w-[12%]", render: row => <StatusBadge label={statusMeta[row.status].label} color={statusMeta[row.status].color} /> },
    { key: "priority", header: "优先级", width: "w-[12%]", render: row => row.priority === "none" ? <CellMuted>—</CellMuted> : <CellText>{priorityLabels[row.priority]}</CellText> },
    { key: "progress", header: "进度", width: "w-[16%]", render: row => row.taskCount ? <CellProgressBar value={`${row.closedCount}/${row.taskCount}`} percent={percent(row)} color={completionColor(percent(row))} /> : <CellMuted>暂无任务</CellMuted> },
    { key: "lead", header: "负责人", width: "w-[16%]", render: row => row.lead ? <CellText>{row.lead}</CellText> : <CellMuted>—</CellMuted> },
    { key: "created", header: "创建时间", width: "w-[12%]", render: row => <span className="whitespace-nowrap text-sm text-fg-grey-700">{monthDay(row.createdAt)}</span> },
    { key: "actions", header: "操作", width: "w-28", render: row => <div className="flex items-center justify-end gap-2">
      <IconButton color="blue" variant="ghost" shape="square" size="sm" aria-label="编辑" disabled={row.archived}><PenLinear size={16} /></IconButton>
      <IconButton color="blue" variant="ghost" shape="square" size="sm" aria-label={row.archived ? "取消归档" : "归档"} onClick={() => setArchived(row, !row.archived)}><ArchiveLinearIcon size={16} /></IconButton>
      <IconButton color="blue" variant="ghost" shape="square" size="sm" aria-label="删除" onClick={() => setDeleting(row)}><TrashBinMinimalisticLinear size={16} /></IconButton>
    </div> },
  ];

  return <div style={brandBlue} className={`flex min-w-0 flex-col gap-5 ${className}`}>
    <PageTitleToolbar
      title="项目总览"
      breadcrumbs={<Breadcrumbs color="blue" items={[{ label: "工作台", href: "#overview" }, { label: "工作区", href: "#projects" }, { label: "项目" }]} />}
      askAi={{ placeholder: "问问项目进展…", suggestions: ["哪些项目需要关注？", "本周完成了多少任务？"], onSend: () => "需要关注的是「第三季度经营复盘」和「订单中心稳定性治理」：两个都是紧急优先级，前者有 2 项任务待审核，后者有 1 项任务失败待重跑。" }}
      actions={<Button color="blue" size="lg">新建项目</Button>}
      className="flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:gap-4 [&>div:first-child]:w-full [&>div:first-child]:min-w-0"
    />
    <Overview projects={filtered} stats={stats} />
    <Toolbar
      className="flex-wrap gap-3 sm:items-center"
      left={<div className="shrink-0"><h2 className="text-lg font-semibold text-fg-black">项目</h2><p className="mt-1 text-xs text-fg-grey-700">{filtered.length} 个项目 · {attention} 个需关注</p></div>}
      right={<div className="flex w-full min-w-0 max-w-full flex-wrap items-center justify-end gap-2 xl:w-auto">
        <ToolbarPillTabs color="blue" tabs={[{ label: "全部", active: status === "all" }, ...statusOptions.map(item => ({ label: item.label, active: status === item.value }))]} onChange={index => setStatus(index === 0 ? "all" : statusOptions[index - 1].value)} />
        {searchOpen || query ? <ToolbarSearchInput className="sm:!w-40 sm:!max-w-40" ariaLabel="搜索项目" placeholder="搜索项目" value={query} onChange={setQuery} /> : <IconButton aria-label="展开项目搜索" title="搜索项目" color="blue" variant="ghost" onClick={() => setSearchOpen(true)}><MagniferLinear size={18} /></IconButton>}
        <ToolbarSelectDropdown value={archive} options={archiveOptions} onChange={setArchive} />
        <ButtonGroup color="blue" items={[{ label: "卡片" }, { label: "表格" }]} activeIndex={view} onChange={setView} />
      </div>}
    />
    {view === 0 && filtered.length ? <Grid columns={{ base: 1, lg: 2, xl: 3 }} gap={16}>{filtered.map(project => <ProjectCard key={project.id} project={project} actions={actions(project)} />)}</Grid>
      : <DataTable color="blue" columns={columns} rows={filtered} getRowKey={row => row.id} tableMinWidth={860}
        emptyState={<div className="flex flex-col items-center gap-3 py-6 text-sm text-fg-grey-700"><p>没有匹配的项目</p><Button color="blue" size="sm" variant="tertiary" onClick={() => { setQuery(""); setStatus("all"); setArchive("active"); }}>清除筛选</Button></div>} />}
    {deleting ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <ConfirmationDialog title="删除项目？" description={`删除「${deleting.title}」后，项目下的任务会保留在「我的任务」里。`} color="red" confirmLabel="删除" cancelLabel="取消" onCancel={() => setDeleting(null)} onConfirm={() => { setProjects(current => current.filter(item => item.id !== deleting.id)); setDeleting(null); }} />
    </div> : null}
  </div>;
}
