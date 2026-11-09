"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, type FormEvent } from "react";
import { Button, Modal, Panel, PlusIcon, SelectOption, StatusBadge, TabBar, TextArea, cn, type StatusBadgeColor } from "@forge-ui-official/core";
import { CalendarBoldDuotone, CheckCircleBoldDuotone, DocumentTextBoldDuotone, PenNewSquareBoldDuotone, PhoneBoldDuotone } from "@forge-ui-official/core/icons";

export type LeadActivityKind = "call" | "meeting" | "note" | "status";

export interface LeadActivity {
  id: string;
  kind: LeadActivityKind;
  title: string;
  description: string;
  time: string;
}

export interface LeadDetailData {
  name: string;
  email: string;
  avatar: string;
  status: { label: string; color: StatusBadgeColor };
  phone: string;
  company: string;
  source: string;
  owner: string;
  createdAt: string;
  activities: LeadActivity[];
}

export const defaultLeadDetail: LeadDetailData = {
  name: "宋知意",
  email: "zhiyi@zhiyi.edu",
  avatar: "/images/blocks/people/song-zhiyi.jpg",
  status: { label: "高意向", color: "red" },
  phone: "135 2210 6634",
  company: "知意教育",
  source: "老客户推荐",
  owner: "张宁",
  createdAt: "2026-10-14",
  activities: [
    { id: "a1", kind: "call", title: "与宋知意电话沟通", description: "确认明年一季度上线排期与采购流程，需在 11 月中旬前给出报价。", time: "10-30 12:45" },
    { id: "a2", kind: "meeting", title: "上门讲解客户工作台", description: "讲解了线索管理与报表模块，校长对家校沟通功能兴趣很高。", time: "10-28 14:20" },
    { id: "a3", kind: "note", title: "补充预算说明", description: "年度信息化预算约 30 万，需走财务审批后才能开具合同。", time: "10-24 09:10" },
    { id: "a4", kind: "status", title: "状态更新", description: "线索由「跟进中」调整为「高意向」。", time: "10-21 16:30" },
  ],
};

const kindMeta: Record<LeadActivityKind, { label: string; tone: string }> = {
  call: { label: "电话", tone: "bg-fg-blue-50 text-fg-blue" },
  meeting: { label: "会议", tone: "bg-fg-violet-50 text-fg-violet" },
  note: { label: "备注", tone: "bg-fg-yellow-50 text-fg-yellow-600" },
  status: { label: "状态", tone: "bg-fg-green-50 text-fg-green-500" },
};

const kindIcon = { call: PhoneBoldDuotone, meeting: CalendarBoldDuotone, note: PenNewSquareBoldDuotone, status: CheckCircleBoldDuotone };
const tabs: { label: string; kind?: LeadActivityKind }[] = [{ label: "全部动态" }, { label: "电话", kind: "call" }, { label: "会议", kind: "meeting" }, { label: "备注", kind: "note" }];

export interface LeadDetailProps {
  lead?: LeadDetailData;
  onAddActivity?: (activity: LeadActivity) => void;
  className?: string;
}

export function LeadDetail({ lead = defaultLeadDetail, onAddActivity, className }: LeadDetailProps) {
  const [tab, setTab] = useState(0);
  const [activities, setActivities] = useState(lead.activities);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<{ kind: LeadActivityKind; description: string }>({ kind: "call", description: "" });
  const kind = tabs[tab].kind;
  const visible = kind ? activities.filter(activity => activity.kind === kind) : activities;
  const info = [{ label: "手机号", value: lead.phone }, { label: "公司", value: lead.company }, { label: "线索来源", value: lead.source }, { label: "负责人", value: lead.owner }, { label: "创建日期", value: lead.createdAt }];

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.description.trim()) return;
    const now = new Date();
    const activity: LeadActivity = { id: `a-${now.getTime()}`, kind: draft.kind, title: `新增${kindMeta[draft.kind].label}记录`, description: draft.description.trim(), time: `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}` };
    setActivities(current => [activity, ...current]);
    onAddActivity?.(activity);
    setDraft({ kind: "call", description: "" });
    setAdding(false);
  }

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[280px_minmax(0,1fr)]", className)}>
    <div className="flex min-w-0 flex-col gap-4">
      <Panel variant="template">
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <img src={lead.avatar} alt={lead.name} className="size-20 rounded-full object-cover" />
          <div><p className="text-xl font-semibold text-fg-black">{lead.name}</p><p className="mt-1 text-sm text-fg-grey-700">{lead.email}</p></div>
          <StatusBadge {...lead.status} variant="soft" />
        </div>
      </Panel>
      <Panel variant="template" title="线索信息">
        <dl className="flex flex-col divide-y divide-fg-grey-200">{info.map(item => <div key={item.label} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0"><dt className="text-sm text-fg-grey-700">{item.label}</dt><dd className="text-sm font-medium text-fg-black">{item.value}</dd></div>)}</dl>
      </Panel>
    </div>
    <Panel variant="template">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-fg-grey-200">
        <div className="fg-scrollbar-hidden overflow-x-auto"><TabBar color="blue" tabs={tabs.map((item, index) => ({ label: item.label, active: index === tab }))} onChange={setTab} /></div>
        <Button className="mb-2" size="sm" iconLeft={<PlusIcon size={16} />} onClick={() => setAdding(true)}>添加跟进</Button>
      </div>
      {visible.length ? <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2">{visible.map(activity => {
        const Icon = kindIcon[activity.kind];
        return <li key={activity.id} className="flex gap-3 rounded-card border border-fg-grey-200 p-4">
          <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", kindMeta[activity.kind].tone)}><Icon size={20} /></span>
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-sm font-semibold text-fg-black">{activity.title}</p><p className="text-xs text-fg-grey-500">{activity.time}</p></div><p className="mt-2 text-sm leading-6 text-fg-grey-700">{activity.description}</p></div>
        </li>;
      })}</ul> : <p className="flex items-center justify-center gap-2 py-12 text-sm text-fg-grey-700"><DocumentTextBoldDuotone size={20} />暂无{tabs[tab].label}记录</p>}
    </Panel>
    <Modal open={adding} onOpenChange={setAdding} title="添加跟进记录">
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <SelectOption label="跟进方式" shape="pill" options={(Object.keys(kindMeta) as LeadActivityKind[]).filter(item => item !== "status").map(item => ({ value: item, label: kindMeta[item].label }))} value={draft.kind} onChange={value => setDraft({ ...draft, kind: value as LeadActivityKind })} />
        <TextArea label="跟进内容" rows={4} value={draft.description} onChange={value => setDraft({ ...draft, description: value })} placeholder="记录沟通要点与下一步计划" />
        <div className="flex justify-end gap-3"><Button type="button" variant="tertiary" onClick={() => setAdding(false)}>取消</Button><Button type="submit" disabled={!draft.description.trim()}>保存</Button></div>
      </form>
    </Modal>
  </div>;
}
