"use client";

import { useState, type FormEvent } from "react";
import { Button, Checkbox, IconButton, Modal, PlusIcon, SelectOption, StatusBadge, TextField, ToolbarSearchInput, cn } from "@forge-ui-official/core";
import { LinkLinear, SettingsBoldDuotone } from "@forge-ui-official/core/icons";

export interface ChannelType {
  id: string;
  name: string;
  initial: string;
  tone: string;
}

export interface ChannelConnection {
  id: string;
  name: string;
  channel: string;
  agent: string;
  enabled: boolean;
  messages: number;
}

export const defaultChannelTypes: ChannelType[] = [
  { id: "wecom", name: "企业微信", initial: "企", tone: "bg-fg-blue-50 text-fg-blue" },
  { id: "feishu", name: "飞书", initial: "飞", tone: "bg-fg-cyan-50 text-fg-cyan-600" },
  { id: "dingtalk", name: "钉钉", initial: "钉", tone: "bg-fg-blue-50 text-fg-blue" },
  { id: "wechat", name: "微信公众号", initial: "微", tone: "bg-fg-green-50 text-fg-green-500" },
  { id: "web", name: "网页嵌入", initial: "网", tone: "bg-fg-violet-50 text-fg-violet" },
];

export const defaultChannelConnections: ChannelConnection[] = [
  { id: "c1", name: "售后客服群", channel: "feishu", agent: "售后问答助手", enabled: true, messages: 1286 },
  { id: "c2", name: "销售周会机器人", channel: "dingtalk", agent: "销售商机助手", enabled: true, messages: 342 },
  { id: "c3", name: "官网在线咨询", channel: "web", agent: "售后问答助手", enabled: true, messages: 2410 },
  { id: "c4", name: "招聘咨询号", channel: "wechat", agent: "招聘初筛", enabled: false, messages: 58 },
];

const agents = ["售后问答助手", "销售商机助手", "周报与会议纪要", "招聘初筛"];

export interface MessageChannelsProps {
  channels?: ChannelType[];
  connections?: ChannelConnection[];
  onSave?: (connection: ChannelConnection) => void;
  className?: string;
}

export function MessageChannels({ channels = defaultChannelTypes, connections = defaultChannelConnections, onSave, className }: MessageChannelsProps) {
  const [items, setItems] = useState(connections);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<{ name: string; channel: string; agent: string; appId: string; enabled: boolean } | null>(null);
  const channelOf = (id: string) => channels.find(channel => channel.id === id) ?? channels[0];
  const visible = items.filter(item => `${item.name} ${item.agent} ${channelOf(item.channel).name}`.includes(query.trim()));

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft || !draft.agent) return;
    const connection: ChannelConnection = { id: `c-${Date.now()}`, name: draft.name.trim() || `${draft.agent} · ${channelOf(draft.channel).name}`, channel: draft.channel, agent: draft.agent, enabled: draft.enabled, messages: 0 };
    setItems(current => [connection, ...current]);
    onSave?.(connection);
    setDraft(null);
  }

  return <section className={cn("flex min-w-0 flex-col gap-6", className)}>
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-fg-black">支持的渠道</h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">{channels.map(channel => <li key={channel.id}><Button variant="unstyled" type="button" className="flex w-full items-center gap-3 rounded-card border border-fg-grey-200 bg-white px-4 py-3 text-left transition-colors hover:border-fg-blue-300" onClick={() => setDraft({ name: "", channel: channel.id, agent: "", appId: "", enabled: true })}>
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl text-sm font-semibold", channel.tone)}>{channel.initial}</span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-fg-black">{channel.name}</span>
        <span className="shrink-0 text-fg-blue"><PlusIcon size={16} /></span>
      </Button></li>)}</ul>
    </div>
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-base font-semibold text-fg-black">已创建的连接 <span className="text-fg-grey-500">{items.length}</span></h2><ToolbarSearchInput className="w-full sm:w-64" value={query} onChange={setQuery} placeholder="搜索连接或智能体" /></div>
      {visible.length ? <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map(item => {
        const channel = channelOf(item.channel);
        return <li key={item.id} className={cn("flex flex-col gap-4 rounded-card border border-fg-grey-200 bg-white p-5", !item.enabled && "opacity-70")}>
          <div className="flex items-start justify-between gap-3"><p className="min-w-0 truncate text-sm font-semibold text-fg-black">{item.name}</p><StatusBadge label={item.enabled ? "运行中" : "已停用"} color={item.enabled ? "green" : "grey"} variant="soft" /></div>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-fg-grey-50 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-fg-blue-50 text-xs font-semibold text-fg-blue">{item.agent.slice(0, 1)}</span><span className="truncate text-xs text-fg-grey-900">{item.agent}</span></div>
            <LinkLinear size={16} className="shrink-0 text-fg-grey-500" />
            <div className="flex min-w-0 items-center gap-2"><span className={cn("grid size-8 shrink-0 place-items-center rounded-lg text-xs font-semibold", channel.tone)}>{channel.initial}</span><span className="truncate text-xs text-fg-grey-900">{channel.name}</span></div>
          </div>
          <div className="flex items-center justify-between gap-3"><span className="text-xs text-fg-grey-700">累计消息 {item.messages.toLocaleString("zh-CN")}</span><div className="flex items-center gap-2"><Checkbox color="blue" checked={item.enabled} onChange={value => setItems(current => current.map(entry => entry.id === item.id ? { ...entry, enabled: value } : entry))} aria-label={`启用${item.name}`} /><IconButton variant="ghost" color="grey" size="sm" aria-label={`设置${item.name}`}><SettingsBoldDuotone size={16} /></IconButton></div></div>
        </li>;
      })}</ul> : <p className="rounded-card border border-dashed border-fg-grey-200 py-12 text-center text-sm text-fg-grey-700">还没有连接，点上方渠道开始创建。</p>}
    </div>
    <Modal open={draft !== null} onOpenChange={open => { if (!open) setDraft(null); }} title={draft ? `添加${channelOf(draft.channel).name}连接` : "添加连接"}>
      {draft && <form className="flex flex-col gap-4" onSubmit={submit}>
        <TextField label="连接名称" shape="pill" value={draft.name} onChange={value => setDraft({ ...draft, name: value })} placeholder="默认使用 智能体名 · 渠道名" />
        <SelectOption label="渠道类型" shape="pill" options={channels.map(channel => ({ value: channel.id, label: channel.name }))} value={draft.channel} onChange={value => setDraft({ ...draft, channel: value })} />
        <TextField label="App ID" shape="pill" value={draft.appId} onChange={value => setDraft({ ...draft, appId: value })} placeholder="在渠道开放平台获取" />
        <SelectOption label="绑定智能体" shape="pill" placeholder="请选择" options={agents.map(agent => ({ value: agent, label: agent }))} value={draft.agent} onChange={value => setDraft({ ...draft, agent: value })} />
        <label className="flex items-center gap-2 text-sm text-fg-black"><Checkbox color="blue" checked={draft.enabled} onChange={value => setDraft({ ...draft, enabled: value })} />创建后立即启用</label>
        <div className="flex justify-end gap-3"><Button type="button" variant="tertiary" onClick={() => setDraft(null)}>取消</Button><Button type="submit" disabled={!draft.agent}>保存</Button></div>
      </form>}
    </Modal>
  </section>;
}
