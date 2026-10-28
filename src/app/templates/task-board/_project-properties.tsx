"use client";
import { ProgressBar, SelectOption, TextArea } from "@forge-ui-official/core";
export type ProjectDetails = { status: string; owner: string; priority: string; description: string };
export function ProjectProperties({ value, total, done, onChange }: {value:ProjectDetails; total:number; done:number; onChange:(patch:Partial<ProjectDetails>)=>void}) {
  return <div className="project-properties-content">
    <SelectOption color="blue" label="状态" value={value.status} options={["计划中","进行中","已完成","已暂停"].map(label=>({value:label,label}))} onChange={status=>onChange({status})}/>
    <SelectOption color="blue" label="优先级" value={value.priority} options={["高","中","低"].map(label=>({value:label,label}))} onChange={priority=>onChange({priority})}/>
    <SelectOption color="blue" label="负责人" value={value.owner} options={["林晓","陈一","周可"].map(label=>({value:label,label}))} onChange={owner=>onChange({owner})}/>
    <div className="space-y-3"><p className="text-xs text-fg-grey-700">任务进度</p><ProgressBar color="blue" value={total ? Math.round(done/total*100):0}/><p className="text-xs text-fg-grey-700">{done} / {total} 项已完成</p></div>
    <div className="border-t border-fg-grey-200 pt-5"><TextArea autoGrow={false} color="blue" label="项目说明" rows={5} value={value.description} onChange={description=>onChange({description})}/><p className="mt-3 text-xs text-fg-grey-700">更改自动保存在当前浏览器</p></div>
  </div>;
}
