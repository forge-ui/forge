import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeftLinear, ArrowRightLinear } from "@forge-ui-official/core/icons";
import { SiteHeader } from "@/app/_components/site-header";
import { blocks, formatPropType, installationCommand } from "../_catalog";
import { BlockShowcase, CodePanel } from "../_block-showcase";
import { BlocksNav } from "../_nav";
import { CopyButton } from "../_copy-button";
import { getRegistryBlock } from "../_registry";

type BlockPageProps = { params: Promise<{ name: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return blocks.map(block => ({ name: block.name }));
}

export async function generateMetadata({ params }: BlockPageProps): Promise<Metadata> {
  const { name } = await params;
  const block = blocks.find(item => item.name === name);
  if (!block) notFound();
  return { title: `${block.title} · 页面组件 · Forge UI`, description: block.description, alternates: { canonical: `https://forgeui.org/blocks/${name}` } };
}

export default async function BlockPage({ params }: BlockPageProps) {
  const { name } = await params;
  const index = blocks.findIndex(item => item.name === name);
  const registry = getRegistryBlock(name);
  if (index < 0 || !registry) notFound();
  const block = blocks[index];
  const previous = blocks[index - 1];
  const next = blocks[index + 1];
  const command = installationCommand(name);
  return <div className="flex min-h-screen flex-col bg-fg-grey-50"><SiteHeader /><div className="mx-auto flex w-full max-w-[1440px] flex-1"><BlocksNav activeName={name} /><main className="flex min-w-0 flex-1 flex-col gap-10 px-4 py-10 sm:px-6 lg:px-10">
    <BlockShowcase name={name} header={<header className="flex flex-col gap-5"><nav aria-label="面包屑"><ol className="flex flex-wrap items-center gap-2 text-sm text-fg-grey-500"><li><Link href="/blocks" className="hover:text-fg-blue">页面组件</Link></li><li aria-hidden>›</li><li><Link href={`/blocks?category=${encodeURIComponent(block.category)}`} className="hover:text-fg-blue">{block.category}</Link></li><li aria-hidden>›</li><li aria-current="page" className="text-fg-grey-900">{block.title}</li></ol></nav><div><h1 className="text-3xl font-bold tracking-fg text-fg-black sm:text-4xl">{block.title}</h1><p className="mt-3 max-w-3xl text-base leading-7 text-fg-grey-700">{block.description}</p></div></header>} />
    <section aria-labelledby="installation" className="flex flex-col gap-4"><h2 id="installation" className="text-xl font-semibold text-fg-black">安装</h2><div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-fg-grey-200 bg-white p-4"><code className="min-w-0 flex-1 break-all font-mono text-sm text-fg-grey-900">{command}</code><CopyButton value={command} label="复制命令" /></div><p className="text-sm leading-6 text-fg-grey-700">依赖 <code className="rounded bg-fg-grey-100 px-1.5 py-0.5 font-mono text-xs">@forge-ui-official/core@{registry.meta.core.version}</code>。源码安装到项目的 <code className="font-mono text-xs">components/blocks/{name}.tsx</code>，可直接修改并接入业务数据。</p></section>
    <section aria-labelledby="usage" className="flex min-w-0 flex-col gap-4"><h2 id="usage" className="text-xl font-semibold text-fg-black">用法</h2><CodePanel source={registry.meta.example} label="用法示例" /></section>
    <section aria-labelledby="source" className="flex min-w-0 flex-col gap-4"><h2 id="source" className="text-xl font-semibold text-fg-black">源码</h2><CodePanel source={registry.files[0].content} label={`${name}.tsx`} /></section>
    <section aria-labelledby="props" className="flex min-w-0 flex-col gap-5"><div><h2 id="props" className="text-xl font-semibold text-fg-black">Props</h2><p className="mt-2 text-sm text-fg-grey-700">当前页面组件所有导出的参数与类型。</p></div>{registry.meta.props.map(component => <div key={component.component} className="flex min-w-0 flex-col gap-3"><h3 className="font-mono text-sm font-semibold text-fg-grey-900">{component.component}</h3><div className="fg-scrollbar-thin overflow-x-auto rounded-xl border border-fg-grey-200 bg-white"><table className="w-full min-w-[540px] table-fixed border-collapse text-left text-sm"><colgroup><col className="w-[24%]" /><col className="w-[12%]" /><col className="w-[64%]" /></colgroup><thead className="border-b border-fg-grey-200 bg-fg-grey-50 text-xs text-fg-grey-700"><tr><th scope="col" className="px-4 py-3 font-semibold">参数</th><th scope="col" className="px-4 py-3 font-semibold">必填</th><th scope="col" className="px-4 py-3 font-semibold">类型</th></tr></thead><tbody>{component.properties.map(property => <tr key={property.name} className="border-b border-fg-grey-200 last:border-0"><td className="px-4 py-3 align-top"><code className="break-all font-mono text-[13px] text-fg-blue">{property.name}</code></td><td className="px-4 py-3 align-top text-fg-grey-700">{property.required ? "是" : "否"}</td><td className="px-4 py-3 align-top"><code className="break-all font-mono text-xs leading-6 text-fg-grey-900">{formatPropType(property.type)}</code></td></tr>)}</tbody></table></div></div>)}</section>
    <section aria-labelledby="screens" className="flex flex-col gap-4"><h2 id="screens" className="text-xl font-semibold text-fg-black">相关模板</h2><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{registry.meta.screens.map(screen => <Link key={screen.href} href={screen.href} className="flex items-center justify-between gap-3 rounded-2xl border border-fg-grey-200 bg-white p-4 text-sm font-semibold text-fg-grey-900 transition-colors hover:border-fg-grey-400 focus-visible:outline-2 focus-visible:outline-fg-blue">{screen.title}<ArrowRightLinear size={16} /></Link>)}</div></section>
    <nav aria-label="相邻页面组件" className="grid grid-cols-2 gap-4 border-t border-fg-grey-200 pt-6">{previous ? <Link href={`/blocks/${previous.name}`} className="flex min-w-0 items-center gap-3 rounded-2xl border border-fg-grey-200 bg-white p-4 hover:border-fg-grey-400"><ArrowLeftLinear size={18} /><div className="min-w-0"><p className="text-xs text-fg-grey-500">上一个页面组件</p><p className="mt-1 truncate text-sm font-semibold text-fg-black">{previous.title}</p></div></Link> : <span />}{next && <Link href={`/blocks/${next.name}`} className="flex min-w-0 items-center justify-end gap-3 rounded-2xl border border-fg-grey-200 bg-white p-4 text-right hover:border-fg-grey-400"><div className="min-w-0"><p className="text-xs text-fg-grey-500">下一个页面组件</p><p className="mt-1 truncate text-sm font-semibold text-fg-black">{next.title}</p></div><ArrowRightLinear size={18} /></Link>}</nav>
  </main></div></div>;
}
