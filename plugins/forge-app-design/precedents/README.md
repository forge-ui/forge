# Example Project Precedents

This folder stores lightweight metadata extracted from already-written example
projects. It is not a source archive.

Use:

```bash
node plugins/forge-app-design/scripts/example-project-intake.mjs \
  --source /absolute/path/to/example \
  --id restaurant-merchant-admin \
  --domain restaurant-operations
```

Add `--screenshots a.png,b.png --copy-screenshots` when screenshots should be
copied into the precedent artifact.

Forge App Design should read `index.json` and the most relevant
`<id>/metadata.json` before a fresh run, then combine the precedent with
`references/component-registry.json`, page patterns, and the current user PRD.

Canonical starter precedent:

- Source: `/Users/hesong/Desktop/forge-starter-canonical`
- Artifact: `forge-starter-canonical/metadata.json`
- Purpose: clean starter baseline for future fresh-run verification after
  `@forge-ui-official/core` publishes.
