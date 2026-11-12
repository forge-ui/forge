import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { asset } from "@/lib/asset";
import { Block, Code } from "./_chrome";

export const metadata = pageMetadata("/en");

const parts = [
  { title: "Components", body: "500+ React components and helpers for back-office work: data tables, forms, filters, charts, calendars, kanban, approvals and an AI agent kit. Light and dark mode, themeable primary color, radius and fonts.", href: "/cases/button-link", link: "See them live" },
  { title: "Page blocks", body: "70 full-page blocks — dashboards, order lists, detail pages, settings, agent workspaces — that you copy into your project with one shadcn command and own the source.", href: "/blocks", link: "Browse blocks" },
  { title: "Admin templates", body: "Complete multi-page admin apps: CRM, e-commerce, finance, project management, task board and an AI agent workspace.", href: "/en/admin-templates", link: "Explore templates" },
  { title: "Skill, MCP and checks", body: "A frontend design skill, an MCP server and a static checker so Claude Code, Codex and Cursor pick the right components and verify their own pages.", href: "/en/frontend-design-skill", link: "Set up your agent" },
];

const setup = `# components
npm install @forge-ui-official/core

# skill + MCP for Claude Code, Codex and Cursor
curl -fsSL https://www.forgeui.org/setup.sh | bash`;

export default function EnglishHome() {
  return (
    <div className="flex flex-col gap-20">
      <section className="flex flex-col items-start gap-6">
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-fg text-fg-black sm:text-5xl">
          The React admin UI kit your AI coding agent can follow
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-fg-grey-900">
          Forge gives you production-ready components, page blocks and admin templates — and teaches Claude Code, Codex and Cursor to use them, so the twentieth page looks like the first.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/en/frontend-design-skill" className="rounded-full bg-fg-black px-5 py-3 text-sm font-semibold text-white">Set up your agent</Link>
          <Link href="/en/admin-templates" className="rounded-full border border-fg-grey-200 bg-background px-5 py-3 text-sm font-semibold text-fg-black">Admin templates</Link>
          <a href="https://github.com/forge-ui/forge" target="_blank" rel="noreferrer" className="rounded-full border border-fg-grey-200 bg-background px-5 py-3 text-sm font-semibold text-fg-black">GitHub</a>
        </div>
        <div className="relative mt-4 aspect-[2880/1800] w-full overflow-hidden rounded-card border border-fg-grey-200 bg-background">
          <Image src={asset("/images/readme/dashboard.png")} alt="Forge admin dashboard built with Forge components" fill priority sizes="(max-width: 1200px) 100vw, 1152px" className="object-cover object-top" unoptimized />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {parts.map(part => (
          <div key={part.title} className="flex flex-col gap-3 rounded-card border border-fg-grey-200 bg-background p-6">
            <h2 className="font-display text-xl font-bold tracking-fg text-fg-black">{part.title}</h2>
            <p className="text-sm leading-6 text-fg-grey-900">{part.body}</p>
            <Link href={part.href} className="mt-auto text-sm font-semibold text-fg-blue">{part.link} →</Link>
          </div>
        ))}
      </section>

      <Block title="Built for AI-assisted development">
        <p>
          AI agents write admin pages that work but drift: a different table on every page, hand-picked hex colors, dialogs that ignore Escape. Forge ships the rules with the components. In a 20-task evaluation with Claude Code, adding the Forge skill and MCP raised the pass rate from 90% to 100% and cut code-check warnings from 0.7 per page to zero, at the cost of about 50 seconds per task.{" "}
          <a href="https://github.com/forge-ui/forge/tree/main/evals" target="_blank" rel="noreferrer" className="text-fg-blue underline underline-offset-4">The tasks and results are public.</a>
        </p>
        <p>
          Forge also publishes <Link href="/llms.txt" className="text-fg-blue underline underline-offset-4">llms.txt</Link>, a DESIGN.md and markdown versions of the docs, components and blocks, so assistants without skills can read it too.
        </p>
      </Block>

      <Block title="Quick start">
        <Code>{setup}</Code>
        <p>
          Forge targets Next.js 16, React 19 and Tailwind CSS v4 and is MIT licensed. Components default to Chinese labels and take <code className="rounded bg-fg-grey-100 px-1.5 py-0.5 font-mono text-sm">locale=&quot;en&quot;</code> for English. The full documentation is in Chinese for now; the pages in this English section cover setup, templates and the AI components.
        </p>
      </Block>
    </div>
  );
}
