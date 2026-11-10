import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

const run = promisify(execFile);
const script = path.resolve("public/setup.sh");

async function withSite(callback) {
  const server = http.createServer((request, response) => {
    if (request.method === "POST" && request.url === "/api/mcp") return response.end('{"result":{"serverInfo":{"name":"forge"}}}');
    if (request.url === "/DESIGN.md") return response.end("---\nname: Forge UI\n---\n");
    if (request.url === "/install-skill.sh") return response.end('mkdir -p "$FORGE_SKILLS_DIR/forge-skill" && echo "# forge-skill" > "$FORGE_SKILLS_DIR/forge-skill/SKILL.md"\n');
    response.statusCode = 404; response.end();
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "forge-setup-"));
  const project = path.join(home, "project");
  fs.mkdirSync(project);
  const env = { ...process.env, HOME: home, FORGE_SITE: `http://127.0.0.1:${server.address().port}`, PATH: `/usr/bin:/bin:${path.dirname(process.execPath)}` };
  const setup = (...args) => run("bash", [script, ...args], { env, cwd: project });
  try { await callback({ home, project, setup }); } finally { server.close(); fs.rmSync(home, { recursive: true, force: true }); }
}

test("configures MCP for cursor and codex without touching other servers, then passes --check", () => withSite(async ({ home, setup }) => {
  fs.mkdirSync(path.join(home, ".cursor"));
  fs.writeFileSync(path.join(home, ".cursor/mcp.json"), JSON.stringify({ mcpServers: { other: { url: "https://example.com" } } }));
  await setup("--client", "cursor,codex", "--mode", "mcp");
  const cursor = JSON.parse(fs.readFileSync(path.join(home, ".cursor/mcp.json"), "utf8"));
  assert.ok(cursor.mcpServers.other);
  assert.match(cursor.mcpServers.forge.url, /\/api\/mcp$/);
  assert.match(fs.readFileSync(path.join(home, ".codex/config.toml"), "utf8"), /\[mcp_servers\.forge\]\nurl = ".+\/api\/mcp"/);
  await setup("--client", "cursor,codex", "--mode", "mcp");
  assert.equal(fs.readFileSync(path.join(home, ".codex/config.toml"), "utf8").match(/mcp_servers\.forge/g).length, 1);
  const { stdout } = await setup("--client", "cursor,codex", "--mode", "mcp", "--check");
  assert.match(stdout, /all good/);
}));

test("project scope installs skill, MCP and DESIGN.md; --check fails before setup", () => withSite(async ({ project, setup }) => {
  await assert.rejects(setup("--client", "claude", "--scope", "project", "--check"), error => /problem/.test(error.stdout));
  await setup("--client", "claude", "--scope", "project", "--design");
  assert.ok(fs.existsSync(path.join(project, ".claude/skills/forge-skill/SKILL.md")));
  assert.ok(JSON.parse(fs.readFileSync(path.join(project, ".mcp.json"), "utf8")).mcpServers.forge);
  assert.ok(fs.existsSync(path.join(project, "DESIGN.md")));
  assert.match(fs.readFileSync(path.join(project, "AGENTS.md"), "utf8"), /DESIGN\.md/);
  const { stdout } = await setup("--client", "claude", "--scope", "project", "--check");
  assert.match(stdout, /all good/);
}));

test("dry run changes nothing", () => withSite(async ({ home, project, setup }) => {
  const { stdout } = await setup("--client", "all", "--scope", "project", "--design", "--dry-run");
  assert.match(stdout, /dry run finished/);
  assert.deepEqual(fs.readdirSync(project), []);
  assert.ok(!fs.existsSync(path.join(home, ".codex")));
}));
