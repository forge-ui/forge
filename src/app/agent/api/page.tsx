"use client";

import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { PageHeading, Section, SubSection } from "../../components/_shared";
import { ExampleGrid } from "../../components/_doc-blocks";
import { CodeBlock } from "../../components/_api-table";
import { CHOOSE, CODE_IMPORT } from "../_kit/_agent-data";
import { AgentApi } from "../_kit/_agent-api";
import { AgentExample } from "../_kit/_agent-entries";
import { AGENT_ENTRIES, AGENT_GROUPS, type AgentEntryMeta } from "../_kit/_agent-meta";


function ChooseTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-fg-grey-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-fg-grey-50 text-fg-grey-700"><tr>{["要做的事", "用", "不要用在"].map(label => <th key={label} className="px-4 py-3 font-semibold">{label}</th>)}</tr></thead>
        <tbody>{CHOOSE.map(row => <tr key={row.need} className="border-t border-fg-grey-200"><td className="px-4 py-3 text-fg-black">{row.need}</td><td className="px-4 py-3 font-medium text-fg-black">{row.use}</td><td className="px-4 py-3 text-fg-grey-700">{row.avoid}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

// Entries marked half share a row with the next half entry.
function GroupExamples({ entries }: { entries: AgentEntryMeta[] }) {
  const rows: ReactNode[] = [];
  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index];
    const next = entries[index + 1];
    if (entry.half && next?.half) {
      rows.push(<ExampleGrid key={entry.slug}><AgentExample entry={entry} /><AgentExample entry={next} /></ExampleGrid>);
      index++;
    } else rows.push(<AgentExample key={entry.slug} entry={entry} />);
  }
  return <>{rows}</>;
}

export default function AgentAllPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="全部组件"
        hint="Forge Agent 的全部组件在一页：示例按分类排开，最后是完整参数表。单个组件的说明见左侧导航。"
      />


      <p className="text-sm leading-6 text-fg-grey-700">
        输入框的完整用法（发送与停止、模型和权限、@ 提及）见
        <Link href="/agent/chat-input-bar" className="ml-1 text-fg-blue underline underline-offset-4">ChatInputBar</Link>。
      </p>

      <Section title="用法">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
      </Section>

      <Section title="怎么选" description="按要做的事挑组件；右列是常见的误用。">
        <ChooseTable />
      </Section>

      {AGENT_GROUPS.map(group => (
        <Fragment key={group.title}>
          <Section title={group.title} description={group.description}>
            <GroupExamples entries={AGENT_ENTRIES.filter(entry => entry.group === group.title)} />
          </Section>
        </Fragment>
      ))}

      <Section title="API">
        <AgentApi name="Conversation" />
        <AgentApi name="AgentMessage" />
        <AgentApi name="MessageActions" />
        <AgentApi name="PromptSuggestions" />
        <AgentApi name="ArtifactCard" />
        <AgentApi name="AgentParts" />
        <AgentApi name="Composer" />
        <AgentApi name="ComposerHeader" />
        <AgentApi name="ComposerInput" />
        <AgentApi name="ComposerToolbar" />
        <AgentApi name="ComposerAction" />
        <AgentApi name="ComposerModelMenu" />
        <AgentApi name="ComposerSend" />
        <AgentApi name="ConversationList" />
        <AgentApi name="InlineDiff" />
        <AgentApi name="Reasoning" />
        <AgentApi name="ThinkingIndicator" />
        <AgentApi name="ToolCall" />
        <AgentApi name="ToolCallGroup" />
        <AgentApi name="Question" />
        <AgentApi name="Approval" />
        <AgentApi name="ChoiceCard" />
        <AgentApi name="ConfirmCard" />
        <AgentApi name="Citation" />
        <AgentApi name="CitedAnswer" />
        <AgentApi name="RunControls" />
        <AgentApi name="PromptQueue" />
        <AgentApi name="AttachmentList" />
        <AgentApi name="AgentWelcome" />
        <AgentApi name="AgentPanel" />
        <AgentApi name="AgentPlan" />
        <AgentApi name="AgentTrail" />
        <AgentApi name="RunProgress" />
        <AgentApi name="AgentCheckpoints" />
        <AgentApi name="ChangeLedger" />
        <AgentApi name="AutonomySelector" />
        <AgentApi name="AgentInbox" />
        <AgentApi name="RunningNow" />
        <AgentApi name="AwaySummary" />
        <AgentApi name="ContextUsage" />
        <AgentApi name="TraceWaterfall" />
        <AgentApi name="AgentTree" />
        <AgentApi name="AgentLanes" />
        <AgentApi name="ThinkingTrace" />
        <AgentApi name="StreamingAnswer" />
        <AgentApi name="ApprovalCard" />
        <AgentApi name="ToolChips" />
        <AgentApi name="AgentTaskRows" />
        <AgentApi name="ContextCards" />
        <AgentApi name="RecommendationCard" />
        <AgentApi name="AgentDiffTable" />
        <AgentApi name="AgentCodeBlock" />
        <AgentApi name="InsightCards" />
        <AgentApi name="CommandSearch" />
        <AgentApi name="AgentFlowchart" />
      </Section>
    </div>
  );
}
