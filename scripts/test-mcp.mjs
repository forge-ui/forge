import test from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { executeTool, handleRequest, toolNames } from "../src/lib/mcp/server.mjs";
const url = new URL(process.env.MCP_TEST_URL ?? "http://localhost/api/mcp");
const inputs = { search: { query: "状态", type: "all", page: 1, pageSize: 5 }, recommend: { need: "订单列表，带筛选和批量导出" }, get_tokens: { query: "主色" }, list_components: { page: 1, pageSize: 5 }, get_component: { slug: "StatusBadge", detail: "summary" }, list_blocks: { page: 1, pageSize: 5 }, get_block: { slug: "kpi-metrics", detail: "summary" }, list_screens: { page: 1, pageSize: 5 }, get_screen: { slug: "dashboards/analytics", detail: "summary" }, get_rules: { topic: "status" }, list_guides: { page: 1, pageSize: 5 }, get_guide: { slug: "dashboard" } };
test("all tool handlers, pagination, lookup failures", () => {
  for (const name of toolNames) assert.ok(executeTool(name, inputs[name]));
  assert.equal(executeTool("list_guides", { page: 2, pageSize: 5 }).items.length, 3);
  assert.equal(executeTool("search", { query: "运营", type: "guides", page: 1, pageSize: 1 }).items[0].type, "guides");
  assert.throws(() => executeTool("get_guide", { slug: "../missing" }), /未找到/);
  const component = executeTool("get_component", { slug: "StatusBadge" });
  assert.equal(component.defaults.variant, '"soft"');
  assert.equal(component.defaults.color, '"grey"');
  assert.ok(component.props.some(prop => prop.name === "label"));
  assert.ok(component.import.includes("@forge-ui-official/core"));
  const screen = executeTool("get_screen", { slug: "dashboards/analytics" });
  assert.equal(screen.previewUrl, "https://forgeui.org/templates/dashboards/analytics");
});
test("search ranks by relevance across languages and keywords", () => {
  const top = (query, type = "all") => executeTool("search", { query, type, page: 1, pageSize: 5 }).items.map(item => item.slug);
  assert.equal(top("DataTable")[0], "DataTable");
  assert.equal(top("data-table")[0], "DataTable");
  assert.equal(top("表格", "components")[0], "DataTable");
  assert.equal(top("按钮")[0], "Button");
  assert.equal(top("登录页")[0], "login-form");
  assert.equal(top("分步表单")[0], "order-form");
  assert.ok(top("订单列表 筛选 批量操作").includes("orders-table-section"));
  assert.ok(!executeTool("search", { query: "状态", type: "components", page: 1, pageSize: 50 }).items.some(item => item.kind === "type"));
  assert.deepEqual(executeTool("search", { query: "DataTabel", type: "components", page: 1, pageSize: 5 }).suggestions, ["DataTable"]);
});
test("summaries stay small and lookups tolerate naming differences", () => {
  const summary = executeTool("get_component", { slug: "data-table", detail: "summary" });
  assert.equal(summary.name, "DataTable");
  assert.ok(JSON.stringify(summary).length < 8000);
  assert.ok(executeTool("get_component", { slug: "DataTable", detail: "full" }).sourceCode.length > 10000);
  assert.ok(JSON.stringify(executeTool("get_block", { slug: "kanban-board", detail: "summary" })).length < 2000);
  assert.throws(() => executeTool("get_component", { slug: "DataTabel", detail: "summary" }), /可能是：DataTable/);
});
test("recommend and tokens", () => {
  const plan = executeTool("recommend", { need: "订单列表，带筛选和批量导出" });
  assert.equal(plan.role, "collection");
  assert.equal(plan.blocks[0].slug, "orders-table-section");
  assert.ok(plan.components.some(item => item.slug === "DataTable"));
  assert.equal(executeTool("recommend", { need: "运营看板" }).role, "dashboard");
  const accent = executeTool("get_tokens", { query: "主色" }).tokens.find(token => token.name === "--accent");
  assert.equal(accent.value, "var(--fg-blue)");
  assert.ok(executeTool("get_tokens", { layer: "primitive" }).tokens.some(token => token.name === "--fg-blue-500"));
});
test("SDK initialize, every tool, resource, prompt and errors", async () => {
  const client = new Client({ name: "forge-test", version: "1.0.0" });
  const transport = new StreamableHTTPClientTransport(url, process.env.MCP_TEST_URL ? {} : { fetch: async (input, init) => handleRequest(new Request(input, init)) });
  try {
    await client.connect(transport);
    assert.equal((await client.listTools()).tools.length, toolNames.length);
    for (const name of toolNames) {
      const result = await client.callTool({ name, arguments: inputs[name] });
      assert.ok(!result.isError, name + JSON.stringify(result));
      assert.ok(result.structuredContent, name);
      if (process.env.MCP_TEST_URL) console.log(name + ": " + JSON.stringify(result.structuredContent).slice(0, 240));
    }
    assert.equal((await client.callTool({ name: "search", arguments: { query: "x", page: 0 } })).isError, true);
    assert.equal((await client.callTool({ name: "search", arguments: { query: "x", type: "invalid" } })).isError, true);
    assert.equal((await client.callTool({ name: "list_guides", arguments: {} })).structuredContent.result.pageSize, 20);
    assert.equal((await client.callTool({ name: "get_guide", arguments: { slug: "missing" } })).isError, true);
    assert.equal((await client.listResources()).resources.length, 1);
    assert.ok((await client.readResource({ uri: "forge://rules" })).contents.length);
    assert.equal((await client.listPrompts()).prompts.length, 2);
    assert.ok((await client.getPrompt({ name: "forge-dashboard", arguments: { goal: "运营看板" } })).messages.length);
    assert.equal((await client.callTool({ name: "missing", arguments: {} })).isError, true);
  } finally { await client.close(); }
});
test("HTTP methods, origin, parse error and content negotiation", async () => {
  const request = async (method, headers = {}, body) => process.env.MCP_TEST_URL ? fetch(url, { method, headers, body }) : handleRequest(new Request(url, { method, headers, body }));
  for (const method of ["GET", "DELETE"]) assert.equal((await request(method)).status, 405);
  assert.equal((await request("POST", { origin: "https://evil.example" })).status, 403);
  assert.equal((await request("POST", { "content-type": "application/json", accept: "application/json, text/event-stream" }, "{")).status, 400);
  assert.equal((await request("POST", { "content-type": "application/json", accept: "text/plain" }, "{}")).status, 406);
});
