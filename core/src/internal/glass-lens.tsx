"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Edge refraction for the glass button. A displacement map (neutral grey in the middle, red/blue
 * gradients at the rim) bends what is behind the button near its edges, like a thick glass pill.
 * Only Chromium renders SVG filters in backdrop-filter, so other browsers keep the plain frosted
 * look from tokens.css.
 */
// Channel values, not palette colors: red carries the x offset and blue the y offset, 128 is neutral.
function displacementMap(width: number, height: number) {
  const radius = height / 2;
  const edge = Math.max(4, Math.round(height * 0.28));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="r" x1="0" x2="1"><stop offset="0" stop-color="rgb(0,0,0)"/><stop offset="1" stop-color="rgb(255,0,0)"/></linearGradient><linearGradient id="b" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="rgb(0,0,0)"/><stop offset="1" stop-color="rgb(0,0,255)"/></linearGradient><filter id="s"><feGaussianBlur stdDeviation="${edge / 2}"/></filter></defs><rect width="${width}" height="${height}" fill="rgb(0,0,0)"/><rect width="${width}" height="${height}" rx="${radius}" fill="url(#r)"/><rect width="${width}" height="${height}" rx="${radius}" fill="url(#b)" style="mix-blend-mode:screen"/><rect x="${edge}" y="${edge}" width="${Math.max(0, width - edge * 2)}" height="${Math.max(0, height - edge * 2)}" rx="${Math.max(0, radius - edge)}" fill="rgb(128,128,128)" filter="url(#s)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const supportsLens = () =>
  typeof CSS !== "undefined" && CSS.supports("backdrop-filter", "url(#forge) blur(1px)") && /Chrom(e|ium)\//.test(navigator.userAgent);

export function GlassLens() {
  const id = `forge-glass-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || !supportsLens()) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.target.getBoundingClientRect();
      setSize(current => (current?.width === Math.round(width) && current.height === Math.round(height) ? current : { width: Math.round(width), height: Math.round(height) }));
    });
    observer.observe(host);
    host.style.setProperty("--forge-glass-lens", `url(#${id})`);
    host.dataset.lens = "";
    return () => {
      observer.disconnect();
      host.style.removeProperty("--forge-glass-lens");
      delete host.dataset.lens;
    };
  }, [id]);

  return (
    <svg ref={ref} aria-hidden width="0" height="0" className="absolute">
      {size && (
        <filter id={id} x="0" y="0" width={size.width} height={size.height} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feImage href={displacementMap(size.width, size.height)} x="0" y="0" width={size.width} height={size.height} preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale={-Math.round(size.height * 0.45)} xChannelSelector="R" yChannelSelector="B" />
        </filter>
      )}
    </svg>
  );
}
