"use client";

import { useState, type Key } from "react";
import { Button, ButtonGroup, CellActions, Checkbox, ConfirmationDialog, FileTypeIcon, Panel, PlusIcon, ToolbarSearchInput, cn } from "@forge-ui-official/core";

export interface FileEntry {
  id: string;
  name: string;
  kind: "folder" | "doc" | "fig" | "pdf" | "xls" | "ppt" | "png" | "zip" | "mp4";
  meta: string;
}

export const defaultFiles: FileEntry[] = [
  { id: "d1", name: "客户工作台升级", kind: "folder", meta: "24 个文件" },
  { id: "d2", name: "品牌官网改版", kind: "folder", meta: "18 个文件" },
  { id: "d3", name: "设计规范", kind: "folder", meta: "36 个文件" },
  { id: "d4", name: "客户合同", kind: "folder", meta: "12 个文件" },
  { id: "f1", name: "第二阶段需求说明", kind: "doc", meta: "860 KB" },
  { id: "f2", name: "订单详情交互稿", kind: "fig", meta: "4.2 MB" },
  { id: "f3", name: "接口字段说明", kind: "pdf", meta: "1.1 MB" },
  { id: "f4", name: "验收用例清单", kind: "xls", meta: "320 KB" },
  { id: "f5", name: "方案汇报", kind: "ppt", meta: "8.6 MB" },
  { id: "f6", name: "首页视觉稿", kind: "png", meta: "2.4 MB" },
  { id: "f7", name: "素材打包", kind: "zip", meta: "56 MB" },
  { id: "f8", name: "上线培训录屏", kind: "mp4", meta: "212 MB" },
];

const views = ["全部", "文件夹", "文档", "设计稿", "媒体"];
const viewKinds: Record<string, FileEntry["kind"][] | null> = { 全部: null, 文件夹: ["folder"], 文档: ["doc", "pdf", "xls", "ppt"], 设计稿: ["fig", "png"], 媒体: ["mp4", "zip"] };

export interface FileManagerProps {
  files?: FileEntry[];
  onUpload?: () => void;
  onOpen?: (file: FileEntry) => void;
  onDelete?: (file: FileEntry) => void;
  className?: string;
}

export function FileManager({ files = defaultFiles, onUpload, onOpen, onDelete, className }: FileManagerProps) {
  const [entries, setEntries] = useState(files);
  const [view, setView] = useState(0);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<Key>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<FileEntry | null>(null);
  const kinds = viewKinds[views[view]];
  const visible = entries.filter(file => (!kinds || kinds.includes(file.kind)) && file.name.includes(query.trim()));
  const groups = [{ title: "文件夹", items: visible.filter(file => file.kind === "folder") }, { title: "文件", items: visible.filter(file => file.kind !== "folder") }].filter(group => group.items.length);

  function toggle(id: string, value: boolean) {
    setSelected(current => {
      const next = new Set(current);
      if (value) next.add(id); else next.delete(id);
      return next;
    });
  }

  return <section className={cn("flex min-w-0 flex-col gap-6", className)}>
    <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="-mx-1 min-w-0 fg-scrollbar-hidden overflow-x-auto px-1 pb-1"><ButtonGroup ariaLabel="文件类型" shape="pill" items={views.map(label => ({ label }))} activeIndex={view} onChange={setView} /></div>
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        {selected.size > 0 && <span className="text-sm text-fg-grey-700">已选 {selected.size} 项</span>}
        <ToolbarSearchInput className="w-full sm:w-60" value={query} onChange={setQuery} placeholder="搜索文件" />
        <Button iconLeft={<PlusIcon size={16} />} onClick={onUpload}>上传文件</Button>
      </div>
    </div>
    {groups.length ? groups.map(group => <div key={group.title} className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-fg-black">{group.title}</h3>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">{group.items.map(file => <li key={file.id}>
        <Panel variant="custom" className={cn("rounded-card border bg-white p-4 transition-colors", selected.has(file.id) ? "border-fg-blue" : "border-fg-grey-200")}>
          <div className="flex items-start justify-between"><Checkbox color="blue" checked={selected.has(file.id)} onChange={value => toggle(file.id, value)} aria-label={`选择${file.name}`} /><CellActions actions={[]} onKebab={() => setPendingDelete(file)} /></div>
          <Button variant="unstyled" type="button" className="flex w-full flex-col items-center gap-4 pt-4 text-center" onClick={() => onOpen?.(file)}>
            <FileTypeIcon fileName={file.kind === "folder" ? "folder" : `${file.name}.${file.kind}`} className="h-16 w-16" />
            <span className="w-full"><span className="block truncate text-sm font-semibold text-fg-black">{file.name}</span><span className="mt-1 block text-xs text-fg-grey-500">{file.meta}</span></span>
          </Button>
        </Panel>
      </li>)}</ul>
    </div>) : <p className="rounded-card border border-dashed border-fg-grey-200 py-16 text-center text-sm text-fg-grey-700">没有找到相关文件</p>}
    {pendingDelete && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <ConfirmationDialog title={`删除「${pendingDelete.name}」？`} description={pendingDelete.kind === "folder" ? "文件夹内的所有文件会一起移入回收站。" : "文件会移入回收站，30 天内可以恢复。"} confirmLabel="删除" cancelLabel="取消" color="red" onConfirm={() => { setEntries(current => current.filter(file => file.id !== pendingDelete.id)); onDelete?.(pendingDelete); setPendingDelete(null); }} onCancel={() => setPendingDelete(null)} />
    </div>}
  </section>;
}
