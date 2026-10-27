import assert from "node:assert/strict";
import { createElement, type ElementType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const nodeProtocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${nodeProtocol}test`);

import {
  CellNumber,
  DataTable,
  resolveTableColumnAlign,
  type ColumnDef,
} from "../src/components/ui/data-table";

function render(component: ElementType, props: Record<string, unknown> = {}) {
  return renderToStaticMarkup(createElement(component, props));
}

test("数字列默认右对齐，标识列默认左对齐，列头与单元格同向", () => {
  const columns: ColumnDef<{ orderNo: string; amount: string }>[] = [
    {
      key: "orderNo",
      header: "订单号",
      valueKind: "identifier",
      render: (row) => createElement("span", null, row.orderNo),
    },
    {
      key: "amount",
      header: "金额",
      valueKind: "number",
      sortable: true,
      render: (row) => createElement(CellNumber, { value: row.amount }),
    },
  ];
  const html = render(DataTable, {
    columns,
    rows: [{ orderNo: "SO-10021", amount: "¥1,587,200.00" }],
  });

  for (const cell of html.matchAll(/<t[dh][^>]*data-forge-column-kind="identifier"[^>]*>/g)) {
    assert.match(cell[0], /data-forge-column-align="left"/);
    assert.match(cell[0], /text-align:var\(--forge-table-align-identifier\)/);
    assert.match(cell[0], /text-left/);
  }
  const numberCells = [...html.matchAll(/<t[dh][^>]*data-forge-column-kind="number"[^>]*>/g)];
  assert.equal(numberCells.length, 2);
  for (const cell of numberCells) {
    assert.match(cell[0], /data-forge-column-align="right"/);
    assert.match(cell[0], /text-align:var\(--forge-table-align-number\)/);
    assert.match(cell[0], /text-right/);
  }
  assert.match(html, /data-forge-cell-number-align="right"/);
  assert.match(html, /justify-end/);
  const amountHeader = numberCells[0][0];
  const headerHtml = html.slice(html.indexOf(amountHeader), html.indexOf("</th>", html.indexOf(amountHeader)));
  assert.ok(headerHtml.indexOf("<button") < headerHtml.indexOf("金额"));
});

test("CellNumber 默认右对齐，只有显式 align=left 才左对齐", () => {
  const right = render(CellNumber, { value: "¥400" });
  assert.match(right, /data-forge-cell-number-align="right"/);
  assert.match(right, /text-align:var\(--forge-table-align-number\)/);
  assert.match(right, /justify-end/);
  assert.match(right, /tabular-nums/);

  const left = render(CellNumber, { value: "12", align: "left" });
  assert.match(left, /data-forge-cell-number-align="left"/);
  assert.match(left, /text-align:var\(--forge-table-align-identifier\)/);
  assert.match(left, /justify-start/);
});

test("数字列左对齐缺少原因时标出违规并警告", () => {
  const warnings: unknown[][] = [];
  const original = console.warn;
  console.warn = (...args: unknown[]) => {
    warnings.push(args);
  };
  try {
    const html = render(DataTable, {
      columns: [
        {
          key: "silent-left-qty",
          header: "数量",
          valueKind: "number",
          align: "left",
          render: () => createElement(CellNumber, { value: "3", align: "left" }),
        },
      ],
      rows: [{}],
    });
    assert.match(html, /data-forge-column-align="left"/);
    assert.match(html, /data-forge-align-violation="number-left-without-reason"/);
    assert.equal(warnings.length, 1);
    assert.match(String(warnings[0][0]), /alignOverrideReason/);
  } finally {
    console.warn = original;
  }
});

test("数字列左对齐写明原因后可审计，且不再警告", () => {
  const allowed: ColumnDef<{ lineNo: string }> = {
    key: "line-no-with-reason",
    header: "行号",
    valueKind: "number",
    align: "left",
    alignOverrideReason: "行号按阅读顺序排列，不参与金额比较",
    render: (row) => createElement(CellNumber, { value: row.lineNo, align: "left" }),
  };
  assert.equal(resolveTableColumnAlign(allowed), "left");

  const warnings: unknown[][] = [];
  const original = console.warn;
  console.warn = (...args: unknown[]) => {
    warnings.push(args);
  };
  try {
    const html = render(DataTable, {
      columns: [allowed],
      rows: [{ lineNo: "12" }],
    });
    assert.match(html, /data-forge-column-align="left"/);
    assert.match(html, /data-forge-align-override="行号按阅读顺序排列，不参与金额比较"/);
    assert.doesNotMatch(html, /data-forge-align-violation/);
    assert.equal(warnings.length, 0);
  } finally {
    console.warn = original;
  }
});

test("数字单元格放进未声明数字语义的列时会警告", () => {
  const warnings: unknown[][] = [];
  const original = console.warn;
  console.warn = (...args: unknown[]) => {
    warnings.push(args);
  };
  try {
    const html = render(DataTable, {
      columns: [
        {
          key: "forgot-kind-amount",
          header: "金额",
          render: () => createElement(CellNumber, { value: "¥8.00" }),
        },
      ],
      rows: [{}],
    });
    assert.match(html, /data-forge-column-align="left"/);
    assert.match(html, /data-forge-cell-number-align="right"/);
    assert.equal(warnings.length, 1);
    assert.match(String(warnings[0][0]), /valueKind/);
  } finally {
    console.warn = original;
  }
});

test("省略语义的列保持左对齐", () => {
  assert.equal(resolveTableColumnAlign({ key: "name" }), "left");
  assert.equal(resolveTableColumnAlign({ key: "amount", valueKind: "number" }), "right");
  assert.equal(resolveTableColumnAlign({ key: "orderNo", valueKind: "identifier" }), "left");
});

test("类型上禁止数字列静默左对齐", () => {
  // @ts-expect-error 数字列 align="left" 必须同时填写 alignOverrideReason
  const illegal: ColumnDef<{ n: string }> = {
    key: "type-illegal",
    header: "数量",
    valueKind: "number",
    align: "left",
    render: () => null,
  };
  assert.equal(illegal.align, "left");
});
