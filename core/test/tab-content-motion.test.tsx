import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, useState, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { TabBar } from "../src/components/ui/tab-bar";
import { TabsContent } from "../src/components/ui/tabs-content";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

async function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  let reduced = false;
  const listeners = new Set<() => void>();
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({
    get matches() { return reduced; },
    addEventListener: (_: string, callback: () => void) => listeners.add(callback),
    removeEventListener: (_: string, callback: () => void) => listeners.delete(callback),
  }) });
  const observers = new Set<{ observe(target: Element): void; disconnect(): void; callback: () => void }>();
  class Observer {
    constructor(public callback: () => void) { observers.add(this); }
    observe() {}
    disconnect() { observers.delete(this); }
  }
  const visualHeights = new WeakMap<HTMLElement, number>();
  const animations: { target: HTMLElement; frames: Keyframe[]; canceled: boolean; onfinish: (() => void) | null; cancel(): void }[] = [];
  dom.window.HTMLElement.prototype.animate = function(frames) {
    const values = frames as Keyframe[];
    if (values[0].height) visualHeights.set(this, Number.parseFloat(String(values[0].height)));
    const animation = { target: this, frames: values, canceled: false, onfinish: null, cancel() { this.canceled = true; visualHeights.delete(this.target); } };
    animations.push(animation);
    return animation as unknown as Animation;
  };
  dom.window.HTMLElement.prototype.getBoundingClientRect = function() {
    const node = this.matches("[data-test-height]") ? this : this.querySelector("[data-test-height]");
    const height = visualHeights.get(this) ?? Number(node?.getAttribute("data-test-height") ?? 0);
    return { x: 0, y: 0, top: 0, left: 0, right: 400, bottom: height, width: 400, height, toJSON() {} };
  };
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, Node: dom.window.Node, ResizeObserver: Observer, KeyboardEvent: dom.window.KeyboardEvent });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return {
    dom, animations,
    render: (node: ReactNode) => act(async () => root.render(node)),
    resize: () => act(async () => observers.forEach(observer => observer.callback())),
    reduce: (value = true) => act(async () => { reduced = value; listeners.forEach(listener => listener()); }),
    close: async () => { await act(async () => root.unmount()); dom.window.close(); delete (globalThis as { ResizeObserver?: unknown }).ResizeObserver; },
  };
}
const wait = (milliseconds: number) => act(async () => { await new Promise(resolve => setTimeout(resolve, milliseconds)); });
const panel = () => document.querySelector<HTMLElement>('[role="tabpanel"]')!;

function LinkedTabs() {
  const [active, setActive] = useState(0);
  return <><TabBar tabs={["概览", "任务", "文件"].map((label, index) => ({ label, active: index === active, id: `tab-${index}`, controls: "panel" }))} onChange={setActive} /><TabsContent activeKey={active} transition="slide" id="panel" labelledBy={`tab-${active}`}><button data-test-height={100 + active * 80}>内容 {active}</button></TabsContent></>;
}

test("TabsContent keeps fade as default and slide server output associates one named panel", () => {
  const fallback = renderToString(<TabsContent activeKey="overview">概览</TabsContent>);
  assert.match(fallback, /class="forge-tabs-content"/);
  assert.doesNotMatch(fallback, /data-tabs-transition/);
  const dom = new JSDOM(renderToString(<LinkedTabs />));
  assert.equal(dom.window.document.querySelectorAll('[role="tabpanel"]').length, 1);
  assert.equal(dom.window.document.querySelector('[role="tabpanel"]')?.getAttribute("aria-labelledby"), "tab-0");
  assert.equal(dom.window.document.querySelector('[role="tab"]')?.getAttribute("aria-controls"), "panel");
  dom.window.close();
});

test("TabBar keyboard selection exits inertly before exposing the matching panel", async () => {
  const env = await setup();
  try {
    await env.render(<LinkedTabs />);
    const tabs = document.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    await act(async () => { tabs[0].focus(); tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })); });
    assert.equal(document.activeElement, tabs[1]);
    assert.equal(document.querySelectorAll('[aria-selected="true"]').length, 1);
    assert.ok(panel().hasAttribute("inert"));
    assert.equal(panel().getAttribute("aria-hidden"), "true");
    assert.equal(panel().textContent, "内容 0");
    await wait(160);
    assert.equal(panel().textContent, "内容 1");
    assert.equal(panel().getAttribute("aria-labelledby"), "tab-1");
    assert.equal(document.querySelectorAll('#panel').length, 1);
    assert.equal(panel().hasAttribute("inert"), false);
    await act(async () => tabs[1].dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })));
    assert.equal(document.activeElement, tabs[2]);
    await act(async () => tabs[2].dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true })));
    assert.equal(document.activeElement, tabs[0]);
    await wait(160);
    assert.equal(panel().textContent, "内容 0");
    assert.equal(document.querySelector('[data-state="closed"]'), null);
  } finally { await env.close(); }
});

test("TabsContent rapid requests use the latest destination and cancel a return to the current tab", async () => {
  const env = await setup();
  const render = (key: number) => env.render(<TabsContent activeKey={key} transition="slide"><button>Panel {key}</button></TabsContent>);
  try {
    await render(0);
    const original = panel();
    for (const key of [2, 1, 2, 1]) {
      await render(key);
      assert.equal(document.querySelectorAll('[role="tabpanel"]').length, 1);
      assert.equal(panel().textContent, "Panel 0");
    }
    await wait(160);
    assert.equal(panel().textContent, "Panel 1");
    let entries = env.animations.filter(animation => animation.frames[0].opacity === 0);
    assert.equal(entries.at(-1)?.frames[0].transform, "translateX(24px)");
    const interrupted = panel();
    interrupted.style.opacity = "0.45";
    interrupted.style.transform = "translateX(12px)";
    await render(0);
    const reverse = env.animations.at(-1)!;
    assert.equal(reverse.frames[0].opacity, "0.45");
    assert.equal(reverse.frames[0].transform, "translateX(12px)");
    interrupted.removeAttribute("style");
    await wait(160);
    entries = env.animations.filter(animation => animation.frames[0].opacity === 0);
    assert.equal(entries.at(-1)?.frames[0].transform, "translateX(-24px)");
    const current = panel();
    await render(2);
    await render(0);
    assert.equal(panel(), current, "returning while exiting does not remount the current content");
    assert.notEqual(panel(), original, "completed key changes retain the existing remount contract");
    assert.equal(panel().hasAttribute("inert"), false);
    await wait(170);
    assert.equal(panel().textContent, "Panel 0");
  } finally { await env.close(); }
});

test("TabsContent never duplicates IDs or submitted form controls during transition", async () => {
  const env = await setup();
  const render = (key: string) => env.render(<form><TabsContent activeKey={key} transition="slide"><label htmlFor="title">Title</label><input id="title" name="title" defaultValue={key} /></TabsContent></form>);
  const assertOne = (value: string) => {
    assert.equal(document.querySelectorAll('#title').length, 1);
    assert.deepEqual([...new env.dom.window.FormData(document.querySelector('form')!).entries()], [["title", value]]);
  };
  try {
    await render("A"); assertOne("A");
    await render("B"); assertOne("A");
    await render("C"); assertOne("A");
    await wait(160); assertOne("C");
    await render("D"); assertOne("C");
    await env.reduce(); assertOne("D");
  } finally { await env.close(); }
});

test("TabsContent measures content height, honors explicit direction, and restores outgoing focus", async () => {
  const env = await setup();
  try {
    await env.render(<TabsContent activeKey="a" transition="slide"><button data-test-height="100">Old</button></TabsContent>);
    await act(async () => panel().querySelector("button")!.focus());
    await env.render(<TabsContent activeKey="b" transition="slide" direction="backward"><button data-test-height="240">New</button></TabsContent>);
    await wait(160);
    assert.equal(document.activeElement, panel());
    assert.ok(env.animations.some(animation => animation.frames[0].height === "100px" && animation.frames[1].height === "240px"));
    assert.ok(env.animations.some(animation => animation.frames[0].transform === "translateX(-24px)"));
    panel().querySelector("button")!.setAttribute("data-test-height", "320");
    await env.resize();
    assert.ok(env.animations.some(animation => animation.frames[1].height === "320px"));
  } finally { await env.close(); }
});

test("TabsContent system reduction immediately cancels animations and reveals the latest request", async () => {
  const env = await setup();
  try {
    await env.render(<LinkedTabs />);
    await act(async () => document.querySelectorAll<HTMLButtonElement>('[role="tab"]')[1].click());
    assert.ok(env.animations.length > 0);
    await env.reduce();
    assert.ok(env.animations.every(animation => animation.canceled));
    assert.equal(panel().textContent, "内容 1");
    assert.equal(panel().hasAttribute("inert"), false);
    assert.equal(document.querySelector('[data-tabs-transition]')?.getAttribute("data-motion"), "none");
    assert.equal(document.querySelector<HTMLElement>('.forge-moving-indicator')?.style.transition, "none");
    const count = env.animations.length;
    await act(async () => document.querySelectorAll<HTMLButtonElement>('[role="tab"]')[2].click());
    assert.equal(env.animations.length, count);
    assert.equal(panel().textContent, "内容 2");
    await env.reduce(false);
    await act(async () => document.querySelectorAll<HTMLButtonElement>('[role="tab"]')[0].click());
    assert.ok(env.animations.length > count);
    await env.render(<TabsContent activeKey="explicit" transition="slide" motion="none">Direct</TabsContent>);
    assert.equal(document.querySelector('[data-state="closed"]'), null);
  } finally { await env.close(); }
});
