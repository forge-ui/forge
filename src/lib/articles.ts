import fs from "node:fs";
import path from "node:path";

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  tags: string[];
  content: string;
};

const DIRECTORY = path.join(process.cwd(), "content/articles");

// Front matter is a small "key: value" block; tags are comma-separated.
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
    content: source.slice(match[0].length).trim(),
  };
}

export function listArticles(): Article[] {
  return fs.readdirSync(DIRECTORY).filter(file => file.endsWith(".md")).map(file => parse(file.slice(0, -3), fs.readFileSync(path.join(DIRECTORY, file), "utf8"))).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getArticle(slug: string) {
  return listArticles().find(article => article.slug === slug);
}
