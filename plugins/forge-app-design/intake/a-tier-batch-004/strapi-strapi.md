# strapi/strapi

- url: https://github.com/strapi/strapi
- category: content/admin operations
- metadata: public repo target selected on 2026-06-12; no clone/install.

## Evidence

- Public project category: headless CMS and admin panel.
- Relevant UI class: content manager, media library, roles/permissions,
  publishing, review, and configuration.

## IA Artifact

- Dashboard routes summarize draft/review/published state, content operations,
  media issues, and permission changes.
- List routes own content entries, media assets, roles, and review queues.
- Detail routes need entry identity, content sections, locale/state, relations,
  revision/activity, and publish/review action.
- Action routes own create/edit/publish forms with grouped fields and right
  preflight context.

## Page Pattern

- `rich-entity-list-protask` for content entries and media queues.
- `split-pane-triage-protask` for review/publish decisions.
- `action-form-protask` for grouped content creation and settings updates.

## Business Workflow

An editor filters entries needing review, opens the entry, checks required
fields, media, localization, relations, and revision trail, then approves,
publishes, or returns it for changes.

## ForgeUI Gap

- Content publish preflight rail: required fields, media status, locale status,
  relation impact, and reviewer.

## Borrow

- Draft/review/publish state as the primary list and detail axis.
- Media and localization context visible near the publish decision.

## Reject

- Do not turn the prototype into a CMS schema studio unless the PRD asks for it.
- Do not hide publish blockers below the first viewport.
