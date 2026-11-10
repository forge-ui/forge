"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@forge-ui-official/core";
import { kitNavGroups } from "./kit-nav";

const surfacesBySlug = new Map(
  kitNavGroups.flatMap((group) => group.items).map((item) => [item.slug, item.surfaces ?? ["components", "cases"]]),
);

export function ComponentSurfaceTabs() {
  const pathname = usePathname();
  const [surface, slug] = pathname.split("/").filter(Boolean);
  const surfaces = slug ? surfacesBySlug.get(slug) : undefined;
  if (!surfaces || surfaces.length < 2) return null;

  const tabs = [
    { surface: "cases", href: `/cases/${slug}`, label: "效果与案例" },
    { surface: "components", href: `/components/${slug}`, label: "用法与参数" },
  ];

  return (
    <nav aria-label="组件页面" className="-mb-4 flex gap-6 border-b border-fg-grey-200">
      {tabs.map((tab) => {
        const active = tab.surface === surface;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 pb-3 text-sm tracking-fg transition-colors",
              active
                ? "border-fg-black font-bold text-fg-black"
                : "border-transparent font-semibold text-fg-grey-900 hover:text-fg-black",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
