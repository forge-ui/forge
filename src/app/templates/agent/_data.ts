// Local demo responses; no model or external data service is called.
export type Turn = {
  id: string;
  text: string;
  kind: "plan" | "analysis" | "code";
  live?: boolean;
  snapshot?: { text: string; phase: "complete" | "stopped" };
  workflow?: { accepted: boolean; alternative: boolean; applied: string[]; approval: Record<string, string[]> | null; node: string };
  request?: {
    action?: string;
    sources: { id: string; label: string }[];
    mode: string;
    permission: string;
  };
};
export type Session = { id: string; title: string; turns: Turn[] };
export const SESSION_KEY = "forge-agent-sessions:v1";
// Share the workspace catalog with the task-board template, while keeping
// conversations in their own per-workspace storage.
export const WORKSPACE_KEY = "forge-task-board:v1:workspaces";
export type Workspace = { id: string; name: string };
export function parseWorkspaces(value: unknown): { items: Workspace[]; active: string } | null {
  if (!value || typeof value !== "object") return null;
  const catalog = value as { items?: Workspace[]; active?: string };
  if (!Array.isArray(catalog.items) || !catalog.items.length || !catalog.items.every(item => item && typeof item.id === "string" && !!item.id.trim() && item.id !== "__new__" && typeof item.name === "string" && !!item.name.trim())) return null;
  if (new Set(catalog.items.map(item => item.id)).size !== catalog.items.length || !catalog.items.some(item => item.id === catalog.active)) return null;
  return { items: catalog.items.map(item => ({ id: item.id, name: item.name })), active: catalog.active! };
}
export function workspaceSessionKey(id: string): string {
  return id === "design" ? SESSION_KEY : `${SESSION_KEY}:${id}`;
}
export function initialWorkspaceSessions(id: string): { sessions: Session[]; active: string } {
  return id === "design" ? { sessions: structuredClone(EXAMPLES), active: "plan" } : { sessions: [{ id: "welcome", title: "新对话", turns: [] }], active: "welcome" };
}
function validWorkflow(value: Turn["workflow"]): boolean {
  return value === undefined || !!(value && typeof value.accepted === "boolean" && typeof value.alternative === "boolean" && Array.isArray(value.applied) && value.applied.every(id => ["research", "rush", "direction"].includes(id)) && ["brief", "direction", "design", "review"].includes(value.node) && (value.approval === null || (typeof value.approval === "object" && !Array.isArray(value.approval) && Object.values(value.approval).every(items => Array.isArray(items) && items.every(item => typeof item === "string")))));
}
export function parseSessions(value: unknown): { sessions: Session[]; active: string } | null {
  if (!value || typeof value !== "object") return null;
  const data = value as { sessions?: Session[]; active?: string };
  if (!Array.isArray(data.sessions) || !data.sessions.length || typeof data.active !== "string") return null;
  if (!data.sessions.every(s => s && typeof s.id === "string" && typeof s.title === "string" && Array.isArray(s.turns) && s.turns.every(t => t && typeof t.id === "string" && typeof t.text === "string" && ["plan", "analysis", "code"].includes(t.kind) && (t.snapshot === undefined || (t.snapshot && typeof t.snapshot.text === "string" && ["complete", "stopped"].includes(t.snapshot.phase))) && (t.request === undefined || (t.request && (t.request.action === undefined || typeof t.request.action === "string") && typeof t.request.mode === "string" && typeof t.request.permission === "string" && Array.isArray(t.request.sources) && t.request.sources.every(source => source && typeof source.id === "string" && typeof source.label === "string")))))) return null;
  if (!data.sessions.some(s => s.id === data.active) || !data.sessions.every(s => s.turns.every(t => validWorkflow(t.workflow)))) return null;
  return { active: data.active, sessions: data.sessions.map(s => ({ ...s, turns: s.turns.map(t => ({ ...t, live: false, snapshot: t.snapshot || (t.live ? { text: "", phase: "stopped" as const } : undefined) })) })) };
}
export const EXAMPLES: Session[] = [
  {
    id: "plan",
    title: "品牌焕新 · 本周计划",
    turns: [
      {
        id: "plan-1",
        text: "帮我把品牌焕新计划整理成可执行的本周任务。",
        kind: "plan",
      },
    ],
  },
  {
    id: "analysis",
    title: "项目进度与风险分析",
    turns: [
      {
        id: "analysis-1",
        text: "分析当前项目的进度，找出需要优先处理的风险。",
        kind: "analysis",
      },
    ],
  },
  {
    id: "code",
    title: "自动整理任务的代码",
    turns: [
      {
        id: "code-1",
        text: "写一个按优先级整理任务的小函数，并展示修改差异。",
        kind: "code",
      },
    ],
  },
];
export const ANSWERS = {
  plan: "### 把本周的重点，变成清晰的下一步\n\n建议先完成 **视觉方向确认**，再推进首页设计，最后用一次评审收拢反馈。\n\n1. **周一至周二**：整理调研，选出三个有代表性的视觉方向。\n2. **周三至周四**：完成首页方案，同时补齐移动端关键布局。\n3. **周五**：组织设计评审，把反馈整理成下一轮任务。\n\n请检查下面的计划草稿，选择需要保留的变更。",
  analysis:
    "### 当前节奏不错，留意两个依赖\n\n根据项目简报，**首页设计依赖视觉方向确认**。建议先让团队收敛意见，避免在多套方向上重复投入。\n\n- **优先处理**：明确视觉方向的最终确认人。\n- **控制风险**：评审前准备一页设计取舍说明。\n- **下一步**：把反馈按必须调整、值得探索、暂缓处理分组。\n\n这些结论来自本地示例材料，下面可以查看来源片段与趋势。",
  code: "### 让重要的事先被看见\n\n可以先复制任务数组，再按优先级排序，避免修改原始数据。没有优先级的任务排在最后。\n\n下面提供代码和修改差异，可以切换查看或复制代码。此示例不会执行代码，也不会修改你的项目文件。",
};
