"use client";

import { useEffect, useId, useRef, type RefObject } from "react";
import { Button, ButtonGroup, Checkbox, DropdownPanel, SelectOption, TextField } from "@forge-ui-official/core";
import { type ViewPreference } from "./_view-preferences";

export function ViewMenu({ open, onOpenChange, value, onChange, query, onQueryChange, labels, searchRef, systemScope }: {
  open: boolean; onOpenChange: (open: boolean) => void;
  value: ViewPreference; onChange: (patch: Partial<ViewPreference>) => void;
  query: string; onQueryChange: (query: string) => void;
  labels: string[]; searchRef: RefObject<HTMLInputElement | null>; systemScope: boolean;
}) {
  const id = useId();
  const anchor = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const filtered = !!query || value.priority !== "all" || value.label !== "__all__" || value.dateFilter !== "all";
  useEffect(() => {
    const popup = panel.current;
    if (!popup) return;
    if (!open) { popup.hidePopover(); return; }
    const position = () => {
      const rect = anchor.current!.getBoundingClientRect();
      popup.style.left = `${Math.max(12, Math.min(rect.right - 336, window.innerWidth - 348))}px`;
      popup.style.top = `${Math.max(12, Math.min(rect.bottom + 8, window.innerHeight - 240))}px`;
      popup.style.maxHeight = `${window.innerHeight - Number.parseFloat(popup.style.top) - 12}px`;
    };
    position(); popup.showPopover();
    const close = (event: Event) => { if (!(event.target instanceof Node) || !popup.contains(event.target)) popup.hidePopover(); };
    window.addEventListener("resize", close); window.addEventListener("scroll", close, true);
    return () => { window.removeEventListener("resize", close); window.removeEventListener("scroll", close, true); };
  }, [open]);
  return <div ref={anchor}>
    <Button color="blue" size="sm" variant="tertiary" aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={() => onOpenChange(!open)}>视图{filtered ? " · 已筛选" : ""}</Button>
    <div ref={panel} id={id} popover="auto" role="dialog" aria-label="视图选项" className="task-view-menu" onToggle={(event) => onOpenChange((event.nativeEvent as ToggleEvent).newState === "open")}>
      <DropdownPanel width="w-full" padding="p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-fg-black">视图</h2>
          {!systemScope && <div className="flex flex-col gap-2"><span className="text-xs text-fg-grey-700">布局</span><ButtonGroup color="blue" ariaLabel="任务布局" items={[{ label: "看板" }, { label: "列表" }]} activeIndex={value.view} onChange={(view) => onChange({ view })} /></div>}
          {!systemScope && <SelectOption color="blue" label="分组" width="100%" value={value.group} onChange={(group) => onChange({ group: group as ViewPreference["group"] })} options={[{ value: "section", label: "分区" }, { value: "priority", label: "优先级" }, { value: "date", label: "日期" }, { value: "label", label: "标签" }]} />}
          <SelectOption color="blue" label="排序" width="100%" value={value.sort} onChange={(sort) => onChange({ sort })} options={[{ value: "manual", label: "默认顺序" }, { value: "name", label: "名称" }, { value: "date", label: "日期" }, { value: "priority", label: "优先级" }]} />
          {!systemScope && (value.group !== "section" || value.sort !== "manual") && <p className="text-xs leading-5 text-fg-grey-700">切换为分区分组和默认顺序后，可拖动调整任务顺序。</p>}
          <div className="border-t border-fg-grey-200" />
          <TextField color="blue" ref={searchRef} label="筛选任务" placeholder="名称、描述、标签或负责人" value={query} onChange={onQueryChange} />
          <SelectOption color="blue" width="100%" label="优先级" value={value.priority} onChange={(priority) => onChange({ priority })} options={[{ value: "all", label: "所有优先级" }, ...[1, 2, 3, 4].map((n) => ({ value: String(n), label: `P${n}` }))]} />
          <SelectOption color="blue" width="100%" label="日期" value={value.dateFilter} onChange={(dateFilter) => onChange({ dateFilter: dateFilter as ViewPreference["dateFilter"] })} options={[{ value: "all", label: "所有日期" }, { value: "today", label: "今天" }, { value: "week", label: "本周" }, { value: "next7", label: "未来 7 天" }, { value: "month", label: "本月" }, { value: "next30", label: "未来 30 天" }, { value: "none", label: "没有日期" }]} />
          <SelectOption color="blue" width="100%" label="标签" value={value.label} onChange={(label) => onChange({ label })} options={[{ value: "__all__", label: "所有标签" }, ...labels.map((label) => ({ value: `label:${label}`, label: `@${label}` }))]} />
          <label className="flex items-center gap-2 text-sm text-fg-black"><Checkbox color="blue" aria-label="显示已完成" checked={value.showDone} onChange={(showDone) => onChange({ showDone })} />显示已完成</label>
          {filtered && <Button color="blue" size="sm" variant="tertiary" onClick={() => { onQueryChange(""); onChange({ priority: "all", label: "__all__", dateFilter: "all" }); }}>清除筛选</Button>}
        </div>
      </DropdownPanel>
    </div>
  </div>;
}
