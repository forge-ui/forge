> R2适用边界：以SKILL.md的授权范围为先。仅设计检查规范与图纸；单页/局部任务只应用相关契约，不增加系统模块、实施或构建。以下完整系统清单及代码示例仅适用于已授权的相应实施范围；StatusBadge示例不覆盖状态偏好规则。

# Forge Component Mapping Contract

Use this only after the System Brief, Module Contract, and Page Flow are clear.

## Required Output

```yaml
shell:
  component: "AppLayout"
  mode: "light | dark"
  accent: "purple | blue | black"
  menu_items: []
header:
  page_header_variant: "home | detail"
  breadcrumbs: true
toolbar:
  search: "TextField | ToolbarSearchInput"
  filters: []
  date: false
  actions: []
body:
  primary: "FullWidthTable | DataTable | cards | chart | calendar | chat | file-grid | form | stepper"
  secondary: []
tables:
  columns: []
  row_actions_component: "KebabMenu | CellActions | CellKebabMenu"
forms:
  fields: []
  validation: "field-level"
dialogs:
  destructive: "ConfirmationDialog with controlled open/onOpenChange; inline mode only inside an existing shell"
icons:
  package: "@forge-ui-official/core/icons"
  names: []
missing_primitives:
  drawer: "Drawer (controlled open/onOpenChange); check installed version"
  toast: "ToastProvider + useToast; hook below provider"
```

## Forge Rules

- Use `AppLayout` for admin chrome.
- Use `FullWidthTable` for full-page management lists; use `DataTable` for embedded tables.
- Follow [status presentation](../status-presentation.md); StatusBadge examples describe an available API, not an adopted visual default.
- Use `DescriptionItem`, `ListGroup`, `HistoryGrouped`, and `TabBar` for detail and inspector surfaces.
- Use `TextField`, `TextArea`, `SelectOption`, `Datepicker`, `FileUpload`, `MediaUpload`, and `Stepper` for forms.
- Use controlled `ConfirmationDialog` for standalone confirmation; omit `open` only for inline content in one existing shell.
- Use `fg-*` color tokens only.
- Use `@forge-ui-official/core/icons` icons with the `color` prop and numeric `size`.
