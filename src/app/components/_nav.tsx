"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightUpLinear } from "solar-icon-set";
import { cn } from "@forge-ui/react";

type NavItem = { href: string; label: string; external?: boolean };
type NavGroup = { title: string; items: NavItem[] };

// Foundations 单列分组（Style Guide + File Type），其余 22 个按字母序
export const componentsNavGroups: NavGroup[] = [
  {
    title: "Foundations",
    items: [
      { href: "/components/style-guide", label: "Style Guide" },
      { href: "/components/file-type", label: "File Type" },
    ],
  },
  {
    title: "Components",
    items: [
      { href: "/components/badge", label: "Badge" },
      { href: "/components/button-link", label: "Button & Link" },
      { href: "/components/calendar", label: "Calendar" },
      { href: "/components/card", label: "Card" },
      { href: "/components/chart", label: "Chart" },
      { href: "/components/chat", label: "Chat" },
      { href: "/components/comment", label: "Comment" },
      { href: "/components/filter", label: "Filter" },
      { href: "/components/history", label: "History" },
      { href: "/components/input-field", label: "Input Field" },
      { href: "/components/list", label: "List" },
      { href: "/components/map", label: "Map" },
      { href: "/components/menu", label: "Menu" },
      { href: "/components/modal", label: "Modal" },
      { href: "/components/other-widget", label: "Other Widget" },
      { href: "/components/page-header", label: "Page Header" },
      { href: "/components/pagination-stepper", label: "Pagination & Stepper" },
      { href: "/components/progress", label: "Progress" },
      { href: "/components/tab", label: "Tab" },
      { href: "/components/table", label: "Table" },
      { href: "/components/toolbar", label: "Toolbar" },
      { href: "/components/tooltip", label: "Tooltip" },
    ],
  },
  {
    title: "参考",
    items: [
      { href: "/cases", label: "矩阵展示", external: true },
      { href: "/docs", label: "文档", external: true },
      { href: "/templates", label: "模版", external: true },
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
