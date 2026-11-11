"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@forge-ui-official/core";
import { blocks, categories } from "./_catalog";

const groups = categories.map(category => ({ category, items: blocks.filter(block => block.category === category) })).filter(group => group.items.length);

export function BlocksNav({ activeCategory, activeName, onSelectCategory }: { activeCategory?: string; activeName?: string; onSelectCategory?: (category: string) => void }) {
  const aside = useRef<HTMLElement>(null);
  useEffect(() => {
    const container = aside.current;
    const current = container?.querySelector<HTMLElement>('[aria-current="page"]');
    if (container && current) container.scrollTop = current.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - container.clientHeight / 2;
  }, [activeName]);
  const categoryClass = (active: boolean) => cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-bold tracking-fg transition-colors", active ? "bg-fg-grey-100 text-fg-black" : "text-fg-black hover:bg-background");
  const categoryEntry = (category: string, count: number) => {
    const active = !activeName && activeCategory === category;
    const content = <><span>{category}</span><span className="text-xs font-medium tabular-nums text-fg-grey-500">{count}</span></>;
    return onSelectCategory
      ? <button type="button" aria-pressed={active} className={categoryClass(active)} onClick={() => onSelectCategory(category)}>{content}</button>
      : <Link href={`/blocks?category=${encodeURIComponent(category)}`} className={categoryClass(active)}>{content}</Link>;
  };

  return <aside ref={aside} aria-label="页面组件目录" className="sticky top-16 hidden h-[calc(100vh-4rem)] fg-scrollbar-thin w-64 shrink-0 overflow-y-auto lg:block">
    <nav className="flex flex-col gap-6 px-4 py-8">
      {groups.map(group => <div key={group.category} className="flex flex-col gap-0.5">
        {categoryEntry(group.category, group.items.length)}
        <ul className="ml-3 flex flex-col gap-0.5 border-l border-fg-grey-200 pl-2">
          {group.items.map(block => <li key={block.name}><Link href={`/blocks/${block.name}`} aria-current={activeName === block.name ? "page" : undefined} className={cn("block truncate rounded-lg px-3 py-1.5 text-sm transition-colors", activeName === block.name ? "bg-fg-grey-100 font-bold text-fg-black" : "font-medium text-fg-grey-700 hover:bg-background hover:text-fg-black")}>{block.title}</Link></li>)}
        </ul>
      </div>)}
    </nav>
  </aside>;
}
