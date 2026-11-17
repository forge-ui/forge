import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { AgentInbox, AwaySummary, RunningNow } from "../src/components/ui/agent/agent-ops";
import { AgentPlan, AgentTrail, type PlanStep } from "../src/components/ui/agent/agent-run";
import { AgentCheckpoints, AutonomySelector, ChangeLedger, type LedgerEntry } from "../src/components/ui/agent/agent-governance";
import { AgentTree, ContextUsage, TraceWaterfall } from "../src/components/ui/agent/agent-observe";
import { Approval, ConfirmCard } from "../src/components/ui/agent/approval";
import { CitedAnswer } from "../src/components/ui/agent/cited-answer";
import { AttachmentList, PromptQueue, RunControls } from "../src/components/ui/agent/composer-parts";
import { ChoiceCard, Question } from "../src/components/ui/agent/question";
import { Reasoning, ThinkingIndicator } from "../src/components/ui/agent/thinking";
import { ToolCall, ToolCallGroup } from "../src/components/ui/agent/tool-call";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

async function mount(node: React.ReactNode) {
  const dom = new JSDOM('<div id="root"></div>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, HTMLInputElement: dom.window.HTMLInputElement, KeyboardEvent: dom.window.KeyboardEvent });
  const root = createRoot(document.getElementById("root")!);
  await act(async () => root.render(node));
  return {
    click: async (selector: string) => act(async () => { document.querySelector<HTMLElement>(selector)!.click(); }),
    clickText: async (text: string) => act(async () => { [...document.querySelectorAll<HTMLElement>("button")].find(button => button.textContent?.trim() === text)!.click(); }),
    key: async (selector: string, key: string) => act(async () => { document.querySelector(selector)!.dispatchEvent(new window.KeyboardEvent("keydown", { key, bubbles: true })); }),
    html: () => document.body.innerHTML,
    unmount: async () => act(async () => root.unmount()),
  };
}

test("thinking states are driven by the host", () => {
  const thinking = renderToStaticMarkup(<Reasoning status="thinking" text="先读订单。" />);
  assert.ok(thinking.includes("思考中") && thinking.includes("先读订单。"), "open while thinking");
  const done = renderToStaticMarkup(<Reasoning status="done" duration={4200} steps={[{ id: "a", label: "读订单" }, { id: "b", label: "算金额" }]} />);
  assert.ok(done.includes("思考了 4.2 秒") && done.includes("2 步"));
  assert.ok(!done.includes("读订单"), "folded once done");
  assert.ok(renderToStaticMarkup(<ThinkingIndicator phases={["读取页面", "查询订单"]} />).includes("读取页面"));
});

test("tool calls show status, approval and grouped summary", () => {
  const html = renderToStaticMarkup(
    <ToolCallGroup count={2} status="error">
      <ToolCall name="search_orders" status="success" summary="12 条" duration={1300} args={{ q: "退款" }} />
      <ToolCall name="refund" status="error" error="余额不足" />
    </ToolCallGroup>,
  );
  for (const text of ["调用了 2 次工具", "search_orders", "12 条", "1.3 秒", "失败", "余额不足"]) assert.ok(html.includes(text), text);
  const asking = renderToStaticMarkup(<ToolCall name="refund" status="awaiting-approval" approvalReason="金额超过 500 元" onApprove={() => undefined} onDeny={() => undefined} />);
  for (const text of ["待确认", "金额超过 500 元", "允许", "拒绝"]) assert.ok(asking.includes(text), text);
});

test("Question answers with number keys and walks through several questions", async () => {
  let submitted: unknown;
  const view = await mount(<Question onSubmit={answers => { submitted = answers; }} questions={[
    { id: "range", title: "统计范围", options: [{ id: "week", label: "本周" }, { id: "month", label: "本月", recommended: true }] },
    { id: "format", title: "输出格式", options: [{ id: "table", label: "表格" }, { id: "chart", label: "图表" }], multiple: true },
  ]} />);
  try {
    assert.ok(view.html().includes("1/2") && view.html().includes("推荐"));
    await view.key('[role="group"]', "2");
    assert.ok(view.html().includes("2/2"), "a single choice moves on");
    await view.key('[role="group"]', "1");
    await view.key('[role="group"]', "2");
    await view.clickText("提交");
    assert.deepEqual(submitted, { range: { optionIds: ["month"] }, format: { optionIds: ["table", "chart"] } });
  } finally {
    await view.unmount();
  }
  const answered = renderToStaticMarkup(<Question onSubmit={() => undefined} answers={{ range: { optionIds: ["week"] } }} questions={[{ id: "range", title: "统计范围", options: [{ id: "week", label: "本周" }] }]} />);
  assert.ok(answered.includes("统计范围：") && answered.includes("本周"));
});

test("ChoiceCard keeps its single-question contract", async () => {
  const answers: unknown[] = [];
  const view = await mount(<ChoiceCard title="选哪个账号" options={[{ id: "u1", label: "张三" }, { id: "u2", label: "李四" }]} onAnswer={answer => answers.push(answer)} />);
  try {
    await view.clickText("2李四");
    assert.deepEqual(answers, [{ optionId: "u2" }]);
  } finally {
    await view.unmount();
  }
  assert.ok(renderToStaticMarkup(<ChoiceCard title="选哪个账号" options={[]} answered="张三" onAnswer={() => undefined} />).includes("张三"));
});

test("Approval offers scopes, asks why on deny and folds when resolved", async () => {
  const calls: unknown[] = [];
  const view = await mount(<Approval title="删除 3 条草稿" risk="high" scopes={["once", "session"]} askDenyReason onApprove={scope => calls.push(scope)} onDeny={reason => calls.push({ reason })} />);
  try {
    assert.ok(view.html().includes("高风险"));
    await view.clickText("本次对话都允许");
    await view.clickText("拒绝");
    assert.ok(view.html().includes("拒绝原因"), "deny asks for a reason first");
    await view.clickText("拒绝");
    assert.deepEqual(calls, ["session", { reason: undefined }]);
  } finally {
    await view.unmount();
  }
  assert.ok(renderToStaticMarkup(<Approval title="删除草稿" state="approved" result="已删除 3 条" />).includes("已允许"));
  assert.ok(renderToStaticMarkup(<ConfirmCard title="改角色" state="done" result="已保存" />).includes("已保存"));
  assert.ok(renderToStaticMarkup(<ConfirmCard title="改角色" state="cancelled" />).includes("已取消"));
});

test("CitedAnswer turns markers into chips and lists only cited sources", () => {
  const html = renderToStaticMarkup(<CitedAnswer text={"本月退款 12 笔[1]。主要原因是尺码[2]。\n\n其余正常。"} sources={[{ id: 1, title: "退款报表" }, { id: 2, title: "客服工单", href: "https://example.com/t" }, { id: 3, title: "没引用" }]} />);
  for (const text of ["退款报表", "客服工单", "来源 1：退款报表", "example.com"]) assert.ok(html.includes(text), text);
  assert.ok(!html.includes("[1]") && !html.includes("没引用"));
  assert.equal((html.match(/<p>/g) ?? []).length, 2);
});

test("composer parts: queue, run controls and attachments", () => {
  const queue = renderToStaticMarkup(<PromptQueue items={[{ id: "a", text: "再按地区拆一下" }, { id: "b", text: "导出 Excel", attachments: 2 }]} onRemove={() => undefined} />);
  assert.ok(queue.includes("排队中 2 条") && queue.includes("+2"));
  assert.equal(renderToStaticMarkup(<PromptQueue items={[]} />), "");
  const stopped = renderToStaticMarkup(<RunControls status="stopped" onResume={() => undefined} onRetry={() => undefined} />);
  assert.ok(stopped.includes("已停止") && stopped.includes("继续") && stopped.includes("重试"));
  const running = renderToStaticMarkup(<RunControls status="running" activity="核对发票" onStop={() => undefined} onSteer={() => undefined} />);
  assert.ok(running.includes("核对发票") && running.includes("插一句") && running.includes("停止"));
  const files = renderToStaticMarkup(<AttachmentList items={[{ id: "1", name: "合同.pdf", size: 2_400_000, kind: "document" }, { id: "2", name: "图.png", progress: 40 }, { id: "3", name: "坏.xlsx", error: "格式不支持" }]} onRemove={() => undefined} onRetry={() => undefined} />);
  for (const text of ["2.3 MB", "上传中 40%", "格式不支持", "重试上传 坏.xlsx"]) assert.ok(files.includes(text), text);
});

test("AgentPlan edits in review and retries from a failed step", async () => {
  function Editable() {
    const [steps, setSteps] = useState<PlanStep[]>([{ id: "a", title: "拉取订单" }, { id: "b", title: "生成报表" }]);
    return <AgentPlan steps={steps} onChange={setSteps} onApprove={() => undefined} />;
  }
  const view = await mount(<Editable />);
  try {
    await view.click('[aria-label="下移"]');
    const titles = [...document.querySelectorAll<HTMLInputElement>("li input")].map(input => input.value);
    assert.deepEqual(titles, ["生成报表", "拉取订单"]);
    await view.click('[aria-label="删除这一步"]');
    assert.equal(document.querySelectorAll("li input").length, 1);
  } finally {
    await view.unmount();
  }
  const running = renderToStaticMarkup(<AgentPlan mode="running" onRetryFrom={() => undefined} steps={[{ id: "a", title: "拉取订单", status: "done", duration: 1200 }, { id: "b", title: "生成报表", status: "failed" }]} />);
  assert.ok(running.includes("1/2") && running.includes("从这一步重试") && running.includes("1.2 秒"));
  const trail = renderToStaticMarkup(<AgentTrail title="月末对账" steps={[{ id: "a", title: "下载流水", status: "done" }, { id: "b", title: "核对", status: "running", activity: "第 3 张发票", substeps: [{ id: "x", title: "发票 1", status: "done" }] }, { id: "c", title: "提交", status: "waiting", waiting: <span>等你确认</span> }]} />);
  for (const text of ["1/3", "第 3 张发票", "发票 1", "等你确认"]) assert.ok(trail.includes(text), text);
});

test("ChangeLedger undoes dependents together", async () => {
  const entries: LedgerEntry[] = [
    { id: "role", title: "张三改为管理员", fields: [{ label: "角色", before: "成员", after: "管理员" }] },
    { id: "perm", title: "给张三开财务权限", dependsOn: ["role"] },
    { id: "mail", title: "发出通知邮件", status: "irreversible" },
  ];
  const undone: unknown[] = [];
  const view = await mount(<ChangeLedger entries={entries} onUndo={(id, also) => undone.push([id, also])} />);
  try {
    assert.ok(view.html().includes("不可撤销") && view.html().includes("成员"));
    await view.clickText("撤销");
    assert.ok(view.html().includes("会一并撤销"), "dependents are named before undoing");
    await view.clickText("一起撤销 2 项");
    assert.deepEqual(undone, [["role", ["perm"]]]);
  } finally {
    await view.unmount();
  }
  const points = renderToStaticMarkup(<AgentCheckpoints onRewind={() => undefined} checkpoints={[{ id: "1", label: "读取需求" }, { id: "2", label: "第一版方案", abandoned: true }, { id: "3", label: "第二版方案" }]} />);
  assert.ok(points.includes("已放弃的尝试") && points.includes("回到这里"));
  const autonomy = renderToStaticMarkup(<AutonomySelector value="balanced" onChange={() => undefined} actions={[{ id: "a", label: "查询订单", risk: "low" }, { id: "b", label: "退款", risk: "high" }]} />);
  assert.ok(autonomy.includes("自己做") && autonomy.includes("先问你") && autonomy.includes('aria-checked="true"'));
});

test("ops views: inbox filters, running pill and away summary", async () => {
  const tasks = [
    { id: "1", title: "核对 11 月发票", status: "running" as const, agent: "财务助手" },
    { id: "2", title: "退款审批", status: "needs-you" as const, summary: "金额 800 元" },
    { id: "3", title: "导出报表", status: "failed" as const },
  ];
  const view = await mount(<AgentInbox tasks={tasks} onApprove={() => undefined} onRetry={() => undefined} />);
  try {
    assert.ok(view.html().indexOf("退款审批") < view.html().indexOf("核对 11 月发票"), "what needs you comes first");
    await view.click('[role="tab"]:nth-child(5)');
    assert.ok(view.html().includes("这里没有任务"));
  } finally {
    await view.unmount();
  }
  const pill = renderToStaticMarkup(<RunningNow tasks={tasks} />);
  assert.ok(pill.includes("1 个运行中") && pill.includes("1 个待你处理"));
  assert.equal(renderToStaticMarkup(<RunningNow tasks={[{ id: "x", title: "完成的", status: "done" }]} />), "");
  const away = renderToStaticMarkup(<AwaySummary awayFor={2 * 3600_000 + 15 * 60_000} items={[{ id: "a", title: "退款审批", kind: "needs-you", onAction: () => undefined }, { id: "b", title: "日报", kind: "done" }]} />);
  assert.ok(away.includes("你离开了 2 小时 15 分") && away.includes("需要你处理 1 项"));
});

test("observability: context, trace and tree roll up numbers", () => {
  const context = renderToStaticMarkup(<ContextUsage limit={128_000} cost={0.42} segments={[{ id: "s", label: "系统", tokens: 4000, kind: "system" }, { id: "f", label: "合同.pdf", tokens: 60_000, kind: "files", removable: true }]} onRemove={() => undefined} onCompact={() => undefined} />);
  for (const text of ["64K / 128K", "50%", "$0.42", "移出上下文：合同.pdf", "压缩早期对话"]) assert.ok(context.includes(text), text);
  const trace = renderToStaticMarkup(<TraceWaterfall spans={[{ id: "1", name: "规划", kind: "llm", start: 0, duration: 2000, tokens: 1500, cost: 0.01 }, { id: "2", name: "search", kind: "tool", start: 2000, duration: 1000, depth: 1 }]} />);
  assert.ok(trace.includes("3.0 秒") && trace.includes("1.5K") && trace.includes("$0.01"));
  const tree = renderToStaticMarkup(<AgentTree root={{ id: "lead", name: "主管", status: "running", cost: 0.1, children: [{ id: "a", name: "检索", status: "done", cost: 0.05 }, { id: "b", name: "写作", status: "running", cost: 0.2 }] }} />);
  assert.ok(tree.includes("$0.35"), "the root shows its branch total");
});
