"use client";

import { useEffect, useRef } from "react";
import { CommandSearch, Modal } from "@forge-ui-official/core";
import { CheckCircleBoldDuotone, ClipboardListBoldDuotone, FolderBoldDuotone } from "@forge-ui-official/core/icons";
import { taskSearchEntries, type Board, type Task } from "./_data";

export function TaskSearch({ board, open, onOpenChange, onTask, onProject }: {
  board: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTask: (task: Task, path: string[]) => void;
  onProject: (project: string) => void;
}) {
  const entries = taskSearchEntries(board);
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => content.current?.querySelector<HTMLInputElement>('input[role="combobox"]')?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);
  return <Modal open={open} onOpenChange={onOpenChange} title="搜索">
    <div ref={content}>
    <p className="mb-4 text-sm text-fg-grey-700">查找当前工作空间的项目、任务、子任务、标签、描述或负责人。</p>
    {open && <CommandSearch
      color="black"
      autoFocus
      placeholder="搜索项目或任务…"
      emptyLabel="没有找到匹配的项目或任务，试试其他关键词。"
      groupLabel="搜索结果"
      items={[
        ...board.projects.filter((project) => !board.archived?.includes(project)).map((project) => ({
          id: `project:${project}`, label: project, group: "项目", icon: <FolderBoldDuotone size={18} />,
        })),
        ...entries.map(({ id, task, item, path, context }) => ({
          id: `task:${id}`, label: item.title,
          group: path.length ? (item.done ? "已完成子任务" : "子任务") : (item.done ? "已完成任务" : "任务"),
          hint: context,
          keywords: [item.description ?? "", task.owner, ...(item.labels ?? []).flatMap((label) => [label, `@${label}`])],
          icon: item.done ? <CheckCircleBoldDuotone size={18} /> : <ClipboardListBoldDuotone size={18} />,
        })),
      ]}
      onSelect={(item) => {
        onOpenChange(false);
        if (item.id.startsWith("project:")) onProject(item.id.slice(8));
        else {
          const entry = entries.find((entry) => `task:${entry.id}` === item.id);
          if (entry) onTask(entry.task, entry.path);
        }
      }}
    />}
    <p className="mt-3 text-xs text-fg-grey-700">↑ ↓ 选择 · Enter 打开 · Esc 关闭</p>
    </div>
  </Modal>;
}
