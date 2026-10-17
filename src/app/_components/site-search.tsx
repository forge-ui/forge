"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { CommandSearch, type CommandSearchItem } from "@forge-ui-official/core";
import { HamburgerMenuLinear, MagniferLinear } from "@forge-ui-official/core/icons";
import { docsNavGroups } from "../docs/_nav";
import { componentsNavGroups } from "../components/_nav";
import { casesNavGroups } from "../cases/_nav";
import pageIndex from "./search-index.json";

const templateItems: CommandSearchItem[] = [
  { id: "/templates", label: "模板", group: "模板", keywords: ["templates", "examples"] },
  { id: "/templates/project-template", label: "项目管理", group: "模板", keywords: ["project"] },
  { id: "/templates/finance-template", label: "财务", group: "模板", keywords: ["finance"] },
  { id: "/templates/crm-template", label: "客户关系", group: "模板", keywords: ["crm"] },
  { id: "/templates/micellaneous-template", label: "杂项", group: "模板", keywords: ["calendar", "chat", "files"] },
  { id: "/templates/ecommerce/products", label: "电商后台", group: "模板", keywords: ["ecommerce"] },
  { id: "/templates/dashboard-builder", label: "仪表盘外壳", group: "模板", keywords: ["dashboard", "builder"] },
  { id: "/templates/dashboards", label: "仪表盘", group: "模板", keywords: ["dashboards"] },
  { id: "/templates/agent", label: "智能体", group: "模板", keywords: ["agent", "chat"] },
];

const searchItems: CommandSearchItem[] = [...(pageIndex as CommandSearchItem[]), ...templateItems].filter(
  (item, index, all) => all.findIndex((other) => other.id === item.id) === index,
);

function directoryGroups(pathname: string) {
  if (pathname === "/components" || pathname.startsWith("/components/")) return componentsNavGroups;
  if (pathname === "/cases" || pathname.startsWith("/cases/")) return casesNavGroups;
  if (pathname === "/docs" || pathname.startsWith("/docs/")) return docsNavGroups;
  return null;
}

export function SiteSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const [panel, setPanel] = useState<"search" | "menu" | null>(null);
  const [panelPath, setPanelPath] = useState(pathname);
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const groups = directoryGroups(pathname);
  if (pathname !== panelPath) {
    setPanelPath(pathname);
    setPanel(null);
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPanel("search");
      }
      if (event.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const menu = useMemo(() => groups, [groups]);

  function go(href: string) {
    setPanel(null);
    router.push(href);
  }

  return (
    <>
      <div className="relative ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        {menu && (
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-fg-grey-900 hover:bg-black/[0.04] lg:hidden"
            aria-expanded={panel === "menu"}
            onClick={() => setPanel(panel === "menu" ? null : "menu")}
          >
            <HamburgerMenuLinear size={16} color="currentColor" />
            <span>目录</span>
          </button>
        )}
        <button
          type="button"
          className="relative hidden h-9 w-56 items-center rounded-lg bg-black/[0.04] pl-9 pr-3 text-left text-sm text-fg-grey-700 hover:bg-black/[0.06] xl:flex"
          onClick={() => setPanel("search")}
        >
          <MagniferLinear size={14} color="#71717A" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <span className="flex-1 truncate">搜索文档...</span>
          <kbd className="rounded border border-fg-grey-200 bg-white px-1.5 py-0.5 text-[11px] text-fg-grey-700">⌘K</kbd>
        </button>
        <button
          type="button"
          aria-label="搜索文档"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-fg-grey-900 hover:bg-black/[0.04] xl:hidden"
          onClick={() => setPanel("search")}
        >
          <MagniferLinear size={16} color="currentColor" />
        </button>
        {panel === "menu" && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setPanel(null)} />
            <div className="absolute right-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-1.5rem))]" role="dialog" aria-label="目录">
              <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-fg-grey-200 bg-white p-3">
                {menu?.map((group) => (
                  <div key={group.title} className="mb-3 last:mb-0">
                    <p className="px-3 py-1.5 text-xs font-semibold text-fg-grey-500">{group.title}</p>
                    {group.items.filter((item) => item.href.startsWith("/")).map((item) => (
                      <button
                        key={item.href}
                        type="button"
                        className="flex w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-fg-black hover:bg-fg-grey-50"
                        onClick={() => go(item.href)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {mounted && panel === "search" && createPortal(
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-white/40 px-4 pt-[14vh] backdrop-blur-xl"
          onClick={() => setPanel(null)}
        >
          <div
            className="relative w-full max-w-lg [&_input]:pr-14"
            role="dialog"
            aria-label="搜索"
            onClick={(event) => event.stopPropagation()}
          >
            <CommandSearch
              items={searchItems}
              autoFocus
              color="black"
              placeholder="搜索组件、案例和文档"
              emptyLabel="没有匹配的页面"
              onSelect={(item) => go(item.id)}
            />
            <kbd className="pointer-events-none absolute right-3 top-3.5 rounded-md border border-fg-grey-200 bg-fg-grey-50 px-1.5 py-0.5 text-[11px] font-medium text-fg-grey-500">
              ESC
            </kbd>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
