import assert from "node:assert/strict";
import { before, beforeEach, test } from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://app.example.com/accounts", pretendToBeVisual: true });
const globals = ["window", "document", "location", "HTMLElement", "HTMLInputElement", "HTMLTextAreaElement", "HTMLSelectElement", "HTMLButtonElement", "HTMLAnchorElement", "Element", "Event", "MouseEvent", "KeyboardEvent", "MutationObserver", "getComputedStyle", "requestAnimationFrame", "matchMedia"] as const;
before(() => {
  Object.assign(dom.window, { matchMedia: () => ({ matches: false }), PointerEvent: dom.window.MouseEvent });
  for (const name of globals) Object.defineProperty(globalThis, name, { value: dom.window[name as keyof typeof dom.window] ?? dom.window[name as never], configurable: true, writable: true });
  Object.defineProperty(globalThis, "PointerEvent", { value: dom.window.MouseEvent, configurable: true, writable: true });
  Object.defineProperty(globalThis, "innerHeight", { value: 800, configurable: true });
  Object.defineProperty(globalThis, "innerWidth", { value: 1200, configurable: true });
  // jsdom has no layout; give every element a box inside the viewport.
  dom.window.Element.prototype.getBoundingClientRect = () => ({ x: 100, y: 100, left: 100, top: 100, width: 80, height: 32, right: 180, bottom: 132, toJSON: () => ({}) });
});

const { readPage, elementFor, isRisky } = await import("../src/operator/page");
const { pageTools } = await import("../src/operator/tools");

beforeEach(() => {
  document.body.innerHTML = `
    <header><nav><a href="/docs">文档</a></nav></header>
    <main>
      <h1>新建账号</h1>
      <p>主色</p>
      <div><button aria-pressed="true">紫</button><button>橙</button></div>
      <label for="name">姓名</label><input id="name" value="">
      <label for="secret">密码</label><input id="secret" type="password" value="hunter2">
      <select aria-label="角色"><option value="ops">运营</option><option value="admin">管理员</option></select>
      <div data-agent-ignore><button>内部按钮</button></div>
      <form><button>创建</button></form>
      <button>删除账号</button>
    </main>`;
});

const idOf = (page: string, text: string) => page.split("\n").find(line => line.includes(text))?.match(/\[(e\d+)\]/)?.[1] ?? assert.fail(`${text} not listed`);

test("readPage lists main content first, with captions, and hides what the agent must not see", () => {
  const page = readPage();
  assert.ok(page.indexOf("主内容") < page.indexOf("按钮「紫」") && page.indexOf("按钮「紫」") < page.indexOf("链接「文档」"));
  assert.match(page, /按钮「紫」（主色） 已选中/);
  assert.match(page, /输入框「密码」 敏感字段，不可读写/);
  assert.doesNotMatch(page, /hunter2/);
  assert.doesNotMatch(page, /内部按钮/);
  assert.match(page, /下拉框「角色」 当前「运营」/);
});

test("ids stay with their element across reads", () => {
  const first = idOf(readPage(), "按钮「橙」");
  assert.equal(idOf(readPage(), "按钮「橙」"), first);
});

test("an id used with the wrong name is refused", () => {
  const id = idOf(readPage(), "按钮「橙」");
  assert.throws(() => elementFor(id, "删除账号"), /不是「删除账号」/);
  assert.equal(elementFor(id, "橙色").textContent, "橙");
});

test("submit buttons and destructive words need confirmation", () => {
  const page = readPage();
  assert.equal(isRisky(elementFor(idOf(page, "按钮「创建」"))), true);
  assert.equal(isRisky(elementFor(idOf(page, "按钮「删除账号」"))), true);
  assert.equal(isRisky(elementFor(idOf(page, "按钮「橙」"))), false);
});

test("page tools type through React's value setter, choose options and refuse secrets", async () => {
  const tools = Object.fromEntries(pageTools({ mode: "direct" }).map(item => [item.name, item]));
  const page = readPage();
  const typed: string[] = [];
  document.getElementById("name")!.addEventListener("input", event => typed.push((event.target as HTMLInputElement).value));

  await tools.type_text.execute({ id: idOf(page, "输入框「姓名」"), name: "姓名", text: "张三" });
  assert.equal((document.getElementById("name") as HTMLInputElement).value, "张三");
  assert.equal(typed.at(-1), "张三");

  await tools.select_option.execute({ id: idOf(page, "下拉框「角色」"), name: "角色", option: "管理员" });
  assert.equal(document.querySelector("select")!.value, "admin");

  await assert.rejects(async () => tools.type_text.execute({ id: idOf(page, "输入框「密码」"), name: "密码", text: "x" }), /敏感字段/);
  assert.equal(tools.click.needsApprovalFor?.({ id: idOf(page, "按钮「删除账号」"), name: "删除账号" }), true);
});
