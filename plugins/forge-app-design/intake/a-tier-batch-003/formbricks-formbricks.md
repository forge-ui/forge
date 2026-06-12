# formbricks/formbricks

- url: https://github.com/formbricks/formbricks
- category: feedback control tower
- metadata: public repo target selected on 2026-06-11; GitHub API numeric metadata returned 403.

## Evidence

- Public project category: surveys and user feedback.
- Relevant UI class: survey performance, response lists, segments, insights,
  targeting, and workflow actions.

## IA Artifact

- Dashboard route owns response trend, completion rate, segment risk, and
  priority survey/action entry.
- Response list owns filters, user/account identity, rating/NPS, segment,
  latest comment, owner, and follow-up action.
- Response detail owns evidence, sentiment/root cause, account impact, history,
  and follow-up workflow.

## Page Pattern

- Feedback dashboards should combine chart + priority response queue + activity.
- Response detail maps well to split-pane triage when feedback triggers a
  support/product action.
- Survey setup is an action/wizard flow with targeting and review rail.

## Business Workflow

- Operator reviews a negative response cluster, opens a response, checks
  segment/account impact, assigns follow-up, and records resolution.

## ForgeUI Gap

- Survey response sentiment/score cell and compact segment breakdown visual.

## Borrow

- Control tower dashboard tied to feedback actions.
- Response detail with evidence and impact.
- Targeting/setup as grouped action flow.

## Reject

- Do not copy survey builder/editor complexity into normal admin prototypes.
- Do not treat charts as decorative; they must route to response work.
