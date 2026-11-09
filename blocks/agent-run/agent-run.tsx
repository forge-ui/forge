"use client";

import { useEffect, useState } from "react";
import { AgentTaskRows, ApprovalCard, Button, Panel, StatusBadge, StreamingAnswer, ThinkingTrace, ToolChips, cn, type AgentTask, type ToolChipItem } from "@forge-ui-official/core";
import { RestartCircleLinear, StopBold } from "@forge-ui-official/core/icons";

export interface AgentRunStep {
  id: string;
  title: string;
  meta: string;
  tool: ToolChipItem;
}

export interface AgentRunData {
  prompt: string;
  agent: string;
  runtime: string;
  steps: AgentRunStep[];
  approvalAfter: number;
  approval: { prompt: string; options: { id: string; label: string }[] };
  draft: string;
}

export const defaultAgentRun: AgentRunData = {
  prompt: "整理第三季度客户续约与流失情况，起草给管理层的简报，发送前请我确认。",
  agent: "研究助手",
  runtime: "Deep Agents",
  steps: [
    { id: "s1", title: "拉取第三季度续约与流失数据", meta: "CRM · 1,286 条客户记录", tool: { id: "t1", kind: "read", label: "查询客户数据", chip: "crm.query(Q3)", mono: true, detail: [{ text: "续约 312 · 流失 41 · 新签 86" }] } },
    { id: "s2", title: "读取上季度简报的结构", meta: "知识库 · 经营简报模板", tool: { id: "t2", kind: "read", label: "检索知识库", chip: "knowledge.search", mono: true, detail: [{ text: "命中 3 篇，选用《Q2 经营简报》" }] } },
    { id: "s3", title: "计算续约率与流失原因分布", meta: "数据分析", tool: { id: "t3", kind: "run", label: "运行分析脚本", chip: "python analyze.py", mono: true, detail: [{ text: "续约率 88.4%（+2.1%）", tone: "add" }, { text: "价格敏感流失 17 家", tone: "del" }] } },
    { id: "s4", title: "起草管理层简报", meta: "等待你确认后发送", tool: { id: "t4", kind: "write", label: "生成简报草稿", chip: "brief-q3.md", mono: true } },
    { id: "s5", title: "发送给管理层并归档", meta: "邮件 · 知识库", tool: { id: "t5", kind: "edit", label: "发送并归档", chip: "mail.send", mono: true } },
  ],
  approvalAfter: 3,
  approval: { prompt: "简报草稿已生成，下一步发送给管理层邮件组。是否继续？", options: [{ id: "send", label: "确认发送" }, { id: "hold", label: "先不发送，我再改改" }] },
  draft: "## 第三季度客户续约简报\n\n- **续约率 88.4%**，较上季度提升 2.1 个百分点，主要来自企业年度订阅。\n- **流失 41 家**，其中 17 家因价格敏感，建议针对中小客户推出季度套餐。\n- **新签 86 家**，教育与零售行业贡献 54%。\n\n下季度重点：把续约提醒提前到到期前 45 天，并为高风险客户配置专属客户经理。",
};

type Phase = "running" | "waiting" | "finishing" | "done" | "stopped";

export interface AgentRunProps {
  run?: AgentRunData;
  stepDuration?: number;
  onApprove?: (answer: string[]) => void;
  className?: string;
}

export function AgentRun({ run = defaultAgentRun, stepDuration = 1400, onApprove, className }: AgentRunProps) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("running");
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (phase !== "running" && phase !== "finishing") return;
    const timer = window.setTimeout(() => {
      if (phase === "running" && step + 1 >= run.approvalAfter) { setStep(run.approvalAfter); setPhase("waiting"); return; }
      if (step + 1 >= run.steps.length) { setStep(run.steps.length); setPhase("done"); return; }
      setStep(current => current + 1);
    }, stepDuration);
    return () => window.clearTimeout(timer);
  }, [phase, step, run.approvalAfter, run.steps.length, stepDuration]);

  function restart() {
    setStep(0);
    setPhase("running");
    setRound(current => current + 1);
  }

  function approve(answers: Record<string, string[]>) {
    const answer = answers.approval ?? [];
    onApprove?.(answer);
    if (answer.includes("send")) setPhase("finishing");
    else setPhase("stopped");
  }

  const tasks: AgentTask[] = run.steps
    .map((item, index) => ({ id: item.id, title: item.title, meta: item.meta, status: phase === "done" || index < step ? "completed" as const : phase === "stopped" ? "failed" as const : "running" as const }))
    .filter((_, index) => phase === "done" || index <= step);
  const visibleTools = run.steps.slice(0, Math.min(step + (phase === "running" || phase === "finishing" ? 1 : 0), run.steps.length)).map((item, index) => ({ ...item.tool, status: index < step ? "complete" as const : "running" as const }));
  const statusMeta = { running: { label: "运行中", color: "blue" as const }, waiting: { label: "等待确认", color: "yellow" as const }, finishing: { label: "运行中", color: "blue" as const }, done: { label: "已完成", color: "green" as const }, stopped: { label: "已暂停", color: "grey" as const } }[phase];
  const showDraft = step >= run.approvalAfter;

  return <section className={cn("flex min-w-0 flex-col gap-4", className)}>
    <Panel variant="template">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><StatusBadge {...statusMeta} variant="soft" /><span className="text-xs text-fg-grey-700">{run.agent} · {run.runtime}</span></div><p className="mt-2 text-base font-semibold leading-7 text-fg-black">{run.prompt}</p></div>
        <div className="flex gap-2">{phase === "running" || phase === "finishing" ? <Button variant="tertiary" iconLeft={<StopBold size={14} />} onClick={() => setPhase("stopped")}>停止</Button> : <Button variant="tertiary" iconLeft={<RestartCircleLinear size={16} />} onClick={restart}>重新运行</Button>}</div>
      </div>
      <dl className="grid grid-cols-3 gap-3 border-t border-fg-grey-200 pt-4 text-sm"><div><dt className="text-xs text-fg-grey-700">步骤</dt><dd className="mt-1 font-semibold tabular-nums text-fg-black">{Math.min(step, run.steps.length)} / {run.steps.length}</dd></div><div><dt className="text-xs text-fg-grey-700">工具调用</dt><dd className="mt-1 font-semibold tabular-nums text-fg-black">{visibleTools.length}</dd></div><div><dt className="text-xs text-fg-grey-700">预估成本</dt><dd className="mt-1 font-semibold tabular-nums text-fg-black">¥{(0.18 * Math.max(1, step)).toFixed(2)}</dd></div></dl>
    </Panel>
    <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-4">
        <Panel variant="template" title="执行计划" subtitle="按步骤推进，危险操作前暂停确认"><AgentTaskRows key={`plan-${round}`} tasks={tasks} /></Panel>
        <Panel variant="template" title="思考过程"><ThinkingTrace key={`think-${round}`} variant="steps" rows={run.steps.slice(0, Math.max(1, step)).map(item => ({ primary: item.title, secondary: item.meta }))} settled={phase === "done"} /></Panel>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        <Panel variant="template" title="工具调用">{visibleTools.length ? <ToolChips key={`tools-${round}`} items={visibleTools} state={phase === "done" ? "success" : phase === "stopped" ? "cancelled" : "running"} /> : <p className="text-sm text-fg-grey-700">正在规划步骤…</p>}</Panel>
        {phase === "waiting" && <ApprovalCard key={`approval-${round}`} questions={[{ id: "approval", prompt: run.approval.prompt, type: "radio", options: run.approval.options }]} onSubmitted={approve} />}
        {showDraft && <Panel variant="template" title="简报草稿" action={phase === "done" ? <StatusBadge label="已发送" color="green" variant="soft" /> : undefined}><StreamingAnswer key={`draft-${round}`} text={run.draft} format="markdown" streaming /></Panel>}
      </div>
    </div>
  </section>;
}
