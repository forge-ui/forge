"use client";

import { useState, type CSSProperties } from "react";
import { Breadcrumbs, Button, CheckboxWithLabel, ConfirmationDialog, Grid, KebabMenu, Modal, PageTitleToolbar, PlusIcon, RadioWithLabel, SelectOption, StatusBadge, SurfaceCard, TextField, Toolbar, ToolbarSearchInput, ToolbarSelectDropdown } from "@forge-ui-official/core";

export type ChannelKind = "clawbot" | "wecom" | "feishu" | "dingtalk" | "qq";
export type ConnectionStatus = "connected" | "connecting" | "error" | "disabled" | "configured" | "pending";

export interface ChannelConnection {
  id: string;
  name: string;
  kind: ChannelKind;
  agentName: string;
  agentAvatar: string;
  binding: "application" | "autonomous";
  status: ConnectionStatus;
  enabled: boolean;
  ownerLimited?: boolean;
}

export interface ChannelAgentOption {
  value: string;
  label: string;
  avatar: string;
}

export const channelNames: Record<ChannelKind, string> = { wecom: "企业微信", clawbot: "微信 ClawBot", feishu: "飞书", dingtalk: "钉钉", qq: "QQ" };
const channelLogos: Record<ChannelKind, string> = { clawbot: "wechat", wecom: "wecom", feishu: "lark", dingtalk: "dingtalk", qq: "qq" };
const supportedChannels: ChannelKind[] = ["clawbot", "wecom", "feishu", "dingtalk", "qq"];

export const defaultChannelApplications: ChannelAgentOption[] = [
  { value: "after-sales", label: "售后问答助手", avatar: "/images/blocks/agents/observatory-robot.webp" },
  { value: "sales", label: "销售商机助手", avatar: "/images/blocks/agents/fox-4.webp" },
  { value: "policy", label: "制度问答", avatar: "/images/blocks/agents/baby-sloth.webp" },
  { value: "weekly", label: "周报与会议纪要", avatar: "/images/blocks/agents/deer-warm-tiny-smile-right.webp" },
];

export const defaultChannelAutonomous: ChannelAgentOption[] = [
  { value: "gallery-check", label: "图库验收助手", avatar: "/images/blocks/agents/friendly-ghost.webp" },
];

export const defaultConnections: ChannelConnection[] = [
  { id: "conn-1", name: "售后问答助手 · 企业微信", kind: "wecom", agentName: "售后问答助手", agentAvatar: "/images/blocks/agents/observatory-robot.webp", binding: "application", status: "connected", enabled: true },
  { id: "conn-2", name: "售后问答助手 · 飞书", kind: "feishu", agentName: "售后问答助手", agentAvatar: "/images/blocks/agents/observatory-robot.webp", binding: "application", status: "connected", enabled: true },
  { id: "conn-3", name: "销售商机助手 · 钉钉", kind: "dingtalk", agentName: "销售商机助手", agentAvatar: "/images/blocks/agents/fox-4.webp", binding: "application", status: "connecting", enabled: true },
  { id: "conn-4", name: "图库验收助手 · 微信 ClawBot", kind: "clawbot", agentName: "图库验收助手", agentAvatar: "/images/blocks/agents/friendly-ghost.webp", binding: "autonomous", status: "connected", enabled: true, ownerLimited: true },
  { id: "conn-5", name: "制度问答 · QQ", kind: "qq", agentName: "制度问答", agentAvatar: "/images/blocks/agents/baby-sloth.webp", binding: "application", status: "configured", enabled: true },
  { id: "conn-6", name: "周报与会议纪要 · 飞书", kind: "feishu", agentName: "周报与会议纪要", agentAvatar: "/images/blocks/agents/deer-warm-tiny-smile-right.webp", binding: "application", status: "error", enabled: true },
];

function channelStatus(row: ChannelConnection) {
  if (!row.enabled || row.status === "disabled") return { label: "已停用", color: "red" as const };
  if (row.status === "connected") return { label: "已连接", color: "green" as const };
  if (row.status === "connecting") return { label: "连接中", color: "blue" as const };
  if (row.status === "error") return { label: "授权已失效", color: "red" as const };
  if (row.status === "configured") return { label: "待启动接收服务", color: "yellow" as const };
  return { label: row.kind === "clawbot" ? "待扫码授权" : "待配置凭据", color: "yellow" as const };
}

/** 智能体工场的品牌色是蓝色：把 core 默认的紫色色阶整体映射到蓝色 */
const brandBlue = Object.fromEntries(["", "-50", "-100", "-200", "-300", "-400", "-500", "-600", "-700", "-800", "-900"].flatMap(step => [[`--fg-violet${step}`, `var(--fg-blue${step})`], [`--color-fg-violet${step}`, `var(--fg-blue${step})`]])) as CSSProperties;

const credentialHint: Record<Exclude<ChannelKind, "clawbot">, string> = {
  wecom: "使用企业微信智能机器人的 API 长连接模式。",
  feishu: "使用飞书自建应用，开启机器人和长连接事件订阅。",
  dingtalk: "使用钉钉企业内部应用机器人，开启 Stream 模式。",
  qq: "在 QQ 开放平台创建机器人，开启私聊、群聊消息权限。",
};

function ConnectionForm({ current, initialKind, applications, autonomousAgents, onClose, onSave }: { current?: ChannelConnection; initialKind?: ChannelKind; applications: ChannelAgentOption[]; autonomousAgents: ChannelAgentOption[]; onClose: () => void; onSave: (row: ChannelConnection) => void }) {
  const [kind, setKind] = useState<ChannelKind>(current?.kind ?? initialKind ?? "wecom");
  const [binding, setBinding] = useState(current?.binding ?? "application");
  const [agent, setAgent] = useState(() => [...applications, ...autonomousAgents].find(item => item.label === current?.agentName)?.value ?? "");
  const [name, setName] = useState(current?.name ?? "");
  const [botId, setBotId] = useState("");
  const [secret, setSecret] = useState("");
  const [enabled, setEnabled] = useState(current?.enabled ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const autonomous = kind === "clawbot" && binding === "autonomous";
  const options = autonomous ? autonomousAgents : applications;
  const selected = options.find(item => item.value === agent);
  const label = kind === "wecom" ? ["Bot ID", "Secret"] : kind === "dingtalk" ? ["Client ID（AppKey）", "Client Secret（AppSecret）"] : ["App ID", "App Secret"];

  function save() {
    const next: Record<string, string> = {};
    if (!selected) next.agent = autonomous ? "请选择绑定的自主智能体" : "请选择绑定的应用智能体";
    const finalName = name.trim() || (selected ? `${selected.label} · ${channelNames[kind]}` : "");
    if (!finalName) next.name = "请输入连接名称";
    if (Object.keys(next).length || !selected) { setErrors(next); return; }
    onSave({ id: current?.id ?? `conn-${Date.now()}`, name: finalName, kind, agentName: selected.label, agentAvatar: selected.avatar, binding: autonomous ? "autonomous" : "application", status: kind === "clawbot" ? "pending" : secret ? "configured" : "pending", enabled });
  }

  return <Modal open onOpenChange={open => { if (!open) onClose(); }} title={current ? "连接设置" : "添加消息渠道"} footer={<div className="flex justify-end gap-2">
    <Button color="blue" variant="secondary" onClick={onClose}>取消</Button>
    <Button color="blue" onClick={save}>{kind === "clawbot" && !current ? "保存并获取二维码" : "保存"}</Button>
  </div>}>
    <div className="flex flex-col gap-4">
      <TextField color="blue" label="连接名称" value={name} onChange={setName} placeholder="默认是智能体名 · 渠道名，可自行修改" state={errors.name ? "error" : "idle"} errorMessage={errors.name} />
      <SelectOption color="blue" label="渠道类型" width="100%" className="w-full" value={kind} state={current ? "disabled" : "idle"} options={supportedChannels.map(value => ({ value, label: channelNames[value] }))} onChange={value => { const next = value as ChannelKind; setKind(next); if (next !== "clawbot") setBinding("application"); }} />
      {kind !== "clawbot" ? <>
        <TextField color="blue" label={label[0]} value={botId} onChange={setBotId} />
        <TextField color="blue" label={label[1]} type="password" value={secret} onChange={setSecret} placeholder={current ? "已保存；留空保留原凭据" : "请输入渠道应用的密钥"} />
        <p className="text-xs text-fg-grey-700">{credentialHint[kind]}凭据加密保存，不会回显。</p>
      </> : <div className="flex flex-col gap-3">
        <p className="text-sm text-fg-grey-700">仅扫码微信可对话；仅私聊文本；长任务会先回执再补发。</p>
        <p className="text-xs text-fg-grey-700">填写名称并选择智能体后，点「保存并获取二维码」。二维码会出现在这张表单里，扫完后授权状态写回此处。</p>
      </div>}
      {kind === "clawbot" ? <div role="radiogroup" aria-label="绑定类型" className="flex flex-wrap gap-6">
        <RadioWithLabel color="blue" label="应用智能体" checked={binding === "application"} onChange={checked => { if (checked) { setBinding("application"); setAgent(""); } }} />
        <RadioWithLabel color="blue" label="自主智能体" checked={binding === "autonomous"} onChange={checked => { if (checked) { setBinding("autonomous"); setAgent(""); } }} />
      </div> : null}
      <SelectOption color="blue" label={autonomous ? "绑定自主智能体" : "绑定应用智能体"} width="100%" className="w-full" value={agent} onChange={value => { setAgent(value); setErrors(current => ({ ...current, agent: "" })); }} state={errors.agent ? "error" : "idle"} errorMessage={errors.agent} options={[{ value: "", label: autonomous ? "请选择 Grok Bot" : "请选择应用智能体" }, ...options.map(item => ({ value: item.value, label: item.label }))]} />
      <p className="text-xs text-fg-grey-700">{autonomous ? "只列出已配置 Webhook 的 Grok Bot。一个自主智能体只能有一条微信连接。" : "一个连接固定绑定一个智能体；同一智能体可以绑定多个连接。"}</p>
      <CheckboxWithLabel color="blue" checked={enabled} onChange={setEnabled} label="启用此连接" />
      <p className="text-xs text-fg-grey-700">保存配置不代表渠道已连通。消息接收服务启动并验证后才能使用。</p>
    </div>
  </Modal>;
}

export interface MessageChannelsProps {
  connections?: ChannelConnection[];
  applications?: ChannelAgentOption[];
  autonomousAgents?: ChannelAgentOption[];
  className?: string;
}

export function MessageChannels({ connections = defaultConnections, applications = defaultChannelApplications, autonomousAgents = defaultChannelAutonomous, className = "" }: MessageChannelsProps) {
  const [rows, setRows] = useState(connections);
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("all");
  const [form, setForm] = useState<{ current?: ChannelConnection; kind?: ChannelKind } | null>(null);
  const [deleting, setDeleting] = useState<ChannelConnection | null>(null);
  const filtered = Boolean(search) || kind !== "all";
  const visible = rows.filter(row => (kind === "all" || row.kind === kind) && `${row.name} ${row.agentName}`.toLowerCase().includes(search.toLowerCase()));
  const clear = () => { setSearch(""); setKind("all"); };

  return <div style={brandBlue} className={`flex min-w-0 flex-col gap-6 ${className}`}>
    <PageTitleToolbar
      title="消息渠道"
      subtitle="管理渠道连接。每个连接绑定一个应用智能体，或一个 Grok Bot 自主智能体。"
      breadcrumbs={<Breadcrumbs color="blue" items={[{ label: "工作台", href: "#overview" }, { label: "消息渠道" }]} />}
      askAi={{ placeholder: "问问消息渠道…", suggestions: ["飞书连接为什么授权失效？", "怎么把智能体接到钉钉？"], onSend: () => "「周报与会议纪要 · 飞书」的应用密钥已被重置，打开连接设置重新填写 App Secret 即可。接入钉钉：点上方钉钉卡片，填写企业内部应用的 AppKey 和 AppSecret，并开启 Stream 模式。" }}
      className="flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:gap-4 [&>div:first-child]:w-full [&>div:first-child]:min-w-0"
    />
    <section aria-labelledby="supported-channels" className="flex flex-col gap-4">
      <h2 id="supported-channels" className="text-base font-semibold text-fg-black">支持的渠道</h2>
      <Grid columns={{ base: 1, sm: 2, lg: 3, xl: 5 }} gap={16}>
        {supportedChannels.map(channel => <SurfaceCard key={channel} padding="none">
          <Button color="blue" variant="tertiary" aria-label={`添加${channelNames[channel]}连接`} className="h-16 w-full rounded-xl outline-transparent [&>span]:w-full" onClick={() => setForm({ kind: channel })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <span className="flex w-full items-center gap-3"><img src={`/images/blocks/channels/${channelLogos[channel]}.svg`} alt="" className="size-8 shrink-0 object-contain" /><span className="min-w-0 flex-1 text-left font-semibold text-fg-black">{channelNames[channel]}</span><PlusIcon size={20} /></span>
          </Button>
        </SurfaceCard>)}
      </Grid>
    </section>
    <h2 className="text-base font-semibold text-fg-black">已创建的连接</h2>
    <Toolbar left={<div className="flex flex-wrap items-center gap-3">
      <ToolbarSearchInput ariaLabel="搜索消息渠道" placeholder="搜索连接或智能体" value={search} onChange={setSearch} />
      <ToolbarSelectDropdown value={kind} options={[{ value: "all", label: "全部渠道" }, ...supportedChannels.map(value => ({ value, label: channelNames[value] }))]} onChange={setKind} />
      {filtered ? <Button color="blue" variant="tertiary" onClick={clear}>清除筛选</Button> : null}
    </div>} />
    {visible.length ? <Grid columns={{ base: 1, lg: 2, xl: 3 }} gap={16} alignItems="start">
      {visible.map(row => <SurfaceCard key={row.id} padding="sm" contentClassName="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 truncate text-base font-semibold leading-6 text-fg-black" title={row.name}>{row.name}</h3>
          <div className="shrink-0"><KebabMenu accent="blue" items={[{ label: row.enabled ? "停用连接" : "启用连接", onSelect: () => setRows(current => current.map(item => item.id === row.id ? { ...item, enabled: !item.enabled, status: item.enabled ? "disabled" : "connecting" } : item)) }, { label: "删除连接", danger: true, onSelect: () => setDeleting(row) }]} /></div>
        </div>
        <button type="button" aria-label={`设置连接：${row.name}`} className="flex items-center gap-2 text-left" onClick={() => setForm({ current: row })}>
          <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={row.agentAvatar} alt="" className="size-8 rounded-lg object-cover" />
            <span className="w-full truncate text-sm font-medium leading-5 text-fg-black" title={row.agentName}>{row.agentName}</span>
            {row.ownerLimited ? <span className="text-xs leading-4 text-fg-grey-700">已限定：本人</span> : null}
          </div>
          <span aria-hidden="true" className="shrink-0 text-base leading-5 text-fg-grey-700">↔</span>
          <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/blocks/channels/${channelLogos[row.kind]}.svg`} alt="" className="size-8 object-contain" />
            <span className="w-full truncate text-sm font-medium leading-5 text-fg-black">{channelNames[row.kind]}</span>
          </div>
        </button>
        <div className="flex items-center justify-between gap-2 border-t border-fg-grey-100 pt-3">
          <StatusBadge {...channelStatus(row)} />
          <Button color="blue" variant="tertiary" size="sm" onClick={() => setForm({ current: row })}>设置</Button>
        </div>
      </SurfaceCard>)}
    </Grid> : <div className="flex flex-col items-start gap-3 py-8">
      <p className="text-sm text-fg-grey-700">{filtered ? "没有符合条件的连接" : "还没有消息渠道，添加连接后绑定智能体。"}</p>
      <Button color="blue" variant="secondary" onClick={() => filtered ? clear() : setForm({})}>{filtered ? "清除筛选" : "添加连接"}</Button>
    </div>}

    {form ? <ConnectionForm key={form.current?.id ?? form.kind ?? "new"} current={form.current} initialKind={form.kind} applications={applications} autonomousAgents={autonomousAgents} onClose={() => setForm(null)} onSave={row => { setRows(current => current.some(item => item.id === row.id) ? current.map(item => item.id === row.id ? row : item) : [row, ...current]); setForm(null); }} /> : null}
    {deleting ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <ConfirmationDialog color="red" title="删除渠道连接？" description={`将解除“${deleting.name}”的智能体绑定并移除保存的凭据。智能体和聊天记录保留。`} confirmLabel="删除" cancelLabel="取消" onConfirm={() => { setRows(current => current.filter(item => item.id !== deleting.id)); setDeleting(null); }} onCancel={() => setDeleting(null)} />
    </div> : null}
  </div>;
}
