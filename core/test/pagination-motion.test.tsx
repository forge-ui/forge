import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { Pagination } from "../src/components/ui/pagination";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

async function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  let available = 640;
  let reduced = false;
  const mediaListeners = new Set<() => void>();
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({
    get matches() { return reduced; },
    addEventListener: (_type: string, listener: () => void) => mediaListeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => mediaListeners.delete(listener),
  }) });
  Object.defineProperties(dom.window.HTMLElement.prototype, {
    clientWidth: { configurable: true, get() { return this.id === "root" ? available : 0; } },
    offsetWidth: { configurable: true, get() { return 40; } },
    offsetHeight: { configurable: true, get() { return 40; } },
    offsetTop: { configurable: true, get() { return 0; } },
    offsetLeft: { configurable: true, get() {
      const siblings = Array.from(this.parentElement?.children ?? []).filter(item => !(item as Element).classList.contains("forge-moving-indicator"));
      return siblings.indexOf(this) * 48;
    } },
  });
  const observers = new Set<{ targets: Set<Element>; callback: () => void }>();
  class Observer {
    targets = new Set<Element>();
    constructor(public callback: () => void) { observers.add(this); }
    observe(target: Element) { this.targets.add(target); }
    disconnect() { observers.delete(this); }
  }
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement,
    Element: dom.window.Element, SVGElement: dom.window.SVGElement, ResizeObserver: Observer,
  });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return {
    render: (node: ReactNode) => act(async () => root.render(node)),
    resize: (width: number) => act(async () => {
      available = width;
      for (const observer of [...observers]) if (observer.targets.has(document.getElementById("root")!)) observer.callback();
    }),
    reduce: () => act(async () => { reduced = true; mediaListeners.forEach(listener => listener()); }),
    close: async () => { await act(async () => root.unmount()); dom.window.close(); delete (globalThis as { ResizeObserver?: unknown }).ResizeObserver; },
  };
}

const pageButtons = () => Array.from(document.querySelectorAll<HTMLButtonElement>('button[aria-label^="第 "]'));
const indicator = () => document.querySelector<HTMLElement>(".forge-moving-indicator")!;

test("Pagination keeps its five-page forward window and adds localized navigation semantics", () => {
  const chinese = new JSDOM(renderToString(<Pagination totalPages={20} currentPage={8} />));
  assert.equal(chinese.window.document.querySelector('[role="navigation"]')?.getAttribute("aria-label"), "分页");
  assert.deepEqual(Array.from(chinese.window.document.querySelectorAll('button[aria-label^="第 "]')).map(button => button.textContent), ["8", "9", "10", "11", "12"]);
  assert.equal(chinese.window.document.querySelectorAll('[aria-current="page"]').length, 1);
  assert.equal(chinese.window.document.querySelector('[aria-current="page"]')?.textContent, "8");
  assert.equal(Array.from(chinese.window.document.querySelectorAll("span")).filter(span => span.textContent === "...").length, 2);
  chinese.window.close();
  const english = renderToString(<Pagination totalPages={7} currentPage={1} locale="en" />);
  assert.match(english, /aria-label="Previous page"/);
  assert.match(english, /aria-label="Next page"/);
  assert.match(english, /aria-label="Page 1"/);
});

test("Pagination changes pages immediately through its controlled callback and disables both boundaries", async () => {
  const env = await setup();
  const calls: number[] = [];
  const render = (page: number) => env.render(<Pagination totalPages={20} currentPage={page} onPageChange={value => calls.push(value)} />);
  try {
    await render(1);
    const previous = document.querySelector<HTMLButtonElement>('[aria-label="上一页"]')!;
    assert.equal(previous.disabled, true);
    await act(async () => previous.click());
    assert.deepEqual(calls, []);
    await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="第 4 页"]')!.click());
    assert.deepEqual(calls, [4]);
    assert.equal(document.querySelector('[aria-current="page"]')?.textContent, "1", "the consumer owns currentPage");
    await render(4);
    await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="下一页"]')!.click());
    assert.deepEqual(calls, [4, 5]);
    await render(20);
    const next = document.querySelector<HTMLButtonElement>('[aria-label="下一页"]')!;
    assert.equal(next.disabled, true);
    await act(async () => next.click());
    assert.deepEqual(calls, [4, 5]);
  } finally { await env.close(); }
});

test("Pagination fits a 300px parent without shrinking hit areas and restores its window on resize", async () => {
  const env = await setup();
  try {
    await env.render(<Pagination totalPages={20} currentPage={8} />);
    assert.equal(pageButtons().length, 5);
    const layer = indicator();
    await env.resize(300);
    assert.deepEqual(pageButtons().map(button => button.textContent), ["8", "9"]);
    const slots = document.querySelector('[role="navigation"]')!.children.length - 1;
    assert.ok(slots * 40 + (slots - 1) * 8 <= 300);
    assert.ok(pageButtons().every(button => button.classList.contains("w-10") && button.classList.contains("h-10")));
    assert.equal(indicator(), layer);
    assert.equal(layer.style.getPropertyValue("--forge-indicator-x"), "96px");
    assert.equal(layer.style.getPropertyValue("--forge-indicator-width"), "40px");
    assert.equal(layer.style.getPropertyValue("--forge-indicator-height"), "40px");
    for (let index = 0; index < 5; index++) await env.resize(300);
    assert.equal(pageButtons().length, 2, "repeated observer delivery stays stable");
    await env.resize(640);
    assert.equal(pageButtons().length, 5);
    await env.render(<Pagination totalPages={7} currentPage={7} />);
    assert.deepEqual(pageButtons().map(button => button.textContent), ["7"]);
    assert.equal(document.querySelector('[aria-current="page"]')?.textContent, "7");
  } finally { await env.close(); }
});

test("Pagination retargets one fixed-size indicator on rapid changes and disables motion immediately", async () => {
  const env = await setup();
  try {
    await env.render(<Pagination totalPages={20} currentPage={1} />);
    const layer = indicator();
    for (const page of [4, 2, 15, 20, 1]) {
      await env.render(<Pagination totalPages={20} currentPage={page} />);
      assert.equal(indicator(), layer);
      assert.equal(document.querySelectorAll('[aria-current="page"]').length, 1);
      assert.equal(document.querySelector('[aria-current="page"]')?.textContent, String(page));
      assert.equal(layer.style.getPropertyValue("--forge-indicator-width"), "40px");
      assert.equal(layer.style.transform, "", "the background is never scaled");
    }
    assert.match(layer.style.transition, /^translate 420ms/);
    await env.reduce();
    assert.equal(layer.style.transition, "none");
    assert.equal(document.querySelector('[role="navigation"]')?.getAttribute("data-motion"), "none");
    await env.render(<Pagination totalPages={20} currentPage={3} motion="none" />);
    assert.equal(layer.style.transition, "none");
    assert.equal(document.querySelector('[aria-current="page"]')?.textContent, "3");
  } finally { await env.close(); }
});
