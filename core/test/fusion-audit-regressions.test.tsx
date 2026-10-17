import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { Datepicker } from "../src/components/ui/forms/datepicker";
import { TextField } from "../src/components/ui/forms/text-field";
import { SwipeRow } from "../src/internal/swipe-row";
import { ChatReactions } from "../src/internal/chat-interactions";
import { ReviewItem } from "../src/components/ui/review-item";
import { AddMember } from "../src/components/ui/add-member";
import { AppSwitcherDropdown, ProfileDropdown } from "../src/components/layouts/sidebar-popovers";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);
async function setup(initialReduced = true) {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  let reduced = initialReduced;
  const listeners = new Set<() => void>();
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({ matches: reduced, addEventListener: (_: string, listener: () => void) => listeners.add(listener), removeEventListener: (_: string, listener: () => void) => listeners.delete(listener) }) });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, SVGElement: dom.window.SVGElement, getComputedStyle: dom.window.getComputedStyle.bind(dom.window), requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window), cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window) });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return { dom, setReduced: (value: boolean) => { reduced = value; listeners.forEach(listener => listener()); }, render: (node: ReactNode) => act(async () => root.render(node)), close: async () => { await act(async () => root.unmount()); dom.window.close(); } };
}

const button = (text: string) => Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(node => node.textContent === text)!;
const click = (node: HTMLElement) => act(async () => node.click());

test("inline range retains draft on endpoint clicks and adopts external resets by value", async () => {
  const env = await setup();
  let result: Date[] = [];
  const props = { inline: true, mode: "range" as const, confirmSelection: true, locale: "en" as const, rangeLabels: ["Start", "End"] as [string,string], onRangeChange: (a: Date,b: Date|null) => { result = b ? [a,b] : [a]; } };
  const start = new Date(2026,9,14), end = new Date(2026,9,17);
  try {
    await env.render(<Datepicker {...props} rangeStart={start} rangeEnd={end} />);
    await click(button("15")); await click(button("18"));
    await click(Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(n => n.textContent?.startsWith("End"))!);
    assert.equal(button("Apply").disabled, false);
    // Equal Date objects from a parent render must not discard the draft.
    await env.render(<Datepicker {...props} rangeStart={new Date(start)} rangeEnd={new Date(end)} />);
    await click(button("Apply")); assert.equal(result[0].getDate(),15); assert.equal(result[1].getDate(),18);
    await env.render(<Datepicker {...props} rangeStart={new Date(2026,10,10)} rangeEnd={new Date(2026,10,12)} />);
    await click(button("Apply")); assert.equal(result[0].getMonth(),10); assert.equal(result[0].getDate(),10); assert.equal(result[1].getDate(),12);
    await env.render(<Datepicker {...props} />); assert.equal(button("Apply").disabled,true);
  } finally { await env.close(); }
});

test("calendar keeps an enabled tab stop and clamps month-end navigation", async () => {
  const env = await setup();
  try {
    await env.render(<Datepicker inline value={new Date(2026,9,1)} minDate={new Date(2026,9,15)} />);
    assert.equal(document.querySelectorAll('button[data-date][tabindex="0"]:not(:disabled)').length,1);
    assert.equal(document.querySelector('button[data-date][tabindex="0"]')!.textContent,"15");
    await env.render(<Datepicker key="month" inline locale="en" value={new Date(2026,0,31)} />);
    await act(async () => document.querySelector('button[data-date][tabindex="0"]')!.dispatchEvent(new env.dom.window.KeyboardEvent("keydown",{key:"PageDown",bubbles:true})));
    assert.equal(document.activeElement?.getAttribute("aria-label"),"Feb 28, 2026");
  } finally { await env.close(); }
});

test("disabled tag fields expose no active removal operation", async () => {
  const env = await setup(); let calls = 0;
  try {
    for (const disabled of [true,false]) {
      await env.render(<TextField disabled={disabled} state={disabled ? undefined : "disabled"} tags={[{label:"Forge",value:"forge"}]} onRemoveTag={() => calls++} />);
      assert.equal(document.querySelectorAll("button:not(:disabled)").length,0); assert.equal(calls,0);
    }
  } finally { await env.close(); }
});

test("swipe requires primary button and the same pointer through completion", async () => {
  const env = await setup(); let calls=0;
  try {
    await env.render(<SwipeRow label="Delete" onAction={() => calls++} motion="none">Message</SwipeRow>);
    const row=document.querySelector(".forge-swipe-content")!;
    const fire=async(type:string,x:number,id=1,mouseButton=0,primary=true) => act(async()=>{
      const event=new env.dom.window.MouseEvent(type,{bubbles:true,clientX:x,button:mouseButton});
      Object.defineProperties(event,{pointerId:{value:id},isPrimary:{value:primary}});row.dispatchEvent(event);
    });
    await fire("pointerdown",180,1,2);await fire("pointermove",0);await fire("pointerup",0);assert.equal(calls,0);
    await fire("pointerdown",180);await fire("pointermove",0);await fire("pointerup",0,2);assert.equal(calls,0);
    await fire("pointercancel",0,2);await fire("pointerup",0,1);assert.equal(calls,1);
    await fire("pointerdown",180,2,0,false);await fire("pointermove",0,2);await fire("pointerup",0,2);assert.equal(calls,1);
    await fire("pointerdown",180);await fire("pointermove",0);await fire("pointercancel",0);await fire("pointerup",0);assert.equal(calls,1);
  } finally { await env.close(); }
});

test("reaction keyboard navigation normalizes small option sets", async () => {
  const env=await setup();
  try {
    for (const count of [1,3,5]) {
      await env.render(<ChatReactions key={count} reactions={[]} options={Array.from({length:count},(_,i)=>({id:String(i),label:`Option ${i}`,content:String(i)}))} onChange={()=>{}} locale="en" motion="none" />);
      await click(document.querySelector<HTMLButtonElement>('button[aria-label="Add reaction"]')!);
      await act(async()=>document.querySelector('[role="dialog"] button')!.dispatchEvent(new env.dom.window.KeyboardEvent("keydown",{key:"ArrowUp",bubbles:true})));
      const expected=((-6 % count)+count)%count;
      assert.equal(document.activeElement?.getAttribute("aria-label"),`Option ${expected}`);
      assert.equal(document.querySelectorAll('[role="dialog"] button[tabindex="0"]').length,1);
    }
  } finally { await env.close(); }
});

test("review hides absent menu actions and labels available actions",()=>{
  const props={variant:"card" as const,avatar:"/avatar.png",name:"Lin",date:"Today",rating:5,content:"Great"};
  assert.doesNotMatch(renderToString(<ReviewItem {...props} />), /<button/);
  assert.match(renderToString(<ReviewItem {...props} onMenuClick={()=>{}} menuLabel="More actions" />),/aria-label="More actions"/);
});

test("member themes and application/profile menu English labels propagate",()=>{
  for(const accent of ["blue","purple","black"] as const) assert.match(renderToString(<AddMember members={[]} accent={accent} />),/--forge-member-panel:/);
  const profile=renderToString(<ProfileDropdown locale="en" />);
  assert.match(profile,/Edit profile/); assert.doesNotMatch(profile,/编辑资料|个人菜单/);
  const app=renderToString(<AppSwitcherDropdown locale="en" appName="Forge" />);
  assert.match(app,/Switch application/); assert.match(app,/Current application/); assert.doesNotMatch(app,/应用切换/);
});
