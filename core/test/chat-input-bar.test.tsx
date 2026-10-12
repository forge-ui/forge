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
    const attachment = document.querySelector<HTMLButtonElement>('button[aria-label="添加附件"]')!;
    assert.equal(attachment.textContent, ""); assert.equal(attachment.title, "添加附件");
    await act(async () => attachment.click()); assert.equal(attached, 1);
    await render(true); await key({}); assert.equal(sent.length, 1);
    await act(async () => root.render(<ChatInputBar multiline sendOnEnter value="前文 @张 后文" onChange={v => changes.push(v)} onSend={v => sent.push(v)} sources={[{ id: "member:1", label: "张三", description: "成员" }]} />));
    const mentionInput = document.querySelector("textarea")!;
    mentionInput.setSelectionRange(5, 5);
    await act(async () => mentionInput.dispatchEvent(new dom.window.Event("select", { bubbles: true })));
    await act(async () => document.querySelector<HTMLButtonElement>('button[aria-label="@ 提及"]')!.click());
    assert.ok(document.querySelector('[role="listbox"]'));
    await key({});
    assert.equal(sent.length, 1, "Enter picks a mention instead of sending");
    assert.ok(changes.at(-1)?.includes("@张三"));
    assert.ok(changes.at(-1)?.endsWith(" 后文"), "insertion preserves text after the caret");
    assert.equal(document.querySelector('[role="listbox"]'), null);

  } finally { await act(async () => root.unmount()); dom.window.close(); }
});
