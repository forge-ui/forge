import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { scoreTask } from "../evals/score.mjs";

const tasks = JSON.parse(fs.readFileSync("evals/tasks.json", "utf8"));
const values = new Set(JSON.parse(fs.readFileSync("docs/for-agents/inventory.json", "utf8")).components.filter(item => item.kind === "value").map(item => item.name));

test("twenty tasks with unique ids and expected components that core exports", () => {
  assert.equal(tasks.length, 20);
  assert.equal(new Set(tasks.map(task => task.id)).size, 20);
  for (const task of tasks) for (const group of task.expect) for (const name of group) assert.ok(values.has(name), `${task.id}: ${name}`);
});

test("scorer separates a Forge page from a hand-built one", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "forge-eval-"));
  try {
    const write = (id, code) => { fs.mkdirSync(path.join(workspace, "app", id), { recursive: true }); fs.writeFileSync(path.join(workspace, "app", id, "page.tsx"), code); };
    write("orders-list", 'import { DataTable, StatusBadge } from "@forge-ui-official/core";\nexport default function Page() { return <DataTable columns={[]} rows={[]} />; }\n');
    write("login", 'import { Mail } from "lucide-react";\nexport default function Page() { return <form><input /><button style={{ color: "#7c3aed" }} onClick={() => {}}>登录</button></form>; }\n');
    const good = scoreTask(workspace, "orders-list", { ok: true, errors: [] });
    assert.equal(good.pass, true);
    assert.equal(good.score, 100);
    const bad = scoreTask(workspace, "login", { ok: false, errors: ["app/login/page.tsx(1,1): error TS2307: Cannot find module"] });
    assert.equal(bad.pass, false);
    assert.deepEqual(Object.entries(bad.criteria).filter(([, ok]) => !ok).map(([key]) => key).sort(), ["checkClean", "compiles", "expectedComponents", "noForeignUi", "usesCore"]);
    const missing = scoreTask(workspace, "calendar", { ok: true, errors: [] });
    assert.equal(missing.criteria.page, false);
  } finally { fs.rmSync(workspace, { recursive: true, force: true }); }
});
