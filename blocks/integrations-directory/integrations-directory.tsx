"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Panel, StatusBadge, ToolbarSearchInput, cn } from "@forge-ui-official/core";

export type IntegrationState = "available" | "connecting" | "connected";

export interface Integration {
  id: string;
  name: string;
  initial: string;
  tone: string;
  category: string;
  description: string;
  state: IntegrationState;
}

export const defaultIntegrations: Integration[] = [
  { id: "feishu", name: "飞书", initial: "飞", tone: "bg-fg-cyan-50 text-fg-cyan-600", category: "沟通协作", description: "在群聊和单聊中调用智能体，同步日程与文档。", state: "connected" },
  { id: "wecom", name: "企业微信", initial: "企", tone: "bg-fg-blue-50 text-fg-blue", category: "沟通协作", description: "接入客户联系与内部群，自动回复与分配。", state: "available" },
  { id: "dingtalk", name: "钉钉", initial: "钉", tone: "bg-fg-blue-50 text-fg-blue", category: "沟通协作", description: "机器人消息、审批流与待办同步。", state: "available" },
  { id: "crm", name: "知行 CRM", initial: "C", tone: "bg-fg-violet-50 text-fg-violet", category: "业务系统", description: "读取客户、商机与回款数据，写入跟进记录。", state: "connected" },
  { id: "erp", name: "用友 ERP", initial: "用", tone: "bg-fg-red-50 text-fg-red", category: "业务系统", description: "查询库存、采购与财务凭证。", state: "available" },
  { id: "mail", name: "企业邮箱", initial: "邮", tone: "bg-fg-yellow-50 text-fg-yellow-600", category: "沟通协作", description: "收发邮件，自动整理附件到知识库。", state: "available" },
  { id: "oss", name: "对象存储", initial: "存", tone: "bg-fg-green-50 text-fg-green-500", category: "数据与存储", description: "把产物与附件存放到你的存储桶。", state: "connected" },
  { id: "db", name: "PostgreSQL", initial: "P", tone: "bg-fg-blue-50 text-fg-blue", category: "数据与存储", description: "只读查询业务库，生成报表与分析。", state: "available" },
  { id: "git", name: "代码仓库", initial: "G", tone: "bg-fg-grey-100 text-fg-black", category: "开发工具", description: "让编程助手读取仓库、提交分支与合并请求。", state: "available" },
];

export interface IntegrationsDirectoryProps {
  integrations?: Integration[];
  onConnect?: (integration: Integration) => Promise<void> | void;
  className?: string;
}

export function IntegrationsDirectory({ integrations = defaultIntegrations, onConnect, className }: IntegrationsDirectoryProps) {
  const [items, setItems] = useState(integrations);
  const [category, setCategory] = useState("全部");
  const [query, setQuery] = useState("");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(timer => window.clearTimeout(timer)), []);
  const categories = ["全部", "已连接", ...Array.from(new Set(items.map(item => item.category)))];
  const count = (name: string) => name === "全部" ? items.length : name === "已连接" ? items.filter(item => item.state === "connected").length : items.filter(item => item.category === name).length;
  const visible = items.filter(item => (category === "全部" || (category === "已连接" ? item.state === "connected" : item.category === category)) && `${item.name} ${item.description}`.includes(query.trim()));
  const setState = (id: string, state: IntegrationState) => setItems(current => current.map(item => item.id === id ? { ...item, state } : item));

  async function toggle(item: Integration) {
    if (item.state === "connected") { setState(item.id, "available"); return; }
    setState(item.id, "connecting");
    if (onConnect) { await onConnect(item); setState(item.id, "connected"); return; }
    timers.current.push(window.setTimeout(() => setState(item.id, "connected"), 1200));
  }

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[200px_minmax(0,1fr)]", className)}>
    <Panel variant="template" title="分类">
      <ul className="flex flex-col gap-1">{categories.map(name => <li key={name}><Button variant="unstyled" type="button" aria-current={name === category ? "true" : undefined} className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors", name === category ? "bg-fg-blue-50 font-semibold text-fg-blue" : "text-fg-grey-700 hover:bg-fg-grey-50")} onClick={() => setCategory(name)}><span>{name}</span><span className="tabular-nums">{count(name)}</span></Button></li>)}</ul>
    </Panel>
    <div className="flex min-w-0 flex-col gap-4">
      <ToolbarSearchInput className="w-full sm:w-80" value={query} onChange={setQuery} placeholder="搜索应用或能力" />
      {visible.length ? <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">{visible.map(item => <li key={item.id} className="flex flex-col gap-3 rounded-card border border-fg-grey-200 bg-white p-5">
        <div className="flex items-center gap-3"><span className={cn("grid size-11 place-items-center rounded-xl text-base font-semibold", item.tone)}>{item.initial}</span><div className="min-w-0 flex-1"><p className="truncate text-base font-semibold text-fg-black">{item.name}</p><p className="text-xs text-fg-grey-700">{item.category}</p></div>{item.state === "connected" && <StatusBadge label="已连接" color="green" variant="soft" />}</div>
        <p className="line-clamp-2 min-h-12 text-sm leading-6 text-fg-grey-700">{item.description}</p>
        <Button size="sm" variant={item.state === "available" ? "primary" : "tertiary"} disabled={item.state === "connecting"} onClick={() => toggle(item)}>{item.state === "connecting" ? "连接中…" : item.state === "connected" ? "断开连接" : "连接"}</Button>
      </li>)}</ul> : <p className="rounded-card border border-dashed border-fg-grey-200 py-16 text-center text-sm text-fg-grey-700">没有找到相关应用</p>}
    </div>
  </div>;
}
