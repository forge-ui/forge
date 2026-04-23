"use client";

import Link from "next/link";
import {
  MenuItem,
  DropdownPanel,
  DropdownDivider,
  IconTrigger,
  KebabMenu,
} from "@forge-ui/react";
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
} from "solar-icon-set";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import {
  MenuItem, DropdownPanel, DropdownDivider,
  IconTrigger, KebabMenu,
} from "@forge-ui/react";`;

const CODE_MENUITEM_USAGE = `<MenuItem lead={{ kind: "icon", icon: <HomeBoldDuotone size={20} /> }} label="Home" />
<MenuItem lead={{ kind: "icon", icon: <SettingsBoldDuotone size={20} /> }} label="Settings" active />`;

const CODE_MENUITEM_STATES = `<MenuItem label="Idle" state="idle" />
<MenuItem label="Hover" state="hover" />
<MenuItem label="Active" state="active" />
<MenuItem label="Disabled" state="disabled" />`;

const CODE_MENUITEM_INTENT = `<MenuItem label="Default" />
<MenuItem label="Delete" intent="danger" lead={{ kind: "icon", icon: <TrashBinTrashBoldDuotone size={20} /> }} />`;

const CODE_DROPDOWN_USAGE = `<DropdownPanel>
  <MenuItem lead={{ kind: "icon", icon: <HomeBoldDuotone size={20} /> }} label="Home" />
  <MenuItem lead={{ kind: "icon", icon: <UserBoldDuotone size={20} /> }} label="Profile" />
  <DropdownDivider />
  <MenuItem lead={{ kind: "icon", icon: <Logout3BoldDuotone size={20} /> }} label="Log out" intent="danger" />
</DropdownPanel>`;

const CODE_ICONTRIGGER_USAGE = `<IconTrigger icon={<BellBoldDuotone size={20} />} badge={3} tooltip="Notifications" />`;

const CODE_KEBAB_USAGE = `<KebabMenu
  items={[
    { icon: <PenNewSquareBoldDuotone size={20} />, label: "Edit" },
    { icon: <CopyBoldDuotone size={20} />, label: "Duplicate" },
    { icon: <TrashBinTrashBoldDuotone size={20} />, label: "Delete", danger: true },
  ]}
/>`;

const MENUITEM_PROPS: ApiTableRow[] = [
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "active 态主色。" },
  { attr: "surface", type: "'default' | 'onColoredBg'", defaultValue: "'default'", description: "onColoredBg 用于色底 sidebar 内。" },
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
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "open 态主色背景。" },
  { attr: "state", type: "'idle' | 'hover' | 'open'", defaultValue: "'idle'", description: "受控视觉状态。" },
  { attr: "surface", type: "'default' | 'onColoredBg'", defaultValue: "'default'", description: "在色底上采用半透明白。" },
  { attr: "badge", type: "number", defaultValue: "—", description: "右上红色徽标。" },
  { attr: "tooltip", type: "string", defaultValue: "—", description: "hover/open 时自动显示的 tooltip 文案。" },
  { attr: "tooltipPosition", type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: "'right'", description: "tooltip 位置。" },
  { attr: "panel", type: "ReactNode | (close) => ReactNode", defaultValue: "—", description: "传了 panel 后内建 open 态，点击切换显隐。" },
];

const KEBAB_PROPS: ApiTableRow[] = [
  { attr: "items", type: "KebabMenuItem[]", defaultValue: "—", description: "菜单项 { icon?, label, onSelect?, danger? }。" },
  { attr: "accent", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "触发器 open 态主色。" },
  { attr: "surface", type: "'default' | 'onColoredBg'", defaultValue: "'default'", description: "触发器 surface。" },
  { attr: "align", type: "'left' | 'right'", defaultValue: "'right'", description: "弹出面板对齐边。" },
];

export default function MenuCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Menu"
        hint="MenuItem / DropdownPanel / DropdownDivider / IconTrigger / KebabMenu — 菜单构件族。"
      />

      <Section title="MenuItem" description="菜单行。3 kind × 4 state × 2 surface × 2 intent。">
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_MENUITEM_USAGE} minHeight={160}>
            <div className="w-64 flex flex-col gap-1">
              <MenuItem lead={{ kind: "icon", icon: <HomeBoldDuotone size={20} /> }} label="Home" />
              <MenuItem lead={{ kind: "icon", icon: <SettingsBoldDuotone size={20} /> }} label="Settings" active />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="States" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            4 种 state：idle / hover / active / disabled。
          </p>
          <PreviewBlock code={CODE_MENUITEM_STATES} minHeight={220}>
            <div className="w-64 flex flex-col gap-1">
              <MenuItem label="Idle" state="idle" />
              <MenuItem label="Hover" state="hover" />
              <MenuItem label="Active" state="active" />
              <MenuItem label="Disabled" state="disabled" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Danger Intent" stack>
          <PreviewBlock code={CODE_MENUITEM_INTENT} minHeight={160}>
            <div className="w-64 flex flex-col gap-1">
              <MenuItem label="Default" lead={{ kind: "icon", icon: <UserBoldDuotone size={20} /> }} />
              <MenuItem label="Delete" intent="danger" lead={{ kind: "icon", icon: <TrashBinTrashBoldDuotone size={20} /> }} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={MENUITEM_PROPS} />
        </SubSection>
      </Section>

      <Section title="DropdownPanel" description="白底圆角浮层容器，装一组 MenuItem + DropdownDivider。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_DROPDOWN_USAGE} minHeight={300}>
            <DropdownPanel>
              <MenuItem lead={{ kind: "icon", icon: <HomeBoldDuotone size={20} /> }} label="Home" />
              <MenuItem lead={{ kind: "icon", icon: <UserBoldDuotone size={20} /> }} label="Profile" />
              <MenuItem lead={{ kind: "icon", icon: <SettingsBoldDuotone size={20} /> }} label="Settings" />
              <DropdownDivider />
              <MenuItem lead={{ kind: "icon", icon: <Logout3BoldDuotone size={20} /> }} label="Log out" intent="danger" />
            </DropdownPanel>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={DROPDOWN_PROPS} />
        </SubSection>
      </Section>

      <Section title="IconTrigger" description="圆形图标按钮，可选 badge / tooltip / 内置 panel。">
        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            hover 自动显示 <InlineCode>tooltip</InlineCode>。传 <InlineCode>panel</InlineCode> 后点击切换内置浮层。
          </p>
          <PreviewBlock code={CODE_ICONTRIGGER_USAGE}>
            <IconTrigger icon={<BellBoldDuotone size={20} />} badge={3} tooltip="Notifications" />
            <IconTrigger icon={<LetterBoldDuotone size={20} />} tooltip="Messages" />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={ICONTRIGGER_PROPS} />
        </SubSection>
      </Section>

      <Section title="KebabMenu" description="三点展开菜单。内部装 IconTrigger + DropdownPanel，items 传配置即可。">
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_KEBAB_USAGE} minHeight={180}>
            <KebabMenu
              items={[
                { icon: <PenNewSquareBoldDuotone size={20} />, label: "Edit" },
                { icon: <CopyBoldDuotone size={20} />, label: "Duplicate" },
                { icon: <TrashBinTrashBoldDuotone size={20} />, label: "Delete", danger: true },
              ]}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={KEBAB_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/menu" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
