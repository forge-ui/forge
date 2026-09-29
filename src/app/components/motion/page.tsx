"use client";

import Link from "next/link";
import { useState } from "react";
import type { MotionPreference } from "@forge-ui-official/core";
import { PageHeading, Section } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock } from "../_api-table";
import { MotionOverlays, MotionAccordion, MotionTabContents, MotionToasts, MotionControl, MotionButtons, MotionMenus, MotionTabs, MotionNavigation, MotionTooltips, MotionSelection } from "../../_components/motion-demos";

export default function MotionPage() {
  const [motion, setMotion] = useState<MotionPreference>("auto");
  return <div className="flex flex-col gap-10">
    <PageHeading title="Motion · 交互动效" hint="按钮按压、菜单展开、标签切换与完成反馈。Core 默认开启轻量动效，并跟随系统减少动态效果的偏好。" />
    <MotionControl value={motion} onChange={setMotion} />
    <Section title="Usage" description="无需额外动画依赖。省略 motion 即为 auto；传入 none 可关闭单个组件的动效。">
      <CodeBlock code={'import { Button, Tooltip, TooltipGroup } from "@forge-ui-official/core";\n\n<Button>默认动效</Button>\n<Button motion="none">即时反馈</Button>'} />
    </Section>
    <Section title="Buttons" description="鼠标按压轻微缩放，键盘焦点保持清晰；禁用按钮不响应操作。">
      <PreviewBlock code={'<Button>保存修改</Button>\n<Button motion="none">关闭动效</Button>'}><MotionButtons motion={motion} /></PreviewBlock>
    </Section>
    <Section title="Menus" description="下拉淡入与退场，行高亮跟随鼠标和焦点；关闭时立即停止交互。选择选项或按 Escape 体验焦点恢复。">
      <PreviewBlock className="overflow-visible" minHeight={380} code={'<SelectOption options={options} value={value} onChange={setValue} />\n<KebabMenu items={[{ label: "编辑", onSelect: edit }]} />\n<ToolbarSelectDropdown options={options} onChange={setValue} />'}><MotionMenus motion={motion} /></PreviewBlock>
    </Section>
    <Section title="Tabs" description="共享指示器跟随实际文字宽度滑动。TabBar 支持左右方向键、Home 和 End。">
      <PreviewBlock code={'<TabBar tabs={tabs} onChange={setActiveTab} />\n<ButtonGroup items={items} activeIndex={active} onChange={setActive} />\n<ToolbarPillTabs tabs={tabs} onChange={setActiveTab} />'}><MotionTabs motion={motion} /></PreviewBlock>
    </Section>
    <Section title="Navigation" description="点击项目管理或团队设置，体验子菜单高度变化和箭头旋转。SidebarMenu 与 AppLayout 内置导航使用同一套展开动效。">
      <PreviewBlock code={'<SidebarMenu mainMenuItems={[\n  { label: "项目管理", children: [{ label: "全部项目" }] },\n]} />'}><MotionNavigation motion={motion} /></PreviewBlock>
    </Section>
    <Section title="Tooltip" description="首次悬停延迟 200ms，连续移到相邻按钮时立即显示。键盘聚焦立即显示，Escape 关闭。">
      <PreviewBlock minHeight={200} code={'<TooltipGroup delay={200} warmWindow={500}>\n  <Tooltip content="保存当前修改"><Button>保存</Button></Tooltip>\n  <Tooltip content="查看共享设置"><Button>共享</Button></Tooltip>\n</TooltipGroup>'}><MotionTooltips motion={motion} /></PreviewBlock>
    </Section>
    <Section title="Selection" description="开关滑动、勾选填充和完成排序；关闭动效后仍保留完整操作结果。">
      <PreviewBlock code={'<Toggle checked={enabled} onChange={setEnabled} />\n<CheckboxWithLabel label="同步到团队" checked={checked} onChange={setChecked} />\n<Checklist defaultTasks={tasks} />'}><MotionSelection motion={motion} /></PreviewBlock>
    </Section>
    <Section title="Overlays" description="弹窗与抽屉：遮罩、进退场、Escape、焦点限制与恢复。"><PreviewBlock code={"<Modal open={open} onOpenChange={setOpen} title=\"项目信息\">内容</Modal>"}><MotionOverlays motion={motion} /></PreviewBlock></Section>
    <Section title="Accordion" description="可变高度展开；方向键、Home 和 End 切换标题焦点。"><PreviewBlock code={"<Accordion items={items} />"}><MotionAccordion motion={motion} /></PreviewBlock></Section>
    <Section title="Tab contents" description="切换内容时淡入。activeKey 改变会重新挂载内容，表单状态请放在上层。"><PreviewBlock code={"<TabsContent activeKey={activeTab}>当前内容</TabsContent>"}><MotionTabContents motion={motion} /></PreviewBlock></Section>
    <Section title="Toast" description="消息默认 4 秒关闭；鼠标悬停或键盘聚焦时暂停计时，多条消息关闭后平滑补位。"><PreviewBlock code={"<ToastProvider><App /></ToastProvider>\n// App 内：const { toast } = useToast();\n// toast({ title: \"保存成功\", duration: 4000 });"}><MotionToasts motion={motion} /></PreviewBlock></Section>
    <Section title="API" description="motion 作用于接收该属性的组件；AppLayout 的 motion 作用于内置导航，不会隐式传给页面 children。">
      <ApiTable rows={[
        { attr: "motion", type: "'auto' | 'none'", defaultValue: "'auto'", description: "本页所展示组件的动效偏好。auto 遵循系统减少动态效果设置。" },
        { attr: "Modal / Drawer.open", type: "boolean", defaultValue: "必填", description: "受控显隐；通过 onOpenChange 接收关闭请求。title 为必填的可访问名称。" },
        { attr: "ConfirmationDialog.open", type: "boolean | undefined", defaultValue: "undefined", description: "省略时保持原有内联卡片；传入后作为弹窗，配合 onOpenChange。确认后由 onConfirm 决定何时关闭。" },
        { attr: "Drawer.side", type: "'left' | 'right'", defaultValue: "'right'", description: "抽屉滑入方向。" },
        { attr: "Accordion.value", type: "string | null", defaultValue: "undefined", description: "单项展开。支持 defaultValue 非受控模式及 onValueChange。" },
        { attr: "TabsContent.activeKey", type: "string | number", defaultValue: "必填", description: "内容切换标识，改变时重新挂载子内容。" },
        { attr: "ToastProvider.motion", type: "'auto' | 'none'", defaultValue: "'auto'", description: "通知入退场与补位的动效偏好。" },
        { attr: "toast(options)", type: "ToastOptions → string", defaultValue: "—", description: "useToast 返回 toast 与 dismiss(id)。options 包含 title、description、duration；duration=0 保持至手动关闭。" },
        { attr: "Tooltip.delay", type: "number", defaultValue: "200", description: "鼠标首次悬停延迟（ms）；键盘聚焦立即显示。" },
        { attr: "TooltipGroup.delay", type: "number", defaultValue: "200", description: "组内默认悬停延迟（ms）。" },
        { attr: "TooltipGroup.warmWindow", type: "number", defaultValue: "500", description: "关闭提示后，组内继续即时显示的时间窗口（ms）。" },
      ]} />
      <p className="text-sm leading-7 text-fg-grey-700">时长 token：按压 80ms、反馈 140ms、入场 180ms、退场 120ms、布局变化 200ms。DropdownPanel 提供内部行高亮，显隐动效由 Select、KebabMenu 等上层组件管理。</p>
    </Section>
    <Link href="/cases/motion" className="text-sm text-fg-violet hover:underline">查看动效矩阵 →</Link>
  </div>;
}
