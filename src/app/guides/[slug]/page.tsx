import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import data from "@/lib/mcp/data.json";
import { DocArticle, DocHeader, DocSection } from "../../docs/_shared";

export function generateStaticParams() { return data.guides.map(guide => ({ slug: guide.slug })); }
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = data.guides.find(item => item.slug === slug);
  if (!guide) notFound();
  const sections = guide.content.split("\n## ").slice(1).map((section, index) => ({ id: "section-" + index, title: section.split("\n")[0], content: section.slice(section.indexOf("\n") + 1) }));
  return <DocArticle toc={sections}><DocHeader title={guide.title} breadcrumbs={[{ label: "使用指南", href: "/guides" }, { label: guide.title }]} />{sections.map(section => <DocSection key={section.id} id={section.id} title={section.title}><div className="flex flex-col gap-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-fg-grey-100 [&_pre]:p-4 [&_a]:underline"><ReactMarkdown>{section.content}</ReactMarkdown></div></DocSection>)}</DocArticle>;
}
