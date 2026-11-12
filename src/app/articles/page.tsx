import Link from "next/link";
import { Breadcrumbs } from "@forge-ui-official/core";
import { listArticles } from "@/lib/articles";

export default function ArticlesPage() {
  const articles = listArticles();
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <Breadcrumbs items={[{ label: "首页", href: "/" }, { label: "文章" }]} color="black" />
        <h1 className="font-display text-4xl font-bold tracking-fg text-fg-black">文章</h1>
        <p className="text-base leading-[1.8] text-fg-grey-900">用 Forge 搭后台、让编码助手按规范写页面、给产品加 AI 界面的实践记录。</p>
      </header>
      <ul className="flex flex-col gap-4">
        {articles.map(article => (
          <li key={article.slug}>
            <Link href={`/articles/${article.slug}`} className="flex flex-col gap-2 rounded-card border border-fg-grey-200 bg-background p-6 transition-colors hover:border-fg-grey-300">
              <span className="text-xs text-fg-grey-700">{article.date}</span>
              <span className="font-display text-xl font-semibold tracking-fg text-fg-black">{article.title}</span>
              <span className="text-sm leading-6 text-fg-grey-900">{article.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
