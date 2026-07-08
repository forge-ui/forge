export type RiskState = "Healthy" | "Watchlisted" | "Blocked" | "Recovering";

export type Incident = {
  id: string;
  title: string;
  owner: string;
  state: RiskState;
  impact: string;
  nextAction: string;
  evidence: string;
};

export type WorkflowRun = {
  id: string;
  name: string;
  stage: "Draft" | "Active" | "Failed" | "Retrying";
  owner: string;
  nextAction: string;
  rootCause: string;
  progress: number;
};

export type SupportTicket = {
  id: string;
  customer: string;
  priority: "High" | "Medium" | "Low";
  sla: string;
  stage: "New" | "Assigned" | "Waiting" | "Resolved";
  relatedRun: string;
};

export const basePath = "/fresh-prd-ai-workflow-support-ops-001";

export const incidents: Incident[] = [
  {
    id: "INC-2407",
    title: "Provider fallback gap on claims triage",
    owner: "Mina Chen",
    state: "Blocked",
    impact: "18 high-priority support tickets delayed",
    nextAction: "Open recovery action",
    evidence: "Higress provider risk, Activepieces run failure, DataEase freshness lag",
  },
  {
    id: "INC-2411",
    title: "Retrieval citation drift after dataset sync",
    owner: "Owen Park",
    state: "Watchlisted",
    impact: "7 agent replies need citation review",
    nextAction: "Refresh evidence packet",
    evidence: "Datasource freshness, RAG retrieval score, audit history",
  },
  {
    id: "INC-2414",
    title: "SLA queue spike in enterprise support",
    owner: "Lina Roy",
    state: "Recovering",
    impact: "4 accounts near breach",
    nextAction: "Advance support triage",
    evidence: "Helpdesk SLA stage, workflow retry history, customer comments",
  },
];

export const workflowRuns: WorkflowRun[] = [
  {
    id: "RUN-8124",
    name: "Claims evidence enrichment",
    stage: "Failed",
    owner: "Mina Chen",
    nextAction: "Retry with fallback provider",
    rootCause: "LLM provider quota and stale datasource snapshot",
    progress: 62,
  },
  {
    id: "RUN-8125",
    name: "Support ticket classifier",
    stage: "Retrying",
    owner: "Owen Park",
    nextAction: "Inspect tool call log",
    rootCause: "Tool schema mismatch in routing branch",
    progress: 78,
  },
  {
    id: "RUN-8126",
    name: "SLA breach prevention",
    stage: "Active",
    owner: "Lina Roy",
    nextAction: "Watch next queue checkpoint",
    rootCause: "No active exception",
    progress: 86,
  },
  {
    id: "RUN-8127",
    name: "Evidence packet export",
    stage: "Draft",
    owner: "Theo Singh",
    nextAction: "Publish guarded draft",
    rootCause: "Pending approver confirmation",
    progress: 35,
  },
];

export const supportTickets: SupportTicket[] = [
  { id: "SUP-1048", customer: "Northstar Health", priority: "High", sla: "42m left", stage: "Assigned", relatedRun: "RUN-8124" },
  { id: "SUP-1051", customer: "Brightline Ops", priority: "High", sla: "1h 12m left", stage: "Waiting", relatedRun: "RUN-8125" },
  { id: "SUP-1057", customer: "Atlas Supply", priority: "Medium", sla: "3h 05m left", stage: "New", relatedRun: "RUN-8126" },
  { id: "SUP-1060", customer: "Helio Cloud", priority: "Low", sla: "8h 20m left", stage: "Resolved", relatedRun: "RUN-8127" },
];

export const evidenceItems = [
  { id: "EV-88", source: "Provider route log", freshness: "2m ago", state: "Ready", owner: "Gateway" },
  { id: "EV-91", source: "Datasource sync task", freshness: "17m ago", state: "Lagging", owner: "BI" },
  { id: "EV-93", source: "Support comments", freshness: "4m ago", state: "Ready", owner: "Support" },
  { id: "EV-95", source: "Workflow run history", freshness: "1m ago", state: "Ready", owner: "Automation" },
];
