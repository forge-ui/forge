export const collaborationStates = {
  ready: "等待执行", running: "执行中", waiting: "需要你确认", review: "等待审核", approved: "审核通过", failed: "执行失败", paused: "已暂停",
} as const;
export type CollaborationState = keyof typeof collaborationStates;
export type TaskCollaboration = {
  agent: string;
  state: CollaborationState;
  attempt: number;
  brief: string;
  result?: string;
  feedback?: string;
  events: { id: string; at: string; text: string; detail?: string }[];
};
export function validCollaboration(value: unknown): value is TaskCollaboration {
  if (!value || typeof value !== "object") return false;
  const c = value as TaskCollaboration;
  return typeof c.agent === "string" && Object.hasOwn(collaborationStates, c.state) && Number.isInteger(c.attempt) && c.attempt >= 0 && typeof c.brief === "string" && (c.result === undefined || typeof c.result === "string") && (c.feedback === undefined || typeof c.feedback === "string") && Array.isArray(c.events) && c.events.every(e => e && typeof e.id === "string" && typeof e.text === "string" && (e.detail === undefined || typeof e.detail === "string") && typeof e.at === "string" && Number.isFinite(Date.parse(e.at)));
}
const allowedTransitions: Record<CollaborationState, readonly CollaborationState[]> = {
  ready: ["running"], running: ["waiting", "review", "failed", "paused"],
  waiting: ["running", "paused"], review: ["approved", "ready"], approved: [],
  failed: ["running"], paused: ["running"],
};
export function transitionCollaboration(value: TaskCollaboration, state: CollaborationState, text: string, patch: Partial<TaskCollaboration> = {}): TaskCollaboration {
  if (!allowedTransitions[value.state].includes(state)) throw new Error("不支持的协作状态变更");
  if (state === "review" && !(patch.result ?? value.result)?.trim()) throw new Error("提交审核前需要交付结果");
  return { ...value, ...patch, state, events: [...value.events, { id: crypto.randomUUID(), at: new Date().toISOString(), text, ...(state === "review" && patch.result ? { detail: patch.result } : patch.feedback ? { detail: patch.feedback } : {}) }] };
}
