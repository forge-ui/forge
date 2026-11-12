import fs from "node:fs";
import path from "node:path";

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  tags: string[];
  keywords: string[];
  content: string;
};

const DIRECTORY = path.join(process.cwd(), "content/articles");

// Front matter is a small "key: value" block; tags (shown, a few shared ones) and keywords (SEO only) are comma-separated.
function parse(slug: string, source: string): Article {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error(`content/articles/${slug}.md needs front matter`);
  const fields = Object.fromEntries(match[1].split("\n").map(line => [line.slice(0, line.indexOf(":")).trim(), line.slice(line.indexOf(":") + 1).trim()]));
  for (const key of ["title", "description", "date"]) if (!fields[key]) throw new Error(`content/articles/${slug}.md is missing ${key}`);
  return {
    slug,
    title: fields.title,
    description: fields.description,
    date: fields.date,
    updated: fields.updated || fields.date,
    tags: (fields.tags ?? "").split(",").map((tag: string) => tag.trim()).filter(Boolean),
    keywords: (fields.keywords ?? fields.tags ?? "").split(",").map((keyword: string) => keyword.trim()).filter(Boolean),
    content: source.slice(match[0].length).trim(),
  };
}

export function listArticles(): Article[] {
  return fs.readdirSync(DIRECTORY).filter(file => file.endsWith(".md")).map(file => parse(file.slice(0, -3), fs.readFileSync(path.join(DIRECTORY, file), "utf8"))).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getArticle(slug: string) {
  return listArticles().find(article => article.slug === slug);
}

/** URL segment for a tag: "shadcn/ui" → "shadcn-ui", "AI 写前端" → "ai-写前端". */
export function tagSlug(tag: string) {
  return tag.toLowerCase().replace(/[\s/]+/g, "-");
}

export function listTags() {
  const counts = new Map<string, number>();
  for (const article of listArticles()) for (const tag of article.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts].map(([name, count]) => ({ name, slug: tagSlug(name), count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-CN"));
}

// Chinese prose reads at roughly 400 characters a minute; Latin words count as one character each.
export function readingMinutes(article: Article) {
  const text = article.content.replace(/```[\s\S]*?```/g, "");
  const characters = (text.match(/[一-鿿]/g)?.length ?? 0) + (text.match(/[A-Za-z0-9]+/g)?.length ?? 0);
  return Math.max(1, Math.round(characters / 400));
}
