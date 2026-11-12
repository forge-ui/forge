import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getArticle, listArticles, readingMinutes } from "@/lib/articles";
import { SITE_NAME, SITE_URL, pageMetadata } from "@/lib/seo";
import { TagLink, formatDate } from "../_parts";

type Props = { params: Promise<{ slug: string }> };

const headingAnchors: Components = {
  h2: ({ id, children }) => <h2 id={id}>{children}<a href={`#${id}`} className="article-anchor" aria-label="本节链接">#</a></h2>,
  h3: ({ id, children }) => <h3 id={id}>{children}<a href={`#${id}`} className="article-anchor" aria-label="本节链接">#</a></h3>,
};

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
  return (
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
      <div className="article-prose prose max-w-none max-md:prose-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={headingAnchors}>{article.content}</ReactMarkdown>
      </div>
    </article>
  );
}
