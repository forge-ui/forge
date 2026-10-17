"use client";

import { useState } from "react";
import {
  ListItem,
  DescriptionItem,
  ListGroup,
  ContactItem,
  NotificationItem,
  ProfileCard,
  Label,
} from "@forge-ui-official/core";
import {
  WalletBoldDuotone,
  ChartBoldDuotone,
  FolderBoldDuotone,
  LetterBoldDuotone,
} from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample, ExampleGrid } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import {
  ListItem, DescriptionItem, ListGroup,
  ContactItem, NotificationItem, ProfileCard,
} from "@forge-ui-official/core";`;

const CODE_LISTITEM_USAGE = `<ListItem
  lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple" }}
  title="收入"
  subtitle="本月"
  value="$24,500"
  trend="10%"
  trendDirection="up"
/>`;

const CODE_LISTITEM_LEADS = `<ListItem lead={{ kind: "icon", icon, color: "purple" }} title="图标前置" />
<ListItem lead={{ kind: "avatar", src: avatar }} title="头像前置" subtitle="在线" />
<ListItem lead={{ kind: "image", src: imgUrl }} title="图片前置" subtitle="方形图片 44×44" />`;

const CODE_DESCITEM_USAGE = `<DescriptionItem
  label="邮箱"
  content="jane@example.com"
  lead={{ kind: "icon", icon: <LetterBoldDuotone size={20} />, color: "purple" }}
/>`;

const CODE_LISTGROUP_NO_TAB = `// Without Tab
<ListGroup
  title="收藏"
  subtitle="已收藏的内容"
  badge={<Label color="blue">3</Label>}
  items={<>...</>}
/>`;

const CODE_LISTGROUP_WITH_TAB = `// With Tab
<ListGroup
  title="动态"
  tabs={[
    { value: "all", label: "全部" },
    { value: "unread", label: "未读" },
  ]}
  activeTab={tab}
  onTabChange={setTab}
  items={<>...</>}
/>`;

const CODE_CONTACT_USAGE = `<ContactItem avatar={avatar} name="林晓" message="明天见！" time="10:30" unreadCount={2} online />`;

const CODE_NOTIF_USAGE = `<NotificationItem
  tag="系统"
  time="2 小时前"
  title="你的订单已发货"
  body="物流单号：1Z999AA10123456784"
  unread
  onMarkRead={() => {}}
/>`;

const CODE_PROFILE_USAGE = `<ProfileCard avatar={avatar} name="林晓" subtitle="管理员" />
<ProfileCard avatar={avatar} name="已选中" subtitle="使用中" state="selected" />`;

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
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "tab 选中态主色。" },
  { attr: "items", type: "ReactNode", defaultValue: "—", description: "列表主体（传一组 ListItem / DescriptionItem 等）。" },
  { attr: "badge", type: "ReactNode", defaultValue: "—", description: "标题旁徽标槽。" },
  { attr: "action", type: "ReactNode", defaultValue: "—", description: "右上角操作槽。" },
  { attr: "tabs", type: "{ value: string; label: string }[]", defaultValue: "—", description: "可选页签数组，提供后在分组顶部显示页签。" },
  { attr: "activeTab", type: "string", defaultValue: "—", description: "当前选中的 tab value（受控）。" },
  { attr: "onTabChange", type: "(value: string) => void", defaultValue: "—", description: "tab 切换回调。" },
  { attr: "closable", type: "boolean", defaultValue: "false", description: "是否渲染右上 close 按钮（覆盖 action 槽）。" },
  { attr: "onClose", type: "() => void", defaultValue: "—", description: "close 回调。" },
  { attr: "density", type: "'default' | 'compact'", defaultValue: "'default'", description: "紧凑模式会收紧标题、标签页和内容区留白。" },
];

const CONTACT_PROPS: ApiTableRow[] = [
  { attr: "type", type: "'person' | 'team'", defaultValue: "'person'", description: "person 渲染头像，team 渲染 initials 方块。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "active 态背景主色。" },
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
  { attr: "actionLabel", type: "string", defaultValue: "'标为已读'", description: "操作按钮文案。" },
];

const PROFILE_PROPS: ApiTableRow[] = [
  { attr: "avatar", type: "string", defaultValue: "—", description: "头像 URL。" },
  { attr: "name", type: "string", defaultValue: "—", description: "姓名。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "副标题（角色等）。" },
  { attr: "state", type: "'idle' | 'hover' | 'selected'", defaultValue: "'idle'", description: "视觉状态。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "selected 态主色。" },
  { attr: "surface", type: "'default' | 'onColoredBg'", defaultValue: "'default'", description: "onColoredBg 用于带主题背景的侧栏 内，采用半透明白。" },
];

const avatar = "https://i.pravatar.cc/40?img=5";
const avatar2 = "https://i.pravatar.cc/40?img=8";

export default function ListCasePage() {
  const [listGroupTab, setListGroupTab] = useState("all");
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="列表"
        hint="条目、字段、分组、联系人和通知各留一个。前置图标、头像和图片看起来不一样，所以都保留。"
      />

      <Section title="用法" description="一条列表由左侧内容、标题和右侧数值组成。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <SubSection title="最小示例" stack>
          <DocExample id="listitem" title="ListItem" summary="带金额的条目，以及左侧换成图标、头像或方形图片。" code={`${CODE_LISTITEM_USAGE}\n${CODE_LISTITEM_LEADS}`} minHeight={220}>
            <div className="w-full max-w-md flex flex-col gap-4">
              <ListItem
                lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple" }}
                title="收入"
                subtitle="本月"
                value="$24,500"
                trend="10%"
                trendDirection="up"
              />
              <ListItem lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple" }} title="图标前置" subtitle="彩色圆形图标" />
              <ListItem lead={{ kind: "avatar", src: avatar }} title="头像前置" subtitle="在线" />
              <ListItem lead={{ kind: "image", src: "https://i.pravatar.cc/44?img=30" }} title="图片前置" subtitle="方形图片 44×44" />
            </div>
          </DocExample>
        </SubSection>
      </Section>

      <Section title="例子">
        <ExampleGrid>
          <DocExample id="descriptionitem" title="DescriptionItem" summary="详情字段：灰色标签加主内容，左侧可放图标。" code={CODE_DESCITEM_USAGE}>
            <div className="w-full max-w-md">
              <DescriptionItem label="邮箱" content="jane@example.com" lead={{ kind: "icon", icon: <LetterBoldDuotone size={20} />, color: "purple" }} />
            </div>
          </DocExample>
          <DocExample id="contactitem" title="ContactItem" summary="联系人一行：头像、最新消息、时间和未读数。" code={CODE_CONTACT_USAGE}>
            <div className="w-full max-w-md">
              <ContactItem avatar={avatar} name="林晓" message="明天见！" time="10:30" unreadCount={2} online />
            </div>
          </DocExample>
          <DocExample id="notificationitem" title="NotificationItem" summary="未读通知用浅黄底。传了 onMarkRead 才出现已读按钮。" code={CODE_NOTIF_USAGE} minHeight={200}>
            <div className="w-full max-w-md">
              <NotificationItem tag="系统" time="2 小时前" title="你的订单已发货" body="物流单号：1Z999AA10123456784" unread onMarkRead={() => {}} />
            </div>
          </DocExample>
          <DocExample id="profilecard" title="ProfileCard" summary="普通和选中是两种身份入口。选中态带主题色。" code={CODE_PROFILE_USAGE} minHeight={200}>
            <div className="w-full max-w-md flex flex-col gap-3">
              <ProfileCard avatar={avatar} name="林晓" subtitle="管理员" />
              <ProfileCard avatar={avatar2} name="已选中" subtitle="使用中" state="selected" />
            </div>
          </DocExample>
          <DocExample id="listgroup" title="ListGroup" summary="可以只放徽标，也可以加上全部、未读、已收藏三个切换。" code={`${CODE_LISTGROUP_NO_TAB}\n${CODE_LISTGROUP_WITH_TAB}`} minHeight={300}>
            <div className="flex w-full flex-col gap-4">
              <ListGroup
                title="收藏"
                subtitle="已收藏的内容"
                badge={<Label color="blue">3</Label>}
                items={
                  <>
                    <ListItem lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple" }} title="收入" value="$24,500" />
                    <ListItem lead={{ kind: "icon", icon: <ChartBoldDuotone size={20} />, color: "green" }} title="数据分析" value="$12,000" />
                    <ListItem lead={{ kind: "icon", icon: <FolderBoldDuotone size={20} />, color: "blue" }} title="项目" value="18" />
                  </>
                }
              />
              <ListGroup
                title="动态"
                tabs={[
                  { value: "all", label: "全部" },
                  { value: "unread", label: "未读" },
                  { value: "starred", label: "已收藏" },
                ]}
                activeTab={listGroupTab}
                onTabChange={setListGroupTab}
                items={
                  <>
                    <ListItem lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple" }} title="已收到付款" value="$1,200" />
                    <ListItem lead={{ kind: "icon", icon: <ChartBoldDuotone size={20} />, color: "green" }} title="报告已生成" value="View" />
                  </>
                }
              />
            </div>
          </DocExample>
        </ExampleGrid>
      </Section>

      <Section title="API">
        <ApiBlock id="listitem" title="ListItem" rows={LISTITEM_PROPS} />
        <ApiBlock id="descriptionitem" title="DescriptionItem" rows={DESCITEM_PROPS} />
        <ApiBlock id="listgroup" title="ListGroup" rows={LISTGROUP_PROPS} />
        <ApiBlock id="contactitem" title="ContactItem" rows={CONTACT_PROPS} />
        <ApiBlock id="notificationitem" title="NotificationItem" rows={NOTIF_PROPS} />
        <ApiBlock id="profilecard" title="ProfileCard" rows={PROFILE_PROPS} />
      </Section>
    </div>
  );
}
