"use client";

import { type ReactNode } from "react";
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
  ArrowRightUpLinear,
} from "solar-icon-set";
import { Checkbox, type CheckboxColor } from "./checkbox";
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
  checkboxColor = "purple",
  leadIcon,
}: TableCellProps) {
  const isHeader = variant === "header";

  return (
    <div
      className={cn(
        "self-stretch px-6 py-4 bg-white border-b border-fg-grey-200 flex justify-start items-center gap-2",
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
          <div className="flex-1 flex items-center gap-1 text-fg-grey-700 text-sm font-semibold leading-5 tracking-fg">
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

export type ColumnDef<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  flex?: boolean;
  render: (row: T, rowIndex: number) => ReactNode;
};

const statusBadgeColors = {
  purple: "bg-fg-violet",
  blue: "bg-fg-blue-500",
  yellow: "bg-fg-yellow",
  cyan: "bg-fg-cyan-500",
  green: "bg-fg-green-500",
  red: "bg-fg-red",
  grey: "bg-fg-grey-500",
} as const;

export type StatusBadgeColor = keyof typeof statusBadgeColors;

export function StatusBadge({
  label,
  color = "green",
}: {
  label: string;
  color?: StatusBadgeColor;
}) {
  return (
    <div className="h-10 flex justify-center items-center gap-2">
      <div
        className={cn(
          "px-2 py-1 rounded-full inline-flex flex-col justify-center items-center gap-2",
          statusBadgeColors[color]
        )}
      >
        <span className="text-center justify-center text-white text-xs font-semibold leading-4.5 tracking-fg">
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
          "text-center justify-center text-xs font-semibold leading-4.5 tracking-fg",
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
        <div className="self-stretch justify-start text-fg-black text-sm font-semibold leading-5 tracking-fg line-clamp-1">
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
        <div className="self-stretch justify-start text-fg-black text-sm font-semibold leading-5 tracking-fg line-clamp-1">
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
        <div className="self-stretch justify-start text-fg-grey-900 text-sm font-medium leading-5 tracking-fg line-clamp-1">
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
        <div className="self-stretch justify-start text-fg-black text-sm font-semibold leading-5 tracking-fg line-clamp-1">
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
}: {
  value: string;
  badge: string;
  badgeColor?: ProgressBadgeColor;
}) {
  return (
    <div className="h-10 flex justify-center items-center gap-1">
      <div className="justify-start text-fg-black text-sm font-semibold leading-5 tracking-fg">
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
  color = "purple",
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
            ? "text-fg-black font-semibold"
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
}: {
  value: string;
  trend?: "up" | "down";
  badge?: string;
  badgeColor?: ProgressBadgeColor;
  subdued?: boolean;
}) {
  return (
    <div className="h-10 flex justify-center items-center gap-1">
      <div
        className={cn(
          "text-sm leading-5 tracking-fg",
          subdued
            ? "text-fg-grey-900 font-medium"
            : "text-fg-black font-semibold"
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
  color = "purple",
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
      <div className="text-fg-black text-sm font-semibold leading-5 tracking-fg">
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
        "flex items-center gap-1 cursor-pointer text-sm font-bold leading-5 tracking-fg",
        c.text
      )}
    >
      {label}
      <ArrowRightUpLinear size={16} color={c.cssVar} />
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
  selectedRows?: Set<number>;
  onSelectRow?: (index: number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onSort?: (columnKey: string) => void;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  paginationLabel?: string;
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

export function DataTable<T>({
  title,
  subtitle,
  badge,
  columns,
  rows,
  headerActions,
  color = "purple",
  showCheckbox = false,
  checkboxColor = "purple",
  selectedRows,
  onSelectRow,
  onSelectAll,
  onSort,
  footerLeft,
  footerRight,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  paginationLabel,
  className,
}: DataTableProps<T>) {
  const allSelected =
    selectedRows != null && rows.length > 0 && selectedRows.size === rows.length;

  return (
    <div
      className={cn(
        "w-full rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex flex-col justify-start items-start overflow-hidden",
        className
      )}
    >
      {/* Header */}
      {(title || headerActions) && (
        <div className="self-stretch p-5 bg-white flex justify-start items-center gap-3">
          {(title || subtitle || badge) && (
            <div className="flex-1 flex justify-start items-center gap-4">
              <div className="inline-flex flex-col justify-center items-start gap-2">
                {title && (
                  <div className="justify-start text-fg-black text-sm font-semibold leading-5 tracking-fg">
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
        </div>
      )}

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-t border-b border-fg-grey-200">
            {showCheckbox && (
              <th className="w-14 px-4 py-4 bg-white text-left">
                <Checkbox checked={allSelected} color={checkboxColor} onChange={onSelectAll} />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-5 py-3.5 bg-white text-left text-fg-grey-700 text-sm font-semibold leading-5 tracking-fg whitespace-nowrap",
                  col.width
                )}
                style={col.flex ? { width: "auto" } : undefined}
              >
                <div className="flex items-center gap-2">
                  {col.header}
                  {col.sortable && (
                    <button type="button" onClick={() => onSort?.(col.key)} className="w-4 h-4 flex items-center justify-center cursor-pointer text-fg-grey-500">
                      <AltArrowDownLinear size={10} />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-fg-grey-200 bg-white">
              {showCheckbox && (
                <td className="w-14 px-6 py-4">
                  <Checkbox
                    checked={selectedRows?.has(rowIndex) ?? false}
                    color={checkboxColor}
                    onChange={(c) => onSelectRow?.(rowIndex, c)}
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} className={cn("px-5 py-3.5", col.width)} style={col.flex ? { width: "auto" } : undefined}>
                  {col.render(row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      {(showPagination || footerLeft || footerRight) && (
        <div className="self-stretch p-6 bg-white flex justify-start items-center gap-3">
          {paginationLabel ? (
            <div className="flex-1 justify-start text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
              {paginationLabel}
            </div>
          ) : (
            footerLeft && <div className="flex-1">{footerLeft}</div>
          )}
          {showPagination && (
            <div className="flex justify-start items-start gap-2">
              <button
                type="button"
                onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <AltArrowLeftLinear size={20} color="var(--fg-grey-500)" />
              </button>
              {getPageNumbers(totalPages, currentPage).map((page, i) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-10 h-10 p-2 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden"
                  >
                    <span className="flex-1 text-center text-fg-grey-700 text-sm font-semibold leading-5 tracking-fg">
                      ...
                    </span>
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => onPageChange?.(page as number)}
                    className={cn(
                      "w-10 h-10 p-2 rounded-full flex justify-center items-center gap-1 overflow-hidden cursor-pointer",
                      page === currentPage
                        ? cn(headerActiveColors[color], "text-white")
                        : "outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-fg-grey-700"
                    )}
                  >
                    <span className="flex-1 text-center text-sm font-semibold leading-5 tracking-fg">
                      {page}
                    </span>
                  </button>
                )
              )}
              <button
                type="button"
                onClick={() =>
                  onPageChange?.(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage >= totalPages}
                className="p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <AltArrowRightLinear size={20} color="var(--fg-grey-500)" />
              </button>
            </div>
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
};

export function FullWidthTable<T>({
  title,
  subtitle,
  badge,
  columns,
  rows,
  headerActions,
  color = "purple",
  showCheckbox = true,
  checkboxColor = "purple",
  selectedRows,
  onSelectRow,
  onSelectAll,
  onSort,
  showPagination = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  paginationLabel,
  showRowCount = false,
  rowCountOptions = [10, 25, 50],
  currentRowCount = 10,
  onRowCountChange,
  className,
}: FullWidthTableProps<T>) {
  const allSelected =
    selectedRows != null && rows.length > 0 && selectedRows.size === rows.length;

  return (
    <div
      className={cn(
        "w-full rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex flex-col justify-start items-start overflow-hidden",
        className
      )}
    >
      {/* Header */}
      {(title || headerActions) && (
        <div className="self-stretch p-6 bg-white flex justify-start items-center gap-4">
          <div className="flex-1 flex justify-start items-center gap-4">
            <div className="inline-flex flex-col justify-center items-start gap-2">
              {title && (
                <div className="justify-start text-fg-black text-sm font-semibold leading-5 tracking-fg">
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
                Show
              </span>
              <select
                value={currentRowCount}
                onChange={(e) => onRowCountChange?.(Number(e.target.value))}
                className="w-20 px-4 py-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-center text-fg-black text-sm font-normal leading-5 tracking-fg cursor-pointer"
              >
                {rowCountOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-t border-b border-fg-grey-200">
            {showCheckbox && (
              <th className="w-14 px-4 py-4 bg-white text-left">
                <Checkbox checked={allSelected} color={checkboxColor} onChange={onSelectAll} />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-5 py-3.5 bg-white text-left text-fg-grey-700 text-sm font-semibold leading-5 tracking-fg whitespace-nowrap",
                  col.width
                )}
                style={col.flex ? { width: "auto" } : undefined}
              >
                <div className="flex items-center gap-2">
                  {col.header}
                  {col.sortable && (
                    <button type="button" onClick={() => onSort?.(col.key)} className="w-4 h-4 flex items-center justify-center cursor-pointer text-fg-grey-500">
                      <AltArrowDownLinear size={10} />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-fg-grey-200 bg-white">
              {showCheckbox && (
                <td className="w-14 px-6 py-4">
                  <Checkbox
                    checked={selectedRows?.has(rowIndex) ?? false}
                    color={checkboxColor}
                    onChange={(c) => onSelectRow?.(rowIndex, c)}
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} className={cn("px-5 py-3.5", col.width)} style={col.flex ? { width: "auto" } : undefined}>
                  {col.render(row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="self-stretch p-6 bg-white flex justify-start items-center gap-3">
        <div className="flex-1 justify-start text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
          {paginationLabel ?? `Showing 1-${rows.length} from ${totalPages * rows.length}`}
        </div>
        {showPagination && (
          <div className="flex justify-start items-start gap-2">
            <button
              type="button"
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <AltArrowLeftLinear size={20} color="var(--fg-grey-500)" />
            </button>
            {getPageNumbers(totalPages, currentPage).map((page, i) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="w-10 h-10 p-2 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden"
                >
                  <span className="flex-1 text-center text-fg-grey-700 text-sm font-semibold leading-5 tracking-fg">
                    ...
                  </span>
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange?.(page as number)}
                  className={cn(
                    "w-10 h-10 p-2 rounded-full flex justify-center items-center gap-1 overflow-hidden cursor-pointer",
                    page === currentPage
                      ? cn(headerActiveColors[color], "text-white")
                      : "outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-fg-grey-700"
                  )}
                >
                  <span className="flex-1 text-center text-sm font-semibold leading-5 tracking-fg">
                    {page}
                  </span>
                </button>
              )
            )}
            <button
              type="button"
              onClick={() =>
                onPageChange?.(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage >= totalPages}
              className="p-2.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex justify-center items-center gap-1 overflow-hidden cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <AltArrowRightLinear size={20} color="var(--fg-grey-500)" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
