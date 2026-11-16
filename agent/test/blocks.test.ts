import assert from "node:assert/strict";
import { test } from "node:test";
import { proseOf, splitBlocks } from "../src/catalog/blocks";

const answer = [
  "直接用订单列表页面组件。",
  "```forge:cards",
  '{"items": [{"title": "订单列表", "preview": "/blocks/orders-table-section/preview"}]}',
  "```",
  "安装：",
  "```bash",
  "npx shadcn@latest add https://www.forgeui.org/r/orders-table-section.json",
  "```",
  "```tsx",
  'import { DataTable } from "@forge-ui-official/core";',
  "export default function Page() {}",
  "```",
  "```forge:followups",
  '["怎么加批量操作？"]',
  "```",
].join("\n");

test("components, commands and code come out of the answer in order", () => {
  const kinds = splitBlocks(answer).map(segment => (segment.kind === "block" ? segment.name : segment.kind));
  assert.deepEqual(kinds, ["text", "show_cards", "text", "command", "code", "suggest_followups"]);
  assert.deepEqual(splitBlocks(answer).at(-1), { kind: "block", name: "suggest_followups", input: { questions: ["怎么加批量操作？"] } });
  assert.equal(proseOf(answer), "直接用订单列表页面组件。\n\n安装：");
});

test("an unclosed block waits while streaming and stays text once the answer is done", () => {
  const partial = "先看这个：\n```forge:cards\n{\"items\": [{\"title\": \"订";
  assert.deepEqual(splitBlocks(partial, true), [{ kind: "text", text: "先看这个：" }]);
  assert.match((splitBlocks(partial)[0] as { text: string }).text, /forge:cards/);
});

test("a malformed or off-schema block renders nothing", () => {
  assert.deepEqual(splitBlocks("```forge:cards\n{oops\n```\n好"), [{ kind: "text", text: "好" }]);
  assert.deepEqual(splitBlocks("```forge:metrics\n{\"items\": []}\n```"), []);
});

test("choices need at least two options", () => {
  assert.equal((splitBlocks('```forge:choices\n{"title": "选一个", "options": [{"label": "A"}, {"label": "B"}]}\n```')[0] as { name: string }).name, "show_choices");
  assert.deepEqual(splitBlocks('```forge:choices\n{"title": "选一个", "options": [{"label": "A"}]}\n```'), []);
});
