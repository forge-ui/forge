import { Button, IconButton, StyledLink, ButtonGroup } from "@forge-ui-official/core";
import {
  StarLinear,
  ArrowRightLinear,
  HeartLinear,
  TrashBinTrashLinear,
  AddCircleLinear,
} from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";

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

const CODE_BUTTON_ALL = `${CODE_BUTTON_SIZES}
${CODE_BUTTON_COLORS}
${CODE_BUTTON_VARIANTS}
${CODE_BUTTON_ICON}
${CODE_BUTTON_DISABLED}`;

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
    defaultValue: "'blue'",
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

const CODE_ICONBUTTON_USAGE = `<IconButton><StarLinear size={20} /></IconButton>
<IconButton variant="secondary"><HeartLinear size={20} /></IconButton>
<IconButton variant="tertiary"><TrashBinTrashLinear size={20} /></IconButton>`;

const CODE_ICONBUTTON_SHAPE = `<IconButton shape="circle"><StarLinear size={20} /></IconButton>
<IconButton shape="square"><StarLinear size={20} /></IconButton>`;

const CODE_ICONBUTTON_GHOST = `<IconButton variant="ghost"><StarLinear size={20} /></IconButton>
<IconButton variant="ghost" shape="square"><HeartLinear size={20} /></IconButton>`;

const CODE_ICONBUTTON_ALL = `${CODE_ICONBUTTON_USAGE}
${CODE_ICONBUTTON_SHAPE}
${CODE_ICONBUTTON_GHOST}`;

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
    defaultValue: "'blue'",
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

const CODE_LINK_USAGE = `<StyledLink href="#">链接</StyledLink>
<StyledLink href="#" color="blue">蓝色链接</StyledLink>
<StyledLink href="#" color="green">绿色链接</StyledLink>`;

const CODE_LINK_ICON = `<StyledLink href="#" iconRight={<ArrowRightLinear size={16} />}>查看详情</StyledLink>
<StyledLink href="#" color="blue" iconLeft={<AddCircleLinear size={16} />}>添加项目</StyledLink>`;

const CODE_LINK_DISABLED = `<StyledLink href="#" disabled>禁用</StyledLink>`;

const CODE_LINK_ALL = `${CODE_LINK_USAGE}
${CODE_LINK_ICON}
${CODE_LINK_DISABLED}`;

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
    defaultValue: "'blue'",
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

const CODE_BUTTONGROUP_USAGE = `<ButtonGroup
  activeIndex={1}
  items={[
    { label: "日" },
    { label: "周" },
    { label: "月" },
  ]}
/>`;

const CODE_BUTTONGROUP_SHAPE = `<ButtonGroup shape="rounded" activeIndex={1} items={items} />
<ButtonGroup shape="pill" activeIndex={1} items={items} />`;

const CODE_BUTTONGROUP_ALL = `${CODE_BUTTONGROUP_USAGE}
${CODE_BUTTONGROUP_SHAPE}`;

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
    defaultValue: "'blue'",
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
        hint="同一个组件的尺寸、颜色和样式放在一起，代码按行跟在这组下面。"
      />

      <Section title="用法" description="从按钮开始。尺寸、颜色、样式、图标和禁用都是 Button，放在一组里。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <DocExample id="button" title="Button" summary="小中大、九种颜色、实底浅底描边、左右图标和禁用，每行代码对应一颗按钮。" code={CODE_BUTTON_ALL}>
          <div className="flex w-full flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="sm">小</Button>
              <Button size="md">中</Button>
              <Button size="lg">大</Button>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button color="purple">紫色</Button>
              <Button color="dark">深色</Button>
              <Button color="blue">蓝色</Button>
              <Button color="blue-dark">深蓝</Button>
              <Button color="red">红色</Button>
              <Button color="green">绿色</Button>
              <Button color="yellow">黄色</Button>
              <Button color="grey">灰色</Button>
              <Button color="black">黑色</Button>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="primary">主要按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="tertiary">轻量按钮</Button>
              <Button iconLeft={<StarLinear size={16} />}>收藏</Button>
              <Button iconRight={<ArrowRightLinear size={16} />}>下一步</Button>
              <Button disabled>禁用</Button>
              <Button variant="secondary" disabled>禁用</Button>
              <Button variant="tertiary" disabled>禁用</Button>
            </div>
          </div>
        </DocExample>
      </Section>

      <Section title="例子" description="图标按钮、链接和分段组各自成一组。样子不同的都留在这一组里。">
        <DocExample id="iconbutton" title="IconButton" summary="实底、浅底、描边、圆形、方形和透明底。" code={CODE_ICONBUTTON_ALL} minHeight={140}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <IconButton><StarLinear size={20} /></IconButton>
            <IconButton variant="secondary"><HeartLinear size={20} /></IconButton>
            <IconButton variant="tertiary"><TrashBinTrashLinear size={20} /></IconButton>
            <IconButton shape="circle"><StarLinear size={20} /></IconButton>
            <IconButton shape="square"><StarLinear size={20} /></IconButton>
            <IconButton variant="ghost"><StarLinear size={20} /></IconButton>
            <IconButton variant="ghost" shape="square"><HeartLinear size={20} /></IconButton>
          </div>
        </DocExample>
        <DocExample id="styledlink" title="StyledLink" summary="默认、蓝色、绿色、左右图标和禁用。" code={CODE_LINK_ALL} minHeight={140}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <StyledLink href="#">链接</StyledLink>
            <StyledLink href="#" color="blue">蓝色链接</StyledLink>
            <StyledLink href="#" color="green">绿色链接</StyledLink>
            <StyledLink href="#" iconRight={<ArrowRightLinear size={16} />}>查看详情</StyledLink>
            <StyledLink href="#" color="blue" iconLeft={<AddCircleLinear size={16} />}>添加项目</StyledLink>
            <StyledLink href="#" disabled>禁用</StyledLink>
          </div>
        </DocExample>
        <DocExample id="buttongroup" title="ButtonGroup" summary="默认外形，再加上圆角和胶囊。" code={CODE_BUTTONGROUP_ALL} minHeight={140}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ButtonGroup activeIndex={1} items={BUTTONGROUP_ITEMS} />
            <ButtonGroup shape="rounded" activeIndex={1} items={BUTTONGROUP_ITEMS} />
            <ButtonGroup shape="pill" activeIndex={1} items={BUTTONGROUP_ITEMS} />
          </div>
        </DocExample>
      </Section>

      <Section title="API">
        <ApiBlock id="button" title="Button" rows={BUTTON_PROPS} />
        <ApiBlock id="iconbutton" title="IconButton" rows={ICONBUTTON_PROPS} />
        <ApiBlock id="styledlink" title="StyledLink" rows={LINK_PROPS} />
        <ApiBlock id="buttongroup" title="ButtonGroup" rows={BUTTONGROUP_PROPS} />
      </Section>
    </div>
  );
}
