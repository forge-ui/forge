"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { AgentMessage, AgentParts, ChatInputBar, Conversation, IconButton, MessageActions, PromptSuggestions, type AgentMessagePart } from "@forge-ui-official/core";
import { AddCircleLinear, CloseCircleLinear, StarsLinear } from "@forge-ui-official/core/icons";
import { renderCatalog, sourcesFrom } from "./catalog/render";
import { uiToolNames, type UiToolName } from "./catalog/schema";

/** A function the agent may call in the browser, with the signed-in user's session. */
export type AgentTool<Input = unknown> = {
  name: string;
  /** Short name shown to the user, e.g. "预览主色". Defaults to name. */
  label?: string;
  description: string;
  input: z.ZodType<Input>;
  /** Show Allow / Deny before running. */
  needsApproval?: boolean;
  // Method syntax keeps AgentTool<{ path: string }> assignable to AgentTool[].
  execute(input: Input): unknown;
};

export function defineTool<Input>(tool: AgentTool<Input>): AgentTool<Input> {
  return tool;
}

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
};

const catalogNames = new Set<string>(uiToolNames);
const toolName = (part: { type: string; toolName?: string }) => part.toolName ?? part.type.replace(/^tool-/, "");

// Same shape as AgentParts' onToolApproval argument; declared here so core 0.8.2 works too.
type ApprovalResponse = { id: string; approved: boolean; reason?: string };

/**
 * Resend only when the last step called browser tools and every one has an output. The stock
 * helper also fires on server-run tools, which would loop the conversation.
 */
function browserToolsDone(messages: UIMessage[], browserTools: Set<string>) {
  const message = messages.at(-1);
  if (message?.role !== "assistant") return false;
  const stepStart = message.parts.map(part => part.type).lastIndexOf("step-start");
  const calls = message.parts.slice(stepStart + 1).filter(part => "toolCallId" in part && browserTools.has(toolName(part as { type: string })));
  return calls.length > 0 && calls.every(part => "state" in part && (part.state === "output-available" || part.state === "output-error"));
}

function messageText(message: UIMessage) {
  return message.parts.map(part => (part.type === "text" ? part.text : "")).join("").trim();
}

export function ForgeAgent({ endpoint, title = "问 Forge", greeting = "有什么可以帮你？", suggestions = [], context, tools = [], storageKey, launcherLabel, defaultOpen = false, toolLabels = {} }: ForgeAgentProps) {
  const [open, setOpen] = useState(defaultOpen);
  // Approval decisions for browser tools, keyed by tool call; false keeps the call shown as denied.
  const [decisions, setDecisions] = useState<Record<string, boolean>>({});
  // Latest tools and context for callbacks that run after render (sending, tool calls).
  const toolsRef = useRef(tools);
  const contextRef = useRef(context);
  useLayoutEffect(() => {
    toolsRef.current = tools;
    contextRef.current = context;
  });

  // body() runs when a message is sent, never during render.
  // eslint-disable-next-line react-hooks/refs
  const transport = useMemo(() => new DefaultChatTransport({
    api: endpoint,
    body: () => ({
      context: typeof contextRef.current === "function" ? contextRef.current() : contextRef.current,
      tools: toolsRef.current.map(item => ({ name: item.name, description: item.description, inputSchema: z.toJSONSchema(item.input), needsApproval: item.needsApproval })),
    }),
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
    sendAutomaticallyWhen: ({ messages: current }) => browserToolsDone(current, new Set(toolsRef.current.map(item => item.name))),
    onToolCall: ({ toolCall }) => {
      const item = toolsRef.current.find(entry => entry.name === toolCall.toolName);
      // Catalog and server tools are not ours; approval-gated tools wait for the user.
      if (!item || item.needsApproval) return;
      void run(toolCall.toolName, toolCall.toolCallId, toolCall.input);
    },
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

  const ask = (text: string) => {
    if (!text.trim()) return;
    void sendMessage({ text });
  };

  const answerApproval = (message: UIMessage, response: ApprovalResponse) => {
    const part = message.parts.find(item => "toolCallId" in item && item.toolCallId === response.id) as { type: string; toolName?: string; toolCallId: string; input?: unknown } | undefined;
    if (!part) return;
    const name = toolName(part);
    setDecisions(current => ({ ...current, [part.toolCallId]: response.approved }));
    if (response.approved) void run(name, part.toolCallId, part.input);
    else addToolOutput({ tool: name, toolCallId: part.toolCallId, output: { denied: true, message: "用户拒绝执行这个操作" } });
  };

  // Browser tools that need approval are shown through AgentParts' approval states.
  const partsFor = (message: UIMessage): AgentMessagePart[] => message.parts.map(original => {
    if (!("toolCallId" in original)) return original as AgentMessagePart;
    const name = toolName(original as { type: string });
    if (catalogNames.has(name)) return original as AgentMessagePart;
    const item = tools.find(entry => entry.name === name);
    // toolName is what AgentParts shows; catalog parts keep theirs so renderTool still matches.
    const part = { ...original, toolName: item?.label ?? toolLabels[name] ?? name };
    if (!item?.needsApproval) return part as AgentMessagePart;
    const decision = decisions[part.toolCallId];
    if (decision === false) return { ...part, state: "output-denied", approval: { id: part.toolCallId, approved: false } } as AgentMessagePart;
    if (decision === undefined && part.state === "input-available") return { ...part, state: "approval-requested", approval: { id: part.toolCallId } } as AgentMessagePart;
    return part as AgentMessagePart;
  });

  const renderToolFor = (message: UIMessage) => {
    const sources = sourcesFrom(message.parts.filter(part => "toolCallId" in part && !catalogNames.has(toolName(part as { type: string })) && "output" in part).map(part => (part as { output?: unknown }).output));
    return Object.fromEntries(uiToolNames.map(name => [name, (part: { input?: unknown }) => renderCatalog(name as UiToolName, part.input, ask, sources)]));
  };

  const busy = status === "submitted" || status === "streaming";

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-fg-black px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
      >
        <StarsLinear size={18} />
        {launcherLabel ?? title}
      </button>
    );
  }

  return (
    <aside aria-label={title} className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col border-l border-fg-grey-200 bg-background shadow-2xl">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-fg-grey-200 px-4">
        <span className="flex items-center gap-2 text-sm font-semibold text-fg-black"><StarsLinear size={18} />{title}</span>
        <div className="flex items-center gap-1">
          <IconButton variant="tertiary" color="grey" size="sm" aria-label="新对话" onClick={() => { stop(); setMessages([]); setDecisions({}); }}><AddCircleLinear size={18} /></IconButton>
          <IconButton variant="tertiary" color="grey" size="sm" aria-label="关闭" onClick={() => setOpen(false)}><CloseCircleLinear size={18} /></IconButton>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">
        <Conversation followKey={messages.length + (messages.at(-1)?.parts.length ?? 0)}>
          {messages.length === 0 && (
            <div className="flex flex-col gap-4 py-6">
              <p className="text-base font-semibold text-fg-black">{greeting}</p>
              {suggestions.length > 0 && <PromptSuggestions label="可以试试" suggestions={suggestions} onSelect={ask} />}
            </div>
          )}
          {messages.map(message => message.role === "user"
            ? <AgentMessage key={message.id} role="user">{messageText(message)}</AgentMessage>
            : (
              <AgentMessage
                key={message.id}
                role="assistant"
                name={title}
                actions={messageText(message) ? <MessageActions copyText={messageText(message)} onRetry={busy ? undefined : () => void regenerate({ messageId: message.id })} /> : undefined}
              >
                <AgentParts
                  parts={partsFor(message).filter(part => !(catalogNames.has(toolName(part as { type: string })) && "state" in part && part.state !== "output-available"))}
                  status={status}
                  renderTool={renderToolFor(message)}
                  onToolApproval={response => answerApproval(message, response)}
                />
              </AgentMessage>
            ))}
          {error && <p role="alert" className="py-2 text-sm text-fg-red">出错了：{error.message}</p>}
        </Conversation>
      </div>
      <div className="shrink-0 border-t border-fg-grey-200 p-3">
        <ChatInputBar placeholder={`问${title.replace(/^问/, "")}…`} status={busy ? "running" : "idle"} onStop={stop} onSend={ask} />
      </div>
    </aside>
  );
}
