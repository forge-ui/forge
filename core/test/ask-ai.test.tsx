import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";

const nodeProtocol = "node:";
// Dynamic built-in name keeps the test bundle compatible with tsup's CJS output.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${nodeProtocol}test`);

import { AskAi, type AskAiRequest } from "../src/components/ui/ask-ai";
import { PageTitleToolbar } from "../src/components/ui/toolbar";
import { PageHeader } from "../src/components/ui/page-header";

function installDom() {
  const dom = new JSDOM(
    "<!doctype html><html><body><div id=\"root\"></div></body></html>",
    { url: "http://localhost/" },
  );

  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    self: dom.window,
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    Event: dom.window.Event,
    MouseEvent: dom.window.MouseEvent,
    KeyboardEvent: dom.window.KeyboardEvent,
    getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
    // Reduced motion keeps replies whole; the panel's wide-screen inset stays off.
    matchMedia: (query: string) => ({ matches: query.includes("reduce"), addEventListener() {}, removeEventListener() {} }),
  });
  Object.assign(dom.window, { matchMedia: globalThis.matchMedia });

  // React is imported before JSDOM; match the existing input-focus test shim.
  Object.assign(dom.window.HTMLElement.prototype, { attachEvent: () => undefined, detachEvent: () => undefined, scrollTo: () => undefined });
  return dom;
}

const panel = () => document.querySelector<HTMLElement>('[data-forge-agent="panel"]');
const buttonIn = (scope: ParentNode, label: string) => [...scope.querySelectorAll("button")].find((item) => item.textContent === label)!;

test("The header entry opens the Forge Agent panel, retries failures and keeps the conversation", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  const requests: AskAiRequest[] = [];
  let fail = true;
  await act(async () => root.render(createElement(AskAi, {
    suggestions: ["下一步？"],
    onSend: async (_message, request) => { requests.push(request); if (fail) throw new Error("offline"); return "先创建项目"; },
  })));
  const trigger = document.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
  assert.equal(trigger.getAttribute("aria-label"), "Forge Agent");
  assert.equal(panel(), null);
  await act(async () => trigger.click());
  assert.equal(panel()?.getAttribute("aria-label"), "Forge Agent");
  await act(async () => buttonIn(panel()!, "下一步？").click());
  assert.equal("context" in requests[0], false);
  assert.equal(requests[0].messages.length, 1);
  assert.ok(panel()!.querySelector('[role="alert"]'));
  fail = false;
  await act(async () => buttonIn(panel()!, "重试").click());
  assert.equal(requests[1].messages.length, 1);
  assert.ok(panel()!.querySelector('[role="log"]')?.textContent?.includes("先创建项目"));
  await act(async () => panel()!.querySelector<HTMLButtonElement>('[aria-label="关闭"]')!.click());
  assert.equal(panel(), null);
  await act(async () => trigger.click());
  assert.ok(panel()!.querySelector('[role="log"]')?.textContent?.includes("先创建项目"));
  await act(async () => root.unmount());
  dom.window.close();
});

test("Sending blocks duplicates, shows thinking, stops on request and aborts on unmount", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  const requests: AskAiRequest[] = [];
  await act(async () => root.render(createElement(AskAi, {
    suggestions: ["总结"],
    onSend: (_message, value) => { requests.push(value); return new Promise<string>(() => {}); },
  })));
  await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Forge Agent"]')!.click());
  const suggestion = buttonIn(panel()!, "总结");
  await act(async () => { suggestion.click(); suggestion.click(); });
  assert.equal(requests.length, 1);
  assert.ok(panel()!.querySelector('[role="status"]'));
  const stop = panel()!.querySelector<HTMLButtonElement>('button[aria-label="停止生成"], button[aria-label="停止"]');
  assert.ok(stop);
  await act(async () => stop!.click());
  assert.equal(requests[0].signal.aborted, true);
  await act(async () => root.unmount());
  assert.equal(requests.at(-1)?.signal.aborted, true);
  dom.window.close();
});

test("Both PageHeader variants and the toolbar keep the same entry", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  await act(async () => root.render(createElement(PageHeader, { title: "Legacy" })));
  assert.equal(document.querySelector('[aria-label="Forge Agent"]'), null);
  const askAi = { onSend: () => "回复" };
  await act(async () => root.render(createElement("div", null,
    createElement(PageHeader, { variant: "title", askAi }),
    createElement(PageHeader, { variant: "search", showMobileMenuButton: true, askAi }),
    createElement(PageTitleToolbar, { variant: "overview", title: "总览", breadcrumbItems: [], askAi }),
  )));
  const triggers = document.querySelectorAll<HTMLButtonElement>('[aria-label="Forge Agent"]');
  assert.equal(triggers.length, 3);
  for (const trigger of triggers) assert.ok(trigger.querySelector("svg"));
  await act(async () => root.unmount());
  dom.window.close();
});

test("Structured replies render at most two safe links", async () => {
  for (const [links, expected] of [
    [undefined, []],
    [[{ label: "项目", href: "/projects?status=active" }, { label: "任务", href: "/tasks#pending" }, { label: "额外入口", href: "/extra" }], ["/projects?status=active", "/tasks#pending"]],
    [[{ label: "脚本", href: "javascript:alert(1)" }, { label: "数据", href: "data:text/html,test" }, { label: "", href: "/empty-label" }, { label: "空地址", href: " " }, { label: "有效路由", href: "/valid" }], ["/valid"]],
  ] as const) {
    const dom = installDom();
    const root = createRoot(document.querySelector("#root")!);
    await act(async () => root.render(createElement(PageHeader, {
      title: "Projects",
      askAi: { suggestions: ["提问"], onSend: async () => ({ text: "对象回复", links: links ? [...links] : undefined }) },
    })));
    await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Forge Agent"]')!.click());
    await act(async () => buttonIn(panel()!, "提问").click());
    const log = panel()!.querySelector('[role="log"]')!;
    assert.ok(log.textContent?.includes("对象回复"));
    assert.deepEqual([...log.querySelectorAll("a")].map((link) => link.getAttribute("href")), expected);
    await act(async () => root.unmount());
    dom.window.close();
  }
});

test("The panel copies an ancestor data-accent unless a color is given", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  try {
    await act(async () => root.render(createElement("div", { "data-accent": "blue" }, createElement(AskAi, { onSend: () => "回复" }))));
    await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Forge Agent"]')!.click());
    assert.equal(panel()!.closest("[data-accent]")?.getAttribute("data-accent"), "blue");
    await act(async () => root.render(createElement("div", { "data-accent": "blue" }, createElement(AskAi, { color: "black", onSend: () => "回复" }))));
    assert.equal(panel()!.parentElement?.getAttribute("data-accent"), "black");
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
  }
});

test("History lists the given sessions and switches the transcript", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  const selected: string[] = [];
  let created = 0;
  await act(async () => root.render(createElement(AskAi, {
    sessions: [{ id: "s1", title: "上周的探索" }, { id: "s2", title: "版本对比" }],
    currentSessionId: "s1",
    onSelectSession: (id: string) => selected.push(id),
    onNewSession: () => created++,
    onSend: () => "回复",
  })));
  await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Forge Agent"]')!.click());
  await act(async () => panel()!.querySelector<HTMLButtonElement>('[aria-label="历史对话"]')!.click());
  const history = panel()!.querySelector('nav[aria-label="历史对话"]')!;
  assert.match(history.textContent ?? "", /上周的探索/);
  await act(async () => [...history.querySelectorAll("button")].find((item) => item.textContent?.includes("版本对比"))!.click());
  assert.deepEqual(selected, ["s2"]);
  await act(async () => panel()!.querySelector<HTMLButtonElement>('[aria-label="新对话"]')!.click());
  assert.equal(created, 1);
  await act(async () => root.unmount());
  dom.window.close();
});

test("Custom messages and composer replace the built-in conversation", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  await act(async () => root.render(createElement(AskAi, {
    onSend: () => "回复",
    messages: createElement("p", { "data-custom-messages": "" }, "自己的对话"),
    composer: createElement("form", { "data-custom-composer": "" }),
  })));
  await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Forge Agent"]')!.click());
  assert.ok(panel()!.querySelector("[data-custom-messages]"));
  assert.ok(panel()!.querySelector("[data-custom-composer]"));
  assert.equal(panel()!.querySelector("textarea"), null);
  await act(async () => root.unmount());
  dom.window.close();
});
