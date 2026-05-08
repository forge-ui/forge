"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightUpLinear } from "solar-icon-set";
import { cn } from "@forge-ui-official/core";

type NavItem = { href: string; label: string; external?: boolean };
type NavGroup = { title: string; items: NavItem[] };

// cases 矩阵：22 个组件按字母序（Foundations 已挪到 components 侧）。
export const casesNavGroups: NavGroup[] = [
  {
    title: "Components",
    items: [
      { href: "/cases/badge", label: "Badge" },
      { href: "/cases/button-link", label: "Button & Link" },
      { href: "/cases/calendar", label: "Calendar" },
      { href: "/cases/card", label: "Card" },
      { href: "/cases/chart", label: "Chart" },
      { href: "/cases/chat", label: "Chat" },
      { href: "/cases/comment", label: "Comment & Discussion" },
      { href: "/cases/filter", label: "Filter" },
      { href: "/cases/history", label: "History" },
      { href: "/cases/input-field", label: "Input Field" },
      { href: "/cases/list", label: "List" },
      { href: "/cases/map", label: "Map" },
      { href: "/cases/menu", label: "Menu" },
      { href: "/cases/modal", label: "Modal" },
      { href: "/cases/other-widget", label: "Other Widget" },
      { href: "/cases/page-header", label: "Page Header" },
      { href: "/cases/pagination-stepper", label: "Pagination & Stepper" },
      { href: "/cases/progress", label: "Progress" },
      { href: "/cases/tab", label: "Tab" },
      { href: "/cases/table", label: "Table" },
      { href: "/cases/toolbar", label: "Toolbar" },
      { href: "/cases/tooltip", label: "Tooltip" },
    ],
  },
  {
    title: "参考",
    items: [
      { href: "/docs", label: "文档", external: true },
      { href: "/templates", label: "模版", external: true },
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
