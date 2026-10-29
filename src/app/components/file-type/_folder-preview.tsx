"use client";

import { useState } from "react";
import { Folder, FolderFloat, type FolderProps } from "@forge-ui-official/core";
import { Section } from "../_shared";

export function FolderPreview() {
  const [mode, setMode] = useState<"flap" | "book">("flap");
  const [variant, setVariant] = useState<"solid" | "glass" | "matte">("solid");
  const [layout, setLayout] = useState<"spread" | "stack" | "row">("spread");
  const [color, setColor] = useState<"violet" | "blue" | "green">("blue");
  const [size, setSize] = useState<FolderProps["size"]>("md");
  const [trigger, setTrigger] = useState<"hover" | "click">("hover");
  const [note, setNote] = useState("悬停或点击文件夹，查看浮出的便签。");
  const [selected, setSelected] = useState("点击文件夹展开，再选择一张文件卡片。");
  return <div className="flex flex-col gap-10">
    <Section title="动态文件夹预览" description="点击展开或收起，使用 Tab 和回车也可以操作。点击卡片放大，支持拖动；按 Esc 收起。">
      <div className="flex flex-wrap gap-6 text-sm">
        <label>开合 <select value={mode} onChange={e => setMode(e.target.value as typeof mode)}><option value="flap">翻盖</option><option value="book">书本</option></select></label>
        <label>材质 <select value={variant} onChange={e => setVariant(e.target.value as typeof variant)}><option value="solid">实色</option><option value="glass">玻璃</option><option value="matte">哑光</option></select></label>
        <label>布局 <select value={layout} onChange={e => setLayout(e.target.value as typeof layout)}><option value="spread">散开</option><option value="stack">堆叠</option><option value="row">横排</option></select></label>
        <label>颜色 <select value={color} onChange={e => setColor(e.target.value as "violet" | "blue" | "green")}><option value="violet">紫色</option><option value="blue">蓝色</option><option value="green">绿色</option></select></label>
        <label>尺寸 <select value={size} onChange={e => setSize(e.target.value as FolderProps["size"])}><option value="sm">小</option><option value="md">中</option><option value="lg">大</option></select></label>
      </div>
      <div className="flex min-h-80 items-center justify-center p-8"><Folder mode={mode} variant={variant} layout={layout} draggable zoomOnClick label="项目资料" color={color} size={size} items={[{ id: "brief", label: "项目说明", content: "项目目标与交付范围" }, { id: "design", label: "设计方案", content: "页面布局与视觉规范" }, { id: "review", label: "评审记录", content: "讨论结论与待办事项" }]} onItemClick={item => setSelected(`已选择：${item.label}`)} /></div>
      <p role="status" className="text-sm text-fg-grey-600">{selected}</p>
    </Section>
    <Section title="浮动便签文件夹" description="便签依次弹出，在文件夹上方展开；选择便签后收起。">
      <label className="text-sm">触发方式 <select value={trigger} onChange={e => setTrigger(e.target.value as "hover" | "click")}><option value="hover">悬停</option><option value="click">点击</option></select></label>
      <div className="flex justify-center"><FolderFloat label="设计反馈" color={color} trigger={trigger} items={[{id:"layout",label:"调整页面布局"},{id:"color",label:"确认品牌配色"},{id:"copy",label:"精简提示文案"},{id:"review",label:"安排设计评审"}]} onSelect={id => setNote(`已选择：${({layout:"调整页面布局",color:"确认品牌配色",copy:"精简提示文案",review:"安排设计评审"} as Record<string,string>)[id]}`)} /></div>
      <p role="status" className="text-sm text-fg-grey-600">{note}</p>
    </Section>
    <Section title="使用说明" description="从 @forge-ui-official/core 导入 Folder。label 为文件夹名称，items 接收 id、label 和可选 content。通过 open / onOpenChange 控制展开状态，onItemClick 接收所选文件。">
      <p className="text-sm text-fg-grey-600">浮动便签使用 FolderFloat，通过 onSelect 获取选中的便签。</p>
    </Section>
  </div>;
}
