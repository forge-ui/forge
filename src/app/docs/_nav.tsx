"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRightUpLinear,
  DangerTriangleLinear,
  DownloadLinear,
  ClockCircleLinear,
  DocumentTextLinear,
  FileTextLinear,
  FlagLinear,
  FolderLinear,
  StarsLinear,
  WidgetLinear,
} from "@forge-ui-official/core/icons";
import { cn } from "@forge-ui-official/core";

type NavIcon = typeof DocumentTextLinear;

type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
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
      { href: "/docs", label: "介绍", icon: DocumentTextLinear },
      { href: "/docs/quick-start", label: "快速开始", icon: FlagLinear },
      { href: "/docs/installation", label: "详细安装", icon: DownloadLinear },
      { href: "/docs/troubleshoot", label: "故障排查", icon: DangerTriangleLinear },
      { href: "/docs/changelog", label: "更新日志", icon: ClockCircleLinear },
    ],
  },
  {
    title: "UI for Agents",
    items: [
      { href: "/docs/ui-for-agents", label: "Skill", icon: StarsLinear },
      { href: "/docs/agents-md", label: "AGENTS.md", icon: FileTextLinear },
    ],
  },
  {
    title: "参考",
    items: [
      { href: "/cases", label: "组件案例", icon: WidgetLinear, external: true },
      { href: "/templates", label: "模板", icon: FolderLinear, external: true },
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
                  <span className="flex items-center gap-2">
                    <item.icon size={16} color="currentColor" />
                    <span>{item.label}</span>
                  </span>
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
