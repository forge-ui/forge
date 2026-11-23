import { JSDOM } from "jsdom";
import { act } from "react";
import { createRoot } from "react-dom/client";

// Shared jsdom environment for behavior tests of Base UI-backed components.
export function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  const window = dom.window;
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window, self: window, document: window.document,
    HTMLElement: window.HTMLElement, HTMLInputElement: window.HTMLInputElement, Element: window.Element, Node: window.Node,
    Event: window.Event, MouseEvent: window.MouseEvent, KeyboardEvent: window.KeyboardEvent, FocusEvent: window.FocusEvent, InputEvent: window.InputEvent,
    PointerEvent: window.MouseEvent, NodeFilter: window.NodeFilter, HTMLButtonElement: window.HTMLButtonElement, SVGElement: window.SVGElement, ShadowRoot: window.ShadowRoot, MutationObserver: window.MutationObserver,
    getComputedStyle: window.getComputedStyle.bind(window),
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 0),
    cancelAnimationFrame: (id: number) => clearTimeout(id),
    ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
    DOMRect: window.DOMRect ?? class { constructor(public x = 0, public y = 0, public width = 0, public height = 0) {} get top() { return this.y; } get left() { return this.x; } get right() { return this.x + this.width; } get bottom() { return this.y + this.height; } static fromRect(rect: { x?: number; y?: number; width?: number; height?: number } = {}) { return { x: rect.x ?? 0, y: rect.y ?? 0, width: rect.width ?? 0, height: rect.height ?? 0, top: rect.y ?? 0, left: rect.x ?? 0, right: (rect.x ?? 0) + (rect.width ?? 0), bottom: (rect.y ?? 0) + (rect.height ?? 0) }; } },
  });
  Object.defineProperty(window, "matchMedia", { value: () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) });
  window.HTMLElement.prototype.getClientRects = function() { return [{ width: 100, height: 32 }] as unknown as DOMRectList; };
  window.HTMLElement.prototype.scrollIntoView = function() {};
  window.Element.prototype.getAnimations = function() { return []; };
  const root = createRoot(document.getElementById("root")!);
  return { root, cleanup: async () => { await act(async () => root.unmount()); window.close(); } };
}

export const flush = () => act(async () => { for (let index = 0; index < 4; index++) await new Promise(resolve => setTimeout(resolve, 5)); });
export const press = async (node: Element, key: string) => { await act(async () => { node.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })); }); await flush(); };
export const click = async (node: Element) => {
  await act(async () => {
    for (const type of ["pointerdown", "mousedown", "pointerup", "mouseup"]) node.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, button: 0 }));
    (node as HTMLElement).click();
  });
  await flush();
};
export async function type(input: HTMLInputElement, text: string) {
  await act(async () => {
    input.focus();
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")!.set!;
    setter.call(input, text);
    input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
  });
  await flush();
}
