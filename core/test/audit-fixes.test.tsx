import assert from "node:assert/strict";
import { act } from "react";
import { DataTable, type ColumnDef } from "../src/components/ui/data-table";
import { Modal } from "../src/components/ui/modal";
import { TreeSelect } from "../src/components/ui/forms/tree-select";
import { DateTimePicker } from "../src/components/ui/forms/date-time-picker";
import { PeriodPicker } from "../src/components/ui/forms/period-picker";
import { TagInput } from "../src/components/ui/forms/tag-input";
import { click, flush, setup, type } from "./helpers/dom";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

const button = (label: string) => [...document.querySelectorAll<HTMLElement>("button")].find(node => node.getAttribute("aria-label") === label || node.textContent?.trim() === label)!;
const openField = () => click(document.getElementById(document.querySelector("label")!.htmlFor)!);

test("TreeSelect: checking one match while searching does not report its partly checked parent", async () => {
  const env = setup(); const changes: string[][] = [];
  const nodes = [{ id: "A", label: "部门A", children: [{ id: "a1", label: "甲一" }, { id: "a2", label: "甲二" }, { id: "a3", label: "甲三" }] }];
  try {
    await act(async () => env.root.render(<TreeSelect label="部门" multiple nodes={nodes} onChange={ids => changes.push(ids)} />));
    await openField();
    await type(document.querySelector<HTMLInputElement>('input[type="search"]')!, "甲一");
    const leaf = [...document.querySelectorAll<HTMLElement>('[role="treeitem"]')].find(node => node.dataset.treeId === "a1")!;
    await click(leaf.firstElementChild!);
    assert.deepEqual(changes.at(-1), ["a1"]);
  } finally { await env.cleanup(); }
});

type Row = { id: string; name: string; children?: Row[] };
const tree: Row[] = [{ id: "A", name: "甲", children: [{ id: "A1", name: "甲一" }] }, { id: "B", name: "乙" }, { id: "C", name: "丙" }];
const columns: ColumnDef<Row>[] = [{ key: "name", header: "名称", render: row => row.name }];

test("DataTable: index-based selection with tree rows only addresses top-level rows", async () => {
  const env = setup(); const picked: [number, boolean][] = []; let all: boolean | undefined;
  try {
    await act(async () => env.root.render(<DataTable columns={columns} rows={tree} showCheckbox getRowKey={row => row.id} getRowChildren={row => row.children}
      selectedRows={new Set([0, 1, 2])} onSelectRow={(index, checked) => picked.push([index, checked])} onSelectAll={checked => { all = checked; }} />));
    await click(button("展开子行"));
    const labels = [...document.querySelectorAll('tbody [aria-label^="选择第"]')].map(node => node.getAttribute("aria-label"));
    assert.deepEqual(labels, ["选择第 1 行", "选择第 2 行", "选择第 3 行"], "child row has no index checkbox");
    assert.equal(document.querySelector<HTMLElement>('[aria-label="选择全部行"]')!.getAttribute("aria-checked"), "true");
    await click(document.querySelector<HTMLElement>('[aria-label="选择第 2 行"]')!);
    assert.deepEqual(picked, [[1, false]]);
    assert.equal(all, undefined);
  } finally { await env.cleanup(); }
});

test("DataTable: key-based selection labels child rows by their path", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<DataTable columns={columns} rows={tree} showCheckbox getRowKey={row => row.id} getRowChildren={row => row.children} selectedRowKeys={new Set()} onSelectedRowKeysChange={() => {}} />));
    await click(button("展开子行"));
    const labels = [...document.querySelectorAll('tbody [aria-label^="选择第"]')].map(node => node.getAttribute("aria-label"));
    assert.deepEqual(labels, ["选择第 1 行", "选择第 1.1 行", "选择第 2 行", "选择第 3 行"]);
  } finally { await env.cleanup(); }
});

test("Modal: a nested dialog dims its parent with its own backdrop", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<Modal open motion="none" title="父层" onOpenChange={() => {}}><Modal open motion="none" title="子层" onOpenChange={() => {}}>内容</Modal></Modal>));
    await flush();
    assert.equal(document.querySelectorAll(".forge-overlay-backdrop").length, 2);
  } finally { await env.cleanup(); }
});

test("DateTimePicker keeps the chosen value inside minDate and maxDate", async () => {
  const env = setup(); const values: (Date | null)[] = [];
  const max = new Date(2026, 0, 10, 12, 0);
  try {
    await act(async () => env.root.render(<DateTimePicker label="截止" maxDate={max} onChange={value => values.push(value)} />));
    await openField();
    await click(button("此刻"));
    await click(button("确定"));
    assert.ok(values[0] && values[0].getTime() <= max.getTime(), "Now is clamped to maxDate");
  } finally { await env.cleanup(); }
});

test("PeriodPicker allows the period that contains a minDate with a time of day", async () => {
  const env = setup();
  try {
    await act(async () => env.root.render(<PeriodPicker label="账期" granularity="month" defaultValue={new Date(2026, 11, 1)} minDate={new Date(2026, 11, 31, 10, 0)} />));
    await openField();
    assert.equal(button("12月").hasAttribute("disabled"), false);
    assert.equal(button("11月").hasAttribute("disabled"), true);
  } finally { await env.cleanup(); }
});

test("TagInput keeps valid values from a mixed paste and leaves invalid ones for editing", async () => {
  const env = setup(); const changes: string[][] = [];
  try {
    await act(async () => env.root.render(<TagInput label="收件人" separators={[";"]} validate={tag => tag.includes("@") ? null : "请输入邮箱"} onChange={tags => changes.push(tags)} />));
    const input = document.querySelector("input")!;
    await act(async () => {
      const event = new window.Event("paste", { bubbles: true, cancelable: true }) as Event & { clipboardData: { getData: () => string } };
      Object.defineProperty(event, "clipboardData", { value: { getData: () => "a@x.com;oops;b@x.com" } });
      input.dispatchEvent(event);
    });
    await flush();
    assert.deepEqual(changes.at(-1), ["a@x.com", "b@x.com"]);
    assert.equal(input.value, "oops");
    assert.ok(document.body.textContent?.includes("请输入邮箱"));
  } finally { await env.cleanup(); }
});
