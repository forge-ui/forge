import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { MotionMenu, MotionPresence } from "../src/internal/motion";
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

test("Select Escape restores focus and a closed listbox cannot select", async () => {
  const env = setup(); let selected = 0;
  try {
    await act(async () => env.root.render(<SelectOption options={[{ value: "a", label: "Alpha" }]} onChange={() => selected++} />));
    const trigger = document.querySelector<HTMLElement>('[aria-haspopup="listbox"]')!;
    await act(async () => trigger.click());
    const option = document.querySelector<HTMLElement>('[role="option"]')!;
    await act(async () => { option.focus(); option.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    assert.ok(document.activeElement === trigger);
    await act(async () => option.click());
    assert.equal(selected, 0);
    await wait(200);
    // Base UI keeps the closed list mounted (hidden) for typeahead on the trigger.
    const remaining = document.querySelector('[role="option"]');
    assert.ok(!remaining || remaining.closest("[hidden]"));
  } finally { await env.cleanup(); }
});

test("Kebab trigger toggles the menu and publishes collapsed state", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<KebabMenu items={[{label: "Edit"}]} />));
    const trigger = document.querySelector<HTMLButtonElement>('button[aria-label="更多操作"]')!;
    await act(async () => trigger.click());
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    assert.ok(document.querySelector("[data-forge-kebab-menu]"));
    await act(async () => trigger.click());
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    await wait(150); assert.equal(document.querySelector("[data-forge-kebab-menu]"), null);
  } finally { await env.cleanup(); }
});
test("menu row highlight excludes embedded Button, CalendarCard and nested menus", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<MotionMenu motion="none">
      <button id="row">Menu row</button>
      <button className="forge-button" id="cancel">Cancel</button>
      <div className="forge-calendar"><button id="date">13</button></div>
      <MotionMenu><button id="nested">Nested row</button></MotionMenu>
    </MotionMenu>));
    const indicator = document.querySelector<HTMLElement>('.forge-menu-indicator')!;
    const focus = (id: string) => act(async () => document.getElementById(id)!.focus());
    await focus('row'); assert.equal(indicator.style.visibility, 'visible');
    await focus('cancel'); assert.equal(indicator.style.visibility, 'hidden');
    await focus('row'); await focus('date'); assert.equal(indicator.style.visibility, 'hidden');
    await focus('nested'); assert.equal(indicator.style.visibility, 'hidden');
    assert.equal(document.querySelectorAll<HTMLElement>('.forge-menu-indicator')[1].style.visibility, 'visible');
    await focus('row'); assert.equal(indicator.style.visibility, 'visible');
  } finally { await env.cleanup(); }
});
