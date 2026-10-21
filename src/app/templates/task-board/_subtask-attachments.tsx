"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@forge-ui-official/core";
import { PlusLinear } from "@forge-ui-official/core/icons";
import { type Subtask } from "./_data";

export function SubtaskAttachments({ value, onChange, onBusyChange, label = "子任务附件" }: {
  value: NonNullable<Subtask["attachments"]>;
  onChange: (files: NonNullable<Subtask["attachments"]>) => void;
  onBusyChange?: (busy: boolean) => void;
  label?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const latest = useRef({ value, onChange, onBusyChange });
  const generation = useRef(0);
  useEffect(() => { latest.current = { value, onChange, onBusyChange }; }, [value, onChange, onBusyChange]);
  useEffect(() => () => { generation.current += 1; latest.current.onBusyChange?.(false); }, []);
  return <section className="flex flex-col gap-2" aria-label={label}>
    {value.map((file) => <div key={file.id} className="flex items-center justify-between gap-3">
      <a className="truncate text-sm text-fg-black underline" href={file.url} download={file.name}>{file.name}</a>
      <Button color="black" variant="tertiary" size="sm" disabled={busy} aria-label={`移除附件：${file.name}`} onClick={() => onChange(value.filter((item) => item.id !== file.id))}>移除</Button>
    </div>)}
    <input type="file" hidden multiple ref={input} aria-label={`选择${label}`} onChange={async (event) => {
      const files = Array.from(event.target.files || []);
      event.target.value = "";
      if (!files.length) return;
      const total = files.reduce((sum, file) => sum + file.size, value.reduce((sum, file) => sum + file.size, 0));
      if (files.some((file) => file.size > 500 * 1024) || total > 1024 * 1024) { setError("每个文件最多 500 KB，附件合计最多 1 MB。"); return; }
      const request = ++generation.current;
      setBusy(true); onBusyChange?.(true); setError("");
      try {
        const added = await Promise.all(files.map(async (file) => ({ id: crypto.randomUUID(), name: file.name, size: file.size, url: await new Promise<string>((resolve, reject) => {
          const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file);
        }) })));
        if (request !== generation.current) return;
        const current = latest.current;
        current.onChange([...current.value, ...added]);
      } catch { if (request === generation.current) setError("文件读取失败，请重新选择。"); }
      finally { if (request === generation.current) { setBusy(false); latest.current.onBusyChange?.(false); } }
    }} />
    <Button color="black" size="sm" variant="tertiary" className="task-attachment-add" disabled={busy} iconLeft={<PlusLinear size={16} />} onClick={() => input.current?.click()}>{busy ? "正在读取…" : "添加附件"}</Button>
    {(value.length > 0 || error) && <p className="text-xs text-fg-grey-700">点击文件名可下载附件。</p>}
    {error && <p role="alert" className="text-xs text-fg-red">{error}</p>}
  </section>;
}
