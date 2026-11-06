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
