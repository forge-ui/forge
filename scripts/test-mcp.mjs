import test from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { executeTool, handleRequest, toolNames } from "../src/lib/mcp/server.mjs";
const url = new URL(process.env.MCP_TEST_URL ?? "http://localhost/api/mcp");
const inputs = { search: { query: "状态", type: "all", page: 1, pageSize: 5 }, list_components: { page: 1, pageSize: 5 }, get_component: { slug: "StatusBadge" }, list_blocks: { page: 1, pageSize: 5 }, get_block: { slug: "kpi-metrics" }, list_screens: { page: 1, pageSize: 5 }, get_screen: { slug: "dashboards/analytics" }, get_rules: { topic: "status" }, list_guides: { page: 1, pageSize: 5 }, get_guide: { slug: "dashboard" } };
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
    assert.equal((await client.listPrompts()).prompts.length, 1);
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
