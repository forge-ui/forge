"use client";

import { useState } from "react";
import {
  ToolbarSelectDropdown,
  ToolbarDatepicker,
  ToolbarFilterButton,
  ToolbarShowSelect,
  FilterPanel,
  FilterGroup,
} from "@forge-ui/react";

const SELECT_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

const SHOW_OPTIONS = [
  { label: "10", value: "10" },
  { label: "25", value: "25" },
  { label: "50", value: "50" },
];

function DemoFilterPanel({ close }: { close: () => void }) {
  return (
    <FilterPanel onReset={() => {}} onCancel={close} onApply={close}>
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
    </FilterPanel>
  );
}

export function ToolbarInteractiveDemo() {
  const [status, setStatus] = useState("all");
  const [perPage, setPerPage] = useState("10");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ToolbarSelectDropdown
        placeholder="Select..."
        value={status}
        options={SELECT_OPTIONS}
        onChange={setStatus}
      />
      <ToolbarDatepicker enablePopover />
      <ToolbarFilterButton panel={(close) => <DemoFilterPanel close={close} />} />
      <ToolbarShowSelect
        value={perPage}
        options={SHOW_OPTIONS}
        onChange={setPerPage}
      />
    </div>
  );
}
