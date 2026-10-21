"use client";

import { useEffect, useRef, useState } from "react";
import { Button, TextArea, TextField } from "@forge-ui-official/core";
import { type Task } from "./_data";
import { TaskDateMenu, type SchedulePatch } from "./_task-date-menu";
import { SubtaskAttachments } from "./_subtask-attachments";
import { ContextMenu } from "./_context-menu";
import { TaskLabels } from "./_task-labels";

export function QuickAdd({ project, section, initialDate = "", initialPriority = "4", availableLabels = [], onSave, onClose }: {
  project: string;
  section: string;
  initialDate?: string;
  initialPriority?: string;
  availableLabels?: string[];
  onSave: (task: Task) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState<SchedulePatch>({ date: initialDate });
  const [priority, setPriority] = useState(initialPriority);
  const [labels, setLabels] = useState<string[]>([]);
  const [labelsOpen, setLabelsOpen] = useState(false);
  const [attachments, setAttachments] = useState<NonNullable<Task["attachments"]>>([]);
  const [uploading, setUploading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const cancel = (event: KeyboardEvent) => {
      const target = event.target;
      if (!["escape", "esc"].includes(event.key.toLowerCase()) && event.code !== "Escape" && event.keyCode !== 27) return;
      if (target instanceof Element && target !== document.body && !form.current?.contains(target)) return;
      // Let an open selection menu consume Escape before cancelling the draft.
      if (form.current?.querySelector(':popover-open,[aria-expanded="true"][role="combobox"]')) return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", cancel, true);
    return () => window.removeEventListener("keydown", cancel, true);
  }, [onClose]);
  return <form ref={form} className="task-quick-add" aria-label="快速添加任务" onSubmit={(event) => {
    event.preventDefault();
    if (!title.trim() || uploading) return;
    onSave({ id: crypto.randomUUID(), title: title.trim(), description: description.trim(), project, section, ...schedule, priority, owner: "林晓", done: false, subtasks: [], comments: [], attachments, labels });
    setTitle(""); setDescription(""); setAttachments([]); setLabels([]);
    input.current?.focus();
  }}>
    <TextField color="blue" className="quick-add-title" ref={input} autoFocus aria-label="任务名称" placeholder="任务名称" value={title} onChange={setTitle} />
    <TextArea color="blue" className="quick-add-description" aria-label="任务描述" placeholder="描述（可选）" rows={1} value={description} onChange={setDescription} />
    <div className="flex flex-wrap items-center gap-2">
      <TaskDateMenu value={schedule.date} time={schedule.time} repeat={schedule.repeat} repeatRule={schedule.repeatRule} onScheduleChange={setSchedule} onChange={(date) => setSchedule({ ...schedule, date })} />
      <ContextMenu label={`任务优先级：P${priority}`} triggerLabel={`优先级 P${priority}`} items={["1", "2", "3", "4"].map(value => ({ label: `P${value}${value === priority ? " · 当前" : ""}`, onSelect: () => setPriority(value) }))} />
      <Button color="blue" size="sm" variant="tertiary" aria-expanded={labelsOpen} onClick={() => setLabelsOpen(current => !current)}>标签{labels.length ? ` · ${labels.length}` : ""}</Button>
    </div>
    {labelsOpen && <TaskLabels value={labels} available={availableLabels} onChange={setLabels} />}
    <SubtaskAttachments label="任务附件" value={attachments} onChange={setAttachments} onBusyChange={setUploading} />
    <div className="flex justify-end gap-2">
      <Button color="blue" size="sm" variant="secondary" onClick={onClose}>取消</Button>
      <Button color="blue" size="sm" type="submit" disabled={!title.trim() || uploading}>添加任务</Button>
    </div>
  </form>;
}
