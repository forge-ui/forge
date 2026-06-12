# Forge Design Handoff Contract

This contract connects Forge App Design planning to `build-forge-app` implementation with the Forge component library.

Use it as the artifact boundary between Product Design and Forge App Design:

- Product Design may author the product goal, users, IA, Page Intent Specs, visual direction, and first-viewport priorities.
- Forge App Design consumes those artifacts and implements with ForgeUI.
- Product Design should not write the final Forge code; Forge App Design should not reopen product strategy unless the user asks.

For the full runtime model, read
`references/product-design-forge-starter-chain.md`: Product Design owns product
and screen intent, Forge starter owns the clean consuming app, ForgeUI owns the
visual primitives, and `forge-app-design` owns Forge-specific context, audits,
and feedback into registry/DNA/pattern rules.

## Required Sections

### Source Stage

Declare where the handoff came from:

```yaml
source_stage: Product Design
source_artifacts:
  - PRODUCT-BRIEF.md
  - IA-ROUTE-MAP.json
  - PAGE-INTENT-SPECS.md
  - VISUAL-DIRECTION.md
handoff_policy: Forge App Design consumes this handoff and owns implementation, screenshots, audits, and build.
```

### Product Summary

- Product name
- Domain
- Operator role
- Primary job to be done
- Prototype depth

### Visual Direction

- Admin/product surface type, not a marketing page
- Density expectation for first viewport
- Typography scale and hierarchy
- Reference screenshots, Figma exports, or product examples
- Forbidden visual shortcuts

### Route Map

| Route | Role | Layout Pattern | Primary Action |
|---|---|---|---|
| `/` | dashboard | dashboard-control-tower-protask | Open priority work |

### Page Intent Specs

Each route must provide:

```json
{
  "route": "/exceptions",
  "page_role": "list",
  "user_goal": "Find the highest-risk exception to resolve next.",
  "primary_decision": "Which queue item needs action first?",
  "primary_action": "Assign, escalate, or open the exception.",
  "secondary_context": [
    "risk score",
    "owner",
    "SLA",
    "evidence freshness"
  ],
  "component_plan": [
    "compact filter toolbar",
    "inline summary strip",
    "dense queue table",
    "row action menu",
    "right insight rail"
  ],
  "first_viewport_priority": [
    "page title",
    "compact filters",
    "queue table header",
    "first 2-3 rows",
    "right insight context"
  ],
  "layout_pattern": "rich-entity-list-protask",
  "acceptance_evidence": [
    "desktop screenshot shows filters, summary, table header, and first rows in first viewport",
    "browser route passes",
    "product-quality route coverage includes this route"
  ]
}
```

Required Page Intent fields:

- `user_goal`
- `primary_decision`
- `primary_action`
- `secondary_context`
- `component_plan`
- `first_viewport_priority`
- `acceptance_evidence`

### ForgeUI Expectations

Name the expected Forge primitives and avoid generic custom shells when a Forge primitive exists.

Examples:

- `SurfaceCard`
- `TaskCard`
- `DataTable`
- `Label`
- `ProgressBar`
- `Button`
- `StyledLink`
- `Breadcrumbs`

### Adaptive Layout Expectations

Production-like Forge admin pages must keep component width parent-driven:

- card-family components fill their grid/flex column by default;
- do not use `width="fixed"`, `w-64`, `w-80`, or `w-96` on KPI, task,
  project, chart, progress, map, highlight, or context cards;
- use responsive parent tracks with `minmax`, `clamp`, `fr`, `%`, or
  container-driven constraints;
- list/detail/action rails collapse, move below, or wait until `2xl` when the
  main table/evidence/form surface would become cramped;
- first-viewport acceptance must prove the primary work surface remains
  readable after adding summary strips or rails.

### Validation Gates

The final Forge app cannot be handed off unless:

- quality eval has 0 critical and 0 warnings
- browser routes pass with screenshots
- product-quality audit passes with `briefSpecs > 0`
- visual audit passes for Protask-style admin targets
- build passes
- review packet exists
- adaptive-width checks pass: no production route relies on fixed card widths
  or fixed pixel grid tracks to make the layout appear aligned.
