import type { Board, WorkspaceAgent } from "./_data";
export const defaultAgents: WorkspaceAgent[] = [
  {id:"research",name:"研究助手",description:"梳理资料、对照来源，整理可供审核的研究结果。",instructions:"先明确任务目标和资料范围。提供来源与结论，遇到信息不足时向用户提问。"},
  {id:"design",name:"设计助手",description:"拆解设计问题，提交方案与待确认的设计取舍。",instructions:"先理解用户场景与现有规范。说明方案依据，交付前列出需要用户确认的事项。"},
  {id:"development",name:"开发助手",description:"协助实现、验证并说明变更及其影响。",instructions:"在授权范围内实施任务，记录验证结果和已知限制，完成后提交用户审核。"},
];
export function workspaceAgents(board:Board):WorkspaceAgent[]{
 const agents=[...(board.agents??defaultAgents)];
 for(const task of board.tasks)if(task.collaboration&&!agents.some(a=>a.name===task.collaboration!.agent))agents.push({id:`legacy-${task.id}`,name:task.collaboration.agent,description:"来自现有任务的助手",instructions:""});
 return agents;
}
