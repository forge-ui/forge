"use client";

import type { FusionExampleProps } from "./types";
import { CodeFoldingExample, DiffReviewExample, FindReplaceExample, MarkdownExample, TextAssemblyExample, UndoHistoryExample, VersionHistoryExample } from "./composition-editing";
import { ApprovalWorkflowExample, CollaborationExample, EventRegistrationExample, PermissionMatrixExample, ReviewCarouselExample, ScheduleConflictExample, TimeZoneExample, WorkAssignmentExample } from "./composition-workflow";
import { GeneratedReviewExample, SearchRecoveryExample } from "./composition-recovery";

export const compositionIds = ["057", "059", "092", "108", "110", "126", "127", "128", "129", "176", "177", "179", "180", "181", "184", "F04", "F05", "F06"] as const;
const examples = {
  "057": ReviewCarouselExample, "059": EventRegistrationExample, "108": TimeZoneExample,
  "110": ScheduleConflictExample, "126": MarkdownExample, "127": DiffReviewExample,
  "128": FindReplaceExample, "129": CodeFoldingExample, "176": VersionHistoryExample,
  "177": UndoHistoryExample, "179": TextAssemblyExample, "180": ApprovalWorkflowExample,
  "181": WorkAssignmentExample, "184": PermissionMatrixExample, F04: GeneratedReviewExample,
  F05: CollaborationExample,
};
export function CompositionExamples(props: FusionExampleProps) {
  if (props.id === "092" || props.id === "F06") return <SearchRecoveryExample key={`${props.id}-${props.locale}`} {...props} />;
  const Example = examples[props.id as keyof typeof examples];
  return Example ? <Example key={`${props.id}-${props.locale}`} {...props} /> : null;
}
