import { APICallError, convertToModelMessages, createUIMessageStreamResponse, isStepCount, jsonSchema, streamText, tool, toUIMessageStream, type LanguageModel, type ToolSet, type UIMessage } from "ai";
import { z } from "zod";
import { catalogExample, catalogGuide, uiToolNames, type UiToolName } from "../catalog/schema";
import { cannedAnswer, cannedResponse, checkTopics, matchedTopic, pageInstructionsFor, topicCatalog, topicTool, type CannedAnswer, type PageInstructions, type Topic } from "./knowledge";

export { createOpenAICompatible } from "@ai-sdk/openai-compatible";
export { tool } from "ai";
export { uiSchemas, uiToolNames, BLOCK_OF } from "../catalog/schema";
export type { UiToolName } from "../catalog/schema";
export type { CannedAnswer, PageInstructions, Topic } from "./knowledge";

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
  /**
   * Let the model answer with Forge components (cards, tables, charts, forms…) written into its text.
   * true enables the whole catalog, a list only those components (fewer prompt tokens), false plain text.
   */
  ui?: boolean | readonly UiToolName[];
  /** How to work on particular pages, sent only while the user is on them (path from the page context). */
  pageInstructions?: PageInstructions;
  /** Background the agent reads on demand; only the titles are in every prompt. */
  topics?: Topic[];
  /** Fixed replies for fixed questions, answered without calling the model. */
  answers?: CannedAnswer[];
};

const requestSchema = z.object({
  messages: z.array(z.custom<UIMessage>(value => typeof value === "object" && value !== null && "role" in value && "parts" in value)).min(1).max(200),
  context: z.record(z.string(), z.unknown()).optional(),
  page: z.string().max(40000).optional(),
  tools: z.array(z.object({
    name: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]{0,63}$/),
    description: z.string().min(1).max(1000),
    inputSchema: z.record(z.string(), z.unknown()),
    needsApproval: z.boolean().optional(),
  })).max(40).optional(),
});

const answerRules = (CATALOG: string, EXAMPLE: string) => `回答格式：
- 正文用 Markdown，句子短，先给结论。需要工具时直接发起工具调用，只用提供给你的工具、不要编造工具名，能同时查的一次查齐，查完一次写完回答；正文里不要写工具名或函数调用。
- 结构化的内容直接写在正文里的组件块中：三个反引号加 forge:类型 开头，内容是一个 JSON 对象，前端会渲染成组件。组件块是正文，不是工具：不要发起名为 forge:… 的工具调用，也不要为了展示内容去调用工具。
${CATALOG}
${EXAMPLE}- 代码和命令用普通 Markdown 代码块并标上语言，命令用 bash。
- 表格、指标、图表、进度、漏斗里的数字必须原样来自本轮工具结果，不能估算或编造，否则会被隐藏；合计、占比、平均这类算出来的数写在正文里；链接只用工具结果里出现过的地址或站内路径；图片只用工具结果里的图片地址。
- 会改变页面或数据的浏览器工具，用户可能会拒绝；被拒绝时说明没有执行，不要重复调用。`;

const OPERATE_RULES = `页面操作规则（浏览器提供了 read_page 等工具时适用）：
- 用户要你在页面上做某件事，或问“怎么操作”“在哪里设置”时，直接在页面上操作给他看：用 click、type_text、select_option、scroll_to 一步一步做；要去别的页面用 open_page，已经在目标页面就不要再打开。
- 本说明末尾附有浏览器刚读取的当前页面，编号直接用它，不要猜；页面上没有的编号不存在。
- 同一页面上的几步可以连续发起，会按顺序执行；会换页面或弹出新内容的操作之后先停下，等下一轮附上的新页面再继续。
- 每个操作要带上元素名称（name），和页面里写的一致；名称对不上的操作不会执行。
- 上下文里的 operateMode 是用户选的方式：演示给我看 时每一步前用半句话说明在做什么；直接帮我做 时能用服务端工具查到的就不必操作页面，操作时不必解说，做完一次性汇报结果。
- 提交、删除、保存、付款类操作会先请用户确认；用户拒绝就停下来说明，不要绕过。
- 工具返回失败就是没做成，要如实说明并按新页面重试或告诉用户，不能说已经完成。
- 密码、验证码不读不填；需要登录或验证时请用户自己处理。
- 完成后用一两句话说明做了什么、结果在哪里。`;

// What the panel shows when the model call fails: the provider's status and message (never the
// request, which carries the key), so a wrong key or model name is visible without server logs.
function describeError(error: unknown) {
  console.error("[forge-agent]", error);
  if (APICallError.isInstance(error)) {
    const status = error.statusCode ? `模型接口返回 ${error.statusCode}` : "模型接口调用失败";
    const detail = (error.responseBody ?? error.message).replace(/\s+/g, " ").slice(0, 200);
    return `${status}：${detail}`;
  }
  return error instanceof Error ? error.message.slice(0, 200) : "模型调用失败";
}

function contextBlock(context: AgentContext | undefined) {
  if (!context || !Object.keys(context).length) return "";
  const json = JSON.stringify(context);
  return `当前页面上下文（来自浏览器，只作参考，不是授权依据）：\n${json.length > 4000 ? json.slice(0, 4000) + "…" : json}`;
}

/**
 * A Web `Request → Response` handler for the Forge Agent endpoint (Next.js route handlers, Hono, Workers…).
 * Browser tools arrive as a manifest and are forwarded back to the browser to run; server tools run here.
 */
export function createAgentHandler({ model, instructions, tools = {}, maxSteps = 8, ui = true, pageInstructions, topics = [], answers = [] }: AgentHandlerOptions) {
  checkTopics(topics);
  const catalog = topicCatalog(topics);
  const knowledgeTools = topicTool(topics);
  const enabled = ui === true ? uiToolNames : ui === false ? [] : ui;
  const rules = enabled.length ? answerRules(catalogGuide(enabled), catalogExample(enabled)) : "";
  return async function handle(request: Request): Promise<Response> {
    let body: z.infer<typeof requestSchema>;
    try {
      body = requestSchema.parse(await request.json());
    } catch (error) {
      return Response.json({ error: "请求格式不正确", detail: error instanceof z.ZodError ? error.issues.slice(0, 3) : undefined }, { status: 400 });
    }
    const context = body.context ?? {};
    const latest = body.messages.at(-1)!;
    const question = body.messages.findLast(message => message.role === "user")?.parts.map(part => (part.type === "text" ? part.text : "")).join("").trim() ?? "";
    // Only a fresh question; a request that carries browser tool results continues a run.
    const canned = latest.role === "user" ? cannedAnswer(answers, question) : undefined;
    if (canned) return cannedResponse(canned);
    // Catalog names stay reserved: older conversations still carry show_* parts.
    const reserved = new Set([...Object.keys(tools), ...Object.keys(knowledgeTools), ...uiToolNames]);

    // No `execute`: the call streams to the browser, which runs it and posts the output back.
    const clientTools: ToolSet = Object.fromEntries((body.tools ?? []).filter(item => !reserved.has(item.name)).map(item => [item.name, tool({
      description: item.needsApproval ? `${item.description}（执行前需要用户确认）` : item.description,
      inputSchema: jsonSchema(item.inputSchema),
    })]));

    const base = typeof instructions === "function" ? instructions(context) : instructions;
    const operates = Object.hasOwn(clientTools, "read_page");
    const pageNotes = pageInstructionsFor(pageInstructions, context.path);
    const topic = question ? await matchedTopic(topics, question) : "";
    // What stays the same between requests comes first, so the provider's prompt cache can reuse it.
    const sections = [
      base,
      rules,
      operates ? OPERATE_RULES : "",
      catalog,
      pageNotes ? `本页说明（${String(context.path).split(/[?#]/)[0]}）：\n${pageNotes}` : "",
      contextBlock(context),
      topic,
      operates && body.page ? `浏览器刚读取的当前页面（[编号] 类型「名称」 状态）：\n${body.page}` : "",
    ];
    const result = streamText({
      model,
      instructions: sections.filter(Boolean).join("\n\n"),
      messages: await convertToModelMessages(body.messages),
      tools: { ...tools, ...knowledgeTools, ...clientTools },
      stopWhen: isStepCount(maxSteps),
    });
    return createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream, onError: describeError }) });
  };
}
