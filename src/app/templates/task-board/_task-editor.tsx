"use client";
import { useState } from "react";
import {
  Button,
  Checkbox,
  Modal,
  SelectOption,
  TextArea,
  TextField,
} from "@forge-ui-official/core";
import { TaskComments } from "./_task-comments";
import { Subtasks } from "./_subtasks";
import { TaskLabels } from "./_task-labels";
import { TaskDateMenu } from "./_task-date-menu";
import { SubtaskAttachments } from "./_subtask-attachments";
import { collectTaskLabels, projectSections, type Board, type Task } from "./_data";

export function TaskEditor({
  task,
  board,
  onClose,
  onSave,
  onDelete,
}: {
  task: Task;
  board: Board;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const [draft, setDraft] = useState(task);
  const [error, setError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const patch = (value: Partial<Task>) =>
    setDraft((current) => ({ ...current, ...value }));
  const save = () => {
    if (uploading) return;
    if (!draft.title.trim()) {
      setError(true);
      return;
    }
    onSave({ ...draft, title: draft.title.trim() });
  };
  return (
    <Modal
      open
      className="task-editor-dialog"
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={
        board.tasks.some((t) => t.id === task.id) ? "编辑任务" : "添加任务"
      }
      footer={
        <>
          {board.tasks.some((t) => t.id === task.id) && (
            <Button
              variant="tertiary"
              color="red"
              onClick={() => onDelete(task)}
            >
              删除任务
            </Button>
          )}
          <Button variant="secondary" color="black" onClick={onClose}>
            取消
          </Button>
          <Button color="black" onClick={save} disabled={uploading}>
            保存任务
          </Button>
        </>
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
        className="task-editor-layout"
      >
        <div className="task-editor-content">
        <TextField color="black"
          autoFocus
          label="任务名称"
          placeholder="接下来想完成什么？"
          value={draft.title}
          onChange={(title) => {
            patch({ title });
            setError(false);
          }}
          state={error ? "error" : "idle"}
          errorMessage={error ? "请填写任务名称" : undefined}
        />
        <TextArea color="black"
          label="描述"
          value={draft.description}
          onChange={(description) => patch({ description })}
          rows={2}
        />

        <TaskLabels value={draft.labels ?? []} available={collectTaskLabels([...board.tasks, draft])} onChange={(labels) => patch({ labels })} />
        <SubtaskAttachments label="任务附件" value={draft.attachments || []} onChange={(attachments) => patch({ attachments })} onBusyChange={setUploading} />
        <Subtasks availableLabels={collectTaskLabels([...board.tasks, draft])} value={draft.subtasks} onChange={(subtasks) => patch({ subtasks })} />
        <TaskComments value={draft.comments} onChange={(comments) => patch({ comments })} />
        <p className="text-xs text-fg-grey-700">子任务与讨论将在保存任务后保留。</p>
        </div>
        <aside className="task-editor-properties">
          <SelectOption color="black"
            label="所属项目"
            options={["收件箱", ...board.projects].map((p) => ({ value: p, label: p }))}
            value={draft.project}
            onChange={(project) => patch({ project, section: projectSections(board, project)[0]?.id ?? "" })}
          />
          <SelectOption color="black"
            label="所在分区"
            options={projectSections(board, draft.project).map((s) => ({
              value: s.id,
              label: s.title,
            }))}
            value={draft.section}
            onChange={(section) => patch({ section })}
          />
          <SelectOption color="black"
            label="优先级"
            options={[
              { value: "1", label: "P1 · 优先处理" },
              { value: "2", label: "P2 · 重要" },
              { value: "3", label: "P3 · 常规" },
              { value: "4", label: "P4 · 无优先级" },
            ]}
            value={draft.priority}
            onChange={(priority) => patch({ priority })}
          />
          <TaskDateMenu value={draft.date} time={draft.time} repeat={draft.repeat} repeatRule={draft.repeatRule} onScheduleChange={patch} onChange={(date) => patch({ date })} label="截止日期" />
          <SelectOption color="black"
            label="负责人"
            options={["林晓", "陈一", "周可"].map((p) => ({
              value: p,
              label: p,
            }))}
            value={draft.owner}
            onChange={(owner) => patch({ owner })}
          />
          <label className="flex items-center gap-3 text-sm text-fg-black">
            <Checkbox color="black"
              checked={draft.done}
              onChange={(done) => patch({ done })}
            />
            任务已完成
          </label>
        </aside>
      </form>
    </Modal>
  );
}
