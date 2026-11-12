import Link from "next/link";
import { tagSlug, type Article } from "@/lib/articles";

export function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return `${year} 年 ${month} 月 ${day} 日`;
}

export function TagLink({ name, count }: { name: string; count?: number }) {
  return (
    <Link href={`/articles/tags/${tagSlug(name)}`} className="article-tag">
      {name}
      {count !== undefined && ` (${count})`}
    </Link>
  );
}

export function PostItem({ article }: { article: Article }) {
  return (
    <li className="border-t border-fg-grey-200 py-10 first:border-t-0 first:pt-0">
      <Link href={`/articles/${article.slug}`} className="group flex flex-col gap-3">
        <time dateTime={article.date} className="text-sm text-fg-grey-700">{formatDate(article.date)}</time>
        <h2 className="text-[1.375rem] font-semibold leading-snug text-fg-black group-hover:underline group-hover:underline-offset-4">{article.title}</h2>
        <p className="line-clamp-2 leading-7 text-fg-grey-700">{article.description}</p>
      </Link>
    </li>
  );
}

export function ArticleFooter() {
  return (
    <footer className="mt-24 flex items-center justify-between text-sm text-fg-grey-700">
      <span>© {new Date().getFullYear()} Forge UI · MIT</span>
      <a href="/articles/rss.xml" className="hover:text-fg-black">RSS</a>
    </footer>
  );
}
