"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightUpLinear } from "@forge-ui-official/core/icons";
import { cn } from "@forge-ui-official/core";
import { componentEntryGroups } from "../_components/kit-nav";

type NavItem = { href: string; label: string; external?: boolean };
type NavGroup = { title: string; items: NavItem[] };

export const componentsNavGroups: NavGroup[] = [
  ...componentEntryGroups(),
  {
    title: "参考",
    items: [
      { href: "/cases/dashboard-kit", label: "看板组件" },
      { href: "/blocks", label: "页面组件", external: true },
      { href: "/docs", label: "文档", external: true },
      { href: "/templates", label: "模板", external: true },
    ],
  },
];

export function ComponentsNav() {
  const pathname = usePathname();
  const slugOf = (href: string) => href.match(/^\/(?:cases|components)\/([^/]+)/)?.[1];
  const currentSlug = slugOf(pathname);

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto lg:block">
      <nav className="flex flex-col gap-8 px-4 py-8">
        {componentsNavGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1.5">
            <p className="mb-2 px-3 text-base font-bold tracking-fg text-fg-black">
              {group.title}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`) || (currentSlug !== undefined && slugOf(item.href) === currentSlug);
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
