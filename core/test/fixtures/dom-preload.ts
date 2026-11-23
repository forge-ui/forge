import { JSDOM } from "jsdom";

// Base UI picks useLayoutEffect vs a no-op when its modules load, so a document
// must exist before they are imported. Tests still create a fresh JSDOM per case.
// Import a binding (not a bare import): the package marks non-CSS files side-effect free.
if (typeof document === "undefined") {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost" });
  Object.assign(globalThis, { window: dom.window, document: dom.window.document });
}

export const domPreloaded = true;
