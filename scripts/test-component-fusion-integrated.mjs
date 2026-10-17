import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { test, after } from "node:test";
import React from "react";
import { renderToString } from "react-dom/server";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(new URL("../package.json", import.meta.url));
const { build } = require("./node_modules/.pnpm/node_modules/esbuild/lib/main.js");
const temp = resolve(root, "core/tmp/fusion-integrated-tests");
mkdirSync(temp, { recursive: true });
await build({
  absWorkingDir: root,
  stdin: { contents: `export * from './src/app/components/_fusion/registry';
    export { ActionsExamples } from './src/app/components/_fusion/actions';
    export { FormsNavigationExamples } from './src/app/components/_fusion/forms-navigation';
    export { AgentChartExamples } from './src/app/components/_fusion/agent-charts';
    export { CompositionExamples } from './src/app/components/_fusion/compositions';
    export { MigrationPreview } from './src/app/components/_migration-previews';
    export { SidebarFusionPreview } from './src/app/prototype/component-fusion/_sidebar-preview';`, resolveDir: root, loader: "tsx" },
  outfile: resolve(temp, "examples.mjs"), bundle: true, packages: "external", platform: "node", format: "esm", jsx: "automatic", logLevel: "silent",
  plugins: [{ name: "node-next-entry", setup(plugin) {
    plugin.onResolve({ filter: /^next\/image$/ }, () => ({ path: "next-image", namespace: "next-default" }));
    plugin.onLoad({ filter: /.*/, namespace: "next-default" }, () => ({ contents: 'import entry from "next/image.js"; export default entry.default ?? entry;', loader: "js", resolveDir: root }));
    plugin.onResolve({ filter: /^next\// }, ({ path }) => ({ path: require.resolve(path), external: true })); } }],
  alias: { "@forge-ui-official/core": resolve(root, "core/src/index.ts"), "@forge-ui-official/core/icons": resolve(root, "core/src/icons.tsx") },
});
const examples = await import(pathToFileURL(resolve(temp, "examples.mjs")));
after(() => rmSync(temp, { recursive: true, force: true }));
const catalog = JSON.parse(readFileSync(resolve(root, "src/app/prototype/component-fusion/_catalog-data.json"), "utf8"));

test("99 planned interactions have one implementation, valid family routes, and no deferred items", () => {
  const ids = [...examples.actionIds, ...examples.formNavigationIds, ...examples.agentChartIds, ...examples.compositionIds, ...examples.existingIds];
  assert.equal(ids.length, 99);
  assert.equal(new Set(ids).size, 99);
  assert.deepEqual([...ids].sort(), examples.fusionItems.map(item => item.id).sort());
  assert.equal(catalog.items.filter(item => item.mode === "defer").length, 23);
  assert.equal(ids.includes("186"), false);
  for (const item of examples.fusionItems) {
    const route = examples.officialHref(item).split("#")[0];
    assert.equal(route, `/cases/${examples.officialCategory(item)}`, `${item.id}: example uses its family case page`);
    assert.equal(examples.officialHref(item).split("#")[1], `interaction-${item.id === "F03" ? "178" : item.id}`, `${item.id}: stable example anchor`);
    assert.notEqual(examples.officialCategory(item), "motion");
    assert.ok(existsSync(resolve(root, `src/app${route}/page.tsx`)), `${item.id}: ${route}`);
  }
});

for (const item of examples.fusionItems) {
  test(`${item.id} ${item.name}: Chinese/English and all three themes render actual React content`, () => {
    const Component = examples.actionIds.includes(item.id) ? examples.ActionsExamples : examples.formNavigationIds.includes(item.id) ? examples.FormsNavigationExamples : examples.agentChartIds.includes(item.id) ? examples.AgentChartExamples : examples.compositionIds.includes(item.id) ? examples.CompositionExamples : item.id === "040" ? examples.SidebarFusionPreview : examples.MigrationPreview;
    for (const locale of ["zh", "en"]) for (const color of ["blue", "purple", "black"]) {
      const html = renderToString(React.createElement(Component, { id: item.id, kind: item.kind, locale, color, motion: "none", hideControls: true }));
      assert.ok(html.length > 100, `${item.id}: empty content`);
      assert.doesNotMatch(html, /\/prototype\/component-fusion\/components\//, `${item.id}: prototype iframe`);
      assert.doesNotMatch(html, /NaN|undefined%/, `${item.id}: invalid layout/data`);
      if (item.id !== "040") assert.doesNotMatch(html, /<iframe/, `${item.id}: not a React case`);
    }
  });
}

test("formal compositions change their data and recover it through undo, reset, or filter relaxation", async () => {
  const { JSDOM } = require("./core/node_modules/jsdom");
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  const saved = new Map();
  function provide(name, value) { saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name)); Object.defineProperty(globalThis, name, { configurable: true, writable: true, value }); }
  dom.window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
  for (const name of ["window", "document", "navigator", "HTMLElement", "Element", "SVGElement", "HTMLInputElement"]) provide(name, dom.window[name]);
  provide("IS_REACT_ACT_ENVIRONMENT", true);
  provide("requestAnimationFrame", callback => setTimeout(() => callback(performance.now()), 0));
  provide("cancelAnimationFrame", clearTimeout);
  provide("ResizeObserver", class { observe() {} disconnect() {} unobserve() {} });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root"));
  const render = async id => React.act(async () => root.render(React.createElement(examples.CompositionExamples, { key: id, id, locale: "zh", color: "blue", motion: "none" })));
  const button = label => [...document.querySelectorAll("button")].find(node => node.getAttribute("aria-label") === label || node.textContent.trim() === label);
  const click = async label => { const node = button(label); assert.ok(node, label); assert.equal(node.disabled, false, label); await React.act(async () => node.click()); };
  try {
    await render("128");
    assert.equal(document.querySelectorAll("mark").length, 3);
    await click("全部替换");
    assert.equal(document.querySelectorAll("mark").length, 0);
    assert.ok(button("全部替换").disabled);
    await click("撤销");
    assert.equal(document.querySelectorAll("mark").length, 3);
    await render("127"); await click("接受变更");
    assert.match(document.querySelector("[role=status]").textContent, /已接受/);
    await click("撤销决定"); await click("保留原文");
    assert.match(document.querySelector("[role=status]").textContent, /已保留/);
    await render("179"); await click("相互连接"); await click("微小的想法");
    assert.equal(document.querySelector("[role=status]").textContent, "相互连接微小的想法");
    await click("相互连接"); assert.equal(document.querySelector("[role=status]").textContent, "微小的想法");
    await render("177");
    for (let index = 0; index < 15; index++) await click("变换形状");
    assert.match(document.querySelector("[role=status]").textContent, /12 \/ 12/);
    await click("撤销"); assert.equal(button("重做").disabled, false);
    await click("变换形状"); assert.equal(button("重做").disabled, true);
    await render("176"); await click("v1"); await click("恢复此版本");
    assert.ok(button("当前版本").disabled); assert.ok(button("v1 · 当前"));
    await render("110"); await click("移至 15:00");
    assert.match(document.querySelector("[role=status]").textContent, /冲突已解决/);
    await click("撤销调整"); assert.match(document.querySelector("[role=status]").textContent, /重叠 30/);
    await render("180"); await click("通过复核"); await click("最终批准");
    assert.match(document.querySelector("[role=status]").textContent, /审批完成/);
    await render("F06"); await click("改为搜索“设计”");
    assert.ok(button("移除“工程团队”，恢复 1 条"));
    await click("移除“工程团队”，恢复 1 条");
    assert.match(document.querySelector("[role=status]").textContent, /1 条结果/);
    await render("184");
    const permission = document.querySelector('[aria-label="编辑者 · 分享"]');
    assert.equal(permission.getAttribute("aria-checked"), "false");
    await React.act(async () => permission.click());
    assert.equal(permission.getAttribute("aria-checked"), "true");
    assert.equal(document.querySelector('[aria-label="所有者 · 分享"]').disabled, true);
  } finally {
    await React.act(async () => root.unmount()); dom.window.close();
    for (const [name, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; }
  }
});

// Exercise consumer wiring as well as rendering: a controlled demo can look
// correct in SSR while its controls never update, or lose focus on deletion.
test("audit regressions: code view switches and deletion/undo retain list focus", async () => {
  const { JSDOM } = require("./core/node_modules/jsdom");
  const dom = new JSDOM('<div id="audit-root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  dom.window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
  const saved = new Map();
  const globals = { window: dom.window, self: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, SVGElement: dom.window.SVGElement, getComputedStyle: dom.window.getComputedStyle.bind(dom.window), requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window), cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window), IS_REACT_ACT_ENVIRONMENT: true };
  for (const [key,value] of Object.entries(globals)) { saved.set(key,Object.getOwnPropertyDescriptor(globalThis,key)); Object.defineProperty(globalThis,key,{value,configurable:true,writable:true}); }
  const { createRoot } = await import("react-dom/client");
  const app = createRoot(document.getElementById("audit-root"));
  const render = (Component,id) => React.act(async () => app.render(React.createElement(Component,{key:id,id,locale:"en",color:"blue",motion:"none"})));
  const findButton = text => [...document.querySelectorAll("button")].find(node => node.textContent.trim() === text || node.getAttribute("aria-label") === text);
  try {
    await render(examples.CompositionExamples,"127");
    assert.match(document.querySelector("pre").textContent,/return 3/);
    await React.act(async()=>findButton("Code").click());
    assert.doesNotMatch(document.querySelector("pre").textContent,/return 3/);
    await React.act(async()=>findButton("Diff").click());
    assert.match(document.querySelector("pre").textContent,/return 3/);
    await render(examples.ActionsExamples,"071");
    await React.act(async()=>{ findButton("Delete message").focus(); findButton("Delete message").click(); });
    assert.equal(document.activeElement.closest("[data-mail-id]")?.getAttribute("data-mail-id"),"1");
    await React.act(async()=>findButton("Undo").click());
    assert.equal(document.activeElement.closest("[data-mail-id]")?.getAttribute("data-mail-id"),"0");
  } finally {
    await React.act(async()=>app.unmount()); dom.window.close();
    for (const [key,descriptor] of saved) { if(descriptor) Object.defineProperty(globalThis,key,descriptor); else delete globalThis[key]; }
  }
});


test("published example code matches the running source files", () => {
  const sources = JSON.parse(readFileSync(resolve(root, "src/app/components/_example-sources.json"), "utf8"));
  for (const [file, content] of Object.entries(sources)) {
    assert.equal(content, readFileSync(resolve(root, file), "utf8"), `${file}: regenerate pnpm docs:examples after changing an example`);
  }
});
