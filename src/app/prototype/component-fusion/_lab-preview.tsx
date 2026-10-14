"use client";

import { useEffect, useRef, useState } from "react";
import manifest from "../../../../private/component-fusion-lab/manifest.json";

export type LabPreviewProps = {
  id: string;
  locale?: "zh" | "en";
  color?: "blue" | "purple" | "black";
  motion?: "auto" | "none";
};

const prototypes = new Map(manifest.map(item => [item.id, item]));

/** Isolated, on-demand preview of the already styled interaction-lab snapshot. */
export function LabPreview({ id, locale = "zh", color = "blue", motion = "auto" }: LabPreviewProps) {
  // Lab scripts can cache colors and generate translated text during startup.
  // Recreate their isolated document when settings change, without touching reviews.
  return <PrototypeFrame key={`${id}-${locale}-${color}-${motion}`} id={id} locale={locale} color={color} motion={motion} />;
}

function PrototypeFrame({ id, locale, color, motion }: Required<LabPreviewProps>) {
  const item = prototypes.get(id);
  const wrapper = useRef<HTMLDivElement>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const settings = useRef({ locale, color, motion });
  const [visible, setVisible] = useState(false);
  const [height, setHeight] = useState(420);
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    settings.current = { locale, color, motion };
    iframe.current?.contentWindow?.postMessage({ type: "forge-settings", theme: "light", lang: locale, accent: color, motion }, "*");
  }, [locale, color, motion, loaded]);

  useEffect(() => {
    let unload: ReturnType<typeof setTimeout> | undefined;
    let nearby = false;
    const unloadWhenIdle = () => {
      if (nearby) return;
      if (document.activeElement === iframe.current) {
        // Scrolling does not blur an iframe. Recheck after focus moves elsewhere,
        // even when the card never crosses the observer boundary again.
        unload = setTimeout(unloadWhenIdle, 1000);
        return;
      }
      setVisible(false);
      setLoaded(false);
    };
    const observer = new IntersectionObserver(entries => {
      clearTimeout(unload);
      nearby = entries.some(entry => entry.isIntersecting);
      if (nearby) {
        setVisible(true);
      } else {
        // Keep nearby interactions alive while browsing. Dispose distant frames
        // so an all-items gallery cannot accumulate 122 running animations.
        unload = setTimeout(unloadWhenIdle, 10_000);
      }
    }, { rootMargin: "600px" });
    if (wrapper.current) observer.observe(wrapper.current);
    return () => { clearTimeout(unload); observer.disconnect(); };
  }, [id]);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (!iframe.current || event.source !== iframe.current.contentWindow || event.data?.id !== id) return;
      if (event.data.type === "forge-ready") {
        const current = settings.current;
        iframe.current.contentWindow?.postMessage({ type: "forge-settings", theme: "light", lang: current.locale, accent: current.color, motion: current.motion }, "*");
        setLoaded(true);
        setFailed(false);
      }
      if (event.data.type === "forge-embed-size" && Number.isFinite(event.data.height)) {
        setHeight(Math.min(1600, Math.max(240, event.data.height)));
      }
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [id]);

  if (!item) return <p className="text-sm text-fg-grey-700">{locale === "zh" ? "此原型未纳入本轮预览。" : "This prototype is not included in this preview."}</p>;

  const name = locale === "zh" ? item.name : item.english;
  const query = new URLSearchParams({ theme: "light", lang: locale, accent: color, motion });
  return (
    <div ref={wrapper} className="relative w-full min-w-0 overflow-hidden rounded-xl bg-fg-grey-50" style={{ minHeight: height }} data-prototype-id={id}>
      {visible && !failed && <iframe
        key={`${id}-${attempt}`}
        ref={iframe}
        title={`${name} · ${locale === "zh" ? "交互原型" : "Interactive prototype"}`}
        src={`${item.src}?${query}`}
        sandbox="allow-scripts"
        loading="lazy"
        className="block w-full max-w-full border-0"
        style={{ height, opacity: loaded ? 1 : 0 }}
        onError={() => setFailed(true)}
      />}
      {(!visible || !loaded || failed) && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm leading-5 text-fg-grey-500" aria-live="polite">
        <span>{failed ? (locale === "zh" ? "预览加载失败" : "Preview could not load") : visible ? (locale === "zh" ? "正在载入交互原型…" : "Loading interactive prototype…") : name}</span>
        {failed && <button type="button" className="text-fg-blue underline underline-offset-4" onClick={() => { setAttempt(value => value + 1); setFailed(false); setLoaded(false); }}>{locale === "zh" ? "重新载入" : "Reload"}</button>}
      </div>}
    </div>
  );
}
