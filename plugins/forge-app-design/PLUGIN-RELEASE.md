# Forge App Design Plugin Release Model

This plugin is developed from repo source and installed through the Codex plugin
cache. It must not be redistributed as the deprecated standalone
`spec-to-forge-app` skill.

## Source Of Truth

```text
plugins/forge-app-design
```

Required source files:

- `.codex-plugin/plugin.json`
- `skills/index/SKILL.md`
- `skills/build-forge-app/SKILL.md`
- `skills/forge-design-handoff/SKILL.md`
- `scaffold.mjs`
- `eval/`
- `samples/`
- `golden-apps/`
- `scripts/`

## Version And Cache Path

The cache path is derived from the plugin manifest:

```text
$CODEX_HOME/plugins/cache/plugins-cli/<name>/<version>
```

For the current manifest:

```text
$CODEX_HOME/plugins/cache/plugins-cli/forge-app-design/0.1.0
```

When changing `.codex-plugin/plugin.json` version, the cache sync target changes
with it. Do not manually copy to an old version directory.

## Local Sync

Dry-run:

```bash
node plugins/forge-app-design/scripts/sync-plugin-cache.mjs
```

CI-style check:

```bash
node plugins/forge-app-design/scripts/sync-plugin-cache.mjs --check
```

Apply to the local Codex plugin cache:

```bash
node plugins/forge-app-design/scripts/sync-plugin-cache.mjs --apply
```

The sync script excludes generated reports, screenshots, `node_modules`, build
outputs, and `.serena/`. It reports stale cache-only files but does not delete
them. Stale files should be reviewed manually before removal.

## Validation Before Handoff

Run source validation:

```bash
python3 ~/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/forge-app-design
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/forge-app-design/skills/index
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/forge-app-design/skills/build-forge-app
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/forge-app-design/skills/forge-design-handoff
node plugins/forge-app-design/eval/ia-artifact-validate.mjs
node plugins/forge-app-design/eval/kanban-pattern-audit.mjs
node plugins/forge-app-design/eval/run-regression.mjs --skip-build
node plugins/forge-app-design/scripts/sync-plugin-cache.mjs --check
```

After applying sync, run runtime checks from the installed cache:

```bash
node ~/.codex/plugins/cache/plugins-cli/forge-app-design/0.1.0/eval/kanban-pattern-audit.mjs
node ~/.codex/plugins/cache/plugins-cli/forge-app-design/0.1.0/eval/run-regression.mjs --skip-build
```

## Fresh Runtime Smoke

At least one fresh PRD should validate from the installed cache before declaring
the plugin ready:

- `quality-eval`: 0 critical / 0 warn
- `browser-validate`: route and screenshot evidence pass
- `product-quality-audit`: pass with `briefSpecs > 0` and route coverage
- `protask-visual-audit`: pass
- `next build`: pass

## Deprecated Runtime

Do not recreate:

```text
skills/spec-to-forge-app
~/.agents/skills/spec-to-forge-app
scripts/sync-installed.mjs
```

The final architecture is:

```text
Product Design plugin or user PRD
        ↓
forge-app-design plugin
        ↓
Forge component library
```
