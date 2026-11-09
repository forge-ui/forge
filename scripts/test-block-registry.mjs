import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import ts from "typescript";
import { collectFiles, publicRoute } from "../skills/forge-skill/scripts/source-index.mjs";

const catalog = JSON.parse(fs.readFileSync("blocks/registry.json", "utf8"));
const screenRoutes = collectFiles(process.cwd(), "src/app/templates").filter(file => file.endsWith("/page.tsx")).map(file => publicRoute(file, "templates")).filter(route => route !== null).map(route => new RegExp(`^/templates/${route.replace(/\[[^\]]+\]/g, "[^/]+")}$`.replace(/\/$/, "")));
const isScreenRoute = href => screenRoutes.some(route => route.test(href));

test("registry generation is deterministic and every catalog item can be copied independently", () => {
  execFileSync(process.execPath, ["scripts/generate-block-registry.mjs", "--check"]);
  assert.ok(catalog.some(item => item.name === "crm-summary"));
  const index = JSON.parse(fs.readFileSync("public/r/index.json", "utf8"));
  assert.equal(new Set(index.items.map(item => item.name)).size, catalog.length);
  for (const entry of catalog) {
    const item = JSON.parse(fs.readFileSync(`public/r/${entry.name}.json`, "utf8"));
    assert.deepEqual(index.items.find(candidate => candidate.name === item.name), item);
    assert.equal(item.type, "registry:block");
    assert.ok(["看板首屏", "AI 与智能体", "数据列表", "详情页", "表单", "协作与项目", "财务", "设置", "图表与指标", "页面结构", "认证"].includes(entry.category));
    assert.equal(item.meta.category, entry.category);
    assert.doesNotMatch(JSON.stringify(item.meta.props), /\/Users\/|\/private\/|import\("\//);
    assert.ok(item.meta.screens.length > 0, `${entry.name} has no related Screen`);
    for (const screen of item.meta.screens) {
      assert.match(screen.href, /^\/templates\//);
      assert.ok(screen.title);
      assert.ok(isScreenRoute(screen.href), `${entry.name}: missing Screen ${screen.href}`);
    }
    assert.deepEqual(item.dependencies, ["@forge-ui-official/core@^" + JSON.parse(fs.readFileSync("core/package.json", "utf8")).version]);
    assert.equal(item.files.length, 1);
    const file = item.files[0];
    assert.ok(item.meta.example.includes(entry.component));
    assert.ok(item.meta.props.some(props => props.component === entry.component));
    assert.equal(item.meta.core.version, item.dependencies[0].split("@").at(-1));
    assert.equal(file.type, "registry:component");
    assert.equal(file.target, `@components/blocks/${entry.name}.tsx`);
    assert.equal(file.content, fs.readFileSync(file.path, "utf8"));
    const source = ts.createSourceFile(file.target, file.content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    for (const statement of source.statements.filter(ts.isImportDeclaration)) {
      assert.ok(["react", "@forge-ui-official/core", "@forge-ui-official/core/icons"].includes(statement.moduleSpecifier.text), `${entry.name} uses a private dependency`);
    }
    assert.doesNotMatch(file.content, /#[\da-f]{3,8}\b|(?:bg|text|border)-(?:blue|purple|gray|slate)-\d|!important/);
  }
});

test("business page components are independently installable and indexed by category", () => {
  for (const name of ["overview-dashboard", "orders-table-section", "project-overview", "finance-overview"]) {
    const entry = catalog.find(item => item.name === name);
    assert.ok(["看板首屏", "数据列表"].includes(entry.category));
    const item = JSON.parse(fs.readFileSync(`public/r/${name}.json`, "utf8"));
    assert.match(item.files[0].content, /Props/);
    assert.ok(item.meta.example.includes(entry.component));
  }
  const search = JSON.parse(fs.readFileSync("src/app/_components/search-index.json", "utf8"));
  for (const entry of catalog) {
    const matches = search.filter(item => item.id === `/blocks/${entry.name}`);
    assert.equal(matches.length, 1);
    assert.ok(matches[0].keywords.includes(entry.category));
  }
});

test("all ten Screens use public core and copyable Blocks, without density overrides", () => {
  const root = "src/app/templates/(dashboards)/dashboards";
  const screens = fs.readdirSync(root).filter(name => fs.existsSync(`${root}/${name}/page.tsx`));
  assert.equal(screens.length, 10);
  for (const screen of screens) {
    const source = fs.readFileSync(`${root}/${screen}/page.tsx`, "utf8");
    assert.match(source, /<AppLayout/);
    assert.match(source, /@\/blocks\//);
    assert.doesNotMatch(source, /DashboardShell|Figma\w+|compact\w+Class|CardCarouselPreview|FinanceWalletPanel/);
    assert.doesNotMatch(source, /<div className="[^"]*rounded-3xl[^"]*bg-white[^"]*border-fg-grey-200[^"]*p-4[^"]*flex-col/);
  }
});


test("copied registry sources typecheck against built public declarations without site aliases", () => {
  fs.mkdirSync("tmp", { recursive: true });
  const directory = fs.mkdtempSync("tmp/blocks-consumer-");
  try {
    const files = catalog.map(({ name }) => {
      const item = JSON.parse(fs.readFileSync("public/r/" + name + ".json", "utf8"));
      const file = directory + "/" + name + ".tsx";
      fs.writeFileSync(file, item.files[0].content);
      const exampleFile = directory + "/" + name + "-example.tsx";
      fs.writeFileSync(exampleFile, item.meta.example.replace(`@/components/blocks/${name}`, `./${name}`));
      return [file, exampleFile];
    }).flat();
    const program = ts.createProgram(files, {
      strict: true, noEmit: true, skipLibCheck: true,
      jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
      esModuleInterop: true, baseUrl: process.cwd(),
      paths: { "@forge-ui-official/core": ["core/dist/index.d.ts"], "@forge-ui-official/core/icons": ["core/dist/icons/index.d.ts"] },
    });
    const diagnostics = ts.getPreEmitDiagnostics(program);
    assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, { getCurrentDirectory: () => process.cwd(), getCanonicalFileName: file => file, getNewLine: () => "\n" }));
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
