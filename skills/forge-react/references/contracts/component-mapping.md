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
  destructive: "ConfirmationDialog inside host dialog shell"
icons:
  package: "solar-icon-set"
  names: []
missing_primitives:
  drawer: "host app shell or ask"
  toast: "host app shell or ask"
```

## Forge Rules

- Use `AppLayout` for admin chrome.
- Use `FullWidthTable` for full-page management lists; use `DataTable` for embedded tables.
- Use `StatusBadge` for business states.
- Use `DescriptionItem`, `ListGroup`, `HistoryGrouped`, and `TabBar` for detail and inspector surfaces.
- Use `TextField`, `TextArea`, `SelectOption`, `Datepicker`, `FileUpload`, `MediaUpload`, and `Stepper` for forms.
- Use `ConfirmationDialog` only as content inside a dialog shell.
- Use `fg-*` color tokens only.
- Use `solar-icon-set` icons with the `color` prop and numeric `size`.

