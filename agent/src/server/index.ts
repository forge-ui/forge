import { convertToModelMessages, createUIMessageStreamResponse, isStepCount, jsonSchema, streamText, tool, toUIMessageStream, type LanguageModel, type Tool, type ToolSet, type UIMessage } from "ai";
import { z } from "zod";
import { uiDescriptions, uiSchemas, uiToolNames } from "../catalog/schema";

export { createOpenAICompatible } from "@ai-sdk/openai-compatible";
export { tool } from "ai";
export { uiSchemas, uiToolNames } from "../catalog/schema";

/** What the browser declares about each tool it can run; the code stays in the browser. */
export type ClientToolManifest = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  needsApproval?: boolean;
};

export type AgentContext = Record<string, unknown>;

export type AgentHandlerOptions = {
  model: LanguageModel;
  /** Product-specific instructions; page context and the UI catalog rules are appended. */
  instructions: string | ((context: AgentContext) => string);
  /** Server-side tools with `execute`, run with the server's credentials. */
  tools?: ToolSet;
  /** Model steps per request, tool calls included. */
  maxSteps?: number;
  /** Turn the generative UI catalog off for text-only agents. */
  ui?: boolean;
};

const requestSchema = z.object({
  messages: z.array(z.custom<UIMessage>(value => typeof value === "object" && value !== null && "role" in value && "parts" in value)).min(1).max(200),
  context: z.record(z.string(), z.unknown()).optional(),
  tools: z.array(z.object({
    name: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]{0,63}$/),
    description: z.string().min(1).max(1000),
    inputSchema: z.record(z.string(), z.unknown()),
    needsApproval: z.boolean().optional(),
  })).max(40).optional(),
});

const CATALOG_RULES = `回答界面规则：
- 需要工具时直接发起工具调用；正文里不要写工具名、函数调用或 JSON。
- 能用组件表达时调用 show_* 工具，而不是在正文里画表格或贴长代码；正文只写结论和必要说明。
- show_table、show_metrics、show_chart 里的数字必须来自本轮工具结果，不能估算或编造。
- 链接只用工具结果里出现过的地址；图片只用工具结果里的图片地址。
- 回答结束时如有合适的后续问题，调用 suggest_followups。
- 会改变页面或数据的浏览器工具，用户可能会拒绝；被拒绝时说明没有执行，不要重复调用。`;

function contextBlock(context: AgentContext | undefined) {
  if (!context || !Object.keys(context).length) return "";
  const json = JSON.stringify(context);
  return `\n\n当前页面上下文（来自浏览器，只作参考，不是授权依据）：\n${json.length > 4000 ? json.slice(0, 4000) + "…" : json}`;
}

/**
 * A Web `Request → Response` handler for the Forge Agent endpoint (Next.js route handlers, Hono, Workers…).
 * Browser tools arrive as a manifest and are forwarded back to the browser to run; server tools run here.
 */
export function createAgentHandler({ model, instructions, tools = {}, maxSteps = 8, ui = true }: AgentHandlerOptions) {
  return async function handle(request: Request): Promise<Response> {
    let body: z.infer<typeof requestSchema>;
    try {
      body = requestSchema.parse(await request.json());
    } catch (error) {
      return Response.json({ error: "请求格式不正确", detail: error instanceof z.ZodError ? error.issues.slice(0, 3) : undefined }, { status: 400 });
    }
    const context = body.context ?? {};
    const reserved = new Set([...Object.keys(tools), ...(ui ? uiToolNames : [])]);

    const uiTools: ToolSet = ui
      ? Object.fromEntries(uiToolNames.map(name => [name, ({ description: uiDescriptions[name], inputSchema: uiSchemas[name], execute: async () => ({ shown: true }) }) as Tool]))
      : {};
    // No `execute`: the call streams to the browser, which runs it and posts the output back.
    const clientTools: ToolSet = Object.fromEntries((body.tools ?? []).filter(item => !reserved.has(item.name)).map(item => [item.name, tool({
      description: item.needsApproval ? `${item.description}（执行前需要用户确认）` : item.description,
      inputSchema: jsonSchema(item.inputSchema),
    })]));

    const base = typeof instructions === "function" ? instructions(context) : instructions;
    const result = streamText({
      model,
      instructions: base + (ui ? `\n\n${CATALOG_RULES}` : "") + contextBlock(context),
      messages: await convertToModelMessages(body.messages),
      tools: { ...uiTools, ...tools, ...clientTools },
      stopWhen: isStepCount(maxSteps),
    });
    return createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) });
  };
}
