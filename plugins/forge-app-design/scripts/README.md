# Scripts

Use these scripts for Forge App Design support tasks:

- `render-review-packet.mjs`
- `repo-intake.mjs`
- `sync-plugin-cache.mjs`

Primary validation scripts live in `../eval/`.

The old `spec-to-forge-app` installed-skill sync flow is intentionally not part
of this plugin. Plugin installation should own runtime distribution.

For local development, `sync-plugin-cache.mjs` compares this repo-owned plugin
source with the local Codex plugin cache:

```bash
node plugins/forge-app-design/scripts/sync-plugin-cache.mjs --check
```

Use `--apply` only when intentionally refreshing the local plugin cache. The
script copies create/update changes only; it reports cache-only stale files but
does not delete them.
