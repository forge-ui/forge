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
    export { RankingList } from './blocks/ranking-list/ranking-list';
    export { RegionDistribution } from './blocks/region-distribution/region-distribution';
    export { DashboardHeader } from './src/app/templates/_shared/dashboard-header';`, resolveDir: root, loader: "tsx" },
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
    const linePeriods = [{ label: "日", countChart: { series: [{ label: "日订单", data: [11, 22] }], motion: "none", xAxisLabels: ["上午", "下午"] } }, { label: "周", countChart: { series: [{ label: "周订单", data: [30, 40] }], motion: "none", xAxisLabels: ["周一", "周二"] } }];
    await React.act(async () => app.render(React.createElement(blocks.TrendChart, { periods: linePeriods })));
    assert.match(document.body.textContent, /日订单/);
    assert.match(document.body.textContent, /33/);
    assert.equal(document.querySelector('[data-chart-tooltip="true"]').style.left, "0px");
    await React.act(async () => [...document.querySelectorAll("button")].find(button => button.textContent === "周").click());
    assert.match(document.body.textContent, /周订单/);
    assert.match(document.body.textContent, /70/);
    assert.doesNotMatch(document.body.textContent, /日订单/);
    const line = document.querySelector('[tabindex="0"]');
    await React.act(async () => line.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "End", bubbles: true })));
    assert.match(document.body.textContent, /40/);
    assert.equal(document.querySelector('[data-chart-tooltip="true"]').style.left, "0px");
    await React.act(async () => line.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Home", bubbles: true })));
    assert.equal(document.querySelector('[data-chart-tooltip="true"]').style.left, "0px");
    assert.match(document.body.textContent, /30/);
    let exports = 0;
    await React.act(async () => app.render(React.createElement(blocks.DashboardHeader, { title: "订单运营", onExport: () => exports++ })));
    await React.act(async () => [...document.querySelectorAll("button")].find(button => button.textContent === "导出").click());
    assert.equal(exports, 1);
  } finally {
    await React.act(async () => app.unmount());
    dom.window.close();
    for (const [name, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; }
  }
});

test("structured ranking and region data retain Screen identity elements without private assets", () => {
  const ranking = renderToString(React.createElement(blocks.RankingList, { title: "商品", entries: [{ id: "a", title: "键盘", value: "192" }, { id: "b", title: "鼠标", value: "80", avatar: "MS" }] }));
  assert.match(ranking, /w-full/);
  assert.match(ranking, /<svg/);
  assert.match(ranking, /MS/);
  const plain = renderToString(React.createElement(blocks.RankingList, { title: "商品", variant: "plain", entries: [{ id: "a", title: "键盘", value: "192" }] }));
  assert.doesNotMatch(plain, /<svg/);
  const region = renderToString(React.createElement(blocks.RegionDistribution, { regions: [{ name: "中国", countryCode: "CN", salesLabel: "340 笔", value: "17000" }, { name: "华北", salesLabel: "20 笔", value: "1000" }] }));
  assert.match(region, /<svg/);
  assert.match(region, /data:image\/svg\+xml/);
  assert.match(region, new RegExp(encodeURIComponent("🇨🇳")));
  assert.match(region, new RegExp(encodeURIComponent("华北")));
});

test("default trend and composition retain metric icons, tooltip and legend; plain is explicit", () => {
  const props = { chart: { data: [{ label: "今日", values: [26] }], series: [{ label: "订单", colorClass: "bg-fg-violet" }] } };
  const trend = renderToString(React.createElement(blocks.TrendChart, props));
  assert.match(trend, /本期/);
  assert.match(trend, /<svg/);
  assert.match(trend, /26/);
  assert.match(trend, /shadow-elevated/);
  const plain = renderToString(React.createElement(blocks.TrendChart, { ...props, variant: "plain" }));
  assert.doesNotMatch(plain, /本期|shadow-elevated/);
  const composition = renderToString(React.createElement(blocks.CompositionCard, { chart: { segments: [{ label: "商城", value: 40 }] } }));
  assert.match(composition, /商城/);
  assert.match(composition, /bg-fg-violet/);
  for (const Component of [blocks.KpiMetrics, blocks.TrendChart, blocks.CompositionCard, blocks.DashboardHeader]) {
    const html = renderToString(React.createElement(Component, null, React.createElement("span", null, "原模板插槽")));
    assert.match(html, /原模板插槽/);
    assert.doesNotMatch(html, /本期|分类 1/);
  }
});
