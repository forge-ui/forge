"use client";

/* eslint-disable @next/next/no-img-element */

import { createContext, Fragment, useContext, useLayoutEffect, useRef, useState, type CSSProperties, type Key, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import {
  AltArrowLeftLinear,
  AltArrowRightLinear,
  AltArrowDownLinear,
  AltArrowUpLinear,
  MenuDotsBold,
  StarBoldDuotone,
  LetterLinear,
  PhoneLinear,
  ChatRoundLinear,
  EyeLinear,
  PenLinear,
  TrashBinTrashLinear,
  ListCheckLinear,
} from "../../icons";
import { Checkbox, type CheckboxColor } from "./checkbox";
import { DropdownMenu } from "./dropdown-menu";
import { ToolbarSelectDropdown } from "./toolbar";
import { FileTypeIcon } from "./forms";
import { ProgressBar, type ProgressColor } from "./progress-bar";

// ============================================================
// DataTable - data table with configurable columns
// Supports 6-column, 8-column, and full-width variants
// ============================================================

export type TableCellVariant = "header" | "body";

export type CellContentType =
  | "text"
  | "text-subtitle"
  | "image-text"
  | "image-text-subtitle"
  | "user"
  | "user-subtitle"
  | "badge-icon"
  | "badge-icon-subtitle"
  | "avatar-group"
  | "status-badge"
  | "progress-badge"
  | "kebab-menu"
  | "custom";

export type TableCellProps = {
  variant?: TableCellVariant;
  children?: ReactNode;
  className?: string;
  sortable?: boolean;
  onSort?: () => void;
  checkbox?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  checkboxColor?: CheckboxColor;
  leadIcon?: ReactNode;
};

export function TableCell({
  variant = "body",
  children,
  className,
  sortable = false,
  onSort,
  checkbox = false,
  checked = false,
  onCheckedChange,
  checkboxColor = "black",
  leadIcon,
}: TableCellProps) {
  const isHeader = variant === "header";

  return (
    <div
      className={cn(
        "self-stretch px-6 py-4 bg-background border-b border-fg-grey-200 flex justify-start items-center gap-2",
        className
      )}
    >
      {checkbox && (
        <Checkbox
          checked={checked}
          color={checkboxColor}
          onChange={onCheckedChange}
        />
      )}
      {isHeader ? (
        <>
          <div className="flex-1 flex items-center gap-1 text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
            {leadIcon && (
              <span className="w-5 h-5 flex items-center justify-center text-fg-grey-500 shrink-0">
                {leadIcon}
              </span>
            )}
            {children}
          </div>
          {sortable && (
            <button
              type="button"
              onClick={onSort}
              className="w-4 h-4 flex items-center justify-center cursor-pointer text-fg-grey-500"
            >
              <AltArrowDownLinear size={10} />
            </button>
          )}
        </>
      ) : (
        children
      )}
    </div>
  );
}

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

const warnedNumberAlignKeys = new Set<string>();
const warnedCellAlignKeys = new Set<string>();

const TableColumnAlignContext = createContext<{ align: TableColumnAlign; columnKey: string } | null>(null);

function useWarnWhenNumericCellMissesColumn(align: TableColumnAlign) {
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

function tableAlignToken(align: TableColumnAlign): CSSProperties["textAlign"] {
  return (align === "right"
    ? "var(--forge-table-align-number)"
    : "var(--forge-table-align-identifier)") as CSSProperties["textAlign"];
}

function columnAlignDataAttrs<T>(column: ColumnDef<T>) {
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

function numericCellLayout(align: TableColumnAlign = "right") {
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

function isTableIdentityColumn<T>(column: ColumnDef<T>, index: number): boolean {
  return Boolean(column.flex) || (index === 0 && !column.width);
}

function isTableActionsColumn<T>(column: ColumnDef<T>): boolean {
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

function tableColumnClass<T>(
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

function tableColumnStyle<T>(
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

const statusBadgeSolidColors = {
  purple: "bg-fg-violet",
  blue: "bg-fg-blue-500",
  yellow: "bg-fg-yellow",
  cyan: "bg-fg-cyan-500",
  green: "bg-fg-green-500",
  red: "bg-fg-red",
  grey: "bg-fg-grey-500",
} as const;

const statusBadgeSoftColors = {
  purple: { bg: "bg-fg-violet-50", outline: "outline-fg-violet-200", text: "text-fg-violet" },
  blue: { bg: "bg-fg-blue-50", outline: "outline-fg-blue-200", text: "text-fg-blue-500" },
  yellow: { bg: "bg-fg-yellow-50", outline: "outline-fg-yellow-200", text: "text-fg-yellow-700" },
  cyan: { bg: "bg-fg-cyan-50", outline: "outline-fg-cyan-200", text: "text-fg-cyan-500" },
  green: { bg: "bg-fg-green-50", outline: "outline-fg-green-200", text: "text-fg-green-500" },
  red: { bg: "bg-fg-red-50", outline: "outline-fg-red-200", text: "text-fg-red" },
  grey: { bg: "bg-fg-grey-50", outline: "outline-fg-grey-200", text: "text-fg-grey-700" },
} as const;

export type StatusBadgeColor = keyof typeof statusBadgeSolidColors;
export type StatusBadgeVariant = "soft" | "solid";

export function StatusBadge({
  label,
  color = "grey",
  variant = "soft",
}: {
  label: string;
  color?: StatusBadgeColor;
  variant?: StatusBadgeVariant;
}) {
  const soft = variant === "soft" ? statusBadgeSoftColors[color] : null;
  return (
    <div className="h-10 flex justify-center items-center gap-2">
      <div
        className={cn(
          "px-2 py-1 rounded-full inline-flex flex-col justify-center items-center gap-2",
          soft
            ? cn(soft.bg, "outline outline-1 outline-offset-[-1px]", soft.outline)
            : statusBadgeSolidColors[color],
        )}
      >
        <span
          className={cn(
            "text-center justify-center text-xs font-medium leading-4.5 tracking-fg",
            soft ? soft.text : "text-white",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

const progressBadgeColors = {
  green: {
    bg: "bg-fg-green-50",
    outline: "outline-fg-green-200",
    text: "text-fg-green-500",
  },
  red: {
    bg: "bg-fg-red-100",
    outline: "outline-fg-red-200",
    text: "text-fg-red",
  },
  grey: {
    bg: "bg-fg-grey-50",
    outline: "outline-fg-grey-200",
    text: "text-fg-grey-700",
  },
} as const;

export type ProgressBadgeColor = keyof typeof progressBadgeColors;

export function ProgressBadge({
  label,
  color = "green",
}: {
  label: string;
  color?: ProgressBadgeColor;
}) {
  const c = progressBadgeColors[color];
  return (
    <div
      className={cn(
        "px-2 py-1 rounded-full outline outline-1 outline-offset-[-1px] inline-flex flex-col justify-center items-center gap-2",
        c.bg,
        c.outline
      )}
    >
      <span
        className={cn(
          "text-center justify-center text-xs font-medium leading-4.5 tracking-fg",
          c.text
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function CellText({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 h-10 flex justify-start items-center gap-2">
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
        <div className="self-stretch justify-start text-fg-black text-sm font-medium leading-5 tracking-fg line-clamp-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export function CellTextSubtitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex-1 flex justify-start items-center gap-2">
      <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
        <div className="self-stretch justify-start text-fg-black text-sm font-medium leading-5 tracking-fg line-clamp-1">
          {title}
        </div>
        {subtitle && (
          <div className="self-stretch justify-start text-fg-grey-700 text-xs font-normal leading-4 tracking-fg line-clamp-1">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

export function CellMuted({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 h-10 flex justify-start items-center gap-2">
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
        <div className="self-stretch justify-start text-fg-grey-700 text-sm font-normal leading-5 tracking-fg line-clamp-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export function CellImageText({
  src,
  title,
  subtitle,
  rounded = "lg",
}: {
  src: string;
  title: string;
  subtitle?: string;
  rounded?: "lg" | "full";
}) {
  const imgClass = rounded === "full" ? "rounded-full" : "rounded-lg";
  return (
    <div className="flex-1 flex justify-start items-center gap-2">
      <img className={cn("w-10 h-10", imgClass)} src={src} alt={title} />
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
        <div className="self-stretch justify-start text-fg-black text-sm font-medium leading-5 tracking-fg line-clamp-1">
          {title}
        </div>
        {subtitle && (
          <div className="self-stretch justify-start text-fg-grey-700 text-xs font-normal leading-4 tracking-fg line-clamp-1">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

export function CellProgressValue({
  value,
  badge,
  badgeColor = "green",
  align = "right",
}: {
  value: string;
  badge: string;
  badgeColor?: ProgressBadgeColor;
  /** 表格内的数量、金额、百分比默认右对齐。左对齐须显式传入。 */
  align?: TableColumnAlign;
}) {
  useWarnWhenNumericCellMissesColumn(align);
  return (
    <div {...numericCellLayout(align)}>
      <div className="text-fg-black text-sm font-medium leading-5 tracking-fg">
        {value}
      </div>
      <ProgressBadge label={badge} color={badgeColor} />
    </div>
  );
}

export function CellKebabMenu({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <div className="h-10 flex justify-center items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        className="w-6 h-6 p-0.5 flex justify-center items-center cursor-pointer text-fg-grey-700"
      >
        <MenuDotsBold size={16} />
      </button>
    </div>
  );
}

const statusDotColors = {
  purple: { dot: "bg-fg-violet", ring: "border-fg-violet-200" },
  blue: { dot: "bg-fg-blue-500", ring: "border-fg-blue-200" },
  green: { dot: "bg-fg-green-500", ring: "border-fg-green-200" },
  red: { dot: "bg-fg-red", ring: "border-fg-red-200" },
  yellow: { dot: "bg-fg-yellow", ring: "border-fg-yellow-200" },
  cyan: { dot: "bg-fg-cyan-500", ring: "border-fg-cyan-200" },
  grey: { dot: "bg-fg-grey-300", ring: "border-fg-grey-200" },
  black: { dot: "bg-fg-black", ring: "border-fg-grey-400" },
} as const;

export type StatusDotColor = keyof typeof statusDotColors;

export function CellStatusDot({
  label,
  color = "grey",
  emphasis = "strong",
}: {
  label: string;
  color?: StatusDotColor;
  emphasis?: "strong" | "subtle";
}) {
  const c = statusDotColors[color];
  return (
    <div className="h-10 flex justify-center items-center gap-2">
      <div className={cn("w-5 h-5 rounded-full border-4", c.dot, c.ring)} />
      <div
        className={cn(
          "text-sm leading-5 tracking-fg line-clamp-1",
          emphasis === "strong"
            ? "text-fg-black font-medium"
            : "text-fg-grey-900 font-medium"
        )}
      >
        {label}
      </div>
    </div>
  );
}

export function CellNumber({
  value,
  trend,
  badge,
  badgeColor = "green",
  subdued = false,
  align = "right",
}: {
  value: string;
  trend?: "up" | "down";
  badge?: string;
  badgeColor?: ProgressBadgeColor;
  subdued?: boolean;
  /**
   * 表格数字默认右对齐（`--forge-table-align-number`）。
   * 左对齐必须显式传入 `align="left"`，并在列上填写 `alignOverrideReason`。
   */
  align?: TableColumnAlign;
}) {
  useWarnWhenNumericCellMissesColumn(align);
  return (
    <div {...numericCellLayout(align)}>
      <div
        className={cn(
          "text-sm leading-5 tracking-fg",
          subdued
            ? "text-fg-grey-900 font-medium"
            : "text-fg-black font-medium"
        )}
      >
        {value}
      </div>
      {trend === "up" && (
        <AltArrowUpLinear size={14} color="var(--fg-green-500)" />
      )}
      {trend === "down" && (
        <AltArrowDownLinear size={14} color="var(--fg-red)" />
      )}
      {badge && <ProgressBadge label={badge} color={badgeColor} />}
    </div>
  );
}

// Cell-level wrapper around <ProgressBar>: forwards label="$400" + showPercentage,
// pinned to size="sm" so the bar matches Figma cell row height (h-2).
export type ProgressBarColor = ProgressColor;

export function CellProgressBar({
  value,
  percent,
  color = "blue",
}: {
  value: string;
  percent: number;
  color?: ProgressBarColor;
}) {
  return (
    <div className="flex-1 h-10 flex items-center">
      <ProgressBar
        value={percent}
        color={color}
        size="sm"
        label={value}
        labelVariant="value"
        showPercentage
      />
    </div>
  );
}

export function CellCode({ code }: { code: string }) {
  return (
    <div className="h-10 flex justify-center items-center gap-2">
      <div className="text-fg-black text-sm font-medium leading-5 tracking-fg">
        {code}
      </div>
    </div>
  );
}

export function CellRating({
  score,
  color = "var(--fg-yellow)",
}: {
  score: string | number;
  color?: string;
}) {
  return (
    <div className="h-10 flex justify-start items-center gap-1">
      <div className="w-5 h-5 flex justify-center items-center">
        <StarBoldDuotone size={16} color={color} />
      </div>
      <div className="text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
        {score}
      </div>
    </div>
  );
}

export function CellFile({
  name,
  size,
  icon,
}: {
  name: string;
  size?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex-1 flex justify-start items-center gap-2">
      {icon ?? (
        <FileTypeIcon fileName={name} className="w-10 h-10 shrink-0" />
      )}
      <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
        <div className="self-stretch text-fg-black text-sm font-medium leading-5 tracking-fg line-clamp-1">
          {name}
        </div>
        {size && (
          <div className="self-stretch text-fg-grey-700 text-xs font-normal leading-4 tracking-fg line-clamp-1">
            {size}
          </div>
        )}
      </div>
    </div>
  );
}

export type CellActionKey =
  | "mail"
  | "phone"
  | "chat"
  | "eye"
  | "pen"
  | "trash";

const cellActionIcons: Record<CellActionKey, (size: number, color: string) => ReactNode> = {
  mail: (s, c) => <LetterLinear size={s} color={c} />,
  phone: (s, c) => <PhoneLinear size={s} color={c} />,
  chat: (s, c) => <ChatRoundLinear size={s} color={c} />,
  eye: (s, c) => <EyeLinear size={s} color={c} />,
  pen: (s, c) => <PenLinear size={s} color={c} />,
  trash: (s, c) => <TrashBinTrashLinear size={s} color={c} />,
};

export function CellActions({
  actions = [],
  showKebab = true,
  iconColor = "var(--fg-grey-700)",
  onAction,
  onKebab,
}: {
  actions?: CellActionKey[];
  showKebab?: boolean;
  iconColor?: string;
  onAction?: (key: CellActionKey) => void;
  onKebab?: () => void;
}) {
  return (
    <div className="h-10 flex justify-center items-center gap-2">
      {actions.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onAction?.(key)}
          className="w-6 h-6 rounded-md flex justify-center items-center cursor-pointer hover:bg-fg-grey-100"
        >
          {cellActionIcons[key](16, iconColor)}
        </button>
      ))}
      {showKebab && (
        <button
          type="button"
          onClick={onKebab}
          className="w-6 h-6 rounded-md flex justify-center items-center cursor-pointer hover:bg-fg-grey-100"
        >
          <MenuDotsBold size={16} color={iconColor} />
        </button>
      )}
    </div>
  );
}

// Inline link-styled action (button, not <a>) — Figma "Action / Link+" variant.

const cellLinkColors = {
  green: { text: "text-fg-green-500", cssVar: "var(--fg-green-500)" },
  red: { text: "text-fg-red", cssVar: "var(--fg-red)" },
  purple: { text: "text-fg-violet", cssVar: "var(--fg-violet)" },
  blue: { text: "text-fg-blue-500", cssVar: "var(--fg-blue-500)" },
  black: { text: "text-fg-black", cssVar: "var(--fg-black)" },
} as const;

export type CellLinkColor = keyof typeof cellLinkColors;

export function CellLink({
  label,
  color = "green",
  onClick,
}: {
  label: string;
  color?: CellLinkColor;
  onClick?: () => void;
}) {
  const c = cellLinkColors[color];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 cursor-pointer text-sm font-medium leading-5 tracking-fg",
        c.text
      )}
    >
      {label}
      <EyeLinear size={16} color={c.cssVar} />
    </button>
  );
}

export type DataTableColor = "purple" | "blue" | "black";

const headerActiveColors: Record<DataTableColor, string> = {
  purple: "bg-fg-violet",
  blue: "bg-fg-blue",
  black: "bg-fg-black",
};

export type DataTableProps<T> = {
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  columns: ColumnDef<T>[];
  rows: T[];
  headerActions?: ReactNode;
  color?: DataTableColor;
  showCheckbox?: boolean;
  checkboxColor?: CheckboxColor;
  /** Stable selected row identities. Pair with getRowKey for sort/filter-safe selection. */
  selectedRowKeys?: ReadonlySet<Key>;
  /** Receives a new Set after a stable-key selection change. The input Set is never mutated. */
  onSelectedRowKeysChange?: (keys: Set<Key>) => void;
  /** @deprecated Prefer selectedRowKeys for selection that survives sorting and filtering. */
  selectedRows?: Set<number>;
  onSelectRow?: (index: number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onSort?: (columnKey: string) => void;
  sortColumnKey?: string;
  sortDirection?: "asc" | "desc";
  getRowKey?: (row: T, index: number) => Key;
  emptyState?: ReactNode;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  paginationLabel?: string;
  /** Minimum width of the table content. Overflow stays inside the component. */
  tableMinWidth?: CSSProperties["minWidth"];
  /** Shows skeleton rows when empty, otherwise a spinner over the current rows. */
  loading?: boolean;
  /** Fixed body height (e.g. 480 or "60vh"); the header stays put while rows scroll. */
  maxHeight?: number | string;
  /** Extra content under a row, toggled by a chevron column. */
  expandable?: {
    render: (row: T, rowIndex: number) => ReactNode;
    rowExpandable?: (row: T) => boolean;
  };
  /** Nested rows (tree table); the first column gets the expand toggle and indentation. */
  getRowChildren?: (row: T) => T[] | undefined;
  /** Expanded rows for `expandable` and tree rows. Uncontrolled when omitted. */
  expandedRowKeys?: ReadonlySet<Key>;
  defaultExpandedRowKeys?: Iterable<Key>;
  onExpandedRowKeysChange?: (keys: Set<Key>) => void;
  /** Adds a column settings menu to the header. */
  columnSettings?: boolean;
  hiddenColumnKeys?: ReadonlySet<string>;
  onHiddenColumnKeysChange?: (keys: Set<string>) => void;
  /** Actions for the selected rows, shown in a bar above the table while something is selected. */
  bulkActions?: (selectedKeys: Set<Key>) => ReactNode;
  /** Render only the visible rows. Needs `maxHeight`; ignored with expandable or tree rows. */
  virtualized?: { rowHeight: number; overscan?: number };
  /** Rows per page selector in the footer. */
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  /** Adds a "go to page" field next to the pagination. */
  showQuickJumper?: boolean;
  className?: string;
};

function getPageNumbers(
  totalPages: number,
  currentPage: number
): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "...")[] = [1];
  if (currentPage > 3) pages.push("...");
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (currentPage < totalPages - 2) pages.push("...");
  pages.push(totalPages);
  return pages;
}

export function getPaginationSummary({
  currentPage,
  pageSize,
  rowCount,
  totalRows,
}: {
  currentPage: number;
  pageSize: number;
  rowCount: number;
  totalRows?: number;
}): string {
  if (rowCount <= 0) return totalRows === undefined ? "暂无数据" : `显示 0，共 ${totalRows} 条`;
  const start = (Math.max(1, currentPage) - 1) * pageSize + 1;
  const end = start + rowCount - 1;
  return totalRows === undefined ? `显示 ${start}-${end}` : `显示 ${start}-${end}，共 ${totalRows} 条`;
}

type TableGridProps<T> = Pick<
  DataTableProps<T>,
  | "columns"
  | "rows"
  | "showCheckbox"
  | "checkboxColor"
  | "selectedRowKeys"
  | "selectedRows"
  | "onSelectedRowKeysChange"
  | "onSelectRow"
  | "onSelectAll"
  | "onSort"
  | "sortColumnKey"
  | "sortDirection"
  | "getRowKey"
  | "emptyState"
  | "tableMinWidth"
  | "loading"
  | "maxHeight"
  | "expandable"
  | "getRowChildren"
  | "expandedRowKeys"
  | "defaultExpandedRowKeys"
  | "onExpandedRowKeysChange"
  | "hiddenColumnKeys"
  | "virtualized"
>;

type FlatRow<T> = { row: T; rowIndex: number; key: Key; depth: number; hasChildren: boolean };

const pinnedCellClass = "sticky z-[1] bg-background";

function EditableCell<T>({ row, edit, children }: { row: T; edit: TableCellEdit<T>; children: ReactNode }) {
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const cellRef = useRef<HTMLDivElement>(null);
  const start = () => { setDraft(String(edit.value(row))); setError(null); };
  const cancel = () => { setDraft(null); setError(null); requestAnimationFrame(() => cellRef.current?.focus()); };
  const save = async () => {
    if (draft === null || saving) return;
    if (draft === String(edit.value(row))) { cancel(); return; }
    const problem = edit.validate?.(draft, row);
    if (problem) { setError(problem); return; }
    try {
      setSaving(true);
      await edit.onSave(row, draft);
      setDraft(null);
      requestAnimationFrame(() => cellRef.current?.focus());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };
  if (draft !== null) {
    return (
      <div className="flex min-w-0 flex-col gap-1">
        <input
          autoFocus
          type={edit.type === "number" ? "number" : "text"}
          value={draft}
          disabled={saving}
          aria-invalid={error ? true : undefined}
          onChange={(event) => { setDraft(event.target.value); setError(null); }}
          onBlur={() => { void save(); }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === "Enter") { event.preventDefault(); void save(); }
            else if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); cancel(); }
          }}
          className={cn(
            "h-9 w-full min-w-24 rounded-lg bg-background px-2.5 text-sm tracking-fg text-fg-black outline outline-1 outline-offset-[-1px] focus:outline-2",
            error ? "outline-fg-red" : "outline-fg-grey-300 focus:outline-fg-blue",
            edit.type === "number" && "text-right tabular-nums",
          )}
        />
        {error && <span role="alert" className="text-xs leading-4 text-fg-red">{error}</span>}
      </div>
    );
  }
  return (
    <div
      ref={cellRef}
      role="button"
      tabIndex={0}
      aria-label="编辑"
      title="点击编辑"
      onClick={start}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === "F2") { event.preventDefault(); start(); } }}
      className="-mx-2 -my-1 cursor-text rounded-lg px-2 py-1 outline-none transition-colors hover:bg-fg-grey-100 focus-visible:outline-2 focus-visible:outline-fg-blue"
    >
      {children}
    </div>
  );
}

function TableGrid<T>({
  columns: allColumns,
  rows,
  showCheckbox = false,
  checkboxColor = "black",
  selectedRowKeys,
  selectedRows,
  onSelectedRowKeysChange,
  onSelectRow,
  onSelectAll,
  onSort,
  sortColumnKey,
  sortDirection,
  getRowKey,
  emptyState = "暂无数据",
  tableMinWidth,
  loading = false,
  maxHeight,
  expandable,
  getRowChildren,
  expandedRowKeys,
  defaultExpandedRowKeys,
  onExpandedRowKeysChange,
  hiddenColumnKeys,
  virtualized,
}: TableGridProps<T>) {
  const columns = hiddenColumnKeys?.size ? allColumns.filter((column) => !hiddenColumnKeys.has(column.key)) : allColumns;
  const [ownExpanded, setOwnExpanded] = useState<Set<Key>>(() => new Set(defaultExpandedRowKeys ?? []));
  const expanded = expandedRowKeys ?? ownExpanded;
  const toggleExpanded = (key: Key) => {
    const next = new Set(expanded);
    if (next.has(key)) next.delete(key); else next.add(key);
    if (expandedRowKeys === undefined) setOwnExpanded(next);
    onExpandedRowKeysChange?.(next);
  };
  const [widths, setWidths] = useState<Record<string, number>>({});
  const tableRef = useRef<HTMLTableElement>(null);
  const headerCell = (key: string) => [...(tableRef.current?.querySelectorAll<HTMLTableCellElement>("thead th[data-col-key]") ?? [])].find((cell) => cell.dataset.colKey === key);
  const [pinOffsets, setPinOffsets] = useState<Record<string, number>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewport, setViewport] = useState(0);

  const getKey = (row: T, rowIndex: number) => getRowKey?.(row, rowIndex) ?? rowIndex;
  const flat: FlatRow<T>[] = [];
  const walk = (list: T[], depth: number, path: string) => {
    list.forEach((row, index) => {
      const rowIndex = depth === 0 ? index : flat.length;
      const key = depth === 0 ? getKey(row, index) : getRowKey?.(row, rowIndex) ?? `${path}.${index}`;
      const children = getRowChildren?.(row);
      flat.push({ row, rowIndex: depth === 0 ? index : rowIndex, key, depth, hasChildren: Boolean(children?.length) });
      if (children?.length && expanded.has(key)) walk(children, depth + 1, String(key));
    });
  };
  walk(rows, 0, "");

  const isKeySelected = (item: FlatRow<T>) => selectedRowKeys?.has(item.key) ?? (item.depth === 0 && selectedRows?.has(item.rowIndex)) ?? false;
  const allSelected = flat.length > 0 && flat.every(isKeySelected);
  const someSelected = !allSelected && flat.some(isKeySelected);
  const updateKeySelection = (checked: boolean, items: FlatRow<T>[]) => {
    if (selectedRowKeys == null) return;
    const next = new Set(selectedRowKeys);
    for (const item of items) { if (checked) next.add(item.key); else next.delete(item.key); }
    onSelectedRowKeysChange?.(next);
  };

  const hasExpandColumn = Boolean(expandable) && !getRowChildren;
  const leadingCells = (showCheckbox ? 1 : 0) + (hasExpandColumn ? 1 : 0);
  const anyLeftPin = columns.some((column) => column.pinned === "left");

  // Sticky offsets depend on real cell widths, so measure after layout and when widths change.
  useLayoutEffect(() => {
    const next: Record<string, number> = {};
    let left = 0;
    for (const key of ["__select", "__expand", ...columns.filter((column) => column.pinned === "left").map((column) => column.key)]) {
      const cell = headerCell(key);
      if (!cell) continue;
      next[key] = left;
      left += cell.offsetWidth;
    }
    let right = 0;
    for (const column of [...columns].reverse().filter((item) => item.pinned === "right")) {
      const cell = headerCell(column.key);
      if (!cell) continue;
      next[`right:${column.key}`] = right;
      right += cell.offsetWidth;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- offsets come from measured layout
    setPinOffsets((current) => JSON.stringify(current) === JSON.stringify(next) ? current : next);
  }, [columns, widths, showCheckbox, hasExpandColumn, rows.length]);

  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element || !virtualized) return;
    const update = () => setViewport(element.clientHeight);
    update();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(element);
    return () => observer?.disconnect();
  }, [virtualized]);

  const virtual = virtualized && maxHeight !== undefined && !expandable && !getRowChildren;
  const overscan = virtualized?.overscan ?? 6;
  const startIndex = virtual ? Math.max(0, Math.floor(scrollTop / virtualized!.rowHeight) - overscan) : 0;
  const endIndex = virtual ? Math.min(flat.length, Math.ceil((scrollTop + (viewport || 600)) / virtualized!.rowHeight) + overscan) : flat.length;
  const visible = flat.slice(startIndex, endIndex);

  const pinStyle = (key: string, pinned?: "left" | "right"): CSSProperties | undefined => {
    if (pinned === "left" || ((key === "__select" || key === "__expand") && anyLeftPin)) return { position: "sticky", left: pinOffsets[key] ?? 0 };
    if (pinned === "right") return { position: "sticky", right: pinOffsets[`right:${key}`] ?? 0 };
    return undefined;
  };
  const pinClass = (key: string, pinned?: "left" | "right") => {
    const isPinned = pinned || ((key === "__select" || key === "__expand") && anyLeftPin);
    if (!isPinned) return undefined;
    const lastLeft = pinned === "left" && columns.filter((column) => column.pinned === "left").at(-1)?.key === key;
    const firstRight = pinned === "right" && columns.find((column) => column.pinned === "right")?.key === key;
    return cn(pinnedCellClass, lastLeft && "forge-table-pin-left", firstRight && "forge-table-pin-right");
  };

  const columnWidthStyle = (column: ColumnDef<T>): CSSProperties | undefined => {
    const width = widths[column.key];
    return width ? { width, minWidth: width, maxWidth: width } : undefined;
  };

  const startResize = (event: ReactPointerEvent<HTMLSpanElement>, column: ColumnDef<T>) => {
    event.preventDefault();
    const cell = headerCell(column.key);
    if (!cell) return;
    const startX = event.clientX;
    const startWidth = cell.offsetWidth;
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    const move = (moveEvent: PointerEvent) => setWidths((current) => ({ ...current, [column.key]: Math.max(64, Math.round(startWidth + moveEvent.clientX - startX)) }));
    const end = () => { handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", end); handle.removeEventListener("pointercancel", end); };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  };

  const colSpan = columns.length + leadingCells;

  return (
    <div className="relative self-stretch" aria-busy={loading || undefined}>
      <div
        ref={scrollRef}
        data-forge-table-scroll
        className={cn("self-stretch overflow-x-auto", maxHeight !== undefined && "overflow-y-auto")}
        style={maxHeight !== undefined ? { maxHeight } : undefined}
        onScroll={virtual ? (event) => setScrollTop(event.currentTarget.scrollTop) : undefined}
      >
        <table
          ref={tableRef}
          data-forge-table-content
          className="w-full border-collapse"
          style={{
            minWidth: tableMinWidth ?? getDefaultTableMinWidth(columns, showCheckbox) + (hasExpandColumn ? 48 : 0),
          }}
        >
          <thead className={cn(maxHeight !== undefined && "sticky top-0 z-[2]")}>
            <tr className="border-t border-b border-fg-grey-200">
              {showCheckbox && (
                <th data-col-key="__select" className={cn("w-14 px-6 py-4 bg-background text-left", pinClass("__select"))} style={pinStyle("__select")}>
                  <Checkbox
                    aria-label="选择全部行"
                    checked={allSelected}
                    indeterminate={someSelected}
                    color={checkboxColor}
                    onChange={(checked) => {
                      updateKeySelection(checked, flat);
                      if (selectedRowKeys == null) onSelectAll?.(checked);
                    }}
                  />
                </th>
              )}
              {hasExpandColumn && <th data-col-key="__expand" aria-label="展开" className={cn("w-12 bg-background", pinClass("__expand"))} style={pinStyle("__expand")} />}
              {columns.map((col, colIndex) => {
                const align = resolveTableColumnAlign(col);
                const sortButton = col.sortable ? (
                  <button
                    type="button"
                    aria-label={`按${typeof col.header === "string" ? col.header : col.key}排序`}
                    onClick={() => onSort?.(col.key)}
                    className={cn(
                      "w-4 h-4 flex items-center justify-center cursor-pointer text-fg-grey-500",
                      sortColumnKey === col.key && sortDirection === "asc" && "rotate-180",
                    )}
                  >
                    <AltArrowDownLinear size={10} />
                  </button>
                ) : null;
                return (
                  <th
                    key={col.key}
                    data-col-key={col.key}
                    data-forge-table-identity={isTableIdentityColumn(col, colIndex) ? "" : undefined}
                    data-pinned={col.pinned}
                    {...columnAlignDataAttrs(col)}
                    aria-sort={
                      col.sortable && sortColumnKey === col.key
                        ? sortDirection === "asc"
                          ? "ascending"
                          : sortDirection === "desc"
                            ? "descending"
                            : "none"
                        : undefined
                    }
                    className={cn(tableColumnClass(col, colIndex, "header"), "relative", pinClass(col.key, col.pinned))}
                    style={{ ...tableColumnStyle(col, colIndex), ...columnWidthStyle(col), ...pinStyle(col.key, col.pinned) }}
                  >
                    <div
                      className={cn(
                        "flex w-full min-w-0 items-center gap-2",
                        align === "right" ? "justify-end" : "justify-start",
                      )}
                    >
                      {align === "right" ? sortButton : null}
                      <span className="min-w-0">{col.header}</span>
                      {align === "right" ? null : sortButton}
                    </div>
                    {col.resizable && (
                      <span
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`调整${typeof col.header === "string" ? col.header : col.key}列宽`}
                        tabIndex={0}
                        onPointerDown={(event) => startResize(event, col)}
                        onDoubleClick={() => setWidths((current) => { const next = { ...current }; delete next[col.key]; return next; })}
                        onKeyDown={(event) => {
                          const delta = event.key === "ArrowRight" ? 16 : event.key === "ArrowLeft" ? -16 : 0;
                          if (!delta) return;
                          event.preventDefault();
                          const current = widths[col.key] ?? headerCell(col.key)?.offsetWidth ?? 128;
                          setWidths((all) => ({ ...all, [col.key]: Math.max(64, current + delta) }));
                        }}
                        className="absolute right-0 top-2 bottom-2 w-2 cursor-col-resize touch-none border-r-2 border-transparent outline-none hover:border-fg-blue-300 focus-visible:border-fg-blue"
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {virtual && startIndex > 0 && <tr aria-hidden style={{ height: startIndex * virtualized!.rowHeight }} />}
            {visible.map((item) => {
              const { row, rowIndex, key, depth } = item;
              const canExpand = hasExpandColumn && (expandable!.rowExpandable?.(row) ?? true);
              const isExpanded = expanded.has(key);
              const selected = isKeySelected(item);
              return (
                <Fragment key={key}>
                  <tr
                    data-selected={selected || undefined}
                    data-depth={depth || undefined}
                    className="border-b border-fg-grey-200 bg-background"
                    style={virtual ? { height: virtualized!.rowHeight } : undefined}
                  >
                    {showCheckbox && (
                      <td className={cn("w-14 px-6 py-4", pinClass("__select"))} style={pinStyle("__select")}>
                        <Checkbox
                          aria-label={`选择第 ${rowIndex + 1} 行`}
                          checked={selected}
                          color={checkboxColor}
                          onChange={(checked) => {
                            updateKeySelection(checked, [item]);
                            if (selectedRowKeys == null) onSelectRow?.(rowIndex, checked);
                          }}
                        />
                      </td>
                    )}
                    {hasExpandColumn && (
                      <td className={cn("w-12 px-3", pinClass("__expand"))} style={pinStyle("__expand")}>
                        {canExpand && (
                          <button type="button" aria-expanded={isExpanded} aria-label={isExpanded ? "收起详情" : "展开详情"} onClick={() => toggleExpanded(key)}
                            className="flex size-7 items-center justify-center rounded-lg text-fg-grey-700 hover:bg-fg-grey-100 cursor-pointer">
                            <AltArrowRightLinear size={14} className={cn("transition-transform", isExpanded && "rotate-90")} />
                          </button>
                        )}
                      </td>
                    )}
                    {columns.map((col, colIndex) => {
                      const content = col.edit ? <EditableCell row={row} edit={col.edit}>{col.render(row, rowIndex)}</EditableCell> : col.render(row, rowIndex);
                      const treeCell = getRowChildren && colIndex === 0;
                      return (
                        <td
                          key={col.key}
                          data-forge-table-identity={isTableIdentityColumn(col, colIndex) ? "" : undefined}
                          data-pinned={col.pinned}
                          {...columnAlignDataAttrs(col)}
                          className={cn(tableColumnClass(col, colIndex, "body"), pinClass(col.key, col.pinned))}
                          style={{ ...tableColumnStyle(col, colIndex), ...columnWidthStyle(col), ...pinStyle(col.key, col.pinned) }}
                        >
                          <TableColumnAlignContext.Provider
                            value={{ align: resolveTableColumnAlign(col), columnKey: col.key }}
                          >
                            {treeCell ? (
                              <div className="flex min-w-0 items-center gap-1" style={{ paddingLeft: depth * 20 }}>
                                {item.hasChildren ? (
                                  <button type="button" aria-expanded={isExpanded} aria-label={isExpanded ? "收起子行" : "展开子行"} onClick={() => toggleExpanded(key)}
                                    className="-ml-1 flex size-6 shrink-0 items-center justify-center rounded-md text-fg-grey-700 hover:bg-fg-grey-100 cursor-pointer">
                                    <AltArrowRightLinear size={14} className={cn("transition-transform", isExpanded && "rotate-90")} />
                                  </button>
                                ) : <span aria-hidden className="w-6 shrink-0" />}
                                <div className="min-w-0 flex-1">{content}</div>
                              </div>
                            ) : content}
                          </TableColumnAlignContext.Provider>
                        </td>
                      );
                    })}
                  </tr>
                  {hasExpandColumn && canExpand && isExpanded && (
                    <tr data-forge-table-expanded className="border-b border-fg-grey-200 bg-fg-grey-50">
                      <td colSpan={colSpan} className="px-6 py-4">{expandable!.render(row, rowIndex)}</td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {virtual && endIndex < flat.length && <tr aria-hidden style={{ height: (flat.length - endIndex) * virtualized!.rowHeight }} />}
            {rows.length === 0 && loading && Array.from({ length: 5 }, (_, index) => (
              <tr key={`skeleton-${index}`} aria-hidden className="border-b border-fg-grey-200 bg-background">
                {Array.from({ length: colSpan }, (_, cell) => (
                  <td key={cell} className="px-5 py-4"><span className="forge-skeleton block h-4 rounded-md bg-fg-grey-100" style={{ width: cell === 0 && showCheckbox ? 20 : `${60 + ((index * 7 + cell * 13) % 35)}%` }} /></td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr className="border-b border-fg-grey-200 bg-background">
                <td
                  colSpan={colSpan}
                  className="px-5 py-10 text-center text-sm text-fg-grey-700"
                >
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {loading && rows.length > 0 && (
        <div className="absolute inset-0 z-[3] flex items-center justify-center bg-background/60">
          <span role="status" className="inline-flex items-center gap-2 text-sm text-fg-grey-700">
            <span aria-hidden className="forge-spinner inline-block size-6 rounded-full border-[2.5px] border-fg-grey-200 border-t-accent" />
            加载中
          </span>
        </div>
      )}
    </div>
  );
}

function PaginationControls({
  color,
  currentPage,
  totalPages,
  onPageChange,
}: {
  color: DataTableColor;
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}) {
  return (
    <div className="flex justify-start items-start gap-2">
      <button
        type="button"
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <AltArrowLeftLinear size={20} color="var(--fg-grey-500)" />
      </button>
      {getPageNumbers(totalPages, currentPage).map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="w-10 h-10 p-2 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden"
          >
            <span className="flex-1 text-center text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
              ...
            </span>
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange?.(page)}
            className={cn(
              "w-10 h-10 p-2 rounded-full flex justify-center items-center gap-1 overflow-hidden cursor-pointer",
              page === currentPage
                ? cn(headerActiveColors[color], "text-white")
                : "outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-fg-grey-700",
            )}
          >
            <span className="flex-1 text-center text-sm font-medium leading-5 tracking-fg">
              {page}
            </span>
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <AltArrowRightLinear size={20} color="var(--fg-grey-500)" />
      </button>
    </div>
  );
}

function ColumnSettingsButton<T>({ columns, hidden, onChange }: { columns: ColumnDef<T>[]; hidden: ReadonlySet<string>; onChange: (keys: Set<string>) => void }) {
  const hideable = columns.filter((column) => column.hideable !== false);
  const visibleCount = columns.filter((column) => !hidden.has(column.key)).length;
  return (
    <DropdownMenu
      align="end"
      trigger={<button type="button" aria-label="列设置" title="列设置" className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-fg-grey-700 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 hover:bg-fg-grey-100"><ListCheckLinear size={18} /></button>}
      items={[{ type: "group", label: "显示的列", items: hideable.map((column) => ({
        type: "checkbox" as const,
        label: typeof column.header === "string" && column.header ? column.header : column.key,
        checked: !hidden.has(column.key),
        // Keep at least one column on screen.
        disabled: !hidden.has(column.key) && visibleCount <= 1,
        onCheckedChange: (checked: boolean) => {
          const next = new Set(hidden);
          if (checked) next.delete(column.key); else next.add(column.key);
          onChange(next);
        },
      })) }]}
    />
  );
}

function useHiddenColumns(hiddenColumnKeys: ReadonlySet<string> | undefined, onChange: ((keys: Set<string>) => void) | undefined) {
  const [own, setOwn] = useState<Set<string>>(() => new Set());
  const hidden = hiddenColumnKeys ?? own;
  const set = (next: Set<string>) => { if (hiddenColumnKeys === undefined) setOwn(next); onChange?.(next); };
  return [hidden, set] as const;
}

function BulkActionBar({ count, onClear, children }: { count: number; onClear: () => void; children: ReactNode }) {
  return (
    <div role="region" aria-label="批量操作" className="self-stretch flex flex-wrap items-center gap-3 border-t border-fg-grey-200 bg-fg-blue-50 px-5 py-2.5">
      <span className="text-sm font-medium tracking-fg text-fg-black">已选择 {count} 项</span>
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
      <button type="button" onClick={onClear} className="text-sm font-medium tracking-fg text-fg-blue cursor-pointer hover:underline">取消选择</button>
    </div>
  );
}

function PageSizeAndJumper({ pageSize, pageSizeOptions, onPageSizeChange, showQuickJumper, totalPages, onPageChange }: {
  pageSize?: number; pageSizeOptions?: number[]; onPageSizeChange?: (size: number) => void;
  showQuickJumper?: boolean; totalPages: number; onPageChange?: (page: number) => void;
}) {
  const [jump, setJump] = useState("");
  if (!(pageSizeOptions?.length && onPageSizeChange) && !showQuickJumper) return null;
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm tracking-fg text-fg-grey-700">
      {pageSizeOptions?.length && onPageSizeChange ? (
        <span className="inline-flex items-center gap-2">
          每页
          <ToolbarSelectDropdown
            value={String(pageSize ?? pageSizeOptions[0])}
            options={pageSizeOptions.map((size) => ({ label: `${size} 条`, value: String(size) }))}
            onChange={(value) => onPageSizeChange(Number(value))}
          />
        </span>
      ) : null}
      {showQuickJumper && (
        <label className="inline-flex items-center gap-2">
          跳至
          <input
            inputMode="numeric"
            aria-label="跳转到页码"
            value={jump}
            onChange={(event) => setJump(event.target.value.replace(/\D/g, ""))}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || !jump) return;
              const page = Math.min(Math.max(1, Number(jump)), Math.max(1, totalPages));
              onPageChange?.(page);
              setJump("");
            }}
            className="h-10 w-16 rounded-full bg-background px-3 text-center text-sm text-fg-black outline outline-1 outline-offset-[-1px] outline-fg-grey-200 focus:outline-2 focus:outline-fg-blue"
          />
          页
        </label>
      )}
    </div>
  );
}

export function DataTable<T>({
  title,
  subtitle,
  badge,
  columns,
  rows,
  headerActions,
  color = "black",
  showCheckbox = false,
  checkboxColor = "black",
  selectedRowKeys,
  onSelectedRowKeysChange,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onSort,
  sortColumnKey,
  sortDirection,
  getRowKey,
  emptyState = "暂无数据",
  footerLeft,
  footerRight,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  paginationLabel,
  tableMinWidth,
  loading,
  maxHeight,
  expandable,
  getRowChildren,
  expandedRowKeys,
  defaultExpandedRowKeys,
  onExpandedRowKeysChange,
  columnSettings = false,
  hiddenColumnKeys,
  onHiddenColumnKeysChange,
  bulkActions,
  virtualized,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  showQuickJumper = false,
  className,
}: DataTableProps<T>) {
  const [hidden, setHidden] = useHiddenColumns(hiddenColumnKeys, onHiddenColumnKeysChange);
  return (
    <div
      data-forge-data-table
      className={cn(
        "w-full rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex flex-col justify-start items-start overflow-hidden",
        className
      )}
    >
      {/* Header */}
      {(title || headerActions || columnSettings) && (
        <div className="self-stretch p-5 bg-background flex justify-start items-center gap-3">
          {(title || subtitle || badge) && (
            <div className="flex-1 flex justify-start items-center gap-4">
              <div className="inline-flex flex-col justify-center items-start gap-2">
                {title && (
                  <div className="justify-start text-fg-black text-sm font-medium leading-5 tracking-fg">
                    {title}
                  </div>
                )}
                {subtitle && (
                  <div className="justify-start text-fg-grey-700 text-xs font-medium leading-4.5 tracking-fg">
                    {subtitle}
                  </div>
                )}
              </div>
              {badge}
            </div>
          )}
          {headerActions}
          {columnSettings && <ColumnSettingsButton columns={columns} hidden={hidden} onChange={setHidden} />}
        </div>
      )}

      {bulkActions && selectedRowKeys && selectedRowKeys.size > 0 && (
        <BulkActionBar count={selectedRowKeys.size} onClear={() => onSelectedRowKeysChange?.(new Set())}>{bulkActions(new Set(selectedRowKeys))}</BulkActionBar>
      )}

      <TableGrid
        columns={columns}
        rows={rows}
        showCheckbox={showCheckbox}
        checkboxColor={checkboxColor}
        selectedRowKeys={selectedRowKeys}
        selectedRows={selectedRows}
        onSelectedRowKeysChange={onSelectedRowKeysChange}
        onSelectRow={onSelectRow}
        onSelectAll={onSelectAll}
        onSort={onSort}
        sortColumnKey={sortColumnKey}
        sortDirection={sortDirection}
        getRowKey={getRowKey}
        emptyState={emptyState}
        tableMinWidth={tableMinWidth}
        loading={loading}
        maxHeight={maxHeight}
        expandable={expandable}
        getRowChildren={getRowChildren}
        expandedRowKeys={expandedRowKeys}
        defaultExpandedRowKeys={defaultExpandedRowKeys}
        onExpandedRowKeysChange={onExpandedRowKeysChange}
        hiddenColumnKeys={hidden}
        virtualized={virtualized}
      />

      {/* Footer */}
      {(showPagination || footerLeft || footerRight) && (
        <div className="self-stretch p-5 bg-background flex flex-wrap justify-start items-center gap-3">
          {paginationLabel ? (
            <div className="flex-1 justify-start text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
              {paginationLabel}
            </div>
          ) : (
            footerLeft && <div className="flex-1">{footerLeft}</div>
          )}
          {showPagination && <PageSizeAndJumper pageSize={pageSize} pageSizeOptions={pageSizeOptions} onPageSizeChange={onPageSizeChange} showQuickJumper={showQuickJumper} totalPages={totalPages} onPageChange={onPageChange} />}
          {showPagination && (
            <PaginationControls
              color={color}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
          {footerRight && !showPagination && (
            <div>{footerRight}</div>
          )}
        </div>
      )}
    </div>
  );
}

// FullWidthTable: same row/cell shape as DataTable, but adds the "Show N" rows-per-page
// selector and defaults showCheckbox to true — used for full-screen data management pages.

export type FullWidthTableProps<T> = DataTableProps<T> & {
  showRowCount?: boolean;
  rowCountOptions?: number[];
  currentRowCount?: number;
  onRowCountChange?: (count: number) => void;
  /** Exact total record count. Omit it when the data source does not provide one. */
  totalRows?: number;
};

export function FullWidthTable<T>({
  title,
  subtitle,
  badge,
  columns,
  rows,
  headerActions,
  color = "black",
  showCheckbox = true,
  checkboxColor = "black",
  selectedRowKeys,
  onSelectedRowKeysChange,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onSort,
  sortColumnKey,
  sortDirection,
  getRowKey,
  emptyState = "暂无数据",
  footerLeft,
  footerRight,
  showPagination = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  paginationLabel,
  tableMinWidth,
  showRowCount = false,
  rowCountOptions = [10, 25, 50],
  currentRowCount = 10,
  onRowCountChange,
  totalRows,
  loading,
  maxHeight,
  expandable,
  getRowChildren,
  expandedRowKeys,
  defaultExpandedRowKeys,
  onExpandedRowKeysChange,
  columnSettings = false,
  hiddenColumnKeys,
  onHiddenColumnKeysChange,
  bulkActions,
  virtualized,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  showQuickJumper = false,
  className,
}: FullWidthTableProps<T>) {
  const [hidden, setHidden] = useHiddenColumns(hiddenColumnKeys, onHiddenColumnKeysChange);
  return (
    <div
      data-forge-full-width-table
      className={cn(
        "w-full rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex flex-col justify-start items-start overflow-hidden",
        className
      )}
    >
      {/* Header */}
      {(title || headerActions || columnSettings) && (
        <div className="self-stretch p-5 bg-background flex justify-start items-center gap-4">
          <div className="flex-1 flex justify-start items-center gap-4">
            <div className="inline-flex flex-col justify-center items-start gap-2">
              {title && (
                <div className="justify-start text-fg-black text-sm font-medium leading-5 tracking-fg">
                  {title}
                </div>
              )}
              {subtitle && (
                <div className="justify-start text-fg-grey-700 text-xs font-medium leading-4.5 tracking-fg">
                  {subtitle}
                </div>
              )}
            </div>
            {badge}
          </div>
          {headerActions}
          {showRowCount && (
            <div className="flex justify-start items-center gap-2">
              <span className="justify-start text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
                显示
              </span>
              <select
                value={currentRowCount}
                onChange={(e) => onRowCountChange?.(Number(e.target.value))}
                className="w-20 px-4 py-3 bg-background rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-center text-fg-black text-sm font-normal leading-5 tracking-fg cursor-pointer"
              >
                {rowCountOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}
          {columnSettings && <ColumnSettingsButton columns={columns} hidden={hidden} onChange={setHidden} />}
        </div>
      )}

      {bulkActions && selectedRowKeys && selectedRowKeys.size > 0 && (
        <BulkActionBar count={selectedRowKeys.size} onClear={() => onSelectedRowKeysChange?.(new Set())}>{bulkActions(new Set(selectedRowKeys))}</BulkActionBar>
      )}

      <TableGrid
        columns={columns}
        rows={rows}
        showCheckbox={showCheckbox}
        checkboxColor={checkboxColor}
        selectedRowKeys={selectedRowKeys}
        selectedRows={selectedRows}
        onSelectedRowKeysChange={onSelectedRowKeysChange}
        onSelectRow={onSelectRow}
        onSelectAll={onSelectAll}
        onSort={onSort}
        sortColumnKey={sortColumnKey}
        sortDirection={sortDirection}
        getRowKey={getRowKey}
        emptyState={emptyState}
        tableMinWidth={tableMinWidth}
        loading={loading}
        maxHeight={maxHeight}
        expandable={expandable}
        getRowChildren={getRowChildren}
        expandedRowKeys={expandedRowKeys}
        defaultExpandedRowKeys={defaultExpandedRowKeys}
        onExpandedRowKeysChange={onExpandedRowKeysChange}
        hiddenColumnKeys={hidden}
        virtualized={virtualized}
      />

      {/* Footer */}
      <div className="self-stretch p-5 bg-background flex justify-start items-center gap-3">
        {paginationLabel ? (
          <div className="flex-1 justify-start text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
            {paginationLabel}
          </div>
        ) : footerLeft ? (
          <div className="flex-1">{footerLeft}</div>
        ) : (
          <div className="flex-1 justify-start text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
            {getPaginationSummary({ currentPage, pageSize: currentRowCount, rowCount: rows.length, totalRows })}
          </div>
        )}
        {showPagination && <PageSizeAndJumper pageSize={pageSize} pageSizeOptions={pageSizeOptions} onPageSizeChange={onPageSizeChange} showQuickJumper={showQuickJumper} totalPages={totalPages} onPageChange={onPageChange} />}
        {showPagination && (
          <PaginationControls
            color={color}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
        {footerRight && !showPagination && <div>{footerRight}</div>}
      </div>
    </div>
  );
}
