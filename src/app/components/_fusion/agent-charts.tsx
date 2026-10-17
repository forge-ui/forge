"use client";

import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { AnimatePresence, motion as animated, useReducedMotion } from "motion/react";
import { Button, ChatBubble, ChatInputBar, FileCard, StreamingAnswer, ThinkingTrace, ToolChips } from "@forge-ui-official/core";
import type { ComposerReply, ComposerVoiceState } from "@forge-ui-official/core/components/ui/composer-types";
import type { ChatReaction, ChatReactionOption } from "@forge-ui-official/core/components/ui/chat-bubble";
import type { FileItem } from "@forge-ui-official/core/components/ui/forms/file-upload";
import { ChartExamples } from "./agent-charts-plots";
import type { FusionExampleProps, FusionSettings } from "./types";

type Settings = FusionSettings;
const text = (locale: Settings["locale"], zh: string, en: string) => locale === "zh" ? zh : en;
function Actions({ children }: { children: ReactNode }) { return <div className="flex flex-wrap gap-2">{children}</div>; }
function composerLabels(locale: Settings["locale"]) { return { locale, placeholder: text(locale, "输入消息…", "Message…"), inputLabel: text(locale, "消息内容", "Message"), toolsMenuLabel: text(locale, "添加内容和工具", "Add content and tools"), attachLabel: text(locale, "添加附件", "Attach files"), sendLabel: text(locale, "发送", "Send"), stopLabel: text(locale, "停止生成", "Stop generating"), stoppingLabel: text(locale, "正在停止…", "Stopping…") }; }

function ReactionExample({ locale, color, motion }: Settings) {
  const options: ChatReactionOption[] = [
    ["like", "👍", "赞", "Like"], ["heart", "❤️", "喜欢", "Heart"], ["laugh", "😂", "开心", "Laugh"], ["celebrate", "🎉", "庆祝", "Celebrate"], ["fire", "🔥", "精彩", "Fire"], ["watch", "👀", "关注", "Watching"],
    ["thanks", "🙏", "感谢", "Thanks"], ["done", "✅", "完成", "Done"], ["idea", "💡", "想法", "Idea"], ["wow", "😮", "惊喜", "Wow"], ["launch", "🚀", "发布", "Launch"], ["clap", "👏", "鼓掌", "Clap"],
  ].map(([id, content, zh, en]) => ({ id, content, label: text(locale, zh, en) }));
  const [counts, setCounts] = useState([{ id: "like", count: 3, selected: false }, { id: "celebrate", count: 1, selected: false }]);
  const reactions: ChatReaction[] = counts.map(item => ({ ...options.find(option => option.id === item.id)!, ...item }));
  return <div className="flex w-full max-w-lg flex-col gap-4"><ChatBubble type="received" color={color} senderName={text(locale, "林晓", "Lin Xiao")} content={text(locale, "第三版已更新，按钮过渡缩短到了 0.3 秒。", "Draft v3 is ready. The button transition now takes 0.3 seconds.")} /><ChatBubble type="received" color={color} locale={locale} motion={motion} senderName={text(locale, "陈晨", "Chen Chen")} content={text(locale, "现在轻快多了，可以发布了。", "That feels much lighter. We can ship it.")} reactions={reactions} reactionOptions={options} onReaction={id => setCounts(current => { const found = current.find(item => item.id === id); return found ? current.map(item => item.id === id ? { ...item, count: item.count + (item.selected ? -1 : 1), selected: !item.selected } : item).filter(item => item.count > 0) : [...current, { id, count: 1, selected: true }]; })} /></div>;
}

type Message = { id: string; body: string; type: "sent" | "received"; replyTo?: ComposerReply; delivery?: ComponentProps<typeof ChatBubble>["delivery"] };
function ReplyExample({ locale, color, motion }: Settings) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<ComposerReply>();
  const [typing, setTyping] = useState(false);
  const responseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);
  useEffect(() => () => { if (responseTimer.current) clearTimeout(responseTimer.current); }, []);
  const name = text(locale, "林晓", "Lin Xiao");
  const initial = [text(locale, "第三版已更新，按钮过渡缩短到了 0.3 秒。", "Draft v3 is ready. The button transition now takes 0.3 seconds."), text(locale, "现在轻快多了。", "That feels much lighter."), text(locale, "也帮忙看一下深色模式？", "Could you check dark mode too?")];
  const rows: Message[] = [...initial.map((body, i) => ({ id: `initial-${i}`, body, type: i === 1 ? "sent" as const : "received" as const })), ...messages];
  return <div className="flex w-full max-w-lg flex-col gap-4"><div className="flex max-h-80 flex-col gap-3 overflow-y-auto" role="log">{rows.map(item => <ChatBubble key={item.id} type={item.type} content={item.body} senderName={item.type === "received" ? name : undefined} replyTo={item.replyTo} locale={locale} color={color} motion={motion} onReply={() => setReplyTo({ id: item.id, name: item.type === "received" ? name : text(locale, "我", "Me"), content: item.body })} />)}{typing && <ThinkingTrace motion={motion} locale={locale} activeLabel={text(locale, "对方正在输入", "Typing")} doneLabel={text(locale, "对方正在输入", "Typing")} rows={[{ primary: text(locale, "正在回复…", "Composing a reply…") }]} />}</div><ChatInputBar {...composerLabels(locale)} motion={motion} color={color} hasMessages replyTo={replyTo} onCancelReply={() => setReplyTo(undefined)} onSend={(body, _action, context) => { setMessages(current => [...current, { id: `message-${++seq.current}`, body, type: "sent", replyTo: context?.replyTo }]); setReplyTo(undefined); setTyping(true); if (responseTimer.current) clearTimeout(responseTimer.current); responseTimer.current = setTimeout(() => { setTyping(false); setMessages(current => [...current, { id: `message-${++seq.current}`, body: text(locale, "收到，我来确认。", "Got it. I will check."), type: "received" }]); }, motion === "none" ? 300 : 1400); }} /><p className="text-xs text-fg-grey-500">{text(locale, "向右滑动消息或点击回复，即可引用。", "Swipe a message right or choose Reply to quote it.")}</p></div>;
}

function VoiceExample({ locale, color, motion }: Settings) {
  const [state, setState] = useState<ComposerVoiceState>("idle");
  const [level, setLevel] = useState(0);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const systemReduced = useReducedMotion();
  const reduced = motion === "none" || Boolean(systemReduced);
  useEffect(() => {
    if (state !== "recording") return;
    let frame = 0;
    const tick = (now: number) => { setLevel(reduced ? .4 : Math.abs(Math.sin(now / 140) * .6 + Math.sin(now / 77) * .25)); if (!reduced) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [state, reduced]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return <div className="flex w-full max-w-lg flex-col gap-4"><p role="status" className="text-sm text-fg-grey-700">{text(locale, "按住麦克风说话，松开结束；Esc 取消。", "Hold the microphone, release to finish; Escape cancels.")}</p><ChatInputBar {...composerLabels(locale)} value={draft} onChange={setDraft} motion={motion} color={color} voiceState={state} voiceLevel={level} onVoiceStart={() => { if (timer.current) clearTimeout(timer.current); setState("recording"); setNotice(""); }} onVoiceEnd={() => { setState("processing"); setLevel(0); timer.current = setTimeout(() => { setDraft(text(locale, "明天上午十点安排设计评审", "Schedule a design review tomorrow at 10 AM")); setState("idle"); }, reduced ? 200 : 900); }} onVoiceCancel={() => { if (timer.current) clearTimeout(timer.current); setState("idle"); setLevel(0); setNotice(text(locale, "已取消录音", "Recording cancelled")); }} onSend={body => setNotice(text(locale, `已发送：${body}`, `Sent: ${body}`))} /><p className="text-xs text-fg-grey-500">{text(locale, "语音状态示例，使用模拟音量和识别结果，不访问麦克风。", "This example uses simulated audio levels and transcription; it does not access the microphone.")}</p><p role="status" className="text-xs text-fg-grey-700">{notice}</p></div>;
}

function StreamingExample({ locale, color, motion }: Settings) {
  const [prompt, setPrompt] = useState(0), [generation, setGeneration] = useState(0);
  const [run, setRun] = useState<{ count: number; status: "streaming" | "stopped" | "complete" }>({ count: 0, status: "streaming" });
  const answers = locale === "zh" ? ["可以先尝试三件事。\n\n1. 让用户从第一个屏幕开始操作，并减少说明文字。\n2. 通过进度条显示剩余步骤。\n3. 保留跳过按钮，并让位置保持固定。\n\n第一项通常最能减少流失。", "大部分按钮过渡使用 150–250ms 即可。\n\n- 按下反馈应在 100ms 内开始。\n- 大型面板移动可以接近 300ms。\n- 遵守系统的减少动态效果偏好。"] : ["Three things are worth trying first.\n\n1. Let people start on the first screen and reduce explanations.\n2. Show the remaining steps with a progress bar.\n3. Keep the skip button in the same place.\n\nThe first change usually reduces drop-off most.", "For most button transitions, 150–250ms is enough.\n\n- Start press feedback within 100ms.\n- Large moving panels may take around 300ms.\n- Respect the system's reduced-motion preference."];
  const answer = answers[prompt];
  useEffect(() => { if (run.status !== "streaming") return; const timer = setTimeout(() => setRun(current => { const count = Math.min(answer.length, current.count + 3); return { count, status: count >= answer.length ? "complete" : "streaming" }; }), 35); return () => clearTimeout(timer); }, [run, answer, generation]);
  const restart = (index = prompt) => { setPrompt(index); setGeneration(value => value + 1); setRun({ count: 0, status: "streaming" }); };
  return <div className="flex w-full max-w-xl flex-col gap-4"><ChatBubble type="sent" color={color} content={prompt === 0 ? text(locale, "如何改善新手引导？", "How can we improve onboarding?") : text(locale, "按钮过渡多长比较合适？", "How long should a button transition take?")} /><StreamingAnswer key={`${locale}-${generation}`} text={answer.slice(0, run.count)} status={run.status} format="markdown" animation="blur" locale={locale} motion={motion} /><Actions><Button color={color} size="sm" motion={motion} onClick={() => run.status === "streaming" ? setRun(current => ({ ...current, status: "stopped" })) : restart()}>{run.status === "streaming" ? text(locale, "停止", "Stop") : text(locale, "重新生成", "Regenerate")}</Button><Button color={color} variant="tertiary" size="sm" motion={motion} onClick={() => restart(prompt ? 0 : 1)}>{text(locale, "换个问题", "Another question")}</Button></Actions>{run.status === "stopped" && <p role="status" className="text-xs text-fg-grey-500">{text(locale, "已停止生成", "Generation stopped")}</p>}</div>;
}

function OfflineExample({ locale, color, motion }: Settings) {
  const [connection, setConnection] = useState<"offline" | "connecting" | "online">("offline");
  const [messages, setMessages] = useState<Message[]>([{ id: "queued-0", type: "sent", body: "", delivery: "queued" }]);
  const seq = useRef(0);
  useEffect(() => { if (connection !== "connecting") return; const timer = setTimeout(() => setConnection("online"), motion === "none" ? 200 : 1100); return () => clearTimeout(timer); }, [connection, motion]);
  useEffect(() => { if (connection !== "online") return; const queued = messages.find(item => item.delivery === "queued"); if (!queued) return; const timer = setTimeout(() => setMessages(current => current.map(item => item.id === queued.id ? { ...item, delivery: "delivered" } : item)), motion === "none" ? 0 : 350); return () => clearTimeout(timer); }, [connection, messages, motion]);
  const waiting = messages.filter(item => item.delivery === "queued").length;
  return <div className="flex w-full max-w-lg flex-col gap-4"><div className="flex items-center justify-between gap-2"><span className="text-sm font-medium text-fg-black">{text(locale, "设计小组", "Design team")}</span><Button color={color} variant="tertiary" size="sm" motion={motion} onClick={() => setConnection(connection === "offline" ? "connecting" : "offline")}>{connection === "offline" ? text(locale, "连接网络", "Connect") : text(locale, "断开连接", "Disconnect")}</Button></div><p role="status" className="rounded-lg bg-fg-grey-100 p-3 text-sm text-fg-grey-700">{connection === "offline" ? text(locale, `当前离线 · ${waiting} 条消息等待发送`, `Offline · ${waiting} messages queued`) : connection === "connecting" ? text(locale, "正在重新连接…", "Reconnecting…") : text(locale, "已恢复连接", "Back online")}</p><div role="log" className="flex max-h-64 flex-col gap-3 overflow-y-auto"><ChatBubble type="received" color={color} content={text(locale, "下午评审之前帮忙看看草稿？", "Could you check the draft before the afternoon review?")} />{messages.map(item => <ChatBubble key={item.id} type="sent" locale={locale} color={color} motion={motion} content={item.body || text(locale, "可以再提高一点颜色对比度。", "Could we raise the color contrast a little?")} delivery={item.delivery} />)}</div><ChatInputBar {...composerLabels(locale)} color={color} motion={motion} hasMessages onSend={body => setMessages(current => [...current, { id: `queued-${++seq.current}`, body, type: "sent", delivery: connection === "online" ? "delivered" : "queued" }])} /></div>;
}

function AttachmentExample({ locale, color, motion }: Settings) {
  const [files, setFiles] = useState<FileItem[]>([{ id: "sample-0", name: "产品需求.pdf", size: "1.2 MB", state: "uploading", progress: 35 }]);
  const [sent, setSent] = useState("");
  const seq = useRef(0), picker = useRef<HTMLInputElement>(null);
  const systemReduced = useReducedMotion();
  const reduced = motion === "none" || Boolean(systemReduced);
  const add = (values: { name: string; size: string }[]) => setFiles(current => [...current, ...values.map(file => ({ ...file, id: `file-${++seq.current}`, state: "uploading" as const, progress: 0 }))]);
  return <div className="flex w-full max-w-xl flex-col gap-3"><input ref={picker} type="file" multiple className="sr-only" aria-label={text(locale, "选择附件", "Choose files")} onChange={event => { add(Array.from(event.target.files ?? []).map(file => ({ name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` }))); event.target.value = ""; }} /><ChatInputBar {...composerLabels(locale)} color={color} motion={motion} multiline rows={2} onAttach={() => picker.current?.click()} sendDisabled={files.some(file => file.state !== "success")} hasAttachments={files.length > 0} attachments={<div className="flex flex-col gap-2"><AnimatePresence initial={false}>{files.map(file => <animated.div key={file.id} layout={!reduced} initial={reduced ? false : { opacity: 0, y: 20, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, x: 20, height: 0 }} transition={{ duration: reduced ? 0 : .3 }}><FileCard file={file} locale={locale} color={color} onRemove={id => setFiles(current => current.filter(item => item.id !== id))} onRetry={id => setFiles(current => current.map(item => item.id === id ? { ...item, state: "uploading", progress: 0 } : item))} /></animated.div>)}</AnimatePresence></div>} onSend={body => { setSent(text(locale, `已发送 ${files.length} 个附件${body ? `：${body}` : ""}`, `Sent ${files.length} attachments${body ? `: ${body}` : ""}`)); setFiles([]); }} /><Actions><Button color={color} variant="tertiary" size="sm" motion={motion} onClick={() => add([{ name: text(locale, "交互设计.fig", "Interaction.fig"), size: "2.4 MB" }])}>{text(locale, "添加示例", "Add example")}</Button><Button color={color} variant="tertiary" size="sm" motion={motion} disabled={!files.some(file => file.state === "uploading")} onClick={() => setFiles(current => current.map(file => { if (file.state !== "uploading") return file; const progress = Math.min(100, (file.progress ?? 0) + 35); return { ...file, progress, state: progress === 100 ? "success" : "uploading" }; }))}>{text(locale, "推进进度", "Advance progress")}</Button><Button color={color} variant="tertiary" size="sm" motion={motion} disabled={!files.some(file => file.state === "uploading")} onClick={() => setFiles(current => { const index = current.findIndex(file => file.state === "uploading"); return current.map((file, i) => i === index ? { ...file, state: "error" } : file); })}>{text(locale, "模拟失败", "Simulate failure")}</Button></Actions><p role="status" className="text-xs text-fg-grey-500">{sent || text(locale, "仅演示本地状态，不上传文件。", "Local state only; files are not uploaded.")}</p></div>;
}

function ToolExample({ locale, color, motion }: Settings) {
  const [state, setState] = useState<"idle" | "running" | "success" | "error" | "cancelled">("idle");
  const [step, setStep] = useState(0);
  const labels = locale === "zh" ? ["检索工作区资料", "提取关键证据", "生成对比摘要"] : ["Search workspace", "Extract evidence", "Create a comparison"];
  return <div className="w-full max-w-lg"><ToolChips locale={locale} motion={motion} state={state} summary={text(locale, "知识库搜索", "Knowledge search")} items={labels.map((label, index) => ({ id: `step-${index}`, kind: index === 0 ? "read" : index === 1 ? "think" : "write", label, chip: String(index + 1), status: index < step || state === "success" ? "complete" : index === step && state === "running" ? "running" : index === step && state === "error" ? "error" : state === "cancelled" ? "cancelled" : "pending", detail: [{ text: text(locale, "查询：输入组件交互规范", "Query: input interaction guidelines") }] }))} result={state === "success" ? text(locale, "找到 12 条相关资料，已整理 3 项交互建议。", "Found 12 sources and prepared 3 interaction recommendations.") : state === "error" ? text(locale, "当前步骤失败，重试会保留已完成步骤。", "This step failed. Retry keeps completed steps.") : undefined} actions={<>{state === "idle" || state === "error" ? <Button color={color} size="sm" motion={motion} onClick={() => setState("running")}>{state === "idle" ? text(locale, "开始调用", "Start") : text(locale, "重试当前步骤", "Retry step")}</Button> : state === "running" ? <><Button color={color} size="sm" motion={motion} onClick={() => { setStep(value => value + 1); if (step >= 2) setState("success"); }}>{text(locale, "完成当前步骤", "Complete step")}</Button><Button color={color} size="sm" motion={motion} variant="tertiary" onClick={() => setState("error")}>{text(locale, "模拟失败", "Simulate failure")}</Button><Button color={color} size="sm" motion={motion} variant="tertiary" onClick={() => setState("cancelled")}>{text(locale, "停止", "Stop")}</Button></> : <Button color={color} size="sm" motion={motion} variant="tertiary" onClick={() => { setState("idle"); setStep(0); }}>{text(locale, "重新演示", "Reset")}</Button>}</>} /></div>;
}

export function AgentChartExamples(props: FusionExampleProps) {
  const demos = { "077": ReactionExample, "078": ReplyExample, "084": VoiceExample, "086": StreamingExample, "091": OfflineExample, F01: AttachmentExample, F02: ToolExample };
  const Demo = demos[props.id as keyof typeof demos];
  return Demo ? <Demo key={`${props.id}-${props.locale}`} {...props} /> : <ChartExamples {...props} />;
}
