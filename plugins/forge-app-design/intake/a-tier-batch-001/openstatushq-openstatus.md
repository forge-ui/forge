# openstatusHQ/openstatus

- url: https://github.com/openstatusHQ/openstatus
- stars: 8729
- pushed_at: 2026-06-04T06:34:19Z
- category: control-tower

## Evidence

- Public product: https://www.openstatus.dev
- Repo description: uptime monitoring and API monitoring as code.
- Relevant UI class: monitor dashboard, incidents, checks, status pages.

## IA Artifact

- Overview route prioritizes monitors by health, latency, and active incident.
- Monitor detail owns check history, regions, failure evidence, and incident link.
- Incident/action routes are parent-entered workflows.

## Page Pattern

- Control tower needs compact health grid plus active incident rail.
- Detail route should show timeline, recent checks, affected regions, and resolution action.
- Empty state should route to create monitor, not show static copy only.

## Business Workflow

- User sees degraded monitor, opens detail, checks evidence, opens/updates incident, and returns to overview.

## ForgeUI Gap

- Region/latency mini maps are not first-class Forge primitives.

## Borrow

- Health status grid with active incident rail.
- Monitor detail with evidence/history/action closure.
- Status/latency thresholds as visible decision criteria.

## Reject

- Do not copy public status-page presentation into internal admin UI.
- Do not make monitor cards read-only if incident action is required.
