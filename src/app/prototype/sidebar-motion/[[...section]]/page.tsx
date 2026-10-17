"use client";

import { usePathname } from "next/navigation";
import { previewRoot, routeLabels } from "../menu";

export default function SidebarMotionPage() {
  const pathname = usePathname();
  const section = pathname.slice(previewRoot.length).replace(/^\/+|\/+$/g, "");
  const label = routeLabels[section] ?? "菜单详情";

  return (
    <section aria-labelledby="current-view" className="flex max-w-4xl flex-col gap-8 rounded-2xl border border-fg-grey-200 bg-fg-white p-6 sm:p-8">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-fg text-fg-grey-700">当前页面</p>
        <h1 id="current-view" className="text-3xl font-semibold text-fg-black">{label}</h1>
        <p className="text-sm leading-7 text-fg-grey-700">点击左上角按钮收起侧栏，再点击图标切换菜单，感受选中背景、图标与文字的变化。</p>
        <p className="break-all font-mono text-xs text-fg-grey-700">{pathname}</p>
      </div>
      <ol className="divide-y divide-fg-grey-200 border-y border-fg-grey-200 text-sm">
        <li className="flex gap-5 py-5"><span className="font-semibold text-fg-grey-500">01</span><span className="text-fg-black">反复收起、展开：菜单名称与数字提示应平稳进出。</span></li>
        <li className="flex gap-5 py-5"><span className="font-semibold text-fg-grey-500">02</span><span className="text-fg-black">切换菜单：选中位置跟随页面；进入二级菜单时，对应分支自动展开。</span></li>
        <li className="flex gap-5 py-5"><span className="font-semibold text-fg-grey-500">03</span><span className="text-fg-black">切换主题或关闭动效：检查名称、选中状态与页面跳转是否仍然清楚。</span></li>
      </ol>
      <p className="text-xs leading-6 text-fg-grey-700">本页使用示例菜单，仅用于本地交互体验。</p>
    </section>
  );
}
