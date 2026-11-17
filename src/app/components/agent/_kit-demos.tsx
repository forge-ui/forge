"use client";

import { useEffect, useState } from "react";
import {
  AgentCheckpoints,
  AgentInbox,
  AgentLanes,
  AgentPanel,
  AgentPlan,
  AgentTrail,
  AgentTree,
  AgentWelcome,
  Approval,
  AttachmentList,
  AutonomySelector,
  AwaySummary,
  Button,
  ChangeLedger,
  ChoiceCard,
  CitedAnswer,
  ConfirmCard,
  ContextUsage,
  PromptQueue,
  Question,
  Reasoning,
  RunControls,
  RunningNow,
  RunProgress,
  ThinkingIndicator,
  ToolCall,
  ToolCallGroup,
  TraceWaterfall,
  type AgentPlanProps,
  type ApprovalScope,
  type AutonomyLevel,
  type InboxTask,
  type LedgerEntry,
  type PlanStep,
  type QuestionAnswer,
  type QueuedPrompt,
  type RunStatus,
} from "@forge-ui-official/core";
import { ChartSquareLinear, DocumentTextLinear, ShieldCheckBold, UsersGroupRoundedLinear } from "@forge-ui-official/core/icons";

const box = "w-full max-w-xl";

/* ── Process ── */

export function ReasoningDemo() {
  const [run, setRun] = useState(0);
  const [startedAt, setStartedAt] = useState<number>();
  const [done, setDone] = useState(true);
  useEffect(() => {
    if (!run) return;
    const timer = setTimeout(() => setDone(true), 3200);
    return () => clearTimeout(timer);
  }, [run]);
  return (
    <div className={`${box} flex flex-col gap-3`}>
      <Reasoning
        status={done ? "done" : "thinking"}
        startedAt={startedAt}
        duration={done ? 3200 : undefined}
        steps={[
          { id: "1", label: "读取本月退款单", status: "done", sources: [{ title: "退款单列表", domain: "订单中心" }] },
          { id: "2", label: "按原因归类", status: done ? "done" : "running", detail: "尺码不符 41%，质量问题 23%" },
          { id: "3", label: "对比上月", status: done ? "done" : undefined },
        ]}
      />
      <Button size="sm" variant="tertiary" color="grey" className="self-start" onClick={() => { setDone(false); setStartedAt(Date.now()); setRun(value => value + 1); }}>重新思考</Button>
    </div>
  );
}

export function ThinkingIndicatorDemo() {
  const [startedAt] = useState(() => Date.now());
  return (
    <div className={`${box} flex flex-col gap-3`}>
      <ThinkingIndicator />
      <ThinkingIndicator phases={["读取页面", "查询订单", "整理回答"]} startedAt={startedAt} />
    </div>
  );
}

export function ToolCallDemo() {
  const [approval, setApproval] = useState<"awaiting-approval" | "running" | "denied">("awaiting-approval");
  const [startedAt] = useState(() => Date.now());
  return (
    <div className={`${box} flex flex-col gap-3`}>
      <ToolCallGroup count={3} status="error" defaultOpen>
        <ToolCall variant="row" name="search_orders" summary="退款 · 本月" status="success" duration={1240} args={{ status: "refunded", month: "2026-11" }} result={{ total: 128, items: "…" }} />
        <ToolCall variant="row" name="get_customer" summary="C-20931" status="running" startedAt={startedAt} args={{ id: "C-20931" }} />
        <ToolCall variant="row" name="export_excel" summary="退款明细" status="error" error="导出服务超时（30 秒）" onRetry={() => undefined} />
      </ToolCallGroup>
      <ToolCall
        name="create_refund"
        title="发起退款"
        summary="订单 1024 · ¥860"
        status={approval}
        args={{ orderId: "1024", amount: 860 }}
        approvalReason="金额超过 500 元，需要你确认。"
        onApprove={() => setApproval("running")}
        onDeny={() => setApproval("denied")}
      />
    </div>
  );
}

/* ── Asking ── */

export function QuestionDemo() {
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>();
  const questions = [
    { id: "range", title: "统计哪段时间？", options: [{ id: "week", label: "本周" }, { id: "month", label: "本月", recommended: true }, { id: "quarter", label: "本季度" }] },
    { id: "split", title: "按什么拆分？", multiple: true, options: [{ id: "region", label: "地区" }, { id: "channel", label: "渠道" }, { id: "product", label: "商品" }] },
    { id: "note", title: "还有要补充的吗？", options: [], allowText: true, textPlaceholder: "例如：只看华东" },
  ];
  return (
    <div className={`${box} flex flex-col gap-3`}>
      <Question questions={questions} answers={answers} onSubmit={setAnswers} onCancel={() => setAnswers({})} />
      {answers && <Button size="sm" variant="tertiary" color="grey" className="self-start" onClick={() => setAnswers(undefined)}>重新回答</Button>}
    </div>
  );
}

export function ApprovalDemo() {
  const [state, setState] = useState<"pending" | "approved" | "denied">("pending");
  const [scope, setScope] = useState<ApprovalScope>();
  return (
    <div className={`${box} flex flex-col gap-3`}>
      <Approval
        requester="财务助手"
        title="给 3 位客户退款，共 ¥2,460"
        description="退款会原路返回，提交后无法撤回。"
        risk="high"
        fields={[{ label: "订单", after: "1024、1031、1047" }, { label: "金额", after: "¥2,460" }]}
        scopes={["once", "session"]}
        askDenyReason
        expiresIn={state === "pending" ? 60 : undefined}
        state={state}
        result={scope === "session" ? "本次对话内的退款不再询问" : undefined}
        onApprove={value => { setScope(value); setState("approved"); }}
        onDeny={() => setState("denied")}
      />
      {state !== "pending" && <Button size="sm" variant="tertiary" color="grey" className="self-start" onClick={() => setState("pending")}>再看一次</Button>}
    </div>
  );
}

export function HarnessCardsDemo() {
  const [picked, setPicked] = useState<string>();
  const [confirm, setConfirm] = useState<"pending" | "working" | "done">("pending");
  return (
    <div className={`${box} flex flex-col gap-3`}>
      <ChoiceCard title="找到两个张三，改哪一个？" options={[{ id: "u1", label: "张三", description: "销售部 · zhangsan@corp.cn" }, { id: "u2", label: "张三", description: "财务部 · zhang.san@corp.cn" }]} answered={picked} onAnswer={answer => setPicked("optionId" in answer ? (answer.optionId === "u1" ? "销售部的张三" : "财务部的张三") : undefined)} />
      <ConfirmCard title="修改张三的角色" fields={[{ label: "角色", before: "成员", after: "管理员" }]} state={confirm} result="已保存，记录版本 v7" onConfirm={() => { setConfirm("working"); setTimeout(() => setConfirm("done"), 900); }} onCancel={() => undefined} />
    </div>
  );
}

/* ── Answer ── */

export function CitedAnswerDemo() {
  return (
    <div className={box}>
      <CitedAnswer
        text={"本月退款 128 笔，比上月多 18%[1]。主要原因是尺码不符，占 41%[1][2]。\n\n华东区的退款集中在两款外套上，建议先补充尺码说明[3]。"}
        sources={[
          { id: 1, title: "11 月退款单汇总", domain: "订单中心", quote: "本月退款 128 笔，环比 +18%；尺码不符 52 笔。" },
          { id: 2, title: "客服工单分类", domain: "客服系统", quote: "退款原因分布：尺码不符 41%，质量问题 23%。" },
          { id: 3, title: "商品详情页规范", href: "https://www.forgeui.org/docs", quote: "服装类商品须提供尺码对照表。" },
        ]}
      />
    </div>
  );
}

/* ── Composer ── */

export function ComposerPartsDemo() {
  const [queue, setQueue] = useState<QueuedPrompt[]>([{ id: "a", text: "再按地区拆一下" }, { id: "b", text: "导出成 Excel 发给财务", attachments: 1 }]);
  const [status, setStatus] = useState<RunStatus>("running");
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const move = (id: string, direction: -1 | 1) => setQueue(items => {
    const index = items.findIndex(item => item.id === id);
    const next = [...items];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    return next;
  });
  return (
    <div className={`${box} flex flex-col gap-2`}>
      <RunControls
        status={status}
        activity="正在核对第 3 张发票"
        startedAt={startedAt}
        error="发票服务没有响应"
        onStop={() => { setStatus("stopping"); setTimeout(() => setStatus("stopped"), 600); }}
        onResume={() => { setStatus("running"); setStartedAt(Date.now()); }}
        onRetry={() => { setStatus("running"); setStartedAt(Date.now()); }}
        onDismiss={() => setStatus("done")}
        onSteer={() => undefined}
      />
      <PromptQueue items={queue} onMove={move} onRemove={id => setQueue(items => items.filter(item => item.id !== id))} onEdit={(id, text) => setQueue(items => items.map(item => (item.id === id ? { ...item, text } : item)))} onSendNow={id => setQueue(items => [...items.filter(item => item.id === id), ...items.filter(item => item.id !== id)])} />
      <AttachmentList
        onRemove={() => undefined}
        onRetry={() => undefined}
        items={[
          { id: "1", name: "11 月发票.pdf", size: 2_400_000, kind: "document" },
          { id: "2", name: "报销明细.xlsx", kind: "sheet", progress: 64 },
          { id: "3", name: "扫描件.heic", error: "格式不支持" },
        ]}
      />
    </div>
  );
}

export function WelcomeDemo() {
  const [sent, setSent] = useState<string>();
  return (
    <div className={box}>
      <AgentWelcome
        title="你好，我是运营助手"
        description="能查订单和退款、生成报表，也能帮你处理审批。改数据前都会先问你。"
        onPick={setSent}
        capabilities={[
          { id: "report", title: "生成本周经营报表", description: "销售额、订单、退款和对比", icon: <ChartSquareLinear size={16} />, prompt: "生成本周经营报表" },
          { id: "refund", title: "处理待审退款", description: "逐条确认，超过 500 元先问你", icon: <ShieldCheckBold size={16} />, prompt: "处理待审退款" },
          { id: "contract", title: "检查合同到期", description: "30 天内到期的合同和负责人", icon: <DocumentTextLinear size={16} />, prompt: "检查 30 天内到期的合同" },
          { id: "team", title: "调整成员权限", description: "改角色、开关模块权限", icon: <UsersGroupRoundedLinear size={16} />, prompt: "调整成员权限" },
        ]}
        footer={sent && <p className="text-xs text-fg-grey-700">将发送：{sent}</p>}
      />
    </div>
  );
}

export function PanelDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className={box}>
      <Button size="sm" onClick={() => setOpen(true)}>打开面板</Button>
      <AgentPanel
        title="Forge Agent"
        open={open}
        onOpenChange={setOpen}
        launcher={false}
        onNewChat={() => undefined}
        sessions={[{ id: "1", title: "本周退款分析" }, { id: "2", title: "合同到期提醒" }]}
        currentSessionId="1"
        onSelectSession={() => undefined}
        empty={<AgentWelcome size="sm" title="有什么可以帮你？" description="面板打开时页面会让出右侧空间，关闭后恢复。" />}
        composer={{ placeholder: "问点什么…", onSend: () => undefined }}
      />
    </div>
  );
}

/* ── Runs ── */

export function AgentPlanDemo() {
  const [steps, setSteps] = useState<PlanStep[]>([
    { id: "1", title: "拉取 11 月全部退款单", detail: "订单中心，128 笔" },
    { id: "2", title: "按原因和地区归类" },
    { id: "3", title: "生成退款分析报表" },
    { id: "4", title: "发给财务和客服负责人" },
  ]);
  const [mode, setMode] = useState<AgentPlanProps["mode"]>("review");
  const finished = mode === "running" && steps.every(step => step.status === "done");
  useEffect(() => {
    if (mode !== "running") return;
    const index = steps.findIndex(step => step.status !== "done");
    if (index < 0 || steps[index].status === "failed") return;
    const timer = setTimeout(() => setSteps(items => items.map((step, at) => (at === index ? { ...step, status: index === 2 && !step.duration ? "failed" : "done", duration: 1400 } : at === index + 1 ? { ...step, status: "running", startedAt: Date.now() } : step))), 1400);
    return () => clearTimeout(timer);
  }, [mode, steps]);
  return (
    <div className={`${box} flex flex-col gap-3`}>
      <AgentPlan
        title="11 月退款分析"
        description="确认后按顺序执行，可以先改步骤。"
        steps={steps}
        mode={finished ? "done" : mode}
        onChange={setSteps}
        onApprove={() => { setMode("running"); setSteps(items => items.map((step, index) => ({ ...step, status: index === 0 ? "running" : "pending", startedAt: index === 0 ? Date.now() : undefined }))); }}
        onRetryFrom={id => setSteps(items => items.map(step => (step.id === id ? { ...step, status: "running", startedAt: Date.now(), duration: 1 } : step)))}
      />
      {mode !== "review" && <Button size="sm" variant="tertiary" color="grey" className="self-start" onClick={() => { setMode("review"); setSteps(items => items.map(({ id, title, detail }) => ({ id, title, detail }))); }}>重新开始</Button>}
    </div>
  );
}

export function AgentTrailDemo() {
  const [startedAt] = useState(() => Date.now());
  return (
    <div className={`${box} flex flex-col gap-3`}>
      <AgentTrail
        title="月末对账 · 11 月"
        steps={[
          { id: "1", title: "下载银行流水", status: "done", duration: 3200 },
          { id: "2", title: "匹配发票", status: "done", duration: 12400 },
          { id: "3", title: "核对差异", status: "running", activity: "第 3 张发票：金额差 ¥12", startedAt, substeps: [{ id: "a", title: "发票 FP-2201", status: "done", duration: 800 }, { id: "b", title: "发票 FP-2202", status: "done", duration: 640 }, { id: "c", title: "发票 FP-2203", status: "running" }] },
          { id: "4", title: "提交对账结果", status: "waiting", waiting: <Approval size="sm" title="提交 11 月对账结果" risk="medium" onApprove={() => undefined} onDeny={() => undefined} /> },
          { id: "5", title: "通知财务主管", status: "pending" },
        ]}
      />
      <RunProgress steps={[{ id: "1", title: "查询账号", status: "completed" }, { id: "2", title: "等你确认改动", status: "waiting-user" }]} />
    </div>
  );
}

export function CheckpointsDemo() {
  const [current, setCurrent] = useState("4");
  return (
    <div className={box}>
      <AgentCheckpoints
        currentId={current}
        onRewind={setCurrent}
        checkpoints={[
          { id: "1", label: "读取需求", time: "10:02" },
          { id: "2", label: "第一版报表", time: "10:05", detail: "按周汇总" },
          { id: "3", label: "按地区汇总（已放弃）", time: "10:07", abandoned: true },
          { id: "4", label: "按渠道汇总", time: "10:09", detail: "当前版本" },
        ]}
      />
    </div>
  );
}

/* ── Governance ── */

export function LedgerDemo() {
  const [entries, setEntries] = useState<LedgerEntry[]>([
    { id: "role", title: "张三改为管理员", target: "账号管理", actor: "运营助手", time: "10:12", fields: [{ label: "角色", before: "成员", after: "管理员" }] },
    { id: "perm", title: "给张三开财务模块", target: "权限", actor: "运营助手", time: "10:13", dependsOn: ["role"] },
    { id: "price", title: "外套 A12 调价", target: "商品", actor: "运营助手", time: "10:20", fields: [{ label: "售价", before: "¥399", after: "¥359" }] },
    { id: "mail", title: "发出调价通知邮件", target: "邮件", actor: "运营助手", time: "10:21", status: "irreversible" },
  ]);
  return (
    <div className={box}>
      <ChangeLedger title="本次对话的改动" entries={entries} onUndo={(id, also) => setEntries(items => items.map(item => (item.id === id || also.includes(item.id) ? { ...item, status: "undone" } : item)))} />
    </div>
  );
}

export function AutonomyDemo() {
  const [level, setLevel] = useState<AutonomyLevel>("balanced");
  return (
    <div className={box}>
      <AutonomySelector
        value={level}
        onChange={setLevel}
        actions={[
          { id: "a", label: "查询订单和报表", risk: "low" },
          { id: "b", label: "生成草稿", risk: "low" },
          { id: "c", label: "修改商品信息", risk: "medium" },
          { id: "d", label: "调整成员权限", risk: "medium" },
          { id: "e", label: "退款、付款", risk: "high" },
        ]}
      />
    </div>
  );
}

/* ── Operations ── */

const inboxTasks: InboxTask[] = [
  { id: "1", title: "核对 11 月发票", agent: "财务助手", status: "running", startedAt: 0, summary: "第 3 张，共 46 张", recent: ["下载银行流水", "匹配 43 张发票"] },
  { id: "2", title: "退款审批 · 订单 1024", agent: "客服助手", status: "needs-you", summary: "金额 ¥860，超过自动处理上限", recent: ["核实物流已签收", "客户上传了质量问题照片"] },
  { id: "3", title: "导出季度销售报表", agent: "运营助手", status: "failed", summary: "报表服务超时", recent: ["汇总 3 个月订单", "导出失败：超时"] },
  { id: "4", title: "合同到期提醒", agent: "法务助手", status: "done", duration: 42_000, summary: "已提醒 6 位负责人" },
];

export function InboxDemo() {
  const [startedAt] = useState(() => Date.now() - 95_000);
  const tasks = inboxTasks.map(task => (task.status === "running" ? { ...task, startedAt } : task));
  return (
    <div className={`${box} flex flex-col gap-3`}>
      <div className="flex justify-end"><RunningNow tasks={tasks} onOpen={() => undefined} /></div>
      <AgentInbox tasks={tasks} onApprove={() => undefined} onReject={() => undefined} onRetry={() => undefined} onOpen={() => undefined} />
    </div>
  );
}

export function AwayDemo() {
  const [shown, setShown] = useState(true);
  if (!shown) return <Button size="sm" variant="tertiary" color="grey" onClick={() => setShown(true)}>再显示一次</Button>;
  return (
    <div className={box}>
      <AwaySummary
        awayFor={2 * 3600_000 + 15 * 60_000}
        onDismiss={() => setShown(false)}
        items={[
          { id: "1", title: "退款审批 · 订单 1024", kind: "needs-you", detail: "¥860，等你确认", actionLabel: "去处理", onAction: () => undefined },
          { id: "2", title: "导出季度销售报表", kind: "failed", detail: "报表服务超时", actionLabel: "重试", onAction: () => undefined },
          { id: "3", title: "合同到期提醒", kind: "done", detail: "已提醒 6 位负责人" },
          { id: "4", title: "11 月发票核对", kind: "done", detail: "46 张全部匹配" },
        ]}
      />
    </div>
  );
}

/* ── Observability ── */

export function ContextDemo() {
  const [segments, setSegments] = useState([
    { id: "system", label: "系统提示", tokens: 3200, kind: "system" as const },
    { id: "tools", label: "18 个工具", tokens: 6400, kind: "tools" as const },
    { id: "memory", label: "部门和偏好", tokens: 1200, kind: "memory" as const, removable: true },
    { id: "contract", label: "采购合同.pdf", tokens: 42_000, kind: "files" as const, removable: true },
    { id: "chat", label: "对话 24 轮", tokens: 31_000, kind: "chat" as const },
  ]);
  const remove = (id: string) => setSegments(items => items.filter(item => item.id !== id));
  const compact = () => setSegments(items => items.map(item => (item.id === "chat" ? { ...item, label: "对话（已压缩）", tokens: 6000 } : item)));
  return (
    <div className={`${box} flex flex-col gap-3`}>
      <ContextUsage limit={128_000} cost={0.38} segments={segments} onRemove={remove} onCompact={compact} />
      <div className="flex items-center gap-2 rounded-xl border border-fg-grey-200 px-3 py-2 text-xs text-fg-grey-700">输入框工具栏里用 inline：<ContextUsage variant="inline" limit={128_000} segments={segments} onRemove={remove} onCompact={compact} /></div>
    </div>
  );
}

export function TraceDemo() {
  const [selected, setSelected] = useState<string>();
  return (
    <div className="w-full max-w-2xl">
      <TraceWaterfall
        selectedId={selected}
        onSelect={setSelected}
        spans={[
          { id: "1", name: "规划", kind: "llm", start: 0, duration: 2100, tokens: 1800, cost: 0.004 },
          { id: "2", name: "search_orders", kind: "tool", start: 2100, duration: 1200, depth: 1 },
          { id: "3", name: "get_refunds", kind: "tool", start: 2100, duration: 2600, depth: 1 },
          { id: "4", name: "报表助手", kind: "agent", start: 4700, duration: 5200, depth: 1, cost: 0.012 },
          { id: "5", name: "生成图表", kind: "llm", start: 4900, duration: 3100, depth: 2, tokens: 4200, cost: 0.009 },
          { id: "6", name: "export_excel", kind: "tool", start: 8000, duration: 1900, depth: 2, status: "error" },
          { id: "7", name: "写总结", kind: "llm", start: 9900, duration: 2300, tokens: 2600, cost: 0.006 },
        ]}
      />
    </div>
  );
}

export function TreeDemo() {
  const [selected, setSelected] = useState("lead");
  return (
    <div className={`${box} flex flex-col gap-3`}>
      <AgentTree
        selectedId={selected}
        onSelect={setSelected}
        root={{
          id: "lead", name: "运营主管", role: "编排", status: "running", activity: "等报表助手交稿", cost: 0.02, duration: 48_000,
          children: [
            { id: "data", name: "数据助手", role: "查询", status: "done", cost: 0.01, duration: 12_000 },
            { id: "report", name: "报表助手", role: "生成", status: "running", activity: "画渠道对比图", cost: 0.03, children: [{ id: "chart", name: "图表子任务", status: "running", activity: "第 2 张图" }] },
            { id: "notify", name: "通知助手", role: "发送", status: "waiting", activity: "等你确认收件人" },
          ],
        }}
      />
      <AgentLanes
        now={60_000}
        lanes={[{ id: "data", name: "数据助手" }, { id: "report", name: "报表助手" }, { id: "notify", name: "通知助手" }]}
        blocks={[
          { id: "a", laneId: "data", title: "查退款", start: 0, end: 12_000, status: "done" },
          { id: "b", laneId: "data", title: "查渠道", start: 14_000, end: 22_000, status: "done" },
          { id: "c", laneId: "report", title: "汇总", start: 12_000, end: 30_000, status: "done" },
          { id: "d", laneId: "report", title: "画图", start: 30_000, status: "running" },
          { id: "e", laneId: "notify", title: "等确认", start: 40_000, status: "waiting" },
        ]}
      />
    </div>
  );
}
