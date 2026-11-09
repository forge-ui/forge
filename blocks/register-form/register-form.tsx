"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, type FormEvent } from "react";
import { Button, Checkbox, TextField, cn } from "@forge-ui-official/core";
import { EyeClosedLinear, EyeLinear, LockKeyholeLinear, MailboxLinear, UserLinear } from "@forge-ui-official/core/icons";

export interface RegisterValue {
  name: string;
  company: string;
  email: string;
  password: string;
}

export interface RegisterFormProps {
  productName?: string;
  image?: string;
  providers?: { id: string; label: string; icon: string }[];
  onSubmit?: (value: RegisterValue) => void;
  onProvider?: (providerId: string) => void;
  onLogin?: () => void;
  className?: string;
}

const defaultProviders = [
  { id: "google", label: "使用 Google 注册", icon: "/images/brands/google.svg" },
  { id: "apple", label: "使用 Apple 注册", icon: "/images/brands/apple.svg" },
];

export function RegisterForm({ productName = "知行科技工作台", image = "/images/blocks/auth-workspace.jpg", providers = defaultProviders, onSubmit, onProvider, onLogin, className }: RegisterFormProps) {
  const [value, setValue] = useState<RegisterValue>({ name: "", company: "", email: "", password: "" });
  const [agreed, setAgreed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);
  const errors = {
    name: !value.name.trim() ? "请填写姓名" : "",
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) ? "请填写有效的工作邮箱" : "",
    password: value.password.length < 8 ? "密码至少 8 位" : "",
  };
  const invalid = Object.values(errors).some(Boolean) || !agreed;
  const field = (key: keyof typeof errors) => touched && errors[key] ? { state: "error" as const, errorMessage: errors[key] } : {};
  const update = (key: keyof RegisterValue) => (next: string) => setValue(current => ({ ...current, [key]: next }));

  function submit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (invalid) return;
    onSubmit?.(value);
    setDone(true);
  }

  return <div className={cn("mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 rounded-card bg-white p-4 sm:p-6 lg:grid-cols-2", className)}>
    <img src={image} alt="" className="hidden h-full max-h-[640px] w-full rounded-card object-cover lg:block" />
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 py-6">
      <div className="text-center"><h1 className="text-2xl font-semibold text-fg-black">欢迎加入{productName}</h1><p className="mt-2 text-sm text-fg-grey-700">创建账号，三分钟开始管理你的业务。</p></div>
      {done ? <div role="status" className="flex flex-col gap-3 rounded-card bg-fg-green-50 p-6 text-center"><p className="text-base font-semibold text-fg-green-600">注册成功</p><p className="text-sm text-fg-grey-700">验证邮件已发送到 {value.email}，请在 24 小时内完成验证。</p><Button variant="tertiary" onClick={onLogin}>去登录</Button></div> : <>
        <div className="flex flex-col gap-3">{providers.map(provider => <Button key={provider.id} variant="tertiary" className="w-full" iconLeft={<img src={provider.icon} alt="" className="size-4" />} onClick={() => onProvider?.(provider.id)}>{provider.label}</Button>)}</div>
        <div className="flex items-center gap-3 text-xs text-fg-grey-500"><span className="h-px flex-1 bg-fg-grey-200" />或使用邮箱<span className="h-px flex-1 bg-fg-grey-200" /></div>
        <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="姓名" shape="pill" iconLeft={<UserLinear size={16} />} value={value.name} onChange={update("name")} placeholder="张宁" autoComplete="name" {...field("name")} />
            <TextField label="公司" shape="pill" value={value.company} onChange={update("company")} placeholder="选填" autoComplete="organization" />
          </div>
          <TextField label="工作邮箱" type="email" shape="pill" iconLeft={<MailboxLinear size={16} />} value={value.email} onChange={update("email")} placeholder="name@company.com" autoComplete="email" {...field("email")} />
          <TextField label="密码" type={visible ? "text" : "password"} shape="pill" iconLeft={<LockKeyholeLinear size={16} />} iconRight={<Button variant="unstyled" type="button" aria-label={visible ? "隐藏密码" : "显示密码"} className="text-fg-grey-700" onClick={() => setVisible(current => !current)}>{visible ? <EyeClosedLinear size={16} /> : <EyeLinear size={16} />}</Button>} value={value.password} onChange={update("password")} placeholder="至少 8 位" autoComplete="new-password" {...field("password")} />
          <label className="flex items-center gap-2 text-sm text-fg-grey-700"><Checkbox color="blue" checked={agreed} onChange={setAgreed} />我已阅读并同意《服务协议》和《隐私政策》</label>
          {touched && !agreed && <p className="-mt-2 text-xs text-fg-red">请先同意服务协议</p>}
          <Button type="submit" className="w-full">注册</Button>
        </form>
        <p className="text-center text-sm text-fg-grey-700">已有账号？<Button variant="unstyled" type="button" className="font-semibold text-fg-blue" onClick={onLogin}>直接登录</Button></p>
      </>}
    </div>
  </div>;
}
