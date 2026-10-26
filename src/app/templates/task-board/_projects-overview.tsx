"use client";

import { useState } from "react";
import { Button, Checkbox, MenuItem, TextField } from "@forge-ui-official/core";
import { FolderBoldDuotone, PlusLinear } from "@forge-ui-official/core/icons";
import type { Board } from "./_data";

export function ProjectsOverview({ board, onOpen, onCreate }: {
  board: Board;
  onOpen: (project: string) => void;
  onCreate: (name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [archived, setArchived] = useState(false);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const cancel = () => { setAdding(false); setName(""); setError(""); };
  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError("请填写项目名称"); return; }
    if (["今天", "收件箱", "即将到来", "已完成"].includes(trimmed)) { setError("请使用与系统视图不同的项目名称"); return; }
    if (board.projects.includes(trimmed)) { setError("项目名称已存在，包括已归档项目"); return; }
    onCreate(trimmed);
    cancel();
  };
  const projects = board.projects.filter(project => !!board.archived?.includes(project) === archived && project.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return <div className="workspace-list-scroll min-h-0 flex-1 overflow-y-auto">
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-8">
      <header><h1 className="text-2xl font-semibold text-fg-black">我的项目</h1><p className="mt-2 text-sm text-fg-grey-700">查看和整理当前工作空间的项目。</p></header>
      <TextField color="blue" aria-label="搜索项目" placeholder="搜索项目" value={query} onChange={setQuery} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-fg-grey-700"><Checkbox color="blue" checked={archived} onChange={value => { setArchived(value); cancel(); }} aria-label="仅显示已归档项目" /><span>仅显示已归档项目</span></label>
        {!archived && <Button color="blue" size="sm" variant="tertiary" iconLeft={<PlusLinear size={18} />} onClick={() => setAdding(true)}>添加项目</Button>}
      </div>
      <section aria-label="工作空间项目列表" className="flex flex-col gap-2">
        <p className="border-b border-fg-grey-200 pb-3 text-sm text-fg-grey-700">{projects.length} 个项目</p>
        {projects.map(project => <div key={project} className="flex items-center gap-3 border-b border-fg-grey-200 py-2">
          <div className="min-w-0 flex-1"><MenuItem accent="blue" label={project} ariaLabel={`打开项目：${project}`} lead={{ kind: "icon", icon: <FolderBoldDuotone size={20} /> }} onClick={() => onOpen(project)} /></div>
          <span className="shrink-0 text-xs text-fg-grey-700">{board.tasks.filter(task => task.project === project && !task.done && !board.sections.find(section => section.id === task.section)?.archived).length} 项待办</span>
        </div>)}
        {!projects.length && <p className="py-8 text-sm text-fg-grey-700">{query.trim() ? "没有找到匹配的项目" : archived ? "还没有已归档项目" : "还没有项目，添加一个开始安排任务。"}</p>}
        {adding && <form aria-label="原位新建项目" className="flex flex-col gap-3 rounded-lg border border-fg-grey-300 p-3" onSubmit={event => { event.preventDefault(); submit(); }} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); cancel(); } }}>
          <TextField color="blue" autoFocus aria-label="项目名称" placeholder="项目名称" value={name} onChange={value => { setName(value); setError(""); }} state={error ? "error" : "idle"} errorMessage={error} />
          <div className="flex justify-end gap-2"><Button color="blue" size="sm" variant="secondary" onClick={cancel}>取消</Button><Button color="blue" size="sm" type="submit">创建项目</Button></div>
        </form>}
      </section>
    </div>
  </div>;
}
