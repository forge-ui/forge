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
} from "solar-icon-set";
import { PageHeading, Section, SubSection } from "../_shared";

const groupColors = ["purple", "blue", "black"] as const satisfies readonly AccentColor[];

const groupBadgeLabel: Record<AccentColor, string> = {
  purple: "Purple",
  blue: "Blue",
  black: "Black",
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
  { value: "text1", label: "Text Here" },
  { value: "text2", label: "Text Here" },
  { value: "text3", label: "Text Here" },
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
      <PageHeading title="List" hint="ListItem · DescriptionItem · ListGroup" />

      <Section
        title="2 Column"
        description="ListItem 尾部变体（Grey BG icon + 多种 tail 组合）"
      >
        <SubSection title="Variants">
          <div className="w-full grid grid-cols-2 gap-x-6 gap-y-5">
            <ListItem
              lead={{ kind: "icon", icon: greyIconRows[0].icon, color: greyIconRows[0].color, variant: "neutral" }}
              title="Title Here"
              subtitle="Subtext"
              value="$24,500"
              trend="10%"
              trendDirection="up"
            />
            <ListItem
              lead={{ kind: "icon", icon: greyIconRows[1].icon, color: greyIconRows[1].color, variant: "neutral" }}
              title="Title Here"
              subtitle="Subtext"
              value="$24,500"
              tailSubtext="Subtext"
            />
            <ListItem
              lead={{ kind: "icon", icon: greyIconRows[2].icon, color: greyIconRows[2].color, variant: "neutral" }}
              title="Title Here"
              subtitle="Subtext"
              value="$24,500"
            />
            <ListItem
              lead={{ kind: "icon", icon: greyIconRows[3].icon, color: greyIconRows[3].color, variant: "neutral" }}
              title="Title Here"
              value="$24,500"
              trend="10%"
              trendDirection="up"
            />
            <ListItem
              lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "yellow", variant: "neutral" }}
              title="Title Here"
              value="$24,500"
            />
            <ListItem
              lead={{ kind: "icon", icon: <CartBoldDuotone size={20} />, color: "cyan", variant: "neutral" }}
              title="Title Here"
              subtitle="Subtext"
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
        <SubSection title="Variants">
          <div className="w-full grid grid-cols-2 gap-x-6 gap-y-5">
            <DescriptionItem
              lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple", variant: "neutral" }}
              label="Title Here"
              content="Your content here"
            />
            <DescriptionItem
              lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple", variant: "neutral" }}
              label="Title Here"
              content="Your content here"
              actions={kebabActions}
            />
            <DescriptionItem
              lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple", variant: "neutral" }}
              label="Title Here"
              content={<Label color="green" size="sm" variant="outline">Green</Label>}
            />
            <DescriptionItem
              lead={{ kind: "icon", icon: <WalletBoldDuotone size={20} />, color: "purple", variant: "neutral" }}
              label="Title Here"
              content={<Label color="green" size="sm" variant="outline">Green</Label>}
              actions={kebabActions}
            />
            <DescriptionItem
              lead={{ kind: "image", src: squareImg }}
              label="Title Here"
              content="Your content here"
            />
            <DescriptionItem
              lead={{ kind: "image", src: squareImg }}
              label="Title Here"
              content="Your content here"
              actions={kebabActions}
            />
            <DescriptionItem
              lead={{ kind: "image", src: squareImg }}
              label="Title Here"
              content={<Label color="green" size="sm" variant="outline">Green</Label>}
            />
            <DescriptionItem
              lead={{ kind: "image", src: squareImg }}
              label="Title Here"
              content={<Label color="green" size="sm" variant="outline">Green</Label>}
              actions={kebabActions}
            />
          </div>
        </SubSection>
      </Section>

      <Section title="User List" description="Avatar + 可选 online / badge / actions">
        <SubSection title="Variants">
          <div className="w-full grid grid-cols-2 gap-x-6 gap-y-5">
            <ListItem
              lead={{ kind: "avatar", initials: "JH", online: true }}
              title="Jay Hargudson"
              subtitle="Manager"
            />
            <ListItem
              lead={{ kind: "avatar", initials: "JH", online: true }}
              title="Jay Hargudson"
              subtitle="Manager"
              trailing={<NotificationBadge color="orange">99+</NotificationBadge>}
            />
            <ListItem
              lead={{ kind: "avatar", initials: "JH" }}
              title="Jay Hargudson"
              subtitle="Manager"
            />
            <ListItem
              lead={{ kind: "avatar", initials: "JH" }}
              title="Jay Hargudson"
              subtitle="Manager"
              trailing={
                <div className="flex items-center gap-2 text-fg-grey-700">
                  {kebabActions}
                </div>
              }
            />
            <ListItem
              lead={{ kind: "avatar", initials: "JH", online: true }}
              title="Jay Hargudson"
              subtitle="Manager"
              trailing={
                <div className="flex items-center gap-2 text-fg-grey-700">
                  {kebabActions}
                </div>
              }
            />
            <ListItem
              lead={{ kind: "avatar", initials: "JH" }}
              title="Jay Hargudson"
              subtitle="Manager"
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
              title="Title"
              subtitle="Text Here"
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
                      title="Title Here"
                      subtitle="Subtext"
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
      title="Title"
      subtitle="Text Here"
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
              title="Title Here"
              subtitle="Subtext"
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
