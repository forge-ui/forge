import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";

const nodeProtocol = "node:";
// Dynamic built-in name keeps the test bundle compatible with tsup's CJS output.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${nodeProtocol}test`);

import { FullCalendar } from "../src/components/ui/full-calendar";
import { SmallCalendar } from "../src/components/ui/small-calendar";

function withFixedDate<T>(run: () => T): T {
  const NativeDate = globalThis.Date;
  const fixedInstant = NativeDate.parse("2026-07-31T16:30:00.000Z");
  const FixedDate = new Proxy(NativeDate, {
    construct(target, args) {
      return Reflect.construct(target, args.length === 0 ? [fixedInstant] : args, target);
    },
  }) as DateConstructor;

  try {
    globalThis.Date = FixedDate;
    return run();
  } finally {
    globalThis.Date = NativeDate;
  }
}

async function withFixedDateAsync<T>(run: () => Promise<T>): Promise<T> {
  const NativeDate = globalThis.Date;
  const fixedInstant = NativeDate.parse("2026-07-31T16:30:00.000Z");
  const FixedDate = new Proxy(NativeDate, {
    construct(target, args) {
      return Reflect.construct(target, args.length === 0 ? [fixedInstant] : args, target);
    },
  }) as DateConstructor;

  try {
    globalThis.Date = FixedDate;
    return await run();
  } finally {
    globalThis.Date = NativeDate;
  }
}

function installDom() {
  const dom = new JSDOM("<!doctype html><html><body><div id=\"root\"></div></body></html>", {
    url: "http://localhost/",
  });

  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    Event: dom.window.Event,
    MouseEvent: dom.window.MouseEvent,
  });

  return dom;
}

function renderInTimezone(
  timezone: string,
  component: React.ElementType,
  props: Record<string, unknown> = {},
) {
  const originalTimezone = process.env.TZ;

  try {
    process.env.TZ = timezone;
    return renderToStaticMarkup(createElement(component, props));
  } finally {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
  }
}

test("SmallCalendar 默认 SSR 首屏不随服务端时区变化", () => {
  withFixedDate(() => {
    const utcHtml = renderInTimezone("UTC", SmallCalendar);
    const shanghaiHtml = renderInTimezone("Asia/Shanghai", SmallCalendar);

    assert.equal(shanghaiHtml, utcHtml);
  });
});

test("SmallCalendar 挂载后切换到用户本地今天", async () => {
  const originalTimezone = process.env.TZ;
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  try {
    process.env.TZ = "Asia/Shanghai";
    await withFixedDateAsync(async () => {
      await act(async () => {
        root.render(createElement(SmallCalendar));
      });

      assert.match(container.textContent ?? "", /8月/);
      assert.match(container.textContent ?? "", /1 8月 2026/);
    });
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
  }
});

test("SmallCalendar 日期按钮不会提交父级表单", async () => {
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);
  let submitCount = 0;

  try {
    await act(async () => {
      root.render(createElement(
        "form",
        {
          onSubmit: (event: React.FormEvent) => {
            event.preventDefault();
            submitCount += 1;
          },
        },
        createElement(SmallCalendar),
      ));
    });

    const dateButtons = [...document.querySelectorAll<HTMLButtonElement>("button")]
      .filter((button) => /^\d+$/.test(button.textContent ?? ""));
    assert.ok(dateButtons.length >= 28);
    assert.ok(dateButtons.every((button) => button.type === "button"));

    await act(async () => dateButtons[1].click());
    assert.equal(submitCount, 0);
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
  }
});

test("FullCalendar 默认 SSR 首屏不随服务端时区变化", () => {
  withFixedDate(() => {
    const utcHtml = renderInTimezone("UTC", FullCalendar);
    const shanghaiHtml = renderInTimezone("Asia/Shanghai", FullCalendar);

    assert.equal(shanghaiHtml, utcHtml);
  });
});

test("FullCalendar 显式日期的 SSR 首屏保持跨时区一致", () => {
  withFixedDate(() => {
    const props = { year: 2026, month: 6, day: 31 };
    const utcHtml = renderInTimezone("UTC", FullCalendar, props);
    const shanghaiHtml = renderInTimezone("Asia/Shanghai", FullCalendar, props);

    assert.equal(shanghaiHtml, utcHtml);
    assert.match(utcHtml, /7月 2026/);
  });
});

test("FullCalendar 挂载后切换到用户本地今天", async () => {
  const originalTimezone = process.env.TZ;
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  try {
    process.env.TZ = "Asia/Shanghai";
    await withFixedDateAsync(async () => {
      await act(async () => {
        root.render(createElement(FullCalendar, { view: "day" }));
      });

      assert.match(container.textContent ?? "", /1 8月 2026/);
    });
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
  }
});

test("FullCalendar 挂载后保留显式 year month day", async () => {
  const originalTimezone = process.env.TZ;
  const dom = installDom();
  const container = document.querySelector<HTMLDivElement>("#root");
  assert.ok(container);
  const root = createRoot(container);

  try {
    process.env.TZ = "Asia/Shanghai";
    await withFixedDateAsync(async () => {
      await act(async () => {
        root.render(createElement(FullCalendar, {
          view: "day",
          year: 2030,
          month: 2,
          day: 15,
        }));
      });

      assert.match(container.textContent ?? "", /15 3月 2030/);
      assert.doesNotMatch(container.textContent ?? "", /1 8月 2026/);
    });
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
  }
});
