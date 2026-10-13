import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, useState, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { OtpInput } from "../src/components/ui/otp-input";
import { CalendarCard } from "../src/components/ui/calendar-card";
import { LiquidTabs, type LiquidTabsTab } from "../src/components/ui/liquid-tabs";
import { AddMember, type AddMemberItem } from "../src/components/ui/add-member";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);
async function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, self: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element, SVGElement: dom.window.SVGElement, getComputedStyle: dom.window.getComputedStyle.bind(dom.window), requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window) });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return { dom, render: (node: ReactNode) => act(async () => root.render(node)), close: async () => { await act(async () => root.unmount()); dom.window.close(); } };
}
const click = (element: Element | null) => act(async () => { assert.ok(element); (element as HTMLElement).click(); });
const button = (label: string) => [...document.querySelectorAll<HTMLButtonElement>('button')].find(element => element.getAttribute('aria-label') === label || element.textContent === label)!;
async function fill(dom: JSDOM, input: HTMLInputElement, value: string) {
  await act(async () => { Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value')!.set!.call(input, value); input.dispatchEvent(new dom.window.Event('input', { bubbles: true })); });
}
async function key(dom: JSDOM, element: Element, value: string) { await act(async () => element.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }))); }

test('OTP normalizes pasted digits, reports completion, and waits for actual verification', async () => {
  const env = await setup(); const completed: string[] = [], success: string[] = [];
  let resolve!: (ok: boolean) => void;
  const verify = () => new Promise<boolean>(done => { resolve = done; });
  try {
    await env.render(<OtpInput verify={verify} onComplete={value => completed.push(value)} onSuccess={value => success.push(value)} />);
    const input = document.querySelector('input')!;
    assert.equal(input.autocomplete, 'one-time-code');
    await fill(env.dom, input, '12-34 56');
    assert.equal(input.value, '123456'); assert.deepEqual(completed, ['123456']);
    assert.equal(input.readOnly, true); assert.deepEqual(success, []);
    await act(async () => resolve(false));
    assert.equal(input.getAttribute('aria-invalid'), 'true'); assert.deepEqual(success, []);
    await fill(env.dom, input, ''); await fill(env.dom, input, '654321');
    await act(async () => resolve(true));
    assert.deepEqual(success, ['654321']); assert.equal(input.readOnly, false);
    await env.render(<OtpInput key="plain" onComplete={value => completed.push(value)} />);
    await fill(env.dom, document.querySelector('input')!, '123456');
    assert.equal(document.querySelector('.forge-otp')!.getAttribute('data-status'), 'idle', 'no built-in passcode verifier');
  } finally { await env.close(); }
});
test('OTP controlled changes do not cancel verification when the callback is inline', async () => {
  const env = await setup(); let successes = 0;
  function Controlled() {
    const [value, setValue] = useState("");
    return <OtpInput value={value} onChange={setValue} verify={async () => true} onSuccess={() => successes++} />;
  }
  try {
    await env.render(<Controlled />);
    await fill(env.dom, document.querySelector('input')!, '123456');
    assert.equal(successes, 1); assert.equal(document.querySelector('.forge-otp')!.getAttribute('data-status'), 'ok');
  } finally { await env.close(); }
});
test('OTP ignores stale verification after controlled reset and handles rejected requests', async () => {
  const env = await setup(); let resolve!: (ok: boolean) => void; let successes = 0;
  const verify = () => new Promise<boolean>(done => { resolve = done; });
  try {
    await env.render(<OtpInput verify={verify} onSuccess={() => successes++} />);
    await fill(env.dom, document.querySelector('input')!, '123456');
    await env.render(<OtpInput value="" verify={verify} onSuccess={() => successes++} />);
    await act(async () => resolve(true)); assert.equal(successes, 0);
    await env.render(<OtpInput key="error" verify={async () => { throw new Error('Unavailable'); }} errorLabel="请重试" />);
    await fill(env.dom, document.querySelector('input')!, '123456');
    assert.equal(document.querySelector('[role="status"]')!.textContent, '请重试');
    await env.render(<OtpInput key="disabled" disabled defaultValue="12" />);
    assert.equal(document.querySelector('input')!.disabled, true);
  } finally { await env.close(); }
});
test('OTP stays editable after length changes and finishes verification while editing is disabled', async () => {
  const env = await setup(); let resolve!: (ok: boolean) => void; let successes = 0;
  const verify = () => new Promise<boolean>(done => { resolve = done; });
  try {
    await env.render(<OtpInput length={4} verify={verify} onSuccess={() => successes++} />);
    await fill(env.dom, document.querySelector('input')!, '1234');
    await env.render(<OtpInput length={6} verify={verify} onSuccess={() => successes++} />);
    assert.equal(document.querySelector('input')!.readOnly, false);
    await act(async () => resolve(true)); assert.equal(successes, 0);
    await fill(env.dom, document.querySelector('input')!, '123456');
    await env.render(<OtpInput disabled length={6} verify={verify} onSuccess={() => successes++} />);
    await act(async () => resolve(true)); assert.equal(successes, 1);
    await env.render(<OtpInput length={6} verify={verify} />);
    assert.equal(document.querySelector('input')!.readOnly, false);
  } finally { await env.close(); }
});
test('CalendarCard clamps end-of-month, moves keyboard focus, supports locale and controlled ownership', async () => {
  const env = await setup(); const values: Date[] = [];
  try {
    await env.render(<CalendarCard defaultDate={new Date(2024, 0, 31)} onChange={date => values.push(date)} />);
    await click(button('下个月'));
    assert.equal(values.at(-1)!.getDate(), 29); assert.equal(values.at(-1)!.getMonth(), 1);
    const selected = document.querySelector<HTMLButtonElement>('.forge-calendar__date[aria-pressed="true"]')!;
    selected.focus(); await key(env.dom, selected, 'ArrowRight');
    assert.equal(values.at(-1)!.getMonth(), 2); assert.equal(values.at(-1)!.getDate(), 1);
    assert.equal(document.activeElement?.textContent, '1');
    await click(button('选择月份和年份'));
    assert.equal(button('选择月份和年份').getAttribute('aria-expanded'), 'true');
    await click(button('下一年')); await click(button('二月'));
    assert.equal(values.at(-1)!.getFullYear(), 2025);
    await env.render(<CalendarCard value={new Date(2024, 0, 31)} onChange={date => values.push(date)} locale="en-US" labels={{ nextMonth: 'Forward' }} />);
    await click(button('Forward'));
    assert.equal(values.at(-1)!.getDate(), 29);
    assert.equal(document.querySelector('.forge-calendar__date[aria-pressed="true"]')!.textContent, '31', 'controlled value remains authoritative');
    await env.render(<CalendarCard value={new Date(2024, 0, 31)} disabled />);
    assert.equal(button('下个月').disabled, true);
  } finally { await env.close(); }
});
test('compact plain CalendarCard retains keyboard, picker focus, disabled and controlled behavior', async () => {
  const env = await setup(); const values: Date[] = [];
  const props = { size: 'compact', variant: 'plain', color: 'blue', motion: 'none' } as const;
  try {
    await env.render(<CalendarCard {...props} defaultDate={new Date(2024, 0, 31)} onChange={date => values.push(date)} className="consumer-calendar" />);
    await click(button('下个月'));
    assert.equal(values.at(-1)!.getDate(), 29);
    const selected = () => document.querySelector<HTMLButtonElement>('.forge-calendar__date[aria-pressed="true"]')!;
    await key(env.dom, selected(), 'ArrowRight');
    assert.equal(values.at(-1)!.getMonth(), 2); assert.equal(document.activeElement, selected());
    await key(env.dom, selected(), 'PageUp'); assert.equal(values.at(-1)!.getMonth(), 1);
    await key(env.dom, selected(), 'End'); assert.equal(values.at(-1)!.getDate(), 29);
    await key(env.dom, selected(), 'Home'); assert.equal(values.at(-1)!.getDate(), 1);
    await click(button('选择月份和年份'));
    assert.equal(document.activeElement?.textContent, '二月');
    await click(button('下一年')); await click(button('二月'));
    assert.equal(values.at(-1)!.getFullYear(), 2025); assert.equal(document.activeElement, selected());
    await click(button('选择月份和年份')); await key(env.dom, document.activeElement!, 'Escape');
    assert.equal(document.activeElement, button('选择月份和年份'));
    await env.render(<CalendarCard {...props} value={new Date(2030, 0, 31)} onChange={date => values.push(date)} />);
    await click(button('下个月'));
    assert.equal(values.at(-1)!.getDate(), 28); assert.equal(selected().textContent, '31');
    await env.render(<CalendarCard {...props} value={new Date(2030, 0, 31)} disabled onChange={date => values.push(date)} />);
    const count = values.length;
    await key(env.dom, selected(), 'ArrowRight');
    assert.equal(values.length, count);
    assert.ok([...document.querySelectorAll<HTMLButtonElement>('.forge-calendar button')].every(e => e.disabled));
    assert.equal(document.querySelector('.forge-calendar__leaf'), null);
  } finally { await env.close(); }
});
const tabs: LiquidTabsTab[] = [
  { id: 'a', label: '甲', items: [{ id: 'same', title: '第一组' }] }, { id: 'b', label: '乙', items: [{ id: 'same', title: '第二组' }] },
  { id: 'c', label: '丙', items: [] }, { id: 'd', label: '丁', items: [{ id: 'other', title: '第四组' }] },
];
test('LiquidTabs supports keyboard tabs, overflow selection and per-tab row callbacks', async () => {
  const env = await setup(); const selected: string[] = [];
  try {
    await env.render(<LiquidTabs tabs={tabs} onSelect={(item, tab) => selected.push(`${tab}:${item.id}`)} />);
    await click(document.querySelector('.forge-liquid__row')); assert.deepEqual(selected, ['a:same']);
    const first = document.querySelector('[role="tab"]')!;
    await key(env.dom, first, 'ArrowRight');
    assert.equal(document.querySelector('[role="tab"][aria-selected="true"]')!.textContent, '乙');
    await click(document.querySelector('.forge-liquid__row')); assert.deepEqual(selected, ['a:same', 'b:same']);
    await click(button('更多分类')); assert.equal(document.activeElement?.textContent, '丙');
    await key(env.dom, document.activeElement!, 'ArrowDown');
    assert.equal(document.activeElement?.textContent, '丁'); await click(document.activeElement);
    assert.equal(document.querySelector('[role="tab"][aria-selected="true"]')!.textContent, '丁');
    assert.equal(document.querySelector('[role="menu"]'), null);
    await click(button('更多分类')); await key(env.dom, document.activeElement!, 'Escape');
    assert.equal(document.activeElement, button('更多分类'));
    await env.render(<LiquidTabs tabs={[]} />); assert.ok(document.body.textContent?.includes('暂无内容'));
  } finally { await env.close(); }
});
const members: AddMemberItem[] = [{ id: 'a', name: '同名成员', role: '设计' }, { id: 'b', name: '同名成员', role: '研发' }, { id: 'c', name: '小林', role: '测试' }];
test('AddMember uses stable IDs through reorder, search and pagination; async failure retains selection', async () => {
  const env = await setup(); const submitted: string[][] = []; let reject!: () => void;
  const onAdd = (ids: string[]) => { submitted.push(ids); return new Promise<void>((_, fail) => { reject = () => fail(new Error('Failed')); }); };
  try {
    await env.render(<AddMember members={members} defaultOpen rows={2} onAdd={onAdd} />);
    await click(document.querySelectorAll('.forge-member__row')[1]);
    await env.render(<AddMember members={[members[1], members[0], members[2]]} defaultOpen rows={2} onAdd={onAdd} />);
    assert.equal(document.querySelectorAll('.forge-member__row')[0].getAttribute('aria-pressed'), 'true');
    await click(button('下一页成员')); await click(button('选择 小林'));
    await fill(env.dom, document.querySelector('input')!, '研发');
    assert.equal(document.querySelectorAll('.forge-member__row').length, 1);
    await click(button('添加到项目')); assert.deepEqual(submitted, [['b', 'c']]);
    assert.equal(button('正在添加…').disabled, true);
    await act(async () => reject());
    assert.ok(document.body.textContent?.includes('添加失败，请重试'));
    assert.equal(document.querySelectorAll('.forge-member__chip').length, 2);
    await env.render(<AddMember members={members} rows={2} onAdd={async ids => { submitted.push(ids); }} />);
    await click(button('添加到项目'));
    assert.ok(document.body.textContent?.includes('添加成功')); assert.equal(document.querySelectorAll('.forge-member__chip').length, 0);
    await click(button('项目成员')); assert.equal(document.querySelector('.forge-member__body')!.hasAttribute('inert'), true);
  } finally { await env.close(); }
});
test('AddMember controlled selection and open state remain owned by the caller', async () => {
  const env = await setup(); let ids: string[] = [], open = false;
  try {
    await env.render(<AddMember members={members} open selectedIds={['a']} onSelectionChange={next => { ids = next; }} onOpenChange={next => { open = next; }} />);
    await click(document.querySelectorAll('.forge-member__row')[1]);
    assert.deepEqual(ids, ['a', 'b']); assert.equal(document.querySelectorAll('.forge-member__chip').length, 1);
    await click(button('项目成员')); assert.equal(open, false); assert.equal(button('项目成员').getAttribute('aria-expanded'), 'true');
  } finally { await env.close(); }
});
test('widgets render on the server without a clock-dependent date or built-in user data', () => {
  const otp = renderToString(<OtpInput />), calendar = renderToString(<CalendarCard />), member = renderToString(<AddMember members={[]} />);
  assert.ok(!otp.includes('123456'));
  assert.ok(calendar.includes('aria-busy="true"'));
  assert.ok(!member.includes('randomuser.me'));
});
test('shared motion preference disables transitions without resetting widget state', async () => {
  const env = await setup();
  // Exercise the explicit override even when the OS allows animation.
  Object.defineProperty(env.dom.window, 'matchMedia', { value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
  const widgets = (motion: 'auto' | 'none') => <>
    <OtpInput motion={motion} />
    <CalendarCard motion={motion} defaultDate={new Date(2026, 9, 12)} />
    <LiquidTabs motion={motion} tabs={tabs} />
    <AddMember motion={motion} members={members} defaultOpen />
  </>;
  try {
    await env.render(widgets('auto'));
    await fill(env.dom, document.querySelector('input')!, '123');
    await click(button('2026年10月13日星期二'));
    await click(document.querySelector('.forge-liquid__row'));
    await click(document.querySelector('.forge-member__row'));
    await env.render(widgets('none'));
    assert.equal(document.querySelector('input')!.value, '123');
    assert.equal(document.querySelector('.forge-calendar__date[aria-pressed="true"]')!.textContent, '13');
    assert.equal(document.querySelector('.forge-liquid__row')!.getAttribute('aria-pressed'), 'true');
    assert.equal(document.querySelector('.forge-member__row')!.getAttribute('aria-pressed'), 'true');
    await click(button('下个月'));
    assert.equal(document.querySelector('.forge-calendar__leaf'), null);
    await click(button('乙'));
    assert.equal(document.querySelectorAll('[role="tabpanel"]').length, 1);
    assert.ok(document.querySelector('[role="tabpanel"]')!.textContent?.includes('第二组'));
    await click(document.querySelectorAll('.forge-member__row')[1]);
    assert.equal(document.querySelector('.forge-member__fly'), null);
  } finally { await env.close(); }
});
