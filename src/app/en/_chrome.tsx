import Link from "next/link";
import { asset } from "@/lib/asset";
import { LanguageSwitch } from "../_components/language-switch";
import { ThemeToggle } from "../_components/theme-toggle";

const nav = [
  { href: "/en/frontend-design-skill", label: "Frontend skill" },
  { href: "/en/admin-templates", label: "Admin templates" },
  { href: "/en/ai-chat-components", label: "AI chat components" },
];

export function EnglishHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-fg-grey-200 bg-fg-grey-50/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-5 sm:px-8">
        <Link href="/en" className="flex shrink-0 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/forge-logo-v2.svg")} alt="Forge" className="site-logo size-7" />
          <span className="font-display text-lg font-bold tracking-fg text-fg-black">Forge</span>
        </Link>
        <nav aria-label="Main" className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto whitespace-nowrap text-sm font-semibold tracking-fg">
          {nav.map(item => <Link key={item.href} href={item.href} className="text-fg-grey-900 transition-colors hover:text-fg-black">{item.label}</Link>)}
        </nav>
        <LanguageSwitch />
        <ThemeToggle />
        <a href="https://github.com/forge-ui/forge" target="_blank" rel="noreferrer" className="hidden text-sm font-semibold tracking-fg text-fg-grey-900 hover:text-fg-black sm:inline">GitHub</a>
      </div>
    </header>
  );
}

export function EnglishFooter() {
  return (
    <footer className="border-t border-fg-grey-200">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-fg-grey-700 sm:px-8">
        <span>© 2026 Forge UI · MIT License</span>
        <div className="flex flex-wrap gap-5">
          {nav.map(item => <Link key={item.href} href={item.href} className="hover:text-fg-black">{item.label}</Link>)}
          <a href="https://github.com/forge-ui/forge-starter" target="_blank" rel="noreferrer" className="hover:text-fg-black">Forge Starter</a>
          <Link href="/" hrefLang="zh-CN" className="hover:text-fg-black">中文站</Link>
        </div>
      </div>
    </footer>
  );
}

/** Section heading + body used by the English landing pages. */
export function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-2xl font-bold tracking-fg text-fg-black">{title}</h2>
      <div className="flex flex-col gap-4 text-base leading-[1.8] text-fg-grey-900">{children}</div>
    </section>
  );
}

export function Code({ children }: { children: string }) {
  return <pre className="overflow-x-auto rounded-xl bg-fg-grey-100 px-5 py-4 font-mono text-sm leading-relaxed text-fg-black"><code>{children}</code></pre>;
}
