"use client";

import { CompleteApiReference } from "../../components/_complete-api-reference";
import { componentLabel } from "../../components/_labels";
import type { ApiTableRow } from "../../components/_api-table";
import type apiData from "../../components/_agent-api-data.json";
import {
  ACTIONS_ROWS, APPROVAL_PROPS, ARTIFACT_ROWS, CODE_PROPS, CONVERSATION_ROWS, DIFF_PROPS, FLOW_PROPS, INSIGHT_PROPS,
  MESSAGE_ROWS, PARTS_ROWS, SEARCH_PROPS, STREAM_PROPS, SUGGESTION_ROWS, TASK_PROPS, THINKING_PROPS,
} from "./_agent-data";

// Hand-written descriptions where the generated ones are not enough.
const ROWS: Partial<Record<string, ApiTableRow[]>> = {
  Conversation: CONVERSATION_ROWS,
  AgentMessage: MESSAGE_ROWS,
  MessageActions: ACTIONS_ROWS,
  PromptSuggestions: SUGGESTION_ROWS,
  ArtifactCard: ARTIFACT_ROWS,
  AgentParts: PARTS_ROWS,
  ThinkingTrace: THINKING_PROPS,
  StreamingAnswer: STREAM_PROPS,
  ApprovalCard: APPROVAL_PROPS,
  AgentTaskRows: TASK_PROPS,
  AgentDiffTable: DIFF_PROPS,
  AgentCodeBlock: CODE_PROPS,
  InsightCards: INSIGHT_PROPS,
  CommandSearch: SEARCH_PROPS,
  AgentFlowchart: FLOW_PROPS,
};

export function AgentApi({ name }: { name: string }) {
  const descriptions = ROWS[name];
  const key = name as keyof typeof apiData;
  return (
    <div id={`api-${name.toLowerCase()}`} className="flex scroll-mt-24 flex-col gap-2">
      <h3 className="text-sm font-semibold tracking-fg text-fg-black">{componentLabel(name)}</h3>
      {descriptions ? <CompleteApiReference name={key} descriptions={descriptions} /> : <CompleteApiReference name={key} />}
    </div>
  );
}
