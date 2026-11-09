"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Breadcrumbs, Button, Checkbox, ConfirmationDialog, Grid, Modal, PageTitleToolbar, PlusIcon, RadioWithLabel, SelectOption, StatusBadge, SurfaceCard, TextArea, TextField } from "@forge-ui-official/core";

export type ApprovalMode = "none" | "on_risky_tool" | "before_final";
export type TaskStatus = "waiting_approval" | "waiting_input" | "running" | "queued" | "succeeded" | "failed" | "cancelled";

export interface AutonomousAgent {
  id: string;
  name: string;
  avatar: string;
  category: string;
  runtime: string;
  description: string;
  approval: ApprovalMode;
  model: string;
  source: "system" | "user";
  knowledge?: "required" | "recommended" | "optional";
  parentId?: string;
}

export interface AutonomousTask {
  id: string;
  goal: string;
  agentId: string;
  createdAt: string;
  status: TaskStatus;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  documents: number;
}

export const defaultAutonomousAgents: AutonomousAgent[] = [
  { id: "general-assistant", name: "通用智能体", avatar: "/images/blocks/agents/observatory-robot.webp", category: "通用", runtime: "Deep Agents", description: "开放目标，规划后完成调研、整理、分析、写作等各类任务。", approval: "on_risky_tool", model: "DeepSeek-V4", source: "system", knowledge: "optional" },
  { id: "coding-assistant", name: "编程助手", avatar: "/images/blocks/agents/music-box-robot.webp", category: "编程", runtime: "Codex", description: "读代码、排错、写改动方案与测试要点。适合仓库级开发任务。", approval: "on_risky_tool", model: "GPT-5.4 Codex", source: "system", knowledge: "optional" },
  { id: "ops-analyst", name: "运维分析", avatar: "/images/blocks/agents/lighthouse-lantern-room.webp", category: "运维", runtime: "Deep Agents", description: "整理告警与日志，给出根因假设和处置建议。", approval: "on_risky_tool", model: "默认模型", source: "system", knowledge: "recommended" },
  { id: "office-assistant", name: "办公助理", avatar: "/images/blocks/agents/deer-warm-tiny-smile-right.webp", category: "办公", runtime: "Deep Agents", description: "处理日常办公事务：整理材料、写纪要/周报/邮件、做清单与跟进。", approval: "on_risky_tool", model: "Qwen3.5-Plus", source: "system", knowledge: "recommended" },
  { id: "quarterly-review", name: "季度经营分析", avatar: "/images/blocks/agents/soft-charcoal-bear.webp", category: "我的", runtime: "Deep Agents", description: "每季度汇总续约、流失与新签数据，起草管理层简报。", approval: "before_final", model: "DeepSeek-V4", source: "user", parentId: "general-assistant" },
  { id: "contract-review", name: "合同审阅助手", avatar: "/images/blocks/agents/black-bear.webp", category: "我的", runtime: "Deep Agents", description: "比对合同模板，标注风险条款与修改建议，输出审阅意见。", approval: "before_final", model: "Qwen3.5-Plus", source: "user", parentId: "office-assistant" },
  { id: "gallery-check", name: "图库验收助手", avatar: "/images/blocks/agents/friendly-ghost.webp", category: "我的", runtime: "Grok Build", description: "按验收清单检查新上架商品图的尺寸、背景与水印。", approval: "on_risky_tool", model: "默认模型", source: "user" },
];

export const defaultAutonomousTasks: AutonomousTask[] = [
  { id: "task-0412", goal: "整理第三季度客户续约与流失情况，起草管理层简报", agentId: "quarterly-review", createdAt: "2026/11/09 10:52", status: "waiting_approval" },
  { id: "task-0411", goal: "排查订单服务 11 月 8 日夜间的超时告警，给出根因与处置建议", agentId: "ops-analyst", createdAt: "2026/11/09 09:14", status: "succeeded" },
  { id: "task-0410", goal: "为订单筛选补充单元测试并修复空状态展示", agentId: "coding-assistant", createdAt: "2026/11/08 17:40", status: "running" },
  { id: "task-0409", goal: "汇总本周项目周报并发送给交付组", agentId: "office-assistant", createdAt: "2026/11/08 16:05", status: "waiting_input" },
  { id: "task-0408", goal: "调研三家竞品的定价方案变化，整理对比表", agentId: "general-assistant", createdAt: "2026/11/07 11:22", status: "failed" },
];

export const defaultKnowledgeBases: KnowledgeBase[] = [
  { id: "kb-after-sales", name: "售后服务手册", documents: 48 },
  { id: "kb-contract", name: "合同模板库", documents: 32 },
  { id: "kb-ops", name: "运维值班手册", documents: 21 },
];

const approvalLabels: Record<ApprovalMode, string> = { none: "不拦", on_risky_tool: "危险操作才问", before_final: "出结果前确认" };
const approvalOptions: { value: ApprovalMode; label: string }[] = [
  { value: "on_risky_tool", label: "危险操作才问（推荐）" },
  { value: "none", label: "不拦" },
  { value: "before_final", label: "出结果前确认" },
];
const knowledgeLabels = { required: "必选", recommended: "建议", optional: "可选" };
const statusMeta: Record<TaskStatus, { label: string; color: "yellow" | "blue" | "green" | "red" | "grey" }> = {
  waiting_approval: { label: "待确认", color: "yellow" },
  waiting_input: { label: "等待对话", color: "yellow" },
  running: { label: "运行中", color: "blue" },
  queued: { label: "排队中", color: "blue" },
  succeeded: { label: "已完成", color: "green" },
  failed: { label: "失败", color: "red" },
  cancelled: { label: "已取消", color: "grey" },
};

/** 智能体工场的品牌色是蓝色：把 core 默认的紫色色阶整体映射到蓝色 */
const brandBlue = Object.fromEntries(["", "-50", "-100", "-200", "-300", "-400", "-500", "-600", "-700", "-800", "-900"].flatMap(step => [[`--fg-violet${step}`, `var(--fg-blue${step})`], [`--color-fg-violet${step}`, `var(--fg-blue${step})`]])) as CSSProperties;

function ProfileCard({ agent, footer, onRun, onDelete }: { agent: AutonomousAgent; footer: ReactNode; onRun: () => void; onDelete?: () => void }) {
  return <SurfaceCard padding="sm" className="relative h-full" contentClassName="flex h-full flex-col gap-3">
    <div className="flex items-start gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={agent.avatar} alt="" className="size-10 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <p className="break-words text-base font-semibold text-fg-black">{agent.name}</p>
        <p className="mt-1 truncate text-xs text-fg-grey-500">{agent.category} · {agent.runtime}</p>
      </div>
    </div>
    <p className="line-clamp-2 text-sm leading-6 text-fg-grey-700">{agent.description}</p>
    <p className="text-xs text-fg-grey-500">{approvalLabels[agent.approval]} · {agent.model}</p>
    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-fg-grey-100 pt-3">
      <div className="text-xs text-fg-grey-600">{footer}</div>
      <div className="flex flex-wrap gap-2">
        <Button color="blue" variant="tertiary" size="sm">设置</Button>
        <Button color="blue" size="sm" onClick={onRun}>运行</Button>
        {onDelete ? <Button color="red" variant="tertiary" size="sm" onClick={onDelete}>删除</Button> : null}
      </div>
    </div>
  </SurfaceCard>;
}

function RunTaskDialog({ agents, knowledge, agentId, onClose, onSubmit }: { agents: AutonomousAgent[]; knowledge: KnowledgeBase[]; agentId: string | null; onClose: () => void; onSubmit: (task: AutonomousTask) => void }) {
  const [profileId, setProfileId] = useState(agentId ?? agents[0]?.id ?? "");
  const [goal, setGoal] = useState("");
  const [materials, setMaterials] = useState("");
  const [selectedKnowledge, setSelectedKnowledge] = useState<string[]>([]);
  const [mode, setMode] = useState<"once" | "session">("once");
  const [dispatcher, setDispatcher] = useState(false);
  const [routes, setRoutes] = useState("");
  const [approval, setApproval] = useState<ApprovalMode>("on_risky_tool");
  const [goalError, setGoalError] = useState("");
  const profile = agents.find(agent => agent.id === profileId);

  function submit() {
    if (!goal.trim()) { setGoalError("请填写任务目标"); return; }
    onSubmit({ id: `task-${agents.length}-${goal.length}`, goal: goal.trim(), agentId: profileId, createdAt: "刚刚", status: "queued" });
  }

  return <Modal open onOpenChange={open => { if (!open) onClose(); }} title="发起任务" width="w-[640px]" footer={<div className="flex justify-end gap-2">
    <Button color="blue" variant="secondary" onClick={onClose}>取消</Button>
    <Button color="blue" disabled={!profile} onClick={submit}>提交并后台执行</Button>
  </div>}>
    <div className="flex flex-col gap-4">
      <SelectOption color="blue" label="自主智能体" width="100%" className="w-full" value={profileId} onChange={setProfileId} options={agents.map(agent => ({ value: agent.id, label: agent.name + (agent.source === "user" ? "（我的）" : "") }))} />
      {profile ? <p className="text-xs text-fg-grey-600">{profile.description} · 默认：{approvalLabels[profile.approval]}</p> : null}
      <TextArea color="blue" label="任务目标" value={goal} rows={3} state={goalError ? "error" : "idle"} errorMessage={goalError} onChange={value => { setGoal(value); setGoalError(""); }} placeholder="用一句话说清要完成什么，以及怎样算做完" />
      <TextArea color="blue" label="补充材料（可选）" value={materials} rows={3} onChange={setMaterials} placeholder="背景、约束、参考内容、相关链接或摘录…" />
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-fg-black">知识库（{knowledgeLabels[profile?.knowledge ?? "optional"]}）</span>
        {knowledge.length ? <div className="flex max-h-36 flex-col gap-2 overflow-y-auto">
          {knowledge.map(base => <label key={base.id} className="flex items-center gap-2 text-sm">
            <Checkbox color="blue" aria-label={base.name} checked={selectedKnowledge.includes(base.id)} onChange={() => setSelectedKnowledge(current => current.includes(base.id) ? current.filter(id => id !== base.id) : [...current, base.id])} />
            <span>{base.name} <span className="text-xs text-fg-grey-500">{base.documents} 文档</span></span>
          </label>)}
        </div> : <p className="text-xs text-fg-grey-600">你暂时没有可读的知识库</p>}
      </div>
      <div role="radiogroup" aria-label="执行模式" className="flex flex-col gap-2">
        <span className="text-sm font-medium text-fg-black">执行模式</span>
        <RadioWithLabel color="blue" label="单次执行" checked={mode === "once"} onChange={() => setMode("once")} />
        <RadioWithLabel color="blue" label="短会话（任务详情可追问）" checked={mode === "session"} onChange={() => setMode("session")} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox color="blue" aria-label="作为调度员" checked={dispatcher} onChange={setDispatcher} />
        <span>作为调度员（输出 route，供流程分支）</span>
      </label>
      {dispatcher ? <TextField color="blue" label="允许的走向" value={routes} onChange={setRoutes} placeholder="pass, fail, other" /> : null}
      <div role="radiogroup" aria-label="本次人工确认" className="flex flex-col gap-2">
        <span className="text-sm font-medium text-fg-black">本次人工确认</span>
        {approvalOptions.map(option => <RadioWithLabel key={option.value} color="blue" label={option.label} checked={approval === option.value} onChange={() => setApproval(option.value)} />)}
      </div>
    </div>
  </Modal>;
}

export interface AutonomousAgentsProps {
  agents?: AutonomousAgent[];
  tasks?: AutonomousTask[];
  knowledge?: KnowledgeBase[];
  className?: string;
}

export function AutonomousAgents({ agents: initialAgents = defaultAutonomousAgents, tasks: initialTasks = defaultAutonomousTasks, knowledge = defaultKnowledgeBases, className = "" }: AutonomousAgentsProps) {
  const [agents, setAgents] = useState(initialAgents);
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [running, setRunning] = useState<string | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<AutonomousAgent | null>(null);
  const query = search.trim().toLowerCase();
  const visible = useMemo(() => agents.filter(agent => !query || `${agent.name} ${agent.description}`.toLowerCase().includes(query)), [agents, query]);
  const systemAgents = visible.filter(agent => agent.source === "system");
  const userAgents = visible.filter(agent => agent.source === "user");
  const nameOf = (id: string) => agents.find(agent => agent.id === id)?.name ?? id;

  return <div style={brandBlue} className={`flex min-w-0 flex-col gap-6 ${className}`}>
    <PageTitleToolbar
      title="自主智能体"
      subtitle="选择自主智能体发起任务；执行环境在侧栏「运行时」中管理。"
      breadcrumbs={<Breadcrumbs color="blue" items={[{ label: "工作台", href: "#overview" }, { label: "智能体", href: "#apps" }, { label: "自主智能体" }]} />}
      askAi={{ placeholder: "问问自主智能体…", suggestions: ["哪个智能体适合整理周报？", "最近失败的任务是什么原因？"], onSend: () => "整理周报建议用「办公助理」，它默认挂载办公知识库，发送前会请你确认。最近失败的竞品调研任务是外部网页超时，重新运行即可。" }}
      actions={<Button color="blue" size="lg" iconLeft={<PlusIcon size={16} />}>新建自主智能体</Button>}
      className="flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:gap-4 [&>div:first-child]:w-full [&>div:first-child]:min-w-0"
    />
    <div className="w-full sm:max-w-sm"><TextField color="blue" aria-label="搜索自主智能体" placeholder="搜索名称或说明" value={search} onChange={setSearch} /></div>
    {query ? <div><Button color="blue" variant="tertiary" size="sm" onClick={() => setSearch("")}>清除搜索</Button></div> : null}

    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-fg-black">系统预置</h2>
        {systemAgents.length ? <Grid columns={{ base: 1, md: 2, xl: 3 }} gap={16}>
          {systemAgents.map(agent => <ProfileCard key={agent.id} agent={agent} footer={<span>知识库：{knowledgeLabels[agent.knowledge ?? "optional"]}</span>} onRun={() => setRunning(agent.id)} />)}
        </Grid> : <p className="text-sm text-fg-grey-500">当前筛选无结果</p>}
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-fg-black">我的</h2>
        {userAgents.length ? <Grid columns={{ base: 1, md: 2, xl: 3 }} gap={16}>
          {userAgents.map(agent => <ProfileCard key={agent.id} agent={agent} footer={<span>{agent.parentId ? `基于 ${nameOf(agent.parentId)}` : "自建"}</span>} onRun={() => setRunning(agent.id)} onDelete={() => setDeleting(agent)} />)}
        </Grid> : <p className="text-sm text-fg-grey-600">{query ? "当前筛选无结果" : "还没有自定义的自主智能体，可点击新建。"}</p>}
      </section>
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-fg-black">最近任务</h2>
          <Button color="blue" variant="tertiary" size="sm">全部</Button>
        </div>
        <ul className="divide-y divide-fg-grey-100 overflow-hidden rounded-2xl border border-fg-grey-200 bg-white">
          {tasks.map(task => <li key={task.id}>
            <a href={`#${task.id}`} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-fg-grey-50">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-fg-black">{task.goal}</div>
                <div className="mt-0.5 truncate text-xs text-fg-grey-500">{nameOf(task.agentId)} · {task.createdAt}</div>
              </div>
              <StatusBadge label={statusMeta[task.status].label} color={statusMeta[task.status].color} />
            </a>
          </li>)}
        </ul>
      </section>
    </div>

    {running !== undefined ? <RunTaskDialog agents={agents} knowledge={knowledge} agentId={running} onClose={() => setRunning(undefined)} onSubmit={task => { setTasks(current => [task, ...current]); setRunning(undefined); }} /> : null}
    {deleting ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <ConfirmationDialog title="删除自主智能体" description={`确定删除「${deleting.name}」？历史任务不受影响。`} color="red" confirmLabel="删除" cancelLabel="取消" onConfirm={() => { setAgents(current => current.filter(agent => agent.id !== deleting.id)); setDeleting(null); }} onCancel={() => setDeleting(null)} />
    </div> : null}
  </div>;
}
