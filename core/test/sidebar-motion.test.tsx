import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { AppLayout, type AppLayoutMenuSection } from "../src/components/layouts/app-layout";

const nodeProtocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${nodeProtocol}test`);

const sections: AppLayoutMenuSection[] = [
  { label: "工作区", items: [{ label: "工作台", href: "/preview", icon: <span aria-hidden="true">⌂</span> }] },
  {
    label: "协作",
    items: [
      { label: "我的任务", href: "/preview/tasks", badge: 12, icon: <span aria-hidden="true">✓</span> },
      {
        label: "项目管理",
        icon: <span aria-hidden="true">▣</span>,
        children: [
          { label: "进行中的项目", href: "/preview/projects/active", badge: 8 },
          { label: "已归档项目", href: "/preview/projects/archived" },
        ],
      },
    ],
  },
  { label: "管理", items: [{ label: "应用设置", href: "/preview/settings", icon: <span aria-hidden="true">⚙</span> }] },
];

function installDom() {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/" });
  Object.defineProperty(dom.window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
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
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 0),
    cancelAnimationFrame: (handle: number) => clearTimeout(handle),
  });
  return dom;
}

function currentLinks() {
  return [...document.querySelectorAll<HTMLAnchorElement>('[data-forge-sidebar-scroll] a[aria-current="page"]')];
}

async function toggleSidebar(label: "收起主导航" | "展开主导航") {
  const button = document.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
  assert.ok(button);
  await act(async () => button.click());
}

for (const motion of ["auto", "none"] as const) {
  test(`AppLayout ${motion}: 反复折叠和路由切换后仅最长匹配叶子为当前页`, async () => {
    const dom = installDom();
    const root = createRoot(document.getElementById("root")!);
    const renderPath = async (pathname: string) => {
      await act(async () => root.render(
        <PathnameContext.Provider value={pathname}>
          <AppLayout menuSections={sections} motion={motion} profilePosition="sidebar" hideSidebarWidgets hideHeader>
            <main>页面内容</main>
          </AppLayout>
        </PathnameContext.Provider>,
      ));
    };
    try {
      await renderPath("/preview/tasks/detail");
      assert.equal(document.querySelector('[data-forge-app-sidebar]')?.getAttribute("data-motion"), motion);
      for (let cycle = 0; cycle < 4; cycle += 1) {
        for (const route of ["/preview/tasks", "/preview/settings"]) {
          await renderPath(`${route}/detail`);
          assert.deepEqual(currentLinks().map((link) => link.getAttribute("href")), [route]);
          await toggleSidebar("收起主导航");
          assert.deepEqual(currentLinks().map((link) => link.getAttribute("href")), [route]);
          await toggleSidebar("展开主导航");
          assert.deepEqual(currentLinks().map((link) => link.getAttribute("href")), [route]);
        }
      }
    } finally {
      await act(async () => root.unmount());
      dom.window.close();
    }
  });

  test(`AppLayout ${motion}: 收起菜单保留可聚焦链接、名称与分支首项目标`, async () => {
    const dom = installDom();
    const root = createRoot(document.getElementById("root")!);
    try {
      await act(async () => root.render(
        <PathnameContext.Provider value="/preview/tasks">
          <AppLayout menuSections={sections} motion={motion} hideHeader><main>页面内容</main></AppLayout>
        </PathnameContext.Provider>,
      ));
      await toggleSidebar("收起主导航");
      const railLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-forge-sidebar-scroll] a[title]')];
      assert.deepEqual(railLinks.map((link) => link.title), ["工作台", "我的任务", "项目管理", "应用设置"]);
      for (const link of railLinks) {
        assert.ok(link.getAttribute("aria-label") || link.title || link.textContent?.trim());
        assert.equal(link.closest("[inert]"), null);
        link.focus();
        assert.equal(document.activeElement, link);
      }
      assert.equal(railLinks.find((link) => link.title === "项目管理")?.getAttribute("href"), "/preview/projects/active");
      await toggleSidebar("展开主导航");
      assert.ok(document.querySelector('[data-forge-sidebar-scroll]')?.textContent?.includes("12"));
    } finally {
      await act(async () => root.unmount());
      dom.window.close();
    }
  });

  test(`AppLayout ${motion}: 子路由命中默认展开并在折叠往返后恢复唯一当前项`, async () => {
    const dom = installDom();
    const root = createRoot(document.getElementById("root")!);
    const renderPath = async (pathname: string) => {
      await act(async () => root.render(
        <PathnameContext.Provider value={pathname}>
          <AppLayout menuSections={sections} motion={motion} hideHeader><main>页面内容</main></AppLayout>
        </PathnameContext.Provider>,
      ));
    };
    try {
      await renderPath("/preview/projects/active/detail");
      const branch = () => [...document.querySelectorAll<HTMLElement>('[data-forge-sidebar-scroll] :is(button, [role="button"])[aria-expanded]')]
        .find((button) => button.textContent?.includes("项目管理"));
      assert.equal(branch()?.getAttribute("aria-expanded"), "true");
      assert.deepEqual(currentLinks().map((link) => link.getAttribute("href")), ["/preview/projects/active"]);
      assert.equal(currentLinks()[0]?.closest("[inert]"), null);

      await act(async () => branch()!.click());
      assert.equal(branch()?.getAttribute("aria-expanded"), "false");
      assert.ok(currentLinks()[0]?.closest('[inert][aria-hidden="true"]'));
      await renderPath("/preview/projects/archived/detail");
      assert.equal(branch()?.getAttribute("aria-expanded"), "true");

      for (let cycle = 0; cycle < 3; cycle += 1) {
        await toggleSidebar("收起主导航");
        assert.ok(document.querySelector('a[title="项目管理"]'));
        await toggleSidebar("展开主导航");
        assert.equal(branch()?.getAttribute("aria-expanded"), "true");
        assert.deepEqual(currentLinks().map((link) => link.getAttribute("href")), ["/preview/projects/archived"]);
        assert.equal(currentLinks()[0]?.closest("[inert]"), null);
      }
    } finally {
      await act(async () => root.unmount());
      dom.window.close();
    }
  });
}
