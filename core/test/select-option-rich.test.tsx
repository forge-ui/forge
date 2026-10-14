import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, useState, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { SelectOption } from "../src/components/ui/forms/select-option";
import { BellLinear, LetterLinear } from "../src/icons";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

const items = [
  { value: "inbox", label: "站内消息", description: "在工作区查看", icon: <BellLinear size={20} /> },
  { value: "email", label: "Email", description: "发送到工作邮箱", icon: <LetterLinear size={20} /> },
  { value: "weekly", label: "Weekly digest", description: "每周一次" },
  { value: "off", label: "暂停通知", description: "保留消息" },
];

async function setup() {
  const dom = new JSDOM('<div id="root"></div><button id="outside">后续操作</button>', { url: "http://localhost", pretendToBeVisual: true });
  let reduced = false;
  const mediaListeners = new Set<() => void>();
  const animations: { canceled: boolean }[] = [];
  const scrolled: HTMLElement[] = [];
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({
    get matches() { return reduced; },
    addEventListener: (_: string, fn: () => void) => mediaListeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => mediaListeners.delete(fn),
  }) });
  dom.window.HTMLElement.prototype.animate = function () {
    const animation = { canceled: false, cancel() { this.canceled = true; } };
    animations.push(animation);
    return animation as unknown as Animation;
  };
  dom.window.HTMLElement.prototype.scrollIntoView = function () { scrolled.push(this); };
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document,
    HTMLElement: dom.window.HTMLElement, Node: dom.window.Node, Element: dom.window.Element,
    getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
  });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return {
    dom, animations, scrolled,
    render: (node: ReactNode) => act(async () => root.render(node)),
    key: (target: Element, key: string, repeat = false) => act(async () => {
      target.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key, repeat, bubbles: true, cancelable: true }));
    }),
    reduce: () => act(async () => { reduced = true; mediaListeners.forEach(fn => fn()); }),
    close: async () => { await act(async () => root.unmount()); dom.window.close(); },
  };
}
const trigger = () => document.querySelector<HTMLElement>('[role="combobox"]')!;
const rows = () => [...document.querySelectorAll<HTMLButtonElement>('[role="option"]')];
const click = (element: HTMLElement) => act(async () => element.click());

test("SelectOption rich items preserve the compact default and image precedence", () => {
  const basic = new JSDOM(renderToString(<SelectOption options={[{ value: "a", label: "Alpha" }]} value="a" />));
  const field = basic.window.document.querySelector<HTMLElement>('[role="combobox"]')!;
  assert.equal(field.parentElement!.style.width, "200px");
  assert.equal(field.style.width, "100%");
  assert.ok(field.classList.contains("h-12"));
  assert.ok(field.classList.contains("rounded-xl"));
  assert.equal(field.textContent, "Alpha");
  basic.window.close();
  const relative = new JSDOM(renderToString(<SelectOption width="50%" options={items} />));
  const relativeField = relative.window.document.querySelector<HTMLElement>('[role="combobox"]')!;
  assert.equal(relativeField.parentElement!.style.width, "50%", "relative width applies only once");
  assert.equal(relativeField.style.width, "100%");
  relative.window.close();
  const rich = new JSDOM(renderToString(<SelectOption options={items} value="email" width="100%" />));
  assert.match(rich.window.document.querySelector('[role="combobox"]')!.textContent!, /Email发送到工作邮箱/);
  assert.ok(rich.window.document.querySelector('.solar-letter-linear'));
  rich.window.close();
  const image = new JSDOM(renderToString(<SelectOption type="image" value="photo" options={[{ value: "photo", label: "头像", image: "/avatar.png", icon: <BellLinear /> }]} />));
  assert.equal(image.window.document.querySelector("img")?.getAttribute("src"), "/avatar.png");
  assert.equal(image.window.document.querySelector('.solar-bell-linear'), null);
  image.window.close();
});

test("SelectOption supports keyboard selection once, typeahead, focus restoration and controlled values", async () => {
  const env = await setup();
  const calls: string[] = [];
  try {
    await env.render(<SelectOption value="email" label="通知" options={items} onChange={value => calls.push(value)} />);
    await env.key(trigger(), "Enter");
    assert.equal(document.activeElement, rows()[1], "Enter opens at the selected item");
    await env.key(rows()[1], "End");
    assert.equal(document.activeElement, rows()[3]);
    await env.key(rows()[3], "ArrowDown");
    assert.equal(document.activeElement, rows()[0]);
    await act(async () => rows()[0].dispatchEvent(new env.dom.window.KeyboardEvent("keydown", { key: "w", isComposing: true, bubbles: true, cancelable: true })));
    assert.equal(document.activeElement, rows()[0], "IME composition does not trigger typeahead");
    await env.key(rows()[0], "w");
    assert.equal(document.activeElement, rows()[2]);
    assert.equal(env.scrolled.at(-1), rows()[2]);
    const choice = rows()[2];
    await env.key(choice, "Enter");
    assert.deepEqual(calls, ["weekly"]);
    assert.equal(document.activeElement, trigger());
    assert.equal(trigger().getAttribute("aria-expanded"), "false");
    assert.match(trigger().textContent!, /^Email/); // The consumer owns value.
    await click(choice); // A retained closing surface cannot emit another callback.
    assert.deepEqual(calls, ["weekly"]);
    await env.render(<SelectOption value="weekly" label="通知" options={items} onChange={value => calls.push(value)} />);
    assert.match(trigger().textContent!, /^Weekly digest/);
    await click(trigger());
    assert.equal(document.activeElement, rows()[2]);
    await env.key(rows()[2], "Escape");
    assert.equal(document.activeElement, trigger());
    assert.deepEqual(calls, ["weekly"]);
    await click(trigger());
    await act(async () => document.getElementById("outside")!.focus());
    assert.equal(trigger().getAttribute("aria-expanded"), "false");
    assert.equal(document.activeElement?.id, "outside");
  } finally { await env.close(); }
});

test("SelectOption multiple selection stays open and disabled fields cannot change or reopen", async () => {
  const env = await setup();
  const calls: string[][] = [];
  function Multiple({ disabled = false }: { disabled?: boolean }) {
    const [value, setValue] = useState(["inbox"]);
    return <SelectOption type="multiple" value={value} options={items} state={disabled ? "disabled" : "idle"}
      onChange={next => { calls.push(next); setValue(next); }} />;
  }
  try {
    await env.render(<Multiple />);
    await click(trigger());
    await env.key(rows()[1], " ");
    assert.deepEqual(calls, [["inbox", "email"]]);
    assert.equal(trigger().getAttribute("aria-expanded"), "true");
    await env.key(rows()[1], " ", true);
    assert.equal(calls.length, 1, "held Space does not toggle repeatedly");
    assert.equal(rows().filter(row => row.getAttribute("aria-selected") === "true").length, 2);
    assert.ok(rows()[1].querySelector('.solar-check-circle-linear'));
    await env.render(<Multiple disabled />);
    assert.equal(trigger().getAttribute("aria-expanded"), "false");
    assert.equal(trigger().getAttribute("aria-disabled"), "true");
    assert.equal(trigger().querySelector("button"), null, "disabled tags are not removable");
    await click(trigger());
    await env.key(trigger(), "ArrowDown");
    assert.equal(trigger().getAttribute("aria-expanded"), "false");
    assert.equal(calls.length, 1);
    await env.render(<Multiple />);
    assert.equal(trigger().getAttribute("aria-expanded"), "false");
    const remove = trigger().querySelector<HTMLButtonElement>('[aria-label="移除 Email"]')!;
    await click(remove);
    assert.deepEqual(calls.at(-1), ["inbox"]);
    assert.equal(trigger().getAttribute("aria-expanded"), "false");
  } finally { await env.close(); }
});

test("SelectOption handles fast reopening and changing reduced-motion preferences without stale animations", async () => {
  const env = await setup();
  try {
    const render = (value: string, motion: "auto" | "none" = "auto") => env.render(<SelectOption value={value} options={items} motion={motion} />);
    await render("inbox");
    await render("email");
    assert.equal(env.animations.length, 1);
    await render("weekly");
    assert.equal(env.animations[0].canceled, true);
    assert.equal(env.animations.length, 2);
    await click(trigger());
    const surface = document.querySelector<HTMLElement>('[role="listbox"]')!;
    assert.equal(surface.getAttribute("data-motion"), "auto");
    await env.key(rows()[2], "Escape");
    await click(trigger());
    assert.equal(document.querySelector('[role="listbox"]'), surface);
    assert.equal(surface.hasAttribute("inert"), false);
    assert.equal(document.activeElement, rows()[2]);
    await env.reduce();
    assert.equal(env.animations[1].canceled, true);
    assert.equal(trigger().getAttribute("data-motion"), "none");
    assert.equal(document.querySelector('.forge-motion-menu')?.getAttribute("data-motion"), "none");
    assert.ok([...surface.querySelectorAll<HTMLElement>('[role="option"] > span[aria-hidden][style]')].every(span => span.style.transition === "none"));
    await render("email", "none");
    assert.equal(env.animations.length, 2);
    await env.key(rows()[1], "Escape");
    assert.equal(document.querySelector('[role="listbox"]'), null);
  } finally { await env.close(); }
});

test("SelectOption without a controlled value keeps its original callback-only behavior", async () => {
  const env = await setup();
  const calls: string[] = [];
  try {
    await env.render(<SelectOption options={items} onChange={value => calls.push(value)} placeholder="选择通知方式" />);
    await env.key(trigger(), "ArrowUp");
    assert.equal(document.activeElement, rows()[3]);
    await click(rows()[1]);
    assert.deepEqual(calls, ["email"]);
    assert.equal(trigger().textContent, "选择通知方式");
    await env.key(trigger(), "ArrowDown");
    assert.equal(document.activeElement, rows()[0]);
    assert.equal(rows().filter(row => row.getAttribute("aria-selected") === "true").length, 0);
  } finally { await env.close(); }
});
