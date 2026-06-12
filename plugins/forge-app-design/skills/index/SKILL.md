---
name: index
description: "Route Forge App Design requests. Use when the user wants Codex to generate or iterate Forge admin prototypes, consume a Product Design / Forge Design Handoff, convert Page Intent Specs into ForgeUI pages, choose Protask-style admin patterns, or run Forge app acceptance gates."
---

# Forge App Design

Forge App Design is a peer plugin to Product Design, not a fork of it. Use this plugin as the ForgeUI downstream and reviewer: provide ForgeUI context, consume a product/design handoff, implement the Forge admin prototype, validate it with screenshots and gates, and promote reusable patterns/gaps.

## Purpose

Use this plugin when the user asks for:

- Product Design / user handoff to Forge prototype
- ToB SaaS/admin console prototype design
- ForgeUI app generation planning
- Page Intent Spec, IA, or page pattern selection
- Protask-style management system design
- product-quality/browser/visual/build acceptance for a Forge app

## Core Boundary

This plugin owns the Forge app implementation and guardrail workflow:

- consuming product context
- consuming or producing Forge Design Handoff artifacts
- IA and route roles for Forge implementation
- Page Intent Specs for implemented routes
- page-pattern selection and review under ForgeUI constraints
- Forge Design Handoff
- ForgeUI context, component boundaries, and visual baseline guardrails
- scaffold and ForgeUI implementation workflow
- acceptance gates
- pattern/gap curation after validation

Forge itself is the component library/design system consumed by this plugin. There is no separate `spec-to-forge-app` layer in the target architecture.

Product Design is the preferred upstream when the user is still shaping the product, flow, visual direction, page content, or layout exploration. Forge App Design should not ask Product Design to write final Forge code, and it should not narrow Product Design's business-layout exploration into a single template. Product Design should hand off design intent; this plugin should constrain only ForgeUI usage, base visual quality, acceptance evidence, and reusable pattern promotion.

## Stage Routing

Use workspace artifacts and user intent to decide the active stage:

| Current state | Route to | Action |
|---|---|---|
| Only an early idea, broad PRD, or unclear product direction | Product Design | Use `get-context` / `ideate` to produce a design handoff. |
| Product Design needs ForgeUI context before designing | `forge-app-design:forge-design-handoff` or `PRODUCT-DESIGN-CONTEXT.md` | Provide component boundaries, visual baseline, and acceptance constraints only; do not prescribe a rigid page layout. |
| `FORGE-DESIGN-HANDOFF.md` or equivalent Page Intent Specs exist | `forge-app-design:build-forge-app` | Consume the handoff and build the ForgeUI app. |
| Runnable app, screenshots, or reports already exist | `forge-app-design` | Iterate, repair, audit, screenshot, and build. |
| User explicitly asks to rethink product direction | Product Design | Reopen design stage and refresh the handoff. |

Default rule: **no handoff means design first; handoff means Forge implementation/review; existing app means Forge iteration.** If the user explicitly asks to skip Product Design, create a minimal Forge-generated handoff before implementation and mark it as such.

## Workflow

1. Gather Product Context
   - Read the user's PRD, product notes, screenshots, Figma references, or existing app paths.
   - If the request has no clear target user, workflow, visual standard, or required prototype depth, ask only for the missing blocker.
   - Prefer saved Forge context when available in this plugin root:
     - `PRODUCT-DESIGN-CONTEXT.md`
     - `references/design-dna-lite.md`
     - `references/component-registry-lite.json`
     - `references/field-component-rules-lite.md`
     - `references/block-catalog-lite.json`
     - `FORGEUI-GAPS.md`
     - `CODEX-PROTOTYPE-DESIGN-ROADMAP.md`

2. Choose The Route
   - If the user has only a PRD or broad product description and no handoff, route to Product Design first unless they explicitly asked to skip design.
   - If Product Design already produced `FORGE-DESIGN-HANDOFF.md`, `DESIGN-BRIEF.md`, `IA-ROUTE-MAP.json`, or equivalent Page Intent Specs, continue here and build.
   - If the user needs broad visual exploration with no chosen visual direction, use Product Design `get-context` and `ideate`, then return to this plugin after the user chooses a direction.
   - If the user provides a URL/image/Figma and asks for faithful visual cloning, Product Design is the better first stage. Return here only when the target is a Forge admin prototype.

3. Produce Page Intent Specs
   - Every implemented route must have one Page Intent Spec.
   - Each spec must include:
     - `route`
     - `page_role`
     - `user_goal`
     - `primary_decision`
     - `primary_action`
     - `secondary_context`
     - `component_plan`
     - `layout_pattern`
     - `acceptance_evidence`

4. Select Forge Patterns
   - Use promoted patterns first:
     - `dashboard-control-tower-protask`
     - `rich-entity-list-protask`
     - `split-pane-triage-protask`
     - `kanban-workflow-protask`
   - Read `../../references/design-dna-lite.md`, `../../references/component-registry-lite.json`, `../../references/field-component-rules-lite.md`, and `../../references/block-catalog-lite.json` before implementing Protask-style admin pages.
   - Read `../../references/protask-forge-visual-baseline.md` before implementing Protask-style admin pages.
   - Do not apply one generic PageHeader + Filter + Card + Table template to every route.
   - Match page role:
     - dashboard: control tower, trends, risks, priority tasks, activity, entry points
     - list: queue density, filters, first-screen rows, row actions, owner/risk/evidence
     - detail: evidence, status, root cause, impact, history, resolution, audit trail
     - action: grouped form, right context, save/pending/error/success feedback
     - workflow: lanes, card actions, progress, diagnostic links, empty states
   - Encode visual baseline decisions in `PAGE-PATTERN-MATCH.json`: typography, density, spacing, borders, profile region, table first viewport, and right rail. Do not rely on ForgeUI component presence alone.

5. Write Forge Design Handoff
   - Use `../../references/forge-design-handoff.md`.
   - The handoff must be specific enough for `forge-app-design` to build without inventing the product structure.

6. Build With ForgeUI
   - Invoke `build-forge-app` after the handoff is ready.
   - The implementation must satisfy:
     - `quality-eval`: 0 critical / 0 warn
     - `browser-validate`: routes and screenshots pass
     - `protask-visual-audit`: pass when Protask/Forge admin quality is expected
     - `product-quality-audit`: pass, with `briefSpecs > 0` and route coverage
     - `next build`: pass
     - review packet created for handoff

## Hard Rules

- Do not declare a Forge prototype complete from visual/browser/build checks alone.
- `DESIGN-BRIEF.md` must include Page Intent Specs before implementation is considered done.
- Do not treat a supporting workflow route as a promoted kanban/workflow pattern unless it has independent fresh PRD screenshot acceptance.
- Do not edit curated Product Design plugin files as part of this workflow.
- Do not route through the deprecated `spec-to-forge-app` workflow; it was removed after migration.
- Do not commit, stage, or publish plugin changes unless the user explicitly asks.
