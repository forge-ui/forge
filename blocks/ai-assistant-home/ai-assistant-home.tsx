"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ChatBubble, ChatInputBar, IconButton, StreamingAnswer, type ChatInputBarQuickAction } from "@forge-ui-official/core";
import { AltArrowDownLinear, AltArrowLeftLinear, AltArrowRightLinear, CloseCircleLinear, HamburgerMenuLinear, MagniferLinear, PenLinear, PenNewSquareLinear, TrashBinMinimalisticLinear, UsersGroupRoundedLinear } from "@forge-ui-official/core/icons";

export interface ChatPeer {
  key: string;
  name: string;
  avatar: string;
  kind: "autonomous" | "application";
  subtitle: string;
  intro: string;
  suggestions: string[];
  reply: string;
}

export interface ChatThread {
  id: string;
  peerKey: string;
  title: string;
  preview: string;
}

interface ChatLine {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const defaultChatPeers: ChatPeer[] = [
  { key: "auto:general", name: "通用智能体", avatar: "/images/blocks/agents/observatory-robot.webp", kind: "autonomous", subtitle: "通用", intro: "开放目标，规划后完成调研、整理、分析、写作等各类任务。", suggestions: ["用一句话说清要完成什么，以及怎样算做完"], reply: "收到。我会先列出要查的资料和判断标准，整理完成后把结论和来源一起发给你，涉及发送或删除的操作会先请你确认。" },
  { key: "auto:office", name: "办公助理", avatar: "/images/blocks/agents/deer-warm-tiny-smile-right.webp", kind: "autonomous", subtitle: "办公", intro: "处理日常办公事务：整理材料、写纪要/周报/邮件、做清单与跟进。", suggestions: ["把今天的会议记录整理成纪要", "起草一封项目延期说明邮件"], reply: "好的，纪要按「议题 / 结论 / 待办 / 负责人」四栏整理，待办会标出截止时间，整理完先发你确认再同步到群里。" },
  { key: "auto:coding", name: "编程助手", avatar: "/images/blocks/agents/music-box-robot.webp", kind: "autonomous", subtitle: "编程", intro: "读代码、排错、写改动方案与测试要点。适合仓库级开发任务。", suggestions: ["帮我看看订单筛选为什么返回空列表"], reply: "我先读一下订单筛选的查询条件和最近的改动记录，定位后给你改动方案和需要补的测试，确认后再提交。" },
  { key: "auto:ops", name: "运维分析", avatar: "/images/blocks/agents/lighthouse-lantern-room.webp", kind: "autonomous", subtitle: "运维", intro: "整理告警与日志，给出根因假设和处置建议。", suggestions: ["昨晚订单服务的超时告警是什么原因？"], reply: "超时集中在 23:40–00:25，同时段库存服务连接池使用率到了 100%。初步判断是夜间对账任务提前启动占满连接，建议先把对账改到 02:00 后执行。" },
  { key: "app:after-sales", name: "售后问答助手", avatar: "/images/blocks/agents/fox-4.webp", kind: "application", subtitle: "简单 Agent", intro: "基于售后知识库回答退换货、物流与发票问题，并注明引用来源。", suggestions: ["你能帮我做什么？", "用简单的话介绍一下你"], reply: "我可以回答退换货规则、物流进度和发票开具的问题，每个回答都会标出引用的知识库条目，方便你核对原文。" },
  { key: "app:sales", name: "销售商机助手", avatar: "/images/blocks/agents/soft-charcoal-bear.webp", kind: "application", subtitle: "高级工作流", intro: "整理客户背景、识别商机阶段，生成下一步跟进话术与行动清单。", suggestions: ["你能帮我做什么？", "用简单的话介绍一下你"], reply: "告诉我客户名称，我会汇总往来记录、判断商机阶段，再给你下一步的跟进话术和行动清单。" },
  { key: "app:weekly", name: "周报与会议纪要", avatar: "/images/blocks/agents/baby-owl.webp", kind: "application", subtitle: "简单 Agent", intro: "汇总本周工作项与会议记录，输出结构化周报。", suggestions: ["你能帮我做什么？", "用简单的话介绍一下你"], reply: "我会读取本周的工作项和会议记录，按「完成 / 进行中 / 风险 / 下周计划」输出周报。" },
];

export const defaultChatThreads: ChatThread[] = [
  { id: "thr-1", peerKey: "auto:general", title: "竞品定价调研", preview: "三家竞品的年费方案对比已整理" },
  { id: "thr-2", peerKey: "auto:general", title: "季度经营简报", preview: "续约率 86.4%，流失 14 家" },
  { id: "thr-3", peerKey: "auto:office", title: "周会纪要", preview: "待办已同步给交付组" },
  { id: "thr-4", peerKey: "app:after-sales", title: "发票重开流程", preview: "需在开票后 30 天内申请" },
];

const conversationActions: ChatInputBarQuickAction[] = [
  { id: "answer", label: "解答问题", kind: "docs", placeholder: "输入你希望解答的问题" },
  { id: "summary", label: "整理要点", kind: "note", placeholder: "输入要整理的内容或对话范围" },
  { id: "plan", label: "拆解目标", kind: "event", placeholder: "输入目标和约束条件" },
];
const accessModes = [{ id: "full", label: "完全访问" }, { id: "confirm", label: "先确认再执行" }];

/** 智能体工场的品牌色是蓝色：把 core 默认的紫色色阶整体映射到蓝色 */
const brandBlue = Object.fromEntries(["", "-50", "-100", "-200", "-300", "-400", "-500", "-600", "-700", "-800", "-900"].flatMap(step => [[`--fg-violet${step}`, `var(--fg-blue${step})`], [`--color-fg-violet${step}`, `var(--fg-blue${step})`]])) as CSSProperties;

function AgentChip({ peer, size = 28 }: { peer: ChatPeer; size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={peer.avatar} alt="" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
}

export interface AiAssistantHomeProps {
  peers?: ChatPeer[];
  threads?: ChatThread[];
  className?: string;
}

export function AiAssistantHome({ peers = defaultChatPeers, threads: initialThreads = defaultChatThreads, className = "" }: AiAssistantHomeProps) {
  const [threads, setThreads] = useState(initialThreads);
  const [selectedKey, setSelectedKey] = useState(peers[0]?.key ?? "");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [lines, setLines] = useState<Record<string, ChatLine[]>>({});
  const [input, setInput] = useState("");
  const [access, setAccess] = useState("full");
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selected = peers.find(peer => peer.key === selectedKey) ?? peers[0];
  const thread = threads.find(item => item.id === threadId);
  const current = threadId ? lines[threadId] ?? [] : [];
  const text = query.trim().toLowerCase();
  const groups = useMemo(() => [
    { label: "自主智能体", items: peers.filter(peer => peer.kind === "autonomous") },
    { label: "应用智能体", items: peers.filter(peer => peer.kind === "application") },
  ].map(group => ({ ...group, items: group.items.filter(peer => !text || peer.name.toLowerCase().includes(text) || threads.some(item => item.peerKey === peer.key && item.title.toLowerCase().includes(text))) })).filter(group => group.items.length), [peers, threads, text]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [current.length]);

  function selectAgent(key: string) {
    setMobileNav(false);
    setSelectedKey(key);
    setThreadId(null);
    setExpanded(state => ({ ...state, [key]: true }));
  }

  function send(message: string) {
    const content = message.trim();
    if (!content || !selected || streamingId) return;
    let id = threadId;
    if (!id) {
      id = `thr-${threads.length + 1}-${content.length}`;
      const created = { id, peerKey: selected.key, title: content.slice(0, 14), preview: content.slice(0, 20) };
      setThreads(list => [created, ...list]);
      setThreadId(id);
      setExpanded(state => ({ ...state, [selected.key]: true }));
    }
    const replyId = `${id}-a-${current.length}`;
    setLines(state => ({ ...state, [id]: [...(state[id] ?? []), { id: `${id}-u-${current.length}`, role: "user", content }, { id: replyId, role: "assistant", content: selected.reply }] }));
    setStreamingId(replyId);
    setInput("");
  }

  const sidebar = <div className="flex h-full w-[260px] flex-col border-r border-fg-grey-200 bg-fg-grey-50/60 text-[14px] text-fg-black">
    <div className="flex items-center justify-between gap-1 px-2 py-2.5">
      <div className="min-w-0 flex-1 px-2 text-sm font-semibold">对话</div>
      <IconButton variant="ghost" shape="square" size="sm" aria-label="收起侧栏" onClick={() => { setSidebarOpen(false); setMobileNav(false); }}><AltArrowLeftLinear size={20} /></IconButton>
    </div>
    <div className="flex min-h-0 flex-1 flex-col px-2 pb-3">
      <label className="mb-0.5 flex w-full cursor-text items-center gap-3 rounded-xl px-3 py-2.5 text-fg-grey-700 transition hover:bg-fg-grey-50">
        <button type="button" className="shrink-0" aria-label={query ? "清除搜索" : "搜索"} onClick={event => { event.preventDefault(); setQuery(""); }}>{query ? <CloseCircleLinear size={20} /> : <MagniferLinear size={20} />}</button>
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索智能体或会话" className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-fg-black outline-none placeholder:text-fg-grey-500" />
      </label>
      <button type="button" onClick={() => setThreadId(null)} className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-medium text-fg-black transition hover:bg-fg-grey-50"><PenNewSquareLinear size={20} />新建聊天</button>
      <button type="button" className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-medium text-fg-black transition hover:bg-fg-grey-50"><UsersGroupRoundedLinear size={20} />新建群聊</button>
      <div className="fg-scrollbar-thin min-h-0 flex-1 overflow-y-auto pb-2 pt-1">
        {groups.length ? <div className="flex flex-col gap-3">
          {groups.map(group => <div key={group.label}>
            <div className="px-2.5 pb-1 pt-1 text-[12px] font-medium text-fg-grey-400">{group.label}</div>
            <div className="flex flex-col gap-0.5">
              {group.items.map(peer => {
                const peerThreads = threads.filter(item => item.peerKey === peer.key);
                const open = expanded[peer.key] ?? peer.key === selectedKey;
                const active = peer.key === selectedKey;
                return <div key={peer.key}>
                  <div className={`flex w-full items-center gap-1 rounded-lg transition ${active && !threadId ? "bg-fg-grey-100" : "hover:bg-fg-grey-50"}`}>
                    <button type="button" aria-label={open ? "收起会话" : "展开会话"} onClick={() => setExpanded(state => ({ ...state, [peer.key]: !open }))} className="flex h-8 w-7 shrink-0 items-center justify-center text-fg-grey-400">{open ? <AltArrowDownLinear size={14} /> : <AltArrowRightLinear size={14} />}</button>
                    <button type="button" onClick={() => selectAgent(peer.key)} className="flex min-w-0 flex-1 items-center gap-2.5 py-2 pr-2.5 text-left">
                      <AgentChip peer={peer} />
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-fg-black ${active ? "font-medium" : ""}`}>{peer.name}</span>
                        <span className="block truncate text-[12px] text-fg-grey-400">{peerThreads.length ? `${peerThreads.length} 个会话` : peer.subtitle}</span>
                      </span>
                    </button>
                  </div>
                  {open ? <div className="mb-1 ml-4 border-l border-fg-grey-100 pl-2">
                    {peerThreads.length ? peerThreads.map(item => <div key={item.id} className={`group flex items-start rounded-lg transition ${item.id === threadId ? "bg-fg-grey-100" : "hover:bg-fg-grey-50"}`}>
                      <button type="button" onClick={() => { setSelectedKey(peer.key); setThreadId(item.id); setMobileNav(false); }} className="flex min-w-0 flex-1 flex-col px-2.5 py-1.5 text-left">
                        <span className={`truncate text-[13px] text-fg-black ${item.id === threadId ? "font-medium" : ""}`}>{item.title}</span>
                        <span className="truncate text-[12px] text-fg-grey-400">{item.preview}</span>
                      </button>
                      <button type="button" aria-label={`重命名 ${item.title}`} className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-md text-fg-grey-400 opacity-0 transition hover:bg-fg-grey-100 hover:text-fg-black group-hover:opacity-100"><PenLinear size={13} /></button>
                      <button type="button" aria-label={`删除 ${item.title}`} onClick={() => { setThreads(list => list.filter(entry => entry.id !== item.id)); if (threadId === item.id) setThreadId(null); }} className="mr-1 mt-1 flex size-6 shrink-0 items-center justify-center rounded-md text-fg-grey-400 opacity-0 transition hover:bg-fg-red-50 hover:text-fg-red group-hover:opacity-100"><TrashBinMinimalisticLinear size={13} /></button>
                    </div>) : <p className="px-2.5 py-1.5 text-[12px] text-fg-grey-400">还没有会话</p>}
                  </div> : null}
                </div>;
              })}
            </div>
          </div>)}
        </div> : <div className="px-3 py-4 text-[13px] text-fg-grey-400">无匹配智能体</div>}
      </div>
    </div>
  </div>;

  const composer = <div className="mx-auto w-full max-w-[720px]">
    <ChatInputBar key={threadId ?? selected?.key} quickActions={conversationActions} quickActionsLabel="快捷操作" removeQuickActionLabel="移除操作" hasMessages={current.length > 0}
      multiline rows={2} density="compact" sendOnEnter clearOnSend={false} showAttachment={false} inputLabel="对话消息" color="blue"
      value={input} onChange={setInput} onSend={message => send(message)} sendLabel="发送" connectedLabel="已连接"
      permissions={accessModes} permission={access} onPermissionChange={setAccess} permissionMenuLabel="访问权限"
      status={streamingId ? "running" : "idle"} onStop={() => setStreamingId(null)}
      placeholder={selected ? `给${selected.name}下达目标，可用 @` : "请先选择一个智能体"} disabled={!selected} />
  </div>;

  return <div style={brandBlue} className={`relative flex h-[760px] min-h-0 min-w-0 overflow-hidden rounded-2xl border border-fg-grey-200 bg-background ${className}`}>
    <aside className={`hidden shrink-0 transition-[width] duration-200 md:block ${sidebarOpen ? "w-[260px]" : "w-0 overflow-hidden"}`}>{sidebarOpen ? sidebar : null}</aside>
    {mobileNav ? <div className="absolute inset-0 z-50 flex md:hidden">
      <button type="button" className="absolute inset-0 bg-black/20" aria-label="关闭" onClick={() => setMobileNav(false)} />
      <div className="relative z-10 h-full shadow-xl">{sidebar}</div>
    </div> : null}
    <div className="relative flex min-w-0 flex-1 flex-col bg-background">
      <header className="flex h-12 shrink-0 items-center gap-2 px-2 sm:px-3">
        <IconButton variant="ghost" shape="square" size="sm" aria-label="菜单" className="md:hidden" onClick={() => setMobileNav(true)}><HamburgerMenuLinear size={20} /></IconButton>
        {!sidebarOpen ? <IconButton variant="ghost" shape="square" size="sm" aria-label="展开侧栏" className="hidden md:inline-flex" onClick={() => setSidebarOpen(true)}><AltArrowRightLinear size={20} /></IconButton> : null}
        <span className="min-w-0 truncate text-sm font-medium text-fg-black">{selected ? thread ? `${selected.name} · ${thread.title}` : selected.name : "对话"}</span>
      </header>
      {!selected ? null : current.length === 0 ? <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="mb-8 w-full max-w-[720px]">
            <div className="mb-3"><AgentChip peer={selected} size={48} /></div>
            <h1 className="text-[28px] font-semibold tracking-tight text-fg-black sm:text-[32px]">{selected.name}</h1>
            <p className="mt-2 max-w-[32rem] text-[14px] leading-6 text-fg-grey-600">{selected.intro}</p>
          </div>
          <div className="mb-5 w-full max-w-[720px]">
            <StreamingAnswer text="" followUps={selected.suggestions} followUpsLabel="可以这样开始" onFollowUp={value => send(value)} />
          </div>
        </div>
        <div className="shrink-0 px-4 pb-4 pt-2">{composer}</div>
      </div> : <>
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto flex max-w-[720px] flex-col gap-6 px-4 py-6 sm:px-6">
            {current.map(line => line.role === "user"
              ? <ChatBubble key={line.id} type="sent" color="blue" content={line.content} />
              : <div key={line.id} className="flex gap-3">
                <div className="mt-0.5 shrink-0"><AgentChip peer={selected} /></div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 text-xs font-medium text-fg-grey-500">{selected.name}</div>
                  <StreamingAnswer text={line.content} streaming={line.id === streamingId} onDone={() => setStreamingId(id => id === line.id ? null : id)} />
                </div>
              </div>)}
          </div>
        </div>
        <div className="shrink-0 px-4 pb-4 pt-2">{composer}</div>
      </>}
    </div>
  </div>;
}
