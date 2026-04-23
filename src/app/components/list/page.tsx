"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ListItem,
  DescriptionItem,
  ListGroup,
  ContactItem,
  NotificationItem,
  ProfileCard,
  Label,
} from "@forge-ui/react";
import {
  WalletBoldDuotone,
  ChartBoldDuotone,
  FolderBoldDuotone,
  LetterBoldDuotone,
} from "solar-icon-set";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import {
  ListItem, DescriptionItem, ListGroup,
  ContactItem, NotificationItem, ProfileCard,
} from "@forge-ui/react";`;

const CODE_LISTITEM_USAGE = `<ListItem
  lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple" }}
  title="Revenue"
  subtitle="This month"
  value="$24,500"
  trend="10%"
  trendDirection="up"
/>`;

const CODE_LISTITEM_LEADS = `<ListItem lead={{ kind: "icon", icon, color: "purple" }} title="Icon lead" />
<ListItem lead={{ kind: "avatar", src: avatar }} title="Avatar lead" subtitle="Online" />
<ListItem lead={{ kind: "image", src: imgUrl }} title="Image lead" subtitle="Square 44×44" />`;

const CODE_DESCITEM_USAGE = `<DescriptionItem
  label="Email"
  content="jane@example.com"
  lead={{ kind: "icon", icon: <LetterBoldDuotone size={20} />, color: "purple" }}
/>`;

const CODE_LISTGROUP_NO_TAB = `// Without Tab
<ListGroup
  title="Favorites"
  subtitle="Your saved items"
  badge={<Label color="purple">3</Label>}
  items={<>...</>}
/>`;

const CODE_LISTGROUP_WITH_TAB = `// With Tab
<ListGroup
  title="Activity"
  tabs={[
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
  ]}
  activeTab={tab}
  onTabChange={setTab}
  items={<>...</>}
/>`;

const CODE_CONTACT_USAGE = `<ContactItem avatar={avatar} name="Jane Cooper" message="See you tomorrow!" time="10:30" unreadCount={2} online />`;

const CODE_NOTIF_USAGE = `<NotificationItem
  tag="System"
  time="2h ago"
  title="Your order has been shipped"
  body="Tracking number: 1Z999AA10123456784"
  unread
  onMarkRead={() => {}}
/>`;

const CODE_PROFILE_USAGE = `<ProfileCard avatar={avatar} name="Jane Cooper" subtitle="Admin" />
<ProfileCard avatar={avatar} name="Selected" subtitle="Active" state="selected" />`;

const LISTITEM_PROPS: ApiTableRow[] = [
  { attr: "lead", type: "ListItemLead", defaultValue: "—", description: "左侧槽，判别联合：icon / avatar / image 三种。" },
  { attr: "title", type: "string", defaultValue: "—", description: "主标题，line-clamp-1。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "副标题。" },
  { attr: "value", type: "string", defaultValue: "—", description: "右上 tail 文案（金额等）。" },
  { attr: "trend", type: "string", defaultValue: "—", description: "右下趋势标签。" },
  { attr: "trendDirection", type: "'up' | 'down'", defaultValue: "'up'", description: "趋势方向，影响颜色和箭头。" },
  { attr: "tailSubtext", type: "string", defaultValue: "—", description: "value 下方的辅助文案（与 trend 互斥）。" },
  { attr: "trailing", type: "ReactNode", defaultValue: "—", description: "完全自定义右侧内容（覆盖 value/trend/tailSubtext）。" },
];

const DESCITEM_PROPS: ApiTableRow[] = [
  { attr: "lead", type: "icon | image", defaultValue: "—", description: "左侧图标或方形图片。" },
  { attr: "label", type: "string", defaultValue: "—", description: "字段标签（灰色）。" },
  { attr: "content", type: "ReactNode", defaultValue: "—", description: "主内容，字符串会自动黑色 medium。" },
  { attr: "actions", type: "ReactNode", defaultValue: "—", description: "右侧操作槽。" },
];

const LISTGROUP_PROPS: ApiTableRow[] = [
  { attr: "title", type: "string", defaultValue: "—", description: "组标题。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "副标题。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "tab 选中态主色。" },
  { attr: "items", type: "ReactNode", defaultValue: "—", description: "列表主体（传一组 ListItem / DescriptionItem 等）。" },
  { attr: "badge", type: "ReactNode", defaultValue: "—", description: "标题旁徽标槽。" },
  { attr: "action", type: "ReactNode", defaultValue: "—", description: "右上角操作槽。" },
  { attr: "tabs", type: "{ value: string; label: string }[]", defaultValue: "—", description: "可选 tab 数组，传后切换为「With Tab」模式。" },
  { attr: "activeTab", type: "string", defaultValue: "—", description: "当前选中的 tab value（受控）。" },
  { attr: "onTabChange", type: "(value: string) => void", defaultValue: "—", description: "tab 切换回调。" },
  { attr: "closable", type: "boolean", defaultValue: "false", description: "是否渲染右上 close 按钮（覆盖 action 槽）。" },
  { attr: "onClose", type: "() => void", defaultValue: "—", description: "close 回调。" },
];

const CONTACT_PROPS: ApiTableRow[] = [
  { attr: "type", type: "'person' | 'team'", defaultValue: "'person'", description: "person 渲染头像，team 渲染 initials 方块。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "active 态背景主色。" },
  { attr: "name", type: "string", defaultValue: "—", description: "联系人姓名。" },
  { attr: "message", type: "string", defaultValue: "—", description: "最新消息摘要。" },
  { attr: "online", type: "boolean", defaultValue: "false", description: "绿色在线点。" },
  { attr: "active", type: "boolean", defaultValue: "false", description: "选中态（主色背景）。" },
  { attr: "unreadCount", type: "number", defaultValue: "—", description: "未读徽标，> 0 显示橙色 pill。" },
  { attr: "time", type: "string", defaultValue: "—", description: "右上时间文案。" },
];

const NOTIF_PROPS: ApiTableRow[] = [
  { attr: "tag", type: "string", defaultValue: "—", description: "顶部分类标签。" },
  { attr: "time", type: "string", defaultValue: "—", description: "顶部时间。" },
  { attr: "title", type: "string", defaultValue: "—", description: "通知标题。" },
  { attr: "body", type: "string", defaultValue: "—", description: "通知正文。" },
  { attr: "unread", type: "boolean", defaultValue: "false", description: "未读态：浅黄色背景。" },
  { attr: "onMarkRead", type: "() => void", defaultValue: "—", description: "标记已读回调，传了才显示按钮。" },
  { attr: "actionLabel", type: "string", defaultValue: "'Mark as Read'", description: "操作按钮文案。" },
];

const PROFILE_PROPS: ApiTableRow[] = [
  { attr: "avatar", type: "string", defaultValue: "—", description: "头像 URL。" },
  { attr: "name", type: "string", defaultValue: "—", description: "姓名。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "副标题（角色等）。" },
  { attr: "state", type: "'idle' | 'hover' | 'selected'", defaultValue: "'idle'", description: "视觉状态。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "selected 态主色。" },
  { attr: "surface", type: "'default' | 'onColoredBg'", defaultValue: "'default'", description: "onColoredBg 用于色底 sidebar 内，采用半透明白。" },
];

const avatar = "https://i.pravatar.cc/40?img=5";
const avatar2 = "https://i.pravatar.cc/40?img=8";

export default function ListCasePage() {
  const [listGroupTab, setListGroupTab] = useState("all");
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="List"
        hint="列表族：ListItem / DescriptionItem / ListGroup / ContactItem / NotificationItem / ProfileCard。"
      />

      <Section title="ListItem" description="通用列表行，左 lead + 中标题副标题 + 右尾部 value / trend。">
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_LISTITEM_USAGE}>
            <div className="w-full max-w-md">
              <ListItem
                lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple" }}
                title="Revenue"
                subtitle="This month"
                value="$24,500"
                trend="10%"
                trendDirection="up"
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Lead Variants" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 种 lead：<InlineCode>icon</InlineCode>（圆形彩色图标）/ <InlineCode>avatar</InlineCode>（圆形头像）/ <InlineCode>image</InlineCode>（44×44 方形）。
          </p>
          <PreviewBlock code={CODE_LISTITEM_LEADS} minHeight={220}>
            <div className="w-full max-w-md flex flex-col gap-4">
              <ListItem lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple" }} title="Icon lead" subtitle="Round colored" />
              <ListItem lead={{ kind: "avatar", src: avatar }} title="Avatar lead" subtitle="Online" />
              <ListItem lead={{ kind: "image", src: "https://i.pravatar.cc/44?img=30" }} title="Image lead" subtitle="Square 44×44" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={LISTITEM_PROPS} />
        </SubSection>
      </Section>

      <Section title="DescriptionItem" description="字段展示行：标签（灰）+ 主内容 + 可选 actions。用于详情页字段组。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_DESCITEM_USAGE}>
            <div className="w-full max-w-md">
              <DescriptionItem
                label="Email"
                content="jane@example.com"
                lead={{ kind: "icon", icon: <LetterBoldDuotone size={20} />, color: "purple" }}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={DESCITEM_PROPS} />
        </SubSection>
      </Section>

      <Section title="ListGroup" description="白底卡片容器，装一组 ListItem / DescriptionItem。Figma 两种预设：「Without Tab」纯列表 / 「With Tab」头部带 tab 切换。">
        <SubSection title="Without Tab" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            纯列表模式：title + subtitle + badge + 一组 items。
          </p>
          <PreviewBlock code={CODE_LISTGROUP_NO_TAB} minHeight={300}>
            <div className="w-full max-w-md">
              <ListGroup
                title="Favorites"
                subtitle="Your saved items"
                badge={<Label color="purple">3</Label>}
                items={
                  <>
                    <ListItem lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple" }} title="Revenue" value="$24,500" />
                    <ListItem lead={{ kind: "icon", icon: <ChartBoldDuotone size={20} />, color: "green" }} title="Analytics" value="$12,000" />
                    <ListItem lead={{ kind: "icon", icon: <FolderBoldDuotone size={20} />, color: "blue" }} title="Projects" value="18" />
                  </>
                }
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="With Tab" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            头部嵌入 tab：传 <InlineCode>tabs</InlineCode> + <InlineCode>activeTab</InlineCode> + <InlineCode>onTabChange</InlineCode> 即可。
          </p>
          <PreviewBlock code={CODE_LISTGROUP_WITH_TAB} minHeight={300}>
            <div className="w-full max-w-md">
              <ListGroup
                title="Activity"
                tabs={[
                  { value: "all", label: "All" },
                  { value: "unread", label: "Unread" },
                  { value: "starred", label: "Starred" },
                ]}
                activeTab={listGroupTab}
                onTabChange={setListGroupTab}
                items={
                  <>
                    <ListItem lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple" }} title="Payment received" value="$1,200" />
                    <ListItem lead={{ kind: "icon", icon: <ChartBoldDuotone size={20} />, color: "green" }} title="Report ready" value="View" />
                  </>
                }
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={LISTGROUP_PROPS} />
        </SubSection>
      </Section>

      <Section title="ContactItem" description="IM 联系人行。头像 / 姓名 / 最新消息 / 时间 / 未读徽标 / 在线点。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_CONTACT_USAGE}>
            <div className="w-full max-w-md">
              <ContactItem avatar={avatar} name="Jane Cooper" message="See you tomorrow!" time="10:30" unreadCount={2} online />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={CONTACT_PROPS} />
        </SubSection>
      </Section>

      <Section title="NotificationItem" description="通知中心单条。未读态浅黄背景，含 tag / time / title / body / Mark as Read。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_NOTIF_USAGE} minHeight={200}>
            <div className="w-full max-w-md">
              <NotificationItem
                tag="System"
                time="2h ago"
                title="Your order has been shipped"
                body="Tracking number: 1Z999AA10123456784"
                unread
                onMarkRead={() => {}}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={NOTIF_PROPS} />
        </SubSection>
      </Section>

      <Section title="ProfileCard" description="profile 选择器行。头像 + 姓名 + 副标题 + 下拉箭头，3 种 state。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_PROFILE_USAGE} minHeight={200}>
            <div className="w-full max-w-md flex flex-col gap-3">
              <ProfileCard avatar={avatar} name="Jane Cooper" subtitle="Admin" />
              <ProfileCard avatar={avatar2} name="Selected" subtitle="Active" state="selected" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={PROFILE_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/list" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
