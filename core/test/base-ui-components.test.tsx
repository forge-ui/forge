import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { Modal } from "../src/components/ui/modal";
import { DropdownMenu, ContextMenu } from "../src/components/ui/dropdown-menu";
import { Popover } from "../src/components/ui/popover";
import { Combobox } from "../src/components/ui/forms/combobox";
import { Autocomplete } from "../src/components/ui/forms/autocomplete";
import { NumberField } from "../src/components/ui/forms/number-field";
import { Slider } from "../src/components/ui/forms/slider";
import { ScrollArea } from "../src/components/ui/scroll-area";
import { PreviewCard } from "../src/components/ui/preview-card";
import { Tooltip, TooltipAnchor, TooltipGroup } from "../src/components/ui/tooltip";
import { Form, FormField, Fieldset } from "../src/components/ui/forms/form";
import { TextField } from "../src/components/ui/forms/text-field";
import { RadioGroup, CheckboxGroup, ToggleGroup } from "../src/components/ui/forms/choice-groups";
import { Collapsible } from "../src/components/ui/collapsible";
import { Menubar } from "../src/components/ui/menubar";
import { NavigationMenu } from "../src/components/ui/navigation-menu";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
  const window = dom.window;
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window, self: window, document: window.document,
    HTMLElement: window.HTMLElement, HTMLInputElement: window.HTMLInputElement, Element: window.Element, Node: window.Node,
    Event: window.Event, MouseEvent: window.MouseEvent, KeyboardEvent: window.KeyboardEvent, FocusEvent: window.FocusEvent, InputEvent: window.InputEvent,
    PointerEvent: window.MouseEvent, NodeFilter: window.NodeFilter, HTMLButtonElement: window.HTMLButtonElement, SVGElement: window.SVGElement, ShadowRoot: window.ShadowRoot, MutationObserver: window.MutationObserver,
    getComputedStyle: window.getComputedStyle.bind(window),
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 0),
    cancelAnimationFrame: (id: number) => clearTimeout(id),
    ResizeObserver: class { observe() {} unobserve() {} disconnect() {} },
    DOMRect: window.DOMRect ?? class { constructor(public x = 0, public y = 0, public width = 0, public height = 0) {} get top() { return this.y; } get left() { return this.x; } get right() { return this.x + this.width; } get bottom() { return this.y + this.height; } static fromRect(rect: { x?: number; y?: number; width?: number; height?: number } = {}) { return { x: rect.x ?? 0, y: rect.y ?? 0, width: rect.width ?? 0, height: rect.height ?? 0, top: rect.y ?? 0, left: rect.x ?? 0, right: (rect.x ?? 0) + (rect.width ?? 0), bottom: (rect.y ?? 0) + (rect.height ?? 0) }; } },
  });
  Object.defineProperty(window, "matchMedia", { value: () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) });
  window.HTMLElement.prototype.getClientRects = function() { return [{ width: 100, height: 32 }] as unknown as DOMRectList; };
  window.HTMLElement.prototype.scrollIntoView = function() {};
  window.Element.prototype.getAnimations = function() { return []; };
  window.HTMLDialogElement.prototype.showModal = function() { this.setAttribute("open", ""); };
  window.HTMLDialogElement.prototype.close = function() { this.removeAttribute("open"); this.dispatchEvent(new window.Event("close")); };
  const root = createRoot(document.getElementById("root")!);
  return { root, cleanup: async () => { await act(async () => root.unmount()); window.close(); } };
}

const flush = () => act(async () => { for (let index = 0; index < 4; index++) await new Promise(resolve => setTimeout(resolve, 5)); });
const press = async (node: Element, key: string) => { await act(async () => { node.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })); }); await flush(); };
const click = async (node: Element) => {
  await act(async () => {
    for (const type of ["pointerdown", "mousedown", "pointerup", "mouseup"]) node.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, button: 0 }));
    (node as HTMLElement).click();
  });
  await flush();
};
async function type(input: HTMLInputElement, text: string) {
  await act(async () => {
    input.focus();
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")!.set!;
    setter.call(input, text);
    input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
  });
  await flush();
}
const menuItems = () => [...document.querySelectorAll<HTMLElement>('[role="menuitem"], [role="menuitemcheckbox"]')];
const options = () => [...document.querySelectorAll<HTMLElement>('[role="option"]')];

test("DropdownMenu opens from its trigger, runs onSelect and closes", async () => {
  const env = setup(); const picked: string[] = [];
  try {
    await act(async () => env.root.render(<DropdownMenu motion="none" trigger={<button>Actions</button>} items={[
      { label: "Edit", onSelect: () => picked.push("edit") },
      { type: "divider" },
      { label: "Delete", danger: true, onSelect: () => picked.push("delete") },
    ]} />));
    const trigger = document.querySelector("button")!;
    assert.equal(trigger.getAttribute("aria-haspopup"), "menu");
    await click(trigger);
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    assert.deepEqual(menuItems().map(item => item.textContent), ["Edit", "Delete"]);
    await click(menuItems()[1]);
    assert.deepEqual(picked, ["delete"]);
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
  } finally { await env.cleanup(); }
});

test("DropdownMenu checkbox entries toggle without closing", async () => {
  const env = setup(); const changes: boolean[] = [];
  try {
    await act(async () => env.root.render(<DropdownMenu motion="none" defaultOpen trigger={<button>View</button>} items={[
      { type: "group", label: "Columns", items: [{ type: "checkbox", label: "Owner", checked: false, onCheckedChange: checked => changes.push(checked) }] },
    ]} />));
    await flush();
    const item = document.querySelector<HTMLElement>('[role="menuitemcheckbox"]')!;
    assert.equal(item.getAttribute("aria-checked"), "false");
    await click(item);
    assert.deepEqual(changes, [true]);
    assert.ok(document.querySelector('[role="menu"]'));
  } finally { await env.cleanup(); }
});

test("DropdownMenu inside Modal portals into the dialog and Escape closes only the menu", async () => {
  const env = setup(); let modalCloses = 0;
  try {
    await act(async () => env.root.render(<Modal open motion="none" title="Parent" onOpenChange={() => modalCloses++}>
      <DropdownMenu motion="none" trigger={<button id="menu-trigger">Actions</button>} items={[{ label: "Edit" }]} />
    </Modal>));
    const trigger = document.getElementById("menu-trigger")!;
    await click(trigger);
    const menu = document.querySelector<HTMLElement>('[role="menu"]')!;
    assert.equal(menu.closest("dialog"), trigger.closest("dialog"));
    await press(menu, "Escape");
    assert.equal(modalCloses, 0);
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    await press(trigger, "Escape");
    assert.equal(modalCloses, 1);
  } finally { await env.cleanup(); }
});

test("ContextMenu opens on right click", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<ContextMenu motion="none" items={[{ label: "Copy" }]}><div id="area">Row</div></ContextMenu>));
    const area = document.getElementById("area")!;
    await act(async () => { area.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 10, clientY: 10 })); });
    await flush();
    assert.deepEqual(menuItems().map(item => item.textContent), ["Copy"]);
  } finally { await env.cleanup(); }
});

test("Popover shows title and closes through the render-prop close", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<Popover motion="none" title="Filters" trigger={<button id="popover-trigger">Filter</button>}>
      {close => <button id="apply" onClick={close}>Apply</button>}
    </Popover>));
    const trigger = document.getElementById("popover-trigger")!;
    await click(trigger);
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!;
    assert.ok(dialog.textContent?.includes("Filters"));
    assert.equal(dialog.getAttribute("aria-labelledby") !== null, true);
    await click(document.getElementById("apply")!);
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
  } finally { await env.cleanup(); }
});

function ComboboxHarness({ onChange }: { onChange: (value: string | null) => void }) {
  const [value, setValue] = useState<string | null>(null);
  return <Combobox motion="none" label="City" value={value} onChange={next => { setValue(next); onChange(next); }} options={[
    { value: "bj", label: "Beijing" },
    { value: "sh", label: "Shanghai" },
    { value: "sz", label: "Shenzhen" },
  ]} />;
}

test("Combobox filters by typed text and reports the picked value", async () => {
  const env = setup(); const changes: (string | null)[] = [];
  try {
    await act(async () => env.root.render(<ComboboxHarness onChange={value => changes.push(value)} />));
    const input = document.querySelector<HTMLInputElement>('input[role="combobox"]')!;
    assert.equal(document.querySelector("label")!.htmlFor, input.id);
    await type(input, "sh");
    assert.deepEqual(options().map(option => option.textContent), ["Shanghai", "Shenzhen"]);
    await click(options()[1]);
    assert.deepEqual(changes, ["sz"]);
    assert.equal(input.value, "Shenzhen");
  } finally { await env.cleanup(); }
});

test("Combobox multiple renders chips and removes them", async () => {
  const env = setup(); let latest: string[] = [];
  function Harness() {
    const [value, setValue] = useState<string[]>(["bj"]);
    return <Combobox multiple motion="none" value={value} onChange={next => { latest = next; setValue(next); }} options={[{ value: "bj", label: "Beijing" }, { value: "sh", label: "Shanghai" }]} />;
  }
  try {
    await act(async () => env.root.render(<Harness />));
    const remove = document.querySelector<HTMLElement>('[aria-label="移除 Beijing"]')!;
    assert.ok(remove);
    await click(remove);
    assert.deepEqual(latest, []);
  } finally { await env.cleanup(); }
});

test("Combobox shows the empty message when nothing matches", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<Combobox motion="none" emptyText="Nothing" options={[{ value: "a", label: "Alpha" }]} />));
    await type(document.querySelector<HTMLInputElement>('input[role="combobox"]')!, "zzz");
    assert.equal(options().length, 0);
    assert.ok(document.body.textContent?.includes("Nothing"));
  } finally { await env.cleanup(); }
});

test("Autocomplete keeps free text and fills a picked suggestion", async () => {
  const env = setup(); const values: string[] = []; const picked: string[] = [];
  function Harness() {
    const [value, setValue] = useState("");
    return <Autocomplete motion="none" value={value} onChange={next => { values.push(next); setValue(next); }} onSelect={option => picked.push(option.value)} options={["react", "redux", { value: "vue", description: "Framework" }]} />;
  }
  try {
    await act(async () => env.root.render(<Harness />));
    const input = document.querySelector<HTMLInputElement>('input[role="combobox"]')!;
    await type(input, "re");
    assert.deepEqual(options().map(option => option.textContent), ["react", "redux"]);
    await click(options()[1]);
    assert.equal(input.value, "redux");
    assert.deepEqual(picked, ["redux"]);
    assert.equal(values.at(-1), "redux");
  } finally { await env.cleanup(); }
});

test("keyboard: ArrowDown + Enter picks in Combobox and fires Autocomplete onSelect", async () => {
  const env = setup(); const changes: (string | null)[] = []; const picked: string[] = [];
  try {
    await act(async () => env.root.render(<>
      <ComboboxHarness onChange={value => changes.push(value)} />
      <Autocomplete motion="none" onSelect={option => picked.push(option.value)} options={["alpha", "beta"]} />
    </>));
    const [combo, auto] = [...document.querySelectorAll<HTMLInputElement>('input[role="combobox"]')];
    await type(combo, "bei");
    await press(combo, "ArrowDown");
    await press(combo, "Enter");
    assert.deepEqual(changes, ["bj"]);
    await type(auto, "be");
    await press(auto, "ArrowDown");
    await press(auto, "Enter");
    assert.equal(auto.value, "beta");
    assert.deepEqual(picked, ["beta"]);
  } finally { await env.cleanup(); }
});

test("NumberField steps with buttons and arrow keys within bounds", async () => {
  const env = setup(); const values: (number | null)[] = [];
  function Harness() {
    const [value, setValue] = useState<number | null>(1);
    return <NumberField label="Seats" min={0} max={2} value={value} onChange={next => { values.push(next); setValue(next); }} />;
  }
  try {
    await act(async () => env.root.render(<Harness />));
    const input = document.querySelector<HTMLInputElement>("input")!;
    assert.equal(document.querySelector("label")!.htmlFor, input.id);
    await click(document.querySelector('[aria-label="增加"]')!);
    assert.equal(values.at(-1), 2);
    await click(document.querySelector('[aria-label="增加"]')!);
    assert.equal(input.value, "2");
    await act(async () => input.focus());
    await press(input, "ArrowDown");
    assert.equal(values.at(-1), 1);
  } finally { await env.cleanup(); }
});

test("Slider single and range respond to the keyboard", async () => {
  const env = setup(); let single = 0; let range: [number, number] = [0, 0];
  function Harness() {
    const [value, setValue] = useState(40);
    const [span, setSpan] = useState<[number, number]>([20, 60]);
    return <>
      <Slider label="Volume" showValue value={value} step={10} onChange={next => { single = next; setValue(next); }} />
      <Slider ariaLabel="Price" value={span} step={5} onChange={next => { range = next; setSpan(next); }} />
    </>;
  }
  try {
    await act(async () => env.root.render(<Harness />));
    const sliders = [...document.querySelectorAll<HTMLInputElement>('input[type="range"]')];
    assert.equal(sliders.length, 3);
    await act(async () => sliders[0].focus());
    await press(sliders[0], "ArrowRight");
    assert.equal(single, 50);
    await act(async () => sliders[2].focus());
    await press(sliders[2], "ArrowLeft");
    assert.deepEqual(range, [20, 55]);
  } finally { await env.cleanup(); }
});

test("ScrollArea renders content in a labelled focusable viewport", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<ScrollArea ariaLabel="Logs" maxHeight="120px"><p id="row">Row</p></ScrollArea>));
    const viewport = document.querySelector<HTMLElement>('[aria-label="Logs"]')!;
    assert.equal(viewport.tabIndex, 0);
    assert.equal(viewport.style.maxHeight, "120px");
    assert.ok(viewport.contains(document.getElementById("row")));
  } finally { await env.cleanup(); }
});

test("PreviewCard opens when its link receives keyboard focus", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<PreviewCard motion="none" delay={0} trigger={<a href="#u" id="link">Ada</a>}><p id="card">Profile</p></PreviewCard>));
    const link = document.getElementById("link")!;
    await act(async () => { link.focus(); link.dispatchEvent(new FocusEvent("focusin", { bubbles: true })); });
    await flush();
    assert.ok(document.getElementById("card"), "card opens on focus");
  } finally { await env.cleanup(); }
});

// Real pointers fire mouseenter on every ancestor; the Tooltip trigger wraps the child.
const hover = (child: Element) => act(async () => {
  const node = child.parentElement!;
  for (const type of ["pointerenter", "mouseenter", "pointermove", "mousemove", "mouseover"]) node.dispatchEvent(new MouseEvent(type, { bubbles: !type.endsWith("enter"), relatedTarget: document.body }));
});
const unhover = (child: Element) => act(async () => {
  const node = child.parentElement!;
  for (const type of ["pointerleave", "mouseleave", "mouseout"]) node.dispatchEvent(new MouseEvent(type, { bubbles: !type.endsWith("leave"), relatedTarget: document.body }));
});
const tooltipText = () => document.querySelector('[role="tooltip"]')?.textContent ?? null;

test("Tooltip waits for the hover delay, opens on focus and composes aria-describedby", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<TooltipGroup delay={40}>
      <Tooltip content="First" motion="none"><TooltipAnchor aria-label="One" aria-describedby="existing" icon="1" /></Tooltip>
      <Tooltip content="Second" motion="none"><button>Two</button></Tooltip>
    </TooltipGroup>));
    const buttons = document.querySelectorAll("button");
    await hover(buttons[0]);
    assert.equal(tooltipText(), null);
    await flush(); await flush(); await flush();
    assert.equal(tooltipText(), "First");
    assert.ok(buttons[0].getAttribute("aria-describedby")?.startsWith("existing "));
    await unhover(buttons[0]); await flush();
    await act(async () => { document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true })); buttons[1].focus(); }); await flush();
    assert.equal(tooltipText(), "Second");
    await press(buttons[1], "Escape");
    assert.equal(tooltipText(), null);
  } finally { await env.cleanup(); }
});

test("Tooltip inside Modal renders within the dialog", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<Modal open motion="none" title="Settings" onOpenChange={() => {}}>
      <Tooltip open content="Details" motion="none"><button id="target">Target</button></Tooltip>
    </Modal>));
    await flush();
    const tip = document.querySelector('[role="tooltip"]')!;
    assert.equal(tip.closest("dialog"), document.getElementById("target")!.closest("dialog"));
    assert.equal(document.getElementById("target")!.getAttribute("aria-describedby"), tip.id);
  } finally { await env.cleanup(); }
});

test("Form blocks submit, shows custom messages on invalid fields and submits named values", async () => {
  const env = setup(); const submitted: Record<string, unknown>[] = [];
  try {
    await act(async () => env.root.render(<Form onSubmit={values => submitted.push(values)}>
      <Fieldset legend="Account">
        <FormField name="email" label="Email" messages={{ valueMissing: "请填写邮箱" }}>
          <TextField type="email" required placeholder="you@example.com" />
        </FormField>
        <FormField name="code" label="Code" validate={value => String(value).length === 4 ? null : "需要 4 位"}>
          <TextField />
        </FormField>
      </Fieldset>
      <button type="submit">Save</button>
    </Form>));
    const form = document.querySelector("form")!;
    await act(async () => { form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); });
    await flush();
    assert.equal(submitted.length, 0);
    assert.ok(document.body.textContent?.includes("请填写邮箱"));
    const [email, code] = [...document.querySelectorAll<HTMLInputElement>("input")];
    assert.equal(email.getAttribute("aria-invalid"), "true");
    await type(email, "a@b.co");
    await type(code, "1234");
    await act(async () => { form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); });
    await flush();
    assert.deepEqual(submitted, [{ email: "a@b.co", code: "1234" }]);
  } finally { await env.cleanup(); }
});

test("RadioGroup moves and selects with arrow keys; CheckboxGroup parent selects all", async () => {
  const env = setup(); const radios: string[] = []; let checked: string[] = [];
  function Harness() {
    const [value, setValue] = useState<string[]>(["a"]);
    return <CheckboxGroup selectAllLabel="All" value={value} onChange={next => { checked = next; setValue(next); }} options={[{ value: "a", label: "A" }, { value: "b", label: "B" }]} />;
  }
  try {
    await act(async () => env.root.render(<>
      <RadioGroup ariaLabel="Plan" defaultValue="free" onChange={value => radios.push(value)} options={[{ value: "free", label: "Free" }, { value: "pro", label: "Pro" }]} />
      <Harness />
    </>));
    const radio = [...document.querySelectorAll<HTMLElement>('[role="radio"]')];
    assert.equal(radio[0].getAttribute("aria-checked"), "true");
    await act(async () => radio[0].focus());
    await press(radio[0], "ArrowDown");
    assert.deepEqual(radios, ["pro"]);
    const boxes = [...document.querySelectorAll<HTMLElement>('[role="checkbox"]')];
    assert.equal(boxes[0].getAttribute("aria-checked"), "mixed");
    await click(boxes[0]);
    assert.deepEqual(checked, ["a", "b"]);
  } finally { await env.cleanup(); }
});

test("ToggleGroup single selection and Collapsible toggling", async () => {
  const env = setup(); const views: (string | null)[] = [];
  try {
    await act(async () => env.root.render(<>
      <ToggleGroup ariaLabel="View" defaultValue="list" onChange={value => views.push(value)} options={[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }]} />
      <Collapsible title="Advanced">Hidden settings</Collapsible>
    </>));
    const toggles = [...document.querySelectorAll<HTMLElement>("[aria-pressed]")];
    assert.equal(toggles[0].getAttribute("aria-pressed"), "true");
    await click(toggles[1]);
    assert.deepEqual(views, ["grid"]);
    const trigger = [...document.querySelectorAll<HTMLButtonElement>("button")].find(button => button.textContent === "Advanced")!;
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    await click(trigger);
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
  } finally { await env.cleanup(); }
});

test("Menubar opens a menu and NavigationMenu renders links", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<>
      <Menubar ariaLabel="App" menus={[{ label: "File", items: [{ label: "New" }, { label: "Open" }] }, { label: "Edit", items: [{ label: "Undo" }] }]} />
      <NavigationMenu ariaLabel="Site" items={[{ label: "Home", href: "/" }, { label: "Products", links: [{ label: "Forge", href: "/forge", description: "UI kit" }] }]} />
    </>));
    assert.equal(document.querySelector('[role="menubar"]')?.getAttribute("aria-label"), "App");
    const file = [...document.querySelectorAll<HTMLElement>('[role="menubar"] [aria-haspopup="menu"]')][0];
    await click(file);
    assert.deepEqual([...document.querySelectorAll('[role="menu"] [role="menuitem"]')].map(item => item.textContent), ["New", "Open"]);
    assert.ok(document.querySelector('nav a[href="/"]'));
  } finally { await env.cleanup(); }
});
