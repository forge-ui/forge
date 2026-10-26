import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../src/app/templates/agent/_data.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { parseSessions, EXAMPLES, parseWorkspaces, workspaceSessionKey, initialWorkspaceSessions } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
assert.equal(parseSessions(null), null);
assert.equal(parseSessions({ sessions: EXAMPLES, active: "missing" }), null);
assert.equal(parseSessions({ sessions: [], active: "plan" }), null);
const saved = { sessions: [{ id: "custom", title: "已保存对话", turns: [{ id: "turn", text: "计划", kind: "plan", live: true, snapshot: { text: "已生成片段", phase: "stopped" }, request: { mode: "深度思考", permission: "readonly", sources: [{ id: "brief", label: "简报" }] } }] }], active: "custom" };
const restored = parseSessions(JSON.parse(JSON.stringify(saved)));
assert.equal(restored.active, "custom");
assert.equal(restored.sessions[0].turns[0].live, false);
assert.deepEqual(restored.sessions[0].turns[0].snapshot, saved.sessions[0].turns[0].snapshot);
assert.equal(restored.sessions[0].turns[0].request.permission, "readonly");
const interrupted = structuredClone(saved);
delete interrupted.sessions[0].turns[0].snapshot;
assert.deepEqual(parseSessions(interrupted).sessions[0].turns[0].snapshot, { text: "", phase: "stopped" });
for (const patch of [{ kind: "invalid" }, { snapshot: { text: "x", phase: "streaming" } }, { request: { mode: "x", permission: "x", sources: [null] } }]) {
  const malformed = structuredClone(saved);
  Object.assign(malformed.sessions[0].turns[0], patch);
  assert.equal(parseSessions(malformed), null);
}
assert.equal(saved.sessions[0].turns[0].live, true);
const workflowSaved = structuredClone(saved);
workflowSaved.sessions[0].turns[0].workflow = { accepted: true, alternative: true, applied: ["rush", "direction"], approval: { schedule: ["draft"], focus: ["direction"] }, node: "design" };
assert.deepEqual(parseSessions(JSON.parse(JSON.stringify(workflowSaved))).sessions[0].turns[0].workflow, workflowSaved.sessions[0].turns[0].workflow);
workflowSaved.sessions[0].turns[0].workflow.applied = ["unknown"];
assert.equal(parseSessions(workflowSaved), null);
console.log("PASS: session round-trip, active selection, partial answer and permission preservation, interrupted run recovery, malformed input rejection and immutable source");

const catalog = { items: [{ id: "design", name: "设计工作室" }, { id: "product", name: "产品工作室" }], active: "product" };
assert.deepEqual(parseWorkspaces(JSON.parse(JSON.stringify(catalog))), catalog);
assert.equal(parseWorkspaces({ ...catalog, active: "missing" }), null);
assert.equal(parseWorkspaces({ items: [catalog.items[0], catalog.items[0]], active: "design" }), null);
assert.equal(parseWorkspaces({ items: [{ id: "__new__", name: "x" }], active: "__new__" }), null);
assert.notEqual(workspaceSessionKey("design"), workspaceSessionKey("product"));
const emptyWorkspace = initialWorkspaceSessions("product");
assert.equal(emptyWorkspace.sessions.length, 1);
assert.equal(emptyWorkspace.sessions[0].turns.length, 0);
assert.ok(parseSessions(emptyWorkspace));
const designWorkspace = initialWorkspaceSessions("design");
designWorkspace.sessions[0].title = "changed";
assert.notEqual(EXAMPLES[0].title, "changed");
console.log("PASS: workspace catalog validation, session key isolation and immutable workspace initialization");
