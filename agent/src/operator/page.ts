/**
 * Reads the current page as a list of operable elements and acts on them by id. The model never sees
 * screenshots or selectors; it sees `[e12] 按钮「圆润」 已选中` and answers with `e12`.
 */

const INTERACTIVE = [
  "a[href]", "button", "input", "textarea", "select", "summary", "[contenteditable='true']", "[data-agent-name]",
  ...["button", "link", "tab", "checkbox", "radio", "switch", "option", "menuitem", "menuitemradio", "menuitemcheckbox", "combobox", "slider", "treeitem", "textbox"].map(role => `[role='${role}']`),
].join(",");

/** Regions the agent must not read or touch: its own UI and anything the app marks off. */
export const HIDDEN_FROM_AGENT = "[data-agent-ignore],[data-forge-agent]";

const ROLE_NAMES: Record<string, string> = {
  button: "按钮", link: "链接", tab: "标签页", checkbox: "复选框", radio: "单选", switch: "开关", option: "选项",
  menuitem: "菜单项", menuitemradio: "菜单项", menuitemcheckbox: "菜单项", combobox: "下拉框", slider: "滑块",
  treeitem: "树节点", textbox: "输入框", select: "下拉框", summary: "展开",
};

const MAX_ELEMENTS = 150;

// Ids stay with their element across reads, so an id from an earlier read still means the same thing.
let nextId = 1;
const ids = new WeakMap<Element, string>();
const elements = new Map<string, Element>();

function idOf(element: Element) {
  let id = ids.get(element);
  if (!id) {
    id = `e${nextId++}`;
    ids.set(element, id);
  }
  elements.set(id, element);
  return id;
}

const clean = (text: string | null | undefined, max = 60) => {
  const value = (text ?? "").replace(/\s+/g, " ").trim();
  return value.length > max ? value.slice(0, max) + "…" : value;
};

export function isSensitive(element: Element) {
  if (!(element instanceof HTMLInputElement)) return false;
  const autocomplete = element.autocomplete ?? "";
  return element.type === "password" || /password|cc-|one-time-code/.test(autocomplete);
}

function roleOf(element: Element) {
  const role = element.getAttribute("role");
  if (role) return role;
  const tag = element.tagName.toLowerCase();
  if (tag === "a") return "link";
  if (tag === "select" || tag === "summary" || tag === "button") return tag;
  if (tag === "textarea" || element.getAttribute("contenteditable") === "true") return "textbox";
  if (element instanceof HTMLInputElement) {
    if (["checkbox", "radio"].includes(element.type)) return element.type;
    if (element.type === "range") return "slider";
    if (["button", "submit", "reset"].includes(element.type)) return "button";
    return "textbox";
  }
  return "button";
}

function nameOf(element: Element): string {
  const explicit = element.getAttribute("data-agent-name") ?? element.getAttribute("aria-label");
  if (explicit) return clean(explicit);
  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    const text = labelledBy.split(/\s+/).map(id => document.getElementById(id)?.textContent ?? "").join(" ");
    if (clean(text)) return clean(text);
  }
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
    const label = element.labels?.[0]?.textContent;
    if (clean(label)) return clean(label);
    if ("placeholder" in element && element.placeholder) return clean(element.placeholder);
  }
  const text = clean(element.textContent) || clean(element.querySelector("img")?.alt);
  return text || clean(element.getAttribute("title"));
}

function stateOf(element: Element): string[] {
  const state: string[] = [];
  const description = element.getAttribute("data-agent-description");
  if (description) state.push(clean(description, 80));
  if (isSensitive(element)) return [...state, "敏感字段，不可读写"];
  if (element.matches(":disabled, [aria-disabled='true']")) state.push("不可用");
  const checked = element instanceof HTMLInputElement && ["checkbox", "radio"].includes(element.type) ? element.checked : element.getAttribute("aria-checked") === "true";
  if (checked) state.push("已勾选");
  if (element.getAttribute("aria-selected") === "true" || element.getAttribute("aria-pressed") === "true") state.push("已选中");
  if (element.getAttribute("aria-current") && element.getAttribute("aria-current") !== "false") state.push("当前");
  const expanded = element.getAttribute("aria-expanded");
  if (expanded) state.push(expanded === "true" ? "已展开" : "已收起");
  if (element instanceof HTMLSelectElement) state.push(`当前「${clean(element.selectedOptions[0]?.textContent, 30)}」`);
  else if (element.getAttribute("role") === "combobox" && !(element instanceof HTMLInputElement)) {
    // Custom selects show their value as text; aria-label is often only the placeholder.
    const shown = clean(element.textContent, 30);
    if (shown && shown !== nameOf(element)) state.push(`当前「${shown}」`);
  }
  else if ((element instanceof HTMLInputElement && roleOf(element) === "textbox") || element instanceof HTMLTextAreaElement) {
    state.push(element.value ? `值「${clean(element.value, 40)}」` : "空");
  } else if (element instanceof HTMLInputElement && ["color", "range"].includes(element.type)) state.push(`值「${element.value}」`);
  if (element instanceof HTMLAnchorElement && element.origin === location.origin) state.push(`→ ${element.pathname}`);
  return state;
}

function isShown(element: Element) {
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;
  if (element.closest("[hidden],[inert],[aria-hidden='true']")) return false;
  const style = getComputedStyle(element);
  return style.visibility !== "hidden" && style.display !== "none";
}

function inViewport(element: Element) {
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth;
}

// Headings and code blocks are not operable, but they are what the user asks to see ("看看生成的 CSS")
// and what scroll_to aims at.
const LANDMARKS = "h1, h2, h3, pre";
const CHROME = "header, nav, footer, aside, [role='banner'], [role='navigation'], [role='contentinfo'], [role='complementary']";

// A code block is named by its aria-label when the page gives one, since its first line changes with its content.
function landmarkName(element: Element) {
  if (element.tagName !== "PRE") return clean(element.textContent);
  return clean(element.getAttribute("aria-label")) || clean(element.textContent?.split("\n").find(line => line.trim()), 50);
}

function landmarkLine(element: Element) {
  if (element.tagName === "PRE") return `代码块「${landmarkName(element)}」`;
  return `${element.tagName === "H1" ? "页面标题" : "小节"}「${clean(element.textContent)}」`;
}

// The short caption a control sits under, e.g. 主色 for a row of colour swatches.
function groupOf(element: Element, name: string) {
  let node: Element | null = element;
  for (let depth = 0; node && depth < 4; depth++, node = node.parentElement) {
    const label = node.matches("[role='group'], [role='radiogroup'], [role='tablist'], fieldset") ? node.getAttribute("aria-label") ?? node.querySelector("legend")?.textContent : undefined;
    if (label) return clean(label, 20);
    const previous = node.previousElementSibling;
    const text = clean(previous?.textContent, 30);
    if (previous && text && text.length <= 20 && !previous.matches(INTERACTIVE) && !previous.querySelector(INTERACTIVE)) return text === name ? undefined : text;
  }
  return undefined;
}

/**
 * The page as the model sees it: the main content first (controls under their captions, headings and
 * code blocks as anchors), then the site chrome. Off-screen items are marked so the model scrolls.
 */
export function readPage() {
  for (const [id, element] of elements) if (!element.isConnected) elements.delete(id);
  const found = [...document.querySelectorAll(`${INTERACTIVE}, ${LANDMARKS}`)].filter(element => !element.closest(HIDDEN_FROM_AGENT) && isShown(element));
  const names = new Map(found.map(element => [element, element.matches(LANDMARKS) ? "" : nameOf(element)]));
  // A button inside a link with the same text is one control to the user; keep the outer one.
  const candidates = found.filter(element => {
    const outer = element.parentElement?.closest(INTERACTIVE);
    return !(outer && names.has(outer) && names.get(outer) === names.get(element));
  });
  const visible = new Set(candidates.filter(inViewport));
  const main = document.querySelector("main, [role='main']");
  const inMain = (element: Element) => (main ? main.contains(element) : !element.closest(CHROME));
  // Keep everything in view, then the main content, then the chrome, up to the cap.
  const ranked = [...candidates].sort((left, right) => Number(visible.has(right)) - Number(visible.has(left)) || Number(inMain(right)) - Number(inMain(left)));
  const kept = new Set(ranked.slice(0, MAX_ELEMENTS));
  const line = (element: Element) => {
    if (element.matches(LANDMARKS)) return `[${idOf(element)}] ${landmarkLine(element)}${visible.has(element) ? "" : " （视口外）"}`;
    const role = roleOf(element);
    const name = names.get(element) || "无名称";
    const group = groupOf(element, name);
    const parts = [`[${idOf(element)}]`, `${ROLE_NAMES[role] ?? role}「${name}」${group ? `（${group}）` : ""}`, ...stateOf(element)];
    if (!visible.has(element)) parts.push("（视口外）");
    return parts.join(" ");
  };
  const listed = candidates.filter(element => kept.has(element));
  const content = listed.filter(inMain).map(line);
  const chrome = listed.filter(element => !inMain(element)).map(line);
  const scroller = document.scrollingElement ?? document.documentElement;
  const position = scroller.scrollTop + innerHeight >= scroller.scrollHeight - 4 ? "已在页面底部" : scroller.scrollTop < 4 ? "在页面顶部" : "在页面中部";
  const omitted = candidates.length - kept.size;
  // Plain text, one element per line: models read this far better than escaped JSON.
  return [
    `当前页面 ${location.pathname + location.search}（${document.title}，${position}）`,
    "主内容：",
    content.join("\n") || "（无）",
    "导航与页面框架：",
    chrome.join("\n") || "（无）",
    omitted > 0 ? `另有 ${omitted} 个元素未列出，滚动后再读。` : "",
  ].filter(Boolean).join("\n");
}

/** Whether the model's name for an element plausibly means this element. */
export function matchesName(element: Element, given: string) {
  const normalize = (text: string) => text.replace(/[\s「」"'“”色]/g, "").toLowerCase();
  const wanted = normalize(given);
  if (!wanted) return true;
  const actual = [nameOf(element), groupOf(element, nameOf(element)) ?? "", element.matches(LANDMARKS) ? clean(element.textContent) : ""].map(normalize).filter(Boolean);
  return actual.some(text => text.includes(wanted) || wanted.includes(text));
}

const normalizeName = (text: string) => text.replace(/[\s「」"'“”]/g, "").toLowerCase();

/** The element's own name and caption, recorded so a later replay finds it again without an id. */
export function labelOf(id: string): { name: string; group?: string } | undefined {
  const element = elements.get(id);
  if (!element?.isConnected) return undefined;
  const name = element.matches(LANDMARKS) ? landmarkName(element) : nameOf(element);
  return { name, group: element.matches(LANDMARKS) ? undefined : groupOf(element, name) };
}

/**
 * The id of the one element now on the page with this name (and caption, when given). Undefined when
 * none or several fit: a replay then hands the step back to the model instead of guessing.
 */
export function findByName(name: string, group?: string) {
  readPage();
  const wanted = normalizeName(name);
  const candidates = [...elements.entries()].filter(([, element]) => element.isConnected && !element.closest(HIDDEN_FROM_AGENT) && isShown(element));
  const named = candidates.filter(([, element]) => normalizeName(element.matches(LANDMARKS) ? landmarkName(element) : nameOf(element)) === wanted);
  const fits = named.length > 1 && group ? named.filter(([, element]) => normalizeName(groupOf(element, nameOf(element)) ?? "") === normalizeName(group)) : named;
  return fits.length === 1 ? fits[0][0] : undefined;
}

export function elementFor(id: string, name?: string): HTMLElement {
  const element = elements.get(id);
  if (!element || !element.isConnected) throw new Error(`页面上没有 ${id}。编号只能用最近一次页面结果里的，下面是现在的页面：\n${readPage()}`);
  if (element.closest(HIDDEN_FROM_AGENT)) throw new Error("这个区域不允许助手操作");
  if (!(element instanceof HTMLElement)) throw new Error(`${id} 不能操作`);
  if (name && !matchesName(element, name)) throw new Error(`${id} 是 ${describe(element)}，不是「${name}」。没有执行。请按下面现在的页面重新找编号：\n${readPage()}`);
  return element;
}

export function peekElement(id: string) {
  const element = elements.get(id);
  return element instanceof HTMLElement && element.isConnected ? element : undefined;
}

export function describe(element: Element) {
  return `${ROLE_NAMES[roleOf(element)] ?? "元素"}「${nameOf(element)}」`;
}

const RISKY_WORDS = /提交|删除|移除|清空|支付|付款|购买|下单|创建|保存|确认|确定|发送|发布|注销|退出登录|submit|delete|remove|pay|purchase|confirm|send|publish/i;

/** Clicks that commit something: the user confirms before the agent presses them. */
export function isRisky(element: Element) {
  if (element.closest("[data-agent-confirm]")) return true;
  if ((element instanceof HTMLButtonElement || element instanceof HTMLInputElement) && element.type === "submit" && element.form) return true;
  return RISKY_WORDS.test(nameOf(element));
}
