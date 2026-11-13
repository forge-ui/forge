"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AltArrowDownLinear,
  ArrowRightUpLinear,
  DangerTriangleLinear,
  DownloadLinear,
  ClockCircleLinear,
  DocumentTextLinear,
  FileTextLinear,
  FlagLinear,
  FolderLinear,
  PenLinear,
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
      { href: "/guides", label: "使用指南", icon: DocumentTextLinear },
      { href: "/docs/installation", label: "详细安装", icon: DownloadLinear },
      { href: "/docs/theme", label: "主题定制", icon: PenLinear },
      { href: "/docs/troubleshoot", label: "故障排查", icon: DangerTriangleLinear },
      { href: "/docs/changelog", label: "更新日志", icon: ClockCircleLinear },
    ],
  },
  {
    title: "UI for Agents",
    items: [
      { href: "/docs/ui-for-agents", label: "前端设计 Skill", icon: StarsLinear },
      { href: "/docs/mcp", label: "MCP 服务器", icon: StarsLinear },
      { href: "/docs/check", label: "页面检查", icon: StarsLinear },
      { href: "/docs/agents-md", label: "AGENTS.md", icon: FileTextLinear },
      { href: "/docs/design-md", label: "DESIGN.md", icon: FileTextLinear },
      { href: "/docs/llms-txt", label: "LLMs.txt", icon: FileTextLinear },
    ],
  },
  {
    title: "参考",
    items: [
      { href: "/components", label: "组件", icon: WidgetLinear, external: true },
      { href: "/blocks", label: "页面组件", icon: WidgetLinear, external: true },
      { href: "/templates", label: "模板", icon: FolderLinear, external: true },
    ],
  },
];

export function DocsNav() {
  const pathname = usePathname();
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  return (
    <aside className="docs-scroll sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto lg:block">
      <nav aria-label="文档导航" className="flex flex-col gap-6 px-4 py-8 text-sm">
        {docsNavGroups.map((group) => {
          const open = !closed[group.title];
          return (
            <div key={group.title} className="flex flex-col gap-1">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setClosed((current) => ({ ...current, [group.title]: open }))}
                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-left font-medium text-fg-black hover:bg-fg-grey-100"
              >
                {group.title}
                <AltArrowDownLinear size={14} className={cn("text-fg-grey-700 transition-transform", !open && "-rotate-90")} />
              </button>
              {open && (
                <ul className="ml-2 flex flex-col border-l border-fg-grey-200 pl-2">
                  {group.items.map((item) => {
                    const active = pathname === item.href || (item.href === "/guides" && pathname.startsWith("/guides/"));
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "relative flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors",
                            active
                              ? "bg-fg-grey-200/70 font-medium text-fg-black before:absolute before:-left-[9px] before:top-1.5 before:bottom-1.5 before:w-px before:bg-fg-black"
                              : "text-fg-grey-700 hover:text-fg-black",
                          )}
                        >
                          {item.label}
                          {item.external && <ArrowRightUpLinear size={12} className="text-fg-grey-500" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
