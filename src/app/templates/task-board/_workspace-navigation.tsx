"use client";

import { IconButton, MenuItem } from "@forge-ui-official/core";
import { ClipboardListBoldDuotone, FolderBoldDuotone, PlusLinear } from "@forge-ui-official/core/icons";
import type { Board } from "./_data";
import { WORKSPACE_BASE, projectHref } from "./_workspace-context";
const decodedPath=(value:string)=>{try{return decodeURIComponent(value);}catch{return value;}};

export function WorkspaceNavigation({board,pathname,navigate,onCreateProject}:{board:Board;pathname:string;navigate:(href:string)=>void;onCreateProject:()=>void}) {
  return <div className="workspace-navigation">
    <div className="workspace-module-nav">
      <MenuItem accent="blue" label="我的任务" active={pathname===`${WORKSPACE_BASE}/tasks`} lead={{kind:"icon",icon:<ClipboardListBoldDuotone size={20}/>}} onClick={()=>navigate(`${WORKSPACE_BASE}/tasks`)}/>
    </div>
    <div className="workspace-project-nav"><div className="workspace-nav-caption"><span>项目</span><IconButton color="blue" variant="ghost" shape="square" size="sm" aria-label="新增项目" title="新增项目" onClick={onCreateProject}><PlusLinear size={18}/></IconButton></div>{board.projects.filter(name=>!board.archived?.includes(name)).map(name=><MenuItem key={name} accent="blue" label={name} ariaLabel={`项目：${name}`} active={decodedPath(pathname)===decodedPath(projectHref(name))} lead={{kind:"icon",icon:<FolderBoldDuotone size={20}/>}} onClick={()=>navigate(projectHref(name))}/>)}</div>
  </div>;
}
