// Score one generated page against Forge rules. Used by run.mjs; can also be run on a finished workspace:
//   node evals/score.mjs <workspace> <taskId>
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkCode } from "../public/forge-check.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const tasks = JSON.parse(fs.readFileSync(path.join(here, "tasks.json"), "utf8"));

function sources(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? sources(full) : /\.(tsx|ts)$/.test(entry.name) ? [full] : [];
  });
}

export function typecheck(workspace) {
  const tsc = path.join(workspace, "node_modules/.bin/tsc");
  if (!fs.existsSync(tsc)) return { ok: false, errors: [], missing: true };
  try {
    execFileSync(tsc, ["--noEmit", "-p", workspace], { cwd: workspace, stdio: "pipe", encoding: "utf8" });
    return { ok: true, errors: [] };
  } catch (error) {
    return { ok: false, errors: String(error.stdout ?? "").split("\n").filter(line => /error TS/.test(line)).slice(0, 20) };
  }
}

export function scoreTask(workspace, taskId, compiled = typecheck(workspace)) {
  const task = tasks.find(item => item.id === taskId);
  if (!task) throw new Error("Unknown task: " + taskId);
  const dir = path.join(workspace, "app", taskId);
  const files = sources(dir);
  const code = files.map(file => fs.readFileSync(file, "utf8")).join("\n");
  const findings = files.flatMap(file => checkCode(fs.readFileSync(file, "utf8"), path.relative(workspace, file)).findings);
  const imported = new Set([...code.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']@forge-ui-official\/core["']/g)].flatMap(match => match[1].split(",").map(part => part.replace(/\btype\b/, "").trim().split(/\s+as\s+/)[0]).filter(Boolean)));
  const pageErrors = compiled.errors.filter(line => line.includes(`app/${taskId}/`));
  const criteria = {
    page: fs.existsSync(path.join(dir, "page.tsx")),
    // Only errors inside this task's folder count; a failed run with no parsed errors (or no tsc) counts as failing.
    compiles: compiled.ok || (compiled.errors.length > 0 && pageErrors.length === 0),
    usesCore: imported.size > 0,
    noForeignUi: !findings.some(item => item.rule === "foreign-ui-library"),
    checkClean: findings.filter(item => item.severity === "error").length === 0,
    expectedComponents: task.expect.every(group => group.some(name => imported.has(name))),
  };
  const passed = Object.values(criteria).filter(Boolean).length;
  return {
    task: taskId,
    criteria,
    score: Math.round((passed / Object.keys(criteria).length) * 100),
    pass: Object.values(criteria).every(Boolean),
    errors: findings.filter(item => item.severity === "error").map(item => `${item.file}:${item.line} ${item.rule}`),
    warnings: findings.filter(item => item.severity === "warning").length,
    typeErrors: pageErrors.slice(0, 5),
    imported: [...imported].sort(),
  };
}

if (process.argv[1] && import.meta.url.endsWith("/" + path.basename(process.argv[1]))) {
  const [workspace, taskId] = process.argv.slice(2);
  console.log(JSON.stringify(scoreTask(path.resolve(workspace), taskId), null, 2));
}
