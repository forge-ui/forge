"use client";

import { useState } from "react";
import {
  AgentMessage,
  AgentParts,
  ArtifactCard,
  Button,
  ChatInputBar,
  Conversation,
  MessageActions,
  PromptSuggestions,
  Toggle,
  type AgentMessagePart,
  type MessageFeedback,
} from "@forge-ui-official/core";

type Turn = { id: number; role: "user" | "assistant"; text: string };

const replies: Record<string, string> = {
  "本周退款最多的商品是哪个？": "本周退款最多的是**无线耳机 G1 Pro**，共 18 单，主要原因是“左耳无声”。",
  "帮我写一封补货邮件": "已起草补货邮件，收件人是华东仓，内容包含 3 个缺货 SKU 和期望到货日期。",
};

export function ConversationDemo() {
  const [turns, setTurns] = useState<Turn[]>([
    { id: 1, role: "user", text: "昨天的订单有异常吗？" },
    { id: 2, role: "assistant", text: "昨天共 1,284 单，有 6 单支付超时未关闭，已标记待处理。" },
  ]);
  const [feedback, setFeedback] = useState<Record<number, MessageFeedback>>({});
  const ask = (text: string) => {
    if (!text.trim()) return;
    setTurns(current => [...current, { id: current.length + 1, role: "user", text }, { id: current.length + 2, role: "assistant", text: replies[text] ?? `收到：“${text}”。示例回复，接入模型后替换。` }]);
  };

  return (
    <div className="flex h-[420px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-fg-grey-200 bg-background">
      <Conversation followKey={turns.length}>
        {turns.map(turn => turn.role === "user"
          ? <AgentMessage key={turn.id} role="user">{turn.text}</AgentMessage>
          : <AgentMessage key={turn.id} role="assistant" name="运营助手" actions={<MessageActions copyText={turn.text} onRetry={() => setTurns(current => current.map(item => item.id === turn.id ? { ...item, text: item.text + "（已重新生成）" } : item))} feedback={feedback[turn.id] ?? null} onFeedback={value => setFeedback(current => ({ ...current, [turn.id]: value }))} />}>
              <AgentParts parts={[{ type: "text", text: turn.text, state: "done" }]} />
            </AgentMessage>)}
        <PromptSuggestions label="可以试试" suggestions={Object.keys(replies)} onSelect={ask} />
      </Conversation>
      <div className="border-t border-fg-grey-200 p-3">
        <ChatInputBar placeholder="问运营助手…" onSend={ask} />
      </div>
    </div>
  );
}

const partsExample: AgentMessagePart[] = [
  { type: "reasoning", text: "需要先查库存，再按近 30 天销量算补货量。", state: "done" },
  { type: "tool-getInventory", toolCallId: "call-1", state: "output-available", input: { sku: "G1-PRO" }, output: { stock: 12, warehouse: "华东仓" } },
  { type: "tool-getSales", toolCallId: "call-2", state: "output-available", input: { sku: "G1-PRO", days: 30 }, output: { sold: 248 } },
  { type: "text", text: "华东仓还剩 **12** 件，按近 30 天销量 248 件计算，建议补货 **90** 件。", state: "done" },
  { type: "source-url", sourceId: "s1", url: "https://forgeui.org/templates/ecommerce/products", title: "商品库存" },
  { type: "file", mediaType: "text/csv", url: "#", filename: "补货清单.csv" },
];

export function PartsDemo() {
  const [custom, setCustom] = useState(false);
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <div className="flex items-center gap-2 text-sm text-fg-grey-900">
        <Toggle checked={custom} onChange={setCustom} ariaLabel="自定义库存卡片" />
        用 renderTool 把库存查询换成自己的卡片
      </div>
      <AgentMessage role="assistant" name="补货助手">
        <AgentParts
          parts={partsExample}
          onOpenFile={() => window.open("/templates/ecommerce/products", "_blank", "noopener")}
          renderTool={custom ? { getInventory: part => {
            const output = part.output as { stock: number; warehouse: string };
            return <div className="rounded-xl border border-fg-grey-200 bg-fg-grey-50 p-4 text-sm"><div className="text-fg-grey-700">{output.warehouse} 库存</div><div className="mt-1 text-2xl font-bold text-fg-black">{output.stock} 件</div></div>;
          } } : undefined}
        />
      </AgentMessage>
    </div>
  );
}

export function ArtifactDemo() {
  const [status, setStatus] = useState<"generating" | "ready">("generating");
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ArtifactCard title="十一月运营周报.md" kind="document" meta="Markdown · 4.2 KB" status={status} onOpen={() => setStatus("generating")} onDownload={() => window.open("/docs/changelog", "_blank", "noopener")} />
      <ArtifactCard title="退款原因分析.png" kind="image" meta="PNG · 1280×720" onOpen={() => window.open("/images/home/block-transactions-table.webp", "_blank", "noopener")} />
      <ArtifactCard title="渠道对账.xlsx" kind="table" status="error" />
      <Button variant="tertiary" size="sm" className="w-fit" onClick={() => setStatus("ready")}>模拟生成完成</Button>
    </div>
  );
}
