import assert from "node:assert/strict";
import { act, useState } from "react";
import { ChatInputBar } from "../src/components/ui/chat-input-bar";
import { click, flush, press, setup } from "./helpers/dom";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

const models = [{ id: "a", label: "Alpha" }, { id: "b", label: "Beta" }, { id: "c", label: "Long model name" }];
const bar = { multiline: true, sendOnEnter: true, sendLabel: "Send", sourcesLabel: "Sources", commandsLabel: "Commands", attachLabel: "Attach" } as const;
const focused = () => document.activeElement?.textContent;

test("model menu opens on the current choice, keeps the host theme and selects once", async () => {
  const env = setup(); const calls: string[] = [];
  function Example() { const [model, setModel] = useState("b"); return <div data-theme="dark" data-accent="purple"><ChatInputBar {...bar} models={models} model={model} onModelChange={id => { calls.push(id); setModel(id); }} /></div>; }
  try {
    await act(async () => env.root.render(<Example />));
    const trigger = document.querySelector<HTMLButtonElement>('[aria-label^="Model:"]')!;
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    await press(trigger, "ArrowDown");
    const menu = document.querySelector<HTMLElement>('[role="menu"]')!;
    assert.ok(menu, "menu open");
    assert.ok(menu.closest('[data-theme="dark"][data-accent="purple"]'), "portal carries the host theme and accent");
    assert.equal(focused(), "Beta");
    assert.equal(menu.querySelector('[aria-checked="true"]')?.textContent, "Beta");
    await press(document.activeElement!, "ArrowDown"); assert.equal(focused(), "Long model name");
    await press(document.activeElement!, "ArrowDown"); assert.equal(focused(), "Alpha");
    await press(document.activeElement!, "Enter");
    assert.deepEqual(calls, ["a"]);
    assert.equal(document.querySelector('[role="menu"]'), null);
    assert.ok(document.activeElement === trigger, "focus: " + document.activeElement?.outerHTML.slice(0, 120));
    assert.equal(trigger.getAttribute("aria-label"), "Model: Alpha");
  } finally { await env.cleanup(); }
});

test("ArrowUp opens on the last model, Escape returns to the trigger, tools menu lists sources and commands", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<ChatInputBar {...bar} models={models} sources={[{ id: "s", label: "Docs" }]} commands={[{ id: "c", label: "Summarize" }]} />));
    const trigger = document.querySelector<HTMLButtonElement>('[aria-label^="Model:"]')!;
    await press(trigger, "ArrowUp"); assert.equal(focused(), "Long model name");
    await press(document.activeElement!, "Escape");
    assert.ok(document.activeElement === trigger, "focus: " + document.activeElement?.outerHTML.slice(0, 120));
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    const tools = document.querySelector<HTMLButtonElement>('[aria-label="添加内容和工具"]')!;
    await click(tools);
    assert.equal(tools.getAttribute("aria-expanded"), "true");
    const menu = document.querySelector('[role="menu"]')!;
    assert.ok(menu.textContent?.includes("Docs"));
    assert.ok(menu.textContent?.includes("Summarize"));
    await press(menu, "Escape");
    await flush();
    assert.equal(document.querySelector('[role="menu"]'), null);
  } finally { await env.cleanup(); }
});

test("fallback model, disabled and empty model list", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<ChatInputBar {...bar} models={models} model="missing" />));
    const trigger = document.querySelector<HTMLButtonElement>('[aria-label^="Model:"]')!;
    assert.equal(trigger.getAttribute("aria-label"), "Model: Alpha");
    await click(trigger); assert.equal(document.querySelector('[aria-checked="true"]')?.textContent, "Alpha");
    await act(async () => env.root.render(<ChatInputBar {...bar} models={models} disabled />));
    await flush();
    assert.equal(trigger.disabled, true); assert.equal(document.querySelector('[role="menu"]'), null);
    await act(async () => env.root.render(<ChatInputBar {...bar} models={[]} />));
    assert.equal(document.querySelector('[aria-label^="Model:"]'), null);
  } finally { await env.cleanup(); }
});
