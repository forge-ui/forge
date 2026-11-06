> R2收尾：状态按[统一默认规则](../status-presentation.md)检查；新页面推荐纯文本，有项目约定则继承。不要求用户先从两种样式中选择才能交付。仅设计任务不执行下方实施检查。

> R2适用边界：以SKILL.md的授权范围为先。仅设计检查规范与图纸；单页/局部任务只应用相关契约，不增加系统模块、实施或构建。以下完整系统清单及代码示例仅适用于已授权的相应实施范围；StatusBadge示例不覆盖状态偏好规则。

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
- [ ] Icons come from `@forge-ui-official/core/icons` and use numeric `size` plus `color`.
- [ ] `ConfirmationDialog` is controlled, or deliberately inline inside one existing shell; no double dialog.
- [ ] Form errors map to fields.
- [ ] Operational list state is URL-backed when users need to share or revisit the view.
- [ ] Typecheck/build passes.
- [ ] Browser screenshot confirms Forge styles are loaded and layout fills the viewport.
