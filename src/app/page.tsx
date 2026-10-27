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
              为日常工作，构建出色界面
            </h1>
            <p className="home-hero-lead">
              从基础控件到完整业务场景，用 Forge 把想法变成清晰、一致的产品体验。
            </p>
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
