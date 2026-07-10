import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, createElement, type Key } from "react";
import { createRoot } from "react-dom/client";

const nodeProtocol = "node:";
// Dynamic built-in name keeps the test bundle compatible with tsup's CJS output.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${nodeProtocol}test`);

import {
  DataTable,
  FullWidthTable,
  type ColumnDef,
} from "../src/components/ui/data-table";
import { PageHeader } from "../src/components/ui/page-header";
import { AppLayout } from "../src/components/layouts/app-layout";
import { SidebarMenuItemRow, modeConfig } from "../src/internal/app-layout-sidebar";
import { Button } from "../src/components/ui/button";
import { TabBar } from "../src/components/ui/tab-bar";
import { SelectOption } from "../src/components/ui/forms/select-option";
import { Datepicker } from "../src/components/ui/forms/datepicker";
import { IconSelector } from "../src/components/ui/forms/icon-selector";

function installDom({ mobile = false }: { mobile?: boolean } = {}) {
  const dom = new JSDOM("<!doctype html><html><body><div id=\"root\"></div></body></html>", {
    url: "http://localhost/",
  });

  Object.defineProperty(dom.window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: mobile && query === "(max-width: 767px)",
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

test("DataTable 单行选择返回新的 key 集合且不修改输入集合", async () => {
  type Row = { id: string; name: string };
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  const columns: ColumnDef<Row>[] = [
    {
      key: "name",
      header: "名称",
      render: (row) => createElement("span", null, row.name),
    },
  ];
  const selectedRowKeys = new Set<Key>(["other-page"]);
  let emittedKeys: Set<Key> | undefined;

  await act(async () => {
    root.render(createElement(DataTable as React.ElementType, {
      columns,
      rows: [{ id: "row-a", name: "A" }],
      showCheckbox: true,
      getRowKey: (row: Row) => row.id,
      selectedRowKeys,
      onSelectedRowKeysChange: (keys: Set<Key>) => {
        emittedKeys = keys;
      },
    }));
  });

  const rowCheckbox = document.querySelector<HTMLButtonElement>(
    '[aria-label="选择第 1 行"]',
  );
  assert.ok(rowCheckbox);
  await act(async () => rowCheckbox.click());

  assert.deepEqual([...selectedRowKeys], ["other-page"]);
  assert.deepEqual(emittedKeys && [...emittedKeys], ["other-page", "row-a"]);

  await act(async () => root.unmount());
  dom.window.close();
});

test("FullWidthTable 单行选择使用与 DataTable 相同的 key 回调", async () => {
  type Row = { id: string; name: string };
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  const columns: ColumnDef<Row>[] = [
    {
      key: "name",
      header: "名称",
      render: (row) => createElement("span", null, row.name),
    },
  ];
  let emittedKeys: Set<Key> | undefined;

  await act(async () => {
    root.render(createElement(FullWidthTable as React.ElementType, {
      columns,
      rows: [{ id: "row-a", name: "A" }],
      getRowKey: (row: Row) => row.id,
      selectedRowKeys: new Set<Key>(),
      onSelectedRowKeysChange: (keys: Set<Key>) => {
        emittedKeys = keys;
      },
      showPagination: false,
    }));
  });

  const rowCheckbox = document.querySelector<HTMLButtonElement>(
    '[aria-label="选择第 1 行"]',
  );
  assert.ok(rowCheckbox);
  await act(async () => rowCheckbox.click());

  assert.deepEqual(emittedKeys && [...emittedKeys], ["row-a"]);

  await act(async () => root.unmount());
  dom.window.close();
});

test("DataTable 全选只合并当前页 key 并保留其他页选择", async () => {
  type Row = { id: string; name: string };
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  const columns: ColumnDef<Row>[] = [
    {
      key: "name",
      header: "名称",
      render: (row) => createElement("span", null, row.name),
    },
  ];
  const selectedRowKeys = new Set<Key>(["other-page"]);
  let emittedKeys: Set<Key> | undefined;

  await act(async () => {
    root.render(createElement(DataTable as React.ElementType, {
      columns,
      rows: [
        { id: "row-a", name: "A" },
        { id: "row-b", name: "B" },
      ],
      showCheckbox: true,
      getRowKey: (row: Row) => row.id,
      selectedRowKeys,
      onSelectedRowKeysChange: (keys: Set<Key>) => {
        emittedKeys = keys;
      },
    }));
  });

  const selectAll = document.querySelector<HTMLButtonElement>(
    '[aria-label="选择全部行"]',
  );
  assert.ok(selectAll);
  await act(async () => selectAll.click());

  assert.deepEqual([...selectedRowKeys], ["other-page"]);
  assert.deepEqual(emittedKeys && [...emittedKeys], ["other-page", "row-a", "row-b"]);

  await act(async () => root.unmount());
  dom.window.close();
});

test("DataTable 取消全选只移除当前页 key", async () => {
  type Row = { id: string; name: string };
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  const columns: ColumnDef<Row>[] = [
    {
      key: "name",
      header: "名称",
      render: (row) => createElement("span", null, row.name),
    },
  ];
  const selectedRowKeys = new Set<Key>(["other-page", "row-a", "row-b"]);
  let emittedKeys: Set<Key> | undefined;

  await act(async () => {
    root.render(createElement(DataTable as React.ElementType, {
      columns,
      rows: [
        { id: "row-a", name: "A" },
        { id: "row-b", name: "B" },
      ],
      showCheckbox: true,
      getRowKey: (row: Row) => row.id,
      selectedRowKeys,
      onSelectedRowKeysChange: (keys: Set<Key>) => {
        emittedKeys = keys;
      },
    }));
  });

  const selectAll = document.querySelector<HTMLButtonElement>(
    '[aria-label="选择全部行"]',
  );
  assert.ok(selectAll);
  assert.equal(selectAll.getAttribute("aria-checked"), "true");
  await act(async () => selectAll.click());

  assert.deepEqual(emittedKeys && [...emittedKeys], ["other-page"]);

  await act(async () => root.unmount());
  dom.window.close();
});

test("FullWidthTable 全选使用与 DataTable 相同的当前页 key 语义", async () => {
  type Row = { id: string; name: string };
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  const columns: ColumnDef<Row>[] = [
    {
      key: "name",
      header: "名称",
      render: (row) => createElement("span", null, row.name),
    },
  ];
  let emittedKeys: Set<Key> | undefined;

  await act(async () => {
    root.render(createElement(FullWidthTable as React.ElementType, {
      columns,
      rows: [
        { id: "row-a", name: "A" },
        { id: "row-b", name: "B" },
      ],
      getRowKey: (row: Row) => row.id,
      selectedRowKeys: new Set<Key>(["other-page"]),
      onSelectedRowKeysChange: (keys: Set<Key>) => {
        emittedKeys = keys;
      },
      showPagination: false,
    }));
  });

  const selectAll = document.querySelector<HTMLButtonElement>(
    '[aria-label="选择全部行"]',
  );
  assert.ok(selectAll);
  await act(async () => selectAll.click());

  assert.deepEqual(emittedKeys && [...emittedKeys], ["other-page", "row-a", "row-b"]);

  await act(async () => root.unmount());
  dom.window.close();
});

test("PageHeader 内置日期面板支持 Escape 关闭并把焦点还给触发按钮", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(createElement(PageHeader, {
      variant: "title",
      title: "项目详情",
      showBackButton: false,
      showFilters: false,
      showKebab: false,
      showFavorite: false,
    }));
  });

  const trigger = document.querySelector<HTMLButtonElement>(
    'button[aria-haspopup="dialog"]',
  );
  assert.ok(trigger);
  trigger.focus();
  await act(async () => trigger.click());

  assert.equal(trigger.getAttribute("aria-expanded"), "true");
  assert.ok(document.querySelector('[role="dialog"][aria-label="日历"]'));

  await act(async () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  });

  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, trigger);

  await act(async () => root.unmount());
  dom.window.close();
});

test("IconSelector 打开非模态 dialog 后移入焦点，Escape 关闭并恢复触发焦点", async () => {
  const dom = installDom();
  // React's legacy input-event fallback expects these IE hooks when jsdom is
  // installed after react-dom has loaded.
  Object.assign(dom.window.HTMLInputElement.prototype, {
    attachEvent: () => undefined,
    detachEvent: () => undefined,
  });
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(createElement(IconSelector, {
      icons: [createElement("span", { key: "star" }, "★")],
      labels: ["星标"],
      label: "项目图标",
    }));
  });

  const trigger = document.querySelector<HTMLButtonElement>(
    'button[aria-haspopup="dialog"]',
  );
  assert.ok(trigger);
  trigger.focus();
  await act(async () => trigger.click());

  const dialogId = trigger.getAttribute("aria-controls");
  assert.ok(dialogId);
  const dialog = document.getElementById(dialogId);
  assert.ok(dialog);
  assert.equal(dialog.getAttribute("role"), "dialog");
  assert.equal(dialog.getAttribute("aria-modal"), "false");
  assert.equal(trigger.getAttribute("aria-expanded"), "true");
  assert.equal(document.activeElement, dialog.querySelector("input"));

  await act(async () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  });

  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(document.getElementById(dialogId), null);
  assert.equal(document.activeElement, trigger);

  await act(async () => root.unmount());
  dom.window.close();
});

test("AppLayout 移动导航进入时聚焦并陷阱 Tab，Escape 后恢复触发焦点", async () => {
  const dom = installDom({ mobile: true });
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(createElement(
      AppLayout as React.ElementType,
      {
        profilePosition: "sidebar",
        pageTitle: "项目总览",
        menuItems: [{ label: "总览", href: "/overview" }],
        profile: { name: "测试用户", role: "管理员", avatar: "data:image/svg+xml,<svg/>" },
      },
      createElement("main", null, "内容"),
    ));
  });

  const trigger = document.querySelector<HTMLButtonElement>("[data-forge-menu-trigger]");
  const sidebar = document.querySelector<HTMLElement>("[data-forge-app-sidebar]");
  assert.ok(trigger);
  assert.ok(sidebar);

  trigger.focus();
  await act(async () => trigger.click());

  assert.equal(trigger.getAttribute("aria-expanded"), "true");
  assert.equal(sidebar.getAttribute("aria-hidden"), null);
  assert.equal(document.body.style.overflow, "hidden");
  assert.equal(sidebar.contains(document.activeElement), true);
  const closeButton = sidebar.querySelector<HTMLButtonElement>('[aria-label="关闭主导航"]');
  assert.ok(closeButton);
  assert.equal(closeButton.getAttribute("aria-haspopup"), null);
  assert.equal(closeButton.getAttribute("aria-expanded"), null);

  const focusable = [...sidebar.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
  assert.ok(focusable.length > 1);
  focusable.at(-1)?.focus();
  await act(async () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
  });
  assert.equal(document.activeElement, focusable[0]);

  await act(async () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  });

  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, trigger);
  assert.equal(document.body.style.overflow, "");

  await act(async () => root.unmount());
  dom.window.close();
});

test("AppLayout 移动导航内的 Escape 先关闭 popover 再关闭抽屉", async () => {
  const dom = installDom({ mobile: true });
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(createElement(
      AppLayout as React.ElementType,
      {
        profilePosition: "sidebar",
        messages: 3,
        pageTitle: "项目总览",
      },
      createElement("main", null, "内容"),
    ));
  });

  const drawerTrigger = document.querySelector<HTMLButtonElement>("[data-forge-menu-trigger]");
  assert.ok(drawerTrigger);
  drawerTrigger.focus();
  await act(async () => drawerTrigger.click());

  const messageTrigger = document.querySelector<HTMLButtonElement>(
    '[data-forge-app-sidebar] [data-popover-trigger="messages"]',
  );
  assert.ok(messageTrigger);
  await act(async () => messageTrigger.click());
  assert.ok(document.querySelector('[data-popover="messages"]'));

  await act(async () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  });

  assert.equal(document.querySelector('[data-popover="messages"]'), null);
  assert.equal(drawerTrigger.getAttribute("aria-expanded"), "true");
  assert.equal(document.body.style.overflow, "hidden");
  assert.equal(document.activeElement, messageTrigger);

  await act(async () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  });

  assert.equal(drawerTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, drawerTrigger);
  assert.equal(document.body.style.overflow, "");

  await act(async () => root.unmount());
  dom.window.close();
});

test("AppLayout 桌面折叠态提供可聚焦的展开导航按钮", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(createElement(
      AppLayout as React.ElementType,
      { profilePosition: "sidebar" },
      createElement("main", null, "内容"),
    ));
  });

  const collapse = document.querySelector<HTMLButtonElement>('[aria-label="收起主导航"]');
  assert.ok(collapse);
  await act(async () => collapse.click());

  const expand = document.querySelector<HTMLButtonElement>('[aria-label="展开主导航"]');
  assert.ok(expand);
  expand.focus();
  assert.equal(document.activeElement, expand);
  await act(async () => expand.click());
  assert.ok(document.querySelector('[aria-label="收起主导航"]'));

  await act(async () => root.unmount());
  dom.window.close();
});

test("SidebarMenuItemRow 在 pathname 激活子项时自动展开", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  const item = {
    label: "项目",
    children: [{ label: "项目详情", href: "/projects/detail" }],
  };
  const props = {
    item,
    config: modeConfig.light,
    accentActive: "bg-fg-violet",
    accentBar: "bg-fg-violet",
  };

  await act(async () => {
    root.render(createElement(SidebarMenuItemRow, { ...props, pathname: "/overview" }));
  });
  assert.equal(document.querySelector('a[href="/projects/detail"]'), null);

  await act(async () => {
    root.render(createElement(SidebarMenuItemRow, { ...props, pathname: "/projects/detail" }));
  });
  assert.ok(document.querySelector('a[href="/projects/detail"]'));

  const activeBranch = document.querySelector<HTMLButtonElement>('button[aria-expanded="true"]');
  assert.ok(activeBranch);
  await act(async () => activeBranch.click());
  assert.equal(activeBranch.getAttribute("aria-expanded"), "false");
  assert.equal(document.querySelector('a[href="/projects/detail"]'), null);

  await act(async () => root.unmount());
  dom.window.close();
});

test("AppLayout hideHeader 在移动端也不会注入 page header", async () => {
  const dom = installDom({ mobile: true });
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(createElement(
      AppLayout as React.ElementType,
      {
        profilePosition: "sidebar",
        hideHeader: true,
        pageTitle: "沉浸式页面",
      },
      createElement("main", null, "沉浸式内容"),
    ));
  });

  assert.equal(document.querySelector("[data-forge-menu-trigger]"), null);
  assert.equal(document.body.textContent?.includes("沉浸式页面"), false);
  assert.equal(document.body.textContent?.includes("沉浸式内容"), true);

  await act(async () => root.unmount());
  dom.window.close();
});

test("AppLayout 顶栏 popover 暴露展开状态并在 Escape 后恢复触发焦点", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(createElement(
      AppLayout as React.ElementType,
      {
        messages: 3,
        pageTitle: "项目总览",
      },
      createElement("main", null, "内容"),
    ));
  });

  const trigger = document.querySelector<HTMLButtonElement>(
    '[data-popover-trigger="messages"]',
  );
  assert.ok(trigger);
  trigger.focus();
  await act(async () => trigger.click());

  assert.equal(trigger.getAttribute("aria-expanded"), "true");
  assert.ok(document.querySelector('[data-popover="messages"] [role="menu"]'));
  const firstMenuItem = document.querySelector<HTMLElement>(
    '[data-popover="messages"] [role="menuitem"]',
  );
  assert.ok(firstMenuItem);
  const focusedAfterOpen = document.activeElement;

  await act(async () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  });

  assert.equal(document.querySelector('[data-popover="messages"]'), null);
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, trigger);

  await act(async () => root.unmount());
  dom.window.close();
  assert.equal(focusedAfterOpen, firstMenuItem);
});

test("AppLayout 消息菜单支持方向键、Home 与 End 移动焦点", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(createElement(
      AppLayout as React.ElementType,
      { messages: 3, pageTitle: "项目总览" },
      createElement("main", null, "内容"),
    ));
  });

  const trigger = document.querySelector<HTMLButtonElement>(
    '[data-popover-trigger="messages"]',
  );
  assert.ok(trigger);
  await act(async () => trigger.click());

  const items = [...document.querySelectorAll<HTMLElement>(
    '[data-popover="messages"] [role="menuitem"]',
  )];
  assert.equal(items.length, 4);
  const focusedItemIndexes = [items.indexOf(document.activeElement as HTMLElement)];
  for (const key of ["ArrowDown", "End", "ArrowDown", "ArrowUp", "Home"]) {
    await act(async () => {
      document.activeElement?.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true }),
      );
    });
    focusedItemIndexes.push(items.indexOf(document.activeElement as HTMLElement));
  }

  await act(async () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  });
  await act(async () => root.unmount());
  dom.window.close();

  assert.deepEqual(focusedItemIndexes, [0, 1, 3, 0, 3, 0]);
});

test("AppLayout 菜单焦点移出后关闭且不抢回焦点", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(createElement(
      AppLayout as React.ElementType,
      { messages: 3, pageTitle: "项目总览" },
      createElement("button", { type: "button", "data-after-menu": true }, "后续操作"),
    ));
  });

  const trigger = document.querySelector<HTMLButtonElement>(
    '[data-popover-trigger="messages"]',
  );
  const nextControl = document.querySelector<HTMLButtonElement>("[data-after-menu]");
  assert.ok(trigger);
  assert.ok(nextControl);
  await act(async () => trigger.click());
  assert.ok(document.querySelector('[data-popover="messages"]'));

  await act(async () => {
    nextControl.focus();
  });

  const popoverClosed = document.querySelector('[data-popover="messages"]') === null;
  const expanded = trigger.getAttribute("aria-expanded");
  const focusStayedOutside = document.activeElement === nextControl;

  await act(async () => root.unmount());
  dom.window.close();

  assert.equal(popoverClosed, true);
  assert.equal(expanded, "false");
  assert.equal(focusStayedOutside, true);
});

test("AppLayout 打开 dialog popover 后把焦点移入面板", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(createElement(
      AppLayout as React.ElementType,
      {
        notifications: 2,
        pageTitle: "项目总览",
      },
      createElement("main", null, "内容"),
    ));
  });

  const trigger = document.querySelector<HTMLButtonElement>(
    '[data-popover-trigger="notifications"]',
  );
  assert.ok(trigger);
  trigger.focus();
  await act(async () => trigger.click());

  const dialog = document.querySelector<HTMLElement>(
    '[data-popover="notifications"] [role="dialog"]',
  );
  assert.ok(dialog);
  const focusEnteredDialog = dialog.contains(document.activeElement);

  await act(async () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  });
  assert.equal(document.activeElement, trigger);

  await act(async () => root.unmount());
  dom.window.close();
  assert.equal(focusEnteredDialog, true);
});

test("Button 默认点击不会提交父级表单", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  let submitCount = 0;

  await act(async () => {
    root.render(createElement(
      "form",
      {
        onSubmit: (event: React.FormEvent) => {
          event.preventDefault();
          submitCount += 1;
        },
      },
      createElement(Button as React.ElementType, null, "保存"),
    ));
  });

  const button = document.querySelector<HTMLButtonElement>("button");
  assert.ok(button);
  await act(async () => button.click());
  assert.equal(submitCount, 0);

  await act(async () => root.unmount());
  dom.window.close();
});

test("TabBar 支持方向键、Home、End 切换并移动焦点", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  const changes: number[] = [];

  await act(async () => {
    root.render(createElement(TabBar, {
      tabs: [
        { label: "概览", active: true },
        { label: "成员" },
        { label: "设置" },
      ],
      onChange: (index: number) => changes.push(index),
    }));
  });

  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  assert.equal(tabs.length, 3);
  tabs[0].focus();
  await act(async () => tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
  assert.equal(document.activeElement, tabs[1]);
  await act(async () => tabs[1].dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })));
  assert.equal(document.activeElement, tabs[2]);
  await act(async () => tabs[2].dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true })));
  assert.equal(document.activeElement, tabs[0]);
  assert.deepEqual(changes, [1, 2, 0]);

  await act(async () => root.unmount());
  dom.window.close();
});

test("SelectOption 从触发器按方向键打开后将焦点移入首末 option", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  let downOpened = false;
  let downFocusedFirst = false;
  let upOpened = false;
  let upFocusedLast = false;

  try {
    await act(async () => {
      root.render(createElement(SelectOption, {
        options: [
          { value: "draft", label: "草稿" },
          { value: "ready", label: "就绪" },
          { value: "published", label: "已发布" },
        ],
      }));
    });

    const trigger = document.querySelector<HTMLElement>('[role="combobox"]');
    assert.ok(trigger);
    trigger.focus();
    await act(async () => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })));
    let options = [...document.querySelectorAll<HTMLButtonElement>('[role="option"]')];
    downOpened = trigger.getAttribute("aria-expanded") === "true";
    downFocusedFirst = document.activeElement === options[0];

    await act(async () => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));

    await act(async () => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })));
    options = [...document.querySelectorAll<HTMLButtonElement>('[role="option"]')];
    upOpened = trigger.getAttribute("aria-expanded") === "true";
    upFocusedLast = document.activeElement === options[2];
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
  }

  assert.equal(downOpened, true);
  assert.equal(downFocusedFirst, true);
  assert.equal(upOpened, true);
  assert.equal(upFocusedLast, true);
});

test("SelectOption 打开后支持方向键循环与 Home End 定位", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  const focusResults: boolean[] = [];

  try {
    await act(async () => {
      root.render(createElement(SelectOption, {
        options: [
          { value: "draft", label: "草稿" },
          { value: "ready", label: "就绪" },
          { value: "published", label: "已发布" },
        ],
      }));
    });

    const trigger = document.querySelector<HTMLElement>('[role="combobox"]');
    assert.ok(trigger);
    trigger.focus();
    await act(async () => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })));
    const options = [...document.querySelectorAll<HTMLButtonElement>('[role="option"]')];

    focusResults.push(document.activeElement === options[0]);
    await act(async () => options[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })));
    focusResults.push(document.activeElement === options[2]);
    await act(async () => options[2].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })));
    focusResults.push(document.activeElement === options[0]);
    await act(async () => options[0].dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })));
    focusResults.push(document.activeElement === options[2]);
    await act(async () => options[2].dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true })));
    focusResults.push(document.activeElement === options[0]);
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
  }

  assert.deepEqual(focusResults, [true, true, true, true, true]);
});

test("SelectOption 键盘打开、选择与 Escape 关闭后维持触发焦点", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  let selected: string | undefined;

  await act(async () => {
    root.render(createElement(SelectOption, {
      options: [
        { value: "draft", label: "草稿" },
        { value: "ready", label: "就绪" },
      ],
      onChange: (value: string) => {
        selected = value;
      },
    }));
  });

  const trigger = document.querySelector<HTMLElement>('[role="combobox"]');
  assert.ok(trigger);
  trigger.focus();
  await act(async () => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
  assert.equal(trigger.getAttribute("aria-expanded"), "true");

  const ready = [...document.querySelectorAll<HTMLButtonElement>('[role="option"]')]
    .find((option) => option.textContent?.includes("就绪"));
  assert.ok(ready);
  ready.focus();
  assert.equal(document.activeElement, ready);
  await act(async () => ready.click());
  assert.equal(selected, "ready");
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, trigger);

  await act(async () => trigger.click());
  const draft = [...document.querySelectorAll<HTMLButtonElement>('[role="option"]')]
    .find((option) => option.textContent?.includes("草稿"));
  assert.ok(draft);
  draft.focus();
  await act(async () => draft.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, trigger);

  await act(async () => trigger.click());
  await act(async () => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, trigger);

  await act(async () => trigger.click());
  await act(async () => document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })));
  assert.equal(trigger.getAttribute("aria-expanded"), "false");

  await act(async () => root.unmount());
  dom.window.close();
});

test("SelectOption 多选标签按钮的按键不会冒泡劫持外层 combobox", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  let selected = ["draft"];

  await act(async () => {
    root.render(createElement(SelectOption, {
      type: "multiple",
      value: selected,
      options: [
        { value: "draft", label: "草稿" },
        { value: "ready", label: "就绪" },
      ],
      onChange: (value: string[]) => {
        selected = value;
      },
    }));
  });

  const trigger = document.querySelector<HTMLElement>('[role="combobox"]');
  const removeButton = trigger?.querySelector<HTMLButtonElement>("button");
  assert.ok(trigger);
  assert.ok(removeButton);
  assert.equal(removeButton.getAttribute("aria-label"), "移除 草稿");
  removeButton.focus();

  const enter = new KeyboardEvent("keydown", {
    key: "Enter",
    bubbles: true,
    cancelable: true,
  });
  await act(async () => removeButton.dispatchEvent(enter));
  assert.equal(enter.defaultPrevented, false);
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, removeButton);

  const arrowDown = new KeyboardEvent("keydown", {
    key: "ArrowDown",
    bubbles: true,
    cancelable: true,
  });
  await act(async () => removeButton.dispatchEvent(arrowDown));
  assert.equal(arrowDown.defaultPrevented, false);
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, removeButton);

  await act(async () => removeButton.click());
  assert.deepEqual(selected, []);

  await act(async () => root.unmount());
  dom.window.close();
});

test("Datepicker 选择和 Escape 关闭后恢复触发焦点", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  let selected: Date | undefined;

  await act(async () => {
    root.render(createElement(Datepicker, {
      value: new Date(2026, 6, 10),
      onChange: (date: Date) => {
        selected = date;
      },
    }));
  });

  const trigger = document.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]');
  assert.ok(trigger);
  trigger.focus();
  await act(async () => trigger.click());
  const day = document.querySelector<HTMLButtonElement>('[aria-label="2026年7月15日"]');
  assert.ok(day);
  await act(async () => day.click());
  assert.equal(selected?.getDate(), 15);
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, trigger);

  await act(async () => trigger.click());
  await act(async () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  });
  assert.equal(trigger.getAttribute("aria-expanded"), "false");
  assert.equal(document.activeElement, trigger);

  await act(async () => trigger.click());
  await act(async () => document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })));
  assert.equal(trigger.getAttribute("aria-expanded"), "false");

  await act(async () => root.unmount());
  dom.window.close();
});
