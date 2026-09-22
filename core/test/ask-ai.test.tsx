import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";

const nodeProtocol = "node:";
// Dynamic built-in name keeps the test bundle compatible with tsup's CJS output.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${nodeProtocol}test`);

import { AskAi, type AskAiRequest } from "../src/components/ui/ask-ai";
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

test("Ask AI opens a modal drawer, sends context, retries failures and preserves the conversation", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  const requests: AskAiRequest[] = [];
  let fail = true;
  await act(async () => root.render(createElement(AskAi, {
    context: "/projects", suggestions: ["下一步？"],
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
  assert.equal(requests[0].context, "/projects");
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

test("Ask AI omits unchecked context, blocks duplicate sends and aborts on unmount", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  let request: AskAiRequest | undefined;
  let count = 0;
  await act(async () => root.render(createElement(AskAi, {
    context: "/private-page", suggestions: ["总结"],
    onSend: (_message, value) => { count++; request = value; return new Promise<string>(() => {}); },
  })));
  await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Ask AI"]')!.click());
  await act(async () => document.querySelector<HTMLButtonElement>('[role="checkbox"]')!.click());
  const suggestion = [...document.querySelectorAll("button")].find((item) => item.textContent === "总结")!;
  await act(async () => { suggestion.click(); suggestion.click(); });
  assert.equal(count, 1);
  assert.equal(request?.context, undefined);
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


test("Ask AI controls follow both PageHeader variants and update with their accent", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  try {
    for (const variant of ["search", "title"] as const) {
      for (const [color, token] of [["purple", "bg-fg-violet"], ["blue", "bg-fg-blue"], ["black", "bg-fg-black"]] as const) {
        await act(async () => root.render(createElement(PageHeader, {
          variant, color, askAi: { context: "/projects", onSend: () => "回复" },
        })));
        if (!document.querySelector("dialog")) {
          await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Ask AI"]')!.click());
        }
        const dialog = document.querySelector("dialog")!;
        assert.ok(dialog.querySelector('button[aria-label="Send"]')!.classList.contains(token));
        assert.equal(dialog.querySelector('[aria-label="Attach"]'), null);
        assert.equal(dialog.querySelector('[aria-label="Dictate"]'), null);
        assert.ok(dialog.querySelector(`[role="checkbox"] .${token}`));
        assert.equal(dialog.querySelector("img")!.getAttribute("src"), document.querySelector('[aria-label="Ask AI"] img')!.getAttribute("src"));
      }
    }
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
  }
});

function buttonByText(root: ParentNode, label: string) {
  const found = [...root.querySelectorAll("button")].find((item) => item.textContent === label);
  assert.ok(found, `missing button ${label}`);
  return found as HTMLButtonElement;
}

function buttonByName(root: ParentNode, label: string) {
  const found = root.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
  assert.ok(found, `missing button ${label}`);
  return found;
}

test("empty Ask shell shows landing in the drawer and keeps search out of the session menu", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  await act(async () => root.render(createElement(AskAi, { suggestions: ["下一步？"], onSend: () => "回复" })));
  await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Ask AI"]')!.click());
  const dialog = document.querySelector("dialog")!;
  assert.equal(dialog.getAttribute("data-ask-surface"), "drawer");
  const landing = dialog.querySelector('[data-ask-region="landing"]')!;
  assert.equal(landing.querySelector('[data-ask-part="title"]')?.textContent, "你好");
  assert.equal(landing.querySelector('[data-ask-part="status"]')?.textContent, "已就绪");
  assert.match(landing.querySelector('[data-ask-part="hint"]')?.textContent ?? "", /说一句话/);
  assert.equal(buttonByText(landing, "下一步？").textContent, "下一步？");
  assert.ok(dialog.querySelector('[data-ask-region="composer"] textarea'));
  assert.equal(dialog.querySelector('[data-ask-region="messages"]'), null);
  assert.equal(dialog.querySelector("input"), null);
  assert.equal(/数据集|标注任务|质检|qwen/.test(dialog.textContent ?? ""), false);
  await act(async () => buttonByText(dialog, "新对话").click());
  const menu = dialog.querySelector('[data-ask-region="session-menu"]')!;
  assert.equal(menu.querySelector("input"), null);
  assert.match(menu.textContent ?? "", /新建对话/);
  assert.match(menu.textContent ?? "", /暂无最近对话/);
  await act(async () => root.unmount());
  dom.window.close();
});

test("drawer and fullscreen share landing and messages", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  const created: string[] = [];
  await act(async () => root.render(createElement(AskAi, {
    suggestions: ["建议一"],
    onCreateSession: (session) => { created.push(session.title); },
    onSend: () => "已回复",
  })));
  await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Ask AI"]')!.click());
  const dialog = () => document.querySelector("dialog")!;
  await act(async () => buttonByName(dialog(), "全屏").click());
  assert.equal(dialog().getAttribute("data-ask-surface"), "fullscreen");
  const landing = dialog().querySelector('[data-ask-region="landing"]')!;
  assert.equal(landing.querySelector('[data-ask-part="title"]')?.textContent, "今天想做什么？");
  assert.equal(landing.querySelector('[data-ask-part="status"]')?.textContent, "已就绪");
  assert.match(landing.querySelector('[data-ask-part="hint"]')?.textContent ?? "", /左侧建议/);
  const rail = dialog().querySelector('[data-ask-region="rail"]')!;
  assert.ok(rail.querySelector('input[aria-label="搜索"]'));
  assert.match(rail.textContent ?? "", /新建对话/);
  assert.equal(buttonByText(rail, "建议一").textContent, "建议一");
  assert.equal(dialog().querySelector('[data-ask-region="session-menu"]'), null);
  const search = rail.querySelector<HTMLInputElement>('input[aria-label="搜索"]')!;
  async function setSearch(value: string) {
    await act(async () => {
      search.focus();
      search.dispatchEvent(new Event("focusin", { bubbles: true }));
    });
    await act(async () => {
      const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      setValue?.call(search, value);
      search.dispatchEvent(new Event("input", { bubbles: true }));
      search.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
    });
  }
  await setSearch("没有这条");
  assert.match(rail.textContent ?? "", /暂无最近对话/);
  assert.equal([...rail.querySelectorAll("button")].some((item) => item.textContent === "建议一"), false);
  await setSearch("");
  await act(async () => buttonByText(rail, "建议一").click());
  assert.deepEqual(created, ["建议一"]);
  assert.equal(dialog().querySelector('[data-ask-region="landing"]'), null);
  assert.match(dialog().querySelector('[data-ask-region="messages"]')?.textContent ?? "", /已回复/);
  await act(async () => buttonByName(dialog(), "退出全屏").click());
  assert.equal(dialog().getAttribute("data-ask-surface"), "drawer");
  assert.equal(dialog().querySelector("input"), null);
  assert.match(dialog().querySelector('[data-ask-region="messages"]')?.textContent ?? "", /已回复/);
  await act(async () => dialog().querySelector<HTMLButtonElement>('[aria-haspopup="listbox"]')!.click());
  await act(async () => buttonByText(dialog(), "＋ 新建对话").click());
  assert.equal(dialog().querySelector('[data-ask-region="landing"]')?.querySelector('[data-ask-part="title"]')?.textContent, "你好");
  await act(async () => buttonByText(dialog(), "新对话").click());
  await act(async () => buttonByText(dialog().querySelector('[data-ask-region="session-menu"]')!, "建议一").click());
  assert.match(dialog().querySelector('[data-ask-region="messages"]')?.textContent ?? "", /已回复/);
  await act(async () => root.unmount());
  dom.window.close();
});

test("landing props and slots replace copy without dropping the shell regions", async () => {
  const dom = installDom();
  const root = createRoot(document.querySelector("#root")!);
  const sent: string[] = [];
  await act(async () => root.render(createElement(AskAi, {
    landing: {
      title: "自定义标题",
      fullscreenTitle: "全屏标题",
      status: "状态短句",
      hint: "说明短句",
      fullscreenHint: "全屏说明",
      suggestions: [{ label: "卡片文案", prompt: "实际发送" }],
    },
    onSend: (message) => { sent.push(message); return "好"; },
  })));
  await act(async () => document.querySelector<HTMLButtonElement>('[aria-label="Ask AI"]')!.click());
  const dialog = () => document.querySelector("dialog")!;
  assert.equal(dialog().querySelector('[data-ask-part="title"]')?.textContent, "自定义标题");
  assert.equal(dialog().querySelector('[data-ask-part="status"]')?.textContent, "状态短句");
  assert.equal(dialog().querySelector('[data-ask-part="hint"]')?.textContent, "说明短句");
  await act(async () => buttonByText(dialog(), "卡片文案").click());
  assert.deepEqual(sent, ["实际发送"]);
  await act(async () => dialog().querySelector<HTMLButtonElement>('[aria-haspopup="listbox"]')!.click());
  await act(async () => buttonByText(dialog(), "＋ 新建对话").click());
  await act(async () => buttonByName(dialog(), "全屏").click());
  assert.equal(dialog().querySelector('[data-ask-part="title"]')?.textContent, "全屏标题");
  assert.equal(dialog().querySelector('[data-ask-part="hint"]')?.textContent, "全屏说明");
  await act(async () => buttonByName(dialog(), "退出全屏").click());
  await act(async () => root.render(createElement(AskAi, {
    slots: {
      landing: createElement("p", null, "槽位落地"),
      messages: createElement("p", null, "宿主消息"),
      composer: createElement("p", null, "宿主输入"),
      rail: createElement("p", null, "宿主左栏"),
    },
    sessions: [{ id: "s1", title: "已有会话" }],
    activeSessionId: null,
    onSend: () => "不会显示",
  })));
  assert.match(dialog().textContent ?? "", /槽位落地/);
  assert.equal(dialog().querySelector('[data-ask-part="title"]'), null);
  assert.match(dialog().textContent ?? "", /宿主输入/);
  assert.equal(dialog().querySelector('[aria-label="Send"]'), null);
  await act(async () => root.render(createElement(AskAi, {
    slots: {
      landing: createElement("p", null, "槽位落地"),
      messages: createElement("p", null, "宿主消息"),
    },
    sessions: [{ id: "s1", title: "已有会话" }],
    activeSessionId: "s1",
    onSend: () => "不会显示",
  })));
  assert.match(dialog().querySelector('[data-ask-region="messages"]')?.textContent ?? "", /宿主消息/);
  assert.equal(dialog().querySelector('[data-ask-region="landing"]'), null);
  await act(async () => buttonByName(dialog(), "全屏").click());
  assert.match(dialog().querySelector('[data-ask-region="messages"]')?.textContent ?? "", /宿主消息/);
  assert.match(dialog().querySelector('[data-ask-region="rail"]')?.textContent ?? "", /已有会话/);
  await act(async () => root.unmount());
  dom.window.close();
});
