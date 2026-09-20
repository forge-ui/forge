"use client";

import { useState } from "react";
import {
  ThinkingTrace,
  StreamingAnswer,
  ApprovalCard,
  ToolChips,
  AgentTaskRows,
  PromptBar,
  ContextCards,
  RecommendationCard,
  AgentDiffTable,
  AgentCodeBlock,
  InsightCards,
  CommandSearch,
  AgentFlowchart,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";

const TASKS = [
  {
    id: "1",
    title: "Verified vendor records",
    status: "completed" as const,
    meta: "12 suppliers",
    children: [
      { label: "Matched tax and contact IDs", value: "12/12", status: "completed" as const },
      { label: "Flagged stale records", value: "2", status: "failed" as const },
    ],
  },
  {
    id: "2",
    title: "Build reorder task list",
    status: "running" as const,
    meta: "7 SKUs",
    children: [
      { label: "Reading POS export", value: "3 files", status: "running" as const },
      { label: "Scoring stockout risk", value: "68%" },
    ],
  },
  {
    id: "3",
    title: "Draft supplier emails",
    status: "failed" as const,
    meta: "2 messages",
  },
];

export default function AgentCasePage() {
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [sent, setSent] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Agent"
        hint="ThinkingTrace · StreamingAnswer · ApprovalCard · ToolChips · AgentTaskRows · PromptBar · ContextCards · RecommendationCard · AgentDiffTable · AgentCodeBlock · InsightCards · CommandSearch · AgentFlowchart"
      />

      <Section title="ThinkingTrace" description="四种痕迹。点标题可折叠。">
        <SubSection title="Steps / Reasoning / Search / Coding" stack>
          <div className="grid gap-6 md:grid-cols-2">
            <ThinkingTrace variant="steps" settled />
            <ThinkingTrace variant="reasoning" settled />
            <ThinkingTrace variant="search" query="best waffle cone supplier" settled />
            <ThinkingTrace variant="coding" settled />
          </div>
        </SubSection>
      </Section>

      <Section title="StreamingAnswer" description="来源可展开，follow-up 可点。">
        <SubSection title="With sources" stack>
          <StreamingAnswer
            text="Pistachio is your fastest-growing flavor — sales are up 23% this month and margins beat vanilla by 8 points."
            sources={[
              { name: "Scoop Data", domain: "scoopdata.io" },
              { name: "Trends Index", domain: "trends.google.com" },
              { name: "Market Basket", domain: "marketbasket.io" },
            ]}
            followUps={["Which flavors sell best in winter", "Compare gelato and soft serve margins"]}
            onFollowUp={(text) => setFollowUp(text)}
          />
          {followUp && <p className="text-sm text-fg-grey-700">Selected: {followUp}</p>}
        </SubSection>
      </Section>

      <Section title="ApprovalCard" description="单选自动前进，多选等 Continue。">
        <SubSection title="Three questions" stack>
          <div className="max-w-lg">
            <ApprovalCard
              questions={[
                {
                  id: "count",
                  prompt: "How many flavors should we launch?",
                  options: [
                    { id: "three", label: "Three (core line)" },
                    { id: "five", label: "Five (full case)" },
                    { id: "one", label: "Just one hero" },
                  ],
                },
                {
                  id: "mixins",
                  prompt: "Which mix-ins should we stock?",
                  type: "check",
                  options: [
                    { id: "chips", label: "Chocolate chips" },
                    { id: "waffle", label: "Waffle bits" },
                    { id: "sprinkles", label: "Sprinkles" },
                  ],
                },
                {
                  id: "market",
                  prompt: "Which market do we enter first?",
                  options: [
                    { id: "trucks", label: "Food trucks" },
                    { id: "grocery", label: "Grocery freezers" },
                    { id: "shops", label: "Scoop shops" },
                  ],
                },
              ]}
            />
          </div>
        </SubSection>
      </Section>

      <Section title="ToolChips" description="点行展开工具细节。">
        <SubSection title="Run" stack>
          <ToolChips
            summary="4 tool calls, 2 messages"
            items={[
              {
                id: "think",
                kind: "think",
                label: "Thinking",
                chip: "Planning the churn schedule…",
                detail: [
                  { text: "Weekend demand carries pistachio, so it churns first." },
                  { text: "Batch capacity leaves two evening freezer windows." },
                ],
              },
              {
                id: "write",
                kind: "write",
                label: "Write 204 lines",
                chip: "ChurnSchedule.tsx",
                mono: true,
                detail: [
                  { text: "+ const windows = slots.filter((s) => s.temp <= -12)", tone: "add" },
                  { text: "+ return schedule(windows, { hero: \"pistachio\" })", tone: "add" },
                ],
              },
              {
                id: "run",
                kind: "run",
                label: "Rebuild and verify",
                chip: "npm run freeze",
                mono: true,
                detail: [{ text: "✓ built in 1.2s" }, { text: "✓ 34 checks passed" }],
              },
            ]}
            diffs={[
              { file: "flavors.css", add: 13 },
              { file: "ChurnSchedule.tsx", add: 74, del: 41 },
              { file: "menu.ts", add: 8, del: 2 },
            ]}
          />
        </SubSection>
      </Section>

      <Section title="AgentTaskRows" description="List 与 capsules。">
        <SubSection title="List" stack>
          <AgentTaskRows tasks={TASKS} />
        </SubSection>
        <SubSection title="Capsules" stack>
          <AgentTaskRows tasks={TASKS} variant="capsules" />
        </SubSection>
      </Section>

      <Section title="PromptBar" description="点 Sources / Commands，或输入 @ /。">
        <SubSection title="Composer" stack>
          <PromptBar
            value={prompt}
            onChange={setPrompt}
            onSend={(message) => setSent((current) => [...current, message])}
            sources={[
              { id: "sales", label: "Scoop Data", description: "Sales & churn metrics", connected: true },
              { id: "flavors", label: "Flavor records", description: "26 makers, tags, links" },
            ]}
            commands={[
              { id: "plan", label: "plan", description: "Draft a flavor launch plan" },
              { id: "forecast", label: "forecast", description: "Forecast summer demand" },
            ]}
            models={[
              { id: "fast", label: "Forge Fast" },
              { id: "think", label: "Forge Think" },
            ]}
            model="fast"
          />
          {sent.length > 0 && (
            <ul className="text-sm text-fg-grey-700">
              {sent.map((item) => (
                <li key={item}>Sent: {item}</li>
              ))}
            </ul>
          )}
        </SubSection>
      </Section>

      <Section title="ContextCards" description="检索块。">
        <SubSection title="Chunks" stack>
          <ContextCards
            total={32}
            chunks={[
              {
                id: "1",
                title: "Vendor onboarding rule",
                body: "Cold-chain certification must be verified before a new dairy can be added to the reorder workflow.",
                sourceKind: "PDF",
                sourceLabel: "Dairy Onboarding SOP.pdf",
                charCount: 290,
              },
              {
                id: "2",
                title: "Seasonal demand row",
                body: "Q4 velocity table: pistachio +18%, vanilla +6%, rocky road -11%; retire flavors below 40 scoops weekly.",
                sourceKind: "CSV",
                sourceLabel: "Sales Velocity Export.csv",
                charCount: 1250,
              },
            ]}
          />
        </SubSection>
      </Section>

      <Section title="RecommendationCard" description="主建议 + 备选。">
        <SubSection title="Restock" stack>
          <div className="max-w-lg">
            <RecommendationCard
              title="Want me to place this restock order?"
              body="Reorder waffle cones from Cone King with lead time 7 days."
              alternatives={[
                { id: "vanilla", label: "Switch to Vanilla Madagascar", confidence: "review" },
                { id: "full", label: "Full restock across every SKU", confidence: "none" },
              ]}
            />
          </div>
        </SubSection>
      </Section>

      <Section title="AgentDiffTable" description="点变更行可取消，再 Apply。">
        <SubSection title="Flavor schedule" stack>
          <div className="max-w-2xl">
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
          </div>
        </SubSection>
      </Section>

      <Section title="AgentCodeBlock" description="Code / Diff 切换，Copy 复制 listing。">
        <SubSection title="Reorder scorer" stack>
          <div className="max-w-2xl">
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
          </div>
        </SubSection>
      </Section>

      <Section title="InsightCards" description="左右翻页，点建议问句。">
        <SubSection title="Seasonal mix" stack>
          <div className="max-w-lg">
            <InsightCards
              cards={[
                {
                  id: "weekend",
                  title: "Weekend velocity",
                  body: "Mint chip now tracks pistachio on Saturdays.",
                  prompt: "Rebalance weekend freezers",
                  chart: { kind: "spark", series: [{ name: "Mint", values: [42, 48, 61, 74, 88, 94] }] },
                },
                {
                  id: "mix",
                  title: "Flavor mix",
                  body: "Rocky road dropped below the 40-scoop floor.",
                  prompt: "Retire rocky road",
                  chart: { kind: "bars", values: [86, 72, 54, 28, 41] },
                },
              ]}
            />
          </div>
        </SubSection>
      </Section>

      <Section title="CommandSearch" description="输入过滤命令。">
        <SubSection title="Palette" stack>
          <div className="max-w-lg">
            <CommandSearch
              items={[
                { id: "plan", label: "Draft a flavor launch plan", hint: "/plan", group: "Planning" },
                { id: "compare", label: "Compare mint chip to last summer", hint: "/compare", group: "Planning" },
                { id: "pos", label: "Open POS export", hint: "CSV", group: "Data" },
                { id: "reorder", label: "Queue pistachio reorder", hint: "workflow", group: "Workflow" },
              ]}
            />
          </div>
        </SubSection>
      </Section>

      <Section title="AgentFlowchart" description="点节点看选中态。">
        <SubSection title="Restock" stack>
          <div className="max-w-lg">
            <AgentFlowchart
              title="Restock workflow"
              nodes={[
                { id: "spike", kind: "trigger", title: "POS weekend spike", body: "Mint chip crosses 80 scoops." },
                { id: "check", kind: "condition", title: "Stockout risk?", body: "Lead time longer than 5 days." },
                { id: "draft", kind: "action", title: "Draft reorder", body: "Cone King, 7-day lead time." },
              ]}
              edges={[
                { from: "spike", to: "check", label: "always" },
                { from: "check", to: "draft", label: "if at risk" },
              ]}
            />
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
