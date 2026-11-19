import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AGENT_ENTRIES, agentEntry } from "../_kit/_agent-meta";
import { AgentEntryView } from "../_entry-view";

export const dynamicParams = false;

export function generateStaticParams() {
  return AGENT_ENTRIES.map(entry => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const entry = agentEntry((await params).slug);
  if (!entry) return {};
  return {
    title: { absolute: `${entry.title} · Forge Agent · Forge UI` },
    description: entry.summary,
    alternates: { canonical: `/agent/${entry.slug}` },
  };
}

// The selection note from the skill: when to use it, and what to use instead.
function readNote(name?: string) {
  if (!name) return undefined;
  const file = path.join(process.cwd(), "skills/forge-skill/references/component-selection", `${name}.md`);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : undefined;
}

export default async function AgentEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const entry = agentEntry((await params).slug);
  if (!entry) notFound();
  return <AgentEntryView slug={entry.slug} note={readNote(entry.note)} />;
}
