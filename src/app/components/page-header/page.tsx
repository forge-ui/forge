"use client";

import { DemoPageHeader } from "./ask-ai-example";
import { Breadcrumbs } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample, ExampleGrid } from "../_doc-blocks";
import { CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { PageHeader, Breadcrumbs } from "@forge-ui-official/core";`;

const CODE_HEADER_SEARCH = `<PageHeader
  askAi={{ onSend: (message, request) => askYourAiService(message, request) }}
  variant="search"
  searchPlaceholder="搜索内容…"
  notifications={3}
  messages={1}
  showProfile
  profile={{
    name: "林晓",
    role: "管理员",
    avatar: "https://i.pravatar.cc/40?img=5",
  }}
/>`;

const CODE_HEADER_TITLE = `<PageHeader
  askAi={{ onSend: (message, request) => askYourAiService(message, request) }}
  variant="title"
  title="项目"
  showBackButton
  showDatePicker
  datePickerLabel="Mar 2026"
  primaryAction={{ label: "新建项目", onClick: () => {} }}
/>`;

const CODE_BREADCRUMB_USAGE = `<Breadcrumbs
  items={[
    { label: "首页", href: "/" },
    { label: "项目", href: "/projects" },
    { label: "详情" },
  ]}
/>`;

const HEADER_PROPS: ApiTableRow[] = [
  { attr: "askAi", type: "AskAiProps", defaultValue: "—", description: "两种 Header / AppLayout 共用的 Ask AI 壳。默认右侧抽屉；可切独立全屏层。必填 onSend；可选 suggestions、槽位与 fullscreen / sessions。未配置时隐藏。" },
  { attr: "variant", type: "'search' | 'title'", defaultValue: "'title'", description: "两种布局：search（全局 header 带搜索 + 通知 + profile）与 title（页面标题 + 返回 + actions）。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "主色（影响通知徽标等）。" },
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
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "非末项链接颜色。" },
  { attr: "className", type: "string", defaultValue: "—", description: "额外 className。" },
];

const breadcrumbItems = [
  { label: "首页", href: "/" },
  { label: "项目", href: "/projects" },
  { label: "详情" },
];

export default function PageHeaderCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="页面顶栏"
        hint="搜索顶栏和页面标题是两种布局。面包屑只负责当前位置，不再单独摆一套颜色。"
      />

      <Section title="用法" description="应用级顶栏放搜索、通知和个人信息。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <SubSection title="最小示例" stack>
          <DocExample id="pageheader" title="PageHeader" summary="搜索顶栏和页面标题是两种布局。" code={`${CODE_HEADER_SEARCH}\n${CODE_HEADER_TITLE}`} minHeight={160}>
            <div className="flex w-full flex-col gap-4">
              <DemoPageHeader
                variant="search"
                searchPlaceholder="搜索内容…"
                notifications={3}
                messages={1}
                showProfile
                profile={{ name: "林晓", role: "管理员", avatar: "https://i.pravatar.cc/40?img=5" }}
              />
              <DemoPageHeader
                variant="title"
                title="项目"
                showBackButton
                showDatePicker
                datePickerLabel="Mar 2026"
                primaryAction={{ label: "新建项目", onClick: () => {} }}
              />
            </div>
          </DocExample>
        </SubSection>
      </Section>

      <Section title="例子" description="面包屑标出从首页到当前页的路径。">
        <ExampleGrid>
          <DocExample id="breadcrumbs" title="Breadcrumbs" summary="最后一项是当前页，前面的项可以返回。" code={CODE_BREADCRUMB_USAGE}>
            <Breadcrumbs items={breadcrumbItems} />
          </DocExample>
        </ExampleGrid>

        <SubSection title="Ask AI" stack>
          <CodeBlock code={`<PageHeader
  title="项目概览"
  askAi={{
    suggestions: ["这个页面可以做什么？", "下一步该做什么？"],
    onSend: async (message, request) => ({
      text: await askYourAiService(message, request),
      links: [
        { label: "查看项目", href: "/projects" },
        { label: "查看任务", href: "/tasks" },
      ],
    }),
  }}
/>`} />
          <p className="text-sm text-fg-grey-700">直接给现有 PageHeader 传入 askAi 配置即可，AppLayout 支持同名配置。发送按钮跟随 PageHeader 的 color，图标保留原有渐变色。点击直接打开右侧对话框，支持快捷提问、连续对话、加载与失败重试。onSend 兼容 string 或 <code>{"{ text, links? }"}</code>（同步或 Promise），每条回复最多显示两个有效链接；相对业务路由和 HTTP(S) 链接在当前窗口打开。signal 可传给 fetch。对话不带当前页面。</p>
          <p className="text-sm text-fg-grey-700">移动端对话框铺满屏幕；Esc、关闭按钮或点击遮罩退出并返回入口焦点。Enter 发送，Shift + Enter 换行。抽屉标题栏默认带全屏钮，打开的是独立全视口层（不是把 dialog 拉成 100vw）。</p>
        </SubSection>

        <SubSection title="Ask AI 全屏与槽位" stack>
          <CodeBlock code={`<AskAi
  onSend={(message, request) => askYourAiService(message, request)}
  fullscreen={open}
  onFullscreenChange={setOpen}
  sessions={[{ id: "s1", title: "上周的探索" }]}
  currentSessionId={currentId}
  searchQuery={query}
  onSearchQueryChange={setQuery}
  onNewSession={startNew}
  onSelectSession={openSession}
  brand={<YourMark />}
  session={<YourSessionRail />}
  messages={<YourTranscript />}
  composer={<ChatInputBar multiline sendOnEnter onSend={send} />}
/>`} />
          <p className="text-sm text-fg-grey-700">全屏受控用 <InlineCode>fullscreen</InlineCode> + <InlineCode>onFullscreenChange</InlineCode>；不传则抽屉内「全屏」钮走内部 state。会话列表只吃 props：<InlineCode>sessions</InlineCode> / <InlineCode>currentSessionId</InlineCode> / <InlineCode>onNewSession</InlineCode> / <InlineCode>onSelectSession</InlineCode> / <InlineCode>searchQuery</InlineCode>。core 不读 localStorage、不调网络、不按标题过滤（过滤留给消费方）。</p>
          <p className="text-sm text-fg-grey-700"><InlineCode>header</InlineCode> / <InlineCode>brand</InlineCode> / <InlineCode>session</InlineCode> / <InlineCode>messages</InlineCode> / <InlineCode>composer</InlineCode> 可覆盖默认区；未传则保持现有抽屉 UI。可通过 <InlineCode>composer</InlineCode> 传入统一的 <InlineCode>ChatInputBar</InlineCode>，接入附件、提及、命令、模型和停止生成。</p>
        </SubSection>

      </Section>

      <Section title="API">
        <ApiBlock id="pageheader" title="PageHeader" rows={HEADER_PROPS} />
        <ApiBlock id="breadcrumbs" title="Breadcrumbs" rows={BREADCRUMB_PROPS} />
      </Section>
    </div>
  );
}
