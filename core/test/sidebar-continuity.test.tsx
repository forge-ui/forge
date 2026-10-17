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
        badge: 3,
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

const teamAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%237c3aed'/%3E%3C/svg%3E";

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

async function mountLayout(motion: "auto" | "none") {
  const dom = installDom();
  const root = createRoot(document.getElementById("root")!);
  await act(async () => root.render(
    <PathnameContext.Provider value="/preview/projects/active/detail">
      <AppLayout
        menuSections={sections}
        motion={motion}
        teamName="设计团队"
        teamAvatar={teamAvatar}
        teamMemberCount={5}
        hideSidebarWidgets
        hideHeader
      >
        <main>页面内容</main>
      </AppLayout>
    </PathnameContext.Provider>,
  ));
  return async () => {
    await act(async () => root.unmount());
    dom.window.close();
  };
}

function sidebarToggle(label: "收起主导航" | "展开主导航") {
  const button = document.querySelector<HTMLButtonElement>(`[data-forge-app-sidebar] button[aria-label="${label}"]`);
  assert.ok(button, `应存在${label}按钮`);
  return button;
}

async function toggleSidebar(label: "收起主导航" | "展开主导航") {
  await act(async () => sidebarToggle(label).click());
}

function branchButton() {
  const button = [...document.querySelectorAll<HTMLElement>('[data-forge-sidebar-scroll] :is(button, [role="button"])[aria-expanded]')]
    .find((candidate) => candidate.textContent?.includes("项目管理"));
  assert.ok(button, "展开态应存在项目管理分支按钮");
  return button;
}

for (const motion of ["auto", "none"] as const) {
  test(`AppLayout ${motion}: 桌面收展沿用同一按钮并保留焦点及展开语义`, async () => {
    const cleanup = await mountLayout(motion);
    try {
      const button = sidebarToggle("收起主导航");
      assert.equal(button.getAttribute("aria-expanded"), "true");
      button.focus();
      assert.ok(document.activeElement === button);

      for (let cycle = 0; cycle < 3; cycle += 1) {
        await toggleSidebar("收起主导航");
        assert.ok(sidebarToggle("展开主导航") === button, "折叠不得替换按钮 DOM 节点");
        assert.equal(button.getAttribute("aria-expanded"), "false");
        assert.ok(document.activeElement === button, "折叠后焦点应保留在原按钮");

        await toggleSidebar("展开主导航");
        assert.ok(sidebarToggle("收起主导航") === button, "展开不得替换按钮 DOM 节点");
        assert.equal(button.getAttribute("aria-expanded"), "true");
        assert.ok(document.activeElement === button, "展开后焦点应保留在原按钮");
      }
    } finally {
      await cleanup();
    }
  });

  test(`AppLayout ${motion}: 团队区和分组标题持续挂载并随收展切换可访问状态`, async () => {
    const cleanup = await mountLayout(motion);
    try {
      const teamButton = document.querySelector<HTMLButtonElement>('[data-popover-trigger="team"]');
      assert.ok(teamButton);
      const teamName = [...teamButton.querySelectorAll("span")].find((span) => span.textContent === "设计团队");
      assert.ok(teamName);
      const titles = [...document.querySelectorAll<HTMLElement>(".forge-sidebar-section-title")];
      assert.deepEqual(titles.map((title) => title.textContent), ["工作区", "协作", "管理"]);
      for (const title of titles) {
        assert.equal(title.getAttribute("data-state"), "open");
        assert.ok(title.closest('[aria-hidden="true"], [inert]') === null);
      }

      await toggleSidebar("收起主导航");
      assert.ok(document.querySelector('[data-popover-trigger="team"]') === teamButton);
      assert.ok(teamName.isConnected, "团队名称不可卸载");
      assert.ok(teamButton.contains(teamName));
      assert.ok(teamButton.closest('[inert][aria-hidden="true"]'), "折叠团队区应不可访问且不可交互");
      const collapsedTitles = [...document.querySelectorAll(".forge-sidebar-section-title")];
      assert.equal(collapsedTitles.length, titles.length);
      for (const [index, title] of titles.entries()) {
        assert.ok(collapsedTitles[index] === title, "分组标题不得替换节点");
        assert.equal(title.getAttribute("data-state"), "closed");
        assert.ok(title.closest('[inert][aria-hidden="true"]'));
      }

      await toggleSidebar("展开主导航");
      assert.ok(document.querySelector('[data-popover-trigger="team"]') === teamButton);
      assert.ok(teamButton.contains(teamName));
      assert.ok(teamButton.closest('[aria-hidden="true"], [inert]') === null);
      const expandedTitles = [...document.querySelectorAll(".forge-sidebar-section-title")];
      for (const [index, title] of titles.entries()) {
        assert.ok(expandedTitles[index] === title);
        assert.equal(title.getAttribute("data-state"), "open");
        assert.ok(title.closest('[aria-hidden="true"], [inert]') === null);
      }
    } finally {
      await cleanup();
    }
  });

  test(`AppLayout ${motion}: 折叠后根菜单角标数值仍可访问`, async () => {
    const cleanup = await mountLayout(motion);
    try {
      await toggleSidebar("收起主导航");
      const link = document.querySelector<HTMLAnchorElement>('[data-forge-sidebar-scroll] a[href="/preview/tasks"]');
      assert.ok(link);
      const badge = [...link.querySelectorAll("span")].find((span) => span.childElementCount === 0 && span.textContent === "12");
      assert.ok(badge, "折叠后应保留数值角标");
      assert.ok(badge.closest('[aria-hidden="true"], [inert]') === null, "角标不可随标签隐藏");
      assert.match(`${link.getAttribute("aria-label") ?? ""} ${link.title}`, /12/, "图标菜单的名称或提示应包含角标数值");

      await toggleSidebar("展开主导航");
      const expandedLink = document.querySelector<HTMLAnchorElement>('[data-forge-sidebar-scroll] a[href="/preview/tasks"]');
      assert.ok(expandedLink?.textContent?.includes("12"));
    } finally {
      await cleanup();
    }
  });

  test(`AppLayout ${motion}: 子菜单节点持续挂载并保留手动展开状态`, async () => {
    const cleanup = await mountLayout(motion);
    try {
      const child = document.querySelector<HTMLAnchorElement>('[data-forge-sidebar-scroll] a[href="/preview/projects/active"][aria-current="page"]');
      assert.ok(child);
      assert.equal(branchButton().getAttribute("aria-expanded"), "true");
      assert.ok(child.closest('[aria-hidden="true"], [inert]') === null);

      await act(async () => branchButton().click());
      assert.equal(branchButton().getAttribute("aria-expanded"), "false");
      const submenu = child.closest('[inert][aria-hidden="true"]');
      assert.ok(submenu, "手动关闭后子菜单应持续挂载且不可访问");

      for (const expanded of [false, true]) {
        if (expanded) await act(async () => branchButton().click());
        assert.equal(branchButton().getAttribute("aria-expanded"), String(expanded));

        await toggleSidebar("收起主导航");
        assert.ok(document.querySelector('a[href="/preview/projects/active"][aria-current="page"]') === child, "折叠不可重建或卸载当前子菜单项");
        assert.ok(submenu.isConnected, "折叠不可卸载子菜单容器");
        assert.ok(child.closest('[inert][aria-hidden="true"]') === submenu);

        await toggleSidebar("展开主导航");
        assert.equal(branchButton().getAttribute("aria-expanded"), String(expanded), "侧栏往返应保留手动展开状态");
        assert.ok(document.querySelector('a[href="/preview/projects/active"][aria-current="page"]') === child);
        assert.ok(submenu.contains(child));
        assert.ok(child.closest('[inert][aria-hidden="true"]') === (expanded ? null : submenu));
      }
    } finally {
      await cleanup();
    }
  });

  test(`AppLayout ${motion}: 父分支的行、图标、标签与角标节点在收展往返中保持连续`, async () => {
    const cleanup = await mountLayout(motion);
    try {
      const row = branchButton();
      const icon = [...row.querySelectorAll("span")].find((span) => span.childElementCount === 0 && span.textContent === "▣");
      const label = [...row.querySelectorAll("span")].find((span) => span.textContent === "项目管理");
      const badge = [...row.querySelectorAll("span")].find((span) => span.childElementCount === 0 && span.textContent === "3");
      assert.ok(icon);
      assert.ok(label);
      assert.ok(badge);

      for (let cycle = 0; cycle < 3; cycle += 1) {
        await toggleSidebar("收起主导航");
        const railLink = document.querySelector<HTMLAnchorElement>('[data-forge-sidebar-scroll] a[title="项目管理"]');
        assert.ok(railLink === row, "父分支不可在 button 和 link 之间替换 DOM 节点");
        assert.equal(railLink.getAttribute("href"), "/preview/projects/active");
        assert.equal(railLink.getAttribute("role"), null);
        assert.equal(railLink.getAttribute("aria-expanded"), null);
        assert.equal(railLink.getAttribute("aria-current"), null);
        for (const node of [icon, label, badge]) {
          assert.ok(node.isConnected && row.contains(node), "父分支的视觉内容应保持原节点");
        }
        assert.equal(label.getAttribute("aria-hidden"), "true");
        assert.ok(badge.closest('[aria-hidden="true"], [inert]') === null);
        assert.match(`${railLink.getAttribute("aria-label") ?? ""} ${railLink.title}`, /3/);

        await toggleSidebar("展开主导航");
        assert.ok(branchButton() === row);
        assert.equal(row.getAttribute("role"), "button");
        assert.equal(row.getAttribute("aria-expanded"), "true");
        for (const node of [icon, label, badge]) {
          assert.ok(node.isConnected && row.contains(node));
        }
        assert.ok(label.closest('[aria-hidden="true"], [inert]') === null);
      }
    } finally {
      await cleanup();
    }
  });

  test(`AppLayout ${motion}: 父分支展开态支持空格与点击，收窄态恢复原生链接语义`, async () => {
    const cleanup = await mountLayout(motion);
    try {
      const row = branchButton();
      assert.equal(row.tagName, "A");
      assert.equal(row.getAttribute("role"), "button");
      row.focus();

      const space = new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true, cancelable: true });
      await act(async () => { row.dispatchEvent(space); });
      assert.equal(space.defaultPrevented, true, "空格操作分支时应阻止页面滚动");
      assert.equal(row.getAttribute("aria-expanded"), "false");
      assert.ok(document.activeElement === row);

      const repeatSpace = new KeyboardEvent("keydown", { key: " ", code: "Space", repeat: true, bubbles: true, cancelable: true });
      await act(async () => { row.dispatchEvent(repeatSpace); });
      assert.equal(repeatSpace.defaultPrevented, true);
      assert.equal(row.getAttribute("aria-expanded"), "false", "长按空格不得反复翻转子菜单状态");

      const click = new MouseEvent("click", { bubbles: true, cancelable: true });
      await act(async () => { row.dispatchEvent(click); });
      assert.equal(click.defaultPrevented, true, "展开态点击应操作子菜单而不执行 href 导航");
      assert.equal(row.getAttribute("aria-expanded"), "true");

      await toggleSidebar("收起主导航");
      assert.equal(row.getAttribute("role"), null);
      assert.equal(row.getAttribute("aria-expanded"), null);
      assert.equal(row.getAttribute("href"), "/preview/projects/active");
      const railSpace = new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true, cancelable: true });
      await act(async () => { row.dispatchEvent(railSpace); });
      assert.equal(railSpace.defaultPrevented, false, "图标链接应保留原生空格键行为");
      await toggleSidebar("展开主导航");
      assert.equal(row.getAttribute("aria-expanded"), "true", "图标链接的空格键不得改变子菜单状态");
    } finally {
      await cleanup();
    }
  });
}
