import { collaborationStates, type CollaborationState } from "./_collaboration";
import { type Task, type Board, day, projectSections } from "./_data";

export type ViewPreference = { view: number; sort: string; showDone: boolean; group: "section" | "priority" | "date" | "label" | "collaboration"; collaboration: "all" | "human" | "attention" | CollaborationState; dateFilter: "all" | "today" | "week" | "next7" | "month" | "next30" | "none"; priority: string; label: string };
export type ViewPreferences = Record<string, ViewPreference>;
export const DEFAULT_VIEW: ViewPreference = { view: 0, sort: "manual", showDone: false, group: "section", dateFilter: "all", priority: "all", label: "__all__", collaboration: "all" };
export const viewKey = (workspace: string, project: string) => JSON.stringify([workspace, project]);

export function parseViewPreferences(value: unknown): ViewPreferences {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).flatMap(([key, entry]) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Partial<ViewPreference>;
    if (![0, 1].includes(item.view as number) || !["manual", "priority", "date", "name"].includes(item.sort as string) || typeof item.showDone !== "boolean") return [];
    return [[key, { ...DEFAULT_VIEW, view: item.view!, sort: item.sort!, showDone: item.showDone,
      group: ["section", "priority", "date", "label", "collaboration"].includes(item.group ?? "") ? item.group! : "section",
      dateFilter: ["all", "today", "week", "next7", "month", "next30", "none"].includes(item.dateFilter ?? "") ? item.dateFilter! : "all",
      priority: ["all", "1", "2", "3", "4"].includes(item.priority ?? "") ? item.priority! : "all",
      collaboration: typeof item.collaboration === "string" && (["all", "human", "attention"].includes(item.collaboration) || Object.hasOwn(collaborationStates, item.collaboration)) ? item.collaboration : "all",
      label: typeof item.label === "string" && (item.label === "__all__" || item.label.startsWith("label:")) ? item.label : "__all__",
    }]];
  }));
}

export function matchesDateFilter(date: string, filter: ViewPreference["dateFilter"], today = day()) {
  if (filter === "all") return true;
  if (filter === "none") return !date;
  if (!date) return false;
  if (filter === "today") return date === today;
  const current = new Date(`${today}T12:00:00`);
  if (filter === "month") return date.slice(0, 7) === today.slice(0, 7);
  const end = new Date(current);
  end.setDate(end.getDate() + (filter === "week" ? 7 - (current.getDay() || 7) : filter === "next7" ? 6 : 29));
  const format = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  if (filter === "week") { current.setDate(current.getDate() - ((current.getDay() || 7) - 1)); return date >= format(current) && date <= format(end); }
  return date >= today && date <= format(end);
}

export type TaskGroup = { id: string; title: string; tasks: Task[]; date?: string; priority?: string; label?: string };
export function projectTaskGroups(board: Board, project: string, tasks: Task[], group: ViewPreference["group"]): TaskGroup[] {
  if (group === "section") return projectSections(board, project).map((section) => ({ ...section, tasks: tasks.filter((task) => task.section === section.id) }));
  if (group === "collaboration") return ["waiting", "review", "running", "ready", "failed", "paused", "approved", "human"].map(state => ({
    id: `collaboration:${state}`, title: state === "human" ? "人工任务" : collaborationStates[state as CollaborationState],
    tasks: tasks.filter(task => state === "human" ? !task.collaboration : task.collaboration?.state === state),
  })).filter(group => group.tasks.length > 0);
  if (group === "priority") return ["1", "2", "3", "4"].map((priority) => ({ id: `priority:${priority}`, title: `P${priority}${priority === "4" ? " · 无优先级" : ""}`, priority, tasks: tasks.filter((task) => task.priority === priority) }));
  if (group === "label") return [...new Set(tasks.flatMap((task) => task.labels ?? []))].sort().map((label) => ({ id: `label:${label}`, title: `@${label}`, label, tasks: tasks.filter((task) => task.labels?.includes(label)) })).concat([{ id: "label:none", title: "没有标签", label: "", tasks: tasks.filter((task) => !task.labels?.length) }]);
  return [...new Set(tasks.map((task) => task.date))].sort((a, b) => (a || "9999").localeCompare(b || "9999")).map((date) => ({ id: `date:${date || "none"}`, title: date || "没有日期", date, tasks: tasks.filter((task) => task.date === date) }));
}

export function matchesCollaboration(task: Task, filter: ViewPreference["collaboration"]) {
  if (filter === "all") return true;
  if (filter === "human") return !task.collaboration;
  if (filter === "attention") return task.collaboration?.state === "waiting" || task.collaboration?.state === "review" || task.collaboration?.state === "failed";
  return task.collaboration?.state === filter;
}
