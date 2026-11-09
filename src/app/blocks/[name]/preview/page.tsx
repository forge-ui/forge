import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blocks } from "../../_catalog";
import { BlockShell } from "../../_shell";

export const dynamicParams = false;
export const metadata: Metadata = { title: "页面组件预览 · Forge UI", robots: { index: false, follow: false } };

export function generateStaticParams() {
  return blocks.map(({ name }) => ({ name }));
}

export default async function BlockPreviewPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!blocks.some(block => block.name === name)) notFound();
  return <BlockShell name={name} />;
}
