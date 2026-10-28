// Static template: all interactions run locally; no backend or team synchronization.
import { transitionCollaboration, validCollaboration, type TaskCollaboration } from "./_collaboration";
export type TaskAttachment = { id: string; name: string; url: string; size: number };
export type TaskComment = { id: string; text: string; author?: string; at?: string; attachments?: TaskAttachment[] };
export type RepeatRule = { interval: number; basis: "scheduled" | "completed"; until?: string; remaining?: number };
export type TaskSchedule = { time?: string; repeat?: "daily" | "weekdays" | "weekly" | "monthly" | "yearly"; repeatAnchor?: number; repeatRule?: RepeatRule };
export type Subtask = TaskSchedule & {
  id: string; title: string; done: boolean;
  description?: string; date?: string; priority?: string;
  labels?: string[];
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  subtasks?: Subtask[];
  completionHistory?: { at: string; date: string }[];
};
export type Task = {
  collaboration?: TaskCollaboration;
  id: string;
  title: string;
  description: string;
  section: string;
  project: string;
  priority: string;
  date: string;
  time?: string;
  repeat?: "daily" | "weekdays" | "weekly" | "monthly" | "yearly";
  repeatAnchor?: number;
  repeatRule?: RepeatRule;
  owner: string;
  done: boolean;
  completedAt?: string;
  activity?: { id: string; at: string; text: string }[];
  labels?: string[];
  subtasks: Subtask[];
  comments: (string | TaskComment)[];
  attachments?: TaskAttachment[];
};
export type WorkspaceAgent = { id: string; name: string; description: string; instructions: string };
export type WorkspaceResource = { id: string; title: string; content: string; createdAt: string; attachments: TaskAttachment[] };
export type Board = {
  agents?: WorkspaceAgent[];
  resources?: WorkspaceResource[];
  favorites?: string[];
  archived?: string[];
  projectComments?: Record<string, TaskComment[]>;
  projectDetails?: Record<string, {status:string; owner:string; priority:string; description:string}>;
  sections: { id: string; title: string; project?: string; description?: string; archived?: boolean }[];
  projects: string[];
  tasks: Task[];
};
export function collectTaskLabels(items: readonly { labels?: string[]; subtasks?: Subtask[] }[]): string[] {
  const labels = new Map<string, string>();
  const visit = (entries: typeof items) => {
    for (const item of entries) {
      for (const label of item.labels ?? []) if (!labels.has(label.toLocaleLowerCase())) labels.set(label.toLocaleLowerCase(), label);
      if (item.subtasks) visit(item.subtasks);
    }
  };
  visit(items);
  return [...labels.values()].sort((a, b) => a.localeCompare(b, "zh-CN"));
}
export type TaskSearchEntry = { id: string; task: Task; item: Task | Subtask; path: string[]; context: string };
export function taskSearchEntries(board: Board): TaskSearchEntry[] {
  const entries: TaskSearchEntry[] = [];
  for (const task of board.tasks) {
    if (taskIsArchived(board, task)) continue;
    const visit = (item: Task | Subtask, path: string[], ancestors: string[]) => {
      entries.push({ id: JSON.stringify([task.id, ...path]), task, item, path, context: [task.project, ...ancestors].join(" / ") });
      for (const child of item.subtasks ?? []) visit(child, [...path, child.id], [...ancestors, item.title]);
    };
    visit(task, [], []);
  }
  return entries;
}
export function taskDetailHash(id: string, path: readonly string[] = []): string {
  return `task/${[id, ...path].map(encodeURIComponent).join("/")}`;
}
export function sectionLinkHash(id: string): string { return `section/${encodeURIComponent(id)}`; }
export function parseSectionLinkHash(hash: string): string | null {
  if (!hash.startsWith("#section/")) return null;
  try { return decodeURIComponent(hash.slice(9)) || null; } catch { return null; }
}
export function parseTaskDetailHash(hash: string): { id: string; path: string[] } | null {
  if (!hash.startsWith("#task/")) return null;
  try {
    const [id, ...path] = hash.slice(6).split("/").map(decodeURIComponent);
    return id && path.every(Boolean) ? { id, path } : null;
  } catch { return null; }
}
export function hasSubtaskPath(task: Task, path: readonly string[]): boolean {
  let children = task.subtasks;
  for (const id of path) {
    const child = children.find(item => item.id === id);
    if (!child) return false;
    children = child.subtasks ?? [];
  }
  return true;
}
// Give copied child content independent identities at every depth.
export function copySubtask(item: Subtask, patch: Partial<Subtask> = {}): Subtask {
  const copy = structuredClone(item);
  return { ...copy, id: crypto.randomUUID(),
    attachments: copy.attachments?.map(file => ({ ...file, id: crypto.randomUUID() })),
    comments: copy.comments?.map(comment => ({ ...comment, id: crypto.randomUUID(), attachments: comment.attachments?.map(file => ({ ...file, id: crypto.randomUUID() })) })),
    subtasks: copy.subtasks?.map(child => copySubtask(child)), ...patch };
}
// Duplicate content with independent identities throughout the recursive task tree.
export function copyTask(task: Task, patch: Partial<Task> = {}): Task {
  const copy = structuredClone(task);
  const children = (items: Subtask[]) => items.map(item => copySubtask(item));
  return { ...copy, id: crypto.randomUUID(), activity: [],
    comments: copy.comments.map(comment => typeof comment === "string" ? comment : ({ ...comment, id: crypto.randomUUID(), attachments: comment.attachments?.map(file => ({ ...file, id: crypto.randomUUID() })) })),
    attachments: copy.attachments?.map(file => ({ ...file, id: crypto.randomUUID() })),
    subtasks: children(copy.subtasks), ...patch };
}
export function copyProject(board: Board, project: string, name: string, resolvedDetails?: NonNullable<Board["projectDetails"]>[string]): Board {
  name = name.trim();
  if (!board.projects.includes(project) || !name || board.projects.includes(name) || ["今天", "收件箱", "即将到来", "已完成"].includes(name)) return board;
  const sections = board.sections.filter(section => section.project === project).map(section => ({ ...section, id: crypto.randomUUID(), project: name }));
  const sectionIds = new Map(board.sections.filter(section => section.project === project).map((section, index) => [section.id, sections[index].id]));
  const tasks = board.tasks.filter(task => task.project === project).map(task => copyTask(task, { project: name, section: sectionIds.get(task.section)! }));
  const details = resolvedDetails ?? board.projectDetails?.[project];
  return { ...board, projects: [...board.projects, name], sections: [...board.sections, ...sections], tasks: [...board.tasks, ...tasks],
    projectComments: board.projectComments?.[project] ? { ...board.projectComments, [name]: structuredClone(board.projectComments[project]).map(comment => ({ ...comment, id: crypto.randomUUID(), attachments: comment.attachments?.map(file => ({ ...file, id: crypto.randomUUID() })) })) } : board.projectComments,
    projectDetails: details ? { ...board.projectDetails, [name]: structuredClone(details) } : board.projectDetails };
}
export function copySection(board: Board, id: string): Board {
  const source = board.sections.find(section => section.id === id);
  if (!source) return board;
  const names = new Set(board.sections.filter(section => section.project === source.project).map(section => section.title));
  let title = `${source.title}（副本）`;
  let suffix = 2;
  while (names.has(title)) title = `${source.title}（副本 ${suffix++}）`;
  const section = { ...source, id: crypto.randomUUID(), title };
  const sections = [...board.sections];
  sections.splice(sections.findIndex(item => item.id === id) + 1, 0, section);
  return { ...board, sections, tasks: [...board.tasks, ...board.tasks.filter(task => task.section === id).map(task => copyTask(task, { section: section.id }))] };
}
function uniqueSectionTitle(sections: Board["sections"], project: string | undefined, base: string): string {
  const names = new Set(sections.filter(section => section.project === project).map(section => section.title));
  let title = base;
  let suffix = 2;
  while (names.has(title)) title = `${base}（${suffix++}）`;
  return title;
}
export function moveSection(board: Board, id: string, project: string): Board {
  const source = board.sections.find(section => section.id === id);
  if (!source || source.project === project || !board.projects.includes(project) || board.archived?.includes(project)) return board;
  const title = uniqueSectionTitle(board.sections, project, source.title);
  const sections = board.sections.filter(section => section.id !== id);
  if (!sections.some(section => section.project === source.project && !section.archived)) sections.push({ id: crypto.randomUUID(), project: source.project, title: uniqueSectionTitle(sections, source.project, "准备开始") });
  sections.push({ ...source, title, project });
  return { ...board, sections, tasks: board.tasks.map(task => task.section === id ? { ...task, project } : task) };
}
export function taskIsArchived(board: Board, task: Task): boolean {
  return !!board.archived?.includes(task.project) || !!board.sections.find(section => section.id === task.section)?.archived;
}
export function setSectionArchived(board: Board, id: string, archived: boolean): Board {
  const source = board.sections.find(section => section.id === id);
  if (!source || !!source.archived === archived) return board;
  const sections = board.sections.map(section => section.id === id ? { ...section, archived } : section);
  if (!sections.some(section => section.project === source.project && !section.archived)) sections.push({ id: crypto.randomUUID(), title: uniqueSectionTitle(sections, source.project, "准备开始"), project: source.project });
  return { ...board, sections };
}
export const STORAGE_KEY = "forge-task-board:v1";
export function day(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function seedBoard(): Board {
  const titles = [
    "整理品牌调研与竞品灵感",
    "确定新的视觉方向",
    "设计品牌标志的三个方案",
    "梳理官网的信息架构",
    "完成首页高保真设计",
    "准备设计评审材料",
    "整理品牌色彩与字体规范",
    "收集团队第一轮反馈",
    "建立项目资料库",
  ];
  const descriptions = [
    "收集 5 个参考品牌，记录值得借鉴的细节。",
    "让品牌更轻盈、更有温度，也更容易被记住。",
    "从字标、图形和组合形式分别探索。",
    "先让用户看懂我们，再引导他们采取行动。",
    "从首屏叙事开始，打磨每一个关键触点。",
    "把设计背后的取舍讲清楚。",
    "为每一次表达建立一致的基础。",
    "把有价值的建议变成下一步行动。",
    "所有灵感和文件，都有一个好去处。",
  ];
  return {
    sections: [
      { id: "todo", title: "准备开始" },
      { id: "doing", title: "专注进行" },
      { id: "review", title: "等待反馈" },
    ],
    projects: ["品牌焕新计划", "日常工作"],
    tasks: titles.map((title, i) => ({
      id: `task-${i}`,
      title,
      description: descriptions[i],
      project: i === 7 ? "日常工作" : "品牌焕新计划",
      section: i < 3 ? "todo" : i < 6 ? "doing" : "review",
      priority: i % 3 === 0 ? "1" : i % 3 === 1 ? "2" : "3",
      date: day(i % 4),
      owner: ["林晓", "陈一", "周可"][i % 3],
      done: i === 8,
      subtasks:
        i === 4
          ? [
              { id: "s1", title: "首屏方案", done: true },
              { id: "s2", title: "内容区与移动端", done: false },
            ]
          : [],
      ...(i === 0 || i === 6 ? { collaboration: {
        agent: i === 0 ? "研究助手" : "设计助手",
        state: i === 0 ? "ready" as const : "review" as const,
        attempt: i === 0 ? 0 : 1,
        brief: i === 0 ? "对比 5 个参考品牌的定位、视觉表达和信息结构，给出可借鉴的方向。请列出来源，未经确认不替换现有方案。" : "整理色彩与字体的使用规范，说明适用场景，提交给我审核后再发布。",
        ...(i === 6 ? { result: "## 品牌规范草案\n\n> 模板示例，未经真实 Agent 执行。\n\n### 色彩\n- 主色用于关键操作与重点信息\n- 中性色用于正文、分隔线和背景\n- 功能色仅表达成功、警告和异常\n\n### 字体\n- 标题与正文使用统一字体族\n- 用字号和字重建立层级，避免过多字体\n\n### 待确认\n1. 品牌主色的最终色值\n2. 正文字体的授权与多语言覆盖\n\n**验收建议：** 确认上述两项后，再产出可发布的规范文件。" } : {}),
        events: [{ id: `seed-agent-${i}`, at: new Date().toISOString(), text: i === 0 ? "已委派给研究助手，等待开始演示" : "已提交示例规范，等待人工审核" }],
      } } : {}),
      comments: i === 2 ? ["林晓：可以先试试更简洁的方向。"] : [],
    })),
  };
}
export function validAttachments(files: unknown): files is TaskAttachment[] {
  return Array.isArray(files) && files.every((file) => file && typeof file === "object" && typeof file.id === "string" && typeof file.name === "string" && typeof file.url === "string" && /^data:[^,]*;base64,/.test(file.url) && Number.isFinite(file.size) && file.size >= 0 && file.size <= 500 * 1024) && files.reduce((sum, file) => sum + file.size, 0) <= 1024 * 1024;
}
function validComment(comment: unknown): comment is TaskComment {
  if (!comment || typeof comment !== "object") return false;
  const c = comment as TaskComment;
  return typeof c.id === "string" && typeof c.text === "string" &&
    (c.author === undefined || typeof c.author === "string") &&
    (c.at === undefined || (typeof c.at === "string" && Number.isFinite(Date.parse(c.at)))) &&
    (c.attachments === undefined || validAttachments(c.attachments));
}
function validSchedule(s: TaskSchedule) {
  const rule = s.repeatRule;
  return (s.time === undefined || (typeof s.time === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(s.time))) &&
    (s.repeat === undefined || ["daily", "weekdays", "weekly", "monthly", "yearly"].includes(s.repeat)) &&
    (s.repeatAnchor === undefined || (Number.isInteger(s.repeatAnchor) && s.repeatAnchor >= 1 && s.repeatAnchor <= 31)) &&
    (rule === undefined || (!!s.repeat && !!rule && typeof rule === "object" && Number.isInteger(rule.interval) && rule.interval >= 1 && rule.interval <= 999 && ["scheduled", "completed"].includes(rule.basis) &&
      (rule.until === undefined || (typeof rule.until === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rule.until) && Number.isFinite(Date.parse(`${rule.until}T12:00:00`)) && new Date(`${rule.until}T12:00:00`).toLocaleDateString("sv-SE") === rule.until)) &&
      (rule.remaining === undefined || (Number.isInteger(rule.remaining) && rule.remaining >= 1 && rule.remaining <= 999))));
}
function validSubtasks(value: unknown, ancestors = new Set<unknown>()): value is Subtask[] {
  if (!Array.isArray(value) || ancestors.has(value)) return false;
  const path = new Set(ancestors).add(value);
  return value.every((s) => s && typeof s === "object" &&
    typeof s.id === "string" && typeof s.title === "string" && typeof s.done === "boolean" &&
    (s.description === undefined || typeof s.description === "string") &&
        (s.archived === undefined || typeof s.archived === "boolean") &&
    (s.date === undefined || typeof s.date === "string") &&
    validSchedule(s) &&
    (s.completionHistory === undefined || (Array.isArray(s.completionHistory) && s.completionHistory.every((entry: { at: string; date: string }) => entry && typeof entry.date === "string" && typeof entry.at === "string" && Number.isFinite(Date.parse(entry.at))))) &&
    (s.priority === undefined || ["P1", "P2", "P3", "P4"].includes(s.priority)) &&
    (s.labels === undefined || (Array.isArray(s.labels) && s.labels.every((label: unknown) => typeof label === "string" && label.trim().length > 0 && label.length <= 40))) &&
    (s.comments === undefined || (Array.isArray(s.comments) && s.comments.every(validComment))) &&
    (s.attachments === undefined || validAttachments(s.attachments)) &&
    (s.subtasks === undefined || validSubtasks(s.subtasks, path)));
}
export function isBoard(value: unknown): value is Board {
  if (!value || typeof value !== "object") return false;
  const b = value as Board;
  return (
    (b.agents === undefined || (Array.isArray(b.agents) && new Set(b.agents.map(a=>a?.id)).size===b.agents.length && b.agents.every(a=>a && [a.id,a.name,a.description,a.instructions].every(v=>typeof v==="string")))) &&
    (b.resources === undefined || (Array.isArray(b.resources) && new Set(b.resources.map(r=>r?.id)).size===b.resources.length && b.resources.every(r=>r && [r.id,r.title,r.content,r.createdAt].every(v=>typeof v==="string") && validAttachments(r.attachments)))) &&
    (b.projectComments === undefined || (b.projectComments !== null && typeof b.projectComments === "object" && !Array.isArray(b.projectComments) && Object.values(b.projectComments).every(comments => Array.isArray(comments) && comments.every(validComment)))) &&
    (b.projectDetails === undefined ||
      (b.projectDetails !== null && typeof b.projectDetails === "object" && !Array.isArray(b.projectDetails) &&
        Object.values(b.projectDetails).every(p => p && [p.status,p.owner,p.priority,p.description].every(v => typeof v === "string")))) &&
    (b.favorites === undefined ||
      (Array.isArray(b.favorites) &&
        b.favorites.every((p) => typeof p === "string"))) &&
    Array.isArray(b.projects) &&
    (b.archived === undefined || (Array.isArray(b.archived) && b.archived.every((p) => b.projects.includes(p)))) &&
    b.projects.every((p) => typeof p === "string") &&
    Array.isArray(b.sections) &&
    b.sections.length > 0 &&
    b.sections.every(
      (s) => typeof s.id === "string" && typeof s.title === "string" &&
        (s.description === undefined || typeof s.description === "string") &&
        (s.archived === undefined || typeof s.archived === "boolean") &&
        (s.project === undefined || s.project === "收件箱" || b.projects.includes(s.project)),
    ) &&
    Array.isArray(b.tasks) &&
    b.tasks.every(
      (t) =>
        typeof t.id === "string" &&
        typeof t.title === "string" &&
        typeof t.description === "string" &&
        typeof t.done === "boolean" &&
        (t.labels === undefined || (Array.isArray(t.labels) && t.labels.every((label) => typeof label === "string" && label.trim().length > 0 && label.length <= 40))) &&
        (t.completedAt === undefined || (typeof t.completedAt === "string" && Number.isFinite(Date.parse(t.completedAt)))) &&
        (t.collaboration === undefined || validCollaboration(t.collaboration)) &&
        (t.activity === undefined || (Array.isArray(t.activity) && t.activity.every((entry) => typeof entry.id === "string" && typeof entry.text === "string" && typeof entry.at === "string" && Number.isFinite(Date.parse(entry.at))))) &&
        typeof t.priority === "string" &&
        typeof t.date === "string" &&
        validSchedule(t) &&
        typeof t.owner === "string" &&
        (t.project === "收件箱" || b.projects.includes(t.project)) &&
        b.sections.some((s) => s.id === t.section && (s.project === undefined || s.project === t.project)) &&
        Array.isArray(t.comments) &&
        t.comments.every((c) => typeof c === "string" || validComment(c)) &&
        (t.attachments === undefined || validAttachments(t.attachments)) &&
        validSubtasks(t.subtasks),
    )
  );
}

// Older previews shared sections across projects. Split them without losing tasks.
export function migrateBoard(board: Board): Board {
  if (board.sections.every((section) => typeof section.project === "string")) return board;
  const projects = [...board.projects, "收件箱"];
  const sections = projects.flatMap((project) => board.sections.map((section) => ({
    ...section, id: `${encodeURIComponent(project)}:${section.id}`, project,
  })));
  return { ...board, sections, tasks: board.tasks.map((task) => ({
    ...task, section: `${encodeURIComponent(task.project)}:${task.section}`,
  })) };
}
export function projectSections(board: Board, project: string, includeArchived = false) {
  return board.sections.filter((section) => section.project === project && (includeArchived || !section.archived));
}
export function emptyBoard(project: string): Board {
  const template = seedBoard();
  return migrateBoard({ ...template, projects: [project], tasks: [] });
}

// Called at the write boundary so every task entry point shares one lifecycle.
export function recordTaskChange(previous: Task | undefined, next: Task, at = new Date().toISOString()): Task {
  let task = next;
  if (next.done && !previous?.done) task = { ...task, completedAt: at };
  if (!next.done && next.completedAt) {
    task = { ...task, completedAt: undefined };
  }
  const events: string[] = [];
  if (!previous) events.push("创建了任务");
  else {
    if (previous.done !== next.done) events.push(next.done ? "完成了任务" : "重新打开了任务");
    if (previous.title !== next.title) events.push("修改了任务名称");
    if (previous.description !== next.description) events.push("更新了任务描述");
    if (previous.project !== next.project) events.push(`移动到项目「${next.project}」`);
    else if (previous.section !== next.section) events.push("调整了所在分区");
    if (previous.date !== next.date) events.push(next.date ? `安排到 ${next.date}` : "移除了截止日期");
    if (previous.time !== next.time) events.push(next.time ? `时间改为 ${next.time}` : "移除了任务时间");
    if (previous.repeat !== next.repeat || JSON.stringify(previous.repeatRule) !== JSON.stringify(next.repeatRule)) events.push(next.repeat ? "设置了重复安排" : "取消了重复安排");
    if (previous.priority !== next.priority) events.push(`优先级改为 P${next.priority}`);
    if (previous.owner !== next.owner) events.push(`负责人改为${next.owner}`);
    if (JSON.stringify(previous.labels ?? []) !== JSON.stringify(next.labels ?? [])) events.push("更新了任务标签");
    if (JSON.stringify(previous.subtasks) !== JSON.stringify(next.subtasks)) events.push("更新了子任务");
    if (JSON.stringify(previous.comments) !== JSON.stringify(next.comments)) events.push(next.comments.length > previous.comments.length ? "添加了评论" : "更新了评论");
    if (JSON.stringify(previous.attachments ?? []) !== JSON.stringify(next.attachments ?? [])) events.push("更新了任务附件");
  }
  if (!events.length) return task;
  return { ...task, activity: [...(previous?.activity ?? []), ...events.map((text, index) => ({ id: `${next.id}:${at}:${index}`, at, text }))].slice(-100) };
}

export function nextRepeatDate(value: string, repeat: NonNullable<Task["repeat"]>, after = day(), anchor = Number(value.slice(8)), rule?: RepeatRule) {
  const base = rule?.basis === "completed" ? after : value;
  const date = new Date(`${base}T12:00:00`);
  const interval = rule?.interval ?? 1;
  if (rule?.basis === "completed") anchor = Number(after.slice(8));
  if (!Number.isFinite(date.getTime())) return day(1);
  const format = () => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  do {
    if (repeat === "monthly" || repeat === "yearly") {
      date.setDate(1);
      date.setMonth(date.getMonth() + (repeat === "monthly" ? 1 : 12) * interval);
      const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      date.setDate(Math.min(anchor, last));
    } else {
      if (repeat === "weekdays") {
        for (let count = 0; count < interval; count++) { do { date.setDate(date.getDate() + 1); } while ([0, 6].includes(date.getDay())); }
      } else date.setDate(date.getDate() + (repeat === "weekly" ? 7 : 1) * interval);
    }
  } while (format() <= after);
  return format();
}

function nextSchedule(task: TaskSchedule & { date?: string }, at: string) {
  if (!task.repeat || !task.date || (task.repeatRule?.remaining ?? 2) <= 1) return null;
  const date = nextRepeatDate(task.date, task.repeat, new Date(at).toLocaleDateString("sv-SE"), task.repeatAnchor, task.repeatRule);
  if (task.repeatRule?.until && date > task.repeatRule.until) return null;
  return { date, repeatAnchor: task.repeatRule?.basis === "completed" ? Number(new Date(at).toLocaleDateString("sv-SE").slice(8)) : task.repeatAnchor ?? Number(task.date.slice(8)),
    repeatRule: task.repeatRule ? { ...task.repeatRule, remaining: task.repeatRule.remaining === undefined ? undefined : task.repeatRule.remaining - 1 } : undefined };
}

function writeSubtasks(previous: Subtask[], next: Subtask[], at: string): Subtask[] {
  return next.map(item => {
    const before = previous.find(entry => entry.id === item.id);
    const current = item.subtasks ? { ...item, subtasks: writeSubtasks(before?.subtasks || [], item.subtasks, at) } : item;
    if (!before || before.done || !item.done || !item.repeat || !item.date) return current;
    const schedule = nextSchedule(item, at);
    const completionHistory = [...(item.completionHistory || []), { at, date: item.date }];
    return schedule ? { ...current, ...schedule, done: false, completionHistory } : { ...current, repeat: undefined, repeatRule: undefined, repeatAnchor: undefined, completionHistory };
  });
}

export function writeTasks(previous: Task[], next: Task[], at = new Date().toISOString()): Task[] {
  const history: Task[] = [];
  const tasks = next.map((input) => {
    let task = { ...input, subtasks: writeSubtasks(previous.find(item => item.id === input.id)?.subtasks || [], input.subtasks, at) };
    const before = previous.find((item) => item.id === task.id);
    if (task.done && task.collaboration && ["running", "waiting"].includes(task.collaboration.state)) task = { ...task, collaboration: transitionCollaboration(task.collaboration, "paused", "任务已完成，演示执行已暂停") };
    const recorded = recordTaskChange(before, task, at);
    if (!before || before.done || !task.done || !task.repeat || !task.date) return recorded;
    const schedule = nextSchedule(task, at);
    if (!schedule) return { ...recorded, repeat: undefined, repeatRule: undefined, repeatAnchor: undefined };
    history.push({ ...recorded, id: `${task.id}:completed:${crypto.randomUUID()}`, repeat: undefined, repeatAnchor: undefined, repeatRule: undefined });
    return { ...recorded, ...schedule, done: false, completedAt: undefined,
      subtasks: task.subtasks.map((item) => ({ ...item })),
      activity: [...(recorded.activity ?? []), { id: `${task.id}:next:${at}`, at, text: `下一次安排到 ${schedule.date}` }].slice(-100),
    };
  });
  return [...tasks, ...history];
}

// Global task views aggregate the current Board; project pages constrain that same Board.
export function taskMatchesWorkspaceScope(board: Board, task: Task, scope: string, today = day()): boolean {
  if (board.sections.find(section=>section.id===task.section)?.archived || (board.archived?.includes(task.project) && scope!==task.project)) return false;
  if (scope==="全部任务") return true;
  if (scope==="收件箱") return task.project==="收件箱";
  if (scope==="今天") return !!task.date && task.date<=today;
  if (scope==="即将到来") return !!task.date && task.date>=today;
  if (scope==="已完成") return task.done;
  return task.project===scope;
}
