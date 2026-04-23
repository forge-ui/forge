import Link from "next/link";
import Image from "next/image";
import { ArrowRightLinear } from "solar-icon-set";
import { SiteHeader } from "@/app/_components/site-header";
import { variants } from "./_variants";

export default function DashboardBuilderGallery() {
  return (
    <div className="flex min-h-screen flex-col bg-fg-grey-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 lg:px-8">
        <header className="flex flex-col gap-3 mb-10">
          <h1 className="text-4xl font-bold tracking-fg text-fg-black">Dashboard Builder</h1>
          <p className="max-w-2xl text-base leading-7 text-fg-grey-700">
            8 种后台模板外壳，颜色和布局搭配好的。挑一个顺眼的开搞，往里面填业务内容就行。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {variants.map((v) => (
            <Link
              key={v.slug}
              href={`/dashboard-builder/${v.slug}`}
              className="group flex flex-col gap-0 overflow-hidden rounded-3xl bg-white border border-fg-grey-200 hover:border-fg-grey-400 transition-colors"
            >
              <div className="relative aspect-video w-full overflow-hidden border-b border-fg-grey-200 bg-fg-grey-100">
                <Image
                  src={v.thumbnail}
                  alt={v.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top"
                  unoptimized
                />
              </div>
              <div className="flex flex-col gap-3 p-6">
                <h2 className="text-lg font-bold tracking-fg text-fg-black">{v.title}</h2>
                <p className="text-sm leading-6 text-fg-grey-700">{v.subtitle}</p>
                <div className="mt-2 flex items-center gap-1 text-sm font-semibold text-fg-violet">
                  打开模板
                  <ArrowRightLinear size={16} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
