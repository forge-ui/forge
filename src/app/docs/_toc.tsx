"use client";

import { useSyncExternalStore } from "react";
import { ChatDotsLinear, ArrowRightUpLinear, HamburgerMenuLinear } from "@forge-ui-official/core/icons";
import { cn } from "@forge-ui-official/core";

export interface TocItem {
  id: string;
  title: string;
}

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

export function DocsToc({ items }: { items: TocItem[] }) {
  // The last heading scrolled past the top bar is the current section.
  const active = useSyncExternalStore(
    subscribe,
    () => items.findLast((item) => (document.getElementById(item.id)?.getBoundingClientRect().top ?? Infinity) <= 140)?.id ?? items[0]?.id,
    () => items[0]?.id,
  );
  return (
    <aside className="docs-toc docs-scroll sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto xl:block">
      <div className="flex flex-col gap-8 py-10 pr-4 text-sm">
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-2 text-fg-grey-700"><HamburgerMenuLinear size={16} />本页目录</p>
          <ul className="flex flex-col border-l border-fg-grey-200">
            {items.map((item) => (
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

        <div className="flex flex-col gap-2">
          <a
            href="https://github.com/forge-ui/forge/issues/new"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-fg-grey-700 transition-colors hover:text-fg-black"
          >
            <ChatDotsLinear size={14} color="#71717A" />
            反馈问题
            <ArrowRightUpLinear size={12} color="#71717A" />
          </a>
        </div>
      </div>
    </aside>
  );
}
