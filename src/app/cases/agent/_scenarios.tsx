"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  AgentInbox,
  AgentLanes,
  AgentMessage,
  AgentPlan,
  AgentTrail,
  AgentTree,
  Approval,
  AwaySummary,
  Button,
  ChangeLedger,
  ChatInputBar,
  CitedAnswer,
  ContextUsage,
  MessageActions,
  PromptSuggestions,
  Question,
  Reasoning,
  RunControls,
  RunningNow,
  StatCard,
  ThinkingIndicator,
  ToolCall,
  ToolCallGroup,
  TraceWaterfall,
  type InboxTask,
  type LedgerEntry,
  type PlanStep,
  type QuestionAnswer,
  type RunStatus,
  type TrailStep,
} from "@forge-ui-official/core";
import { RefreshLinear } from "@forge-ui-official/core/icons";
import { AGENT_QUICK_ACTIONS } from "../../components/agent/_kit-demos";

/** Advances `stage` on a timer until `stop`; user actions can also move it. */
function useScript(delays: number[], stop: number) {
  const [stage, setStage] = useState(0);
  const [round, setRound] = useState(0);
  useEffect(() => {
    if (stage >= stop || stage >= delays.length) return;
    const timer = setTimeout(() => setStage(value => value + 1), delays[stage]);
    return () => clearTimeout(timer);
  }, [stage, stop, delays, round]);
  return { stage, setStage, replay: () => { setStage(0); setRound(value => value + 1); } };
}

function Frame({ title, description, onReplay, children, composer = true }: { title: string; description: string; onReplay: () => void; children: ReactNode; composer?: boolean }) {
  return (
    <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-fg-grey-200 bg-background">
      <div className="flex items-start gap-3 border-b border-fg-grey-100 px-4 py-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-semibold text-fg-black">{title}</span>
          <span className="text-xs leading-5 text-fg-grey-700">{description}</span>
        </div>
        <Button size="sm" variant="tertiary" color="grey" iconLeft={<RefreshLinear size={14} />} onClick={onReplay}>重放</Button>
      </div>
      <div className="flex min-h-[420px] flex-col gap-5 bg-fg-grey-50/40 p-4">{children}</div>
      {composer && (
        <div className="border-t border-fg-grey-100 p-3">
          <ChatInputBar density="compact" multiline sendOnEnter quickActions={AGENT_QUICK_ACTIONS} hasMessages placeholder="继续问…" onSend={() => undefined} />
        </div>
      )}
    </div>
  );
}

const ANALYSIS_DELAYS = [700, 1600, 1400, 1200];
const REFUND_DELAYS = [900];
const TEAM_DELAYS = [1200, 1500, 1500];

/* 1 ── 经营分析问答：思考 → 工具 → 带引用的回答 → 指标 → 反馈 */

export function AnalysisScenario() {
  const { stage, replay } = useScript(ANALYSIS_DELAYS, 4);
  const [version, setVersion] = useState(1);
  return (
    <Frame title="经营分析问答" description="思考和查询过程可展开，结论带出处，数字来自查询结果；不满意可以重新生成并在版本间切换。" onReplay={() => { setVersion(1); replay(); }}>
      <AgentMessage role="user">这个月退款为什么变多了？</AgentMessage>
      <AgentMessage role="assistant" actions={stage >= 4 && <MessageActions copyText="本月退款 128 笔…" onRetry={() => setVersion(2)} versions={{ current: version - 1, total: version === 2 ? 2 : 1, onChange: index => setVersion(index + 1) }} onFeedback={() => undefined} feedbackReasons={["没回答问题", "数据不对", "太长了"]} onFeedbackReason={() => undefined} />}>
        {stage === 0 && <ThinkingIndicator phases={["理解问题", "查询退款单"]} size="sm" />}
        {stage >= 1 && <Reasoning size="sm" status={stage === 1 ? "thinking" : "done"} duration={stage > 1 ? 2300 : undefined} text="先看退款总量和环比，再按原因、地区拆开，最后对比上月。" />}
        {stage >= 1 && (
          <ToolCallGroup count={2} status={stage < 3 ? "running" : "success"}>
            <ToolCall variant="row" size="sm" name="search_refunds" summary="2026-11" status={stage < 2 ? "running" : "success"} duration={stage >= 2 ? 1240 : undefined} args={{ month: "2026-11" }} result={{ total: 128, lastMonth: 108 }} />
            <ToolCall variant="row" size="sm" name="group_by_reason" summary="按原因" status={stage < 3 ? "running" : "success"} duration={stage >= 3 ? 860 : undefined} args={{ by: "reason" }} result={{ 尺码不符: 52, 质量问题: 29 }} />
          </ToolCallGroup>
        )}
        {stage >= 3 && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <StatCard title="本月退款" value="128 笔" trend="+18%" trendDirection="up" size="sm" density="compact" width="full" />
              <StatCard title="尺码不符" value="41%" trend="+9pt" trendDirection="up" size="sm" density="compact" width="full" />
            </div>
            <CitedAnswer
              size="sm"
              text={version === 1
                ? "本月退款 128 笔，比上月多 18%[1]。多出来的主要是尺码不符，占 41%[1][2]。\n\n集中在华东的两款外套，建议先补充尺码对照表[3]。"
                : "退款变多主要是尺码问题：本月 128 笔，环比 +18%[1]，其中尺码不符 52 笔[2]。先给两款外套补尺码表[3]。"}
              sources={[
                { id: 1, title: "11 月退款单汇总", domain: "订单中心", quote: "本月退款 128 笔，环比 +18%。" },
                { id: 2, title: "客服工单分类", domain: "客服系统", quote: "尺码不符 52 笔，占 41%。" },
                { id: 3, title: "商品详情页规范", domain: "运营手册", quote: "服装类商品须提供尺码对照表。" },
              ]}
            />
            {stage >= 4 && <PromptSuggestions size="sm" suggestions={["按地区拆开看", "列出这两款外套的退款单"]} onSelect={() => undefined} />}
          </>
        )}
      </AgentMessage>
    </Frame>
  );
}

/* 2 ── 退款处理：先问清楚 → 确认 → 执行 → 变更记录可撤销 */

export function RefundScenario() {
  const { stage, setStage, replay } = useScript(REFUND_DELAYS, 1);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>();
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const reset = () => { setAnswers(undefined); setLedger([]); replay(); };
  return (
    <Frame title="退款处理" description="信息不全先问；改数据前确认，风险和金额摆清楚；做完留变更记录，能撤销。" onReplay={reset}>
      <AgentMessage role="user">把订单 1024 的退款处理一下</AgentMessage>
      <AgentMessage role="assistant">
        {stage === 0 && <ThinkingIndicator label="查询订单 1024" size="sm" />}
        {stage >= 1 && (
          <>
            <p className="text-[13px] leading-6">订单 1024 有两件商品，客户只申请了其中一件。先确认两件事：</p>
            <Question
              size="sm"
              answers={answers}
              onSubmit={value => { setAnswers(value); setStage(2); }}
              questions={[
                { id: "scope", title: "退哪些？", options: [{ id: "one", label: "只退外套", description: "¥560", recommended: true }, { id: "all", label: "两件都退", description: "¥860" }] },
                { id: "way", title: "退到哪里？", options: [{ id: "origin", label: "原路退回", recommended: true }, { id: "balance", label: "退到账户余额" }] },
              ]}
            />
          </>
        )}
        {stage >= 2 && (
          <Approval
            size="sm"
            requester="客服助手"
            title={`给订单 1024 退款 ${answers?.scope?.optionIds[0] === "all" ? "¥860" : "¥560"}`}
            risk="medium"
            fields={[{ label: "订单状态", before: "已签收", after: "退款中" }, { label: "退款方式", after: answers?.way?.optionIds[0] === "balance" ? "账户余额" : "原路退回" }]}
            state={stage >= 3 ? "approved" : "pending"}
            result="退款单 RF-3381 已创建"
            onApprove={() => {
              setStage(3);
              setLedger([
                { id: "refund", title: "创建退款单 RF-3381", target: "订单 1024", actor: "客服助手", time: "刚刚", fields: [{ label: "金额", after: answers?.scope?.optionIds[0] === "all" ? "¥860" : "¥560" }] },
                { id: "status", title: "订单状态改为退款中", target: "订单 1024", actor: "客服助手", time: "刚刚", dependsOn: ["refund"], fields: [{ label: "状态", before: "已签收", after: "退款中" }] },
                { id: "sms", title: "短信通知客户", target: "138****2201", actor: "客服助手", time: "刚刚", status: "irreversible" },
              ]);
            }}
            onDeny={() => setStage(1)}
          />
        )}
        {stage >= 3 && <ChangeLedger title="这次做了什么" entries={ledger} onUndo={(id, also) => setLedger(items => items.map(item => (item.id === id || also.includes(item.id) ? { ...item, status: "undone" } : item)))} />}
      </AgentMessage>
    </Frame>
  );
}

/* 3 ── 多步任务：计划可改 → 执行轨迹 → 停止 / 继续 */

const PLAN: PlanStep[] = [
  { id: "1", title: "拉取 11 月全部订单" },
  { id: "2", title: "按渠道汇总销售额" },
  { id: "3", title: "生成对比图表" },
  { id: "4", title: "写一页周报发给运营群" },
];

export function PlanScenario() {
  const [steps, setSteps] = useState<PlanStep[]>(PLAN);
  const [phase, setPhase] = useState<"review" | "running">("review");
  const [done, setDone] = useState(0);
  const [status, setStatus] = useState<RunStatus>("running");
  const [startedAt, setStartedAt] = useState(0);
  useEffect(() => {
    if (phase !== "running" || status !== "running" || done >= steps.length) return;
    const timer = setTimeout(() => setDone(value => value + 1), 1500);
    return () => clearTimeout(timer);
  }, [phase, status, done, steps.length]);
  const finished = phase === "running" && done >= steps.length;
  const trail: TrailStep[] = steps.map((step, index) => ({
    id: step.id,
    title: step.title,
    status: index < done ? "done" : index === done ? (status === "running" ? "running" : "pending") : "pending",
    duration: index < done ? 1500 : undefined,
    startedAt: index === done ? startedAt : undefined,
    activity: index === done ? "处理中…" : undefined,
  }));
  return (
    <Frame title="多步任务" description="先给计划，可以改步骤再执行；执行时看得到在第几步，可以随时停下、继续。" onReplay={() => { setSteps(PLAN); setPhase("review"); setDone(0); setStatus("running"); }}>
      <AgentMessage role="user">做一份 11 月渠道销售周报</AgentMessage>
      <AgentMessage role="assistant">
        <p className="text-[13px] leading-6">我打算这样做，你可以先改：</p>
        {phase === "review"
          ? <AgentPlan size="sm" title="11 月渠道周报" steps={steps} onChange={setSteps} onApprove={() => { setPhase("running"); setStartedAt(Date.now()); }} />
          : <AgentTrail title="11 月渠道周报" steps={trail} />}
        {phase === "running" && (
          <RunControls
            status={finished ? "done" : status}
            activity={`第 ${Math.min(done + 1, steps.length)} 步：${steps[Math.min(done, steps.length - 1)]?.title}`}
            startedAt={startedAt}
            onStop={() => setStatus("stopped")}
            onResume={() => { setStatus("running"); setStartedAt(Date.now()); }}
            onSteer={() => undefined}
          />
        )}
      </AgentMessage>
    </Frame>
  );
}

/* 4 ── 后台任务中心：运行状态 → 收件箱 → 离开摘要 */

export function OpsScenario() {
  const [startedAt] = useState(() => Date.now() - 95_000);
  const [tasks, setTasks] = useState<InboxTask[]>([
    { id: "1", title: "核对 11 月发票", agent: "财务助手", status: "running", startedAt, summary: "第 3 张，共 46 张", recent: ["下载银行流水", "匹配 43 张发票"] },
    { id: "2", title: "退款审批 · 订单 1024", agent: "客服助手", status: "needs-you", summary: "¥860，超过自动处理上限", recent: ["核实物流已签收", "客户上传了照片"] },
    { id: "3", title: "导出季度销售报表", agent: "运营助手", status: "failed", summary: "报表服务超时", recent: ["汇总 3 个月订单", "导出失败"] },
    { id: "4", title: "合同到期提醒", agent: "法务助手", status: "done", duration: 42_000, summary: "已提醒 6 位负责人" },
  ]);
  const [away, setAway] = useState(true);
  const resolve = (id: string, status: InboxTask["status"], summary: string) => setTasks(items => items.map(item => (item.id === id ? { ...item, status, summary, duration: 2000 } : item)));
  return (
    <Frame composer={false} title="后台任务中心" description="智能体在后台跑的任务：回来先看离开摘要，再在收件箱里批准、驳回或重试。" onReplay={() => setAway(true)}>
      <div className="flex items-center justify-between"><span className="text-xs text-fg-grey-700">顶栏</span><RunningNow tasks={tasks} /></div>
      {away && <AwaySummary awayFor={2 * 3600_000 + 15 * 60_000} onDismiss={() => setAway(false)} items={[
        { id: "2", title: "退款审批 · 订单 1024", kind: "needs-you", detail: "¥860，等你确认", actionLabel: "批准", onAction: () => resolve("2", "done", "已批准") },
        { id: "3", title: "导出季度销售报表", kind: "failed", detail: "报表服务超时", actionLabel: "重试", onAction: () => resolve("3", "running", "重试中") },
        { id: "4", title: "合同到期提醒", kind: "done", detail: "已提醒 6 位负责人" },
      ]} />}
      <AgentInbox tasks={tasks} onApprove={id => resolve(id, "done", "已批准")} onReject={id => resolve(id, "done", "已驳回")} onRetry={id => resolve(id, "running", "重试中")} onOpen={() => undefined} />
    </Frame>
  );
}

/* 5 ── 多智能体协作：编排树 → 泳道 → 调用瀑布 → 上下文 */

export function MultiAgentScenario() {
  const { stage, replay } = useScript(TEAM_DELAYS, 3);
  const status = (from: number) => (stage > from ? "done" : stage === from ? "running" : "idle") as "done" | "running" | "idle";
  return (
    <Frame composer={false} title="多智能体协作" description="主管把任务拆给三个助手：谁在做什么、各花了多少、时间耗在哪，一屏看清。" onReplay={replay}>
      <AgentTree root={{
        id: "lead", name: "运营主管", role: "编排", status: stage >= 3 ? "done" : "running", activity: stage >= 3 ? "周报已发出" : "分派并等结果", cost: 0.02,
        children: [
          { id: "data", name: "数据助手", role: "查询", status: status(0), activity: stage === 0 ? "查 11 月订单" : undefined, cost: 0.01 },
          { id: "report", name: "报表助手", role: "生成", status: status(1), activity: stage === 1 ? "画渠道对比图" : undefined, cost: stage >= 1 ? 0.03 : 0 },
          { id: "notify", name: "通知助手", role: "发送", status: stage === 2 ? "waiting" : status(2), activity: stage === 2 ? "等你确认收件人" : undefined },
        ],
      }} />
      <AgentLanes
        now={Math.max(12_000, stage * 15_000 + 8000)}
        lanes={[{ id: "data", name: "数据助手" }, { id: "report", name: "报表助手" }, { id: "notify", name: "通知助手" }]}
        blocks={[
          { id: "a", laneId: "data", title: "查订单", start: 0, end: stage >= 1 ? 12_000 : undefined, status: stage >= 1 ? "done" : "running" },
          ...(stage >= 1 ? [{ id: "b", laneId: "report", title: "汇总+画图", start: 12_000, end: stage >= 2 ? 27_000 : undefined, status: stage >= 2 ? "done" as const : "running" as const }] : []),
          ...(stage >= 2 ? [{ id: "c", laneId: "notify", title: stage >= 3 ? "已发送" : "等确认", start: 27_000, end: stage >= 3 ? 50_000 : undefined, status: stage >= 3 ? "done" as const : "waiting" as const }] : []),
        ]}
      />
      {stage >= 3 && (
        <>
          <TraceWaterfall spans={[
            { id: "1", name: "规划", kind: "llm", start: 0, duration: 2100, tokens: 1800, cost: 0.004 },
            { id: "2", name: "数据助手", kind: "agent", start: 2100, duration: 9900, depth: 1, cost: 0.01 },
            { id: "3", name: "search_orders", kind: "tool", start: 2400, duration: 6200, depth: 2 },
            { id: "4", name: "报表助手", kind: "agent", start: 12_000, duration: 15_000, depth: 1, cost: 0.03 },
            { id: "5", name: "通知助手", kind: "agent", start: 27_000, duration: 23_000, depth: 1 },
          ]} />
          <ContextUsage limit={128_000} cost={0.06} segments={[
            { id: "s", label: "系统提示", tokens: 3200, kind: "system" },
            { id: "t", label: "12 个工具", tokens: 5400, kind: "tools" },
            { id: "c", label: "对话 6 轮", tokens: 9800, kind: "chat" },
          ]} />
        </>
      )}
    </Frame>
  );
}
