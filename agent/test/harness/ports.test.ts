import assert from "node:assert/strict";
import { test } from "node:test";
import { MockLanguageModelV4 } from "ai/test";
import { advanceRun, aiSdkModel, MemoryTaskStore, type Capability, type HarnessPorts, type Input } from "../../src/harness";

const usage = { inputTokens: { total: 1, noCache: 1, cacheRead: undefined, cacheWrite: undefined }, outputTokens: { total: 1, text: 1, reasoning: undefined } };

test("an AI SDK model drives the harness: its tool call runs, then it answers from the result", async () => {
  const model = new MockLanguageModelV4({
    doGenerate: [
      { content: [{ type: "tool-call", toolCallId: "c1", toolName: "tickets_list", input: JSON.stringify({ status: "open" }) }], finishReason: { unified: "tool-calls", raw: undefined }, usage, warnings: [] },
      { content: [{ type: "text", text: "有 2 张未关闭工单。" }], finishReason: { unified: "stop", raw: undefined }, usage, warnings: [] },
    ],
  });
  const capabilities: Capability[] = [{ name: "tickets_list", description: "查询工单", parameters: { type: "object", properties: { status: { type: "string" } } }, effect: "read" }];
  const calls: unknown[] = [];
  let id = 0;
  const ports: HarnessPorts = {
    store: new MemoryTaskStore(),
    model: aiSdkModel(model),
    capabilities: { list: async () => capabilities, invoke: async (_name, args) => { calls.push(args); return { summary: "2 张", data: { count: 2 } }; } },
    context: { resolve: async () => "" },
    operations: { retire: async () => undefined },
    id: () => `id-${++id}`,
    now: () => new Date("2026-11-16T00:00:00Z"),
  };
  const input: Input = { ownerId: "u1", applicationId: "app", buildId: "b1", requestId: "r1", question: "还有多少未关闭工单？" };
  const run = await advanceRun(input, ports);
  assert.equal(run.status, "completed", run.output.text);
  assert.equal(run.output.text, "有 2 张未关闭工单。");
  assert.deepEqual(calls, [{ status: "open" }]);
  // The second model call saw the tool result under the tool's own name.
  const prompt = JSON.stringify(model.doGenerateCalls[1].prompt);
  assert.match(prompt, /"toolName":"tickets_list"/);
  assert.match(prompt, /sourceToolCallId/);
  // Same request again returns the stored run instead of running twice.
  const again = await advanceRun(input, ports);
  assert.equal(again.revision, run.revision);
  assert.equal(calls.length, 1);
});

test("the memory store refuses a stale revision and keeps owners apart", async () => {
  const store = new MemoryTaskStore();
  const run = { version: "forge.harness/v1", id: "r", ownerId: "a", applicationId: "app", buildId: "b", revision: 0, status: "running", goal: "", capabilityNames: [], messages: [], output: { text: "", data: {} }, exchanges: [], events: [], lastRequestId: "r", updatedAt: "2026-11-16T00:00:00Z" } as const;
  await store.create(structuredClone(run) as never);
  assert.equal(await store.save({ ...run, revision: 1 } as never, 0), true);
  assert.equal(await store.save({ ...run, revision: 1 } as never, 0), false, "stale revision");
  assert.equal(await store.load("r", "b", "app"), null, "another owner");
});
