import assert from "node:assert/strict";
import { act, useState, type Key } from "react";
import { DataTable, type ColumnDef } from "../src/components/ui/data-table";
import { DateTimePicker } from "../src/components/ui/forms/date-time-picker";
import { PeriodPicker } from "../src/components/ui/forms/period-picker";
import { TreeSelect } from "../src/components/ui/forms/tree-select";
import { click, flush, press, setup, type } from "./helpers/dom";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

type Order = { id: string; name: string; amount: number; children?: Order[] };
const orders: Order[] = [
  { id: "A", name: "杭州云栖", amount: 100, children: [{ id: "A-1", name: "子单 1", amount: 40 }, { id: "A-2", name: "子单 2", amount: 60 }] },
  { id: "B", name: "宁波海纳", amount: 200 },
];
const columns: ColumnDef<Order>[] = [
  { key: "name", header: "客户", render: row => row.name, pinned: "left" },
  { key: "amount", header: "金额", valueKind: "number", render: row => String(row.amount), resizable: true },
];
const button = (label: string) => [...document.querySelectorAll<HTMLElement>("button")].find(node => node.getAttribute("aria-label") === label || node.textContent?.trim() === label)!;
const bodyRows = () => [...document.querySelectorAll("tbody tr")].map(row => row.textContent);

test("DataTable: skeleton while loading empty, spinner over existing rows", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<DataTable columns={columns} rows={[]} loading />));
    assert.equal(document.querySelectorAll("tbody .forge-skeleton").length, 10);
    assert.ok(!document.body.textContent?.includes("暂无数据"));
    await act(async () => env.root.render(<DataTable columns={columns} rows={orders} loading />));
    assert.ok(document.querySelector('[role="status"]')?.textContent?.includes("加载中"));
    assert.equal(document.querySelector("[aria-busy]")?.getAttribute("aria-busy"), "true");
  } finally { await env.cleanup(); }
});

test("DataTable: expandable rows and tree rows", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<DataTable columns={columns} rows={orders} getRowKey={row => row.id} expandable={{ render: row => <p>明细 {row.id}</p>, rowExpandable: row => row.id === "A" }} />));
    assert.equal(document.querySelectorAll('[aria-label="展开详情"]').length, 1);
    await click(button("展开详情"));
    assert.ok(document.querySelector("[data-forge-table-expanded]")?.textContent?.includes("明细 A"));
    await act(async () => env.root.render(<DataTable key="tree" columns={columns} rows={orders} getRowKey={row => row.id} getRowChildren={row => row.children} />));
    assert.equal(bodyRows().length, 2);
    await click(button("展开子行"));
    assert.deepEqual(bodyRows().map(text => text?.replace(/\s/g, "")), ["杭州云栖100", "子单140", "子单260", "宁波海纳200"]);
    assert.equal(document.querySelectorAll('tr[data-depth="1"]').length, 2);
  } finally { await env.cleanup(); }
});

test("DataTable: column settings hide columns, bulk bar acts on selection", async () => {
  const env = setup(); const bulk: Key[][] = [];
  function Example() {
    const [selected, setSelected] = useState<Set<Key>>(new Set());
    return <DataTable title="订单" columns={columns} rows={orders} showCheckbox getRowKey={row => row.id} selectedRowKeys={selected} onSelectedRowKeysChange={setSelected} columnSettings
      bulkActions={keys => <button onClick={() => bulk.push([...keys])}>批量导出</button>} />;
  }
  try {
    await act(async () => env.root.render(<Example />));
    await click(button("列设置"));
    const amount = [...document.querySelectorAll<HTMLElement>('[role="menuitemcheckbox"]')].find(item => item.textContent?.includes("金额"))!;
    await click(amount);
    assert.ok(![...document.querySelectorAll("thead th")].some(th => th.textContent === "金额"), "amount column hidden");
    await press(document.activeElement ?? document.body, "Escape");
    await click(document.querySelector<HTMLElement>('[aria-label="选择第 2 行"]')!);
    assert.ok(document.querySelector('[aria-label="批量操作"]')?.textContent?.includes("已选择 1 项"));
    await click(button("批量导出"));
    assert.deepEqual(bulk, [["B"]]);
    await click(button("取消选择"));
    assert.equal(document.querySelector('[aria-label="批量操作"]'), null);
  } finally { await env.cleanup(); }
});

test("DataTable: page size selector and quick jumper", async () => {
  const env = setup(); const sizes: number[] = []; const pages: number[] = [];
  try {
    await act(async () => env.root.render(<DataTable columns={columns} rows={orders} showPagination currentPage={1} totalPages={8} onPageChange={page => pages.push(page)} pageSize={20} pageSizeOptions={[20, 50]} onPageSizeChange={size => sizes.push(size)} showQuickJumper />));
    await click(button("20 条"));
    await click([...document.querySelectorAll<HTMLElement>('[role="menuitemradio"]')].find(item => item.textContent === "50 条")!);
    assert.deepEqual(sizes, [50]);
    const jumper = document.querySelector<HTMLInputElement>('[aria-label="跳转到页码"]')!;
    await type(jumper, "99");
    await press(jumper, "Enter");
    assert.deepEqual(pages, [8], "clamps to the last page");
  } finally { await env.cleanup(); }
});

test("DataTable: inline edit saves on Enter, cancels on Escape and validates", async () => {
  const env = setup(); const saved: string[] = [];
  const editable: ColumnDef<Order>[] = [columns[0], { ...columns[1], edit: { value: row => row.amount, type: "number", validate: value => Number(value) < 0 ? "不能为负数" : null, onSave: (_row, value) => { saved.push(value); } } }];
  try {
    await act(async () => env.root.render(<DataTable columns={editable} rows={orders} />));
    await click(document.querySelectorAll<HTMLElement>('[aria-label="编辑"]')[1]);
    let input = document.querySelector<HTMLInputElement>("tbody input")!;
    await type(input, "-5");
    await press(input, "Enter");
    assert.ok(document.querySelector('[role="alert"]')?.textContent?.includes("不能为负数"));
    await type(input, "250");
    await press(input, "Enter");
    assert.deepEqual(saved, ["250"]);
    assert.equal(document.querySelector("tbody input"), null);
    await click(document.querySelectorAll<HTMLElement>('[aria-label="编辑"]')[0]);
    input = document.querySelector<HTMLInputElement>("tbody input")!;
    await press(input, "Escape");
    assert.equal(document.querySelector("tbody input"), null);
    assert.deepEqual(saved, ["250"]);
  } finally { await env.cleanup(); }
});

test("DataTable: virtualized renders a window of rows; pinned and resizable columns", async () => {
  const env = setup();
  const many = Array.from({ length: 1000 }, (_, index) => ({ id: String(index), name: `客户 ${index}`, amount: index }));
  try {
    await act(async () => env.root.render(<DataTable columns={columns} rows={many} getRowKey={row => row.id} maxHeight={400} virtualized={{ rowHeight: 52 }} />));
    const rendered = document.querySelectorAll("tbody tr:not([aria-hidden])").length;
    assert.ok(rendered > 0 && rendered < 60, `rendered ${rendered} rows`);
    assert.equal(document.querySelector("thead th[data-pinned]")?.getAttribute("data-pinned"), "left");
    const handle = document.querySelector<HTMLElement>('[aria-label="调整金额列宽"]')!;
    await press(handle, "ArrowRight");
    assert.ok(document.querySelector<HTMLElement>('th[data-col-key="amount"]')!.style.width.endsWith("px"));
  } finally { await env.cleanup(); }
});

test("DateTimePicker combines a date and a time and confirms", async () => {
  const env = setup(); const values: (Date | null)[] = [];
  try {
    await act(async () => env.root.render(<DateTimePicker label="开始时间" defaultValue={new Date(2026, 10, 23, 9, 0)} step={15} onChange={value => values.push(value)} />));
    assert.ok(document.body.textContent?.includes("2026-11-23 09:00"));
    await click(document.getElementById(document.querySelector("label")!.htmlFor)!);
    const day = [...document.querySelectorAll<HTMLElement>("button")].find(node => node.textContent === "25" && !node.hasAttribute("disabled"))!;
    await click(day);
    const minutes = document.querySelectorAll<HTMLElement>('[role="listbox"]')[1];
    await click([...minutes.querySelectorAll<HTMLElement>('[role="option"]')].find(option => option.textContent === "30")!);
    await click(button("确定"));
    assert.equal(values.length, 1);
    assert.equal(values[0]!.getDate(), 25);
    assert.equal(values[0]!.getHours(), 9);
    assert.equal(values[0]!.getMinutes(), 30);
  } finally { await env.cleanup(); }
});

test("PeriodPicker picks a quarter and pages by year", async () => {
  const env = setup(); const values: (Date | null)[] = [];
  try {
    await act(async () => env.root.render(<PeriodPicker label="考核季度" granularity="quarter" defaultValue={new Date(2026, 0, 1)} onChange={value => values.push(value)} />));
    await click(document.getElementById(document.querySelector("label")!.htmlFor)!);
    await click(button("下一页"));
    assert.ok(document.body.textContent?.includes("2027年"));
    await click(button("第3季度"));
    assert.equal(values[0]!.getFullYear(), 2027);
    assert.equal(values[0]!.getMonth(), 6);
    await flush();
    assert.ok(document.body.textContent?.includes("2027年 第3季度"));
  } finally { await env.cleanup(); }
});

test("TreeSelect picks one node, and in multiple mode a whole branch", async () => {
  const env = setup(); const single: (string | null)[] = []; const multi: string[][] = [];
  const nodes = [{ id: "rd", label: "研发中心", children: [{ id: "fe", label: "前端组" }, { id: "be", label: "后端组" }] }, { id: "ops", label: "运营部" }];
  try {
    await act(async () => env.root.render(<TreeSelect label="部门" nodes={nodes} onChange={id => single.push(id)} />));
    await click(document.getElementById(document.querySelector("label")!.htmlFor)!);
    await type(document.querySelector<HTMLInputElement>('input[type="search"]')!, "后端");
    const item = [...document.querySelectorAll<HTMLElement>('[role="treeitem"]')].find(node => node.textContent?.includes("后端组") && node.getAttribute("aria-level") === "2")!;
    await click(item.firstElementChild!);
    assert.deepEqual(single, ["be"]);
    await act(async () => env.root.render(<TreeSelect key="multi" label="可见部门" multiple nodes={nodes} onChange={ids => multi.push(ids)} />));
    await click(document.getElementById(document.querySelector("label")!.htmlFor)!);
    const parent = [...document.querySelectorAll<HTMLElement>('[role="treeitem"]')].find(node => node.getAttribute("data-tree-id") === "rd")!;
    await click(parent.firstElementChild!);
    assert.deepEqual([...multi.at(-1)!].sort(), ["be", "fe", "rd"]);
    assert.ok(button("移除 研发中心"), "a checked branch shows as one tag");
  } finally { await env.cleanup(); }
});
