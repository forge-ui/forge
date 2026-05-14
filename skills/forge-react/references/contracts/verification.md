# Admin System Verification

Use this before claiming an admin system or module is complete.

## Product Checks

- [ ] The sidebar reflects real business domains, not placeholder menu labels.
- [ ] The workbench/dashboard links to queues, lists, or detail pages.
- [ ] Each core module has list, detail, create/edit, and delete/archive confirmation or an explicit reason it does not.
- [ ] Row actions change by object state.
- [ ] Detail surfaces include related records, activity, files, comments, or audit.
- [ ] Cross-module links exist, such as customer -> orders -> invoices.
- [ ] Permissions, audit, settings, import/export, or job center are represented when the system scope needs governance.
- [ ] Loading, empty, no-results, error, permission, and success states are covered.

## Implementation Checks

- [ ] `AppLayout` wraps authenticated admin pages.
- [ ] Lists use `FullWidthTable` or `DataTable`, not hand-rolled table-like divs.
- [ ] Colors use `fg-*` tokens only.
- [ ] Icons come from `solar-icon-set` and use numeric `size` plus `color`.
- [ ] `ConfirmationDialog` is inside a real dialog shell.
- [ ] Form errors map to fields.
- [ ] Operational list state is URL-backed when users need to share or revisit the view.
- [ ] Typecheck/build passes.
- [ ] Browser screenshot confirms Forge styles are loaded and layout fills the viewport.

