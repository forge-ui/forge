"use client";
import { useState } from "react";
import { Button, Checkbox, Grid, SurfaceCard, TextField } from "@forge-ui-official/core";
import { FolderBoldDuotone } from "@forge-ui-official/core/icons";
import { useWorkspace } from "../_workspace-context";
import { CreateButton, EmptyModule, ModulePage } from "../_workspace-ui";
import { taskIsArchived } from "../_data";
export default function ProjectsPage(){
 const {board,openProject,createProject}=useWorkspace();const [query,setQuery]=useState("");const [archived,setArchived]=useState(false);
 const projects=board.projects.filter(name=>Boolean(board.archived?.includes(name))===archived&&name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
 return <ModulePage title="项目" description="按目标组织工作，任务、上下文与交付都留在项目中。" action={<CreateButton onClick={createProject}>新建项目</CreateButton>}><div className="workspace-collection-toolbar"><TextField color="blue" aria-label="搜索项目" placeholder="搜索项目" value={query} onChange={setQuery}/><label className="flex items-center gap-2 text-sm text-fg-grey-700"><Checkbox color="blue" aria-label="已归档项目" checked={archived} onChange={setArchived}/>已归档项目</label></div><Grid columns={{base:1,md:2,xl:3}} gap={16}>{projects.map(name=>{const tasks=board.tasks.filter(task=>task.project===name&&(!taskIsArchived(board,task)||archived));const done=tasks.filter(task=>task.done).length;return <SurfaceCard key={name} padding="md" className="workspace-project-card"><div className="flex items-center gap-3"><FolderBoldDuotone size={24}/><button type="button" className="workspace-row-title" onClick={()=>openProject(name)}>{name}</button></div><p>{board.projectDetails?.[name]?.description||"任务与交付的共同工作区"}</p><div className="workspace-project-card-footer"><span>{tasks.length-done} 项待办 · {done} 项完成</span><Button color="blue" variant="tertiary" size="sm" onClick={()=>openProject(name)}>打开项目 →</Button></div></SurfaceCard>})}</Grid>{!projects.length&&<EmptyModule title={query?"没有匹配的项目":archived?"还没有已归档项目":"还没有项目"} description="项目会保存在当前工作空间。" action={!archived?<CreateButton onClick={createProject}>新建项目</CreateButton>:undefined}/>}</ModulePage>;
}
