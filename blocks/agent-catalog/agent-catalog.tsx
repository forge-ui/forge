"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Breadcrumbs, Button, ButtonGroup, ConfirmationDialog, IconButton, Modal, PageTitleToolbar, PlusIcon, SelectOption, StatusBadge, TextField } from "@forge-ui-official/core";
import { ChatRoundLinear, PenLinear, TrashBinMinimalisticLinear } from "@forge-ui-official/core/icons";

export interface AppAgent {
  id: string;
  name: string;
  description: string;
  type: "simple" | "workflow";
  published: boolean;
  owner: string;
  avatar: string;
  folderId: string;
  updatedAt: string;
}

export interface AgentFolder {
  id: string;
  name: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  illustration: string;
  surface: string;
}

export const defaultAgentFolders: AgentFolder[] = [
  { id: "default", name: "根目录" },
  { id: "service", name: "客服中心" },
  { id: "sales", name: "销售与市场" },
  { id: "legal", name: "法务合规" },
];

export const defaultAppAgents: AppAgent[] = [
  { id: "after-sales", name: "售后问答助手", description: "基于售后知识库回答退换货、物流与发票问题，并注明引用来源。", type: "simple", published: true, owner: "张宁", avatar: "/images/blocks/agents/observatory-robot.webp", folderId: "default", updatedAt: "2026-11-08" },
  { id: "sales", name: "销售商机助手", description: "整理客户背景、识别商机阶段，生成下一步跟进话术与行动清单。", type: "workflow", published: true, owner: "林悦", avatar: "/images/blocks/agents/fox-4.webp", folderId: "default", updatedAt: "2026-11-07" },
  { id: "weekly", name: "周报与会议纪要", description: "汇总本周工作项与会议记录，输出结构化周报。", type: "simple", published: true, owner: "周予安", avatar: "/images/blocks/agents/deer-warm-tiny-smile-right.webp", folderId: "default", updatedAt: "2026-11-06" },
  { id: "ops", name: "运维故障分析", description: "读取告警与日志，给出根因假设与处置建议，危险操作需人工确认。", type: "workflow", published: false, owner: "陈思远", avatar: "/images/blocks/agents/lighthouse-lantern-room.webp", folderId: "default", updatedAt: "2026-11-05" },
  { id: "contract", name: "合同条款审阅", description: "比对合同模板，标注风险条款与修改建议。", type: "workflow", published: true, owner: "许知夏", avatar: "/images/blocks/agents/ink-stamp.webp", folderId: "default", updatedAt: "2026-11-04" },
  { id: "recruit", name: "招聘初筛", description: "按岗位要求解析简历，输出匹配度与面试问题。", type: "simple", published: false, owner: "唐可欣", avatar: "/images/blocks/agents/baby-owl.webp", folderId: "default", updatedAt: "2026-11-02" },
  { id: "invoice", name: "发票信息提取", description: "从发票图片与 PDF 中提取抬头、税号、金额与开票日期，按固定格式返回。", type: "workflow", published: true, owner: "苏婉清", avatar: "/images/blocks/agents/albatross.webp", folderId: "default", updatedAt: "2026-10-30" },
  { id: "translate", name: "多语言客服翻译", description: "把海外客户的咨询翻译成中文并给出回复草稿，保留产品术语。", type: "simple", published: true, owner: "林悦", avatar: "/images/blocks/agents/baby-goat.webp", folderId: "default", updatedAt: "2026-10-28" },
  { id: "policy", name: "制度问答", description: "回答员工关于考勤、报销与差旅制度的问题，引用制度原文。", type: "simple", published: true, owner: "张宁", avatar: "/images/blocks/agents/baby-sloth.webp", folderId: "default", updatedAt: "2026-10-26" },
  { id: "bidding", name: "标书要点梳理", description: "读取招标文件，列出资质要求、评分项与截止时间。", type: "workflow", published: false, owner: "陈思远", avatar: "/images/blocks/agents/ghost-8.webp", folderId: "default", updatedAt: "2026-10-21" },
  { id: "refund", name: "退款工单分流", description: "判断退款工单类型，交给对应处理节点并生成回复。", type: "workflow", published: true, owner: "周予安", avatar: "/images/blocks/agents/friendly-ghost.webp", folderId: "service", updatedAt: "2026-11-03" },
  { id: "logistics", name: "物流异常查询", description: "根据运单号查询物流节点，识别延误并给出安抚话术。", type: "simple", published: true, owner: "苏婉清", avatar: "/images/blocks/agents/black-bear.webp", folderId: "service", updatedAt: "2026-10-29" },
  { id: "lead-score", name: "线索评分", description: "根据官网表单与通话记录给线索打分，标出优先跟进的客户。", type: "workflow", published: true, owner: "林悦", avatar: "/images/blocks/agents/soft-charcoal-bear.webp", folderId: "sales", updatedAt: "2026-11-01" },
  { id: "nda", name: "保密协议核对", description: "检查保密协议的期限、范围与违约条款是否符合公司标准。", type: "simple", published: false, owner: "许知夏", avatar: "/images/blocks/agents/deer-bright-compact-face-left.webp", folderId: "legal", updatedAt: "2026-10-27" },
];

export const defaultAgentTemplates: AgentTemplate[] = [
  { id: "kb-qa", name: "知识库问答助手", description: "检索知识库，命中时引用原文，否则生成明确的无结果回复。", illustration: "/images/blocks/templates/chat.svg", surface: "bg-fg-blue-50" },
  { id: "router", name: "问题分类与分流", description: "先判断问题类型，再交给对应回答节点，输出稳定且可追踪。", illustration: "/images/blocks/templates/workflow.svg", surface: "bg-fg-grey-50" },
  { id: "extract", name: "结构化信息提取", description: "从自然语言中提取关键字段，并以固定格式返回。", illustration: "/images/blocks/templates/data.svg", surface: "bg-fg-cyan-50" },
  { id: "writing", name: "长文写作与审校", description: "先生成草稿，再统一检查事实、结构和表达后输出。", illustration: "/images/blocks/templates/writing.svg", surface: "bg-fg-violet-50" },
  { id: "research", name: "行业调研报告", description: "按主题检索资料，整理要点并输出带来源的调研报告。", illustration: "/images/blocks/templates/research.svg", surface: "bg-fg-green-50" },
  { id: "invoice", name: "发票识别", description: "识别发票关键字段，校验税号与金额后写入台账。", illustration: "/images/blocks/templates/invoice.svg", surface: "bg-fg-yellow-50" },
  { id: "quote", name: "报价单生成", description: "根据客户需求与价目表生成报价单草稿。", illustration: "/images/blocks/templates/quote.svg", surface: "bg-fg-blue-50" },
  { id: "contract", name: "合同审阅", description: "比对标准条款，标注风险点并给出修改建议。", illustration: "/images/blocks/templates/contract.svg", surface: "bg-fg-red-50" },
  { id: "policy", name: "制度问答", description: "回答员工制度问题，引用制度原文并注明条款。", illustration: "/images/blocks/templates/policy.svg", surface: "bg-fg-violet-50" },
  { id: "crm", name: "客户跟进", description: "汇总客户往来记录，提醒下一步跟进动作。", illustration: "/images/blocks/templates/crm.svg", surface: "bg-fg-blue-50" },
  { id: "translate", name: "多语言翻译", description: "翻译并保留专业术语，输出双语对照。", illustration: "/images/blocks/templates/translate.svg", surface: "bg-fg-green-50" },
  { id: "education", name: "培训出题", description: "根据培训材料生成练习题与参考答案。", illustration: "/images/blocks/templates/education.svg", surface: "bg-fg-yellow-50" },
];

const filterTabs = [{ label: "全部" }, { label: "已发布" }, { label: "未发布" }, { label: "简单" }, { label: "高级" }];
const filterValues = ["all", "published", "draft", "simple", "workflow"] as const;
const pageSize = 9;

/** 智能体工场的品牌色是蓝色：把 core 默认的紫色色阶整体映射到蓝色 */
const brandBlue = Object.fromEntries(["", "-50", "-100", "-200", "-300", "-400", "-500", "-600", "-700", "-800", "-900"].flatMap(step => [[`--fg-violet${step}`, `var(--fg-blue${step})`], [`--color-fg-violet${step}`, `var(--fg-blue${step})`]])) as CSSProperties;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("zh-CN");
}

function SettingsLinearIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} aria-hidden><circle cx="12" cy="12" r="3" stroke="currentColor" strokeLinecap="round" /><path d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z" stroke="currentColor" strokeLinecap="round" /></svg>;
}


function FolderSidebar({ folders, selectedId, onSelect, onCreate }: { folders: AgentFolder[]; selectedId: string; onSelect: (id: string) => void; onCreate: (name: string) => void }) {
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const visible = folders.filter(folder => folder.name.includes(query.trim()));
  return <aside className="flex max-h-[40vh] w-full shrink-0 flex-col overflow-hidden lg:max-h-none lg:w-[240px]">
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-fg-grey-200 bg-background">
      <div className="shrink-0 border-b border-fg-grey-100 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-fg-black">目录</h3>
          <button type="button" className="text-xs text-fg-blue-700 hover:underline" onClick={() => setCreating(value => !value)}>{creating ? "取消" : "新建"}</button>
        </div>
        <input className="mt-2 h-8 w-full rounded-lg border border-fg-grey-200 px-2 text-xs outline-none focus:border-fg-blue-400" placeholder="搜索目录" value={query} onChange={event => setQuery(event.target.value)} />
        {creating ? <div className="mt-2 flex flex-col gap-2">
          <TextField value={name} onChange={setName} placeholder="文件夹名称" />
          <Button color="blue" size="sm" disabled={!name.trim()} onClick={() => { onCreate(name.trim()); setName(""); setCreating(false); }}>创建到当前目录下</Button>
        </div> : null}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
        <ul className="flex flex-col gap-0.5">
          {visible.map(folder => <li key={folder.id}>
            <button type="button" onClick={() => onSelect(folder.id)} className={`w-full truncate rounded-xl px-2.5 py-2 text-left text-sm transition ${selectedId === folder.id ? "bg-fg-grey-100 font-semibold text-fg-black" : "text-fg-grey-800 hover:bg-fg-grey-50"}`}>{folder.name}</button>
          </li>)}
        </ul>
      </div>
    </div>
  </aside>;
}

function AgentCard({ agent, onDelete }: { agent: AppAgent; onDelete: () => void }) {
  return <article className="flex h-full min-h-[168px] cursor-pointer flex-col rounded-2xl border border-fg-grey-200 bg-background p-4 transition-colors hover:border-fg-grey-300">
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={agent.avatar} alt="" className="size-10 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-base font-semibold text-fg-black" title={agent.name}>{agent.name}</h3>
            <span className="shrink-0 whitespace-nowrap"><StatusBadge label={agent.type === "workflow" ? "高级" : "简单"} color={agent.type === "workflow" ? "yellow" : "blue"} /></span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-fg-grey-600">
            <span>{agent.owner}</span>
            <StatusBadge label={agent.published ? "已发布" : "未发布"} color={agent.published ? "green" : "grey"} />
          </div>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-fg-grey-700">{agent.description}</p>
    </div>
    <div className="mt-4 flex items-center justify-between gap-2 border-t border-fg-grey-100 pt-3">
      <div className="min-w-0 flex-1 text-xs text-fg-grey-600">更新 {formatDate(agent.updatedAt)}</div>
      <div className="flex shrink-0 items-center gap-1">
        <IconButton variant="ghost" shape="square" size="sm" aria-label="调试对话"><ChatRoundLinear size={16} /></IconButton>
        <IconButton variant="ghost" shape="square" size="sm" aria-label="设置"><SettingsLinearIcon size={16} /></IconButton>
        <IconButton variant="ghost" shape="square" size="sm" aria-label="编辑"><PenLinear size={16} /></IconButton>
        <IconButton variant="ghost" shape="square" size="sm" aria-label="删除" onClick={onDelete}><TrashBinMinimalisticLinear size={16} /></IconButton>
      </div>
    </div>
  </article>;
}

function TemplateCard({ template, onUse }: { template: AgentTemplate; onUse: () => void }) {
  return <article className="group flex h-full min-h-[160px] flex-col overflow-hidden rounded-2xl border border-fg-grey-200 bg-background transition-[border-color,box-shadow] hover:border-fg-blue-200 hover:shadow-[0_8px_24px_rgba(16,24,40,0.06)]">
    <button type="button" aria-label={`使用模板 ${template.name}`} className="flex min-h-0 flex-1 cursor-pointer flex-col text-left" onClick={onUse}>
      <div className={`flex items-center justify-center px-4 pb-2 pt-4 ${template.surface}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={template.illustration} alt="" className="size-14 rounded-2xl object-cover shadow-sm ring-1 ring-black/5" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-3.5 pb-3 pt-2.5">
        <h3 className="truncate text-sm font-semibold text-fg-black" title={template.name}>{template.name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-5 text-fg-grey-500">{template.description}</p>
        <div className="mt-2.5 flex items-center justify-center border-t border-fg-grey-100 pt-2">
          <span className="text-xs font-medium text-fg-blue-600 group-hover:text-fg-blue-700">立即使用</span>
        </div>
      </div>
    </button>
  </article>;
}

export interface AgentCatalogProps {
  agents?: AppAgent[];
  folders?: AgentFolder[];
  templates?: AgentTemplate[];
  className?: string;
}

export function AgentCatalog({ agents: initialAgents = defaultAppAgents, folders: initialFolders = defaultAgentFolders, templates = defaultAgentTemplates, className = "" }: AgentCatalogProps) {
  const [agents, setAgents] = useState(initialAgents);
  const [folders, setFolders] = useState(initialFolders);
  const [folderId, setFolderId] = useState(initialFolders[0]?.id ?? "default");
  const [filterIndex, setFilterIndex] = useState(0);
  const [sortKey, setSortKey] = useState<"update" | "name">("update");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [deleting, setDeleting] = useState<AppAgent | null>(null);

  const filtered = useMemo(() => {
    const key = filterValues[filterIndex];
    const text = query.trim().toLowerCase();
    return agents
      .filter(agent => agent.folderId === folderId)
      .filter(agent => key === "all" || (key === "published" ? agent.published : key === "draft" ? !agent.published : agent.type === key))
      .filter(agent => !text || `${agent.name} ${agent.description} ${agent.owner}`.toLowerCase().includes(text))
      .sort((left, right) => sortKey === "name" ? left.name.localeCompare(right.name, "zh-CN") : right.updatedAt.localeCompare(left.updatedAt));
  }, [agents, folderId, filterIndex, query, sortKey]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const folderEmpty = !agents.some(agent => agent.folderId === folderId);

  function applyTemplate(template: AgentTemplate) {
    setAgents(current => [{ id: `${template.id}-${current.length}`, name: template.name, description: template.description, type: "workflow", published: false, owner: "张宁", avatar: template.illustration, folderId, updatedAt: "2026-11-09" }, ...current]);
    setTemplateOpen(false);
    setFilterIndex(0);
    setPage(1);
  }

  return <div style={brandBlue} className={`flex min-w-0 flex-col gap-5 ${className}`}>
    <PageTitleToolbar
      title="应用智能体"
      breadcrumbs={<Breadcrumbs className="flex-wrap gap-y-1 [&>span]:whitespace-nowrap" color="blue" items={[{ label: "工作台", href: "#overview" }, { label: "智能体", href: "#apps" }, { label: "应用智能体" }]} />}
      askAi={{ placeholder: "问问应用智能体…", suggestions: ["哪些智能体还没发布？", "帮我找处理发票的智能体"], onSend: () => "根目录下有 3 个未发布的智能体：运维故障分析、招聘初筛、标书要点梳理。处理发票可以用「发票信息提取」，它是已发布的高级工作流。" }}
      actions={<div className="flex flex-wrap items-center gap-2">
        <Button color="blue" variant="tertiary" onClick={() => setTemplateOpen(true)}>从模板创建</Button>
        <Button color="blue" iconLeft={<PlusIcon size={16} />}>新建应用智能体</Button>
      </div>}
      className="flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4 [&>div:first-child]:w-full [&>div:first-child]:min-w-0 [&>div:first-child]:sm:min-w-48 [&>div:last-child]:sm:flex-wrap"
    />
    <div className="flex min-h-0 flex-col gap-4 lg:min-h-[720px] lg:flex-row lg:items-stretch">
      <FolderSidebar folders={folders} selectedId={folderId} onSelect={id => { setFolderId(id); setPage(1); }} onCreate={name => setFolders(current => [...current, { id: `folder-${current.length}`, name }])} />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ButtonGroup items={filterTabs} activeIndex={filterIndex} color="blue" shape="pill" onChange={index => { setFilterIndex(index); setPage(1); }} />
          <div className="flex flex-wrap items-center gap-3">
            <SelectOption color="blue" width="160px" value={sortKey} options={[{ value: "update", label: "按更新时间" }, { value: "name", label: "按名称" }]} onChange={value => { setSortKey(value === "name" ? "name" : "update"); setPage(1); }} className="!gap-0" />
            <div className="w-[240px] shrink-0"><TextField color="blue" placeholder="搜索名称 / 描述 / 创建人" value={query} onChange={value => { setQuery(value); setPage(1); }} className="!gap-0" /></div>
            <span className="shrink-0 text-sm text-fg-grey-600">共 {filtered.length} 个{filtered.length > pageSize ? ` · 第 ${safePage}/${pageCount} 页` : null}</span>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          {filtered.length === 0 ? <div className="grid min-h-[360px] flex-1 place-items-center rounded-2xl border border-dashed border-fg-grey-200 px-6 py-16 text-center">
            {folderEmpty ? <div className="flex flex-col items-center gap-3 text-sm text-fg-grey-600">
              <p>当前目录暂无应用智能体</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button color="blue" size="sm" iconLeft={<PlusIcon size={16} />}>新建应用智能体</Button>
                <Button color="blue" size="sm" variant="tertiary" onClick={() => setTemplateOpen(true)}>从模板创建</Button>
              </div>
            </div> : <div className="flex flex-col items-center gap-3 text-sm text-fg-grey-600">
              <p>没有符合筛选或搜索的应用智能体</p>
              <Button color="blue" size="sm" variant="tertiary" onClick={() => { setFilterIndex(0); setQuery(""); }}>清除筛选</Button>
            </div>}
          </div> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paged.map(agent => <AgentCard key={agent.id} agent={agent} onDelete={() => setDeleting(agent)} />)}
          </div>}
          {filtered.length > pageSize ? <div className="mt-4 flex items-center justify-end gap-2 border-t border-fg-grey-100 pt-3 text-sm">
            <Button color="blue" variant="tertiary" size="sm" disabled={safePage <= 1} onClick={() => setPage(current => Math.max(1, current - 1))}>上一页</Button>
            <span className="tabular-nums text-fg-grey-600">{safePage} / {pageCount}</span>
            <Button color="blue" variant="tertiary" size="sm" disabled={safePage >= pageCount} onClick={() => setPage(current => Math.min(pageCount, current + 1))}>下一页</Button>
          </div> : null}
        </div>
      </div>
    </div>

    <Modal open={templateOpen} onOpenChange={setTemplateOpen} title="从模板创建高级智能体" width="w-[min(96vw,1100px)]">
      <p className="mb-4 text-sm leading-6 text-fg-grey-500">选择模板快速创建高级工作流智能体。</p>
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(max(148px,calc((100%-0.75rem*5)/6)),1fr))]">
        {templates.map(template => <TemplateCard key={template.id} template={template} onUse={() => applyTemplate(template)} />)}
      </div>
    </Modal>
    {deleting ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <ConfirmationDialog title="删除应用智能体？" description={`确定删除「${deleting.name}」？此操作不可撤销。`} color="red" confirmLabel="删除" cancelLabel="取消" onCancel={() => setDeleting(null)} onConfirm={() => { setAgents(current => current.filter(agent => agent.id !== deleting.id)); setDeleting(null); }} />
    </div> : null}
  </div>;
}
