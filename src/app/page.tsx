import { SiteHeader } from "./_components/site-header";
import { HomeHero } from "./_components/home-hero";
import { changelogHref } from "./docs/_changelog";
import { coreVersion } from "./docs/_versions";
import "./_components/home-page.css";

export default function HomePage() {
  return (
    <div className="home-page flex min-w-0 flex-col">
      <SiteHeader tone="blend" />
      <main className="flex min-w-0 flex-1 flex-col">
        <HomeHero version={coreVersion} notesHref={changelogHref(coreVersion)} />
      </main>
    </div>
  );
}
