"use client";

import { useState } from "react";
import {
  FilterGroup,
  FilterPanel,
  FilterTrigger,
  type FilterGroupColor,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

const colors = ["purple", "blue", "black"] as const satisfies readonly FilterGroupColor[];

const labelByColor: Record<FilterGroupColor, string> = {
  purple: "Purple",
  blue: "Blue",
  black: "Black",
};

const checkboxOptions = [
  { value: "a", label: "Option Text Here", checked: false },
  { value: "b", label: "Option Text Here", checked: true },
  { value: "c", label: "Option Text Here", checked: false },
  { value: "d", label: "Option Text Here", checked: false },
  { value: "e", label: "Option Text Here", checked: false },
];

const colorCheckboxOptions = [
  { value: "blue", label: "Option Text Here", checked: false, colorDot: "bg-blue-700" },
  { value: "green", label: "Option Text Here", checked: true, colorDot: "bg-emerald-700" },
  { value: "amber", label: "Option Text Here", checked: false, colorDot: "bg-amber-500" },
  { value: "red", label: "Option Text Here", checked: true, colorDot: "bg-fg-red" },
  { value: "rose", label: "Option Text Here", checked: false, colorDot: "bg-rose-200" },
];

const radioOptions = [
  { value: "1", label: "Option Text Here", checked: false },
  { value: "2", label: "Option Text Here", checked: false },
  { value: "3", label: "Option Text Here", checked: true },
  { value: "4", label: "Option Text Here", checked: false },
  { value: "5", label: "Option Text Here", checked: false },
];

export default function FilterCasePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading title="Filter" hint="FilterGroup · FilterTrigger · FilterPanel" />

      <Section
        title="Filter Group"
        description="可折叠卡片，3 色 × 3 variant（empty / checkbox / range）。radio 和 color-checkbox 是组件能力，仅在 Filter 面板内嵌演示"
      >
        {colors.map((color) => (
          <SubSection key={color} title={labelByColor[color]}>
            <Labeled label="empty">
              <div className="w-72">
                <FilterGroup color={color} content={{ type: "empty" }} />
              </div>
            </Labeled>
            <Labeled label="checkbox">
              <div className="w-72">
                <FilterGroup
                  color={color}
                  content={{ type: "checkbox", options: checkboxOptions }}
                />
              </div>
            </Labeled>
            <Labeled label="range">
              <div className="w-72">
                <FilterGroup
                  color={color}
                  content={{ type: "range", minValue: "", maxValue: "" }}
                  hasSelection
                />
              </div>
            </Labeled>
          </SubSection>
        ))}
      </Section>

      <Section
        title="Filter"
        description="Trigger pill 4 状态 + 完整 Panel（FilterGroup 容器 + Reset + Cancel/Apply）"
      >
        {colors.map((color) => (
          <SubSection key={color} title={`${labelByColor[color]} · triggers`}>
            <Labeled label="closed">
              <FilterTrigger color={color} />
            </Labeled>
            <Labeled label="closed · count">
              <FilterTrigger color={color} count={8} />
            </Labeled>
            <Labeled label="open">
              <FilterTrigger color={color} open />
            </Labeled>
            <Labeled label="open · count">
              <FilterTrigger color={color} open count={8} />
            </Labeled>
          </SubSection>
        ))}

        {colors.map((color) => (
          <SubSection key={color} title={`${labelByColor[color]} · panel`}>
            <FilterPanelDemo color={color} />
          </SubSection>
        ))}

        <SubSection title="Interactive · trigger + panel wired">
          <Labeled label="click to open">
            <FilterTrigger
              color="purple"
              count={8}
              panel={(close) => (
                <FilterPanel color="purple" onReset={() => {}} onCancel={close} onApply={close}>
                  <FilterGroup
                    color="purple"
                    title="Status"
                    defaultOpen
                    content={{
                      type: "checkbox",
                      options: checkboxOptions,
                      onToggle: () => {},
                    }}
                  />
                </FilterPanel>
              )}
            />
          </Labeled>
        </SubSection>
      </Section>
    </div>
  );
}

function FilterPanelDemo({ color }: { color: FilterGroupColor }) {
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  return (
    <FilterPanel color={color} onReset={() => {}} onCancel={() => {}} onApply={() => {}}>
      <FilterGroup
        color={color}
        content={{ type: "checkbox", options: checkboxOptions }}
      />
      <FilterGroup
        color={color}
        content={{
          type: "range",
          minValue,
          maxValue,
          onMinChange: setMinValue,
          onMaxChange: setMaxValue,
        }}
      />
      <FilterGroup
        color={color}
        content={{ type: "checkbox", options: colorCheckboxOptions }}
      />
      <FilterGroup
        color={color}
        content={{ type: "radio", options: radioOptions }}
      />
    </FilterPanel>
  );
}
