"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { MotionPreference } from "@forge-ui-official/core";
import { Section } from "../components/_shared";
import { ExampleCode } from "../components/_example-code";
import { AdditionalComponentApi } from "../components/_additional-component-api";
import { AnimatedWidgetDemos } from "./animated-widget-demos";
import { MotionOverlays, MotionAccordion, MotionTabContents, MotionToasts, MotionControl, MotionButtons, MotionMenus, MotionTabs, MotionNavigation, MotionTooltips, MotionSelection } from "./motion-demos";

const families = new Set(["button-link", "input-field", "calendar", "tab", "agent", "menu", "tooltip", "modal", "accordion", "feedback"]);

/** Interactive variants belong to the component's family, not to a motion category. */
export function FamilyInteractionDemos() {
  const pathname = usePathname();
  const [motion, setMotion] = useState<MotionPreference>("auto");
  const parts = pathname.split("/").filter(Boolean);
  const family = parts[1];
  if (parts[0] !== "cases" || parts.length !== 2 || !families.has(family)) return null;
  return <div className="flex min-w-0 flex-col gap-8">
    <MotionControl value={motion} onChange={setMotion} />
    {family === "calendar" && <AnimatedWidgetDemos only="calendar" motion={motion} />}
    {family === "input-field" && <><AnimatedWidgetDemos only="otp" motion={motion} /><Section title="选择与完成反馈" description="体验拖动开关、勾选和完成排序。"><MotionSelection motion={motion} /></Section></>}
    {family === "agent" && <AnimatedWidgetDemos only="members" motion={motion} />}
    {family === "button-link" && <Section title="按压与焦点反馈" description="体验鼠标按压、键盘焦点和禁用状态。"><MotionButtons motion={motion} /></Section>}
    {family === "menu" && <><Section title="菜单展开与选择" description="选择菜单项，或按 Escape 关闭并恢复焦点。"><MotionMenus motion={motion} /></Section><Section title="导航展开与收起" description="连续展开和收起分支，查看内容与箭头的过渡。"><MotionNavigation motion={motion} /></Section></>}
    {family === "tab" && <><AnimatedWidgetDemos only="tabs" motion={motion} /><Section title="页签指示器" description="点击不同长度的标签，也可用方向键切换。"><MotionTabs motion={motion} /></Section><Section title="内容切换" description="切换时淡入内容，保留明确的选中状态。"><MotionTabContents motion={motion} /></Section></>}
    {family === "tooltip" && <Section title="连续悬停与焦点提示" description="在多个按钮间移动，或用 Tab 聚焦、Escape 关闭提示。"><div className="py-10"><MotionTooltips motion={motion} /></div></Section>}
    {family === "modal" && <Section title="弹窗与抽屉" description="打开弹窗看进入 180ms、离开 120ms。连点关闭、按 Esc 或点遮罩会从当前画面折返，不会把上一段播完。"><MotionOverlays motion={motion} /></Section>}
    {family === "accordion" && <Section title="折叠面板" description="展开一组说明。方向键、Home 和 End 可以移动标题焦点。"><MotionAccordion motion={motion} /></Section>}
    {family === "feedback" && <Section title="短消息" description="悬停或聚焦时暂停计时。关闭一条后，其余消息补位。"><MotionToasts motion={motion} /></Section>}
    <ExampleCode files={["src/app/_components/motion-demos.tsx", "src/app/_components/animated-widget-demos.tsx"]} />
    <AdditionalComponentApi family={family} exclude={["OtpInput", "LiquidTabs", "AddMember"]} />
  </div>;
}
