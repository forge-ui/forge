import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { SiteHeader } from "@/app/_components/site-header";
import { blocks } from "./_catalog";
import { BlocksGallery } from "./_gallery";

export const metadata: Metadata = pageMetadata("/blocks");

export default function BlocksPage() {
  return <div className="flex min-h-screen flex-col bg-fg-grey-50"><SiteHeader /><BlocksGallery header={<header><div className="flex items-center gap-3"><h1 className="text-3xl font-bold tracking-fg text-fg-black sm:text-4xl">页面组件</h1><span className="rounded-full border border-fg-grey-200 bg-background px-2.5 py-1 text-sm font-medium tabular-nums text-fg-grey-700">{blocks.length}</span></div><p className="mt-3 max-w-2xl text-base leading-7 text-fg-grey-700">可直接复制进项目的页面组件，基于 core 组件与设计 token。</p></header>} /></div>;
}
