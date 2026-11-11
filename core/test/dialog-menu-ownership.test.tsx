import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { Modal } from "../src/components/ui/modal";
import { KebabMenu } from "../src/components/ui/kebab-menu";
import { fixedPortalCoordinates } from "../src/internal/dialog-ownership";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);
function setup() {
  const dom = new JSDOM('<button id="origin">Origin</button><div id="root"></div>', { url: "http://localhost" });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Event: dom.window.Event, MouseEvent: dom.window.MouseEvent, KeyboardEvent: dom.window.KeyboardEvent, getComputedStyle: dom.window.getComputedStyle.bind(dom.window) });
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
  dom.window.HTMLElement.prototype.getClientRects = function() { return [{ width: 100, height: 32 }] as unknown as DOMRectList; };
  dom.window.HTMLDialogElement.prototype.showModal = function() { this.setAttribute("open", ""); this.querySelector<HTMLButtonElement>('button')?.focus(); };
  dom.window.HTMLDialogElement.prototype.close = function() { this.removeAttribute("open"); this.dispatchEvent(new dom.window.Event('close')); };
  const root = createRoot(document.getElementById("root")!);
  document.getElementById('origin')!.focus();
  return { root, cleanup: async () => { await act(async () => root.unmount()); dom.window.close(); } };
}
const key = (node: Element, value = 'Escape', shiftKey = false) => act(async () => node.dispatchEvent(new KeyboardEvent('keydown', { key: value, shiftKey, bubbles: true, cancelable: true })));
const tick = () => act(async () => { await new Promise(resolve => setTimeout(resolve, 5)); });

test('controlled rejection permits later Escape and backdrop retries', async () => {
  const env = setup(); let closes = 0;
  try {
    await act(async () => env.root.render(<Modal open motion="none" title="Reject" onOpenChange={() => closes++}>Body</Modal>));
    const dialog = document.querySelector('dialog')!;
    await key(dialog); await key(dialog);
    assert.equal(closes, 2);
    await act(async () => dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 99, clientY: 99 })));
    assert.equal(closes, 3); assert.equal(dialog.open, true);
  } finally { await env.cleanup(); }
});

test('DOM-nested cancel and native close belong only to the child', async () => {
  const env = setup(); let parent = 0, child = 0;
  try {
    await act(async () => env.root.render(<Modal open motion="none" title="Parent" onOpenChange={() => parent++}><Modal open motion="none" title="Child" onOpenChange={() => child++}>Child body</Modal></Modal>));
    const dialogs = document.querySelectorAll('dialog');
    await act(async () => dialogs[1].dispatchEvent(new Event('cancel', { cancelable: true, bubbles: true })));
    assert.equal(child, 1); assert.equal(parent, 0);
    await act(async () => dialogs[1].close());
    assert.equal(child, 2); assert.equal(parent, 0);
  } finally { await env.cleanup(); }
});

test('top child consumes Escape and owns its Tab boundary', async () => {
  const env = setup(); let parent = 0, child = 0;
  try {
    await act(async () => env.root.render(<Modal open motion="none" title="Parent" onOpenChange={() => parent++}><button>Parent action</button><Modal open motion="none" title="Child" onOpenChange={() => child++}><button id="last">Last child action</button></Modal></Modal>));
    const dialogs = document.querySelectorAll('dialog');
    document.getElementById('last')!.focus(); await key(document.getElementById('last')!, 'Tab');
    assert.equal(document.activeElement, dialogs[1].querySelector('button'));
    await key(dialogs[1]); assert.equal(child, 1); assert.equal(parent, 0);
  } finally { await env.cleanup(); }
});

test('menu portals to nearest dialog and one Escape closes only the menu', async () => {
  const env = setup(); let parent = 0;
  try {
    await act(async () => env.root.render(<Modal open motion="none" title="Parent" onOpenChange={() => parent++}><KebabMenu motion="none" items={[{ label: 'Action' }]} /></Modal>));
    const trigger = document.querySelector<HTMLButtonElement>('[aria-label="更多操作"]')!;
    await act(async () => trigger.click());
    const menu = document.querySelector<HTMLElement>('[data-forge-kebab-menu]')!;
    assert.equal(menu.parentElement?.hasAttribute('data-forge-dialog-portal'), true);
    assert.equal(menu.closest('dialog'), trigger.closest('dialog'));
    await key(menu); assert.equal(parent, 0); assert.equal(document.querySelector('[data-forge-kebab-menu]'), null); assert.ok(document.activeElement === trigger, 'trigger focus: '+document.activeElement?.outerHTML.slice(0,180));
    await key(trigger); assert.equal(parent, 1);
  } finally { await env.cleanup(); }
});

function MenuChild() {
  const [child, setChild] = useState(false);
  return <Modal open motion="none" title="Parent" onOpenChange={() => {}}><KebabMenu motion="none" items={[{label:'Open child',onSelect:()=>setChild(true)}]} /><Modal open={child} motion="none" title="Child" onOpenChange={setChild}><button>Draft action</button></Modal></Modal>;
}
test('menu selection hands focus to child and child returns to stable trigger', async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<MenuChild />));
    const trigger = document.querySelector<HTMLButtonElement>('[aria-label="更多操作"]')!;
    await act(async () => trigger.click());
    const item = document.querySelector<HTMLButtonElement>('[data-forge-kebab-menu] button')!;
    await act(async () => { item.focus(); item.click(); }); await tick();
    const child = document.querySelector<HTMLDialogElement>('dialog[aria-label="Child"]')!;
    assert.equal(child.open, true); assert.ok(document.activeElement?.closest('dialog') === child, 'child focus: '+document.activeElement?.outerHTML.slice(0,180));
    await key(child); assert.equal(child.open, false); assert.ok(document.activeElement === trigger, 'trigger focus: '+document.activeElement?.outerHTML.slice(0,180));
  } finally { await env.cleanup(); }
});

test('outside click keeps caller focus instead of stealing it to menu trigger', async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<><KebabMenu motion="none" items={[{label:'Action'}]} /><button id="outside">Outside</button></>));
    await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="更多操作"]')!.click());
    const outside = document.getElementById('outside')!;
    await act(async () => { outside.dispatchEvent(new MouseEvent('mousedown', {bubbles:true})); outside.focus(); }); await tick();
    assert.equal(document.activeElement, outside);
  } finally { await env.cleanup(); }
});

test('explicit parent close requests controlled child close and suspends a rejected child', async () => {
  const env = setup(); let childClose = 0;
  const render = (open: boolean) => act(async () => env.root.render(<Modal open={open} motion="none" title="Parent" onOpenChange={() => {}}><Modal open motion="none" title="Child" onOpenChange={()=>childClose++}><button id="draft">Draft</button></Modal></Modal>));
  try {
    await render(true); document.getElementById('draft')!.focus(); await render(false);
    assert.equal(childClose, 1);
    assert.equal(document.querySelector<HTMLDialogElement>('dialog[aria-label="Child"]')!.open, false);
    await key(document.body); assert.equal(childClose, 1);
  } finally { await env.cleanup(); }
});

test('explicit parent close also suspends a sibling child opened from its action', async () => {
  const env = setup(); let childClose = 0;
  function Siblings({ parent }: { parent: boolean }) {
    const [child, setChild] = useState(false);
    return <><Modal open={parent} motion="none" title="Parent" onOpenChange={()=>{}}><button id="launch" onClick={()=>setChild(true)}>Open sibling</button></Modal><Modal open={child} motion="none" title="Child" onOpenChange={()=>childClose++}><button>Draft</button></Modal></>;
  }
  try {
    await act(async () => env.root.render(<Siblings parent />));
    await act(async () => { document.getElementById('launch')!.focus(); document.getElementById('launch')!.click(); });
    assert.equal(document.querySelector<HTMLDialogElement>('dialog[aria-label="Child"]')!.open, true);
    await act(async () => env.root.render(<Siblings parent={false} />));
    assert.equal(childClose, 1);
    assert.equal(document.querySelector<HTMLDialogElement>('dialog[aria-label="Child"]')!.open, false);
    assert.ok(document.activeElement === document.getElementById('origin'), 'explicit parent close returns to original opener');
  } finally { await env.cleanup(); }
});

test('business Escape handlers run before the owning native dialog', async () => {
  const env = setup(); let closes = 0, menuCloses = 0;
  try {
    await act(async () => env.root.render(<Modal open motion="none" title="Parent" onOpenChange={()=>closes++}><div role="dialog" onKeyDown={event=>{if(event.key === 'Escape'){event.preventDefault();event.stopPropagation();menuCloses++;}}}><button id="business">Business action</button></div></Modal>));
    await key(document.getElementById('business')!);
    assert.equal(menuCloses, 1); assert.equal(closes, 0);
  } finally { await env.cleanup(); }
});

test('a closed owner dismisses its menu rather than leaving an orphan layer', async () => {
  const env = setup();
  const render = (open: boolean) => act(async () => env.root.render(<Modal open={open} motion="none" title="Parent" onOpenChange={() => {}}><KebabMenu motion="none" items={[{label:'Action'}]} /></Modal>));
  try {
    await render(true);
    await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="更多操作"]')!.click());
    assert.ok(document.querySelector('[data-forge-kebab-menu]'));
    await render(false); await tick();
    assert.equal(document.querySelector('[data-forge-kebab-menu]'), null);
  } finally { await env.cleanup(); }
});

test('fixed portal coordinates account for transformed origin and scale', () => {
  const env = setup();
  const host = document.createElement('div'); document.body.append(host);
  const append = host.append.bind(host);
  host.append = (...nodes) => { append(...nodes); for (const node of nodes) if (typeof node !== 'string') (node as HTMLElement).getBoundingClientRect = () => ({ left: 40, top: 60, width: 80, height: 80 }) as DOMRect; };
  const position = fixedPortalCoordinates(host, 200, 220);
  assert.deepEqual(position, { left: 200, top: 200, scaleX: .8, scaleY: .8 });
  return env.cleanup();
});
