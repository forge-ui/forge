import { generateText, jsonSchema, tool, type LanguageModel, type ModelMessage, type ToolSet } from "ai";
import { HarnessError, jsonValue, type Capability, type HarnessPorts, type Message, type Run, type TaskStore } from "./types";

/**
 * TaskStore kept in process memory: for development, tests and single-instance deployments. It keeps the
 * same JSON boundary and compare-and-swap rule as a database store, so behaviour does not change when one
 * is swapped in.
 */
export class MemoryTaskStore implements TaskStore {
  private rows = new Map<string, Run>();

  async create(run: Run) {
    if (this.rows.has(run.id)) throw new HarnessError("会话已存在");
    this.rows.set(run.id, jsonValue(run));
  }

  async load(id: string, ownerId: string, applicationId: string) {
    const row = this.rows.get(id);
    return row?.ownerId === ownerId && row.applicationId === applicationId ? jsonValue(row) : null;
  }

  async save(run: Run, expectedRevision: number) {
    const row = this.rows.get(run.id);
    if (!row || row.ownerId !== run.ownerId || row.applicationId !== run.applicationId || row.buildId !== run.buildId || row.revision !== expectedRevision) return false;
    this.rows.set(run.id, jsonValue(run));
    return true;
  }

  async list(ownerId: string, applicationId: string, limit: number) {
    return [...this.rows.values()]
      .filter(row => row.ownerId === ownerId && row.applicationId === applicationId)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, Math.min(20, limit))
      .map(row => jsonValue(row));
  }
}

function toModelMessages(messages: Message[]): ModelMessage[] {
  // System text goes to `instructions` (AI SDK 7 rejects it in messages); only the conversation is mapped.
  // Tool results name their tool in AI SDK messages; the harness only keeps the call id.
  const names = new Map<string, string>();
  return messages.filter(message => message.role !== "system").map((message): ModelMessage => {
    if (message.role === "tool") return { role: "tool", content: [{ type: "tool-result", toolCallId: message.toolCallId, toolName: names.get(message.toolCallId) ?? "unknown", output: { type: "text", value: message.content } }] };
    if (message.role === "assistant") {
      for (const call of message.toolCalls ?? []) names.set(call.id, call.name);
      if (!message.toolCalls?.length) return { role: "assistant", content: message.content };
      return {
        role: "assistant",
        content: [
          ...(message.content ? [{ type: "text" as const, text: message.content }] : []),
          ...message.toolCalls.map(call => ({ type: "tool-call" as const, toolCallId: call.id, toolName: call.name, input: parseArguments(call.arguments) })),
        ],
      };
    }
    return { role: "user", content: message.content };
  });
}

function parseArguments(text: string): unknown {
  try {
    return JSON.parse(text || "{}");
  } catch {
    return {};
  }
}

/**
 * The harness model port on any AI SDK model (OpenAI-compatible, Qwen, DeepSeek…). Capabilities become
 * tools without `execute`: the model only proposes calls, and the harness decides whether to run them.
 */
export function aiSdkModel(model: LanguageModel): HarnessPorts["model"] {
  return {
    async next(messages: Message[], capabilities: Capability[], signal?: AbortSignal) {
      const tools: ToolSet = Object.fromEntries(capabilities.map(capability => [capability.name, tool({ description: capability.description, inputSchema: jsonSchema(capability.parameters) })]));
      const instructions = messages.filter(message => message.role === "system").map(message => message.content).join("\n\n");
      const result = await generateText({ model, instructions: instructions || undefined, messages: toModelMessages(messages), tools, toolChoice: "auto", abortSignal: signal });
      return {
        content: result.text,
        toolCalls: result.toolCalls.map(call => ({ id: call.toolCallId, name: call.toolName, arguments: JSON.stringify(call.input ?? {}) })),
      };
    },
  };
}
