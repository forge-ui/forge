"use client";

import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { PageHeading, Section } from "../components/_shared";
import { AgentApi } from "./_kit/_agent-api";
import { AgentPreview } from "./_kit/_agent-entries";
import { ChatInputBarCases } from "./_kit/_chat-input-bar-cases";
import { ChatInputBarDocs } from "./_kit/_chat-input-bar-docs";
import { AGENT_ENTRIES, agentEntry } from "./_kit/_agent-meta";

// Inline `code` in the selection notes.
function inline(text: string): ReactNode {
  return text.split(/(`[^`]+`)/).map((piece, index) => piece.startsWith("`")
    ? <code key={index} className="rounded bg-fg-grey-100 px-1 py-0.5 text-[13px] text-fg-black">{piece.slice(1, -1)}</code>
    : <Fragment key={index}>{piece}</Fragment>);
}

function Note({ markdown }: { markdown: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) blocks.push(<ul key={blocks.length} className="flex list-disc flex-col gap-1 pl-5 text-sm leading-6 text-fg-grey-900">{list.map((item, index) => <li key={index}>{inline(item)}</li>)}</ul>);
    list = [];
  };
  for (const line of markdown.split("\n")) {
    const text = line.trim();
    if (text.startsWith("- ")) { list.push(text.slice(2)); continue; }
    flush();
    if (!text || text.startsWith("# ")) continue;
    if (text.startsWith("#")) blocks.push(<h3 key={blocks.length} className="pt-2 text-sm font-semibold tracking-fg text-fg-black">{text.replace(/^#+\s*/, "")}</h3>);
    else blocks.push(<p key={blocks.length} className="text-sm leading-6 text-fg-grey-900">{inline(text)}</p>);
  }
  flush();
  return <div className="flex flex-col gap-2 rounded-2xl border border-fg-grey-200 bg-background p-5">{blocks}</div>;
}

export function AgentEntryView({ slug, note }: { slug: string; note?: string }) {
  const entry = agentEntry(slug)!;
  const related = AGENT_ENTRIES.filter(item => item.group === entry.group && item.slug !== slug);
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-fg-grey-500">Forge Agent · {entry.group}</span>
        <PageHeading title={entry.title} hint={entry.summary} />
      </div>
      <AgentPreview slug={slug} />
      {slug === "chat-input-bar" && <><ChatInputBarDocs /><ChatInputBarCases /></>}
      {note && <Section title="什么时候用"><Note markdown={note} /></Section>}
      {entry.apis.length > 0 && <Section title="API">{entry.apis.map(name => <AgentApi key={name} name={name} />)}</Section>}
      {related.length > 0 && (
        <Section title={`同属「${entry.group}」`}>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map(item => (
              <Link key={item.slug} href={`/agent/${item.slug}`} className="flex flex-col gap-1 rounded-2xl border border-fg-grey-200 bg-background p-4 transition-colors hover:border-fg-grey-300 hover:bg-fg-grey-50">
                <span className="text-sm font-semibold tracking-fg text-fg-black">{item.title}</span>
                <span className="line-clamp-2 text-sm leading-6 text-fg-grey-700">{item.summary}</span>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
