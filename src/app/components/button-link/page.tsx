import Link from "next/link";
import { Button, IconButton, StyledLink, ButtonGroup } from "@forge-ui-official/core";
import {
  StarLinear,
  ArrowRightLinear,
  HeartLinear,
  TrashBinTrashLinear,
  AddCircleLinear,
} from "solar-icon-set";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

// ─── Button 段落使用的代码片段（与 Preview JSX 手动对齐） ───

const CODE_IMPORT = `import { Button, IconButton, StyledLink, ButtonGroup } from "@forge-ui-official/core";`;

const CODE_BUTTON_USAGE = `<Button>Button</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>`;

const CODE_BUTTON_SIZES = `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`;

const CODE_BUTTON_COLORS = `<Button color="purple">Purple</Button>
<Button color="dark">Dark</Button>
<Button color="blue">Blue</Button>
<Button color="blue-dark">Blue Dark</Button>
<Button color="red">Red</Button>
<Button color="green">Green</Button>
<Button color="yellow">Yellow</Button>
<Button color="grey">Grey</Button>
<Button color="black">Black</Button>`;

const CODE_BUTTON_VARIANTS = `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>`;

const CODE_BUTTON_ICON = `<Button iconLeft={<StarLinear size={16} />}>Star it</Button>
<Button iconRight={<ArrowRightLinear size={16} />}>Next</Button>`;

const CODE_BUTTON_DISABLED = `<Button disabled>Disabled</Button>
<Button variant="secondary" disabled>Disabled</Button>
<Button variant="tertiary" disabled>Disabled</Button>`;

const BUTTON_PROPS: ApiTableRow[] = [
  {
    attr: "children",
    type: "ReactNode",
    defaultValue: "—",
    description: "按钮文案或其他内联内容。",
  },
  {
    attr: "color",
    type: "'purple' | 'dark' | 'blue' | 'blue-dark' | 'red' | 'green' | 'yellow' | 'grey' | 'black'",
    defaultValue: "'purple'",
    description: "按钮主色，共 9 种。",
  },
  {
    attr: "variant",
    type: "'primary' | 'secondary' | 'tertiary'",
    defaultValue: "'primary'",
    description: "实底 / 浅底 / 描边 三种样式。",
  },
  {
    attr: "size",
    type: "'lg' | 'md' | 'sm'",
    defaultValue: "'lg'",
    description: "按钮尺寸，影响高度与字号。",
  },
  {
    attr: "iconLeft",
    type: "ReactNode",
    defaultValue: "—",
    description: "文本左侧的图标槽，建议传 solar-icon-set 16px 图标。",
  },
  {
    attr: "iconRight",
    type: "ReactNode",
    defaultValue: "—",
    description: "文本右侧的图标槽。",
  },
  {
    attr: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "禁用态，降低透明度并禁用点击。",
  },
  {
    attr: "className",
    type: "string",
    defaultValue: "''",
    description: "额外 className，透传到 <button> 根节点。",
  },
  {
    attr: "...props",
    type: "ButtonHTMLAttributes<HTMLButtonElement>",
    defaultValue: "—",
    description: "其余原生按钮属性（onClick、type、form 等）透传。",
  },
];

// ─── IconButton 段 ───

const CODE_ICONBUTTON_USAGE = `<IconButton><StarLinear size={20} /></IconButton>
<IconButton variant="secondary"><HeartLinear size={20} /></IconButton>
<IconButton variant="tertiary"><TrashBinTrashLinear size={20} /></IconButton>`;

const CODE_ICONBUTTON_SIZES = `<IconButton size="sm"><StarLinear size={16} /></IconButton>
<IconButton size="md"><StarLinear size={20} /></IconButton>
<IconButton size="lg"><StarLinear size={24} /></IconButton>`;

const CODE_ICONBUTTON_COLORS = `<IconButton color="purple"><StarLinear size={20} /></IconButton>
<IconButton color="blue"><StarLinear size={20} /></IconButton>
<IconButton color="red"><StarLinear size={20} /></IconButton>
<IconButton color="green"><StarLinear size={20} /></IconButton>
<IconButton color="yellow"><StarLinear size={20} /></IconButton>`;

const CODE_ICONBUTTON_SHAPE = `<IconButton shape="circle"><StarLinear size={20} /></IconButton>
<IconButton shape="square"><StarLinear size={20} /></IconButton>`;

const CODE_ICONBUTTON_GHOST = `<IconButton variant="ghost"><StarLinear size={20} /></IconButton>
<IconButton variant="ghost" shape="square"><HeartLinear size={20} /></IconButton>`;

const ICONBUTTON_PROPS: ApiTableRow[] = [
  {
    attr: "children",
    type: "ReactNode",
    defaultValue: "—",
    description: "图标节点，建议 solar-icon-set 20px 以匹配 md 尺寸。",
  },
  {
    attr: "color",
    type: "'purple' | 'dark' | 'blue' | 'blue-dark' | 'red' | 'green' | 'yellow' | 'grey' | 'black'",
    defaultValue: "'purple'",
    description: "主色，与 Button 的颜色集合完全一致。",
  },
  {
    attr: "variant",
    type: "'primary' | 'secondary' | 'tertiary' | 'ghost'",
    defaultValue: "'primary'",
    description: "实底 / 浅底 / 描边 / 透明四种观感，ghost 常用于表格 actions。",
  },
  {
    attr: "size",
    type: "'lg' | 'md' | 'sm'",
    defaultValue: "'md'",
    description: "按钮尺寸。",
  },
  {
    attr: "shape",
    type: "'circle' | 'square'",
    defaultValue: "'circle'",
    description: "圆形或圆角方形，square 常用于表格 actions 列。",
  },
  {
    attr: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "禁用态。",
  },
  {
    attr: "...props",
    type: "ButtonHTMLAttributes<HTMLButtonElement>",
    defaultValue: "—",
    description: "其余原生按钮属性透传。",
  },
];

// ─── StyledLink 段 ───

const CODE_LINK_USAGE = `<StyledLink href="#">Link</StyledLink>
<StyledLink href="#" color="blue">Blue Link</StyledLink>
<StyledLink href="#" color="green">Green Link</StyledLink>`;

const CODE_LINK_COLORS = `<StyledLink href="#" color="purple">Purple</StyledLink>
<StyledLink href="#" color="blue">Blue</StyledLink>
<StyledLink href="#" color="green">Green</StyledLink>
<StyledLink href="#" color="red">Red</StyledLink>
<StyledLink href="#" color="yellow">Yellow</StyledLink>
<StyledLink href="#" color="cyan">Cyan</StyledLink>
<StyledLink href="#" color="gray">Gray</StyledLink>`;

const CODE_LINK_ICON = `<StyledLink href="#" iconRight={<ArrowRightLinear size={16} />}>Read more</StyledLink>
<StyledLink href="#" color="blue" iconLeft={<AddCircleLinear size={16} />}>Add item</StyledLink>`;

const CODE_LINK_DISABLED = `<StyledLink href="#" disabled>Disabled</StyledLink>`;

const LINK_PROPS: ApiTableRow[] = [
  {
    attr: "href",
    type: "string",
    defaultValue: "—",
    description: "链接地址，内部走 next/link。",
  },
  {
    attr: "children",
    type: "ReactNode",
    defaultValue: "—",
    description: "链接文案。",
  },
  {
    attr: "color",
    type: "'purple' | 'dark' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'cyan' | 'gray'",
    defaultValue: "'purple'",
    description: "文字颜色，9 种预设。",
  },
  {
    attr: "iconLeft",
    type: "ReactNode",
    defaultValue: "—",
    description: "文字左侧图标槽。",
  },
  {
    attr: "iconRight",
    type: "ReactNode",
    defaultValue: "—",
    description: "文字右侧图标槽。",
  },
  {
    attr: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "禁用时不渲染 <a>，降低透明度且无 hover。",
  },
  {
    attr: "className",
    type: "string",
    defaultValue: "''",
    description: "额外 className。",
  },
];

// ─── ButtonGroup 段 ───

const CODE_BUTTONGROUP_USAGE = `<ButtonGroup
  activeIndex={1}
  items={[
    { label: "Day" },
    { label: "Week" },
    { label: "Month" },
  ]}
/>`;

const CODE_BUTTONGROUP_COLORS = `<ButtonGroup color="purple" activeIndex={0} items={items} />
<ButtonGroup color="blue" activeIndex={1} items={items} />
<ButtonGroup color="black" activeIndex={2} items={items} />`;

const CODE_BUTTONGROUP_SHAPE = `<ButtonGroup shape="rounded" activeIndex={1} items={items} />
<ButtonGroup shape="pill" activeIndex={1} items={items} />`;

const BUTTONGROUP_ITEMS = [
  { label: "Day" },
  { label: "Week" },
  { label: "Month" },
];

const BUTTONGROUP_PROPS: ApiTableRow[] = [
  {
    attr: "items",
    type: "{ label: string }[]",
    defaultValue: "—",
    description: "分段按钮列表。",
  },
  {
    attr: "activeIndex",
    type: "number",
    defaultValue: "0",
    description: "当前选中分段的下标。",
  },
  {
    attr: "color",
    type: "'purple' | 'blue' | 'black'",
    defaultValue: "'purple'",
    description: "选中态的主色。",
  },
  {
    attr: "shape",
    type: "'rounded' | 'pill'",
    defaultValue: "'rounded'",
    description: "圆角矩形或胶囊。",
  },
  {
    attr: "onChange",
    type: "(index: number) => void",
    defaultValue: "—",
    description: "切换分段回调。",
  },
  {
    attr: "className",
    type: "string",
    defaultValue: "—",
    description: "额外 className。",
  },
];

export default function ButtonLinkCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Button & Link"
        hint="Button / IconButton 触发动作，StyledLink 用于跳转，ButtonGroup 用于分段切换。"
      />

      {/* ────────── Button 段 ────────── */}

      <Section
        title="Button"
        description="最常用的点击元素，支持 9 种颜色、3 种变体和 3 种尺寸，可附带左右图标与禁用态。"
      >
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            默认渲染紫色实底按钮。通过 <InlineCode>variant</InlineCode> 切换实底 / 浅底 / 描边三种观感。
          </p>
          <PreviewBlock code={CODE_BUTTON_USAGE}>
            <Button>Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Sizes" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            通过 <InlineCode>size</InlineCode> 控制高度与字号，可选 <InlineCode>sm</InlineCode> / <InlineCode>md</InlineCode> / <InlineCode>lg</InlineCode>，默认 <InlineCode>lg</InlineCode>。
          </p>
          <PreviewBlock code={CODE_BUTTON_SIZES}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Colors" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            9 种语义色：品牌紫（默认）、深紫、蓝、深蓝、红、绿、黄、灰、黑。
          </p>
          <PreviewBlock code={CODE_BUTTON_COLORS}>
            <Button color="purple">Purple</Button>
            <Button color="dark">Dark</Button>
            <Button color="blue">Blue</Button>
            <Button color="blue-dark">Blue Dark</Button>
            <Button color="red">Red</Button>
            <Button color="green">Green</Button>
            <Button color="yellow">Yellow</Button>
            <Button color="grey">Grey</Button>
            <Button color="black">Black</Button>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Variants" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>primary</InlineCode> 用于主要动作，<InlineCode>secondary</InlineCode> 用于次级动作，<InlineCode>tertiary</InlineCode> 用于边缘场景。
          </p>
          <PreviewBlock code={CODE_BUTTON_VARIANTS}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
          </PreviewBlock>
        </SubSection>

        <SubSection title="With Icon" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            使用 <InlineCode>iconLeft</InlineCode> / <InlineCode>iconRight</InlineCode> 插入图标，推荐 solar-icon-set 16px 图标以匹配内边距。
          </p>
          <PreviewBlock code={CODE_BUTTON_ICON}>
            <Button iconLeft={<StarLinear size={16} />}>Star it</Button>
            <Button iconRight={<ArrowRightLinear size={16} />}>Next</Button>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Disabled" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            传入 <InlineCode>disabled</InlineCode> 后降低透明度并禁用点击。
          </p>
          <PreviewBlock code={CODE_BUTTON_DISABLED}>
            <Button disabled>Disabled</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
            <Button variant="tertiary" disabled>
              Disabled
            </Button>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={BUTTON_PROPS} />
        </SubSection>
      </Section>

      {/* ────────── IconButton 段 ────────── */}

      <Section
        title="IconButton"
        description="纯图标按钮，继承 Button 的 9 色与 3 变体，额外提供 ghost 变体与 square 形状用于表格 actions。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            传入任一 icon 作为 children 即可。默认 <InlineCode>md</InlineCode> 尺寸建议搭配 20px 图标。
          </p>
          <PreviewBlock code={CODE_ICONBUTTON_USAGE} minHeight={140}>
            <IconButton>
              <StarLinear size={20} />
            </IconButton>
            <IconButton variant="secondary">
              <HeartLinear size={20} />
            </IconButton>
            <IconButton variant="tertiary">
              <TrashBinTrashLinear size={20} />
            </IconButton>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Sizes" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 种尺寸：<InlineCode>sm</InlineCode> 32px / <InlineCode>md</InlineCode> 40px / <InlineCode>lg</InlineCode> 48px。
          </p>
          <PreviewBlock code={CODE_ICONBUTTON_SIZES} minHeight={140}>
            <IconButton size="sm">
              <StarLinear size={16} />
            </IconButton>
            <IconButton size="md">
              <StarLinear size={20} />
            </IconButton>
            <IconButton size="lg">
              <StarLinear size={24} />
            </IconButton>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Colors" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            颜色集合与 Button 一致，共 9 种，这里示意 5 种常用色。
          </p>
          <PreviewBlock code={CODE_ICONBUTTON_COLORS} minHeight={140}>
            <IconButton color="purple">
              <StarLinear size={20} />
            </IconButton>
            <IconButton color="blue">
              <StarLinear size={20} />
            </IconButton>
            <IconButton color="red">
              <StarLinear size={20} />
            </IconButton>
            <IconButton color="green">
              <StarLinear size={20} />
            </IconButton>
            <IconButton color="yellow">
              <StarLinear size={20} />
            </IconButton>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Shape" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>circle</InlineCode>（默认）和 <InlineCode>square</InlineCode>，后者常用于表格 actions 列。
          </p>
          <PreviewBlock code={CODE_ICONBUTTON_SHAPE} minHeight={140}>
            <IconButton shape="circle">
              <StarLinear size={20} />
            </IconButton>
            <IconButton shape="square">
              <StarLinear size={20} />
            </IconButton>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Ghost" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>variant=&quot;ghost&quot;</InlineCode> 透明底 + 灰图标 + hover 浅灰，适合列表尾部静默按钮。
          </p>
          <PreviewBlock code={CODE_ICONBUTTON_GHOST} minHeight={140}>
            <IconButton variant="ghost">
              <StarLinear size={20} />
            </IconButton>
            <IconButton variant="ghost" shape="square">
              <HeartLinear size={20} />
            </IconButton>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={ICONBUTTON_PROPS} />
        </SubSection>
      </Section>

      {/* ────────── StyledLink 段 ────────── */}

      <Section
        title="StyledLink"
        description="文字链接，9 种颜色，支持左右图标与禁用态，内部使用 next/link 跳转。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>href</InlineCode> 必填，通过 <InlineCode>color</InlineCode> 控制文字颜色。
          </p>
          <PreviewBlock code={CODE_LINK_USAGE} minHeight={140}>
            <StyledLink href="#">Link</StyledLink>
            <StyledLink href="#" color="blue">Blue Link</StyledLink>
            <StyledLink href="#" color="green">Green Link</StyledLink>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Colors" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            9 种颜色：purple / dark / blue / green / red / orange / yellow / cyan / gray。
          </p>
          <PreviewBlock code={CODE_LINK_COLORS} minHeight={140}>
            <StyledLink href="#" color="purple">Purple</StyledLink>
            <StyledLink href="#" color="blue">Blue</StyledLink>
            <StyledLink href="#" color="green">Green</StyledLink>
            <StyledLink href="#" color="red">Red</StyledLink>
            <StyledLink href="#" color="yellow">Yellow</StyledLink>
            <StyledLink href="#" color="cyan">Cyan</StyledLink>
            <StyledLink href="#" color="gray">Gray</StyledLink>
          </PreviewBlock>
        </SubSection>

        <SubSection title="With Icon" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>iconLeft</InlineCode> / <InlineCode>iconRight</InlineCode> 支持插槽，推荐 16px 图标。
          </p>
          <PreviewBlock code={CODE_LINK_ICON} minHeight={140}>
            <StyledLink href="#" iconRight={<ArrowRightLinear size={16} />}>Read more</StyledLink>
            <StyledLink href="#" color="blue" iconLeft={<AddCircleLinear size={16} />}>Add item</StyledLink>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Disabled" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>disabled</InlineCode> 渲染为 span，降低透明度且无 hover。
          </p>
          <PreviewBlock code={CODE_LINK_DISABLED} minHeight={140}>
            <StyledLink href="#" disabled>Disabled</StyledLink>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={LINK_PROPS} />
        </SubSection>
      </Section>

      {/* ────────── ButtonGroup 段 ────────── */}

      <Section
        title="ButtonGroup"
        description="分段控制器，3 色 × 2 形状，受控组件通过 activeIndex + onChange 使用。"
      >
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            通过 <InlineCode>items</InlineCode> 传入标签数组，<InlineCode>activeIndex</InlineCode> 指定选中项。
          </p>
          <PreviewBlock code={CODE_BUTTONGROUP_USAGE} minHeight={140}>
            <ButtonGroup activeIndex={1} items={BUTTONGROUP_ITEMS} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="Colors" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 种选中态颜色：purple / blue / black。
          </p>
          <PreviewBlock code={CODE_BUTTONGROUP_COLORS} minHeight={140}>
            <ButtonGroup color="purple" activeIndex={0} items={BUTTONGROUP_ITEMS} />
            <ButtonGroup color="blue" activeIndex={1} items={BUTTONGROUP_ITEMS} />
            <ButtonGroup color="black" activeIndex={2} items={BUTTONGROUP_ITEMS} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="Shape" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>rounded</InlineCode>（圆角矩形）或 <InlineCode>pill</InlineCode>（胶囊）。
          </p>
          <PreviewBlock code={CODE_BUTTONGROUP_SHAPE} minHeight={140}>
            <ButtonGroup shape="rounded" activeIndex={1} items={BUTTONGROUP_ITEMS} />
            <ButtonGroup shape="pill" activeIndex={1} items={BUTTONGROUP_ITEMS} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={BUTTONGROUP_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/button-link" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
