import Link from "next/link";
import { Login2Linear } from "@forge-ui-official/core/icons";
import {
  Button,
  Toolbar,
  ToolbarSearchInput,
  ToolbarSelectDropdown,
  ToolbarDatepicker,
  ToolbarFilterButton,
  ToolbarShowSelect,
  ToolbarActions,
  ToolbarKebabButton,
  ToolbarFavoriteButton,
  ToolbarPillTabs,
  PageTitleToolbar,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";
import { ToolbarInteractiveDemo } from "./_interactive-demo";

// ─── 共享 demo 数据 ───

const PILL_TABS = [
  { label: "全部", active: true },
  { label: "草稿" },
  { label: "已发布" },
  { label: "已归档" },
];

const PAGE_CRUMBS = [
  { label: "工作区", href: "#" },
  { label: "项目", href: "#" },
  { label: "工作台" },
];

const PrimaryIcon = <Login2Linear size={20} color="#FFFFFF" />;

// ─── 代码片段 ───

const CODE_IMPORT = `import {
  Breadcrumbs,
  Toolbar, ToolbarSearchInput, ToolbarSelectDropdown, ToolbarDatepicker,
  ToolbarFilterButton, ToolbarShowSelect, ToolbarActions,
  ToolbarKebabButton, ToolbarFavoriteButton, ToolbarPillTabs,
  PageTitleToolbar,
} from "@forge-ui-official/core";`;

// Search & Filter Toolbar — Figma 预设双行组合
const CODE_SEARCH_FILTER_USAGE = `// Row 1: 搜索 + 一组筛选 + 主按钮
<Toolbar
  left={<ToolbarSearchInput />}
  right={
    <ToolbarActions>
      <ToolbarSelectDropdown placeholder="请选择…" />
      <ToolbarDatepicker />
      <ToolbarFilterButton />
      <ToolbarShowSelect value="1" />
      <Button color="purple" iconLeft={icon}>主要按钮</Button>
    </ToolbarActions>
  }
/>

// Row 2: 胶囊 Tab + 同款筛选组
<Toolbar
  left={<ToolbarPillTabs color="purple" tabs={tabs} />}
  right={
    <ToolbarActions>
      <ToolbarSelectDropdown placeholder="请选择…" />
      <ToolbarDatepicker />
      <ToolbarFilterButton />
    </ToolbarActions>
  }
/>`;

// Toolbar (low-level) — 基础 left/right 槽容器
const CODE_TOOLBAR_USAGE = `<Toolbar
  left={<ToolbarSearchInput />}
  right={
    <ToolbarActions>
      <ToolbarSelectDropdown placeholder="请选择…" />
      <ToolbarFilterButton />
    </ToolbarActions>
  }
/>`;

const CODE_PILL_USAGE = `<ToolbarPillTabs color="purple" tabs={[
  { label: "全部", active: true },
  { label: "草稿" },
  { label: "已发布" },
]} />`;

const TOOLBAR_PROPS: ApiTableRow[] = [
  { attr: "left", type: "ReactNode", defaultValue: "—", description: "左侧插槽，常放 SearchInput 或 PillTabs。" },
  { attr: "right", type: "ReactNode", defaultValue: "—", description: "右侧插槽，常用 ToolbarActions 包一组控件。" },
  { attr: "selection", type: "{ count, onClear, actions, label?, clearLabel? }", defaultValue: "—", description: "有选中项时展示批量操作；count 为 0 时恢复原有插槽。完整交互见列表页。" },
  { attr: "locale / motion", type: "'zh' | 'en' / 'auto' | 'none'", defaultValue: "'zh' / 'auto'", description: "批量操作文案语言和过渡偏好。" },
  { attr: "className", type: "string", defaultValue: "—", description: "额外 className。" },
];

const PILL_PROPS: ApiTableRow[] = [
  { attr: "tabs", type: "{ label: string; active?: boolean }[]", defaultValue: "—", description: "胶囊 Tab 列表。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "active 状态主色。" },
  { attr: "onChange", type: "(index: number) => void", defaultValue: "—", description: "点击 Tab 时回调，参数为下标。" },
];

// PageTitleToolbar
const CODE_PTT_USAGE = `<PageTitleToolbar
  variant="collection"
  color="purple"
  title="客户"
  subtitle="管理客户关系，了解客户合作情况。"
  breadcrumbItems={crumbs}
  secondaryAction={{ label: "导出" }}
  primaryAction={{ label: "新增客户", icon }}
/>`;

const PTT_PROPS: ApiTableRow[] = [
  { attr: "variant", type: "'overview' | 'collection' | 'detail' | 'action'", defaultValue: "—", description: "固定页面头部结构；业务页必须选择一个预设。" },
  { attr: "title", type: "string", defaultValue: "—", description: "页面大标题。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "副标题文本。" },
  { attr: "breadcrumbItems", type: "BreadcrumbItem[]", defaultValue: "—", description: "结构化面包屑；组件内部固定渲染 Breadcrumbs。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "面包屑和主操作的主题色。" },
  { attr: "dateAction", type: "{ label?; onClick?; enablePopover? }", defaultValue: "—", description: "overview / collection 的固定日期操作位。" },
  { attr: "menuAction", type: "{ ariaLabel?; onClick? }", defaultValue: "—", description: "detail 的固定更多操作位。" },
  { attr: "secondaryAction", type: "PageTitleToolbarAction", defaultValue: "—", description: "固定次操作位；action 变体必填。" },
  { attr: "primaryAction", type: "PageTitleToolbarAction", defaultValue: "—", description: "固定主操作位；action 变体必填。" },
];

// Toolbar sub-controls
const CODE_CONTROLS_USAGE = `<ToolbarSearchInput />
<ToolbarSelectDropdown placeholder="请选择…" />
<ToolbarDatepicker />
<ToolbarFilterButton />
<ToolbarShowSelect value="1" />
<ToolbarKebabButton />
<ToolbarFavoriteButton />`;

const SEARCHINPUT_PROPS: ApiTableRow[] = [
  { attr: "placeholder", type: "string", defaultValue: "'Search. . .'", description: "占位文本（当前为纯展示态，无 onChange）。" },
];

const SELECTDROPDOWN_PROPS: ApiTableRow[] = [
  { attr: "placeholder", type: "string", defaultValue: "'Select. . .'", description: "未选中时显示。" },
  { attr: "value", type: "string", defaultValue: "—", description: "当前值（受控）。" },
  { attr: "options", type: "{ label, value }[]", defaultValue: "—", description: "下拉选项；传值后点击自动弹出列表。" },
  { attr: "onChange", type: "(value: string) => void", defaultValue: "—", description: "选项切换回调。" },
  { attr: "onClick", type: "() => void", defaultValue: "—", description: "外接 click handler，传后接管点击（不弹内置列表）。" },
  { attr: "fixedWidth", type: "boolean", defaultValue: "false", description: "固定 w-20 宽度（用于 ShowSelect）。" },
];

const DATEPICKER_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "'Select Dates'", description: "按钮文本。" },
  { attr: "enablePopover", type: "boolean", defaultValue: "false", description: "true 时点击弹出内置月历（onClick 未设时生效）。" },
  { attr: "onClick", type: "() => void", defaultValue: "—", description: "外接 click handler，传后接管。" },
  { attr: "accentBg", type: "string", defaultValue: "'bg-fg-violet'", description: "内置月历今日高亮 bg class。" },
];

const FILTERBUTTON_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "'筛选'", description: "按钮文本。" },
  { attr: "panel", type: "ReactNode | (close) => ReactNode", defaultValue: "—", description: "挂载的浮层；函数形式可接收 close 用于内部 Apply/Cancel。" },
  { attr: "onClick", type: "() => void", defaultValue: "—", description: "外接 click handler。" },
];

const SHOWSELECT_PROPS: ApiTableRow[] = [
  { attr: "value", type: "string", defaultValue: "'1'", description: "当前选中值。" },
  { attr: "options", type: "{ label, value }[]", defaultValue: "—", description: "可选项；左侧自带 'Show' 标签。" },
  { attr: "onChange", type: "(value: string) => void", defaultValue: "—", description: "切换回调。" },
  { attr: "onClick", type: "() => void", defaultValue: "—", description: "外接 click handler。" },
];

const KEBABBUTTON_PROPS: ApiTableRow[] = [
  { attr: "onClick", type: "() => void", defaultValue: "—", description: "点击回调。固定 20px MenuDots 图标。" },
];

const FAVORITEBUTTON_PROPS: ApiTableRow[] = [
  { attr: "onClick", type: "() => void", defaultValue: "—", description: "点击回调。固定 20px Star 图标。" },
];

export default function ToolbarCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="工具栏"
        hint="集中放置搜索、筛选、视图切换和页面操作。"
      />

      <Section
        title="交互演示"
        description="体验搜索、筛选、日期选择和显示数量的联动操作。"
      >
        <SubSection title="导入组件" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="完整交互" stack>
          <ToolbarInteractiveDemo />
        </SubSection>
      </Section>

      <p id="breadcrumbs" className="scroll-mt-24 text-sm leading-6 text-fg-grey-700">面包屑的展示、用法和参数统一见 <Link href="/components/page-header#breadcrumbs" className="text-fg-violet underline underline-offset-4">面包屑</Link>。</p>

      <Section
        title="搜索与筛选工具栏"
        description="将搜索、筛选、分类切换和主要操作组合为工具栏。"
      >
        <SubSection title="使用方法" stack>
          <PreviewBlock code={CODE_SEARCH_FILTER_USAGE} minHeight={260}>
            <div className="w-full max-w-5xl flex flex-col gap-4">
              <Toolbar
                left={<ToolbarSearchInput />}
                right={
                  <ToolbarActions>
                    <ToolbarSelectDropdown placeholder="请选择…" />
                    <ToolbarDatepicker />
                    <ToolbarFilterButton />
                    <ToolbarShowSelect value="1" />
                    <Button color="purple" variant="primary" iconLeft={PrimaryIcon}>
                      主要按钮
                    </Button>
                  </ToolbarActions>
                }
              />
              <Toolbar
                left={
                  <ToolbarPillTabs
                    color="purple"
                    tabs={[
                      { label: "全部", active: true },
                      { label: "草稿" },
                      { label: "已发布" },
                      { label: "已归档" },
                    ]}
                  />
                }
                right={
                  <ToolbarActions>
                    <ToolbarSelectDropdown placeholder="请选择…" />
                    <ToolbarDatepicker />
                    <ToolbarFilterButton />
                  </ToolbarActions>
                }
              />
            </div>
          </PreviewBlock>
          <p className="text-xs leading-[1.7] text-fg-grey-700">
            底层 props 与下方 Toolbar 一致，搭配的子控件 API 见「Toolbar Controls」。
          </p>
        </SubSection>
      </Section>

      <Section
        title="Toolbar (low-level)"
        description="分别在左侧和右侧放置控件，自由组合工具栏。"
      >
        <SubSection title="使用方法" stack>
          <PreviewBlock code={CODE_TOOLBAR_USAGE} minHeight={140}>
            <div className="w-full max-w-4xl">
              <Toolbar
                left={<ToolbarSearchInput />}
                right={
                  <ToolbarActions>
                    <ToolbarSelectDropdown placeholder="请选择…" />
                    <ToolbarFilterButton />
                  </ToolbarActions>
                }
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={TOOLBAR_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="ToolbarPillTabs"
        description="在工具栏中切换分类或视图。"
      >
        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            通过 <InlineCode>tabs</InlineCode> 传入数组，<InlineCode>active: true</InlineCode> 标记选中项。
          </p>
          <PreviewBlock code={CODE_PILL_USAGE} minHeight={160}>
            <div className="flex flex-col items-start gap-3">
              <ToolbarPillTabs color="purple" tabs={PILL_TABS} />
              <ToolbarPillTabs color="blue" tabs={PILL_TABS} />
              <ToolbarPillTabs color="black" tabs={PILL_TABS} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={PILL_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="PageTitleToolbar"
        description="组织页面标题、面包屑和常用操作。"
      >
        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>variant</InlineCode>、<InlineCode>title</InlineCode> 和 <InlineCode>breadcrumbItems</InlineCode> 必填；action 变体同时要求 Cancel/Save 两个操作。
          </p>
          <PreviewBlock code={CODE_PTT_USAGE} minHeight={220}>
            <div className="w-full max-w-4xl">
              <PageTitleToolbar
                variant="collection"
                title="客户"
                subtitle="管理客户关系，了解客户合作情况。"
                breadcrumbItems={PAGE_CRUMBS}
                secondaryAction={{ label: "导出" }}
                primaryAction={{ label: "新增客户", icon: PrimaryIcon }}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={PTT_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="工具栏控件"
        description="按需组合搜索、选择、日期、筛选等工具栏控件。"
      >
        <SubSection title="ToolbarSearchInput" stack>
          <PreviewBlock code={CODE_CONTROLS_USAGE} minHeight={120}>
            <ToolbarSearchInput />
          </PreviewBlock>
          <ApiTable rows={SEARCHINPUT_PROPS} />
        </SubSection>

        <SubSection title="ToolbarSelectDropdown" stack>
          <PreviewBlock code={CODE_CONTROLS_USAGE} minHeight={120}>
            <ToolbarSelectDropdown placeholder="请选择…" />
          </PreviewBlock>
          <ApiTable rows={SELECTDROPDOWN_PROPS} />
        </SubSection>

        <SubSection title="ToolbarDatepicker" stack>
          <PreviewBlock code={CODE_CONTROLS_USAGE} minHeight={120}>
            <ToolbarDatepicker />
          </PreviewBlock>
          <ApiTable rows={DATEPICKER_PROPS} />
        </SubSection>

        <SubSection title="ToolbarFilterButton" stack>
          <PreviewBlock code={CODE_CONTROLS_USAGE} minHeight={120}>
            <ToolbarFilterButton />
          </PreviewBlock>
          <ApiTable rows={FILTERBUTTON_PROPS} />
        </SubSection>

        <SubSection title="ToolbarShowSelect" stack>
          <PreviewBlock code={CODE_CONTROLS_USAGE} minHeight={120}>
            <ToolbarShowSelect value="1" />
          </PreviewBlock>
          <ApiTable rows={SHOWSELECT_PROPS} />
        </SubSection>

        <SubSection title="ToolbarKebabButton" stack>
          <PreviewBlock code={CODE_CONTROLS_USAGE} minHeight={120}>
            <ToolbarKebabButton />
          </PreviewBlock>
          <ApiTable rows={KEBABBUTTON_PROPS} />
        </SubSection>

        <SubSection title="ToolbarFavoriteButton" stack>
          <PreviewBlock code={CODE_CONTROLS_USAGE} minHeight={120}>
            <ToolbarFavoriteButton />
          </PreviewBlock>
          <ApiTable rows={FAVORITEBUTTON_PROPS} />
        </SubSection>
      </Section>
    </div>
  );
}
