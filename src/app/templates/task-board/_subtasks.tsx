"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { Button, Checkbox, ConfirmationDialog, Modal, SelectOption, TextField } from "@forge-ui-official/core";
import { PlusLinear } from "@forge-ui-official/core/icons";
import { collectTaskLabels, copySubtask, day, type Subtask, type Task } from "./_data";
import { TaskDateMenu, type SchedulePatch } from "./_task-date-menu";
import { TaskLabels } from "./_task-labels";
import { SubtaskAttachments } from "./_subtask-attachments";
import { MarkdownContent, richTextPlain } from "./_markdown";
import { MarkdownEditor } from "./_markdown-editor";
import { TaskContentEditor } from "./_task-content-editor";
import { TaskComments } from "./_task-comments";
import { ContextMenu } from "./_context-menu";
import { SortableSubtasks } from "./_sortable-subtasks";
import { useUnsavedChanges } from "./_use-unsaved-changes";

export type DraftExitGuard = (proceed: () => void) => void;

export function Subtasks({ draftScope, onExitGuardChange, value, onChange, parentTitle, availableLabels = [], detailPath, onDetailPathChange, saveFailed = false, onRetrySave }: { draftScope?: string; onExitGuardChange?: (guard: DraftExitGuard | null) => void; value: Task["subtasks"]; onChange: (value: Task["subtasks"]) => void; parentTitle?: string; availableLabels?: string[]; detailPath?: string[]; onDetailPathChange?: (path: string[]) => void; saveFailed?: boolean; onRetrySave?: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const lastDetailId = useRef<string | null>(null);
  const labelOptions = collectTaskLabels([{ labels: availableLabels, subtasks: value }]);
  const [editing, setEditing] = useState<string | null>(null);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [draftBaseline, setDraftBaseline] = useState("");
  const pendingExit = useRef<(() => void) | null>(null);
  const childExitGuard = useRef<DraftExitGuard | null>(null);
  const contentExitGuard = useRef<DraftExitGuard | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const completedCount = value.filter((item) => item.done).length;
  const visibleItems = value.filter(item => showCompleted || !item.done || editing === item.id);
  const moveBefore = (sourceId: string, targetId: string, after = false) => {
    const source = value.find((item) => item.id === sourceId);
    if (!source || sourceId === targetId) return;
    const remaining = value.filter((item) => item.id !== sourceId);
    const target = remaining.findIndex((item) => item.id === targetId);
    if (target < 0) return;
    remaining.splice(target + (after ? 1 : 0), 0, source);
    onChange(remaining);
  };
  const [draft, setDraft] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState<SchedulePatch>({ date: "" });
  const date = schedule.date;
  const setDate = (date: string) => setSchedule(current => ({ ...current, date }));
  const [priority, setPriority] = useState("P4");
  const [labels, setLabels] = useState<string[]>([]);
  const [labelsOpen, setLabelsOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editingDetailTitle, setEditingDetailTitle] = useState(false);
  const [editingDetailDescription, setEditingDetailDescription] = useState(false);
  const controlled = detailPath !== undefined;
  const targetId = detailPath?.[0] ?? null;
  useEffect(() => {
    if (!controlled) return;
    // Open each nested modal after its parent mounts, preserving modal stack order.
    const frame = requestAnimationFrame(() => {
      if (targetId) lastDetailId.current = targetId;
      setDetailId(targetId);
      setEditingDetailTitle(false);
      setEditingDetailDescription(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [controlled, targetId]);
  const selectDetail = (id: string | null) => {
    const proceed = () => {
    setEditingDetailTitle(false); setEditingDetailDescription(false);
    if (id) lastDetailId.current = id;
    setDetailId(id);
    onDetailPathChange?.(id ? [id] : []);
    };
    const content = () => contentExitGuard.current ? contentExitGuard.current(proceed) : proceed();
    if (id !== detailId && childExitGuard.current) childExitGuard.current(content);
    else content();
  };
  const openDetail = (item: Subtask) => { selectDetail(item.id); };
  const duplicate = (item: Subtask) => {
    const copy = copySubtask(item, { title: `${item.title}（副本）`, done: false, completionHistory: undefined, comments: [] });
    const index = value.findIndex(entry => entry.id === item.id);
    onChange([...value.slice(0, index + 1), copy, ...value.slice(index + 1)]);
    openDetail(copy);
  };
  const [attachments, setAttachments] = useState<NonNullable<Subtask["attachments"]>>([]);
  const [uploading, setUploading] = useState(false);
  const detail = value.find((item) => item.id === detailId);
  const updateDetail = (patch: Partial<Subtask>) => onChange(value.map((item) => item.id === detailId ? { ...item, ...patch } : item));
  const input = useRef<HTMLInputElement>(null);
  const close = () => { setDiscardOpen(false); setEditing(null); setDraft(""); setDescription(""); setSchedule({ date: "" }); setPriority("P4"); setAttachments([]); setLabels([]); setLabelsOpen(false); };
  const begin = (id: string, title = "") => {
    const item = value.find((entry) => entry.id === id);
    setDraftBaseline(JSON.stringify({ title: title.trim(), description: item?.description || "", date: item?.date || "", time: item?.time, repeat: item?.repeat, repeatAnchor: item?.repeatAnchor, repeatRule: item?.repeatRule, priority: item?.priority || "P4", attachments: item?.attachments || [], labels: item?.labels || [] }));
    setDraft(title); setDescription(item?.description || "");
    setLabels(item?.labels || []); setLabelsOpen(false);
    setSchedule({ date: item?.date || "", time: item?.time, repeat: item?.repeat, repeatAnchor: item?.repeatAnchor, repeatRule: item?.repeatRule }); setPriority(item?.priority || "P4"); setAttachments(item?.attachments || []); setEditing(id);
  };
  const draftFields = () => ({ title: draft.trim(), description, ...schedule, priority, attachments, labels });
  useUnsavedChanges(!!editing && (uploading || JSON.stringify(draftFields()) !== draftBaseline));
  const requestDraftExit: DraftExitGuard = (proceed) => {
    if (editing && (uploading || JSON.stringify(draftFields()) !== draftBaseline)) {
      pendingExit.current = proceed;
      setDiscardOpen(true);
    } else proceed();
  };
  const requestClose = () => requestDraftExit(close);
  useEffect(() => {
    onExitGuardChange?.((proceed) => {
      const exit = () => requestDraftExit(() => {
        const finish = () => { close(); proceed(); };
        if (contentExitGuard.current) contentExitGuard.current(finish);
        else finish();
      });
      if (childExitGuard.current) childExitGuard.current(exit);
      else exit();
    });
    return () => onExitGuardChange?.(null);
  });
  const save = () => {
    if (!draft.trim() || uploading) return;
    if (editing === "new") {
      onChange([...value, { id: crypto.randomUUID(), ...draftFields(), done: false }]);
      setDraftBaseline(JSON.stringify({ title: "", description: "", ...schedule, priority, attachments: [], labels: [] }));
      setDraft(""); setDescription(""); setAttachments([]); setLabels([]); input.current?.focus();
    } else {
      onChange(value.map((item) => item.id === editing ? { ...item, ...draftFields() } : item));
      close();
    }
  };
  const editor = <div role="group" className="subtask-inline-editor" aria-label={editing === "new" ? "添加子任务" : "编辑子任务"} onKeyDownCapture={(event) => {
    if (event.key === "Enter" && event.target === input.current && !event.nativeEvent.isComposing) { event.preventDefault(); event.stopPropagation(); save(); }
    if (["escape", "esc"].includes(event.key.toLowerCase()) || event.code === "Escape" || event.keyCode === 27) {
      // Let the active picker close before treating Escape as draft cancellation.
      if (event.currentTarget.querySelector(':popover-open,[role="combobox"][aria-expanded="true"]')) return;
      event.preventDefault(); event.stopPropagation(); requestClose();
    }
  }}>
    <TextField ref={input} autoFocus color="blue" className="subtask-editor-name" aria-label="子任务名称" placeholder="子任务名称" value={draft} onChange={setDraft} />
    <MarkdownEditor compact label="子任务描述" value={description} onChange={setDescription} />
    <div className="comment-composer-toolbar subtask-editor-tools">
      <TaskDateMenu value={date} time={schedule.time} repeat={schedule.repeat} repeatRule={schedule.repeatRule} onScheduleChange={setSchedule} onChange={setDate} />
      <ContextMenu label={`子任务优先级：${priority}`} triggerLabel={`优先级 ${priority}`} items={["P1", "P2", "P3", "P4"].map(value => ({ label: `${value}${value === priority ? " · 当前" : ""}`, onSelect: () => setPriority(value) }))} />
      <Button color="black" size="sm" variant="tertiary" className="subtask-editor-tool" aria-expanded={labelsOpen} onClick={() => setLabelsOpen(current => !current)}>标签{labels.length > 0 ? ` · ${labels.length}` : ""}</Button>
      <SubtaskAttachments compact value={attachments} onChange={setAttachments} onBusyChange={setUploading} />
    </div>
    {labelsOpen && <div className="subtask-editor-labels"><TaskLabels value={labels} available={labelOptions} onChange={setLabels} /></div>}
    <div className="subtask-editor-footer">
    {editing === "new" && <Button color="black" size="sm" variant="tertiary" className="subtask-editor-details" disabled={!draft.trim() || uploading} onClick={() => {
      const id = crypto.randomUUID();
      const item = { id, ...draftFields(), done: false };
      onChange([...value, item]);
      close(); openDetail(item);
    }}>添加详情</Button>}
      <div className="ml-auto flex gap-2">
        <Button color="grey" size="sm" variant="secondary" onClick={requestClose}>取消</Button>
        <Button color="blue" size="sm" onClick={save} disabled={!draft.trim() || uploading}>{editing === "new" ? "添加子任务" : "保存"}</Button>
      </div>
    </div>
  </div>;
  return <section ref={sectionRef} className="task-subtasks" aria-label="子任务">
    <div {...{ onClose: (event: SyntheticEvent) => event.stopPropagation(), onCancel: (event: SyntheticEvent) => event.stopPropagation() }}>
    <ConfirmationDialog open={discardOpen} onOpenChange={setDiscardOpen} title="放弃未保存的子任务变更？" description="尚未保存的标题、描述、日期、标签和附件将被清除。" color="red" confirmLabel="放弃变更" cancelLabel="继续编辑" onCancel={() => { pendingExit.current = null; setDiscardOpen(false); }} onConfirm={() => {
      const proceed = pendingExit.current;
      pendingExit.current = null;
      close();
      proceed?.();
    }} />
    </div>
    {value.length > 0 && <div className="flex items-center gap-2 pb-1">
      <h2 className="text-sm font-semibold text-fg-black">子任务</h2>
      <span className="text-xs text-fg-grey-700" aria-label="子任务完成进度">{completedCount}/{value.length}</span>
      {completedCount > 0 && <Button color="blue" size="sm" variant="tertiary" className="ml-auto" aria-expanded={showCompleted} onClick={() => setShowCompleted(current => !current)}>{showCompleted ? "隐藏已完成" : `显示已完成（${completedCount}）`}</Button>}
    </div>}
    <SortableSubtasks items={visibleItems} disabled={!!editing} onReorder={(ids) => {
      const sorted = ids.map(id => value.find(item => item.id === id)!);
      let index = 0;
      onChange(value.map(item => ids.includes(item.id) ? sorted[index++] : item));
    }}>{(item, index) => editing === item.id ? <div>{editor}</div> : <div className="task-subtask-row">
      <Checkbox color="blue" checked={item.done} aria-label={`${item.done ? "重新打开" : "完成"}子任务：${item.title}`} onChange={(done) => onChange(value.map((current) => current.id === item.id ? { ...current, done } : current))} />
      <div className="min-w-0 flex-1 py-1">
        <Button color="black" variant="tertiary" data-subtask-open={item.id} className={`subtask-title ${item.done ? "subtask-complete" : ""}`} aria-label={`查看子任务详情：${item.title}`} onClick={() => openDetail(item)}>{item.title}</Button>
        {item.description && <p className="truncate text-xs leading-5 text-fg-grey-700">{richTextPlain(item.description)}</p>}
        <div className="flex flex-wrap gap-x-3 text-xs leading-5 text-fg-grey-700">
          {item.date && <span>{item.date === day() ? "今天" : item.date === day(1) ? "明天" : item.date.slice(5).replace("-", "/")}</span>}
          {item.time && <span>{item.time}</span>}
          {item.repeat && <span>重复</span>}
          {item.priority && item.priority !== "P4" && <span>{item.priority}</span>}
          {item.labels?.map((label) => <span key={label}>@{label}</span>)}
          {!!item.attachments?.length && <span>附件 {item.attachments.length}</span>}
          {!!item.comments?.length && <span>评论 {item.comments.length}</span>}
          {!!item.subtasks?.length && <span>子任务 {item.subtasks.filter((child) => child.done).length}/{item.subtasks.length}</span>}
        </div>
      </div>
      <div className="subtask-row-menu" data-sort-ignore><ContextMenu label={`子任务操作：${item.title}`} items={[
        { label: "查看详情", onSelect: () => openDetail(item) },
        { label: "编辑子任务", onSelect: () => begin(item.id, item.title) },
        { label: "复制子任务", onSelect: () => duplicate(item) },
        ...(index > 0 ? [{ label: "上移", onSelect: () => moveBefore(item.id, visibleItems[index - 1].id) }] : []),
        ...(index < visibleItems.length - 1 ? [{ label: "下移", onSelect: () => moveBefore(visibleItems[index + 1].id, item.id) }] : []),
        { label: "删除子任务", danger: true, onSelect: () => setDeleteId(item.id) },
      ]} /></div>
    </div>}</SortableSubtasks>
    {editing === "new" ? editor : <Button color="blue" variant="tertiary" size="sm" className="subtask-add-trigger" iconLeft={<PlusLinear size={18} />} onClick={() => begin("new")}>添加子任务</Button>}
    <div {...{
      // React forwards native dialog events through the component tree.
      // Keep a child dialog's close/cancel from dismissing an ancestor editor.
      onClose: (event: SyntheticEvent) => {
        event.stopPropagation();
        if (detailId || !(event.target instanceof HTMLDialogElement) || !event.target.classList.contains("subtask-detail-dialog")) return;
        const trigger = [...(sectionRef.current?.querySelectorAll<HTMLButtonElement>("button[data-subtask-open]") ?? [])].find(button => button.dataset.subtaskOpen === lastDetailId.current);
        const fallback = sectionRef.current?.querySelector<HTMLButtonElement>(":scope > .subtask-add-trigger");
        (trigger ?? fallback)?.focus();
      },
      onCancel: (event: SyntheticEvent) => event.stopPropagation(),
    }}>
    <Modal className="subtask-detail-dialog" open={!!detail} onOpenChange={(open) => { if (!open) { selectDetail(null); } }} title="子任务详情">
      {detail && <div className="subtask-detail-layout">
        <div className="subtask-detail-content">
          {saveFailed && <div role="alert" className="text-sm text-fg-red">子任务更改尚未保存到浏览器。{onRetrySave && <Button color="blue" size="sm" variant="tertiary" onClick={onRetrySave}>重试保存</Button>}</div>}
          <div className="flex items-center justify-between gap-3">
          <Button color="blue" size="sm" variant="tertiary" onClick={() => selectDetail(null)}>{parentTitle ? `返回：${parentTitle}` : "返回父任务"}</Button>
          <ContextMenu label="子任务详情操作" items={[
            { label: detail.done ? "重新打开子任务" : "完成子任务", onSelect: () => updateDetail({ done: !detail.done }) },
            { label: "复制子任务", onSelect: () => duplicate(detail) },
            { label: "删除子任务", danger: true, onSelect: () => setDeleteId(detail.id) },
          ]} />
          </div>
        <div className="flex items-start gap-3">
          <div className="pt-2"><Checkbox color="blue" aria-label="子任务已完成" checked={detail.done} onChange={(done) => updateDetail({ done })} /></div>
          <div className="min-w-0 flex-1">
            {editingDetailTitle || editingDetailDescription ? <TaskContentEditor onExitGuardChange={guard => { contentExitGuard.current = guard; }} key={detail.id} child title={detail.title} description={detail.description || ""} focusDescription={editingDetailDescription} onSave={(content) => { updateDetail(content); setEditingDetailTitle(false); setEditingDetailDescription(false); }} onCancel={() => { setEditingDetailTitle(false); setEditingDetailDescription(false); }} /> : <h3><Button color="black" variant="tertiary" className={`task-title-trigger subtask-detail-title${detail.done ? " subtask-complete" : ""}`} aria-label={`编辑子任务名称：${detail.title}`} onClick={() => setEditingDetailTitle(true)}>{detail.title}</Button></h3>}
          </div>
        </div>
        {!editingDetailTitle && !editingDetailDescription && <div className="task-description-display">{detail.description && <MarkdownContent value={detail.description} />}<Button color="black" variant="tertiary" className="task-description-edit" aria-label="编辑子任务描述" onClick={() => setEditingDetailDescription(true)}>{detail.description ? "编辑描述" : "添加描述…"}</Button></div>}
        <section className="flex flex-col gap-2" aria-label="附件">{(detail.attachments?.length ?? 0) > 0 && <h3 className="text-sm font-semibold text-fg-black">附件</h3>}<SubtaskAttachments key={detail.id} value={detail.attachments || []} onChange={(attachments) => updateDetail({ attachments })} /></section>
        <Subtasks draftScope={draftScope ? `${draftScope}:${detail.id}` : undefined} key={detail.id} onExitGuardChange={(guard) => { childExitGuard.current = guard; }} saveFailed={saveFailed} onRetrySave={onRetrySave} detailPath={controlled ? detailPath?.slice(1) : undefined} onDetailPathChange={onDetailPathChange ? (path) => onDetailPathChange([detail.id, ...path]) : undefined} parentTitle={detail.title} availableLabels={labelOptions} value={detail.subtasks || []} onChange={(subtasks) => updateDetail({ subtasks })} />
        <TaskComments draftKey={draftScope ? `${draftScope}:${detail.id}:comments` : undefined} key={`comments:${detail.id}`} label="子任务评论" value={detail.comments || []} onChange={(comments) => updateDetail({ comments })} />
        </div>
        <aside className="subtask-detail-properties">
        {value.length > 1 && <SelectOption color="blue" label="切换子任务" value={detail.id} onChange={(id) => {
          const next = value.find((item) => item.id === id);
          if (next) { openDetail(next); }
        }} options={value.map((item) => ({ value: item.id, label: item.title }))} />}
        <div className="task-property-schedule">
          <div className="task-property-date"><p>日期</p><TaskDateMenu value={detail.date || ""} time={detail.time} repeat={detail.repeat} repeatRule={detail.repeatRule} onScheduleChange={updateDetail} onChange={(date) => updateDetail({ date })} /></div>
          <SelectOption color="blue" label="优先级" value={detail.priority || "P4"} onChange={(priority) => updateDetail({ priority })} options={["P1", "P2", "P3", "P4"].map((value) => ({ value, label: value }))} />
        </div>
        <TaskLabels compact value={detail.labels || []} available={labelOptions} onChange={(labels) => updateDetail({ labels })} />
        <p role="status" className={`text-xs ${saveFailed ? "text-fg-red" : "text-fg-grey-700"}`}>{detail.done ? "已完成" : "待完成"} · {saveFailed ? "更改未保存" : controlled ? "已保存在当前工作空间" : "随父任务一起保存"}</p>
        {!!detail.completionHistory?.length && <div className="space-y-2 text-xs text-fg-grey-700"><p>重复完成记录 · {detail.completionHistory.length}</p>{detail.completionHistory.map((entry, index) => <p key={`${entry.at}:${index}`}>{entry.date} · {new Date(entry.at).toLocaleString("zh-CN")}</p>)}</div>}
        </aside>
      </div>}
    </Modal>
    <ConfirmationDialog open={!!deleteId} onOpenChange={open => { if (!open) setDeleteId(null); }} title="删除这项子任务？" description={`「${value.find(item => item.id === deleteId)?.title || "子任务"}」及其描述、附件、评论和下级子任务将一并移除。`} color="red" onCancel={() => setDeleteId(null)} onConfirm={() => {
      onChange(value.filter(item => item.id !== deleteId));
      if (detailId === deleteId) selectDetail(null);
      setDeleteId(null);
    }} />
    </div>
  </section>;
}
