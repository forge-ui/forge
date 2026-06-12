# posthog/posthog

- url: https://github.com/PostHog/posthog
- category: control-tower
- metadata: public repo page reviewed on 2026-06-09; GitHub API numeric metadata was rate-limited.

## Evidence

- Public repo page describes an all-in-one product platform spanning analytics,
  session replay, error tracking, feature flags, experiments, surveys, data
  warehouse, CDP, and an AI assistant.
- Relevant UI class: product analytics control tower with multiple workflow
  entry points and cross-product object navigation.

## IA Artifact

- Product area switcher: analytics, replays, flags, experiments, surveys,
  errors, data, and assistant.
- Dashboard route owns product health, recent activity, and high-priority
  product signals.
- Detail routes own event/person/session evidence and next action.

## Page Pattern

- Control tower should combine KPI trend, funnel/cohort insight, session/error
  evidence, and direct entry into flag or experiment workflows.
- Filters should be compact and persistent; query controls should not push the
  result table or chart below the first viewport.
- Cross-product dashboards need a right rail or inline strip for recent events
  and pending product decisions.

## Business Workflow

- Product operator sees a metric movement, opens session/event evidence, checks
  affected users, then creates a flag, experiment, or follow-up investigation.

## ForgeUI Gap

- Product analytics query/filter builder with saved views and event/person
  property clauses.
- Session replay/evidence preview primitive for a detail rail.

## Borrow

- Dashboard as a navigation control tower, not four KPI cards.
- Event/session/person evidence path from dashboard to detail.
- Product workflow entry points embedded near the signal.

## Reject

- Do not require every admin prototype to support full analytics query syntax.
- Do not import PostHog visual branding or playful product chrome into Forge.
