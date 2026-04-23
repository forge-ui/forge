"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChatDotsLinear, ArrowRightUpLinear } from "solar-icon-set";

type TocItem = { id: string; title: string };

// 扫当前页面 <main> 里所有带 data-case-section 的 section，
// 抽 id/title 形成右侧 TOC。
export function CasesToc() {
  const pathname = usePathname();
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const collect = () => {
      const nodes = document.querySelectorAll<HTMLElement>(
        "main [data-case-section]",
      );
      const list: TocItem[] = [];
      nodes.forEach((el) => {
        const title = el.getAttribute("data-case-section");
        const id = el.id;
        if (title && id) list.push({ id, title });
      });
      setItems(list);
    };
    // 首次挂载和路由变更后都抽一次；部分 case 初始渲染有异步数据，延迟一帧保险。
    collect();
    const raf = requestAnimationFrame(collect);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto xl:block">
      <div className="flex flex-col gap-6 py-8 pr-6">
        {items.length > 0 && (
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
        )}

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
