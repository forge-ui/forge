"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { AltArrowDownLinear, CheckCircleLinear, CopyLinear, InfoCircleLinear, HamburgerMenuLinear } from "@forge-ui-official/core/icons";
import { cn } from "@forge-ui-official/core";
import { docsNavGroups } from "../docs/_nav";

/** Shows scrollbars only while the page scrolls, like an overlay scrollbar. */
export function ScrollbarAutoHide() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      document.documentElement.dataset.scrolling = "";
      clearTimeout(timer);
      timer = setTimeout(() => delete document.documentElement.dataset.scrolling, 900);
    };
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      clearTimeout(timer);
      delete document.documentElement.dataset.scrolling;
    };
  }, []);
  return null;
}

// The preview page stands in for /docs/quick-start in the nav.
const previewHref = (href: string) => (href === "/docs/quick-start" ? "/docs-preview/quick-start" : href);

export function PreviewSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({ [docsNavGroups[0].title]: true, [docsNavGroups[1].title]: true });
  return (
    <aside className="docs-v2-scroll sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto lg:block">
      <nav aria-label="文档导航" className="flex flex-col gap-6 px-4 py-8 text-sm">
        <Link href="/docs" className="px-2 text-fg-grey-700 hover:text-fg-black">Forge 文档</Link>
        {docsNavGroups.map(group => (
          <div key={group.title} className="flex flex-col gap-1">
            <button
              type="button"
              aria-expanded={open[group.title] ?? false}
              onClick={() => setOpen(current => ({ ...current, [group.title]: !current[group.title] }))}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 text-left font-medium text-fg-black hover:bg-fg-grey-100"
            >
              {group.title}
              <AltArrowDownLinear size={14} className={cn("text-fg-grey-700 transition-transform", !open[group.title] && "-rotate-90")} />
            </button>
            {open[group.title] && (
              <ul className="ml-2 flex flex-col border-l border-fg-grey-200 pl-2">
                {group.items.map(item => {
                  const href = previewHref(item.href);
                  const active = pathname === href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative block rounded-lg px-2.5 py-1.5 transition-colors",
                          active ? "bg-fg-grey-200/70 font-medium text-fg-black before:absolute before:-left-[9px] before:top-1.5 before:bottom-1.5 before:w-px before:bg-fg-black" : "text-fg-grey-700 hover:text-fg-black",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export type PreviewTocItem = { id: string; title: string };

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

export function PreviewToc({ items }: { items: PreviewTocItem[] }) {
  const active = useSyncExternalStore(
    subscribe,
    () => items.findLast(item => (document.getElementById(item.id)?.getBoundingClientRect().top ?? Infinity) <= 140)?.id ?? items[0]?.id,
    () => items[0]?.id,
  );
  return (
    <aside className="docs-v2-scroll sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto xl:block">
      <div className="flex flex-col gap-3 py-10 pr-4 text-sm">
        <p className="flex items-center gap-2 text-fg-grey-700"><HamburgerMenuLinear size={16} />本页目录</p>
        <ul className="flex flex-col border-l border-fg-grey-200">
          {items.map(item => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={item.id === active ? "location" : undefined}
                className={cn("-ml-px block border-l py-1.5 pl-4 leading-5 transition-colors", item.id === active ? "border-fg-black text-fg-black" : "border-transparent text-fg-grey-700 hover:text-fg-black")}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative flex gap-3 overflow-hidden rounded-2xl border border-fg-grey-200 bg-fg-grey-100/60 p-4 pl-5 before:absolute before:inset-y-3 before:left-1.5 before:w-0.5 before:rounded-full before:bg-fg-blue">
      <InfoCircleLinear size={18} className="mt-0.5 shrink-0 text-fg-blue" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="font-semibold text-fg-black">{title}</p>
        <div className="text-[15px] leading-7 text-fg-grey-900">{children}</div>
      </div>
    </div>
  );
}

export function Code({ children, label }: { children: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-fg-grey-200 bg-fg-grey-100/60">
      {label && <div className="border-b border-fg-grey-200 px-4 py-2.5 text-[13px] text-fg-grey-700">{label}</div>}
      <div className="relative">
        <pre className="docs-v2-scroll overflow-x-auto py-3.5 pl-4 pr-12 font-mono text-[13px] leading-6 text-fg-black"><code>{children}</code></pre>
        <button
          type="button"
          aria-label={copied ? "已复制" : "复制代码"}
          onClick={() => navigator.clipboard.writeText(children).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }, () => undefined)}
          className="absolute right-2 top-2 rounded-lg p-1.5 text-fg-grey-700 transition-colors hover:bg-fg-grey-200 hover:text-fg-black"
        >
          {copied ? <CheckCircleLinear size={16} /> : <CopyLinear size={16} />}
        </button>
      </div>
    </div>
  );
}

/** Numbered steps joined by a vertical rule. */
export function Steps({ children }: { children: ReactNode }) {
  return <ol className="docs-v2-steps ml-4 flex flex-col gap-10 border-l border-fg-grey-200 pl-8">{children}</ol>;
}

export function Step({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <li id={id} className="docs-v2-step relative flex scroll-mt-24 flex-col gap-4">
      <h2 className="text-xl font-semibold leading-8 text-fg-black">{title}</h2>
      {children}
    </li>
  );
}
