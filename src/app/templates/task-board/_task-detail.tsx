"use client";

import { useEffect, useRef, useState } from "react";
import {
  Button,
  Breadcrumbs,
  Checkbox,
  IconButton,
  Modal,
  SelectOption,
} from "@forge-ui-official/core";
import { AltArrowUpLinear, AltArrowDownLinear, ArrowLeftLinear } from "@forge-ui-official/core/icons";
import { MarkdownContent } from "./_markdown";
import { TaskMenu } from "./_task-menu";
import { TaskContentEditor } from "./_task-content-editor";
import { TaskComments } from "./_task-comments";
import { Subtasks, type DraftExitGuard } from "./_subtasks";
import { TaskLabels } from "./_task-labels";
import { TaskDateMenu } from "./_task-date-menu";
import { SubtaskAttachments } from "./_subtask-attachments";
import { collectTaskLabels, hasSubtaskPath, projectSections, type Board, type Task } from "./_data";

export function TaskDetail({
  onExitGuardChange,
  task,
  board,
  workspaceName,
  draftScope,
  detailPath,
  onDetailPathChange,
  saveFailed = false,
  onRetrySave,
  onBack,
  backLabel = "返回看板",
  navigationFocus,
  onPrevious,
  onNext,
  onChange,
  onDuplicate,
  onCopyLink,
  onDelete,
}: {
  onExitGuardChange?: (guard: DraftExitGuard | null) => void;
  task: Task;
  board: Board;
  workspaceName: string;
  draftScope: string;
  detailPath: string[];
  onDetailPathChange: (path: string[]) => void;
  saveFailed?: boolean;
  onRetrySave?: () => void;
  navigationFocus?: "previous" | "next";
  onPrevious?: () => void;
  onNext?: () => void;
  onBack: () => void;
  backLabel?: string;
  onChange: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onCopyLink: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const contentExitGuard = useRef<DraftExitGuard | null>(null);
  const subtaskExitGuard = useRef<DraftExitGuard | null>(null);
  useEffect(() => {
    onExitGuardChange?.(proceed => {
      const content = () => contentExitGuard.current ? contentExitGuard.current(proceed) : proceed();
      if (subtaskExitGuard.current) subtaskExitGuard.current(content);
      else content();
    });
    return () => onExitGuardChange?.(null);
  });
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const patch = (value: Partial<Task>) => onChange({ ...task, ...value });
  return (
    <div className="task-detail-page">
      <header className="task-detail-header">
        <div className="flex min-w-0 items-center gap-3">
          <IconButton color="black" variant="ghost" size="sm" shape="square" aria-label={backLabel} title={backLabel} onClick={onBack}><ArrowLeftLinear size={18} /></IconButton>
          <Breadcrumbs color="black" className="task-detail-breadcrumbs" items={[{ label: workspaceName }, { label: task.project, onClick: onBack }, { label: "任务详情" }]} />
        </div>
        <div className="flex items-center gap-2">
          {saveFailed && <span role="status" className="text-xs text-fg-red">更改未保存</span>}
          {saveFailed && onRetrySave && <Button color="blue" size="sm" variant="tertiary" onClick={onRetrySave}>重试保存</Button>}
          <IconButton color="blue" variant="ghost" size="sm" shape="square" autoFocus={!!onPrevious && (navigationFocus === "previous" || (navigationFocus === "next" && !onNext))} aria-label="上一个任务" title="上一个任务" disabled={!onPrevious} onClick={onPrevious}><AltArrowUpLinear size={18} /></IconButton>
          <IconButton color="blue" variant="ghost" size="sm" shape="square" autoFocus={!!onNext && (navigationFocus === "next" || (navigationFocus === "previous" && !onPrevious))} aria-label="下一个任务" title="下一个任务" disabled={!onNext} onClick={onNext}><AltArrowDownLinear size={18} /></IconButton>
          <TaskMenu
            task={task}
            board={board}
            onPatch={patch}
            label="任务详情操作"
            items={[
              { label: task.done ? "重新打开任务" : "完成任务", onSelect: () => patch({ done: !task.done }) },
              { label: "复制任务", onSelect: () => onDuplicate(task) },
              { label: "复制任务链接", onSelect: () => onCopyLink(task) },
              { label: "查看活动", onSelect: () => setActivityOpen(true) },
              {
                label: "删除任务",
                danger: true,
                onSelect: () => onDelete(task),
              },
            ]}
          />
        </div>
      </header>
      <div className="task-detail-body">
        <main className="task-detail-main">
          <div className="flex items-start gap-3">
            <Checkbox
              color="blue"
              aria-label="标记任务完成"
              checked={task.done}
              onChange={(done) => patch({ done })}
            />
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-xs text-fg-grey-700">
                {board.sections.find((s) => s.id === task.section)?.title} ·{" "}
                {task.done ? "已完成" : "待完成"}
              </p>
              {editingTitle || editingDescription ? <TaskContentEditor onExitGuardChange={guard => { contentExitGuard.current = guard; }} title={task.title} description={task.description} focusDescription={editingDescription} onSave={(content) => { patch(content); setEditingTitle(false); setEditingDescription(false); }} onCancel={() => { setEditingTitle(false); setEditingDescription(false); }} /> : <h1 className={task.done ? "line-through" : ""}>
                <Button color="black" variant="tertiary" className="task-title-trigger" aria-label={`编辑任务名称：${task.title}`} onClick={() => setEditingTitle(true)}>{task.title}</Button>
              </h1>}
              {task.done && <p className="mt-2 text-xs text-fg-grey-700">{task.completedAt ? `完成于 ${new Date(task.completedAt).toLocaleString("zh-CN", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}` : "完成时间未记录"}</p>}
            </div>
          </div>
              {!editingTitle && !editingDescription && <section className="task-detail-section">
                <div className="task-description-display">{task.description && <MarkdownContent value={task.description} />}<Button color="black" variant="tertiary" className="task-description-edit" aria-label="编辑任务描述" onClick={() => setEditingDescription(true)}>{task.description ? "编辑描述" : "添加描述…"}</Button></div>
              </section>}
              <section className="task-detail-section" aria-label="任务附件区域">{(task.attachments?.length ?? 0) > 0 && <h2>附件</h2>}<SubtaskAttachments label="任务附件" value={task.attachments || []} onChange={(attachments) => patch({ attachments })} /></section>
              {!hasSubtaskPath(task, detailPath) && <div role="status" className="mb-3 text-sm text-fg-grey-700">子任务不存在或已被删除。<Button color="blue" size="sm" variant="tertiary" onClick={() => onDetailPathChange([])}>返回主任务</Button></div>}
              <Subtasks draftScope={draftScope} onExitGuardChange={guard => { subtaskExitGuard.current = guard; }} saveFailed={saveFailed} onRetrySave={onRetrySave} detailPath={hasSubtaskPath(task, detailPath) ? detailPath : []} onDetailPathChange={onDetailPathChange} availableLabels={collectTaskLabels(board.tasks)} value={task.subtasks} onChange={(subtasks) => patch({ subtasks })} />
          <TaskComments draftKey={`${draftScope}:comments`} value={task.comments} onChange={(comments) => patch({ comments })} />

        </main>
        <aside className="task-detail-aside" aria-label="任务属性">
          <h2 className="text-sm font-semibold text-fg-black">任务属性</h2>
          <SelectOption
            color="blue"
            label="所属项目"
            options={["收件箱", ...board.projects].map((p) => ({
              value: p,
              label: p,
            }))}
            value={task.project}
            onChange={(project) => patch({ project, section: projectSections(board, project)[0]?.id ?? "" })}
          />
          <SelectOption
            color="blue"
            label="所在分区"
            options={projectSections(board, task.project).map((s) => ({
              value: s.id,
              label: s.title,
            }))}
            value={task.section}
            onChange={(section) => patch({ section })}
          />
          <SelectOption
            color="blue"
            label="优先级"
            options={[
              { value: "1", label: "P1 · 优先处理" },
              { value: "2", label: "P2 · 重要" },
              { value: "3", label: "P3 · 常规" },
              { value: "4", label: "P4 · 无优先级" },
            ]}
            value={task.priority}
            onChange={(priority) => patch({ priority })}
          />
          <div className="task-property-date"><p>日期</p><TaskDateMenu value={task.date} time={task.time} repeat={task.repeat} repeatRule={task.repeatRule} onScheduleChange={patch} onChange={(date) => patch({ date })} label="截止日期" /></div>
          <SelectOption
            color="blue"
            label="负责人"
            options={["林晓", "陈一", "周可"].map((p) => ({
              value: p,
              label: p,
            }))}
            value={task.owner}
            onChange={(owner) => patch({ owner })}
          />
          <TaskLabels compact value={task.labels ?? []} available={collectTaskLabels(board.tasks)} onChange={(labels) => patch({ labels })} />
          <div className="border-t border-fg-grey-200 pt-5">
            <Button
              color="blue"
              variant="secondary"
              onClick={() => patch({ done: !task.done })}
            >
              {task.done ? "重新打开任务" : "完成任务"}
            </Button>
            <p className="mt-3 text-xs leading-5 text-fg-grey-700">
            {saveFailed ? "未保存的更改暂留当前页面，请先重试保存或导出备份。" : "更改保存在当前工作空间，可返回任务视图继续安排。"}
            </p>
          </div>
        </aside>
      </div>
      <Modal open={activityOpen} onOpenChange={setActivityOpen} title="任务活动">
          <section className="task-detail-section" aria-label="任务活动">
            {!task.activity?.length && <p className="text-sm text-fg-grey-700">暂无活动记录。后续修改会显示在这里。</p>}
            {task.activity?.slice().reverse().map((entry) => <div key={entry.id} className="flex items-start justify-between gap-4 border-b border-fg-grey-200 py-2 text-sm">
              <span className="text-fg-black">{entry.text}</span>
              <time className="shrink-0 text-xs text-fg-grey-700" dateTime={entry.at}>{new Date(entry.at).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</time>
            </div>)}
          </section>
      </Modal>
    </div>
  );
}
