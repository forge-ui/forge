import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

export function ChartTooltipPosition({ left, top, children }: { left: number; top: number; children: ReactNode }) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, plotWidth: 0 });

  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    const plot = tooltip.parentElement;
    if (!plot) return;
    const measure = () => setSize({ width: tooltip.getBoundingClientRect().width, plotWidth: plot.getBoundingClientRect().width });
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(tooltip);
    observer.observe(plot);
    return () => observer.disconnect();
  }, []);

  return <div
    ref={tooltipRef}
    data-chart-tooltip="true"
    className="absolute max-w-full -translate-y-full pb-2 [overflow-wrap:anywhere]"
    style={{ left: Math.max(0, Math.min(size.plotWidth - size.width, size.plotWidth * left / 100 - size.width / 2)), top: `${top}%` }}
  >{children}</div>;
}
