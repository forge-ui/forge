/**
 * What the user sees while the agent operates the page: a pointer that travels to each target, a
 * pulse where it clicks, a frame around the page and a bar that says what is being done and stops
 * the run. The page ignores the user's own input meanwhile. Plain DOM so it survives route changes
 * and sits above any app layout; only the stop button takes pointer events.
 */

const Z = "2147483000";
const ACCENT = "var(--fg-blue-500, #2563eb)";

const GLOW = "59 130 246";
const TRAVEL = "cubic-bezier(.16,1,.3,1)";
// Same pointer as the Forge Design browser extension: rounded arrow, tip at the top left.
const POINTER = `<svg viewBox="150 40 680 880" width="23" height="30" style="display:block;overflow:visible;filter:drop-shadow(0 0 6px rgb(${GLOW} / .9)) drop-shadow(0 0 15px rgb(${GLOW} / .48))"><path d="M174.08 113.39264l7.43424 646.56896c0.38912 33.95072 28.11392 61.1584 61.9264 60.76416a61.07136 61.07136 0 0 0 39.38816-15.01696l156.65152-136.36096 159.73376 277.82656c16.90624 29.39904 54.3488 39.4752 83.63008 22.49728l67.11296-38.912c29.2864-16.9728 39.31648-54.57408 22.41024-83.97312l-159.73376-277.82656 196.06016-68.096c31.95392-11.10016 48.896-46.11072 37.84704-78.19776a61.42464 61.42464 0 0 0-26.59328-32.75776L266.56256 59.83232c-29.06624-17.34144-66.63168-7.7312-83.89632 21.45792A61.71648 61.71648 0 0 0 174.08 113.39264z" fill="#111" stroke="#fff" stroke-width="72" stroke-linejoin="round" stroke-linecap="round"/></svg>`;

type Layer = { root: HTMLDivElement; frame: HTMLDivElement; cursor: HTMLDivElement; pulse: HTMLDivElement; ring: HTMLDivElement; bar: HTMLDivElement; barText: HTMLSpanElement };

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
  const frame = style(document.createElement("div"), {
    position: "fixed", top: "0", bottom: "0", display: "none", boxShadow: `inset 0 0 0 2px rgb(${GLOW} / .55), inset 0 0 28px rgb(${GLOW} / .22)`,
  });
  const cursor = style(document.createElement("div"), {
    position: "fixed", left: "0", top: "0", width: "0", height: "0", opacity: "0", willChange: "transform",
  });
  cursor.innerHTML = POINTER;
  const pulse = style(document.createElement("div"), {
    position: "absolute", left: "-15px", top: "-15px", width: "30px", height: "30px", borderRadius: "999px", opacity: "0",
    border: "1.5px solid rgb(68 158 255 / .62)", background: "rgb(68 158 255 / .08)", boxShadow: "0 0 8px rgb(68 158 255 / .32)",
  });
  cursor.prepend(pulse);

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

  root.append(frame, ring, cursor, bar);
  document.body.append(root);
  layer = { root, frame, cursor, pulse, ring, bar, barText };
  return layer;
}

/** What the bar's 停止 button does; set by the agent panel. */
export function setStopHandler(stop: () => void) {
  onStop = stop;
}

let endTimer: ReturnType<typeof setTimeout> | undefined;
// True while a page action is in progress; the chat is idle then, waiting for its result.
let acting = false;

/** Ends the run unless it continues within `delay`: an action is still going, or the next step starts. */
export function endRunSoon(delay: number) {
  clearTimeout(endTimer);
  endTimer = setTimeout(() => (acting ? endRunSoon(delay) : endRun()), delay);
}

/** The model is working on the next step; a pending end is called off. */
export function holdRun() {
  clearTimeout(endTimer);
}

export function finishStep() {
  acting = false;
}

const BLOCKED = ["pointerdown", "pointerup", "mousedown", "mouseup", "click", "dblclick", "auxclick", "contextmenu", "dragstart", "touchstart", "touchmove", "wheel", "keydown", "keypress", "keyup", "beforeinput"];
let locked = false;

// The agent's own events are synthetic (isTrusted false) and pass; the user's are dropped unless
// they land on the agent's panel or the stop bar.
function blockUserInput(event: Event) {
  if (!event.isTrusted || (event.target instanceof Element && event.target.closest("[data-forge-agent]"))) return;
  if (event instanceof KeyboardEvent) {
    if (event.key === "Escape" && event.type === "keydown") onStop?.();
    // Browser shortcuts (reload, devtools, copy) stay with the user.
    else if (event.metaKey || event.ctrlKey) return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  if (event.type === "pointerdown" && !reducedMotion()) {
    // Points at the way out instead of leaving a dead click unexplained.
    layer?.bar.animate?.([{ translate: "0" }, { translate: "-6px" }, { translate: "5px" }, { translate: "-3px" }, { translate: "0" }], { duration: 360, easing: "ease-out" });
  }
}

function lockPage(lock: boolean) {
  if (lock === locked) return;
  locked = lock;
  for (const type of BLOCKED) {
    if (lock) window.addEventListener(type, blockUserInput, { capture: true, passive: false });
    else window.removeEventListener(type, blockUserInput, { capture: true });
  }
}

/** Takes over the page: locks the user's input and shows the frame and the "AI 正在操作" bar. */
export function beginRun() {
  acting = true;
  const { bar, frame } = ensureLayer();
  // The page, not the viewport: a side panel may have taken part of the width.
  const page = document.body.getBoundingClientRect();
  style(frame, { left: `${page.left}px`, width: `${page.width}px`, display: "block" });
  bar.style.left = `${page.left + page.width / 2}px`;
  bar.style.display = "flex";
  lockPage(true);
}

export function setStep(text: string) {
  ensureLayer().barText.textContent = `AI 正在操作：${text}`;
}

export function endRun() {
  clearTimeout(endTimer);
  acting = false;
  lockPage(false);
  if (!layer) return;
  layer.bar.style.display = "none";
  layer.frame.style.display = "none";
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

/**
 * Brings the element into view and moves the pointer to it. `animate` (演示给我看) scrolls smoothly,
 * rings the target and lets the pointer travel; otherwise the pointer only hops there.
 */
export async function pointAt(element: Element, animate: boolean, center = false) {
  const rect = element.getBoundingClientRect();
  const offscreen = rect.top < 60 || rect.bottom > innerHeight - 20;
  if (offscreen || center) {
    const behavior = animate && !reducedMotion() ? "smooth" : "auto";
    // A tall block (e.g. generated code) is shown from its top, clear of a sticky header, not cut in the middle.
    if (rect.height > innerHeight * 0.6) scrollBy({ top: rect.top - 96, behavior });
    else element.scrollIntoView({ block: "center", behavior });
    await settleScroll(element);
  }
  const { cursor, ring } = ensureLayer();
  const target = element.getBoundingClientRect();
  if (animate) style(ring, { left: `${target.left - 4}px`, top: `${target.top - 4}px`, width: `${target.width + 8}px`, height: `${target.height + 8}px`, opacity: "1" });
  else ring.style.opacity = "0";
  const x = target.left + Math.min(target.width / 2, 40);
  const y = target.top + target.height / 2;
  const travel = reducedMotion() ? 1 : animate ? 420 : 160;
  if (cursor.style.opacity !== "1") {
    // First appearance: start a little below-left of the target instead of the page corner.
    cursor.style.transition = "none";
    cursor.style.transform = `translate(${x - 80}px, ${y + 60}px)`;
    void cursor.offsetWidth;
    cursor.style.opacity = "1";
  }
  cursor.style.transition = `transform ${travel}ms ${TRAVEL}, opacity 200ms`;
  cursor.style.transform = `translate(${x}px, ${y}px)`;
  const distance = Math.hypot(x - cursorAt.x, y - cursorAt.y);
  cursorAt = { x, y };
  await sleep(!animate || reducedMotion() ? travel : Math.min(700, 320 + distance / 3));
  return target;
}

/** The click pulse under the pointer's tip. */
export async function ripple(animate: boolean) {
  if (reducedMotion()) return;
  ensureLayer().pulse.animate?.([{ transform: "scale(.72)", opacity: .8 }, { transform: "scale(1.35)", opacity: .3, offset: .65 }, { transform: "scale(1.55)", opacity: 0 }], { duration: animate ? 520 : 260, easing: "ease-out" });
  if (animate) await sleep(200);
}
