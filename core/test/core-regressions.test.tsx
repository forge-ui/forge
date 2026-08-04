import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { act, createElement, type Key } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";

const nodeProtocol = "node:";
// Dynamic built-in name keeps the test bundle compatible with tsup's CJS output.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${nodeProtocol}test`);

import { Button } from "../src/components/ui/button";
import { IconButton } from "../src/components/ui/icon-button";
import { Checkbox } from "../src/components/ui/checkbox";
import {
  CheckboxWithLabel,
  RadioWithLabel,
  Toggle,
} from "../src/components/ui/forms/selection-control";
import { Breadcrumbs } from "../src/components/ui/breadcrumbs";
import { ChatBubble } from "../src/components/ui/chat-bubble";
import { ProgressBar } from "../src/components/ui/progress-bar";
import { SidebarMenu } from "../src/components/ui/sidebar-menu";
import { CalendarPopup } from "../src/components/ui/calendar-popup";
import { rampColors } from "../src/components/ui/charts/chart-utils";
import { filterIconIndexes } from "../src/components/ui/forms/icon-selector";
import {
  DataTable,
  FullWidthTable,
  getPaginationSummary,
  type ColumnDef,
} from "../src/components/ui/data-table";
import { TextField } from "../src/components/ui/forms/text-field";
import { TextArea } from "../src/components/ui/forms/text-area";
import { SelectOption } from "../src/components/ui/forms/select-option";
import { Datepicker } from "../src/components/ui/forms/datepicker";
import { TabBar } from "../src/components/ui/tab-bar";
import { ButtonGroup } from "../src/components/ui/button-group";
import { PageHeader } from "../src/components/ui/page-header";
import { StatCard } from "../src/components/ui/stat-card";
import { BalanceCard } from "../src/components/ui/balance-card";
import { ListGroup } from "../src/components/ui/list-group";
import {
  LanguageSwitcher,
  MessageMenu,
  NotificationPanel,
  ProfileDropdown,
  TeamSwitcherDropdown,
  chinaFlagDataUrl,
  languageFlagDataUrls,
  languageMarkDataUrl,
} from "../src/components/layouts/sidebar-popovers";

function render(component: React.ElementType, props: Record<string, unknown> = {}, children?: React.ReactNode) {
  return renderToStaticMarkup(createElement(component, props, children));
}

function installDom() {
  const dom = new JSDOM("<!doctype html><html><body><div id=\"root\"></div></body></html>", {
    url: "http://localhost/",
  });

  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    Event: dom.window.Event,
    MouseEvent: dom.window.MouseEvent,
  });

  return dom;
}

test("Button 和 IconButton 默认不会提交父级表单", () => {
  assert.match(render(Button, {}, "保存"), /<button[^>]*type="button"/);
  assert.match(render(Button, { type: "submit" }, "提交"), /<button[^>]*type="submit"/);
  assert.match(
    render(IconButton, { "aria-label": "新增" }, "+"),
    /<button[^>]*type="button"/,
  );
});

test("Dashboard 卡片的 compact 密度收紧留白并保留默认密度", () => {
  const compactStat = render(StatCard, {
    title: "收入",
    value: "$12,000",
    size: "wide",
    density: "compact",
  });
  assert.match(compactStat, /\bp-4\b/);
  assert.match(compactStat, /\btext-2xl\b/);

  const defaultStat = render(StatCard, {
    title: "收入",
    value: "$12,000",
    size: "wide",
  });
  assert.match(defaultStat, /\bp-6\b/);
  assert.match(defaultStat, /\btext-3xl\b/);

  const compactBalance = render(BalanceCard, {
    balance: "$21,500",
    density: "compact",
  });
  assert.match(compactBalance, /\bp-4\b/);
  assert.match(compactBalance, /\bh-9\b/);

  const compactList = render(ListGroup, {
    title: "Transactions",
    density: "compact",
    items: createElement("span", null, "Item"),
  });
  assert.match(compactList, /\bpx-4\b/);
  assert.match(compactList, /\bpy-4\b/);
});

test("ChatBubble 只在提供下载动作时渲染名称准确的文件按钮", () => {
  const inertFile = render(ChatBubble, {
    type: "received",
    variant: "file",
    fileName: "brief.pdf",
  });
  assert.doesNotMatch(inertFile, /<button/);

  const downloadableFile = render(ChatBubble, {
    type: "received",
    variant: "file",
    fileName: "brief.pdf",
    onFileDownload: () => undefined,
  });
  assert.match(downloadableFile, /<button[^>]*aria-label="下载 brief\.pdf"/);
});

test("选择控件暴露状态语义，带标签控件不生成嵌套按钮", () => {
  assert.match(render(Checkbox, { checked: true }), /role="checkbox"/);
  assert.match(render(Checkbox, { checked: true }), /aria-checked="true"/);
  assert.match(render(Toggle, { checked: true }), /role="switch"/);

  for (const component of [CheckboxWithLabel, RadioWithLabel]) {
    const html = render(component, { checked: true, label: "选项" });
    assert.equal((html.match(/<button/g) ?? []).length, 1);
  }
});

test("Breadcrumbs 和 ProgressBar 提供导航与进度语义", () => {
  const breadcrumbs = render(Breadcrumbs, {
    items: [{ label: "首页", href: "/" }, { label: "订单" }],
  });
  assert.match(breadcrumbs, /^<nav/);
  assert.match(breadcrumbs, /aria-current="page"/);

  const progress = render(ProgressBar, { value: 120, label: "进度" });
  assert.match(progress, /role="progressbar"/);
  assert.match(progress, /aria-valuenow="100"/);
});

test("SidebarMenu 会把叶子节点的 href 渲染成真实链接", () => {
  const html = render(SidebarMenu, {
    mainMenuItems: [{ label: "报表", href: "/reports" }],
  });
  assert.match(html, /<a[^>]*href="\/reports"/);
});

test("AppLayout 侧栏叶子导航由 Next Link 承担 SPA 跳转", () => {
  const source = readFileSync(resolve(process.cwd(), "src/internal/app-layout-sidebar.tsx"), "utf8");
  assert.match(source, /import NextLink from ["']next\/link["']/);
  assert.equal((source.match(/<NextLink\b/g) ?? []).length, 2);
  assert.doesNotMatch(source, /<a\b[^>]*\bhref=/);
});

test("AppLayout home 与 detail header 都透传 secondaryAction", () => {
  const source = readFileSync(resolve(process.cwd(), "src/components/layouts/app-layout.tsx"), "utf8");
  assert.equal((source.match(/secondaryAction=\{secondaryAction \?/g) ?? []).length, 2);
});

test("图表色阶对超过五个系列仍返回完整颜色列表", () => {
  const colors = rampColors("purple", 8);
  assert.equal(colors.length, 8);
  assert.ok(colors.every(Boolean));
});

test("图标搜索使用显式标签过滤，并保留原始索引", () => {
  assert.deepEqual(filterIconIndexes(["首页", "设置", "用户中心"], "用户"), [2]);
  assert.deepEqual(filterIconIndexes(undefined, "用户", 3), [0, 1, 2]);
});

test("CalendarPopup 支持稳定初始月份和选中日期语义", () => {
  const initialDate = new Date(2026, 6, 10);
  const selected = new Date(2026, 6, 12);
  const html = render(CalendarPopup, { initialDate, value: selected });
  assert.match(html, /2026/);
  assert.match(html, /7月/);
  assert.match(html, /aria-label="2026年7月12日" aria-pressed="true"/);
});

test("CalendarPopup 默认 SSR 标记不随服务端时区变化", () => {
  const NativeDate = globalThis.Date;
  const fixedInstant = NativeDate.parse("2026-07-31T16:30:00.000Z");
  const FixedDate = new Proxy(NativeDate, {
    construct(target, args) {
      return Reflect.construct(target, args.length === 0 ? [fixedInstant] : args, target);
    },
  }) as DateConstructor;
  const originalTimezone = process.env.TZ;

  try {
    globalThis.Date = FixedDate;
    process.env.TZ = "UTC";
    const utcHtml = render(CalendarPopup);
    process.env.TZ = "Asia/Shanghai";
    const shanghaiHtml = render(CalendarPopup);

    assert.equal(shanghaiHtml, utcHtml);
    assert.match(utcHtml, /1月/);
    assert.match(utcHtml, /2024/);
    assert.doesNotMatch(utcHtml, /2026/);
  } finally {
    globalThis.Date = NativeDate;
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
  }
});

test("CalendarPopup 挂载后使用浏览器本地日期", async () => {
  const NativeDate = globalThis.Date;
  const fixedInstant = NativeDate.parse("2026-07-31T16:30:00.000Z");
  const FixedDate = new Proxy(NativeDate, {
    construct(target, args) {
      return Reflect.construct(target, args.length === 0 ? [fixedInstant] : args, target);
    },
  }) as DateConstructor;
  const originalTimezone = process.env.TZ;
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  try {
    globalThis.Date = FixedDate;
    process.env.TZ = "Asia/Shanghai";

    await act(async () => {
      root.render(createElement(CalendarPopup));
    });

    assert.match(container.textContent ?? "", /8月/);
    assert.match(container.textContent ?? "", /2026/);
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    globalThis.Date = NativeDate;
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
  }
});

test("分页摘要不再用末页条数反推总记录数", () => {
  assert.equal(
    getPaginationSummary({ currentPage: 3, pageSize: 10, rowCount: 4, totalRows: 24 }),
    "显示 21-24，共 24 条",
  );
  assert.equal(
    getPaginationSummary({ currentPage: 3, pageSize: 10, rowCount: 4 }),
    "显示 21-24",
  );
});

test("DataTable 只有当前排序列声明 aria-sort，且无方向时为 none", () => {
  const html = render(DataTable as React.ElementType, {
    columns: [
      {
        key: "name",
        header: "名称",
        sortable: true,
        render: () => createElement("span", null, "A"),
      },
      {
        key: "status",
        header: "状态",
        sortable: true,
        render: () => createElement("span", null, "就绪"),
      },
    ],
    rows: [{ name: "A", status: "ready" }],
    sortColumnKey: "name",
  });

  assert.match(html, /<th[^>]*aria-sort="none"/);
  assert.doesNotMatch(html, /aria-sort="descending"/);
  assert.equal(html.match(/aria-sort=/g)?.length, 1);
});

test("DataTable 按稳定行 key 保持排序后的选中记录", () => {
  type Row = { id: string; name: string };
  const columns: ColumnDef<Row>[] = [
    {
      key: "name",
      header: "名称",
      render: (row) => createElement("span", null, row.name),
    },
  ];
  const html = render(DataTable as React.ElementType, {
    columns,
    rows: [
      { id: "row-b", name: "B" },
      { id: "row-a", name: "A" },
    ],
    showCheckbox: true,
    getRowKey: (row: Row) => row.id,
    selectedRowKeys: new Set(["row-b"]),
  });
  const rowCheckboxes = html.match(/<button[^>]*aria-label="选择第 [12] 行"[^>]*>/g) ?? [];

  assert.equal(rowCheckboxes.length, 2);
  assert.match(rowCheckboxes[0], /aria-checked="true"/);
  assert.match(rowCheckboxes[1], /aria-checked="false"/);
});

test("DataTable 稳定 key 模式独占单行与全选回调", async () => {
  type Row = { id: string; name: string };
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  const keyEmissions: Key[][] = [];
  const legacyRowEmissions: Array<[number, boolean]> = [];
  const legacyAllEmissions: boolean[] = [];

  await act(async () => {
    root.render(createElement(DataTable as React.ElementType, {
      columns: [
        {
          key: "name",
          header: "名称",
          render: (row: Row) => createElement("span", null, row.name),
        },
      ],
      rows: [
        { id: "row-a", name: "A" },
        { id: "row-b", name: "B" },
      ],
      showCheckbox: true,
      getRowKey: (row: Row) => row.id,
      selectedRowKeys: new Set<Key>(),
      onSelectedRowKeysChange: (keys: Set<Key>) => keyEmissions.push([...keys]),
      selectedRows: new Set<number>(),
      onSelectRow: (index: number, checked: boolean) => legacyRowEmissions.push([index, checked]),
      onSelectAll: (checked: boolean) => legacyAllEmissions.push(checked),
    }));
  });

  const rowCheckbox = document.querySelector<HTMLButtonElement>('[aria-label="选择第 1 行"]');
  const selectAll = document.querySelector<HTMLButtonElement>('[aria-label="选择全部行"]');
  assert.ok(rowCheckbox);
  assert.ok(selectAll);

  await act(async () => rowCheckbox.click());
  await act(async () => selectAll.click());

  assert.deepEqual(keyEmissions, [["row-a"], ["row-a", "row-b"]]);
  assert.deepEqual(legacyRowEmissions, []);
  assert.deepEqual(legacyAllEmissions, []);

  await act(async () => root.unmount());
  dom.window.close();
});

test("FullWidthTable 与 DataTable 使用相同的稳定 key 选择语义", () => {
  type Row = { id: string; name: string };
  const columns: ColumnDef<Row>[] = [
    {
      key: "name",
      header: "名称",
      render: (row) => createElement("span", null, row.name),
    },
  ];
  const html = render(FullWidthTable as React.ElementType, {
    columns,
    rows: [
      { id: "row-b", name: "B" },
      { id: "row-a", name: "A" },
    ],
    getRowKey: (row: Row) => row.id,
    selectedRowKeys: new Set(["row-b"]),
    showPagination: false,
  });
  const rowCheckboxes = html.match(/<button[^>]*aria-label="选择第 [12] 行"[^>]*>/g) ?? [];

  assert.equal(rowCheckboxes.length, 2);
  assert.match(rowCheckboxes[0], /aria-checked="true"/);
  assert.match(rowCheckboxes[1], /aria-checked="false"/);
});

test("FullWidthTable 渲染继承的左右 footer 内容", () => {
  const html = render(FullWidthTable as React.ElementType, {
    columns: [
      {
        key: "name",
        header: "名称",
        render: () => createElement("span", null, "A"),
      },
    ],
    rows: [{ name: "A" }],
    footerLeft: createElement("span", null, "批量操作"),
    footerRight: createElement("span", null, "导出"),
    showPagination: false,
  });

  assert.match(html, /批量操作/);
  assert.match(html, /导出/);
});

test("DataTable 旧索引模式按可见行逐项判断全选", () => {
  const html = render(DataTable as React.ElementType, {
    columns: [
      {
        key: "name",
        header: "名称",
        render: () => createElement("span", null, "A"),
      },
    ],
    rows: [{ name: "A" }],
    showCheckbox: true,
    selectedRows: new Set([99]),
  });
  const selectAll = html.match(/<button[^>]*aria-label="选择全部行"[^>]*>/)?.[0];

  assert.ok(selectAll);
  assert.match(selectAll, /aria-checked="false"/);
});

test("FullWidthTable 旧索引模式不会把无效索引误判为全选", () => {
  const html = render(FullWidthTable as React.ElementType, {
    columns: [
      {
        key: "name",
        header: "名称",
        render: () => createElement("span", null, "A"),
      },
    ],
    rows: [{ name: "A" }],
    selectedRows: new Set([99]),
    showPagination: false,
  });
  const selectAll = html.match(/<button[^>]*aria-label="选择全部行"[^>]*>/)?.[0];

  assert.ok(selectAll);
  assert.match(selectAll, /aria-checked="false"/);
});

test("文本输入组件透传原生属性并关联错误提示", () => {
  const field = render(TextField, {
    id: "email",
    name: "email",
    required: true,
    autoComplete: "email",
    state: "error",
    errorMessage: "邮箱格式不正确",
  });
  assert.match(field, /name="email"/);
  assert.match(field, /required=""/);
  assert.match(field, /autoComplete="email"/);
  assert.match(field, /aria-invalid="true"/);
  assert.match(field, /aria-describedby="email-error"/);
  assert.match(field, /id="email-error"/);

  const area = render(TextArea, { id: "bio", name: "bio", maxLength: 200 });
  assert.match(area, /name="bio"/);
  assert.match(area, /maxLength="200"/);
});

test("SelectOption 与 Datepicker 使用可聚焦、可声明展开状态的触发按钮", () => {
  const select = render(SelectOption, {
    options: [{ value: "a", label: "A" }],
  });
  assert.match(select, /role="combobox"/);
  assert.match(select, /tabindex="0"/);
  assert.match(select, /aria-expanded="false"/);

  const datepicker = render(Datepicker, { placeholder: "选择日期" });
  assert.match(datepicker, /<button[^>]*aria-haspopup="dialog"/);
  assert.match(datepicker, /aria-expanded="false"/);
});

test("TabBar 与 ButtonGroup 暴露选中状态", () => {
  const tabs = render(TabBar, { tabs: [{ label: "概览", active: true }] });
  assert.match(tabs, /role="tablist"/);
  assert.match(tabs, /role="tab"/);
  assert.match(tabs, /aria-selected="true"/);

  const group = render(ButtonGroup, { items: [{ label: "列表" }], activeIndex: 0 });
  assert.match(group, /role="group"/);
  assert.match(group, /aria-pressed="true"/);
});

test("PageHeader 拆分前后保留 search 与 title 两种公共渲染入口", () => {
  const search = render(PageHeader, {
    variant: "search",
    searchPlaceholder: "搜索项目",
    notifications: 2,
    showProfile: false,
  });
  assert.match(search, /aria-label="搜索项目"/);
  assert.match(search, /通知，2 条未读/);

  const title = render(PageHeader, {
    variant: "title",
    title: "项目详情",
    showDatePicker: false,
  });
  assert.match(title, /项目详情/);
  assert.match(title, /aria-label="返回"/);
  assert.match(title, /data-forge-page-header/);
  assert.match(title, /data-forge-page-title/);
});

test("Sidebar popover 公共导出与语言别名保持兼容", () => {
  assert.equal(languageMarkDataUrl, chinaFlagDataUrl);
  assert.equal(languageFlagDataUrls["zh-CN"], chinaFlagDataUrl);
  const language = render(LanguageSwitcher, { accentBg: "bg-fg-violet" });
  assert.match(language, /data-language-code="zh-CN"/);
  assert.match(language, /data-language-code="zh-TW"/);
  assert.match(language, /data-language-code="en-US"/);
  assert.match(language, /data-language-code="ja-JP"/);
  assert.match(language, /role="menu"/);
  assert.match(language, /role="menuitemradio"/);
  assert.match(render(MessageMenu), /role="menu"/);
  assert.match(render(NotificationPanel, { onClose: () => undefined }), /role="dialog"/);
  assert.match(render(ProfileDropdown), /role="menu"/);
  assert.match(render(TeamSwitcherDropdown, { teamName: "Forge 团队" }), /role="menu"/);
});
