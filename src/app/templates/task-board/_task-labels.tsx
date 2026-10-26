"use client";

import { useState } from "react";
import { Button, IconButton, SelectOption, TextField } from "@forge-ui-official/core";
import { PlusLinear } from "@forge-ui-official/core/icons";

export function TaskLabels({ value, available, onChange, compact = false }: {
  compact?: boolean;
  value: string[];
  available: string[];
  onChange: (labels: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const add = (raw: string) => {
    const name = raw.trim().replace(/^@+/, "").trim().slice(0, 40);
    if (!name) return;
    const canonical = available.find((label) => label.toLowerCase() === name.toLowerCase()) ?? name;
    if (!value.some((label) => label.toLowerCase() === canonical.toLowerCase())) onChange([...value, canonical]);
    setDraft("");
  };
  const options = available.filter((label) => !value.includes(label));
  return <div className="flex flex-col gap-3" aria-label="任务标签">
    <p className="text-sm text-fg-grey-700">标签</p>
    {value.map((label) => <div key={label} className="flex items-center justify-between gap-2 text-sm text-fg-black">
      <span className="min-w-0 break-words">@{label}</span>
      <Button size="sm" color="blue" variant="tertiary" aria-label={`移除标签：${label}`} onClick={() => onChange(value.filter((item) => item !== label))}>移除</Button>
    </div>)}
    {compact && <Button color="blue" size="sm" variant="tertiary" className="task-property-add" aria-expanded={adding} onClick={() => { setAdding(!adding); if (adding) setDraft(""); }}>{!adding && <PlusLinear size={16} />}{adding ? "收起标签编辑" : "添加标签"}</Button>}
    {(!compact || adding) && <>
    {options.length > 0 && <SelectOption color="blue" width="100%" placeholder="选择已有标签" value="" options={options.map((label) => ({ value: label, label: `@${label}` }))} onChange={add} />}
    <div className="flex items-center gap-2" onKeyDown={(event) => {
      if (event.key === "Enter" && !event.nativeEvent.isComposing) { event.preventDefault(); event.stopPropagation(); add(draft); }
    }}>
      <TextField color="blue" className="min-w-0 flex-1" aria-label="新标签名称" placeholder="新标签名称" maxLength={40} value={draft} onChange={setDraft} />
      <IconButton color="blue" variant="ghost" aria-label="添加标签" disabled={!draft.trim().replace(/^@+/, "").trim()} onClick={() => add(draft)}><PlusLinear size={18} /></IconButton>
    </div>
    </>}
  </div>;
}
