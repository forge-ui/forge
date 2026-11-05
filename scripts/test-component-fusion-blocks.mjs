import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { test, after } from "node:test";
import React from "react";
import { renderToString } from "react-dom/server";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(new URL("../package.json", import.meta.url));
const { build } = require("./node_modules/.pnpm/node_modules/esbuild/lib/main.js");
const temporary = resolve(root, "core/tmp/block-behavior-tests");
mkdirSync(temporary, { recursive: true });
await build({
  absWorkingDir: root,
  stdin: { contents: `export { KpiMetrics } from './blocks/kpi-metrics/kpi-metrics';
    export { TrendChart } from './blocks/trend-chart/trend-chart';
    export { CompositionCard } from './blocks/composition-card/composition-card';
    export { DashboardHeader } from './blocks/dashboard-header/dashboard-header';`, resolveDir: root, loader: "tsx" },
  outfile: resolve(temporary, "blocks.mjs"), bundle: true, packages: "external", platform: "node", format: "esm", jsx: "automatic", logLevel: "silent",
  alias: { "@forge-ui-official/core": resolve(root, "core/src/index.ts"), "@forge-ui-official/core/icons": resolve(root, "core/src/icons.tsx") },
});
const blocks = await import(pathToFileURL(resolve(temporary, "blocks.mjs")));
after(() => rmSync(temporary, { recursive: true, force: true }));

test("Blocks render themed metric mini charts, plain variants, header slots and an empty composition track", () => {
  const metrics = [{ id: "orders", title: "订单", value: "1020" }];
  const themed = renderToString(React.createElement(blocks.KpiMetrics, { metrics }));
  const plain = renderToString(React.createElement(blocks.KpiMetrics, { metrics, variant: "plain" }));
  assert.notEqual(themed, plain);
  assert.match(themed, /1020/);
  assert.match(themed, /bg-fg-violet/);
  assert.match(renderToString(React.createElement(blocks.CompositionCard)), /var\(--fg-grey-200\)/);
  const header = renderToString(React.createElement(blocks.DashboardHeader, { title: "订单", dateSelection: React.createElement("input", { type: "date" }), primaryAction: React.createElement("button", null, "导出") }));
  assert.match(header, /type="date"/);
  assert.match(header, /导出/);
});

test("trend period controls switch the real data and respect controlled selection", async () => {
  const { JSDOM } = require("./core/node_modules/jsdom");
  const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true });
  const saved = new Map();
  for (const [name, value] of Object.entries({ window: dom.window, document: dom.window.document, navigator: dom.window.navigator, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true })) {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
  }
  const { createRoot } = await import("react-dom/client");
  const app = createRoot(document.getElementById("root"));
  const periods = ["日", "周", "月"].map((label, index) => ({ label, chart: { data: [{ label: `${label}数据`, values: [index + 1] }], series: [{ label: "订单", colorClass: "bg-fg-blue" }], yAxisLabels: ["3", "0"] } }));
  const changes = [];
  try {
    await React.act(async () => app.render(React.createElement(blocks.TrendChart, { periods, onPeriodChange: period => changes.push(period) })));
    assert.match(document.body.textContent, /日数据/);
    await React.act(async () => [...document.querySelectorAll("button")].find(button => button.textContent === "周").click());
    assert.match(document.body.textContent, /周数据/);
    assert.doesNotMatch(document.body.textContent, /日数据/);
    assert.deepEqual(changes, ["周"]);
    await React.act(async () => app.render(React.createElement(blocks.TrendChart, { periods, activePeriod: "月" })));
    await React.act(async () => [...document.querySelectorAll("button")].find(button => button.textContent === "日").click());
    assert.match(document.body.textContent, /月数据/);
  } finally {
    await React.act(async () => app.unmount());
    dom.window.close();
    for (const [name, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; }
  }
});
