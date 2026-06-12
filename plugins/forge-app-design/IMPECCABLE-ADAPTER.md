# Impeccable to Forge Adapter

This note records how `pbakaus/impeccable` was analyzed and adapted into
`forge-app-design`. It is not a vendored copy of Impeccable.

## Source Audited

Reference checkout:

- `tmp/references/impeccable`

Relevant source areas:

- `.agents/skills/impeccable/SKILL.md`
- `skill/SKILL.src.md`
- `skill/reference/shape.md`
- `skill/reference/product.md`
- `skill/reference/polish.md`
- `skill/reference/critique.md`
- `skill/scripts/command-metadata.json`
- `cli/engine/registry/antipatterns.mjs`
- `cli/engine/rules/checks.mjs`

## What Was Absorbed

### Design Before Code

Impeccable's `shape` command is mapped into `SKILL.md` Step 2.5:

- clarify user role, context, data ranges, scope, anti-goals
- write a structured product design brief before page code
- use concrete product references, not adjectives
- when the user asks for prototype design rather than immediate generation,
  pause after the brief and wait for confirmation

### Product UI Register

Forge admin surfaces use the Impeccable product register, not brand/landing
rules:

- familiar admin UI is acceptable when it improves trust and speed
- restrained color is the default
- standard affordances beat invented controls
- density and consistency are product virtues
- motion serves state feedback only

### ForgeUI-First Escape Hatch

Impeccable's design-system alignment rule is adapted into a stricter Forge
policy:

- use Forge primitives for Button, Table, Badge, Card, Form, Chart, Timeline,
  Avatar, File, and related controls
- custom page components must be route-local domain composition blocks
- missing primitives are recorded as ForgeUI gaps instead of hand-rolled in
  generated apps

### Automated Anti-Slop Checks

Low-cost detector concepts were adapted into `quality-eval` L1 rules:

- `gradient-text-in-app` is critical
- `decorative-side-accent` is warn
- `marketing-buzzword-copy` is warn
- `em-dash-copy` is warn
- `transition-all-in-app` is warn

These are product-admin tuned rules. They intentionally do not import the full
Impeccable detector.

## What Was Not Absorbed

- Full Impeccable CLI runtime and browser overlay detector.
- Brand/landing-specific bans such as "single font is bad"; product UI can use
  one familiar sans family.
- Hero-page visual rules; `forge-app-design` generates authenticated admin
  tools, not marketing pages.
- Heavy LLM critique orchestration. Forge keeps deterministic eval fast and
  uses browser/product audits separately when needed.

## Maintenance Rule

When importing more Impeccable ideas, first classify them as one of:

1. product-admin invariant
2. brand/landing-only rule
3. deterministic eval rule
4. browser/manual audit rule
5. Forge core gap

Only category 1 or 3 belongs directly in `SKILL.md` / `quality-eval`.
