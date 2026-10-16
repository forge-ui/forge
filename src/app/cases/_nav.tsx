"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightUpLinear } from "@forge-ui-official/core/icons";
import { cn } from "@forge-ui-official/core";

type NavItem = { href: string; label: string; external?: boolean };
type NavGroup = { title: string; items: NavItem[] };

// cases 矩阵：组件按字母序（Foundations 已挪到 components 侧）。
export const casesNavGroups: NavGroup[] = [
  {
    title: "组件案例",
    items: [
      { href: "/cases/agent", label: "智能体" },
      { href: "/cases/badge", label: "徽章与标签" },
      { href: "/cases/button-link", label: "按钮与链接" },
      { href: "/cases/calendar", label: "日历与日程" },
      { href: "/cases/card", label: "卡片" },
      { href: "/cases/chart", label: "图表" },
      { href: "/cases/chat", label: "聊天" },
      { href: "/cases/chat-input-bar", label: "消息输入栏" },
      { href: "/cases/checklist", label: "待办清单" },
      { href: "/cases/comment", label: "评论与评价" },
      { href: "/cases/filter", label: "筛选" },
      { href: "/cases/grid", label: "布局栅格" },
      { href: "/cases/history", label: "历史记录" },
      { href: "/cases/input-field", label: "表单与输入" },
      { href: "/cases/list", label: "列表" },
      { href: "/cases/map", label: "地图" },
      { href: "/cases/menu", label: "菜单" },
      { href: "/cases/menu-sections", label: "侧栏分组" },
      { href: "/cases/modal", label: "确认弹窗" },
      { href: "/cases/other-widget", label: "实用组件" },
      { href: "/cases/page-header", label: "页面顶栏" },
      { href: "/cases/pagination-stepper", label: "分页与步骤" },
      { href: "/cases/progress", label: "进度" },
      { href: "/cases/tab", label: "页签与切换" },
      { href: "/cases/table", label: "数据表格" },
      { href: "/cases/toolbar", label: "工具栏" },
      { href: "/cases/tooltip", label: "提示气泡" },
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

export function CasesNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto lg:block">
      <nav className="flex flex-col gap-10 px-4 py-8">
        {casesNavGroups.map((group) => (
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
