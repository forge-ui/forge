"use client";
import { useParams } from "next/navigation";
import { useWorkspace, WORKSPACE_BASE } from "../../_workspace-context";
import { EmptyModule, ModulePage } from "../../_workspace-ui";
import { Button } from "@forge-ui-official/core";
export default function ProjectPage() {
 const params=useParams<{project:string}>(); let project=params.project; try {project=decodeURIComponent(project);}catch{} const {board,ready,taskView,navigate}=useWorkspace();
 if(ready&&!board.projects.includes(project))return <ModulePage title="项目不存在"><EmptyModule title="这个空间中没有该项目" description="项目可能已重命名或删除，也可能属于另一个工作空间。" action={<Button color="blue" onClick={()=>navigate(`${WORKSPACE_BASE}/projects`)}>返回项目</Button>}/></ModulePage>;
 return taskView;
}
