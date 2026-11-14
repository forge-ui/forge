import type { UIMessage } from "ai";
import { normalizeRequest } from "../request";
import { labelOf } from "./page";

/** One call of a browser tool. Page elements are named, not numbered: ids do not survive a reload. */
export type PlaybookStep = { tool: string; input: Record<string, unknown> };

/**
 * Steps that carried out a request once, replayed when the same request comes again: no model call,
 * same pointer and page lock. A step that no longer fits the page hands the request back to the model.
 */
export type Playbook = {
  /** The request as the user types it; spaces, case and end punctuation are ignored. */
  request: string;
  /** Page the steps start from. Omit when the first step opens the page. */
  path?: string;
  steps: PlaybookStep[];
  /** Said when the steps are done. */
  reply: string;
};

type Part = UIMessage["parts"][number];
type ToolPart = { type: string; toolName?: string; toolCallId: string; state?: string; input?: unknown; output?: unknown };

export const partToolName = (part: { type: string; toolName?: string }) => part.toolName ?? part.type.replace(/^tool-/, "");
const isToolPart = (part: Part): part is Part & ToolPart => "toolCallId" in part;

export type RecordOptions = {
  /** Browser tools that may be replayed; anything else (server tools, catalog UI) means the answer needed the model. */
  replayable: Set<string>;
  /** Tool calls the user had to approve; those runs are never replayed. */
  approved: Set<string>;
  /** Tools whose input names a page element by id. */
  pageTargets: Set<string>;
  path: string;
};

/**
 * The run in `assistant` as a playbook, or undefined when it should not be replayed: it used the model's
 * own tools, needed approval, failed somewhere, or ended without a closing reply.
 */
export function recordRun(request: string, assistant: UIMessage, { replayable, approved, pageTargets, path }: RecordOptions): Playbook | undefined {
  const steps: PlaybookStep[] = [];
  let lastTool = -1;
  for (const [index, part] of assistant.parts.entries()) {
    if (!isToolPart(part)) continue;
    lastTool = index;
    const name = partToolName(part);
    // Follow-up chips are decoration; the reply text is what matters.
    if (name === "suggest_followups") continue;
    if (!replayable.has(name) || approved.has(part.toolCallId) || part.state !== "output-available") return undefined;
    const output = part.output as { denied?: boolean } | undefined;
    if (output && typeof output === "object" && output.denied) return undefined;
    if (name === "read_page") continue;
    const input = { ...(part.input as Record<string, unknown>) };
    if (pageTargets.has(name) && typeof input.id === "string") {
      const label = labelOf(input.id);
      delete input.id;
      if (label) Object.assign(input, { name: label.name }, label.group ? { group: label.group } : {});
      else if (typeof input.name !== "string") return undefined;
    }
    steps.push({ tool: name, input });
  }
  const reply = assistant.parts.slice(lastTool + 1).filter(part => part.type === "text").map(part => (part as { text: string }).text).join("").trim();
  if (!steps.length || !reply) return undefined;
  return { request, path, steps, reply };
}

export function findPlaybook(playbooks: Playbook[], request: string, path: string) {
  const wanted = normalizeRequest(request);
  return playbooks.find(item => normalizeRequest(item.request) === wanted && (!item.path || item.path === path));
}

type Stored = { version: string; runs: Playbook[] };
const MAX_RUNS = 30;

export function loadRuns(key: string, version: string): Playbook[] {
  try {
    const stored = JSON.parse(localStorage.getItem(key) ?? "null") as Stored | null;
    return stored?.version === version && Array.isArray(stored.runs) ? stored.runs : [];
  } catch {
    return [];
  }
}

function saveRuns(key: string, version: string, runs: Playbook[]) {
  try {
    localStorage.setItem(key, JSON.stringify({ version, runs: runs.slice(0, MAX_RUNS) } satisfies Stored));
  } catch {
    // Storage full or blocked: the run is simply not remembered.
  }
}

export function rememberRun(key: string, version: string, run: Playbook) {
  const same = (item: Playbook) => normalizeRequest(item.request) === normalizeRequest(run.request) && item.path === run.path;
  saveRuns(key, version, [run, ...loadRuns(key, version).filter(item => !same(item))]);
}

export function forgetRun(key: string, version: string, run: Playbook) {
  saveRuns(key, version, loadRuns(key, version).filter(item => !(normalizeRequest(item.request) === normalizeRequest(run.request) && item.path === run.path)));
}
