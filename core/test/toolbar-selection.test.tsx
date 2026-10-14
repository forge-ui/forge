import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { Toolbar } from "../src/components/ui/toolbar";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

async function setup(reduced = true) {
  const dom = new JSDOM('<button id="external">Select document</button><div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({ matches: reduced, addEventListener() {}, removeEventListener() {} }) });
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window,
    document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element,
    SVGElement: dom.window.SVGElement, getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
    requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window), cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
  });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return { dom, render: (node: ReactNode) => act(async () => root.render(node)), close: async () => { await act(async () => root.unmount()); dom.window.close(); } };
}

test("Toolbar without selection preserves its original flex row and left/right children", () => {
  const markup = renderToString(<Toolbar className="custom" left={<button>Search</button>} right={<span>Actions</span>} />);
  assert.equal(markup, '<div class="flex w-full flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-start custom"><button>Search</button><span>Actions</span></div>');
});

test("selection count is finite, nonnegative, and integral; labels default to Chinese", () => {
  for (const count of [0, -2, Number.NaN, Number.POSITIVE_INFINITY, .9]) {
    const markup = renderToString(<Toolbar left="Normal" selection={{ count, onClear() {}, actions: <button>Archive</button> }} />);
    assert.doesNotMatch(markup, /role="group"/);
    assert.doesNotMatch(markup, /Archive/);
    assert.match(markup, /Normal/);
  }
  const markup = renderToString(<Toolbar selection={{ count: 2.9, onClear() {}, actions: "归档" }} />);
  assert.match(markup, /2 项已选/);
  assert.match(markup, /取消选择/);
  assert.match(markup, /aria-label="批量操作"/);
});

test("clear and Escape report to the consumer without changing controlled selection", async () => {
  const env = await setup(); let clears = 0;
  try {
    await env.render(<Toolbar motion="none" selection={{ count: 2, onClear: () => { clears++; }, actions: <button>归档</button> }} />);
    const clear = document.querySelector<HTMLButtonElement>('[role="group"] button')!;
    await act(async () => clear.click());
    assert.equal(clears, 1);
    assert.match(document.querySelector('[role="status"]')!.textContent!, /2 项已选/);
    await act(async () => clear.dispatchEvent(new env.dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })));
    assert.equal(clears, 2);
    assert.ok(document.querySelector('[role="group"]'));
  } finally { await env.close(); }
});

test("normal content retains its DOM and state while selection is active", async () => {
  const env = await setup();
  const render = (count: number) => env.render(<Toolbar motion="none" left={<input defaultValue="draft" aria-label="Search" />} selection={{ count, onClear() {}, actions: "Archive" }} />);
  try {
    await render(0);
    const input = document.querySelector<HTMLInputElement>('input')!;
    input.value = "kept value";
    await render(1);
    assert.equal(document.querySelector('input'), input);
    assert.ok(input.closest('[hidden][inert][aria-hidden="true"]'));
    await render(0);
    assert.equal(document.querySelector('input'), input);
    assert.equal(input.value, "kept value");
    assert.equal(input.closest('[hidden], [inert], [aria-hidden="true"]'), null);
  } finally { await env.close(); }
});

for (const preference of ["auto", "none"] as const) {
  test(`${preference}: switch from a focused normal action and restore it after clear`, async () => {
    const env = await setup(false);
    const render = (count: number) => env.render(<Toolbar motion={preference} right={<button>Select all</button>} selection={{ count, onClear() {}, actions: <button>Archive</button> }} />);
    try {
      await render(0);
      const normal = document.querySelector<HTMLButtonElement>('#root button')!;
      await act(async () => normal.focus());
      await render(2);
      assert.equal(document.activeElement?.textContent, "取消选择");
      await render(0);
      assert.equal(document.activeElement, normal);
      const retained = document.querySelector('[role="group"]');
      if (retained) assert.ok(retained.closest('[inert][aria-hidden="true"]'));
    } finally { await env.close(); }
  });
}

test("selection changes do not steal focus from a document checkbox outside Toolbar", async () => {
  const env = await setup();
  const render = (count: number) => env.render(<Toolbar motion="none" right={<button>Select all</button>} selection={{ count, onClear() {}, actions: <button>Archive</button> }} />);
  try {
    const external = document.getElementById("external")!;
    await render(0);
    external.focus();
    await render(1);
    assert.equal(document.activeElement, external);
    await render(0);
    assert.equal(document.activeElement, external);
  } finally { await env.close(); }
});

test("motion-none and system reduced motion expose one current count and English/custom labels", async () => {
  const env = await setup(true);
  try {
    for (const preference of ["auto", "none"] as const) {
      await env.render(<Toolbar motion={preference} locale="en" selection={{ count: 3, onClear() {}, actions: <button>Archive</button> }} />);
      assert.equal(document.querySelector('[role="group"]')!.getAttribute("aria-label"), "Selection actions");
      assert.equal(document.querySelector('[role="status"] .sr-only')!.textContent, "3 selected");
      assert.equal(document.querySelector('[role="group"] button')!.textContent, "Clear selection");
      await env.render(<Toolbar motion={preference} locale="en" selection={{ count: 5, onClear() {}, actions: "Archive", label: "Review these documents", clearLabel: "Dismiss" }} />);
      assert.equal(document.querySelector('[role="status"]')!.textContent, "Review these documents");
      assert.equal(document.querySelector('[role="group"] button')!.textContent, "Dismiss");
    }
  } finally { await env.close(); }
});
