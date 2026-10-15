import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act } from "react";
import { AskAiCompactComposerContext } from "../src/internal/ask-ai-composer-context";
import { ChatInputBar } from "../src/components/ui/chat-input-bar";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

async function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: dom.window,
    self: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
    cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
    Event: dom.window.Event,
    KeyboardEvent: dom.window.KeyboardEvent,
  });
  dom.window.HTMLElement.prototype.scrollIntoView = () => undefined;
  // Initialize React's input event support after installing the browser globals.
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return {
    root,
    // Advance a real asynchronous browser frame instead of recursively invoking RAF callbacks.
    frame: () => act(async () => { await new Promise<void>(resolve => dom.window.requestAnimationFrame(() => resolve())); }),
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

test("ChatInputBar configured composer sends and preserves trimming, trimming and clearing behavior", async () => {
  const env = await setup();
  const sent: string[] = [];
  try {
    await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" onSend={(message) => sent.push(message)} />));
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

test("ChatInputBar can stop a running request with an empty draft", async () => {
  const env = await setup();
  let stopped = 0;
  const sent: string[] = [];
  try {
    await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" status="running" onStop={() => stopped++} onSend={(message) => sent.push(message)} />));
    assert.equal(textarea().value, "");
    assert.equal(button("停止生成").disabled, false);
    await click(button("停止生成"));
    assert.equal(stopped, 1);
    assert.deepEqual(sent, []);
    assert.equal(textarea().value, "");
  } finally { await env.cleanup(); }
});

test("ChatInputBar disabled prevents editing and sending while keeping a running request stoppable", async () => {
  const env = await setup();
  let stopped = 0;
  const sent: string[] = [];
  const props = { disabled: true, value: "Existing draft", onSend: (message: string) => sent.push(message), onStop: () => stopped++ };
  try {
    await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" {...props} />));
    assert.equal(textarea().disabled, true);
    assert.equal(button("Send").disabled, true);
    await click(button("Send"));
    assert.deepEqual(sent, []);

    await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" {...props} status="running" />));
    assert.equal(textarea().disabled, true);
    assert.equal(button("停止生成").disabled, false);
    await click(button("停止生成"));
    assert.equal(stopped, 1);
    assert.deepEqual(sent, []);
    assert.equal(textarea().value, "Existing draft");
  } finally { await env.cleanup(); }
});

for (const status of ["running", "stopping"] as const) {
  test(`ChatInputBar ${status} keeps typed drafts and Enter never sends or stops`, async () => {
    const env = await setup();
    let stopped = 0;
    const sent: string[] = [];
    const changed: string[] = [];
    try {
      await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" status={status} onChange={(value) => changed.push(value)} onSend={(message) => sent.push(message)} onStop={() => stopped++} />));
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

test("ChatInputBar stopping disables repeat cancellation", async () => {
  const env = await setup();
  let stopped = 0;
  try {
    await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" status="stopping" onStop={() => stopped++} />));
    assert.equal(button("正在停止…").disabled, true);
    await click(button("正在停止…"));
    assert.equal(stopped, 0);
  } finally { await env.cleanup(); }
});

test("ChatInputBar running without a stop handler cannot advertise an actionable cancellation", async () => {
  const env = await setup();
  const sent: string[] = [];
  try {
    await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" status="running" value="Draft" onSend={(message) => sent.push(message)} />));
    assert.equal(button("停止生成").disabled, true);
    await click(button("停止生成"));
    assert.deepEqual(sent, []);
    assert.equal(textarea().value, "Draft");
  } finally { await env.cleanup(); }
});

test("ChatInputBar preserves the next draft through running, stopping and returning to idle", async () => {
  const env = await setup();
  const sent: string[] = [];
  let stopped = 0;
  const props = { onSend: (message: string) => sent.push(message), onStop: () => stopped++ };
  try {
    await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" {...props} status="running" />));
    await typeText("  Follow-up draft  ");
    await click(button("停止生成"));
    assert.equal(stopped, 1);
    assert.equal(textarea().value, "  Follow-up draft  ");

    await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" {...props} status="stopping" />));
    assert.equal(textarea().value, "  Follow-up draft  ");
    await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" {...props} status="idle" />));
    assert.equal(textarea().value, "  Follow-up draft  ");
    assert.equal(button("Send").disabled, false);
    await click(button("Send"));
    assert.deepEqual(sent, ["Follow-up draft"]);
    assert.equal(textarea().value, "");
  } finally { await env.cleanup(); }
});

test("ChatInputBar exposes custom send, stop and stopping labels", async () => {
  const env = await setup();
  const props = { sendLabel: "发送请求", stopLabel: "中断任务", stoppingLabel: "中断请求已发送", onStop: () => undefined };
  try {
    await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" {...props} />));
    assert.equal(button("发送请求").disabled, true);
    await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" {...props} status="running" />));
    assert.equal(button("中断任务").disabled, false);
    await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" {...props} status="stopping" />));
    assert.equal(button("中断请求已发送").disabled, true);
  } finally { await env.cleanup(); }
});

test("ChatInputBar Escape closes the command picker without stopping the request or losing the draft", async () => {
  const env = await setup();
  let stopped = 0;
  const sent: string[] = [];
  try {
    await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" status="running" commands={[{ id: "plan", label: "Plan" }]} onStop={() => stopped++} onSend={(message) => sent.push(message)} />));
    await typeText("A draft to keep");
    await typeText("A draft to keep /pl");
    assert.ok(document.querySelector("ul"));
    await key(textarea(), "Escape");
    assert.equal(document.querySelector("ul"), null);
    assert.equal(stopped, 0);
    assert.deepEqual(sent, []);
    assert.equal(textarea().value, "A draft to keep /pl");
    await key(textarea(), "Escape");
    assert.equal(stopped, 0);
  } finally { await env.cleanup(); }
});


test("Fullscreen plus menu retains tools and @ / pickers filter and support keyboard dismissal", async () => {
  const env = await setup();
  let attached = 0;
  try {
    await act(async () => env.root.render(<AskAiCompactComposerContext value={true}>
      <ChatInputBar multiline sendOnEnter sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" toolsMenuLabel="Content and tools" onAttach={() => attached++} sources={[
        {id:"project",label:"项目资料"},{id:"knowledge",label:"知识库"},
      ]} commands={[{id:"plan",label:"plan"},{id:"summary",label:"summarize"}]} />
    </AskAiCompactComposerContext>));
    await click(button("Content and tools"));
    assert.equal(button("Content and tools").getAttribute("aria-expanded"), "true");
    assert.equal(document.activeElement?.textContent, "Attach");
    await key(document.activeElement!, "ArrowDown");
    assert.equal(document.activeElement?.textContent, "项目资料");
    await key(document.activeElement!, "Escape");
    assert.equal(document.activeElement, button("Content and tools"));
    assert.equal(document.querySelector('[role="menu"]'), null);
    await click(button("Content and tools"));
    await click(document.querySelector<HTMLButtonElement>('[role="menuitem"]')!);
    assert.equal(attached, 1);
    assert.equal(document.querySelector('[role="menu"]'), null);

    await typeText("@知");
    assert.equal(document.querySelectorAll('[data-prompt-picker] [role="option"]').length, 1);
    await key(textarea(), "ArrowDown");
    assert.equal(textarea().getAttribute("aria-activedescendant"), document.querySelector('[data-prompt-picker] [role="option"]')?.id);
    await key(textarea(), "Enter");
    await env.frame();
    assert.match(textarea().value, /@知识库/);
    assert.equal(document.activeElement, textarea());

    await typeText("/pl");
    assert.equal(document.querySelectorAll('[data-prompt-picker] [role="option"]').length, 1);
    assert.match(document.querySelector('[data-prompt-picker]')?.textContent ?? "", /plan/);
    await key(textarea(), "Escape");
    assert.equal(document.querySelector('[data-prompt-picker]'), null);
    await typeText("/pla");
    assert.ok(document.querySelector('[data-prompt-picker]'));
    await key(textarea(), "ArrowDown");
    await key(textarea(), "Enter");
    await env.frame();
    assert.equal(textarea().value, "/plan ");
  } finally { await env.cleanup(); }
});

test("ChatInputBar shares draft ownership, send-only disabling and keyboard policy", async () => {
  const env = await setup(); const sent: string[] = []; const changes: string[] = [];
  const props = { value: "draft", onChange: (v: string) => changes.push(v), onSend: (v: string) => sent.push(v), clearOnSend: false, sendOnEnter: false };
  try {
    await act(async () => env.root.render(<ChatInputBar multiline sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" {...props} sendDisabled />));
    assert.equal(textarea().disabled, false);
    assert.equal(button("Send").disabled, true);
    await act(async () => env.root.render(<ChatInputBar multiline sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" {...props} />));
    await key(textarea(), "Enter"); assert.deepEqual(sent, []);
    await click(button("Send")); assert.deepEqual(sent, ["draft"]); assert.deepEqual(changes, []);
    assert.equal(textarea().value, "draft");
  } finally { await env.cleanup(); }
});

test("unified composer combines mentions, attachment, commands, permissions and models", async () => {
  const env = await setup(); let attached = 0; const selected: string[] = []; const changed: string[] = [];
  const prototype = window.HTMLElement.prototype as HTMLElement & { showPopover: () => void; hidePopover: () => void };
  prototype.showPopover = () => undefined; prototype.hidePopover = () => undefined;
  try {
    await act(async () => env.root.render(<ChatInputBar multiline sendOnEnter sendLabel="Send" sourcesLabel="Sources" commandsLabel="Commands" attachLabel="Attach" onAttach={() => attached++} toggles={[{id:"web",label:"联网"}]}
      sources={[{id:"doc",label:"资料"}]} commands={[{id:"plan",label:"plan"}]}
      models={[{id:"auto",label:"Auto"}]} permissions={[{id:"read",label:"只读"},{id:"write",label:"可编辑"}]}
      permission="read" onPermissionChange={id => selected.push(id)} onChange={value => changed.push(value)} />));
    await click(button("添加内容和工具"));
    await click(button("Attach")); assert.equal(attached, 1);
    assert.ok(button("联网")); assert.ok(button("添加内容和工具")); assert.ok(button("Model: Auto"));
    await click(button("权限: 只读"));
    await click([...document.querySelectorAll<HTMLButtonElement>('button[role="menuitemradio"]')].find(item => item.textContent === "可编辑")!);
    assert.deepEqual(selected, ["write"]); assert.equal(textarea().value, "");
    await typeText("前文 /pl 后文");
    textarea().setSelectionRange(6, 6);
    await act(async () => textarea().dispatchEvent(new Event("select", {bubbles:true})));
    await click(button("添加内容和工具"));
    await click([...document.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')].find(item => item.textContent === "/plan")!);
    assert.equal(changed.at(-1), "前文 /plan  后文");
  } finally { await env.cleanup(); }
});

test("ChatInputBar attachment-only sends require explicit readiness and respect upload and generation locks", async () => {
  const env = await setup();
  const sent: string[] = [];
  const props = { multiline: true, sendOnEnter: true, sendLabel: "Send", onSend: (message: string) => sent.push(message) };
  try {
    await act(async () => env.root.render(<ChatInputBar {...props} attachments={<span>file.pdf</span>} />));
    assert.equal(button("Send").disabled, true);
    await key(textarea(), "Enter");
    assert.deepEqual(sent, []);
    await act(async () => env.root.render(<ChatInputBar {...props} hasAttachments sendDisabled />));
    await key(textarea(), "Enter");
    assert.equal(button("Send").disabled, true);
    assert.deepEqual(sent, []);
    await act(async () => env.root.render(<ChatInputBar {...props} hasAttachments />));
    assert.equal(button("Send").disabled, false);
    await click(button("Send"));
    await key(textarea(), "Enter");
    assert.deepEqual(sent, ["", ""]);
    await act(async () => env.root.render(<ChatInputBar {...props} hasAttachments status="running" />));
    await key(textarea(), "Enter");
    assert.deepEqual(sent, ["", ""]);
    await act(async () => env.root.render(<ChatInputBar {...props} hasAttachments={false} />));
    assert.equal(button("Send").disabled, true);
  } finally { await env.cleanup(); }
});
