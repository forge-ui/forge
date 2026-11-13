import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import data from "@/lib/mcp/data.json";
import { DocArticle, DocHeader } from "../docs/_shared";

export const metadata = pageMetadata("/guides");

// First sentence of the guide's opening section ("需要什么"), as a one-line summary on the card.
const summary = (content: string) => content.split("\n## ")[1]?.split("\n").slice(1).find(line => line.trim())?.split("。")[0]?.trim() ?? "";

export default function GuidesPage() {
  return (
    <DocArticle>
      <DocHeader title="使用指南" breadcrumbs={[{ label: "文档", href: "/docs" }, { label: "使用指南" }]} description="从业务需要出发，按 Screen → Blocks → Components 选择配方。" />
      <ul className="grid gap-3 sm:grid-cols-2">
        {data.guides.map(guide => (
          <li key={guide.slug}>
            <Link href={"/guides/" + guide.slug} className="flex h-full flex-col gap-1.5 rounded-2xl border border-fg-grey-200 bg-background p-5 transition-colors hover:border-fg-grey-300">
              <span className="font-medium text-fg-black">{guide.title}</span>
              <span className="line-clamp-2 text-sm leading-6 text-fg-grey-700">{summary(guide.content)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </DocArticle>
  );
}
