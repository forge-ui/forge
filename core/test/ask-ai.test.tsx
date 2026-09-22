import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";

const nodeProtocol = "node:";
// Dynamic built-in name keeps the test bundle compatible with tsup's CJS output.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${nodeProtocol}test`);

import { AskAi, ASK_AI_FS_LAYER_ATTR, type AskAiRequest } from "../src/components/ui/ask-ai";
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
  });

  // React is imported before JSDOM; match the existing input-focus test shim.
  Object.assign(dom.window.HTMLElement.prototype, { attachEvent: () => undefined, detachEvent: () => undefined });
  dom.window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  dom.window.HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
  return dom;
}

test("Ask AI opens a modal drawer, retries failures and preserves the conversation", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  const requests: AskAiRequest[] = [];
  let fail = true;
  await act(async () => root.render(createElement(AskAi, {
    suggestions: ["下一步？"],
    onSend: async (_message, request) => { requests.push(request); if (fail) throw new Error("offline"); return "先创建项目"; },
  })));
  const trigger = document.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')!;
  await act(async () => trigger.click());
  const dialog = document.querySelector("dialog")!;
  assert.ok(dialog.open);
  assert.equal(document.body.style.overflow, "hidden");
  assert.equal(document.activeElement?.getAttribute("aria-label"), "向 AI 提问");
  assert.equal(document.querySelector('[role="menu"]'), null);
  const button = (label: string) => [...dialog.querySelectorAll("button")].find((item) => item.textContent === label)!;
  await act(async () => button("下一步？").click());
  assert.equal("context" in requests[0], false);
  assert.equal(requests[0].messages.length, 1);
  assert.ok(dialog.querySelector('[role="alert"]'));
  fail = false;
  await act(async () => button("重试").click());
  assert.equal(requests[1].messages.length, 1);
  assert.ok(dialog.querySelector('[role="log"]')?.textContent?.includes("先创建项目"));
  await act(async () => dialog.dispatchEvent(new Event("cancel", { bubbles: false, cancelable: true })));
  assert.equal(document.querySelector("dialog"), null);
  assert.equal(document.body.style.overflow, "");
  assert.equal(document.activeElement, trigger);
  await act(async () => trigger.click());
  assert.ok(document.querySelector('[role="log"]')?.textContent?.includes("先创建项目"));
  await act(async () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })));
  assert.equal(document.querySelector("dialog"), null);
  assert.equal(document.activeElement, trigger);
  await act(async () => root.unmount());
  dom.window.close();
});

test("Ask AI does not send the current page, blocks duplicate sends and aborts on unmount", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  let request: AskAiRequest | undefined;
  let count = 0;
  await act(async () => root.render(createElement(AskAi, {
    suggestions: ["总结"],
    onSend: (_message, value) => { count++; request = value; return new Promise<string>(() => {}); },
  })));
  await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Ask AI"]')!.click());
  const dialog = document.querySelector("dialog")!;
  assert.equal(dialog.textContent?.includes("当前页"), false);
  assert.equal(dialog.querySelector('[role="checkbox"]'), null);
  const suggestion = [...document.querySelectorAll("button")].find((item) => item.textContent === "总结")!;
  await act(async () => { suggestion.click(); suggestion.click(); });
  assert.equal(count, 1);
  assert.equal(request && "context" in request, false);
  assert.ok(document.querySelector('[role="status"]'));
  await act(async () => root.unmount());
  assert.equal(request?.signal.aborted, true);
  assert.equal(document.body.style.overflow, "");
  dom.window.close();
});

test("Both PageHeader variants opt in to Ask AI with isolated SVG image resources", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  await act(async () => root.render(createElement(PageHeader, { title: "Legacy" })));
  assert.equal(document.querySelector('[aria-label="Ask AI"]'), null);
  const askAi = { onSend: () => "回复" };
  await act(async () => root.render(createElement("div", null,
    createElement(PageHeader, { variant: "title", askAi }),
    createElement(PageHeader, { variant: "search", showMobileMenuButton: true, askAi }),
  )));
  const triggers = document.querySelectorAll<HTMLButtonElement>('[aria-label="Ask AI"]');
  assert.equal(triggers.length, 2);
  assert.equal(triggers[1].parentElement?.className.includes("hidden"), false);
  for (const trigger of triggers) {
    const image = trigger.querySelector("img")!;
    assert.match(image.src, /^data:image\/svg\+xml;base64,/);
    const svg = Buffer.from(image.src.split(",")[1], "base64").toString();
    assert.match(svg, /linearGradient/);
    assert.match(svg, /#22D3EE/);
    assert.equal(image.width, 24);
    assert.equal(image.alt, "");
  }
  await act(async () => root.unmount());
  dom.window.close();
});

test("PageHeader built-in Ask AI accepts structured replies and renders at most two route links", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  await act(async () => root.render(createElement(PageHeader, {
    title: "Projects", primaryAction: { label: "新建项目" },
    askAi: {
      suggestions: ["下一步"],
      onSend: async () => ({ text: "请选择下一步", links: [
        { label: "项目", href: "/projects?status=active" },
        { label: "任务", href: "/tasks#pending" },
        { label: "额外入口", href: "/extra" },
      ] }),
    },
  })));
  assert.ok([...document.querySelectorAll("button")].some((button) => button.textContent === "新建项目"));
  await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Ask AI"]')!.click());
  await act(async () => [...document.querySelectorAll("dialog button")].find((button) => button.textContent === "下一步")!.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  const log = document.querySelector('[role="log"]')!;
  assert.ok(log.textContent?.includes("请选择下一步"));
  assert.deepEqual([...log.querySelectorAll("a")].map((link) => [link.textContent, link.getAttribute("href")]), [
    ["项目", "/projects?status=active"], ["任务", "/tasks#pending"],
  ]);
  await act(async () => root.unmount());
  dom.window.close();
});

test("Structured replies omit unsafe or empty links and support text-only objects", async () => {
  for (const links of [undefined, [], [
    { label: "脚本", href: "javascript:alert(1)" },
    { label: "数据", href: "data:text/html,test" },
    { label: "", href: "/empty-label" },
    { label: "空地址", href: " " },
    { label: "有效路由", href: "/valid" },
  ]]) {
    const dom = installDom();
    const root = createRoot(document.querySelector("#root")!);
    await act(async () => root.render(createElement(AskAi, {
      suggestions: ["提问"], onSend: () => ({ text: "对象回复", links }),
    })));
    await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Ask AI"]')!.click());
    await act(async () => [...document.querySelectorAll("dialog button")].find((button) => button.textContent === "提问")!.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    assert.ok(document.querySelector('[role="log"]')?.textContent?.includes("对象回复"));
    assert.deepEqual([...document.querySelectorAll('dialog a')].map((link) => link.getAttribute("href")), links?.length ? ["/valid"] : []);
    await act(async () => root.unmount());
    dom.window.close();
  }
});


test("Ask AI send button uses the shared accent and copies an ancestor data-accent", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  try {
    for (const variant of ["search", "title"] as const) {
      await act(async () => root.render(createElement(PageHeader, {
        variant, askAi: { onSend: () => "回复" },
      })));
      if (!document.querySelector("dialog")) {
        await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Ask AI"]')!.click());
      }
      const dialog = document.querySelector("dialog")!;
      assert.ok(dialog.querySelector('button[type="submit"]')!.classList.contains("bg-accent"));
      assert.equal(dialog.getAttribute("data-accent"), null);
      assert.equal(dialog.querySelector("img")!.getAttribute("src"), document.querySelector('[aria-label="Ask AI"] img')!.getAttribute("src"));
    }
    await act(async () => root.render(createElement("div", { "data-accent": "blue" },
      createElement(AskAi, { onSend: () => "回复" }),
    )));
    await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Ask AI"]')!.click());
    assert.equal(document.querySelector("dialog")!.getAttribute("data-accent"), "blue");
    await act(async () => root.render(createElement("div", { "data-accent": "blue" },
      createElement(AskAi, { color: "black", onSend: () => "回复" }),
    )));
    await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Ask AI"]')!.click());
    assert.equal(document.querySelector("dialog")!.getAttribute("data-accent"), "black");
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
  }
});

test("Ask AI drawer history menu lists sessions and switches the transcript", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  const selected: string[] = [];
  let sessions = [
    { id: "s1", title: "上周的探索" },
    { id: "s2", title: "版本对比" },
  ];
  let current = "s1";
  function render() {
    return createElement(AskAi, {
      suggestions: ["总结"],
      sessions,
      currentSessionId: current,
      onSelectSession: (id: string) => { selected.push(id); current = id; },
      onNewSession: () => {
        sessions = [{ id: "s3", title: "新对话" }, ...sessions];
        current = "s3";
      },
      onSend: () => "回复",
    });
  }
  await act(async () => root.render(render()));
  await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Ask AI"]')!.click());
  const dialog = () => document.querySelector("dialog")!;
  assert.equal(dialog().querySelector('[aria-label="历史对话"]')?.textContent, "上周的探索");
  await act(async () => dialog().querySelector<HTMLButtonElement>('[aria-label="历史对话"]')!.click());
  const menu = dialog().querySelector("[data-ask-session-menu]")!;
  assert.match(menu.textContent ?? "", /新建对话/);
  assert.match(menu.textContent ?? "", /版本对比/);
  await act(async () => [...menu.querySelectorAll("button")].find((item) => item.textContent === "版本对比")!.click());
  assert.deepEqual(selected, ["s2"]);
  await act(async () => root.render(render()));
  assert.equal(dialog().querySelector('[aria-label="历史对话"]')?.textContent, "版本对比");
  assert.equal(dialog().querySelector("[data-ask-session-menu]"), null);
  await act(async () => dialog().querySelector<HTMLButtonElement>('[aria-label="历史对话"]')!.click());
  await act(async () => [...dialog().querySelectorAll("button")].find((item) => item.textContent === "新建对话")!.click());
  await act(async () => root.render(render()));
  assert.equal(dialog().querySelector('[aria-label="历史对话"]')?.textContent, "新对话");
  await act(async () => root.unmount());
  dom.window.close();
});

test("Ask AI opens an independent fullscreen layer from the drawer and can return", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  await act(async () => root.render(createElement(AskAi, {
    suggestions: ["总结"],
    onSend: () => "回复",
  })));
  await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Ask AI"]')!.click());
  assert.ok(document.querySelector("dialog"));
  await act(async () => document.querySelector<HTMLButtonElement>("[data-ask-ai-fullscreen]")!.click());
  assert.equal(document.querySelector("dialog"), null);
  const layer = document.querySelector(`[${ASK_AI_FS_LAYER_ATTR}]`);
  assert.ok(layer);
  assert.ok(layer?.querySelector("[data-ask-ai-fs-rail]"));
  assert.ok(layer?.querySelector("[data-ask-ai-fs-landing]"));
  assert.match(layer?.querySelector("h2")?.className ?? "", /text-3xl/);
  assert.equal(layer?.querySelector("[data-ask-ai-fs-new]")?.className.includes("bg-transparent"), true);
  await act(async () => document.querySelector<HTMLButtonElement>("[data-ask-ai-exit-fullscreen]")!.click());
  assert.equal(document.querySelector(`[${ASK_AI_FS_LAYER_ATTR}]`), null);
  assert.ok(document.querySelector("dialog"));
  await act(async () => root.unmount());
  dom.window.close();
});

test("Ask AI fullscreen is controlled and accepts session props plus slots", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  const selected: string[] = [];
  const news: string[] = [];
  let fullscreen = true;
  function render() {
    return createElement(AskAi, {
      fullscreen,
      onFullscreenChange: (open: boolean) => { fullscreen = open; },
      onSend: () => "回复",
      sessions: [
        { id: "s1", title: "上周的探索" },
        { id: "s2", title: "版本对比" },
      ],
      currentSessionId: "s1",
      searchQuery: "版本",
      onNewSession: () => { news.push("new"); },
      onSelectSession: (id: string) => { selected.push(id); },
      brand: createElement("div", { "data-ask-ai-brand-slot": "" }, "Brand"),
      messages: createElement("div", { "data-ask-ai-messages-slot": "" }, "Messages"),
      composer: createElement("div", { "data-ask-ai-composer-slot": "" }, "Composer"),
    });
  }
  await act(async () => root.render(render()));
  const layer = document.querySelector(`[${ASK_AI_FS_LAYER_ATTR}]`)!;
  assert.equal(document.querySelector("dialog"), null);
  assert.ok(layer.querySelector("[data-ask-ai-brand-slot]"));
  assert.ok(layer.querySelector("[data-ask-ai-messages-slot]"));
  assert.ok(layer.querySelector("[data-ask-ai-composer-slot]"));
  assert.ok(layer.querySelector("[data-ask-ai-fs-chat]"));
  assert.equal(layer.querySelector("[data-ask-ai-fs-landing]"), null);
  const active = layer.querySelector<HTMLButtonElement>("[data-ask-ai-fs-hist='s1']")!;
  assert.match(active.className, /bg-accent-soft/);
  await act(async () => layer.querySelector<HTMLButtonElement>("[data-ask-ai-fs-hist='s2']")!.click());
  assert.deepEqual(selected, ["s2"]);
  await act(async () => layer.querySelector<HTMLButtonElement>("[data-ask-ai-fs-new]")!.click());
  assert.deepEqual(news, ["new"]);
  const search = layer.querySelector<HTMLInputElement>("[data-ask-ai-fs-rail-search] input")!;
  assert.equal(search.getAttribute("aria-label"), "搜索历史");
  assert.equal(search.value, "版本");
  await act(async () => document.querySelector<HTMLButtonElement>("[data-ask-ai-exit-fullscreen]")!.click());
  assert.equal(fullscreen, false);
  await act(async () => root.unmount());
  dom.window.close();
});

test("Ask AI drawer slots replace default regions without opening fullscreen", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  await act(async () => root.render(createElement(AskAi, {
    onSend: () => "回复",
    header: createElement("div", { "data-ask-ai-header-slot": "" }, "Header"),
    messages: createElement("div", { "data-ask-ai-messages-slot": "" }, "Body"),
    composer: createElement("div", { "data-ask-ai-composer-slot": "" }, "Input"),
  })));
  await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Ask AI"]')!.click());
  const dialog = document.querySelector("dialog")!;
  assert.ok(dialog.querySelector("[data-ask-ai-header-slot]"));
  assert.ok(dialog.querySelector("[data-ask-ai-messages-slot]"));
  assert.ok(dialog.querySelector("[data-ask-ai-composer-slot]"));
  assert.equal(dialog.querySelector('[aria-label="关闭 Ask AI"]'), null);
  assert.equal(document.querySelector(`[${ASK_AI_FS_LAYER_ATTR}]`), null);
  await act(async () => root.unmount());
  dom.window.close();
});
