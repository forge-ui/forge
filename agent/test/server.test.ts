import assert from "node:assert/strict";
import { test } from "node:test";
import { simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { createAgentHandler } from "../src/server/index";
import { sourcesFrom } from "../src/catalog/render";

function mockModel() {
  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: "text-start", id: "t" },
          { type: "text-delta", id: "t", delta: "你好" },
          { type: "text-end", id: "t" },
          { type: "finish", finishReason: { unified: "stop", raw: undefined }, logprobs: undefined, usage: { inputTokens: { total: 1, noCache: 1, cacheRead: undefined, cacheWrite: undefined }, outputTokens: { total: 1, text: 1, reasoning: undefined } } },
        ],
      }),
    }),
  });
}

const post = (body: unknown) => new Request("http://localhost/api/agent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const userMessage = { id: "u1", role: "user", parts: [{ type: "text", text: "hi" }] };

test("rejects a malformed request", async () => {
  const response = await createAgentHandler({ model: mockModel(), instructions: "x" })(post({ messages: [] }));
  assert.equal(response.status, 400);
});

test("streams the answer and offers catalog, server and browser tools to the model", async () => {
  const model = mockModel();
  const handler = createAgentHandler({ model, instructions: "你是助手" });
  const response = await handler(post({
    messages: [userMessage],
    context: { path: "/docs" },
    tools: [{ name: "open_page", description: "打开页面", inputSchema: { type: "object", properties: { path: { type: "string" } } }, needsApproval: true }],
  }));
  assert.equal(response.status, 200);
  assert.match(await response.text(), /你好/);
  const call = model.doStreamCalls[0];
  const names = (call.tools ?? []).map(item => item.name);
  assert.ok(names.includes("open_page") && names.includes("show_cards"));
  assert.match(JSON.stringify(call.tools?.find(item => item.name === "open_page")), /需要用户确认/);
  assert.match(JSON.stringify(call.prompt), /\/docs/);
});

test("browser tools cannot shadow server or catalog tools", async () => {
  const model = mockModel();
  const response = await createAgentHandler({ model, instructions: "x" })(post({ messages: [userMessage], tools: [{ name: "show_cards", description: "fake", inputSchema: { type: "object" } }] }));
  await response.text();
  const cards = model.doStreamCalls[0].tools?.filter(item => item.name === "show_cards") ?? [];
  assert.equal(cards.length, 1);
  assert.doesNotMatch(JSON.stringify(cards[0]), /fake/);
});

test("the current page and operating rules reach the model only when the browser can operate it", async () => {
  const page = "当前页面 /docs/theme\n[e7] 按钮「紫」（主色）";
  const readPage = { name: "read_page", description: "读取页面", inputSchema: { type: "object" } };
  const operating = mockModel();
  await (await createAgentHandler({ model: operating, instructions: "x" })(post({ messages: [userMessage], page, tools: [readPage] }))).text();
  assert.match(JSON.stringify(operating.doStreamCalls[0].prompt), /页面操作规则[\s\S]*\[e7\] 按钮「紫」/);

  const reading = mockModel();
  await (await createAgentHandler({ model: reading, instructions: "x" })(post({ messages: [userMessage], page }))).text();
  assert.doesNotMatch(JSON.stringify(reading.doStreamCalls[0].prompt), /页面操作规则|\[e7\]/);
});

test("only topic titles ride along; a matching question brings its topic, and read_topic serves the rest", async () => {
  let loads = 0;
  const topics = [
    { id: "quick-start", title: "快速开始", summary: "安装与接入", content: () => { loads++; return "pnpm add @forge-ui-official/core"; }, match: [/怎么安装/] },
    { id: "mcp", title: "MCP 服务器", summary: "地址和工具", content: "MCP 地址 https://www.forgeui.org/api/mcp" },
  ];
  const plain = mockModel();
  await (await createAgentHandler({ model: plain, instructions: "x", topics })(post({ messages: [userMessage] }))).text();
  const prompt = JSON.stringify(plain.doStreamCalls[0].prompt);
  assert.match(prompt, /quick-start：快速开始/);
  assert.doesNotMatch(prompt, /pnpm add|api\/mcp/);
  assert.equal(loads, 0);
  assert.ok(plain.doStreamCalls[0].tools?.some(item => item.name === "read_topic"));

  const asked = mockModel();
  const question = { id: "u2", role: "user", parts: [{ type: "text", text: "Forge 怎么安装？" }] };
  await (await createAgentHandler({ model: asked, instructions: "x", topics })(post({ messages: [question] }))).text();
  assert.match(JSON.stringify(asked.doStreamCalls[0].prompt), /已经读好[\s\S]*pnpm add @forge-ui-official\/core/);
  assert.equal(loads, 1);
});

test("page notes go only to requests from that page; the longest prefix wins", async () => {
  const pageInstructions = { "/docs/*": "文档通用", "/docs/theme": "主题页说明", "/blocks/*": "区块说明" };
  const prompts = await Promise.all(["/docs/theme?x=1", "/docs/mcp", "/pricing"].map(async path => {
    const model = mockModel();
    await (await createAgentHandler({ model, instructions: "x", pageInstructions })(post({ messages: [userMessage], context: { path } }))).text();
    return JSON.stringify(model.doStreamCalls[0].prompt);
  }));
  assert.match(prompts[0], /主题页说明/);
  assert.doesNotMatch(prompts[0], /文档通用/);
  assert.match(prompts[1], /文档通用/);
  assert.doesNotMatch(prompts[2], /本页说明|主题页说明|文档通用|区块说明/);
});

test("a canned question is answered without the model; a continuing run still reaches it", async () => {
  const model = mockModel();
  const handler = createAgentHandler({ model, instructions: "x", answers: [{ question: "怎么让 Claude Code 按 Forge 写页面？", answer: "运行 setup.sh" }] });
  const asked = { id: "u3", role: "user", parts: [{ type: "text", text: " 怎么让 claude code 按 Forge 写页面? " }] };
  const response = await handler(post({ messages: [asked] }));
  assert.match(await response.text(), /运行 setup\.sh/);
  assert.equal(model.doStreamCalls.length, 0);

  const assistant = { id: "a3", role: "assistant", parts: [{ type: "text", text: "好" }] };
  await (await handler(post({ messages: [asked, assistant] }))).text();
  assert.equal(model.doStreamCalls.length, 1);
});

test("topic ids are checked when the handler is created", () => {
  assert.throws(() => createAgentHandler({ model: mockModel(), instructions: "x", topics: [{ id: "Quick Start", title: "t", summary: "s", content: "c" }] }), /lowercase/);
});

test("generated values must appear in tool results", () => {
  const sources = sourcesFrom([{ total: 1284, url: "https://example.com/a.png" }]);
  assert.ok(sources.has(1284));
  assert.ok(sources.has("https://example.com/a.png"));
  assert.ok(!sources.has(9999));
});
