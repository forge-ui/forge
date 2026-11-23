import assert from "node:assert/strict";
import { act, useState } from "react";
import { Alert, EmptyState, Result, Skeleton, Spinner } from "../src/components/ui/feedback";
import { CopyButton, Descriptions, Kbd, Separator, Tag, Timeline } from "../src/components/ui/data-display";
import { Popconfirm } from "../src/components/ui/popconfirm";
import { Tree, type TreeNode } from "../src/components/ui/tree";
import { Splitter } from "../src/components/ui/splitter";
import { Cascader } from "../src/components/ui/forms/cascader";
import { TimePicker } from "../src/components/ui/forms/time-picker";
import { TagInput } from "../src/components/ui/forms/tag-input";
import { Transfer } from "../src/components/ui/forms/transfer";
import { click, flush, press, setup, type } from "./helpers/dom";
const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${protocol}test`);

const text = (selector: string) => [...document.querySelectorAll(selector)].map(node => node.textContent);
const button = (label: string) => [...document.querySelectorAll<HTMLElement>("button")].find(node => node.textContent === label || node.getAttribute("aria-label") === label)!;

test("feedback: Alert roles and close, Spinner label, Skeleton lines, EmptyState and Result", async () => {
  const env = setup(); let closed = 0;
  try {
    await act(async () => env.root.render(<>
      <Alert tone="error" title="保存失败" closable>网络异常</Alert>
      <Alert tone="info" closable onClose={() => closed++}>提示</Alert>
      <Spinner label="加载中" />
      <Skeleton lines={3} />
      <EmptyState title="暂无订单" description="新建一个订单开始" action={<button>新建</button>} />
      <Result status="404" title="页面不存在" actions={<button>返回首页</button>} />
    </>));
    assert.ok(document.querySelector('[role="alert"]')?.textContent?.includes("保存失败"));
    await click(button("关闭提示"));
    assert.equal(document.querySelector('[role="alert"]'), null, "uncontrolled alert hides itself");
    await click(button("关闭提示"));
    assert.equal(closed, 1);
    assert.ok(document.querySelector('[role="status"]')?.textContent?.includes("提示"), "controlled alert stays until the host removes it");
    assert.ok(text('[role="status"]').includes("加载中"));
    assert.equal(document.querySelectorAll(".forge-skeleton").length, 3);
    assert.ok(document.body.textContent?.includes("暂无订单"));
    assert.equal(document.querySelector("h2")?.textContent, "页面不存在");
  } finally { await env.cleanup(); }
});

test("data display: Descriptions, Timeline pending step, removable Tag, Kbd, Separator, CopyButton", async () => {
  const env = setup(); const removed: string[] = []; const copied: string[] = [];
  Object.defineProperty(globalThis.navigator, "clipboard", { configurable: true, value: { writeText: async () => undefined } });
  try {
    await act(async () => env.root.render(<>
      <Descriptions title="订单信息" items={[{ label: "订单号", value: "A-1" }, { label: "金额", value: "¥ 30" }]} variant="bordered" />
      <Timeline items={[{ title: "提交", time: "09:00", tone: "success" }]} pending="等待审批" />
      <Tag onRemove={() => removed.push("华东")}>华东</Tag>
      <Kbd keys={["⌘", "K"]} />
      <Separator label="或" />
      <CopyButton value="A-1" onCopy={value => copied.push(value)} />
    </>));
    assert.deepEqual(text("dt"), ["订单号", "金额"]);
    assert.deepEqual(text("ol > li").map(item => item?.replace(/\s+/g, "")), ["提交09:00", "等待审批"]);
    await click(button("移除 华东"));
    assert.deepEqual(removed, ["华东"]);
    assert.equal(document.querySelectorAll("kbd").length, 2);
    assert.ok(document.querySelector('[role="separator"]'));
    await click(button("复制"));
    assert.deepEqual(copied, ["A-1"]);
    assert.ok(button("已复制"), "confirms the copy");
  } finally { await env.cleanup(); }
});

test("Popconfirm starts on cancel, waits for an async confirm and then closes", async () => {
  const env = setup(); let resolve!: () => void; let confirmed = 0;
  try {
    await act(async () => env.root.render(<Popconfirm tone="danger" title="删除该成员？" motion="none" trigger={<button>删除</button>} onConfirm={() => new Promise<void>(done => { confirmed++; resolve = done; })} />));
    await click(button("删除"));
    const bubble = document.querySelector<HTMLElement>('[role="alertdialog"]')!;
    assert.ok(bubble.textContent?.includes("删除该成员？"));
    assert.equal(document.activeElement?.textContent, "取消");
    await click(button("确定"));
    assert.equal(confirmed, 1);
    assert.ok(document.querySelector('[role="alertdialog"]'), "stays open while pending");
    await act(async () => resolve());
    await flush();
    assert.equal(document.querySelector('[role="alertdialog"]'), null);
  } finally { await env.cleanup(); }
});

const org: TreeNode[] = [
  { id: "rd", label: "研发部", children: [{ id: "fe", label: "前端组" }, { id: "be", label: "后端组" }] },
  { id: "ops", label: "运营部" },
];

test("Tree follows the ARIA tree keyboard pattern and selects", async () => {
  const env = setup(); const selected: string[] = [];
  try {
    await act(async () => env.root.render(<Tree ariaLabel="组织架构" nodes={org} onSelect={id => selected.push(id)} motion="none" />));
    const first = document.querySelector<HTMLElement>('[role="treeitem"]')!;
    first.focus();
    await press(first, "ArrowRight");
    assert.equal(first.getAttribute("aria-expanded"), "true");
    await press(document.activeElement!, "ArrowRight");
    assert.equal(document.activeElement?.getAttribute("data-tree-id"), "fe");
    await press(document.activeElement!, "ArrowDown");
    await press(document.activeElement!, "Enter");
    assert.deepEqual(selected, ["be"]);
    await press(document.activeElement!, "ArrowLeft");
    assert.equal(document.activeElement?.getAttribute("data-tree-id"), "rd");
    await press(document.activeElement!, "ArrowLeft");
    assert.equal(first.getAttribute("aria-expanded"), "false");
  } finally { await env.cleanup(); }
});

test("checkable Tree cascades to children and shows a partial parent", async () => {
  const env = setup(); const changes: string[][] = [];
  function Example() { const [checked, setChecked] = useState<string[]>([]); return <Tree ariaLabel="权限" nodes={org} checkable checkedIds={checked} defaultExpandedIds={["rd"]} onCheckedChange={next => { changes.push(next); setChecked(next); }} motion="none" />; }
  try {
    await act(async () => env.root.render(<Example />));
    const item = (id: string) => document.querySelector<HTMLElement>(`[data-tree-id="${id}"]`)!;
    await click(item("fe").firstElementChild!);
    assert.equal(item("rd").getAttribute("aria-checked"), "mixed");
    await click(item("rd").firstElementChild!);
    assert.deepEqual([...changes.at(-1)!].sort(), ["be", "fe", "rd"]);
    assert.equal(item("rd").getAttribute("aria-checked"), "true");
  } finally { await env.cleanup(); }
});

test("Cascader walks columns and commits the leaf path", async () => {
  const env = setup(); const paths: string[][] = [];
  try {
    await act(async () => env.root.render(<Cascader label="地区" motion="none" options={[{ value: "zj", label: "浙江", children: [{ value: "hz", label: "杭州" }, { value: "nb", label: "宁波" }] }, { value: "js", label: "江苏" }]} onChange={path => paths.push(path)} />));
    await click(document.getElementById(document.querySelector("label")!.htmlFor)!);
    await click([...document.querySelectorAll<HTMLElement>('[role="option"]')].find(option => option.textContent === "浙江")!);
    assert.equal(document.querySelectorAll('[role="listbox"]').length, 2);
    await click([...document.querySelectorAll<HTMLElement>('[role="option"]')].find(option => option.textContent === "宁波")!);
    assert.deepEqual(paths, [["zj", "nb"]]);
    assert.ok(document.body.textContent?.includes("浙江 / 宁波"));
  } finally { await env.cleanup(); }
});

test("TimePicker picks hours and minutes with a step", async () => {
  const env = setup(); const values: string[] = [];
  try {
    await act(async () => env.root.render(<TimePicker label="开始时间" step={15} motion="none" onChange={value => values.push(value)} />));
    await click(document.getElementById(document.querySelector("label")!.htmlFor)!);
    const lists = document.querySelectorAll<HTMLElement>('[role="listbox"]');
    assert.equal(lists[1].querySelectorAll('[role="option"]').length, 4);
    await click([...lists[0].querySelectorAll<HTMLElement>('[role="option"]')].find(option => option.textContent === "09")!);
    assert.equal(values.at(-1), "09:00");
    await press(lists[1], "ArrowDown");
    assert.equal(values.at(-1), "09:15");
  } finally { await env.cleanup(); }
});

test("TagInput adds on Enter, comma and paste, rejects invalid values and removes with Backspace", async () => {
  const env = setup(); const changes: string[][] = [];
  try {
    await act(async () => env.root.render(<TagInput label="收件人" validate={tag => tag.includes("@") ? null : "请输入邮箱"} onChange={tags => changes.push(tags)} />));
    const input = document.querySelector("input")!;
    await type(input, "a@x.com");
    await press(input, "Enter");
    assert.deepEqual(changes.at(-1), ["a@x.com"]);
    await type(input, "oops");
    await press(input, "Enter");
    assert.ok(document.body.textContent?.includes("请输入邮箱"));
    await type(input, "");
    await press(input, "Backspace");
    assert.deepEqual(changes.at(-1), []);
  } finally { await env.cleanup(); }
});

test("Transfer moves checked items between lists", async () => {
  const env = setup(); const values: string[][] = [];
  try {
    await act(async () => env.root.render(<Transfer motion="none" items={[{ value: "read", label: "查看" }, { value: "edit", label: "编辑" }, { value: "del", label: "删除", disabled: true }]} onChange={value => values.push(value)} />));
    const option = (label: string) => [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(node => node.textContent === label)!;
    await click(option("编辑"));
    await click(button("移到已选"));
    assert.deepEqual(values.at(-1), ["edit"]);
    const panes = document.querySelectorAll('[role="listbox"]');
    assert.ok(panes[1].textContent?.includes("编辑"));
    await click(document.querySelectorAll<HTMLElement>('[aria-label="全选"]')[0]);
    assert.equal(option("查看").getAttribute("aria-selected"), "true");
    assert.equal(option("删除").getAttribute("aria-selected"), "false", "disabled items are skipped");
  } finally { await env.cleanup(); }
});

test("Splitter resizes from the keyboard within its limits", async () => {
  const env = setup(); const sizes: number[] = [];
  try {
    await act(async () => env.root.render(<Splitter defaultSize={50} min={20} max={80} onSizeChange={size => sizes.push(size)}>{[<p key="a">列表</p>, <p key="b">详情</p>]}</Splitter>));
    const handle = document.querySelector<HTMLElement>('[role="separator"]')!;
    await press(handle, "ArrowRight");
    assert.equal(handle.getAttribute("aria-valuenow"), "52");
    await press(handle, "Home");
    assert.equal(handle.getAttribute("aria-valuenow"), "20");
    assert.deepEqual(sizes, [52, 20]);
  } finally { await env.cleanup(); }
});
