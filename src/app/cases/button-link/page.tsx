"use client";

import { useRef, useState, type KeyboardEvent } from "react";
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
  Toggle,
  type ButtonColor,
  type ButtonEffect,
  type ButtonSize,
  type ButtonVariant,
  type IconButtonEffect,
  type IconButtonShape,
  type IconButtonVariant,
  type LinkColor,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

type Swatch<T extends string> = {
  value: T;
  semantic: string;
  token: string;
  swatch: string;
};

const BUTTON_SWATCHES: readonly Swatch<ButtonColor>[] = [
  { value: "purple", semantic: "品牌", token: "--fg-violet", swatch: "bg-fg-violet" },
  { value: "dark", semantic: "强调", token: "--fg-violet-800", swatch: "bg-fg-violet-800" },
  { value: "blue", semantic: "信息", token: "--fg-blue", swatch: "bg-fg-blue" },
  { value: "blue-dark", semantic: "重点", token: "--fg-blue-800", swatch: "bg-fg-blue-800" },
  { value: "red", semantic: "警示", token: "--fg-red", swatch: "bg-fg-red" },
  { value: "green", semantic: "成功", token: "--fg-green-500", swatch: "bg-fg-green-500" },
  { value: "yellow", semantic: "警告", token: "--fg-yellow", swatch: "bg-fg-yellow" },
  { value: "grey", semantic: "中性", token: "--fg-grey-700", swatch: "bg-fg-grey-700" },
  { value: "black", semantic: "深色", token: "--fg-black", swatch: "bg-fg-black" },
];

const LINK_SWATCHES: readonly Swatch<LinkColor>[] = [
  { value: "purple", semantic: "品牌", token: "--fg-violet", swatch: "bg-fg-violet" },
  { value: "dark", semantic: "强调", token: "--fg-violet-800", swatch: "bg-fg-violet-800" },
  { value: "blue", semantic: "信息", token: "--fg-blue", swatch: "bg-fg-blue" },
  { value: "green", semantic: "成功", token: "--fg-green-500", swatch: "bg-fg-green-500" },
  { value: "red", semantic: "警示", token: "--fg-red", swatch: "bg-fg-red" },
  { value: "orange", semantic: "提醒", token: "--fg-yellow-900", swatch: "bg-fg-yellow-900" },
  { value: "yellow", semantic: "警告", token: "--fg-yellow", swatch: "bg-fg-yellow" },
  { value: "cyan", semantic: "关注", token: "--fg-cyan-500", swatch: "bg-fg-cyan-500" },
  { value: "gray", semantic: "中性", token: "--fg-grey-700", swatch: "bg-fg-grey-700" },
];

const SIZES: readonly { value: ButtonSize; semantic: string }[] = [
  { value: "lg", semantic: "大" },
  { value: "md", semantic: "中" },
  { value: "sm", semantic: "小" },
];

const VARIANTS: readonly { value: Exclude<ButtonVariant, "hold">; semantic: string }[] = [
  { value: "primary", semantic: "主要" },
  { value: "secondary", semantic: "次要" },
  { value: "tertiary", semantic: "轻量" },
];

const SHAPES: readonly { value: IconButtonShape; semantic: string }[] = [
  { value: "circle", semantic: "圆形" },
  { value: "square", semantic: "方形" },
];

const buttonEffects: ButtonEffect[] = ["glass", "magnetic", "ripple", "roll"];
const iconEffects: IconButtonEffect[] = ["send", "morph", "bookmark", "burst"];

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

function swatchStyle(selected: boolean, token: string, neutral: boolean) {
  return {
    width: 24,
    height: 24,
    outline: selected ? `2px solid var(${token})` : neutral ? "1px solid var(--fg-grey-300)" : "none",
    outlineOffset: selected ? 2 : 0,
    transform: selected ? "scale(1.1)" : "none",
    transition: "none",
  };
}

function ColorSwatches<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly Swatch<T>[];
  onChange: (value: T) => void;
}) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(0, options.findIndex((item) => item.value === value));
  const current = options[index];

  function select(next: number) {
    const item = options[next];
    if (!item) return;
    onChange(item.value);
    buttons.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const key = event.key;
    if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "ArrowUp" && key !== "ArrowDown" && key !== "Home" && key !== "End") return;
    event.preventDefault();
    if (key === "Home") {
      select(0);
      return;
    }
    if (key === "End") {
      select(options.length - 1);
      return;
    }
    const delta = key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1;
    select((index + delta + options.length) % options.length);
  }

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 p-2">
      <div
        role="radiogroup"
        aria-label={label}
        aria-orientation="horizontal"
        className="flex items-center"
        style={{ gap: 8 }}
        onKeyDown={onKeyDown}
      >
        {options.map((item, itemIndex) => {
          const selected = item.value === value;
          return (
            <button
              key={item.value}
              ref={(node) => {
                buttons.current[itemIndex] = node;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={item.semantic}
              title={item.semantic}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(itemIndex)}
              className={`shrink-0 cursor-pointer rounded-full border-0 p-0 ${item.swatch}`}
              style={swatchStyle(selected, item.token, item.value === "grey" || item.value === "gray" || item.value === "yellow")}
            />
          );
        })}
      </div>
      <p className="text-sm text-fg-grey-700" aria-live="polite">
        当前：{current.semantic}
      </p>
    </div>
  );
}

function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { value: T; semantic: string }[];
  onChange: (value: T) => void;
}) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const key = event.key;
    if (key !== "ArrowLeft" && key !== "ArrowRight") return;
    event.preventDefault();
    const index = options.findIndex((item) => item.value === value);
    const delta = key === "ArrowLeft" ? -1 : 1;
    const nextIndex = (index + delta + options.length) % options.length;
    onChange(options[nextIndex].value);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')[nextIndex]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex flex-wrap gap-2"
      onKeyDown={onKeyDown}
    >
      {options.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={item.semantic}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${selected ? "bg-fg-black text-white" : "bg-white text-fg-grey-700 outline outline-1 outline-fg-grey-200"}`}
          >
            {item.semantic}
          </button>
        );
      })}
    </div>
  );
}

function iconFor(effect: IconButtonEffect) {
  if (effect === "send") return <PlainLinear size={22} />;
  if (effect === "morph") return <PlayBoldDuotone size={22} />;
  if (effect === "bookmark") return <BookmarkLinear size={22} />;
  return <HeartLinear size={22} />;
}

export default function ButtonLinkCasePage() {
  const [color, setColor] = useState<ButtonColor>("blue");
  const [linkColor, setLinkColor] = useState<LinkColor>("blue");
  const [size, setSize] = useState<ButtonSize>("lg");
  const [variant, setVariant] = useState<Exclude<ButtonVariant, "hold">>("primary");
  const [shape, setShape] = useState<IconButtonShape>("circle");
  const [ghost, setGhost] = useState(false);
  const iconVariant: IconButtonVariant = ghost ? "ghost" : variant;

  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="按钮与链接"
        hint="颜色、尺寸和样式从上方切换。下面只保留文字、图标、状态和动效这些结构。"
      />

      <Section title="外观" description="按钮和图标按钮共用一组主色。链接色板单独切换。左右方向键可移动选中项。">
        <SubSection title="按钮主色" stack>
          <ColorSwatches label="按钮主色" value={color} options={BUTTON_SWATCHES} onChange={setColor} />
        </SubSection>
        <SubSection title="链接主色" stack>
          <ColorSwatches label="链接主色" value={linkColor} options={LINK_SWATCHES} onChange={setLinkColor} />
        </SubSection>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <ChoiceGroup label="尺寸" value={size} options={SIZES} onChange={setSize} />
          <ChoiceGroup label="样式" value={variant} options={VARIANTS} onChange={setVariant} />
          <ChoiceGroup label="图标形状" value={shape} options={SHAPES} onChange={setShape} />
          <label className="flex items-center gap-2 text-sm font-medium text-fg-grey-900">
            幽灵
            <Toggle checked={ghost} onChange={setGhost} ariaLabel="幽灵" color="black" size="sm" />
          </label>
        </div>
      </Section>

      <Section title="按钮" description="文字、图标、禁用、动效和处理状态跟随当前主色、尺寸和样式。长按确认跟随主色和尺寸。">
        <SubSection title="文字">
          <Button color={color} variant={variant} size={size}>确认</Button>
        </SubSection>
        <SubSection title="图标">
          <Labeled label="左图标">
            <Button color={color} variant={variant} size={size} iconLeft={plus}>添加</Button>
          </Labeled>
          <Labeled label="右图标">
            <Button color={color} variant={variant} size={size} iconRight={arrowRight}>下一步</Button>
          </Labeled>
          <Labeled label="无图标">
            <Button color={color} variant={variant} size={size}>确认</Button>
          </Labeled>
        </SubSection>
        <SubSection title="禁用">
          <Labeled label="文字">
            <Button color={color} variant={variant} size={size} disabled>确认</Button>
          </Labeled>
          <Labeled label="左图标">
            <Button color={color} variant={variant} size={size} iconLeft={plus} disabled>添加</Button>
          </Labeled>
        </SubSection>
        <SubSection title="动效">
          {buttonEffects.map((effect) => (
            <Labeled key={effect} label={effectLabel[effect]}>
              <div className={effect === "glass" ? "rounded-2xl bg-fg-grey-100 px-6 py-4" : undefined}>
                <Button color={color} variant={variant} size={size} effect={effect} iconRight={effect === "magnetic" ? arrowRight : undefined}>
                  {effect === "roll" ? "查看详情" : "确认更改"}
                </Button>
              </div>
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="处理状态">
          <Labeled label="处理中">
            <Button color={color} variant={variant} size={size} loading>确认更改</Button>
          </Labeled>
          <Labeled label="已完成">
            <Button color={color} variant={variant} size={size} result="success" resultLabel="已完成">确认更改</Button>
          </Labeled>
          <Labeled label="请重试">
            <Button color={color} variant={variant} size={size} result="error" resultLabel="请重试">确认更改</Button>
          </Labeled>
        </SubSection>
        <SubSection title="长按确认">
          <Labeled label="未确认">
            <Button variant="hold" color={color} size={size} locale="zh">按住删除</Button>
          </Labeled>
          <Labeled label="已确认">
            <Button variant="hold" color={color} size={size} locale="zh" confirmed>按住删除</Button>
          </Labeled>
        </SubSection>
      </Section>

      <Section title="图标按钮" description="形状跟随上方选择。打开幽灵后，图标按钮改为透明底，文字按钮仍用主要、次要或轻量。">
        <SubSection title="形状">
          <IconButton color={color} variant={iconVariant} size={size} shape={shape} aria-label="编辑">
            {shape === "square" && ghost ? pen : heart}
          </IconButton>
        </SubSection>
        <SubSection title="禁用">
          <IconButton color={color} variant={iconVariant} size={size} shape={shape} disabled aria-label="编辑已禁用">
            {pen}
          </IconButton>
        </SubSection>
        <SubSection title="动效">
          {iconEffects.map((effect) => (
            <Labeled key={effect} label={iconEffectLabel[effect]}>
              <div className="flex items-center gap-3">
                <IconButton color={color} variant={iconVariant} shape={shape} effect={effect} size={size} aria-label={iconEffectLabel[effect]}>
                  {iconFor(effect)}
                </IconButton>
                <IconButton color={color} variant={iconVariant} shape={shape} effect={effect} active size={size} aria-label={`${iconEffectLabel[effect]}已激活`}>
                  {iconFor(effect)}
                </IconButton>
              </div>
            </Labeled>
          ))}
        </SubSection>
      </Section>

      <Section title="链接" description="文字、左右图标、动效和禁用跟随链接主色。">
        <SubSection title="文字">
          <StyledLink href="#" color={linkColor}>查看详情</StyledLink>
        </SubSection>
        <SubSection title="图标">
          <Labeled label="下一步">
            <StyledLink href="#" color={linkColor} iconRight={arrowRight}>查看详情</StyledLink>
          </Labeled>
          <Labeled label="关闭">
            <StyledLink href="#" color={linkColor} iconRight={close}>关闭</StyledLink>
          </Labeled>
          <Labeled label="返回">
            <StyledLink href="#" color={linkColor} iconLeft={arrowLeft}>返回</StyledLink>
          </Labeled>
          <Labeled label="新建">
            <StyledLink href="#" color={linkColor} iconLeft={plus}>新建</StyledLink>
          </Labeled>
        </SubSection>
        <SubSection title="动效">
          <Labeled label="箭头跟随">
            <StyledLink href="#" color={linkColor} effect="magnetic" iconRight={arrowRight}>打开项目</StyledLink>
          </Labeled>
          <Labeled label="文字切换">
            <StyledLink href="#" color={linkColor} effect="roll">查看详情</StyledLink>
          </Labeled>
        </SubSection>
        <SubSection title="禁用">
          <StyledLink href="#" color={linkColor} disabled>查看详情</StyledLink>
        </SubSection>
      </Section>
    </div>
  );
}
