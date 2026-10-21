"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { Button, ConfirmationDialog, TextArea, TextField } from "@forge-ui-official/core";
import { useUnsavedChanges } from "./_use-unsaved-changes";

export function TaskContentEditor({ onExitGuardChange, title, description, child = false, focusDescription = false, onSave, onCancel }: {
  onExitGuardChange?: (guard: ((proceed: () => void) => void) | null) => void;
  title: string;
  description: string;
  child?: boolean;
  focusDescription?: boolean;
  onSave: (content: { title: string; description: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(title);
  const [body, setBody] = useState(description);
  const [discardOpen, setDiscardOpen] = useState(false);
  const pendingExit = useRef<(() => void) | null>(null);
  useUnsavedChanges(name !== title || body !== description);
  const requestExit = (proceed: () => void) => {
    if (name !== title || body !== description) { pendingExit.current = proceed; setDiscardOpen(true); }
    else proceed();
  };
  useEffect(() => {
    onExitGuardChange?.(requestExit);
    return () => onExitGuardChange?.(null);
  });
  const save = () => {
    if (name.trim()) onSave({ title: name.trim(), description: body });
  };
  return <><div {...{ onClose: (event: SyntheticEvent) => event.stopPropagation(), onCancel: (event: SyntheticEvent) => event.stopPropagation() }}><ConfirmationDialog open={discardOpen} onOpenChange={setDiscardOpen} title="放弃未保存的内容？" description="尚未保存的任务名称和描述将被清除。" color="red" confirmLabel="放弃变更" cancelLabel="继续编辑" onCancel={() => { pendingExit.current = null; setDiscardOpen(false); }} onConfirm={() => { const proceed = pendingExit.current; pendingExit.current = null; setDiscardOpen(false); onCancel(); proceed?.(); }} /></div><form aria-label={child ? "编辑子任务内容" : "编辑任务内容"} className="task-title-editor space-y-3" onSubmit={(event) => {
    event.preventDefault(); save();
  }} onKeyDownCapture={(event) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); requestExit(onCancel); }
    if (event.key === "Enter" && event.target instanceof HTMLInputElement) { event.preventDefault(); event.stopPropagation(); save(); }
  }}>
    <TextField color="blue" aria-label={child ? "子任务名称" : "任务名称"} value={name} onChange={setName} autoFocus={!focusDescription} />
    <TextArea color="blue" aria-label={child ? "子任务描述" : "任务描述"} placeholder="添加描述…" rows={3} value={body} onChange={setBody} autoFocus={focusDescription} />
    <div className="flex justify-end gap-2">
      <Button color="blue" size="sm" variant="tertiary" onClick={() => requestExit(onCancel)}>取消</Button>
      <Button color="blue" size="sm" type="submit" disabled={!name.trim()}>保存</Button>
    </div>
  </form></>;
}
