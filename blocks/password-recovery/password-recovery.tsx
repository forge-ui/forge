"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, type FormEvent } from "react";
import { Button, OtpInput, TextField, cn } from "@forge-ui-official/core";
import { CheckCircleBold, LockKeyholeLinear, MailboxLinear } from "@forge-ui-official/core/icons";

export interface PasswordRecoveryProps {
  image?: string;
  defaultEmail?: string;
  onSendCode?: (email: string) => void;
  onReset?: (payload: { email: string; code: string; password: string }) => void;
  onBack?: () => void;
  className?: string;
}

type Step = "email" | "reset" | "done";

export function PasswordRecovery({ image = "/images/blocks/auth-workspace.jpg", defaultEmail = "", onSendCode, onReset, onBack, className }: PasswordRecoveryProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState(false);
  const emailError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "请填写注册时使用的邮箱" : "";
  const resetErrors = { code: code.length < 6 ? "请输入 6 位验证码" : "", password: password.length < 8 ? "新密码至少 8 位" : "", confirm: confirm !== password ? "两次输入的密码不一致" : "" };

  function sendCode(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (emailError) return;
    onSendCode?.(email);
    setTouched(false);
    setStep("reset");
  }

  function reset(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (Object.values(resetErrors).some(Boolean)) return;
    onReset?.({ email, code, password });
    setStep("done");
  }

  const copy: Record<Step, { title: string; subtitle: string }> = {
    email: { title: "找回密码", subtitle: "输入注册时使用的邮箱，我们会发送 6 位验证码。" },
    reset: { title: "设置新密码", subtitle: `验证码已发送至 ${email}，10 分钟内有效。` },
    done: { title: "密码已重置", subtitle: "请使用新密码重新登录。" },
  };

  return <div className={cn("mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 rounded-card bg-white p-4 sm:p-6 lg:grid-cols-2", className)}>
    <img src={image} alt="" className="hidden h-full max-h-[560px] w-full rounded-card object-cover lg:block" />
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 py-6">
      <ol className="flex items-center gap-2" aria-label="找回进度">{(["email", "reset", "done"] as Step[]).map((item, index) => <li key={item} className={cn("h-1.5 flex-1 rounded-full", (["email", "reset", "done"] as Step[]).indexOf(step) >= index ? "bg-fg-blue" : "bg-fg-grey-200")} />)}</ol>
      <div className="text-center">{step === "done" && <CheckCircleBold size={48} className="mx-auto mb-3 text-fg-green-500" />}<h1 className="text-2xl font-semibold text-fg-black">{copy[step].title}</h1><p className="mt-2 text-sm leading-6 text-fg-grey-700">{copy[step].subtitle}</p></div>
      {step === "email" && <form className="flex flex-col gap-4" onSubmit={sendCode} noValidate>
        <TextField label="邮箱" type="email" shape="pill" iconLeft={<MailboxLinear size={16} />} value={email} onChange={setEmail} placeholder="name@company.com" autoComplete="email" {...(touched && emailError ? { state: "error" as const, errorMessage: emailError } : {})} />
        <Button type="submit" className="w-full">发送验证码</Button>
      </form>}
      {step === "reset" && <form className="flex flex-col gap-4" onSubmit={reset} noValidate>
        <div className="flex flex-col gap-2"><span className="text-sm font-medium text-fg-black">验证码</span><OtpInput length={6} value={code} onChange={setCode} />{touched && resetErrors.code && <p className="text-xs text-fg-red">{resetErrors.code}</p>}</div>
        <TextField label="新密码" type="password" shape="pill" iconLeft={<LockKeyholeLinear size={16} />} value={password} onChange={setPassword} placeholder="至少 8 位" autoComplete="new-password" {...(touched && resetErrors.password ? { state: "error" as const, errorMessage: resetErrors.password } : {})} />
        <TextField label="确认新密码" type="password" shape="pill" iconLeft={<LockKeyholeLinear size={16} />} value={confirm} onChange={setConfirm} autoComplete="new-password" {...(touched && resetErrors.confirm ? { state: "error" as const, errorMessage: resetErrors.confirm } : {})} />
        <Button type="submit" className="w-full">重置密码</Button>
        <Button variant="unstyled" type="button" className="text-sm font-semibold text-fg-blue" onClick={() => { setStep("email"); setCode(""); setTouched(false); }}>没收到？重新发送</Button>
      </form>}
      {step === "done" && <Button className="w-full" onClick={onBack}>返回登录</Button>}
      {step !== "done" && <p className="text-center text-sm text-fg-grey-700">想起密码了？<Button variant="unstyled" type="button" className="font-semibold text-fg-blue" onClick={onBack}>返回登录</Button></p>}
    </div>
  </div>;
}
