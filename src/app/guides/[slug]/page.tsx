import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import data from "@/lib/mcp/data.json";
import { DocArticle, DocHeader, DocSection } from "../../docs/_shared";
import { Code } from "../../docs/_ui";

// Fenced code renders with the same block as the rest of the docs.
const markdown: Components = {
  pre: ({ node }) => {
    const code = node?.children[0];
    const text = code?.type === "element" ? code.children.map(child => (child.type === "text" ? child.value : "")).join("") : "";
    return <Code>{text.replace(/\n$/, "")}</Code>;
  },
};

export function generateStaticParams() { return data.guides.map(guide => ({ slug: guide.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return pageMetadata(`/guides/${(await params).slug}`);
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = data.guides.find(item => item.slug === slug);
  if (!guide) notFound();
  const sections = guide.content.split("\n## ").slice(1).map((section, index) => ({ id: "section-" + index, title: section.split("\n")[0], content: section.slice(section.indexOf("\n") + 1) }));
  return <DocArticle toc={sections}><DocHeader title={guide.title} breadcrumbs={[{ label: "使用指南", href: "/guides" }, { label: guide.title }]} />{sections.map(section => <DocSection key={section.id} id={section.id} title={section.title}><div className="flex flex-col gap-4 [&_a]:font-medium [&_a]:text-fg-black [&_a]:underline [&_a]:decoration-fg-grey-300 [&_a]:underline-offset-4 [&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc"><ReactMarkdown components={markdown}>{section.content}</ReactMarkdown></div></DocSection>)}</DocArticle>;
}
