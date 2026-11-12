import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Block, Code } from "../_chrome";

export const metadata = pageMetadata("/en/frontend-design-skill");

const install = `# Skill + MCP for every agent found on this machine
curl -fsSL https://www.forgeui.org/setup.sh | bash

# Only this project, plus a DESIGN.md
curl -fsSL https://www.forgeui.org/setup.sh | bash -s -- --scope project --design

# More: --client claude|cursor|codex|all  --mode skill|mcp|both  --dry-run  --check`;

const prompt = `Build an orders page: search and a status filter on top, a table with
order number, customer, amount, status and order time, and bulk export
for selected rows.`;

const tree = `forge-skill/
├── SKILL.md          # workflow and hard rules: page role → template → blocks → components → check
├── scripts/          # list, get-component, get-case, get-template, project-info …
└── references/       # 20+ guides loaded only when needed
    ├── page-patterns.md          # list, detail, form, dashboard …
    ├── component-selection/      # which component for which job
    ├── tokens.md                 # colors, text hierarchy, dark mode
    ├── status-presentation.md    # how to show states
    ├── overlay-focus.md          # dialogs, drawers, focus and Escape
    └── audit-checklist.md        # what to verify before shipping`;

export default function FrontendDesignSkillPage() {
  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-12">
      <header className="flex flex-col gap-5">
        <h1 className="font-display text-4xl font-bold leading-tight tracking-fg text-fg-black">Frontend design skill for Claude Code, Codex and Cursor</h1>
        <p className="text-lg leading-8 text-fg-grey-900">
          The Forge skill teaches your coding agent how to build admin pages with Forge: which component fits each job, how to lay out lists, details and forms, how to show status and color — and how to check its own output before handing it back.
        </p>
      </header>

      <Block title="Install in one command">
        <p>
          The skill follows the open <a href="https://agentskills.io/home" target="_blank" rel="noreferrer" className="text-fg-blue underline underline-offset-4">Agent Skills format</a>. The script detects Claude Code, Cursor and Codex, installs the skill into each one&apos;s skills folder and connects the Forge MCP server. Re-running it updates the install; <code className="font-mono text-sm">--check</code> only reports.
        </p>
        <Code>{install}</Code>
      </Block>

      <Block title="What changes when it is installed">
        <p>We ran the same 20 admin tasks — order list, customer detail, KPI dashboard, settings, login, agent chat, task board, calendar and more — with Claude Code, once without and once with the skill and MCP. Both projects already had the Forge components installed.</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Pass rate: 90% → 100%. A task passes when the page exists, type-checks, uses Forge components, adds no other UI library, has no code-check errors and uses the expected components.</li>
          <li>Pages with zero code-check errors: 95% → 100%; warnings per page: 0.7 → 0.</li>
          <li>Typical differences: without the skill the calendar task hand-built a month grid and the app shell hard-coded a hex color; with it the agent used <code className="font-mono text-sm">FullCalendar</code> and the app shell had no hard-coded colors.</li>
          <li>Cost: about 50 extra seconds per task, spent reading rules and looking up component props.</li>
        </ul>
        <p>Tasks, scoring and raw results live in the <a href="https://github.com/forge-ui/forge/tree/main/evals" target="_blank" rel="noreferrer" className="text-fg-blue underline underline-offset-4">evals folder</a>, so you can rerun them.</p>
      </Block>

      <Block title="How to use it">
        <p>Nothing to invoke: describe the page and the agent loads the skill on its own.</p>
        <Code>{prompt}</Code>
        <p>The agent classifies the page as a list, looks up <code className="font-mono text-sm">DataTable</code>, <code className="font-mono text-sm">Toolbar</code> and <code className="font-mono text-sm">StatusBadge</code> through MCP, then runs the MCP <code className="font-mono text-sm">check_code</code> tool on what it wrote. Amounts come out right-aligned, IDs and dates left-aligned, statuses as soft badges — all from the rules, not from luck.</p>
      </Block>

      <Block title="What is inside">
        <p>The main file holds only the workflow and hard rules; details sit in reference files the agent reads on demand, and bulky component props come from MCP. That keeps the context small.</p>
        <Code>{tree}</Code>
      </Block>

      <Block title="Skill vs. MCP vs. code check">
        <ul className="ml-5 list-disc space-y-2">
          <li><strong className="text-fg-black">Skill</strong> — the rules and the workflow.</li>
          <li><strong className="text-fg-black">MCP server</strong> — search, component props, block and template source, design tokens and <code className="font-mono text-sm">check_code</code>. Read-only, no auth, Streamable HTTP at <code className="font-mono text-sm">https://www.forgeui.org/api/mcp</code>.</li>
          <li><strong className="text-fg-black">forge-check</strong> — a dependency-free script that flags hard-coded colors, hand-rolled tables and dialogs, empty handlers and <code className="font-mono text-sm">#</code> links. Run it locally or in CI: <code className="font-mono text-sm">curl -fsSL https://www.forgeui.org/forge-check.mjs -o forge-check.mjs</code>.</li>
        </ul>
      </Block>

      <Block title="FAQ">
        <h3 className="font-semibold text-fg-black">How is this different from Anthropic&apos;s frontend-design skill?</h3>
        <p>frontend-design pushes every interface toward a distinctive, memorable look — great for landing pages and prototypes. The Forge skill pushes every page toward the same system — what an admin app needs. Don&apos;t enable both for admin work.</p>
        <h3 className="font-semibold text-fg-black">Which agents are supported?</h3>
        <p>The installer handles Claude Code, Cursor and Codex. Any other agent that reads Agent Skills can use a copy of the <a href="https://github.com/forge-ui/forge/tree/main/skills/forge-skill" target="_blank" rel="noreferrer" className="text-fg-blue underline underline-offset-4">skills/forge-skill</a> folder; agents without skills can use the MCP server or <Link href="/llms.txt" className="text-fg-blue underline underline-offset-4">llms.txt</Link>.</p>
        <h3 className="font-semibold text-fg-black">Is the skill in English?</h3>
        <p>The rules are written in Chinese, with English component names and code. You can prompt in English; note that our published evaluation used Chinese prompts.</p>
      </Block>

      <p className="text-sm text-fg-grey-700">
        Next: <Link href="/en/admin-templates" className="text-fg-blue underline underline-offset-4">React admin templates</Link> · <Link href="/en/ai-chat-components" className="text-fg-blue underline underline-offset-4">AI chat components</Link>
      </p>
    </article>
  );
}
