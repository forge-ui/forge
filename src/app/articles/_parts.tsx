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
  const href = `/articles/${article.slug}`;
  return (
    <li className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold leading-snug text-fg-black">
        <Link href={href} className="hover:underline hover:underline-offset-4">{article.title}</Link>
      </h2>
      <p className="leading-7 text-fg-grey-700">
        {article.description}
        <Link href={href} className="ml-2 whitespace-nowrap text-fg-black underline underline-offset-4">阅读全文 →</Link>
      </p>
      <time dateTime={article.date} className="text-sm text-fg-grey-700">{formatDate(article.date)}</time>
    </li>
  );
}
