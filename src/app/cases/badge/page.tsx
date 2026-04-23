import { BellBoldDuotone } from "solar-icon-set";
import {
  NotificationBadge,
  Label,
  CircleIcon,
  ArtisticIcon,
  type NotificationBadgeColor,
  type LabelColor,
  type LabelSize,
  type LabelVariant,
  type CircleIconColor,
  type CircleIconSize,
  type CircleIconVariant,
  type ArtisticIconColor,
  type ArtisticIconVariant,
} from "@forge-ui/react";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

const notificationColors: NotificationBadgeColor[] = [
  "purple", "orange", "green", "yellow", "cyan", "black",
];

const labelColors: LabelColor[] = [
  "purple", "blue", "cyan", "green", "red", "yellow", "gray",
];
const labelSizes: LabelSize[] = ["sm", "md", "lg"];
const labelVariants: LabelVariant[] = ["outline", "solid"];

const circleColors: CircleIconColor[] = [
  "purple", "blue", "red", "orange", "green", "yellow", "cyan", "black",
];
const circleSizes: CircleIconSize[] = ["xs", "sm", "md", "lg"];
const circleVariants: CircleIconVariant[] = ["solid", "light", "neutral"];

const artisticColors: ArtisticIconColor[] = [
  "black", "blue", "purple", "green", "red", "yellow", "cyan",
];
const artisticVariants: ArtisticIconVariant[] = ["gradient", "orbs"];

// solar icon 默认带 inline color，variant 内部需要手动传 color 才能跟随主题
function DemoGlyph({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return <BellBoldDuotone size={size} color={color} />;
}

export default function BadgeCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Badge"
        hint="NotificationBadge / Label / CircleIcon / ArtisticIcon — 圆形数字徽章、文字标签、图标容器、渐变装饰。"
      />

      {/* ============ NotificationBadge ============ */}
      <Section title="Notification" description="圆形数字徽章，6 色。">
        <SubSection title="Colors">
          {notificationColors.map((c) => (
            <Labeled key={c} label={c}>
              <NotificationBadge color={c}>99+</NotificationBadge>
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ Label ============ */}
      <Section title="Label" description="文字标签，7 色 × 3 size × 2 variant。">
        <SubSection title="Variants (purple, md)">
          {labelVariants.map((v) => (
            <Labeled key={v} label={v}>
              <Label color="purple" variant={v} size="md">Purple</Label>
            </Labeled>
          ))}
        </SubSection>

        <SubSection title="Sizes (purple, outline)">
          {labelSizes.map((s) => (
            <Labeled key={s} label={s}>
              <Label color="purple" variant="outline" size={s}>Purple</Label>
            </Labeled>
          ))}
        </SubSection>

        <SubSection title="Colors (md, outline)">
          {labelColors.map((c) => (
            <Labeled key={c} label={c}>
              <Label color={c} variant="outline" size="md">{c}</Label>
            </Labeled>
          ))}
        </SubSection>

        <SubSection title="Colors (md, solid)">
          {labelColors.map((c) => (
            <Labeled key={c} label={c}>
              <Label color={c} variant="solid" size="md">{c}</Label>
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ CircleIcon ============ */}
      <Section title="Circle Icon" description="圆形图标容器，8 色 × 4 size × 3 variant。">
        <SubSection title="Variants (purple, md)">
          {circleVariants.map((v) => (
            <Labeled key={v} label={v}>
              <CircleIcon color="purple" variant={v} size="md">
                <DemoGlyph size={16} color={v === "solid" ? "#FFFFFF" : "currentColor"} />
              </CircleIcon>
            </Labeled>
          ))}
        </SubSection>

        <SubSection title="Sizes (purple, solid)">
          {circleSizes.map((s) => {
            const iconSize = { xs: 12, sm: 14, md: 16, lg: 20 }[s];
            return (
              <Labeled key={s} label={s}>
                <CircleIcon color="purple" variant="solid" size={s}>
                  <DemoGlyph size={iconSize} color="#FFFFFF" />
                </CircleIcon>
              </Labeled>
            );
          })}
        </SubSection>

        <SubSection title="Colors (md, solid)">
          {circleColors.map((c) => (
            <Labeled key={c} label={c}>
              <CircleIcon color={c} variant="solid" size="md">
                <DemoGlyph size={16} color="#FFFFFF" />
              </CircleIcon>
            </Labeled>
          ))}
        </SubSection>

        <SubSection title="Colors (md, light)">
          {circleColors.map((c) => (
            <Labeled key={c} label={c}>
              <CircleIcon color={c} variant="light" size="md">
                <DemoGlyph size={16} color="currentColor" />
              </CircleIcon>
            </Labeled>
          ))}
        </SubSection>

        <SubSection title="Colors (md, neutral)">
          {circleColors.map((c) => (
            <Labeled key={c} label={c}>
              <CircleIcon color={c} variant="neutral" size="md">
                <DemoGlyph size={16} color="currentColor" />
              </CircleIcon>
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ ArtisticIcon ============ */}
      <Section title="Artistic Icon" description="渐变 / 发光装饰圆形图标，7 色 × 2 variant。">
        <SubSection title="Variants (purple)">
          {artisticVariants.map((v) => (
            <Labeled key={v} label={v}>
              <ArtisticIcon color="purple" variant={v}>
                <DemoGlyph size={24} color="#FFFFFF" />
              </ArtisticIcon>
            </Labeled>
          ))}
        </SubSection>

        <SubSection title="Colors (gradient)">
          {artisticColors.map((c) => (
            <Labeled key={c} label={c}>
              <ArtisticIcon color={c} variant="gradient">
                <DemoGlyph size={24} color="#FFFFFF" />
              </ArtisticIcon>
            </Labeled>
          ))}
        </SubSection>

        <SubSection title="Colors (orbs)">
          {artisticColors.map((c) => (
            <Labeled key={c} label={c}>
              <ArtisticIcon color={c} variant="orbs">
                <DemoGlyph size={24} color="#FFFFFF" />
              </ArtisticIcon>
            </Labeled>
          ))}
        </SubSection>
      </Section>
    </div>
  );
}
