"use client";

import { useState, type FormEvent } from "react";
import { Button, TextField, TextArea } from "@forge-ui/react";
import { CheckCircleBoldDuotone } from "solar-icon-set";
import { SiteHeader } from "../_components/site-header";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvzdlgyd";

type Status = "idle" | "submitting" | "success" | "error";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");

  const emailValid = /^\S+@\S+\.\S+$/.test(email.trim());

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!emailValid) {
      setErrorText("请填写有效的邮箱地址");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorText("");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: email.trim(), message: message.trim() }),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setErrorText(data.error || "提交失败，请稍后再试");
      setStatus("error");
    } catch {
      setErrorText("网络异常，请稍后再试");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen flex-col bg-fg-grey-50">
        <SiteHeader />
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[640px] flex-col items-center justify-center px-6 py-16 text-center">
        <CheckCircleBoldDuotone size={64} color="#10B981" />
        <h1 className="mt-6 font-display text-3xl font-bold tracking-fg text-fg-black">
          已收到你的登记
        </h1>
        <p className="mt-3 text-base text-fg-grey-700">
          Forge 早鸟开放时会第一时间发邮件通知你，
          <br />
          前 50 名可以用 $49.9 拿到 lifetime license（正价 $149）。
        </p>
      </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-fg-grey-50">
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[560px] flex-col justify-center px-6 py-16">
      <div className="mb-10">
        <div className="relative inline-flex">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-4 -top-2 animate-[twinkle_1.5s_ease-in-out_infinite] text-sm"
          >
            ✨
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute -right-5 -bottom-2 animate-[twinkle_1.8s_ease-in-out_infinite] text-base [animation-delay:400ms]"
          >
            ✨
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute -right-3 -top-3 animate-[twinkle_2s_ease-in-out_infinite] text-xs [animation-delay:800ms]"
          >
            ⭐
          </span>
          <span className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 via-pink-500 to-orange-400 px-3 py-1 text-xs font-semibold tracking-fg text-white shadow-sm">
            <span className="size-1.5 rounded-full bg-white" />
            Founder Pricing · 限前 50 名
          </span>
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-fg text-fg-black">
          加入 Forge 早期名单
        </h1>
        <p className="mt-4 text-base leading-relaxed text-fg-grey-700">
          Forge 即将开放付费。留下邮箱，开放时你会第一时间收到通知，用
          <span className="mx-1 font-semibold text-fg-black">$49.9</span>
          锁定 lifetime license（正价 $149），含全部组件、全部 case 页、所有后续更新。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextField
          label="邮箱"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          state={status === "error" && !emailValid ? "error" : "idle"}
          errorMessage={status === "error" && !emailValid ? errorText : undefined}
        />
        <TextArea
          label="留言（可选）"
          placeholder="在做什么产品？希望看到哪些组件 / case 页？"
          value={message}
          onChange={setMessage}
          rows={4}
        />
        {status === "error" && emailValid && errorText && (
          <p className="text-sm text-fg-red">{errorText}</p>
        )}
        <Button
          color="black"
          variant="primary"
          size="lg"
          type="submit"
          disabled={status === "submitting"}
          className="w-full justify-center"
        >
          {status === "submitting" ? "提交中..." : "加入名单"}
        </Button>
        <p className="text-center text-xs text-fg-grey-700">
          我们不会发送垃圾邮件，只在 Forge 开放购买时通知你一次。
        </p>
      </form>
      </main>
    </div>
  );
}
