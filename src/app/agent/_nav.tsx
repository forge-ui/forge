"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@forge-ui-official/core";
import { ArrowRightUpLinear } from "@forge-ui-official/core/icons";
import { AGENT_ENTRIES, AGENT_GROUPS } from "./_kit/_agent-meta";

type NavItem = { href: string; label: string; external?: boolean };

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "开始",
    items: [
      { href: "/agent", label: "概览与接入" },
      { href: "/agent/scenarios", label: "场景" },
      { href: "/agent/motion", label: "动效" },
      { href: "/agent/api", label: "全部组件与 API" },
    ],
  },
  ...AGENT_GROUPS.map(group => ({
    title: group.title,
    items: AGENT_ENTRIES.filter(entry => entry.group === group.title).map(entry => ({ href: `/agent/${entry.slug}`, label: entry.title.split(" · ")[0] })),
  })),
  {
    title: "资源",
    items: [
      { href: "/blocks", label: "AI 页面组件", external: true },
      { href: "/templates/agent", label: "智能体模板", external: true },
    ],
  },
];

export function AgentNav() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto lg:block">
      <nav aria-label="Forge Agent" className="flex flex-col gap-6 px-4 py-8">
        {GROUPS.map(group => (
          <div key={group.title} className="flex flex-col gap-0.5">
            <p className="mb-1.5 px-3 text-xs font-semibold tracking-fg text-fg-grey-500">{group.title}</p>
            {group.items.map(item => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}
                  className={cn("flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors", active ? "bg-fg-grey-100 font-bold text-fg-black" : "font-medium text-fg-grey-900 hover:bg-background hover:text-fg-black")}>
                  <span className="truncate">{item.label}</span>
                  {item.external && <ArrowRightUpLinear size={12} color="var(--fg-grey-500)" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
