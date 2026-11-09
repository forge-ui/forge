"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button, Modal, StatusBadge, TextField, Toggle, cn } from "@forge-ui-official/core";
import { KeyboardBoldDuotone, LockKeyholeLinear, PhoneLinear } from "@forge-ui-official/core/icons";

export interface LoginSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string;
}

export const defaultLoginSessions: LoginSession[] = [
  { id: "s1", device: "MacBook Pro · Chrome", location: "上海", lastActive: "当前设备", current: true },
  { id: "s2", device: "iPhone 16 · 飞书内置浏览器", location: "上海", lastActive: "2 小时前" },
  { id: "s3", device: "Windows · Edge", location: "杭州", lastActive: "3 天前" },
];

export const defaultApiKeys: ApiKey[] = [
  { id: "k1", name: "CRM 同步", prefix: "zx_live_8f2a", createdAt: "2026-08-12", lastUsed: "今天 09:12" },
  { id: "k2", name: "数据看板", prefix: "zx_live_31c9", createdAt: "2026-10-03", lastUsed: "昨天" },
];

export interface SettingsSecurityProps {
  sessions?: LoginSession[];
  apiKeys?: ApiKey[];
  className?: string;
}

function Section({ title, description, action, children }: { title: string; description: string; action?: ReactNode; children: ReactNode }) {
  return <section className="grid grid-cols-1 gap-5 border-t border-fg-grey-100 px-5 py-6 first:border-t-0 sm:px-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-10">
    <div className="flex flex-col items-start gap-3"><div><h2 className="text-base font-semibold text-fg-black">{title}</h2><p className="mt-1 text-sm leading-6 text-fg-grey-600">{description}</p></div>{action}</div>
    <div className="flex min-w-0 flex-col gap-4">{children}</div>
  </section>;
}

export function SettingsSecurity({ sessions = defaultLoginSessions, apiKeys = defaultApiKeys, className }: SettingsSecurityProps) {
  const [devices, setDevices] = useState(sessions);
  const [keys, setKeys] = useState(apiKeys);
  const [twoFactor, setTwoFactor] = useState(true);
  const [sso, setSso] = useState(false);
  const [changing, setChanging] = useState(false);
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [notice, setNotice] = useState("");
  const strength = [/.{10,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(rule => rule.test(password.next)).length;
  const mismatch = password.confirm.length > 0 && password.confirm !== password.next;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!password.current || strength < 3 || mismatch) return;
    setChanging(false);
    setPassword({ current: "", next: "", confirm: "" });
    setNotice("密码已更新，其他设备需要重新登录");
  }

  return <section className={cn("flex w-full min-w-0 flex-col overflow-hidden rounded-card border border-fg-grey-200 bg-white", className)}>
    {notice && <p role="status" className="bg-fg-green-50 px-5 py-3 text-sm text-fg-green-600 sm:px-6">{notice}</p>}
    <Section title="登录方式" description="密码、两步验证和企业单点登录。开启两步验证后，新设备登录需要手机验证码。">
      <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-fg-grey-50 text-fg-grey-700"><LockKeyholeLinear size={20} /></span><div><p className="text-sm font-semibold text-fg-black">登录密码</p><p className="text-xs text-fg-grey-700">上次修改于 92 天前</p></div></div><Button size="sm" variant="tertiary" onClick={() => setChanging(true)}>修改密码</Button></div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-fg-grey-200 pt-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-fg-grey-50 text-fg-grey-700"><PhoneLinear size={20} /></span><div><div className="flex items-center gap-2 text-sm font-semibold text-fg-black">两步验证{twoFactor && <StatusBadge label="已开启" color="green" variant="soft" />}</div><p className="text-xs text-fg-grey-700">登录新设备时需输入手机验证码 · 138****2026</p></div></div><Toggle color="blue" checked={twoFactor} onChange={setTwoFactor} ariaLabel="两步验证" /></div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-fg-grey-200 pt-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-fg-grey-50 text-fg-grey-700"><KeyboardBoldDuotone size={20} /></span><div><p className="text-sm font-semibold text-fg-black">企业单点登录</p><p className="text-xs text-fg-grey-700">通过飞书或企业微信身份登录工作区</p></div></div><Toggle color="blue" checked={sso} onChange={setSso} ariaLabel="企业单点登录" /></div>
    </Section>
    <Section title="登录设备" description={`当前有 ${devices.length} 台设备登录了你的账号，不认识的设备请立即退出。`} action={<Button size="sm" variant="tertiary" disabled={devices.length < 2} onClick={() => setDevices(current => current.filter(session => session.current))}>退出其他设备</Button>}>
      <ul className="flex flex-col divide-y divide-fg-grey-200">{devices.map(session => <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"><div><div className="flex items-center gap-2 text-sm font-semibold text-fg-black">{session.device}{session.current && <StatusBadge label="当前" color="blue" variant="soft" />}</div><p className="text-xs text-fg-grey-700">{session.location} · {session.lastActive}</p></div>{!session.current && <Button size="sm" variant="unstyled" className="text-sm text-fg-red" onClick={() => setDevices(current => current.filter(item => item.id !== session.id))}>退出</Button>}</li>)}</ul>
    </Section>
    <Section title="API 密钥" description="用于系统集成。密钥只在生成时完整显示一次，请妥善保管。" action={<Button size="sm" variant="tertiary" onClick={() => setKeys(current => [...current, { id: `k-${Date.now()}`, name: "新密钥", prefix: `zx_live_${Math.random().toString(16).slice(2, 6)}`, createdAt: "今天", lastUsed: "从未使用" }])}>生成密钥</Button>}>
      <ul className="flex flex-col divide-y divide-fg-grey-200">{keys.map(key => <li key={key.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"><div><p className="text-sm font-semibold text-fg-black">{key.name}</p><p className="font-mono text-xs text-fg-grey-700">{key.prefix}••••••••</p></div><div className="flex items-center gap-4"><span className="text-xs text-fg-grey-500">创建 {key.createdAt} · 最近使用 {key.lastUsed}</span><Button size="sm" variant="unstyled" className="text-sm text-fg-red" onClick={() => setKeys(current => current.filter(item => item.id !== key.id))}>吊销</Button></div></li>)}</ul>
    </Section>
    <Modal open={changing} onOpenChange={setChanging} title="修改密码">
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <TextField label="当前密码" type="password" shape="pill" value={password.current} onChange={value => setPassword({ ...password, current: value })} autoComplete="current-password" />
        <TextField label="新密码" type="password" shape="pill" value={password.next} onChange={value => setPassword({ ...password, next: value })} autoComplete="new-password" />
        <div className="flex items-center gap-2" aria-label={`密码强度 ${strength}/4`}>{[0, 1, 2, 3].map(index => <span key={index} className={cn("h-1.5 flex-1 rounded-full transition-colors", index < strength ? (strength >= 3 ? "bg-fg-green-500" : "bg-fg-yellow") : "bg-fg-grey-200")} />)}<span className="w-10 text-right text-xs text-fg-grey-700">{["", "弱", "一般", "强", "很强"][strength]}</span></div>
        <TextField label="确认新密码" type="password" shape="pill" value={password.confirm} onChange={value => setPassword({ ...password, confirm: value })} autoComplete="new-password" {...(mismatch ? { state: "error" as const, errorMessage: "两次输入不一致" } : {})} />
        <p className="text-xs text-fg-grey-700">至少 10 位，包含大写字母、数字与符号中的两种以上。</p>
        <div className="flex justify-end gap-3"><Button type="button" variant="tertiary" onClick={() => setChanging(false)}>取消</Button><Button type="submit" disabled={!password.current || strength < 3 || mismatch || !password.confirm}>更新密码</Button></div>
      </form>
    </Modal>
  </section>;
}
