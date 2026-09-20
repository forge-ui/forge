"use client";

import { useState } from "react";
import {
  AppLayout,
  ChatBubble,
  ThinkingTrace,
  ToolChips,
  StreamingAnswer,
  ContextCards,
  RecommendationCard,
  ApprovalCard,
  AgentDiffTable,
  AgentCodeBlock,
  InsightCards,
  PromptBar,
} from "@forge-ui-official/core";
import type { AppLayoutMenuItem } from "@forge-ui-official/core";
import {
  ChatRoundLinear,
  ClipboardListBoldDuotone,
  StarsLinear,
  WidgetBoldDuotone,
} from "solar-icon-set";
import { ProtaskLogoMark } from "../_shared/protask-logo";

const menuItems: AppLayoutMenuItem[] = [
  { icon: <WidgetBoldDuotone size={20} />, label: "Home", href: "/templates/agent" },
  { icon: <StarsLinear size={20} />, label: "Compare mint chip", href: "/templates/agent" },
  { icon: <ClipboardListBoldDuotone size={20} />, label: "Supplier records", href: "/templates/agent" },
  { icon: <ChatRoundLinear size={20} />, label: "Flavor page ticket", href: "/templates/agent" },
];

const ANSWER =
  "Mint chip is up 12% against last summer, with stronger weekend peaks. Pistachio still leads the seasonal line.";

export default function AgentTemplatePage() {
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<string[]>([]);

  return (
    <AppLayout
      mode="light"
      accent="purple"
      profilePosition="topbar"
      hideHeader
      logo={<ProtaskLogoMark />}
      logoText="Forge Agent"
      menuSectionLabel="CHATS"
      menuItems={menuItems}
      profile={{
        avatar: "https://i.pravatar.cc/150?u=forge-agent",
        name: "Alex Chen",
        role: "Ops lead",
      }}
      teamName="Creamery Ops"
      teamMemberCount={8}
      notifications={2}
      messages={1}
      searchPlaceholder="Search threads…"
    >
      <div className="flex min-h-[calc(100vh-5rem)] flex-col">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6">
          <ChatBubble type="sent" content="Compare mint chip to last summer" />
          <ThinkingTrace variant="steps" settled doneLabel="Thought for 4 seconds" />
          <ToolChips
            summary="3 tool calls"
            items={[
              {
                id: "think",
                kind: "think",
                label: "Thinking",
                chip: "Comparing three summers…",
                detail: [{ text: "Pulled mint chip sales for comparison." }],
              },
              {
                id: "read",
                kind: "read",
                label: "Read",
                chip: "Sales History.csv",
                mono: true,
                detail: [{ text: "Weekend peaks are stronger this July." }],
              },
            ]}
          />
          <StreamingAnswer
            text={ANSWER}
            sources={[
              { name: "Sales History", domain: "internal" },
              { name: "Flavor Data", domain: "scoopdata.io" },
            ]}
            followUps={["Should I rebalance flavors?", "Draft a pistachio reorder"]}
            onFollowUp={(text) => setTurns((current) => [...current, text])}
          />
          <ContextCards
            total={2}
            chunks={[
              {
                id: "1",
                title: "Seasonal demand row",
                body: "Q4 velocity: pistachio +18%, mint chip +12%, rocky road -11%.",
                sourceKind: "CSV",
                sourceLabel: "Sales Velocity Export.csv",
                charCount: 180,
              },
            ]}
          />
          <RecommendationCard
            title="Should I rebalance flavors?"
            body="Hold rocky road and give pistachio the next two weekend freezer windows."
            alternatives={[{ id: "wait", label: "Wait one more week of POS data", confidence: "review" }]}
          />
          <InsightCards
            cards={[
              {
                id: "weekend",
                title: "Weekend velocity",
                body: "Mint chip now tracks pistachio on Saturdays.",
                prompt: "Rebalance weekend freezers",
                chart: { kind: "spark", series: [{ name: "Mint", values: [42, 48, 61, 74, 88, 94] }] },
              },
            ]}
          />
          <AgentDiffTable
            title="Flavor schedule"
            columns={[
              { key: "flavor", label: "Flavor" },
              { key: "scoops", label: "Weekly scoops" },
              { key: "action", label: "Action" },
            ]}
            rows={[
              { id: "pistachio", change: "keep", cells: { flavor: "Pistachio", scoops: "186", action: "Keep weekend window" } },
              { id: "rocky", change: "remove", cells: { flavor: "Rocky Road", scoops: "28", action: "Retire from freezer" } },
              { id: "mint", change: "add", cells: { flavor: "Mint Chip", scoops: "94", action: "Add Saturday slot" } },
            ]}
          />
          <AgentCodeBlock
            filename="lib/reorder.ts"
            lines={[
              "export async function scoreStockout(sku: string) {",
              "  const velocity = await readVelocity(sku);",
              "  return velocity.weekend > 80 ? 'reorder' : 'hold';",
              "}",
            ]}
            diff={[
              { old: 1, cur: 1, type: "ctx", pieces: [{ text: "export async function scoreStockout(sku: string) {" }] },
              { old: 2, cur: null, type: "del", pieces: [{ text: "  const velocity = await readVelocity(sku);", change: "del" }] },
              { old: null, cur: 2, type: "add", pieces: [{ text: "  const velocity = await readVelocity(sku, { window: 'weekend' });", change: "add" }] },
              { old: 3, cur: 3, type: "ctx", pieces: [{ text: "  return velocity.weekend > 80 ? 'reorder' : 'hold';" }] },
              { old: 4, cur: 4, type: "ctx", pieces: [{ text: "}" }] },
            ]}
          />
          <ApprovalCard
            questions={[
              {
                id: "windows",
                prompt: "Give pistachio the next two weekend freezer windows?",
                options: [
                  { id: "yes", label: "Yes, apply the schedule" },
                  { id: "one", label: "Only this weekend" },
                  { id: "no", label: "Keep the current mix" },
                ],
              },
            ]}
          />

          {turns.map((turn) => (
            <div key={turn} className="flex flex-col gap-4">
              <ChatBubble type="sent" content={turn} />
              <ThinkingTrace variant="reasoning" play rows={[{ primary: "Looking at the latest POS export." }]} />
              <StreamingAnswer text="Noted. I queued that as the next agent step." />
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 border-t border-fg-grey-200 bg-fg-grey-50 px-4 py-4">
          <div className="mx-auto w-full max-w-3xl">
            <PromptBar
              value={draft}
              onChange={setDraft}
              onSend={(message) => setTurns((current) => [...current, message])}
              sources={[
                { id: "sales", label: "Scoop Data", description: "Sales & churn metrics", connected: true },
                { id: "pos", label: "POS export", description: "Last 3 summers" },
              ]}
              commands={[{ id: "plan", label: "plan", description: "Draft a flavor launch plan" }]}
              models={[
                { id: "fast", label: "Forge Fast" },
                { id: "think", label: "Forge Think" },
              ]}
              model="fast"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
