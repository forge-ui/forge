"use client";
import { useEffect, useState } from "react";
import {
  Button,
  ChatBubble,
  SurfaceCard,
  ThinkingTrace,
  ToolChips,
  StreamingAnswer,
  ContextCards,
  RecommendationCard,
  ApprovalCard,
  AgentDiffTable,
  AgentTaskRows,
  AgentCodeBlock,
  InsightCards,
  AgentFlowchart,
  useToast,
} from "@forge-ui-official/core";
import { StarBoldDuotone } from "@forge-ui-official/core/icons";
import { useDemoStream } from "@/app/_demos/use-demo-stream";
import { ANSWERS, type Turn } from "./_data";

export function AgentTurn({
  turn,
  onFollowUp,
  onRunning,
  stopSignal,
  permission,
  onSnapshot,
  onWorkflow,
}: {
  turn: Turn;
  onFollowUp: (text: string) => void;
  onRunning?: (value: boolean) => void;
  stopSignal: number;
  permission: string;
  onSnapshot: (id: string, snapshot: NonNullable<Turn["snapshot"]>) => void;
  onWorkflow: (id: string, workflow: NonNullable<Turn["workflow"]>) => void;
}) {
  const stream = useDemoStream({
    text: ANSWERS[turn.kind],
    locale: "zh",
    jitter: false,
  });
  const { start, stop } = stream;
  const phase = stream.phase === "idle" && !turn.live && turn.snapshot ? turn.snapshot.phase : stream.phase;
  useEffect(() => {
    if (stream.phase === "idle") return;
    onSnapshot(turn.id, { text: stream.receivedText, phase: stream.phase === "complete" ? "complete" : "stopped" });
  }, [stream.phase, stream.receivedText, turn.id, onSnapshot]);
  const [accepted, setAccepted] = useState(turn.workflow?.accepted ?? false);
  const [alternative, setAlternative] = useState(turn.workflow?.alternative ?? false);
  const [applied, setApplied] = useState<string[]>(turn.workflow?.applied ?? []);
  const [approval, setApproval] = useState<Record<string, string[]> | null>(
    turn.workflow?.approval ?? null,
  );
  const [node, setNode] = useState(turn.workflow?.node ?? "brief");
  useEffect(() => {
    onWorkflow(turn.id, { accepted, alternative, applied, approval, node });
  }, [turn.id, accepted, alternative, applied, approval, node, onWorkflow]);
  const { toast } = useToast();
  useEffect(() => {
    if (!turn.live) return;
    const timer = window.setTimeout(start, 0);
    return () => window.clearTimeout(timer);
  }, [start, turn.live]);
  useEffect(() => {
    if (stopSignal) stop();
  }, [stopSignal, stop]);
  const running =
    stream.phase === "waiting" ||
    stream.phase === "streaming" ||
    stream.phase === "settling";
  useEffect(() => {
    onRunning?.(running);
  }, [running, onRunning]);
  const complete =
    phase === "complete" || (!turn.live && phase === "idle");
  const readonly = permission === "readonly" || turn.request?.permission === "readonly";
  const approve = (answers: Record<string, string[]>) => {
    if (readonly) {
      toast({ title: "当前为仅查看模式，计划未应用", status: "error" });
      return;
    }
    setApproval(answers);
    toast({ title: "审批选择已记录到本次演示" });
  };
  return (
    <article className="flex flex-col gap-5">
      <ChatBubble color="black" type="sent" content={turn.text} />
      {turn.request && <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-right text-xs text-fg-grey-700" aria-label="本轮请求设置">
        {turn.request.action && <span>操作：{turn.request.action}</span>}
        {turn.request.sources.length > 0 && <span>提及：{turn.request.sources.map((source) => `@${source.label}`).join("、")}</span>}
        <span>响应方式：{turn.request.mode}</span>
        <span>权限：{turn.request.permission === "readonly" ? "仅查看" : "操作前确认"}</span>
      </div>}
      <div className="flex items-center gap-2 text-sm font-semibold text-fg-black">
        <StarBoldDuotone size={22} color="var(--fg-black)" />
        Forge 助手
      </div>
      <details className="agent-process" open={running}>
        <summary>
          {running ? "正在分析项目资料…" : phase === "stopped" ? "本次生成已停止" : "已查阅项目简报，完成任务分析"}
        </summary>
        <ThinkingTrace
          key={`trace-${stream.runId}`}
          variant={turn.kind === "code" ? "coding" : "steps"}
          settled={!running}
          play={running}
          activeLabel="正在整理思路"
          doneLabel={phase === "stopped" ? "思考已停止" : "已完成分析"}
          rows={[
            { primary: "理解目标与约束" },
            { primary: "查阅项目材料" },
            { primary: "整理建议与下一步" },
          ]}
        />
        <ToolChips
          summary={`已查阅 ${turn.kind === "analysis" ? 2 : 1} 项项目资料`}
          state={
            running
              ? "running"
              : phase === "stopped"
                ? "cancelled"
                : "success"
          }
          items={[
            {
              id: "read",
              kind: "read",
              label: "读取",
              chip: "项目简报.md",
              status: running
                ? "running"
                : phase === "stopped"
                  ? "cancelled"
                  : "complete",
              detail: [{ text: "品牌焕新：调研、视觉方向、首页设计与评审。" }],
            },
            ...(turn.kind === "analysis" ? [{
              id: "tasks", kind: "read" as const, label: "读取", chip: "任务导出.csv",
              status: running ? "running" as const : phase === "stopped" ? "cancelled" as const : "complete" as const,
              detail: [{ text: "首页设计等待视觉方向确认，移动端布局尚未完成。" }],
            }] : []),
            {
              id: "plan",
              kind: "think",
              label: "分析",
              chip: "梳理任务依赖",
              status: running
                ? "pending"
                : phase === "stopped"
                  ? "cancelled"
                  : "complete",
              detail: [{ text: "先确认视觉方向，再推进首页方案。" }],
            },
          ]}
        />
      </details>
      {stream.phase === "waiting" && (
        <p role="status" className="text-sm text-fg-grey-700">
          正在准备回答…
        </p>
      )}
      <StreamingAnswer
        key={`answer-${stream.runId}`}
        text={
          stream.phase === "idle" && !turn.live
            ? turn.snapshot?.text ?? ANSWERS[turn.kind]
            : stream.receivedText
        }
        status={
          phase === "stopped"
            ? "stopped"
            : running && stream.phase !== "settling"
              ? "streaming"
              : "complete"
        }
        format="markdown"
        animation="fade"
        onDone={() => stream.finish(stream.runId)}
        sources={complete ? turn.kind === "analysis" ? [{ name: "项目简报.md" }, { name: "任务导出.csv" }] : [{ name: "项目简报" }] : []}
        followUps={
          complete && turn.kind !== "plan"
            ? ["分析项目进度与风险", "写一个整理任务的函数"]
            : []
        }
        onFollowUp={onFollowUp}
      />
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          color="black"
          variant="tertiary"
          onClick={running ? stop : start}
        >
          {running
            ? "停止生成"
            : phase === "stopped"
              ? "重新生成"
              : "重新生成"}
        </Button>
        {phase === "stopped" && (
          <span role="status" className="text-xs text-fg-grey-700">
            已停止，保留已生成的内容
          </span>
        )}
      </div>
      {complete && (
        <>
          {turn.kind === "analysis" ? (
            <>
              <ContextCards
                total={2}
                chunks={[
                  {
                    id: "brief",
                    title: "项目目标与边界",
                    body: "本周确认视觉方向并完成首页方案，周五组织评审。",
                    sourceKind: "MD",
                    sourceLabel: "项目简报.md",
                    charCount: 32,
                  },
                  {
                    id: "risk",
                    title: "当前依赖",
                    body: "首页设计等待视觉方向确认，移动端布局尚未完成。",
                    sourceKind: "CSV",
                    sourceLabel: "任务导出.csv",
                    charCount: 28,
                  },
                ]}
              />
              <InsightCards
                onAsk={onFollowUp}
                cards={[
                  {
                    id: "progress",
                    title: "设计任务在持续推进",
                    body: "示例趋势显示完成任务逐渐增加，适合在周中安排一次短评审。",
                    prompt: "帮我整理本周评审计划",
                    chart: {
                      kind: "spark",
                      series: [
                        { name: "完成任务", values: [1, 2, 2, 4, 5, 7] },
                      ],
                    },
                  },
                  {
                    id: "risk",
                    title: "先解决关键依赖",
                    body: "视觉方向是后续页面设计的前置条件，应优先确认。",
                    prompt: "把设计依赖拆解成本周计划",
                  },
                ]}
              />
            </>
          ) : turn.kind === "code" ? (
            <AgentCodeBlock
              filename="lib/sort-tasks.ts"
              lines={[
                "type Task = { title: string; priority?: number };",
                "export function sortTasks(tasks: Task[]) {",
                "  return [...tasks].sort((a, b) => (a.priority ?? 4) - (b.priority ?? 4));",
                "}",
              ]}
              diff={[
                {
                  old: 1,
                  cur: 1,
                  type: "ctx",
                  pieces: [
                    { text: "export function sortTasks(tasks: Task[]) {" },
                  ],
                },
                {
                  old: 2,
                  cur: null,
                  type: "del",
                  pieces: [{ text: "  return tasks;", change: "del" }],
                },
                {
                  old: null,
                  cur: 2,
                  type: "add",
                  pieces: [
                    {
                      text: "  return [...tasks].sort((a, b) => (a.priority ?? 4) - (b.priority ?? 4));",
                      change: "add",
                    },
                  ],
                },
                { old: 3, cur: 3, type: "ctx", pieces: [{ text: "}" }] },
              ]}
            />
          ) : (
            <>
              <details className="agent-workflow-details">
                <summary>查看建议与替代方案</summary>
                <RecommendationCard
                  title={
                    alternative
                      ? "先完成一次小范围评审"
                      : "先确认方向，再开始设计"
                  }
                  body={
                    alternative
                      ? "邀请设计与产品负责人，用半小时选定一个方向。"
                      : "把周二设为方向确认节点，为首页设计预留完整的两天。"
                  }
                  acceptLabel={readonly ? "仅查看，不能采纳" : accepted ? "已采纳 · 再次查看" : "采纳这个建议"}
                  onAccept={() => {
                    if (readonly) { toast({ title: "仅查看模式不能采纳建议", status: "error" }); return; }
                    setAccepted(true);
                    toast({ title: "建议已记录到当前计划草稿" });
                  }}
                  alternatives={[
                    {
                      id: "review",
                      label: alternative
                        ? "改为先确认视觉方向"
                        : "先组织一次小范围评审",
                      confidence: "review",
                    },
                  ]}
                  onSelectAlternative={() => {
                    setAlternative((value) => !value);
                    if (!readonly) setAccepted(false);
                  }}
                />
              </details>
              <details className="agent-workflow-details">
                <summary>查看工作路径与任务依赖</summary>
                <AgentFlowchart
                  title="本周工作路径"
                  selectedId={node}
                  onSelect={setNode}
                  nodes={[
                    {
                      id: "brief",
                      kind: "trigger",
                      title: "项目简报",
                      body: "对齐目标与范围",
                    },
                    {
                      id: "design",
                      kind: "action",
                      title: "设计方案",
                      body: "完成首屏与内容布局",
                    },
                    {
                      id: "review",
                      kind: "condition",
                      title: "团队评审",
                      body: "确认方向并收拢反馈",
                    },
                  ]}
                  edges={[
                    { from: "brief", to: "design", label: "方向确认" },
                    { from: "design", to: "review", label: "准备评审" },
                  ]}
                />
              </details>
              <details className="agent-workflow-details">
                <summary>查看计划整理结果与检查项</summary>
                <AgentTaskRows
                  className="agent-task-results"
                  tasks={[
                    {
                      id: "context",
                      title: "整理项目背景",
                      status: "completed",
                      meta: "本地项目简报",
                      children: [
                        {
                          label: "目标、约束与评审日期",
                          value: "已整理",
                          status: "completed",
                        },
                      ],
                    },
                    {
                      id: "draft",
                      title: "生成计划草稿",
                      status: "completed",
                      meta: applied.length
                        ? `已保留 ${applied.length} 项变更`
                        : "等待选择计划变更",
                      children: [
                        {
                          label: "任务依赖与负责人",
                          value: "已列出",
                          status: "completed",
                        },
                      ],
                    },
                    {
                      id: "review",
                      title: "确认最终安排",
                      status: approval ? "completed" : "running",
                      meta: approval ? "审批选择已记录" : "等待本页审批",
                      children: [
                        {
                          label: "处理方式与优先事项",
                          value: approval ? "已确认" : "待确认",
                        },
                      ],
                    },
                  ]}
                />
              </details>
              {readonly ? (
                <SurfaceCard title="本周计划 · 仅查看">
                  <p className="text-sm leading-7 text-fg-black">
                    周一整理品牌调研，周二确认视觉方向，再推进首页设计。
                  </p>
                  <Button color="black" size="sm" variant="secondary" disabled>
                    仅查看，不能应用变更
                  </Button>
                </SurfaceCard>
              ) : applied.length === 0 ? (
                <AgentDiffTable
                  title="本周计划草稿"
                  columns={[
                    { key: "task", label: "任务" },
                    { key: "day", label: "安排" },
                    { key: "owner", label: "负责人" },
                  ]}
                  rows={[
                    {
                      id: "research",
                      change: "keep",
                      cells: {
                        task: "整理品牌调研",
                        day: "周一",
                        owner: "林晓",
                      },
                    },
                    {
                      id: "rush",
                      change: "remove",
                      cells: {
                        task: "直接开始首页设计",
                        day: "周二",
                        owner: "周可",
                      },
                    },
                    {
                      id: "direction",
                      change: "add",
                      cells: {
                        task: "先确认视觉方向",
                        day: "周二",
                        owner: "陈一",
                      },
                    },
                  ]}
                  onApply={(ids) => {
                    if (readonly) {
                      toast({
                        title: "仅查看模式不能应用变更",
                        status: "error",
                      });
                      return;
                    }
                    setApplied(ids);
                    toast({ title: `已将 ${ids.length} 项变更记录到计划草稿` });
                  }}
                />
              ) : null}
              {applied.length > 0 && (
                <SurfaceCard title="已选择的计划变更">
                  <p className="text-sm text-fg-black">
                    {applied
                      .map(
                        (id) =>
                          ({
                            research: "整理品牌调研",
                            rush: "移除直接开始首页设计",
                            direction: "先确认视觉方向",
                          })[id],
                      )
                      .join("、")}
                  </p>
                  {!readonly && <Button color="black" size="sm" variant="tertiary" onClick={() => setApplied([])}>重新选择变更</Button>}
                </SurfaceCard>
              )}
              {!readonly && !approval && (
                <ApprovalCard
                  key={permission}
                  questions={[
                    {
                      id: "schedule",
                      prompt: "如何处理这份本周计划？",
                      options: [
                        { id: "draft", label: "保存为计划草稿" },
                        { id: "review", label: "保留待评审" },
                      ],
                    },
                    {
                      id: "focus",
                      prompt: "优先推进哪项工作？",
                      options: [
                        { id: "direction", label: "确认视觉方向" },
                        { id: "design", label: "完善首页方案" },
                      ],
                    },
                  ]}
                  onSubmitted={approve}
                />
              )}
              {approval && (
                <SurfaceCard title="审批结果 · 本地演示">
                  <p className="text-sm text-fg-black">
                    计划：
                    {approval.schedule?.includes("draft")
                      ? "保存为草稿"
                      : approval.schedule?.includes("review")
                        ? "待评审"
                        : "未选择"}
                    ；优先事项：
                    {approval.focus?.includes("direction")
                      ? "确认视觉方向"
                      : approval.focus?.includes("design")
                        ? "完善首页方案"
                        : "未选择"}
                    。
                  </p>
                  {!readonly && <Button color="black" size="sm" variant="tertiary" onClick={() => setApproval(null)}>重新审批</Button>}
                </SurfaceCard>
              )}
            </>
          )}
        </>
      )}
    </article>
  );
}
