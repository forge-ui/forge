"use client";

import { FilterGroup, FilterTrigger, FilterPanel } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample, ExampleGrid } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { FilterGroup, FilterTrigger, FilterPanel } from "@forge-ui-official/core";`;

const CODE_GROUP_CHECKBOX = `<FilterGroup
  title="分类"
  content={{
    type: "checkbox",
    options: [
      { value: "a", label: "选项甲", checked: false },
      { value: "b", label: "选项乙", checked: true },
    ],
  }}
/>`;

const CODE_GROUP_RADIO = `<FilterGroup
  title="状态"
  content={{
    type: "radio",
    options: [
      { value: "1", label: "使用中", checked: true },
      { value: "2", label: "已归档" },
    ],
  }}
/>`;

const CODE_GROUP_RANGE = `<FilterGroup
  title="价格"
  content={{ type: "range", minValue: "0", maxValue: "999" }}
  hasSelection
/>`;

const CODE_TRIGGER_USAGE = `<FilterTrigger count={8} onClick={() => {}} />`;

const CODE_PANEL_USAGE = `<FilterPanel title="筛选条件" onReset={() => {}} onApply={() => {}} onCancel={() => {}}>
  <FilterGroup title="分类" content={{ type: "checkbox", options }} />
</FilterPanel>`;

const GROUP_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "'筛选分组'", description: "折叠面板标题。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "主色。" },
  { attr: "content", type: "FilterGroupContent", defaultValue: "{ type: 'empty' }", description: "内容判别联合：empty / checkbox / radio / range。" },
  { attr: "defaultOpen", type: "boolean", defaultValue: "auto", description: "初始展开态，默认非 empty 自动展开。" },
  { attr: "hasSelection", type: "boolean", defaultValue: "auto", description: "右侧 accent 条强制开关，auto 根据 options.checked 推导。" },
];

const TRIGGER_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "'筛选'", description: "按钮文案。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "open 态主色。" },
  { attr: "count", type: "number", defaultValue: "—", description: "右侧红色计数徽标，> 0 时显示。" },
  { attr: "open", type: "boolean", defaultValue: "false", description: "受控 open 状态。" },
  { attr: "onClick", type: "() => void", defaultValue: "—", description: "外部点击回调，传了会覆盖内建 panel。" },
  { attr: "panel", type: "ReactNode | (close) => ReactNode", defaultValue: "—", description: "可选浮层内容，传 panel 后 trigger 自管 open 态。" },
];

const PANEL_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "'筛选'", description: "顶部标题。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "应用筛选按钮的主题色。" },
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "面板主体（通常是若干 FilterGroup）。" },
  { attr: "onReset / onCancel / onApply", type: "() => void", defaultValue: "—", description: "三个操作回调。" },
  { attr: "applyLabel / cancelLabel / resetLabel", type: "string", defaultValue: "—", description: "对应按钮文案。" },
];

const checkboxOptions = [
  { value: "a", label: "选项甲", checked: false },
  { value: "b", label: "选项乙", checked: true },
  { value: "c", label: "选项丙", checked: false },
];

export default function FilterCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="筛选"
        hint="用分组条件缩小结果。多选、单选和区间是三种内容，按钮和面板负责打开与确认。"
      />

      <Section title="用法" description="从一组多选条件开始。已选项会在分组右侧标出。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
      </Section>

      <Section title="例子" description="内容类型各留一个。触发器和面板是打开、重置和应用的外壳。">
        <DocExample id="filtergroup" title="FilterGroup" summary="多选、单选和数值区间是同一分组的三种内容。" code={`${CODE_GROUP_CHECKBOX}\n${CODE_GROUP_RADIO}\n${CODE_GROUP_RANGE}`} minHeight={240}>
          <div className="flex w-full flex-wrap items-start justify-center gap-4">
            <div className="w-full max-w-xs">
              <FilterGroup title="分类" content={{ type: "checkbox", options: checkboxOptions }} />
            </div>
            <div className="w-full max-w-xs">
              <FilterGroup
                title="状态"
                content={{
                  type: "radio",
                  options: [
                    { value: "1", label: "使用中", checked: true },
                    { value: "2", label: "已归档" },
                  ],
                }}
              />
            </div>
            <div className="w-full max-w-xs">
              <FilterGroup title="价格" content={{ type: "range", minValue: "0", maxValue: "999" }} hasSelection />
            </div>
          </div>
        </DocExample>
        <ExampleGrid>
          <DocExample id="filtertrigger" title="FilterTrigger" summary="打开筛选的按钮。count 是已选条件数量。" code={CODE_TRIGGER_USAGE}>
            <FilterTrigger count={8} />
          </DocExample>
          <DocExample id="filterpanel" title="FilterPanel" summary="把分组放进面板，提供重置、取消和应用。" code={CODE_PANEL_USAGE} minHeight={340}>
            <FilterPanel title="筛选条件" onReset={() => {}} onApply={() => {}} onCancel={() => {}}>
              <FilterGroup title="分类" content={{ type: "checkbox", options: checkboxOptions }} />
            </FilterPanel>
          </DocExample>
        </ExampleGrid>
      </Section>

      <Section title="API" description="分组写下三种内容共用的字段。触发器和面板各自独立。">
        <ApiBlock id="filtergroup" title="FilterGroup" rows={GROUP_PROPS} />
        <ApiBlock id="filtertrigger" title="FilterTrigger" rows={TRIGGER_PROPS} />
        <ApiBlock id="filterpanel" title="FilterPanel" rows={PANEL_PROPS} />
      </Section>
    </div>
  );
}
