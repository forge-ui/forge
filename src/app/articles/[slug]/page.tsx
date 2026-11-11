import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Breadcrumbs } from "@forge-ui-official/core";
import { getArticle, listArticles } from "@/lib/articles";
import { SITE_NAME, SITE_URL, pageMetadata } from "@/lib/seo";

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
      { "@type": "TechArticle", headline: article.title, description: article.description, datePublished: article.date, dateModified: article.updated, inLanguage: "zh-CN", url, mainEntityOfPage: url, image: `${SITE_URL}/og.png`, keywords: article.tags.join(", "), author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL }, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL } },
      { "@type": "BreadcrumbList", itemListElement: [{ name: "首页", item: SITE_URL }, { name: "文章", item: `${SITE_URL}/articles` }, { name: article.title, item: url }].map((item, index) => ({ "@type": "ListItem", position: index + 1, ...item })) },
    ],
  };
  return (
    <article className="flex flex-col gap-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="flex flex-col gap-4">
        <Breadcrumbs items={[{ label: "首页", href: "/" }, { label: "文章", href: "/articles" }, { label: article.title }]} color="black" />
        <h1 className="font-display text-3xl font-bold leading-tight tracking-fg text-fg-black sm:text-4xl">{article.title}</h1>
        <p className="text-base leading-[1.8] text-fg-grey-900">{article.description}</p>
        <p className="text-xs text-fg-grey-700">
          发布于 {article.date}
          {article.updated !== article.date && ` · 更新于 ${article.updated}`}
        </p>
      </header>
      <div className="article-prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </div>
    </article>
  );
}
