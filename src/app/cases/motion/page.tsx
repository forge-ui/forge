"use client";

import Link from "next/link";
import { useState } from "react";
import type { MotionPreference } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { MotionOverlays, MotionAccordion, MotionTabContents, MotionToasts, MotionControl, MotionButtons, MotionMenus, MotionTabs, MotionNavigation, MotionTooltips, MotionSelection } from "../../_components/motion-demos";

export default function MotionCasePage() {
  const [motion, setMotion] = useState<MotionPreference>("auto");
  return <div className="flex flex-col gap-10">
    <PageHeading title="Motion · 交互动效" hint="集中体验 Core 默认交互。切换动效开关，比较同一组件的过渡与即时反馈；操作状态保留。" />
    <MotionControl value={motion} onChange={setMotion} />
    <Section title="Buttons" description="按压、键盘焦点和禁用状态。"><SubSection title="Button / IconButton" stack><MotionButtons motion={motion} /></SubSection></Section>
    <Section title="Menus" description="打开下拉、移动高亮，选择或按 Escape 关闭；也可以在退场完成前再次打开。"><SubSection title="Select / Kebab / IconTrigger / Suffix" stack><div className="min-h-72"><MotionMenus motion={motion} /></div></SubSection></Section>
    <Section title="Tabs" description="点击不同长度的标签；TabBar 也支持方向键。"><SubSection title="TabBar / ButtonGroup / ToolbarPillTabs" stack><MotionTabs motion={motion} /></SubSection></Section>
    <Section title="Navigation" description="展开或连续收放分支，查看高度和箭头的变化。"><SubSection title="SidebarMenu"><MotionNavigation motion={motion} /></SubSection></Section>
    <Section title="Tooltip" description="悬停后跨按钮移动，或用 Tab 聚焦与 Escape 关闭。"><SubSection title="TooltipGroup"><div className="py-10"><MotionTooltips motion={motion} /></div></SubSection></Section>
    <Section title="Selection" description="滑动、勾选、划线与完成排序。"><SubSection title="Toggle / Checkbox / Checklist" stack><MotionSelection motion={motion} /></SubSection></Section>
    <Section title="Overlays" description="弹窗与抽屉：遮罩、进退场、Escape、焦点限制与恢复。"><MotionOverlays motion={motion} /></Section>
    <Section title="Accordion" description="可变高度展开；方向键、Home 和 End 切换标题焦点。"><MotionAccordion motion={motion} /></Section>
    <Section title="Tab contents" description="切换内容时淡入。activeKey 改变会重新挂载内容，表单状态请放在上层。"><MotionTabContents motion={motion} /></Section>
    <Section title="Toast" description="消息默认 4 秒关闭；鼠标悬停或键盘聚焦时暂停计时，多条消息关闭后平滑补位。"><MotionToasts motion={motion} /></Section>
    <Link href="/components/motion" className="text-sm text-fg-violet hover:underline">查看属性和代码示例 →</Link>
  </div>;
}
