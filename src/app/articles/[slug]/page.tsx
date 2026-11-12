import Link from "next/link";
import { notFound } from "next/navigation";
import { articleHeadings, getArticle, listArticles, readingMinutes } from "@/lib/articles";
import { SITE_NAME, SITE_URL, pageMetadata } from "@/lib/seo";
import { ArticleMarkdown } from "../_markdown";
import { ArticleFooter, TagLink, formatDate } from "../_parts";
import { TableOfContents } from "../_toc";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listArticles().map(article => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  return pageMetadata(`/articles/${article.slug}`, { title: article.title, description: article.description });
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const url = `${SITE_URL}/articles/${article.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "TechArticle", headline: article.title, description: article.description, datePublished: article.date, dateModified: article.updated, inLanguage: "zh-CN", url, mainEntityOfPage: url, image: `${SITE_URL}/og.png`, keywords: article.keywords.join(", "), author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL }, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL } },
      { "@type": "BreadcrumbList", itemListElement: [{ name: "首页", item: SITE_URL }, { name: "文章", item: `${SITE_URL}/articles` }, { name: article.title, item: url }].map((item, index) => ({ "@type": "ListItem", position: index + 1, ...item })) },
    ],
  };
  const headings = articleHeadings(article);
  return (
    <div className="mx-auto grid w-full max-w-[44rem] gap-16 lg:max-w-[62rem] lg:grid-cols-[13rem_minmax(0,44rem)]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <TableOfContents headings={headings} />
        </div>
      </aside>
      <div className="min-w-0">
        <article>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
          <h1 className="article-title">{article.title}</h1>
          <div className="mt-5 mb-10 flex items-start gap-3 text-sm text-fg-grey-700">
            <div className="flex grow flex-col gap-2">
              <p>
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                {article.updated !== article.date && <> · 更新于 <time dateTime={article.updated}>{formatDate(article.updated)}</time></>}
                <span className="px-1.5">•</span>约 {readingMinutes(article)} 分钟读完
              </p>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map(tag => <TagLink key={tag} name={tag} />)}
              </div>
            </div>
            <Link href="/articles" className="shrink-0 underline underline-offset-4 hover:text-fg-black">返回</Link>
          </div>
          <details className="article-mobile-toc mb-10 lg:hidden">
            <summary>本文目录</summary>
            <ul>
              {headings.filter(heading => heading.level === 2).map(heading => <li key={heading.id}><a href={`#${heading.id}`}>{heading.text}</a></li>)}
            </ul>
          </details>
          <div className="article-prose prose max-w-none max-md:prose-sm">
            <ArticleMarkdown content={article.content} />
          </div>
        </article>
        <ArticleFooter />
      </div>
    </div>
  );
}
