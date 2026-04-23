"use client";

import Link from "next/link";
import { PageHeader, Breadcrumbs } from "@forge-ui/react";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { PageHeader, Breadcrumbs } from "@forge-ui/react";`;

const CODE_HEADER_SEARCH = `<PageHeader
  variant="search"
  searchPlaceholder="Search anything..."
  notifications={3}
  messages={1}
  showProfile
  profile={{
    name: "Jane Doe",
    role: "Admin",
    avatar: "https://i.pravatar.cc/40?img=5",
  }}
/>`;

const CODE_HEADER_TITLE = `<PageHeader
  variant="title"
  title="Projects"
  showBackButton
  showDatePicker
  datePickerLabel="Mar 2026"
  primaryAction={{ label: "New Project", onClick: () => {} }}
/>`;

const CODE_BREADCRUMB_USAGE = `<Breadcrumbs
  items={[
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Detail" },
  ]}
/>`;

const CODE_BREADCRUMB_COLOR = `<Breadcrumbs color="purple" items={items} />`;

const HEADER_PROPS: ApiTableRow[] = [
  { attr: "variant", type: "'search' | 'title'", defaultValue: "'title'", description: "两种布局：search（全局 header 带搜索 + 通知 + profile）与 title（页面标题 + 返回 + actions）。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "主色（影响通知徽标等）。" },
  { attr: "searchPlaceholder", type: "string", defaultValue: "—", description: "search 变体：搜索框占位。" },
  { attr: "onSearch", type: "(value: string) => void", defaultValue: "—", description: "搜索提交回调。" },
  { attr: "notifications / messages", type: "number", defaultValue: "—", description: "通知 / 消息数量（> 0 时显示红色徽标）。" },
  { attr: "showProfile", type: "boolean", defaultValue: "true", description: "search 变体：是否显示右上角 profile 槽。" },
  { attr: "profile", type: "{ name, role, avatar }", defaultValue: "—", description: "profile 数据对象。" },
  { attr: "title", type: "string", defaultValue: "—", description: "title 变体：页面标题文案。" },
  { attr: "showBackButton", type: "boolean", defaultValue: "true", description: "title 变体：是否显示左侧返回箭头。" },
  { attr: "showDatePicker", type: "boolean", defaultValue: "true", description: "title 变体：是否显示日期 picker 按钮。" },
  { attr: "showFilters", type: "boolean", defaultValue: "true", description: "title 变体：是否显示 filter 按钮。" },
  { attr: "primaryAction / secondaryAction", type: "{ label, onClick, icon? }", defaultValue: "—", description: "右侧主 / 次按钮。" },
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "自定义内容槽。" },
];

const BREADCRUMB_PROPS: ApiTableRow[] = [
  { attr: "items", type: "{ label, href?, onClick? }[]", defaultValue: "—", description: "面包屑链路。最后一项自动渲染为灰色当前页。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "非末项链接颜色。" },
  { attr: "className", type: "string", defaultValue: "—", description: "额外 className。" },
];

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Detail" },
];

export default function PageHeaderCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Page Header"
        hint="PageHeader 页面顶栏（search / title 两变体，装着搜索、通知、profile、actions），Breadcrumbs 面包屑。"
      />

      <Section
        title="PageHeader"
        description="2 个 Figma 预设 variant × 3 色 × 若干按钮开关。Figma 里的 Back / Bookmark / Favorite 三个分类是 IconButton 样张，不是 PageHeader 整体变体。"
      >
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Search & Widget Variant" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            对应 Figma 「Search & Widget」。常用于 app 全局顶栏：左搜索 + 中间功能 icon（calendar / notification / messages / language）+ 右 profile。
          </p>
          <PreviewBlock code={CODE_HEADER_SEARCH} minHeight={120}>
            <div className="w-full">
              <PageHeader
                variant="search"
                searchPlaceholder="Search anything..."
                notifications={3}
                messages={1}
                showProfile
                profile={{
                  name: "Jane Doe",
                  role: "Admin",
                  avatar: "https://i.pravatar.cc/40?img=5",
                }}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Page Title Variant" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            对应 Figma 「Page Title」。页面级标题 + 返回 / 日期 / filter / favorite / 主次 action 等按钮按需开关。
          </p>
          <PreviewBlock code={CODE_HEADER_TITLE} minHeight={120}>
            <div className="w-full">
              <PageHeader
                variant="title"
                title="Projects"
                showBackButton
                showDatePicker
                datePickerLabel="Mar 2026"
                primaryAction={{ label: "New Project", onClick: () => {} }}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={HEADER_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="Breadcrumbs"
        description="链路导航。<code>items</code> 末项自动渲染为灰色当前页，前面自动变成主色链接。3 色。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>items</InlineCode> 数组，每项可带 <InlineCode>href</InlineCode> 或 <InlineCode>onClick</InlineCode>。
          </p>
          <PreviewBlock code={CODE_BREADCRUMB_USAGE}>
            <Breadcrumbs items={breadcrumbItems} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="Colors" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 色：purple / blue / black。此处展示 purple，其余见 cases。
          </p>
          <PreviewBlock code={CODE_BREADCRUMB_COLOR}>
            <Breadcrumbs color="purple" items={breadcrumbItems} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={BREADCRUMB_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/page-header" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
