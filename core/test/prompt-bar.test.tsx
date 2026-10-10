import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act } from "react";
import { AskAiCompactComposerContext } from "../src/internal/ask-ai-composer-context";
import { PromptBar } from "../src/components/ui/agent/prompt-bar";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

async function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost" });
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: dom.window,
    self: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    Event: dom.window.Event,
    KeyboardEvent: dom.window.KeyboardEvent,
  });
  // Initialize React's input event support after installing the browser globals.
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return {
    root,
    cleanup: async () => {
      await act(async () => root.unmount());
      dom.window.close();
    },
  };
}

function textarea() {
  const element = document.querySelector<HTMLTextAreaElement>("textarea");
  assert.ok(element);
  return element;
}

function button(label: string) {
  const element = [...document.querySelectorAll<HTMLButtonElement>("button")]
    .find((item) => item.getAttribute("aria-label") === label);
  assert.ok(element, `Expected a button named ${label}`);
  return element;
}

const click = (element: HTMLElement) => act(async () => element.click());
const key = (element: Element, value: string) => act(async () => {
  element.dispatchEvent(new KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true }));
});

async function typeText(value: string) {
  const element = textarea();
  const prototype = element.ownerDocument.defaultView!.HTMLTextAreaElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")!.set!;
  await act(async () => {
    setter.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

test("PromptBar defaults to idle and preserves sending, trimming and clearing behavior", async () => {
  const env = await setup();
  const sent: string[] = [];
  try {
    await act(async () => env.root.render(<PromptBar onSend={(message) => sent.push(message)} />));
    assert.equal(button("Send").disabled, true);
    await typeText("  First message  ");
    assert.equal(button("Send").disabled, false);
    await click(button("Send"));
    assert.deepEqual(sent, ["First message"]);
    assert.equal(textarea().value, "");
    assert.equal(button("Send").disabled, true);

    await typeText("Second message");
    await key(textarea(), "Enter");
    assert.deepEqual(sent, ["First message", "Second message"]);
    assert.equal(textarea().value, "");
  } finally { await env.cleanup(); }
});

test("PromptBar can stop a running request with an empty draft", async () => {
  const env = await setup();
  let stopped = 0;
  const sent: string[] = [];
  try {
    await act(async () => env.root.render(<PromptBar status="running" onStop={() => stopped++} onSend={(message) => sent.push(message)} />));
    assert.equal(textarea().value, "");
    assert.equal(button("停止生成").disabled, false);
    await click(button("停止生成"));
    assert.equal(stopped, 1);
    assert.deepEqual(sent, []);
    assert.equal(textarea().value, "");
  } finally { await env.cleanup(); }
});

test("PromptBar disabled prevents editing and sending while keeping a running request stoppable", async () => {
  const env = await setup();
  let stopped = 0;
  const sent: string[] = [];
  const props = { disabled: true, value: "Existing draft", onSend: (message: string) => sent.push(message), onStop: () => stopped++ };
  try {
    await act(async () => env.root.render(<PromptBar {...props} />));
    assert.equal(textarea().disabled, true);
    assert.equal(button("Send").disabled, true);
    await click(button("Send"));
    assert.deepEqual(sent, []);

    await act(async () => env.root.render(<PromptBar {...props} status="running" />));
    assert.equal(textarea().disabled, true);
    assert.equal(button("停止生成").disabled, false);
    await click(button("停止生成"));
    assert.equal(stopped, 1);
    assert.deepEqual(sent, []);
    assert.equal(textarea().value, "Existing draft");
  } finally { await env.cleanup(); }
});

for (const status of ["running", "stopping"] as const) {
  test(`PromptBar ${status} keeps typed drafts and Enter never sends or stops`, async () => {
    const env = await setup();
    let stopped = 0;
    const sent: string[] = [];
    const changed: string[] = [];
    try {
      await act(async () => env.root.render(<PromptBar status={status} onChange={(value) => changed.push(value)} onSend={(message) => sent.push(message)} onStop={() => stopped++} />));
      assert.equal(textarea().disabled, false);
      await typeText("Next request draft");
      await key(textarea(), "Enter");
      assert.deepEqual(sent, []);
      assert.equal(stopped, 0);
      assert.equal(textarea().value, "Next request draft");
      assert.deepEqual(changed, ["Next request draft"]);
    } finally { await env.cleanup(); }
  });
}

test("PromptBar stopping disables repeat cancellation", async () => {
  const env = await setup();
  let stopped = 0;
  try {
    await act(async () => env.root.render(<PromptBar status="stopping" onStop={() => stopped++} />));
    assert.equal(button("正在停止…").disabled, true);
    await click(button("正在停止…"));
    assert.equal(stopped, 0);
  } finally { await env.cleanup(); }
});

test("PromptBar running without a stop handler cannot advertise an actionable cancellation", async () => {
  const env = await setup();
  const sent: string[] = [];
  try {
    await act(async () => env.root.render(<PromptBar status="running" value="Draft" onSend={(message) => sent.push(message)} />));
    assert.equal(button("停止生成").disabled, true);
    await click(button("停止生成"));
    assert.deepEqual(sent, []);
    assert.equal(textarea().value, "Draft");
  } finally { await env.cleanup(); }
});

test("PromptBar preserves the next draft through running, stopping and returning to idle", async () => {
  const env = await setup();
  const sent: string[] = [];
  let stopped = 0;
  const props = { onSend: (message: string) => sent.push(message), onStop: () => stopped++ };
  try {
    await act(async () => env.root.render(<PromptBar {...props} status="running" />));
    await typeText("  Follow-up draft  ");
    await click(button("停止生成"));
    assert.equal(stopped, 1);
    assert.equal(textarea().value, "  Follow-up draft  ");

    await act(async () => env.root.render(<PromptBar {...props} status="stopping" />));
    assert.equal(textarea().value, "  Follow-up draft  ");
    await act(async () => env.root.render(<PromptBar {...props} status="idle" />));
    assert.equal(textarea().value, "  Follow-up draft  ");
    assert.equal(button("Send").disabled, false);
    await click(button("Send"));
    assert.deepEqual(sent, ["Follow-up draft"]);
    assert.equal(textarea().value, "");
  } finally { await env.cleanup(); }
});

test("PromptBar exposes custom send, stop and stopping labels", async () => {
  const env = await setup();
  const props = { sendLabel: "发送请求", stopLabel: "中断任务", stoppingLabel: "中断请求已发送", onStop: () => undefined };
  try {
    await act(async () => env.root.render(<PromptBar {...props} />));
    assert.equal(button("发送请求").disabled, true);
    await act(async () => env.root.render(<PromptBar {...props} status="running" />));
    assert.equal(button("中断任务").disabled, false);
    await act(async () => env.root.render(<PromptBar {...props} status="stopping" />));
    assert.equal(button("中断请求已发送").disabled, true);
  } finally { await env.cleanup(); }
});

test("PromptBar Escape closes the command picker without stopping the request or losing the draft", async () => {
  const env = await setup();
  let stopped = 0;
  const sent: string[] = [];
  try {
    await act(async () => env.root.render(<PromptBar status="running" commands={[{ id: "plan", label: "Plan" }]} onStop={() => stopped++} onSend={(message) => sent.push(message)} />));
    await typeText("A draft to keep");
    await click(button("/ commands"));
    assert.ok(document.querySelector("ul"));
    await key(textarea(), "Escape");
    assert.equal(document.querySelector("ul"), null);
    assert.equal(stopped, 0);
    assert.deepEqual(sent, []);
    assert.equal(textarea().value, "A draft to keep");
    await key(textarea(), "Escape");
    assert.equal(stopped, 0);
  } finally { await env.cleanup(); }
});


test("Fullscreen plus menu retains tools and @ / pickers filter and support keyboard dismissal", async () => {
  const env = await setup();
  let attached = 0;
  try {
    await act(async () => env.root.render(<AskAiCompactComposerContext value={true}>
      <PromptBar onAttach={() => attached++} sources={[
        {id:"project",label:"项目资料"},{id:"knowledge",label:"知识库"},
      ]} commands={[{id:"plan",label:"plan"},{id:"summary",label:"summarize"}]} />
    </AskAiCompactComposerContext>));
    await click(button("添加内容和工具"));
    assert.equal(button("添加内容和工具").getAttribute("aria-expanded"), "true");
    assert.equal(document.activeElement?.textContent, "Attach");
    await key(document.activeElement!, "ArrowDown");
    assert.equal(document.activeElement?.textContent, "项目资料");
    await key(document.activeElement!, "Escape");
    assert.equal(document.activeElement, button("添加内容和工具"));
    assert.equal(document.querySelector('[role="menu"]'), null);
    await click(button("添加内容和工具"));
    await click(document.querySelector<HTMLButtonElement>('[role="menuitem"]')!);
    assert.equal(attached, 1);
    assert.equal(document.querySelector('[role="menu"]'), null);

    await typeText("@知");
    assert.equal(document.querySelectorAll('[data-prompt-picker] [role="menuitem"]').length, 1);
    await key(textarea(), "ArrowDown");
    assert.equal(document.activeElement?.textContent, "知识库");
    await click(document.activeElement as HTMLElement);
    assert.match(textarea().value, /@知识库/);
    assert.equal(document.activeElement, textarea());

    await typeText("/pl");
    assert.equal(document.querySelectorAll('[data-prompt-picker] [role="menuitem"]').length, 1);
    assert.match(document.querySelector('[data-prompt-picker]')?.textContent ?? "", /plan/);
    await key(textarea(), "Escape");
    assert.equal(document.querySelector('[data-prompt-picker]'), null);
    await typeText("/pla");
    assert.ok(document.querySelector('[data-prompt-picker]'));
    await key(textarea(), "ArrowDown");
    await click(document.activeElement as HTMLElement);
    assert.equal(textarea().value, "/plan ");
  } finally { await env.cleanup(); }
});
