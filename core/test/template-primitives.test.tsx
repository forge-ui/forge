import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "../src/components/ui/button";
import { Panel } from "../src/components/ui/panel";
import { FileInput } from "../src/components/ui/forms/file-input";
import { InfoRow } from "../src/components/ui/info-row";
import { Modal } from "../src/components/ui/modal";

const protocol = "node:";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { test } = require(protocol + "test");

test("unstyled buttons preserve native content, attributes and exact class names", () => {
  const props = { type: "button" as const, className: "task-card-next", "aria-label": "查看任务" };
  const actual = new JSDOM(renderToStaticMarkup(<Button variant="unstyled" {...props}><span>任务</span></Button>));
  const expected = new JSDOM(renderToStaticMarkup(<button {...props}><span>任务</span></button>));
  assert.ok(actual.window.document.body.isEqualNode(expected.window.document.body));
  assert.match(renderToStaticMarkup(<Button variant="unstyled" disabled>任务</Button>), /disabled=""/);
});

test("custom panels preserve the original shell without wrappers or added styles", () => {
  const className = "rounded-card border border-fg-grey-200 bg-white p-6";
  assert.equal(renderToStaticMarkup(<Panel variant="custom" className={className}><p>内容</p></Panel>), renderToStaticMarkup(<div className={className}><p>内容</p></div>));
  assert.equal(renderToStaticMarkup(<Panel as="aside" variant="custom" className={className}><p>详情</p></Panel>), renderToStaticMarkup(<aside className={className}><p>详情</p></aside>));
});

test("file inputs preserve native selection and accessibility attributes", () => {
  const props = { hidden: true, multiple: true, accept: "image/*", "aria-label": "选择附件" };
  assert.equal(renderToStaticMarkup(<FileInput {...props} />), renderToStaticMarkup(<input {...props} type="file" />));
});

test("custom panels preserve link roots without adding a wrapper", () => {
  assert.equal(renderToStaticMarkup(<Panel variant="custom" asChild className="rounded-card"><a href="/templates">模板</a></Panel>), '<a href="/templates" class="rounded-card">模板</a>');
  assert.throws(() => renderToStaticMarkup(<Panel asChild><a href="https://example.invalid">模板</a></Panel>), /variant=custom/);
});

test("information rows retain unwrapped icons and readable value content", () => {
  const markup = renderToStaticMarkup(<InfoRow icon={<svg aria-hidden="true" />} label="联系人"><a href="/contact">客户</a></InfoRow>);
  assert.match(markup, /shrink-0 mt-0.5 text-fg-grey-700/);
  assert.match(markup, /联系人/);
  assert.match(markup, /<a href="\/contact">客户<\/a>/);
  assert.doesNotMatch(markup, /rounded-full/);
});

test("template modal retains heading, divider, width and accessible close control", () => {
  const markup = renderToStaticMarkup(<Modal variant="template" open onOpenChange={() => {}} title="编辑记录"><p>表单</p></Modal>);
  assert.match(markup, /forge-template-modal/);
  assert.match(markup, /w-\[560px\]/);
  assert.match(markup, /<h3[^>]*>编辑记录<\/h3>/);
  assert.match(markup, /aria-label="关闭弹窗"/);
  assert.match(markup, /h-px w-full bg-fg-grey-200 mt-6/);
  assert.equal(renderToStaticMarkup(<Modal variant="template" open={false} onOpenChange={() => {}} title="记录">内容</Modal>), "");
});
