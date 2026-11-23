"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AltArrowRightLinear } from "../../icons";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { CheckboxVisual } from "./checkbox";

export interface TreeNode {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Extra text on the right, e.g. a count. */
  meta?: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeProps {
  nodes: TreeNode[];
  /** Accessible name, e.g. "组织架构". */
  ariaLabel: string;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Single selection (click a row). */
  selectedId?: string | null;
  onSelect?: (id: string, node: TreeNode) => void;
  /** Adds checkboxes. Checking a parent checks every enabled descendant; parents show a partial state. */
  checkable?: boolean;
  checkedIds?: string[];
  defaultCheckedIds?: string[];
  /** Receives checked leaf and parent ids. */
  onCheckedChange?: (ids: string[]) => void;
  motion?: MotionPreference;
  className?: string;
}

type Row = { node: TreeNode; depth: number; parentId: string | null; expanded: boolean; hasChildren: boolean };

function useControlled<T>(value: T | undefined, fallback: T, onChange?: (next: T) => void) {
  const [inner, setInner] = useState(fallback);
  const current = value ?? inner;
  const set = (next: T) => { if (value === undefined) setInner(next); onChange?.(next); };
  return [current, set] as const;
}

function enabledLeaves(node: TreeNode): string[] {
  if (node.disabled) return [];
  if (!node.children?.length) return [node.id];
  return node.children.flatMap(enabledLeaves);
}

/** Hierarchical list: departments, categories, permissions, folders. Arrow keys follow the WAI-ARIA tree pattern. */
export function Tree({ nodes, ariaLabel, expandedIds, defaultExpandedIds = [], onExpandedChange, selectedId, onSelect, checkable = false, checkedIds, defaultCheckedIds = [], onCheckedChange, motion = "auto", className }: TreeProps) {
  const [expanded, setExpanded] = useControlled(expandedIds, defaultExpandedIds, onExpandedChange);
  const [checked, setChecked] = useControlled(checkedIds, defaultCheckedIds, onCheckedChange);
  const [activeId, setActiveId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const expandedSet = useMemo(() => new Set(expanded), [expanded]);
  const checkedSet = useMemo(() => new Set(checked), [checked]);

  const rows = useMemo(() => {
    const out: Row[] = [];
    const walk = (list: TreeNode[], depth: number, parentId: string | null) => {
      for (const node of list) {
        const hasChildren = Boolean(node.children?.length);
        const open = hasChildren && expandedSet.has(node.id);
        out.push({ node, depth, parentId, expanded: open, hasChildren });
        if (open) walk(node.children!, depth + 1, node.id);
      }
    };
    walk(nodes, 0, null);
    return out;
  }, [nodes, expandedSet]);

  const focusId = activeId && rows.some(row => row.node.id === activeId) ? activeId : selectedId && rows.some(row => row.node.id === selectedId) ? selectedId : rows[0]?.node.id ?? null;

  function checkState(node: TreeNode): { on: boolean; partial: boolean } {
    const leaves = enabledLeaves(node);
    if (!node.children?.length) return { on: checkedSet.has(node.id), partial: false };
    const count = leaves.filter(id => checkedSet.has(id)).length;
    return { on: leaves.length > 0 && count === leaves.length, partial: count > 0 && count < leaves.length };
  }

  function toggleCheck(node: TreeNode) {
    if (node.disabled) return;
    const leaves = enabledLeaves(node);
    const { on } = checkState(node);
    const next = new Set(checkedSet);
    for (const id of leaves) { if (on) next.delete(id); else next.add(id); }
    // Recompute parents so the reported ids include fully checked branches.
    const withParents = new Set([...next].filter(id => !isParent(id)));
    const addParents = (list: TreeNode[]) => {
      for (const item of list) {
        if (!item.children?.length) continue;
        addParents(item.children);
        const branch = enabledLeaves(item);
        if (branch.length && branch.every(id => withParents.has(id))) withParents.add(item.id);
      }
    };
    addParents(nodes);
    setChecked([...withParents]);
  }

  function isParent(id: string) {
    const find = (list: TreeNode[]): boolean => list.some(item => (item.id === id && Boolean(item.children?.length)) || (item.children ? find(item.children) : false));
    return find(nodes);
  }

  function toggleExpanded(id: string, open?: boolean) {
    const isOpen = expandedSet.has(id);
    const want = open ?? !isOpen;
    if (want === isOpen) return;
    setExpanded(want ? [...expanded, id] : expanded.filter(item => item !== id));
  }

  function focusRow(id: string | null | undefined) {
    if (!id) return;
    setActiveId(id);
    [...(listRef.current?.querySelectorAll<HTMLElement>("[data-tree-id]") ?? [])].find(item => item.dataset.treeId === id)?.focus();
  }

  function activate(row: Row) {
    if (row.node.disabled) return;
    if (checkable) toggleCheck(row.node);
    else onSelect?.(row.node.id, row.node);
  }

  function onKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const index = rows.findIndex(row => row.node.id === focusId);
    const row = rows[index];
    if (!row) return;
    let handled = true;
    switch (event.key) {
      case "ArrowDown": focusRow(rows[index + 1]?.node.id); break;
      case "ArrowUp": focusRow(rows[index - 1]?.node.id); break;
      case "Home": focusRow(rows[0]?.node.id); break;
      case "End": focusRow(rows.at(-1)?.node.id); break;
      case "ArrowRight":
        if (row.hasChildren && !row.expanded) toggleExpanded(row.node.id, true);
        else if (row.expanded) focusRow(rows[index + 1]?.node.id);
        break;
      case "ArrowLeft":
        if (row.expanded) toggleExpanded(row.node.id, false);
        else focusRow(row.parentId);
        break;
      case "Enter":
      case " ":
        activate(row);
        break;
      default: handled = false;
    }
    if (handled) event.preventDefault();
  }

  const renderRows = (list: TreeNode[], depth: number): ReactNode => list.map(node => {
    const hasChildren = Boolean(node.children?.length);
    const open = hasChildren && expandedSet.has(node.id);
    const state = checkable ? checkState(node) : null;
    const selected = !checkable && selectedId === node.id;
    return (
      <li
        key={node.id}
        role="treeitem"
        data-tree-id={node.id}
        aria-level={depth + 1}
        aria-expanded={hasChildren ? open : undefined}
        aria-selected={checkable ? undefined : selected}
        aria-checked={state ? (state.partial ? "mixed" : state.on) : undefined}
        aria-disabled={node.disabled || undefined}
        tabIndex={node.id === focusId ? 0 : -1}
        onFocus={event => { if (event.target === event.currentTarget) setActiveId(node.id); }}
        className="outline-none group/tree"
      >
        <div
          onClick={() => { setActiveId(node.id); if (hasChildren && !checkable && !onSelect) toggleExpanded(node.id); activate({ node, depth, parentId: null, expanded: open, hasChildren }); }}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-xl pr-3 text-sm leading-5 tracking-fg transition-colors cursor-pointer",
            "group-focus-visible/tree:outline-2 group-focus-visible/tree:outline-offset-[-2px] group-focus-visible/tree:outline-fg-blue",
            selected ? "bg-accent-soft font-medium text-accent" : "text-fg-black hover:bg-fg-grey-100",
            node.disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
          )}
          style={{ paddingLeft: 4 + depth * 20 }}
        >
          <span
            aria-hidden
            onClick={event => { if (hasChildren) { event.stopPropagation(); toggleExpanded(node.id); } }}
            className={cn("flex size-6 shrink-0 items-center justify-center rounded-md text-fg-grey-500", hasChildren && "hover:bg-fg-grey-200 hover:text-fg-black")}
          >
            {hasChildren && <span className="forge-tree-chevron flex" data-open={open || undefined} data-motion={motion}><AltArrowRightLinear size={14} /></span>}
          </span>
          {state && <span aria-hidden className="relative size-5 shrink-0"><CheckboxVisual checked={state.on} indeterminate={state.partial} motion={motion} /></span>}
          {node.icon && <span aria-hidden className="flex shrink-0 text-fg-grey-700">{node.icon}</span>}
          <span className="min-w-0 flex-1 truncate">{node.label}</span>
          {node.meta && <span className="shrink-0 text-xs text-fg-grey-500 tabular-nums">{node.meta}</span>}
        </div>
        {open && <ul role="group" className="m-0 list-none p-0">{renderRows(node.children!, depth + 1)}</ul>}
      </li>
    );
  });

  return (
    <ul ref={listRef} role="tree" aria-label={ariaLabel} aria-multiselectable={checkable || undefined} onKeyDown={onKeyDown} className={cn("m-0 flex list-none flex-col p-0", className)}>
      {renderRows(nodes, 0)}
    </ul>
  );
}
