"use client";

import { useState } from "react";
import { Avatar, Button, Checkbox, Panel, TabBar, ToolbarSearchInput, cn } from "@forge-ui-official/core";
import { CalendarMinimalisticLinear, DocumentTextLinear, PhoneCallingLinear, UsersGroupRoundedLinear } from "@forge-ui-official/core/icons";

export type CrmActivityKind = "meeting" | "call" | "note";

export interface CrmMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface CrmActivityItem {
  id: string;
  kind: CrmActivityKind;
  memberId: string;
  title: string;
  body: string;
  time: string;
  meta: { label: string; value: string }[];
}

export const defaultCrmMembers: CrmMember[] = [
  { id: "m1", name: "张宁", role: "销售总监", avatar: "/images/team/edward-allen.png" },
  { id: "m2", name: "林悦", role: "客户经理", avatar: "/images/blocks/people/lin-yue.jpg" },
  { id: "m3", name: "周予安", role: "客户经理", avatar: "/images/blocks/people/zhou-yuan.jpg" },
  { id: "m4", name: "唐可欣", role: "售前顾问", avatar: "/images/blocks/people/tang-kexin.jpg" },
  { id: "m5", name: "顾承泽", role: "渠道经理", avatar: "/images/blocks/people/gu-chengze.jpg" },
];

export const defaultCrmActivities: CrmActivityItem[] = [
  { id: "ca1", kind: "meeting", memberId: "m1", title: "与知意教育确认采购方案", body: "讲解家校沟通与线索管理模块，校方希望 11 月中旬拿到正式报价。", time: "10-31 10:00", meta: [{ label: "结果", value: "进入报价" }, { label: "参与人", value: "宋知意、张宁" }, { label: "纪要", value: "会议纪要.pdf" }] },
  { id: "ca2", kind: "call", memberId: "m2", title: "回访木禾文化", body: "官网改版已上线一个月，客户反馈转化率提升，有意向追加内容中台。", time: "10-30 15:20", meta: [{ label: "时长", value: "18 分钟" }, { label: "下一步", value: "发送方案" }, { label: "提醒", value: "11-03 10:00" }] },
  { id: "ca3", kind: "note", memberId: "m3", title: "云帆科技预算说明", body: "数据看板项目预算 5.8 万，需走两级审批，预计 11 月第二周回款。", time: "10-29 09:40", meta: [{ label: "商机", value: "数据看板定制" }, { label: "金额", value: "¥58,000" }, { label: "状态", value: "待回款" }] },
  { id: "ca4", kind: "meeting", memberId: "m4", title: "青石建筑需求澄清", body: "巡检小程序需要离线拍照与定位，售前已整理需求清单并同步交付团队。", time: "10-28 14:00", meta: [{ label: "结果", value: "需求确认" }, { label: "参与人", value: "许知夏、唐可欣" }, { label: "附件", value: "需求清单.xlsx" }] },
  { id: "ca5", kind: "call", memberId: "m5", title: "拾光商业渠道合作", body: "沟通门店会员系统的渠道分成比例，对方希望首年 15%。", time: "10-27 11:30", meta: [{ label: "时长", value: "26 分钟" }, { label: "下一步", value: "内部评估" }, { label: "提醒", value: "10-31 17:00" }] },
];

const kindMeta: Record<CrmActivityKind, { label: string; icon: typeof PhoneCallingLinear; tone: string }> = {
  meeting: { label: "会议", icon: CalendarMinimalisticLinear, tone: "bg-fg-violet-50 text-fg-violet" },
  call: { label: "电话", icon: PhoneCallingLinear, tone: "bg-fg-blue-50 text-fg-blue" },
  note: { label: "备注", icon: DocumentTextLinear, tone: "bg-fg-yellow-50 text-fg-yellow-600" },
};
const tabs: { label: string; kind?: CrmActivityKind }[] = [{ label: "全部" }, { label: "会议", kind: "meeting" }, { label: "电话", kind: "call" }, { label: "备注", kind: "note" }];

export interface CrmActivityProps {
  members?: CrmMember[];
  activities?: CrmActivityItem[];
  className?: string;
}

export function CrmActivity({ members = defaultCrmMembers, activities = defaultCrmActivities, className }: CrmActivityProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set(members.map(member => member.id)));
  const [memberQuery, setMemberQuery] = useState("");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState(0);
  const kind = tabs[tab].kind;
  const memberKeyword = memberQuery.trim();
  const keyword = query.trim().toLocaleLowerCase();
  const visibleMembers = members.filter(member => member.name.includes(memberKeyword) || member.role.includes(memberKeyword));
  const visible = activities.filter(activity => checked.has(activity.memberId) && (!kind || activity.kind === kind) && `${activity.title} ${activity.body}`.toLocaleLowerCase().includes(keyword));
  const allChecked = checked.size === members.length;

  function toggle(id: string, value: boolean) {
    setChecked(current => {
      const next = new Set(current);
      if (value) next.add(id); else next.delete(id);
      return next;
    });
  }

  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[260px_minmax(0,1fr)]", className)}>
    <Panel variant="template" title="成员" action={<Button variant="unstyled" type="button" className="flex items-center gap-1 text-sm font-semibold text-fg-blue" onClick={() => setChecked(allChecked ? new Set() : new Set(members.map(member => member.id)))}><UsersGroupRoundedLinear size={16} />{allChecked ? "取消全选" : "全选"}</Button>}>
      <ToolbarSearchInput className="sm:w-full sm:max-w-none" value={memberQuery} onChange={setMemberQuery} placeholder="搜索成员" />
      <ul className="flex flex-col gap-3">{visibleMembers.map(member => <li key={member.id} className="flex items-center gap-3">
        <Checkbox color="blue" checked={checked.has(member.id)} onChange={value => toggle(member.id, value)} aria-label={`筛选${member.name}`} />
        <Avatar src={member.avatar} alt={member.name} size="md" />
        <div className="min-w-0"><p className="truncate text-sm font-semibold text-fg-black">{member.name}</p><p className="text-xs text-fg-grey-700">{member.role}</p></div>
      </li>)}</ul>
    </Panel>
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-fg-grey-200">
        <div className="fg-scrollbar-hidden overflow-x-auto"><TabBar color="blue" tabs={tabs.map((item, index) => ({ label: item.label, active: index === tab }))} onChange={setTab} /></div>
        <ToolbarSearchInput className="mb-2 w-full sm:w-60" value={query} onChange={setQuery} placeholder="搜索动态" />
      </div>
      {visible.length ? <ul className="flex flex-col gap-4">{visible.map(activity => {
        const member = members.find(item => item.id === activity.memberId);
        const meta = kindMeta[activity.kind];
        const Icon = meta.icon;
        return <li key={activity.id}><Panel variant="template">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-fg-grey-200 pb-3 text-sm"><p className="flex items-center gap-2 text-fg-grey-700"><span className={cn("grid size-8 place-items-center rounded-full", meta.tone)}><Icon size={16} /></span>{member?.name} 记录了{meta.label}</p><p className="flex items-center gap-1 text-xs text-fg-grey-700"><CalendarMinimalisticLinear size={14} />{activity.time}</p></div>
          <div className="flex gap-3">{member && <Avatar src={member.avatar} alt={member.name} size="sm" />}<div className="min-w-0"><p className="text-base font-semibold text-fg-black">{activity.title}</p><p className="mt-1 text-sm leading-6 text-fg-grey-700">{activity.body}</p></div></div>
          <dl className="grid grid-cols-1 gap-3 rounded-xl border border-fg-grey-200 p-3 text-sm sm:grid-cols-3">{activity.meta.map(item => <div key={item.label}><dt className="text-xs text-fg-grey-700">{item.label}</dt><dd className="mt-1 font-medium text-fg-black">{item.value}</dd></div>)}</dl>
        </Panel></li>;
      })}</ul> : <p className="rounded-card border border-dashed border-fg-grey-200 py-12 text-center text-sm text-fg-grey-700">没有符合条件的动态，试试勾选更多成员。</p>}
    </div>
  </div>;
}
