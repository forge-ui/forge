import Link from "next/link";
import { ArrowRightLinear } from "@forge-ui-official/core/icons";
import { SiteHeader } from "./_components/site-header";
import { HomeHero } from "./_components/home-hero";
import { changelogHref } from "./docs/_changelog";
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
            <Link href={changelogHref(coreVersion)} className="home-pill">
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
              后台常用的统计、日程、看板和对话，都有现成组件，动效可开可关。
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
            <div className="home-cta-row">
              <Link href="/docs/quick-start" className="home-cta home-cta-dark">
                开始使用
                <ArrowRightLinear size={16} color="currentColor" className="home-cta-icon" aria-hidden="true" />
              </Link>
              <Link href="/components" className="home-cta home-cta-light">浏览组件</Link>
            </div>
          </HomeHero>
        </section>
      </main>
    </div>
  );
}
