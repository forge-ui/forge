"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button, IconButton, ProgressBar, SurfaceCard, TextField, Tooltip } from "@forge-ui-official/core";
import { ArrowRightLinear, BellLinear, BookmarkLinear, CheckCircleLinear, CopyLinear, DownloadLinear, HeartLinear, HeartBoldDuotone, LetterLinear, LockKeyholeLinear, MinusSquareLinear, PlainLinear, PlayBoldDuotone, PlusLinear, PauseLinear, RefreshLinear } from "@forge-ui-official/core/icons";
import type { FusionExampleProps } from "./types";
import { ActionHint, ActionStage, useActionTimers } from "./actions-shared";

export function AsyncActionExample(settings: FusionExampleProps) {
  const { id, locale, color, motion } = settings;
  const en = locale === "en";
  const [{ state, progress }, setJob] = useState({ state: "idle", progress: 0 });
  const { later, clear } = useActionTimers();
  useEffect(() => {
    if (state !== "loading") return;
    const timer = setInterval(() => setJob(previous => {
      const next = Math.min(100, previous.progress + 5);
      return { progress: next, state: next === 100 ? "done" : "loading" };
    }), 80);
    return () => clearInterval(timer);
  }, [state]);
  const start = () => { clear(); setJob({ state: id === "005" ? "sending" : "loading", progress: 0 }); if (id === "005") later(() => setJob({ state: "loading", progress: 0 }), motion === "none" ? 0 : 600); };
  const reset = () => { clear(); setJob({ state: "idle", progress: 0 }); };
  const complete = state === "done";
  const busy = state === "loading" || state === "sending";
  const label = id === "001" ? (en ? "Confirm changes" : "确认更改") : id === "004" ? (en ? "Download report" : "下载报告") : id === "005" ? (en ? "Send message" : "发送消息") : (en ? "Pay ¥128" : "支付 ¥128");
  return <ActionStage settings={settings} className={id === "001" ? "fusion-glass-scene" : ""}>
    {id === "001" && <div className="fusion-glass-decoration" aria-hidden><i /><i /><i /></div>}
    {id === "005" ? <IconButton color={color} size="lg" effect="send" aria-label={label} motion={motion} loading={state === "loading"} disabled={state === "sending"} result={complete ? "success" : "idle"} onClick={start}><PlainLinear size={22} /></IconButton> : <Button color={color} motion={motion} effect={id === "001" ? "glass" : undefined} loading={busy} progress={id === "004" && busy ? progress : undefined} loadingLabel={id === "004" ? `${progress}%` : undefined} result={complete ? "success" : "idle"} resultLabel={en ? "Completed" : "已完成"} locale={locale} iconLeft={id === "004" ? <DownloadLinear size={18} /> : undefined} onClick={complete ? reset : start}>{label}</Button>}
    {id === "081" && (busy || complete) && <><ProgressBar variant="ring" value={progress} color={color} motion={motion} label={en ? "Payment progress" : "支付进度"}>{complete ? <CheckCircleLinear size={26} /> : `${progress}%`}</ProgressBar><div className="fusion-action-steps">{(en ? ["Verify", "Authorize", "Receipt"] : ["验证", "授权", "回执"]).map((step, index) => <span key={step} data-complete={progress >= (index + 1) * 30}>{step}</span>)}</div>{complete && <SurfaceCard padding="sm" className="w-full"><p className="text-sm font-semibold">{en ? "Receipt #FG-2026" : "支付回执 #FG-2026"}</p><p className="text-xs text-fg-grey-700">¥128 · {en ? "Payment complete" : "支付完成"}</p></SurfaceCard>}</>}
    <ActionHint>{busy ? (en ? "Processing your request…" : "正在处理请求…") : complete ? (en ? "Finished just now" : "刚刚完成") : id === "001" ? (en ? "The scene behind the button is demonstration only" : "按钮背后的装饰仅用于演示") : (en ? "Ready when you are" : "准备就绪")}</ActionHint>
    {(busy || complete) && <Button color={color} variant="tertiary" size="sm" onClick={() => { reset(); }}>{busy ? (en ? "Cancel" : "取消") : (en ? "Try again" : "再试一次")}</Button>}
  </ActionStage>;
}

export function MagneticExample(settings: FusionExampleProps) {
  const [created, setCreated] = useState(false);
  const { locale, color, motion } = settings;
  const en = locale === "en";
  return <ActionStage settings={settings}><Button effect="magnetic" color={color} motion={motion} iconRight={<ArrowRightLinear size={20} />} onClick={() => setCreated(value => !value)}>{created ? (en ? "Open project" : "打开项目") : (en ? "Create project" : "创建项目")}</Button><ActionHint>{created ? (en ? "Project workspace is ready" : "项目工作区已准备好") : (en ? "Move the pointer, then press" : "移动指针，再点击按钮")}</ActionHint></ActionStage>;
}

export function ToggleActionExample(settings: FusionExampleProps) {
  const { id, locale, color, motion } = settings;
  const en = locale === "en";
  const [active, setActive] = useState(false);
  const [hover, setHover] = useState(false);
  const count = (id === "006" ? 1248 : id === "012" ? 23 : 128) + Number(active);
  const label = id === "006" ? active ? (en ? "Subscribed" : "已订阅") : (en ? "Subscribe" : "订阅") : id === "012" ? active ? (en ? "Saved" : "已收藏") : (en ? "Save article" : "收藏文章") : active ? (en ? "Liked" : "已点赞") : (en ? "Like" : "点赞");
  return <ActionStage settings={settings}>
    {id === "006" ? <Button color={color} effect="ripple" variant={active ? "secondary" : "primary"} motion={motion} aria-pressed={active} iconLeft={<BellLinear size={18} />} onClick={() => setActive(value => !value)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>{active && hover ? (en ? "Unsubscribe" : "取消订阅") : label}</Button> : <IconButton color={color} effect={id === "012" ? "bookmark" : "burst"} variant={active ? "primary" : "secondary"} active={active} aria-label={label} motion={motion} size="lg" onClick={() => setActive(value => !value)}>{id === "012" ? <BookmarkLinear size={22} /> : active ? <HeartBoldDuotone size={22} /> : <HeartLinear size={22} />}</IconButton>}
    <div className="fusion-rolling-count" key={count}>{count.toLocaleString(en ? "en-US" : "zh-CN")}</div><ActionHint>{label}</ActionHint>
  </ActionStage>;
}

export function PlaybackExample(settings: FusionExampleProps) {
  const { locale, color, motion } = settings;
  const en = locale === "en";
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  useEffect(() => { if (!playing) return; const timer = setInterval(() => setPosition(value => value >= 100 ? 0 : value + 1), 180); return () => clearInterval(timer); }, [playing]);
  return <ActionStage settings={settings}><SurfaceCard className="w-full" title={en ? "Sound sketch" : "声音草稿"} subtitle={en ? "Playback interaction preview" : "播放交互预览"}><div className="flex items-center gap-5"><IconButton color={color} effect="morph" motion={motion} active={playing} aria-label={playing ? (en ? "Pause" : "暂停") : (en ? "Play" : "播放")} progress={position} size="lg" onClick={() => setPlaying(value => !value)}>{playing ? <PauseLinear size={20} /> : <PlayBoldDuotone size={20} />}</IconButton><div className="fusion-waveform">{Array.from({ length: 24 }, (_, i) => <i key={i} data-active={i / 24 * 100 <= position} style={{ height: `${10 + ((i * 17 + 5) % 28)}px` }} />)}<input aria-label={en ? "Playback position" : "播放位置"} type="range" min="0" max="100" value={position} onChange={event => setPosition(Number(event.target.value))} /></div></div><ActionHint>{playing ? (en ? "Playing" : "播放中") : (en ? "Paused" : "已暂停")} · {Math.round(position)}%</ActionHint></SurfaceCard></ActionStage>;
}

export function CopyExample(settings: FusionExampleProps) {
  const { locale, color, motion } = settings;
  const en = locale === "en";
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const { later, clear } = useActionTimers();
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const command = "pnpm add @forge-ui-official/core";
  const copy = async () => { clear(); try { await navigator.clipboard.writeText(command); if (mounted.current) setStatus("success"); } catch { if (mounted.current) setStatus("error"); } if (mounted.current) later(() => setStatus("idle"), 2400); };
  return <ActionStage settings={settings}><div className="fusion-copy-command" data-copied={status === "success"}><code>{command}</code><Tooltip content={status === "success" ? (en ? "Copied" : "已复制") : (en ? "Copy command" : "复制命令")} motion={motion}><IconButton color={color} variant="ghost" motion={motion} aria-label={en ? "Copy command" : "复制命令"} result={status} effect="morph" onClick={copy}><CopyLinear size={20} /></IconButton></Tooltip></div><ActionHint>{status === "error" ? (en ? "Clipboard access failed. Select and copy the command." : "剪贴板访问失败，请选择命令手动复制。") : status === "success" ? (en ? "Command copied" : "安装命令已复制") : (en ? "Install Forge in your project" : "在项目中安装 Forge")}</ActionHint></ActionStage>;
}

export function RollingExample(settings: FusionExampleProps) {
  const [selected, setSelected] = useState(false);
  const en = settings.locale === "en";
  return <ActionStage settings={settings}><Button color={settings.color} motion={settings.motion} effect="roll" iconRight={<ArrowRightLinear size={18} />} onClick={() => setSelected(value => !value)}>{selected ? (en ? "Selected work" : "已选择作品") : (en ? "Explore our work" : "浏览精选作品")}</Button><ActionHint>{en ? "Hover or focus to roll the label" : "悬停或聚焦，文字依次滚动"}</ActionHint></ActionStage>;
}

export function QuantityExample(settings: FusionExampleProps) {
  const [count, setCount] = useState(1);
  const en = settings.locale === "en";
  return <ActionStage settings={settings}><SurfaceCard title={en ? "Workspace seats" : "工作区席位"} className="w-full"><div className="flex items-center justify-between gap-4"><IconButton color={settings.color} variant="secondary" disabled={count === 1} aria-label={en ? "Decrease quantity" : "减少数量"} onClick={() => setCount(value => value - 1)}><MinusSquareLinear size={20} /></IconButton><output className="fusion-rolling-count" key={count} aria-label={en ? "Quantity" : "数量"}>{count}</output><IconButton color={settings.color} variant="secondary" disabled={count === 10} aria-label={en ? "Increase quantity" : "增加数量"} onClick={() => setCount(value => value + 1)}><PlusLinear size={20} /></IconButton></div><ActionHint>{en ? "Total" : "合计"} ¥{count * 39} · {en ? "1–10 seats" : "1–10 个席位"}</ActionHint></SurfaceCard></ActionStage>;
}

export function SocialExample(settings: FusionExampleProps) {
  const { locale, color, motion } = settings;
  const en = locale === "en";
  const [provider, setProvider] = useState<"Kakao" | "Google" | "Apple" | "email" | null>(null);
  const [state, setState] = useState<"idle" | "connecting" | "connected" | "sent">("idle");
  const [email, setEmail] = useState("");
  const [continued, setContinued] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const { later, clear } = useActionTimers();
  const providers = [
    { name: "Kakao" as const, account: "lin.xiao@example.com", image: "/images/brands/kakao.svg" },
    { name: "Google" as const, account: "lin@example.com", image: "/images/brands/google.svg" },
    { name: "Apple" as const, account: "l.xiao@example.com", image: "/images/brands/apple.svg" },
  ];
  const connecting = state === "connecting";
  const connected = state === "connected";
  const reset = () => {
    const previous = provider;
    clear(); setProvider(null); setState("idle"); setContinued(false);
    later(() => panel.current?.querySelector<HTMLButtonElement>(`button[data-provider="${previous === "email" ? "Google" : previous}"]`)?.focus(), 0);
  };
  const choose = (name: "Kakao" | "Google" | "Apple") => {
    if (connecting) return;
    if (connected) { setContinued(true); return; }
    clear(); setProvider(name); setState("connecting");
    const reduced = motion === "none" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    later(() => setState("connected"), reduced ? 300 : 1500);
  };
  return <ActionStage settings={settings}><SurfaceCard padding="lg" className="fusion-social-card w-full">
    <div ref={panel} className="fusion-social-panel" data-picked={provider !== null}>
      <h3 className="text-xl font-semibold text-fg-black">{en ? "Ready to start?" : "准备好开始了吗？"}</h3>
      <p className="text-sm text-fg-grey-700 mt-1 mb-5">{en ? "Use an account you already have" : "使用已有账号，快速进入工作区"}</p>
      <div className="fusion-social-list">
        {providers.map((item, index) => {
          const hidden = provider !== null && provider !== item.name;
          const selected = provider === item.name;
          return <div key={item.name} className="fusion-social-slot" data-hidden={hidden} aria-hidden={hidden || undefined} inert={hidden || undefined} style={{ transitionDelay: `${motion === "none" ? 0 : index * 35}ms` }}><div>
            <Button color={item.name === "Apple" ? "black" : "grey"} variant={item.name === "Apple" ? "primary" : "tertiary"} motion={motion} className="fusion-social-provider" data-provider={item.name} data-connected={selected && connected} aria-busy={selected && connecting || undefined} disabled={selected && connecting} iconLeft={<Image src={item.image} alt="" width={22} height={22} />} iconRight={selected && connecting ? <RefreshLinear size={20} className="forge-action-spinner" /> : selected && connected ? <CheckCircleLinear size={20} /> : undefined} onClick={() => choose(item.name)}>
              <span className="fusion-social-copy"><span>{selected && connected ? (en ? "Continue as Lin Xiao" : "以林晓的身份继续") : en ? `Continue with ${item.name}` : `使用 ${item.name} 继续`}</span>{selected && connected ? <small>{item.account}</small> : item.name === "Google" && !selected ? <small>{en ? "Last used" : "上次使用"}</small> : null}</span>
            </Button>
          </div></div>;
        })}
      </div>
      <p className="fusion-social-message" role="status">{continued ? (en ? "Welcome back, Lin Xiao" : "欢迎回来，林晓") : connecting ? (en ? `Connecting to ${provider}…` : `正在连接 ${provider}…`) : connected ? (en ? `${provider} account connected` : `${provider} 账号已连接`) : state === "sent" ? (en ? `Check your inbox: ${email}` : `请查看收件箱：${email}`) : ""}</p>
      <div className="fusion-social-email-entry" data-hidden={provider !== null} aria-hidden={provider !== null || undefined} inert={provider !== null || undefined}><div><div className="fusion-social-divider"><span>{en ? "or" : "或"}</span></div><Button color={color} variant="secondary" motion={motion} className="w-full" iconLeft={<LetterLinear size={18} />} onClick={() => { clear(); setProvider("email"); setState("idle"); }}>{en ? "Continue with email" : "使用邮箱继续"}</Button></div></div>
      {provider === "email" && <form className="fusion-social-email-form" onSubmit={event => { event.preventDefault(); setState("sent"); }}><TextField type="email" label={en ? "Email address" : "邮箱地址"} value={email} onChange={setEmail} placeholder="name@example.com" color={color} autoFocus required /><Button color={color} motion={motion} type="submit" disabled={!email || state === "sent"} iconRight={<ArrowRightLinear size={18} />}>{state === "sent" ? (en ? "Link requested" : "已请求登录链接") : (en ? "Get sign-in link" : "获取登录链接")}</Button></form>}
      <div className="fusion-social-back" data-visible={provider !== null} aria-hidden={provider === null || undefined} inert={provider === null || undefined}><Button color={color} motion={motion} variant="tertiary" className="w-full" onClick={reset}>{en ? "Use another method" : "使用其他方式"}</Button></div>
    </div>
  </SurfaceCard></ActionStage>;
}

export function LockoutExample(settings: FusionExampleProps) {
  const [seconds, setSeconds] = useState(12);
  const [sent, setSent] = useState(false);
  const en = settings.locale === "en";
  useEffect(() => { if (!seconds) return; const timer = setTimeout(() => setSeconds(value => value - 1), 1000); return () => clearTimeout(timer); }, [seconds]);
  return <ActionStage settings={settings}><ProgressBar variant="ring" color={settings.color} motion={settings.motion} value={seconds / 12 * 100} label={en ? "Lockout remaining" : "锁定剩余时间"}><LockKeyholeLinear size={26} /></ProgressBar><p className="text-base font-semibold text-fg-black">{seconds ? (en ? `Try again in ${seconds}s` : `${seconds} 秒后可重试`) : (en ? "Ready to sign in" : "现在可以重新登录")}</p><Button color={settings.color} disabled={seconds > 0} onClick={() => setSeconds(12)}>{en ? "Sign in again" : "重新登录"}</Button><Button color={settings.color} variant="tertiary" size="sm" onClick={() => setSent(true)} disabled={sent}>{sent ? (en ? "Reset email requested" : "已请求重置邮件") : (en ? "Reset password" : "重置密码")}</Button><ActionHint>{en ? "This is an interaction demo" : "此处为交互演示"}</ActionHint></ActionStage>;
}
