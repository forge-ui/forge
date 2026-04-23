"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightUpLinear } from "solar-icon-set";
import { cn } from "@forge-ui/react";

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

export const docsNavGroups: NavGroup[] = [
  {
    title: "入门",
    items: [
      { href: "/docs", label: "介绍" },
      { href: "/docs/quick-start", label: "快速开始" },
      { href: "/docs/installation", label: "详细安装" },
      { href: "/docs/troubleshoot", label: "故障排查" },
    ],
  },
  {
    title: "UI for Agents",
    items: [
      { href: "/docs/ui-for-agents", label: "Skill" },
      { href: "/docs/agents-md", label: "AGENTS.md" },
    ],
  },
  {
    title: "参考",
    items: [
      { href: "/docs", label: "组件示例", external: true },
      { href: "/templates", label: "模版", external: true },
    ],
  },
];

export function DocsNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto lg:block">
      <nav className="flex flex-col gap-10 px-4 py-8">
        {docsNavGroups.map((g) => (
          <div key={g.title} className="flex flex-col gap-1.5">
            <p className="mb-2 px-3 text-base font-bold tracking-fg text-fg-black">
              {g.title}
            </p>
            {g.items.map((item) => {
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
