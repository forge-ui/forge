"use client";

import { Fragment, useLayoutEffect, useRef, useState, type CSSProperties, type Key, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { AltArrowDownLinear, AltArrowRightLinear, ListCheckLinear } from "../icons";
import { cn } from "../lib/utils";
import { Checkbox } from "../components/ui/checkbox";
import { DropdownMenu } from "../components/ui/dropdown-menu";
import { ToolbarSelectDropdown } from "../components/ui/toolbar";
import type { DataTableProps } from "../components/ui/data-table";
import {
  TableColumnAlignContext,
  columnAlignDataAttrs,
  getDefaultTableMinWidth,
  isTableIdentityColumn,
  resolveTableColumnAlign,
  tableColumnClass,
  tableColumnStyle,
  type ColumnDef,
  type TableCellEdit,
} from "./table-columns";

// The table body shared by DataTable and FullWidthTable, plus their header and footer parts.

export type TableGridProps<T> = Pick<
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

type FlatRow<T> = { row: T; rowIndex: number; key: Key; depth: number; hasChildren: boolean; label: string };

const pinnedCellClass = "sticky z-[1] bg-background";

function EditableCell<T>({ row, edit, children }: { row: T; edit: TableCellEdit<T>; children: ReactNode }) {
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const cellRef = useRef<HTMLDivElement>(null);
  // Escape unmounts the input; a blur fired during that unmount must not save the abandoned draft.
  const editing = useRef(false);
  const start = () => { editing.current = true; setDraft(String(edit.value(row))); setError(null); };
  const cancel = () => { editing.current = false; setDraft(null); setError(null); requestAnimationFrame(() => cellRef.current?.focus()); };
  const save = async () => {
    if (draft === null || saving || !editing.current) return;
    if (draft === String(edit.value(row))) { cancel(); return; }
    const problem = edit.validate?.(draft, row);
    if (problem) { setError(problem); return; }
    try {
      setSaving(true);
      await edit.onSave(row, draft);
      editing.current = false;
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

export function TableGrid<T>({
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
  // Child rows are keyed by getRowKey (use a row id, not the index) or by their path under the parent.
  // `rowIndex` is the position within the parent; `label` is the human path, e.g. "2" or "2.1".
  const walk = (list: T[], depth: number, path: string, labelPath: string) => {
    list.forEach((row, index) => {
      const label = labelPath ? `${labelPath}.${index + 1}` : String(index + 1);
      const key = depth === 0 ? getKey(row, index) : getRowKey ? getRowKey(row, index) : `${path}.${index}`;
      const children = getRowChildren?.(row);
      flat.push({ row, rowIndex: index, key, depth, hasChildren: Boolean(children?.length), label });
      if (children?.length && expanded.has(key)) walk(children, depth + 1, String(key), label);
    });
  };
  walk(rows, 0, "", "");
  // Index-based selection (selectedRows / onSelectRow) only addresses top-level rows.
  const indexMode = selectedRowKeys == null;
  const selectable = indexMode ? flat.filter((item) => item.depth === 0) : flat;

  const isKeySelected = (item: FlatRow<T>) => selectedRowKeys?.has(item.key) ?? (item.depth === 0 && selectedRows?.has(item.rowIndex)) ?? false;
  const allSelected = selectable.length > 0 && selectable.every(isKeySelected);
  const someSelected = !allSelected && selectable.some(isKeySelected);
  const updateKeySelection = (checked: boolean, items: FlatRow<T>[]) => {
    if (selectedRowKeys == null) return;
    const next = new Set(selectedRowKeys);
    for (const item of items) { if (checked) next.add(item.key); else next.delete(item.key); }
    onSelectedRowKeysChange?.(next);
  };

  const hasExpandColumn = Boolean(expandable) && !getRowChildren;
  const leadingCells = (showCheckbox ? 1 : 0) + (hasExpandColumn ? 1 : 0);
  const anyLeftPin = columns.some((column) => column.pinned === "left");

  // Sticky offsets depend on real cell widths: measure after layout and whenever a header cell resizes.
  const [layoutTick, setLayoutTick] = useState(0);
  useLayoutEffect(() => {
    const head = tableRef.current?.querySelector("thead tr");
    if (!head || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setLayoutTick((tick) => tick + 1));
    for (const cell of head.children) observer.observe(cell);
    return () => observer.disconnect();
  }, [columns, showCheckbox, hasExpandColumn]);
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
  }, [columns, widths, showCheckbox, hasExpandColumn, rows.length, layoutTick]);

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
                      updateKeySelection(checked, selectable);
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
                        {(!indexMode || depth === 0) && <Checkbox
                          aria-label={`选择第 ${item.label} 行`}
                          checked={selected}
                          color={checkboxColor}
                          onChange={(checked) => {
                            updateKeySelection(checked, [item]);
                            if (selectedRowKeys == null) onSelectRow?.(rowIndex, checked);
                          }}
                        />}
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

export function ColumnSettingsButton<T>({ columns, hidden, onChange }: { columns: ColumnDef<T>[]; hidden: ReadonlySet<string>; onChange: (keys: Set<string>) => void }) {
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

export function useHiddenColumns(hiddenColumnKeys: ReadonlySet<string> | undefined, onChange: ((keys: Set<string>) => void) | undefined) {
  const [own, setOwn] = useState<Set<string>>(() => new Set());
  const hidden = hiddenColumnKeys ?? own;
  const set = (next: Set<string>) => { if (hiddenColumnKeys === undefined) setOwn(next); onChange?.(next); };
  return [hidden, set] as const;
}

export function BulkActionBar({ count, onClear, children }: { count: number; onClear: () => void; children: ReactNode }) {
  return (
    <div role="region" aria-label="批量操作" className="self-stretch flex flex-wrap items-center gap-3 border-t border-fg-grey-200 bg-fg-blue-50 px-5 py-2.5">
      <span className="text-sm font-medium tracking-fg text-fg-black">已选择 {count} 项</span>
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
      <button type="button" onClick={onClear} className="text-sm font-medium tracking-fg text-fg-blue cursor-pointer hover:underline">取消选择</button>
    </div>
  );
}

export function PageSizeAndJumper({ pageSize, pageSizeOptions, onPageSizeChange, showQuickJumper, totalPages, onPageChange }: {
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

