import { Button, IconButton, StyledLink, ButtonGroup } from "@forge-ui-official/core";
import {
  StarLinear,
  ArrowRightLinear,
  HeartLinear,
  TrashBinTrashLinear,
  AddCircleLinear,
} from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

// ─── Button 段落使用的代码片段（与 Preview JSX 手动对齐） ───

const CODE_IMPORT = `import { Button, IconButton, StyledLink, ButtonGroup } from "@forge-ui-official/core";`;

const CODE_BUTTON_USAGE = `<Button>保存修改</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="tertiary">轻量按钮</Button>`;

const CODE_BUTTON_SIZES = `<Button size="sm">小</Button>
<Button size="md">中</Button>
<Button size="lg">大</Button>`;

const CODE_BUTTON_COLORS = `<Button color="purple">紫色</Button>
<Button color="dark">深色</Button>
<Button color="blue">蓝色</Button>
<Button color="blue-dark">深蓝</Button>
<Button color="red">红色</Button>
<Button color="green">绿色</Button>
<Button color="yellow">黄色</Button>
<Button color="grey">灰色</Button>
<Button color="black">黑色</Button>`;

const CODE_BUTTON_VARIANTS = `<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="tertiary">轻量按钮</Button>`;

const CODE_BUTTON_ICON = `<Button iconLeft={<StarLinear size={16} />}>收藏</Button>
<Button iconRight={<ArrowRightLinear size={16} />}>下一步</Button>`;

const CODE_BUTTON_DISABLED = `<Button disabled>禁用</Button>
<Button variant="secondary" disabled>禁用</Button>
<Button variant="tertiary" disabled>禁用</Button>`;

const BUTTON_PROPS: ApiTableRow[] = [
  { attr: "effect", type: "'glass' | 'magnetic' | 'ripple' | 'roll'", defaultValue: "—", description: "可选视觉与交互效果。" },
  { attr: "loading / result", type: "boolean / 'idle' | 'success' | 'error'", defaultValue: "false / 'idle'", description: "展示处理中或操作结果。" },
  { attr: "holdDuration", type: "number", defaultValue: "1200", description: "长按确认所需时间，单位毫秒。" },
  { attr: "onConfirm / onUndo", type: "() => void", defaultValue: "—", description: "完成长按或撤销时触发，由应用执行实际操作。" },
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
    type: "'primary' | 'secondary' | 'tertiary' | 'hold'",
    defaultValue: "'primary'",
    description: "实底、浅底、描边或长按确认样式。",
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
    description: "文本左侧的图标槽，建议传 @forge-ui-official/core/icons 16px 图标。",
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
  { attr: "effect", type: "'morph' | 'send' | 'bookmark' | 'burst'", defaultValue: "—", description: "变形、发送、收藏或粒子反馈效果。" },
  { attr: "active", type: "boolean", defaultValue: "—", description: "由应用管理收藏、点赞等切换状态。" },
  {
    attr: "children",
    type: "ReactNode",
    defaultValue: "—",
    description: "图标节点，建议 @forge-ui-official/core/icons 20px 以匹配 md 尺寸。",
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

const CODE_LINK_USAGE = `<StyledLink href="#">链接</StyledLink>
<StyledLink href="#" color="blue">蓝色链接</StyledLink>
<StyledLink href="#" color="green">绿色链接</StyledLink>`;

const CODE_LINK_COLORS = `<StyledLink href="#" color="purple">紫色</StyledLink>
<StyledLink href="#" color="blue">蓝色</StyledLink>
<StyledLink href="#" color="green">绿色</StyledLink>
<StyledLink href="#" color="red">红色</StyledLink>
<StyledLink href="#" color="yellow">黄色</StyledLink>
<StyledLink href="#" color="cyan">青色</StyledLink>
<StyledLink href="#" color="gray">灰色</StyledLink>`;

const CODE_LINK_ICON = `<StyledLink href="#" iconRight={<ArrowRightLinear size={16} />}>查看详情</StyledLink>
<StyledLink href="#" color="blue" iconLeft={<AddCircleLinear size={16} />}>添加项目</StyledLink>`;

const CODE_LINK_DISABLED = `<StyledLink href="#" disabled>禁用</StyledLink>`;

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
    { label: "日" },
    { label: "周" },
    { label: "月" },
  ]}
/>`;

const CODE_BUTTONGROUP_COLORS = `<ButtonGroup color="purple" activeIndex={0} items={items} />
<ButtonGroup color="blue" activeIndex={1} items={items} />
<ButtonGroup color="black" activeIndex={2} items={items} />`;

const CODE_BUTTONGROUP_SHAPE = `<ButtonGroup shape="rounded" activeIndex={1} items={items} />
<ButtonGroup shape="pill" activeIndex={1} items={items} />`;

const BUTTONGROUP_ITEMS = [
  { label: "日" },
  { label: "周" },
  { label: "月" },
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
        title="按钮与链接"
        hint="触发操作、跳转页面或切换视图，支持图标和禁用状态。"
      />

      {/* ────────── Button 段 ────────── */}



      <Section
        title="Button"
        description="触发操作，支持文字、图标、不同样式和禁用状态。"
      >
        <SubSection title="导入组件" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            默认渲染紫色实底按钮。通过 <InlineCode>variant</InlineCode> 切换实底 / 浅底 / 描边三种观感。
          </p>
          <PreviewBlock code={CODE_BUTTON_USAGE}>
            <Button>保存修改</Button>
            <Button variant="secondary">次要按钮</Button>
            <Button variant="tertiary">轻量按钮</Button>
          </PreviewBlock>
        </SubSection>

        <SubSection title="尺寸" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            通过 <InlineCode>size</InlineCode> 控制高度与字号，可选 <InlineCode>sm</InlineCode> / <InlineCode>md</InlineCode> / <InlineCode>lg</InlineCode>，默认 <InlineCode>lg</InlineCode>。
          </p>
          <PreviewBlock code={CODE_BUTTON_SIZES}>
            <Button size="sm">小</Button>
            <Button size="md">中</Button>
            <Button size="lg">大</Button>
          </PreviewBlock>
        </SubSection>

        <SubSection title="颜色" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            9 种语义色：品牌紫（默认）、深紫、蓝、深蓝、红、绿、黄、灰、黑。
          </p>
          <PreviewBlock code={CODE_BUTTON_COLORS}>
            <Button color="purple">紫色</Button>
            <Button color="dark">深色</Button>
            <Button color="blue">蓝色</Button>
            <Button color="blue-dark">深蓝</Button>
            <Button color="red">红色</Button>
            <Button color="green">绿色</Button>
            <Button color="yellow">黄色</Button>
            <Button color="grey">灰色</Button>
            <Button color="black">黑色</Button>
          </PreviewBlock>
        </SubSection>

        <SubSection title="样式" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>primary</InlineCode> 用于主要动作，<InlineCode>secondary</InlineCode> 用于次级动作，<InlineCode>tertiary</InlineCode> 用于边缘场景。
          </p>
          <PreviewBlock code={CODE_BUTTON_VARIANTS}>
            <Button variant="primary">主要按钮</Button>
            <Button variant="secondary">次要按钮</Button>
            <Button variant="tertiary">轻量按钮</Button>
          </PreviewBlock>
        </SubSection>

        <SubSection title="带图标" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            使用 <InlineCode>iconLeft</InlineCode> / <InlineCode>iconRight</InlineCode> 插入图标，推荐 @forge-ui-official/core/icons 16px 图标以匹配内边距。
          </p>
          <PreviewBlock code={CODE_BUTTON_ICON}>
            <Button iconLeft={<StarLinear size={16} />}>收藏</Button>
            <Button iconRight={<ArrowRightLinear size={16} />}>下一步</Button>
          </PreviewBlock>
        </SubSection>

        <SubSection title="禁用" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            传入 <InlineCode>disabled</InlineCode> 后降低透明度并禁用点击。
          </p>
          <PreviewBlock code={CODE_BUTTON_DISABLED}>
            <Button disabled>禁用</Button>
            <Button variant="secondary" disabled>
              禁用
            </Button>
            <Button variant="tertiary" disabled>
              禁用
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
        description="用图标触发操作，适合工具栏和紧凑操作区域。"
      >
        <SubSection title="使用方法" stack>
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

        <SubSection title="尺寸" stack>
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

        <SubSection title="颜色" stack>
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

        <SubSection title="形状" stack>
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

        <SubSection title="透明" stack>
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
        description="跳转到页面或资源，支持图标和禁用状态。"
      >
        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>href</InlineCode> 必填，通过 <InlineCode>color</InlineCode> 控制文字颜色。
          </p>
          <PreviewBlock code={CODE_LINK_USAGE} minHeight={140}>
            <StyledLink href="#">链接</StyledLink>
            <StyledLink href="#" color="blue">蓝色链接</StyledLink>
            <StyledLink href="#" color="green">绿色链接</StyledLink>
          </PreviewBlock>
        </SubSection>

        <SubSection title="颜色" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            9 种颜色：purple / dark / blue / green / red / orange / yellow / cyan / gray。
          </p>
          <PreviewBlock code={CODE_LINK_COLORS} minHeight={140}>
            <StyledLink href="#" color="purple">紫色</StyledLink>
            <StyledLink href="#" color="blue">蓝色</StyledLink>
            <StyledLink href="#" color="green">绿色</StyledLink>
            <StyledLink href="#" color="red">红色</StyledLink>
            <StyledLink href="#" color="yellow">黄色</StyledLink>
            <StyledLink href="#" color="cyan">青色</StyledLink>
            <StyledLink href="#" color="gray">灰色</StyledLink>
          </PreviewBlock>
        </SubSection>

        <SubSection title="带图标" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>iconLeft</InlineCode> / <InlineCode>iconRight</InlineCode> 支持插槽，推荐 16px 图标。
          </p>
          <PreviewBlock code={CODE_LINK_ICON} minHeight={140}>
            <StyledLink href="#" iconRight={<ArrowRightLinear size={16} />}>查看详情</StyledLink>
            <StyledLink href="#" color="blue" iconLeft={<AddCircleLinear size={16} />}>添加项目</StyledLink>
          </PreviewBlock>
        </SubSection>

        <SubSection title="禁用" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>disabled</InlineCode> 渲染为 span，降低透明度且无 hover。
          </p>
          <PreviewBlock code={CODE_LINK_DISABLED} minHeight={140}>
            <StyledLink href="#" disabled>禁用</StyledLink>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={LINK_PROPS} />
        </SubSection>
      </Section>

      {/* ────────── ButtonGroup 段 ────────── */}

      <Section
        title="ButtonGroup"
        description="在多个筛选维度或视图模式之间切换。"
      >
        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            通过 <InlineCode>items</InlineCode> 传入标签数组，<InlineCode>activeIndex</InlineCode> 指定选中项。
          </p>
          <PreviewBlock code={CODE_BUTTONGROUP_USAGE} minHeight={140}>
            <ButtonGroup activeIndex={1} items={BUTTONGROUP_ITEMS} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="颜色" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 种选中态颜色：purple / blue / black。
          </p>
          <PreviewBlock code={CODE_BUTTONGROUP_COLORS} minHeight={140}>
            <ButtonGroup color="purple" activeIndex={0} items={BUTTONGROUP_ITEMS} />
            <ButtonGroup color="blue" activeIndex={1} items={BUTTONGROUP_ITEMS} />
            <ButtonGroup color="black" activeIndex={2} items={BUTTONGROUP_ITEMS} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="形状" stack>
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
    </div>
  );
}
