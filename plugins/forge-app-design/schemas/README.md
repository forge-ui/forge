# forge-app-design Artifact Schemas

This directory defines the local artifacts used before code generation.

## Files

- `ia-artifact.schema.json`: system information architecture. It answers:
  what pages exist, which lifecycle each page belongs to, and where users move
  next.
- `page-pattern-artifact.schema.json`: per-page product density. It answers:
  what decision the page helps with, which data objects matter, which controls
  and states should exist, and which ForgeUI components are expected.

## Runtime Policy

External tools such as DeepWiki are intake aids only. Generated apps must read
local artifacts, not call external wiki or graph services at generation time.

## Minimal Pipeline

```text
PRD
  -> entity and field extraction
  -> field-component-rules-lite.md
  -> block-catalog-lite.json
  -> IA-ROUTE-MAP.json
  -> PAGE-PATTERN-MATCH.json
  -> DESIGN-BRIEF.md
  -> ForgeUI Next.js app
```

`quality-eval --strict-ia` validates the generated IA route map before delivery.

## First-Version Lite Assets

- `references/design-dna-lite.md`: visual DNA and density rules.
- `references/component-registry.json`: ForgeUI component semantics.
- `references/field-component-rules-lite.md`: field-to-component mapping.
- `references/block-catalog-lite.json`: page block selection before JSX.
