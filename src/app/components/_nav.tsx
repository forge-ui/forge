"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightUpLinear } from "@forge-ui-official/core/icons";
import { cn } from "@forge-ui-official/core";

type NavItem = { href: string; label: string; external?: boolean };
type NavGroup = { title: string; items: NavItem[] };

// Foundations 单列分组（Style Guide + File Type），其余按字母序
export const componentsNavGroups: NavGroup[] = [
  {
    title: "设计基础",
    items: [
      { href: "/components/style-guide", label: "设计规范" },
      { href: "/components/file-type", label: "文件展示" },
    ],
  },
  {
    title: "组件",
    items: [
      { href: "/components/agent", label: "智能体" },
      { href: "/components/badge", label: "徽章与标签" },
      { href: "/components/button-link", label: "按钮与链接" },
      { href: "/components/calendar", label: "日历与日程" },
      { href: "/components/card", label: "卡片" },
      { href: "/components/chart", label: "图表" },
      { href: "/components/chat", label: "聊天" },
      { href: "/components/chat-input-bar", label: "消息输入栏" },
      { href: "/components/checklist", label: "待办清单" },
      { href: "/components/comment", label: "评论与评价" },
      { href: "/components/filter", label: "筛选" },
      { href: "/components/grid", label: "布局栅格" },
      { href: "/components/history", label: "历史记录" },
      { href: "/components/input-field", label: "表单与输入" },
      { href: "/components/list", label: "列表" },
      { href: "/components/map", label: "地图" },
      { href: "/components/menu", label: "菜单" },
      { href: "/components/menu-sections", label: "应用布局" },
      { href: "/components/modal", label: "确认弹窗" },
      { href: "/components/page-header", label: "页面顶栏" },
      { href: "/components/pagination-stepper", label: "分页与步骤" },
      { href: "/components/progress", label: "进度" },
      { href: "/components/tab", label: "页签与切换" },
      { href: "/components/table", label: "数据表格" },
      { href: "/components/toolbar", label: "工具栏" },
      { href: "/components/tooltip", label: "提示气泡" },
    ],
  },
  {
    title: "参考",
    items: [
      { href: "/docs", label: "文档", external: true },
      { href: "/templates", label: "模板", external: true },
    ],
  },
];

export function ComponentsNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto lg:block">
      <nav className="flex flex-col gap-10 px-4 py-8">
        {componentsNavGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1.5">
            <p className="mb-2 px-3 text-base font-bold tracking-fg text-fg-black">
              {group.title}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-fg-grey-100 font-bold text-fg-black"
                      : "font-semibold text-fg-grey-900 hover:bg-white hover:text-fg-black",
                  )}
                >
                  <span>{item.label}</span>
                  {item.external && (
                    <ArrowRightUpLinear size={12} color="#71717A" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
