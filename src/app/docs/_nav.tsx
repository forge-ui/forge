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
                      : "font-semibold text-fg-grey-900 hover:bg-background hover:text-fg-black",
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
