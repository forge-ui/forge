import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { asset } from "@/lib/asset";
import { Block, Code } from "../_chrome";

export const metadata = pageMetadata("/en/admin-templates");

const templates = [
  { href: "/templates/crm-template", title: "CRM", body: "Customers, leads, sales pipeline and activity, with list, detail and form pages.", image: "/images/showcase/templates/crm-template-home.png" },
  { href: "/templates/ecommerce/products", title: "E-commerce admin", body: "Products, orders, customers, categories and sellers.", image: "/images/showcase/ecommerce.png" },
  { href: "/templates/finance-template", title: "Finance", body: "Overview, transactions, wallets, cards and invoices.", image: "/images/showcase/templates/finance-template-home.png" },
  { href: "/templates/project-template", title: "Project management", body: "Projects, clients, members, tasks, files and invoices.", image: "/images/showcase/project-template.png" },
  { href: "/templates/task-board", title: "Task board", body: "Workspaces, projects and my tasks, with drag-and-drop kanban, list view and task details.", image: "/images/showcase/task-board.png" },
  { href: "/templates/dashboards", title: "Dashboards", body: "Ten filled-in dashboards: analytics, CRM, e-commerce, finance and projects.", image: "/images/showcase/dashboards/ecommerce-1.png" },
  { href: "/templates/agent", title: "AI agent workspace", body: "Streaming answers, stop and retry, tool calls, plan review and interactive inputs.", image: "/images/showcase/agent-workspace.png" },
];

const block = `npx shadcn@latest add https://www.forgeui.org/r/orders-table-section.json`;

export default function AdminTemplatesPage() {
  return (
    <div className="flex flex-col gap-14">
      <header className="flex max-w-3xl flex-col gap-5">
        <h1 className="font-display text-4xl font-bold leading-tight tracking-fg text-fg-black">React admin templates for Next.js and shadcn</h1>
        <p className="text-lg leading-8 text-fg-grey-900">
          Complete admin dashboards built on Next.js 16, React 19 and Tailwind CSS v4 with Forge components. Open any template and click around, copy the pages you need as shadcn blocks, or start a full app with Forge Starter. Free and MIT licensed.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map(item => (
          <Link key={item.href} href={item.href} className="flex flex-col overflow-hidden rounded-3xl border border-fg-grey-200 bg-background transition-colors hover:border-fg-grey-400">
            <div className="relative aspect-video w-full border-b border-fg-grey-200 bg-fg-grey-100">
              <Image src={asset(item.image)} alt={`${item.title} admin template screenshot`} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover object-top" unoptimized />
            </div>
            <div className="flex flex-col gap-2 p-6">
              <h2 className="text-xl font-bold tracking-fg text-fg-black">{item.title}</h2>
              <p className="text-sm leading-6 text-fg-grey-900">{item.body}</p>
            </div>
          </Link>
        ))}
      </section>

      <div className="grid gap-12 lg:grid-cols-2">
        <Block title="Copy pages as shadcn blocks">
          <p>70 <Link href="/blocks" className="text-fg-blue underline underline-offset-4">page blocks</Link> cover the most common admin pages: dashboards, data tables, detail views, settings and agent workspaces. Each installs into an existing Next.js project with the shadcn CLI, and the source is yours to edit.</p>
          <Code>{block}</Code>
        </Block>
        <Block title="Start a full app with Forge Starter">
          <p><a href="https://github.com/forge-ui/forge-starter" target="_blank" rel="noreferrer" className="text-fg-blue underline underline-offset-4">Forge Starter</a> is a deployable Next.js admin: sign-in, roles and menu permissions, PostgreSQL with Drizzle, a generator that turns an OpenAPI spec into read-only modules, and an Ask AI assistant that reads your data. It ships the same agent skills, so new pages follow the templates.</p>
        </Block>
      </div>

      <Block title="FAQ">
        <div className="grid gap-6 md:grid-cols-2">
          <div><h3 className="font-semibold text-fg-black">Is it free for commercial use?</h3><p>Yes. Components, blocks, templates and Forge Starter are MIT licensed.</p></div>
          <div><h3 className="font-semibold text-fg-black">Is the data real?</h3><p>No, templates use sample data to show layouts and interactions. Forge Starter shows how to wire real APIs.</p></div>
          <div><h3 className="font-semibold text-fg-black">Dark mode?</h3><p>Yes. Add <code className="font-mono text-sm">data-theme=&quot;dark&quot;</code> to <code className="font-mono text-sm">&lt;html&gt;</code>. Primary color, radius and fonts can be changed with the <Link href="/docs/theme" className="text-fg-blue underline underline-offset-4">theme generator</Link>.</p></div>
          <div><h3 className="font-semibold text-fg-black">How is it different from other open-source admin templates?</h3><p>Templates, blocks and components follow one design system, and Forge ships a <Link href="/en/frontend-design-skill" className="text-fg-blue underline underline-offset-4">skill and checks for AI coding agents</Link>, so pages added later still match.</p></div>
        </div>
      </Block>
    </div>
  );
}
