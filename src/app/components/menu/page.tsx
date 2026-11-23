"use client";

import { useState } from "react";
import {
  MenuItem,
  DropdownPanel,
  DropdownDivider,
  IconTrigger,
  KebabMenu,
  DropdownMenu,
  ContextMenu,
  Popover,
  Button,
  Toggle,
} from "@forge-ui-official/core";
import {
  HomeBoldDuotone,
  SettingsBoldDuotone,
  UserBoldDuotone,
  BellBoldDuotone,
  LetterBoldDuotone,
  PenNewSquareBoldDuotone,
  CopyBoldDuotone,
  TrashBinTrashBoldDuotone,
  Logout3BoldDuotone,
} from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample, ExampleGrid } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import {
  MenuItem, DropdownPanel, DropdownDivider,
  IconTrigger, KebabMenu,
  DropdownMenu, ContextMenu, Popover,
} from "@forge-ui-official/core";`;

const CODE_MENUITEM_USAGE = `<MenuItem lead={{ kind: "icon", icon: <HomeBoldDuotone size={20} /> }} label="首页" />
<MenuItem lead={{ kind: "icon", icon: <SettingsBoldDuotone size={20} /> }} label="设置" active />`;

const CODE_MENUITEM_STATES = `<MenuItem label="默认" state="idle" />
<MenuItem label="悬停" state="hover" />
<MenuItem label="使用中" state="active" />
<MenuItem label="禁用" state="disabled" />`;

const CODE_MENUITEM_INTENT = `<MenuItem label="默认" />
<MenuItem label="删除" intent="danger" lead={{ kind: "icon", icon: <TrashBinTrashBoldDuotone size={20} /> }} />`;

const CODE_DROPDOWN_USAGE = `<DropdownPanel>
  <MenuItem lead={{ kind: "icon", icon: <HomeBoldDuotone size={20} /> }} label="首页" />
  <MenuItem lead={{ kind: "icon", icon: <UserBoldDuotone size={20} /> }} label="个人资料" />
  <DropdownDivider />
  <MenuItem lead={{ kind: "icon", icon: <Logout3BoldDuotone size={20} /> }} label="退出登录" intent="danger" />
</DropdownPanel>`;

const CODE_ICONTRIGGER_USAGE = `<IconTrigger icon={<BellBoldDuotone size={20} />} badge={3} tooltip="通知" />`;

const CODE_KEBAB_USAGE = `<KebabMenu
  items={[
    { icon: <PenNewSquareBoldDuotone size={20} />, label: "编辑" },
    { icon: <CopyBoldDuotone size={20} />, label: "创建副本" },
    { icon: <TrashBinTrashBoldDuotone size={20} />, label: "删除", danger: true },
  ]}
/>`;


const CODE_DROPDOWNMENU_USAGE = `<DropdownMenu
  trigger={<Button variant="secondary">操作</Button>}
  items={[
    { label: "编辑", icon: <PenNewSquareBoldDuotone size={20} />, shortcut: "⌘E" },
    { label: "创建副本", icon: <CopyBoldDuotone size={20} /> },
    { type: "submenu", label: "移动到", items: [{ label: "项目 A" }, { label: "项目 B" }] },
    { type: "group", label: "显示", items: [
      { type: "checkbox", label: "负责人", checked: showOwner, onCheckedChange: setShowOwner },
    ] },
    { type: "divider" },
    { label: "删除", icon: <TrashBinTrashBoldDuotone size={20} />, danger: true },
  ]}
/>`;

const CODE_CONTEXTMENU_USAGE = `<ContextMenu items={[{ label: "复制" }, { label: "重命名" }, { type: "divider" }, { label: "删除", danger: true }]}>
  <div>在这里点右键</div>
</ContextMenu>`;

const CODE_POPOVER_USAGE = `<Popover
  title="通知设置"
  description="选择要接收的提醒"
  trigger={<Button variant="secondary">设置</Button>}
>
  {(close) => (
    <>
      <label className="flex w-56 items-center justify-between text-sm text-fg-black">邮件提醒<Toggle checked={email} onChange={setEmail} ariaLabel="邮件提醒" /></label>
      <Button size="sm" onClick={close}>完成</Button>
    </>
  )}
</Popover>`;

const DROPDOWNMENU_PROPS: ApiTableRow[] = [
  { attr: "trigger", type: "ReactElement", defaultValue: "—", description: "打开菜单的元素，需要把 ref 和属性传到 DOM 上（Button、IconTrigger、原生 button 都可以）。" },
  { attr: "items", type: "DropdownMenuEntry[]", defaultValue: "—", description: "普通项 { label, icon?, description?, shortcut?, danger?, disabled?, href?, onSelect? }；另有 checkbox、submenu、group、divider 四种 type。" },
  { attr: "side / align", type: "'top' | 'bottom' | 'left' | 'right' / 'start' | 'center' | 'end'", defaultValue: "'bottom' / 'start'", description: "弹出方向和对齐；空间不够时自动翻转。" },
  { attr: "openOnHover", type: "boolean", defaultValue: "false", description: "悬停也能打开。" },
  { attr: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open) => void", defaultValue: "—", description: "受控或非受控的展开状态。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "勾选项的颜色。" },
];

const CONTEXTMENU_PROPS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "右键或长按的区域。" },
  { attr: "items", type: "DropdownMenuEntry[]", defaultValue: "—", description: "同 DropdownMenu。" },
  { attr: "areaClassName", type: "string", defaultValue: "—", description: "区域容器的 class。" },
];

const POPOVER_PROPS: ApiTableRow[] = [
  { attr: "trigger", type: "ReactElement", defaultValue: "—", description: "打开浮层的元素，要求同 DropdownMenu。" },
  { attr: "children", type: "ReactNode | (close) => ReactNode", defaultValue: "—", description: "浮层内容；传函数可以拿到 close。" },
  { attr: "title / description", type: "ReactNode", defaultValue: "—", description: "标题和说明，同时作为读屏名称。" },
  { attr: "side / align", type: "同 DropdownMenu", defaultValue: "'bottom' / 'center'", description: "弹出方向和对齐。" },
  { attr: "width", type: "string", defaultValue: "按内容，最宽 320px", description: "浮层宽度。" },
  { attr: "openOnHover", type: "boolean", defaultValue: "false", description: "悬停也能打开。" },
  { attr: "open / defaultOpen / onOpenChange", type: "—", defaultValue: "—", description: "受控或非受控的展开状态。" },
];

const MENUITEM_PROPS: ApiTableRow[] = [
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "active 态主色。" },
  { attr: "surface", type: "'default' | 'onColoredBg'", defaultValue: "'default'", description: "onColoredBg 用于带主题背景的侧栏 内。" },
  { attr: "intent", type: "'default' | 'danger'", defaultValue: "'default'", description: "danger 为红色文案（删除场景）。" },
  { attr: "kind", type: "'single' | 'submenu' | 'dropdown'", defaultValue: "'single'", description: "single 单项；submenu 二级项（缩进）；dropdown 带右侧箭头。" },
  { attr: "state", type: "'idle' | 'hover' | 'active' | 'disabled'", defaultValue: "'idle'", description: "视觉状态。" },
  { attr: "active", type: "boolean", defaultValue: "—", description: "等价 state=active 的快捷 prop。" },
  { attr: "lead", type: "{ kind: 'icon', icon } | { kind: 'image', src }", defaultValue: "—", description: "左侧图标或头像。" },
  { attr: "label", type: "string", defaultValue: "—", description: "文案。传空或不传则是图标纯模式。" },
  { attr: "badge", type: "number", defaultValue: "—", description: "右侧红色数字徽标。" },
  { attr: "onClick", type: "() => void", defaultValue: "—", description: "点击回调。" },
];

const DROPDOWN_PROPS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "面板内容（通常是若干 MenuItem + DropdownDivider）。" },
  { attr: "width", type: "string", defaultValue: "'w-60'", description: "Tailwind 宽度 class。" },
  { attr: "padding", type: "string", defaultValue: "'p-2'", description: "Tailwind padding class。" },
];

const ICONTRIGGER_PROPS: ApiTableRow[] = [
  { attr: "icon", type: "ReactNode", defaultValue: "—", description: "内部图标节点。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "open 态主色背景。" },
  { attr: "state", type: "'idle' | 'hover' | 'open'", defaultValue: "'idle'", description: "受控视觉状态。" },
  { attr: "surface", type: "'default' | 'onColoredBg'", defaultValue: "'default'", description: "在色底上采用半透明白。" },
  { attr: "badge", type: "number", defaultValue: "—", description: "右上红色徽标。" },
  { attr: "tooltip", type: "string", defaultValue: "—", description: "hover/open 时自动显示的 tooltip 文案。" },
  { attr: "tooltipPosition", type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: "'right'", description: "tooltip 位置。" },
  { attr: "panel", type: "ReactNode | (close) => ReactNode", defaultValue: "—", description: "传了 panel 后内建 open 态，点击切换显隐。" },
];

const KEBAB_PROPS: ApiTableRow[] = [
  { attr: "items", type: "KebabMenuItem[]", defaultValue: "—", description: "菜单项 { icon?, label, onSelect?, danger? }。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "触发器 open 态主色。" },
  { attr: "surface", type: "'default' | 'onColoredBg'", defaultValue: "'default'", description: "触发器 surface。" },
  { attr: "align", type: "'left' | 'right'", defaultValue: "'right'", description: "弹出面板对齐边。" },
];

export default function MenuCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="菜单"
        hint="按入口选组件：一行选项、整块下拉、图标按钮或三点菜单。"
      />

      <Section title="用法" description="从菜单项开始。图标、选中态和点击按需要加上。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <SubSection title="最小示例" stack>
          <DocExample id="menuitem" title="MenuItem" summary="普通项、四种状态和红色危险项都是菜单项。" code={`${CODE_MENUITEM_USAGE}\n${CODE_MENUITEM_STATES}\n${CODE_MENUITEM_INTENT}`} minHeight={220}>
            <div className="flex flex-wrap items-start justify-center gap-6">
              <div className="w-64 flex flex-col gap-1">
                <MenuItem lead={{ kind: "icon", icon: <HomeBoldDuotone size={20} /> }} label="首页" />
                <MenuItem lead={{ kind: "icon", icon: <SettingsBoldDuotone size={20} /> }} label="设置" active />
              </div>
              <div className="w-64 flex flex-col gap-1">
                <MenuItem label="默认" state="idle" />
                <MenuItem label="悬停" state="hover" />
                <MenuItem label="使用中" state="active" />
                <MenuItem label="禁用" state="disabled" />
              </div>
              <div className="w-64 flex flex-col gap-1">
                <MenuItem label="默认" lead={{ kind: "icon", icon: <UserBoldDuotone size={20} /> }} />
                <MenuItem label="删除" intent="danger" lead={{ kind: "icon", icon: <TrashBinTrashBoldDuotone size={20} /> }} />
              </div>
            </div>
          </DocExample>
        </SubSection>
      </Section>

      <Section title="例子" description="下拉面板、图标按钮和三点菜单是三种打开方式。">
        <ExampleGrid>
          <DocExample id="dropdownpanel" title="DropdownPanel" summary="把多行选项和分隔线收成一块下拉面板。" code={CODE_DROPDOWN_USAGE} minHeight={300}>
            <DropdownPanel>
              <MenuItem lead={{ kind: "icon", icon: <HomeBoldDuotone size={20} /> }} label="首页" />
              <MenuItem lead={{ kind: "icon", icon: <UserBoldDuotone size={20} /> }} label="个人资料" />
              <MenuItem lead={{ kind: "icon", icon: <SettingsBoldDuotone size={20} /> }} label="设置" />
              <DropdownDivider />
              <MenuItem lead={{ kind: "icon", icon: <Logout3BoldDuotone size={20} /> }} label="退出登录" intent="danger" />
            </DropdownPanel>
          </DocExample>
          <DocExample id="icontrigger" title="IconTrigger" summary="图标按钮。badge 是数量，悬停显示 tooltip。" code={CODE_ICONTRIGGER_USAGE}>
            <IconTrigger icon={<BellBoldDuotone size={20} />} badge={3} tooltip="通知" />
            <IconTrigger icon={<LetterBoldDuotone size={20} />} tooltip="消息" />
          </DocExample>
          <DocExample id="kebabmenu" title="KebabMenu" summary="三点按钮展开操作列表，危险项单独标红。" code={CODE_KEBAB_USAGE} minHeight={180}>
            <KebabMenu
              items={[
                { icon: <PenNewSquareBoldDuotone size={20} />, label: "编辑" },
                { icon: <CopyBoldDuotone size={20} />, label: "创建副本" },
                { icon: <TrashBinTrashBoldDuotone size={20} />, label: "删除", danger: true },
              ]}
            />
          </DocExample>
          <DocExample id="dropdownmenu" title="DropdownMenu" summary="按钮展开的操作菜单，支持子菜单、分组、勾选和快捷键提示，键盘可全程操作。" code={CODE_DROPDOWNMENU_USAGE} minHeight={180}>
            <DropdownMenuDemo />
          </DocExample>
          <DocExample id="contextmenu" title="ContextMenu" summary="在区域上右键（触屏长按）弹出菜单。" code={CODE_CONTEXTMENU_USAGE} minHeight={180}>
            <ContextMenu items={[{ label: "复制", icon: <CopyBoldDuotone size={20} /> }, { label: "重命名", icon: <PenNewSquareBoldDuotone size={20} /> }, { type: "divider" }, { label: "删除", icon: <TrashBinTrashBoldDuotone size={20} />, danger: true }]} areaClassName="flex h-32 w-full max-w-sm items-center justify-center rounded-2xl border border-dashed border-fg-grey-300 text-sm text-fg-grey-700">
              在这里点右键
            </ContextMenu>
          </DocExample>
          <DocExample id="popover" title="Popover" summary="点开的小浮层，放一组设置或说明。" code={CODE_POPOVER_USAGE} minHeight={180}>
            <PopoverDemo />
          </DocExample>
        </ExampleGrid>
      </Section>

      <Section title="API" description="菜单项写下共用状态。面板、图标按钮和三点菜单只列自己的字段。">
        <ApiBlock id="menuitem" title="MenuItem" rows={MENUITEM_PROPS} />
        <ApiBlock id="dropdownpanel" title="DropdownPanel" rows={DROPDOWN_PROPS} />
        <ApiBlock id="icontrigger" title="IconTrigger" rows={ICONTRIGGER_PROPS} />
        <ApiBlock id="kebabmenu" title="KebabMenu" rows={KEBAB_PROPS} />
        <ApiBlock id="dropdownmenu" title="DropdownMenu" rows={DROPDOWNMENU_PROPS} />
        <ApiBlock id="contextmenu" title="ContextMenu" rows={CONTEXTMENU_PROPS} />
        <ApiBlock id="popover" title="Popover" rows={POPOVER_PROPS} />
      </Section>
    </div>
  );
}

function DropdownMenuDemo() {
  const [showOwner, setShowOwner] = useState(true);
  return (
    <DropdownMenu
      trigger={<Button variant="secondary">操作</Button>}
      items={[
        { label: "编辑", icon: <PenNewSquareBoldDuotone size={20} />, shortcut: "⌘E" },
        { label: "创建副本", icon: <CopyBoldDuotone size={20} /> },
        { type: "submenu", label: "移动到", icon: <HomeBoldDuotone size={20} />, items: [{ label: "项目 A" }, { label: "项目 B" }] },
        { type: "group", label: "显示", items: [{ type: "checkbox", label: "负责人", checked: showOwner, onCheckedChange: setShowOwner }] },
        { type: "divider" },
        { label: "删除", icon: <TrashBinTrashBoldDuotone size={20} />, danger: true },
      ]}
    />
  );
}

function PopoverDemo() {
  const [email, setEmail] = useState(true);
  return (
    <Popover title="通知设置" description="选择要接收的提醒" trigger={<Button variant="secondary">设置</Button>}>
      {close => (
        <>
          <label className="flex w-56 items-center justify-between text-sm text-fg-black">邮件提醒<Toggle checked={email} onChange={setEmail} ariaLabel="邮件提醒" /></label>
          <Button size="sm" onClick={close}>完成</Button>
        </>
      )}
    </Popover>
  );
}
