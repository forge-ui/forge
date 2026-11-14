import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { AgentMessage, ArtifactCard, Conversation, MessageActions, PromptSuggestions } from "../src/components/ui/agent/agent-conversation";
import { AgentParts, type AgentMessagePart } from "../src/components/ui/agent/agent-parts";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

const parts: AgentMessagePart[] = [
  { type: "step-start" },
  { type: "reasoning", text: "先查库存，再算补货量。", state: "done" },
  { type: "tool-getInventory", toolCallId: "call-1", state: "output-available", input: { sku: "A-1" }, output: { stock: 12 } },
  { type: "tool-getPrice", toolCallId: "call-2", state: "output-error", input: { sku: "A-1" }, errorText: "价格服务超时" },
  { type: "text", text: "库存 **12** 件，建议补货 30 件。", state: "done" },
  { type: "source-url", sourceId: "s1", url: "https://example.com/stock", title: "库存报表" },
  { type: "file", mediaType: "text/csv", url: "blob:report", filename: "补货清单.csv" },
  { type: "data-unknown", value: 1 },
];

test("AgentParts maps AI SDK parts to Forge components", () => {
  const html = renderToStaticMarkup(<AgentParts parts={parts} />);
  for (const text of ["思考", "getInventory", "getPrice", "2 次工具调用", "1 个来源", "补货清单.csv", "text/csv"]) assert.ok(html.includes(text), text);
  assert.ok(!html.includes("思考过程"), "reasoning before tool calls is a row of their group, not a block of its own");
  assert.ok(html.includes("建议补货 30 件"), "answer text");
  assert.ok(!html.includes("**12**"), "markdown syntax is rendered, not shown raw");
  assert.equal((html.match(/data-tool-state/g) ?? []).length, 1, "consecutive tools grouped");
  assert.ok(html.includes('data-tool-state="error"'));
});

test("AgentParts keeps reasoning on its own when no tool call follows, skipping empty parts", () => {
  const html = renderToStaticMarkup(<AgentParts parts={[{ type: "reasoning", text: "", state: "done" }, { type: "reasoning", text: "先查库存。", state: "done" }, { type: "reasoning", text: "再算补货量。", state: "done" }, { type: "text", text: "建议补货 30 件。", state: "done" }]} />);
  assert.equal((html.match(/思考过程/g) ?? []).length, 1, "one block for the run");
  for (const text of ["先查库存。", "再算补货量。"]) assert.ok(html.includes(text), text);
  assert.ok(!html.includes("data-tool-state"));
});

test("renderTool replaces a finished tool call with custom UI", () => {
  const html = renderToStaticMarkup(<AgentParts parts={parts} renderTool={{ getInventory: part => <div data-custom>库存卡片 {String((part.output as { stock: number }).stock)}</div> }} />);
  assert.ok(html.includes("库存卡片 12"));
  assert.ok(html.includes("getPrice"), "unmatched tools still render as chips");
  assert.ok(!html.includes(">getInventory<"));
});

test("messages, suggestions and artifacts render their states and labels", () => {
  const html = renderToStaticMarkup(<Conversation locale="en">
    <AgentMessage role="user">你好</AgentMessage>
    <AgentMessage role="assistant" name="助手" time="09:30" actions={<MessageActions copyText="a" onRetry={() => undefined} onFeedback={() => undefined} />}>回答</AgentMessage>
    <PromptSuggestions label="试试" suggestions={["本周订单", "退款原因"]} onSelect={() => undefined} />
    <ArtifactCard title="周报.md" status="generating" />
    <ArtifactCard title="图表.png" kind="image" status="error" locale="en" />
  </Conversation>);
  for (const text of ['data-role="user"', 'data-role="assistant"', "助手", "09:30", "复制", "重新生成", "有帮助", "没帮助", "试试", "本周订单", "生成中…", "Failed", 'role="log"']) assert.ok(html.includes(text), text);
  const bare = renderToStaticMarkup(<MessageActions />);
  assert.ok(!bare.includes("<button"), "actions render only when wired");
});

test("feedback toggles and reports, copy writes the text", async () => {
  const dom = new JSDOM('<div id="root"></div>');
  let copied = "";
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement });
  Object.defineProperty(globalThis, "navigator", { value: { clipboard: { writeText: async (text: string) => { copied = text; } } }, configurable: true });
  const votes: unknown[] = [];
  const root = createRoot(document.getElementById("root")!);
  try {
    await act(async () => root.render(<MessageActions copyText="答案全文" onFeedback={value => votes.push(value)} />));
    const up = document.querySelector<HTMLButtonElement>('[aria-label="有帮助"]')!;
    await act(async () => up.click());
    assert.equal(up.getAttribute("aria-pressed"), "true");
    await act(async () => up.click());
    assert.deepEqual(votes, ["up", null]);
    await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="复制"]')!.click());
    assert.equal(copied, "答案全文");
  } finally {
    await act(async () => root.unmount());
  }
});
