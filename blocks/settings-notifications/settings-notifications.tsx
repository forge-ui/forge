"use client";

import { useState } from "react";
import { Button, Panel, SelectOption, Toggle, cn } from "@forge-ui-official/core";

export type NotificationChannel = "inbox" | "email" | "im";

export interface NotificationRule {
  id: string;
  group: string;
  title: string;
  description: string;
  channels: Record<NotificationChannel, boolean>;
}

export const defaultNotificationRules: NotificationRule[] = [
  { id: "task-done", group: "智能体任务", title: "任务完成", description: "自主智能体完成任务并生成产物", channels: { inbox: true, email: false, im: true } },
  { id: "task-approval", group: "智能体任务", title: "需要我确认", description: "任务在危险操作前暂停等待确认", channels: { inbox: true, email: true, im: true } },
  { id: "task-failed", group: "智能体任务", title: "任务失败", description: "运行时报错或超时", channels: { inbox: true, email: true, im: false } },
  { id: "mention", group: "协作", title: "被 @ 提及", description: "评论、对话或任务中提到我", channels: { inbox: true, email: false, im: true } },
  { id: "assign", group: "协作", title: "分配给我", description: "有人把任务或工单分配给我", channels: { inbox: true, email: true, im: false } },
  { id: "budget", group: "用量与账单", title: "用量预警", description: "本月成本达到预算的 80%", channels: { inbox: true, email: true, im: false } },
  { id: "invoice", group: "用量与账单", title: "账单与发票", description: "生成账单、付款成功或失败", channels: { inbox: false, email: true, im: false } },
];

const channelLabel: Record<NotificationChannel, string> = { inbox: "站内", email: "邮件", im: "飞书" };

export interface SettingsNotificationsProps {
  rules?: NotificationRule[];
  onSave?: (rules: NotificationRule[], digest: string) => void;
  className?: string;
}

export function SettingsNotifications({ rules = defaultNotificationRules, onSave, className }: SettingsNotificationsProps) {
  const [items, setItems] = useState(rules);
  const [digest, setDigest] = useState("daily");
  const [quiet, setQuiet] = useState(true);
  const [saved, setSaved] = useState(false);
  const groups = Array.from(new Set(items.map(rule => rule.group)));
  const channels = Object.keys(channelLabel) as NotificationChannel[];

  function toggle(id: string, channel: NotificationChannel, value: boolean) {
    setItems(current => current.map(rule => rule.id === id ? { ...rule, channels: { ...rule.channels, [channel]: value } } : rule));
    setSaved(false);
  }

  return <section className={cn("mx-auto flex w-full min-w-0 max-w-4xl flex-col gap-4", className)}>
    {groups.map(group => <Panel key={group} variant="template" title={group}>
      <div className="fg-scrollbar-hidden overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="text-xs text-fg-grey-700"><th className="pb-2 font-medium">事件</th>{channels.map(channel => <th key={channel} className="w-12 pb-2 text-center font-medium sm:w-20">{channelLabel[channel]}</th>)}</tr></thead>
          <tbody>{items.filter(rule => rule.group === group).map(rule => <tr key={rule.id} className="border-t border-fg-grey-200">
            <td className="py-3 pr-4"><p className="font-semibold text-fg-black">{rule.title}</p><p className="mt-0.5 hidden text-xs text-fg-grey-700 sm:block">{rule.description}</p></td>
            {channels.map(channel => <td key={channel} className="py-3 text-center"><span className="inline-flex"><Toggle size="sm" color="blue" checked={rule.channels[channel]} onChange={value => toggle(rule.id, channel, value)} ariaLabel={`${rule.title} · ${channelLabel[channel]}`} /></span></td>)}
          </tr>)}</tbody>
        </table>
      </div>
    </Panel>)}
    <Panel variant="template" title="汇总与免打扰">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-semibold text-fg-black">邮件摘要</p><p className="text-xs text-fg-grey-700">把未读通知合并成一封邮件</p></div><div className="w-40"><SelectOption shape="pill" options={[{ value: "off", label: "不发送" }, { value: "daily", label: "每天 9:00" }, { value: "weekly", label: "每周一" }]} value={digest} onChange={value => { setDigest(value); setSaved(false); }} /></div></div>
      <div className="flex items-center justify-between gap-4 border-t border-fg-grey-200 pt-4"><div><p className="text-sm font-semibold text-fg-black">夜间免打扰</p><p className="text-xs text-fg-grey-700">22:00–8:00 只保留「需要我确认」</p></div><Toggle color="blue" checked={quiet} onChange={value => { setQuiet(value); setSaved(false); }} ariaLabel="夜间免打扰" /></div>
    </Panel>
    <div className="flex items-center justify-end gap-3">{saved && <span role="status" className="text-sm text-fg-green-500">通知设置已保存</span>}<Button onClick={() => { onSave?.(items, digest); setSaved(true); }}>保存设置</Button></div>
  </section>;
}
