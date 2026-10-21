"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Datepicker, DropdownDivider, DropdownPanel, IconButton, MenuItem, type KebabMenuItem } from "@forge-ui-official/core";
import { MenuDotsBold } from "@forge-ui-official/core/icons";
import { day, projectSections, type Board, type Task } from "./_data";

export function TaskMenu({ task, board, items, onPatch, label }: {
  label?: string;
  task: Task;
  board: Board;
  items: KebabMenuItem[];
  onPatch: (patch: Partial<Task>) => void;
}) {
  const id = useId();
  const trigger = useRef<HTMLDivElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<"main" | "schedule" | "priority" | "projects" | "sections">("main");
  const [project, setProject] = useState(task.project);
  const [position, setPosition] = useState({ left: 0, top: 0, maxHeight: 420 });
  const scheduleTop = Math.max(12, Math.min(position.top, position.top + position.maxHeight - 568));
  const close = () => { popup.current?.hidePopover(); trigger.current?.querySelector("button")?.focus(); };
  const chooseDate = (date: string) => {
    onPatch({ date, time: date ? task.time : undefined, repeat: date ? task.repeat : undefined, repeatAnchor: date && task.repeat ? Number(date.slice(8)) : undefined, repeatRule: date ? task.repeatRule : undefined });
    close();
  };
  const choosePriority = (priority: string) => { onPatch({ priority }); close(); };
  useEffect(() => {
    if (open) popup.current?.querySelector("button")?.focus();
  }, [open, panel]);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: Event) => {
      if (event.target instanceof Node && popup.current?.contains(event.target)) return;
      popup.current?.hidePopover();
    };
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => { window.removeEventListener("scroll", dismiss, true); window.removeEventListener("resize", dismiss); };
  }, [open]);
  const entry = (item: KebabMenuItem) => <MenuItem key={item.label} label={item.label} ariaLabel={item.label} accent="blue" intent={item.danger ? "danger" : "default"} onClick={() => { close(); item.onSelect?.(); }} />;
  return <div ref={trigger} data-no-drag className="task-menu-anchor">
    <IconButton color="blue" variant="ghost" size="sm" aria-label={label ?? `任务菜单：${task.title}`} aria-haspopup="dialog" aria-controls={id} aria-expanded={open} onClick={() => {
      if (open) { close(); return; }
      const rect = trigger.current!.getBoundingClientRect();
      const top = Math.max(12, Math.min(rect.bottom + 4, window.innerHeight - 432));
      setPosition({ left: Math.max(12, Math.min(rect.right - 260, window.innerWidth - 272)), top, maxHeight: window.innerHeight - top - 12 });
      setPanel("main"); popup.current?.showPopover();
    }}><MenuDotsBold size={18} /></IconButton>
    <div ref={popup} id={id} role="dialog" aria-label="任务操作菜单" popover="auto" className="task-action-menu" style={{ ...position, ...(panel === "schedule" ? { width: "min(312px, calc(100vw - 24px))", left: Math.max(12, position.left - 52), top: scheduleTop, maxHeight: position.top + position.maxHeight - scheduleTop } : {}) }} onToggle={(event) => setOpen((event.nativeEvent as ToggleEvent).newState === "open")} onKeyDown={(event) => {
      if (event.defaultPrevented || (event.target instanceof Element && event.target.closest(".task-date-calendar")) || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      const buttons = [...popup.current!.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")].filter(button => !button.closest(".task-date-calendar"));
      const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
      const index = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
      event.preventDefault(); buttons[index]?.focus();
    }}>
      <DropdownPanel width="w-full">
        {panel !== "main" && <MenuItem label="返回任务操作" accent="blue" onClick={() => setPanel("main")} />}
        {panel === "main" && <>
          {items.slice(0, 3).map(entry)}
          <DropdownDivider />
          <MenuItem label="安排日期" kind="dropdown" accent="blue" onClick={() => setPanel("schedule")} />
          <MenuItem label="设置优先级" kind="dropdown" accent="blue" onClick={() => setPanel("priority")} />
          <MenuItem label="移动到项目或分区" kind="dropdown" accent="blue" onClick={() => setPanel("projects")} />
          <DropdownDivider />
          {items.slice(3).map(entry)}
        </>}
        {panel === "schedule" && <>
          {[{ label: "今天", date: day() }, { label: "明天", date: day(1) }, { label: "本周周末", date: day(new Date().getDay() === 0 ? 0 : Math.max(0, 6 - new Date().getDay())) }, { label: "下周一", date: day(8 - (new Date().getDay() || 7)) }].map(option => <MenuItem key={option.label} label={option.label} accent="blue" onClick={() => chooseDate(option.date)} />)}
          <div className="task-date-calendar"><Datepicker color="blue" inline value={task.date ? new Date(`${task.date}T12:00:00`) : undefined} onChange={date => chooseDate(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`)} /></div>
          <MenuItem label="不设日期" accent="blue" onClick={() => chooseDate("")} />
        </>}
        {panel === "priority" && ["优先处理", "重要", "常规", "无优先级"].map((label, index) => <MenuItem key={label} label={`P${index + 1} · ${label}${task.priority === String(index + 1) ? " · 当前" : ""}`} accent="blue" onClick={() => choosePriority(`${index + 1}`)} />)}
        {panel === "projects" && ["收件箱", ...board.projects.filter((name) => !board.archived?.includes(name))].map((name) => <MenuItem key={name} label={`${name}${name === task.project ? " · 当前项目" : ""}`} kind="dropdown" accent="blue" onClick={() => { setProject(name); setPanel("sections"); }} />)}
        {panel === "sections" && <>
          <MenuItem label="返回项目列表" accent="blue" onClick={() => setPanel("projects")} />
          <p className="px-3 py-2 text-xs text-fg-grey-700">{project} / 选择分区</p>
          {projectSections(board, project).map((section) => <MenuItem key={section.id} label={`${section.title}${task.section === section.id ? " · 当前分区" : ""}`} accent="blue" onClick={() => { onPatch({ project, section: section.id }); close(); }} />)}
        </>}
      </DropdownPanel>
    </div>
  </div>;
}
