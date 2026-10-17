import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { ApprovalCard } from "../src/components/ui/agent/approval-card";
import { AgentTaskRows } from "../src/components/ui/agent/agent-task-rows";
import { ContextCards } from "../src/components/ui/agent/context-cards";
import { RecommendationCard } from "../src/components/ui/agent/recommendation-card";
import { InsightCards } from "../src/components/ui/agent/insight-cards";
import { AgentFlowchart } from "../src/components/ui/agent/agent-flowchart";
import { AgentDiffTable } from "../src/components/ui/agent/agent-diff-table";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

function markup(locale?: "zh" | "en") {
  return renderToStaticMarkup(<>
    <AgentTaskRows locale={locale} tasks={[{ id: "a", title: "任务", status: "completed" }]} />
    <ContextCards locale={locale} chunks={[{ id: "a", title: "资料", body: "正文", charCount: 10 }]} />
    <RecommendationCard locale={locale} title="建议" body="说明" />
    <InsightCards locale={locale} cards={[{ id: "a", title: "洞察", body: "正文" }, { id: "b", title: "另一条", body: "正文" }]} />
    <AgentFlowchart locale={locale} nodes={[{ id: "a", kind: "trigger", title: "开始" }]} />
    <AgentDiffTable locale={locale} title="审核" columns={[]} rows={[{ id: "a", change: "add", cells: {} }]} />
    <ApprovalCard locale={locale} questions={[{ id: "a", prompt: "问题", options: [] }]} />
  </>);
}

test("agent controls default to Chinese and offer a complete English locale", () => {
  const zh = markup();
  for (const label of ["已完成", "全部片段", "字符", "接受建议", "高置信度", "上一条洞察", "下一条洞察", "工作流程", "触发", "当前节点", "应用 1 项变更", "新增 1 项", "跳过", "提交", "上一题"]) assert.ok(zh.includes(label), label);
  const en = markup("en");
  for (const label of ["Completed", "All chunks", "characters", "Accept", "High confidence", "Previous insight", "Next insight", "Workflow", "Trigger", "Selected", "Apply 1 change", "1 addition", "Skip", "Send", "Previous question"]) assert.ok(en.includes(label), label);
  const custom = renderToStaticMarkup(<AgentTaskRows locale="zh" tasks={[{ id: "a", title: "任务", status: "completed" }]} statusLabels={{ completed: "处理完毕" }} />);
  assert.ok(custom.includes("处理完毕"));
  assert.ok(!custom.includes("已完成"));
});

async function setup() {
  const dom = new JSDOM('<div id="root"></div>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement });
  const root = createRoot(document.getElementById("root")!);
  return { render: (node: ReactNode) => act(async () => root.render(node)), close: async () => { await act(async () => root.unmount()); dom.window.close(); } };
}
function button(text: string) {
  const found = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(item => item.textContent === text || item.getAttribute("aria-label") === text);
  assert.ok(found, `button ${text}`);
  return found;
}

const questions = [
  { id: "scope", prompt: "选择范围", options: [{ id: "small", label: "小范围" }, { id: "large", label: "大范围" }] },
  { id: "checks", prompt: "选择检查", type: "check" as const, options: [{ id: "a11y", label: "无障碍" }, { id: "mobile", label: "移动端" }] },
  { id: "timing", prompt: "选择时间", options: [{ id: "today", label: "今天" }, { id: "tomorrow", label: "明天" }] },
];

test("approval changes stay on the same question and final submission includes the latest answer exactly once", async () => {
  const env = await setup();
  const submissions: Record<string, string[]>[] = [];
  try {
    await env.render(<ApprovalCard questions={questions} onSubmitted={answers => submissions.push(answers)} />);
    await act(async () => { button("小范围").click(); button("大范围").click(); });
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 350)); });
    assert.ok(document.body.textContent?.includes("选择范围"));
    assert.equal(button("大范围").getAttribute("aria-pressed"), "true");
    await act(async () => button("继续").click());
    await act(async () => button("无障碍").click());
    await act(async () => button("移动端").click());
    await act(async () => button("继续").click());
    assert.equal(button("提交").disabled, true);
    await act(async () => { button("今天").click(); button("明天").click(); });
    const submit = button("提交");
    await act(async () => { submit.click(); submit.click(); });
    assert.deepEqual(submissions, [{ scope: ["large"], checks: ["a11y", "mobile"], timing: ["tomorrow"] }]);
    assert.ok(document.body.textContent?.includes("答案已提交"));
    assert.equal(document.activeElement, document.querySelector('[role="status"]'));
    assert.equal(document.activeElement?.textContent, "答案已提交");
  } finally { await env.close(); }
});

test("approval back navigation preserves answers and skipping never schedules a later jump", async () => {
  const env = await setup();
  try {
    await env.render(<ApprovalCard questions={questions} />);
    await act(async () => button("大范围").click());
    await act(async () => button("继续").click());
    await act(async () => button("上一题").click());
    assert.equal(button("大范围").getAttribute("aria-pressed"), "true");
    await act(async () => button("小范围").click());
    await act(async () => button("跳过").click());
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 350)); });
    assert.ok(document.body.textContent?.includes("选择检查"));
    await act(async () => button("上一题").click());
    assert.equal(button("小范围").getAttribute("aria-pressed"), "false");
  } finally { await env.close(); }
});


test("skipping removes an existing answer and the explicit final skip submits only once", async () => {
  const env = await setup();
  const submissions: Record<string, string[]>[] = [];
  try {
    await env.render(<ApprovalCard questions={questions} onSubmitted={answers => submissions.push(answers)} />);
    await act(async () => button("大范围").click());
    await act(async () => button("跳过").click());
    await act(async () => button("上一题").click());
    assert.equal(button("大范围").getAttribute("aria-pressed"), "false");
    await act(async () => button("小范围").click());
    await act(async () => button("继续").click());
    await act(async () => button("无障碍").click());
    await act(async () => button("跳过").click());
    await act(async () => button("今天").click());
    const skip = button("跳过并提交");
    await act(async () => { skip.click(); skip.click(); });
    assert.deepEqual(submissions, [{ scope: ["small"] }]);
    assert.equal(document.activeElement?.getAttribute("role"), "status");
    assert.equal(document.activeElement?.textContent, "答案已提交");
  } finally { await env.close(); }
});
