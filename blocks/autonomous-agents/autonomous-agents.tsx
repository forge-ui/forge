"use client";

import { useState, type FormEvent } from "react";
import { Button, Modal, PlusIcon, SelectOption, StatusBadge, TextArea, ToolbarSearchInput, cn, type StatusBadgeColor } from "@forge-ui-official/core";
import { PlayBoldDuotone, SettingsBoldDuotone } from "@forge-ui-official/core/icons";

export interface AutonomousAgent {
  id: string;
  name: string;
  initial: string;
  tone: string;
  scope: string;
  runtime: string;
  description: string;
  approval: string;
  knowledge: string;
  preset?: boolean;
}

export interface AutonomousTask {
  id: string;
  prompt: string;
  agent: string;
  time: string;
  status: { label: string; color: StatusBadgeColor };
}

export const defaultAutonomousAgents: AutonomousAgent[] = [
  { id: "general", name: "通用智能体", initial: "通", tone: "bg-fg-blue-50 text-fg-blue", scope: "通用", runtime: "Deep Agents", description: "开放目标，规划后完成调研、整理、分析与写作类任务。", approval: "危险操作才问", knowledge: "可选", preset: true },
  { id: "coding", name: "编程助手", initial: "编", tone: "bg-fg-violet-50 text-fg-violet", scope: "编程", runtime: "Codex", description: "读代码、排错、写改动方案与测试要点，适合仓库级开发任务。", approval: "每次写入前确认", knowledge: "可选", preset: true },
  { id: "ops", name: "运维分析", initial: "运", tone: "bg-fg-green-50 text-fg-green-500", scope: "运维", runtime: "Deep Agents", description: "整理告警与日志，给出根因假设和处置建议。", approval: "危险操作才问", knowledge: "建议挂载", preset: true },
  { id: "office", name: "办公助理", initial: "办", tone: "bg-fg-yellow-50 text-fg-yellow-600", scope: "办公", runtime: "Deep Agents", description: "整理材料、写纪要、周报与邮件，跟进待办清单。", approval: "发送前确认", knowledge: "建议挂载", preset: true },
  { id: "q3", name: "季度经营分析", initial: "季", tone: "bg-fg-red-50 text-fg-red", scope: "我的", runtime: "Deep Agents", description: "每季度汇总续约、流失与新签数据，起草管理层简报。", approval: "发送前确认", knowledge: "经营简报库" },
];

export const defaultAutonomousTasks: AutonomousTask[] = [
  { id: "t1", prompt: "整理第三季度客户续约与流失情况，起草管理层简报", agent: "季度经营分析", time: "11-09 10:52", status: { label: "等待确认", color: "yellow" } },
  { id: "t2", prompt: "排查订单服务 11-08 夜间的超时告警", agent: "运维分析", time: "11-09 09:14", status: { label: "已完成", color: "green" } },
  { id: "t3", prompt: "为订单筛选补充单元测试并修复空状态", agent: "编程助手", time: "11-08 17:40", status: { label: "运行中", color: "blue" } },
  { id: "t4", prompt: "汇总本周项目周报并发送给交付组", agent: "办公助理", time: "11-08 16:05", status: { label: "已完成", color: "green" } },
  { id: "t5", prompt: "调研三家竞品的定价方案变化", agent: "通用智能体", time: "11-07 11:22", status: { label: "失败", color: "red" } },
];

export interface AutonomousAgentsProps {
  agents?: AutonomousAgent[];
  tasks?: AutonomousTask[];
  onRun?: (agent: AutonomousAgent, prompt: string) => void;
  onCreate?: () => void;
  className?: string;
}

export function AutonomousAgents({ agents = defaultAutonomousAgents, tasks = defaultAutonomousTasks, onRun, onCreate, className }: AutonomousAgentsProps) {
  const [query, setQuery] = useState("");
  const [running, setRunning] = useState<AutonomousAgent | null>(null);
  const [prompt, setPrompt] = useState("");
  const [recent, setRecent] = useState(tasks);
  const match = (agent: AutonomousAgent) => `${agent.name} ${agent.description}`.includes(query.trim());
  const groups = [{ title: "系统预置", items: agents.filter(agent => agent.preset && match(agent)) }, { title: "我的", items: agents.filter(agent => !agent.preset && match(agent)) }].filter(group => group.items.length);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!running || !prompt.trim()) return;
    setRecent(current => [{ id: `t-${Date.now()}`, prompt: prompt.trim(), agent: running.name, time: "刚刚", status: { label: "运行中", color: "blue" } }, ...current]);
    onRun?.(running, prompt.trim());
    setRunning(null);
    setPrompt("");
  }

  return <section className={cn("flex min-w-0 flex-col gap-6", className)}>
    <div className="flex flex-wrap items-center justify-between gap-3"><ToolbarSearchInput className="w-full sm:w-72" value={query} onChange={setQuery} placeholder="搜索名称或说明" /><Button iconLeft={<PlusIcon size={16} />} onClick={onCreate}>新建自主智能体</Button></div>
    {groups.map(group => <div key={group.title} className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-fg-black">{group.title}</h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">{group.items.map(agent => <li key={agent.id} className="flex flex-col gap-3 rounded-card border border-fg-grey-200 bg-white p-5">
        <div className="flex items-center gap-3"><span className={cn("grid size-11 place-items-center rounded-xl text-base font-semibold", agent.tone)}>{agent.initial}</span><div className="min-w-0"><p className="truncate text-base font-semibold text-fg-black">{agent.name}</p><p className="text-xs text-fg-grey-700">{agent.scope} · {agent.runtime}</p></div></div>
        <p className="line-clamp-2 min-h-12 text-sm leading-6 text-fg-grey-700">{agent.description}</p>
        <dl className="grid grid-cols-2 gap-2 rounded-xl bg-fg-grey-50 p-3 text-xs"><div><dt className="text-fg-grey-700">人工确认</dt><dd className="mt-1 font-medium text-fg-black">{agent.approval}</dd></div><div><dt className="text-fg-grey-700">知识库</dt><dd className="mt-1 font-medium text-fg-black">{agent.knowledge}</dd></div></dl>
        <div className="mt-auto flex justify-end gap-2"><Button size="sm" variant="tertiary" iconLeft={<SettingsBoldDuotone size={16} />}>设置</Button><Button size="sm" iconLeft={<PlayBoldDuotone size={16} />} onClick={() => setRunning(agent)}>运行</Button></div>
      </li>)}</ul>
    </div>)}
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-fg-black">最近任务</h2>
      <ul className="flex flex-col divide-y divide-fg-grey-200 rounded-card border border-fg-grey-200 bg-white">{recent.map(task => <li key={task.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-fg-black">{task.prompt}</p><p className="mt-1 text-xs text-fg-grey-700">{task.agent} · {task.time}</p></div><StatusBadge {...task.status} variant="soft" /></li>)}</ul>
    </div>
    <Modal open={running !== null} onOpenChange={open => { if (!open) setRunning(null); }} title={running ? `运行「${running.name}」` : "运行"}>
      {running && <form className="flex flex-col gap-4" onSubmit={submit}>
        <TextArea label="任务目标" rows={4} value={prompt} onChange={setPrompt} placeholder="描述你要它完成什么，以及交付物的格式" />
        <SelectOption label="人工确认" shape="pill" options={[{ value: running.approval, label: running.approval }, { value: "每一步确认", label: "每一步确认" }, { value: "不需要确认", label: "不需要确认" }]} value={running.approval} />
        <div className="flex justify-end gap-3"><Button type="button" variant="tertiary" onClick={() => setRunning(null)}>取消</Button><Button type="submit" disabled={!prompt.trim()}>开始运行</Button></div>
      </form>}
    </Modal>
  </section>;
}
