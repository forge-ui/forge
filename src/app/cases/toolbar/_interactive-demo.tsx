"use client";

import { useState } from "react";
import { AddCircleLinear } from "solar-icon-set";
import {
  ToolbarSearchInput,
  ToolbarSelectDropdown,
  ToolbarDatepicker,
  ToolbarFilterButton,
  ToolbarShowSelect,
  ToolbarPillTabs,
  FilterPanel,
  FilterGroup,
  Button,
  type ToolbarColor,
  type ButtonColor,
} from "@forge-ui-official/core";

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

/**
 * Full Search & Filter row matching Figma:
 * Row 1: Search | Select | Datepicker | Filter | Show | Primary Button
 * Row 2: Pill Tabs (first active)
 *
 * Accepts a `color` prop so the page can render purple / blue / black variants.
 */
export function ToolbarInteractiveDemo({
  color = "purple",
}: {
  color?: ToolbarColor;
}) {
  const [status, setStatus] = useState("all");
  const [perPage, setPerPage] = useState("10");
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Row 1: search + selectors + primary button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToolbarSearchInput />
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
          <Button
            color={color as ButtonColor}
            variant="primary"
            size="lg"
            iconLeft={<AddCircleLinear size={20} color="currentColor" />}
          >
            Primary
          </Button>
        </div>
      </div>

      {/* Row 2: pill tabs */}
      <ToolbarPillTabs
        color={color}
        tabs={[
          { label: "All", active: activeTab === 0 },
          { label: "Active", active: activeTab === 1 },
          { label: "Pending", active: activeTab === 2 },
          { label: "Archived", active: activeTab === 3 },
        ]}
        onChange={setActiveTab}
      />
    </div>
  );
}
