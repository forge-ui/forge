import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { ChatBubble } from "../src/components/ui/chat-bubble";
import { ChatInputBar } from "../src/components/ui/chat-input-bar";
import { ComposerVoice } from "../src/internal/chat-interactions";
import { ToolChips } from "../src/components/ui/agent/tool-chips";
import { SmoothLineChart } from "../src/components/ui/charts/smooth-line-chart";
import { BarChart } from "../src/components/ui/charts/bar-chart";
import { DonutChart } from "../src/components/ui/charts/donut-chart";
import { MultilayerDonutChart } from "../src/components/ui/charts/multilayer-donut-chart";
import { BarHorizontalChart } from "../src/components/ui/charts/bar-horizontal-chart";
import { bandPath, chartDomain, chartPoints, ringFractions, stackedBounds } from "../src/internal/chart-geometry";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

async function setup() {
  const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true, url: "http://localhost" });
  dom.window.matchMedia = () => ({ matches: true, media: "", onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => true });
  dom.window.HTMLElement.prototype.setPointerCapture = () => {};
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, SVGElement: dom.window.SVGElement, getComputedStyle: dom.window.getComputedStyle, requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window), cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window) });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return {
    render: (node: ReactNode) => act(async () => root.render(node)),
    click: (element: Element) => act(async () => (element as HTMLElement).click()),
    key: (element: Element, key: string, type = "keydown") => act(async () => element.dispatchEvent(new dom.window.KeyboardEvent(type, { key, bubbles: true, cancelable: true }))),
    pointer: (element: Element, type: string, x: number) => act(async () => element.dispatchEvent(new dom.window.MouseEvent(type, { clientX: x, button: 0, bubbles: true }))),
    close: async () => { await act(async () => root.unmount()); dom.window.close(); },
  };
}

test("chart geometry stacks each series on the previous upper bound and closes uncertainty bands", () => {
  assert.deepEqual(stackedBounds([[2, 3], [5, 7], [1, 2]]), [{ lower: [0, 0], upper: [2, 3] }, { lower: [2, 3], upper: [7, 10] }, { lower: [7, 10], upper: [8, 12] }]);
  assert.equal(bandPath(chartPoints([4, 8], [0, 10]), chartPoints([2, 5], [0, 10])), "M0,72 L400,24 L400,60 L0,96 Z");
  assert.deepEqual(ringFractions([2, 0, 6]), [{ start: 0, fraction: .25 }, { start: .25, fraction: 0 }, { start: .25, fraction: .75 }]);
  assert.deepEqual(ringFractions([0, 0]), [{ start: 0, fraction: 0 }, { start: 0, fraction: 0 }]);
  const constant = chartDomain([-3, -3]);
  assert.ok(constant[0] < constant[1]);
  assert.ok(chartPoints([-3, -3], constant).flat().every(Number.isFinite));
});

test("ChatBubble reaction picker is controlled, keyboard accessible and restores its trigger", async () => {
  const env = await setup(), calls: string[] = [];
  try {
    await env.render(<ChatBubble type="received" content="Hello" locale="en" motion="none" reactions={[{ id: "like", content: "👍", label: "Like", count: 3 }]} reactionOptions={[{ id: "like", content: "👍", label: "Like" }, { id: "celebrate", content: "🎉", label: "Celebrate" }]} onReaction={id => calls.push(id)} />);
    const trigger = document.querySelector('[aria-label="Add reaction"]')!;
    await env.click(trigger);
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    const first = document.querySelector('[role="dialog"] button')!;
    await env.key(first, "ArrowRight");
    assert.equal(document.activeElement?.getAttribute("aria-label"), "Celebrate");
    await env.click(document.activeElement!);
    assert.deepEqual(calls, ["celebrate"]);
    assert.equal(document.activeElement, trigger);
    assert.equal(document.querySelector('[role="dialog"]'), null);
    assert.equal(document.querySelector('[aria-label="Like · 3"]')?.getAttribute("aria-pressed"), "false");
    await env.click(trigger); await env.key(document.activeElement!, "Escape");
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
  } finally { await env.close(); }
});

test("ChatBubble swipe cancellation never replies; releasing past the threshold replies once", async () => {
  const env = await setup(); let replies = 0;
  try {
    await env.render(<ChatBubble type="received" content="Swipe" onReply={() => replies++} motion="none" />);
    const bubble = Array.from(document.querySelectorAll("p")).find(node => node.textContent === "Swipe")!.parentElement!;
    await env.pointer(bubble, "pointerdown", 0); await env.pointer(bubble, "pointermove", 80); await env.pointer(bubble, "pointercancel", 80);
    assert.equal(replies, 0);
    await env.pointer(bubble, "pointerdown", 0); await env.pointer(bubble, "pointermove", 80); await env.pointer(bubble, "pointerup", 80); await env.pointer(bubble, "lostpointercapture", 80);
    assert.equal(replies, 1);
  } finally { await env.close(); }
});

test("ChatInputBar renders caller-owned reply and attachments and forwards reply metadata without clearing it", async () => {
  const env = await setup(); const calls: unknown[] = []; let cancelled = 0;
  const reply = { id: "message-1", name: "Lin", content: "Earlier message" };
  try {
    await env.render(<ChatInputBar locale="en" motion="none" value="Ready" replyTo={reply} onCancelReply={() => cancelled++} attachments={<div data-attachment="one">report.pdf</div>} sendLabel="Send" onSend={(body, _, context) => calls.push({ body, context })} />);
    assert.equal(document.querySelectorAll("[data-attachment]").length, 1);
    const send = Array.from(document.querySelectorAll("button")).find(button => button.textContent === "Send")!;
    await env.click(send);
    assert.deepEqual(calls, [{ body: "Ready", context: { sources: [], replyTo: reply } }]);
    await env.click(document.querySelector('[aria-label="Cancel reply"]')!);
    assert.equal(cancelled, 1);
    assert.ok(document.body.textContent?.includes("Earlier message"));
  } finally { await env.close(); }
});

test("held voice input handles keyboard release, cancellation and unmount without double completion", async () => {
  const env = await setup(); let starts = 0, ends = 0, cancels = 0;
  await env.render(<ComposerVoice state="idle" locale="zh" motion="none" onStart={() => starts++} onEnd={() => ends++} onCancel={() => cancels++} />);
  const button = document.querySelector("button")!;
  await env.key(button, " "); await env.key(button, " ", "keyup");
  assert.deepEqual([starts, ends, cancels], [1, 1, 0]);
  await env.pointer(button, "pointerdown", 0); await env.pointer(button, "pointercancel", 0); await env.pointer(button, "lostpointercapture", 0);
  assert.deepEqual([starts, ends, cancels], [2, 1, 1]);
  await env.key(button, "Enter"); await env.key(button, "Escape"); await env.key(button, "Enter", "keyup");
  assert.deepEqual([starts, ends, cancels], [3, 1, 2]);
  await env.key(button, " "); await env.close();
  assert.deepEqual([starts, ends, cancels], [4, 1, 3]);
});

test("ToolChips receives per-step execution state and preserves it when details collapse", async () => {
  const env = await setup();
  try {
    await env.render(<ToolChips locale="zh" motion="none" state="error" items={[{ id: "done", kind: "read", label: "读取资料", chip: "1", status: "complete" }, { id: "failed", kind: "think", label: "分析资料", chip: "2", status: "error", detail: [{ text: "请求超时" }] }]} result="保留已完成步骤" />);
    assert.equal(document.querySelector('[data-tool-state]')?.getAttribute("data-tool-state"), "error");
    const header = document.querySelector("button")!;
    assert.match(header.textContent ?? "", /2 次工具调用.*执行失败/);
    const failed = Array.from(document.querySelectorAll("button")).find(button => button.textContent?.includes("分析资料"))!;
    await env.click(failed);
    assert.ok(document.body.textContent?.includes("请求超时"));
    await env.click(header);
    assert.equal(header.getAttribute("aria-expanded"), "false");
    await env.click(header);
    assert.ok(document.body.textContent?.includes("保留已完成步骤"));
  } finally { await env.close(); }
});

test("interactive line and bars follow keyboard bounds and keep pin selection controlled", async () => {
  const env = await setup(); const line: unknown[] = [], bars: unknown[] = [], pins: number[] = [];
  try {
    await env.render(<SmoothLineChart series={[{ data: [3, 6, 9] }]} motion="none" activeIndex={1} onActiveIndexChange={index => line.push(index)} />);
    const slider = document.querySelector('[role="slider"]')!;
    await env.key(slider, "Home"); await env.key(slider, "End"); await env.key(slider, "ArrowLeft"); await env.key(slider, "Escape");
    assert.deepEqual(line, [0, 2, 0, undefined]);
    await env.render(<BarChart data={[{ value: 4, label: "A" }, { value: 8, label: "B" }]} motion="none" onActiveIndexChange={index => bars.push(index)} onSelect={index => pins.push(index)} />);
    const last = document.querySelectorAll('[role="button"]')[1];
    await env.key(last, "Home");
    assert.equal(document.activeElement?.getAttribute("aria-label"), "A: 4");
    await env.key(document.activeElement!, "Enter");
    assert.deepEqual(pins, [0]);
    assert.equal(document.querySelector('[aria-label="A: 4"]')?.getAttribute("aria-pressed"), "false");
  } finally { await env.close(); }
});

test("donut exclusion redistributes independent segments; full rings preserve excess progress; targets keep fixed domains", () => {
  const donut = new JSDOM(renderToString(<DonutChart interactive motion="none" segments={[{ value: 25 }, { value: 25, disabled: true }, { value: 50 }]} />));
  const segments = donut.window.document.querySelectorAll("[data-chart-segment]");
  assert.equal(segments.length, 3);
  assert.equal(segments[1].getAttribute("stroke-dasharray"), "0 100");
  assert.ok(Number(segments[2].getAttribute("stroke-dasharray")!.split(" ")[0]) > 65);
  const rings = new JSDOM(renderToString(<MultilayerDonutChart motion="none" sweep={360} layers={[{ value: 132 }]} />));
  assert.equal(rings.window.document.querySelector('[data-ring-lap="first"]')?.getAttribute("stroke-dasharray"), "100 100");
  assert.equal(rings.window.document.querySelector('[data-ring-lap="overflow"]')?.getAttribute("stroke-dasharray"), "32 100");
  const bullet = new JSDOM(renderToString(<BarHorizontalChart motion="none" data={[{ value: 74 }]} domain={[0, 100]} target={70} />));
  assert.match(bullet.window.document.querySelector('[data-chart-target]')!.getAttribute("style")!, /left:70%/);
  assert.ok(Array.from(bullet.window.document.querySelectorAll("[style]")).some(node => /width:74%/.test(node.getAttribute("style")!)));
  const area = new JSDOM(renderToString(<SmoothLineChart motion="none" stacked interpolation="linear" yDomain={[0, 20]} series={[{ data: [2, 4] }, { data: [3, 6] }]} bands={[{ lower: [1, 2], upper: [3, 6] }]} />));
  assert.ok(area.window.document.querySelector("[data-chart-band]")?.getAttribute("d")?.endsWith(" Z"));
  assert.equal(area.window.document.querySelector("[data-chart-band]")?.parentElement?.tagName.toLowerCase(), "svg");
  [donut, rings, bullet, area].forEach(dom => dom.window.close());
});
