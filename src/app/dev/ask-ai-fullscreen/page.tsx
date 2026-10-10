"use client";
import { useState } from "react";
import { AskAi, Button, AgentTaskRows, ApprovalCard, RecommendationCard, AgentCodeBlock, AgentFlowchart, PromptBar } from "@forge-ui-official/core";

export default function AskAiFullscreenReview() {
  const [fullscreen, setFullscreen] = useState(true);
  const [count, setCount] = useState(18);
  const [session, setSession] = useState("long");
  const [model, setModel] = useState("fast");
  const [toolNotice, setToolNotice] = useState("");
  const [draft, setDraft] = useState("");
  const [nativeComposer, setNativeComposer] = useState(false);
  const [growth, setGrowth] = useState(0);
  const [legacy, setLegacy] = useState(false);
  return <AskAi fullscreen={fullscreen} onFullscreenChange={setFullscreen} onSend={() => "回复"}
    currentSessionId={session} sessions={[{id:"long",title:"长对话"},{id:"short",title:"短对话"}]}
    onSelectSession={setSession} onNewSession={() => {setSession("short"); setCount(1);}}
    brand={fullscreen ? <div className="flex flex-col gap-2"><span>AskAi 本地验收</span><Button onClick={() => setCount(n => n+1)}>追加回复</Button><Button onClick={() => setNativeComposer(v => !v)}>切换默认输入框</Button><Button onClick={() => setGrowth(n => n+20)}>增长当前回复</Button><Button onClick={() => setLegacy(v => !v)}>切换旧 slot 包装</Button></div> : "AskAi 本地验收"}
    messages={<div className={!fullscreen ? "min-h-0 flex-1 overflow-y-auto p-5 flex flex-col gap-6" : legacy ? "h-full overflow-y-auto" : "flex flex-col gap-6"}>
      {Array.from({length:session === "long" ? count : 1},(_,i) => <section key={i} className="flex min-w-0 flex-col gap-4">
        <p className="text-sm leading-6">回复 {i+1}：全屏布局应让主区域承担滚动。正文在宽屏居中显示，任务卡保持合理宽度，代码可以利用正文的宽度。</p>
        <AgentTaskRows tasks={[{id:"task",title:"验证长对话与滚动宿主",status:"completed",meta:"本地验收"}]} />
        <ApprovalCard questions={[{id:"q",prompt:"确认布局方案",options:[{id:"yes",label:"使用主区域滚动"},{id:"no",label:"继续审阅"}]}]} />
        <RecommendationCard title="推荐方案" body="输入框保持在底部，回复卡不应无条件占满宽屏。" />
        {i === 0 && <><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr>{["对象","滚动宿主","宽度","验证结果"].map(v=><th key={v} className="p-3 text-left">{v}</th>)}</tr></thead><tbody><tr>{["全屏正文","主区域","768px","本地审阅"].map(v=><td key={v} className="border-t border-fg-grey-200 p-3">{v}</td>)}</tr></tbody></table></div><AgentFlowchart nodes={[{id:"a",kind:"trigger",title:"新消息"},{id:"b",kind:"action",title:"检查阅读位置"},{id:"c",kind:"condition",title:"跟随或等待"}]} edges={[{from:"a",to:"b"},{from:"b",to:"c"}]} /></>}
        <AgentCodeBlock filename="layout.ts" lines={Array.from({length:12}, () => 'const viewport = "main";')} />
        {i === count-1 && growth > 0 && <p className="whitespace-pre-wrap text-sm leading-6">{"逐段增长的回复正文\n".repeat(growth)}</p>}
      </section>)}
    </div>}
    composer={nativeComposer ? undefined : <div className={!fullscreen ? "shrink-0 px-5 pb-5 pt-3" : legacy ? "pb-7" : ""}>{toolNotice && <div role="status" className="mb-2 flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2 text-xs text-fg-grey-700"><span>{toolNotice}</span><Button size="sm" variant="tertiary" color="grey" onClick={() => setToolNotice("")}>关闭提示</Button></div>}<PromptBar
      onAttach={() => setToolNotice("已点击附件入口（本地演示）")}
      attachLabel="添加附件"
      sourcesLabel="来源" commandsLabel="指令" modelMenuLabel="选择模型"
      connectedLabel="已连接" sendLabel="发送"
      sources={[
        {id:"project",label:"项目资料",description:"项目文档与需求",connected:true},
        {id:"knowledge",label:"知识库",description:"团队知识与规范"},
      ]}
      commands={[
        {id:"plan",label:"plan",description:"生成执行计划"},
        {id:"summarize",label:"summarize",description:"总结当前内容"},
      ]}
      models={[{id:"fast",label:"快速模式"},{id:"think",label:"深度思考"}]}
      model={model} onModelChange={setModel}
      value={draft} onChange={setDraft} onSend={() => {setCount(n=>n+1);setDraft("");}} placeholder="输入测试消息" /></div>}
  />;
}
