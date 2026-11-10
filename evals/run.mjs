#!/usr/bin/env node
// Run the Forge page-generation eval: the same 20 tasks with and without Forge's agent tooling.
//
//   node evals/run.mjs --agent claude --conditions baseline,forge --tasks orders-list,login
//   node evals/run.mjs --report evals/results/<run>      # rebuild report.md from results.json
//
// Both conditions get a Next.js project with @forge-ui-official/core installed. "forge" additionally runs
// setup.sh (project scope: forge-skill, DESIGN.md, AGENTS.md pointer) and connects the Forge MCP server.

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scoreTask, typecheck } from "./score.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "..");
const tasks = JSON.parse(fs.readFileSync(path.join(here, "tasks.json"), "utf8"));
const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, arg, index, all) => (arg.startsWith("--") ? [...pairs, [arg.slice(2), all[index + 1]?.startsWith("--") ? true : all[index + 1] ?? true]] : pairs), []));
const SITE = args.site ?? "https://forgeui.org";
const MCP_URL = `${SITE}/api/mcp`;

const agents = {
  claude: {
    client: "claude",
    command: (prompt, condition) => ["claude", ["-p", prompt, "--permission-mode", "acceptEdits", "--strict-mcp-config", "--allowedTools", "Read,Write,Edit,Glob,Grep,Bash(pnpm typecheck),Bash(node_modules/.bin/tsc:*)" + (condition === "forge" ? ",mcp__forge" : ""), ...(condition === "forge" ? ["--mcp-config", ".mcp.json"] : [])]],
    leakedSkill: path.join(os.homedir(), ".claude/skills/forge-skill"),
  },
  codex: {
    client: "codex",
    command: (prompt, condition, cwd) => ["codex", ["exec", "--full-auto", "-C", cwd, ...(condition === "forge" ? ["-c", `mcp_servers.forge.url="${MCP_URL}"`] : []), prompt]],
    leakedSkill: path.join(os.homedir(), ".codex/skills/forge-skill"),
  },
};

function prompt(task) {
  return [
    `在这个 Next.js 项目里新建页面 app/${task.id}/page.tsx（需要的话可以在 app/${task.id}/ 下加其他文件）。`,
    `需求：${task.prompt}`,
    "项目已经安装 @forge-ui-official/core。用示例数据即可，不需要接口。",
    "只改 app/" + task.id + "/ 目录。完成后运行 pnpm typecheck，修到没有错误为止。",
  ].join("\n");
}

function prepareBase() {
  // Outside the repo so pnpm does not treat it as a workspace package.
  const base = path.join(os.homedir(), ".cache/forge-evals/base");
  if (!fs.existsSync(path.join(base, "node_modules/@forge-ui-official/core"))) {
    fs.rmSync(base, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(base), { recursive: true });
    fs.cpSync(path.join(here, "fixture"), base, { recursive: true });
    execFileSync("pnpm", ["install", "--no-frozen-lockfile", "--ignore-workspace"], { cwd: base, stdio: "inherit" });
  }
  return base;
}

function workspaceFor(base, out, condition, task) {
  const dir = path.join(out, condition, task.id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.cpSync(path.join(here, "fixture"), dir, { recursive: true });
  fs.symlinkSync(path.join(base, "node_modules"), path.join(dir, "node_modules"));
  if (condition === "forge") {
    const mode = agents[args.agent].client === "codex" ? "skill" : "both";
    execFileSync("bash", [path.join(repo, "public/setup.sh"), "--client", agents[args.agent].client, "--mode", mode, "--scope", "project", "--design"], { cwd: dir, stdio: "pipe", env: { ...process.env, FORGE_SITE: SITE } });
  }
  return dir;
}

function summarize(results) {
  const conditions = [...new Set(results.map(item => item.condition))];
  const rows = conditions.map(condition => {
    const items = results.filter(item => item.condition === condition);
    const rate = key => Math.round((items.filter(item => item.criteria[key]).length / items.length) * 100);
    return { condition, tasks: items.length, pass: Math.round((items.filter(item => item.pass).length / items.length) * 100), score: Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length), compiles: rate("compiles"), usesCore: rate("usesCore"), checkClean: rate("checkClean"), expectedComponents: rate("expectedComponents"), minutes: Math.round(items.reduce((sum, item) => sum + item.seconds, 0) / 60) };
  });
  const lines = [
    `# Forge 页面生成评测`,
    "",
    `- 编码助手：${results[0]?.agent ?? "-"}；Forge core：${results[0]?.coreVersion ?? "-"}；日期：${results[0]?.date ?? "-"}`,
    "- baseline：项目已装 @forge-ui-official/core，没有 Forge 的 Skill、MCP 和 DESIGN.md；forge：额外运行 setup.sh 并接入 MCP。",
    "- 合格 = 页面存在、类型检查通过、从 core 引入组件、没有引入其他 UI 库、forge-check 无错误、用到任务要求的组件，六项全部通过。",
    "",
    "| 条件 | 题数 | 合格率 | 平均分 | 编译通过 | 用 core 组件 | 检查无错误 | 用对组件 | 耗时（分钟） |",
    "|---|---|---|---|---|---|---|---|---|",
    ...rows.map(row => `| ${row.condition} | ${row.tasks} | ${row.pass}% | ${row.score} | ${row.compiles}% | ${row.usesCore}% | ${row.checkClean}% | ${row.expectedComponents}% | ${row.minutes} |`),
    "",
    "| 任务 | " + conditions.join(" | ") + " |",
    "|---|" + conditions.map(() => "---").join("|") + "|",
    ...tasks.filter(task => results.some(item => item.task === task.id)).map(task => `| ${task.id} | ` + conditions.map(condition => {
      const item = results.find(result => result.task === task.id && result.condition === condition);
      if (!item) return "-";
      const failed = Object.entries(item.criteria).filter(([, ok]) => !ok).map(([key]) => key);
      return item.pass ? "合格" : `${item.score}（${failed.join("、")}）`;
    }).join(" | ") + " |"),
  ];
  return lines.join("\n") + "\n";
}

if (args.report) {
  const results = JSON.parse(fs.readFileSync(path.join(args.report, "results.json"), "utf8"));
  fs.writeFileSync(path.join(args.report, "report.md"), summarize(results));
  console.log(summarize(results));
  process.exit(0);
}

if (!agents[args.agent]) {
  console.error("Usage: node evals/run.mjs --agent claude|codex [--conditions baseline,forge] [--tasks id,id] [--out dir] [--site url]");
  process.exit(1);
}
if (fs.existsSync(agents[args.agent].leakedSkill) && !args["allow-global-skill"]) {
  console.error(`检测到全局安装的 forge-skill：${agents[args.agent].leakedSkill}。baseline 会读到它，结果不可信。请先移走，或加 --allow-global-skill。`);
  process.exit(1);
}

const conditions = String(args.conditions ?? "baseline,forge").split(",");
const selected = args.tasks ? tasks.filter(task => String(args.tasks).split(",").includes(task.id)) : tasks;
const out = path.resolve(args.out ?? path.join(here, "results", new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-")));
const base = prepareBase();
const coreVersion = JSON.parse(fs.readFileSync(path.join(base, "node_modules/@forge-ui-official/core/package.json"), "utf8")).version;
fs.mkdirSync(out, { recursive: true });
const results = [];
for (const condition of conditions) {
  for (const task of selected) {
    const cwd = workspaceFor(base, out, condition, task);
    const [bin, argv] = agents[args.agent].command(prompt(task), condition, cwd);
    const started = Date.now();
    const run = spawnSync(bin, argv, { cwd, encoding: "utf8", timeout: Number(args.timeout ?? 900) * 1000, maxBuffer: 64 * 1024 * 1024 });
    fs.writeFileSync(path.join(cwd, "agent.log"), (run.stdout ?? "") + "\n--- stderr ---\n" + (run.stderr ?? ""));
    const result = { agent: args.agent, condition, coreVersion, date: new Date().toISOString().slice(0, 10), seconds: Math.round((Date.now() - started) / 1000), exitCode: run.status, ...scoreTask(cwd, task.id, typecheck(cwd)) };
    results.push(result);
    fs.writeFileSync(path.join(out, "results.json"), JSON.stringify(results, null, 2));
    console.log(`${condition} ${task.id}: ${result.pass ? "合格" : result.score} (${result.seconds}s)`);
  }
}
fs.writeFileSync(path.join(out, "report.md"), summarize(results));
console.log("\n" + summarize(results));
