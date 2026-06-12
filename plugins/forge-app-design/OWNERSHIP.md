# forge-app-design Ownership

`forge-app-design` is the repo-owned source for the Forge App Design plugin.
It replaces the old standalone `spec-to-forge-app` skill shape.

## Source Of Truth

Use the checked-out plugin directory as the source of truth:

```text
plugins/forge-app-design
```

The old `spec-to-forge-app` source and installed skill were removed after
migration. Do not recreate or sync that standalone skill shape.

## Runtime Model

This plugin owns:

- PRD to Forge admin prototype workflow
- Page Intent Specs and design brief rules
- Product Design handoff acceptance and rejection rules
- IA and page-pattern artifacts
- ForgeUI context, visual guardrails, and component-boundary review
- scaffold generation
- samples and golden app references
- quality/product/visual/browser validation scripts
- review packet generation
- pattern promotion and ForgeUI gap curation

Runtime handoffs must follow `HANDOFF.md`:

- Product Design owns early brief, IA, visual direction, Page Intent Specs,
  page content, interaction exploration, and business layout choices.
- `forge-app-design` takes over only after the brief and IA are complete, or
  provides ForgeUI context/guardrail review before Product Design starts.
- `forge-app-design` returns runnable ForgeUI app evidence, not Product Design
  source edits.

Forge is the component library/design system consumed by the plugin. It is not a
separate execution layer.

## Artifact Boundary

`tmp/forge-app-design-output/**` is disposable fresh-run output. It must not be
committed as a fixture or golden app. `golden-apps/` is the durable promotion
surface and should contain only notes, compact summary JSON, and a small number
of representative screenshots.

## Deprecated Flow

Do not use the old `sync-installed.mjs` workflow for this plugin. Runtime
distribution should be handled through plugin installation/marketplace flow.

For local plugin development only, use the plugin-owned cache sync checker:

```bash
node plugins/forge-app-design/scripts/sync-plugin-cache.mjs --check
```

This validates the repo source against:

```text
$CODEX_HOME/plugins/cache/plugins-cli/forge-app-design/<version>
```

Only run the same command with `--apply` when explicitly refreshing that local
plugin cache. It does not replace, sync, or revive
`~/.agents/skills/spec-to-forge-app`.

## Validation

Before handoff, run:

```bash
FORGE_APP_DESIGN_ROOT=plugins/forge-app-design
python3 ~/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py "$FORGE_APP_DESIGN_ROOT"
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py "$FORGE_APP_DESIGN_ROOT/skills/index"
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py "$FORGE_APP_DESIGN_ROOT/skills/build-forge-app"
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py "$FORGE_APP_DESIGN_ROOT/skills/forge-design-handoff"
node "$FORGE_APP_DESIGN_ROOT/eval/ia-artifact-validate.mjs"
node "$FORGE_APP_DESIGN_ROOT/eval/kanban-pattern-audit.mjs"
node "$FORGE_APP_DESIGN_ROOT/eval/golden-summary-validate.mjs"
node "$FORGE_APP_DESIGN_ROOT/eval/run-regression.mjs" --skip-build
node "$FORGE_APP_DESIGN_ROOT/scripts/sync-plugin-cache.mjs" --check
```

Release and installation details live in `PLUGIN-RELEASE.md`.
