import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act } from "react";
import { ChatInputBar } from "../src/components/ui/chat-input-bar";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);
test("ChatInputBar respects IME, Shift+Enter, attachment and async draft ownership", async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window, document: dom.window.document, requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window), HTMLElement: dom.window.HTMLElement });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  const sent: string[] = []; const changes: string[] = []; let attached = 0;
  const render = (sendDisabled = false) => act(async () => root.render(<ChatInputBar multiline sendOnEnter clearOnSend={false} value="草稿" onChange={v => changes.push(v)} onSend={v => sent.push(v)} onAttach={() => attached++} showAttachment sendDisabled={sendDisabled} />));
  try {
    await render();
    const input = document.querySelector("textarea")!;
    const key = (options: KeyboardEventInit) => act(async () => { input.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true, ...options })); });
    await key({ isComposing: true }); await key({ keyCode: 229 }); await key({ shiftKey: true });
    assert.equal(sent.length, 0);
    await key({}); assert.deepEqual(sent, ["草稿"]); assert.equal(changes.length, 0);
    await act(async () => document.querySelector<HTMLButtonElement>('button[aria-label="添加内容和工具"]')!.click());
    const attachment = document.querySelector<HTMLButtonElement>('button[aria-label="添加附件"]')!;
    assert.equal(attachment.textContent, "添加附件"); assert.equal(attachment.title, "添加附件");
    await act(async () => attachment.click()); assert.equal(attached, 1);
    await render(true); await key({}); assert.equal(sent.length, 1);
    await act(async () => root.render(<ChatInputBar multiline sendOnEnter value="前文 @张 后文" onChange={v => changes.push(v)} onSend={v => sent.push(v)} sources={[{ id: "member:1", label: "张三", description: "成员" }]} />));
    const mentionInput = document.querySelector("textarea")!;
    mentionInput.setSelectionRange(5, 5);
    await act(async () => mentionInput.dispatchEvent(new dom.window.Event("select", { bubbles: true })));
    await act(async () => document.querySelector<HTMLButtonElement>('button[aria-label="添加内容和工具"]')!.click());
    await act(async () => document.querySelector<HTMLButtonElement>('[role="menuitem"]')!.click());
    assert.equal(document.querySelector('[role="menu"]'), null);
    assert.equal(mentionInput.getAttribute("aria-haspopup"), "listbox");
    assert.equal(mentionInput.hasAttribute("aria-expanded"), false);
    assert.equal(sent.length, 1, "The plus menu picks a mention without sending");
    assert.ok(changes.at(-1)?.includes("@张三"));
    assert.ok(changes.at(-1)?.endsWith(" 后文"), "insertion preserves text after the caret");
    assert.equal(document.querySelector('[role="listbox"]'), null);

  } finally { await act(async () => root.unmount()); dom.window.close(); }
});

test("ChatInputBar model selection and controlled stop states work in both layouts", async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost" });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement });
  dom.window.HTMLElement.prototype.showPopover = function() {};
  dom.window.HTMLElement.prototype.hidePopover = function() {};
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  let stops = 0; const models: string[] = []; const sent: string[] = [];
  try {
    for (const multiline of [false, true]) {
      const props = { multiline, value: "保留草稿", models: [{ id: "a", label: "Alpha" }, { id: "b", label: "Beta" }], model: "a", onModelChange: (id: string) => models.push(id), onStop: () => stops++, onSend: (value: string) => sent.push(value) };
      await act(async () => root.render(<ChatInputBar {...props} status="running" disabled />));
      const stop = document.querySelector<HTMLButtonElement>('[aria-label="停止生成"]')!;
      assert.equal(stop.disabled, false, "editing disabled must not disable cancellation");
      await act(async () => stop.click());
      await act(async () => root.render(<ChatInputBar {...props} status="stopping" />));
      assert.equal(document.querySelector<HTMLButtonElement>('[aria-label="正在停止…"]')!.disabled, true);
      assert.equal(document.querySelector('[aria-label="正在停止…"]')!.getAttribute("aria-busy"), "true");
      await act(async () => root.render(<ChatInputBar {...props} status="idle" sendDisabled />));
      assert.equal(document.querySelector<HTMLButtonElement>('[aria-label="发送消息"]')!.disabled, true);
      const trigger = document.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!;
      await act(async () => trigger.click());
      await act(async () => Array.from(document.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')).find(item => item.textContent === "Beta")!.click());
      assert.equal((document.querySelector("input,textarea") as HTMLInputElement).value, "保留草稿");
    }
    assert.equal(stops, 2); assert.deepEqual(models, ["b", "b"]); assert.deepEqual(sent, []);
  } finally { await act(async () => root.unmount()); dom.window.close(); }
});

for (const props of [{multiline:false}, {multiline:true}, {multiline:true,density:"compact" as const}]) {
  test(`plus menu contains attachments, mentions and commands in ${JSON.stringify(props)}`, async () => {
    const dom = new JSDOM('<div id="root"></div>', {url:"http://localhost"});
    Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT:true,window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement});
    const {createRoot} = await import("react-dom/client"); const root = createRoot(document.getElementById("root")!); let attached = 0;
    try {
      await act(async () => root.render(<ChatInputBar {...props} onAttach={() => attached++} sources={[{id:"doc",label:"资料"}]} commands={[{id:"plan",label:"plan"}]} />));
      assert.equal(document.querySelector('[aria-label="@ 提及"]'),null);
      assert.equal(document.querySelector('[aria-label="/ 命令"]'),null);
      assert.equal(document.querySelector('[aria-label="添加附件"]'),null);
      const plus = document.querySelector<HTMLButtonElement>('button[aria-label="添加内容和工具"]')!;
      await act(async () => plus.click());
      assert.equal(plus.getAttribute("aria-expanded"),"true");
      const menu = document.querySelector('[role="menu"]')!;
      assert.ok(menu.textContent?.includes("资料") && menu.textContent?.includes("/plan"));
      await act(async () => menu.querySelector<HTMLButtonElement>('[aria-label="添加附件"]')!.click());
      assert.equal(attached,1); assert.equal(document.querySelector('[role="menu"]'),null);
    } finally {await act(async () => root.unmount());dom.window.close();}
  });
}
