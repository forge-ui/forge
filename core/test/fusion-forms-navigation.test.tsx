import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, useState, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { DebitCard } from "../src/components/ui/debit-card";
import { CreditCard } from "../src/components/ui/credit-card";
import { FileCard } from "../src/components/ui/forms/file-upload";
import { TextField } from "../src/components/ui/forms/text-field";
import { Datepicker } from "../src/components/ui/forms/datepicker";
import { RatingStars } from "../src/components/ui/rating-stars";
import { TabsContent } from "../src/components/ui/tabs-content";
import { ButtonGroup } from "../src/components/ui/button-group";
import { TaskCard } from "../src/components/ui/task-card";
import { Button } from "../src/components/ui/button";
import { OtpInput } from "../src/components/ui/otp-input";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

async function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  Object.defineProperty(dom.window, "matchMedia", { configurable: true, value: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }) });
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Node: dom.window.Node, Element: dom.window.Element, getComputedStyle: dom.window.getComputedStyle.bind(dom.window), IS_REACT_ACT_ENVIRONMENT: true });
  dom.window.HTMLElement.prototype.scrollTo = function (options?: ScrollToOptions | number) { if (options && typeof options === "object") this.scrollLeft = options.left ?? this.scrollLeft; };
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return { dom, render: (node: ReactNode) => act(async () => root.render(node)), close: async () => { await act(async () => root.unmount()); dom.window.close(); }, key: (target: Element, key: string) => act(async () => { target.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })); }) };
}
const click = (target: HTMLElement) => act(async () => target.click());

test("FileCard renders caller progress, clamps invalid range and localizes actions", () => {
  const dom = new JSDOM(renderToString(<FileCard file={{ id: "a", name: "notes.pdf", size: "2 KB", state: "uploading", progress: 140, uploadedBytes: 2048, totalBytes: 2048 }} color="blue" locale="en" onRemove={() => {}} />));
  const progress = dom.window.document.querySelector('[role="progressbar"]')!;
  assert.equal(progress.getAttribute("aria-valuenow"), "100");
  assert.match(dom.window.document.body.textContent!, /Uploading/);
  assert.ok(dom.window.document.querySelector('[aria-label="Remove attachment notes.pdf"]'));
  const without = new JSDOM(renderToString(<FileCard file={{ id: "b", name: "draft.txt", size: "1 KB" }} />));
  assert.equal(without.window.document.querySelector('[role="progressbar"]'), null);
  dom.window.close(); without.window.close();
});

test("TextField floating label retains a real label and a selected removable tag is localized", () => {
  const dom = new JSDOM(renderToString(<TextField label="Work email" labelPlacement="floating" id="email" value="" onChange={() => {}} />));
  assert.equal(dom.window.document.querySelector('label')?.htmlFor, "email");
  assert.equal(dom.window.document.querySelector('input')?.getAttribute("placeholder"), " ");
  const tags = new JSDOM(renderToString(<TextField tags={[{ value: "forge", label: "Forge" }]} activeTag="forge" locale="en" onRemoveTag={() => {}} />));
  assert.ok(tags.window.document.querySelector('[data-tag-selected="true"]'));
  assert.ok(tags.window.document.querySelector('[aria-label="Remove Forge"] .solar-close-circle-linear'));
  dom.window.close(); tags.window.close();
});

test("RatingStars keeps read-only default, supports keyboard changes, and does not mutate controlled values", async () => {
  assert.equal(new JSDOM(renderToString(<RatingStars value={3} />)).window.document.querySelector('[role="slider"]'), null);
  const env = await setup(), changes: number[] = [];
  try {
    await env.render(<RatingStars value={2} onChange={value => changes.push(value)} locale="en" motion="none" />);
    const slider = document.querySelector('[role="slider"]')!;
    await env.key(slider, "ArrowRight"); await env.key(slider, "End"); await env.key(slider, "Home");
    assert.deepEqual(changes, [3, 5, 0]);
    assert.equal(slider.getAttribute("aria-valuenow"), "2");
    await env.render(<RatingStars value={2} onChange={value => changes.push(value)} disabled motion="none" />);
    await env.key(slider, "ArrowRight"); assert.equal(changes.length, 3);
  } finally { await env.close(); }
});

test("Datepicker range draft waits for apply and normalizes a reversed range", async () => {
  const env = await setup(), changes: [Date, Date | null][] = [];
  try {
    await env.render(<Datepicker mode="range" inline confirmSelection locale="en" rangeStart={new Date(2026, 9, 14)} rangeEnd={new Date(2026, 9, 17)} onRangeChange={(a, b) => changes.push([a, b])} />);
    const days = [...document.querySelectorAll<HTMLButtonElement>('button[data-date]')];
    await click(days.find(day => day.textContent?.trim() === "20")!);
    await click(days.find(day => day.textContent?.trim() === "10")!);
    assert.equal(changes.length, 0, "draft changes are not committed before apply");
    await click([...document.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent === "Apply")!);
    assert.equal(changes.length, 1); assert.equal(changes[0][0].getDate(), 10); assert.equal(changes[0][1]?.getDate(), 20);
  } finally { await env.close(); }
});

test("Datepicker supports keyboard crossing a month without selecting a day", async () => {
  const env = await setup();
  try {
    await env.render(<Datepicker value={new Date(2026, 9, 31)} inline locale="en" />);
    const last = [...document.querySelectorAll<HTMLButtonElement>('button[data-date]')].find(button => button.textContent?.trim() === "31")!;
    await env.key(last, "ArrowRight");
    assert.match(document.activeElement?.getAttribute("aria-label") ?? "", /Nov 1, 2026/);
    assert.equal(document.activeElement?.getAttribute("aria-pressed"), "false");
  } finally { await env.close(); }
});

test("TabsContent scroll reports fractional progress and makes only the selected panel accessible", async () => {
  const env = await setup(), values: number[] = [];
  function Example() { const [key, setKey] = useState<string | number>(0); return <TabsContent activeKey={key} onActiveKeyChange={setKey} onProgressChange={value => values.push(value)} motion="none" panels={[{ key: 0, content: <button>Alpha</button> }, { key: 1, content: <button>Beta</button> }, { key: 2, content: <button>Gamma</button> }]} />; }
  try {
    await env.render(<Example />);
    const scroller = document.querySelector<HTMLElement>('[data-tabs-transition="swipe"]')!;
    Object.defineProperty(scroller, "clientWidth", { value: 300 });
    await act(async () => { scroller.scrollLeft = 450; scroller.dispatchEvent(new env.dom.window.Event("scroll", { bubbles: true })); });
    assert.equal(values.at(-1), 1.5);
    const panels = [...document.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
    assert.equal(panels.filter(panel => !panel.hasAttribute("inert")).length, 1);
    assert.equal(panels[2].hasAttribute("inert"), false);
  } finally { await env.close(); }
});

test("ButtonGroup supports arrows and Home/End without changing the controlled selection", async () => {
  const env = await setup(), changes: number[] = [];
  try {
    await env.render(<ButtonGroup items={[{ label: "Day" }, { label: "Week" }, { label: "Month" }]} activeIndex={1} onChange={i => changes.push(i)} motion="none" />);
    const buttons = [...document.querySelectorAll<HTMLButtonElement>('button')];
    await env.key(buttons[1], "ArrowRight"); assert.equal(document.activeElement, buttons[2]);
    await env.key(buttons[2], "Home"); assert.equal(document.activeElement, buttons[0]);
    assert.deepEqual(changes, [2, 0]); assert.equal(buttons[1].getAttribute("aria-pressed"), "true");
  } finally { await env.close(); }
});

test("OtpInput English defaults include the accessible input and hint", () => {
  const html = renderToString(<OtpInput locale="en" motion="none" />);
  assert.match(html, /Verification code/); assert.match(html, /Enter your verification code/); assert.doesNotMatch(html, /验证码/);
});

test("TabsContent keeps the latest controlled request through intermediate smooth-scroll events", async () => {
  const env = await setup(), changes: (string | number)[] = [];
  Object.defineProperty(env.dom.window, "matchMedia", { configurable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
  env.dom.window.HTMLElement.prototype.scrollTo = function () {};
  const panels = [0, 1, 2, 3].map(key => ({ key, content: `Panel ${key}` }));
  try {
    await env.render(<TabsContent activeKey={0} panels={panels} onActiveKeyChange={key => changes.push(key)} />);
    const scroller = document.querySelector<HTMLElement>('[data-tabs-transition="swipe"]')!;
    Object.defineProperty(scroller, "clientWidth", { value: 300 });
    await env.render(<TabsContent activeKey={3} panels={panels} onActiveKeyChange={key => changes.push(key)} />);
    await env.render(<TabsContent activeKey={1} panels={panels} onActiveKeyChange={key => changes.push(key)} />);
    await act(async () => { scroller.scrollLeft = 600; scroller.dispatchEvent(new env.dom.window.Event("scroll", { bubbles: true })); });
    assert.deepEqual(changes, []);
    await act(async () => { scroller.scrollLeft = 300; scroller.dispatchEvent(new env.dom.window.Event("scroll", { bubbles: true })); });
    assert.deepEqual(changes, []);
    await act(async () => { scroller.dispatchEvent(new env.dom.window.Event("wheel", { bubbles: true })); scroller.scrollLeft = 600; scroller.dispatchEvent(new env.dom.window.Event("scroll", { bubbles: true })); });
    assert.deepEqual(changes, [2]);
  } finally { await env.close(); }
});

 test("TaskCard formats finite bounded progress and localizes its label", () => {
  const html = renderToString(<TaskCard title="Task" progress={100 / 9} locale="en" />);
  assert.match(html, /Progress/); assert.match(html, /11<!-- -->%/); assert.doesNotMatch(html, /111111/);
  assert.match(renderToString(<TaskCard title="任务" progress={Infinity} />), /0<!-- -->%/);
});
 test("rolling button keeps a single readable label and hides decorative letter copies", () => {
  const dom = new JSDOM(renderToString(<Button effect="roll">浏览作品</Button>));
  assert.equal(dom.window.document.querySelector(".sr-only")?.textContent, "浏览作品");
  assert.equal(dom.window.document.querySelectorAll('.forge-roll-letter[aria-hidden="true"]').length, 4);
  dom.window.close();
});

test("OtpInput error reset never clears a newer edited code", async () => {
  const env = await setup();
  try {
    await env.render(<OtpInput verify={() => false} />);
    const input = document.querySelector<HTMLInputElement>('input')!;
    const setter = Object.getOwnPropertyDescriptor(env.dom.window.HTMLInputElement.prototype, "value")!.set!;
    await act(async () => { setter.call(input, "000000"); input.dispatchEvent(new env.dom.window.Event("input", { bubbles: true })); });
    assert.equal(document.querySelector(".forge-otp")?.getAttribute("data-status"), "err");
    await act(async () => { setter.call(input, "12"); input.dispatchEvent(new env.dom.window.Event("input", { bubbles: true })); });
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 400)); });
    assert.equal(input.value, "12");
  } finally { await env.close(); }
});

test("OtpInput controlled error reset survives unrelated parent updates and uses the latest callback", async () => {
  const env = await setup();
  let refresh: () => void = () => {};
  const clearedAt: number[] = [];
  function Parent() {
    const [code, setCode] = useState("");
    const [tick, setTick] = useState(0);
    refresh = () => setTick(value => value + 1);
    return <OtpInput value={code} motion="none" verify={() => false} onChange={value => { setCode(value); if (!value) clearedAt.push(tick); }} />;
  }
  try {
    await env.render(<Parent />);
    const input = document.querySelector<HTMLInputElement>("input")!;
    const setter = Object.getOwnPropertyDescriptor(env.dom.window.HTMLInputElement.prototype, "value")!.set!;
    await act(async () => { setter.call(input, "000000"); input.dispatchEvent(new env.dom.window.Event("input", { bubbles: true })); });
    assert.equal(document.querySelector(".forge-otp")?.getAttribute("data-status"), "err");
    for (let i = 0; i < 16; i++) {
      await act(async () => { await new Promise(resolve => setTimeout(resolve, 100)); refresh(); });
      if (i === 3) assert.equal(input.value, "000000", "reduced motion keeps the error readable");
    }
    assert.equal(input.value, "");
    assert.equal(clearedAt.length, 1);
    assert.ok(clearedAt[0] > 0, "reset calls the latest callback, not the first render's closure");
  } finally { await env.close(); }
});

test("OtpInput preserves the full error animation and does not steal focus on reset", async () => {
  const env = await setup();
  Object.defineProperty(env.dom.window, "matchMedia", { configurable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
  try {
    await env.render(<><OtpInput verify={() => false} /><button>Continue elsewhere</button></>);
    const input = document.querySelector<HTMLInputElement>("input")!;
    const setter = Object.getOwnPropertyDescriptor(env.dom.window.HTMLInputElement.prototype, "value")!.set!;
    await act(async () => { setter.call(input, "000000"); input.dispatchEvent(new env.dom.window.Event("input", { bubbles: true })); });
    const next = document.querySelector<HTMLButtonElement>("button")!;
    next.focus();
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 1200)); });
    assert.equal(input.value, "000000", "error does not clear at the old 1100ms cutoff");
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 350)); });
    assert.equal(input.value, "");
    assert.equal(document.activeElement, next);
  } finally { await env.close(); }
});


test("financial card labels default to Chinese and allow English or custom wording", () => {
  assert.match(renderToString(<DebitCard />), /余额/);
  assert.match(renderToString(<DebitCard locale="en" />), /Balance/);
  assert.match(renderToString(<DebitCard balanceLabel="可用金额" />), /可用金额/);
  const english = renderToString(<CreditCard locale="en" />);
  assert.match(english, /Card number/);
  assert.match(english, /Name/);
  assert.match(renderToString(<CreditCard holderNameLabel="持卡人" />), /持卡人/);
});
