# System Brief Contract

Use this contract before writing code for any admin system, platform, back-office, management console, or multi-module product.

The brief must be short enough to fit in one screen. Its job is to force business understanding before UI composition.

## Required Output

```yaml
domain: ""
archetype: "commerce-ops | project-ops | crm | approval | data-ops | support | finance | files | governance | custom"
primary_users:
  - role: ""
    jobs: []
business_goal: ""
nav_groups:
  - label: ""
    modules: []
modules:
  - name: ""
    type: "core | support | governance"
    primary_object: ""
workbench:
  kpis:
    - label: ""
      target_route: ""
  queues:
    - label: ""
      target_route: ""
  recent_activity: true
operational_loops:
  - "queue -> detail -> action -> feedback"
cross_links:
  - "object -> related object"
governance:
  permissions: true
  audit: true
  settings: true
  import_export: false
  job_center: false
out_of_scope: []
closest_forge_references: []
```

## Quality Bar

- `archetype` must be selected before choosing templates or components.
- `modules` must include at least one core module and one support or governance module.
- Every KPI or queue in `workbench` must point to a list, detail, or workflow route.
- `operational_loops` must describe actual work, not page sections.
- `cross_links` must make the product feel connected, such as customer -> orders -> invoices.
- If the user asks for only one screen, still describe the broader system and then state which slice will be implemented first.

