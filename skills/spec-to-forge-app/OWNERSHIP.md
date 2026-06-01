# spec-to-forge-app Ownership

## Current State

`spec-to-forge-app` is currently installed and executed from:

```text
/Users/hesong/.agents/skills/spec-to-forge-app
```

That location is valid for Claude/Codex runtime loading, but it is not a good
long-term source of truth. The skill now contains implementation code, eval
harnesses, browser validation, pattern packs, golden mini-app notes, and goal
completion checks. Those artifacts evolve with Forge core and should be
versioned with this repository.

As of the current migration pass, the repo-owned source is only a migration
boundary. A dry-run from the installed runtime plans 121 files:

```bash
node skills/spec-to-forge-app/scripts/sync-installed.mjs --from-installed
```

Do not run repo-to-installed sync until the repo source contains the bootstrap
markers checked by `scripts/sync-installed.mjs`: `SKILL.md`, `scaffold.mjs`,
`eval/quality-eval.mjs`, and `samples/kanban-status-workflow/page.tsx`.

## Target State

Forge repository owns the source:

```text
/Users/hesong/Documents/gihub_space/forge/skills/spec-to-forge-app
```

The runtime install directory remains a generated/synced copy:

```text
/Users/hesong/.agents/skills/spec-to-forge-app
```

## Migration Rules

1. Do not manually move or delete the installed skill directory.
2. Do not make `~/.agents/skills/spec-to-forge-app` the only place where
   long-term fixes live.
3. Add a repo-side install/sync script before switching the source of truth.
4. Parameterize path-sensitive eval code before copying it into the repo.
5. After migration, run the full gate:

```bash
node ~/.agents/skills/spec-to-forge-app/eval/quality-eval.mjs --target /Users/hesong/Desktop/output/prior-auth-ops-c12-protask
node ~/.agents/skills/spec-to-forge-app/eval/run-regression.mjs
node ~/.agents/skills/spec-to-forge-app/eval/browser-validate.mjs
node ~/.agents/skills/spec-to-forge-app/eval/goal-completion-check.mjs
```

## Known Path Coupling

- `SKILL.md` points to the installed `scaffold.mjs`, `samples`, `golden-apps`,
  and `eval` paths.
- `eval/goal-completion-check.mjs` hardcodes the installed samples/golden dirs
  and the C12 output path.
- `eval/goal-completion-check.mjs` writes reports next to itself. In sandboxed
  Codex runs, direct `node` may fail with `EPERM` unless the command runs with a
  permitted Node prefix or the script is later parameterized with a report dir.
- `eval/regression-cases.json` and `eval/browser-cases.json` hardcode current
  Desktop output fixtures.
- Reports and screenshots are generated into the installed eval directory.
- Forge repo ignores `.agents/`, so repo-owned `spec-to-forge-app` source must
  live under tracked `skills/`, not `.agents/`.

## Recommended Next Step

Use the repo-side sync script as the migration boundary:

```bash
pnpm skill:spec-to-forge:sync -- --from-installed
pnpm skill:spec-to-forge:sync -- --from-installed --check
pnpm skill:spec-to-forge:sync -- --from-installed --apply
pnpm skill:spec-to-forge:sync -- --to-installed --apply
```

The script is dry-run by default. `--check` exits non-zero when drift exists,
which makes it usable in CI or local gates. It excludes generated reports,
screenshots, `.next`, `node_modules`, `.serena`, and `dist`.

After the repo source has been bootstrapped, replace hardcoded skill home paths
in scripts with a derived `skillRoot` or `SPEC_TO_FORGE_SKILL_HOME`.
