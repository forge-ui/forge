"use client";

import { useState } from "react";
import { Avatar, Button, ChatBubble, ChatInputBar, ContactItem, IconButton, ToolbarSearchInput, cn } from "@forge-ui-official/core";
import { PhoneCallingRoundedLinear, VideocameraRecordLinear } from "@forge-ui-official/core/icons";

export interface ChatContact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  initials?: string;
  online?: boolean;
  unread?: number;
  time: string;
  preview: string;
}

export type ChatMessage =
  | { id: string; from: "me" | "them"; kind: "text"; content: string; time: string }
  | { id: string; from: "me" | "them"; kind: "file"; fileName: string; fileSize: string; time: string }
  | { id: string; from: "me" | "them"; kind: "voice"; duration: string; time: string };

export const defaultChatContacts: ChatContact[] = [
  { id: "c1", name: "林悦", role: "体验设计师", avatar: "/images/blocks/people/lin-yue.jpg", online: true, unread: 2, time: "09:35", preview: "订单详情的交互稿更新了" },
  { id: "c2", name: "陈思远", role: "前端工程师", avatar: "/images/blocks/people/chen-siyuan.jpg", online: true, time: "09:12", preview: "筛选已经合并到测试环境" },
  { id: "c3", name: "许知夏", role: "测试工程师", avatar: "/images/blocks/people/xu-zhixia.jpg", unread: 1, time: "昨天", preview: "支付回调还有两个用例" },
  { id: "c4", name: "周予安", role: "后端工程师", avatar: "/images/blocks/people/zhou-yuan.jpg", time: "昨天", preview: "接口文档我补完了" },
  { id: "c5", name: "交付小组", role: "8 位成员", initials: "交", online: true, unread: 6, time: "周一", preview: "张宁：周四下午验收" },
];

export const defaultChatMessages: ChatMessage[] = [
  { id: "m1", from: "them", kind: "text", content: "订单详情的交互稿更新了，退款状态单独加了一个筛选项。", time: "09:30" },
  { id: "m2", from: "me", kind: "text", content: "收到，我对照一下接口字段，下午给你反馈。", time: "09:31" },
  { id: "m3", from: "them", kind: "file", fileName: "订单详情交互稿.fig", fileSize: "4.2 MB", time: "09:32" },
  { id: "m4", from: "me", kind: "voice", duration: "0:18", time: "09:35" },
];

export interface ChatWorkspaceProps {
  contacts?: ChatContact[];
  messages?: ChatMessage[];
  onSend?: (contactId: string, content: string) => void;
  className?: string;
}

export function ChatWorkspace({ contacts = defaultChatContacts, messages = defaultChatMessages, onSend, className }: ChatWorkspaceProps) {
  const [activeId, setActiveId] = useState(contacts[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>({ [contacts[0]?.id ?? ""]: messages });
  const active = contacts.find(contact => contact.id === activeId) ?? contacts[0];
  const thread = threads[activeId] ?? [];
  const visibleContacts = contacts.filter(contact => contact.name.includes(query.trim()) || contact.preview.includes(query.trim()));

  function send(content: string) {
    const now = new Date();
    const message: ChatMessage = { id: `m-${now.getTime()}`, from: "me", kind: "text", content, time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}` };
    setThreads(current => ({ ...current, [activeId]: [...(current[activeId] ?? []), message] }));
    onSend?.(activeId, content);
  }

  return <div className={cn("grid min-h-[560px] min-w-0 grid-cols-1 gap-4 md:grid-cols-[280px_minmax(0,1fr)]", className)}>
    <aside className="flex min-w-0 flex-col gap-3 rounded-card border border-fg-grey-200 bg-white p-4">
      <ToolbarSearchInput className="sm:w-full sm:max-w-none" value={query} onChange={setQuery} placeholder="搜索联系人" />
      <ul className="flex flex-col gap-1">{visibleContacts.map(contact => <li key={contact.id}><Button variant="unstyled" type="button" className="w-full text-left" aria-current={contact.id === activeId ? "true" : undefined} onClick={() => setActiveId(contact.id)}>
        <ContactItem type={contact.initials ? "team" : "person"} color="blue" avatar={contact.avatar} initials={contact.initials} name={contact.name} message={contact.preview} online={contact.online} active={contact.id === activeId} unreadCount={contact.id === activeId ? undefined : contact.unread} time={contact.time} />
      </Button></li>)}</ul>
    </aside>
    <section className="flex min-w-0 flex-col rounded-card border border-fg-grey-200 bg-white">
      {active && <header className="flex items-center justify-between gap-3 border-b border-fg-grey-200 px-5 py-4">
        <div className="flex items-center gap-3"><Avatar src={active.avatar} initials={active.initials} alt={active.name} size="md" /><div><p className="text-sm font-semibold text-fg-black">{active.name}</p><p className={cn("text-xs", active.online ? "text-fg-green-500" : "text-fg-grey-500")}>{active.online ? "在线" : active.role}</p></div></div>
        <div className="flex gap-2"><IconButton variant="tertiary" size="sm" aria-label={`语音通话${active.name}`}><PhoneCallingRoundedLinear size={18} /></IconButton><IconButton variant="tertiary" size="sm" aria-label={`视频通话${active.name}`}><VideocameraRecordLinear size={18} /></IconButton></div>
      </header>}
      <div className="flex flex-1 flex-col gap-4 fg-scrollbar-hidden overflow-y-auto px-5 py-5">
        {thread.length ? thread.map(message => {
          const common = { type: message.from === "me" ? "sent" as const : "received" as const, color: "blue" as const, time: message.time, avatar: message.from === "them" ? active?.avatar : undefined, senderName: message.from === "them" ? active?.name : undefined };
          if (message.kind === "file") return <ChatBubble key={message.id} {...common} variant="file" fileName={message.fileName} fileSize={message.fileSize} />;
          if (message.kind === "voice") return <ChatBubble key={message.id} {...common} variant="voice" voiceDuration={message.duration} />;
          return <ChatBubble key={message.id} {...common} content={message.content} />;
        }) : <p className="m-auto text-sm text-fg-grey-700">还没有消息，打个招呼吧。</p>}
      </div>
      <div className="border-t border-fg-grey-200 p-4"><ChatInputBar color="blue" placeholder={`发消息给 ${active?.name ?? ""}`} onSend={send} /></div>
    </section>
  </div>;
}
