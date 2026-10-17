import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { CommandSearch, type CommandSearchItem } from "../src/components/ui/agent/command-search";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

const items: CommandSearchItem[] = [
  { id: "doc-a", label: "设计规范", group: "文档", keywords: ["guidelines"] },
  { id: "create", label: "创建文档", group: "命令", shortcut: "⌘ N" },
  { id: "doc-b", label: "产品需求", group: "文档", hint: "需求" },
  { id: "mute", label: "暂停提醒", group: "命令" },
];

async function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  let reduced = false;
  const mediaListeners = new Set<() => void>();
  const scrollCalls: ScrollToOptions[] = [];
  let animationCount = 0;
  let canceled = 0;
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({
    get matches() { return reduced; },
    addEventListener: (_: string, listener: () => void) => mediaListeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => mediaListeners.delete(listener),
  }) });
  Object.defineProperties(dom.window.HTMLElement.prototype, {
    clientHeight: { configurable: true, get() { return 80; } },
    offsetWidth: { configurable: true, get() { return 240; } },
    offsetHeight: { configurable: true, get() { return 36; } },
    offsetTop: { configurable: true, get() {
      const rows = Array.from(dom.window.document.querySelectorAll('[role="option"]'));
      return rows.indexOf(this) * 36 + 28;
    } },
    offsetLeft: { configurable: true, get() { return 0; } },
  });
  dom.window.HTMLElement.prototype.getBoundingClientRect = function () {
    return { top: this.getAttribute("role") === "option" ? this.offsetTop - (this.closest('[class*="overflow-y-auto"]')?.scrollTop ?? 0) : 0, left: 0, width: 240, height: 36, bottom: 36, right: 240, x: 0, y: 0, toJSON() {} };
  };
  dom.window.HTMLElement.prototype.scrollTo = function (options?: ScrollToOptions | number) {
    if (!options || typeof options === "number") return;
    scrollCalls.push(options);
    this.scrollTop = options.top ?? 0;
  };
  dom.window.HTMLElement.prototype.animate = function () { animationCount++; return { cancel() { canceled++; } } as Animation; };
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document,
    HTMLElement: dom.window.HTMLElement, Element: dom.window.Element,
  });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return {
    render: (node: ReactNode) => act(async () => root.render(node)),
    key: (key: string, extra: KeyboardEventInit = {}) => act(async () => input().dispatchEvent(new dom.window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...extra }))),
    type: (value: string) => act(async () => {
      const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value")!.set!;
      setter.call(input(), value);
      input().dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    }),
    reduce: () => act(async () => { reduced = true; mediaListeners.forEach(listener => listener()); }),
    scrollCalls,
    get animations() { return animationCount; },
    get canceled() { return canceled; },
    close: async () => { await act(async () => root.unmount()); dom.window.close(); },
  };
}
const input = () => document.querySelector<HTMLInputElement>('[role="combobox"]')!;
const selected = () => document.querySelector<HTMLButtonElement>('[role="option"][aria-selected="true"]');
const assertActive = (label: string) => {
  assert.equal(selected()?.textContent?.includes(label), true);
  assert.equal(input().getAttribute("aria-activedescendant"), selected()?.id);
  assert.equal(document.querySelectorAll('[role="option"][aria-selected="true"]').length, 1);
};

test("CommandSearch defaults to Chinese with linked combobox, listbox, options and optional shortcuts", () => {
  const dom = new JSDOM(renderToString(<CommandSearch items={items} />));
  const search = dom.window.document.querySelector('[role="combobox"]')!;
  assert.equal(search.getAttribute("placeholder"), "搜索命令…");
  assert.equal(search.getAttribute("aria-expanded"), "true");
  assert.equal(dom.window.document.getElementById(search.getAttribute("aria-controls")!)?.getAttribute("role"), "listbox");
  assert.equal(dom.window.document.getElementById(search.getAttribute("aria-activedescendant")!)?.textContent, "设计规范");
  assert.equal(dom.window.document.querySelector("kbd")?.textContent, "⌘ N");
  assert.deepEqual(Array.from(dom.window.document.querySelectorAll<HTMLElement>('[role="option"]')).map(row => row.tabIndex), [-1, -1, -1, -1]);
  dom.window.close();
  assert.match(renderToString(<CommandSearch items={[]} locale="en" />), /No matching commands/);
  assert.match(renderToString(<CommandSearch items={[]} locale="en" placeholder="自定义搜索" emptyLabel="没有内容" />), /没有内容/);
});

test("CommandSearch keyboard cursor follows rendered groups, wraps, jumps and executes exactly one active option", async () => {
  const env = await setup();
  const calls: string[] = [];
  try {
    await env.render(<CommandSearch items={items} onSelect={item => calls.push(item.id)} />);
    input().focus();
    assertActive("设计规范");
    await env.key("ArrowDown"); assertActive("产品需求");
    await env.key("ArrowDown"); assertActive("创建文档");
    await env.key("End"); assertActive("暂停提醒");
    await env.key("ArrowDown"); assertActive("设计规范");
    await env.key("ArrowUp"); assertActive("暂停提醒");
    await env.key("Home"); assertActive("设计规范");
    await env.key("Enter", { isComposing: true });
    await env.key("Enter", { keyCode: 229 });
    assert.deepEqual(calls, []);
    await env.key("Enter"); assert.deepEqual(calls, ["doc-a"]);
    assert.equal(document.activeElement, input());
    await env.key("End");
    assert.ok(env.scrollCalls.some(call => (call.top ?? 0) > 0 && call.behavior === "smooth"));
    await act(async () => selected()!.click());
    assert.deepEqual(calls, ["doc-a", "mute"]);
  } finally { await env.close(); }
});

test("CommandSearch filters labels, hints and keywords, resets the cursor and clears missing descendants", async () => {
  const env = await setup();
  const queries: string[] = [];
  try {
    await env.render(<CommandSearch items={items} onQueryChange={query => queries.push(query)} />);
    await env.key("End");
    await env.type("guidelines");
    assert.equal(document.querySelectorAll('[role="option"]').length, 1);
    assertActive("设计规范");
    assert.deepEqual(queries, ["guidelines"]);
    await env.type("不存在");
    assert.equal(input().hasAttribute("aria-activedescendant"), false);
    assert.equal(document.querySelector('[role="status"]')?.textContent, "没有匹配的命令");
    await env.key("Enter"); await env.key("ArrowDown");
    await env.type("需求"); assertActive("产品需求");
    await env.render(<CommandSearch items={items} query="" locale="en" />);
    await env.key("End"); assertActive("暂停提醒");
    await env.render(<CommandSearch items={items.filter(item => item.id !== "mute")} query="" locale="en" />);
    assertActive("设计规范");
    assert.equal(input().placeholder, "Search commands…");
  } finally { await env.close(); }
});

test("CommandSearch preserves controlled query ownership and disables movement when reduced motion changes", async () => {
  const env = await setup();
  const queries: string[] = [];
  try {
    await env.render(<CommandSearch items={items} query="" onQueryChange={query => queries.push(query)} />);
    await env.type("设计");
    assert.equal(input().value, "");
    assert.deepEqual(queries, ["设计"]);
    await env.render(<CommandSearch items={items} query="设计" />);
    assertActive("设计规范");
    assert.ok(env.animations > 0);
    await env.reduce();
    const animations = env.animations;
    assert.ok(env.canceled > 0);
    assert.equal(document.querySelector<HTMLElement>(".forge-moving-indicator")?.style.transition, "none");
    await env.render(<CommandSearch items={items} query="" />);
    await env.key("End");
    assert.equal(env.animations, animations);
    assert.equal(env.scrollCalls.at(-1)?.behavior, "auto");
    await env.render(<CommandSearch items={items} motion="none" />);
    assert.equal(document.querySelector('[role="listbox"]')?.getAttribute("data-motion"), "none");
  } finally { await env.close(); }
});
