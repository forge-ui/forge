"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { useId, useMemo, useRef, useState } from "react";
import { AltArrowDownLinear, CloseCircleLinear, MagniferLinear } from "../../../icons";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { Tree, type TreeNode } from "../tree";
import { FieldFrame } from "./field-utils";
import { floatingFieldClass, floatingIconButtonClass, type FloatingFieldShape } from "./floating-field";
import { formAccents, type FormAccentColor } from "./form-utils";

type TreeSelectBase = {
  nodes: TreeNode[];
  label?: string;
  placeholder?: string;
  searchable?: boolean;
  defaultExpandedIds?: string[];
  clearable?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  name?: string;
  color?: FormAccentColor;
  shape?: FloatingFieldShape;
  motion?: MotionPreference;
  locale?: "zh" | "en";
  width?: string;
  className?: string;
};

export type TreeSelectProps = TreeSelectBase & (
  | { multiple?: false; value?: string | null; defaultValue?: string | null; onChange?: (id: string | null) => void }
  /** Multiple: checking a parent selects its whole branch; reported ids include fully checked parents. */
  | { multiple: true; value?: string[]; defaultValue?: string[]; onChange?: (ids: string[]) => void }
);

function indexNodes(nodes: TreeNode[], parents: string[] = [], out = new Map<string, { node: TreeNode; parents: string[] }>()) {
  for (const node of nodes) {
    out.set(node.id, { node, parents });
    if (node.children) indexNodes(node.children, [...parents, node.id], out);
  }
  return out;
}

function textOf(node: TreeNode) {
  return typeof node.label === "string" || typeof node.label === "number" ? String(node.label) : node.id;
}

function filterNodes(nodes: TreeNode[], query: string): TreeNode[] {
  const lower = query.toLowerCase();
  return nodes.flatMap(node => {
    const children = node.children ? filterNodes(node.children, query) : [];
    if (textOf(node).toLowerCase().includes(lower)) return [node];
    return children.length ? [{ ...node, children }] : [];
  });
}

/** Pick one or several items from a hierarchy in a dropdown: departments, categories, regions. */
export function TreeSelect(props: TreeSelectProps) {
  const { nodes, label, placeholder, searchable = true, defaultExpandedIds, clearable = true, disabled = false, errorMessage, name, color = "blue", shape = "rounded", motion = "auto", locale = "zh", width, className } = props;
  const multiple = props.multiple === true;
  const [innerSingle, setInnerSingle] = useState<string | null>(multiple ? null : (props.defaultValue as string | null | undefined) ?? null);
  const [innerMulti, setInnerMulti] = useState<string[]>(multiple ? (props.defaultValue as string[] | undefined) ?? [] : []);
  const single = multiple ? null : props.value === undefined ? innerSingle : props.value ?? null;
  const ids = multiple ? (props.value as string[] | undefined) ?? innerMulti : single ? [single] : [];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const index = useMemo(() => indexNodes(nodes), [nodes]);
  const fieldRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const errorId = useId();
  const accent = formAccents[color];
  const state = disabled ? "disabled" : errorMessage ? "error" : "idle";

  // Show the highest selected nodes only: a checked parent stands for its children.
  const shown = ids.filter(id => !index.get(id)?.parents.some(parent => ids.includes(parent)));
  const expandedForValue = Array.from(new Set(ids.flatMap(id => index.get(id)?.parents ?? [])));
  const visibleNodes = query ? filterNodes(nodes, query) : nodes;
  const expandAll = (list: TreeNode[]): string[] => list.flatMap(node => node.children?.length ? [node.id, ...expandAll(node.children)] : []);

  function setSingle(next: string | null) {
    if (multiple) return;
    if (props.value === undefined) setInnerSingle(next);
    (props.onChange as ((id: string | null) => void) | undefined)?.(next);
  }
  function setMulti(next: string[]) {
    if (!multiple) return;
    if (props.value === undefined) setInnerMulti(next);
    (props.onChange as ((ids: string[]) => void) | undefined)?.(next);
  }
  const removeBranch = (id: string) => {
    const drop = new Set([id, ...[...index.entries()].filter(([, entry]) => entry.parents.includes(id)).map(([key]) => key)]);
    setMulti(ids.filter(item => !drop.has(item) && !index.get(id)?.parents.includes(item)));
  };

  return (
    <FieldFrame label={label} errorMessage={errorMessage} showError={state === "error"} errorId={errorId} inputId={triggerId} className={cn("max-w-full", className)}>
      <PopoverPrimitive.Root open={open} onOpenChange={next => { setOpen(next); if (!next) setQuery(""); }} modal={false}>
        <div ref={fieldRef} className={cn(floatingFieldClass({ state, shape, color }), multiple ? "min-h-12 flex-wrap py-2 pr-2" : "h-12 pr-2")} style={{ width: width ?? "100%", maxWidth: "100%" }}>
          {multiple && shown.map(id => {
            const node = index.get(id)?.node;
            if (!node) return null;
            return (
              <span key={id} className={cn("inline-flex max-w-full items-center gap-0.5 rounded-full py-1 pl-2.5 pr-1.5 text-xs font-medium leading-[18px] tracking-fg", accent.bgTint, accent.text)}>
                <span className="truncate">{node.label}</span>
                {!disabled && <button type="button" aria-label={`${locale === "en" ? "Remove" : "移除"} ${textOf(node)}`} onClick={() => removeBranch(id)} className="flex size-[18px] shrink-0 cursor-pointer items-center justify-center"><CloseCircleLinear size={14} /></button>}
              </span>
            );
          })}
          <PopoverPrimitive.Trigger
            id={triggerId}
            disabled={disabled}
            aria-invalid={state === "error" || undefined}
            aria-describedby={state === "error" ? errorId : undefined}
            className="flex h-8 min-w-16 flex-1 cursor-pointer items-center text-left outline-none disabled:cursor-not-allowed"
          >
            <span className={cn("truncate text-sm leading-5 tracking-fg", !multiple && single ? (state === "error" ? "text-fg-red" : "text-fg-black") : "text-fg-grey-700")}>
              {!multiple && single ? index.get(single)?.node.label : multiple && shown.length ? "" : placeholder ?? (locale === "en" ? "Select" : "请选择")}
            </span>
          </PopoverPrimitive.Trigger>
          {clearable && ids.length > 0 && !disabled ? (
            <button type="button" aria-label={locale === "en" ? "Clear" : "清除"} className={floatingIconButtonClass} onClick={() => (multiple ? setMulti([]) : setSingle(null))}><CloseCircleLinear size={18} /></button>
          ) : (
            <span aria-hidden className="forge-chevron flex size-6 items-center justify-center text-fg-grey-700" data-motion={motion} data-expanded={open}><AltArrowDownLinear size={20} /></span>
          )}
          {name && ids.map(id => <input key={id} type="hidden" name={name} value={id} />)}
        </div>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner anchor={fieldRef} side="bottom" align="start" sideOffset={6} collisionPadding={8} className="z-50">
            <PopoverPrimitive.Popup
              aria-label={label ?? (locale === "en" ? "Options" : "选项")}
              data-motion={motion}
              className="forge-popup flex max-h-[min(var(--available-height),24rem)] w-(--anchor-width) min-w-64 max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-xl bg-background shadow-[0px_4px_30px_0px_rgba(77,84,100,0.08)] outline outline-1 outline-offset-[-1px] outline-fg-grey-100"
            >
              {searchable && (
                <label className="m-2 flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 outline outline-1 outline-offset-[-1px] outline-fg-grey-200 focus-within:outline-fg-blue">
                  <MagniferLinear size={16} className="shrink-0 text-fg-grey-500" />
                  <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={locale === "en" ? "Search" : "搜索"} aria-label={locale === "en" ? "Search options" : "搜索选项"} className="min-w-0 flex-1 bg-transparent text-sm tracking-fg text-fg-black outline-none placeholder:text-fg-grey-500" />
                </label>
              )}
              <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
                {visibleNodes.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-fg-grey-500">{locale === "en" ? "No matches" : "没有匹配项"}</p>
                ) : multiple ? (
                  <Tree key={query} ariaLabel={label ?? "选项"} nodes={visibleNodes} checkable checkedIds={ids} onCheckedChange={setMulti} defaultExpandedIds={query ? expandAll(visibleNodes) : defaultExpandedIds ?? expandedForValue} motion={motion} />
                ) : (
                  <Tree key={query} ariaLabel={label ?? "选项"} nodes={visibleNodes} selectedId={single} onSelect={id => { setSingle(id); setOpen(false); setQuery(""); }} defaultExpandedIds={query ? expandAll(visibleNodes) : defaultExpandedIds ?? expandedForValue} motion={motion} />
                )}
              </div>
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </FieldFrame>
  );
}
