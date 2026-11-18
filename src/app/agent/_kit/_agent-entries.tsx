"use client";

import type { ReactNode } from "react";
import { DocExample } from "../../components/_doc-blocks";
import { PreviewBlock } from "../../components/_preview-block";
import type { AgentEntryMeta } from "./_agent-meta";
import {
  CODE_APPROVAL, CODE_APPROVAL_PARTS, CODE_ARTIFACT, CODE_CODE_BLOCK, CODE_CONTEXT, CODE_CONVERSATION, CODE_DIFF_TABLE, CODE_FLOW,
  CODE_INSIGHT, CODE_PARTS, CODE_RECOMMEND, CODE_SEARCH, CODE_STREAM, CODE_TASKS, CODE_THINKING, CODE_TOOLS, KIT_CODE,
} from "./_agent-data";
import { ApprovalPartsDemo, ArtifactDemo, ConversationDemo, PartsDemo } from "./_conversation-demo";
import {
  AgentCodeBlockDemo, AgentDiffTableDemo, AgentFlowchartDemo, AgentTaskRowsDemo, ApprovalCardDemo, CommandSearchDemo,
  ContextCardsDemo, InsightCardsDemo, RecommendationDemo, StreamingAnswerDocDemo, ThinkingTraceDemo, ToolChipsDemo,
} from "./_inline-demos";
import {
  AgentComposerDemo, AgentPlanDemo, AgentTrailDemo, ApprovalDemo, AutonomyDemo, AwayDemo, CheckpointsDemo, CitedAnswerDemo,
  ComposerPartsBuildDemo, ComposerPartsDemo, ContextDemo, ConversationListDemo, HarnessCardsDemo, InboxDemo, InlineDiffDemo,
  LedgerDemo, PanelDemo, QuestionDemo, ReasoningDemo, ThinkingIndicatorDemo, ToolCallDemo, TraceDemo, TreeDemo, WelcomeDemo,
} from "./_kit-demos";

/** The live demo and code for each entry in _agent-meta.ts, keyed by slug. */
export const AGENT_DEMOS: Record<string, { demo: () => ReactNode; code: string; minHeight: number }> = {
  "chat-input-bar": { demo: AgentComposerDemo, code: KIT_CODE.composerBar, minHeight: 420 },
  composer: { demo: ComposerPartsBuildDemo, code: KIT_CODE.composerParts, minHeight: 380 },
  conversation: { demo: ConversationDemo, code: CODE_CONVERSATION, minHeight: 460 },
  "agent-welcome": { demo: WelcomeDemo, code: KIT_CODE.welcome, minHeight: 200 },
  "run-controls": { demo: ComposerPartsDemo, code: KIT_CODE.composer, minHeight: 320 },
  "agent-panel": { demo: PanelDemo, code: KIT_CODE.panel, minHeight: 120 },
  "conversation-list": { demo: ConversationListDemo, code: KIT_CODE.conversations, minHeight: 420 },
  "artifact-card": { demo: ArtifactDemo, code: CODE_ARTIFACT, minHeight: 260 },
  reasoning: { demo: ReasoningDemo, code: KIT_CODE.reasoning, minHeight: 220 },
  "thinking-indicator": { demo: ThinkingIndicatorDemo, code: KIT_CODE.indicator, minHeight: 120 },
  "tool-call": { demo: ToolCallDemo, code: KIT_CODE.toolCall, minHeight: 300 },
  "thinking-trace": { demo: ThinkingTraceDemo, code: CODE_THINKING, minHeight: 200 },
  "tool-chips": { demo: ToolChipsDemo, code: CODE_TOOLS, minHeight: 180 },
  "agent-task-rows": { demo: AgentTaskRowsDemo, code: CODE_TASKS, minHeight: 200 },
  question: { demo: QuestionDemo, code: KIT_CODE.question, minHeight: 300 },
  approval: { demo: ApprovalDemo, code: KIT_CODE.approval, minHeight: 300 },
  "choice-card": { demo: HarnessCardsDemo, code: KIT_CODE.harness, minHeight: 240 },
  "tool-approval": { demo: ApprovalPartsDemo, code: CODE_APPROVAL_PARTS, minHeight: 300 },
  "approval-card": { demo: ApprovalCardDemo, code: CODE_APPROVAL, minHeight: 260 },
  "recommendation-card": { demo: RecommendationDemo, code: CODE_RECOMMEND, minHeight: 240 },
  "agent-parts": { demo: PartsDemo, code: CODE_PARTS, minHeight: 420 },
  "streaming-answer": { demo: StreamingAnswerDocDemo, code: CODE_STREAM, minHeight: 360 },
  "cited-answer": { demo: CitedAnswerDemo, code: KIT_CODE.cited, minHeight: 220 },
  "inline-diff": { demo: InlineDiffDemo, code: KIT_CODE.inlineDiff, minHeight: 280 },
  "context-cards": { demo: ContextCardsDemo, code: CODE_CONTEXT, minHeight: 200 },
  "insight-cards": { demo: InsightCardsDemo, code: CODE_INSIGHT, minHeight: 280 },
  "agent-code-block": { demo: AgentCodeBlockDemo, code: CODE_CODE_BLOCK, minHeight: 280 },
  "agent-diff-table": { demo: AgentDiffTableDemo, code: CODE_DIFF_TABLE, minHeight: 280 },
  "agent-flowchart": { demo: AgentFlowchartDemo, code: CODE_FLOW, minHeight: 360 },
  "command-search": { demo: CommandSearchDemo, code: CODE_SEARCH, minHeight: 280 },
  "agent-plan": { demo: AgentPlanDemo, code: KIT_CODE.plan, minHeight: 360 },
  "agent-trail": { demo: AgentTrailDemo, code: KIT_CODE.trail, minHeight: 360 },
  "agent-checkpoints": { demo: CheckpointsDemo, code: KIT_CODE.checkpoints, minHeight: 200 },
  "change-ledger": { demo: LedgerDemo, code: KIT_CODE.ledger, minHeight: 360 },
  "autonomy-selector": { demo: AutonomyDemo, code: KIT_CODE.autonomy, minHeight: 260 },
  "agent-inbox": { demo: InboxDemo, code: KIT_CODE.inbox, minHeight: 380 },
  "away-summary": { demo: AwayDemo, code: KIT_CODE.away, minHeight: 320 },
  "context-usage": { demo: ContextDemo, code: KIT_CODE.context, minHeight: 320 },
  "agent-tree": { demo: TreeDemo, code: KIT_CODE.tree, minHeight: 380 },
  "trace-waterfall": { demo: TraceDemo, code: KIT_CODE.trace, minHeight: 280 },
};

export function AgentExample({ entry }: { entry: AgentEntryMeta }) {
  const { demo: Demo, code, minHeight } = AGENT_DEMOS[entry.slug];
  return <DocExample id={entry.id} title={entry.title} summary={entry.summary} code={code} minHeight={minHeight}><Demo /></DocExample>;
}

/** The demo and its code without the heading, for the component's own page. */
export function AgentPreview({ slug }: { slug: string }) {
  const { demo: Demo, code, minHeight } = AGENT_DEMOS[slug];
  return <PreviewBlock code={code} minHeight={minHeight}><Demo /></PreviewBlock>;
}
