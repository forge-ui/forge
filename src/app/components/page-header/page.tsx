"use client";
import Link from "next/link";

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
  { attr: "askAi", type: "AskAiProps", defaultValue: "—", description: "两种 Header / AppLayout 共用的 Forge Agent 入口，点开是右侧 AgentPanel。必填 onSend；可选 suggestions、sessions 与 messages / composer 槽位。未配置时隐藏。" },
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

        <SubSection title="Forge Agent 入口" stack>
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
          <p className="text-sm text-fg-grey-700">给现有 PageHeader 传入 askAi 配置即可，AppLayout 支持同名配置。点击入口在右侧打开 AgentPanel：空对话显示问候和快捷提问，回复流式出现，可以停止和重试。onSend 兼容 string 或 <code>{"{ text, links? }"}</code>（同步或 Promise），每条回复最多显示两个有效链接；signal 可传给 fetch。</p>
        </SubSection>

        <SubSection title="会话与槽位" stack>
          <CodeBlock code={`<AskAi
  onSend={(message, request) => askYourAiService(message, request)}
  sessions={[{ id: "s1", title: "上周的探索" }]}
  currentSessionId={currentId}
  onNewSession={startNew}
  onSelectSession={openSession}
  messages={<YourTranscript />}
  composer={<ChatInputBar multiline sendOnEnter onSend={send} />}
/>`} />
          <p className="text-sm text-fg-grey-700">历史会话只吃 props：<InlineCode>sessions</InlineCode> / <InlineCode>currentSessionId</InlineCode> / <InlineCode>onNewSession</InlineCode> / <InlineCode>onSelectSession</InlineCode>，core 不读 localStorage、不调网络。自己有运行时的应用用 <InlineCode>messages</InlineCode> / <InlineCode>composer</InlineCode> 替换默认对话区和输入框；完整的智能体组件见 <Link className="font-semibold text-fg-black underline" href="/agent">Forge Agent</Link>。</p>
        </SubSection>

      </Section>

      <Section title="API">
        <ApiBlock id="pageheader" title="PageHeader" rows={HEADER_PROPS} />
        <ApiBlock id="breadcrumbs" title="Breadcrumbs" rows={BREADCRUMB_PROPS} />
      </Section>
    </div>
  );
}
