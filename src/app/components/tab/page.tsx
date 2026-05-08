import Link from "next/link";
import { TabBar, ButtonGroup } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

// ─── TabBar 代码片段 ───

const CODE_IMPORT = `import { TabBar, ButtonGroup } from "@forge-ui-official/core";`;

const CODE_TABBAR_USAGE = `<TabBar
  tabs={[
    { label: "Overview", active: true, badge: 3 },
    { label: "Analytics", badge: 12 },
    { label: "Reports" },
    { label: "Settings" },
  ]}
/>`;

const CODE_TABBAR_COLORS = `<TabBar color="purple" tabs={tabs} />
<TabBar color="blue" tabs={tabs} />
<TabBar color="black" tabs={tabs} />`;

const CODE_TABBAR_BADGE = `<TabBar
  tabs={[
    { label: "All", active: true, badge: 128 },
    { label: "Active", badge: 32 },
    { label: "Closed", badge: 96 },
  ]}
/>`;

const TABS_SAMPLE = [
  { label: "Overview", active: true, badge: 3 },
  { label: "Analytics", badge: 12 },
  { label: "Reports" },
  { label: "Settings" },
];

const TABBAR_PROPS: ApiTableRow[] = [
  {
    attr: "tabs",
    type: "{ label: string; active?: boolean; badge?: number }[]",
    defaultValue: "—",
    description: "页签列表，active 为 true 的项高亮，badge 显示右上角数字。",
  },
  {
    attr: "color",
    type: "'purple' | 'blue' | 'black'",
    defaultValue: "'purple'",
    description: "选中态主色。",
  },
  {
    attr: "onChange",
    type: "(index: number) => void",
    defaultValue: "—",
    description: "切换页签回调，参数为下标。",
  },
  {
    attr: "className",
    type: "string",
    defaultValue: "—",
    description: "额外 className。",
  },
];

// ─── ButtonGroup 代码片段 ───

const CODE_BUTTONGROUP_USAGE = `<ButtonGroup
  activeIndex={1}
  items={[
    { label: "Day" },
    { label: "Week" },
    { label: "Month" },
  ]}
/>`;

const CODE_BUTTONGROUP_COLORS = `<ButtonGroup color="purple" activeIndex={0} items={items} />
<ButtonGroup color="blue" activeIndex={1} items={items} />
<ButtonGroup color="black" activeIndex={2} items={items} />`;

const CODE_BUTTONGROUP_SHAPE = `<ButtonGroup shape="rounded" activeIndex={1} items={items} />
<ButtonGroup shape="pill" activeIndex={1} items={items} />`;

const BUTTONGROUP_ITEMS = [
  { label: "Day" },
  { label: "Week" },
  { label: "Month" },
];

const BUTTONGROUP_PROPS: ApiTableRow[] = [
  {
    attr: "items",
    type: "{ label: string }[]",
    defaultValue: "—",
    description: "分段按钮列表。",
  },
  {
    attr: "activeIndex",
    type: "number",
    defaultValue: "0",
    description: "当前选中分段下标。",
  },
  {
    attr: "color",
    type: "'purple' | 'blue' | 'black'",
    defaultValue: "'purple'",
    description: "选中态主色。",
  },
  {
    attr: "shape",
    type: "'rounded' | 'pill'",
    defaultValue: "'rounded'",
    description: "圆角矩形或胶囊。",
  },
  {
    attr: "onChange",
    type: "(index: number) => void",
    defaultValue: "—",
    description: "切换回调。",
  },
];

export default function TabCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Tab"
        hint="页签组件家族：TabBar 用于页面主导航，ButtonGroup 用于小范围切换视图。"
      />

      <Section
        title="TabBar"
        description="顶部页签导航，对应 Figma 「Page Tab」。3 种主色，可选 badge。"
      >
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            通过 <InlineCode>tabs</InlineCode> 数组声明页签，<InlineCode>active: true</InlineCode> 标记当前选中项。
          </p>
          <PreviewBlock code={CODE_TABBAR_USAGE} minHeight={140}>
            <TabBar tabs={TABS_SAMPLE} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="Colors" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 种主色：<InlineCode>purple</InlineCode>（默认）/ <InlineCode>blue</InlineCode> / <InlineCode>black</InlineCode>。
          </p>
          <PreviewBlock code={CODE_TABBAR_COLORS} minHeight={200}>
            <div className="flex w-full flex-col items-stretch gap-4">
              <TabBar color="purple" tabs={TABS_SAMPLE} />
              <TabBar color="blue" tabs={TABS_SAMPLE} />
              <TabBar color="black" tabs={TABS_SAMPLE} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="With Badge" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            每个 tab 可单独传入 <InlineCode>badge</InlineCode> 数字，适合展示未读 / 计数。
          </p>
          <PreviewBlock code={CODE_TABBAR_BADGE} minHeight={140}>
            <TabBar
              tabs={[
                { label: "All", active: true, badge: 128 },
                { label: "Active", badge: 32 },
                { label: "Closed", badge: 96 },
              ]}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={TABBAR_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="ButtonGroup"
        description="分段控制器，对应 Figma 「In Group」。用于切换过滤维度或视图模式。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            通过 <InlineCode>items</InlineCode> 传入标签数组，<InlineCode>activeIndex</InlineCode> 指定选中项。
          </p>
          <PreviewBlock code={CODE_BUTTONGROUP_USAGE} minHeight={140}>
            <ButtonGroup activeIndex={1} items={BUTTONGROUP_ITEMS} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="Colors" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 种选中态：purple / blue / black。
          </p>
          <PreviewBlock code={CODE_BUTTONGROUP_COLORS} minHeight={140}>
            <ButtonGroup color="purple" activeIndex={0} items={BUTTONGROUP_ITEMS} />
            <ButtonGroup color="blue" activeIndex={1} items={BUTTONGROUP_ITEMS} />
            <ButtonGroup color="black" activeIndex={2} items={BUTTONGROUP_ITEMS} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="Shape" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            圆角矩形或胶囊，通过 <InlineCode>shape</InlineCode> 切换。
          </p>
          <PreviewBlock code={CODE_BUTTONGROUP_SHAPE} minHeight={140}>
            <ButtonGroup shape="rounded" activeIndex={1} items={BUTTONGROUP_ITEMS} />
            <ButtonGroup shape="pill" activeIndex={1} items={BUTTONGROUP_ITEMS} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={BUTTONGROUP_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/tab" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
