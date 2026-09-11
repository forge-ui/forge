import assert from "node:assert/strict";
const nodeProtocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(`${nodeProtocol}test`);
import { act, createElement, createRef } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { Grid, GridItem, type GridProps, type GridItemProps } from "../src/components/layouts/grid";

function renderGrid(props: GridProps = {}, item: GridItemProps = {}) {
  const html = renderToStaticMarkup(createElement(Grid, props, createElement(GridItem, item, "content")));
  return new JSDOM(html).window.document;
}

test("Grid server renders div attributes and default full-width placement", () => {
  const doc = renderGrid({ id: "grid", "aria-label": "layout", className: "custom" }, { id: "item", tabIndex: 0 });
  const grid = doc.getElementById("grid")!;
  const item = doc.getElementById("item")!;
  assert.equal(grid.getAttribute("aria-label"), "layout");
  assert.ok(grid.classList.contains("custom"));
  assert.equal(grid.style.getPropertyValue("--forge-grid-columns-base"), "12");
  assert.equal(grid.style.getPropertyValue("--forge-grid-row-gap-base"), "16px");
  assert.equal(item.style.getPropertyValue("--forge-grid-start-base"), "1");
  assert.equal(item.style.getPropertyValue("--forge-grid-end-base"), "-1");
  assert.equal(item.tabIndex, 0);
});

test("responsive values inherit upward and axis gaps override only when specified", () => {
  const doc = renderGrid({ columns: { sm: 5, xl: 24 }, gap: { base: 8, lg: 32 }, rowGap: { md: 0 } });
  const grid = doc.querySelector("div")!;
  for (const [bp, cols, row, col] of [["base",12,8,8],["sm",5,8,8],["md",5,0,8],["lg",5,0,32],["xl",24,0,32],["2xl",24,0,32]]) {
    assert.equal(grid.style.getPropertyValue(`--forge-grid-columns-${bp}`), String(cols));
    assert.equal(grid.style.getPropertyValue(`--forge-grid-row-gap-${bp}`), `${row}px`);
    assert.equal(grid.style.getPropertyValue(`--forge-grid-column-gap-${bp}`), `${col}px`);
  }
});

test("full span ignores start, numeric span restores responsive start, auto resets it", () => {
  const doc = renderGrid({}, { span: { base: "full", md: 6, xl: "full" }, start: { base: 3, lg: "auto" } });
  const item = doc.querySelector<HTMLElement>(".forge-grid-item")!;
  assert.equal(item.style.getPropertyValue("--forge-grid-start-base"), "1");
  assert.equal(item.style.getPropertyValue("--forge-grid-start-md"), "3");
  assert.equal(item.style.getPropertyValue("--forge-grid-end-md"), "span 6");
  assert.equal(item.style.getPropertyValue("--forge-grid-start-lg"), "auto");
  assert.equal(item.style.getPropertyValue("--forge-grid-end-xl"), "-1");
});

test("nested grids and items reset their own responsive configuration", () => {
  const html = renderToStaticMarkup(<Grid columns={24} gap={48}><GridItem span={8} start={4}><Grid columns={3}><GridItem>nested</GridItem></Grid></GridItem></Grid>);
  const doc = new JSDOM(html).window.document;
  const nested = doc.querySelectorAll<HTMLElement>(".forge-grid")[1];
  const item = doc.querySelectorAll<HTMLElement>(".forge-grid-item")[1];
  for (const bp of ["base","sm","md","lg","xl","2xl"]) {
    assert.equal(nested.style.getPropertyValue(`--forge-grid-columns-${bp}`), "3");
    assert.equal(nested.style.getPropertyValue(`--forge-grid-row-gap-${bp}`), "16px");
    assert.equal(item.style.getPropertyValue(`--forge-grid-start-${bp}`), "1");
  }
});


test("Grid and GridItem forward refs and events without changing DOM order", async () => {
  const dom = new JSDOM("<div id='root'></div>");
  const globals = { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true };
  const previous = Object.fromEntries(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  Object.assign(globalThis, globals);
  const root = createRoot(dom.window.document.getElementById("root")!);
  const gridRef = createRef<HTMLDivElement>();
  const itemRef = createRef<HTMLDivElement>();
  let clicks = 0;
  try {
    await act(async () => root.render(<Grid ref={gridRef}>
      <GridItem ref={itemRef} onClick={() => clicks++} tabIndex={0}>First</GridItem>
      <GridItem>Second</GridItem>
    </Grid>));
    assert.equal(gridRef.current?.tagName, "DIV");
    assert.equal(itemRef.current?.parentElement, gridRef.current);
    assert.deepEqual(Array.from(gridRef.current!.children, el => el.textContent), ["First", "Second"]);
    await act(async () => itemRef.current!.click());
    assert.equal(clicks, 1);
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    for (const key of Object.keys(globals)) {
      const descriptor = previous[key];
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
