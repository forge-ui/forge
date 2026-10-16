"use client";

import {
  AltArrowRightLinear,
  AltArrowLeftLinear,
  AddCircleLinear,
  CloseCircleLinear,
  PenLinear,
  HeartLinear,
  PlainLinear,
  PlayBoldDuotone,
  BookmarkLinear,
} from "@forge-ui-official/core/icons";
import {
  Button,
  IconButton,
  StyledLink,
  type ButtonColor,
  type ButtonVariant,
  type ButtonSize,
  type ButtonEffect,
  type IconButtonColor,
  type IconButtonVariant,
  type IconButtonSize,
  type IconButtonShape,
  type IconButtonEffect,
  type LinkColor,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

const buttonColors: ButtonColor[] = [
  "purple", "dark", "blue", "blue-dark", "red", "green", "yellow", "grey", "black",
];
const buttonVariants: ButtonVariant[] = ["primary", "secondary", "tertiary"];
const buttonSizes: ButtonSize[] = ["lg", "md", "sm"];
const buttonEffects: ButtonEffect[] = ["glass", "magnetic", "ripple", "roll"];

const iconButtonColors: IconButtonColor[] = [
  "purple", "dark", "blue", "blue-dark", "red", "green", "yellow", "grey", "black",
];
const iconButtonVariants: IconButtonVariant[] = ["primary", "secondary", "tertiary", "ghost"];
const iconButtonSizes: IconButtonSize[] = ["lg", "md", "sm"];
const iconButtonShapes: IconButtonShape[] = ["circle", "square"];
const iconButtonEffects: IconButtonEffect[] = ["send", "morph", "bookmark", "burst"];

const linkColors: LinkColor[] = [
  "purple", "dark", "blue", "green", "red", "orange", "yellow", "cyan", "gray",
];

const arrowRight = <AltArrowRightLinear size={16} color="currentColor" />;
const arrowLeft = <AltArrowLeftLinear size={16} color="currentColor" />;
const plus = <AddCircleLinear size={16} color="currentColor" />;
const close = <CloseCircleLinear size={16} color="currentColor" />;
const pen = <PenLinear size={18} color="currentColor" />;
const heart = <HeartLinear size={18} color="currentColor" />;

const effectLabel: Record<ButtonEffect, string> = {
  glass: "玻璃效果",
  magnetic: "箭头跟随",
  ripple: "涟漪",
  roll: "文字切换",
};
const iconEffectLabel: Record<IconButtonEffect, string> = {
  send: "发送",
  morph: "播放暂停",
  bookmark: "书签",
  burst: "点赞",
};

export default function ButtonLinkCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="按钮与链接"
        hint="把按钮、图标按钮和文字链接的全部变体放在一起对比。悬停可查看动效。"
      />

      <Section title="按钮样式" description="主要、次要、轻量三种样式，覆盖全部颜色。">
        {buttonColors.map((color) => (
          <SubSection key={color} title={color}>
            {buttonVariants.map((variant) => (
              <Labeled key={variant} label={variant}>
                <Button color={color} variant={variant} size="lg">确认</Button>
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      <Section title="按钮尺寸" description="大、中、小三种尺寸，以 Forge 蓝为例对照三种样式。">
        {buttonVariants.map((variant) => (
          <SubSection key={variant} title={variant}>
            {buttonSizes.map((size) => (
              <Labeled key={size} label={size}>
                <Button color="blue" variant={variant} size={size}>确认</Button>
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      <Section title="按钮图标" description="左侧图标、右侧图标和无图标，对照三种尺寸。">
        {buttonSizes.map((size) => (
          <SubSection key={size} title={size}>
            <Labeled label="左图标">
              <Button color="blue" variant="primary" size={size} iconLeft={plus}>添加</Button>
            </Labeled>
            <Labeled label="右图标">
              <Button color="blue" variant="primary" size={size} iconRight={arrowRight}>下一步</Button>
            </Labeled>
            <Labeled label="无图标">
              <Button color="blue" variant="primary" size={size}>确认</Button>
            </Labeled>
          </SubSection>
        ))}
      </Section>

      <Section title="按钮动效" description="玻璃效果、箭头跟随、涟漪和文字切换。玻璃效果要放在有内容的背景上才能看清。">
        <SubSection title="效果">
          {buttonEffects.map((effect) => (
            <Labeled key={effect} label={effectLabel[effect]}>
              <div className={effect === "glass" ? "rounded-2xl bg-fg-grey-100 px-6 py-4" : undefined}>
                <Button color="blue" effect={effect} iconRight={effect === "magnetic" ? arrowRight : undefined}>
                  {effect === "roll" ? "查看详情" : "确认更改"}
                </Button>
              </div>
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="处理状态">
          <Labeled label="处理中">
            <Button color="blue" loading>确认更改</Button>
          </Labeled>
          <Labeled label="已完成">
            <Button color="blue" result="success" resultLabel="已完成">确认更改</Button>
          </Labeled>
          <Labeled label="请重试">
            <Button color="blue" result="error" resultLabel="请重试">确认更改</Button>
          </Labeled>
        </SubSection>
      </Section>

      <Section title="长按确认" description="按住完成删除，松开即取消。对照未确认和已确认。">
        <SubSection title="hold">
          <Labeled label="未确认">
            <Button variant="hold" color="red" locale="zh">按住删除</Button>
          </Labeled>
          <Labeled label="已确认">
            <Button variant="hold" color="red" locale="zh" confirmed>按住删除</Button>
          </Labeled>
        </SubSection>
      </Section>

      <Section title="按钮禁用" description="每种样式和带图标的按钮都可以禁用。">
        <SubSection title="样式">
          {buttonVariants.map((variant) => (
            <Labeled key={variant} label={variant}>
              <Button color="blue" variant={variant} size="lg" disabled>确认</Button>
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="图标">
          <Labeled label="左图标">
            <Button color="blue" variant="primary" size="lg" iconLeft={plus} disabled>添加</Button>
          </Labeled>
          <Labeled label="右图标">
            <Button color="blue" variant="primary" size="lg" iconRight={arrowRight} disabled>下一步</Button>
          </Labeled>
        </SubSection>
      </Section>

      <Section title="图标按钮样式" description="主要、次要、轻量和幽灵四种样式，覆盖全部颜色。">
        {iconButtonColors.map((color) => (
          <SubSection key={color} title={color}>
            {iconButtonVariants.map((variant) => (
              <Labeled key={variant} label={variant}>
                <IconButton color={color} variant={variant} size="md" shape="circle" aria-label={variant}>
                  {pen}
                </IconButton>
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      <Section title="图标按钮尺寸与形状" description="圆形和方形，对照大、中、小。方形幽灵样式用于表格操作。">
        <SubSection title="圆形">
          {iconButtonSizes.map((size) => (
            <Labeled key={size} label={size}>
              <IconButton color="blue" variant="primary" size={size} shape="circle" aria-label={size}>{heart}</IconButton>
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="方形">
          {iconButtonSizes.map((size) => (
            <Labeled key={size} label={size}>
              <IconButton color="blue" variant="primary" size={size} shape="square" aria-label={size}>{heart}</IconButton>
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="方形幽灵">
          {iconButtonSizes.map((size) => (
            <Labeled key={size} label={size}>
              <IconButton color="grey" variant="ghost" size={size} shape="square" aria-label={size}>{pen}</IconButton>
            </Labeled>
          ))}
        </SubSection>
      </Section>

      <Section title="图标按钮形状与样式" description="圆形和方形搭配四种样式。">
        {iconButtonShapes.map((shape) => (
          <SubSection key={shape} title={shape}>
            {iconButtonVariants.map((variant) => (
              <Labeled key={variant} label={variant}>
                <IconButton color="blue" variant={variant} size="md" shape={shape} aria-label={`${shape} ${variant}`}>
                  {close}
                </IconButton>
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      <Section title="图标按钮动效" description="发送、播放暂停、书签和点赞。每项对照默认和激活。">
        {iconButtonEffects.map((effect) => (
          <SubSection key={effect} title={iconEffectLabel[effect]}>
            <Labeled label="默认">
              <IconButton color="blue" effect={effect} size="lg" aria-label={iconEffectLabel[effect]}>
                {effect === "send" ? <PlainLinear size={22} /> : effect === "morph" ? <PlayBoldDuotone size={22} /> : effect === "bookmark" ? <BookmarkLinear size={22} /> : <HeartLinear size={22} />}
              </IconButton>
            </Labeled>
            <Labeled label="激活">
              <IconButton color="blue" effect={effect} active size="lg" aria-label={`${iconEffectLabel[effect]}已激活`}>
                {effect === "send" ? <PlainLinear size={22} /> : effect === "morph" ? <PlayBoldDuotone size={22} /> : effect === "bookmark" ? <BookmarkLinear size={22} /> : <HeartLinear size={22} />}
              </IconButton>
            </Labeled>
          </SubSection>
        ))}
      </Section>

      <Section title="图标按钮禁用" description="四种样式的禁用状态。">
        <SubSection title="禁用">
          {iconButtonVariants.map((variant) => (
            <Labeled key={variant} label={variant}>
              <IconButton color="blue" variant={variant} size="md" shape="circle" disabled aria-label={variant}>{pen}</IconButton>
            </Labeled>
          ))}
        </SubSection>
      </Section>

      <Section title="链接颜色" description="全部颜色的文字链接，悬停出现下划线。">
        <SubSection title="颜色">
          {linkColors.map((color) => (
            <Labeled key={color} label={color}>
              <StyledLink href="#" color={color}>查看详情</StyledLink>
            </Labeled>
          ))}
        </SubSection>
      </Section>

      <Section title="链接图标" description="左侧和右侧图标。">
        <SubSection title="右侧">
          <Labeled label="箭头">
            <StyledLink href="#" color="blue" iconRight={arrowRight}>查看详情</StyledLink>
          </Labeled>
          <Labeled label="关闭">
            <StyledLink href="#" color="red" iconRight={close}>关闭</StyledLink>
          </Labeled>
        </SubSection>
        <SubSection title="左侧">
          <Labeled label="返回">
            <StyledLink href="#" color="blue" iconLeft={arrowLeft}>返回</StyledLink>
          </Labeled>
          <Labeled label="新建">
            <StyledLink href="#" color="green" iconLeft={plus}>新建</StyledLink>
          </Labeled>
        </SubSection>
      </Section>

      <Section title="链接动效" description="箭头跟随和文字切换。">
        <SubSection title="效果">
          <Labeled label="箭头跟随">
            <StyledLink href="#" color="blue" effect="magnetic" iconRight={arrowRight}>打开项目</StyledLink>
          </Labeled>
          <Labeled label="文字切换">
            <StyledLink href="#" color="blue" effect="roll">查看详情</StyledLink>
          </Labeled>
        </SubSection>
      </Section>

      <Section title="链接禁用" description="每种颜色都可以禁用。">
        <SubSection title="禁用">
          {linkColors.map((color) => (
            <Labeled key={color} label={color}>
              <StyledLink href="#" color={color} disabled>查看详情</StyledLink>
            </Labeled>
          ))}
        </SubSection>
      </Section>
    </div>
  );
}
