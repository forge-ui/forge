"use client";

import { useRef, useState } from "react";
import { AgentFlowchart, Button, Panel, SelectOption, StatusBadge, TextArea, TextField, cn, type AgentFlowEdge, type AgentFlowKind, type AgentFlowNode } from "@forge-ui-official/core";
import { PlayBoldDuotone } from "@forge-ui-official/core/icons";

export const defaultWorkflowNodes: AgentFlowNode[] = [
  { id: "n1", kind: "trigger", title: "收到飞书工单", body: "售后客服群里 @ 机器人的消息" },
  { id: "n2", kind: "action", title: "检索售后知识库", body: "按问题类型匹配规范条款" },
  { id: "n3", kind: "condition", title: "是否涉及退款", body: "金额大于 ¥500 需人工审批" },
  { id: "n4", kind: "action", title: "起草回复", body: "售后问答助手生成回复并注明出处" },
  { id: "n5", kind: "action", title: "回复并记录工单", body: "发送到飞书群并写入 CRM" },
];

export const defaultWorkflowEdges: AgentFlowEdge[] = [
  { from: "n1", to: "n2" },
  { from: "n2", to: "n3" },
  { from: "n3", to: "n4", label: "否 / 已审批" },
  { from: "n4", to: "n5" },
];

const palette: { kind: AgentFlowKind; title: string; body: string }[] = [
  { kind: "trigger", title: "定时触发", body: "按 Cron 表达式运行" },
  { kind: "action", title: "调用智能体", body: "选择一个应用智能体" },
  { kind: "action", title: "发送消息", body: "飞书、企业微信或邮件" },
  { kind: "condition", title: "条件分支", body: "按字段判断走向" },
];

export interface WorkflowBuilderProps {
  nodes?: AgentFlowNode[];
  edges?: AgentFlowEdge[];
  onPublish?: (nodes: AgentFlowNode[]) => void;
  className?: string;
}

export function WorkflowBuilder({ nodes = defaultWorkflowNodes, edges = defaultWorkflowEdges, onPublish, className }: WorkflowBuilderProps) {
  const [items, setItems] = useState(nodes);
  const [links, setLinks] = useState(edges);
  const [selected, setSelected] = useState<string | undefined>(nodes[0]?.id);
  const [published, setPublished] = useState(false);
  const sequence = useRef(nodes.length);
  const node = items.find(item => item.id === selected);

  function add(entry: typeof palette[number]) {
    sequence.current += 1;
    const id = `n-${sequence.current}`;
    const last = items.at(-1);
    setItems(current => [...current, { id, ...entry }]);
    if (last) setLinks(current => [...current, { from: last.id, to: id }]);
    setSelected(id);
    setPublished(false);
  }

  function update(patch: Partial<AgentFlowNode>) {
    setItems(current => current.map(item => item.id === selected ? { ...item, ...patch } : item));
    setPublished(false);
  }

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[220px_minmax(0,1fr)_300px]", className)}>
    <Panel variant="template" title="节点" subtitle="点击添加到流程末尾">
      <ul className="flex flex-col gap-2">{palette.map(entry => <li key={entry.title}><Button variant="unstyled" type="button" className="flex w-full flex-col items-start gap-1 rounded-xl border border-dashed border-fg-grey-300 px-3 py-2.5 text-left transition-colors hover:border-fg-blue hover:bg-fg-blue-50/50" onClick={() => add(entry)}><span className="text-sm font-semibold text-fg-black">{entry.title}</span><span className="text-xs text-fg-grey-700">{entry.body}</span></Button></li>)}</ul>
    </Panel>
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="text-sm font-semibold text-fg-black">售后工单自动回复</span><StatusBadge label={published ? "已发布" : "草稿"} color={published ? "green" : "grey"} variant="soft" /></div><div className="flex gap-2"><Button size="sm" variant="tertiary" iconLeft={<PlayBoldDuotone size={16} />}>试运行</Button><Button size="sm" disabled={published} onClick={() => { setPublished(true); onPublish?.(items); }}>发布</Button></div></div>
      <AgentFlowchart title="流程" nodes={items} edges={links} selectedId={selected} onSelect={setSelected} />
    </div>
    <Panel variant="template" title="节点配置" subtitle={node ? { trigger: "触发器", action: "操作", condition: "条件" }[node.kind] : undefined}>
      {node ? <div className="flex flex-col gap-4">
        <TextField label="名称" shape="pill" value={node.title} onChange={value => update({ title: value })} />
        <TextArea label="说明" rows={3} value={node.body ?? ""} onChange={value => update({ body: value })} />
        {node.kind === "action" && <SelectOption label="执行者" shape="pill" options={[{ value: "kb", label: "售后问答助手" }, { value: "crm", label: "CRM 连接器" }, { value: "feishu", label: "飞书机器人" }]} value="kb" />}
        {node.kind === "condition" && <TextField label="条件表达式" shape="pill" value="refund.amount > 500" />}
        <Button variant="unstyled" type="button" className="self-start text-sm text-fg-red" disabled={items.length < 2} onClick={() => { setItems(current => current.filter(item => item.id !== node.id)); setLinks(current => current.filter(link => link.from !== node.id && link.to !== node.id)); setSelected(items.find(item => item.id !== node.id)?.id); }}>删除节点</Button>
      </div> : <p className="text-sm text-fg-grey-700">在画布上选择一个节点</p>}
    </Panel>
  </div>;
}
