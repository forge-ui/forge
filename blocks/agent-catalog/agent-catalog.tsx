"use client";

import { useState } from "react";
import { Button, ButtonGroup, IconButton, Pagination, Panel, PlusIcon, StatusBadge, ToolbarSearchInput, cn } from "@forge-ui-official/core";
import { ChatRoundLinear, PenLinear, StarsLinear, TrashBinMinimalisticLinear } from "@forge-ui-official/core/icons";

export interface AppAgent {
  id: string;
  name: string;
  initial: string;
  tone: string;
  folder: string;
  mode: "simple" | "advanced";
  published: boolean;
  description: string;
  owner: string;
  updatedAt: string;
}

export const defaultAppAgents: AppAgent[] = [
  { id: "a1", name: "售后问答助手", initial: "售", tone: "bg-fg-blue-50 text-fg-blue", folder: "客服", mode: "simple", published: true, description: "基于售后知识库回答退换货、物流与发票问题，并注明引用来源。", owner: "张宁", updatedAt: "11-08" },
  { id: "a2", name: "销售商机助手", initial: "销", tone: "bg-fg-red-50 text-fg-red", folder: "销售", mode: "advanced", published: true, description: "整理客户背景、识别商机阶段，生成下一步跟进话术与行动清单。", owner: "林悦", updatedAt: "11-07" },
  { id: "a3", name: "周报与会议纪要", initial: "周", tone: "bg-fg-violet-50 text-fg-violet", folder: "办公", mode: "simple", published: true, description: "汇总本周工作项与会议记录，输出结构化周报。", owner: "周予安", updatedAt: "11-06" },
  { id: "a4", name: "运维故障分析", initial: "运", tone: "bg-fg-green-50 text-fg-green-500", folder: "工程", mode: "advanced", published: false, description: "读取告警与日志，给出根因假设与处置建议，危险操作需人工确认。", owner: "陈思远", updatedAt: "11-05" },
  { id: "a5", name: "合同条款审阅", initial: "合", tone: "bg-fg-yellow-50 text-fg-yellow-600", folder: "法务", mode: "advanced", published: true, description: "比对合同模板，标注风险条款与修改建议。", owner: "许知夏", updatedAt: "11-04" },
  { id: "a6", name: "招聘初筛", initial: "招", tone: "bg-fg-cyan-50 text-fg-cyan-600", folder: "办公", mode: "simple", published: false, description: "按岗位要求解析简历，输出匹配度与面试问题。", owner: "唐可欣", updatedAt: "11-02" },
  { id: "a7", name: "竞品动态追踪", initial: "竞", tone: "bg-fg-blue-50 text-fg-blue", folder: "销售", mode: "simple", published: true, description: "每周汇总竞品官网、公众号与发布会更新。", owner: "林悦", updatedAt: "10-30" },
  { id: "a8", name: "代码评审助手", initial: "码", tone: "bg-fg-violet-50 text-fg-violet", folder: "工程", mode: "advanced", published: true, description: "检查 Pull Request 的风格、测试与风险点，给出评审意见。", owner: "陈思远", updatedAt: "10-28" },
  { id: "a9", name: "发票识别录入", initial: "票", tone: "bg-fg-green-50 text-fg-green-500", folder: "财务", mode: "simple", published: true, description: "识别发票图片中的抬头、税号与金额，自动生成报销单。", owner: "张宁", updatedAt: "10-26" },
];

const filters = [{ label: "全部" }, { label: "已发布" }, { label: "未发布" }, { label: "简单" }, { label: "高级" }];

export interface AgentCatalogProps {
  agents?: AppAgent[];
  pageSize?: number;
  onCreate?: () => void;
  onCreateFromTemplate?: () => void;
  onOpen?: (agent: AppAgent) => void;
  className?: string;
}

export function AgentCatalog({ agents = defaultAppAgents, pageSize = 6, onCreate, onCreateFromTemplate, onOpen, className }: AgentCatalogProps) {
  const [items, setItems] = useState(agents);
  const [folder, setFolder] = useState("全部");
  const [filter, setFilter] = useState(0);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const folders = ["全部", ...Array.from(new Set(items.map(agent => agent.folder)))];
  const visible = items.filter(agent => (folder === "全部" || agent.folder === folder)
    && [true, agent.published, !agent.published, agent.mode === "simple", agent.mode === "advanced"][filter]
    && `${agent.name} ${agent.description} ${agent.owner}`.includes(query.trim()));
  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const current = Math.min(page, totalPages);
  const paged = visible.slice((current - 1) * pageSize, current * pageSize);
  const reset = () => setPage(1);

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[200px_minmax(0,1fr)]", className)}>
    <Panel variant="template" title="目录">
      <ul className="flex flex-col gap-1">{folders.map(name => <li key={name}><Button variant="unstyled" type="button" aria-current={name === folder ? "true" : undefined} className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors", name === folder ? "bg-fg-blue-50 font-semibold text-fg-blue" : "text-fg-grey-700 hover:bg-fg-grey-50")} onClick={() => { setFolder(name); reset(); }}><span>{name}</span><span className="tabular-nums">{name === "全部" ? items.length : items.filter(agent => agent.folder === name).length}</span></Button></li>)}</ul>
    </Panel>
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex min-w-0 flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="fg-scrollbar-hidden -mx-1 min-w-0 overflow-x-auto px-1 pb-1"><ButtonGroup ariaLabel="智能体筛选" shape="pill" items={filters} activeIndex={filter} onChange={index => { setFilter(index); reset(); }} /></div>
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <ToolbarSearchInput className="w-full sm:w-60" value={query} onChange={value => { setQuery(value); reset(); }} placeholder="搜索名称、描述或创建人" />
          <Button variant="tertiary" iconLeft={<StarsLinear size={16} />} onClick={onCreateFromTemplate}>从模板创建</Button>
          <Button iconLeft={<PlusIcon size={16} />} onClick={onCreate}>新建智能体</Button>
        </div>
      </div>
      {paged.length ? <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">{paged.map(agent => <li key={agent.id} className="flex flex-col gap-3 rounded-card border border-fg-grey-200 bg-white p-5 transition-shadow hover:shadow-elevated">
        <div className="flex items-start gap-3">
          <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl text-base font-semibold", agent.tone)}>{agent.initial}</span>
          <div className="min-w-0 flex-1"><Button variant="unstyled" type="button" className="block max-w-full truncate text-left text-base font-semibold text-fg-black" onClick={() => onOpen?.(agent)}>{agent.name}</Button><p className="mt-1 text-xs text-fg-grey-700">{agent.owner} · {agent.folder}</p></div>
          <StatusBadge label={agent.mode === "simple" ? "简单" : "高级"} color={agent.mode === "simple" ? "blue" : "yellow"} variant="soft" />
        </div>
        <p className="line-clamp-2 min-h-12 text-sm leading-6 text-fg-grey-700">{agent.description}</p>
        <div className="flex items-center justify-between gap-2 border-t border-fg-grey-200 pt-3">
          <div className="flex items-center gap-2"><StatusBadge label={agent.published ? "已发布" : "未发布"} color={agent.published ? "green" : "grey"} variant="soft" /><span className="text-xs text-fg-grey-500">更新 {agent.updatedAt}</span></div>
          <div className="flex gap-1">
            <IconButton variant="ghost" color="grey" size="sm" aria-label={`和${agent.name}对话`} onClick={() => onOpen?.(agent)}><ChatRoundLinear size={16} /></IconButton>
            <IconButton variant="ghost" color="grey" size="sm" aria-label={`编辑${agent.name}`}><PenLinear size={16} /></IconButton>
            <IconButton variant="ghost" color="grey" size="sm" aria-label={`删除${agent.name}`} onClick={() => setItems(current => current.filter(item => item.id !== agent.id))}><TrashBinMinimalisticLinear size={16} /></IconButton>
          </div>
        </div>
      </li>)}</ul> : <p className="rounded-card border border-dashed border-fg-grey-200 py-16 text-center text-sm text-fg-grey-700">没有符合条件的智能体</p>}
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-fg-grey-700">共 {visible.length} 个智能体</p><Pagination totalPages={totalPages} currentPage={current} onPageChange={setPage} /></div>
    </div>
  </div>;
}
