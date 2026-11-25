import assert from "node:assert/strict";
import { act, useState } from "react";
import { Modal } from "../src/components/ui/modal";
import { Drawer } from "../src/components/ui/drawer";
import { ConfirmationDialog } from "../src/components/ui/confirmation-dialog";
import { KebabMenu } from "../src/components/ui/kebab-menu";
import { click, flush, press, setup } from "./helpers/dom";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

const dialog = (label?: string) => document.querySelector<HTMLElement>(label ? `[role="dialog"][aria-label="${label}"]` : '[role="dialog"]');
const focusDescription = () => document.activeElement?.outerHTML.slice(0, 160);

test("Modal: a controlled host can reject Escape and backdrop closes", async () => {
  const env = setup(); let closes = 0;
  try {
    await act(async () => env.root.render(<Modal open motion="none" title="Reject" onOpenChange={() => closes++}><button>Body</button></Modal>));
    await flush();
    assert.equal(dialog("Reject")!.getAttribute("aria-modal") ?? "true", "true");
    await press(document.activeElement ?? document.body, "Escape");
    await press(document.activeElement ?? document.body, "Escape");
    assert.equal(closes, 2);
    await click(document.querySelector(".forge-overlay-backdrop")!);
    assert.equal(closes, 3);
    assert.ok(dialog("Reject"));
  } finally { await env.cleanup(); }
});

test("Modal: Escape closes only the top nested dialog", async () => {
  const env = setup(); let parent = 0, child = 0;
  try {
    await act(async () => env.root.render(<Modal open motion="none" title="Parent" onOpenChange={() => parent++}><button>Parent action</button>
      <Modal open motion="none" title="Child" onOpenChange={() => child++}><button id="child-action">Child action</button></Modal>
    </Modal>));
    await flush();
    document.getElementById("child-action")!.focus();
    await press(document.getElementById("child-action")!, "Escape");
    assert.equal(child, 1); assert.equal(parent, 0);
  } finally { await env.cleanup(); }
});

test("Modal: a menu inside consumes the first Escape and returns focus to its trigger", async () => {
  const env = setup(); let parent = 0;
  try {
    await act(async () => env.root.render(<Modal open motion="none" title="Parent" onOpenChange={() => parent++}><KebabMenu motion="none" items={[{ label: "Action" }]} /></Modal>));
    await flush();
    const trigger = document.querySelector<HTMLButtonElement>('[aria-label="更多操作"]')!;
    await click(trigger);
    const menu = document.querySelector<HTMLElement>("[data-forge-kebab-menu]")!;
    assert.ok(menu);
    await press(menu, "Escape");
    assert.equal(parent, 0);
    assert.equal(document.querySelector("[data-forge-kebab-menu]"), null);
    assert.ok(document.activeElement === trigger, `trigger focus: ${focusDescription()}`);
    await press(trigger, "Escape");
    assert.equal(parent, 1);
  } finally { await env.cleanup(); }
});

function MenuOpensChild() {
  const [child, setChild] = useState(false);
  return <Modal open motion="none" title="Parent" onOpenChange={() => {}}>
    <KebabMenu motion="none" items={[{ label: "Open child", onSelect: () => setChild(true) }]} />
    <Modal open={child} motion="none" title="Child" onOpenChange={setChild}><button>Draft action</button></Modal>
  </Modal>;
}
test("Modal: a child opened from a menu item takes focus and hands it back on close", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<MenuOpensChild />));
    await flush();
    const trigger = document.querySelector<HTMLButtonElement>('[aria-label="更多操作"]')!;
    await click(trigger);
    await click(document.querySelector<HTMLElement>('[data-forge-kebab-menu] [role="menuitem"]')!);
    await flush();
    const child = dialog("Child")!;
    assert.ok(child.contains(document.activeElement), `child focus: ${focusDescription()}`);
    await press(document.activeElement!, "Escape");
    await flush();
    assert.equal(dialog("Child"), null);
    assert.ok(dialog("Parent")!.contains(document.activeElement), `parent focus: ${focusDescription()}`);
  } finally { await env.cleanup(); }
});

test("Modal: closing the parent asks a controlled child to close and hides it", async () => {
  const env = setup(); let childClose = 0;
  const render = (open: boolean) => act(async () => env.root.render(<Modal open={open} motion="none" title="Parent" onOpenChange={() => {}}>
    <Modal open motion="none" title="Child" onOpenChange={() => childClose++}><button>Draft</button></Modal>
  </Modal>));
  try {
    await render(true); await flush();
    assert.ok(dialog("Child"));
    await render(false); await flush();
    assert.equal(childClose, 1);
    assert.equal(dialog("Child"), null);
  } finally { await env.cleanup(); }
});

test("Modal: business Escape handlers that stop propagation keep the dialog open", async () => {
  const env = setup(); let closes = 0, handled = 0;
  try {
    await act(async () => env.root.render(<Modal open motion="none" title="Parent" onOpenChange={() => closes++}>
      <div onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); handled++; } }}><button id="business">Business action</button></div>
    </Modal>));
    await flush();
    await press(document.getElementById("business")!, "Escape");
    assert.equal(handled, 1); assert.equal(closes, 0);
  } finally { await env.cleanup(); }
});

test("Modal: closing the owner dismisses an open menu", async () => {
  const env = setup();
  const render = (open: boolean) => act(async () => env.root.render(<Modal open={open} motion="none" title="Parent" onOpenChange={() => {}}><KebabMenu motion="none" items={[{ label: "Action" }]} /></Modal>));
  try {
    await render(true); await flush();
    await click(document.querySelector<HTMLButtonElement>('[aria-label="更多操作"]')!);
    assert.ok(document.querySelector("[data-forge-kebab-menu]"));
    await render(false); await flush();
    assert.equal(document.querySelector("[data-forge-kebab-menu]"), null);
  } finally { await env.cleanup(); }
});

test("Modal: template variant keeps heading, divider, width and close control", async () => {
  const env = setup(); let closes = 0;
  try {
    await act(async () => env.root.render(<Modal variant="template" open onOpenChange={() => closes++} title="编辑记录"><p>表单</p></Modal>));
    await flush();
    const popup = dialog("编辑记录")!;
    assert.ok(popup.classList.contains("forge-template-modal"));
    assert.ok(popup.classList.contains("w-[560px]"));
    assert.equal(popup.querySelector("h3")!.textContent, "编辑记录");
    assert.ok(popup.querySelector(".h-px.w-full.bg-fg-grey-200"));
    await click(popup.querySelector('[aria-label="关闭弹窗"]')!);
    assert.equal(closes, 1);
  } finally { await env.cleanup(); }
});

test("Modal: closed modal renders nothing and reopens", async () => {
  const env = setup();
  const render = (open: boolean) => act(async () => env.root.render(<Modal open={open} motion="none" title="Example" onOpenChange={() => {}}><button>Action</button></Modal>));
  try {
    await render(true); await flush(); assert.ok(dialog("Example"));
    await render(false); await flush(); assert.equal(dialog("Example"), null);
    await render(true); await flush(); assert.ok(dialog("Example"));
  } finally { await env.cleanup(); }
});

test("ConfirmationDialog is an alert dialog that ignores outside presses", async () => {
  const env = setup(); let cancels = 0, confirms = 0;
  try {
    await act(async () => env.root.render(<ConfirmationDialog open color="red" title="删除记录" description="删除后无法恢复" motion="none" onCancel={() => cancels++} onConfirm={() => confirms++} onOpenChange={() => {}} />));
    await flush();
    const alert = document.querySelector<HTMLElement>('[role="alertdialog"]')!;
    assert.equal(alert.getAttribute("aria-label"), "删除记录");
    await click(document.querySelector(".forge-overlay-backdrop")!);
    assert.equal(cancels, 0);
    await press(document.activeElement ?? alert, "Escape");
    assert.equal(cancels, 1);
    await click([...alert.querySelectorAll("button")].find(button => button.textContent === "删除")!);
    assert.equal(confirms, 1);
  } finally { await env.cleanup(); }
});

test("ConfirmationDialog keeps its last open text while it closes", async () => {
  const env = setup();
  const render = (open: boolean, name: string) => act(async () => env.root.render(<ConfirmationDialog open={open} color="red" title="删除记录" description={`确定删除「${name}」？`} onOpenChange={() => {}} />));
  try {
    await render(true, "报表A"); await flush();
    // Hold the exit animation open so the closing popup stays mounted.
    const original = Element.prototype.getAnimations;
    Element.prototype.getAnimations = () => [{ effect: { getTiming: () => ({ duration: 200, iterations: 1 }) }, finished: new Promise(() => {}) } as unknown as Animation];
    try { await render(false, ""); } finally { Element.prototype.getAnimations = original; }
    const alert = document.querySelector<HTMLElement>('[role="alertdialog"]');
    assert.ok(alert, "still mounted while closing"); assert.match(alert!.textContent ?? "", /确定删除「报表A」？/);
    await render(true, "报表B"); await flush();
    assert.match(document.querySelector<HTMLElement>('[role="alertdialog"]')!.textContent ?? "", /确定删除「报表B」？/);
  } finally { await env.cleanup(); }
});

test("Drawer renders a side sheet that closes on Escape", async () => {
  const env = setup(); let closes = 0;
  try {
    await act(async () => env.root.render(<Drawer open motion="none" side="left" title="筛选" onOpenChange={() => closes++}><button>Apply</button></Drawer>));
    await flush();
    const sheet = dialog("筛选")!;
    assert.equal(sheet.getAttribute("data-side"), "left");
    assert.ok(sheet.classList.contains("forge-drawer"));
    await press(document.activeElement ?? sheet, "Escape");
    assert.equal(closes, 1);
  } finally { await env.cleanup(); }
});
