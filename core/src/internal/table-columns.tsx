"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { cn } from "../lib/utils";

// Column model and alignment rules shared by DataTable, FullWidthTable and their grid.

export type TableColumnAlign = "left" | "right";

/**
 * 列语义，决定省略 `align` 时的默认方向。
 * - `number`：金额、数量、单价、百分比及同类可比较数值，默认右对齐。
 * - `identifier`：工号、日期、时间、电话、邮编、订单号、业务 ID 及同类标识，默认左对齐。
 */
export type TableValueKind = "number" | "identifier";

type ColumnDefBase<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  /** Tailwind width class for compact columns, e.g. `w-[120px]`. */
  width?: string;
  minWidth?: number;
  /** Readable name column, capped at 280px. Does not absorb leftover table width. */
  flex?: boolean;
  render: (row: T, rowIndex: number) => ReactNode;
  /** Keep the column visible while scrolling sideways. */
  pinned?: "left" | "right";
  /** Lets the user drag the header edge to change the width. */
  resizable?: boolean;
  /** Set false to keep the column out of the column settings menu. */
  hideable?: boolean;
  /** Inline editing: click the cell (or press Enter on it) to edit; Enter or blur saves, Escape cancels. */
  edit?: TableCellEdit<T>;
};

export type TableCellEdit<T> = {
  /** The raw value to put in the input. */
  value: (row: T) => string | number;
  /** May return a promise; the cell shows the new value only after the host updates `rows`. */
  onSave: (row: T, value: string) => void | Promise<unknown>;
  type?: "text" | "number";
  /** Return a message to reject the value. */
  validate?: (value: string, row: T) => string | null | undefined;
};

type ColumnDefAlign =
  | {
      /** 省略或 identifier：标识与普通文本，默认左对齐。列头与内容同向。 */
      valueKind?: "identifier";
      align?: TableColumnAlign;
      /** 标识列一般不需要。数字列禁止用这个字段代替 `valueKind: "number"`。 */
      alignOverrideReason?: string;
    }
  | {
      /** 金额、数量、单价、百分比及同类可比较数值。省略 align 即右对齐。 */
      valueKind: "number";
      align?: "right";
      alignOverrideReason?: never;
    }
  | {
      valueKind: "number";
      /**
       * 数字列离开默认右对齐。必须同时填写非空 `alignOverrideReason`。
       * 漏写原因会在运行时警告，并标上 `data-forge-align-violation`。
       */
      align: "left";
      alignOverrideReason: string;
    };

export type ColumnDef<T> = ColumnDefBase<T> & ColumnDefAlign;

export const warnedNumberAlignKeys = new Set<string>();
export const warnedCellAlignKeys = new Set<string>();

export const TableColumnAlignContext = createContext<{ align: TableColumnAlign; columnKey: string } | null>(null);

export function useWarnWhenNumericCellMissesColumn(align: TableColumnAlign) {
  const column = useContext(TableColumnAlignContext);
  if (!column || column.align === align || warnedCellAlignKeys.has(column.columnKey)) return;
  warnedCellAlignKeys.add(column.columnKey);
  console.warn(
    `[ForgeUI] 列 "${column.columnKey}" 对齐为 ${column.align}，其中的数字单元格为 ${align}。金额、数量、单价、百分比请设 valueKind: "number"，让列头与内容一起右对齐。数字列要左对齐时，列上同时写 align: "left" 与 alignOverrideReason，单元格再传 align="left"。`,
  );
}

/** 数字列默认右对齐；标识列与普通列默认左对齐。数字列左对齐必须带非空原因。 */
export function resolveTableColumnAlign<T>(
  column: Pick<ColumnDef<T>, "key" | "valueKind" | "align" | "alignOverrideReason">,
): TableColumnAlign {
  if (column.valueKind === "number") {
    if (column.align === "left") {
      if (!column.alignOverrideReason?.trim() && !warnedNumberAlignKeys.has(column.key)) {
        warnedNumberAlignKeys.add(column.key);
        console.warn(
          `[ForgeUI] 数字列 "${column.key}" 设置了 align="left"，但没有 alignOverrideReason。金额、数量、单价、百分比默认右对齐；左对齐必须显式写出原因。`,
        );
      }
      return "left";
    }
    return "right";
  }
  return column.align ?? "left";
}

export function tableAlignToken(align: TableColumnAlign): CSSProperties["textAlign"] {
  return (align === "right"
    ? "var(--forge-table-align-number)"
    : "var(--forge-table-align-identifier)") as CSSProperties["textAlign"];
}

export function columnAlignDataAttrs<T>(column: ColumnDef<T>) {
  const align = resolveTableColumnAlign(column);
  const override = column.valueKind === "number" && column.align === "left"
    ? column.alignOverrideReason?.trim() ?? ""
    : "";
  return {
    "data-forge-column-align": align,
    "data-forge-column-kind": column.valueKind ?? "text",
    ...(override ? { "data-forge-align-override": override } : {}),
    ...(column.valueKind === "number" && column.align === "left" && !override
      ? { "data-forge-align-violation": "number-left-without-reason" }
      : {}),
  };
}

export function numericCellLayout(align: TableColumnAlign = "right"): { "data-forge-cell-number-align": TableColumnAlign; className: string; style: CSSProperties } {
  return {
    "data-forge-cell-number-align": align,
    className: cn(
      "flex h-10 w-full min-w-0 items-center gap-1 tabular-nums",
      align === "right" ? "justify-end text-right" : "justify-start text-left",
    ),
    style: { textAlign: tableAlignToken(align) } satisfies CSSProperties,
  };
}

/** Identity / flex columns stay readable but do not absorb leftover table width. */
const TABLE_IDENTITY_COLUMN_MAX_PX = 280;

export function isTableIdentityColumn<T>(column: ColumnDef<T>, index: number): boolean {
  return Boolean(column.flex) || (index === 0 && !column.width);
}

export function isTableActionsColumn<T>(column: ColumnDef<T>): boolean {
  return column.key === "actions" || column.header === "";
}

export function getDefaultTableMinWidth<T>(
  columns: ColumnDef<T>[],
  showCheckbox = false,
): number {
  let minWidth = showCheckbox ? 56 : 0;
  for (const [index, column] of columns.entries()) {
    if (column.minWidth !== undefined && Number.isFinite(column.minWidth) && column.minWidth > 0) minWidth += column.minWidth;
    else if (isTableIdentityColumn(column, index)) minWidth += 240;
    else if (isTableActionsColumn(column)) minWidth += 88;
    else minWidth += 128;
  }
  return minWidth;
}

export function tableColumnClass<T>(
  column: ColumnDef<T>,
  index: number,
  variant: "header" | "body",
) {
  const identity = isTableIdentityColumn(column, index);
  const align = resolveTableColumnAlign(column);
  return cn(
    variant === "header"
      ? "px-5 py-3.5 bg-background text-fg-grey-700 text-sm font-medium leading-5 tracking-fg whitespace-nowrap"
      : "px-5 py-3.5",
    align === "right" ? "text-right tabular-nums" : "text-left",
    "min-w-0",
    identity ? "w-[1%] max-w-[280px] overflow-hidden" : "whitespace-nowrap",
    column.width,
  );
}

export function tableColumnStyle<T>(
  column: ColumnDef<T>,
  index: number,
): CSSProperties {
  return {
    textAlign: tableAlignToken(resolveTableColumnAlign(column)),
    ...(column.minWidth !== undefined && Number.isFinite(column.minWidth) && column.minWidth > 0 ? { minWidth: column.minWidth } : {}),
    ...(isTableIdentityColumn(column, index)
      ? { maxWidth: TABLE_IDENTITY_COLUMN_MAX_PX }
      : {}),
  };
}

