import Link from "next/link";
import { Login2Linear } from "solar-icon-set";
import {
  Button,
  Breadcrumbs,
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
} from "@forge-ui/react";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";
import { ToolbarInteractiveDemo } from "./_interactive-demo";

// ─── 共享 demo 数据 ───

const PILL_TABS = [
  { label: "All", active: true },
  { label: "Drafts" },
  { label: "Published" },
  { label: "Archived" },
];

const PAGE_CRUMBS = [
  { label: "Workspace", href: "#" },
  { label: "Projects", href: "#" },
  { label: "Dashboard" },
];

const PrimaryIcon = <Login2Linear size={20} color="#FFFFFF" />;

// ─── 代码片段 ───

const CODE_IMPORT = `import {
  Breadcrumbs,
  Toolbar, ToolbarSearchInput, ToolbarSelectDropdown, ToolbarDatepicker,
  ToolbarFilterButton, ToolbarShowSelect, ToolbarActions,
  ToolbarKebabButton, ToolbarFavoriteButton, ToolbarPillTabs,
  PageTitleToolbar,
} from "@forge-ui/react";`;

// Breadcrumbs
const CODE_CRUMBS_USAGE = `<Breadcrumbs
  items={[
    { label: "Workspace", href: "#" },
    { label: "Projects", href: "#" },
    { label: "Dashboard" },
  ]}
/>`;

const CODE_CRUMBS_COLORS = `<Breadcrumbs color="purple" items={items} />
<Breadcrumbs color="blue" items={items} />
<Breadcrumbs color="black" items={items} />`;

const CRUMBS_PROPS: ApiTableRow[] = [
  { attr: "items", type: "{ label: string; href?: string; onClick?: () => void }[]", defaultValue: "—", description: "层级列表；最后一项通常不带 href / onClick，作为当前页。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "链接主色，末项始终灰色。" },
];

// Search & Filter Toolbar — Figma 预设双行组合
const CODE_SEARCH_FILTER_USAGE = `// Row 1: 搜索 + 一组筛选 + 主按钮
<Toolbar
  left={<ToolbarSearchInput />}
  right={
    <ToolbarActions>
      <ToolbarSelectDropdown placeholder="Select..." />
      <ToolbarDatepicker />
      <ToolbarFilterButton />
      <ToolbarShowSelect value="1" />
      <Button color="purple" iconLeft={icon}>Primary</Button>
    </ToolbarActions>
  }
/>

// Row 2: 胶囊 Tab + 同款筛选组
<Toolbar
  left={<ToolbarPillTabs color="purple" tabs={tabs} />}
  right={
    <ToolbarActions>
      <ToolbarSelectDropdown placeholder="Select..." />
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
      <ToolbarSelectDropdown placeholder="Select..." />
      <ToolbarFilterButton />
    </ToolbarActions>
  }
/>`;

const CODE_PILL_USAGE = `<ToolbarPillTabs color="purple" tabs={[
  { label: "All", active: true },
  { label: "Drafts" },
  { label: "Published" },
]} />`;

const TOOLBAR_PROPS: ApiTableRow[] = [
  { attr: "left", type: "ReactNode", defaultValue: "—", description: "左侧插槽，常放 SearchInput 或 PillTabs。" },
  { attr: "right", type: "ReactNode", defaultValue: "—", description: "右侧插槽，常用 ToolbarActions 包一组控件。" },
  { attr: "className", type: "string", defaultValue: "—", description: "额外 className。" },
];

const PILL_PROPS: ApiTableRow[] = [
  { attr: "tabs", type: "{ label: string; active?: boolean }[]", defaultValue: "—", description: "胶囊 Tab 列表。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "active 状态主色。" },
  { attr: "onChange", type: "(index: number) => void", defaultValue: "—", description: "点击 Tab 时回调，参数为下标。" },
];

// PageTitleToolbar
const CODE_PTT_USAGE = `<PageTitleToolbar
  title="Dashboard"
  subtitle="Lorem ipsum dolor sit amet"
  breadcrumbs={<Breadcrumbs items={crumbs} />}
  actions={
    <ToolbarActions>
      <ToolbarDatepicker />
      <ToolbarFilterButton />
      <Button color="purple" iconLeft={icon}>Primary</Button>
    </ToolbarActions>
  }
/>`;

const PTT_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "页面大标题。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "副标题文本。" },
  { attr: "breadcrumbs", type: "ReactNode", defaultValue: "—", description: "通常传入 <Breadcrumbs />。与 subtitle 可并存，顺序为 crumbs → title → subtitle。" },
  { attr: "actions", type: "ReactNode", defaultValue: "—", description: "右侧操作区，一般是 ToolbarActions 或 ToolbarPillTabs。" },
];

// Toolbar sub-controls
const CODE_CONTROLS_USAGE = `<ToolbarSearchInput />
<ToolbarSelectDropdown placeholder="Select..." />
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
  { attr: "label", type: "string", defaultValue: "'Filters'", description: "按钮文本。" },
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
        title="Toolbar"
        hint="Toolbar 家族：Breadcrumbs · Search & Filter Toolbar 预设组合 · Toolbar 底层容器 · ToolbarPillTabs · PageTitleToolbar · 7 个 Toolbar* 子控件。"
      />

      <Section
        title="Interactive Demo"
        description="全部 Toolbar 子控件真实联动：ToolbarSelectDropdown / ToolbarDatepicker / ToolbarFilterButton / ToolbarShowSelect 均可点击展开。"
      >
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="All wired up" stack>
          <ToolbarInteractiveDemo />
        </SubSection>
      </Section>

      <Section
        title="Breadcrumbs"
        description="层级导航，最后一段为当前页，其余为可点链接。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            每段一个 <InlineCode>label</InlineCode>，可选 <InlineCode>href</InlineCode>，缺省则为当前页。
          </p>
          <PreviewBlock code={CODE_CRUMBS_USAGE} minHeight={140}>
            <Breadcrumbs items={PAGE_CRUMBS} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="Colors" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 种链接色：purple / blue / black。
          </p>
          <PreviewBlock code={CODE_CRUMBS_COLORS} minHeight={200}>
            <div className="flex flex-col items-start gap-3">
              <Breadcrumbs color="purple" items={PAGE_CRUMBS} />
              <Breadcrumbs color="blue" items={PAGE_CRUMBS} />
              <Breadcrumbs color="black" items={PAGE_CRUMBS} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={CRUMBS_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="Search & Filter Toolbar"
        description="Figma 预设变体：双行组合 —— 第一行搜索 + 一组筛选 + 主按钮，第二行 PillTabs + 同款筛选。直接抄即可，下方 Toolbar (low-level) 是底层容器。"
      >
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_SEARCH_FILTER_USAGE} minHeight={260}>
            <div className="w-full max-w-5xl flex flex-col gap-4">
              <Toolbar
                left={<ToolbarSearchInput />}
                right={
                  <ToolbarActions>
                    <ToolbarSelectDropdown placeholder="Select..." />
                    <ToolbarDatepicker />
                    <ToolbarFilterButton />
                    <ToolbarShowSelect value="1" />
                    <Button color="purple" variant="primary" iconLeft={PrimaryIcon}>
                      Primary
                    </Button>
                  </ToolbarActions>
                }
              />
              <Toolbar
                left={
                  <ToolbarPillTabs
                    color="purple"
                    tabs={[
                      { label: "All", active: true },
                      { label: "Drafts" },
                      { label: "Published" },
                      { label: "Archived" },
                    ]}
                  />
                }
                right={
                  <ToolbarActions>
                    <ToolbarSelectDropdown placeholder="Select..." />
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
        description="底层 left + right 两槽容器。需要自由组装时用，开箱即用预设见上方 Search & Filter Toolbar。"
      >
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_TOOLBAR_USAGE} minHeight={140}>
            <div className="w-full max-w-4xl">
              <Toolbar
                left={<ToolbarSearchInput />}
                right={
                  <ToolbarActions>
                    <ToolbarSelectDropdown placeholder="Select..." />
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
        description="胶囊 Tab，常用于 Toolbar left 槽作为分类切换。"
      >
        <SubSection title="Usage" stack>
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
        description="带大标题的 Toolbar，通常放在页面顶部，支持 Breadcrumbs / Subtitle / Actions 三个槽。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>title</InlineCode> 必填，其余均可选。breadcrumbs + subtitle 可并存。
          </p>
          <PreviewBlock code={CODE_PTT_USAGE} minHeight={220}>
            <div className="w-full max-w-4xl">
              <PageTitleToolbar
                title="Dashboard"
                subtitle="Lorem ipsum dolor si amet"
                breadcrumbs={<Breadcrumbs items={PAGE_CRUMBS} />}
                actions={
                  <ToolbarActions>
                    <ToolbarDatepicker />
                    <ToolbarFilterButton />
                    <Button color="purple" variant="primary" iconLeft={PrimaryIcon}>
                      Primary
                    </Button>
                  </ToolbarActions>
                }
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={PTT_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="Toolbar Controls"
        description="7 个原子控件，用于 Toolbar 的 left / right 槽。每个组件独立 props，分别列出。需要联动请参考最上方 Interactive Demo。"
      >
        <SubSection title="ToolbarSearchInput" stack>
          <PreviewBlock code={CODE_CONTROLS_USAGE} minHeight={120}>
            <ToolbarSearchInput />
          </PreviewBlock>
          <ApiTable rows={SEARCHINPUT_PROPS} />
        </SubSection>

        <SubSection title="ToolbarSelectDropdown" stack>
          <PreviewBlock code={CODE_CONTROLS_USAGE} minHeight={120}>
            <ToolbarSelectDropdown placeholder="Select..." />
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

      <Link href="/cases/toolbar" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
