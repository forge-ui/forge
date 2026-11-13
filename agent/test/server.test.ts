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

test("generated values must appear in tool results", () => {
  const sources = sourcesFrom([{ total: 1284, url: "https://example.com/a.png" }]);
  assert.ok(sources.has(1284));
  assert.ok(sources.has("https://example.com/a.png"));
  assert.ok(!sources.has(9999));
});
