import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { PromptBar } from "../src/components/ui/agent/prompt-bar";
import { AskAi } from "../src/components/ui/ask-ai";
import { modelMenuPosition } from "../src/internal/prompt-model-menu";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

const models = [{ id: "a", label: "Alpha" }, { id: "b", label: "Beta" }, { id: "c", label: "Long model name" }];
function setup() {
  const dom = new JSDOM('<div id="root"></div><button id="outside">Outside</button>', { url: "http://localhost" });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Event: dom.window.Event, MouseEvent: dom.window.MouseEvent, KeyboardEvent: dom.window.KeyboardEvent });
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
  // jsdom has no layout/top layer: browser cases separately verify those properties.
  dom.window.HTMLElement.prototype.showPopover = function() { this.dataset.shown = "true"; };
  dom.window.HTMLElement.prototype.hidePopover = function() { delete this.dataset.shown; };
  const root = createRoot(document.getElementById("root")!);
  return { root, cleanup: async () => { await act(async () => root.unmount()); dom.window.close(); } };
}
const key = (element: Element, key: string, shiftKey = false) => act(async () => { element.dispatchEvent(new KeyboardEvent("keydown", { key, shiftKey, bubbles: true, cancelable: true })); });
const click = (element: HTMLElement) => act(async () => element.click());

test("model menu is scoped, selected, navigable and invokes controlled callback once", async () => {
  const env = setup(); const calls: string[] = [];
  function Example() { const [model, setModel] = useState("b"); return <div data-theme="dark" data-accent="blue"><PromptBar models={models} model={model} onModelChange={id => { calls.push(id); setModel(id); }} /></div>; }
  try {
    await act(async () => env.root.render(<Example />));
    const trigger = document.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!;
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    await key(trigger, "ArrowDown");
    const menu = document.querySelector<HTMLElement>('[role="menu"]')!;
    assert.equal(trigger.getAttribute("aria-controls"), menu.id);
    assert.equal(menu.getAttribute("popover"), "manual");
    assert.ok(menu.closest('[data-theme="dark"]'));
    assert.equal(document.activeElement?.textContent, "Beta");
    assert.equal(menu.querySelector('[aria-checked="true"]')?.textContent, "Beta");
    await key(menu, "ArrowDown"); assert.equal(document.activeElement?.textContent, "Long model name");
    await key(menu, "ArrowDown"); assert.equal(document.activeElement?.textContent, "Alpha");
    await key(menu, "End"); assert.equal(document.activeElement?.textContent, "Long model name");
    await key(menu, "Home");
    // Native button Enter/Space activation is tested in Chrome; jsdom uses click.
    await click(document.activeElement as HTMLElement);
    assert.deepEqual(calls, ["a"]);
    assert.equal(document.querySelector('[role="menu"]'), null);
    assert.equal(document.activeElement, trigger);
    assert.equal(trigger.getAttribute("aria-label"), "Model: Alpha");
  } finally { await env.cleanup(); }
});

test("Escape stays inside menu, outside focus dismisses, Tab restores origin, input panels stay separate", async () => {
  const env = setup(); let escaped = 0;
  try {
    await act(async () => env.root.render(<div onKeyDown={e => { if (e.key === "Escape") escaped++; }}><PromptBar models={models} sources={[{ id: "s", label: "Docs" }]} commands={[{ id: "c", label: "Summarize" }]} /></div>));
    const trigger = document.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!;
    await key(trigger, "ArrowUp"); assert.equal(document.activeElement?.textContent, "Long model name");
    await key(document.activeElement!, "Escape");
    assert.equal(escaped, 0); assert.equal(document.activeElement, trigger);
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    await click(trigger);
    await act(async () => { document.getElementById("outside")!.focus(); });
    assert.equal(document.querySelector('[role="menu"]'), null);
    assert.equal(document.activeElement?.id, "outside");
    await click(trigger); await key(document.activeElement!, "Tab");
    assert.equal(document.querySelector('[role="menu"]'), null);
    assert.equal(document.activeElement, trigger);
    await click(trigger);
    await act(async () => { document.getElementById("outside")!.dispatchEvent(new Event("pointerdown", { bubbles: true })); });
    assert.equal(document.querySelector('[role="menu"]'), null);
    await click(document.querySelector<HTMLButtonElement>('[aria-label="@ sources"]')!);
    assert.ok(document.querySelector('.absolute.inset-x-3.bottom-full'));
    assert.equal(document.querySelector('[role="menu"]'), null);
    await click(document.querySelector<HTMLButtonElement>('[aria-label="/ commands"]')!);
    assert.ok(document.querySelector('.absolute.inset-x-3.bottom-full')?.textContent?.includes("Summarize"));
  } finally { await env.cleanup(); }
});

test("fallback model, disabled and empty model list", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<PromptBar models={models} model="missing" />));
    const trigger = document.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!;
    assert.equal(trigger.getAttribute("aria-label"), "Model: Alpha");
    await click(trigger); assert.equal(document.querySelector('[aria-checked="true"]')?.textContent, "Alpha");
    await act(async () => env.root.render(<PromptBar models={models} disabled />));
    assert.equal(trigger.disabled, true); assert.equal(document.querySelector('[role="menu"]'), null);
    await act(async () => env.root.render(<PromptBar models={[]} />));
    assert.equal(document.querySelector('[aria-haspopup="menu"]'), null);
  } finally { await env.cleanup(); }
});

test("position prefers above/right, flips below, clamps viewport and constrains scrolling", () => {
  const viewport = { left: 0, top: 0, width: 1000, height: 800 };
  assert.deepEqual(modelMenuPosition({ top: 600, bottom: 630, right: 900 }, 288, 200, viewport), { left: 612, top: 394, maxHeight: 320 });
  assert.deepEqual(modelMenuPosition({ top: 20, bottom: 50, right: 200 }, 288, 200, viewport), { left: 8, top: 56, maxHeight: 320 });
  const narrow = modelMenuPosition({ top: 350, bottom: 380, right: 350 }, 288, 900, { left: 0, top: 0, width: 320, height: 600 });
  assert.equal(narrow.left, 24); assert.equal(narrow.maxHeight, 320); assert.equal(narrow.top, 24);
  const zoom = modelMenuPosition({ top: 300, bottom: 330, right: 400 }, 184, 200, { left: 100, top: 100, width: 200, height: 300 });
  assert.equal(zoom.left, 108); assert.equal(zoom.maxHeight, 186);
});


test("real AskAi fullscreen lets menu consume first Escape before exiting host", async () => {
  const env = setup(); let exited = 0;
  try {
    await act(async () => env.root.render(<AskAi fullscreen onFullscreenChange={() => exited++} onSend={() => ""} composer={<PromptBar models={models} />} />));
    const trigger = document.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!;
    await click(trigger);
    await key(document.activeElement!, "Escape");
    assert.equal(exited, 0);
    assert.equal(document.querySelector('[role="menu"]'), null);
    assert.equal(document.activeElement, trigger);
    await key(trigger, "Escape");
    assert.equal(exited, 1);
  } finally { await env.cleanup(); }
});
