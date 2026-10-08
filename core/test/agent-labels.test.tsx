import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { AgentTaskRows } from "../src/components/ui/agent/agent-task-rows";
import { AgentCodeBlock } from "../src/components/ui/agent/agent-code-block";
import { AgentFlowchart } from "../src/components/ui/agent/agent-flowchart";
import { ContextCards } from "../src/components/ui/agent/context-cards";
import { CommandSearch } from "../src/components/ui/agent/command-search";
import { RecommendationCard } from "../src/components/ui/agent/recommendation-card";
import { AgentDiffTable } from "../src/components/ui/agent/agent-diff-table";
import { PromptBar } from "../src/components/ui/agent/prompt-bar";
import { ApprovalCard } from "../src/components/ui/agent/approval-card";
import { InsightCards } from "../src/components/ui/agent/insight-cards";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

test("task state translations cover both layouts and preserve partial-map defaults", () => {
  const tasks = ["running", "failed", "completed"].map(status => ({ id: status, title: status, status: status as "running" | "failed" | "completed" }));
  for (const variant of ["list", "capsules"] as const) {
    const html = renderToStaticMarkup(<AgentTaskRows tasks={tasks} variant={variant} statusLabels={{ running: "运行中", failed: "失败", completed: "已完成" }} />);
    for (const label of ["运行中", "失败", "已完成"]) assert.ok(html.includes(label));
    for (const label of ["Running", "Failed", "Completed"]) assert.ok(!html.includes(label));
    const fallback = renderToStaticMarkup(<AgentTaskRows tasks={tasks} variant={variant} statusLabels={{ running: "运行中" }} />);
    assert.ok(fallback.includes("Failed") && fallback.includes("Completed"));
  }
});

test("agent built-in headings, actions, counts and accessible names accept translations", () => {
  const html = renderToStaticMarkup(<>
    <AgentCodeBlock filename="a" lines={["a"]} diff={[]} codeLabel="代码" diffLabel="差异" copyLabel="复制" />
    <AgentFlowchart title="流程" nodes={[{ id: "a", kind: "trigger", title: "A" }, { id: "b", kind: "action", title: "B" }]} edges={[{ from: "a", to: "b" }]} kindLabels={{ trigger: "触发器", action: "操作" }} selectedLabel="已选" nextLabel="下一步" />
    <ContextCards chunks={[{ id: "a", title: "A", body: "B", charCount: 3 }]} allChunksLabel="全部片段" charactersLabel="字符" />
    <CommandSearch items={[{ id: "a", label: "A" }]} groupLabel="指令" placeholder="搜索" />
    <RecommendationCard title="A" body="B" confidenceLabels={{ high: "高置信度", review: "待审核" }} alternativesLabel="其他选项" alternatives={[{ id: "a", label: "A", confidence: "review" }]} />
    <AgentDiffTable title="A" columns={[]} rows={[{ id: "a", cells: {}, change: "add" }]} toggleHint="点击切换" formatApplyLabel={count => `应用 ${count} 项`} />
    <PromptBar onAttach={() => {}} onDictate={() => {}} attachLabel="附件" dictateLabel="语音" />
    <ApprovalCard questions={[{ id: "a", prompt: "A", options: [] }, { id: "b", prompt: "B", options: [] }]} previousQuestionLabel="上一题" nextQuestionLabel="下一题" />
    <InsightCards cards={[{ id: "a", title: "A", body: "B" }, { id: "b", title: "B", body: "C" }]} previousInsightLabel="上一条" nextInsightLabel="下一条" />
  </>);
  for (const text of ["代码", "差异", "复制", "触发器", "已选", "下一步", "全部片段", "字符", "指令", "高置信度", "待审核", "其他选项", "点击切换", "应用 1 项", "附件", "语音", "上一题", "下一题", "上一条", "下一条"]) assert.ok(html.includes(text), text);
});


test("translations update live and diff count formatters cover selection and completion", async () => {
  const dom = new JSDOM('<div id="root"></div>');
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement });
  const root = createRoot(document.getElementById("root")!);
  const tasks = [{ id: "a", title: "A", status: "completed" as const }];
  try {
    await act(async () => root.render(<AgentTaskRows tasks={tasks} />));
    assert.ok(document.body.textContent?.includes("Completed"));
    await act(async () => root.render(<AgentTaskRows tasks={tasks} statusLabels={{ completed: "已完成" }} />));
    assert.ok(document.body.textContent?.includes("已完成"));
    assert.ok(!document.body.textContent?.includes("Completed"));
    await act(async () => root.render(<AgentDiffTable title="A" columns={[{ key: "name", label: "名称" }]} rows={[{ id: "a", cells: { name: "A" }, change: "add" }, { id: "b", cells: { name: "B" }, change: "remove" }]} formatApplyLabel={count => `应用 ${count} 项`} formatAppliedLabel={count => `已应用 ${count} 项`} />));
    assert.ok(document.body.textContent?.includes("应用 2 项"));
    await act(async () => document.querySelector<HTMLTableRowElement>("tbody tr")!.click());
    assert.ok(document.body.textContent?.includes("应用 1 项"));
    const button = Array.from(document.querySelectorAll("button")).find(item => item.textContent === "应用 1 项")!;
    await act(async () => button.click());
    assert.ok(document.body.textContent?.includes("已应用 1 项"));
  } finally { await act(async () => root.unmount()); dom.window.close(); }
});
