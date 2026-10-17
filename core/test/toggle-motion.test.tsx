import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { Toggle } from "../src/components/ui/forms/selection-control";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

async function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  let reduced = false;
  const mediaListeners = new Set<() => void>();
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({
    get matches() { return reduced; },
    addEventListener: (_type: string, listener: () => void) => mediaListeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => mediaListeners.delete(listener),
  }) });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, getComputedStyle: dom.window.getComputedStyle.bind(dom.window), requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window), cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window) });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  const button = () => document.querySelector<HTMLButtonElement>('[role="switch"]')!;
  return {
    dom, button,
    reduce: (value: boolean) => act(async () => { reduced = value; mediaListeners.forEach(listener => listener()); }),
    render: (node: ReactNode) => act(async () => root.render(node)),
    pointer: (type: string, clientX: number, pointerId = 1) => act(async () => {
      const event = new dom.window.MouseEvent(type, { clientX, button: 0, bubbles: true, cancelable: true });
      Object.defineProperties(event, { pointerId: { value: pointerId }, isPrimary: { value: true } });
      button().dispatchEvent(event);
    }),
    click: (detail = 1) => act(async () => button().dispatchEvent(new dom.window.MouseEvent("click", { detail, bubbles: true, cancelable: true }))),
    close: async () => { await act(async () => root.unmount()); dom.window.close(); },
  };
}

function setGeometry(button: HTMLButtonElement, width: number, scale = 1) {
  Object.defineProperty(button, "offsetWidth", { configurable: true, value: width });
  button.getBoundingClientRect = () => ({ width: width * scale, height: 20 * scale, left: 0, top: 0, right: width * scale, bottom: 20 * scale, x: 0, y: 0, toJSON() {} });
}

test("Toggle preserves the Forge sizes, colors and no extra icon; dragging is opt-in", () => {
  const markup = renderToString(<Toggle checked color="blue" motion="none" />);
  assert.match(markup, /w-9/);
  assert.match(markup, /w-3 h-3/);
  assert.match(markup, /translate:16px/);
  assert.match(markup, /aria-checked="true"/);
  assert.doesNotMatch(markup, /data-draggable|<svg/);
  assert.match(renderToString(<Toggle checked size="sm" />), /translate:12px/);
});

test("default click remains available and uncontrolled state reports each change once", async () => {
  const env = await setup(); const values: boolean[] = [];
  try {
    await env.render(<Toggle defaultChecked onChange={value => values.push(value)} />);
    await env.click();
    assert.equal(env.button().getAttribute("aria-checked"), "false");
    await env.click(0);
    assert.equal(env.button().getAttribute("aria-checked"), "true");
    assert.deepEqual(values, [false, true]);
  } finally { await env.close(); }
});

test("drag midpoint follows actual size and scale, and the following click does not toggle twice", async () => {
  const env = await setup(); const values: boolean[] = [];
  try {
    await env.render(<Toggle draggable size="sm" motion="none" onChange={value => values.push(value)} />);
    setGeometry(env.button(), 32, 2);
    await env.pointer("pointerdown", 0);
    await env.pointer("pointermove", 10);
    await env.pointer("pointerup", 10);
    await env.click();
    assert.equal(env.button().getAttribute("aria-checked"), "false");
    assert.deepEqual(values, []);
    await env.pointer("pointerdown", 0);
    await env.pointer("pointermove", 14);
    await env.pointer("pointerup", 14);
    await env.click();
    assert.equal(env.button().getAttribute("aria-checked"), "true");
    assert.deepEqual(values, [true]);
    assert.equal(env.button().querySelector<HTMLElement>('.forge-toggle-thumb')!.style.transition, "none");
    await env.click(0);
    assert.equal(env.button().getAttribute("aria-checked"), "false", "keyboard activation still works after a drag");
  } finally { await env.close(); }
});

test("pointer cancellation, Escape, lost capture and disabling never commit a drag", async () => {
  const env = await setup(); const values: boolean[] = [];
  const render = (disabled = false) => env.render(<Toggle draggable disabled={disabled} onChange={value => values.push(value)} />);
  try {
    for (const reason of ["pointercancel", "lostpointercapture", "Escape", "disabled"]) {
      await render(); setGeometry(env.button(), 36);
      await env.pointer("pointerdown", 0);
      await env.pointer("pointermove", 16);
      if (reason === "disabled") await render(true);
      else if (reason === "Escape") await act(async () => env.button().dispatchEvent(new env.dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
      else await env.pointer(reason, 16);
      await env.pointer("pointerup", 16);
      await env.click();
      assert.equal(env.button().getAttribute("aria-checked"), "false");
      assert.equal(env.button().getAttribute("data-dragging"), null);
    }
    assert.deepEqual(values, []);
  } finally { await env.close(); }
});

test("a controlled drag waits for the supplied value and ignores foreign pointer movement", async () => {
  const env = await setup(); const values: boolean[] = [];
  const render = (checked: boolean) => env.render(<Toggle checked={checked} draggable onChange={value => values.push(value)} />);
  try {
    await render(false); setGeometry(env.button(), 36);
    await env.pointer("pointerdown", 0);
    await env.pointer("pointermove", 16, 2);
    assert.equal(env.button().getAttribute("data-dragging"), null);
    await env.pointer("pointermove", 16);
    await env.pointer("pointerup", 16);
    await env.click();
    assert.deepEqual(values, [true]);
    assert.equal(env.button().getAttribute("aria-checked"), "false");
    await render(true);
    assert.equal(env.button().getAttribute("aria-checked"), "true");
    await env.pointer("pointerdown", 16);
    await env.pointer("pointermove", 0);
    await render(false);
    await env.pointer("pointerup", 0);
    await env.click();
    assert.deepEqual(values, [true], "consumer updates cancel an in-flight gesture");
  } finally { await env.close(); }
});


test("runtime reduced-motion changes stop current animation and restore motion without remounting", async () => {
  const env = await setup();
  let animations = 0;
  let cancellations = 0;
  try {
    await env.render(<Toggle draggable />);
    const button = env.button();
    const thumb = button.querySelector<HTMLElement>(".forge-toggle-thumb")!;
    thumb.animate = () => { animations++; return { cancel: () => { cancellations++; } } as Animation; };
    assert.equal(button.getAttribute("data-motion"), "auto");
    await env.click();
    assert.equal(animations, 1);
    await env.reduce(true);
    assert.equal(env.button(), button, "the focused switch is retained");
    assert.equal(button.getAttribute("data-motion"), "none");
    assert.equal(thumb.style.transition, "none");
    assert.equal(cancellations, 1, "the stretch already running is canceled");
    await env.click();
    assert.equal(button.getAttribute("aria-checked"), "false");
    assert.equal(animations, 1, "state changes while reduced never start another animation");
    await env.reduce(false);
    assert.equal(button.getAttribute("data-motion"), "auto");
    assert.match(thumb.style.transition, /translate .5s/);
    setGeometry(button, 36);
    await env.pointer("pointerdown", 0);
    await env.pointer("pointermove", 16);
    assert.equal(thumb.style.scale, "1.15 1");
    await env.reduce(true);
    assert.equal(thumb.style.scale, "1 1");
    assert.equal(thumb.style.transition, "none");
    await env.pointer("pointerup", 16);
    await env.click();
    assert.equal(button.getAttribute("aria-checked"), "true", "reduced motion does not cancel the requested change");
    await env.render(<Toggle draggable motion="none" />);
    await env.reduce(false);
    assert.equal(button.getAttribute("data-motion"), "none", "an explicit preference wins over the system");
  } finally { await env.close(); }
});
