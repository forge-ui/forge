"use client";
import type { ReactNode } from "react";
import { Breadcrumbs, Button, PageTitleToolbar } from "@forge-ui-official/core";
import { PlusLinear } from "@forge-ui-official/core/icons";
import { useWorkspace, WORKSPACE_BASE } from "./_workspace-context";
import { collaborationStates } from "./_collaboration";
import type { Task } from "./_data";
export function ModulePage({title,description,action,children}:{title:string;description?:string;action?:ReactNode;children:ReactNode}) {
  const {ready,workspaceName}=useWorkspace();
  return <div className="workspace-module"><PageTitleToolbar title={title} subtitle={description?`${workspaceName} · ${description}`:workspaceName} breadcrumbs={<Breadcrumbs color="blue" items={[{label:"我的任务",href:`${WORKSPACE_BASE}/tasks`},{label:title}]}/>} actions={action}/><div className="workspace-module-scroll">{ready?children:<p role="status" className="workspace-empty-inline">正在加载当前工作空间…</p>}</div></div>;
}
export function CreateButton({children,onClick}:{children:ReactNode;onClick:()=>void}) {return <Button color="blue" size="sm" iconLeft={<PlusLinear size={17}/>} onClick={onClick}>{children}</Button>;}
export function EmptyModule({title,description,action}:{title:string;description:string;action?:ReactNode}) {return <div className="workspace-empty"><h2>{title}</h2><p>{description}</p>{action}</div>;}
export function WorkspaceTaskRows({tasks,empty="当前没有任务"}:{tasks:Task[];empty?:string}) {
  const {openTask}=useWorkspace();
  return <div className="workspace-object-list">{tasks.map(task=><div className="workspace-task-row" key={task.id}><div className="min-w-0 flex-1"><button type="button" onClick={()=>openTask(task)} className="workspace-row-title">{task.title}</button><p>{task.project}{task.collaboration?` · ${task.collaboration.agent}`:""}</p></div><span className="workspace-row-state">{task.collaboration?collaborationStates[task.collaboration.state]:task.done?"已完成":"待完成"}</span><Button color="blue" size="sm" variant="secondary" onClick={()=>openTask(task)}>{task.collaboration?.state==="review"?"审核":task.collaboration?.state==="waiting"?"回复":"查看"} →</Button></div>)}{!tasks.length&&<p className="workspace-empty-inline">{empty}</p>}</div>;
}
