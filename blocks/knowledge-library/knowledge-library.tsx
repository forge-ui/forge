"use client";

import { useState } from "react";
import { Avatar, Button, FileTypeIcon, Panel, PlusIcon, ToolbarSearchInput, cn } from "@forge-ui-official/core";
import { StarBold, StarLinear } from "@forge-ui-official/core/icons";

export interface LibraryDocument {
  id: string;
  title: string;
  summary: string;
  collection: string;
  type: "doc" | "pdf" | "xls" | "ppt" | "fig";
  author: { name: string; avatar: string };
  updatedAt: string;
  starred?: boolean;
}

export const defaultLibraryDocuments: LibraryDocument[] = [
  { id: "d1", title: "客户工作台需求说明 v2", summary: "第二阶段范围、角色权限与验收标准。", collection: "产品需求", type: "doc", author: { name: "张宁", avatar: "/images/team/edward-allen.png" }, updatedAt: "10-31", starred: true },
  { id: "d2", title: "设计规范 · 色板与字阶", summary: "Forge token 的使用约定与常见反例。", collection: "设计规范", type: "fig", author: { name: "林悦", avatar: "/images/blocks/people/lin-yue.jpg" }, updatedAt: "10-30" },
  { id: "d3", title: "订单接口字段说明", summary: "订单、支付、退款三类接口的字段与错误码。", collection: "技术文档", type: "pdf", author: { name: "周予安", avatar: "/images/blocks/people/zhou-yuan.jpg" }, updatedAt: "10-29", starred: true },
  { id: "d4", title: "验收用例清单", summary: "全流程验收的 86 条用例与负责人。", collection: "质量保障", type: "xls", author: { name: "许知夏", avatar: "/images/blocks/people/xu-zhixia.jpg" }, updatedAt: "10-28" },
  { id: "d5", title: "知意教育方案汇报", summary: "面向校方的方案讲解与报价说明。", collection: "客户资料", type: "ppt", author: { name: "张宁", avatar: "/images/team/edward-allen.png" }, updatedAt: "10-27" },
  { id: "d6", title: "前端组件使用约定", summary: "页面组件、表格与表单的推荐写法。", collection: "技术文档", type: "doc", author: { name: "陈思远", avatar: "/images/blocks/people/chen-siyuan.jpg" }, updatedAt: "10-25" },
];

export interface KnowledgeLibraryProps {
  documents?: LibraryDocument[];
  onCreate?: () => void;
  onOpen?: (document: LibraryDocument) => void;
  className?: string;
}

export function KnowledgeLibrary({ documents = defaultLibraryDocuments, onCreate, onOpen, className }: KnowledgeLibraryProps) {
  const [docs, setDocs] = useState(documents);
  const [collection, setCollection] = useState("全部文档");
  const [query, setQuery] = useState("");
  const collections = ["全部文档", "已收藏", ...Array.from(new Set(docs.map(doc => doc.collection)))];
  const count = (name: string) => name === "全部文档" ? docs.length : name === "已收藏" ? docs.filter(doc => doc.starred).length : docs.filter(doc => doc.collection === name).length;
  const visible = docs.filter(doc => (collection === "全部文档" || (collection === "已收藏" ? doc.starred : doc.collection === collection)) && `${doc.title} ${doc.summary}`.includes(query.trim()));

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)]", className)}>
    <Panel variant="template" title="分类">
      <ul className="flex flex-col gap-1">{collections.map(name => <li key={name}><Button variant="unstyled" type="button" aria-current={name === collection ? "true" : undefined} className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors", name === collection ? "bg-fg-blue-50 font-semibold text-fg-blue" : "text-fg-grey-700 hover:bg-fg-grey-50")} onClick={() => setCollection(name)}><span>{name}</span><span className="tabular-nums">{count(name)}</span></Button></li>)}</ul>
    </Panel>
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <ToolbarSearchInput className="w-full sm:w-72" value={query} onChange={setQuery} placeholder="搜索文档标题或内容" />
        <Button iconLeft={<PlusIcon size={16} />} onClick={onCreate}>新建文档</Button>
      </div>
      {visible.length ? <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">{visible.map(doc => <li key={doc.id} className="flex flex-col gap-3 rounded-card border border-fg-grey-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <FileTypeIcon fileName={`${doc.title}.${doc.type}`} className="h-10 w-10" />
          <Button variant="unstyled" type="button" className="min-w-0 flex-1 text-left" onClick={() => onOpen?.(doc)}><span className="block truncate text-sm font-semibold text-fg-black">{doc.title}</span><span className="mt-1 block text-xs text-fg-grey-700">{doc.collection}</span></Button>
          <Button variant="unstyled" type="button" aria-label={doc.starred ? `取消收藏${doc.title}` : `收藏${doc.title}`} aria-pressed={Boolean(doc.starred)} className={doc.starred ? "text-fg-yellow-500" : "text-fg-grey-500"} onClick={() => setDocs(current => current.map(item => item.id === doc.id ? { ...item, starred: !item.starred } : item))}>{doc.starred ? <StarBold size={18} /> : <StarLinear size={18} />}</Button>
        </div>
        <p className="text-sm leading-6 text-fg-grey-700">{doc.summary}</p>
        <div className="flex items-center gap-2 border-t border-fg-grey-200 pt-3 text-xs text-fg-grey-700"><Avatar src={doc.author.avatar} alt={doc.author.name} size="sm" />{doc.author.name} · 更新于 {doc.updatedAt}</div>
      </li>)}</ul> : <p className="rounded-card border border-dashed border-fg-grey-200 py-16 text-center text-sm text-fg-grey-700">这个分类下还没有文档</p>}
    </div>
  </div>;
}
