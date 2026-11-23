import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, useRef } from "react";
import { AppLayout } from "../src/components/layouts/app-layout";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { useShellPanel } from "../src/internal/shell-popover";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

function Harness() {
  const root = useRef<HTMLDivElement>(null);
  const panel = useShellPanel(288);
  return <div ref={root}><div data-popover="team"><div ref={panel} style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
    <header>Current app</header><div data-shell-list><button>First</button><button>Last</button></div><footer><button>Create</button></footer>
  </div></div></div>;
}

// Base UI applies open/close and focus changes asynchronously.
const settle = () => act(async () => { for (let index = 0; index < 4; index++) await new Promise(resolve => setTimeout(resolve, 5)); });

test("shell panels budget chrome, reveal last focus and fall back to one scroll owner", async () => {
  const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true });
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true });
  Object.defineProperty(dom.window, "innerHeight", { configurable: true, writable: true, value: 400 });
  Object.defineProperty(dom.window, "innerWidth", { configurable: true, writable: true, value: 375 });
  dom.window.HTMLElement.prototype.getBoundingClientRect = function () {
    const width = 240;
    let left = 0, top = 0, height = 48;
    if (this.hasAttribute("data-popover")) {
      const [x, y] = (this.style.translate || "0px 0px").split(" ").map(parseFloat);
      left = 350 + x; top = 350 + y; height = 300;
    } else if (this.tagName === "HEADER") height = 100;
    else if (this.tagName === "FOOTER") height = 48;
    else if (this.hasAttribute("data-shell-list")) { top = 120; height = parseFloat(this.style.maxHeight) || 288; }
    else if (this.textContent === "Last") { top = 500; height = 48; }
    return { x: left, y: top, left, top, width, height, right: left + width, bottom: top + height, toJSON() {} };
  };
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  try {
    await act(async () => root.render(<Harness />));
    const wrapper = document.querySelector<HTMLElement>('[data-popover]')!;
    const panel = wrapper.firstElementChild as HTMLElement;
    const list = panel.querySelector<HTMLElement>('[data-shell-list]')!;
    assert.equal(panel.style.maxHeight, "368px");
    assert.equal(panel.dataset.shellScroll, "list");
    assert.equal(list.style.maxHeight, "176px"); // 368 - padding24 - gaps20 - header100 - footer48
    await act(async () => (list.lastElementChild as HTMLElement).focus());
    assert.equal(list.scrollTop, 252);
    Object.defineProperty(dom.window, "innerHeight", { value: 200 });
    await act(async () => dom.window.dispatchEvent(new dom.window.Event("resize")));
    assert.equal(panel.dataset.shellScroll, "panel");
    assert.equal(panel.style.overflowY, "auto");
    assert.equal(list.style.overflowY, "visible");
    assert.equal(list.style.maxHeight, "none");
    assert.equal(list.style.flexShrink, "0");
    Object.defineProperty(dom.window, "innerHeight", { value: 800 });
    await act(async () => dom.window.dispatchEvent(new dom.window.Event("resize")));
    assert.equal(panel.dataset.shellScroll, "list");
    assert.equal(list.style.maxHeight, "288px");
  } finally { await act(async () => root.unmount()); dom.window.close(); }
});


test("AppLayout breakpoint round trip restores the visible main-navigation trigger after portal disposal", async () => {
  const dom = new JSDOM('<div id="mount"></div>', { pretendToBeVisual: true, url: "http://localhost/preview" });
  let mobile = true;
  const listeners = new Set<() => void>();
  const frames = new Map<number, FrameRequestCallback>();
  let nextFrame = 0;
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({ get matches() { return mobile; }, addEventListener: (_: string, callback: () => void) => listeners.add(callback), removeEventListener: (_: string, callback: () => void) => listeners.delete(callback) }) });
  dom.window.requestAnimationFrame = (callback) => { frames.set(++nextFrame, callback); return nextFrame; };
  dom.window.cancelAnimationFrame = (id) => { frames.delete(id); };
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("mount")!);
  try {
    await act(async () => root.render(<PathnameContext.Provider value="/preview"><AppLayout motion="none" menuSections={[]} teamName="Design" showTeamActions teams={[{ id: "one", name: "One" }]}><main>Content</main></AppLayout></PathnameContext.Provider>));
    const navigationTrigger = () => document.querySelector<HTMLButtonElement>('[data-forge-menu-trigger]')!;
    await act(async () => { navigationTrigger().focus(); navigationTrigger().click(); });
    await act(async () => document.querySelector<HTMLButtonElement>('[data-popover-trigger="team"]')!.click());
    const last = () => document.querySelector<HTMLElement>('[data-popover="team"] [role="menu"] > button:last-child')!;
    await act(async () => last().focus());
    assert.equal(document.activeElement?.textContent, "新建团队");
    await act(async () => { mobile = false; listeners.forEach(callback => callback()); });
    await act(async () => { mobile = true; listeners.forEach(callback => callback()); });
    await act(async () => { for (const [id, callback] of [...frames]) { frames.delete(id); callback(1); } });
    await settle(); assert.ok(!document.querySelector('[data-popover="team"]'), "popover closed");
    assert.equal(document.querySelector('[data-forge-app-sidebar]')?.getAttribute("aria-hidden"), "true");
    await settle(); assert.ok(document.activeElement === navigationTrigger(), "focus: " + document.activeElement?.outerHTML.slice(0, 120));
    assert.equal(navigationTrigger().getAttribute("aria-expanded"), "false");
  } finally { await act(async () => root.unmount()); dom.window.close(); }
});
