import Link from "next/link";
import { SiteHeader } from "./_components/site-header";
import { HomeHero } from "./_components/home-hero";
import { HomeBelow } from "./_components/home-demos";
import { coreVersion } from "./docs/_versions";
import "./_components/home-page.css";

export default function HomePage() {
  return (
    <div className="home-page flex min-h-screen min-w-0 flex-col">
      <SiteHeader tone="blend" />
      <main className="flex min-w-0 flex-1 flex-col">
        <section className="home-hero">
          <div className="home-hero-glow" aria-hidden="true" />
          <HomeHero>
            <Link href="/docs" className="home-pill">
              Forge {coreVersion} 更新说明
              <span aria-hidden="true">→</span>
            </Link>
            <h1 className="home-hero-title">
              统计、日程、
              <br />
              看板和对话，
              <br />
              都有现成的样子
            </h1>
            <p className="home-hero-lead">
              内部后台里常用的这些块，这里都有现成组件。玻璃、跟随、涟漪和文字切换都可以打开；系统要求减弱动效时，这些动画会停。
            </p>
            <pre className="home-code">
              <code>
                <span className="tok-kw">import</span>
                {" { StatCard } "}
                <span className="tok-kw">from</span>
                {"\n  "}
                <span className="tok-str">&quot;@forge-ui-official/core&quot;</span>
                {";\n\n<"}
                <span className="tok-name">StatCard</span>
                {" "}
                <span className="tok-attr">title</span>
                <span className="tok-str">=&quot;本周&quot;</span>
                {" "}
                <span className="tok-attr">value</span>
                <span className="tok-str">=&quot;128&quot;</span>
                {" />"}
              </code>
            </pre>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/docs/quick-start" className="home-cta home-cta-dark">
                开始使用
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/components" className="home-cta home-cta-light">浏览组件</Link>
            </div>
          </HomeHero>
        </section>
        <div className="pb-16">
          <HomeBelow />
        </div>
      </main>
      <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-3 text-sm text-fg-grey-900">
        <p>Forge {coreVersion}</p>
        <nav aria-label="页脚" className="flex items-center gap-3">
          <Link href="/docs" className="hover:text-fg-black">文档</Link>
          <Link href="/components" className="hover:text-fg-black">组件</Link>
          <Link href="/templates" className="hover:text-fg-black">模板</Link>
        </nav>
      </footer>
    </div>
  );
}
