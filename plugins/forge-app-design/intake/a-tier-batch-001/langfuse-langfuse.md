# langfuse/langfuse

- url: https://github.com/langfuse/langfuse
- stars: 28471
- pushed_at: 2026-06-04T03:41:35Z
- category: control-tower

## Evidence

- Public product/docs: https://langfuse.com/docs
- Repo description: LLM observability, metrics, evals, prompts, datasets.
- Relevant UI class: trace monitoring, evaluation dashboards, detail inspection.

## IA Artifact

- Dashboard summarizes health, latency/cost/quality, and active failures.
- Trace/eval list routes own filtering and drilldown.
- Trace detail route owns evidence, spans, metadata, and replay/evaluation actions.

## Page Pattern

- Control tower should combine KPIs, trends, recent failures, and direct drilldown.
- Detail should be evidence-first: timeline/span tree, input/output, scores, metadata.
- Activity and audit should be adjacent to the trace decision.

## Business Workflow

- User notices quality/cost anomaly, opens trace list, inspects detail, and starts replay or evaluation workflow.

## ForgeUI Gap

- Need richer nested timeline/span visualization; current workaround is `HistoryItem`, `DataTable`, and compact evidence panels.

## Borrow

- Observability dashboard density: metric, trend, recent failure, drilldown.
- Trace detail as split evidence workspace.
- Evaluation action closure from detail.

## Reject

- Do not copy domain-specific LLM terminology into non-LLM PRDs.
- Do not hand-roll charts when Forge chart/stat components cover the signal.
