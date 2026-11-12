"use client";

import { useState } from "react";
import {
  AgentMessage,
  AgentParts,
  ChatInputBar,
  Conversation,
  MessageActions,
  PromptSuggestions,
  type AgentMessagePart,
  type MessageFeedback,
} from "@forge-ui-official/core";

type Turn = { id: number; role: "user" | "assistant"; text: string };

const replies: Record<string, string> = {
  "Which product had the most refunds this week?": "**Wireless Earbuds G1 Pro** — 18 refunds this week, mostly “no sound in the left earbud”.",
  "Draft a restock email": "Drafted a restock email to the East warehouse covering 3 out-of-stock SKUs and the expected arrival date.",
};

const parts: AgentMessagePart[] = [
  { type: "reasoning", text: "Check stock first, then size the order from 30-day sales.", state: "done" },
  { type: "tool-getInventory", toolCallId: "call-1", state: "output-available", input: { sku: "G1-PRO" }, output: { stock: 12, warehouse: "East" } },
  { type: "tool-getSales", toolCallId: "call-2", state: "output-available", input: { sku: "G1-PRO", days: 30 }, output: { sold: 248 } },
  { type: "text", text: "The East warehouse has **12** units left. At 248 sold in the last 30 days, restock **90** units.", state: "done" },
  { type: "file", mediaType: "text/csv", url: "#", filename: "restock-plan.csv" },
];

export function EnglishConversationDemo() {
  const [turns, setTurns] = useState<Turn[]>([
    { id: 1, role: "user", text: "Anything unusual in yesterday's orders?" },
    { id: 2, role: "assistant", text: "1,284 orders yesterday. 6 payments timed out without closing; they're flagged for review." },
  ]);
  const [feedback, setFeedback] = useState<Record<number, MessageFeedback>>({});
  const ask = (text: string) => {
    if (!text.trim()) return;
    setTurns(current => [...current, { id: current.length + 1, role: "user", text }, { id: current.length + 2, role: "assistant", text: replies[text] ?? `Got it: “${text}”. This is a sample reply; connect your model to answer for real.` }]);
  };

  return (
    <div className="flex h-[420px] w-full flex-col overflow-hidden rounded-2xl border border-fg-grey-200 bg-background">
      <Conversation followKey={turns.length} locale="en">
        {turns.map(turn => turn.role === "user"
          ? <AgentMessage key={turn.id} role="user">{turn.text}</AgentMessage>
          : <AgentMessage key={turn.id} role="assistant" name="Ops assistant" actions={<MessageActions locale="en" copyText={turn.text} feedback={feedback[turn.id]} onFeedback={value => setFeedback(current => ({ ...current, [turn.id]: value }))} />}>
              <AgentParts locale="en" parts={[{ type: "text", text: turn.text, state: "done" }]} />
            </AgentMessage>)}
        <PromptSuggestions label="Try asking" suggestions={Object.keys(replies)} onSelect={ask} />
      </Conversation>
      <div className="border-t border-fg-grey-200 p-3">
        <ChatInputBar locale="en" placeholder="Ask the ops assistant…" onSend={ask} />
      </div>
    </div>
  );
}

export function EnglishPartsDemo() {
  return (
    <div className="w-full rounded-2xl border border-fg-grey-200 bg-background p-5">
      <AgentMessage role="assistant" name="Restock assistant">
        <AgentParts locale="en" parts={parts} onOpenFile={() => window.open("/templates/ecommerce/products", "_blank", "noopener")} />
      </AgentMessage>
    </div>
  );
}
