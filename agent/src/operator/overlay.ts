/**
 * The visible layer for "演示给我看": a cursor that travels to each target, a ring around it, a caption
 * saying what is being done, a ripple on click, and a bar to stop the run. Plain DOM so it survives
 * route changes and sits above any app layout; it never takes pointer events except the stop button.
 */

const Z = "2147483000";
const ACCENT = "var(--fg-blue-500, #2563eb)";

type Layer = { root: HTMLDivElement; cursor: HTMLDivElement; caption: HTMLDivElement; ring: HTMLDivElement; bar: HTMLDivElement; barText: HTMLSpanElement };

let layer: Layer | undefined;
let onStop: (() => void) | undefined;
let cursorAt = { x: 0, y: 0 };

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function style<T extends HTMLElement>(element: T, css: Partial<CSSStyleDeclaration>): T {
  Object.assign(element.style, css);
  return element;
}

function ensureLayer(): Layer {
  if (layer?.root.isConnected) return layer;
  const root = style(document.createElement("div"), { position: "fixed", inset: "0", pointerEvents: "none", zIndex: Z });
  root.setAttribute("data-forge-agent", "overlay");
  root.setAttribute("aria-hidden", "true");

  const ring = style(document.createElement("div"), {
    position: "fixed", borderRadius: "10px", border: `2px solid ${ACCENT}`, boxShadow: `0 0 0 4px color-mix(in srgb, ${ACCENT} 18%, transparent)`,
    opacity: "0", transition: "all 280ms cubic-bezier(.2,.8,.2,1)",
  });
  const cursor = style(document.createElement("div"), {
    position: "fixed", left: "0", top: "0", opacity: "0", display: "flex", alignItems: "flex-start", gap: "6px",
    transition: "transform 520ms cubic-bezier(.2,.8,.2,1), opacity 200ms", willChange: "transform",
  });
  cursor.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" style="filter:drop-shadow(0 2px 4px rgb(0 0 0 / .3))"><path d="M4 2.5 20 11l-7.2 1.8L9 20z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  const caption = style(document.createElement("div"), {
    marginTop: "16px", maxWidth: "260px", padding: "5px 10px", borderRadius: "999px", background: "#111", color: "#fff",
    font: "500 12px/1.4 system-ui, sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
    boxShadow: "0 4px 14px rgb(0 0 0 / .18)",
  });
  cursor.append(caption);

  const bar = style(document.createElement("div"), {
    position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "none", alignItems: "center", gap: "10px",
    padding: "6px 6px 6px 14px", borderRadius: "999px", background: "#111", color: "#fff", font: "500 13px/1.4 system-ui, sans-serif",
    boxShadow: "0 6px 20px rgb(0 0 0 / .2)", pointerEvents: "auto",
  });
  const barText = document.createElement("span");
  const stop = style(document.createElement("button"), {
    border: "0", borderRadius: "999px", padding: "4px 12px", background: "#fff", color: "#111", font: "inherit", cursor: "pointer",
  });
  stop.type = "button";
  stop.textContent = "停止";
  stop.addEventListener("click", () => onStop?.());
  bar.append(barText, stop);

  root.append(ring, cursor, bar);
  document.body.append(root);
  layer = { root, cursor, caption, ring, bar, barText };
  return layer;
}

/** What the bar's 停止 button does; set by the agent panel. */
export function setStopHandler(stop: () => void) {
  onStop = stop;
}

let endTimer: ReturnType<typeof setTimeout> | undefined;

/** Hides the layer unless another action starts within `delay` (the chat goes idle between steps). */
export function endRunSoon(delay: number) {
  clearTimeout(endTimer);
  endTimer = setTimeout(endRun, delay);
}

/** Shows the "AI 正在操作" bar. */
export function beginRun() {
  clearTimeout(endTimer);
  const { bar } = ensureLayer();
  // Centre under the page, not the viewport, when a side panel has taken part of the width.
  const page = document.body.getBoundingClientRect();
  bar.style.left = `${page.left + page.width / 2}px`;
  bar.style.display = "flex";
}

export function setStep(text: string) {
  const current = ensureLayer();
  current.barText.textContent = `AI 正在操作：${text}`;
  current.caption.textContent = text;
}

export function endRun() {
  clearTimeout(endTimer);
  if (!layer) return;
  layer.bar.style.display = "none";
  layer.ring.style.opacity = "0";
  layer.cursor.style.opacity = "0";
}

// Smooth scrolling has no end event everywhere; wait until the element stops moving.
async function settleScroll(element: Element) {
  let last = element.getBoundingClientRect().top;
  for (let frame = 0, still = 0; frame < 60 && still < 3; frame++) {
    await new Promise(requestAnimationFrame);
    const top = element.getBoundingClientRect().top;
    still = Math.abs(top - last) < 0.5 ? still + 1 : 0;
    last = top;
  }
}

/** Brings the element into view; when animating, moves the cursor to it and rings it. */
export async function pointAt(element: Element, animate: boolean, center = false) {
  const rect = element.getBoundingClientRect();
  const offscreen = rect.top < 60 || rect.bottom > innerHeight - 20;
  if (offscreen || center) {
    element.scrollIntoView({ block: "center", behavior: animate && !reducedMotion() ? "smooth" : "auto" });
    await settleScroll(element);
  }
  if (!animate) return element.getBoundingClientRect();
  const { cursor, ring } = ensureLayer();
  const target = element.getBoundingClientRect();
  style(ring, { left: `${target.left - 4}px`, top: `${target.top - 4}px`, width: `${target.width + 8}px`, height: `${target.height + 8}px`, opacity: "1" });
  const x = target.left + Math.min(target.width / 2, 40);
  const y = target.top + target.height / 2;
  if (cursor.style.opacity !== "1") {
    // First appearance: start a little below-left of the target instead of the page corner.
    cursor.style.transition = "none";
    cursor.style.transform = `translate(${x - 80}px, ${y + 60}px)`;
    void cursor.offsetWidth;
    cursor.style.transition = "transform 520ms cubic-bezier(.2,.8,.2,1), opacity 200ms";
    cursor.style.opacity = "1";
  }
  cursor.style.transform = `translate(${x}px, ${y}px)`;
  const distance = Math.hypot(x - cursorAt.x, y - cursorAt.y);
  cursorAt = { x, y };
  await sleep(reducedMotion() ? 120 : Math.min(700, 320 + distance / 3));
  return target;
}

export async function ripple(x: number, y: number) {
  const { root } = ensureLayer();
  const dot = style(document.createElement("div"), {
    position: "fixed", left: `${x - 14}px`, top: `${y - 14}px`, width: "28px", height: "28px", borderRadius: "999px",
    background: `color-mix(in srgb, ${ACCENT} 35%, transparent)`, transform: "scale(.4)", opacity: "1", transition: "transform 380ms ease-out, opacity 380ms ease-out",
  });
  root.append(dot);
  void dot.offsetWidth;
  style(dot, { transform: "scale(1.6)", opacity: "0" });
  await sleep(200);
  setTimeout(() => dot.remove(), 400);
}
