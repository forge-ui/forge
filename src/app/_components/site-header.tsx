"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagniferLinear } from "solar-icon-set";
import { cn } from "@forge-ui/react";
import { asset } from "@/lib/asset";

const tabs = [
  { href: "/docs", label: "文档" },
  { href: "/components", label: "组件" },
  { href: "/cases", label: "组件案例" },
  { href: "/templates", label: "模版" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-fg-grey-200 bg-fg-grey-50/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center">
        {/* Logo column: aligns with sidebar (w-64 px-4 + item px-3) */}
        <div className="flex w-64 shrink-0 items-center px-4">
          <Link href="/" className="flex items-center gap-2 px-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/images/forge-logo.svg")} alt="Forge" className="size-7" />
            <span className="font-display text-lg font-bold tracking-fg text-fg-black">
              Forge
            </span>
          </Link>
        </div>

        {/* Right column: aligns with main content (px-8 lg:px-12) */}
        <div className="flex flex-1 items-center gap-6 px-8 lg:px-12">
          <nav className="flex items-center gap-7">
            {tabs.map((t) => {
              const active = pathname === t.href || pathname.startsWith(t.href + "/");
              return (
                <Link
                  key={t.label}
                  href={t.href}
                  className={cn(
                    "text-sm tracking-fg transition-colors",
                    active
                      ? "font-bold text-fg-black"
                      : "font-semibold text-fg-grey-900 hover:text-fg-black",
                  )}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-6">
            <button
              type="button"
              className="relative flex h-9 w-64 items-center rounded-lg bg-black/[0.04] pl-9 pr-3 text-left text-sm text-fg-grey-700 transition-colors hover:bg-black/[0.06]"
            >
              <MagniferLinear
                size={14}
                color="#71717A"
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
              <span className="flex-1 truncate">搜索文档...</span>
            </button>
            <a
              href="https://github.com/forge-ui/forge"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-fg-grey-900 hover:text-fg-black transition-colors"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.57.11.78-.25.78-.55 0-.27-.01-1.18-.02-2.14-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.93 10.93 0 0 1 5.73 0c2.18-1.48 3.14-1.17 3.14-1.17.63 1.58.23 2.75.12 3.04.73.8 1.17 1.82 1.17 3.07 0 4.4-2.69 5.37-5.26 5.65.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .3.2.67.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
