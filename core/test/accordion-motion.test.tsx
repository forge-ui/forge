import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Accordion, type AccordionItem } from "../src/components/ui/accordion";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost" });
  let reduced = false;
  const subscribers = new Set<() => void>();
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({
    get matches() { return reduced; },
    addEventListener: (_: string, listener: () => void) => subscribers.add(listener),
    removeEventListener: (_: string, listener: () => void) => subscribers.delete(listener),
  }) });
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement,
    Event: dom.window.Event, KeyboardEvent: dom.window.KeyboardEvent,
  });
  const root = createRoot(document.getElementById("root")!);
  return {
    render: (node: ReactNode) => act(async () => root.render(node)),
    reduce: () => act(async () => { reduced = true; for (const subscriber of subscribers) subscriber(); }),
    close: async () => { await act(async () => root.unmount()); dom.window.close(); },
  };
}

const items: AccordionItem[] = [
  { value: "members", title: "成员", content: <button>查看邀请步骤</button> },
  { value: "files", title: "文件", content: <a href="#files">查看文件</a> },
];
const headers = () => [...document.querySelectorAll<HTMLButtonElement>(".forge-accordion > div > h3 > button")];
const panelFor = (header: HTMLButtonElement) => document.getElementById(header.getAttribute("aria-controls")!)!;

test("Accordion controlled closing restores a hidden answer's focus without stealing outside focus", async () => {
  const env = setup();
  const render = (value: string | null) => env.render(<><Accordion items={items} value={value} /><button id="outside">其他操作</button></>);
  try {
    await render("members");
    const member = headers()[0];
    const panel = panelFor(member);
    panel.querySelector("button")!.focus();
    await render("files");
    assert.equal(document.activeElement, member);
    assert.ok(panel.closest("[inert][aria-hidden='true']"));
    assert.equal(headers()[1].getAttribute("aria-expanded"), "true");
    await render("members");
    panel.querySelector("button")!.focus();
    document.getElementById("outside")!.focus();
    await render(null);
    assert.equal(document.activeElement?.id, "outside");
  } finally { await env.close(); }
});

test("Accordion rapid toggles keep one accessible answer and preserve mounted content", async () => {
  const env = setup();
  try {
    await env.render(<Accordion items={items} defaultValue="members" />);
    const [member, file] = headers();
    const original = panelFor(member);
    for (const target of [file, member, member, file, file, member]) {
      await act(async () => target.click());
      const expanded = headers().filter((header) => header.getAttribute("aria-expanded") === "true");
      assert.ok(expanded.length <= 1);
      for (const header of headers()) {
        assert.equal(Boolean(panelFor(header).closest("[inert]")), header.getAttribute("aria-expanded") !== "true");
      }
    }
    assert.equal(panelFor(member), original);
    assert.equal(member.getAttribute("aria-expanded"), "true");
    assert.ok(member.querySelector("svg"), "uses a Solar icon instead of a text glyph");
    assert.equal(member.textContent, "成员");
  } finally { await env.close(); }
});

test("Accordion respects live reduced motion and explicit motion none", async () => {
  const env = setup();
  try {
    await env.render(<Accordion items={items} />);
    let panel = panelFor(headers()[0]);
    assert.match(panel.style.transition, /transform 450ms/);
    await env.reduce();
    assert.equal(panel.style.transition, "none");
    assert.equal(panel.style.transform, "none");
    await act(async () => headers()[0].click());
    assert.equal(panel.style.opacity, "1");
    await env.render(<Accordion items={items} motion="none" />);
    panel = panelFor(headers()[1]);
    assert.equal(panel.style.transition, "none");
    assert.equal(panel.closest(".forge-motion-collapse")?.getAttribute("data-motion"), "none");
  } finally { await env.close(); }
});

test("Accordion navigation remains scoped to its own enabled headers when answers contain accordions", async () => {
  const env = setup();
  try {
    await env.render(<Accordion defaultValue="parent" items={[
      { value: "parent", title: "外层一", content: <Accordion items={[{ value: "nested", title: "内层", content: "内容" }]} /> },
      { value: "disabled", title: "不可用", content: "", disabled: true },
      { value: "last", title: "外层二", content: "内容" },
    ]} />);
    const root = document.querySelector(".forge-accordion")!;
    const outer = [...root.querySelectorAll<HTMLButtonElement>("h3 > button")].filter((button) => button.closest(".forge-accordion") === root);
    outer[0].focus();
    await act(async () => outer[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })));
    assert.equal(document.activeElement, outer[2]);
    await act(async () => outer[2].dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true })));
    assert.equal(document.activeElement, outer[0]);
  } finally { await env.close(); }
});
