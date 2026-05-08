"use client";

import Link from "next/link";
import { FilterGroup, FilterTrigger, FilterPanel } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { FilterGroup, FilterTrigger, FilterPanel } from "@forge-ui-official/core";`;

const CODE_GROUP_CHECKBOX = `<FilterGroup
  title="Category"
  content={{
    type: "checkbox",
    options: [
      { value: "a", label: "Option A", checked: false },
      { value: "b", label: "Option B", checked: true },
    ],
  }}
/>`;

const CODE_GROUP_RADIO = `<FilterGroup
  title="Status"
  content={{
    type: "radio",
    options: [
      { value: "1", label: "Active", checked: true },
      { value: "2", label: "Archived" },
    ],
  }}
/>`;

const CODE_GROUP_RANGE = `<FilterGroup
  title="Price"
  content={{ type: "range", minValue: "0", maxValue: "999" }}
  hasSelection
/>`;

const CODE_TRIGGER_USAGE = `<FilterTrigger count={8} onClick={() => {}} />`;

const CODE_PANEL_USAGE = `<FilterPanel title="Filters" onReset={() => {}} onApply={() => {}} onCancel={() => {}}>
  <FilterGroup title="Category" content={{ type: "checkbox", options }} />
</FilterPanel>`;

const GROUP_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "'Filter Group'", description: "折叠面板标题。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "主色。" },
  { attr: "content", type: "FilterGroupContent", defaultValue: "{ type: 'empty' }", description: "内容判别联合：empty / checkbox / radio / range。" },
  { attr: "defaultOpen", type: "boolean", defaultValue: "auto", description: "初始展开态，默认非 empty 自动展开。" },
  { attr: "hasSelection", type: "boolean", defaultValue: "auto", description: "右侧 accent 条强制开关，auto 根据 options.checked 推导。" },
];

const TRIGGER_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "'Filters'", description: "按钮文案。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "open 态主色。" },
  { attr: "count", type: "number", defaultValue: "—", description: "右侧红色计数徽标，> 0 时显示。" },
  { attr: "open", type: "boolean", defaultValue: "false", description: "受控 open 状态。" },
  { attr: "onClick", type: "() => void", defaultValue: "—", description: "外部点击回调，传了会覆盖内建 panel。" },
  { attr: "panel", type: "ReactNode | (close) => ReactNode", defaultValue: "—", description: "可选浮层内容，传 panel 后 trigger 自管 open 态。" },
];

const PANEL_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "'Filters'", description: "顶部标题。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "Apply 按钮主色。" },
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "面板主体（通常是若干 FilterGroup）。" },
  { attr: "onReset / onCancel / onApply", type: "() => void", defaultValue: "—", description: "三个操作回调。" },
  { attr: "applyLabel / cancelLabel / resetLabel", type: "string", defaultValue: "—", description: "对应按钮文案。" },
];

const checkboxOptions = [
  { value: "a", label: "Option A", checked: false },
  { value: "b", label: "Option B", checked: true },
  { value: "c", label: "Option C", checked: false },
];

export default function FilterCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Filter"
        hint="FilterGroup 单个可折叠分组（checkbox / radio / range / empty），FilterTrigger 按钮，FilterPanel 完整面板。"
      />

      <Section
        title="FilterGroup"
        description="折叠分组卡。通过 content 判别联合切换类型，3 主色。"
      >
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Checkbox" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>content.type=&quot;checkbox&quot;</InlineCode> 多选项，<InlineCode>options[].checked</InlineCode> 驱动右侧 accent 条。
          </p>
          <PreviewBlock code={CODE_GROUP_CHECKBOX} minHeight={240}>
            <div className="w-72">
              <FilterGroup
                title="Category"
                content={{ type: "checkbox", options: checkboxOptions }}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Radio" stack>
          <PreviewBlock code={CODE_GROUP_RADIO} minHeight={200}>
            <div className="w-72">
              <FilterGroup
                title="Status"
                content={{
                  type: "radio",
                  options: [
                    { value: "1", label: "Active", checked: true },
                    { value: "2", label: "Archived" },
                  ],
                }}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Range" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            数值区间，两个输入 + minLabel / maxLabel。
          </p>
          <PreviewBlock code={CODE_GROUP_RANGE} minHeight={200}>
            <div className="w-72">
              <FilterGroup
                title="Price"
                content={{ type: "range", minValue: "0", maxValue: "999" }}
                hasSelection
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={GROUP_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="FilterTrigger"
        description="圆角按钮触发器，含计数徽标与 open 状态高亮。"
      >
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_TRIGGER_USAGE}>
            <FilterTrigger count={8} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={TRIGGER_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="FilterPanel"
        description="完整筛选面板：标题 + Reset + 内容区（装 FilterGroup）+ Cancel / Apply。"
      >
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_PANEL_USAGE} minHeight={340}>
            <FilterPanel title="Filters" onReset={() => {}} onApply={() => {}} onCancel={() => {}}>
              <FilterGroup
                title="Category"
                content={{ type: "checkbox", options: checkboxOptions }}
              />
            </FilterPanel>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={PANEL_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/filter" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
