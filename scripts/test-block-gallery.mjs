import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { after, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = resolve(import.meta.dirname, "..");
const require = createRequire(new URL("../package.json", import.meta.url));
const { build } = require("./node_modules/.pnpm/node_modules/esbuild/lib/main.js");
const { JSDOM } = require("./core/node_modules/jsdom");
const temporary = resolve(root, "core/tmp/block-gallery-tests");
const catalog = JSON.parse(readFileSync(resolve(root, "blocks/registry.json"), "utf8"));
mkdirSync(temporary, { recursive: true });
await build({
  absWorkingDir: root,
  stdin: { contents: `export * from './src/app/blocks/_previews';
    export * from './src/app/blocks/_shell';
    export { default as PreviewPage, generateStaticParams as previewStaticParams, metadata as previewMetadata } from './src/app/blocks/[name]/preview/page';
    export * from './src/app/blocks/_catalog';
    export * from './src/app/blocks/_copy-button';
    export * from './src/app/blocks/_gallery';
    export * from './src/app/blocks/_block-showcase';
    export * from './blocks/overview-dashboard/overview-dashboard';
    export * from './blocks/orders-table-section/orders-table-section';
    export * from './blocks/project-overview/project-overview';
    export * from './blocks/finance-overview/finance-overview';
    export * from './blocks/trend-chart/trend-chart';
    export { default as sitemap } from './src/app/sitemap';
    export { PathnameContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';
    export { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
    export { default as BlockPage, generateStaticParams, generateMetadata } from './src/app/blocks/[name]/page';`, resolveDir: root, loader: "tsx" },
  outfile: resolve(temporary, "gallery.mjs"), bundle: true, packages: "external", platform: "node", format: "esm", jsx: "automatic", logLevel: "silent",
  banner: { js: `import { createRequire as createNodeRequire } from "node:module"; const require = createNodeRequire(${JSON.stringify(require.resolve("next/package.json"))});` },
  alias: { "@forge-ui-official/core": resolve(root, "core/src/index.ts"), "@forge-ui-official/core/icons": resolve(root, "core/src/icons.tsx") },
  plugins: [{ name: "server-only-marker", setup(builder) {
    builder.onResolve({ filter: /^server-only$/ }, () => ({ path: "server-only", namespace: "marker" }));
    builder.onLoad({ filter: /.*/, namespace: "marker" }, () => ({ contents: "export {};", loader: "js" }));
    builder.onResolve({ filter: /^next\// }, args => ({ path: require.resolve(args.path) }));
  } }],
});
const gallery = await import(pathToFileURL(resolve(temporary, "gallery.mjs")));
after(() => rmSync(temporary, { recursive: true, force: true }));

async function withDom(callback, url = "https://www.forgeui.org/blocks") {
  const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true, url });
  dom.window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  dom.window.HTMLDialogElement.prototype.close = function () { this.open = false; };
  const saved = new Map();
  const observers = [];
  class ResizeObserver {
    constructor(callback) { this.callback = callback; this.elements = new Set(); observers.push(this); }
    observe(element) { this.elements.add(element); }
    unobserve(element) { this.elements.delete(element); }
    disconnect() { this.elements.clear(); }
  }
  class IntersectionObserver extends ResizeObserver {
    observe(element) { this.elements.add(element); }
  }
  const values = { IntersectionObserver, window: dom.window, self: dom.window, document: dom.window.document, navigator: dom.window.navigator, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, getComputedStyle: dom.window.getComputedStyle.bind(dom.window), ResizeObserver, IS_REACT_ACT_ENVIRONMENT: true };
  for (const [name, value] of Object.entries(values)) {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
  }
  const { createRoot } = await import("react-dom/client");
  const app = createRoot(document.getElementById("root"));
  const render = async (Component, props) => React.act(async () => app.render(React.createElement(Component, props)));
  const click = async element => {
    assert.ok(element, "click target must exist");
    await React.act(async () => element.click());
  };
  const button = text => [...document.querySelectorAll("button")].find(element => element.textContent === text);
  try {
    await callback({ dom, render, click, button, observers, resize: () => React.act(async () => { for (const observer of observers) if (observer.elements.size) observer.callback(); }) });
  } catch (error) {
    if (error instanceof AggregateError) throw new AggregateError(error.errors, error.errors.map(item => item.stack).join("\n"));
    throw error;
  } finally {
    await React.act(async () => app.unmount());
    dom.window.close();
    for (const [name, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
}

test("all shared previews render complete business content without development placeholders", () => {
  assert.ok(catalog.length > 0);
  assert.deepEqual([...gallery.previewNames].sort(), catalog.map(block => block.name).sort());
  for (const entry of catalog) {
    const html = renderToStaticMarkup(React.createElement(gallery.BlockPreview, { name: entry.name }));
    assert.ok(html.length > 300, entry.name);
    assert.doesNotMatch(html, /演示|占位|插槽|lorem/i, entry.name);
  }
  const recent = new JSDOM(renderToStaticMarkup(React.createElement(gallery.BlockPreview, { name: "recent-records" })));
  assert.equal(recent.window.document.querySelectorAll("tbody tr").length, 6);
  assert.equal(recent.window.document.querySelectorAll("thead th").length, 5);
  assert.match(recent.window.document.body.textContent, /已支付|处理中|已退款/);
  recent.window.close();
  assert.equal(gallery.defaultProjectMembers.length, 6);
  assert.equal(gallery.defaultProjectActivities.length, 4);
  assert.equal(gallery.defaultFinanceGoals.length, 3);
  assert.equal(gallery.defaultOverviewMetrics.length, 4);
  assert.equal(gallery.defaultOverviewTrend.data.length, 7);
  assert.equal(gallery.defaultOverviewTrend.series.length, 2);
  assert.equal(gallery.defaultOverviewComposition.segments.length, 4);
  assert.equal(gallery.defaultOverviewTrend.data.reduce((sum, point) => sum + point.values[0], 0), 128600);
  assert.equal(gallery.defaultOverviewTrend.data.reduce((sum, point) => sum + point.values[1], 0), 74800);
  assert.equal(gallery.defaultOverviewComposition.segments.reduce((sum, segment) => sum + segment.value, 0), 128600);
});

test("compact donut values match their content", () => {
  assert.equal(gallery.defaultOverviewComposition.centerValue, "¥12.9万");
  assert.equal(gallery.defaultOverviewComposition.size, "md");
  for (const name of ["overview-dashboard", "composition-card"]) {
    const html = renderToStaticMarkup(React.createElement(gallery.BlockPreview, { name }));
    assert.match(html, /¥12.9万/);
    assert.doesNotMatch(html, /text-3xl[^>]*>¥128,600/);
  }
});

test("thumbnail lazily mounts a 1024 by 640 iframe and retains it after leaving", async () => {
  await withDom(async ({ dom, render, observers }) => {
    Object.defineProperty(dom.window.HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 320 });
    await render(gallery.PreviewThumbnail, { name: "kanban-board" });
    assert.equal(document.querySelector("iframe"), null);
    const intersection = observers.find(observer => observer.constructor.name === "IntersectionObserver");
    await React.act(async () => intersection.callback([{ isIntersecting: true }]));
    const iframe = document.querySelector("iframe");
    assert.equal(iframe.getAttribute("src"), "/blocks/kanban-board/preview");
    assert.equal(iframe.style.width, "1024px");
    assert.equal(iframe.style.height, "640px");
    assert.equal(iframe.style.transform, "scale(0.3125)");
    assert.equal(iframe.getAttribute("loading"), "lazy");
    assert.equal(iframe.tabIndex, -1);
    assert.equal(iframe.getAttribute("aria-hidden"), "true");
    await React.act(async () => intersection.callback([{ isIntersecting: false }]));
    assert.equal(document.querySelector("iframe"), iframe);
  });
});

test("finance accounts align content at the top and all three goals share the wide row", () => {
  const dom = new JSDOM(renderToStaticMarkup(React.createElement(gallery.FinanceOverview)));
  const section = dom.window.document.querySelector("section");
  const topRow = section.querySelector(":scope > .grid");
  assert.equal(topRow.children.length, 2);
  assert.doesNotMatch(topRow.textContent, /储蓄目标/);
  assert.match(topRow.firstElementChild.className, /justify-start/);
  assert.doesNotMatch(topRow.firstElementChild.className, /justify-between/);
  const goals = section.lastElementChild.querySelector(".grid");
  assert.match(goals.className, /@min-\[960px\]:grid-cols-3/);
  assert.doesNotMatch(goals.className, /grid-cols-2|col-span-2|whitespace-nowrap/);
  assert.equal(goals.children.length, 3);
  for (const goal of gallery.defaultFinanceGoals) {
    assert.ok(goals.textContent.includes(goal.amount));
    assert.ok(goals.textContent.includes(goal.date));
  }
  assert.ok(topRow.querySelector(".min-h-44"));
  dom.window.close();
});

test("project and collaboration previews use existing portraits and concise member context", () => {
  for (const member of gallery.defaultProjectMembers) assert.ok(existsSync(resolve(root, "public", member.avatar.slice(1))), member.name);
  for (const name of ["project-overview"]) {
    const dom = new JSDOM(renderToStaticMarkup(React.createElement(gallery.BlockPreview, { name })));
    const portraits = [...dom.window.document.querySelectorAll('img[src^="/images/"]')];
    assert.ok(portraits.length >= (name === "project-overview" ? 10 : 1), name);
    if (name === "project-overview") {
      assert.match(dom.window.document.body.textContent, /6 人 · 负责人 张宁/);
      assert.ok(!dom.window.document.body.textContent.includes(gallery.defaultProjectMembers.map(member => member.name).join("、")));
    }
    dom.window.close();
  }
  const custom = renderToStaticMarkup(React.createElement(gallery.ProjectOverview, { members: [], activities: [{ id: "custom", author: "刘澄", description: "提交了验收记录", time: "刚刚", avatar: "/images/team/edward-allen.png" }] }));
  assert.match(custom, /src="\/images\/team\/edward-allen.png"[^>]*alt="刘澄"/);
  assert.doesNotMatch(custom, /负责人 undefined/);
});

test("Props display removes package qualification but preserves the actual type expression", () => {
  assert.equal(gallery.formatPropType('import("react").ReactNode | import("@forge-ui-official/core").PanelProps'), "ReactNode | PanelProps");
  assert.equal(gallery.formatPropType("ComponentProps<typeof import('@forge-ui-official/core').Avatar>"), "ComponentProps<typeof Avatar>");
  assert.equal(gallery.formatPropType('import("other-package").OtherType[] | undefined'), 'import("other-package").OtherType[] | undefined');
});

test("gallery categories preserve URL state and expose inert linked cards with independent copy actions", async () => {
  await withDom(async ({ dom, render, click, button }) => {
    const copied = [];
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async value => copied.push(value) }, configurable: true });
    await render(gallery.BlocksGallery);
    const count = category => catalog.filter(entry => entry.category === category).length;
    const first = catalog.find(entry => entry.category === "看板首屏");
    assert.equal(document.querySelectorAll("article").length, count("看板首屏"));
    assert.equal(document.querySelectorAll('article > div > [inert][aria-hidden="true"]').length, count("看板首屏"));
    assert.equal(document.querySelector('article a').getAttribute("href"), `/blocks/${first.name}`);
    const copy = document.querySelector(`button[aria-label="复制${first.title}安装命令"]`);
    assert.equal(copy.closest("a"), null);
    const before = window.location.href;
    await click(copy);
    assert.deepEqual(copied, [`npx shadcn@latest add https://www.forgeui.org/r/${first.name}.json`]);
    assert.equal(copy.getAttribute("aria-label"), "已复制");
    assert.equal(window.location.href, before);
    await click(button(`图表与指标 ${count("图表与指标")}`));
    assert.equal(document.querySelectorAll("article").length, count("图表与指标"));
    assert.equal(new URLSearchParams(window.location.search).get("category"), "图表与指标");
    await click(button(`图表与指标 ${count("图表与指标")}`));
    assert.equal(document.querySelectorAll("article").length, catalog.length);
    assert.equal(window.location.search, "");
    await React.act(async () => { window.history.replaceState(null, "", "?category=财务"); window.dispatchEvent(new dom.window.PopStateEvent("popstate")); });
    assert.equal(document.querySelectorAll("article").length, count("财务"));
    await React.act(async () => { window.history.replaceState(null, "", "?category=unknown"); window.dispatchEvent(new dom.window.PopStateEvent("popstate")); });
    assert.equal(document.querySelectorAll("article").length, catalog.length);
  }, "https://www.forgeui.org/blocks?category=看板首屏");
});

test("clipboard denial never reports success and permits retry", async () => {
  await withDom(async ({ render, click, button }) => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => { throw new Error("Denied"); } }, configurable: true });
    await render(gallery.CopyButton, { value: "source", label: "复制源码" });
    await click(button("复制源码"));
    assert.ok(button("复制失败，请重试"));
    assert.doesNotMatch(document.body.textContent, /已复制/);
    const copied = [];
    navigator.clipboard.writeText = async value => copied.push(value);
    await click(button("复制失败，请重试"));
    assert.deepEqual(copied, ["source"]);
    assert.ok(button("已复制"));
  });
});

test("detail showcase switches real container width", async () => {
  await withDom(async ({ render, click, button }) => {
    await render(gallery.BlockShowcase, { name: "orders-table-section", header: null });
    assert.equal(document.querySelector("[data-preview-width]").style.maxWidth, "1280px");
    await click(button("移动"));
    assert.equal(document.querySelector("[data-preview-width]").style.maxWidth, "390px");
  });
});

test("code panel shows full source with line numbers and copies it", async () => {
  await withDom(async ({ render, click, button }) => {
    const source = readFileSync(resolve(root, "blocks/orders-table-section/orders-table-section.tsx"), "utf8");
    const copied = [];
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async value => copied.push(value) }, configurable: true });
    await render(gallery.CodePanel, { source, label: "orders-table-section.tsx" });
    assert.match(document.querySelector("pre").textContent, /export function OrdersTableSection/);
    assert.equal(document.querySelectorAll("pre code > span").length, source.trimEnd().split("\n").length);
    await click(button("复制orders-table-section.tsx"));
    assert.deepEqual(copied, [source]);
  });
});

test("detail iframes retain actual viewport widths and authenticate height messages", async () => {
  await withDom(async ({ dom, render, click, button }) => {
    Object.defineProperty(dom.window.HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 320 });
    for (const entry of catalog) {
      await render(gallery.BlockShowcase, { name: entry.name, header: null });
      const iframe = document.querySelector("iframe");
      assert.equal(iframe.style.width, "1280px");
      assert.equal(iframe.style.transform, "scale(0.25)");
      assert.equal(iframe.getAttribute("src"), "/blocks/" + entry.name + "/preview");
    }
    const iframe = document.querySelector("iframe");
    const send = (origin, source, height, name = catalog.at(-1).name) => React.act(async () => window.dispatchEvent(new dom.window.MessageEvent("message", { origin, source, data: { type: "forge-block-height", name, height } })));
    await send("https://evil.example", iframe.contentWindow, 1200);
    assert.equal(iframe.style.height, "720px");
    await send(window.location.origin, window, 1200);
    assert.equal(iframe.style.height, "720px");
    await send(window.location.origin, iframe.contentWindow, 1200, "unknown");
    assert.equal(iframe.style.height, "720px");
    await send(window.location.origin, iframe.contentWindow, 1200);
    assert.equal(iframe.style.height, "1200px");
    assert.equal(document.querySelector("[data-preview-width]").style.height, "300px");
    await send(window.location.origin, iframe.contentWindow, 100);
    assert.equal(iframe.style.height, "720px");
    await send(window.location.origin, iframe.contentWindow, NaN);
    assert.equal(iframe.style.height, "720px");
    await click(button("移动"));
    assert.equal(iframe.style.width, "390px");
  });
});

test("all grouped chart previews retain seven days and have container-scoped narrow geometry", () => {
  for (const name of ["overview-dashboard", "finance-overview", "trend-chart"]) {
    const dom = new JSDOM(renderToStaticMarkup(React.createElement(gallery.BlockPreview, { name })));
    const chart = [...dom.window.document.querySelectorAll("div")].find(element => element.className.includes("grid-cols-[44px_minmax(0,1fr)]"));
    assert.ok(chart, name);
    assert.match(chart.parentElement.className, /@container min-w-0/, name);
    assert.match(chart.className, /@max-\[480px\]:grid-cols-\[32px_minmax\(0,1fr\)\]/, name);
    assert.match(chart.className, /@max-\[480px\]:\[&>div:last-child\]:gap-1/, name);
    assert.match(chart.className, /@max-\[480px\]:\[&>div:last-child>div>div>span\]:w-2/, name);
    assert.match(chart.className, /text-\[10px\]/, name);
    for (const point of gallery.defaultOverviewTrend.data) assert.ok(chart.textContent.includes(point.label), `${name}: ${point.label}`);
    assert.equal(chart.querySelectorAll("span.w-3").length, 14, name);
    dom.window.close();
  }
});

test("responsive grouped charts preserve the core default height and caller height overrides", () => {
  for (const [Component, prop] of [[gallery.OverviewDashboard, "trend"], [gallery.FinanceOverview, "trend"], [gallery.TrendChart, "chart"]]) {
    for (const heightClass of [undefined, "h-80"]) {
      const dom = new JSDOM(renderToStaticMarkup(React.createElement(Component, { [prop]: { ...gallery.defaultOverviewTrend, heightClass } })));
      const chart = [...dom.window.document.querySelectorAll("div")].find(element => element.className.includes("grid-cols-[44px_minmax(0,1fr)]"));
      assert.ok(chart.classList.contains(heightClass ?? "h-56"));
      dom.window.close();
    }
  }
});

test("mobile order and recent-record lists preserve every row and every key business field", () => {
  for (const [name, label, breakpoint] of [["orders-table-section", "订单列表", 900], ["recent-records", "最近记录", 720]]) {
    const dom = new JSDOM(renderToStaticMarkup(React.createElement(gallery.BlockPreview, { name })));
    const list = dom.window.document.querySelector(`ul[aria-label="${label}"]`);
    assert.ok(list, name);
    assert.ok(list.className.includes(`@min-[${breakpoint}px]:hidden`), name);
    assert.match(list.previousElementSibling.className, /hidden @min-\[\d+px\]:block/, name);
    assert.equal(list.children.length, 6, name);
    gallery.defaultOrders.forEach((order, index) => {
      const row = list.children[index];
      for (const value of [order.id, order.customer, order.company, order.amount.toLocaleString("zh-CN"), order.date]) assert.ok(row.textContent.includes(value), `${name}: ${value}`);
      assert.match(row.textContent, /已支付|处理中|已退款/, name);
      const badge = row.querySelector("div.rounded-full.outline");
      assert.ok(badge, name);
      assert.match(badge.className, /bg-fg-(blue|green|yellow|grey)-50/, name);
      assert.doesNotMatch(badge.textContent, /^$/, name);
      if (name === "orders-table-section") assert.ok(row.querySelector(`button[aria-label="查看订单 ${order.id}"]`));
    });
    dom.window.close();
  }
});

test("mobile order actions share search, pagination, export and detail state with the desktop table", async () => {
  await withDom(async ({ dom, render, click, button }) => {
    const exported = [];
    await render(gallery.OrdersTableSection, { pageSize: 2, onExport: rows => exported.push(rows) });
    const list = () => document.querySelector('ul[aria-label="订单列表"]');
    assert.equal(list().children.length, 2);
    await click(list().querySelector('button[aria-label="查看订单 ZX2026103106"]'));
    assert.match(document.querySelector("dialog").textContent, /陈思远/);
    await click(document.querySelector('button[aria-label="关闭弹窗"]'));
    await click(document.querySelector('button[aria-label="下一页"]'));
    assert.match(list().textContent, /ZX2026103004/);
    const search = document.querySelector('input[placeholder="搜索订单号、客户或公司"]');
    await React.act(async () => {
      Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set.call(search, "青石");
      search.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    });
    assert.equal(list().children.length, 1);
    assert.match(list().textContent, /许知夏/);
    await click(button("导出"));
    assert.equal(exported[0][0].company, "青石建筑");
    await click(button("全部状态"));
    await click(button("处理中"));
    assert.equal(list().children.length, 0);
    assert.match(document.body.textContent, /没有符合条件的订单/);
  });
});

test("orders search, filter, pagination, view and export operate on actual records", async () => {
  await withDom(async ({ dom, render, click, button }) => {
    const exported = [];
    const viewed = [];
    await render(gallery.OrdersTableSection, { pageSize: 2, onExport: orders => exported.push(orders), onViewOrder: order => viewed.push(order) });
    assert.equal(document.querySelectorAll("tbody tr").length, 2);
    await click(document.querySelector('button[aria-label="下一页"]'));
    assert.match(document.querySelector("tbody").textContent, /ZX2026103004/);
    const search = document.querySelector('input[placeholder="搜索订单号、客户或公司"]');
    await React.act(async () => {
      Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set.call(search, "青石");
      search.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    });
    assert.equal(document.querySelectorAll("tbody tr").length, 1);
    assert.match(document.querySelector("tbody").textContent, /许知夏/);
    await click(button("导出"));
    assert.equal(exported[0].length, 1);
    assert.equal(exported[0][0].company, "青石建筑");
    await click(document.querySelector('button[aria-label="查看订单 ZX2026103003"]'));
    assert.equal(viewed[0].customer, "许知夏");
    await React.act(async () => {
      Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set.call(search, "");
      search.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    });
    await click(button("全部状态"));
    await click(button("处理中"));
    assert.equal(document.querySelectorAll("tbody tr").length, 1);
    assert.match(document.querySelector("tbody").textContent, /ZX2026103004/);
    await click(button("导出"));
    assert.equal(exported[1][0].status, "processing");
    await render(gallery.OrdersTableSection, { orders: [], pageSize: 0 });
    assert.match(document.body.textContent, /暂无订单记录/);
    assert.equal(button("导出").disabled, true);
  });
});

test("default order actions show details and export safe CSV content", async () => {
  await withDom(async ({ render, click, button }) => {
    let csv;
    const originalCreate = URL.createObjectURL;
    const originalRevoke = URL.revokeObjectURL;
    const originalClick = window.HTMLAnchorElement.prototype.click;
    const downloads = [];
    const revoked = [];
    URL.createObjectURL = blob => { csv = blob; return "blob:orders"; };
    URL.revokeObjectURL = value => revoked.push(value);
    window.HTMLAnchorElement.prototype.click = function () { downloads.push(this.download); };
    try {
      await render(gallery.OrdersTableSection, { orders: [{ ...gallery.defaultOrders[0], customer: '=SUM(1,2)', company: '青石"设计' }, { ...gallery.defaultOrders[1], customer: ' \t=1+1', company: '\t远山' }] });
      await click(document.querySelector('button[aria-label="查看订单 ZX2026103106"]'));
      assert.equal(document.querySelector("dialog").open, true);
      assert.match(document.querySelector("dialog").textContent, /12,800.00/);
      await click(button("导出"));
      const text = await csv.text();
      assert.match(text, /"'=SUM\(1,2\)"/);
      assert.match(text, /"青石""设计"/);
      assert.ok(text.includes("\"' \t=1+1\""));
      assert.ok(text.includes("\"'\t远山\""));
      assert.deepEqual(downloads, ["知行科技-订单.csv"]);
      assert.deepEqual(revoked, ["blob:orders"]);
      assert.match(document.body.textContent, /已导出 2 条订单/);
    } finally {
      URL.createObjectURL = originalCreate;
      URL.revokeObjectURL = originalRevoke;
      window.HTMLAnchorElement.prototype.click = originalClick;
    }
  });
});

test("static detail params, metadata, sitemap and navigation cover every registered Block", async () => {
  assert.deepEqual(gallery.generateStaticParams().map(item => item.name).sort(), catalog.map(item => item.name).sort());
  const sitemap = gallery.sitemap().map(item => item.url);
  assert.equal(new Set(sitemap).size, sitemap.length);
  for (const entry of catalog) {
    assert.ok(sitemap.includes(`https://www.forgeui.org/blocks/${entry.name}`));
    const metadata = await gallery.generateMetadata({ params: Promise.resolve({ name: entry.name }) });
    assert.ok(metadata.title.absolute.includes(entry.title));
    assert.equal(metadata.alternates.canonical, `/blocks/${entry.name}`);
    assert.equal(metadata.description, entry.description);
    const item = JSON.parse(readFileSync(resolve(root, `public/r/${entry.name}.json`), "utf8"));
    const element = await gallery.BlockPage({ params: Promise.resolve({ name: entry.name }) });
    const html = renderToStaticMarkup(React.createElement(gallery.AppRouterContext.Provider, { value: { push() {}, replace() {}, prefetch() {}, refresh() {}, back() {}, forward() {} } }, React.createElement(gallery.PathnameContext.Provider, { value: `/blocks/${entry.name}` }, element)));
    assert.match(html, /面包屑|相邻页面组件/);
    for (const heading of ["安装", "用法", "Props", "相关模板"]) assert.ok(html.includes(heading));
    assert.ok(html.includes(item.meta.core.version));
    for (const component of item.meta.props) assert.ok(html.includes(component.component));
    for (const screen of item.meta.screens) assert.ok(html.includes(screen.href));
    const dom = new JSDOM(html);
    for (const typeCell of dom.window.document.querySelectorAll("tbody td:last-child code")) assert.doesNotMatch(typeCell.textContent, /import\(["'](?:react|@forge-ui-official\/core)["']\)\./);
    dom.window.close();
  }
  await assert.rejects(() => gallery.BlockPage({ params: Promise.resolve({ name: "../../package" }) }), /NEXT_HTTP_ERROR_FALLBACK;404/);
  await assert.rejects(() => gallery.generateMetadata({ params: Promise.resolve({ name: "unknown" }) }), /NEXT_HTTP_ERROR_FALLBACK;404/);
});

test("shell config and static preview routes cover every entry without indexing previews", async () => {
  assert.deepEqual(gallery.previewStaticParams().map(item => item.name).sort(), catalog.map(item => item.name).sort());
  assert.equal(gallery.previewMetadata.robots.index, false);
  const search = JSON.parse(readFileSync(resolve(root, "src/app/_components/search-index.json"), "utf8"));
  for (const entry of catalog) {
    assert.ok(entry.shell);
    if (typeof entry.shell === "object") assert.ok(gallery.shellMenus[entry.shell.menu].items.some(item => item.key === entry.shell.active));
    const element = await gallery.PreviewPage({ params: Promise.resolve({ name: entry.name }) });
    const html = renderToStaticMarkup(React.createElement(gallery.AppRouterContext.Provider, { value: { push() {}, replace() {}, prefetch() {}, refresh() {}, back() {}, forward() {} } }, React.createElement(gallery.PathnameContext.Provider, { value: "/blocks/" + entry.name + "/preview" }, element)));
    if (entry.shell === "none") {
      assert.doesNotMatch(html, /forge-app-sidebar/);
    } else if (entry.shell === "frame") {
      assert.match(html, /forge-app-sidebar/);
    } else {
      assert.match(html, /知行科技/);
      assert.match(html, /forge-app-sidebar/);
      const dom = new JSDOM(html);
      const selected = dom.window.document.querySelector('a[aria-current="page"]');
      assert.ok(selected.textContent.includes(gallery.shellMenus[entry.shell.menu].items.find(item => item.key === entry.shell.active).label), entry.name);
      dom.window.close();
      assert.ok(html.includes(entry.shell.title));
    }
    assert.ok(!gallery.sitemap().some(item => item.url.endsWith("/preview")));
    assert.ok(!search.some(item => item.id.endsWith("/preview")));
    const item = JSON.parse(readFileSync(resolve(root, "public/r/" + entry.name + ".json"), "utf8"));
    assert.doesNotMatch(item.files[0].content, entry.shell === "frame" ? /BlockShell/ : /AppLayout|BlockShell/);
  }
  await assert.rejects(() => gallery.PreviewPage({ params: Promise.resolve({ name: "unknown" }) }), /NEXT_HTTP_ERROR_FALLBACK;404/);
});

test("public Chinese copy consistently names page components", () => {
  for (const file of ["src/app/blocks/page.tsx", "src/app/blocks/[name]/page.tsx", "src/app/blocks/_gallery.tsx", "src/app/blocks/_block-showcase.tsx", "src/app/blocks/_catalog.ts", "src/app/_components/site-header.tsx", "src/app/_components/search-index.json", "scripts/generate-block-registry.mjs", "skills/forge-skill/SKILL.md", "skills/forge-skill/references/blocks.md", "skills/forge-skill/references/audit-checklist.md"]) {
    assert.ok(!readFileSync(resolve(root, file), "utf8").includes("\u533a\u5757"), file);
  }
});

test("shell none renders a centered page without sidebar navigation", () => {
  const block = gallery.blocks.find(entry => entry.name === "file-manager");
  const original = block.shell;
  try {
    block.shell = "none";
    const html = renderToStaticMarkup(React.createElement(gallery.BlockShell, { name: block.name }));
    assert.doesNotMatch(html, /forge-app-sidebar/);
    assert.match(html, /items-center justify-center/);
    assert.match(html, /文件/);
  } finally {
    block.shell = original;
  }
});
