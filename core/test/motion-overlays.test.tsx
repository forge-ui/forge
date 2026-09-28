import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { Modal } from "../src/components/ui/modal";
import { Accordion } from "../src/components/ui/accordion";
import { ToastProvider, useToast } from "../src/components/ui/toast";
import { TabsContent } from "../src/components/ui/tabs-content";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);
function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost" });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Event: dom.window.Event, MouseEvent: dom.window.MouseEvent, KeyboardEvent: dom.window.KeyboardEvent, getComputedStyle: dom.window.getComputedStyle.bind(dom.window) });
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
  dom.window.HTMLDialogElement.prototype.showModal = function() { this.setAttribute("open", ""); };
  dom.window.HTMLDialogElement.prototype.close = function() { this.removeAttribute("open"); };
  const root = createRoot(document.getElementById("root")!);
  return { root, cleanup: async () => { await act(async () => root.unmount()); dom.window.close(); } };
}
const wait = (ms: number) => act(async () => { await new Promise(resolve => setTimeout(resolve, ms)); });
test("Modal controlled cancel, inert exit, quick reopen and none", async () => {
  const env = setup(); let closed = 0;
  const render = (open: boolean, motion: "auto" | "none" = "auto") => act(async () => env.root.render(<Modal open={open} motion={motion} onOpenChange={() => closed++} title="Example"><button>Action</button></Modal>));
  try {
    await render(true);
    const dialog = document.querySelector('dialog')!;
    assert.equal(dialog.open, true);
    await act(async () => dialog.dispatchEvent(new Event('cancel', { cancelable: true })));
    assert.equal(closed, 1);
    await render(false); assert.equal(dialog.open, true); assert.ok(dialog.querySelector('[inert]'));
    await render(true); await wait(150); assert.equal(dialog.open, true);
    await render(false, "none"); assert.equal(dialog.open, false);
  } finally { await env.cleanup(); }
});
test("Accordion keyboard skips disabled headers and closes content inertly", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<Accordion items={[{value:'a', title:'A', content:'Alpha'},{value:'b',title:'B',content:'Beta',disabled:true},{value:'c',title:'C',content:'Gamma'}]} />));
    const buttons = document.querySelectorAll('button');
    await act(async () => { buttons[0].focus(); buttons[0].dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true})); });
    assert.equal(document.activeElement, buttons[2]);
    await act(async () => buttons[2].click()); assert.equal(buttons[2].getAttribute('aria-expanded'),'true');
    await act(async () => buttons[2].click()); assert.ok(document.getElementById(buttons[2].getAttribute('aria-controls')!)?.closest('[inert]'));
  } finally { await env.cleanup(); }
});
function ToastTest() { const {toast} = useToast(); return <button onClick={()=>toast({title:'Saved',duration:80})}>Notify</button>; }
test("Toast pauses on hover, resumes and can be manually dismissed", async () => {
 const env=setup();
 try {
  await act(async()=>env.root.render(<ToastProvider motion="none"><ToastTest/></ToastProvider>));
  await act(async()=>document.querySelector('button')!.click());
  const row=document.querySelector('li')!;
  await act(async()=>row.dispatchEvent(new MouseEvent('mouseover',{bubbles:true,relatedTarget:document.body})));
  await wait(120); assert.ok(document.querySelector('[role="status"]'));
  await act(async()=>row.dispatchEvent(new MouseEvent('mouseout',{bubbles:true,relatedTarget:document.body})));
  await wait(110); await wait(10); assert.equal(document.querySelector('[role="status"]'),null);
  await act(async()=>document.querySelector('button')!.click());
  await act(async()=>document.querySelector<HTMLButtonElement>('[aria-label="关闭通知：Saved"]')!.click());
  await wait(10); assert.equal(document.querySelector('[role="status"]'),null);
 } finally { await env.cleanup(); }
});
test("TabsContent replaces previous panel content and keeps supplied label", async()=>{
 const env=setup();
 try {
  await act(async()=>env.root.render(<TabsContent activeKey="a" ariaLabel="Details">Alpha</TabsContent>));
  const previous=document.querySelector('[role="tabpanel"]');
  await act(async()=>env.root.render(<TabsContent activeKey="b" ariaLabel="Details">Beta</TabsContent>));
  assert.notEqual(previous,document.querySelector('[role="tabpanel"]'));
  assert.equal(document.querySelector('[role="tabpanel"]')?.textContent,'Beta');
  assert.equal(document.querySelector('[role="tabpanel"]')?.getAttribute('aria-label'),'Details');
 } finally { await env.cleanup(); }
});
