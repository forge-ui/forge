import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { Button } from "../src/components/ui/button";
import { Toolbar } from "../src/components/ui/toolbar";
import { StatCard } from "../src/components/ui/stat-card";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);
async function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, SVGElement: dom.window.SVGElement, getComputedStyle: dom.window.getComputedStyle.bind(dom.window), requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window), cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window) });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return { dom, render: (node: ReactNode) => act(async () => root.render(node)), close: async () => { await act(async () => root.unmount()); dom.window.close(); } };
}
const wait = () => act(async () => { await new Promise(resolve => setTimeout(resolve, 140)); });
test("existing components own localized selection and numeric presentation", () => {
  assert.match(renderToString(<StatCard title="访客" value={1234} animateValue motion="none" />), /1,234/);
  assert.doesNotMatch(renderToString(<Toolbar selection={{ count: 0, onClear: () => {}, actions: "Archive" }} />), /Archive/);
  assert.match(renderToString(<Toolbar locale="en" selection={{ count: 2, onClear: () => {}, actions: "Archive" }} />), /Clear selection/);
});
test("loading prevents hold confirmation and cancels an active hold", async () => {
  const env = await setup(); let confirmed = 0;
  const render = (loading: boolean) => env.render(<Button variant="hold" loading={loading} holdDuration={100} motion="none" onConfirm={() => { confirmed++; }} />);
  const press = () => act(async () => { document.querySelector('.forge-hold-trigger')!.dispatchEvent(new env.dom.window.KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })); });
  const wait = () => act(async () => { await new Promise(resolve => setTimeout(resolve, 130)); });
  try {
    await render(true);
    assert.equal(document.querySelector<HTMLButtonElement>('.forge-hold-trigger')!.disabled, true);
    assert.equal(document.querySelector('.forge-hold-trigger')!.getAttribute('aria-busy'), 'true');
    await press(); await wait(); assert.equal(confirmed, 0);
    await render(false); await press(); await render(true); await wait();
    assert.equal(confirmed, 0);
    await render(false); await press(); await wait(); assert.equal(confirmed, 1);
  } finally { await env.close(); }
});

test("hold requires uninterrupted key input, cancels on release and disabled, and fires once", async () => {
  const env = await setup(); let confirmed = 0;
  const props = { holdDuration: 100, onConfirm: () => { confirmed++; } };
  const event = (type: string, key: string, repeat = false) => act(async () => { document.querySelector('.forge-hold-trigger')!.dispatchEvent(new env.dom.window.KeyboardEvent(type, { key, repeat, bubbles: true, cancelable: true })); });
  try {
    await env.render(<Button variant="hold" {...props} />);
    await act(async () => document.querySelector<HTMLButtonElement>('.forge-hold-trigger')!.click());
    await wait(); assert.equal(confirmed, 0);
    await event('keydown', ' '); await event('keyup', ' '); await wait(); assert.equal(confirmed, 0);
    await event('keydown', 'Enter'); await wait(); assert.equal(confirmed, 1);
    await event('keydown', 'Enter', true); await wait(); assert.equal(confirmed, 1);
    await act(async () => document.querySelector<HTMLButtonElement>('.forge-hold-done button')!.click()); await event('keyup', 'Enter'); await event('keydown', ' ');
    await env.render(<Button variant="hold" {...props} disabled />); await wait(); assert.equal(confirmed, 1);
    await env.render(<Button variant="hold" {...props} />); await event('keydown', ' '); await event('keydown', 'Escape'); await wait(); assert.equal(confirmed, 1);
  } finally { await env.close(); }
});

test("hold pointer cancellation never confirms, and controlled completion waits for the consumer", async () => {
  const env = await setup();
  let confirms = 0;
  let undos = 0;
  const render = (confirmed: boolean) => env.render(<Button variant="hold" holdDuration={100} motion="none" confirmed={confirmed} onConfirm={() => { confirms++; }} onUndo={() => { undos++; }} />);
  const pointer = (type: string) => act(async () => {
    document.querySelector('.forge-hold-trigger')!.dispatchEvent(new env.dom.window.MouseEvent(type, { button: 0, bubbles: true, cancelable: true }));
  });
  try {
    await render(false);
    await pointer("pointerdown");
    await pointer("pointercancel");
    await wait();
    assert.equal(confirms, 0);
    await pointer("pointerdown");
    await wait();
    assert.equal(confirms, 1);
    assert.equal(document.querySelector('.forge-hold-row')?.hasAttribute('data-confirmed'), false);
    assert.equal(document.querySelector('[role="status"]'), null);
    await pointer("pointerup");
    await render(true);
    assert.equal(document.querySelector('[role="status"]')?.textContent, "已删除");
    await act(async () => document.querySelector<HTMLButtonElement>('.forge-hold-done button')!.click());
    assert.equal(undos, 1);
    await render(false);
    assert.equal(document.querySelector('.forge-hold-row')?.hasAttribute('data-confirmed'), false);
  } finally { await env.close(); }
});
