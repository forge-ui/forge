"use client";

import { useState } from "react";
import { Breadcrumbs, Button, PageTitleToolbar, StatusBadge, TabBar, TextField, Toggle } from "@forge-ui-official/core";
import { CopyLinear } from "@forge-ui-official/core/icons";

export interface ProviderField {
  key: string;
  label: string;
  secret?: boolean;
  placeholder?: string;
  hint?: string;
}

export interface ProviderConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  fields: ProviderField[];
  values: Record<string, string>;
  callback?: string;
}

export interface ProviderGroup {
  id: string;
  label: string;
  providers: ProviderConfig[];
}

export const defaultProviderGroups: ProviderGroup[] = [
  { id: "auth", label: "登录方式", providers: [
    { id: "wechat", name: "微信扫码登录", description: "在微信开放平台创建网站应用后获得 AppID 与 AppSecret。", enabled: true, fields: [{ key: "appId", label: "AppID", placeholder: "wx 开头的 18 位" }, { key: "secret", label: "AppSecret", secret: true }], values: { appId: "wx8f3c2a91d0e7b6c4", secret: "••••••••••••••••" }, callback: "https://admin.zhixing.cn/api/auth/callback/wechat" },
    { id: "wecom", name: "企业微信", description: "员工用企业微信扫码登录后台，账号按企业通讯录自动匹配。", enabled: false, fields: [{ key: "corpId", label: "企业 ID" }, { key: "agentId", label: "应用 AgentId" }, { key: "secret", label: "应用 Secret", secret: true }], values: {}, callback: "https://admin.zhixing.cn/api/auth/callback/wecom" },
    { id: "email", name: "邮箱密码登录", description: "保留账号密码登录，作为扫码不可用时的备用方式。", enabled: true, fields: [], values: {} },
  ] },
  { id: "payment", label: "支付", providers: [
    { id: "wxpay", name: "微信支付", description: "用于商城订单和会员续费，使用 APIv3 接口。", enabled: true, fields: [{ key: "mchId", label: "商户号" }, { key: "serial", label: "证书序列号" }, { key: "apiKey", label: "APIv3 密钥", secret: true, hint: "32 位，在商户平台「API 安全」中设置" }], values: { mchId: "1658203741", serial: "5B6A2E0C91F3D7A4", apiKey: "••••••••••••••••" }, callback: "https://admin.zhixing.cn/api/pay/notify/wxpay" },
    { id: "alipay", name: "支付宝", description: "电脑网站支付与手机网站支付共用同一个应用。", enabled: false, fields: [{ key: "appId", label: "应用 AppID" }, { key: "privateKey", label: "应用私钥", secret: true }], values: {}, callback: "https://admin.zhixing.cn/api/pay/notify/alipay" },
  ] },
  { id: "email", label: "邮件", providers: [
    { id: "smtp", name: "SMTP 发信", description: "注册验证、找回密码和账单提醒都通过这里发出。", enabled: true, fields: [{ key: "host", label: "服务器地址" }, { key: "port", label: "端口" }, { key: "user", label: "发信账号" }, { key: "password", label: "授权码", secret: true }, { key: "from", label: "发件人名称" }], values: { host: "smtp.exmail.qq.com", port: "465", user: "noreply@zhixing.cn", password: "••••••••", from: "知行科技" } },
  ] },
  { id: "storage", label: "存储", providers: [
    { id: "oss", name: "阿里云 OSS", description: "商品图片、发票与附件统一存到对象存储，前台通过 CDN 访问。", enabled: true, fields: [{ key: "endpoint", label: "Endpoint" }, { key: "bucket", label: "Bucket" }, { key: "accessKey", label: "AccessKey ID" }, { key: "secret", label: "AccessKey Secret", secret: true }], values: { endpoint: "oss-cn-shanghai.aliyuncs.com", bucket: "zhixing-assets", accessKey: "LTAI5tQ8xR2mN6", secret: "••••••••••••" } },
  ] },
];

function ProviderCard({ provider, onChange }: { provider: ProviderConfig; onChange: (next: ProviderConfig) => void }) {
  const [state, setState] = useState<"idle" | "saved" | "tested" | "missing">("idle");
  const [copied, setCopied] = useState(false);
  const missing = provider.fields.filter(field => !provider.values[field.key]?.trim());
  return <section className="overflow-hidden rounded-2xl border border-fg-grey-200 bg-white">
    <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-semibold text-fg-black">{provider.name}</h2>{provider.enabled ? <StatusBadge label="已启用" color="green" /> : <StatusBadge label="未启用" color="grey" />}</div>
          <Toggle color="blue" checked={provider.enabled} ariaLabel={`启用${provider.name}`} onChange={enabled => { onChange({ ...provider, enabled }); setState("idle"); }} />
        </div>
        <p className="text-sm leading-6 text-fg-grey-600">{provider.description}</p>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        {!provider.enabled ? <div className="flex h-full min-h-24 items-center rounded-xl border border-dashed border-fg-grey-200 px-4 text-sm text-fg-grey-500">打开开关后填写{provider.fields.length ? ` ${provider.fields.map(field => field.label).join("、")}` : "配置"}。</div>
          : !provider.fields.length ? <div className="flex h-full min-h-24 items-center rounded-xl bg-fg-grey-50 px-4 text-sm text-fg-grey-600">无需额外配置，开启后登录页即显示该方式。</div>
          : <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {provider.fields.map(field => <div key={field.key} className="flex flex-col gap-1.5">
                <TextField color="blue" inputClassName="h-6" label={field.label} type={field.secret ? "password" : "text"} placeholder={field.placeholder} value={provider.values[field.key] ?? ""} state={state === "missing" && !provider.values[field.key]?.trim() ? "error" : "idle"} errorMessage="必填" onChange={value => { onChange({ ...provider, values: { ...provider.values, [field.key]: value } }); setState("idle"); }} />
                {field.hint ? <p className="text-xs text-fg-grey-500">{field.hint}</p> : null}
              </div>)}
            </div>
            {provider.callback ? <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-fg-black">回调地址</span>
              <div className="flex items-center gap-2 rounded-xl bg-fg-grey-50 px-3 py-2.5"><code className="min-w-0 flex-1 truncate text-xs text-fg-grey-800">{provider.callback}</code><button type="button" onClick={() => { void navigator.clipboard?.writeText(provider.callback!); setCopied(true); }} className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-fg-blue"><CopyLinear size={14} />{copied ? "已复制" : "复制"}</button></div>
              <p className="text-xs text-fg-grey-500">填到服务商后台的授权回调或支付通知地址里。</p>
            </div> : null}
          </>}
      </div>
    </div>
    {provider.enabled && provider.fields.length ? <div className="flex flex-wrap items-center justify-between gap-3 border-t border-fg-grey-100 bg-fg-grey-50 px-5 py-3 sm:px-6">
      <span className={`text-xs ${state === "missing" ? "text-fg-red" : "text-fg-grey-500"}`}>{state === "missing" ? `还有 ${missing.length} 项未填写` : state === "saved" ? "已保存，新配置立即生效" : state === "tested" ? "连接正常" : "密钥加密保存，保存后不再明文显示"}</span>
      <div className="flex gap-2">
        <Button color="blue" variant="tertiary" size="sm" onClick={() => setState(missing.length ? "missing" : "tested")}>测试连接</Button>
        <Button color="blue" size="sm" onClick={() => setState(missing.length ? "missing" : "saved")}>保存</Button>
      </div>
    </div> : null}
  </section>;
}

export interface ProviderSettingsFormProps {
  groups?: ProviderGroup[];
  className?: string;
}

export function ProviderSettingsForm({ groups: initialGroups = defaultProviderGroups, className = "" }: ProviderSettingsFormProps) {
  const [groups, setGroups] = useState(initialGroups);
  const [tab, setTab] = useState(0);
  const group = groups[tab];
  const update = (next: ProviderConfig) => setGroups(current => current.map((entry, index) => index === tab ? { ...entry, providers: entry.providers.map(provider => provider.id === next.id ? next : provider) } : entry));

  return <div className={`flex min-w-0 flex-col gap-5 ${className}`}>
    <PageTitleToolbar title="服务配置" subtitle="登录、支付、邮件与存储的第三方服务。每个服务单独启用、单独保存。" breadcrumbs={<Breadcrumbs color="blue" items={[{ label: "设置", href: "#settings" }, { label: "服务配置" }]} />} />
    <div className="border-b border-fg-grey-200"><TabBar color="blue" tabs={groups.map((entry, index) => ({ label: entry.label, active: index === tab, badge: entry.providers.filter(provider => provider.enabled).length }))} onChange={setTab} /></div>
    <div className="flex flex-col gap-5">
      {group.providers.map(provider => <ProviderCard key={provider.id} provider={provider} onChange={update} />)}
    </div>
  </div>;
}
