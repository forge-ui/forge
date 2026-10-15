"use client";

import { useRef, useState } from "react";
import {
  AltArrowRightLinear,
  AltArrowLeftLinear,
  AddCircleLinear,
  CloseCircleLinear,
  PenLinear,
  HeartLinear,
} from "@forge-ui-official/core/icons";
import { Button, IconButton, StyledLink, SurfaceCard, TextField } from "@forge-ui-official/core";
import { PageHeading, Section, Labeled } from "../_shared";

export default function ButtonLinkCasePage() {
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);
  const [projectCount, setProjectCount] = useState(0);
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("季度推广计划");
  const [draft, setDraft] = useState(title);
  const editEntry = useRef<HTMLDivElement>(null);
  const finishEditing = () => {
    setEditing(false);
    editEntry.current?.querySelector("button")?.focus({ preventScroll: true });
  };

  return (
    <div className="flex flex-col gap-10">
      <PageHeading title="按钮与链接" hint="完成操作用按钮，前往其他内容用链接。体验保存、添加、收藏与禁用时的反馈。" />

      <Section title="主要与次要操作" description="突出当前最重要的动作，把预览和重置放在旁边。">
        <div className="flex flex-wrap items-center gap-3">
          <Button color="blue" result={saved ? "success" : "idle"} resultLabel="已保存" onClick={() => setSaved(true)}>保存修改</Button>
          <Button color="blue" variant="secondary" aria-expanded={preview} onClick={() => setPreview(value => !value)}>{preview ? "收起预览" : "预览内容"}</Button>
          <Button color="black" variant="tertiary" onClick={() => { setSaved(false); setPreview(false); }}>重置示例</Button>
        </div>
        <p className="text-sm text-fg-grey-700" role="status">{saved ? "修改已在本地示例中保存。" : "修改尚未保存。"}</p>
        {preview && <SurfaceCard title="项目预览"><p className="text-sm text-fg-grey-700">整理推广素材、确认上线时间，让团队围绕同一份计划协作。</p></SurfaceCard>}
      </Section>

      <Section title="带图标的操作" description="图标辅助说明添加和前进，文字始终交代会发生什么。">
        <div className="flex flex-wrap items-center gap-3">
          <Button color="purple" size="md" iconLeft={<AddCircleLinear size={18} />} onClick={() => setProjectCount(value => value + 1)}>添加项目</Button>
          <Button color="blue" size="md" variant="secondary" iconRight={<AltArrowRightLinear size={18} />} disabled={step === 3} onClick={() => setStep(value => Math.min(3, value + 1))}>下一步</Button>
          <Button color="black" size="sm" variant="tertiary" iconLeft={<AltArrowLeftLinear size={16} />} disabled={step === 1} onClick={() => setStep(value => Math.max(1, value - 1))}>上一步</Button>
        </div>
        <p className="text-sm text-fg-grey-700" role="status">已添加 {projectCount} 个项目 · 当前第 {step} 步，共 3 步。</p>
      </Section>

      <Section title="条件未满足时禁用" description="先选择项目，再执行移除；用文字说明暂时不可用的原因。">
        <div className="flex flex-wrap items-center gap-3">
          <Button color="black" variant="secondary" aria-pressed={selected} onClick={() => { setSelected(value => !value); setRemoved(false); }}>{selected ? "取消选择" : "选择示例项目"}</Button>
          <Button color="blue" disabled={!selected} iconLeft={<CloseCircleLinear size={18} />} onClick={() => { setSelected(false); setRemoved(true); }}>移除所选项目</Button>
          <IconButton color="black" variant="ghost" shape="square" disabled={!selected} aria-label="移除所选项目" onClick={() => { setSelected(false); setRemoved(true); }}><CloseCircleLinear size={18} /></IconButton>
        </div>
        <p className="text-sm text-fg-grey-700" role="status">{removed ? "已在本地示例中移除。可以重新选择并继续体验。" : selected ? "已选中 1 个示例项目，可以移除。" : "尚未选择项目，移除操作暂不可用。"}</p>
      </Section>

      <Section title="紧凑的图标动作" description="用于收藏或列表编辑；每个图标都有可供键盘和辅助工具识别的名称。">
        <div className="flex flex-wrap items-start gap-6">
          <Labeled label={liked ? "已收藏" : "收藏计划"}><IconButton color="purple" active={liked} variant={liked ? "primary" : "secondary"} shape="circle" aria-label={liked ? "取消收藏计划" : "收藏计划"} onClick={() => setLiked(value => !value)}><HeartLinear size={20} /></IconButton></Labeled>
          <div ref={editEntry}><Labeled label="编辑标题"><IconButton color="black" variant="tertiary" shape="square" aria-label="编辑计划标题" aria-expanded={editing} onClick={() => { setDraft(title); setEditing(true); }}><PenLinear size={18} /></IconButton></Labeled></div>
        </div>
        <SurfaceCard title={editing ? "编辑计划标题" : title}>
          {editing ? <form className="flex flex-col gap-3" onSubmit={event => { event.preventDefault(); if (draft.trim()) { setTitle(draft.trim()); finishEditing(); } }}><TextField label="计划标题" value={draft} onChange={setDraft} required color="blue" /><div className="flex flex-wrap gap-3"><Button type="submit" size="sm" color="blue" disabled={!draft.trim()}>保存标题</Button><Button size="sm" color="black" variant="tertiary" onClick={finishEditing}>取消编辑</Button></div></form> : <p className="text-sm text-fg-grey-700" role="status">{liked ? "已加入收藏，便于下次查找。" : "点击收藏或编辑，体验同一计划上的常用动作。"}</p>}
        </SurfaceCard>
      </Section>

      <Section title="文字链接" description="链接会前往明确的目标；暂未开放的入口保留说明。">
        <div className="flex flex-wrap items-center gap-6">
          <StyledLink href="/docs" color="blue" iconRight={<AltArrowRightLinear size={16} />}>阅读使用文档</StyledLink>
          <StyledLink href="/components/button-link" color="purple">查看按钮组件</StyledLink>
          <StyledLink href="/cases" color="gray" iconLeft={<AltArrowLeftLinear size={16} />}>返回案例分类</StyledLink>
          <Labeled label="项目发布后开放"><StyledLink href="/cases/button-link" color="gray" disabled>查看发布记录</StyledLink></Labeled>
        </div>
      </Section>
    </div>
  );
}
