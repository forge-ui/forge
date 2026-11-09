"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, type FormEvent } from "react";
import { Button, ButtonGroup, Checkbox, OtpInput, TextField, cn } from "@forge-ui-official/core";
import { EyeClosedLinear, EyeLinear, LockKeyholeLinear, MailboxLinear, PhoneLinear } from "@forge-ui-official/core/icons";

export interface LoginFormProps {
  productName?: string;
  image?: string;
  onLogin?: (payload: { method: "password" | "code"; account: string; secret: string; remember: boolean }) => Promise<void> | void;
  onSso?: (provider: string) => void;
  onForgot?: () => void;
  onRegister?: () => void;
  className?: string;
}

export function LoginForm({ productName = "知行科技工作台", image = "/images/blocks/auth-workspace.jpg", onLogin, onSso, onForgot, onRegister, className }: LoginFormProps) {
  const [method, setMethod] = useState(0);
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [visible, setVisible] = useState(false);
  const [remember, setRemember] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const accountValid = method === 0 ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account) : /^1\d{10}$/.test(account.replace(/\s/g, ""));
  const secret = method === 0 ? password : code;
  const ready = accountValid && (method === 0 ? password.length >= 8 : code.length === 6);

  function sendCode() {
    setCountdown(60);
    const timer = window.setInterval(() => setCountdown(current => { if (current <= 1) { window.clearInterval(timer); return 0; } return current - 1; }), 1000);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!ready) return;
    setStatus("loading");
    try {
      await onLogin?.({ method: method === 0 ? "password" : "code", account, secret, remember });
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return <div className={cn("mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 rounded-card bg-white p-4 sm:p-6 lg:grid-cols-2", className)}>
    <img src={image} alt="" className="hidden h-full max-h-[600px] w-full rounded-card object-cover lg:block" />
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 py-6">
      <div className="text-center"><h1 className="text-2xl font-semibold text-fg-black">欢迎回来</h1><p className="mt-2 text-sm text-fg-grey-700">登录{productName}继续工作</p></div>
      <ButtonGroup ariaLabel="登录方式" shape="pill" className="self-center" items={[{ label: "邮箱密码" }, { label: "手机验证码" }]} activeIndex={method} onChange={index => { setMethod(index); setAccount(""); setStatus("idle"); }} />
      <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
        {method === 0 ? <>
          <TextField label="工作邮箱" type="email" shape="pill" iconLeft={<MailboxLinear size={16} />} value={account} onChange={setAccount} placeholder="name@company.com" autoComplete="email" />
          <TextField label="密码" type={visible ? "text" : "password"} shape="pill" iconLeft={<LockKeyholeLinear size={16} />} iconRight={<Button variant="unstyled" type="button" aria-label={visible ? "隐藏密码" : "显示密码"} className="text-fg-grey-700" onClick={() => setVisible(current => !current)}>{visible ? <EyeClosedLinear size={16} /> : <EyeLinear size={16} />}</Button>} value={password} onChange={setPassword} autoComplete="current-password" headerAction={<Button variant="unstyled" type="button" className="text-xs font-semibold text-fg-blue" onClick={onForgot}>忘记密码？</Button>} />
        </> : <>
          <TextField label="手机号" type="tel" shape="pill" iconLeft={<PhoneLinear size={16} />} value={account} onChange={setAccount} placeholder="138 0000 0000" autoComplete="tel" />
          <div className="flex flex-col gap-2"><div className="flex items-center justify-between"><span className="text-sm font-medium text-fg-grey-700">验证码</span><Button variant="unstyled" type="button" className="text-xs font-semibold text-fg-blue disabled:text-fg-grey-500" disabled={!accountValid || countdown > 0} onClick={sendCode}>{countdown > 0 ? `${countdown} 秒后重发` : "获取验证码"}</Button></div><OtpInput length={6} value={code} onChange={setCode} /></div>
        </>}
        <label className="flex items-center gap-2 text-sm text-fg-grey-700"><Checkbox color="blue" checked={remember} onChange={setRemember} />30 天内保持登录</label>
        {status === "error" && <p role="alert" className="rounded-xl bg-fg-red-50 px-4 py-3 text-sm text-fg-red">账号或密码不正确，请重试。</p>}
        <Button type="submit" className="w-full" disabled={!ready || status === "loading"}>{status === "loading" ? "登录中…" : "登录"}</Button>
      </form>
      <div className="flex items-center gap-3 text-xs text-fg-grey-500"><span className="h-px flex-1 bg-fg-grey-200" />企业账号<span className="h-px flex-1 bg-fg-grey-200" /></div>
      <div className="grid grid-cols-2 gap-3"><Button variant="tertiary" onClick={() => onSso?.("feishu")}>飞书登录</Button><Button variant="tertiary" onClick={() => onSso?.("wecom")}>企业微信登录</Button></div>
      <p className="text-center text-sm text-fg-grey-700">还没有账号？<Button variant="unstyled" type="button" className="font-semibold text-fg-blue" onClick={onRegister}>免费注册</Button></p>
    </div>
  </div>;
}
