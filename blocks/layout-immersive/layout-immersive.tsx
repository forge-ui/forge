"use client";

import { useState, type ReactNode } from "react";
import { AppLayout, ChatBubble, ChatInputBar, type AppLayoutMenuItem } from "@forge-ui-official/core";
import { BookBoldDuotone, ChatDotsLinear, FolderWithFilesBoldDuotone, SettingsBoldDuotone, WidgetBoldDuotone } from "@forge-ui-official/core/icons";

export const defaultImmersiveMenu: AppLayoutMenuItem[] = [
  { label: "工作台", icon: <WidgetBoldDuotone size={20} />, href: "#overview" },
  { label: "对话", icon: <ChatDotsLinear size={20} />, href: "#chats" },
  { label: "项目", icon: <FolderWithFilesBoldDuotone size={20} />, href: "#projects" },
  { label: "知识库", icon: <BookBoldDuotone size={20} />, href: "#knowledge" },
  { label: "设置", icon: <SettingsBoldDuotone size={20} />, href: "#settings" },
];

const channels = [
  { id: "c1", name: "官网改版项目组", preview: "首屏切图已经上传到项目里", time: "10:42", unread: 2 },
  { id: "c2", name: "售后问答助手", preview: "发票开错可以在 30 天内申请重开", time: "09:15", unread: 0 },
  { id: "c3", name: "林悦", preview: "周四下午的评审会还开吗？", time: "昨天", unread: 0 },
  { id: "c4", name: "华东大区运营", preview: "双十二活动排期表已更新", time: "11月7日", unread: 0 },
];

function SamplePage() {
  const [active, setActive] = useState("c1");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    { id: "m1", mine: false, author: "陈思远", text: "首屏切图已经上传到项目里，移动端适配还差两个断点。" },
    { id: "m2", mine: true, author: "我", text: "收到，今天下班前能把案例轮播合进去吗？" },
    { id: "m3", mine: false, author: "编程助手", text: "可以。轮播组件已通过单元测试，合并后我会在任务里贴上预览链接。" },
  ]);
  const channel = channels.find(item => item.id === active)!;
  return <div className="flex h-[720px] min-h-0 overflow-hidden rounded-2xl border border-fg-grey-200 bg-background">
    <aside className="hidden w-64 shrink-0 flex-col border-r border-fg-grey-100 md:flex">
      <div className="px-4 py-3 text-sm font-semibold text-fg-black">消息</div>
      <ul className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-3">
        {channels.map(item => <li key={item.id}><button type="button" onClick={() => setActive(item.id)} className={`flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left ${active === item.id ? "bg-fg-grey-100" : "hover:bg-fg-grey-50"}`}>
          <span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-medium text-fg-black">{item.name}</span><span className="shrink-0 text-[11px] text-fg-grey-500">{item.time}</span></span>
          <span className="flex items-center justify-between gap-2"><span className="truncate text-xs text-fg-grey-600">{item.preview}</span>{item.unread ? <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-fg-blue text-[10px] text-white">{item.unread}</span> : null}</span>
        </button></li>)}
      </ul>
    </aside>
    <section className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-12 shrink-0 items-center border-b border-fg-grey-100 px-4 text-sm font-semibold text-fg-black">{channel.name}</header>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-8">
        {messages.map(message => <div key={message.id} className={`flex flex-col gap-1 ${message.mine ? "items-end" : "items-start"}`}>{message.mine ? null : <span className="px-1 text-xs text-fg-grey-500">{message.author}</span>}<ChatBubble type={message.mine ? "sent" : "received"} color="blue" content={message.text} /></div>)}
      </div>
      <div className="shrink-0 px-4 pb-4 sm:px-8"><ChatInputBar color="blue" multiline rows={1} density="compact" sendOnEnter showAttachment={false} value={draft} onChange={setDraft} placeholder={`发消息给 ${channel.name}`} sendLabel="发送" inputLabel="消息" onSend={text => { if (text.trim()) setMessages(current => [...current, { id: `m${current.length + 1}`, mine: true, author: "我", text: text.trim() }]); setDraft(""); }} /></div>
    </section>
  </div>;
}

export interface LayoutImmersiveProps {
  menuItems?: AppLayoutMenuItem[];
  children?: ReactNode;
}

/** 沉浸式：去掉页头，侧栏收成图标条，内容区整块留给对话、画布或编辑器 */
export function LayoutImmersive({ menuItems = defaultImmersiveMenu, children = <SamplePage /> }: LayoutImmersiveProps) {
  return <AppLayout
    accent="blue"
    logoText="知行科技"
    appName="协作空间"
    menuItems={menuItems}
    defaultSidebarCollapsed
    profilePosition="sidebar"
    profile={{ name: "张宁", role: "管理员", avatar: "/images/team/edward-allen.png" }}
    hideHeader
  >
    {children}
  </AppLayout>;
}
