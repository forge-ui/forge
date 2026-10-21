"use client";

import { useTemplateMobile } from "../_shared/use-template-mobile";
import { TemplateProfile } from "../_shared/template-profile";

import { Fragment, useCallback, useEffect, useRef, useState, type SyntheticEvent } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import {
  AppLayout,
  Button,
  Checkbox,
  ConfirmationDialog,
  IconButton,
  KebabMenu,
  MenuItem,
  Modal,
  SurfaceCard,
  TextArea,
  TextField,
  ToastProvider,
  useToast,
} from "@forge-ui-official/core";
import {
  AltArrowDownLinear,
  PlusLinear,
  CalendarBoldDuotone,
  CheckCircleBoldDuotone,
  ClipboardListBoldDuotone,
  FolderBoldDuotone,
  InboxBoldDuotone,
  MagniferLinear,
  StarLinear,
} from "@forge-ui-official/core/icons";
import { Board, Task, taskDetailHash, parseTaskDetailHash, sectionLinkHash, parseSectionLinkHash, collectTaskLabels, day, isBoard, seedBoard, migrateBoard, projectSections, emptyBoard, writeTasks, copyTask, copyProject, copySection, moveSection, setSectionArchived, taskIsArchived, STORAGE_KEY } from "./_data";
import { ProjectProperties, type ProjectDetails } from "./_project-properties";
import { TaskDetail } from "./_task-detail";
import type { DraftExitGuard } from "./_subtasks";
import { useUnsavedChanges } from "./_use-unsaved-changes";
import { useTaskDetailHistory } from "./_use-task-detail-history";
import { TaskEditor } from "./_task-editor";
import { QuickAdd } from "./_quick-add";
import { TaskDateMenu } from "./_task-date-menu";
import { ContextMenu } from "./_context-menu";
import { TaskMenu } from "./_task-menu";
import { TaskComments } from "./_task-comments";
import { TaskSearch } from "./_task-search";
import { DEFAULT_VIEW, matchesDateFilter, projectTaskGroups, parseViewPreferences, viewKey, type ViewPreference, type ViewPreferences } from "./_view-preferences";
import { ViewMenu } from "./_view-menu";
import { ProjectsOverview } from "./_projects-overview";
import "./task-board.css";

export default function TaskBoardTemplate() {
  return (
    <ToastProvider>
      <TaskBoard />
    </ToastProvider>
  );
}


function panBoardAt(x: number, y: number) {
      const board = document.querySelector<HTMLElement>(".workspace-board-scroll");
      const rect = board?.getBoundingClientRect();
      if (board && rect) {
        if (x < rect.left + 48) board.scrollLeft -= Math.min(16, (rect.left + 48 - x) / 3);
        if (x > rect.right - 48) board.scrollLeft += Math.min(16, (x - rect.right + 48) / 3);
      }
      const section = document.elementFromPoint(x, y)?.closest("[data-task-section]");
      const list = section?.querySelector<HTMLElement>(".kanban-section-tasks");
      const area = list?.getBoundingClientRect();
      if (list && area) {
        if (y < area.top + 40) list.scrollTop -= Math.min(14, (area.top + 40 - y) / 3);
        if (y > area.bottom - 40) list.scrollTop += Math.min(14, (y - area.bottom + 40) / 3);
      }
}

function TaskBoard() {
  const mobile = useTemplateMobile();
  const [board, setBoard] = useState<Board>({
    sections: [],
    projects: [],
    tasks: [],
  });
  const [weekOffset, setWeekOffset] = useState(0);
  const [ready, setReady] = useState(false);
  const [scope, setScope] = useState("品牌焕新计划");
  const [linkedSection, setLinkedSection] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<ViewPreferences>({});
  const [query, setQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickAdd, setQuickAdd] = useState<{ group: string; section: string; date?: string } | null>(null);
  const [editing, setEditing] = useState<Task | null>(null);
  const [naming, setNaming] = useState<{
    kind: "project" | "project-copy" | "section" | "workspace";
    id?: string;
    value: string;
    description?: string;
    before?: string;
  } | null>(null);
  const [nameError, setNameError] = useState("");
  const [projectsOpen, setProjectsOpen] = useState(false);
  const sectionEditorRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (naming?.kind === "section" && !naming.id) sectionEditorRef.current?.scrollIntoView({ block: "nearest", inline: "end" });
  }, [naming?.kind, naming?.id]);
  const [workspaces, setWorkspaces] = useState([
    { id: "design", name: "设计工作室" },
  ]);
  const [workspace, setWorkspace] = useState("design");
  const preferenceKey = viewKey(workspace, scope);
  const viewOptions = preferences[preferenceKey] ?? DEFAULT_VIEW;
  const { view, sort, showDone, group: grouping, dateFilter, priority, label: labelFilter } = viewOptions;
  const updatePreference = (patch: Partial<ViewPreference>) => setPreferences((current) => ({
    ...current, [preferenceKey]: { ...(current[preferenceKey] ?? DEFAULT_VIEW), ...patch },
  }));
  const clearFilters = () => { setQuery(""); updatePreference({ priority: "all", label: "__all__", dateFilter: "all" }); };
  const detailExitGuard = useRef<DraftExitGuard | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailNavigationFocus, setDetailNavigationFocus] = useState<"previous" | "next" | undefined>();
  const [detailPath, setDetailPath] = useState<string[]>([]);
  const sectionDrag = useRef<{
    id: string;
    x: number;
    y: number;
    moved: boolean;
    offsetX: number; offsetY: number; clientX: number; clientY: number;
    width: number; height: number;
  } | null>(null);
  const [columnPreview, setColumnPreview] = useState<{ id: string; width: number; height: number; before?: string } | null>(null);
  const columnX = useMotionValue(0);
  const columnY = useMotionValue(0);
  const [confirm, setConfirm] = useState<{
    title: string;
    description: string;
    action: () => void;
  } | null>(null);
  const [help, setHelp] = useState(false);
  const [linkedWorkspaceMissing, setLinkedWorkspaceMissing] = useState(false);
  const [linkToCopy, setLinkToCopy] = useState("");
  const [copyLinkKind, setCopyLinkKind] = useState("任务");
  const [copyLinkStatus, setCopyLinkStatus] = useState("正在复制链接…");
  const [projectCommentsOpen, setProjectCommentsOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [archivedSectionsOpen, setArchivedSectionsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [expandedCardTasks, setExpandedCardTasks] = useState<Record<string, boolean>>({});
  const [dragPreview, setDragPreview] = useState<{ id: string; width: number; height: number; section?: string; before?: string } | null>(null);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const dragRotation = useMotionValue(0);
  const settlingDrag = useRef(false);
  const dropTarget = useCallback((x: number, y: number, id: string) => {
    const hit = document.elementFromPoint(x, y);
    const section = hit?.closest<HTMLElement>("[data-task-section]");
    const placeholder = hit?.closest<HTMLElement>("[data-drag-placeholder]");
    if (placeholder) return { section: section?.dataset.taskSection, before: placeholder.dataset.before || undefined };
    const cards = [...(section?.querySelectorAll<HTMLElement>("[data-task-id]") ?? [])].filter((card) => card.dataset.taskId !== id);
    return { section: section?.dataset.taskSection, before: cards.find((card) => y < card.getBoundingClientRect().top + card.getBoundingClientRect().height / 2)?.dataset.taskId };
  }, []);
  const activeDragId = dragPreview?.id;
  useEffect(() => {
    if (!activeDragId) return;
    let frame: number;
    const pan = () => {
      const pointer = pointerDrag.current;
      if (pointer?.moved) {
        panBoardAt(pointer.clientX, pointer.clientY);
        const target = dropTarget(pointer.clientX, pointer.clientY, pointer.id);
        setDragPreview(current => !current || (current.section === target.section && current.before === target.before) ? current : { ...current, ...target });
        setDragOver(target.section ?? null);
      }
      frame = requestAnimationFrame(pan);
    };
    frame = requestAnimationFrame(pan);
    return () => cancelAnimationFrame(frame);
  }, [activeDragId, dropTarget]);
  const activeColumnId = columnPreview?.id;
  useEffect(() => {
    if (!activeColumnId) return;
    let frame: number;
    const pan = () => {
      const pointer = sectionDrag.current;
      if (pointer?.moved) {
        const container = document.querySelector<HTMLElement>(".workspace-board-scroll");
        const bounds = container?.getBoundingClientRect();
        if (container && bounds) {
          const previous = container.scrollLeft;
          if (pointer.clientX < bounds.left + 48) container.scrollLeft -= Math.min(16, (bounds.left + 48 - pointer.clientX) / 3);
          if (pointer.clientX > bounds.right - 48) container.scrollLeft += Math.min(16, (pointer.clientX - bounds.right + 48) / 3);
          if (container.scrollLeft !== previous) {
            const before = [...document.querySelectorAll<HTMLElement>("[data-section-slot]")].filter(element => element.dataset.sectionSlot !== pointer.id).find(element => pointer.clientX < element.getBoundingClientRect().left + element.getBoundingClientRect().width / 2)?.dataset.sectionSlot;
            setColumnPreview(current => !current || current.before === before ? current : { ...current, before });
          }
        }
      }
      frame = requestAnimationFrame(pan);
    };
    frame = requestAnimationFrame(pan);
    return () => cancelAnimationFrame(frame);
  }, [activeColumnId]);
  const dragged = useRef<string | null>(null);
  const pointerDrag = useRef<{
    id: string;
    x: number;
    y: number;
    moved: boolean;
    clientX: number;
    clientY: number;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  } | null>(null);
  const suppressClick = useRef(false);
  const search = useRef<HTMLInputElement>(null);
  const lastDetailTask = useRef<string | null>(null);
  const { toast, dismiss, update: updateToast } = useToast();
  const lastUndoToast = useRef<string | null>(null);
  const storageNotice = useRef<string | null>(null);
  const [storageFailed, setStorageFailed] = useState(false);
  const reduced = useReducedMotion();

  const exportBoard = useCallback(() => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(board, null, 2)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "forge-task-board.json";
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "看板已导出为 JSON 文件" });
  }, [board, toast]);
  const persistBoard = useCallback((notifyAgain = false) => {
    try {
      localStorage.setItem(workspace === "design" ? STORAGE_KEY : `${STORAGE_KEY}:${workspace}`, JSON.stringify(board));
      localStorage.setItem(`${STORAGE_KEY}:workspaces`, JSON.stringify({ items: workspaces, active: workspace }));
      setStorageFailed(false);
      if (storageNotice.current) { dismiss(storageNotice.current); storageNotice.current = null; }
      return true;
    } catch {
      setStorageFailed(true);
      if (notifyAgain && storageNotice.current) { dismiss(storageNotice.current); storageNotice.current = null; }
      if (storageNotice.current) updateToast(storageNotice.current, { action: { label: "导出备份", onClick: exportBoard } });
      else storageNotice.current = toast({
        title: "更改尚未保存到浏览器",
        description: "本地存储不可用或空间不足。未保存时无法切换或新建工作空间；请先导出备份，避免刷新后丢失。",
        status: "error", duration: 0,
        action: { label: "导出备份", onClick: exportBoard },
      });
      return false;
    }
  }, [board, workspace, workspaces, toast, dismiss, updateToast, exportBoard]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      let saved: Board = seedBoard();
      let savedWorkspace = "design";
      try {
        const catalog = JSON.parse(
          localStorage.getItem(`${STORAGE_KEY}:workspaces`) || "null",
        );
        const spaces =
          Array.isArray(catalog?.items) &&
          catalog.items.length &&
          catalog.items.every(
            (w: { id: string; name: string }) =>
              typeof w?.id === "string" && typeof w.name === "string",
          )
            ? catalog.items
            : [{ id: "design", name: "设计工作室" }];
        const linkedWorkspace = new URLSearchParams(location.search).get("workspace");
        setLinkedWorkspaceMissing(!!linkedWorkspace && !spaces.some((w: { id: string }) => w.id === linkedWorkspace));
        const preferredWorkspace = linkedWorkspace && spaces.some((w: { id: string }) => w.id === linkedWorkspace) ? linkedWorkspace : catalog?.active;
        const current = spaces.some(
          (w: { id: string }) => w.id === preferredWorkspace,
        )
          ? preferredWorkspace
          : "design";
        setWorkspaces(spaces);
        setWorkspace(current);
        savedWorkspace = current;
        saved = current === "design" ? seedBoard() : emptyBoard("我的项目");
        const raw = localStorage.getItem(
          current === "design" ? STORAGE_KEY : `${STORAGE_KEY}:${current}`,
        );
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (isBoard(parsed)) saved = parsed;
          else
            toast({
              title: "本地数据格式已变化，已加载示例任务",
              status: "error",
            });
        }
      } catch {
        toast({ title: "无法读取本地数据，已加载示例任务", status: "error" });
      }
      saved = migrateBoard(saved);
      setBoard(saved);
      let savedScope = saved.projects[0] ?? "收件箱";
      try {
        const ui = JSON.parse(
          localStorage.getItem(`${STORAGE_KEY}:view`) || "null",
        );
        setProjectsOpen(ui?.projectsOpen === true);
        if (
          ui &&
          [...saved.projects, "收件箱", "今天", "即将到来", "已完成"].includes(
            ui.scope,
          )
        )
          savedScope = ui.scope;
        const stored = parseViewPreferences(JSON.parse(localStorage.getItem(`${STORAGE_KEY}:preferences`) || "null"));
        const key = viewKey(savedWorkspace, savedScope);
        if (!stored[key] && ui?.view === 1) stored[key] = { ...DEFAULT_VIEW, view: 1 };
        setPreferences(stored);
      } catch {
        /* An invalid view preference does not affect task data. */
      }
      const linkedTask = parseTaskDetailHash(location.hash);
      if (linkedTask) {
        const target = saved.tasks.find((task) => task.id === linkedTask.id);
        if (target) { savedScope = target.project; setProjectsOpen(false); }
      }
      const requestedWorkspace = new URLSearchParams(location.search).get("workspace");
      if (requestedWorkspace && requestedWorkspace === savedWorkspace) {
        const cleanUrl = new URL(location.href); cleanUrl.searchParams.delete("workspace");
        history.replaceState(history.state, "", `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
      }
      setScope(savedScope);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [toast]);
  useEffect(() => {
    let cancelled = false;
    if (ready) queueMicrotask(() => { if (!cancelled) persistBoard(); });
    return () => { cancelled = true; };
  }, [ready, persistBoard]);
  useEffect(() => {
    function key(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
        return;
      }
      if (target.closest("input, textarea, [contenteditable], [role=dialog]"))
        return;
      if (event.key === "/") {
        event.preventDefault();
        setFiltersOpen(true);
        requestAnimationFrame(() => search.current?.focus());
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(
          `${STORAGE_KEY}:view`,
          JSON.stringify({ scope, projectsOpen }),
        );
        localStorage.setItem(
          `${STORAGE_KEY}:preferences`,
          JSON.stringify(preferences),
        );
      } catch {
        /* Task export remains available. */
      }
    }
  }, [ready, scope, preferences, projectsOpen]);
  const writeDetailHistory = useTaskDetailHistory(detailExitGuard, (hash) => {
      const detail = parseTaskDetailHash(hash);
      setLinkedSection(parseSectionLinkHash(hash));
      if (detail) lastDetailTask.current = detail.id;
      setDetailId(detail?.id ?? null);
      setDetailPath(detail?.path ?? []);
  });
  useEffect(() => {
    if (!ready || !linkedSection) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const section = board.sections.find(item => item.id === linkedSection);
      const project = section?.project ?? board.projects[0];
      if (linkedWorkspaceMissing || !section || section.archived || board.archived?.includes(project)) {
        toast({ title: "链接指向的分区不存在或已归档", status: "error" });
        setLinkedSection(null); return;
      }
      setScope(project); setProjectsOpen(false); setQuery("");
      setCollapsedGroups(current => ({ ...current, [linkedSection]: false }));
      const key = viewKey(workspace, project);
      setPreferences(current => ({ ...current, [key]: { ...(current[key] ?? DEFAULT_VIEW), group: "section", priority: "all", label: "__all__", dateFilter: "all" } }));
    });
    return () => { cancelled = true; };
  }, [ready, linkedSection, linkedWorkspaceMissing, board.sections, board.projects, board.archived, workspace, toast]);
  useEffect(() => {
    if (!ready || linkedWorkspaceMissing || !linkedSection || grouping !== "section") return;
    const section = board.sections.find(item => item.id === linkedSection);
    if (!section || (section.project ?? board.projects[0]) !== scope || collapsedGroups[linkedSection]) return;
    const frame = requestAnimationFrame(() => {
      const element = document.getElementById(`group-${linkedSection}`);
      if (!element) return;
      element.scrollIntoView({ block: "nearest", inline: "center", behavior: reduced ? "auto" : "smooth" });
      element.querySelector<HTMLButtonElement>("h2 button")?.focus({ preventScroll: true });
      setLinkedSection(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [ready, linkedSection, linkedWorkspaceMissing, grouping, scope, collapsedGroups, board.sections, board.projects, reduced]);
  const openDetail = (task: Task, path: string[] = [], navigationFocus?: "previous" | "next") => {
    const proceed = () => {
    lastDetailTask.current = task.id;
    setLinkedWorkspaceMissing(false);
    setDetailNavigationFocus(navigationFocus);
    const hash = `#${taskDetailHash(task.id, path)}`;
    if (location.hash !== hash) writeDetailHistory(hash);
    setDetailId(task.id);
    setDetailPath(path);
    };
    if (detailId && detailId !== task.id && detailExitGuard.current) detailExitGuard.current(proceed);
    else proceed();
  };
  const closeDetail = () => {
    const proceed = () => {
    writeDetailHistory("", true);
    setLinkedSection(null);
    setLinkedWorkspaceMissing(false);
    setDetailId(null);
    setDetailPath([]);
    };
    if (detailExitGuard.current) detailExitGuard.current(proceed);
    else proceed();
  };
  const workspaceName =
    workspaces.find((w) => w.id === workspace)?.name || "设计工作室";
  const switchWorkspace = (id: string) => {
    if (id === "__new__") {
      setNaming({ kind: "workspace", value: "" });
      setNameError("");
      return;
    }
    if (id === workspace) return;
    if (!persistBoard(true)) return;
    setQuickAdd(null);
    let next = id === "design" ? seedBoard() : emptyBoard("我的项目");
    try {
      const raw = JSON.parse(
        localStorage.getItem(
          id === "design" ? STORAGE_KEY : `${STORAGE_KEY}:${id}`,
        ) || "null",
      );
      if (isBoard(raw)) next = raw;
    } catch {
      /* Keep the available local template. */
    }
    if (lastUndoToast.current) dismiss(lastUndoToast.current);
    setBoard(migrateBoard(next));
    setWorkspace(id);
    setScope(next.projects[0] ?? "收件箱");
    setQuery("");
    closeDetail();
  };
  const change = (next: Board, title: string) => {
    const previous = board;
    setBoard({ ...next, tasks: writeTasks(board.tasks, next.tasks) });
    if (lastUndoToast.current) dismiss(lastUndoToast.current);
    lastUndoToast.current = toast({
      title,
      duration: 8000,
      action: {
        label: "撤销",
        onClick: () => {
          setBoard(previous);
          setScope(scope);
        },
      },
    });
  };
  const duplicateTask = (task: Task) => {
    const copy = copyTask(task, { title: `${task.title}（副本）`, done: false, completedAt: undefined, comments: [] });
    change({ ...board, tasks: [...board.tasks, copy] }, "任务已复制");
    openDetail(copy);
  };
  const copyBoardLink = async (hash: string, kind: string) => {
    const url = new URL(location.href);
    url.searchParams.set("workspace", workspace);
    url.hash = hash;
    setCopyLinkKind(kind);
    setLinkToCopy(url.href);
    setCopyLinkStatus("正在复制链接…");
    try { await Promise.race([navigator.clipboard.writeText(url.href), new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Clipboard unavailable")), 1200))]); setCopyLinkStatus(`${kind}链接已复制`); }
    catch { setCopyLinkStatus("浏览器未完成自动复制，请选中下方链接复制。"); }
  };
  const copyTaskLink = (task: Task) => copyBoardLink(taskDetailHash(task.id), "任务");
  const updateTask = (task: Task) => {
    change(
      {
        ...board,
        tasks: board.tasks.some((t) => t.id === task.id)
          ? board.tasks.map((t) => (t.id === task.id ? task : t))
          : [...board.tasks, task],
      },
      "任务已保存",
    );
    setEditing(null);
  };
  const taskProject = scope === "收件箱" ? "收件箱" : board.projects.includes(scope) ? scope : board.projects.find((project) => !board.archived?.includes(project)) ?? "收件箱";
  const addTask = (section = projectSections(board, taskProject)[0]?.id) =>
    setEditing({
      id: crypto.randomUUID(),
      title: "",
      description: "",
      section,
      project: taskProject,
      priority: priority === "all" ? "4" : priority,
      date: scope === "今天" ? day() : scope === "即将到来" ? day(1) : dateFilter !== "all" && dateFilter !== "none" ? day() : "",
      owner: "林晓",
      done: false,
      labels: labelFilter === "__all__" ? [] : [labelFilter.slice(6)],
      subtasks: [],
      comments: [],
    });
  const systemScope = ["收件箱", "今天", "即将到来", "已完成"].includes(scope);
  const listMode = systemScope || view === 1;
  const selectScope = (next: string) => {
    if (parseSectionLinkHash(location.hash)) writeDetailHistory("", true);
    setLinkedSection(null);
    setProjectCommentsOpen(false);
    setProjectsOpen(false);
    setQuickAdd(null);
    setScope(next);
    setQuery("");
    setWeekOffset(0);
  };
  const matchesScope = (task: Task) =>
    (board.sections.find(section => section.id === task.section)?.archived || (board.archived?.includes(task.project) && scope !== task.project)) ? false : scope === "收件箱"
      ? task.project === "收件箱"
      : scope === "今天"
        ? !!task.date && task.date <= day()
        : scope === "即将到来"
          ? !!task.date && task.date >= day()
          : scope === "已完成"
            ? task.done
            : task.project === scope;
  const scoped = board.tasks.filter(matchesScope);
  const visible = scoped
    .filter(
      (t) =>
        (showDone || scope === "已完成" || !t.done) &&
        (priority === "all" || t.priority === priority) && matchesDateFilter(t.date, dateFilter) &&
        (labelFilter === "__all__" || (t.labels ?? []).includes(labelFilter.slice(6))) &&
        `${t.title} ${t.description} ${t.owner} ${(t.labels ?? []).map((label) => `@${label}`).join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "name" ? a.title.localeCompare(b.title, "zh-CN") : scope === "已完成" && sort === "manual" ? (b.completedAt ?? "").localeCompare(a.completedAt ?? "") : sort === "priority"
        ? a.priority.localeCompare(b.priority)
        : sort === "date"
          ? (a.date || "9999").localeCompare(b.date || "9999")
          : 0,
    );
  const dateLabel = (value: string) =>
    new Date(`${value}T12:00:00`).toLocaleDateString("zh-CN", {
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  const weekDays = Array.from({ length: 7 }, (_, i) => day(weekOffset * 7 + i));
  const groups =
    scope === "今天"
      ? [
          {
            id: "overdue",
            title: "已逾期",
            tasks: visible.filter((t) => t.date < day()),
            date: undefined,
          },
          {
            id: "today",
            title: dateLabel(day()) + " · 今天",
            tasks: visible.filter((t) => t.date === day()),
            date: day(),
          },
        ]
      : scope === "即将到来"
        ? weekDays.map((date) => ({
            id: date,
            title:
              dateLabel(date) +
              (date === day() ? " · 今天" : date === day(1) ? " · 明天" : ""),
            tasks: visible.filter((t) => t.date === date),
            date,
          }))
        : scope === "已完成"
          ? [...new Set(visible.map((task) => task.completedAt ? new Date(task.completedAt).toLocaleDateString("sv-SE") : ""))].sort((a, b) => b.localeCompare(a)).map((date) => ({
              id: `completed:${date || "unknown"}`,
              title: date ? `${dateLabel(date)}完成` : "较早完成 · 时间未记录",
              tasks: visible.filter((task) => (task.completedAt ? new Date(task.completedAt).toLocaleDateString("sv-SE") : "") === date),
              date: undefined,
            }))
        : systemScope
          ? [
              {
                id: scope,
                title: scope === "已完成" ? "已完成的任务" : "待整理的任务",
                tasks: visible,
                date: undefined,
              },
            ]
          : projectTaskGroups(board, scope, visible, grouping);
  const orderedGroups = columnPreview ? (() => {
    const remaining = groups.filter(group => group.id !== columnPreview.id);
    const moving = groups.find(group => group.id === columnPreview.id);
    if (moving) { const index = remaining.findIndex(group => group.id === columnPreview.before); remaining.splice(index < 0 ? remaining.length : index, 0, moving); }
    return remaining;
  })() : groups;
  const detailSequence = groups.flatMap((group) => group.tasks);
  const detailIndex = detailSequence.findIndex((task) => task.id === detailId);
  const previousDetail = detailIndex > 0 ? detailSequence[detailIndex - 1] : undefined;
  const nextDetail = detailIndex >= 0 ? detailSequence[detailIndex + 1] : undefined;
  const description =
    scope === "今天"
      ? "把注意力留给今天，先处理到期和逾期的任务。"
      : scope === "即将到来"
        ? "提前安排每一天，给重要的事留出时间。"
        : scope === "收件箱"
          ? "先记下来，稍后再安排到合适的项目。"
          : scope === "已完成"
            ? "每一项完成，都是向前的一步。"
            : "从灵感到落地，让好的设计有序发生。";
  const projectDetails: ProjectDetails = board.projectDetails?.[scope] ?? {
    status: "进行中",
    owner: "林晓",
    priority: "中",
    description:
      scope === "日常工作"
        ? "记录团队日常协作，把反馈和改进落实到每一项任务。"
        : "让品牌焕发新的生命力。本周确认视觉方向，推进官网设计，并完成第一轮团队评审。",
  };
  const updateProjectDetails = (patch: Partial<ProjectDetails>) =>
    setBoard((current) => ({
      ...current,
      projectDetails: {
        ...current.projectDetails,
        [scope]: { ...projectDetails, ...patch },
      },
    }));
  const done = scoped.filter((t) => t.done).length;
  const toggle = (task: Task) =>
    change(
      {
        ...board,
        tasks: board.tasks.map((t) =>
          t.id === task.id ? { ...t, done: !t.done } : t,
        ),
      },
      task.done ? "任务已重新打开" : "又完成了一件事，做得不错！",
    );
  const move = (id: string, section: string, before?: string) => {
    const task = board.tasks.find((t) => t.id === id);
    if (!task || id === before) return;
    updatePreference({ sort: "manual" });
    const tasks = board.tasks.filter((t) => t.id !== id);
    const index = before
      ? tasks.findIndex((t) => t.id === before)
      : tasks.length;
    tasks.splice(index < 0 ? tasks.length : index, 0, { ...task, section });
    change(
      { ...board, tasks },
      `已移至${board.sections.find((s) => s.id === section)?.title}`,
    );
  };
  const deleteSection = (id: string) => {
    const source = board.sections.find((s) => s.id === id);
    const destination = board.sections.find((s) => s.id !== id && !s.archived && s.project === source?.project);
    if (!destination) return;
    setConfirm({
      title: "删除这个分区？",
      description: `分区内的任务会移至“${destination.title}”。删除后可以撤销。`,
      action: () =>
        change(
          {
            ...board,
            sections: board.sections.filter((s) => s.id !== id),
            tasks: board.tasks.map((t) =>
              t.section === id ? { ...t, section: destination.id } : t,
            ),
          },
          "分区已删除，任务已移动",
        ),
    });
  };
  const favorite = board.favorites?.includes(scope) ?? false;
  const removeTask = (task: Task) =>
    setConfirm({
      title: "删除这项任务？",
      description: "任务、子任务与讨论将一并移除。删除后可以通过通知撤销。",
      action: () => {
        change(
          { ...board, tasks: board.tasks.filter((t) => t.id !== task.id) },
          "任务已删除",
        );
        setEditing(null);
        if (detailId === task.id) closeDetail();
      },
    });
  const saveName = () => {
    if (!naming) return;
    const name = naming.value.trim();
    if (!name) {
      setNameError("请填写名称");
      return;
    }
    if (naming.kind === "workspace") {
      if (workspaces.some((w) => w.name === name)) {
        setNameError("工作空间名称已存在");
        return;
      }
      if (!persistBoard(true)) { setNameError("当前工作空间尚未保存，请先导出备份或恢复存储后重试。"); return; }
      const id = crypto.randomUUID();
      const next = emptyBoard("我的项目");
      setWorkspaces([...workspaces, { id, name }]);
      setWorkspace(id);
      setBoard(next);
      setScope("我的项目");
      if (lastUndoToast.current) dismiss(lastUndoToast.current);
      toast({ title: "工作空间已创建" });
    } else if (naming.kind === "project-copy") {
      if (["今天", "收件箱", "即将到来", "已完成"].includes(name)) { setNameError("请使用与系统视图不同的项目名称"); return; }
      if (board.projects.includes(name)) { setNameError("项目名称已存在"); return; }
      const next = copyProject(board, naming.id ?? "", name, projectDetails);
      if (next === board) { setNameError("原项目不存在，请关闭后重新选择项目。"); return; }
      change(next, "项目已复制");
      selectScope(name);
    } else if (naming.kind === "project") {
      if (["今天", "收件箱", "即将到来", "已完成"].includes(name)) {
        setNameError("请使用与系统视图不同的项目名称");
        return;
      }
      if (board.projects.some((p) => p === name && p !== naming.id)) {
        setNameError("项目名称已存在");
        return;
      }
      if (naming.id) {
        const previous = naming.id;
        change({ ...board,
          projects: board.projects.map((p) => p === previous ? name : p),
          sections: board.sections.map((s) => s.project === previous ? { ...s, project: name } : s),
          tasks: board.tasks.map((t) => t.project === previous ? { ...t, project: name } : t),
          favorites: board.favorites?.map((p) => p === previous ? name : p),
          archived: board.archived?.map((p) => p === previous ? name : p),
          projectComments: Object.fromEntries(Object.entries(board.projectComments ?? {}).map(([key, value]) => [key === previous ? name : key, value])),
          projectDetails: Object.fromEntries(Object.entries(board.projectDetails ?? {}).map(([key, value]) => [key === previous ? name : key, value])),
        }, "项目已重命名");
      } else change({ ...board, projects: [...board.projects, name], sections: [...board.sections, { id: crypto.randomUUID(), title: "待办", project: name }] }, "项目已创建");
      setScope(name);
      setProjectsOpen(false);
    } else {
      if (projectSections(board, scope).some((s) => s.title === name && s.id !== naming.id)) {
        setNameError("分区名称已存在");
        return;
      }
      change(
        {
          ...board,
          sections: naming.id
            ? board.sections.map((s) =>
                s.id === naming.id ? { ...s, title: name, description: naming.description?.trim() ?? s.description } : s,
              )
            : (() => {
              const sections = [...board.sections];
              const index = sections.findIndex(section => section.id === naming.before);
              sections.splice(index < 0 ? sections.length : index, 0, { id: crypto.randomUUID(), title: name, project: scope, description: naming.description?.trim() || "" });
              return sections;
            })(),
        },
        "分区已保存",
      );
    }
    setNaming(null);
  };
  const nav = [
    { label: "收件箱", icon: <InboxBoldDuotone size={20} /> },
    { label: "今天", icon: <CalendarBoldDuotone size={20} /> },
    { label: "即将到来", icon: <ClipboardListBoldDuotone size={20} /> },
    { label: "已完成", icon: <CheckCircleBoldDuotone size={20} /> },
  ];

  useEffect(() => {
    const columnTarget = (x: number, id: string) => [...document.querySelectorAll<HTMLElement>("[data-section-slot]")]
      .filter(element => element.dataset.sectionSlot !== id)
      .find(element => x < element.getBoundingClientRect().left + element.getBoundingClientRect().width / 2)?.dataset.sectionSlot;
    const pointerMove = (event: PointerEvent) => {
          const column = sectionDrag.current;
          if (column) {
            if (!column.moved && Math.hypot(event.clientX - column.x, event.clientY - column.y) < 8) return;
            column.moved = true;
            column.clientX = event.clientX; column.clientY = event.clientY;
            document.documentElement.setPointerCapture(event.pointerId);
            columnX.set(event.clientX - column.offsetX); columnY.set(event.clientY - column.offsetY);
            const before = columnTarget(event.clientX, column.id);
            setColumnPreview(current => current && current.before === before ? current : { id: column.id, width: column.width, height: column.height, before });
            return;
          }
          const drag = pointerDrag.current;
          if (!drag) return;
          if (
            Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 8 &&
            !drag.moved
          )
            return;
          const started = !drag.moved;
          drag.moved = true;
          drag.clientX = event.clientX; drag.clientY = event.clientY;
          document.documentElement.setPointerCapture(event.pointerId);
          dragX.set(event.clientX - drag.offsetX);
          dragY.set(event.clientY - drag.offsetY);
          if (started) {
            dragRotation.set(reduced ? 0 : 0.8);
            const target = dropTarget(event.clientX, event.clientY, drag.id);
            setDragPreview({ id: drag.id, width: drag.width, height: drag.height, ...target });
          }

    };
    const pointerUp = async (event: PointerEvent) => {
          const column = sectionDrag.current;
          if (column) {
            sectionDrag.current = null;
            if (!column.moved) return;
            suppressClick.current = true;
            requestAnimationFrame(() => { suppressClick.current = false; });
            settlingDrag.current = true;
            const before = columnTarget(event.clientX, column.id);
            const sections = board.sections.filter(section => section.id !== column.id);
            const moving = board.sections.find(section => section.id === column.id);
            const index = sections.findIndex(section => section.id === before);
            if (moving) sections.splice(index < 0 ? sections.length : index, 0, moving);
            if (sections.some((section, index) => section.id !== board.sections[index]?.id)) change({ ...board, sections }, "分区顺序已更新");
            await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
            const destination = [...document.querySelectorAll<HTMLElement>("[data-section-slot]")].find(element => element.dataset.sectionSlot === column.id)?.getBoundingClientRect();
            if (destination && !reduced) await Promise.all([
              animate(columnX, destination.left, { duration: 0.18, ease: [0.22, 1, 0.36, 1] }),
              animate(columnY, destination.top, { duration: 0.18, ease: [0.22, 1, 0.36, 1] }),
            ]);
            setColumnPreview(null); settlingDrag.current = false;
            return;
          }
          const drag = pointerDrag.current;
          if (!drag) return;
          pointerDrag.current = null;
          if (!drag.moved) return;
          suppressClick.current = true;
          requestAnimationFrame(() => { suppressClick.current = false; });
          settlingDrag.current = true;
          const target = dropTarget(event.clientX, event.clientY, drag.id);
          if (target.section) move(drag.id, target.section, target.before);
          await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
          const destination = [...document.querySelectorAll<HTMLElement>("[data-task-id]")].find(element => element.dataset.taskId === drag.id)?.getBoundingClientRect();
          if (destination && !reduced) {
            await Promise.all([
              animate(dragX, destination.left, { duration: 0.16, ease: [0.22, 1, 0.36, 1] }),
              animate(dragY, destination.top, { duration: 0.16, ease: [0.22, 1, 0.36, 1] }),
              animate(dragRotation, 0, { duration: 0.14 }),
            ]);
          }
          setDragPreview(null); setDragOver(null);
          settlingDrag.current = false;

    };
    const cancel = () => { sectionDrag.current = null; setColumnPreview(null); pointerDrag.current = null; setDragPreview(null); setDragOver(null); settlingDrag.current = false; };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (pointerDrag.current?.moved || sectionDrag.current?.moved)) { event.preventDefault(); cancel(); }
    };
    const click = (event: MouseEvent) => {
      if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
    };
    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("keydown", keydown);
    window.addEventListener("blur", cancel);
    window.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("blur", cancel);
      window.removeEventListener("click", click, true);
    };
  });

  const savedSection = naming?.kind === "section" && naming.id ? board.sections.find(section => section.id === naming.id) : undefined;
  useUnsavedChanges(naming?.kind === "section" && (naming.value !== (savedSection?.title || "") || (naming.description || "") !== (savedSection?.description || "")));
  const sectionEditor = naming?.kind === "section" ? <form data-no-drag ref={sectionEditorRef} className="section-inline-editor flex flex-col gap-3" aria-label={naming.id ? "编辑分区" : "添加分区"} onKeyDownCapture={(event) => { if (["escape", "esc"].includes(event.key.toLowerCase()) || event.code === "Escape" || event.keyCode === 27) { event.preventDefault(); event.stopPropagation(); setNaming(null); } }} onSubmit={(event) => { event.preventDefault(); saveName(); }}>
    <TextField color="blue" autoFocus aria-label="分区名称" placeholder="命名这个分区" value={naming.value} onChange={(value) => { setNaming({ ...naming, value }); setNameError(""); }} state={nameError ? "error" : "idle"} errorMessage={nameError} />
    <TextArea color="blue" aria-label="分区描述" placeholder="添加描述" rows={3} value={naming.description || ""} onChange={(description) => setNaming({ ...naming, description })} />
    <div className="flex gap-2"><Button color="blue" size="sm" type="submit" disabled={!naming.value.trim()}>{naming.id ? "保存" : "添加分区"}</Button><Button color="blue" size="sm" variant="tertiary" onClick={() => setNaming(null)}>取消</Button></div>
  </form> : null;

  function card(task: Task & { dragOverlay?: boolean }) {
    const preview = !!task.dragOverlay;
    // Columns own the layout animation while being sorted. Child projection
    // would compensate for the same movement again and make cards wobble.
    const cardLayout = !reduced && !preview && !columnPreview;
    return (
      <motion.div key={task.id} layout={cardLayout ? "position" : false} transition={{ layout: { type: "spring", stiffness: 520, damping: 42, mass: 0.7 } }} className="task-drag-slot" style={!preview && dragPreview?.id === task.id ? { height: 0, marginBottom: -12, overflow: "hidden" } : undefined}>
        {!preview && dragPreview?.before === task.id && dragPreview.section === task.section && <div data-drag-placeholder data-before={task.id} className="task-drag-placeholder" style={{ height: dragPreview.height }} aria-hidden="true" />}
      <motion.div
        layout={cardLayout && dragPreview?.id !== task.id}
        key={task.id}
        initial={reduced || preview ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: !preview && dragPreview?.id === task.id ? 0 : 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
        transition={{ layout: { type: "spring", stiffness: 520, damping: 42, mass: 0.7 }, opacity: { duration: 0.12 }, duration: 0.18 }}
        draggable={false}
        style={{ touchAction: systemScope ? "auto" : "pan-y", ...(!preview && dragPreview?.id === task.id ? { height: 0, overflow: "hidden", pointerEvents: "none" as const } : {}) }}
        onPointerDown={(event) => {
          suppressClick.current = false;
          if (
            preview || settlingDrag.current || systemScope || grouping !== "section" || sort !== "manual" ||
            event.button !== 0 ||
            (event.target as Element).closest(
              '[role="checkbox"],input,[data-no-drag]',
            )
          )
            return;
          const bounds = event.currentTarget.getBoundingClientRect();
          pointerDrag.current = {
            id: task.id,
            clientX: event.clientX, clientY: event.clientY,
            offsetX: event.clientX - bounds.left, offsetY: event.clientY - bounds.top,
            width: bounds.width, height: bounds.height,
            x: event.clientX,
            y: event.clientY,
            moved: false,
          };
        }}
        onClickCapture={(event) => {
          if (suppressClick.current) {
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
          }
        }}
        data-task-id={preview ? undefined : task.id}
        onDragStartCapture={(event) => {
          dragged.current = task.id;
          event.dataTransfer.setData("text/plain", task.id);
          event.dataTransfer.effectAllowed = "move";
        }}
        onDragEndCapture={() => {
          dragged.current = null;
          setDragOver(null);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          move(
            dragged.current || event.dataTransfer.getData("text/plain"),
            task.section,
            task.id,
          );
          dragged.current = null;
          setDragOver(null);
        }}
        className={
          `${listMode ? "task-row" : ""} min-w-0 select-none ${!preview && dragPreview?.id === task.id ? "task-drag-source" : ""}`
        }
      >
        <SurfaceCard
          padding="none"
          className={`task-board-card ${task.done ? "opacity-65" : ""}`}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              color="blue"
              aria-label={`${task.done ? "重新打开" : "完成"}：${task.title}`}
              checked={task.done}
              onChange={() => toggle(task)}
            />
            <button
              type="button"
              className={`min-w-0 flex-1 text-left text-sm font-medium leading-6 text-fg-black ${task.done ? "line-through" : ""}`}
              data-task-open={task.id}
              onClick={() => openDetail(task)}
            >
              {task.title}
            </button>
            <div data-no-drag aria-label={`任务操作：${task.title}`}>
              <TaskMenu
                task={task}
                board={board}
                onPatch={(patch) => change({ ...board, tasks: board.tasks.map((item) => item.id === task.id ? { ...item, ...patch } : item) }, "任务已更新")}
                items={[
                  { label: "查看任务详情", onSelect: () => openDetail(task) },
                  {
                    label: task.done ? "重新打开任务" : "完成任务",
                    onSelect: () => toggle(task),
                  },
                  { label: "编辑任务", onSelect: () => setEditing(task) },
                  {
                    label: "复制任务",
                    onSelect: () => duplicateTask(task),
                  },
                  { label: "复制任务链接", onSelect: () => void copyTaskLink(task) },
                  {
                    label: "删除任务",
                    danger: true,
                    onSelect: () => removeTask(task),
                  },
                ]}
              />
            </div>
          </div>
          <div className="mt-3 pl-8 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-fg-grey-700">
            {task.priority === "1" && <span className="text-fg-black">优先处理</span>}
            <TaskDateMenu value={task.date} time={task.time} repeat={task.repeat} repeatRule={task.repeatRule} onScheduleChange={(patch) => change({ ...board, tasks: board.tasks.map((item) => item.id === task.id ? { ...item, ...patch } : item) }, "任务安排已更新")} onChange={(date) => change({ ...board, tasks: board.tasks.map((item) => item.id === task.id ? { ...item, date } : item) }, date ? "任务日期已更新" : "已清除任务日期")} />
            {task.labels?.map((label) => <span key={label}>@{label}</span>)}
            {task.subtasks.length > 0 && (
              <Button color="black" size="sm" variant="tertiary" data-no-drag className="card-subtask-toggle" aria-label={`${expandedCardTasks[task.id] ? "收起" : "展开"}卡片子任务：${task.title}`} aria-expanded={!!expandedCardTasks[task.id]} aria-controls={`card-subtasks-${task.id}${preview ? "-preview" : ""}`} onClick={() => setExpandedCardTasks(current => ({ ...current, [task.id]: !current[task.id] }))}>
                <ClipboardListBoldDuotone size={14} /><span>{task.subtasks.filter((s) => s.done).length}/{task.subtasks.length}</span><span className={expandedCardTasks[task.id] ? "rotate-180" : ""}><AltArrowDownLinear size={12} /></span>
              </Button>
            )}
            {task.comments.length > 0 && (
              <span>讨论 {task.comments.length}</span>
            )}
            {systemScope && (
              <span className="text-fg-grey-700">{task.project}</span>
            )}
          </div>
          {task.subtasks.length > 0 && expandedCardTasks[task.id] && <div data-no-drag id={`card-subtasks-${task.id}${preview ? "-preview" : ""}`} className="card-subtask-list" aria-label={`${task.title}的子任务`}>
            {task.subtasks.map(child => <div className="card-subtask-row" key={child.id}>
              <Checkbox color="blue" checked={child.done} aria-label={`${child.done ? "重新打开" : "完成"}卡片子任务：${child.title}`} onChange={(done) => change({ ...board, tasks: board.tasks.map(item => item.id === task.id ? { ...item, subtasks: item.subtasks.map(entry => entry.id === child.id ? { ...entry, done } : entry) } : item) }, done ? "子任务已完成" : "子任务已重新打开")} />
              <button type="button" className={`min-w-0 flex-1 text-left text-sm leading-5 ${child.done ? "line-through text-fg-grey-500" : "text-fg-black"}`} aria-label={`打开卡片子任务：${child.title}`} onClick={() => openDetail(task, [child.id])}>{child.title}</button>
            </div>)}
          </div>}
        </SurfaceCard>
      </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="task-board-shell tasks-product">
      <AppLayout
        hideHeader={!mobile}
        showDatePicker={false}
        showKebab={false}
        showFavorite={false}
        mode="light"
        accent="blue"
        logoText="Forge"
        appName={workspaceName}
        apps={[
          ...workspaces.map((w) => ({ ...w, active: w.id === workspace })),
          { id: "__new__", name: "＋ 新增工作空间" },
        ]}
        onAppChange={(app) => switchWorkspace(app.id)}
        appSubtitle="团队工作空间"
        profilePosition="sidebar"
        hideSidebarWidgets
        sidebarSlot={
          <div className="task-sidebar flex flex-col gap-6">
            <div className="flex flex-col gap-2 task-sidebar-actions">
              <Button color="blue" aria-label="添加任务" iconLeft={<PlusLinear size={20} />} onClick={() => addTask()}>添加任务</Button>
              <MenuItem accent="blue" label="搜索" ariaLabel="搜索" lead={{ kind: "icon", icon: <MagniferLinear size={20} /> }} onClick={() => setSearchOpen(true)} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="px-3 text-xs font-medium text-fg-grey-700">任务</p>
              {nav.map((n) => {
                const count = board.tasks.filter(
                  (t) =>
                    !taskIsArchived(board, t) &&
                    (n.label === "已完成" ? t.done : !t.done) &&
                    (n.label === "今天"
                      ? !!t.date && t.date <= day()
                      : n.label === "收件箱"
                        ? t.project === "收件箱"
                        : n.label === "即将到来"
                          ? !!t.date && t.date >= day()
                          : true),
                ).length;
                return (
                  <MenuItem
                    key={n.label}
                    label={`${n.label}${count ? ` (${count})` : ""}`}
                    ariaLabel={n.label}
                    lead={{ kind: "icon", icon: n.icon }}
                    active={!projectsOpen && scope === n.label}
                    accent="blue"
                    onClick={() => {
                      closeDetail();
                      selectScope(n.label);
                    }}
                  />
                );
              })}
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between px-3">
                <p className="text-xs font-medium text-fg-grey-700">项目</p>
                <IconButton
                  size="sm"
                  variant="ghost"
                  aria-label="新建项目"
                  onClick={() => {
                    setNaming({ kind: "project", value: "" });
                    setNameError("");
                  }}
                >
                  <PlusLinear size={18} />
                </IconButton>
              </div>
              <MenuItem accent="blue" label="全部项目" ariaLabel="查看我的项目" active={projectsOpen} lead={{ kind: "icon", icon: <FolderBoldDuotone size={20} /> }} onClick={() => { closeDetail(); setQuickAdd(null); setProjectsOpen(true); }} />
              {[...board.projects]
                .filter((p) => !board.archived?.includes(p))
                .sort(
                  (a, b) =>
                    Number(board.favorites?.includes(b) ?? false) -
                    Number(board.favorites?.includes(a) ?? false),
                )
                .map((p) => (
                  <MenuItem
                    key={p}
                    label={p}
                    ariaLabel={p}
                    accent="blue"
                    active={!projectsOpen && scope === p}
                    lead={{
                      kind: "icon",
                      icon: <FolderBoldDuotone size={20} />,
                    }}
                    onClick={() => {
                      closeDetail();
                      selectScope(p);
                    }}
                  />
                ))}
              {!!board.archived?.length && <details className="archived-projects">
                <summary>已归档项目 · {board.archived.length}</summary>
                {board.archived.map((project) => <MenuItem key={project} label={project} ariaLabel={project} accent="blue" active={scope === project} onClick={() => { closeDetail(); selectScope(project); }} />)}
              </details>}
            </div>
            <div className="task-sidebar-secondary flex flex-col gap-1">
              <MenuItem label="使用指南" onClick={() => setHelp(true)} />
              <MenuItem label="返回模板库" href="/templates" />
            </div>
            <TemplateProfile template="tasks" onHelp={() => setHelp(true)} />
          </div>
        }
      >
        {projectsOpen ? (
          <ProjectsOverview key={workspace} board={board} onOpen={selectScope} onCreate={name => {
            change({ ...board, projects: [...board.projects, name], sections: [...board.sections, { id: crypto.randomUUID(), title: "待办", project: name }] }, "项目已创建");
            selectScope(name);
          }} />
        ) : (
          <div
            className={`project-workspace ${listMode ? "project-list-workspace" : ""} flex min-h-0 flex-1 flex-col gap-5`}
          >
            <header className="project-header">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-fg-grey-700">
                  {workspaceName} <span className="mx-2">/</span>{" "}
                  {systemScope ? "任务" : "我的项目"}
                </span>
                <div className="flex items-center gap-2">
                  {!systemScope && <Button color="blue" size="sm" variant="tertiary" aria-label={`项目评论（${board.projectComments?.[scope]?.length ?? 0}）`} onClick={() => setProjectCommentsOpen(true)}>评论{board.projectComments?.[scope]?.length ? ` ${board.projectComments[scope].length}` : ""}</Button>}
                  {systemScope ? <Button size="sm" color="blue" variant="tertiary" onClick={exportBoard}>导出</Button> : (
                    <div aria-label="项目操作">
                      <KebabMenu accent="blue" items={[
                        { label: "重命名项目", onSelect: () => { setNaming({ kind: "project", id: scope, value: scope }); setNameError(""); } },
                        { label: "编辑项目详情", onSelect: () => setPropertiesOpen(true) },
                        { label: "复制项目", onSelect: () => {
                          let name = `${scope}（副本）`;
                          let suffix = 2;
                          while (board.projects.includes(name)) name = `${scope}（副本 ${suffix++}）`;
                          setNaming({ kind: "project-copy", id: scope, value: name }); setNameError("");
                        } },
                        { label: favorite ? "取消收藏" : "添加收藏", onSelect: () => change({ ...board, favorites: favorite ? board.favorites?.filter((p) => p !== scope) : [...(board.favorites ?? []), scope] }, favorite ? "已取消收藏" : "项目已收藏") },
                        { label: "添加分区", onSelect: () => { updatePreference({ group: "section" }); setNaming({ kind: "section", value: "" }); setNameError(""); } },
                        { label: `已归档分区（${board.sections.filter(section => section.project === scope && section.archived).length}）`, onSelect: () => setArchivedSectionsOpen(true) },
                        { label: "导出工作空间数据", onSelect: exportBoard },
                        { label: board.archived?.includes(scope) ? "恢复项目" : "归档项目", onSelect: () => {
                          const archived = board.archived?.includes(scope);
                          change({ ...board, archived: archived ? board.archived?.filter((p) => p !== scope) : [...(board.archived ?? []), scope] }, archived ? "项目已恢复" : "项目已归档，可从侧栏恢复");
                          if (!archived) selectScope("收件箱");
                        } },
                        { label: "删除项目", danger: true, onSelect: () => setConfirm({ title: `删除“${scope}”？`, description: "项目中的任务、分区和讨论将一并删除，可通过通知撤销。", action: () => {
                          change({ ...board, projects: board.projects.filter((p) => p !== scope), sections: board.sections.filter((s) => s.project !== scope), tasks: board.tasks.filter((t) => t.project !== scope), favorites: board.favorites?.filter((p) => p !== scope), archived: board.archived?.filter((p) => p !== scope), projectComments: Object.fromEntries(Object.entries(board.projectComments ?? {}).filter(([key]) => key !== scope)), projectDetails: Object.fromEntries(Object.entries(board.projectDetails ?? {}).filter(([key]) => key !== scope)) }, "项目已删除");
                          selectScope("收件箱");
                        } }) },
                      ]} />
                    </div>
                  )}
                  {!systemScope && (
                    <Button size="sm" color="blue" onClick={() => addTask()}>
                      添加任务
                    </Button>
                  )}
                  <ViewMenu open={filtersOpen} onOpenChange={setFiltersOpen} value={viewOptions} onChange={updatePreference} query={query} onQueryChange={setQuery} labels={[...new Set(scoped.flatMap((task) => task.labels ?? []))].sort()} searchRef={search} systemScope={systemScope} />
                </div>
              </div>
              <div className="mt-7 flex items-center gap-2">
                <h1 data-board-title tabIndex={-1} className="text-2xl font-semibold tracking-tight text-fg-black">
                  {scope}
                </h1>
                {!systemScope && (
                  <IconButton
                    variant="ghost"
                    color="blue"
                    aria-label={favorite ? "取消收藏" : "收藏项目"}
                    aria-pressed={favorite}
                    disabled={!board.projects.includes(scope)}
                    onClick={() =>
                      change(
                        {
                          ...board,
                          favorites: favorite
                            ? (board.favorites ?? []).filter((p) => p !== scope)
                            : [...(board.favorites ?? []), scope],
                        },
                        favorite ? "项目已取消收藏" : "项目已收藏并置顶",
                      )
                    }
                  >
                    <StarLinear
                      size={20}
                      color={favorite ? "var(--fg-black)" : "currentColor"}
                    />
                  </IconButton>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-fg-grey-700">{description}</p>
                <span className="text-xs text-fg-grey-700">
                  {scoped.length - done} 项待办 <span className="mx-2">·</span>{" "}
                  已完成 {done}/{scoped.length}
                </span>
              </div>
            </header>
            {!ready ? (
              <p role="status" className="py-12 text-center text-fg-grey-700">
                正在打开你的工作空间…
              </p>
            ) : (
              <div className="workspace-body">
                <div className={`workspace-tasks min-h-0 min-w-0 flex-1 pb-2 ${listMode ? "workspace-list-scroll" : "workspace-board-scroll"}`}>
                  {visible.length === 0 &&
                    (systemScope || query || priority !== "all" || labelFilter !== "__all__" || dateFilter !== "all") && (
                      <div className="task-empty-state mb-5 flex flex-col items-center gap-4 py-12">
                        <CheckCircleBoldDuotone
                          size={36}
                          color="var(--fg-black)"
                        />
                        <p className="font-semibold text-fg-black">
                          {query || priority !== "all" || labelFilter !== "__all__" || dateFilter !== "all"
                            ? "没有找到匹配的任务"
                            : scope === "已完成"
                              ? "完成的任务会保留在这里"
                              : scope === "收件箱"
                                ? "把脑海里的待办，先放在这里"
                                : "暂时没有待处理的任务"}
                        </p>
                        {(scope !== "已完成" ||
                          query ||
                          priority !== "all" || labelFilter !== "__all__") && (
                          <Button
                            size="sm"
                            color="blue"
                            variant="secondary"
                            onClick={() => {
                              if (query || priority !== "all" || labelFilter !== "__all__" || dateFilter !== "all") {
                                clearFilters();
                              } else addTask();
                            }}
                          >
                            {query || priority !== "all" || labelFilter !== "__all__" || dateFilter !== "all"
                              ? "清除筛选"
                              : "添加第一项任务"}
                          </Button>
                        )}
                      </div>
                    )}
                  {scope === "即将到来" && (
                    <div className="date-week-nav">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">
                          {dateLabel(weekDays[0]).split("日")[0]}日起
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="blue"
                            variant="tertiary"
                            disabled={weekOffset === 0}
                            onClick={() =>
                              setWeekOffset((v) => Math.max(0, v - 1))
                            }
                          >
                            上一周
                          </Button>
                          <Button
                            size="sm"
                            color="blue"
                            variant="tertiary"
                            onClick={() => setWeekOffset(0)}
                          >
                            今天
                          </Button>
                          <Button
                            size="sm"
                            color="blue"
                            variant="tertiary"
                            onClick={() => setWeekOffset((v) => v + 1)}
                          >
                            下一周
                          </Button>
                        </div>
                      </div>
                      <div className="date-week-days">
                        {weekDays.map((date) => (
                          <Button
                            key={date}
                            color="blue"
                            variant="tertiary"
                            size="sm"
                            onClick={() =>
                              document
                                .getElementById(`group-${date}`)
                                ?.scrollIntoView({
                                  behavior: reduced ? "instant" : "smooth",
                                  block: "start",
                                })
                            }
                          >
                            {date === day()
                              ? "今天"
                              : date.slice(5).replace("-", "/")}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {((!query && priority === "all" && labelFilter === "__all__" && dateFilter === "all") || visible.length > 0) &&
                    (visible.length > 0 ||
                      scope === "即将到来" ||
                      !systemScope) && (
                      <div
                        className={
                          !listMode ? "kanban-columns" : "task-list-view"
                        }
                      >
                        {orderedGroups
                          .filter(
                            (group) =>
                              scope !== "今天" ||
                              group.tasks.length > 0 ||
                              group.id === "today",
                          )
                          .map((section) => (
                            <Fragment key={section.id}>
                            {!listMode && !systemScope && grouping === "section" && naming?.kind === "section" && !naming.id && naming.before === section.id && <motion.div layout={reduced ? false : "position"} className="add-section-column">{sectionEditor}</motion.div>}
                            <motion.div layout={reduced || columnPreview?.id === section.id ? false : "position"} style={columnPreview?.id === section.id ? { transform: "none" } : undefined} transition={{ layout: { type: "spring", stiffness: 440, damping: 38, mass: 0.8 } }} className={`board-column-slot${columnPreview?.id === section.id ? " column-drag-placeholder" : ""}`} data-section-slot={section.id}>
                            {!listMode && !systemScope && grouping === "section" && !columnPreview && !dragPreview && <Button className="section-insert-trigger" color="blue" variant="tertiary" aria-label={`在${section.title}前添加分区`} onClick={() => { setNaming({ kind: "section", value: "", before: section.id }); setNameError(""); }}><span>添加分区</span></Button>}
                            <motion.section
                              style={columnPreview?.id === section.id ? { position: "fixed", left: 0, top: 0, x: columnX, y: columnY, width: columnPreview.width, height: columnPreview.height, zIndex: 100, pointerEvents: "none" } : undefined}
                              layout={false}
                              transition={{ layout: { type: "spring", stiffness: 440, damping: 38, mass: 0.8 } }}
                              key={section.id}
                              id={`group-${section.id}`}
                              data-task-section={section.id}
                              aria-label={section.title}
                              onDragOver={(event) => {
                                if (systemScope || grouping !== "section" || sort !== "manual") return;
                                event.preventDefault();
                                setDragOver(section.id);
                              }}
                              onDragLeave={(event) => {
                                if (
                                  !event.currentTarget.contains(
                                    event.relatedTarget as Node,
                                  )
                                )
                                  setDragOver(null);
                              }}
                              onDrop={(event) => {
                                if (systemScope || grouping !== "section" || sort !== "manual") return;
                                event.preventDefault();
                                const id =
                                  dragged.current ||
                                  event.dataTransfer.getData("text/plain");
                                if (board.tasks.some((t) => t.id === id))
                                  move(id, section.id);
                                dragged.current = null;
                                setDragOver(null);
                              }}
                              className={`board-section${columnPreview?.id === section.id ? " column-drag-floating" : ""} flex min-w-0 flex-col gap-3 rounded-2xl p-1 transition-colors ${dragOver === section.id ? "bg-fg-grey-100" : ""}`}
                            >
                              {naming?.kind === "section" && naming.id === section.id ? sectionEditor : <div
                                className="section-drag-heading flex items-center gap-3 px-1 py-2"
                                onPointerDown={(event) => {
                                  if (listMode || systemScope || grouping !== "section" || event.button !== 0 || settlingDrag.current || (event.target as Element).closest("[data-no-drag]")) return;
                                  const element = event.currentTarget.closest<HTMLElement>("[data-task-section]");
                                  if (!element) return;
                                  const bounds = element.getBoundingClientRect();
                                  sectionDrag.current = { id: section.id, x: event.clientX, y: event.clientY, moved: false, offsetX: event.clientX - bounds.left, offsetY: event.clientY - bounds.top, clientX: event.clientX, clientY: event.clientY, width: bounds.width, height: bounds.height };
                                }}
                              >
                                {listMode && <div data-no-drag><IconButton color="blue" variant="ghost" size="sm" aria-label={`${collapsedGroups[`${preferenceKey}:${section.id}`] ? "展开" : "折叠"}分区：${section.title}`} aria-expanded={!collapsedGroups[`${preferenceKey}:${section.id}`]} aria-controls={`tasks-${section.id}`} onClick={() => setCollapsedGroups(current => ({ ...current, [`${preferenceKey}:${section.id}`]: !current[`${preferenceKey}:${section.id}`] }))}><span className={collapsedGroups[`${preferenceKey}:${section.id}`] ? "-rotate-90" : ""}><AltArrowDownLinear size={16} /></span></IconButton></div>}
                                <h2 className="flex-1 text-sm font-bold text-fg-black">
                                  {!systemScope && grouping === "section" ? <Button color="blue" variant="tertiary" className="section-title-edit" aria-label={`编辑分区：${section.title}`} onClick={() => { if (settlingDrag.current) return; setNaming({ kind: "section", id: section.id, value: section.title, description: board.sections.find(item => item.id === section.id)?.description || "" }); setNameError(""); }}>{section.title}</Button> : section.title}{" "}
                                  <span className="ml-2 font-normal text-fg-grey-700">
                                    {section.tasks.length}
                                  </span>
                                </h2>
                                {!systemScope && grouping === "section" && (
                                  <div
                                    data-no-drag
                                    aria-label={`分区操作：${section.title}`}
                                  >
                                    <ContextMenu
                                      label={`分区操作：${section.title}`}
                                      items={[
                                        {
                                          label: "编辑分区",
                                          onSelect: () => {
                                            setNaming({
                                              kind: "section",
                                              id: section.id,
                                              value: section.title,
                                              description: board.sections.find((item) => item.id === section.id)?.description || "",
                                            });
                                            setNameError("");
                                          },
                                        },
                                        {
                                          label: "添加任务",
                                          onSelect: () => addTask(section.id),
                                        },
                                        { label: "复制分区链接", onSelect: () => copyBoardLink(sectionLinkHash(section.id), "分区") },
                                        { label: "复制分区", onSelect: () => change(copySection(board, section.id), "分区及任务已复制") },
                                        { label: "归档分区", onSelect: () => { setQuickAdd(null); change(setSectionArchived(board, section.id, true), "分区已归档，可从项目菜单恢复"); } },
                                        ...(board.projects.some(name => name !== scope && !board.archived?.includes(name)) ? [{ label: "移动到项目", children: board.projects.filter(name => name !== scope && !board.archived?.includes(name)).map(name => ({ label: name, onSelect: () => change(moveSection(board, section.id, name), `分区已移至${name}`) })) }] : []),
                                        ...(projectSections(board, scope).length > 1
                                          ? [
                                              {
                                                label: "删除分区",
                                                danger: true,
                                                onSelect: () =>
                                                  deleteSection(section.id),
                                              },
                                            ]
                                          : []),
                                      ]}
                                    />
                                  </div>
                                )}
                              </div>}
                              {!systemScope && grouping === "section" && board.sections.find((item) => item.id === section.id)?.description && <p className="px-2 pb-3 text-xs leading-5 text-fg-grey-700">{board.sections.find((item) => item.id === section.id)?.description}</p>}
                              <div id={`tasks-${section.id}`} style={listMode && collapsedGroups[`${preferenceKey}:${section.id}`] ? { display: "none" } : undefined} className={listMode ? "list-section-tasks" : "kanban-section-tasks"} tabIndex={listMode ? undefined : 0} role={listMode ? undefined : "region"} aria-label={listMode ? undefined : `${section.title}任务列表`}>
                              <AnimatePresence initial={false}>
                                {section.tasks.map(card)}
                              </AnimatePresence>
                              {dragPreview?.section === section.id && !dragPreview.before && <div data-drag-placeholder className="task-drag-placeholder" style={{ height: dragPreview.height }} aria-hidden="true" />}
                              {scope !== "已完成" && section.id !== "overdue" && (
                                quickAdd?.group === section.id ? <QuickAdd
                                  key={`${workspace}:${scope}:${section.id}`}
                                  project={taskProject}
                                  section={quickAdd.section}
                                  initialDate={quickAdd.date}
                                  initialPriority={"priority" in section && section.priority ? section.priority : priority !== "all" ? priority : "4"}
                                  availableLabels={collectTaskLabels(board.tasks)}
                                  onClose={() => setQuickAdd(null)}
                                  onSave={(task) => change({ ...board, tasks: [...board.tasks, { ...task, labels: [...new Set([...(task.labels ?? []), ...(labelFilter === "__all__" ? [] : [labelFilter.slice(6)]), ...("label" in section && section.label ? [section.label] : [])])] }] }, "任务已添加，可以继续录入")}
                                /> : <Button variant="tertiary" color="blue" size="sm" iconLeft={<PlusLinear size={16} />} onClick={() => setQuickAdd({ group: section.id, section: systemScope || grouping !== "section" ? projectSections(board, taskProject)[0]?.id : section.id, date: section.date ?? (dateFilter !== "all" && dateFilter !== "none" ? day() : undefined) })}>添加任务</Button>
                              )}
                              </div>
                            </motion.section>
                            </motion.div>
                            </Fragment>
                          ))}
                        {!systemScope && grouping === "section" && (
                          <div className="add-section-column">
                            {naming?.kind === "section" && !naming.id && !naming.before ? sectionEditor :
                            <Button
                              size="sm"
                              variant="tertiary"
                              color="blue"
                              onClick={() => {
                                setNaming({ kind: "section", value: "" });
                                setNameError("");
                              }}
                              iconLeft={<PlusLinear size={16} />}
                            >
                              添加分区
                            </Button>
                            }
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        )}
        <div {...{ onClose: (event: SyntheticEvent) => {
          if (detailId || !(event.target instanceof HTMLDialogElement) || !event.target.classList.contains("task-detail-modal")) return;
          const trigger = [...document.querySelectorAll<HTMLButtonElement>("button[data-task-open]")].find(button => button.dataset.taskOpen === lastDetailTask.current);
          (trigger ?? document.querySelector<HTMLElement>("[data-board-title]"))?.focus({ preventScroll: true });
        } }}>
        <Modal className="task-detail-modal" open={!!detailId} onOpenChange={(open) => { if (!open) closeDetail(); }} title="任务详情" closeLabel="关闭任务详情">
          <div className="h-full" {...{ onClose: (event: { stopPropagation: () => void }) => event.stopPropagation(), onCancel: (event: { stopPropagation: () => void }) => event.stopPropagation() }}>
            {detailId ? (
          ready ? (
            linkedWorkspaceMissing ? (
              <div className="p-8"><h1 className="text-xl font-semibold">此浏览器中没有链接指定的工作空间</h1><p className="my-4 text-sm text-fg-grey-700">任务链接需要在保存了该工作空间的浏览器中打开。</p><Button color="blue" onClick={closeDetail}>返回任务看板</Button></div>
            ) : board.tasks.some((t) => t.id === detailId) ? (
              <TaskDetail
                onExitGuardChange={(guard) => { detailExitGuard.current = guard; }}
                key={`${workspace}:${detailId}`}
                task={board.tasks.find((t) => t.id === detailId)!}
                board={board}
                detailPath={detailPath}
                onDetailPathChange={(path) => openDetail(board.tasks.find((t) => t.id === detailId)!, path)}
                workspaceName={workspaceName}
                draftScope={`${workspace}:${detailId}`}
                saveFailed={storageFailed}
                onRetrySave={() => persistBoard(true)}
                onBack={closeDetail}
                backLabel={systemScope ? `返回${scope}` : listMode ? "返回列表" : "返回看板"}
                navigationFocus={detailNavigationFocus}
                onPrevious={previousDetail ? () => openDetail(previousDetail, [], "previous") : undefined}
                onNext={nextDetail ? () => openDetail(nextDetail, [], "next") : undefined}
                onChange={(task) =>
                  setBoard((current) => ({
                    ...current,
                    tasks: writeTasks(current.tasks, current.tasks.map((t) => t.id === task.id ? task : t)),
                  }))
                }
                onDuplicate={duplicateTask}
                onCopyLink={(task) => void copyTaskLink(task)}
                onDelete={removeTask}
              />
            ) : (
              <div className="p-8">
                <h1 className="text-xl font-semibold">任务不存在或已被删除</h1>
                <Button color="blue" onClick={closeDetail}>
                  返回任务看板
                </Button>
              </div>
            )
          ) : null
            ) : null}
          </div>
        </Modal>
        </div>
        <Modal open={!!linkToCopy} onOpenChange={(open) => { if (!open) setLinkToCopy(""); }} title={`复制${copyLinkKind}链接`}>
          <p role="status" className="mb-3 text-sm text-fg-grey-700">{copyLinkStatus}</p>
          <p className="mb-3 text-xs text-fg-grey-700">链接仅适用于保存了该工作空间的浏览器。</p>
          <TextField color="blue" label={`${copyLinkKind}链接`} readOnly value={linkToCopy} autoFocus onFocus={(event) => event.currentTarget.select()} />
        </Modal>
        {dragPreview && <motion.div className={`task-drag-preview tasks-product${listMode ? " task-list-view" : ""}`} style={{ x: dragX, y: dragY, rotate: dragRotation, width: dragPreview.width }} aria-hidden="true" inert>
          {board.tasks.filter(task => task.id === dragPreview.id).map(task => ({ ...task, dragOverlay: true })).map(card)}
        </motion.div>}
        <Modal open={archivedSectionsOpen} onOpenChange={setArchivedSectionsOpen} title="已归档分区">
        <p className="mb-4 text-sm text-fg-grey-700">归档保留分区中的任务及详情。恢复后会重新出现在项目和日程中。</p>
        {board.sections.filter(section => section.project === scope && section.archived).length === 0 && <p className="py-6 text-sm text-fg-grey-700">这个项目还没有已归档分区。</p>}
        {board.sections.filter(section => section.project === scope && section.archived).map(section => <div key={section.id} className="flex items-center justify-between gap-4 border-b border-fg-grey-200 py-3">
          <div className="min-w-0"><p className="truncate text-sm font-semibold text-fg-black">{section.title}</p><p className="text-xs text-fg-grey-700">{board.tasks.filter(task => task.section === section.id).length} 项任务</p></div>
          <Button color="blue" size="sm" variant="secondary" aria-label={`恢复分区：${section.title}`} onClick={() => change(setSectionArchived(board, section.id, false), "分区已恢复")}>恢复</Button>
        </div>)}
      </Modal>
      <Modal open={projectCommentsOpen} onOpenChange={setProjectCommentsOpen} title={`${scope} · 项目评论`}>
        {storageFailed && <div role="alert" className="mb-3 text-sm text-fg-red">评论更改尚未保存到浏览器。<Button color="blue" size="sm" variant="tertiary" onClick={() => persistBoard(true)}>重试保存</Button></div>}
        {projectCommentsOpen && <TaskComments draftKey={`${workspace}:project:${scope}`} key={`${workspace}:${scope}`} label="项目评论" emptyText="讨论项目目标、共享资料或记录整体进展。任务细节可以留在对应任务的评论中。" value={board.projectComments?.[scope] ?? []} onChange={(comments) => setBoard(current => ({ ...current, projectComments: { ...current.projectComments, [scope]: comments } }))} />}
      </Modal>
      <TaskSearch board={board} open={searchOpen} onOpenChange={setSearchOpen} onProject={selectScope} onTask={(task, path) => { selectScope(task.project); openDetail(task, path); }} />
        <Modal
          open={propertiesOpen}
          onOpenChange={setPropertiesOpen}
          title="项目属性"
        >
          <ProjectProperties
            value={projectDetails}
            total={scoped.length}
            done={done}
            onChange={updateProjectDetails}
          />
        </Modal>
        {editing && (
          <TaskEditor
            key={editing.id}
            task={editing}
            board={board}
            onClose={() => setEditing(null)}
            onSave={updateTask}
            onDelete={removeTask}
          />
        )}
        <Modal
          open={!!naming && naming.kind !== "section"}
          onOpenChange={(open) => {
            if (!open) setNaming(null);
          }}
          title={
            naming?.kind === "workspace"
              ? "新增工作空间"
              : naming?.kind === "project-copy" ? "复制项目"
              : naming?.kind === "project"
                ? naming.id ? "重命名项目" : "新建项目"
                : naming?.id
                  ? "编辑分区"
                  : "添加分区"
          }
          footer={
            <>
              <Button
                color="blue"
                variant="secondary"
                onClick={() => setNaming(null)}
              >
                取消
              </Button>
              <Button color="blue" onClick={saveName}>
                {naming?.kind === "project-copy" ? "复制项目" : naming?.kind === "section" ? "保存分区" : "保存名称"}
              </Button>
            </>
          }
        >
          {naming?.kind === "project-copy" && <p className="mb-4 text-sm text-fg-grey-700">复制“{naming.id}”的项目说明、全部分区和任务，包括已完成任务、已归档分区、子任务、附件及项目/任务评论。副本可独立修改，不复制活动记录。</p>}
          <TextField
            color="blue"
            autoFocus
            label="名称"
            value={naming?.value ?? ""}
            onChange={(value) => {
              if (naming) setNaming({ ...naming, value });
              setNameError("");
            }}
            state={nameError ? "error" : "idle"}
            errorMessage={nameError}
            onKeyDown={(event) => {
              if (event.key === "Enter") saveName();
            }}
          />
          {naming?.kind === "section" && naming.id && <TextArea color="blue" label="分区描述" placeholder="添加描述" rows={3} value={naming.description || ""} onChange={(description) => setNaming({ ...naming, description })} />}
        </Modal>
        <ConfirmationDialog
          open={!!confirm}
          onOpenChange={(open) => {
            if (!open) setConfirm(null);
          }}
          title={confirm?.title ?? "确认操作"}
          description={confirm?.description ?? ""}
          color="red"
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            confirm?.action();
            setConfirm(null);
          }}
        />
        <Modal open={help} onOpenChange={setHelp} title="让任务井井有条">
          <div className="space-y-4 text-sm leading-7 text-fg-grey-700">
            <p>
              从“添加任务”开始，设置负责人、优先级和截止日期。点击任务可维护子任务与讨论，保存后立即更新。
            </p>
            <p>
              拖动卡片调整分区，也可在任务详情的“所在分区”中操作。勾选完成后，用“已完成”找回任务，或点击通知里的“撤销”。
            </p>
            <p>
              侧栏可切换今天、即将到来和项目。按 / 聚焦搜索；弹窗支持 Escape
              关闭。减少动态效果会遵循系统设置。
            </p>
            <p>
              这是静态模板，数据仅保存在当前浏览器；导出可下载当前完整看板，不会发送到服务器。
            </p>
          </div>
        </Modal>
      </AppLayout>
    </div>
  );
}
