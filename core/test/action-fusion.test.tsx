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
import { Tooltip } from "../src/components/ui/tooltip";
import { DialogSurface } from "../src/internal/dialog-surface";
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
    assert.equal(button.disabled, true); assert.equal(button.getAttribute("aria-busy"), "true");
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
  assert.doesNotMatch(indefinite, /aria-valuenow/); assert.doesNotMatch(indefinite, /0%/); assert.match(indefinite, /aria-label="Progress"/);
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
    assert.equal(document.querySelector('[role="status"]')!.textContent, "Saved");
    await act(async () => Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(button => button.textContent === "Undo")!.click());
    assert.equal(restored, true); assert.equal(document.querySelector('[role="status"]'), null);
  } finally { await env.close(); }
});

test("tooltip measures the viewport edge and opens immediately for keyboard focus", async () => {
  const env = await setup();
  try {
    await env.render(<Tooltip content="Details" motion="none" delay={500}><button>Target</button></Tooltip>);
    await act(async () => document.querySelector<HTMLButtonElement>("button")!.focus());
    const tip = document.querySelector<HTMLElement>('[role="tooltip"]')!;
    assert.ok(tip); assert.equal(tip.style.left, "8px"); assert.equal(tip.style.top, "8px");
    await act(async () => document.querySelector("button")!.dispatchEvent(new env.dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    assert.equal(document.querySelector('[role="tooltip"]'), null);
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
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 120)); });
    assert.equal(document.querySelector('[role="status"]'), null);
  } finally { await env.close(); }
});

test("a controlled tooltip joins its dialog top layer after showModal and retains viewport coordinates", async () => {
  const env = await setup();
  const shown = new Set<HTMLElement>();
  let popoverShows = 0;
  let anchorX = 300;
  const frames = new Map<number, FrameRequestCallback>();
  let nextFrame = 0;
  let hydrated: { render: (node: ReactNode) => void; unmount: () => void } | undefined;
  try {
    const prototype = env.dom.window.HTMLElement.prototype;
    const matches = prototype.matches;
    prototype.matches = function (selector) { return selector === ":popover-open" ? shown.has(this) : matches.call(this, selector); };
    prototype.showPopover = function () { assert.equal(this.closest("dialog")?.open, true); shown.add(this); popoverShows++; };
    prototype.hidePopover = function () { shown.delete(this); };
    prototype.getAnimations = () => [];
    env.dom.window.requestAnimationFrame = callback => { frames.set(++nextFrame, callback); return nextFrame; };
    env.dom.window.cancelAnimationFrame = id => { frames.delete(id); };
    env.dom.window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    env.dom.window.HTMLDialogElement.prototype.close = function () { this.open = false; };
    const rect = (x: number, y: number, width: number, height: number) => ({ x, y, left: x, top: y, right: x + width, bottom: y + height, width, height, toJSON() {} });
    prototype.getBoundingClientRect = function () {
      if (this.getAttribute("role") === "tooltip") return rect(0, 0, 80, 32);
      if (this.tagName === "DIALOG") return rect(200, 100, 480, 400);
      return rect(anchorX, 220, 100, 30);
    };
    const example = (open: boolean) => <DialogSurface open={open} onOpenChange={() => {}} label="Settings" motion="none" className="transformed-dialog"><Tooltip open content="Details" motion="none"><button>Target</button></Tooltip></DialogSurface>;
    // Ref-based portal ownership leaves server and initial hydration markup equal.
    assert.doesNotMatch(renderToString(example(true)), /role="tooltip"/);
    const container = document.createElement("div");
    container.innerHTML = renderToString(example(true));
    document.body.append(container);
    const hydrationErrors: unknown[] = [];
    const { hydrateRoot } = await import("react-dom/client");
    await act(async () => { hydrated = hydrateRoot(container, example(true), { onRecoverableError: error => hydrationErrors.push(error) }); });
    assert.deepEqual(hydrationErrors, []);
    const dialog = document.querySelector("dialog")!;
    const tip = document.querySelector<HTMLElement>('[role="tooltip"]')!;
    assert.equal(tip.parentElement, dialog);
    assert.equal(tip.getAttribute("popover"), "manual");
    assert.equal(shown.has(tip), true);
    assert.equal(tip.style.left, "310px");
    assert.equal(tip.style.top, "180px");
    assert.equal(document.querySelector("button")!.getAttribute("aria-describedby"), tip.id);
    await act(async () => hydrated!.render(example(false)));
    assert.equal(shown.has(tip), false);
    assert.equal(frames.size, 0);
    await act(async () => hydrated!.render(example(true)));
    assert.equal(shown.has(tip), true);
    assert.equal(popoverShows, 2);
    assert.equal(frames.size, 1);
    anchorX = 400;
    for (const [id, callback] of frames) { frames.delete(id); callback(0); }
    assert.equal(tip.style.left, "410px", "reopening restarts tracking the animated dialog anchor");
  } finally { if (hydrated) await act(async () => hydrated!.unmount()); await env.close(); }
});
