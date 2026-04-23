"use client";

import {
  AltArrowRightLinear,
  AltArrowLeftLinear,
  AddCircleLinear,
  CloseCircleLinear,
  PenLinear,
  HeartLinear,
} from "solar-icon-set";
import {
  Button,
  IconButton,
  StyledLink,
  type ButtonColor,
  type ButtonVariant,
  type ButtonSize,
  type IconButtonColor,
  type IconButtonVariant,
  type IconButtonSize,
  type IconButtonShape,
  type LinkColor,
} from "@forge-ui/react";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

const buttonColors: ButtonColor[] = [
  "purple", "dark", "blue", "blue-dark", "red", "green", "yellow", "grey", "black",
];
const buttonVariants: ButtonVariant[] = ["primary", "secondary", "tertiary"];
const buttonSizes: ButtonSize[] = ["lg", "md", "sm"];

const iconButtonColors: IconButtonColor[] = [
  "purple", "dark", "blue", "blue-dark", "red", "green", "yellow", "grey", "black",
];
const iconButtonVariants: IconButtonVariant[] = [
  "primary", "secondary", "tertiary", "ghost",
];
const iconButtonSizes: IconButtonSize[] = ["lg", "md", "sm"];
const iconButtonShapes: IconButtonShape[] = ["circle", "square"];

const linkColors: LinkColor[] = [
  "purple", "dark", "blue", "green", "red", "orange", "yellow", "cyan", "gray",
];

const arrowRight = <AltArrowRightLinear size={16} color="currentColor" />;
const arrowLeft = <AltArrowLeftLinear size={16} color="currentColor" />;
const plus = <AddCircleLinear size={16} color="currentColor" />;
const close = <CloseCircleLinear size={16} color="currentColor" />;
const pen = <PenLinear size={18} color="currentColor" />;
const heart = <HeartLinear size={18} color="currentColor" />;

export default function ButtonLinkCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Button & Link"
        hint="Button / IconButton / StyledLink — 文字按钮、图标按钮、文字链接。"
      />

      {/* ============ Button - Variants ============ */}
      <Section
        title="Button - Variants"
        description="primary / secondary / tertiary 三种变体 × 9 色 × 3 尺寸。"
      >
        {buttonColors.map((c) => (
          <SubSection key={c} title={`Color: ${c}`}>
            {buttonVariants.map((v) => (
              <Labeled key={v} label={v}>
                <Button color={c} variant={v} size="lg">
                  Text Here
                </Button>
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      {/* ============ Button - Sizes ============ */}
      <Section
        title="Button - Sizes"
        description="lg / md / sm 三种尺寸 × primary 变体（purple）。"
      >
        <SubSection title="Primary (purple)">
          {buttonSizes.map((s) => (
            <Labeled key={s} label={s}>
              <Button color="purple" variant="primary" size={s}>
                Text Here
              </Button>
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Secondary (purple)">
          {buttonSizes.map((s) => (
            <Labeled key={s} label={s}>
              <Button color="purple" variant="secondary" size={s}>
                Text Here
              </Button>
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Tertiary (purple)">
          {buttonSizes.map((s) => (
            <Labeled key={s} label={s}>
              <Button color="purple" variant="tertiary" size={s}>
                Text Here
              </Button>
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ Button - With Icon ============ */}
      <Section
        title="Button - With Icon"
        description="左图标 / 右图标 / 无图标，搭配 primary 变体 × 3 尺寸。"
      >
        {buttonSizes.map((s) => (
          <SubSection key={s} title={`Size: ${s}`}>
            <Labeled label="icon-left">
              <Button color="purple" variant="primary" size={s} iconLeft={plus}>
                Add Item
              </Button>
            </Labeled>
            <Labeled label="icon-right">
              <Button color="purple" variant="primary" size={s} iconRight={arrowRight}>
                Next
              </Button>
            </Labeled>
            <Labeled label="no-icon">
              <Button color="purple" variant="primary" size={s}>
                Text Here
              </Button>
            </Labeled>
          </SubSection>
        ))}
      </Section>

      {/* ============ Button - Disabled ============ */}
      <Section
        title="Button - Disabled"
        description="opacity-60 + cursor-not-allowed；每个变体都支持 disabled。"
      >
        <SubSection title="Disabled (purple)">
          {buttonVariants.map((v) => (
            <Labeled key={v} label={v}>
              <Button color="purple" variant={v} size="lg" disabled>
                Text Here
              </Button>
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Disabled with icon">
          <Labeled label="icon-left">
            <Button color="purple" variant="primary" size="lg" iconLeft={plus} disabled>
              Add Item
            </Button>
          </Labeled>
          <Labeled label="icon-right">
            <Button color="purple" variant="primary" size="lg" iconRight={arrowRight} disabled>
              Next
            </Button>
          </Labeled>
        </SubSection>
      </Section>

      {/* ============ Icon Button - Variants ============ */}
      <Section
        title="Icon Button - Variants"
        description="primary / secondary / tertiary / ghost × 9 色 × 3 尺寸 × 2 shape。"
      >
        {iconButtonColors.map((c) => (
          <SubSection key={c} title={`Color: ${c}`}>
            {iconButtonVariants.map((v) => (
              <Labeled key={v} label={v}>
                <IconButton color={c} variant={v} size="md" shape="circle">
                  {pen}
                </IconButton>
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      {/* ============ Icon Button - Sizes × Shape ============ */}
      <Section
        title="Icon Button - Sizes & Shape"
        description="3 尺寸 × 2 shape（circle / square）。square 用于表格 actions 列。"
      >
        <SubSection title="Circle (purple, primary)">
          {iconButtonSizes.map((s) => (
            <Labeled key={s} label={s}>
              <IconButton color="purple" variant="primary" size={s} shape="circle">
                {heart}
              </IconButton>
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Square (purple, primary)">
          {iconButtonSizes.map((s) => (
            <Labeled key={s} label={s}>
              <IconButton color="purple" variant="primary" size={s} shape="square">
                {heart}
              </IconButton>
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Square ghost (actions 列典型用法)">
          {(["sm", "md", "lg"] as const).map((s) => (
            <Labeled key={s} label={s}>
              <IconButton color="grey" variant="ghost" size={s} shape="square">
                {pen}
              </IconButton>
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ Icon Button - Shapes 全矩阵 ============ */}
      <Section
        title="Icon Button - Shape × Variant"
        description="circle / square 搭配 4 种 variant（purple, md）。"
      >
        {iconButtonShapes.map((shape) => (
          <SubSection key={shape} title={`Shape: ${shape}`}>
            {iconButtonVariants.map((v) => (
              <Labeled key={v} label={v}>
                <IconButton color="purple" variant={v} size="md" shape={shape}>
                  {close}
                </IconButton>
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      {/* ============ Icon Button - Disabled ============ */}
      <Section title="Icon Button - Disabled" description="opacity-60 + 禁点击。">
        <SubSection title="Disabled (purple)">
          {iconButtonVariants.map((v) => (
            <Labeled key={v} label={v}>
              <IconButton color="purple" variant={v} size="md" shape="circle" disabled>
                {pen}
              </IconButton>
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ Link - Colors ============ */}
      <Section
        title="Link - Colors"
        description="9 色文字链接，hover 下划线。"
      >
        <SubSection title="Plain link (hover 显示下划线)">
          {linkColors.map((c) => (
            <Labeled key={c} label={c}>
              <StyledLink href="#" color={c}>
                Link Text
              </StyledLink>
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ Link - With Icon ============ */}
      <Section
        title="Link - With Icon"
        description="左 / 右图标组合（箭头 / close）。"
      >
        <SubSection title="Icon right (purple)">
          <Labeled label="arrow-right">
            <StyledLink href="#" color="purple" iconRight={arrowRight}>
              Read more
            </StyledLink>
          </Labeled>
          <Labeled label="close">
            <StyledLink href="#" color="red" iconRight={close}>
              Dismiss
            </StyledLink>
          </Labeled>
        </SubSection>
        <SubSection title="Icon left (blue)">
          <Labeled label="arrow-left">
            <StyledLink href="#" color="blue" iconLeft={arrowLeft}>
              Go back
            </StyledLink>
          </Labeled>
          <Labeled label="plus">
            <StyledLink href="#" color="green" iconLeft={plus}>
              New item
            </StyledLink>
          </Labeled>
        </SubSection>
      </Section>

      {/* ============ Link - Disabled ============ */}
      <Section title="Link - Disabled" description="disabled 状态 opacity-60、无 hover、不可点击。">
        <SubSection title="Disabled per color">
          {linkColors.map((c) => (
            <Labeled key={c} label={c}>
              <StyledLink href="#" color={c} disabled>
                Link Text
              </StyledLink>
            </Labeled>
          ))}
        </SubSection>
      </Section>
    </div>
  );
}
