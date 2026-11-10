"use client";

import { useState } from "react";
import { FilterPanel, FilterGroup } from "@forge-ui-official/core";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Archived", value: "archived" },
];
const defaults = { status: ["active"], min: "100", max: "500" };

/**
 * Filter panel shared by the ecommerce pages. Selections are local to the panel;
 * lift them into the page when the list should actually be filtered.
 */
export function MockFilterPanel({
  close,
  title = "Filters",
}: {
  close: () => void;
  title?: string;
}) {
  const [status, setStatus] = useState(defaults.status);
  const [min, setMin] = useState(defaults.min);
  const [max, setMax] = useState(defaults.max);
  const reset = () => {
    setStatus(defaults.status);
    setMin(defaults.min);
    setMax(defaults.max);
  };

  return (
    <FilterPanel title={title} onReset={reset} onCancel={close} onApply={close}>
      <FilterGroup
        title="Status"
        defaultOpen
        content={{
          type: "checkbox",
          options: statusOptions.map((option) => ({ ...option, checked: status.includes(option.value) })),
          onToggle: (value: string, checked: boolean) => setStatus((current) => (checked ? [...new Set([...current, value])] : current.filter((item) => item !== value))),
        }}
      />
      <FilterGroup title="Date range" content={{ type: "empty" }} />
      <FilterGroup
        title="Price range"
        content={{ type: "range", minLabel: "Min", maxLabel: "Max", minValue: min, maxValue: max, onMinChange: setMin, onMaxChange: setMax }}
      />
    </FilterPanel>
  );
}
