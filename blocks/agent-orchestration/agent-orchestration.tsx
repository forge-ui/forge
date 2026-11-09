"use client";

import { useEffect, useState } from "react";
import { Button, Panel, StatusBadge, cn, type StatusBadgeColor } from "@forge-ui-official/core";
import { RestartCircleLinear } from "@forge-ui-official/core/icons";

export type OrchestrationState = "done" | "running" | "waiting" | "failed";

export interface OrchestrationAgent {
  id: string;
  name: string;
  role: string;
  state: OrchestrationState;
  cost: number;
  calls: { id: string; label: string; start: number; duration: number }[];
}

export interface AgentOrchestrationData {
  goal: string;
  orchestrator: { name: string; plan: string };
  agents: OrchestrationAgent[];
  totalSeconds: number;
}

export const defaultAgentOrchestration: AgentOrchestrationData = {
  goal: "为知意教育准备一份客户工作台方案：调研需求、测算报价、起草方案并做合规检查。",
  orchestrator: { name: "编排者", plan: "拆分为调研、报价、写作、审查四个子任务，调研与报价并行。" },
  agents: [
    { id: "research", name: "研究助手", role: "需求调研", state: "done", cost: 0.42, calls: [{ id: "r1", label: "检索客户档案", start: 0, duration: 8 }, { id: "r2", label: "读取会议纪要", start: 8, duration: 12 }, { id: "r3", label: "汇总需求清单", start: 20, duration: 10 }] },
    { id: "pricing", name: "报价助手", role: "成本测算", state: "done", cost: 0.18, calls: [{ id: "p1", label: "查询价格表", start: 2, duration: 6 }, { id: "p2", label: "运行报价模型", start: 8, duration: 16 }] },
    { id: "writer", name: "写作助手", role: "方案起草", state: "running", cost: 0.36, calls: [{ id: "w1", label: "生成大纲", start: 30, duration: 9 }, { id: "w2", label: "撰写正文", start: 39, duration: 21 }] },
    { id: "review", name: "合规审查", role: "条款检查", state: "waiting", cost: 0, calls: [{ id: "c1", label: "等待方案初稿", start: 60, duration: 12 }] },
  ],
  totalSeconds: 72,
};

const stateMeta: Record<OrchestrationState, { label: string; color: StatusBadgeColor; bar: string }> = {
  done: { label: "已完成", color: "green", bar: "bg-fg-green-500" },
  running: { label: "运行中", color: "blue", bar: "bg-fg-blue" },
  waiting: { label: "等待中", color: "grey", bar: "bg-fg-grey-300" },
  failed: { label: "失败", color: "red", bar: "bg-fg-red" },
};

function CallTimeline({ run, selected }: { run: AgentOrchestrationData; selected: string }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setRevealed(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return <ul className="flex flex-col gap-3">{run.agents.flatMap(agent => agent.calls.map(call => ({ agent, call }))).map(({ agent, call }) => <li key={call.id} className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 text-xs sm:grid-cols-[140px_minmax(0,1fr)]">
    <span className={cn("truncate", agent.id === selected ? "font-semibold text-fg-black" : "text-fg-grey-700")}>{call.label}</span>
    <span className="relative h-5 rounded-md bg-fg-grey-50"><span className={cn("absolute inset-y-0 rounded-md transition-[width,opacity] duration-700 ease-out", stateMeta[agent.state].bar, agent.id === selected ? "opacity-100" : "opacity-40")} style={{ left: `${(call.start / run.totalSeconds) * 100}%`, width: revealed ? `${(call.duration / run.totalSeconds) * 100}%` : "0%" }} /></span>
  </li>)}</ul>;
}

export interface AgentOrchestrationProps {
  run?: AgentOrchestrationData;
  className?: string;
}

export function AgentOrchestration({ run = defaultAgentOrchestration, className }: AgentOrchestrationProps) {
  const [selected, setSelected] = useState(run.agents.find(agent => agent.state === "running")?.id ?? run.agents[0].id);
  const [round, setRound] = useState(0);
  const active = run.agents.find(agent => agent.id === selected) ?? run.agents[0];
  const totalCost = run.agents.reduce((sum, agent) => sum + agent.cost, 0);
  const totalCalls = run.agents.reduce((sum, agent) => sum + agent.calls.length, 0);

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <Panel variant="template">
      <div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0 flex-1"><p className="text-xs text-fg-grey-700">编排目标</p><p className="mt-1 text-base font-semibold leading-7 text-fg-black">{run.goal}</p></div><Button variant="tertiary" iconLeft={<RestartCircleLinear size={16} />} onClick={() => setRound(current => current + 1)}>回放</Button></div>
      <dl className="grid grid-cols-2 gap-3 border-t border-fg-grey-200 pt-4 text-sm sm:grid-cols-4">{[["智能体", `${run.agents.length} 个`], ["工具调用", `${totalCalls} 次`], ["耗时", `${run.totalSeconds} 秒`], ["成本", `¥${totalCost.toFixed(2)}`]].map(([label, value]) => <div key={label}><dt className="text-xs text-fg-grey-700">{label}</dt><dd className="mt-1 font-semibold tabular-nums text-fg-black">{value}</dd></div>)}</dl>
    </Panel>
    <Panel variant="custom" className="forge-dot-canvas overflow-x-auto rounded-card border border-fg-grey-200 bg-fg-grey-50 p-6">
      <div className="mx-auto flex min-w-[720px] max-w-4xl flex-col items-center">
        <div className="w-72 rounded-2xl border border-fg-blue-300 bg-white p-4 text-center shadow-sm"><p className="text-sm font-semibold text-fg-black">{run.orchestrator.name}</p><p className="mt-1 text-xs leading-5 text-fg-grey-700">{run.orchestrator.plan}</p></div>
        <span className="h-6 w-px bg-fg-grey-300" />
        <div className="relative grid w-full grid-cols-4 gap-4 pt-6 before:absolute before:left-[12.5%] before:right-[12.5%] before:top-0 before:h-px before:bg-fg-grey-300">
          {run.agents.map(agent => <div key={agent.id} className="relative flex flex-col items-center before:absolute before:-top-6 before:h-6 before:w-px before:bg-fg-grey-300">
            <Button variant="unstyled" type="button" aria-pressed={agent.id === selected} onClick={() => setSelected(agent.id)} className={cn("w-full rounded-2xl border bg-white p-3 text-left transition-colors", agent.id === selected ? "border-fg-blue ring-2 ring-fg-blue-100" : "border-fg-grey-200 hover:border-fg-grey-400")}>
              <span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold text-fg-black">{agent.name}</span><span className={cn("size-2 shrink-0 rounded-full", stateMeta[agent.state].bar, agent.state === "running" && "animate-pulse")} /></span>
              <span className="mt-1 block text-xs text-fg-grey-700">{agent.role}</span>
              <span className="mt-2 block text-xs tabular-nums text-fg-grey-500">{agent.calls.length} 次调用 · ¥{agent.cost.toFixed(2)}</span>
            </Button>
          </div>)}
        </div>
      </div>
    </Panel>
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      <Panel variant="template" title="调用时间线" subtitle={`共 ${run.totalSeconds} 秒`}>
        <CallTimeline key={round} run={run} selected={selected} />
      </Panel>
      <Panel variant="template" title={active.name} subtitle={active.role} action={<StatusBadge label={stateMeta[active.state].label} color={stateMeta[active.state].color} variant="soft" />}>
        <ol className="flex flex-col gap-3">{active.calls.map((call, index) => <li key={call.id} className="flex items-center gap-3 text-sm"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-fg-grey-100 text-xs tabular-nums text-fg-grey-700">{index + 1}</span><span className="min-w-0 flex-1 truncate text-fg-black">{call.label}</span><span className="text-xs tabular-nums text-fg-grey-500">{call.duration}s</span></li>)}</ol>
        <p className="border-t border-fg-grey-200 pt-3 text-xs text-fg-grey-700">本智能体成本 ¥{active.cost.toFixed(2)}</p>
      </Panel>
    </div>
  </section>;
}
