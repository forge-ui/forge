import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { Accordion } from "../src/components/ui/accordion";
import { ToastProvider, useToast } from "../src/components/ui/toast";
import { TabsContent } from "../src/components/ui/tabs-content";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);
function setup(reduced = false) {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost" });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Event: dom.window.Event, MouseEvent: dom.window.MouseEvent, KeyboardEvent: dom.window.KeyboardEvent, getComputedStyle: dom.window.getComputedStyle.bind(dom.window) });
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({ matches: reduced, addEventListener() {}, removeEventListener() {} }) });
  const root = createRoot(document.getElementById("root")!);
  return { root, cleanup: async () => { await act(async () => root.unmount()); dom.window.close(); } };
}
const wait = (ms: number) => act(async () => { await new Promise(resolve => setTimeout(resolve, ms)); });
test("Accordion keyboard skips disabled headers and closes content inertly", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<Accordion items={[{value:'a', title:'A', content:'Alpha'},{value:'b',title:'B',content:'Beta',disabled:true},{value:'c',title:'C',content:'Gamma'}]} />));
    const buttons = document.querySelectorAll('button');
    await act(async () => { buttons[0].focus(); buttons[0].dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true})); });
    assert.equal(document.activeElement, buttons[2]);
    await act(async () => buttons[2].click()); assert.equal(buttons[2].getAttribute('aria-expanded'),'true');
    await act(async () => buttons[2].click());
    assert.ok(buttons[2].closest('[data-forge-accordion-item]')!.querySelector('.forge-accordion-panel')!.hasAttribute('hidden'));
  } finally { await env.cleanup(); }
});
function ToastTest() { const {toast} = useToast(); return <button onClick={()=>toast({title:'Saved',duration:80})}>Notify</button>; }
test("Toast pauses while the pointer is over the notifications, resumes and can be manually dismissed", async () => {
 const env=setup();
 try {
  await act(async()=>env.root.render(<ToastProvider motion="none"><ToastTest/></ToastProvider>));
  await act(async()=>document.querySelector('button')!.click());
  const viewport=document.querySelector('.forge-toast-list')!;
  // React derives onMouseEnter/Leave from mouseover/mouseout.
  await act(async()=>viewport.dispatchEvent(new MouseEvent('mouseover',{bubbles:true,relatedTarget:document.body})));
  await wait(120); assert.ok(document.querySelector('[data-toast-id]'), 'hover keeps the toast');
  await act(async()=>viewport.dispatchEvent(new MouseEvent('mouseout',{bubbles:true,relatedTarget:document.body})));
  await wait(200); assert.ok(!document.querySelector('[data-toast-id]'));
  await act(async()=>document.querySelector('button')!.click());
  await act(async()=>document.querySelector<HTMLButtonElement>('[aria-label="关闭通知：Saved"]')!.click());
  await wait(10); assert.ok(!document.querySelector('[data-toast-id]'));
 } finally { await env.cleanup(); }
});

test("TabsContent replaces previous panel content and keeps supplied label", async()=>{
 const env=setup();
 try {
  await act(async()=>env.root.render(<TabsContent activeKey="a" ariaLabel="Details">Alpha</TabsContent>));
  const previous=document.querySelector('[role="tabpanel"]');
  assert.ok(previous?.classList.contains('forge-tabs-content'));
  assert.equal(previous?.classList.contains('forge-motion-surface'), false);
  await act(async()=>env.root.render(<TabsContent activeKey="b" ariaLabel="Details">Beta</TabsContent>));
  assert.notEqual(previous,document.querySelector('[role="tabpanel"]'));
  assert.equal(document.querySelector('[role="tabpanel"]')?.textContent,'Beta');
  assert.equal(document.querySelector('[role="tabpanel"]')?.getAttribute('aria-label'),'Details');
  const current=document.querySelector('[role="tabpanel"]');
  await act(async()=>env.root.render(<TabsContent activeKey="b" motion="none" ariaLabel="Details">Updated</TabsContent>));
  assert.equal(document.querySelector('[role="tabpanel"]'),current);
  assert.equal(current?.getAttribute('data-motion'),'none');
  for (const activeKey of ['c','a','b','c']) {
    await act(async()=>env.root.render(<TabsContent activeKey={activeKey} motion="none" ariaLabel="Details">{activeKey}</TabsContent>));
    assert.equal(document.querySelectorAll('[role="tabpanel"]').length,1);
    assert.equal(document.querySelector('[role="tabpanel"]')?.textContent,activeKey);
  }
 } finally { await env.cleanup(); }
});
