---
name: forge-design-handoff
description: "Create a Forge Design Handoff for build-forge-app from a PRD, visual direction, existing Product Design output, or Forge admin prototype plan."
---

# Forge Design Handoff

Use this skill after the product/design direction is clear and before ForgeUI implementation starts.

This skill is the bridge between Product Design and Forge App Design. Product Design may create the product goal, IA, visual direction, and Page Intent Specs; this skill normalizes those outputs into a Forge-ready handoff. It must not implement the final Forge app.

## Stage Contract

- Upstream Product Design owns: product goal, users, workflow, visual direction, Page Intent Specs, and first-viewport priorities.
- This handoff owns: translating that design intent into Forge route roles, promoted patterns, ForgeUI component expectations, state requirements, and acceptance evidence.
- Downstream `build-forge-app` owns: scaffold, code, mock data, screenshots, audits, and build.
- If Product Design output is missing, create only a minimal Forge-generated handoff when the user explicitly asks to skip design.

## Output

Create a `FORGE-DESIGN-HANDOFF.md` or equivalent section in the working app brief with:

- source stage (`Product Design`, `Forge-generated brief`, or `User-provided handoff`)
- product summary
- target users
- operational workflow
- route map
- Page Intent Specs
- visual direction
- promoted pattern choices
- ForgeUI component expectations
- data model and sample data needs
- interaction states
- acceptance gates

Use `../../references/forge-design-handoff.md` as the contract.

## Handoff Requirements

Every route must include:

- route path
- route role
- user goal
- primary decision
- primary action
- secondary context
- component plan
- screenshot evidence required for acceptance

Every prototype must include:

- at least one primary workflow path
- at least one state transition or action feedback surface
- realistic business data
- route-to-route closure
- explicit non-goals to avoid overbuilding

## Next Step

After writing the handoff, invoke `build-forge-app` to scaffold/build the app and run the final validation chain.
