"use client";

import { useState } from "react";
import { Button, Checkbox, ProgressBar, SelectOption, TextField, Toggle, cn } from "@forge-ui-official/core";
import { CheckCircleBold } from "@forge-ui-official/core/icons";

export interface OnboardingValue {
  workspace: string;
  industry: string;
  tools: string[];
  invites: string;
  template: string;
}

const steps = [
  { id: "workspace", title: "创建工作区", hint: "约 1 分钟" },
  { id: "tools", title: "连接常用工具", hint: "可稍后再连" },
  { id: "team", title: "邀请团队成员", hint: "最多 10 人" },
  { id: "agent", title: "创建第一个智能体", hint: "从模板开始" },
];
const tools = [{ id: "feishu", name: "飞书", note: "群聊、日程与文档" }, { id: "crm", name: "知行 CRM", note: "客户与商机数据" }, { id: "mail", name: "企业邮箱", note: "收发与归档邮件" }, { id: "drive", name: "云盘", note: "资料自动进知识库" }];
const templates = [{ id: "support", name: "售后问答助手", note: "基于知识库回答客户问题" }, { id: "weekly", name: "周报助手", note: "汇总任务与会议生成周报" }, { id: "sales", name: "商机助手", note: "整理客户背景与跟进话术" }];

export interface OnboardingFlowProps {
  initialValue?: Partial<OnboardingValue>;
  onFinish?: (value: OnboardingValue) => void;
  className?: string;
}

export function OnboardingFlow({ initialValue, onFinish, className }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [value, setValue] = useState<OnboardingValue>({ workspace: "知行科技", industry: "software", tools: ["feishu"], invites: "", template: "support", ...initialValue });
  const canNext = step !== 0 || value.workspace.trim().length > 0;

  function next() {
    if (step < steps.length - 1) { setStep(step + 1); return; }
    setFinished(true);
    onFinish?.(value);
  }

  return <div className={cn("mx-auto grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-card border border-fg-grey-200 bg-white md:grid-cols-[280px_minmax(0,1fr)]", className)}>
    <aside className="flex flex-col gap-6 bg-fg-grey-50 p-6">
      <div><p className="text-sm font-medium text-fg-blue">欢迎使用知行科技工作台</p><p className="mt-1 text-xl font-semibold text-fg-black">几步完成准备</p></div>
      <ProgressBar value={finished ? 100 : Math.round((step / steps.length) * 100)} color="blue" label={`${finished ? steps.length : step} / ${steps.length} 已完成`} size="sm" />
      <ol className="flex flex-col gap-2">{steps.map((item, index) => {
        const done = finished || index < step;
        return <li key={item.id}><Button variant="unstyled" type="button" disabled={index > step || finished} onClick={() => setStep(index)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors", index === step && !finished ? "bg-white shadow-sm" : "hover:bg-white/60")}>
          {done ? <span className="text-fg-green-500"><CheckCircleBold size={22} /></span> : <span className={cn("grid size-[22px] place-items-center rounded-full border-2 text-[11px] font-semibold", index === step ? "border-fg-blue text-fg-blue" : "border-fg-grey-300 text-fg-grey-500")}>{index + 1}</span>}
          <span><span className={cn("block text-sm font-semibold", done ? "text-fg-grey-700" : "text-fg-black")}>{item.title}</span><span className="block text-xs text-fg-grey-500">{item.hint}</span></span>
        </Button></li>;
      })}</ol>
    </aside>
    <div className="flex min-h-[460px] flex-col gap-6 p-6 sm:p-10">
      {finished ? <div className="m-auto flex max-w-sm flex-col items-center gap-4 text-center"><span className="text-fg-green-500"><CheckCircleBold size={56} /></span><p className="text-2xl font-semibold text-fg-black">「{value.workspace}」已准备就绪</p><p className="text-sm leading-6 text-fg-grey-700">已连接 {value.tools.length} 个工具，第一个智能体「{templates.find(item => item.id === value.template)?.name}」正在创建。</p><Button onClick={() => { setFinished(false); setStep(0); }}>重新体验引导</Button></div> : <>
        <div><p className="text-xs font-medium text-fg-grey-500">第 {step + 1} 步 / 共 {steps.length} 步</p><h2 className="mt-1 text-2xl font-semibold text-fg-black">{steps[step].title}</h2></div>
        {step === 0 && <div className="flex max-w-md flex-col gap-4"><TextField label="工作区名称" shape="pill" value={value.workspace} onChange={workspace => setValue({ ...value, workspace })} {...(!value.workspace.trim() ? { state: "error" as const, errorMessage: "请填写工作区名称" } : {})} /><SelectOption label="所属行业" shape="pill" options={[{ value: "software", label: "软件与互联网" }, { value: "retail", label: "零售电商" }, { value: "education", label: "教育" }, { value: "manufacturing", label: "制造" }]} value={value.industry} onChange={industry => setValue({ ...value, industry })} /></div>}
        {step === 1 && <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">{tools.map(tool => { const on = value.tools.includes(tool.id); return <li key={tool.id} className={cn("flex items-center justify-between gap-3 rounded-card border p-4 transition-colors", on ? "border-fg-blue bg-fg-blue-50/40" : "border-fg-grey-200")}><div><p className="text-sm font-semibold text-fg-black">{tool.name}</p><p className="text-xs text-fg-grey-700">{tool.note}</p></div><Toggle color="blue" checked={on} onChange={checked => setValue({ ...value, tools: checked ? [...value.tools, tool.id] : value.tools.filter(id => id !== tool.id) })} ariaLabel={`连接${tool.name}`} /></li>; })}</ul>}
        {step === 2 && <div className="flex max-w-md flex-col gap-3"><TextField label="成员邮箱" shape="pill" value={value.invites} onChange={invites => setValue({ ...value, invites })} placeholder="多个邮箱用逗号分隔" /><p className="text-xs text-fg-grey-700">他们会收到加入「{value.workspace}」的邀请邮件。</p></div>}
        {step === 3 && <ul className="flex flex-col gap-3">{templates.map(template => <li key={template.id}><label className={cn("flex cursor-pointer items-center gap-3 rounded-card border p-4 transition-colors", value.template === template.id ? "border-fg-blue bg-fg-blue-50/40" : "border-fg-grey-200")}><Checkbox color="blue" checked={value.template === template.id} onChange={() => setValue({ ...value, template: template.id })} /><span><span className="block text-sm font-semibold text-fg-black">{template.name}</span><span className="block text-xs text-fg-grey-700">{template.note}</span></span></label></li>)}</ul>}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-fg-grey-200 pt-5">{step === 1 || step === 2 ? <Button variant="unstyled" type="button" className="text-sm text-fg-grey-700" onClick={next}>跳过</Button> : <span />}<div className="flex gap-3">{step > 0 && <Button variant="tertiary" onClick={() => setStep(step - 1)}>上一步</Button>}<Button disabled={!canNext} onClick={next}>{step === steps.length - 1 ? "完成" : "继续"}</Button></div></div>
      </>}
    </div>
  </div>;
}
