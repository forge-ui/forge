import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { listPages, normalizeComponent, publicRoute } from "../skills/forge-skill/scripts/source-index.mjs";

test("component aliases follow actual documentation routes", () => {
  assert.equal(normalizeComponent("Button"), "button-link");
  assert.equal(normalizeComponent("button"), "button-link");
  assert.equal(normalizeComponent("DataTable"), "table");
});

test("nested route groups do not enter URLs; dynamic segments survive", () => {
  assert.equal(publicRoute("src/app/templates/(one)/(two)/orders/[id]/page.tsx", "templates"), "orders/[id]");
  assert.equal(publicRoute("src/app/templates/_shared/page.tsx", "templates"), null);
});

test("all ten dashboard screens are discoverable", async () => {
  const pages = await listPages("templates");
  assert.equal(pages.filter(page => page.route.startsWith("dashboards/")).length, 10);
  assert(pages.some(page => page.route === "ecommerce/orders/[id]"));
});

test("template retrieval includes wrapper and content", () => {
  const output = execFileSync(process.execPath, ["skills/forge-skill/scripts/get-template.mjs", "ecommerce/orders/[id]"], { encoding: "utf8" });
  assert.match(output, /# Source:.*page\.tsx/);
  assert.match(output, /# Wrapper content:.*_content\.tsx/);
  assert.match(output, /orders\/\[id\]/);
});

test("missing sources fail closed", () => {
  assert.throws(() => execFileSync(process.execPath, ["skills/forge-skill/scripts/get-template.mjs", "does-not-exist"], { stdio: "pipe" }));
});

test("page briefs do not require unauthorized system modules", () => {
  const output = execFileSync(process.execPath, ["skills/forge-skill/scripts/check-brief.mjs", "-", "--scope=page"], { input: "role: dashboard\ntask: inspect\nsource: analytics\nscope: one page\nverification: pending", encoding: "utf8" });
  assert.match(output, /look complete/);
});

test("project-info reports version drift, starter layout and copied blocks", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "forge-project-"));
  try {
    fs.mkdirSync(path.join(dir, "node_modules/@forge-ui-official/core"), { recursive: true });
    fs.writeFileSync(path.join(dir, "node_modules/@forge-ui-official/core/package.json"), JSON.stringify({ version: "0.1.0" }));
    fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ dependencies: { "@forge-ui-official/core": "0.1.0", react: "^18.2.0", next: "16.0.0" } }));
    fs.mkdirSync(path.join(dir, "src/app"), { recursive: true });
    fs.writeFileSync(path.join(dir, "src/app/page.tsx"), 'import { KanbanBoard } from "@/components/blocks/kanban-board";\n');
    fs.writeFileSync(path.join(dir, "components.json"), JSON.stringify({ registries: { "@acme": "https://acme.dev/r/{name}.json" } }));
    const report = JSON.parse(execFileSync(process.execPath, ["skills/forge-skill/scripts/project-info.mjs", dir, "--json"], { encoding: "utf8" }));
    assert.equal(report.forge.installed, "0.1.0");
    assert.match(report.forge.documentedBySkill, /^\d+\.\d+\.\d+$/);
    assert.deepEqual(report.copiedBlocks, ["kanban-board"]);
    for (const pattern of [/API 可能不同/, /React 19/, /kanban-board/, /DESIGN\.md/, /@forge/]) assert.ok(report.notes.some(note => pattern.test(note)), String(pattern));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
