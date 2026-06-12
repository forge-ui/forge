# Migration From spec-to-forge-app

`forge-app-design` absorbs the useful capabilities from the old
`spec-to-forge-app` skill into a proper Codex plugin.

## Migrated

- `scaffold.mjs`
- `eval/`
  - quality eval
  - browser validation
  - product-quality audit
  - Protask visual audit
  - IA artifact validation
  - regression and repair-loop harnesses
- `samples/`
  - page implementation samples
  - IA artifacts
  - page-pattern artifacts
- `schemas/`
- `golden-apps/`
- design and roadmap references
  - `PRODUCT-DESIGN-CONTEXT.md`
  - `CODEX-PROTOTYPE-DESIGN-ROADMAP.md`
  - `FORGEUI-GAPS.md`
  - `REVIEW-PACKET-CHECKLIST.md`
  - `IMPECCABLE-ADAPTER.md`
- support scripts
  - `scripts/render-review-packet.mjs`
  - `scripts/repo-intake.mjs`
  - `scripts/sync-plugin-cache.mjs`
- plugin release model
  - `PLUGIN-RELEASE.md`

## Intentionally Not Migrated

- `scripts/sync-installed.mjs`

The old sync script exists to copy a standalone skill into
`~/.agents/skills/spec-to-forge-app`. A plugin should be distributed through
the plugin installation/marketplace flow, not by syncing a skill runtime folder.

The plugin has its own local development checker:

```bash
node plugins/forge-app-design/scripts/sync-plugin-cache.mjs --check
```

This compares the repo plugin source against the local Codex plugin cache. It is
not a `spec-to-forge-app` skill sync replacement and should not write to
`~/.agents/skills/spec-to-forge-app`.

## Target Runtime Boundary

The final architecture is:

```text
Product Design plugin, optional upstream visual exploration
        ↓
forge-app-design plugin
        ↓
Forge component library
```

There is no long-term `spec-to-forge-app` middle layer.

## Removed Historical Source

The old repo source and installed skill for `spec-to-forge-app` were removed
after this migration. New PRD-to-Forge prototype work must route to
`forge-app-design:build-forge-app`.

## P0 Validation

`forge-app-design` was installed, visible in a fresh `codex exec`, and exercised
with `tmp/forge-app-design-output/vendor-compliance-typography-fresh`.

Final gate result:

- `quality-eval`: `0 critical / 0 warn / 51 passed`
- `browser-validate`: 4/4 routes with screenshots
- `product-quality-audit`: `96/100`, `briefSpecs=4`
- `protask-visual-audit`: `100/100`
- `next build`: pass
