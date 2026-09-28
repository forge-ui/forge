"use client";

import { useState } from "react";
import {
  Modal, Drawer, Accordion, TabsContent, ToastProvider, useToast, ConfirmationDialog,
  Button, IconButton, IconTrigger, KebabMenu, SelectOption, TextFieldSelectSuffix,
  ToolbarSelectDropdown, TabBar, ButtonGroup, ToolbarPillTabs,
  Toggle, CheckboxWithLabel, Checklist, SidebarMenu, Tooltip, TooltipGroup,
  type MotionPreference,
} from "@forge-ui-official/core";
import { AddCircleLinear } from "@forge-ui-official/core/icons";

const options = [
  { value: "all", label: "所有项目" },
  { value: "active", label: "进行中" },
  { value: "done", label: "已完成" },
];
const row = "flex flex-wrap items-center gap-4";

export function MotionControl({ value, onChange }: { value: MotionPreference; onChange: (value: MotionPreference) => void }) {
  return <div className={row}>
    <Toggle checked={value === "auto"} onChange={(enabled) => onChange(enabled ? "auto" : "none")} motion="none" ariaLabel="启用示例动效" />
    <span className="text-sm text-fg-grey-700">{value === "auto" ? "自动动效 · 跟随系统偏好" : "关闭动效 · 保留即时反馈"}</span>
  </div>;
}

export function MotionButtons({ motion }: { motion: MotionPreference }) {
  const [count, setCount] = useState(0);
  return <div className={row}>
    <Button motion={motion} onClick={() => setCount(count + 1)}>保存修改</Button>
    <Button motion={motion} variant="tertiary" onClick={() => setCount(count + 1)}>共享项目</Button>
    <IconButton motion={motion} aria-label="添加项目" onClick={() => setCount(count + 1)}><AddCircleLinear size={20} /></IconButton>
    <Button motion={motion} disabled>不可用</Button>
    <span aria-live="polite" className="text-sm text-fg-grey-700">已操作 {count} 次</span>
  </div>;
}

export function MotionMenus({ motion }: { motion: MotionPreference }) {
  const [value, setValue] = useState("all");
  const [suffix, setSuffix] = useState("天");
  const [action, setAction] = useState("尚未选择操作");
  return <div className="flex w-full flex-col gap-5">
    <div className={row}>
      <SelectOption motion={motion} label="项目范围" options={options} value={value} onChange={setValue} />
      <ToolbarSelectDropdown motion={motion} placeholder="项目状态" value={value} options={options} onChange={setValue} />
      <KebabMenu motion={motion} items={[{ label: "编辑项目", onSelect: () => setAction("已选择编辑项目") }, { label: "复制链接", onSelect: () => setAction("已选择复制链接") }]} />
      <IconTrigger motion={motion} icon={<AddCircleLinear size={20} />} ariaLabel="快捷操作" panel={(close) => <Button motion={motion} onClick={() => { setAction("已创建草稿"); close(); }}>创建草稿</Button>} />
      <TextFieldSelectSuffix motion={motion} value={suffix} options={["天", "周", "月"]} onChange={setSuffix} />
    </div>
    <p aria-live="polite" className="text-sm text-fg-grey-700">{action}</p>
  </div>;
}

export function MotionTabs({ motion }: { motion: MotionPreference }) {
  const [tab, setTab] = useState(0);
  const [group, setGroup] = useState(0);
  const [pill, setPill] = useState(0);
  return <div className="flex w-full flex-col items-start gap-6">
    <TabBar className="max-w-full overflow-x-auto" motion={motion} tabs={["概览", "客户与订单", "团队设置"].map((label, i) => ({ label, active: tab === i }))} onChange={setTab} />
    <div className={row}>
      <ButtonGroup motion={motion} items={[{ label: "列表" }, { label: "看板视图" }, { label: "日历" }]} activeIndex={group} onChange={setGroup} />
      <ToolbarPillTabs motion={motion} tabs={["全部", "我的收藏"].map((label, i) => ({ label, active: pill === i }))} onChange={setPill} />
    </div>
  </div>;
}

export function MotionNavigation({ motion }: { motion: MotionPreference }) {
  return <SidebarMenu motion={motion} logoText="工作空间" width="min(248px, 100%)" mainMenuItems={[
    { label: "工作概览", active: true },
    { label: "项目管理", children: [{ label: "全部项目" }, { label: "项目归档" }] },
    { label: "团队设置", children: [{ label: "成员管理" }, { label: "角色权限" }] },
  ]} />;
}

export function MotionTooltips({ motion }: { motion: MotionPreference }) {
  return <TooltipGroup delay={200} warmWindow={500}>
    <div className={row}>
      <Tooltip motion={motion} content="保存当前修改"><Button motion={motion}>保存</Button></Tooltip>
      <Tooltip motion={motion} content="查看共享设置"><Button motion={motion} variant="tertiary">共享</Button></Tooltip>
      <Tooltip motion={motion} content="查看版本记录"><Button motion={motion} variant="tertiary">历史</Button></Tooltip>
    </div>
  </TooltipGroup>;
}

export function MotionSelection({ motion }: { motion: MotionPreference }) {
  const [enabled, setEnabled] = useState(false);
  const [checked, setChecked] = useState(false);
  return <div className="flex w-full flex-col gap-5">
    <div className={row}>
      <Toggle motion={motion} checked={enabled} onChange={setEnabled} ariaLabel="项目通知" />
      <span className="text-sm text-fg-grey-700">项目通知</span>
      <CheckboxWithLabel motion={motion} checked={checked} onChange={setChecked} label="同步到团队" />
    </div>
    <Checklist motion={motion} defaultTasks={[{ id: "scope", label: "确认项目范围" }, { id: "requirements", label: "整理客户需求" }, { id: "review", label: "安排下一次评审" }]} />
  </div>;
}


export function MotionOverlays({ motion }: { motion: MotionPreference }) {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState("尚未确认");
  return <div className={row}>
    <Button motion={motion} onClick={() => setModal(true)}>打开弹窗</Button>
    <Button motion={motion} variant="tertiary" onClick={() => setDrawer(true)}>打开抽屉</Button>
    <Button motion={motion} variant="tertiary" onClick={() => setConfirm(true)}>确认操作</Button>
    <span className="text-sm text-fg-grey-700" aria-live="polite">{result}</span>
    <Modal open={modal} onOpenChange={setModal} title="项目信息" motion={motion} footer={<Button motion={motion} onClick={() => setModal(false)}>完成</Button>}><p className="text-sm text-fg-grey-700">轻微缩放与遮罩淡入。按 Escape 或点击遮罩关闭，焦点回到打开按钮。</p></Modal>
    <Drawer open={drawer} onOpenChange={setDrawer} title="项目详情" motion={motion} footer={<Button motion={motion} onClick={() => setDrawer(false)}>完成</Button>}><p className="text-sm text-fg-grey-700">从侧边滑入，保留当前页面上下文。Tab 焦点限制在抽屉内。</p></Drawer>
    <ConfirmationDialog open={confirm} onOpenChange={setConfirm} title="归档项目？" description="这是交互示例，不会修改业务数据。" color="purple" confirmLabel="确认归档" motion={motion} onConfirm={() => { setResult("已确认归档"); setConfirm(false); }} />
  </div>;
}

export function MotionAccordion({ motion }: { motion: MotionPreference }) {
  return <Accordion motion={motion} items={[
    { value: "scope", title: "项目范围", content: "包含客户管理、订单管理和团队协作。内容高度自动变化，支持连续展开与收起。" },
    { value: "delivery", title: "交付安排", content: <div className="space-y-3"><p>第一阶段：确认需求与设计。</p><p>第二阶段：开发、验证与交付。</p><Button motion={motion} variant="tertiary">查看交付说明</Button></div> },
    { value: "disabled", title: "尚未开放", content: "不可用内容", disabled: true },
  ]} />;
}

export function MotionTabContents({ motion }: { motion: MotionPreference }) {
  const [active, setActive] = useState(0);
  const labels = ["项目概览", "交付计划", "团队协作"];
  const descriptions = ["查看项目目标、负责人和当前进展。", "按阶段安排需求确认、开发与验收。", "共享进展，让成员及时了解任务变化。"];
  return <div className="w-full space-y-5"><TabBar motion={motion} className="max-w-full overflow-x-auto" tabs={labels.map((label, i) => ({ label, active: active === i }))} onChange={setActive} /><TabsContent activeKey={active} motion={motion} ariaLabel={labels[active]}><p className="text-sm leading-7 text-fg-grey-700">{descriptions[active]}</p></TabsContent></div>;
}

function ToastActions({ motion }: { motion: MotionPreference }) {
  const { toast } = useToast();
  return <div className={row}><Button motion={motion} onClick={() => toast({ title: "保存成功", description: "项目修改已保存。" })}>显示消息</Button><Button motion={motion} variant="tertiary" onClick={() => { toast({title: "上传完成"}); toast({title: "处理完成"}); toast({title: "报告已就绪"}); }}>连续三条</Button><Button motion={motion} variant="tertiary" onClick={() => toast({title: "等待确认", description: "这条通知需要手动关闭。", duration: 0})}>常驻消息</Button></div>;
}
export function MotionToasts({ motion }: { motion: MotionPreference }) {
  return <ToastProvider motion={motion}><ToastActions motion={motion} /></ToastProvider>;
}
