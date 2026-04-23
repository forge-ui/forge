"use client";

import { ChatDotsLinear, ArrowRightUpLinear } from "solar-icon-set";

export interface TocItem {
  id: string;
  title: string;
}

export function DocsToc({ items }: { items: TocItem[] }) {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto xl:block">
      <div className="flex flex-col gap-6 py-8 pr-6">
        <div className="flex flex-col gap-3">
          <p className="text-[15px] font-bold tracking-fg text-fg-black">
            本页目录
          </p>
          <nav className="flex flex-col gap-2">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm font-semibold text-fg-grey-900 transition-colors hover:text-fg-violet"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-semibold text-fg-grey-900 hover:text-fg-black transition-colors"
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
