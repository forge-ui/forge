import assert from "node:assert/strict";
import { test } from "node:test";
import { BLOCK_NAMES, proseOf, repairQuotes, splitBlocks } from "../src/catalog/blocks";
import { BLOCK_OF, catalogGuide, uiToolNames } from "../src/catalog/schema";

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
  assert.deepEqual(splitBlocks(partial, true), [{ kind: "text", text: "先看这个：" }, { kind: "pending", name: "show_cards" }]);
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

test("every catalog component has a block name and a prompt line", () => {
  for (const name of uiToolNames) {
    assert.ok(BLOCK_OF[name].startsWith("forge:"), name);
    assert.equal(BLOCK_NAMES[BLOCK_OF[name]], name);
  }
  const guide = catalogGuide(["show_table", "show_form"]);
  assert.match(guide, /forge:table/);
  assert.match(guide, /forge:form/);
  assert.doesNotMatch(guide, /forge:cards/);
});

test("asking blocks parse: form, confirm, plan, questions, actions", () => {
  const block = (name: string, json: unknown) => splitBlocks("```forge:" + name + "\n" + JSON.stringify(json) + "\n```")[0] as { name: string } | undefined;
  assert.equal(block("form", { title: "新建客户", fields: [{ name: "name", label: "名称", type: "text", required: true }] })?.name, "show_form");
  assert.equal(block("form", { title: "新建客户", fields: [{ name: "name", label: "名称", type: "color" }] }), undefined, "unknown field types are rejected");
  assert.equal(block("confirm", { title: "删除 3 条草稿", risk: "high" })?.name, "show_confirm");
  assert.equal(block("plan", { steps: [{ title: "拉数据" }, { title: "出报表" }] })?.name, "show_plan");
  assert.equal(block("plan", { steps: [{ title: "只有一步" }] }), undefined);
  assert.equal(block("questions", { questions: [{ title: "范围", options: [{ label: "本周" }] }] })?.name, "show_questions");
  assert.equal(block("actions", { items: [{ label: "去看看", href: "/orders" }] })?.name, "show_actions");
  assert.equal(block("chart", { type: "donut", labels: ["A", "B"], series: [{ label: "占比", data: [1, 2] }] })?.name, "show_chart");
  assert.equal(block("callout", { tone: "loud", text: "x" }), undefined);
});

test("blocks survive the usual model slips: inner quotes and limits overshot", () => {
  const quoted = '{"title": "对比", "items": [{"title": "A", "points": ["不是"接上就好"", "快"]}, {"title": "B", "points": ["慢"]}]}';
  assert.equal(JSON.parse(repairQuotes(quoted)).items[0].points[0], '不是"接上就好"');
  const block = splitBlocks("```forge:compare\n" + quoted + "\n```")[0] as { name: string };
  assert.equal(block.name, "show_compare");
  const long = { title: "选一个", options: Array.from({ length: 12 }, (_, index) => ({ label: `选项 ${index + 1}` })) };
  const parsed = splitBlocks("```forge:choices\n" + JSON.stringify(long) + "\n```")[0] as { input: { options: unknown[] } };
  assert.equal(parsed.input.options.length, 8, "an overlong list is cut to its limit");
  const label = splitBlocks('```forge:tags\n{"tags": ["' + "很".repeat(40) + '"]}\n```')[0] as { input: { tags: string[] } };
  assert.ok(label.input.tags[0].length <= 24 && label.input.tags[0].endsWith("…"));
});

test("blocks written slightly off the fence format still render", () => {
  const glued = splitBlocks('看这里：\n```forge:tags\n{"tags": ["大客户", "年框"]}```\n好的');
  assert.equal((glued[1] as { name: string }).name, "show_tags", "closing fence glued to the JSON");
  const labelled = splitBlocks('```json\nforge:tags\n{"tags": ["大客户"]}\n```');
  assert.equal((labelled[0] as { name: string }).name, "show_tags", "block name on the first line");
  const inline = splitBlocks('```forge:tags {"tags": ["大客户"]}```');
  assert.equal((inline[0] as { name: string }).name, "show_tags", "the whole block on one line");
});
