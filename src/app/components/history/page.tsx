"use client";

import Link from "next/link";
import { HistoryItem, HistoryGrouped } from "@forge-ui-official/core";
import {
  CheckCircleLinear,
  UserLinear,
  DocumentTextLinear,
} from "solar-icon-set";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { HistoryItem, HistoryGrouped } from "@forge-ui-official/core";`;

const CODE_ITEM_USAGE = `<HistoryItem
  title="Order Placed"
  description="Your order has been submitted"
  datetime="10:30 AM"
  color="purple"
/>`;

const CODE_ITEM_VARIANTS = `<HistoryItem variant="regular" title="Regular" datetime="10:00" />
<HistoryItem variant="badge" title="Badge" datetime="10:30" icon={<CheckCircleLinear size={20} />} />
<HistoryItem variant="profile" title="Profile" datetime="11:00" avatar={avatar} />`;

const CODE_ITEM_DATETIME = `<HistoryItem title="Item" datetime="10:30" showDatetime="inline" />
<HistoryItem title="Item" datetime="10:30" showDatetime="bottom" />`;

const CODE_GROUPED_USAGE = `<HistoryGrouped
  title="Recent Activity"
  subtitle="Last 24 hours"
  color="purple"
  progressHeight="40%"
  items={[
    { title: "Login", datetime: "10:00" },
    { title: "Viewed report", datetime: "10:30" },
    { title: "Logout", datetime: "11:00" },
  ]}
/>`;

const ITEM_PROPS: ApiTableRow[] = [
  { attr: "variant", type: "'regular' | 'badge' | 'profile'", defaultValue: "'regular'", description: "左侧指示器样式：实心圆点 / 图标徽章 / 头像。" },
  { attr: "color", type: "'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'cyan' | 'gray' | 'black'", defaultValue: "'purple'", description: "8 种语义色，驱动 dot / badge 颜色。" },
  { attr: "title", type: "string", defaultValue: "—", description: "条目标题。" },
  { attr: "description", type: "ReactNode", defaultValue: "—", description: "可选描述。" },
  { attr: "datetime", type: "string", defaultValue: "—", description: "时间文案。" },
  { attr: "showDatetime", type: "'inline' | 'bottom'", defaultValue: "'inline'", description: "时间位置：标题右侧或条目底部。" },
  { attr: "tags", type: "ReactNode", defaultValue: "—", description: "底部标签槽。" },
  { attr: "icon", type: "ReactNode", defaultValue: "—", description: "badge 变体内图标。" },
  { attr: "avatar", type: "string", defaultValue: "—", description: "profile 变体头像 URL。" },
  { attr: "showConnector", type: "boolean", defaultValue: "true", description: "是否渲染指示器下方的连接线。" },
];

const GROUPED_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "分组标题。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "副标题。" },
  { attr: "badge", type: "ReactNode", defaultValue: "—", description: "标题右侧徽标槽。" },
  { attr: "items", type: "HistoryItemProps[]", defaultValue: "—", description: "条目数组，自动串成时间轴。" },
  { attr: "action", type: "ReactNode", defaultValue: "—", description: "右上角操作槽。" },
  { attr: "progressHeight", type: "string", defaultValue: "'30%'", description: "右侧 progress 柱高度（CSS 值，如 \"40%\"）。" },
  { attr: "color", type: "HistoryItemColor", defaultValue: "'purple'", description: "统一覆盖所有 item 的颜色。" },
];

export default function HistoryCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="History"
        hint="HistoryItem 时间轴条目（3 变体 × 8 色），HistoryGrouped 分组容器 + 右侧进度柱。"
      />

      <Section
        title="HistoryItem"
        description="时间轴条目。3 变体（regular / badge / profile）× 8 色。"
      >
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_ITEM_USAGE} minHeight={140}>
            <div className="w-full max-w-md">
              <HistoryItem
                title="Order Placed"
                description="Your order has been submitted"
                datetime="10:30 AM"
                color="purple"
                showConnector={false}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Variants" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 种指示器样式。<InlineCode>badge</InlineCode> 需传 <InlineCode>icon</InlineCode>，<InlineCode>profile</InlineCode> 需传 <InlineCode>avatar</InlineCode>。
          </p>
          <PreviewBlock code={CODE_ITEM_VARIANTS} minHeight={300}>
            <div className="w-full max-w-md flex flex-col">
              <HistoryItem variant="regular" title="Regular" datetime="10:00" />
              <HistoryItem variant="badge" title="Badge" datetime="10:30" icon={<CheckCircleLinear size={20} />} />
              <HistoryItem variant="profile" title="Profile" datetime="11:00" avatar="https://i.pravatar.cc/40?img=10" showConnector={false} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Datetime Position" stack>
          <PreviewBlock code={CODE_ITEM_DATETIME} minHeight={200}>
            <div className="w-full max-w-md flex flex-col">
              <HistoryItem title="Inline Time" datetime="10:30" showDatetime="inline" description="Time shown on the right" />
              <HistoryItem title="Bottom Time" datetime="10:30" showDatetime="bottom" description="Time below description" showConnector={false} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={ITEM_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="HistoryGrouped"
        description="时间轴容器卡：header + 副标题 + 条目列表 + 右侧进度柱。"
      >
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_GROUPED_USAGE} minHeight={360}>
            <div className="w-full max-w-lg">
              <HistoryGrouped
                title="Recent Activity"
                subtitle="Last 24 hours"
                color="purple"
                progressHeight="40%"
                items={[
                  { variant: "badge", title: "Login", datetime: "10:00", icon: <UserLinear size={20} /> },
                  { variant: "badge", title: "Viewed report", datetime: "10:30", icon: <DocumentTextLinear size={20} /> },
                  { title: "Logout", datetime: "11:00" },
                ]}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={GROUPED_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/history" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
