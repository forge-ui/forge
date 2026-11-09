"use client";

import { useEffect, useRef, type ComponentType } from "react";
import { AppLayout, Breadcrumbs, type AppLayoutMenuItem } from "@forge-ui-official/core";
import {
  BagBoldDuotone,
  BellBoldDuotone,
  CardSendBoldDuotone,
  KeyboardBoldDuotone,
  SettingsBoldDuotone,
  ShieldKeyholeBoldDuotone,
  ShieldUserBoldDuotone,
  StarBoldDuotone,
  UserBoldDuotone,
  BillListBoldDuotone,
  BookBoldDuotone,
  BoxBoldDuotone,
  CalendarBoldDuotone,
  CardBoldDuotone,
  ChartSquareBoldDuotone,
  ClipboardListBoldDuotone,
  FolderWithFilesBoldDuotone,
  HomeSmileBoldDuotone,
  InboxBoldDuotone,
  LetterBoldDuotone,
  PieChart3BoldDuotone,
  ShopBoldDuotone,
  TagBoldDuotone,
  TransferHorizontalBoldDuotone,
  UserPlusBoldDuotone,
  UsersGroupRoundedBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  WalletMoneyBoldDuotone,
  WidgetBoldDuotone,
} from "@forge-ui-official/core/icons";
import { blocks } from "./_catalog";
import { BlockPreview } from "./_previews";

type IconComponent = ComponentType<{ size?: number }>;

export const shellMenus: Record<string, { label: string; items: { key: string; label: string; icon: IconComponent }[] }> = {
  commerce: { label: "电商运营", items: [
    { key: "overview", label: "概览", icon: WidgetBoldDuotone },
    { key: "orders", label: "订单", icon: BagBoldDuotone },
    { key: "products", label: "商品", icon: BoxBoldDuotone },
    { key: "categories", label: "分类", icon: TagBoldDuotone },
    { key: "customers", label: "客户", icon: UsersGroupRoundedBoldDuotone },
    { key: "sellers", label: "商家", icon: ShopBoldDuotone },
  ] },
  crm: { label: "客户关系", items: [
    { key: "overview", label: "概览", icon: WidgetBoldDuotone },
    { key: "leads", label: "线索", icon: UserPlusBoldDuotone },
    { key: "deals", label: "商机", icon: ChartSquareBoldDuotone },
    { key: "customers", label: "客户", icon: UsersGroupRoundedBoldDuotone },
    { key: "activity", label: "动态", icon: InboxBoldDuotone },
  ] },
  projects: { label: "项目协作", items: [
    { key: "overview", label: "概览", icon: WidgetBoldDuotone },
    { key: "projects", label: "项目", icon: FolderWithFilesBoldDuotone },
    { key: "tasks", label: "任务", icon: ClipboardListBoldDuotone },
    { key: "members", label: "成员", icon: UsersGroupTwoRoundedBoldDuotone },
    { key: "clients", label: "客户", icon: UsersGroupRoundedBoldDuotone },
    { key: "schedule", label: "日程", icon: CalendarBoldDuotone },
  ] },
  workspace: { label: "团队空间", items: [
    { key: "today", label: "今日", icon: HomeSmileBoldDuotone },
    { key: "calendar", label: "日历", icon: CalendarBoldDuotone },
    { key: "messages", label: "消息", icon: LetterBoldDuotone },
    { key: "files", label: "文件", icon: FolderWithFilesBoldDuotone },
    { key: "agents", label: "智能体", icon: UsersGroupTwoRoundedBoldDuotone },
    { key: "library", label: "知识库", icon: BookBoldDuotone },
  ] },
  agents: { label: "智能体工场", items: [
    { key: "overview", label: "工作台", icon: WidgetBoldDuotone },
    { key: "apps", label: "应用智能体", icon: StarBoldDuotone },
    { key: "autonomous", label: "自主智能体", icon: UserBoldDuotone },
    { key: "chats", label: "对话", icon: LetterBoldDuotone },
    { key: "runtimes", label: "运行时", icon: KeyboardBoldDuotone },
    { key: "channels", label: "消息渠道", icon: CardSendBoldDuotone },
    { key: "knowledge", label: "知识库", icon: BookBoldDuotone },
    { key: "usage", label: "用量", icon: PieChart3BoldDuotone },
  ] },
  settings: { label: "设置", items: [
    { key: "profile", label: "个人资料", icon: UserBoldDuotone },
    { key: "members", label: "成员与团队", icon: UsersGroupRoundedBoldDuotone },
    { key: "roles", label: "角色权限", icon: ShieldUserBoldDuotone },
    { key: "notifications", label: "通知", icon: BellBoldDuotone },
    { key: "security", label: "安全", icon: ShieldKeyholeBoldDuotone },
    { key: "billing", label: "账单", icon: CardBoldDuotone },
    { key: "preferences", label: "偏好", icon: SettingsBoldDuotone },
  ] },
  finance: { label: "财务管理", items: [
    { key: "overview", label: "概览", icon: WidgetBoldDuotone },
    { key: "accounts", label: "账户", icon: WalletMoneyBoldDuotone },
    { key: "cards", label: "银行卡", icon: CardBoldDuotone },
    { key: "transactions", label: "交易", icon: TransferHorizontalBoldDuotone },
    { key: "invoices", label: "发票", icon: BillListBoldDuotone },
    { key: "wealth", label: "资产", icon: PieChart3BoldDuotone },
  ] },
};

function usePreviewHeight(name: string) {
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function report() {
      const element = content.current;
      if (!element) return;
      const gutter = element.parentElement ? parseFloat(getComputedStyle(element.parentElement).paddingBottom) || 0 : 0;
      window.parent.postMessage({ type: "forge-block-height", name, height: element.getBoundingClientRect().bottom + window.scrollY + gutter + 8 }, window.location.origin);
    }
    function requested(event: MessageEvent) {
      if (event.origin === window.location.origin && event.data?.type === "forge-block-height-request") report();
    }
    const observer = new ResizeObserver(report);
    if (content.current) observer.observe(content.current);
    window.addEventListener("resize", report);
    window.addEventListener("message", requested);
    report();
    return () => { observer.disconnect(); window.removeEventListener("resize", report); window.removeEventListener("message", requested); };
  }, [name]);
  return content;
}

export function BlockShell({ name }: { name: string }) {
  const content = usePreviewHeight(name);
  const block = blocks.find(entry => entry.name === name)!;
  const shell = block.shell;

  if (shell === "none") {
    return <main className="flex min-h-screen items-center justify-center bg-fg-grey-50 p-4 sm:p-8"><div ref={content} className="w-full min-w-0"><BlockPreview name={name} /></div></main>;
  }

  const menu = shellMenus[shell.menu];
  const active = menu.items.find(item => item.key === shell.active);
  const items: AppLayoutMenuItem[] = menu.items.map(item => {
    const Icon = item.icon;
    return { label: item.label, icon: <Icon size={20} />, href: item.key === shell.active ? `/blocks/${name}/preview` : `#${item.key}` };
  });
  const trail = [{ label: menu.label, href: "#" }, ...(active && active.label !== shell.title ? [{ label: active.label, href: `#${active.key}` }] : []), { label: shell.title }];

  return <div className="flow-root min-h-screen bg-fg-grey-50">
    <AppLayout defaultSidebarCollapsed logoText="知行科技" appName="知行科技" appSubtitle={menu.label} menuSectionLabel={menu.label} menuItems={items} pageTitle={shell.title} topbarLeftMode="search" searchPlaceholder="搜索工作台" profilePosition="topbar" profile={{ name: "张宁", role: "管理员", avatar: "/images/team/edward-allen.png" }} notifications={3} messages={2} showDatePicker={false} showKebab={false}>
      <div ref={content} className="flex w-full min-w-0 flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">{shell.title}</h1>
          <Breadcrumbs items={trail} />
        </header>
        {shell.with
          ? <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-2"><div className="min-w-0"><BlockPreview name={name} /></div><div className="min-w-0"><BlockPreview name={shell.with} /></div></div>
          : <BlockPreview name={name} />}
      </div>
    </AppLayout>
  </div>;
}
