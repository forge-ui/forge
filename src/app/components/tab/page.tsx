import Link from "next/link";
import { TabBar, ToggleGroup } from "@aideui/core";
import { HamburgerMenuLinear, WidgetLinear } from "@aideui/core/icons";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

// ─── TabBar 代码片段 ───

const CODE_IMPORT = `import { TabBar, ToggleGroup, ButtonGroup } from "@aideui/core";`;

const CODE_TABBAR_USAGE = `<TabBar
  tabs={[
    { label: "概览", active: true, badge: 3 },
    { label: "分析", badge: 12 },
    { label: "报告" },
    { label: "设置" },
  ]}
/>`;

const CODE_TABBAR_COLORS = `<TabBar color="purple" tabs={tabs} />
<TabBar color="blue" tabs={tabs} />
<TabBar color="black" tabs={tabs} />`;

const CODE_TABBAR_BADGE = `<TabBar
  tabs={[
    { label: "全部", active: true, badge: 128 },
    { label: "进行中", badge: 32 },
    { label: "已归档", badge: 96 },
  ]}
/>`;

const TABS_SAMPLE = [
  { label: "概览", active: true, badge: 3 },
  { label: "分析", badge: 12 },
  { label: "报告" },
  { label: "设置" },
];

const TABBAR_PROPS: ApiTableRow[] = [
  {
    attr: "tabs",
    type: "{ label: string; active?: boolean; badge?: number; id?: string; controls?: string }[]",
    defaultValue: "—",
    description: "页签列表；id 和 controls 可与 TabsContent 的 labelledBy 和 id 关联。",
  },
  {
    attr: "color",
    type: "'purple' | 'blue' | 'black'",
    defaultValue: "'blue'",
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

const CODE_TOGGLEGROUP_USAGE = `<ToggleGroup
  ariaLabel="视图"
  defaultValue="list"
  onChange={setView}
  options={[
    { value: "list", label: "列表", icon: <HamburgerMenuLinear size={18} /> },
    { value: "board", label: "看板", icon: <WidgetLinear size={18} /> },
  ]}
/>
<ToggleGroup multiple ariaLabel="筛选" defaultValue={["mine"]} options={[{ value: "mine", label: "我负责的" }, { value: "due", label: "即将到期" }]} />`;

const TOGGLEGROUP_PROPS: ApiTableRow[] = [
  { attr: "options", type: "{ value, label?, icon?, ariaLabel?, disabled? }[]", defaultValue: "—", description: "选项；只有图标时要传 ariaLabel。" },
  { attr: "multiple", type: "boolean", defaultValue: "false", description: "多选。单选时再次点击当前项会取消选中。" },
  { attr: "value / defaultValue", type: "string | null / string[]", defaultValue: "—", description: "选中值；多选时是数组。" },
  { attr: "onChange", type: "(value) => void", defaultValue: "—", description: "选中变化时回调。" },
  { attr: "size", type: "'sm' | 'md'", defaultValue: "'md'", description: "高度 28 / 36。" },
  { attr: "ariaLabel", type: "string", defaultValue: "—", description: "整组的读屏名称。" },
];

export default function TabCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="页签与切换"
        hint="在同一页面中切换内容、分类或视图。"
      />

      <Section
        title="TabBar"
        description="切换页面内容，支持显示数量标记。"
      >
        <SubSection title="导入组件" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            通过 <InlineCode>tabs</InlineCode> 数组声明页签，<InlineCode>active: true</InlineCode> 标记当前选中项。
          </p>
          <PreviewBlock code={CODE_TABBAR_USAGE} minHeight={140}>
            <TabBar tabs={TABS_SAMPLE} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="颜色" stack>
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

        <SubSection title="带计数" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            每个页签可单独传入 <InlineCode>badge</InlineCode> 数字，适合展示未读 / 计数。
          </p>
          <PreviewBlock code={CODE_TABBAR_BADGE} minHeight={140}>
            <TabBar
              tabs={[
                { label: "全部", active: true, badge: 128 },
                { label: "进行中", badge: 32 },
                { label: "已归档", badge: 96 },
              ]}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={TABBAR_PROPS} />
        </SubSection>
      </Section>



      <Section
        title="ToggleGroup"
        description="分段按钮：切换视图（单选），或叠加筛选（多选）。方向键在选项间移动。"
      >
        <SubSection title="使用方法" stack>
          <PreviewBlock code={CODE_TOGGLEGROUP_USAGE} minHeight={140}>
            <div className="flex flex-wrap items-center gap-4">
              <ToggleGroup ariaLabel="视图" defaultValue="list" options={[{ value: "list", label: "列表", icon: <HamburgerMenuLinear size={18} /> }, { value: "board", label: "看板", icon: <WidgetLinear size={18} /> }]} />
              <ToggleGroup multiple ariaLabel="筛选" defaultValue={["mine"]} options={[{ value: "mine", label: "我负责的" }, { value: "due", label: "即将到期" }]} />
            </div>
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <ApiTable rows={TOGGLEGROUP_PROPS} />
        </SubSection>
      </Section>

      <p id="buttongroup" className="scroll-mt-24 text-sm leading-6 text-fg-grey-700">按钮组的展示、用法和参数统一见 <Link href="/components/button-link#buttongroup" className="text-fg-violet underline underline-offset-4">按钮组</Link>。</p>
    </div>
  );
}
