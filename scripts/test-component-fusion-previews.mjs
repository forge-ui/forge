import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { after, afterEach, beforeEach, test } from "node:test";

// Exercise the actual TSX component without starting a browser or writing a bundle.
const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(new URL("../package.json", import.meta.url));
const { build } = require("./node_modules/.pnpm/node_modules/esbuild/lib/main.js");
const { JSDOM } = require("./core/node_modules/jsdom");
const React = require("react");
const { act } = React;
const compiled = await build({
  absWorkingDir: repoRoot,
  entryPoints: ["src/app/prototype/component-fusion/_lab-preview.tsx"],
  bundle: true,
  packages: "external",
  platform: "node",
  format: "cjs",
  jsx: "automatic",
  write: false,
  logLevel: "silent",
});
const componentModule = { exports: {} };
new Function("require", "module", "exports", compiled.outputFiles[0].text)(require, componentModule, componentModule.exports);
const { LabPreview } = componentModule.exports;

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost:3001/" });
const replacedGlobals = new Map();
function provideGlobal(name, value) {
  replacedGlobals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
}
for (const name of ["window", "document", "HTMLElement", "HTMLIFrameElement", "MessageEvent", "navigator"]) {
  provideGlobal(name, dom.window[name]);
}
provideGlobal("IS_REACT_ACT_ENVIRONMENT", true);

const observers = [];
class TestIntersectionObserver {
  targets = new Set();
  disconnected = false;
  constructor(callback) { this.callback = callback; observers.push(this); }
  observe(target) { this.targets.add(target); }
  unobserve(target) { this.targets.delete(target); }
  disconnect() { this.disconnected = true; this.targets.clear(); }
  emit(isIntersecting) {
    this.callback([...this.targets].map(target => ({ target, isIntersecting })), this);
  }
}
provideGlobal("IntersectionObserver", TestIntersectionObserver);
const { createRoot } = require("react-dom/client");
let container;
let outside;
let root;

beforeEach(() => {
  observers.length = 0;
  container = document.createElement("div");
  outside = document.createElement("button");
  outside.textContent = "Outside preview";
  document.body.append(container, outside);
  root = createRoot(container);
});

afterEach(async () => {
  if (root) await act(() => root.unmount());
  document.body.replaceChildren();
});

after(() => {
  dom.window.close();
  for (const [name, descriptor] of replacedGlobals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else delete globalThis[name];
  }
});

async function render(props) {
  await act(() => root.render(React.createElement(LabPreview, props)));
}

async function intersect(visible) {
  const observer = observers.at(-1);
  assert.ok(observer && !observer.disconnected);
  await act(() => observer.emit(visible));
}

function frame() { return container.querySelector("iframe"); }

async function ready(source, id = "086") {
  await act(() => window.dispatchEvent(new window.MessageEvent("message", {
    source,
    data: { type: "forge-ready", id },
  })));
}

async function tick(context, milliseconds) {
  await act(() => context.mock.timers.tick(milliseconds));
}

test("initial iframe URL carries all settings before a prototype script starts", async () => {
  await render({ id: "086", locale: "en", color: "purple", motion: "none" });
  assert.equal(frame(), null, "distant prototypes should not load eagerly");
  await intersect(true);
  const current = frame();
  const query = new URL(current.src).searchParams;
  assert.equal(query.get("lang"), "en");
  assert.equal(query.get("accent"), "purple");
  assert.equal(query.get("motion"), "none");
  assert.equal(query.get("theme"), "light");
  assert.equal(current.getAttribute("sandbox"), "allow-scripts");
  assert.equal(current.style.opacity, "0");

  await ready(window);
  assert.equal(current.style.opacity, "0", "another window cannot mark the iframe ready");
  await ready(current.contentWindow, "097");
  assert.equal(current.style.opacity, "0", "a different prototype ID cannot mark the iframe ready");
  await ready(current.contentWindow);
  assert.equal(current.style.opacity, "1");
});

for (const [setting, value, queryName] of [["locale", "en", "lang"], ["color", "purple", "accent"], ["motion", "none", "motion"]]) {
  test(`changing ${setting} recreates the isolated document and ignores stale readiness`, async () => {
    const props = { id: "086", locale: "zh", color: "blue", motion: "auto" };
    await render(props);
    await intersect(true);
    const previous = frame();
    const previousWindow = previous.contentWindow;
    await ready(previousWindow);
    assert.equal(previous.style.opacity, "1");

    await render({ ...props, [setting]: value });
    await intersect(true);
    const current = frame();
    assert.notEqual(current, previous, "changing settings must discard generated text and cached canvas colors");
    assert.equal(previous.isConnected, false);
    assert.equal(new URL(current.src).searchParams.get(queryName), value);
    assert.equal(current.style.opacity, "0", "new document must wait for its own ready event");
    await ready(previousWindow);
    assert.equal(current.style.opacity, "0");
    await ready(current.contentWindow);
    assert.equal(current.style.opacity, "1");
  });
}

test("a focused offscreen frame survives the grace period, then unloads after focus leaves", async context => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  await render({ id: "086" });
  await intersect(true);
  const current = frame();
  current.focus();
  assert.equal(document.activeElement, current);
  await intersect(false);
  await tick(context, 10_000);
  assert.equal(frame(), current, "scrolling away must not destroy the active interaction");
  await tick(context, 1000);
  assert.equal(frame(), current, "the interaction stays alive while focus remains inside");

  outside.focus();
  await tick(context, 999);
  assert.equal(frame(), current);
  await tick(context, 1);
  assert.equal(frame(), null, "focus moving away must eventually release an offscreen prototype without another intersection event");
});

test("returning near the viewport cancels both the grace timer and focused-frame retry", async context => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  await render({ id: "086" });
  await intersect(true);
  const current = frame();
  await intersect(false);
  await tick(context, 9000);
  await intersect(true);
  await tick(context, 2000);
  assert.equal(frame(), current);

  current.focus();
  await intersect(false);
  await tick(context, 10_000);
  await intersect(true);
  outside.focus();
  await tick(context, 2000);
  assert.equal(frame(), current, "an old offscreen retry must not unload a visible frame");
});

test("unmount disconnects the observer and cancels a pending focused-frame retry", async context => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const pending = new Map();
  const schedule = globalThis.setTimeout;
  const cancel = globalThis.clearTimeout;
  context.mock.method(globalThis, "setTimeout", (callback, delay, ...args) => {
    const handle = schedule(() => { pending.delete(handle); callback(...args); }, delay);
    pending.set(handle, delay);
    return handle;
  });
  context.mock.method(globalThis, "clearTimeout", handle => {
    pending.delete(handle);
    return cancel(handle);
  });
  await render({ id: "086" });
  await intersect(true);
  frame().focus();
  await intersect(false);
  await tick(context, 10_000);
  assert.ok([...pending.values()].some(delay => delay >= 1000), "focus should leave a scheduled later cleanup");
  const observer = observers.at(-1);
  await act(() => root.unmount());
  root = null;
  assert.equal(observer.disconnected, true);
  assert.equal(observer.targets.size, 0);
  assert.equal([...pending.values()].filter(delay => delay >= 1000).length, 0, "unmounted previews must not leave cleanup retries running");
  await tick(context, 20_000);
  assert.equal(container.childElementCount, 0);
});
