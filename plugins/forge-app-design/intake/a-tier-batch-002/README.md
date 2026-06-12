# A-tier Repo Intake Batch 002

Generated: 2026-06-09

Policy:

- No full clone.
- No package install.
- No local dev server.
- Keep artifact-level IA, page pattern, workflow, and ForgeUI gap only.
- Delete any temporary probe material after artifact writing.

GitHub public repository pages were checked on 2026-06-09. GitHub API stars
and `pushed_at` were not recorded because the public API was rate-limited in
this environment; this batch intentionally avoids stale numeric metadata.

## Repos

| Repo | Category | Public Source | Artifact |
|---|---|---|---|
| posthog/posthog | control-tower | https://github.com/PostHog/posthog | `posthog-posthog.md` |
| getsentry/sentry | split-pane triage | https://github.com/getsentry/sentry | `getsentry-sentry.md` |
| grafana/grafana | observability control tower | https://github.com/grafana/grafana | `grafana-grafana.md` |
| metabase/metabase | analytics explorer | https://github.com/metabase/metabase | `metabase-metabase.md` |
| apache/superset | analytics workspace | https://github.com/apache/superset | `apache-superset.md` |
| nocodb/nocodb | data grid workflow | https://github.com/nocodb/nocodb | `nocodb-nocodb.md` |

## Batch-Level Borrow

- Product dashboards need a clear product area switcher: analytics, events,
  flags, surveys, errors, data, and workflow entry are separate intents.
- Observability products prove detail pages need evidence-first split panes:
  timeline, stack/log evidence, affected entity, owner, and resolution action.
- BI/data tools need query/explore workflows with stateful filters, results,
  saved views, and chart/table toggles instead of one static dashboard.
- Spreadsheet-like admin products need dense grid operations, field types,
  relational context, and safe edit feedback.

## Batch-Level ForgeUI Gaps

- Query/explore builder shell with filter clauses, preview table, and saved
  view actions.
- Observability detail primitives for event timeline, stack trace/log payload,
  and related incidents.
- Dense editable data grid patterns with field-type headers and relational
  cell affordances.
- Dashboard variable/filter bar patterns for multi-source analytics pages.

## Batch-Level Reject

- Do not copy product-specific editors wholesale into Forge prototypes.
- Do not treat graph builders, SQL editors, or no-code bases as required for
  ordinary admin PRDs.
- Do not replace Forge typography, radius, or density tokens with OSS project
  house styles.
