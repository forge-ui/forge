"use client";

import { FilterPanel, FilterGroup } from "@forge-ui/react";

/**
 * Reusable mock FilterPanel for wiring ToolbarFilterButton / FilterTrigger
 * across ecommerce pages. Content is placeholder; swap with real filters when
 * actual filter state is lifted into the page.
 */
export function MockFilterPanel({
  close,
  title = "Filters",
}: {
  close: () => void;
  title?: string;
}) {
  return (
    <FilterPanel
      title={title}
      onReset={() => {}}
      onCancel={close}
      onApply={close}
    >
      <FilterGroup
        title="Status"
        defaultOpen
        content={{
          type: "checkbox",
          options: [
            { label: "Active", value: "active", checked: true },
            { label: "Pending", value: "pending" },
            { label: "Archived", value: "archived" },
          ],
          onToggle: () => {},
        }}
      />
      <FilterGroup
        title="Date range"
        content={{ type: "empty" }}
      />
      <FilterGroup
        title="Price range"
        content={{
          type: "range",
          minLabel: "Min",
          maxLabel: "Max",
          minValue: "100",
          maxValue: "500",
          onMinChange: () => {},
          onMaxChange: () => {},
        }}
      />
    </FilterPanel>
  );
}
