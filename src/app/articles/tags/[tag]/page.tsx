import Link from "next/link";
import { notFound } from "next/navigation";
import { listArticles, listTags } from "@/lib/articles";
import { pageMetadata } from "@/lib/seo";
import { PostItem } from "../../_parts";

type Props = { params: Promise<{ tag: string }> };

async function findTag(params: Props["params"]) {
  const segment = decodeURIComponent((await params).tag);
  return listTags().find(tag => tag.slug === segment);
}

export function generateStaticParams() {
  return listTags().map(tag => ({ tag: tag.slug }));
}

// Tag listings repeat the article index, so they stay out of search results.
export async function generateMetadata({ params }: Props) {
  const tag = await findTag(params);
  if (!tag) notFound();
  return pageMetadata(`/articles/tags/${tag.slug}`, { title: `标签：${tag.name}`, description: `Forge UI 文章中标记为「${tag.name}」的 ${tag.count} 篇文章。`, noindex: true });
}

export default async function TagPage({ params }: Props) {
  const tag = await findTag(params);
  if (!tag) notFound();
  return (
    <div className="flex flex-col gap-12">
      <header className="flex items-start gap-3">
        <h1 className="article-title grow">标签：{tag.name}</h1>
        <Link href="/articles" className="mt-3 shrink-0 text-sm text-fg-grey-700 underline underline-offset-4 hover:text-fg-black">全部文章</Link>
      </header>
      <ul className="flex flex-col gap-10">
        {listArticles().filter(article => article.tags.includes(tag.name)).map(article => <PostItem key={article.slug} article={article} />)}
      </ul>
    </div>
  );
}
