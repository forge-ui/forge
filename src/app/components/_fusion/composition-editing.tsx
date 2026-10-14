"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion as m, useReducedMotion } from "motion/react";
import { AgentCodeBlock, Button, IconButton, StreamingAnswer, SurfaceCard, TextArea, TextField, Toolbar } from "@forge-ui-official/core";
import { ArrowLeftLinear, ArrowRightLinear, CloseCircleLinear, RestartCircleLinear } from "@forge-ui-official/core/icons";
import type { FusionSettings } from "./types";

const initialCode = ["function grow(seed) {", "  const light = 8;", "  return seed + light;", "}", "", "function water() {", "  return 'moist enough';", "}"];

export function CodeFoldingExample({ locale, color, motion }: FusionSettings) {
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const zh = locale === "zh";
  return <div className="flex w-full flex-col gap-3">
    <div className="flex flex-wrap gap-2">
      <Button motion={motion} size="sm" color={color} variant="secondary" onClick={() => setCollapsed(["grow", "water"])}>{zh ? "全部折叠" : "Fold all"}</Button>
      <Button motion={motion} size="sm" color={color} variant="tertiary" onClick={() => setCollapsed([])}>{zh ? "全部展开" : "Expand all"}</Button>
    </div>
    <AgentCodeBlock filename="garden.ts" locale={locale} lines={initialCode} foldRanges={[{ id: "grow", startLine: 1, endLine: 4, label: "grow" }, { id: "water", startLine: 6, endLine: 8, label: "water" }]} collapsedRangeIds={collapsed} onCollapsedRangeIdsChange={setCollapsed} />
  </div>;
}

export function MarkdownExample({ locale, color, motion }: FusionSettings) {
  const zh = locale === "zh";
  const [source, setSource] = useState(zh ? "# 一座小花园\n\n**今天的记录**\n\n- 给罗勒浇水\n- 长出了两片新叶" : "# A small garden\n\n**Today's notes**\n\n- Water the basil\n- Two new leaves");
  const [editing, setEditing] = useState(false);
  const reduced = useReducedMotion();
  const editor = useRef<HTMLTextAreaElement>(null);
  return <SurfaceCard title={zh ? "花园笔记" : "Garden notes"} action={<Button motion={motion} size="sm" color={color} variant="secondary" aria-pressed={editing} onClick={() => setEditing(!editing)}>{editing ? (zh ? "预览" : "Preview") : (zh ? "编辑" : "Edit")}</Button>}>
    <AnimatePresence mode="wait" initial={false}>
      <m.div key={editing ? "edit" : "preview"} initial={{ opacity: 0, y: reduced || motion === "none" ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced || motion === "none" ? 0 : .18 }}>
        {editing ? <TextArea ref={editor} autoFocus label={zh ? "Markdown 内容" : "Markdown content"} color={color} value={source} rows={8} onChange={setSource} onKeyDown={event => { if (event.key === "Escape") setEditing(false); }} /> : <StreamingAnswer text={source} status="complete" format="markdown" duration={0} motion={motion} />}
      </m.div>
    </AnimatePresence>
  </SurfaceCard>;
}

export function DiffReviewExample({ locale, color, motion }: FusionSettings) {
  const zh = locale === "zh";
  const [decision, setDecision] = useState<"pending" | "accept" | "keep">("pending");
  const before = ["function waterGarden() {", "  return 7;", "}"];
  const after = ["function waterGarden() {", "  return 3;", "}"];
  return <div className="flex w-full flex-col gap-4">
    <AgentCodeBlock filename="garden.ts" locale={locale} lines={decision === "accept" ? after : before}
      view={decision === "pending" ? "diff" : "code"}
      diff={decision === "pending" ? [{ old: 1, cur: 1, type: "ctx", pieces: [{ text: before[0] }] }, { old: 2, cur: null, type: "del", pieces: [{ text: before[1], change: "del" }] }, { old: null, cur: 2, type: "add", pieces: [{ text: after[1], change: "add" }] }, { old: 3, cur: 3, type: "ctx", pieces: [{ text: "}" }] }] : undefined} />
    <div className="flex flex-wrap items-center gap-2">
      {decision === "pending" ? <><Button motion={motion} size="sm" color={color} onClick={() => setDecision("accept")}>{zh ? "接受变更" : "Accept change"}</Button><Button motion={motion} size="sm" color="black" variant="tertiary" onClick={() => setDecision("keep")}>{zh ? "保留原文" : "Keep original"}</Button></> : <Button motion={motion} size="sm" color={color} variant="tertiary" onClick={() => setDecision("pending")}>{zh ? "撤销决定" : "Undo decision"}</Button>}
      <span role="status" className="text-sm text-fg-grey-700">{decision === "pending" ? (zh ? "1 处变更待审核" : "1 change to review") : decision === "accept" ? (zh ? "已接受变更" : "Change accepted") : (zh ? "已保留原文" : "Original retained")}</span>
    </div>
  </div>;
}

export function FindReplaceExample({ locale, color, motion }: FusionSettings) {
  const zh = locale === "zh";
  const [text, setText] = useState(zh ? "阳光照进小花园。\n我们在花园里发现了新叶。\n明天还要继续照料花园。" : "Sunlight reached the small garden.\nWe found new leaves in the garden.\nWe will tend the garden again tomorrow.");
  const [find, setFind] = useState(zh ? "花园" : "garden");
  const [replacement, setReplacement] = useState(zh ? "庭院" : "courtyard");
  const [previous, setPrevious] = useState<string | null>(null);
  const parts = find ? text.split(find) : [text];
  const count = parts.length - 1;
  return <SurfaceCard title={zh ? "查找与替换" : "Find and replace"}>
    <div className="flex flex-col gap-4">
      <TextField label={zh ? "查找" : "Find"} value={find} color={color} onChange={setFind} />
      <TextField label={zh ? "替换为" : "Replace with"} value={replacement} color={color} onChange={setReplacement} />
      <p className="whitespace-pre-wrap text-sm leading-7 text-fg-grey-900">{parts.map((part, index) => <span key={index}>{index > 0 && <mark className="rounded bg-fg-yellow-100 text-fg-black">{find}</mark>}{part}</span>)}</p>
      <div className="flex flex-wrap items-center gap-2"><Button motion={motion} size="sm" color={color} disabled={!count} onClick={() => { setPrevious(text); setText(parts.join(replacement)); }}>{zh ? "全部替换" : "Replace all"}</Button><Button motion={motion} size="sm" color="black" variant="tertiary" disabled={previous === null} onClick={() => { if (previous !== null) setText(previous); setPrevious(null); }}>{zh ? "撤销" : "Undo"}</Button><span role="status" className="text-sm text-fg-grey-700">{count} {zh ? "处匹配" : "matches"}</span></div>
    </div>
  </SurfaceCard>;
}

export function TextAssemblyExample({ locale, color, motion }: FusionSettings) {
  const zh = locale === "zh";
  const snippets = zh ? ["微小的想法", "相互连接", "成长为", "更大的可能。"] : ["Small ideas", "link together", "and grow into", "bigger possibilities."];
  const [selected, setSelected] = useState<number[]>([]);
  const reduced = useReducedMotion();
  return <SurfaceCard title={zh ? "拼接文字片段" : "Assemble text clips"}>
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">{snippets.map((text, index) => <Button motion={motion} key={index} size="sm" variant={selected.includes(index) ? "secondary" : "tertiary"} color={color} aria-pressed={selected.includes(index)} onClick={() => setSelected(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index])}>{text}</Button>)}</div>
      <m.div layout transition={{ duration: reduced || motion === "none" ? 0 : .25 }} className="flex min-h-24 items-center justify-between gap-3 rounded-xl border border-fg-grey-200 p-4">
        <p role="status" className="text-sm leading-7 text-fg-black">{selected.length ? selected.map(i => snippets[i]).join(zh ? "" : " ") : (zh ? "按选择顺序拼接，点击已选片段可移除。" : "Pick clips in order. Select again to remove.")}</p>
        <IconButton motion={motion} size="sm" color={color} variant="ghost" disabled={!selected.length} aria-label={zh ? "清空片段" : "Clear clips"} onClick={() => setSelected([])}><CloseCircleLinear size={18} /></IconButton>
      </m.div>
    </div>
  </SurfaceCard>;
}

type Shape = { radius: number; angle: number; tone: number; edits: number };
export function UndoHistoryExample({ locale, color, motion }: FusionSettings) {
  const zh = locale === "zh";
  const [history, setHistory] = useState<Shape[]>([{ radius: 12, angle: 0, tone: 0, edits: 0 }]);
  const [cursor, setCursor] = useState(0);
  const reduced = useReducedMotion();
  const current = history[cursor];
  const colors = [color === "blue" ? "var(--fg-blue)" : color === "purple" ? "var(--fg-violet)" : "var(--fg-black)", "var(--fg-yellow-700)", "var(--fg-green-500)"];
  function edit() {
    const next = { ...current };
    const step = current.edits % 3;
    next.edits += 1;
    if (step === 0) next.radius = current.radius === 46 ? 12 : 46;
    if (step === 1) next.angle = (current.angle + 30) % 90;
    if (step === 2) next.tone = (current.tone + 1) % colors.length;
    const stack = [...history.slice(0, cursor + 1), next].slice(-12);
    setHistory(stack); setCursor(stack.length - 1);
  }
  return <SurfaceCard title={zh ? "形状编辑记录" : "Shape edit history"}>
    <div className="flex flex-col gap-4">
      <div className="flex h-40 items-center justify-center"><m.div className="size-24" animate={{ borderRadius: current.radius, rotate: current.angle, backgroundColor: colors[current.tone] }} transition={{ duration: reduced || motion === "none" ? 0 : .25 }} /></div>
      <Toolbar left={<><IconButton motion={motion} size="sm" color={color} variant="tertiary" aria-label={zh ? "撤销" : "Undo"} disabled={!cursor} onClick={() => setCursor(cursor - 1)}><ArrowLeftLinear size={18} /></IconButton><Button motion={motion} size="sm" color={color} onClick={edit}>{zh ? "变换形状" : "Transform shape"}</Button><IconButton motion={motion} size="sm" color={color} variant="tertiary" aria-label={zh ? "重做" : "Redo"} disabled={cursor === history.length - 1} onClick={() => setCursor(cursor + 1)}><ArrowRightLinear size={18} /></IconButton></>} />
      <p role="status" className="text-xs text-fg-grey-500">{cursor + 1} / {history.length} · {zh ? "更改后会清除后续重做记录" : "A new edit discards the redo branch"}</p>
    </div>
  </SurfaceCard>;
}

export function VersionHistoryExample({ locale, color, motion }: FusionSettings) {
  const zh = locale === "zh";
  const [selected, setSelected] = useState(2);
  const [live, setLive] = useState(2);
  const reduced = useReducedMotion();
  const versions = [{ title: zh ? "静谧的形状" : "Quiet forms", radius: "22%", angle: -12 }, { title: zh ? "重新发现秩序" : "Find a new order", radius: "50%", angle: 8 }, { title: zh ? "让设计更清晰" : "Make design clear", radius: "50%", angle: 0 }];
  return <SurfaceCard title={zh ? "版本预览" : "Version preview"}>
    <div className="flex flex-col gap-4">
      <m.div className="flex min-h-44 flex-col items-center justify-center gap-4 rounded-xl bg-fg-grey-50 p-5" animate={{ rotate: versions[selected].angle }} transition={{ duration: reduced || motion === "none" ? 0 : .25 }}>
        <m.div className="size-14" animate={{ borderRadius: versions[selected].radius }} transition={{ duration: reduced || motion === "none" ? 0 : .25 }} style={{ background: color === "purple" ? "var(--fg-violet)" : color === "black" ? "var(--fg-black)" : "var(--fg-blue)" }} />
        <p className="text-lg font-semibold text-fg-black">{versions[selected].title}</p>
      </m.div>
      <div className="flex flex-wrap gap-2">{versions.map((_, index) => <Button motion={motion} key={index} size="sm" color={color} variant={selected === index ? "primary" : "tertiary"} aria-pressed={selected === index} onClick={() => setSelected(index)}>v{index + 1}{live === index ? (zh ? " · 当前" : " · Current") : ""}</Button>)}</div>
      <Button motion={motion} size="sm" variant="secondary" color={color} iconLeft={<RestartCircleLinear size={16} />} disabled={selected === live} onClick={() => setLive(selected)}>{selected === live ? (zh ? "当前版本" : "Current version") : (zh ? "恢复此版本" : "Restore this version")}</Button>
    </div>
  </SurfaceCard>;
}
