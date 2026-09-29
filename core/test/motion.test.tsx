import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { MotionPresence } from "../src/internal/motion";
import { Tooltip, TooltipAnchor, TooltipGroup } from "../src/components/ui/tooltip";
import { KebabMenu } from "../src/components/ui/kebab-menu";
import { SelectOption } from "../src/components/ui/forms/select-option";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost" });
  let reduced = false;
  const listeners = new Set<() => void>();
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({ matches: reduced, addEventListener: (_: string, cb: () => void) => listeners.add(cb), removeEventListener: (_: string, cb: () => void) => listeners.delete(cb) }) });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Event: dom.window.Event, MouseEvent: dom.window.MouseEvent, KeyboardEvent: dom.window.KeyboardEvent, getComputedStyle: dom.window.getComputedStyle.bind(dom.window) });
  const root = createRoot(document.getElementById("root")!);
  return { root, reduce: () => { reduced = true; listeners.forEach(fn => fn()); }, cleanup: async () => { await act(async () => root.unmount()); dom.window.close(); } };
}
const wait = (ms: number) => act(async () => { await new Promise(resolve => setTimeout(resolve, ms)); });

test("exit immediately disables content, unmounts after duration and cancels on reopen", async () => {
  const env = setup();
  const render = (open: boolean) => act(async () => env.root.render(<MotionPresence open={open} role="dialog"><button>Action</button></MotionPresence>));
  try {
    await render(true); await render(false);
    const closing = document.querySelector('[role="dialog"]')!;
    assert.equal(closing.getAttribute("aria-hidden"), "true");
    assert.equal(closing.hasAttribute("inert"), true);
    await wait(50); await render(true); await wait(150);
    assert.equal(document.querySelector('[role="dialog"]')?.getAttribute("data-state"), "open");
    await render(false); await wait(150);
    assert.equal(document.querySelector('[role="dialog"]'), null);
  } finally { await env.cleanup(); }
});

test("motion none and live reduced-motion changes remove exits immediately", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<MotionPresence open motion="none">none</MotionPresence>));
    await act(async () => env.root.render(<MotionPresence open={false} motion="none">none</MotionPresence>));
    assert.equal(document.querySelector('.forge-motion-surface'), null);
    await act(async () => env.root.render(<MotionPresence open>auto</MotionPresence>));
    await act(async () => env.root.render(<MotionPresence open={false}>auto</MotionPresence>));
    assert.ok(document.querySelector('.forge-motion-surface'));
    await act(async () => env.reduce());
    assert.equal(document.querySelector('.forge-motion-surface'), null);
  } finally { await env.cleanup(); }
});

test("Select Escape restores focus and retained options cannot select", async () => {
  const env = setup(); let selected = 0;
  try {
    await act(async () => env.root.render(<SelectOption options={[{ value: "a", label: "Alpha" }]} onChange={() => selected++} />));
    const trigger = document.querySelector<HTMLButtonElement>('[aria-haspopup="listbox"]')!;
    await act(async () => trigger.click());
    const option = document.querySelector<HTMLButtonElement>('[role="option"]')!;
    await act(async () => { option.focus(); option.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    assert.equal(document.activeElement, trigger);
    assert.ok(option.closest('[inert]'));
    await act(async () => option.click());
    assert.equal(selected, 0);
    await wait(150); assert.equal(document.querySelector('[role="option"]'), null);
  } finally { await env.cleanup(); }
});

test("tooltip delay cancels, group warms, focus is immediate and descriptions compose", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<TooltipGroup delay={40}><Tooltip content="First" motion="none"><TooltipAnchor aria-label="One" aria-describedby="existing" icon="1" /></Tooltip><Tooltip content="Second" motion="none"><button>Two</button></Tooltip></TooltipGroup>));
    const buttons = document.querySelectorAll("button");
    const enter = (i: number) => act(async () => buttons[i].dispatchEvent(new MouseEvent("mouseover", { bubbles: true, relatedTarget: document.body })));
    const leave = (i: number) => act(async () => buttons[i].dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: document.body })));
    await enter(0); assert.equal(document.querySelector('[role="tooltip"]'), null);
    await leave(0); await wait(60); assert.equal(document.querySelector('[role="tooltip"]'), null);
    await enter(0); await wait(60); assert.equal(document.querySelector('[role="tooltip"]')?.textContent, "First");
    assert.ok(buttons[0].getAttribute("aria-describedby")?.startsWith("existing "));
    await leave(0); await enter(1); assert.equal(document.querySelector('[role="tooltip"]')?.textContent, "Second");
    await leave(1); await act(async () => buttons[0].focus());
    assert.equal(document.querySelector('[role="tooltip"]')?.textContent, "First");
    await act(async () => buttons[0].dispatchEvent(new KeyboardEvent("keydown", {key:"Escape", bubbles:true})));
    assert.equal(document.querySelector('[role="tooltip"]'), null);
    assert.equal(buttons[0].getAttribute("aria-describedby"), "existing");
  } finally { await env.cleanup(); }
});


test("Kebab trigger close preserves visible exit and publishes collapsed state", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<KebabMenu items={[{label: "Edit"}]} />));
    const trigger = document.querySelector<HTMLButtonElement>('button[aria-label="更多操作"]')!;
    await act(async () => trigger.click());
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    await act(async () => trigger.click());
    const surface = document.querySelector<HTMLElement>('.forge-motion-surface')!;
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    assert.equal(surface.style.visibility, "visible");
    assert.ok(surface.hasAttribute("inert"));
    await wait(150); assert.equal(document.querySelector('.forge-motion-surface'), null);
  } finally { await env.cleanup(); }
});
