"use client";

import { useEffect, useId, useImperativeHandle, useRef, useState, type Ref } from "react";
import { Button, CommentItem, TextArea } from "@forge-ui-official/core";
import { AltArrowDownLinear } from "@forge-ui-official/core/icons";
import { validAttachments, type TaskComment, type TaskAttachment } from "./_data";
import { useUnsavedChanges } from "./_use-unsaved-changes";
import { ContextMenu } from "./_context-menu";
import { SubtaskAttachments } from "./_subtask-attachments";
import { CommentEmoji } from "./_comment-emoji";

type CommentDraft = { text: string; files: TaskAttachment[]; editing: string | null };
// Session storage survives refresh while keeping drafts scoped to this tab.
const commentDrafts = new Map<string, CommentDraft>();
const storageKey = (key: string) => `forge:task-board:comment-draft:${key}`;
function readDraft(key?: string): CommentDraft | undefined {
  if (!key) return;
  const cached = commentDrafts.get(key);
  if (cached) return cached;
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(storageKey(key)) || "null");
    if (!saved || typeof saved !== "object") return;
    const draft = saved as Partial<CommentDraft>;
    if (typeof draft.text === "string" && validAttachments(draft.files) && (draft.editing === null || typeof draft.editing === "string")) return draft as CommentDraft;
  } catch { /* Keep the in-memory fallback when session storage is unavailable. */ }
}

type ComposerHandle = { reply: (quote: string) => void };
function CommentComposer({ draftKey, comment, legacyDraft, onSubmit, onClose, ref }: {
  draftKey?: string;
  comment?: TaskComment;
  legacyDraft?: CommentDraft;
  onSubmit: (comment: TaskComment) => void;
  onClose?: () => void;
  ref?: Ref<ComposerHandle>;
}) {
  const [initialDraft] = useState(() => (comment ? readDraft(draftKey) ?? legacyDraft : (() => { const draft = readDraft(draftKey); return draft?.editing ? undefined : draft; })()));
  const [text, setText] = useState(initialDraft?.text ?? comment?.text ?? "");
  const [files, setFiles] = useState<TaskAttachment[]>(initialDraft?.files ?? comment?.attachments ?? []);
  const editing = comment?.id ?? null;
  const [draftStorageFailed, setDraftStorageFailed] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(0);
  useUnsavedChanges(draftStorageFailed && !!(text || files.length));
  const [busy, setBusy] = useState(false);
  const [generation, setGeneration] = useState(0);
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!draftKey) return;
    let cancelled = false;
    let failed = false;
    const dirty = text || files.length;
    if (dirty) commentDrafts.set(draftKey, { text, files, editing });
    else commentDrafts.delete(draftKey);
    try {
      if (dirty) sessionStorage.setItem(storageKey(draftKey), JSON.stringify({ text, files, editing }));
      else sessionStorage.removeItem(storageKey(draftKey));
    } catch { failed = !!dirty; }
    // Report the external storage result after this synchronization completes.
    queueMicrotask(() => { if (!cancelled) setDraftStorageFailed(failed); });
    return () => { cancelled = true; };
  }, [draftKey, text, files, editing, saveAttempt]);
  const clear = () => { if (draftKey) { commentDrafts.delete(draftKey); try { sessionStorage.removeItem(storageKey(draftKey)); } catch { /* Storage may be unavailable. */ } } setText(""); setFiles([]);  setBusy(false); setGeneration(current => current + 1); onClose?.(); };
  useImperativeHandle(ref, () => ({ reply(quote: string) { setText(current => current.trim() ? `${current}\n${quote}` : quote); input.current?.focus(); } }));
  return <div className="flex min-w-0 flex-col gap-3" role="group" aria-label={comment ? "编辑已有评论" : "添加新评论"}>
    <TextArea ref={input} color="black" autoFocus={!!comment} aria-label="评论内容" label={editing ? "编辑评论" : undefined} placeholder="写下进展或补充信息…" rows={2} value={text} onChange={setText} />
    {draftStorageFailed && <div role="alert" className="flex flex-col items-start gap-2">
      <p className="text-sm text-fg-red">评论草稿尚未保存。文字和附件仍保留在当前页面；刷新前请复制文字，并点击附件名称下载备份。</p>
      <Button color="black" size="sm" variant="tertiary" disabled={busy} onClick={() => setSaveAttempt(current => current + 1)}>重试保存草稿</Button>
    </div>}
    <div className="flex flex-wrap items-start gap-2">
      <SubtaskAttachments key={generation} label="评论附件" value={files} onChange={setFiles} onBusyChange={setBusy} />
      <CommentEmoji onSelect={(emoji) => {
        const start = input.current?.selectionStart ?? text.length;
        const end = input.current?.selectionEnd ?? start;
        setText(`${text.slice(0, start)}${emoji}${text.slice(end)}`);
        requestAnimationFrame(() => { input.current?.focus(); input.current?.setSelectionRange(start + emoji.length, start + emoji.length); });
      }} />
    </div>
    <div className="flex justify-end gap-2">
      {(editing || text || files.length > 0) && <Button color="black" size="sm" variant="tertiary" onClick={clear}>{editing ? "取消编辑" : "取消"}</Button>}
      <Button color="black" size="sm" disabled={busy || (!text.trim() && !files.length)} onClick={() => {
        if (busy || (!text.trim() && !files.length)) return;
        onSubmit(comment ? { ...comment, text: text.trim(), attachments: files } : { id: crypto.randomUUID(), author: "林晓", at: new Date().toISOString(), text: text.trim(), attachments: files }); clear();
      }}>{busy ? "正在读取…" : editing ? "保存评论" : "发布评论"}</Button>
    </div>
  </div>;
}

export function TaskComments({ draftKey, value, onChange, label = "任务评论", emptyText = "记录进展或补充资料，让讨论留在任务中。" }: {
  draftKey?: string;
  value: (string | TaskComment)[];
  onChange: (comments: TaskComment[]) => void;
  label?: string;
  emptyText?: string;
}) {
  const comments = value.map((entry, index): TaskComment => {
    if (typeof entry !== "string") return entry;
    const separator = entry.indexOf("：");
    return { id: `legacy-comment-${index}`, author: separator < 0 ? "团队成员" : entry.slice(0, separator), text: separator < 0 ? entry : entry.slice(separator + 1) };
  });
  const [collapsed, setCollapsed] = useState(false);
  const [legacyDraft, setLegacyDraft] = useState(() => readDraft(draftKey));
  const [editing, setEditing] = useState<string | null>(() => {
    let selected = legacyDraft?.editing;
    try { selected = (draftKey && sessionStorage.getItem(`${storageKey(draftKey)}:active-edit`)) || selected; } catch { /* Individual edit drafts remain available in memory. */ }
    return selected && comments.some(comment => comment.id === selected) ? selected : null;
  });
  useEffect(() => {
    if (!draftKey) return;
    try {
      if (editing) sessionStorage.setItem(`${storageKey(draftKey)}:active-edit`, editing);
      else sessionStorage.removeItem(`${storageKey(draftKey)}:active-edit`);
    } catch { /* The editor itself reports draft storage failures. */ }
  }, [draftKey, editing]);
  const [copyMessage, setCopyMessage] = useState("");
  const input = useRef<ComposerHandle>(null);
  const contentId = useId();
  return <section className="task-detail-section flex flex-col gap-3" aria-label={label}>
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-sm font-semibold text-fg-black"><Button color="black" size="sm" variant="tertiary" className="task-comments-toggle" aria-label={collapsed ? "展开评论" : "收起评论"} aria-expanded={!collapsed} aria-controls={contentId} onClick={() => setCollapsed(!collapsed)}><span aria-hidden className={collapsed ? "task-comments-chevron collapsed" : "task-comments-chevron"}><AltArrowDownLinear size={16} /></span>评论</Button></h3>
      <span className="text-xs text-fg-grey-700">{comments.length} 条评论</span>
    </div>
    <div id={contentId} hidden={collapsed} className="task-comments-content"><>
      {!comments.length && <p className="text-sm text-fg-grey-700">{emptyText}</p>}
      {comments.map((comment, index) => <div key={comment.id} className="task-detail-comment flex items-start gap-2">
        <div className="min-w-0 flex-1">
          {editing === comment.id ? <CommentComposer key={comment.id} draftKey={draftKey ? `${draftKey}:edit:${comment.id}` : undefined} comment={comment} legacyDraft={legacyDraft?.editing === comment.id ? legacyDraft : undefined} onSubmit={updated => onChange(comments.map(entry => entry.id === updated.id ? updated : entry))} onClose={() => { setEditing(null); setLegacyDraft(undefined); }} /> : <>
            <CommentItem className="w-full min-w-0" avatar="/images/protask/crm/john-hoegan-avatar.png" name={comment.author || "林晓"}
              date={comment.at ? new Date(comment.at).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "时间未记录"}
              content={comment.text} onReply={() => input.current?.reply(`回复「${comment.text.slice(0, 40) || "附件"}」：`)} />
            {!!comment.attachments?.length && <div className="mt-2 flex flex-col gap-2" aria-label={`评论 ${index + 1} 的附件`}>
              {comment.attachments.map(file => <a key={file.id} className="truncate text-sm text-fg-black underline" href={file.url} download={file.name}>{file.name}</a>)}
            </div>}
          </>}
        </div>
        <ContextMenu label={`评论操作 ${index + 1}`} items={[
          { label: "编辑评论", onSelect: () => setEditing(comment.id) },
          { label: "复制文本", onSelect: async () => { try { await navigator.clipboard.writeText(comment.text); setCopyMessage("评论文本已复制"); } catch { setCopyMessage("未能复制评论，请选中文字后复制。"); } } },
          { label: "删除评论", danger: true, onSelect: () => { onChange(comments.filter(entry => entry.id !== comment.id)); if (editing === comment.id) setEditing(null); } },
        ]} />
      </div>)}
      {copyMessage && <p role="status" className="text-sm text-fg-grey-700">{copyMessage}</p>}
      <CommentComposer ref={input} draftKey={draftKey} onSubmit={comment => onChange([...comments, comment])} />
    </> </div>
  </section>;
}
