import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { AgentCodeBlock } from "../src/components/ui/agent/agent-code-block";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);
const lines = ["function outer() {", "  function inner() {", "    return 1;", "  }", "  return inner();", "}"];
const ranges = [{ id: "outer", startLine: 1, endLine: 6, label: "outer" }, { id: "inner", startLine: 2, endLine: 4, label: "inner" }];

async function setup() {
  const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true, url: "http://localhost" });
  Object.defineProperty(dom.window, "matchMedia", { value: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }) });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Element: dom.window.Element });
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(document.getElementById("root")!);
  return { render: (node: ReactNode) => act(async () => root.render(node)), click: (button: HTMLButtonElement) => act(async () => button.click()), close: async () => { await act(async () => root.unmount()); dom.window.close(); } };
}

test("code folds keep headers and line numbers, support nested ranges and ignore invalid/crossing ranges", () => {
  const dom = new JSDOM(renderToString(<AgentCodeBlock filename="test.ts" lines={lines} foldRanges={[...ranges, { id: "invalid", startLine: 0, endLine: 10 }, { id: "cross", startLine: 3, endLine: 5 }]} defaultCollapsedRangeIds={["inner"]} />));
  assert.deepEqual([...dom.window.document.querySelectorAll('[data-code-line]')].map(row => row.getAttribute("data-code-line")), ["1", "2", "5", "6"]);
  assert.equal(dom.window.document.querySelectorAll('[aria-expanded]').length, 2);
  assert.ok(dom.window.document.querySelector('[aria-label="展开 inner"]'));
  assert.match(dom.window.document.body.textContent ?? "", /复制/);
  dom.window.close();
});

test("controlled code folding emits next IDs without changing content until the caller updates", async () => {
  const env = await setup();
  const changes: string[][] = [];
  try {
    const render = (collapsedRangeIds: string[]) => env.render(<AgentCodeBlock filename="test.ts" lines={lines} foldRanges={ranges} collapsedRangeIds={collapsedRangeIds} onCollapsedRangeIdsChange={ids => changes.push(ids)} locale="en" />);
    await render([]);
    await env.click(document.querySelector<HTMLButtonElement>('[aria-label="Collapse outer"]')!);
    assert.deepEqual(changes, [["outer"]]);
    assert.equal(document.querySelectorAll('[data-code-line]').length, 6);
    await render(changes[0]);
    assert.equal(document.querySelectorAll('[data-code-line]').length, 1);
    await env.click(document.querySelector<HTMLButtonElement>('[aria-label="Expand outer"]')!);
    assert.deepEqual(changes[1], []);
  } finally { await env.close(); }
});

test("copy uses full code even when folded and rejected clipboard operations expose a retryable status", async () => {
  const env = await setup();
  const calls: string[] = [];
  let reject = true;
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { async writeText(text: string) { calls.push(text); if (reject) throw new Error("blocked"); } } });
  try {
    await env.render(<AgentCodeBlock filename="test.ts" lines={lines} foldRanges={ranges} defaultCollapsedRangeIds={["outer"]} />);
    const copy = () => [...document.querySelectorAll<HTMLButtonElement>("button")].find(button => button.textContent === "复制")!;
    await env.click(copy());
    assert.match(document.querySelector('[role="status"]')?.textContent ?? "", /复制失败/);
    assert.equal(calls[0], lines.join("\n"));
    reject = false;
    await env.click(copy());
    assert.equal(document.querySelector('[role="status"]'), null);
    assert.match(document.body.textContent ?? "", /已复制/);
  } finally { await env.close(); }
});
