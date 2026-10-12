import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act } from "react";
import { ChatInputBar, type ChatInputBarSendContext } from "../src/components/ui/chat-input-bar";
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
    await act(async () => input.dispatchEvent(new dom.window.CompositionEvent("compositionstart", { bubbles: true })));
    await key({ isComposing: false });
    assert.equal(sent.length, 0, "composition lifecycle protects browsers with missing key flags");
    await act(async () => input.dispatchEvent(new dom.window.CompositionEvent("compositionend", { bubbles: true })));
    await key({});
    assert.equal(sent.length, 0, "candidate-confirming Enter after compositionend must not send");
    await new Promise(resolve => setTimeout(resolve, 90));
    const changesBeforeSend = changes.length;
    await key({}); assert.deepEqual(sent, ["草稿"]); assert.equal(changes.length, changesBeforeSend);
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

for (const multiline of [false, true]) {
  test(`quick action selection preserves drafts and sends operation metadata (${multiline})`, async () => {
    const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window, document: dom.window.document, requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window), HTMLElement: dom.window.HTMLElement });
    const { createRoot } = await import("react-dom/client");
    const root = createRoot(document.getElementById("root")!);
    const changes: string[] = []; const sent: string[] = []; const actions: string[] = [];
    const quickActions = [{ id: "event", kind: "event" as const, label: "安排日程", placeholder: "什么活动，什么时候？" }];
    const render = (value: string, disabled = false, clearOnSend = true) => act(async () => root.render(<ChatInputBar multiline={multiline} value={value} disabled={disabled} clearOnSend={clearOnSend} onChange={text => changes.push(text)} onSend={(text, action) => { sent.push(text); actions.push(action?.id ?? "none"); }} onAttach={() => {}} quickActions={quickActions} />));
    try {
      await render("原有草稿");
      const card = document.querySelector<HTMLButtonElement>('.forge-quick-card')!;
      assert.equal(card.disabled, false);
      await act(async () => card.click());
      assert.deepEqual(changes, [], "selection must not insert the hint into a draft");
      const input = document.querySelector<HTMLInputElement | HTMLTextAreaElement>('input,textarea')!;
      assert.equal(input.value, "原有草稿");
      assert.equal(input.placeholder, "什么活动，什么时候？");
      assert.ok(document.querySelector('button[aria-label="移除操作：安排日程"]'));
      assert.equal(card.disabled, true);
      await act(async () => document.querySelector<HTMLButtonElement>('button[aria-label="发送消息"]')!.click());
      assert.deepEqual(sent, ["原有草稿"]); assert.deepEqual(actions, ["event"]);
      await render("");
      await act(async () => document.querySelector<HTMLButtonElement>('button[aria-label="添加内容和工具"]')!.click());
      assert.ok(document.querySelector('button[aria-label="添加附件"]'));
      await act(async () => [...document.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]')].find(button => button.textContent === "快捷操作")!.click());
      await act(async () => card.click());
      await act(async () => input.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Backspace", bubbles: true, cancelable: true })));
      assert.equal(input.placeholder, "输入消息...");
      assert.equal(card.disabled, false, "removing an operation restores its fan");
      await render("异步草稿", false, false);
      await act(async () => card.click());
      await act(async () => document.querySelector<HTMLButtonElement>('button[aria-label="发送消息"]')!.click());
      assert.ok(document.querySelector('button[aria-label="移除操作：安排日程"]'), "async draft ownership includes its selected operation");
      assert.equal(actions.at(-1), "event");
      await render("", true); assert.equal(card.disabled, true);
      await act(async () => root.render(<ChatInputBar />));
      assert.equal(document.querySelector('.forge-quick-fan'), null);
    } finally { await act(async () => root.unmount()); dom.window.close(); }
  });
}

for (const multiline of [false, true]) {
  test(`quick cards follow conversation state and blank areas focus the input (${multiline})`, async () => {
    const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window, document: dom.window.document, requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window), HTMLElement: dom.window.HTMLElement });
    const { createRoot } = await import("react-dom/client");
    const root = createRoot(document.getElementById("root")!);
    const quickActions = [{ id: "note", label: "写笔记", kind: "note" as const }];
    const render = (hasMessages?: boolean, disabled = false, defaultQuickActionsOpen = true) => act(async () => root.render(<div role="region"><ChatInputBar multiline={multiline} hasMessages={hasMessages} disabled={disabled} defaultQuickActionsOpen={defaultQuickActionsOpen} quickActions={quickActions} value="草稿" models={[{ id: "quick", label: "Quick" }]} /></div>));
    const isOpen = () => document.querySelector('.forge-quick-fan')!.hasAttribute('data-open');
    const pointer = (element: Element) => act(async () => element.dispatchEvent(new dom.window.MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 })));
    const openManually = async () => {
      await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="添加内容和工具"]')!.click());
      await act(async () => document.querySelector<HTMLButtonElement>('[role="menuitem"]')!.click());
    };
    try {
      await render(true);
      assert.equal(isOpen(), false, 'existing conversation starts closed');
      await openManually();
      assert.equal(isOpen(), true);
      await render(true);
      assert.equal(isOpen(), true, 'rerenders preserve manual opening');
      await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="发送消息"]')!.click());
      assert.equal(isOpen(), false, 'sending closes a manually opened fan');
      await render(false);
      assert.equal(isOpen(), true, 'a new empty conversation opens automatically');
      const input = document.querySelector<HTMLInputElement | HTMLTextAreaElement>('input,textarea')!;
      assert.equal(input.value, '草稿', 'draft content is independent of message history');
      const surface = document.querySelector<HTMLElement>('.forge-composer-surface')!;
      const plus = document.querySelector<HTMLButtonElement>('[aria-label="添加内容和工具"]')!;
      const model = document.querySelector<HTMLButtonElement>('[aria-label^="Model:"]')!;
      assert.ok(plus.compareDocumentPosition(model) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING, 'plus precedes right-side model controls');
      for (const blank of [surface, document.querySelector('.forge-composer-entry')!, document.querySelector('.forge-composer-input-wrap')!]) {
        input.blur(); await pointer(blank); assert.equal(document.activeElement, input);
      }
      plus.focus(); await pointer(plus.querySelector('svg') ?? plus);
      assert.equal(document.activeElement, plus, 'tool icons keep their own focus');
      input.focus(); input.setSelectionRange(0, 1); await pointer(input);
      assert.equal(input.selectionEnd, 1, 'native text selection is preserved');
      await render(true); assert.equal(isOpen(), false, 'incoming messages close the automatically opened fan');
      model.focus();
      await render(false, true); await pointer(surface);
      assert.notEqual(document.activeElement, input, 'disabled blank area cannot focus');
      assert.equal(isOpen(), false);
      await render(true, false, false); await render(false, false, false);
      assert.equal(isOpen(), false, 'automatic opening can be disabled');
      await openManually(); assert.equal(isOpen(), true);
      await act(async () => root.render(<ChatInputBar key="uncontrolled" quickActions={quickActions} value="发送" />));
      assert.equal(isOpen(), true);
      await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="发送消息"]')!.click());
      assert.equal(isOpen(), false, 'without history props the first send closes cards');
    } finally { await act(async () => root.unmount()); dom.window.close(); }
  });
}

for (const multiline of [false, true]) test(`typed mention chips preserve draft and provide structured send context (${multiline})`, async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost', pretendToBeVisual: true });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window, document: dom.window.document, requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window), HTMLElement: dom.window.HTMLElement });
  const { createRoot } = await import('react-dom/client'); const root = createRoot(document.getElementById('root')!);
  const source = { id: 'skill:feedback', label: '反馈问题', kind: 'skill' as const, placeholder: '描述现象' };
  const sent: string[] = [], ids: string[][] = [];
  const props = { multiline, sources: [source], onSend: (message: string, _action: unknown, context?: ChatInputBarSendContext) => { sent.push(message); ids.push(context?.sources.map(item => item.id) ?? []); } };
  const choose = async () => {
    await act(async () => document.querySelector<HTMLButtonElement>('button[aria-label="添加内容和工具"]')!.click());
    await act(async () => [...document.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')].find(item => item.textContent?.includes('反馈问题'))!.click());
  };
  try {
    await act(async () => root.render(<ChatInputBar {...props} value="原有草稿" clearOnSend={false} />));
    await choose(); await choose();
    assert.equal(document.querySelectorAll('[data-composer-source]').length, 1, 'deduplicate by stable ID');
    assert.equal(document.querySelector('input,textarea')!.getAttribute('value') ?? (document.querySelector('textarea') as HTMLTextAreaElement)?.value, '原有草稿');
    await act(async () => document.querySelector<HTMLButtonElement>('button[aria-label="发送消息"]')!.click());
    assert.deepEqual(sent, ['原有草稿']); assert.deepEqual(ids, [['skill:feedback']]);
    assert.equal(document.querySelectorAll('[data-composer-source]').length, 1);
    await act(async () => root.render(<ChatInputBar {...props} value="" />));
    assert.equal(document.querySelector('input,textarea')!.getAttribute('placeholder'), '描述现象');
    await act(async () => document.querySelector('input,textarea')!.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true })));
    assert.equal(document.querySelectorAll('[data-composer-source]').length, 0);
    await choose(); await act(async () => root.render(<ChatInputBar {...props} value="发送后清空" />));
    await act(async () => document.querySelector<HTMLButtonElement>('button[aria-label="发送消息"]')!.click());
    assert.deepEqual(ids.at(-1), ['skill:feedback']); assert.equal(document.querySelectorAll('[data-composer-source]').length, 0);
    const agent = { id: 'agent:design', kind: 'agent' as const, label: '设计智能体', avatarSrc: '/agent.png' };
    await act(async () => root.render(<ChatInputBar key="agent" multiline={multiline} defaultSelectedSources={[agent]} />));
    const chip = document.querySelector('[data-composer-source="agent:design"]')!;
    assert.equal(chip.querySelector('img')?.getAttribute('src'), '/agent.png');
    assert.ok(chip.textContent?.includes('设计智能体'));
  } finally { await act(async () => root.unmount()); dom.window.close(); }
});
