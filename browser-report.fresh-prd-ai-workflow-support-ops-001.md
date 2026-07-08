# Browser Validation Report

- Generated: 2026-07-08T09:01:58.629Z
- Summary: 1/1 passed, 0 skipped
- Mode: low-load, one app + one server + one or more viewport screenshots per case
- Report dir: `.`
- Screenshots dir: `./public/images/showcase/fresh-prd-ai-workflow-support-ops-001`
- Scope: focused case run; canonical `browser-report.json` is only updated by full runs

## [OK] fresh-prd-ai-workflow-support-ops-001

- Label: Fresh PRD AI workflow support operations console
- Target: `.`
- Routes:
  - `/fresh-prd-ai-workflow-support-ops-001/operations`: pass; status=200; h1=AI workflow support control tower
    - Screenshot: `./public/images/showcase/fresh-prd-ai-workflow-support-ops-001/fresh-prd-ai-workflow-support-ops-001-operations.png`
    - Stylesheets: OK /_next/static/chunks/0xr8u_5k.hzdp.css (200, 3190 bytes), OK /_next/static/chunks/092sk_jf7aafm.css (200, 108273 bytes)
  - `/fresh-prd-ai-workflow-support-ops-001/workflows`: pass; status=200; h1=Workflow recovery board
    - Screenshot: `./public/images/showcase/fresh-prd-ai-workflow-support-ops-001/fresh-prd-ai-workflow-support-ops-001-workflows.png`
    - Stylesheets: OK /_next/static/chunks/0xr8u_5k.hzdp.css (200, 3190 bytes), OK /_next/static/chunks/092sk_jf7aafm.css (200, 108273 bytes)
  - `/fresh-prd-ai-workflow-support-ops-001/workflows/RUN-8124`: pass; status=200; h1=Workflow run detail RUN-8124
    - Screenshot: `./public/images/showcase/fresh-prd-ai-workflow-support-ops-001/fresh-prd-ai-workflow-support-ops-001-workflow-detail.png`
    - Stylesheets: OK /_next/static/chunks/0xr8u_5k.hzdp.css (200, 3190 bytes), OK /_next/static/chunks/092sk_jf7aafm.css (200, 108273 bytes)
  - `/fresh-prd-ai-workflow-support-ops-001/support`: pass; status=200; h1=Support triage queue
    - Screenshot: `./public/images/showcase/fresh-prd-ai-workflow-support-ops-001/fresh-prd-ai-workflow-support-ops-001-support.png`
    - Stylesheets: OK /_next/static/chunks/0xr8u_5k.hzdp.css (200, 3190 bytes), OK /_next/static/chunks/092sk_jf7aafm.css (200, 108273 bytes)
  - `/fresh-prd-ai-workflow-support-ops-001/evidence`: pass; status=200; h1=Evidence command center
    - Screenshot: `./public/images/showcase/fresh-prd-ai-workflow-support-ops-001/fresh-prd-ai-workflow-support-ops-001-evidence.png`
    - Stylesheets: OK /_next/static/chunks/0xr8u_5k.hzdp.css (200, 3190 bytes), OK /_next/static/chunks/092sk_jf7aafm.css (200, 108273 bytes)
  - `/fresh-prd-ai-workflow-support-ops-001/recovery/new`: pass; status=200; h1=Create recovery action
    - Screenshot: `./public/images/showcase/fresh-prd-ai-workflow-support-ops-001/fresh-prd-ai-workflow-support-ops-001-recovery.png`
    - Stylesheets: OK /_next/static/chunks/0xr8u_5k.hzdp.css (200, 3190 bytes), OK /_next/static/chunks/092sk_jf7aafm.css (200, 108273 bytes)

## Re-run

```bash
node $FORGE_APP_DESIGN_ROOT/eval/browser-validate.mjs
node $FORGE_APP_DESIGN_ROOT/eval/browser-validate.mjs --case C8
node $FORGE_APP_DESIGN_ROOT/eval/browser-validate.mjs --report-dir /private/tmp/spec-to-forge-browser-report --screenshots-dir /private/tmp/spec-to-forge-browser-shots
```
