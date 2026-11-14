"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, generateId, type UIMessage } from "ai";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { AgentMessage, AgentParts, ChatInputBar, Conversation, IconButton, MessageActions, PromptSuggestions, type AgentMessagePart } from "@forge-ui-official/core";
import { PenNewSquareLinear, PlusLinear, StarsLinear } from "@forge-ui-official/core/icons";
import { renderCatalog, sourcesFrom } from "./catalog/render";
import { uiToolNames, type UiToolName } from "./catalog/schema";
import { endRun, endRunSoon, holdRun, setStopHandler } from "./operator/overlay";
import { findByName, readPage } from "./operator/page";
import { findPlaybook, forgetRun, loadRuns, recordRun, rememberRun, type Playbook } from "./operator/replay";
import { cancelPageActions, pageTools, type OperateMode } from "./operator/tools";
import type { AgentTool } from "./tool";

export { defineTool, type AgentTool } from "./tool";
export type { OperateMode } from "./operator/tools";
export type { Playbook, PlaybookStep } from "./operator/replay";

export type OperateOptions = {
  /** Client-side navigation, e.g. Next.js `router.push`. Defaults to a full page load. */
  navigate?: (path: string) => void;
  defaultMode?: OperateMode;
};

export type ForgeAgentProps = {
  /** URL of the route that calls `createAgentHandler`. */
  endpoint: string;
  title?: string;
  greeting?: string;
  suggestions?: string[];
  /** Page facts sent with every message. A function is read at send time. */
  context?: Record<string, unknown> | (() => Record<string, unknown>);
  tools?: AgentTool[];
  /** Conversation is kept in localStorage under this key; omit to keep nothing. */
  storageKey?: string;
  launcherLabel?: string;
  defaultOpen?: boolean;
  /** Display names for server tools, keyed by tool name. */
  toolLabels?: Record<string, string>;
  /** Let the agent read and operate this page: open, click, type, choose, scroll. */
  operate?: boolean | OperateOptions;
  /** Steps for common requests (e.g. the suggestions), replayed on the page without calling the model. */
  playbooks?: Playbook[];
  /** Remember page runs that worked and replay them when the same request comes again on the same page. */
  remember?: boolean;
  /** Change it when the pages change; runs remembered on the old pages are then dropped. */
  version?: string;
};

const catalogNames = new Set<string>(uiToolNames);
const toolName = (part: { type: string; toolName?: string }) => part.toolName ?? part.type.replace(/^tool-/, "");
const pageToolNames = new Set(pageTools({ mode: "direct" }).map(item => item.name));
const MODE_LABELS: Record<OperateMode, string> = { show: "演示给我看", direct: "直接帮我做" };
const MODES = (Object.keys(MODE_LABELS) as OperateMode[]).map(id => ({ id, label: MODE_LABELS[id] }));
// Page tools whose input points at an element; a replay finds it again by name.
const PAGE_TARGETS = new Set(["click", "type_text", "select_option", "scroll_to"]);

type MessagePart = UIMessage["parts"][number];

// Each page action returns the whole page; only the newest copy is worth sending back to the model.
function trimSnapshots(messages: UIMessage[]): UIMessage[] {
  let newest = true;
  return [...messages].reverse().map(message => {
    if (message.role !== "assistant") return message;
    const parts = [...message.parts].reverse().map(part => {
      if (!("toolCallId" in part) || !pageToolNames.has(toolName(part as { type: string })) || !("output" in part) || typeof part.output !== "string") return part;
      if (newest) {
        newest = false;
        return part;
      }
      // Keep the action summary line; the page listing after it is out of date.
      return { ...part, output: `${part.output.split("\n")[0]}\n（当时的页面已省略，以最新页面为准）` };
    });
    return { ...message, parts: [...parts].reverse() } as UIMessage;
  }).reverse();
}

const PANEL_WIDTH = 400;

// On wide screens the open panel takes its width from the page instead of covering it, so what
// the agent operates stays in view. Sticky headers follow; fixed full-width bars do not.
function insetPage(open: boolean) {
  const root = document.documentElement;
  if (open && matchMedia("(min-width: 1024px)").matches) {
    root.style.marginRight = `${PANEL_WIDTH}px`;
    // Lets the app tighten its layout while the panel is open, e.g. hide a secondary column.
    root.setAttribute("data-forge-agent-open", "");
  } else {
    root.style.removeProperty("margin-right");
    root.removeAttribute("data-forge-agent-open");
  }
}

const safely = <T,>(read: () => T, fallback: T) => {
  try {
    return read();
  } catch {
    return fallback;
  }
};

// Same shape as AgentParts' onToolApproval argument; declared here so core 0.8.2 works too.
type ApprovalResponse = { id: string; approved: boolean; reason?: string };

const MAX_TOOL_CALLS = 30;

/**
 * Resend only when the last step called browser tools and every one has an output. The stock
 * helper also fires on server-run tools, which would loop the conversation.
 */
function browserToolsDone(messages: UIMessage[], browserTools: Set<string>) {
  const message = messages.at(-1);
  if (message?.role !== "assistant") return false;
  const stepStart = message.parts.map(part => part.type).lastIndexOf("step-start");
  const calls = message.parts.slice(stepStart + 1).filter(part => "toolCallId" in part && browserTools.has(toolName(part as { type: string })));
  // A run that has not finished in this many steps is stuck (e.g. scrolling for something absent).
  if (message.parts.filter(part => "toolCallId" in part).length >= MAX_TOOL_CALLS) return false;
  return calls.length > 0 && calls.every(part => "state" in part && (part.state === "output-available" || part.state === "output-error"));
}

function messageText(message: UIMessage) {
  return message.parts.map(part => (part.type === "text" ? part.text : "")).join("").trim();
}

export function ForgeAgent({ endpoint, title = "问 Forge", greeting = "有什么可以帮你？", suggestions = [], context, tools: appTools = [], storageKey, launcherLabel, defaultOpen = false, toolLabels = {}, operate, playbooks = [], remember = true, version = "1" }: ForgeAgentProps) {
  const operateOptions = operate === true ? {} : operate || undefined;
  const operating = Boolean(operateOptions);
  const runsKey = `${storageKey ?? "forge-agent"}:runs`;
  const [replaying, setReplaying] = useState(false);
  // The request a model run started from, kept until the run can be remembered.
  const runStart = useRef<{ text: string; path: string } | undefined>(undefined);
  const [open, setOpen] = useState(defaultOpen);
  const [mode, setMode] = useState<OperateMode>(operateOptions?.defaultMode ?? "show");
  // Approval decisions for browser tools, keyed by tool call; false keeps the call shown as denied.
  const [decisions, setDecisions] = useState<Record<string, boolean>>({});
  // Calls whose tool asked, for this input, to be confirmed first (needsApprovalFor).
  const [gated, setGated] = useState<Record<string, boolean>>({});
  // Set by 停止 so a cancelled page action does not send its error back and start another round.
  const stoppedRef = useRef(false);
  const haltRef = useRef(() => undefined as void);
  const tools = operateOptions ? [...pageTools({ mode, navigate: operateOptions.navigate }), ...appTools] : appTools;
  // Latest tools and context for callbacks that run after render (sending, tool calls).
  const toolsRef = useRef(tools);
  const contextRef = useRef(context);
  const modeRef = useRef(mode);
  useLayoutEffect(() => {
    toolsRef.current = tools;
    contextRef.current = context;
    modeRef.current = mode;
  });

  // body() runs when a message is sent, never during render.
  // eslint-disable-next-line react-hooks/refs
  const transport = useMemo(() => new DefaultChatTransport({
    api: endpoint,
    body: () => ({
      context: {
        ...(typeof contextRef.current === "function" ? contextRef.current() : contextRef.current),
        ...(toolsRef.current.some(item => item.name === "read_page") ? { operateMode: MODE_LABELS[modeRef.current] } : {}),
      },
      // The page as it is right now, so every model step starts from fresh element ids.
      page: toolsRef.current.some(item => item.name === "read_page") ? readPage() : undefined,
      tools: toolsRef.current.map(item => ({ name: item.name, description: item.description, inputSchema: z.toJSONSchema(item.input), needsApproval: item.needsApproval })),
    }),
    prepareSendMessagesRequest: ({ id, messages: current, body, trigger, messageId }) => ({ body: { ...body, id, messages: trimSnapshots(current), trigger, messageId } }),
  }), [endpoint]);

  const run = async (name: string, toolCallId: string, input: unknown) => {
    const item = toolsRef.current.find(entry => entry.name === name);
    if (!item) return addToolOutput({ tool: name, toolCallId, state: "output-error", errorText: `浏览器里没有 ${name} 这个工具` });
    const parsed = item.input.safeParse(input);
    if (!parsed.success) return addToolOutput({ tool: name, toolCallId, state: "output-error", errorText: "参数不正确：" + parsed.error.issues.map(issue => issue.message).join("；") });
    try {
      addToolOutput({ tool: name, toolCallId, output: (await item.execute(parsed.data)) ?? { done: true } });
    } catch (error) {
      addToolOutput({ tool: name, toolCallId, state: "output-error", errorText: error instanceof Error ? error.message : String(error) });
    }
  };

  const { messages, setMessages, sendMessage, addToolOutput, status, stop, error, regenerate } = useChat({
    transport,
    sendAutomaticallyWhen: ({ messages: current }) => !stoppedRef.current && browserToolsDone(current, new Set(toolsRef.current.map(item => item.name))),
    onToolCall: ({ toolCall }) => {
      const item = toolsRef.current.find(entry => entry.name === toolCall.toolName);
      // Catalog and server tools are not ours; approval-gated tools wait for the user.
      if (!item || item.needsApproval) return;
      const parsed = item.input.safeParse(toolCall.input);
      if (parsed.success && item.needsApprovalFor && safely(() => item.needsApprovalFor!(parsed.data), true)) {
        setGated(current => ({ ...current, [toolCall.toolCallId]: true }));
        return;
      }
      void run(toolCall.toolName, toolCall.toolCallId, toolCall.input);
    },
  });

  useLayoutEffect(() => {
    haltRef.current = () => {
      stoppedRef.current = true;
      cancelPageActions();
      endRun();
      stop();
    };
    setStopHandler(() => haltRef.current());
  });

  // Restore after mount so the server render and first client render match.
  const restored = useRef(false);
  useEffect(() => {
    if (!storageKey || restored.current) return;
    restored.current = true;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setMessages(JSON.parse(saved) as UIMessage[]);
    } catch {
      // A corrupt or unavailable store just starts a new conversation.
    }
  }, [storageKey, setMessages]);
  useEffect(() => {
    if (!storageKey || !restored.current || status === "streaming" || status === "submitted") return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages.slice(-60)));
    } catch {
      // Storage full or blocked: the conversation still works for this page view.
    }
  }, [storageKey, messages, status]);

  const sendToModel = (text: string, history: UIMessage[]) => {
    // Only a request that stands on its own is worth remembering; a follow-up leans on what came before.
    runStart.current = history.length === 0 ? { text, path: location.pathname } : undefined;
    void sendMessage({ text });
  };

  // Runs the steps of a playbook as if the model had called them; any step that does not fit hands the
  // request to the model, which reads the page as the steps left it.
  const replay = async (playbook: Playbook, text: string) => {
    const before = messages;
    const user: UIMessage = { id: generateId(), role: "user", parts: [{ type: "text", text }] };
    const assistantId = generateId();
    const parts: MessagePart[] = [{ type: "step-start" }];
    const show = () => setMessages([...before, user, { id: assistantId, role: "assistant", parts: [...parts] }]);
    setReplaying(true);
    show();
    try {
      for (const step of playbook.steps) {
        const item = toolsRef.current.find(entry => entry.name === step.tool);
        if (!item) throw new Error(`没有 ${step.tool} 这个工具`);
        let input = step.input;
        if (PAGE_TARGETS.has(step.tool) && typeof input.name === "string") {
          const id = findByName(input.name, typeof input.group === "string" ? input.group : undefined);
          if (!id) throw new Error(`页面上找不到唯一的「${input.name}」`);
          input = { ...input, id };
        }
        const parsed = item.input.safeParse(input);
        if (!parsed.success || item.needsApproval || (item.needsApprovalFor && safely(() => item.needsApprovalFor!(parsed.data), true))) throw new Error("这一步要由模型判断");
        parts.push({ type: `tool-${step.tool}`, toolCallId: generateId(), state: "input-available", input: parsed.data } as MessagePart);
        show();
        const output = (await item.execute(parsed.data)) ?? { done: true };
        parts[parts.length - 1] = { ...parts[parts.length - 1], state: "output-available", output } as MessagePart;
        show();
      }
      parts.push({ type: "text", text: playbook.reply, state: "done" });
      show();
    } catch (failure) {
      if (stoppedRef.current) {
        const last = parts[parts.length - 1];
        if ("toolCallId" in last) parts[parts.length - 1] = { ...last, state: "output-error", errorText: "用户已停止操作" } as MessagePart;
        show();
        return;
      }
      // A remembered run that no longer fits is dropped; the model's new run may replace it.
      forgetRun(runsKey, version, playbook);
      console.info("[forge-agent] replay handed to the model:", failure instanceof Error ? failure.message : failure);
      setMessages(before);
      sendToModel(text, before);
    } finally {
      setReplaying(false);
    }
  };

  const ask = (text: string) => {
    if (!text.trim()) return;
    stoppedRef.current = false;
    const playbook = operateOptions ? findPlaybook([...playbooks, ...(remember ? loadRuns(runsKey, version) : [])], text, location.pathname) : undefined;
    if (playbook) void replay(playbook, text);
    else sendToModel(text, messages);
  };

  const answerApproval = (message: UIMessage, response: ApprovalResponse) => {
    const part = message.parts.find(item => "toolCallId" in item && item.toolCallId === response.id) as { type: string; toolName?: string; toolCallId: string; input?: unknown } | undefined;
    if (!part) return;
    const name = toolName(part);
    setDecisions(current => ({ ...current, [part.toolCallId]: response.approved }));
    stoppedRef.current = false;
    if (response.approved) void run(name, part.toolCallId, part.input);
    else addToolOutput({ tool: name, toolCallId: part.toolCallId, output: { denied: true, message: "用户拒绝执行这个操作" } });
  };

  // Browser tools that need approval are shown through AgentParts' approval states.
  const partsFor = (message: UIMessage): AgentMessagePart[] => message.parts.map(original => {
    // Pictures only come through show_cards, where they are checked against tool results.
    if (original.type === "text") return { ...original, text: original.text.replace(/!\[[^\]]*\]\([^)]*\)/g, "") } as AgentMessagePart;
    if (!("toolCallId" in original)) return original as AgentMessagePart;
    const name = toolName(original as { type: string });
    if (catalogNames.has(name)) return original as AgentMessagePart;
    const item = tools.find(entry => entry.name === name);
    const input = "input" in original ? original.input : undefined;
    const callLabel = item?.labelFor && input !== undefined ? safely(() => item.labelFor!(input), undefined) : undefined;
    // toolName is what AgentParts shows; catalog parts keep theirs so renderTool still matches.
    // A per-call label already says what the input is; the raw JSON chip would repeat it.
    const part = { ...original, toolName: callLabel ?? item?.label ?? toolLabels[name] ?? name, ...(callLabel ? { input: undefined } : {}) };
    if (!item?.needsApproval && !gated[part.toolCallId]) return part as AgentMessagePart;
    const decision = decisions[part.toolCallId];
    if (decision === false) return { ...part, state: "output-denied", approval: { id: part.toolCallId, approved: false } } as AgentMessagePart;
    if (decision === undefined && part.state === "input-available") return { ...part, state: "approval-requested", approval: { id: part.toolCallId } } as AgentMessagePart;
    return part as AgentMessagePart;
  });

  const renderToolFor = (message: UIMessage) => {
    const sources = sourcesFrom(message.parts.filter(part => "toolCallId" in part && !catalogNames.has(toolName(part as { type: string })) && "output" in part).map(part => (part as { output?: unknown }).output));
    return Object.fromEntries(uiToolNames.map(name => [name, (part: { input?: unknown }) => renderCatalog(name as UiToolName, part.input, ask, sources)]));
  };

  const busy = status === "submitted" || status === "streaming" || replaying;

  // A model run that operated the page and finished cleanly is remembered for the same request.
  useEffect(() => {
    const start = runStart.current;
    const assistant = messages.at(-1);
    if (status !== "ready" || !start || stoppedRef.current || assistant?.role !== "assistant") return;
    const approved = new Set(assistant.parts.filter(part => "toolCallId" in part && (gated[part.toolCallId] || toolsRef.current.find(item => item.name === toolName(part as { type: string }))?.needsApproval)).map(part => (part as { toolCallId: string }).toolCallId));
    const run = recordRun(start.text, assistant, { replayable: new Set(toolsRef.current.map(item => item.name)), approved, pageTargets: PAGE_TARGETS, path: start.path });
    if (!run) return;
    runStart.current = undefined;
    if (remember && operating && run.steps.some(step => pageToolNames.has(step.tool))) rememberRun(runsKey, version, run);
  }, [status, messages, gated, remember, operating, runsKey, version]);

  // The page stays taken over from the first action until the chat has been idle for a moment.
  useEffect(() => {
    if (busy) holdRun();
    else endRunSoon(1200);
  }, [busy]);

  const halt = () => haltRef.current();

  // Never leave the page locked behind an unmounted panel.
  useEffect(() => endRun, []);

  useEffect(() => {
    insetPage(open);
    return () => insetPage(false);
  }, [open]);

  if (!open) {
    return (
      <button
        type="button"
        data-forge-agent="launcher"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-fg-black px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
      >
        <StarsLinear size={18} />
        {launcherLabel ?? title}
      </button>
    );
  }

  return (
    <aside aria-label={title} data-forge-agent="panel" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col border-l border-fg-grey-200 bg-background shadow-2xl lg:shadow-none">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-fg-grey-200 pl-4 pr-2">
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-fg-black"><StarsLinear size={16} className="text-fg-blue" />{title}</span>
        <div className="flex items-center">
          <IconButton variant="ghost" shape="square" size="sm" aria-label="新对话" title="新对话" onClick={() => { halt(); runStart.current = undefined; setMessages([]); setDecisions({}); setGated({}); }}><PenNewSquareLinear size={16} /></IconButton>
          {/* The icon set has no bare cross; a turned plus keeps the same stroke. */}
          <IconButton variant="ghost" shape="square" size="sm" aria-label="关闭" title="关闭" onClick={() => setOpen(false)}><PlusLinear size={18} className="rotate-45" /></IconButton>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">
        <Conversation followKey={messages.length + (messages.at(-1)?.parts.length ?? 0)}>
          {messages.length === 0 && (
            <div className="flex flex-col gap-3 pt-2">
              <p className="text-[15px] font-semibold leading-6 text-fg-black">{greeting}</p>
              <PromptSuggestions size="sm" suggestions={suggestions} onSelect={ask} />
            </div>
          )}
          {messages.map(message => message.role === "user"
            ? <AgentMessage key={message.id} role="user">{messageText(message)}</AgentMessage>
            : (
              <div key={message.id} data-role="assistant" className="flex min-w-0 flex-col gap-1.5">
                <AgentParts
                  size="sm"
                  parts={partsFor(message).filter(part => !(catalogNames.has(toolName(part as { type: string })) && "state" in part && part.state !== "output-available"))}
                  status={status}
                  renderTool={renderToolFor(message)}
                  onToolApproval={response => answerApproval(message, response)}
                />
                {messageText(message) && !(busy && message === messages.at(-1)) && <MessageActions copyText={messageText(message)} onRetry={busy ? undefined : () => void regenerate({ messageId: message.id })} />}
              </div>
            ))}
          {error && <p role="alert" className="text-[13px] text-fg-red">出错了：{error.message}</p>}
        </Conversation>
      </div>
      <div className="shrink-0 px-3 pb-3">
        <ChatInputBar
          multiline
          sendOnEnter
          density="compact"
          showAttachment={false}
          placeholder={`问${title.replace(/^问/, "")}…`}
          status={busy ? "running" : "idle"}
          onStop={halt}
          onSend={ask}
          permissions={operateOptions ? MODES : undefined}
          permission={mode}
          onPermissionChange={id => setMode(id as OperateMode)}
          permissionMenuLabel="操作页面的方式"
        />
      </div>
    </aside>
  );
}
