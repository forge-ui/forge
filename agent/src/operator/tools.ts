import { z } from "zod";
import { defineTool, type AgentTool } from "../tool";
import { beginRun, finishStep, pointAt, ripple, setStep, sleep } from "./overlay";
import { describe, elementFor, isRisky, isSensitive, peekElement, readPage } from "./page";

/** 演示给我看: the pointer travels and every step is paced to be followed. 直接帮我做: the same steps, the pointer only hops. */
export type OperateMode = "show" | "direct";

export type PageToolsOptions = {
  mode: OperateMode;
  /** Client-side navigation, e.g. Next.js `router.push`. Defaults to a full page load. */
  navigate?: (path: string) => void;
};

let queue: Promise<unknown> = Promise.resolve();

// Bumped by cancelPageActions; a running action that sees a newer generation stops.
let generation = 0;

export function cancelPageActions() {
  generation++;
}

function checkpoint(started: number) {
  if (started !== generation) throw new Error("用户已停止操作");
}

// Waits until the page stops changing after an action (renders, route changes, animations).
function settle(quietMs = 200, maxMs = 2000) {
  return new Promise<void>(resolve => {
    let timer = setTimeout(done, quietMs);
    const limit = setTimeout(done, maxMs);
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(done, quietMs);
    });
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
    function done() {
      observer.disconnect();
      clearTimeout(timer);
      clearTimeout(limit);
      resolve();
    }
  });
}

async function waitForPath(pathname: string, started: number) {
  for (let waited = 0; location.pathname !== pathname && waited < 8000; waited += 100) {
    checkpoint(started);
    await sleep(100);
  }
  if (location.pathname !== pathname) throw new Error(`没能打开 ${pathname}`);
}

function setNativeValue(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
  // React tracks the value through the prototype setter; assigning `.value` directly is ignored.
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), "value")?.set;
  if (setter) setter.call(element, value);
  else element.value = value;
  element.dispatchEvent(new Event("input", { bubbles: true }));
}

const TEXT_INPUTS = new Set(["text", "search", "email", "url", "tel", "number", ""]);

function pointerSequence(element: HTMLElement, x: number, y: number) {
  const init = { bubbles: true, cancelable: true, composed: true, clientX: x, clientY: y, button: 0 };
  element.dispatchEvent(new PointerEvent("pointerdown", { ...init, pointerType: "mouse", isPrimary: true }));
  element.dispatchEvent(new MouseEvent("mousedown", init));
  element.focus({ preventScroll: true });
  element.dispatchEvent(new PointerEvent("pointerup", { ...init, pointerType: "mouse", isPrimary: true }));
  element.dispatchEvent(new MouseEvent("mouseup", init));
  element.click();
}

// Exact text first, then a partial match ("思源黑体" finds "思源黑体 Source Han Sans").
function pick<T>(items: T[], textOf: (item: T) => string, wanted: string): T {
  const text = (item: T) => textOf(item).replace(/\s+/g, " ").trim();
  const found = items.find(item => text(item) === wanted) ?? items.find(item => text(item).includes(wanted) || (text(item) && wanted.includes(text(item))));
  if (!found) throw new Error(`没有「${wanted}」这个选项，可选：${items.map(text).filter(Boolean).join("、") || "（列表为空）"}`);
  return found;
}

const target = { id: z.string().regex(/^e\d+$/, "用 read_page 结果里的编号，如 e12"), name: z.string().min(1).max(60) };

/**
 * Tools that let the agent read the page and operate it like a person: open, click, type, choose,
 * scroll and wait. Every action returns the page as it is afterwards, so the next step is grounded.
 */
export function pageTools({ mode, navigate = path => location.assign(path) }: PageToolsOptions): AgentTool[] {
  const animate = mode === "show";

  // Actions run one after another even when the model sends several at once: each starts from the
  // page the previous one left, and a stale id fails the name check instead of hitting something else.
  function step(label: string, action: (started: number) => Promise<string>) {
    // Captured when queued, so 停止 also cancels actions still waiting their turn.
    const started = generation;
    const run = queue.then(async () => {
      checkpoint(started);
      beginRun();
      setStep(label);
      try {
        const done = await action(started);
        checkpoint(started);
        await settle();
        return `${done}。页面已更新，下一轮会附上最新页面。`;
      } finally {
        finishStep();
      }
    });
    queue = run.catch(() => undefined);
    return run;
  }

  return [
    defineTool({
      name: "read_page",
      label: "读取页面",
      labelFor: () => "读取页面",
      description: "读取当前页面：地址、标题、各级标题，以及所有可操作元素（[编号] 类型「名称」 状态）。操作页面前先调用；之后每个操作的结果都会带上最新页面。",
      input: z.object({}),
      execute: () => readPage(),
    }),
    defineTool({
      name: "open_page",
      description: "打开本站的另一个页面，path 是以 / 开头的站内路径。返回打开后的页面。",
      input: z.object({ path: z.string().regex(/^\/(?!\/)\S*$/, "必须是以 / 开头的站内路径") }),
      labelFor: ({ path }) => `打开 ${path}`,
      execute: ({ path }) => step(`打开 ${path}`, async started => {
        const pathname = new URL(path, location.origin).pathname;
        navigate(path);
        await waitForPath(pathname, started);
        if (animate) await sleep(400);
        return `已打开 ${path}`;
      }),
    }),
    defineTool({
      name: "click",
      description: "点击一个元素（按钮、链接、标签页、选项、复选框等）。id 是 read_page 里的编号，name 是它的名称，用来展示给用户。提交、删除、保存等会先请用户确认。",
      input: z.object(target),
      labelFor: ({ name }) => `点击「${name}」`,
      needsApprovalFor: ({ id }) => {
        const element = peekElement(id);
        return element ? isRisky(element) : false;
      },
      execute: ({ id, name }) => step(`点击「${name}」`, async started => {
        const element = elementFor(id, name);
        if (element instanceof HTMLAnchorElement && element.href && element.origin !== location.origin) throw new Error("只能在本站内操作；外部链接请让用户自己打开");
        if (element.matches(":disabled, [aria-disabled='true']")) throw new Error(`${describe(element)} 当前不可用`);
        const rect = await pointAt(element, animate);
        const x = rect.left + Math.min(rect.width / 2, 40);
        const y = rect.top + rect.height / 2;
        await ripple(animate);
        const leaving = element instanceof HTMLAnchorElement && element.href && element.target !== "_blank" && element.pathname !== location.pathname ? element.pathname : undefined;
        pointerSequence(element, x, y);
        if (leaving) await waitForPath(leaving, started);
        return `已点击 ${describe(element)}`;
      }),
    }),
    defineTool({
      name: "type_text",
      description: "在输入框里填写文字（会先清空原内容）。submit 为 true 时填完按回车提交，需要用户确认。密码、验证码等敏感字段不能填。",
      input: z.object({ ...target, text: z.string().max(2000), submit: z.boolean().optional() }),
      labelFor: ({ name, text }) => `在「${name}」填写「${text.length > 16 ? text.slice(0, 16) + "…" : text}」`,
      needsApprovalFor: ({ submit }) => submit === true,
      execute: ({ id, name, text, submit }) => step(`在「${name}」填写`, async started => {
        const element = elementFor(id, name);
        if (isSensitive(element)) throw new Error("密码、验证码等敏感字段需要用户自己填写");
        const editable = element.isContentEditable;
        const textual = element instanceof HTMLTextAreaElement || (element instanceof HTMLInputElement && TEXT_INPUTS.has(element.type));
        if (!editable && !textual && !(element instanceof HTMLInputElement)) throw new Error(`${describe(element)} 不能输入文字`);
        await pointAt(element, animate);
        await ripple(animate);
        element.focus({ preventScroll: true });
        if (editable) {
          document.execCommand("selectAll");
          for (const character of animate ? [...text] : [text]) {
            checkpoint(started);
            document.execCommand("insertText", false, character);
            if (animate) await sleep(Math.min(45, 1500 / text.length));
          }
        } else if (textual) {
          const field = element as HTMLInputElement | HTMLTextAreaElement;
          setNativeValue(field, "");
          if (animate) {
            const characters = [...text];
            for (let index = 1; index <= characters.length; index++) {
              checkpoint(started);
              setNativeValue(field, characters.slice(0, index).join(""));
              await sleep(Math.min(45, 1500 / characters.length));
            }
          } else setNativeValue(field, text);
          field.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
          // color, date, range…: the value is set in one go.
          setNativeValue(element as HTMLInputElement, text);
          element.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (submit) {
          const enter = new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true });
          const handled = !element.dispatchEvent(enter);
          const form = (element as HTMLInputElement).form;
          if (!handled && form) form.requestSubmit();
        }
        return `已在 ${describe(element)} 填写${submit ? "并提交" : ""}`;
      }),
    }),
    defineTool({
      name: "select_option",
      description: "在下拉框里选择一项，option 是选项文字；会自动打开下拉框再点选项。选项不存在时会返回可选项列表。",
      input: z.object({ ...target, option: z.string().min(1).max(100) }),
      labelFor: ({ name, option }) => `在「${name}」选择「${option}」`,
      execute: ({ id, name, option }) => step(`在「${name}」选择「${option}」`, async started => {
        const element = elementFor(id, name);
        if (element instanceof HTMLSelectElement) {
          const choice = pick([...element.options], item => item.text, option);
          await pointAt(element, animate);
          setNativeValue(element, choice.value);
          element.dispatchEvent(new Event("change", { bubbles: true }));
          return `已选择「${choice.text.trim()}」`;
        }
        if (element.getAttribute("role") !== "combobox" && !element.hasAttribute("aria-haspopup")) throw new Error(`${describe(element)} 不是下拉框`);
        // Custom select: open it, then press the matching option in the list it controls.
        const opener = await pointAt(element, animate);
        if (element.getAttribute("aria-expanded") !== "true") {
          await ripple(animate);
          pointerSequence(element, opener.left + 10, opener.top + opener.height / 2);
          await settle(150, 1000);
        }
        checkpoint(started);
        const list = document.getElementById(element.getAttribute("aria-controls") ?? "") ?? document;
        const choice = pick([...list.querySelectorAll<HTMLElement>("[role='option']")].filter(item => item.getClientRects().length > 0), item => item.textContent ?? "", option);
        const rect = await pointAt(choice, animate);
        await ripple(animate);
        pointerSequence(choice, rect.left + 10, rect.top + rect.height / 2);
        return `已选择「${(choice.textContent ?? "").trim()}」`;
      }),
    }),
    defineTool({
      name: "scroll_to",
      description: "把某个元素滚到视口中间（传 id 和 name），或按方向滚动页面（direction：up、down、top、bottom）。",
      input: z.object({ id: target.id.optional(), name: target.name.optional(), direction: z.enum(["up", "down", "top", "bottom"]).optional() }),
      labelFor: ({ name, direction }) => name ? `滚动到「${name}」` : ({ up: "向上滚动", down: "向下滚动", top: "回到顶部", bottom: "滚到底部" } as const)[direction ?? "down"],
      execute: ({ id, name, direction = "down" }) => step(name ? `滚动到「${name}」` : "滚动页面", async () => {
        if (id) {
          // Scrolling is harmless, so a loose name ("生成的 CSS") is not checked against the element.
          const element = elementFor(id);
          await pointAt(element, animate, true);
          return `已滚动到 ${describe(element)}`;
        }
        const scroller = document.scrollingElement ?? document.documentElement;
        const top = { up: scroller.scrollTop - innerHeight * 0.8, down: scroller.scrollTop + innerHeight * 0.8, top: 0, bottom: scroller.scrollHeight }[direction];
        scroller.scrollTo({ top, behavior: animate ? "smooth" : "auto" });
        if (animate) await sleep(500);
        return `已${({ up: "向上滚动", down: "向下滚动", top: "回到顶部", bottom: "滚到底部" } as const)[direction]}`;
      }),
    }),
    defineTool({
      name: "wait_for",
      description: "等待页面上出现某段文字（如保存成功提示），最多等 seconds 秒（默认 5）。",
      input: z.object({ text: z.string().min(1).max(100), seconds: z.number().min(1).max(15).optional() }),
      labelFor: ({ text }) => `等待「${text}」出现`,
      execute: ({ text, seconds = 5 }) => step(`等待「${text}」出现`, async started => {
        for (let waited = 0; waited < seconds * 1000; waited += 200) {
          checkpoint(started);
          if (document.body.innerText.includes(text)) return `「${text}」已出现`;
          await sleep(200);
        }
        throw new Error(`${seconds} 秒内没有出现「${text}」`);
      }),
    }),
  ];
}
