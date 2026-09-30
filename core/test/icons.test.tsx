import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const nodeProtocol = "node:";
// Dynamic built-in name keeps the test bundle compatible with tsup's CJS output.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${nodeProtocol}test`);

import * as icons from "../src/icons";
import { BellBoldDuotone, MagniferLinear, PlusLinear } from "../src/icons";

test("Forge icon compatibility layer exposes the complete stable icon surface", () => {
  assert.equal(Object.keys(icons).length, 188);
  assert.ok(icons.StopBold);
  assert.ok(BellBoldDuotone);
  assert.ok(MagniferLinear);
  assert.ok(PlusLinear);
  for (const name of ["BoxLinear", "EyeClosedLinear", "FolderLinear", "HamburgerMenuBoldDuotone", "InfoCircleLinear", "ShieldKeyholeBoldDuotone", "ShieldUserBoldDuotone", "WidgetLinear", "CalendarBold", "LetterBold", "AddCircleBold", "UserPlusBold", "PenBold", "LockPasswordBold", "SettingsBold", "Logout2Bold", "CodeLinear", "CommandLinear", "HashtagLinear", "LightbulbLinear", "LinkLinear", "MicrophoneLinear", "QuitFullScreenLinear", "SidebarMinimalisticLinear", "StarsLinear", "FullScreenLinear"] as const) {
    const html = renderToStaticMarkup(createElement(icons[name], { size: 20, color: "#71717A" }));
    assert.match(html, /<svg/);
    assert.match(html, /width:20px/);
  }
});

test("Forge icons preserve size, color, accessibility, and inline defaults", () => {
  const html = renderToStaticMarkup(
    createElement(BellBoldDuotone, {
      "aria-label": "通知",
      color: "#7C3AED",
      size: 24,
    }),
  );

  assert.match(html, /<svg[^>]+aria-label="通知"/);
  assert.match(html, /width:24px/);
  assert.match(html, /height:24px/);
  assert.match(html, /color:#7C3AED/);
  assert.match(html, /display:inline-block/);
});

test("Forge icons default to the legacy 16px currentColor contract", () => {
  const html = renderToStaticMarkup(createElement(MagniferLinear));

  assert.match(html, /width:16px/);
  assert.match(html, /height:16px/);
  assert.match(html, /color:currentColor/);
});


test("every public icon renders original Solar artwork", () => {
  for (const [name, Icon] of Object.entries(icons)) {
    const html = renderToStaticMarkup(createElement(Icon, { size: 20 }));
    assert.match(html, /class="solar solar-/, name);
    assert.match(html, /viewBox="0 0 24 24"/, name);
    assert.match(html, /<(path|circle|rect|ellipse)/, name);
  }
});

test("sidebar calendar and mail retain distinct Solar artwork and accessible labels", () => {
  const calendar = renderToStaticMarkup(createElement(icons.CalendarBold, { "aria-label": "日历" }));
  const mail = renderToStaticMarkup(createElement(icons.LetterBold, { "aria-label": "邮箱" }));
  assert.match(calendar, /solar-calendar-bold/);
  assert.match(mail, /solar-letter-bold/);
  assert.match(calendar, /aria-label="日历"/);
  assert.match(mail, /aria-label="邮箱"/);
  assert.doesNotMatch(calendar + mail, /aria-hidden="true"/);
});
