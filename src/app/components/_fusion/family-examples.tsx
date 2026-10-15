"use client";

import { useEffect, useRef, useState } from "react";
import { ExampleCode } from "../_example-code";
import { exampleSourceFiles } from "./source-files";
import { usePathname } from "next/navigation";
import { Button } from "@forge-ui-official/core";
import { RestartCircleLinear } from "@forge-ui-official/core/icons";
import { FusionExample } from "./example";
import { fusionItems, officialCategory } from "./registry";
import type { FusionSettings } from "./types";

export function VisibleExample({ id, settings, epoch }: { id: string; settings: FusionSettings; epoch: number }) {
  const holder = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!holder.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "300px" });
    observer.observe(holder.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={holder} className="min-h-56 w-full min-w-0">{visible && <FusionExample key={epoch} id={id} {...settings} />}</div>;
}

/** Places interaction examples beside their existing component family. */
export function FusionFamilyExamples() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<FusionSettings["locale"]>("zh");
  const [color, setColor] = useState<FusionSettings["color"]>("blue");
  const [motion, setMotion] = useState<FusionSettings["motion"]>("auto");
  const [epochs, setEpochs] = useState<Record<string, number>>({});
  const parts = pathname.split("/").filter(Boolean);
  const isComponents = parts[0] === "components";
  const items = isComponents && parts.length === 2 ? fusionItems.filter(item => officialCategory(item) === parts[1] && item.id !== "F03") : [];
  if (!items.length) return null;
  const zh = locale === "zh";
  return <section id="component-examples" className="flex min-w-0 scroll-mt-24 flex-col gap-8" aria-label={zh ? "交互示例" : "Interaction examples"}>
    <div className="flex flex-col gap-3 border-t border-fg-grey-200 pt-8">
      <h2 className="font-display text-3xl font-semibold tracking-fg">{zh ? "交互示例" : "Interaction examples"}</h2>
      <p className="text-sm leading-6 text-fg-grey-700">{zh ? "体验不同状态下的操作与反馈，选择适合业务场景的组合。" : "Explore interactions and feedback, then choose a combination for your product."}</p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" color="black" variant="tertiary" onClick={() => setLocale(zh ? "en" : "zh")}>{zh ? "切换英文" : "中文"}</Button>
        {(["blue", "purple", "black"] as const).map((value, i) => <Button key={value} size="sm" color={value} variant={color === value ? "primary" : "tertiary"} aria-pressed={color === value} onClick={() => setColor(value)}>{(zh ? ["蓝", "紫", "黑"] : ["Blue", "Purple", "Black"])[i]}</Button>)}
        <Button size="sm" color="black" variant="tertiary" aria-pressed={motion === "none"} onClick={() => setMotion(motion === "none" ? "auto" : "none")}>{zh ? (motion === "none" ? "动效：关闭" : "动效：跟随系统") : (motion === "none" ? "Motion: off" : "Motion: system")}</Button>
      </div>
    </div>
    {items.map(item => <section key={item.id} id={`interaction-${item.id}`} data-case-section={item.name} className="flex min-w-0 scroll-mt-24 flex-col gap-4">
      {item.id === "178" && <span id="interaction-F03" className="scroll-mt-24" />}
      <div className="flex items-start justify-between gap-3"><div className="flex flex-col gap-2"><h3 className="text-lg font-semibold">{zh ? item.name : item.english}</h3><p className="text-sm leading-6 text-fg-grey-700">{zh ? item.description : item.descriptionEn}</p><p className="text-xs text-fg-grey-500">{item.target.join(" · ")}</p></div><Button size="sm" color="black" variant="tertiary" aria-label={`${zh ? "重置" : "Reset"} ${zh ? item.name : item.english}`} iconLeft={<RestartCircleLinear size={16} />} onClick={() => setEpochs(current => ({ ...current, [item.id]: (current[item.id] ?? 0) + 1 }))}>{zh ? "重置" : "Reset"}</Button></div>
      <div className="min-w-0 rounded-2xl border border-fg-grey-200 bg-fg-white p-5"><VisibleExample id={item.id} settings={{ locale, color, motion }} epoch={epochs[item.id] ?? 0} /></div>
      <ExampleCode files={exampleSourceFiles(item)} />
      <button type="button" onClick={() => { const table = document.querySelector("article table"); table?.scrollIntoView({ behavior: motion === "none" ? "instant" : "smooth", block: "start" }); }} className="text-xs font-semibold text-fg-grey-700 underline underline-offset-4">{zh ? "查看本页参数说明" : "View API reference on this page"}</button>
    </section>)}
  </section>;
}
