"use client";

import { useState } from "react";
import {
  ListItem,
  DescriptionItem,
  ListGroup,
  Label,
  NotificationBadge,
  type AccentColor,
  type ListGroupTab,
} from "@forge-ui-official/core";
import {
  WalletBoldDuotone,
  ChartBoldDuotone,
  FolderBoldDuotone,
  BookBoldDuotone,
  StarBoldDuotone,
  CartBoldDuotone,
  PenLinear,
  MenuDotsBold,
} from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection } from "../_shared";

const groupColors = ["purple", "blue", "black"] as const satisfies readonly AccentColor[];

const groupBadgeLabel: Record<AccentColor, string> = {
  purple: "紫色",
  blue: "蓝色",
  black: "黑色",
};

const greyIconRows = [
  { icon: <WalletBoldDuotone size={20} />, color: "purple" as const },
  { icon: <ChartBoldDuotone size={20} />, color: "green" as const },
  { icon: <FolderBoldDuotone size={20} />, color: "blue" as const },
  { icon: <BookBoldDuotone size={20} />, color: "red" as const },
];

const groupItems: {
  icon: React.ReactNode;
  color: "purple" | "green" | "blue" | "red" | "cyan";
}[] = [
  { icon: <WalletBoldDuotone size={16} />, color: "purple" },
  { icon: <ChartBoldDuotone size={16} />, color: "green" },
  { icon: <FolderBoldDuotone size={16} />, color: "blue" },
  { icon: <BookBoldDuotone size={16} />, color: "red" },
  { icon: <StarBoldDuotone size={16} />, color: "cyan" },
];

const tabs: ListGroupTab[] = [
  { value: "text1", label: "示例文本" },
  { value: "text2", label: "示例文本" },
  { value: "text3", label: "示例文本" },
];

const squareImg =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><rect width="44" height="44" rx="8" fill="#E9D5FF"/><text x="22" y="27" font-family="Manrope,sans-serif" font-size="13" font-weight="700" fill="#7C3AED" text-anchor="middle">IMG</text></svg>`
  );

const kebabActions = (
  <>
    <PenLinear size={16} />
    <MenuDotsBold size={16} />
  </>
);

export default function ListCasePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading title="列表" hint="组织条目、详情字段、联系人和通知，便于浏览与操作。" />

      <Section
        title="2 Column"
        description="ListItem 尾部变体（Grey BG icon + 多种 tail 组合）"
      >
        <SubSection title="样式">
          <div className="w-full grid grid-cols-2 gap-x-6 gap-y-5">
            <ListItem
              lead={{ kind: "icon", icon: greyIconRows[0].icon, color: greyIconRows[0].color, variant: "neutral" }}
              title="项目概览"
              subtitle="辅助文字"
              value="$24,500"
              trend="10%"
              trendDirection="up"
            />
            <ListItem
              lead={{ kind: "icon", icon: greyIconRows[1].icon, color: greyIconRows[1].color, variant: "neutral" }}
              title="项目概览"
              subtitle="辅助文字"
              value="$24,500"
              tailSubtext="辅助文字"
            />
            <ListItem
              lead={{ kind: "icon", icon: greyIconRows[2].icon, color: greyIconRows[2].color, variant: "neutral" }}
              title="项目概览"
              subtitle="辅助文字"
              value="$24,500"
            />
            <ListItem
              lead={{ kind: "icon", icon: greyIconRows[3].icon, color: greyIconRows[3].color, variant: "neutral" }}
              title="项目概览"
              value="$24,500"
              trend="10%"
              trendDirection="up"
            />
            <ListItem
              lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "yellow", variant: "neutral" }}
              title="项目概览"
              value="$24,500"
            />
            <ListItem
              lead={{ kind: "icon", icon: <CartBoldDuotone size={20} />, color: "cyan", variant: "neutral" }}
              title="项目概览"
              subtitle="辅助文字"
              trend="10%"
              trendDirection="up"
            />
          </div>
        </SubSection>
      </Section>

      <Section
        title="1 Column"
        description="DescriptionItem：label + content + 可选 actions，支持 icon 或 Square Img lead"
      >
        <SubSection title="样式">
          <div className="w-full grid grid-cols-2 gap-x-6 gap-y-5">
            <DescriptionItem
              lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple", variant: "neutral" }}
              label="项目概览"
              content="在此放置内容"
            />
            <DescriptionItem
              lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple", variant: "neutral" }}
              label="项目概览"
              content="在此放置内容"
              actions={kebabActions}
            />
            <DescriptionItem
              lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple", variant: "neutral" }}
              label="项目概览"
              content={<Label color="green" size="sm" variant="outline">绿色</Label>}
            />
            <DescriptionItem
              lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple", variant: "neutral" }}
              label="项目概览"
              content={<Label color="green" size="sm" variant="outline">绿色</Label>}
              actions={kebabActions}
            />
            <DescriptionItem
              lead={{ kind: "image", src: squareImg }}
              label="项目概览"
              content="在此放置内容"
            />
            <DescriptionItem
              lead={{ kind: "image", src: squareImg }}
              label="项目概览"
              content="在此放置内容"
              actions={kebabActions}
            />
            <DescriptionItem
              lead={{ kind: "image", src: squareImg }}
              label="项目概览"
              content={<Label color="green" size="sm" variant="outline">绿色</Label>}
            />
            <DescriptionItem
              lead={{ kind: "image", src: squareImg }}
              label="项目概览"
              content={<Label color="green" size="sm" variant="outline">绿色</Label>}
              actions={kebabActions}
            />
          </div>
        </SubSection>
      </Section>

      <Section title="用户列表" description="Avatar + 可选 online / badge / actions">
        <SubSection title="样式">
          <div className="w-full grid grid-cols-2 gap-x-6 gap-y-5">
            <ListItem
              lead={{ kind: "avatar", initials: "JH", online: true }}
              title="周宁"
              subtitle="经理"
            />
            <ListItem
              lead={{ kind: "avatar", initials: "JH", online: true }}
              title="周宁"
              subtitle="经理"
              trailing={<NotificationBadge color="orange">99+</NotificationBadge>}
            />
            <ListItem
              lead={{ kind: "avatar", initials: "JH" }}
              title="周宁"
              subtitle="经理"
            />
            <ListItem
              lead={{ kind: "avatar", initials: "JH" }}
              title="周宁"
              subtitle="经理"
              trailing={
                <div className="flex items-center gap-2 text-fg-grey-700">
                  {kebabActions}
                </div>
              }
            />
            <ListItem
              lead={{ kind: "avatar", initials: "JH", online: true }}
              title="周宁"
              subtitle="经理"
              trailing={
                <div className="flex items-center gap-2 text-fg-grey-700">
                  {kebabActions}
                </div>
              }
            />
            <ListItem
              lead={{ kind: "avatar", initials: "JH" }}
              title="周宁"
              subtitle="经理"
              trailing={<NotificationBadge color="orange">99+</NotificationBadge>}
            />
          </div>
        </SubSection>
      </Section>

      <Section
        title="ListGroup · Without Tab"
        description="3 色横排：卡片 Header + close button + 彩色 Label badge + 多色 icon items"
      >
        <SubSection title="3 colors">
          {groupColors.map((color) => (
            <ListGroup
              key={color}
              title="标题"
              subtitle="示例文本"
              color={color}
              closable
              className="w-80"
              badge={
                <Label color={color === "black" ? "gray" : color} size="md" variant="outline">
                  {groupBadgeLabel[color]}
                </Label>
              }
              items={
                <>
                  {groupItems.map((it, i) => (
                    <ListItem
                      key={i}
                      lead={{ kind: "icon", icon: it.icon, color: it.color, variant: "light", size: "lg" }}
                      title="项目概览"
                      subtitle="辅助文字"
                      value="$24,500"
                      trend="10%"
                      trendDirection="up"
                    />
                  ))}
                </>
              }
            />
          ))}
        </SubSection>
      </Section>

      <Section
        title="ListGroup · With Tab"
        description="3 色横排：Segmented pill tab + Square Img items"
      >
        <SubSection title="3 colors">
          {groupColors.map((color) => (
            <ListGroupWithTabDemo key={color} color={color} />
          ))}
        </SubSection>
      </Section>
    </div>
  );
}

function ListGroupWithTabDemo({ color }: { color: AccentColor }) {
  const [tab, setTab] = useState("text1");
  return (
    <ListGroup
      title="标题"
      subtitle="示例文本"
      color={color}
      closable
      className="w-80"
      badge={
        <Label color={color === "black" ? "gray" : color} size="md" variant="outline">
          {groupBadgeLabel[color]}
        </Label>
      }
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
      items={
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <ListItem
              key={i}
              lead={{ kind: "image", src: squareImg }}
              title="项目概览"
              subtitle="辅助文字"
              value="$24,500"
              trend="10%"
              trendDirection="up"
            />
          ))}
        </>
      }
    />
  );
}
