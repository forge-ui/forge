import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";

const nodeProtocol = "node:";
// Dynamic built-in name keeps the test bundle compatible with tsup's CJS output.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${nodeProtocol}test`);

import { KebabMenu } from "../src/components/ui/kebab-menu";

function installDom() {
  const dom = new JSDOM(
    "<!doctype html><html><body><div id=\"root\"></div></body></html>",
    { url: "http://localhost/" },
  );

  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    self: dom.window,
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    Event: dom.window.Event,
    MouseEvent: dom.window.MouseEvent,
    KeyboardEvent: dom.window.KeyboardEvent,
    getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
  });

  return dom;
}

function makeRect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    x: left,
    y: top,
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
    toJSON: () => ({}),
  } as DOMRect;
}

test("KebabMenu 在滚动容器内打开后仍可完整选择菜单项", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  let selected = 0;

  await act(async () => {
    root.render(createElement(
      "div",
      { "data-testid": "table-scroll", style: { overflowX: "auto" } },
      createElement(KebabMenu, {
        items: [{ label: "编辑", onSelect: () => { selected += 1; } }],
      }),
    ));
  });

  const scrollContainer = document.querySelector<HTMLElement>('[data-testid="table-scroll"]');
  const trigger = document.querySelector<HTMLButtonElement>('button[aria-label="更多操作"]');
  assert.ok(scrollContainer);
  assert.ok(trigger);

  await act(async () => trigger.click());

  const menuItem = [...document.querySelectorAll<HTMLButtonElement>("button")]
    .find((button) => button.textContent?.trim() === "编辑");
  assert.ok(menuItem);
  assert.equal(scrollContainer.contains(menuItem), false);

  await act(async () => {
    menuItem.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    menuItem.click();
  });
  assert.equal(selected, 1);
  assert.equal(document.body.textContent?.includes("编辑"), false);

  await act(async () => root.unmount());
  dom.window.close();
});

test("KebabMenu 点击 portal 与触发器之外的区域后关闭", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(createElement(KebabMenu, { items: [{ label: "查看" }] }));
  });

  const trigger = document.querySelector<HTMLButtonElement>('button[aria-label="更多操作"]');
  assert.ok(trigger);
  await act(async () => trigger.click());
  assert.equal(document.body.textContent?.includes("查看"), true);

  await act(async () => {
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  });
  assert.equal(document.body.textContent?.includes("查看"), false);

  await act(async () => root.unmount());
  dom.window.close();
});

test("KebabMenu 跟随滚动中的触发器定位并避开视口边缘", async () => {
  const dom = installDom();
  Object.defineProperty(dom.window, "innerWidth", { configurable: true, value: 800 });
  Object.defineProperty(dom.window, "innerHeight", { configurable: true, value: 720 });

  let triggerRect = makeRect(700, 660, 40, 40);
  const originalGetBoundingClientRect = dom.window.HTMLElement.prototype.getBoundingClientRect;
  dom.window.HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
    if (this.querySelector('button[aria-label="更多操作"]')) return triggerRect;
    if (this.style.position === "fixed") return makeRect(0, 0, 240, 120);
    return makeRect(0, 0, 0, 0);
  };

  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(createElement(
      "div",
      { "data-testid": "table-scroll", style: { overflowX: "auto" } },
      createElement(KebabMenu, { items: [{ label: "删除" }] }),
    ));
  });

  const trigger = document.querySelector<HTMLButtonElement>('button[aria-label="更多操作"]');
  assert.ok(trigger);
  await act(async () => trigger.click());

  const menuItem = [...document.querySelectorAll<HTMLButtonElement>("button")]
    .find((button) => button.textContent?.trim() === "删除");
  const floatingPanel = menuItem?.parentElement?.parentElement;
  assert.ok(floatingPanel);
  assert.equal(floatingPanel.style.position, "fixed");
  assert.equal(floatingPanel.style.left, "500px");
  assert.equal(floatingPanel.style.top, "536px");
  assert.equal(floatingPanel.style.visibility, "visible");

  triggerRect = makeRect(100, 100, 40, 40);
  const scrollContainer = document.querySelector<HTMLElement>('[data-testid="table-scroll"]');
  assert.ok(scrollContainer);
  await act(async () => {
    scrollContainer.dispatchEvent(new Event("scroll", { bubbles: false }));
  });
  assert.equal(floatingPanel.style.left, "8px");
  assert.equal(floatingPanel.style.top, "144px");

  Object.defineProperty(dom.window, "innerWidth", { configurable: true, value: 320 });
  triggerRect = makeRect(290, 100, 30, 40);
  await act(async () => {
    dom.window.dispatchEvent(new Event("resize"));
  });
  assert.equal(floatingPanel.style.left, "72px");
  assert.equal(floatingPanel.style.top, "144px");

  await act(async () => root.unmount());
  dom.window.HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  dom.window.close();
});
