import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import data from "@/lib/mcp/data.json";
import { DocArticle, DocHeader } from "../docs/_shared";

export const metadata = pageMetadata("/guides");
export default function GuidesPage() {
  return <DocArticle><DocHeader title="使用指南" description="从业务需要出发，按 Screen → Blocks → Components 选择配方。" /><ul className="flex flex-col gap-4">{data.guides.map(guide => <li key={guide.slug}><Link className="text-fg-blue-600 underline" href={"/guides/" + guide.slug}>{guide.title}</Link></li>)}</ul></DocArticle>;
}

