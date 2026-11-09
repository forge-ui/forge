"use client";

import { useEffect, useRef, useState } from "react";

export function PreviewFrame({ name, thumbnail = false, mobile = false }: { name: string; thumbnail?: boolean; mobile?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(!thumbnail);
  const [loaded, setLoaded] = useState(false);
  const [available, setAvailable] = useState(0);
  const [height, setHeight] = useState(720);
  const width = mobile ? 390 : thumbnail ? 1024 : 1280;
  const scale = available ? Math.min(available / width, 1) : 0;

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const resize = new ResizeObserver(() => setAvailable(element.clientWidth));
    setAvailable(element.clientWidth);
    resize.observe(element);
    const intersection = thumbnail ? new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setMounted(true);
        intersection?.disconnect();
      }
    }, { rootMargin: "200px" }) : null;
    intersection?.observe(element);
    return () => { resize.disconnect(); intersection?.disconnect(); };
  }, [thumbnail]);

  useEffect(() => {
    if (mounted && iframe.current?.contentDocument?.readyState === "complete") setLoaded(true);
  }, [mounted]);

  useEffect(() => {
    if (thumbnail) return;
    function receive(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== iframe.current?.contentWindow) return;
      if (event.data?.type !== "forge-block-height" || event.data.name !== name || !Number.isFinite(event.data.height)) return;
      setHeight(Math.max(720, Math.min(30000, Math.ceil(event.data.height))));
      setLoaded(true);
    }
    window.addEventListener("message", receive);
    iframe.current?.contentWindow?.postMessage({ type: "forge-block-height-request" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, [name, thumbnail]);

  return <div ref={container} data-preview-width={width} data-preview-thumbnail={thumbnail ? name : undefined} aria-hidden={thumbnail || undefined} inert={thumbnail || undefined} className={`relative w-full min-w-0 overflow-hidden ${thumbnail ? "pointer-events-none aspect-[8/5] select-none" : "mx-auto"}`} style={{ maxWidth: width, height: thumbnail ? undefined : available ? height * scale : 720 }}>
    {!loaded && <div role={thumbnail ? undefined : "status"} className="absolute inset-0 animate-pulse bg-fg-grey-100"><span className="sr-only">正在加载页面预览</span><div className="m-6 h-12 rounded-xl bg-fg-grey-200" /><div className="m-6 h-48 rounded-xl bg-fg-grey-200" /></div>}
    {mounted && <iframe key={name} ref={iframe} src={`/blocks/${name}/preview`} title={`${name} 页面预览`} loading={thumbnail ? "lazy" : "eager"} tabIndex={thumbnail ? -1 : undefined} aria-hidden={thumbnail || undefined} onLoad={() => setLoaded(true)} className="absolute left-0 top-0 origin-top-left border-0" style={{ width, height: thumbnail ? 640 : height, transform: `scale(${scale})`, visibility: loaded && available ? "visible" : "hidden" }} />}
  </div>;
}
