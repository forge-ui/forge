"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ButtonGroup } from "@forge-ui-official/core";
import { blocks, categoryItems, installationCommand } from "./_catalog";
import { CopyButton } from "./_copy-button";
import { PreviewFrame } from "./_preview-frame";
import { BlocksNav } from "./_nav";

export function PreviewThumbnail({ name }: { name: string }) {
  return <PreviewFrame name={name} thumbnail />;
}

export function BlocksGallery({ header }: { header?: ReactNode }) {
  const [category, setCategory] = useState("");
  useEffect(() => {
    function restoreCategory() {
      const requested = new URLSearchParams(window.location.search).get("category");
      setCategory(categoryItems.some(item => item.category === requested) ? requested! : "");
    }
    restoreCategory();
    window.addEventListener("popstate", restoreCategory);
    return () => window.removeEventListener("popstate", restoreCategory);
  }, []);

  function selectCategory(requested: string) {
    const selected = requested === category ? "" : requested;
    setCategory(selected);
    const url = new URL(window.location.href);
    if (!selected) url.searchParams.delete("category");
    else url.searchParams.set("category", selected);
    window.history.pushState(null, "", url);
  }

  const visible = blocks.filter(block => !category || block.category === category);
  return <div className="mx-auto flex w-full max-w-[1440px] flex-1">
    <BlocksNav activeCategory={category} onSelectCategory={selectCategory} />
    <main className="min-w-0 flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
  <section aria-label="页面组件画廊" className="flex flex-col gap-6">
    {header}
    <div className="fg-scrollbar-hidden -mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:hidden"><ButtonGroup items={categoryItems} activeIndex={categoryItems.findIndex(item => item.category === category)} onChange={index => selectCategory(categoryItems[index].category)} ariaLabel="页面组件分类" className="w-max whitespace-nowrap" /></div>
    <p role="status" className="sr-only">{category || "全部页面组件"}，共 {visible.length} 个页面组件</p>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {visible.map(block => <article key={block.name} className="group relative min-w-0 rounded-3xl border border-fg-grey-200 bg-white transition-shadow hover:shadow-elevated focus-within:ring-2 focus-within:ring-fg-blue">
        <div className="relative overflow-hidden rounded-t-3xl"><PreviewThumbnail name={block.name} /></div>
        <div className="flex items-end gap-3 p-5"><div className="min-w-0 flex-1"><h2 className="truncate text-base font-semibold text-fg-black"><Link href={`/blocks/${block.name}`} className="outline-none after:absolute after:inset-0 after:rounded-3xl" aria-label={`查看${block.title}页面组件`}>{block.title}</Link></h2><p className="mt-2 truncate text-sm text-fg-grey-700" title={block.description}>{block.description}</p></div><div className="relative z-10"><CopyButton compact value={installationCommand(block.name)} label={`复制${block.title}安装命令`} /></div></div>
      </article>)}
    </div>
  </section>
    </main>
  </div>;
}
