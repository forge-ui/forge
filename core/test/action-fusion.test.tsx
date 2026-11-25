import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { Button } from "../src/components/ui/button";
import { IconButton } from "../src/components/ui/icon-button";
import { ProgressBar } from "../src/components/ui/progress-bar";
import { Stepper } from "../src/components/ui/stepper";
import { ListItem } from "../src/components/ui/list-item";
import { ToastProvider, useToast, type ToastApi } from "../src/components/ui/toast";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);
async function setup(initialReduced = true) {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  let reduced = initialReduced;
  const listeners = new Set<() => void>();
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({ matches: reduced, addEventListener: (_: string, listener: () => void) => listeners.add(listener), removeEventListener: (_: string, listener: () => void) => listeners.delete(listener) }) });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, SVGElement: dom.window.SVGElement, getComputedStyle: dom.window.getComputedStyle.bind(dom.window), requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window), cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window) });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return { dom, setReduced: (value: boolean) => { reduced = value; listeners.forEach(listener => listener()); }, render: (node: ReactNode) => act(async () => root.render(node)), close: async () => { await act(async () => root.unmount()); dom.window.close(); } };
}

test("action state is controlled, blocks duplicate activation and keeps backgrounds out of glass buttons", async () => {
  const env = await setup(); let calls = 0;
  try {
    await env.render(<Button effect="glass" locale="en" loading onClick={() => calls++}>Save</Button>);
    const button = document.querySelector<HTMLButtonElement>("button")!;
    // Loading keeps the button focusable (aria-disabled) instead of dropping focus.
    assert.equal(button.getAttribute("aria-disabled"), "true"); assert.equal(button.getAttribute("aria-busy"), "true");
    await act(async () => button.click()); assert.equal(calls, 0);
    assert.match(button.textContent!, /Processing/); assert.equal(button.querySelector(".fusion-glass-decoration"), null);
    await env.render(<Button effect="glass" result="success" resultLabel="Saved" onClick={() => calls++}>Save</Button>);
    assert.equal(document.querySelector("button")!.textContent, "Saved");
    await act(async () => document.querySelector<HTMLButtonElement>("button")!.click()); assert.equal(calls, 1);
  } finally { await env.close(); }
});

test("icon action retains accessible pressed and pending state", () => {
  const markup = renderToString(<IconButton aria-label="Bookmark" effect="bookmark" active loading>Icon</IconButton>);
  assert.match(markup, /aria-pressed="true"/); assert.match(markup, /aria-busy="true"/); assert.match(markup, /disabled=""/);
});

test("indeterminate progress omits a misleading value and ring values clamp", () => {
  const indefinite = renderToString(<ProgressBar indeterminate showPercentage locale="en" />);
  assert.doesNotMatch(indefinite, /aria-valuenow/); assert.doesNotMatch(indefinite, />\s*0%\s*</); assert.match(indefinite, /aria-label="Progress"/);
  const ring = renderToString(<ProgressBar variant="ring" value={140} showPercentage />);
  assert.match(ring, /aria-valuenow="100"/); assert.match(ring, /100%/);
  assert.match(renderToString(<ProgressBar value={Number.NaN} />), /aria-valuenow="0"/);
});

test("labeled stepper uses one current step and preserves the legacy dot variant", async () => {
  assert.equal((renderToString(<Stepper total={4} current={2} />).match(/h-2 rounded-full/g) ?? []).length, 4);
  const env = await setup(); let selected = 0;
  try {
    await env.render(<Stepper items={[{ id: "a", label: "First" }, { id: "b", label: "Second" }]} current={2} onStepChange={value => { selected = value; }} />);
    assert.equal(document.querySelectorAll('[aria-current="step"]').length, 1);
    await act(async () => document.querySelector<HTMLButtonElement>("button")!.click()); assert.equal(selected, 1);
  } finally { await env.close(); }
});

test("swipe deletion requires a horizontal threshold; cancel and vertical scrolling never delete", async () => {
  const env = await setup(); let removed = 0;
  try {
    await env.render(<ListItem title="Report" onSwipeAction={() => removed++} swipeActionLabel="Delete report" />);
    const row = document.querySelector(".forge-swipe-content")!;
    const fire = (type: string, x: number, y = 0) => act(async () => { const event = new env.dom.window.MouseEvent(type, { bubbles: true, clientX: x, clientY: y }); Object.defineProperty(event, "pointerId", { value: 1 }); row.dispatchEvent(event); });
    await fire("pointerdown", 180); await fire("pointermove", 140); await fire("pointerup", 140); assert.equal(removed, 0);
    await fire("pointerdown", 180); await fire("pointermove", 40); await fire("pointercancel", 40); await fire("pointerup", 40); assert.equal(removed, 0);
    await fire("pointerdown", 180); await fire("pointermove", 170, 60); await fire("pointerup", 0, 60); assert.equal(removed, 0);
    await fire("pointerdown", 180); await fire("pointermove", 40); await fire("pointerup", 40); assert.equal(removed, 1);
    await act(async () => document.querySelector<HTMLButtonElement>('button[aria-label="Delete report"]')!.click()); assert.equal(removed, 2);
  } finally { await env.close(); }
});

test("toast updates preserve identity and action restores the consumer state", async () => {
  const env = await setup(); let api: ToastApi | undefined; let restored = false;
  function Probe() { api = useToast(); return null; }
  try {
    await env.render(<ToastProvider locale="en" motion="none" stacked><Probe /></ToastProvider>);
    let id = "";
    await act(async () => { id = api!.toast({ title: "Saving", status: "loading", duration: 0 }); });
    await act(async () => api!.update(id, { title: "Saved", status: "success", duration: 0, action: { label: "Undo", onClick: () => { restored = true; } } }));
    assert.equal(document.querySelectorAll("[data-toast-id]").length, 1);
    assert.equal(document.querySelector("[data-toast-id]")!.getAttribute("data-toast-id"), id);
    assert.equal(document.querySelector("[data-toast-id] h2, [data-toast-id] [id]")?.textContent, "Saved");
    await act(async () => Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(button => button.textContent === "Undo")!.click());
    assert.equal(restored, true);
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); });
    assert.ok(!document.querySelector("[data-toast-id]"));
  } finally { await env.close(); }
});

test("useToast stays the same object while toasts come and go", async () => {
  const env = await setup(); const seen = new Set<ToastApi>(); let api: ToastApi | undefined;
  function Probe() { api = useToast(); seen.add(api); return null; }
  try {
    await env.render(<ToastProvider motion="none"><Probe /></ToastProvider>);
    let id = "";
    await act(async () => { id = api!.toast({ title: "Saved", duration: 0 }); });
    await act(async () => api!.dismiss(id));
    assert.equal(seen.size, 1);
  } finally { await env.close(); }
});

test("plain loading actions respond to system reduced motion without requiring an effect", async () => {
  const env = await setup(false);
  try {
    await env.render(<><Button loading>Save</Button><IconButton loading aria-label="Save">Icon</IconButton></>);
    assert.equal(document.querySelectorAll(".forge-action-spinner").length, 2);
    await act(async () => env.setReduced(true));
    assert.equal(document.querySelectorAll(".forge-action-spinner").length, 0);
    assert.equal(document.querySelectorAll('[aria-busy="true"]').length, 2);
    await act(async () => env.setReduced(false));
    assert.equal(document.querySelectorAll(".forge-action-spinner").length, 2);
    await env.render(<><Button loading motion="none">Save</Button><IconButton loading motion="none" aria-label="Save">Icon</IconButton></>);
    assert.equal(document.querySelectorAll(".forge-action-spinner").length, 0);
  } finally { await env.close(); }
});

test("reduced motion stops the toast expiry animation without disabling automatic dismissal", async () => {
  const env = await setup(false); let api: ToastApi | undefined;
  function Probe() { api = useToast(); return null; }
  try {
    await env.render(<ToastProvider><Probe /></ToastProvider>);
    await act(async () => { api!.toast({ title: "Saved", duration: 80 }); });
    assert.equal(document.querySelector<HTMLElement>(".forge-toast-timer>span")!.style.animationName, "");
    await act(async () => env.setReduced(true));
    assert.equal(document.querySelector<HTMLElement>(".forge-toast-timer>span")!.style.animationName, "none");
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 200)); });
    assert.ok(!document.querySelector("[data-toast-id]"));
  } finally { await env.close(); }
});

