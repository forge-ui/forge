// Loaded before every test bundle (see tsup.test.config.ts).
// Base UI decides between useLayoutEffect and a no-op when its modules load, so a
// document must exist up front. Tests still swap in their own JSDOM per case; DOM
// constructors resolve lazily from whichever window is current.
// eslint-disable-next-line @typescript-eslint/no-require-imports -- CommonJS preload, runs before the ESM test bundle
const { JSDOM } = require("jsdom");

if (typeof document === "undefined") {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost" });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
}
// Base UI reads the user agent once to detect jsdom (e.g. `:focus-visible` is unreliable there).
Object.defineProperty(globalThis, "navigator", { configurable: true, writable: true, value: globalThis.window.navigator });

const lazyGlobals = [
  "Element", "Node", "HTMLElement", "HTMLInputElement", "HTMLButtonElement", "SVGElement", "ShadowRoot",
  "NodeFilter", "DOMRect", "MutationObserver", "FocusEvent", "InputEvent", "PointerEvent",
  "MouseEvent", "KeyboardEvent", "HTMLTextAreaElement", "HTMLSelectElement", "HTMLAnchorElement", "HTMLDivElement", "getComputedStyle",
];
for (const name of lazyGlobals) {
  if (name in globalThis) continue;
  Object.defineProperty(globalThis, name, {
    configurable: true,
    get() {
      const current = globalThis.window;
      if (name === "PointerEvent") return current?.PointerEvent ?? current?.MouseEvent;
      if (name === "Element" && current?.Element && !current.Element.prototype.getAnimations) {
        current.Element.prototype.getAnimations = () => [];
      }
      const value = current?.[name];
      return typeof value === "function" && name === "getComputedStyle" ? value.bind(current) : value;
    },
    set(value) {
      Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
    },
  });
}

if (typeof globalThis.requestAnimationFrame !== "function") {
  globalThis.requestAnimationFrame = callback => setTimeout(() => callback(Date.now()), 0);
  globalThis.cancelAnimationFrame = id => clearTimeout(id);
}
if (typeof globalThis.ResizeObserver !== "function") {
  globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
}
